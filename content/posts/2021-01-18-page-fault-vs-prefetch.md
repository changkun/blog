---
date: 2021-01-18T10:14:43+01:00
toc: true
id: 272
slug: /posts/page-fault-vs-prefetch
tags:
    - Linux
    - Go
    - 内存管理
title: 缺页与预取带来的性能差异
---

缺页错误产生的性能差异究竟能够有多大？不妨做一个基准测试。

<!--more-->

想要实现这样的基准测试，需要了解 Linux 下对内存管理的两个底层的系统调用：`mmap` 和 `madvise`。
对于内存分配场景，mmap 可以使用匿名、私有映射两个参数 `MAP_ANON` 和 `MAP_PRIVATE`，
这时候创建的内存实际上属于缺页状态，任何对其申请到内存区域的访问行为都将导致缺页，利用这一原理，
便可以用来测量缺页时访问内存的成本；而 madvise 能够用来给内核提供建议，提前对内存进行预取，
于是可以利用这一点，对 mmap 的来的内存执行预取操作，进而测量预取后访问内存的成本：

```go
package main_test

import (
	"fmt"
	"syscall"
	"testing"
)

var pageSize = syscall.Getpagesize()

func BenchmarkPrefetch(b *testing.B) {
	for i := 1; i <= 1024; i *= 2 {
		benchMem(b, i, true)
	}
}

func BenchmarkPageFault(b *testing.B) {
	for i := 1; i <= 1024; i *= 2 {
		benchMem(b, i, false)
	}
}

func benchMem(b *testing.B, allocMB int, prefetch bool) {
	b.Run(fmt.Sprintf("%dMiB", allocMB), func(b *testing.B) {
		for j := 0; j < b.N; j++ {
			b.StopTimer()
			anonMB := allocMB << 20 // MiB
			m, err := syscall.Mmap(-1, 0, anonMB,
				syscall.PROT_READ|syscall.PROT_WRITE,
				syscall.MAP_ANON|syscall.MAP_PRIVATE)
			if err != nil {
				panic(err)
			}
			if prefetch {
				err = syscall.Madvise(m, syscall.MADV_HUGEPAGE)
				if err != nil {
					panic(err)
				}
			}
			b.StartTimer()
			// 逐页访问，用来测量写入成本
			for i := 0; i < len(m); i += pageSize {
				m[i] = 42
			}
			b.StopTimer()
			err = syscall.Madvise(m, syscall.MADV_DONTNEED)
			if err != nil {
				panic(err)
			}
		}
	})
}
```

使用 [bench](https://golang.design/s/bench) 工具，可以运行得到下面的结果：

```
$ uname -a
Linux changkun-perflock 5.8.0-34-generic #37~20.04.2-Ubuntu SMP Thu Dec 17 14:53:00 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux

$ bench
name                  time/op
Prefetch/1MiB-16        156µs ±0%
Prefetch/2MiB-16        315µs ±1%
Prefetch/4MiB-16        403µs ±1%
Prefetch/8MiB-16        581µs ±2%
Prefetch/16MiB-16      1000µs ±2%
Prefetch/32MiB-16      2170µs ±3%
Prefetch/64MiB-16      4450µs ±3%
Prefetch/128MiB-16     8920µs ±3%
Prefetch/256MiB-16    18200µs ±1%
Prefetch/512MiB-16    36600µs ±1%
Prefetch/1024MiB-16   72200µs ±4%
PageFault/1MiB-16       157µs ±1%
PageFault/2MiB-16       315µs ±1%
PageFault/4MiB-16       638µs ±1%
PageFault/8MiB-16      1310µs ±1%
PageFault/16MiB-16     2760µs ±1%
PageFault/32MiB-16     5940µs ±1%
PageFault/64MiB-16    12100µs ±0%
PageFault/128MiB-16   23900µs ±1%
PageFault/256MiB-16   47400µs ±1%
PageFault/512MiB-16   94100µs ±0%
PageFault/1024MiB-16 187000µs ±1%
```

可以看到随着分配内存的增大，预取带来的性能提升是非常客观的：

![](/images/posts/272/bench.png)


值得一提的是这里使用的是 `MADV_DONTNEED` 参数来释放内存。对于另一种释放模式 `MADV_FREE` 而言，因为其本质是懒惰释放，使用这个参数宣告释放的内存不会立刻进入缺页状态，进而对后续的内存操作可能带来影响，原则上应该会带来一定的性能提升。那么，但根据同样可以简单的验证换用 `MADV_FREE` 参数后带来的影响：

```go
// main.go
package main

/*
#include <sys/mman.h>
*/
import "C"

var MADV_FREE = C.MADV_FREE // 获得 MADV_FREE 参数

func main() {}

// main_test.go
package main

import (
	"fmt"
	"syscall"
	"testing"
)

var pageSize = syscall.Getpagesize()

func BenchmarkPrefetch(b *testing.B) {
	for i := 1; i <= 1024; i *= 2 {
		benchMem(b, i, true, true)
	}
	for i := 1; i <= 1024; i *= 2 {
		benchMem(b, i, true, false)
	}
}

func BenchmarkPageFault(b *testing.B) {
	for i := 1; i <= 1024; i *= 2 {
		benchMem(b, i, false, true)
	}
	for i := 1; i <= 1024; i *= 2 {
		benchMem(b, i, false, false)
	}
}

func benchMem(b *testing.B, allocMB int, prefetch bool, dontneed bool) {
	var s string
	if dontneed {
		s = fmt.Sprintf("MADV-DONTNEED-%dMiB", allocMB)
	} else {
		s = fmt.Sprintf("MADV-FREE-%dMiB", allocMB)
	}
	b.Run(s, func(b *testing.B) {
		for j := 0; j < b.N; j++ {
			b.StopTimer()
			anonMB := allocMB << 20 // MiB
			m, err := syscall.Mmap(-1, 0, anonMB, syscall.PROT_READ|syscall.PROT_WRITE, syscall.MAP_ANON|syscall.MAP_PRIVATE)
			if err != nil {
				panic(err)
			}
			if prefetch {
				err = syscall.Madvise(m, syscall.MADV_HUGEPAGE)
				if err != nil {
					panic(err)
				}
			}
			b.StartTimer()
			for i := 0; i < len(m); i += pageSize {
				m[i] = 42
			}
			b.StopTimer()
			if dontneed {
				err = syscall.Madvise(m, syscall.MADV_DONTNEED)
				if err != nil {
					panic(err)
				}
			} else {
				err = syscall.Madvise(m, MADV_FREE)
				if err != nil {
					panic(err)
				}
			}
		}
	})
}
```

同样的可以得到下面的结果：

```
name                                time/op
Prefetch/MADV-DONTNEED-1MiB-16        157µs ±1%
Prefetch/MADV-DONTNEED-2MiB-16       180µs ±77%
Prefetch/MADV-DONTNEED-4MiB-16        172µs ±1%
Prefetch/MADV-DONTNEED-8MiB-16        351µs ±5%
Prefetch/MADV-DONTNEED-16MiB-16       753µs ±4%
Prefetch/MADV-DONTNEED-32MiB-16      1.91ms ±3%
Prefetch/MADV-DONTNEED-64MiB-16      4.22ms ±3%
Prefetch/MADV-DONTNEED-128MiB-16     8.65ms ±4%
Prefetch/MADV-DONTNEED-256MiB-16     17.7ms ±3%
Prefetch/MADV-DONTNEED-512MiB-16     35.7ms ±2%
Prefetch/MADV-FREE-1MiB-16            189µs ±4%
Prefetch/MADV-FREE-2MiB-16            391µs ±4%
Prefetch/MADV-FREE-4MiB-16          1.64ms ±19%
Prefetch/MADV-FREE-8MiB-16          2.84ms ±31%
Prefetch/MADV-FREE-16MiB-16          3.32ms ±8%
Prefetch/MADV-FREE-32MiB-16          6.30ms ±1%
Prefetch/MADV-FREE-64MiB-16          12.7ms ±1%
Prefetch/MADV-FREE-128MiB-16         25.1ms ±2%
Prefetch/MADV-FREE-256MiB-16         50.7ms ±2%
Prefetch/MADV-FREE-512MiB-16          101ms ±1%
PageFault/MADV-DONTNEED-1MiB-16       157µs ±0%
PageFault/MADV-DONTNEED-2MiB-16       317µs ±1%
PageFault/MADV-DONTNEED-4MiB-16       645µs ±1%
PageFault/MADV-DONTNEED-8MiB-16      1.31ms ±1%
PageFault/MADV-DONTNEED-16MiB-16     2.77ms ±1%
PageFault/MADV-DONTNEED-32MiB-16     5.92ms ±0%
PageFault/MADV-DONTNEED-64MiB-16     12.4ms ±0%
PageFault/MADV-DONTNEED-128MiB-16    25.2ms ±0%
PageFault/MADV-DONTNEED-256MiB-16    50.7ms ±1%
PageFault/MADV-DONTNEED-512MiB-16     102ms ±0%
PageFault/MADV-FREE-1MiB-16           191µs ±2%
PageFault/MADV-FREE-2MiB-16           389µs ±3%
PageFault/MADV-FREE-4MiB-16           770µs ±1%
PageFault/MADV-FREE-8MiB-16          1.54ms ±1%
PageFault/MADV-FREE-16MiB-16         3.08ms ±1%
PageFault/MADV-FREE-32MiB-16         6.17ms ±2%
PageFault/MADV-FREE-64MiB-16         12.3ms ±2%
PageFault/MADV-FREE-128MiB-16        25.0ms ±2%
PageFault/MADV-FREE-256MiB-16        50.1ms ±3%
PageFault/MADV-FREE-512MiB-16         101ms ±1%
```

可以看到使用 `MADV_FREE` 缺页场景下并没有带来多大变化：

```
PageFault/MADV-DONTNEED-512MiB-16     102ms ±0%
PageFault/MADV-FREE-512MiB-16         101ms ±1%
```

相反，对于已经预取的情况下并没有 `MADV_FREE` 宣称的那样具有更好的性能，反而带来了更多的性能损耗：

```
Prefetch/MADV-DONTNEED-512MiB-16     35.7ms ±2%
Prefetch/MADV-FREE-512MiB-16          101ms ±1%
```

这就比较有有趣了。


## 进一步阅读的参考

- http://golang.design/s/bench
- https://man7.org/linux/man-pages/man2/mmap.2.html
- https://man7.org/linux/man-pages/man2/madvise.2.html