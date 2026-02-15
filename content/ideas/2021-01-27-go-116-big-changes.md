---
date: 2021-01-27T00:00:00
title: "Go 1.16 Big Changes"
---

Go 1.16 发布了非常多非常有趣的变，尝试做一个简单的总结：

russ cos: deprecated.
   + https://twitter.com/_rsc/status/1351676094664110082
   + https://go-review.googlesource.com/c/go/+/285378
   + https://github.com/golang/go/issues/43724

1. 支持 darwin/arm64
   1. 支持 darwin/arm64 上遇到的问题
      + 苹果的bug: 与信号抢占有关
   2. Apple Silicon M1 性能
      + 但是在加密上性能很差
      + 发版周期：https://github.com/golang/go/wiki/Go-Release-Cycle
   3. 编译器自举过程

- 安装 Go：https://gist.github.com/Dids/dbe6356377e2a0b0dc8eacb0101dc3a7
- https://github.com/golang/go/issues/42684
  - 内核恐慌的第 62 期：你的电脑不是你的，代码签名，OCSP Server
  - ken thompson 图灵奖演讲：reflections on trusting trust
    - TODO
  - 苹果代码签名的老问题，早年做 electron 也是这类问题，现在这样的问题还是存在
- 异步抢占随机崩溃，是 Rosetta 的 Bug：https://github.com/golang/go/issues/42700
- 自居，安装的困惑：https://github.com/golang/go/issues/38485#issuecomment-735360572
  - Go 语言的自举分为三个步骤
    - 0. 1.4 C version TODO
	- 1. tool chain 1
    - 2. tool chain 2
    - 3. tool chain 3

- 在 Rosetta 下运行 x86 程序：`arch --x86_64`
- dotfiles 中关于 M1 的兼容性情况：https://github.com/changkun/dotfiles/issues/2
  - https://doesitarm.com/
  - https://isapplesiliconready.com/
- 十二月初入手 如今已经使用快两个月了 非常流畅 续航逆天
- 我的必备第三方软件列表：
  + homebrew (支持性不好，好在现在大部分依赖的软件是用 Go 写的，而且 Go 的支持非常完善)
    + 不考虑兼容性 随意破坏兼容性移除软件分发，有一个 rmtrash 的工具，我从2014年左右就开始使用，但是去年被从软件分发中移除了，所以自己写了一个全兼容的工具changkun.de/s/rmtrash，但没有被合并，他们说了要被原软件作者任何才能不受受欢迎程度的限制，但实际上软件作者已经联系不到了
  + vscode（已在长期使用 Insider）
  + macvim
  + tmux
  + oh-my-zsh
  + Blender（Cycles 光追渲染不支持 GPU，但编辑顶点小于百万级别的网格是没有问题的）
  + iTerm：支持 M1
  + Chrome：支持 M1
  + MacTex：支持 M1
  + Docker：圣诞节前一周发布支持，很完美，至今没有遇到问题

1. Go Modules 的变更
   1. 收集反馈
   2. 复杂依赖管理，你实践中管理过最复杂的项目依赖多少模块，每次依赖升级都有写什么？在没有 Go modules 之前你用的是什么？
      1. 我的经历：[Go vendor](https://github.com/kardianos/govendor), 1.10 dep, 1.11 go modules,
      2. GOPATH 的项目管理，现在虽然移除了 gopath，但我还是沿用了 gopath 的习惯
   3. 最小版本选择
      1. Semantic Versioning: major.minor.patch
      2. 经典的钻石依赖问题：A依赖B和C，BC分别依赖 D 的不同版本，而这两个版本的 D 不兼容，所以无法在依赖中选取一个特定的D版本，semantic import versioning 消除了这种依赖，在import path的最后添加了主版本号的要求/v2
      3. dep 不允许钻石依赖，升级非常难
      4. 构建的可重复性，没有lock文件，>=的依赖会随着时间的变化而变化
      5. 选择最小的可以依赖的版本，构建不会随时间的变化而变化
      6. https://www.youtube.com/watch?v=F8nrpe0XWRg&ab_channel=SingaporeGophers
      7. 不被理解的工作方式
        1. GOPATH
        2. vendor
      8.  三大要点
		1. 兼容性
		2. 可重复性
		3. 合作(通常被很多人忽略)
   1. 默认启用 Go Moduels, go build 必须包含 go.mod 文件，否则编译失败
   2. build/test 不会升级 modules
   3. 默认 -mod=vendor

2. 文件系统接口
   1. fs.FS 抽象的重要性在哪里
      1. unix file system abstract always disk blocks
      2. network file systems (upspin) abstract away machines
      3. rest abstract nearly anything
      4. cp 不关心是否移动文件的区块，甚至不关心文件在哪个位置，可能是不同的磁盘也可能是不同的机器
      5. 定义任何文件类型工具的「泛型」
      6.
   2. 导致了哪些主要变化
      1. io/ioutil
         1. Russ cox 对 deprecated 在 go 中的解释（https://twitter.com/_rsc/status/1351676094664110082）
         2. https://www.srcbeat.com/2021/01/golang-ioutil-deprecated/
      2. 其他 fs 的抽象
      3. Rob Pike 的 2016/2017 Gopherfest， Upspin、Changkun 的 Midgard
         1. https://www.youtube.com/watch?v=ENLWEfi0Tkg&ab_channel=TheGoProgrammingLanguage
         2. FUSE: filesystem in userspace
         3. https://changkun.de/s/midgard
         4. every user has a private root, no global root, `r@golang.org/some/stuff`, user names look like email address
         5. access control defined by plain text files `read: r@golang.org, ann@example.com`
      4. 目前的非常简单的实现，只是一个只读文件系统
      5. ReadDir and DirEntry
         1. https://benhoyt.com/writings/go-readdir/
      6. 可扩展的方向：memoryFS，支持回写到磁盘、hashFS 为 CDN 提供支持
      7. 还存在的问题。。例如 44166


		```go
		import _ "embed"
		//go:embed a.txt
		var s string

		import "embed"
		type embed.String string
		var s embed.String
		```

3. 文件嵌入 //go:embed
   1. 新特性的基本功能
   2. 一些可能的应用
   3. 一些在feature freeze cycle 中才讨论出来的feature
   4. https://blog.carlmjohnson.net/post/2021/how-to-use-go-embed/

4. 运行时内存管理
   1. 回归 MADV_DONTNEED
	+ https://blog.changkun.de/posts/pss-uss-rss/
   2. 新的监控基础设施 runtime/metrics
    + 以前的监控函数：runtime.ReadMemStats, debug.GCStats,
    + runtime/metrics:
      + metrics.All()
      + Issue 37112

```
package main

import (
	"fmt"
	"runtime/metrics"
)

func main() {
	// Get descriptions for all supported metrics.
	descs := metrics.All()

	// Create a sample for each metric.
	samples := make([]metrics.Sample, len(descs))
	for i := range samples {
		samples[i].Name = descs[i].Name
	}

	// Sample the metrics. Re-use the samples slice if you can!
	metrics.Read(samples)

	// Iterate over all results.
	for _, sample := range samples {
		// Pull out the name and value.
		name, value := sample.Name, sample.Value

		// Handle each sample.
		switch value.Kind() {
		case metrics.KindUint64:
			fmt.Printf("%s: %d\n", name, value.Uint64())
		case metrics.KindFloat64:
			fmt.Printf("%s: %f\n", name, value.Float64())
		case metrics.KindFloat64Histogram:
			// The histogram may be quite large, so let's just pull out
			// a crude estimate for the median for the sake of this example.
			fmt.Printf("%s: %f\n", name, medianBucket(value.Float64Histogram()))
		case metrics.KindBad:
			// This should never happen because all metrics are supported
			// by construction.
			panic("bug in runtime/metrics package!")
		default:
			// This may happen as new metrics get added.
			//
			// The safest thing to do here is to simply log it somewhere
			// as something to look into, but ignore it for now.
			// In the worst case, you might temporarily miss out on a new metric.
			fmt.Printf("%s: unexpected metric Kind: %v\n", name, value.Kind())
		}
	}
}

func medianBucket(h *metrics.Float64Histogram) float64 {
	total := uint64(0)
	for _, count := range h.Counts {
		total += count
	}
	thresh := total / 2
	total = 0
	for i, count := range h.Counts {
		total += count
		if total > thresh {
			return h.Buckets[i]
		}
	}
	panic("should not happen")
}
```

1. 其他值得一提的特性
   1. os/signal.NotifyContext
   2. 内存模型修复
   3. 链接器优化
