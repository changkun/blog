---
date: 2021-01-23T22:37:34+01:00
toc: true
id: 273
slug: /posts/pss-uss-rss
tags:
    - Go
    - 内存管理
    - 监控指标
title: "Are PSS/USS and RSS Actually the Same Thing?"
title_zh: "PSS/USS 和 RSS 其实是一回事，吗？"
---

{{% en %}}
Since Go 1.12, there have been a steady stream of false-alarm monitoring incidents. The root cause is that starting with Go 1.12, Go changed the memory reclamation strategy used in `madvise` system calls from `MADV_DONTNEED` to `MADV_FREE`.
Based on available documentation, RSS — the most commonly used memory monitoring metric — does not reflect the portion of memory that has been released by the process but not yet reclaimed by the OS.
This naturally leads to suggestions that RSS should be replaced with potentially more appropriate metrics such as PSS or even USS.
This raises some tricky questions: PSS and USS are far less commonly used than RSS, and documentation provides little explanation of what memory consumption they actually reflect. Are they really more suitable than RSS?

<!--more-->

## What Are RSS/PSS/USS?

To address the problem clearly, it always helps to start with definitions. This question yields an abundance of repeatedly copy-pasted explanations:

```
VSS, USS, PSS, and RSS are four indicators for measuring memory usage:

- VSS: Virtual Set Size, virtual memory footprint, including shared libraries.
- RSS: Resident Set Size, actual physical memory usage, including shared libraries.
- PSS: Proportion Set Size, the actual physical memory used, shared libraries, etc. are allocated proportionally.
- USS: Unique Set Size, the physical memory occupied by the process, does not calculate the memory usage of the shared library.
-
Generally we have VSS >= RSS >= PSS >= USS.
```

From these descriptions, the general impression is that USS is better than PSS, PSS is better than RSS, and VSS is essentially useless:
VSS reflects the virtual address space requested by the process but not yet released; RSS includes so-called shared libraries; PSS distributes the size of shared libraries proportionally across sharing processes; and USS simply does not count shared library memory at all.

Looking at these definitions, the difference between RSS, PSS, and USS lies entirely in shared libraries. But for statically linked programs like those written in Go, shared libraries are not common. A reasonable suspicion is that in most cases: RSS == PSS == USS.

## `MADV_DONTNEED` vs `MADV_FREE`

For memory management system calls on Linux, the kernel naturally records this information somewhere for inspection.
Taking Linux as an example, RSS is typically found in `/proc/[pid]/status`, and when a running application wants to query its own consumption, it can even use `/proc/self/status` to read its own consumption state directly — for example, `cat` reading itself:

```sh
$ cat /proc/self/status
Name:   cat
...
Pid:    3509083
...
VmPeak:    11676 kB
VmSize:    11676 kB
VmLck:         0 kB
VmPin:         0 kB
VmHWM:       596 kB
VmRSS:       596 kB
RssAnon:              68 kB
RssFile:             528 kB
RssShmem:              0 kB
```

The meaning of each variable can be found via the man page with `man proc`. For example, `VmRSS` refers to the RSS value, and `VmSize` is the VSS value, and so on. Of course, the content in `/proc/[pid]/status` is formatted for readability. For programmatic use, you can pull this information directly from the more concise `/proc/[pid]/stat` statistics file.
Using RSS as an example:

```go
var pageSize = syscall.Getpagesize()

// rss returns the resident set size of the current process, unit in MiB
func rss() int {
	data, err := ioutil.ReadFile("/proc/self/stat")
	if err != nil {
		log.Fatal(err)
	}
	fs := strings.Fields(string(data))
	rss, err := strconv.ParseInt(fs[23], 10, 64)
	if err != nil {
		log.Fatal(err)
	}
	return int(uintptr(rss) * uintptr(pageSize) / (1 << 20)) // MiB
}
```

For Linux memory management system calls, memory obtained via mmap with `PROT_READ` and `PROT_WRITE` will trigger page faults, but ultimately the OS will allocate that memory to the process. The difference between using `madvise` with the `MADV_DONTNEED` strategy to release memory versus using `MADV_FREE` can be measured directly with the `rss()` function above. For example:

```go
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"runtime"
	"strconv"
	"strings"
	"syscall"
)

/*
#include <sys/mman.h> // for C.MADV_FREE
*/
import "C"

func main() {
	useDontneed := flag.Bool("dontneed", false, "use MADV_DONTNEED instead of MADV_FREE")
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "usage: %s [flags] anon-MiB\n", os.Args[0])
		flag.PrintDefaults()
		os.Exit(2)
	}
	flag.Parse()
	if flag.NArg() != 1 {
		flag.Usage()
	}
	anonMB, err := strconv.Atoi(flag.Arg(0))
	if err != nil {
		flag.Usage()
	}

	// anonymous mapping
	m, err := syscall.Mmap(-1, 0, anonMB<<20, syscall.PROT_READ|syscall.PROT_WRITE, syscall.MAP_PRIVATE|syscall.MAP_ANON)
	if err != nil {
		log.Fatal(err)
	}
	printStats("After anon mmap:", m)

	// page fault by accessing it
	for i := 0; i < len(m); i += pageSize {
		m[i] = 42
	}
	printStats("After anon fault:", m)

	// use different strategy
	if *useDontneed {
		err = syscall.Madvise(m, syscall.MADV_DONTNEED)
		if err != nil {
				log.Fatal(err)
		}
		printStats("After MADV_DONTNEED:", m)
	} else {
		err = syscall.Madvise(m, C.MADV_FREE)
		if err != nil {
				log.Fatal(err)
		}
		printStats("After MADV_FREE:", m)
	}
	runtime.KeepAlive(m)
}

func printStats(ident string, m []byte) {
	fmt.Print(ident, " ", rss(), " MiB RSS\n")
}
```

Assuming 10M is requested, you can see results like these:

```
$ go run main.go 10
After anon mmap: 2 MiB RSS
After anon fault: 13 MiB RSS
After MADV_FREE: 13 MiB RSS

$ go run main.go -dontneed 10
After anon mmap: 3 MiB RSS
After anon fault: 13 MiB RSS
After MADV_DONTNEED: 3 MiB RSS
```

The difference is clear: after `MADV_FREE` completes, RSS has not decreased, whereas the `MADV_DONTNEED` strategy returns all memory.

## PSS/USS vs RSS

So how do you actually get PSS/USS values? More detailed memory mapping information is recorded in `/proc/[pid]/smaps`, but computing it is somewhat involved since it is organized by individual mmap operations.
This does not prevent us from automating the retrieval process:

```go
type mmapStat struct {
	Size           uint64
	RSS            uint64
	PSS            uint64
	PrivateClean   uint64
	PrivateDirty   uint64
	PrivateHugetlb uint64
}

func getMmaps() (*[]mmapStat, error) {
	var ret []mmapStat
	contents, err := ioutil.ReadFile("/proc/self/smaps")
	if err != nil {
		return nil, err
	}
	lines := strings.Split(string(contents), "\n")
	// function of parsing a block
	getBlock := func(block []string) (mmapStat, error) {
		m := mmapStat{}
		for _, line := range block {
			if strings.Contains(line, "VmFlags") ||
				strings.Contains(line, "Name") {
				continue
			}
			field := strings.Split(line, ":")
			if len(field) < 2 {
				continue
			}
			v := strings.Trim(field[1], " kB") // remove last "kB"
			t, err := strconv.ParseUint(v, 10, 64)
			if err != nil {
				return m, err
			}
			switch field[0] {
			case "Size":
				m.Size = t
			case "Rss":
				m.RSS = t
			case "Pss":
				m.PSS = t
			case "Private_Clean":
				m.PrivateClean = t
			case "Private_Dirty":
				m.PrivateDirty = t
			case "Private_Hugetlb":
				m.PrivateHugetlb = t
			}
		}
		return m, nil
	}
	blocks := make([]string, 16)
	for _, line := range lines {
		if strings.HasSuffix(strings.Split(line, " ")[0], ":") == false {
			if len(blocks) > 0 {
				g, err := getBlock(blocks)
				if err != nil {
					return &ret, err
				}
				ret = append(ret, g)
			}
			blocks = make([]string, 16)
		} else {
			blocks = append(blocks, line)
		}
	}
	return &ret, nil
}

type smapsStat struct {
	VSS uint64 // bytes
	RSS uint64 // bytes
	PSS uint64 // bytes
	USS uint64 // bytes
}

func getSmaps() (*smapsStat, error) {
	mmaps, err := getMmaps()
	if err != nil {
		panic(err)
	}
	smaps := &smapsStat{}
	for _, mmap := range *mmaps {
		smaps.VSS += mmap.Size * 1014
		smaps.RSS += mmap.RSS * 1024
		smaps.PSS += mmap.PSS * 1024
		smaps.USS += mmap.PrivateDirty*1024 + mmap.PrivateClean*1024 + mmap.PrivateHugetlb*1024
	}
	return smaps, nil
}
```

It can ultimately be used like this:

```go
stat, err := getSmaps()
if err != nil {
	panic(err)
}
fmt.Printf("VSS: %d MiB, RSS: %d MiB, PSS: %d MiB, USS: %d MiB\n",
	stat.VSS/(1<<20), stat.RSS/(1<<20), stat.PSS/(1<<20), stat.USS/(1<<20))
```

Plugging this into the earlier program, it shows:

```sh
$ go run main.go 10 # MADV_FREE
After anon mmap: 2 MiB RSS
After anon fault: 13 MiB RSS
After MADV_FREE: 13 MiB RSS
VSS: 1048 MiB, RSS: 13 MiB, PSS: 12 MiB, USS: 12 MiB

$ go run main.go -dontneed 10
After anon mmap: 2 MiB RSS
After anon fault: 13 MiB RSS
After MADV_DONTNEED: 3 MiB RSS
After anon mmap: 2 MiB RSS
After anon fault: 13 MiB RSS
After MADV_DONTNEED: 3 MiB RSS
VSS: 1049 MiB, RSS: 3 MiB, PSS: 2 MiB, USS: 2 MiB
```

Yes, no difference. So what can you do for monitoring? Three approaches:

1. `GODEBUG=madvdontneed=1`, applicable for releases between 1.12 and 1.16
2. [`runtime.ReadMemStats`](https://golang.org/pkg/runtime/#MemStats) for periodic collection and reporting. Or use [expvar](https://golang.org/pkg/expvar/), or the standard [pprof](https://golang.org/pkg/net/http/pprof/) approach — though each of these significantly impacts runtime performance, since these queries require STW
3. Upgrade to Go 1.16

Of course, there is also a fourth option: don't monitor.

## Further Reading

- https://man7.org/linux/man-pages/man2/mmap.2.html
- https://man7.org/linux/man-pages/man2/madvise.2.html
- https://man7.org/linux/man-pages/man2/mincore.2.html
- https://man7.org/linux/man-pages/man5/procfs.5.html
- https://unix.stackexchange.com/questions/33381/getting-information-about-a-process-memory-usage-from-proc-pid-smaps
- https://golang.org/pkg/expvar/
- https://golang.org/pkg/runtime/#MemStats
- https://golang.org/pkg/net/http/pprof/

For those familiar with Linux system calls, you might also think of using the mincore system call to check the page fault state of pages. While this is technically a valid approach, it is not suitable for Go — user code does not know the addresses consumed by the process and cannot look up the pages. Even if it could, the cost would be prohibitively high. That said, if you really want to check, it is possible, but only for memory you have directly allocated via mmap:

```go
/*
#include <stdlib.h>
#include <unistd.h>
#include <sys/mman.h>
#include <stdint.h>
static int inCore(void *base, uint64_t length, uint64_t pages) {
	int count = 0;
	unsigned char *vec = malloc(pages);
	if (vec == NULL)
		return -1;
	if (mincore(base, length, vec) < 0)
		return -1;
	for (int i = 0; i < pages; i++)
		if (vec[i] != 0)
			count++;
	free(vec);
	return count;
}
*/
import "C"

func inCore(b []byte) int {
	n, err := C.inCore(unsafe.Pointer(&b[0]), C.uint64_t(len(b)), C.uint64_t(len(b)/pageSize))
	if n < 0 {
		log.Fatal(err)
	}
	return int(uintptr(n) * uintptr(pageSize) / (1 << 20)) // MiB
}
```
{{% /en %}}

{{% zh %}}
从 Go 1.12 开始就不断有人踩到监控误报的坑，原因是 Go 从 1.12 开始将 `madvise` 系统调用
使用的内存回收策略从 `MADV_DONTNEED` 改为了 `MADV_FREE`。
从可查的一些文档来看，RSS 作为最常用的内存监控指标，不会反映进程中未被操作系统回收的那部分内存。
自然就会有一些说法建议将 RSS 更换为可能更妥当的指标，比如 PSS 甚至 USS。
这就导致了一些比较 tricky 的问题，PSS 和 USS 并不如 RSS 常用，文档上也没有更多的说明它们
实际能够反应的内存消耗状况，它们真的比 RSS 更合适吗？

<!--more-->

## RSS/PSS/USS 是什么

为了把问题说明清楚，总是需要解释是什么的问题。这个问题总是能搜出来一大堆的反复被复制的解释：

```
VSS, USS, PSS, and RSS are four indicators for measuring memory usage:

- VSS: Virtual Set Size, virtual memory footprint, including shared libraries.
- RSS: Resident Set Size, actual physical memory usage, including shared libraries.
- PSS: Proportion Set Size, the actual physical memory used, shared libraries, etc. are allocated proportionally.
- USS: Unique Set Size, the physical memory occupied by the process, does not calculate the memory usage of the shared library.
-
Generally we have VSS >= RSS >= PSS >= USS.
```

从这些描述上来看，给人的总体印象是 USS 比 PSS 更好，PSS 比 RSS 更好，VSS 基本上不能用：
因为 VSS 反应了当前进程申请且未归还的虚拟地址空间，RSS 包含了所谓共享库，PSS 将共享库的大小按
共享进程的比例进行了均摊，而 USS 直接没计算共享库的内存。

从这定义来看，无论是 RSS、PSS 还是 USS，它们的区别都只在共享库上，但对于像 Go 这种静态链接
来的程序，共享库并不那么常见。一个合理的怀疑就是大部分情况下：RSS == PSS == USS。

## `MADV_DONTNEED` vs `MADV_FREE`

内存消耗这类直接跟内核挂钩的功能，一个优秀的内核自然会将这些信息记录在某处供查阅。
以 Linux 为例，RSS 通常会放在 `/proc/[pid]/status` 中，而当运行应用想要查询自己的
消耗行为时，甚至可以用 `/prof/self/status` 来直接读取自己的消耗状态，比如 `cat` 它自己：

```sh
$ cat /proc/self/status
Name:   cat
...
Pid:    3509083
...
VmPeak:    11676 kB
VmSize:    11676 kB
VmLck:         0 kB
VmPin:         0 kB
VmHWM:       596 kB
VmRSS:       596 kB
RssAnon:              68 kB
RssFile:             528 kB
RssShmem:              0 kB
```

每个变量代表的含义可以通过 man page 查到 `man proc`，比如 `VmRSS` 就指代了 RSS 的值，
而 VmSize 就是 VSS 的值，等等。当然，在 `/proc/[pid]/status` 中的内容是美化过的，
真正做程序化的话可以直接从更简洁的 `/proc/[pid]/stat` 统计文件中拿到这些信息。
还是以 RSS 为例：

```go
var pageSize = syscall.Getpagesize()

// rss returns the resident set size of the current process, unit in MiB
func rss() int {
	data, err := ioutil.ReadFile("/proc/self/stat")
	if err != nil {
		log.Fatal(err)
	}
	fs := strings.Fields(string(data))
	rss, err := strconv.ParseInt(fs[23], 10, 64)
	if err != nil {
		log.Fatal(err)
	}
	return int(uintptr(rss) * uintptr(pageSize) / (1 << 20)) // MiB
}
```

对于 Linux 上进行内存管理的系统调用来说，mmap 加 `PROT_READ` 和 `PROT_WRITE`
得来的内存会发生缺页错误，但无论如何最终操作系统都会将这部分内存真正的分配出去给进程使用。
而使用 `madvise` 的 `MADV_DONTNEED` 策略来进行释放，和使用 `MADV_FREE` 两者的区别
就可以直接通过上面的 `rss()` 方法来度量。例如：

```go
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"runtime"
	"strconv"
	"strings"
	"syscall"
)

/*
#include <sys/mman.h> // for C.MADV_FREE
*/
import "C"

func main() {
	useDontneed := flag.Bool("dontneed", false, "use MADV_DONTNEED instead of MADV_FREE")
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "usage: %s [flags] anon-MiB\n", os.Args[0])
		flag.PrintDefaults()
		os.Exit(2)
	}
	flag.Parse()
	if flag.NArg() != 1 {
		flag.Usage()
	}
	anonMB, err := strconv.Atoi(flag.Arg(0))
	if err != nil {
		flag.Usage()
	}

	// anonymous mapping
	m, err := syscall.Mmap(-1, 0, anonMB<<20, syscall.PROT_READ|syscall.PROT_WRITE, syscall.MAP_PRIVATE|syscall.MAP_ANON)
	if err != nil {
		log.Fatal(err)
	}
	printStats("After anon mmap:", m)

	// page fault by accessing it
	for i := 0; i < len(m); i += pageSize {
		m[i] = 42
	}
	printStats("After anon fault:", m)

	// use different strategy
	if *useDontneed {
		err = syscall.Madvise(m, syscall.MADV_DONTNEED)
		if err != nil {
				log.Fatal(err)
		}
		printStats("After MADV_DONTNEED:", m)
	} else {
		err = syscall.Madvise(m, C.MADV_FREE)
		if err != nil {
				log.Fatal(err)
		}
		printStats("After MADV_FREE:", m)
	}
	runtime.KeepAlive(m)
}

func printStats(ident string, m []byte) {
	fmt.Print(ident, " ", rss(), " MiB RSS\n")
}
```

假设申请 10M，则可以看到这样的结果：

```
$ go run main.go 10
After anon mmap: 2 MiB RSS
After anon fault: 13 MiB RSS
After MADV_FREE: 13 MiB RSS

$ go run main.go -dontneed 10
After anon mmap: 3 MiB RSS
After anon fault: 13 MiB RSS
After MADV_DONTNEED: 3 MiB RSS
```

区别很明显，在 `MADV_FREE` 结束后，RSS 没有减少，而 `MADV_DONTNEED` 策略则全部归还。

## PSS/USS vs RSS

那怎么才能拿到 PSS/USS 的值呢？更为详细的内存映射信息其实被进一步的记录在了
`/proc/[pid]/smaps` 中，但计算上比较麻烦，因为它是按照不同的 mmap 操作进行记录的。
但这并不妨碍我们将这个获取过程自动化：

```go
type mmapStat struct {
	Size           uint64
	RSS            uint64
	PSS            uint64
	PrivateClean   uint64
	PrivateDirty   uint64
	PrivateHugetlb uint64
}

func getMmaps() (*[]mmapStat, error) {
	var ret []mmapStat
	contents, err := ioutil.ReadFile("/proc/self/smaps")
	if err != nil {
		return nil, err
	}
	lines := strings.Split(string(contents), "\n")
	// function of parsing a block
	getBlock := func(block []string) (mmapStat, error) {
		m := mmapStat{}
		for _, line := range block {
			if strings.Contains(line, "VmFlags") ||
				strings.Contains(line, "Name") {
				continue
			}
			field := strings.Split(line, ":")
			if len(field) < 2 {
				continue
			}
			v := strings.Trim(field[1], " kB") // remove last "kB"
			t, err := strconv.ParseUint(v, 10, 64)
			if err != nil {
				return m, err
			}
			switch field[0] {
			case "Size":
				m.Size = t
			case "Rss":
				m.RSS = t
			case "Pss":
				m.PSS = t
			case "Private_Clean":
				m.PrivateClean = t
			case "Private_Dirty":
				m.PrivateDirty = t
			case "Private_Hugetlb":
				m.PrivateHugetlb = t
			}
		}
		return m, nil
	}
	blocks := make([]string, 16)
	for _, line := range lines {
		if strings.HasSuffix(strings.Split(line, " ")[0], ":") == false {
			if len(blocks) > 0 {
				g, err := getBlock(blocks)
				if err != nil {
					return &ret, err
				}
				ret = append(ret, g)
			}
			blocks = make([]string, 16)
		} else {
			blocks = append(blocks, line)
		}
	}
	return &ret, nil
}

type smapsStat struct {
	VSS uint64 // bytes
	RSS uint64 // bytes
	PSS uint64 // bytes
	USS uint64 // bytes
}

func getSmaps() (*smapsStat, error) {
	mmaps, err := getMmaps()
	if err != nil {
		panic(err)
	}
	smaps := &smapsStat{}
	for _, mmap := range *mmaps {
		smaps.VSS += mmap.Size * 1014
		smaps.RSS += mmap.RSS * 1024
		smaps.PSS += mmap.PSS * 1024
		smaps.USS += mmap.PrivateDirty*1024 + mmap.PrivateClean*1024 + mmap.PrivateHugetlb*1024
	}
	return smaps, nil
}
```

最终可以这样使用：

```go
stat, err := getSmaps()
if err != nil {
	panic(err)
}
fmt.Printf("VSS: %d MiB, RSS: %d MiB, PSS: %d MiB, USS: %d MiB\n",
	stat.VSS/(1<<20), stat.RSS/(1<<20), stat.PSS/(1<<20), stat.USS/(1<<20))
```

嗯，把它用到前面的程序中去，表现为：

```sh
$ go run main.go 10 # MADV_FREE
After anon mmap: 2 MiB RSS
After anon fault: 13 MiB RSS
After MADV_FREE: 13 MiB RSS
VSS: 1048 MiB, RSS: 13 MiB, PSS: 12 MiB, USS: 12 MiB

$ go run main.go -dontneed 10
After anon mmap: 2 MiB RSS
After anon fault: 13 MiB RSS
After MADV_DONTNEED: 3 MiB RSS
After anon mmap: 2 MiB RSS
After anon fault: 13 MiB RSS
After MADV_DONTNEED: 3 MiB RSS
VSS: 1049 MiB, RSS: 3 MiB, PSS: 2 MiB, USS: 2 MiB
```

是的，没有区别。噢那要监控怎么办呢？三种手段：

1. `GODEBUG=madvdontneed=1`，针对 1.12 至 1.16 之间的发行版
2. [`runtime.ReadMemStats`](https://golang.org/pkg/runtime/#MemStats) 定期读取上报。或者使用 [expvar](https://golang.org/pkg/expvar/)，又或者标准的 [pprof](https://golang.org/pkg/net/http/pprof/) 手段，只不过每一种方式对运行时性能都是大打折扣，因为这些查询是需要 STW 的
3. 升级到 Go 1.16

当然，其实还有第四种手段，那就是：不监控。

## 进一步阅读的相关文档

- https://man7.org/linux/man-pages/man2/mmap.2.html
- https://man7.org/linux/man-pages/man2/madvise.2.html
- https://man7.org/linux/man-pages/man2/mincore.2.html
- https://man7.org/linux/man-pages/man5/procfs.5.html
- https://unix.stackexchange.com/questions/33381/getting-information-about-a-process-memory-usage-from-proc-pid-smaps
- https://golang.org/pkg/expvar/
- https://golang.org/pkg/runtime/#MemStats
- https://golang.org/pkg/net/http/pprof/

如果对 Linux 系统调用比较了解的话，可能我们还会想到用 mincore 系统调用来检查页的缺页状态，
这虽然是一种方法但不适合 Go，因为用户代码并不知道进程消耗的地址，更查不到页。
即便能查到，但也成本极高。尽管如此，整的想查还是可以做，但前提是查询那些自己通过 mmap 申请来的内存：

```go
/*
#include <stdlib.h>
#include <unistd.h>
#include <sys/mman.h>
#include <stdint.h>
static int inCore(void *base, uint64_t length, uint64_t pages) {
	int count = 0;
	unsigned char *vec = malloc(pages);
	if (vec == NULL)
		return -1;
	if (mincore(base, length, vec) < 0)
		return -1;
	for (int i = 0; i < pages; i++)
		if (vec[i] != 0)
			count++;
	free(vec);
	return count;
}
*/
import "C"

func inCore(b []byte) int {
	n, err := C.inCore(unsafe.Pointer(&b[0]), C.uint64_t(len(b)), C.uint64_t(len(b)/pageSize))
	if n < 0 {
		log.Fatal(err)
	}
	return int(uintptr(n) * uintptr(pageSize) / (1 << 20)) // MiB
}
```
{{% /zh %}}
