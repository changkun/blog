---
date: 2021-02-10T00:00:00
title: "A New GC Pacer"
title_zh: "全新的 GC 调步器"
---

{{% en %}}
Today, the Go team released a brand new GC pacer design. Let's briefly discuss what problems existed in the previous design and what the new design aims to solve.

The current Go runtime GC is a concurrent mark-sweep collector, which involves two core problems that need to be solved: 1) when to start GC and how many workers to launch for collection, to prevent the collector from using too many computing resources and affecting efficient execution of user code; 2) how to prevent the garbage collection speed from being slower than the memory allocation speed.

To address these problems, as early as Go 1.5, the Go team treated this as an optimization problem of minimizing heap growth rate and CPU usage, which led to two key components: 1) the pacer: predicting GC trigger timing based on heap growth speed; 2) mark assist: pausing user code that allocates too fast, redirecting goroutines that are allocating memory to perform garbage marking work, in order to smoothly complete the current GC cycle.

However, when making pacing decisions, this GC contains a hidden assumption: the allocation rate is always a constant (1+GOGC/100). Unfortunately, due to the existence of mark assist and discrepancies between implementation and the theoretical model, this assumption is actually incorrect. This leads to several hard-to-solve problems: 1) when the allocation rate violates the constant assumption, the predicted start time is too late, requiring excessive CPU consumption — while GOGC can be dynamically adjusted, it remains a hyperparameter requiring extensive domain experience to tune manually; 2) since the optimization targets heap growth without heap memory size limits, either setting GOGC too large or encountering peak allocations causes rapid heap growth leading to OOM; 3) newly allocated memory within the current GC cycle is left to the next GC cycle for collection, and mark assist's allocation throttling causes latency pauses (STW); 4) ...

So what has the new pacer redesigned to solve these problems?

As mentioned above, the main source of various problems is the incorrect assumption that the allocation rate is a constant. So naturally, it's easy to think of using the mark assist component to dynamically calculate the allocation rate during modeling, thereby achieving the goal of dynamically adjusting the heap target. Unfortunately, the original design only tracked allocations on the heap, without considering the stack or global variables. To make the problem more comprehensive, the new design introduces an "assist ratio" — the ratio of allocations produced but not collected in the current GC cycle (A) to the amount of scanning completed in the current GC cycle (B), i.e., A/B. This metric more intuitively reflects the actual difficulty of GC work: if the user allocation rate is too high, A increases, the assist ratio rises, and more assistance is needed from the mark assist; if the allocation rate is moderate, the assist ratio decreases. With the introduction of the assist ratio, the pacer can dynamically adjust the assist work, thereby resolving the pauses caused by the assist.

Let's look at a practical scenario: when a sudden burst of peak requests arrives, the number of goroutines increases dramatically, generating a large number of stacks and allocation tasks. Here are the simulation results: Figure 1 shows the pacer before adjustment, Figure 2 shows the pacer after adjustment. As shown in the lower-left of Figure 1, the heap target workload is consistently underestimated, causing the heap to always overshoot; while the new pacer can quickly converge to zero and complete the heap target prediction. The upper-right of Figure 1 shows that the actual GC CPU usage is always lower than the target usage, failing to meet the expected metrics; while the newly designed pacer can quickly converge to the target CPU usage.

Of course, due to space constraints, the above is only a very brief introduction to the new pacer design. If you are interested in this topic, you can refer to the following links. There will be opportunities to share more detailed analysis in the future.

1. GC 调步器现存的问题：https://golang.org/issue/42430
2. 新调步器的设计文档：https://go.googlesource.com/proposal/+/a216b56e743c5b6b300b3ef1673ee62684b5b63b/design/44167-gc-pacer-redesign.md
3. 相关的提案：https://golang.org/issue/44167
4. GC 新调步器模型的模拟器：https://github.com/mknyszek/pacer-model
{{% /en %}}

{{% zh %}}
今天，Go 团队发布了一个全新的 GC 的调步器（Pacer）设计。这次就来简单聊一聊这个以前的设计有什么问题，新的设计又旨在解决什么问题。

目前 Go 运行时的 GC 是一个并发标记清理的回收器，这涉及两个需要解决的核心问题：1）何时启动 GC 并启动多少数量的 worker 进行搜集从而防止回收器使用过多的计算资源影响用户代码的高效执行；2）如何防止收集垃圾的速度慢于内存分配的速度。

为解决这些问题，早在 1.5，Go 团队将这个问题视作一个最小化堆的增长速率和 CPU 的使用率的优化问题，从而促成了两个关键组件：1）调步器：根据堆的增长速度来预测 GC 的触发时机；2）标记助理 （Mark Assist）：暂停分配速度过快的用户代码，将正在分配内存的用户代码转去执行垃圾标记的工作，以便顺利完成当前的 GC 周期。

然而这样的 GC 在实施调步决策时，包含一个隐藏的假设：分配速率总是一个常数（1+GOGC/100），可惜由于标记助理的存在、实现与理论模型的差异，导致这个假设其实并不正确。进而带来的很难解决的问题：1）当分配速率违反常数假设时，预测的启动时间太晚反而需要消耗过多的 CPU，虽然可以动态的调整 GOGC，但这仍然是一个超参数，人工优化需要大量的领域经验，很难直观的使用这个变量对 GC 进行优化；2）由于优化问题是以堆的增长为目标，由于没有堆内存大小的使用限制，无论是设置过大的 GOGC 或者出现峰值分配时都会导致堆的迅速增长从而 OOM；3）在当前 GC 周期内新分配的内存将留到下一个 GC 周期进行回收，标记助理暂缓分配带来的延迟停顿 STW；4）...
那么新的调步器为解决这些问题做了什么重新设计呢？

正如前面所说，产生各类问题的主要来源是对分配速率为常数这一错误的假设，那么自然也就很容易想到在建模的过程：利用标记助理这一组件来动态的计算分配的速率，从而达到动态调整堆目标的目的。可惜的是原来的设计中标记助理仅统计了堆上的分配情况，而对栈或全局变量没有加以考虑。为了让问题考虑得更加全面，新设计中引入了一个「辅助率」，表示当前 GC 周期新产生但没有回收的分配量（A）与当前 GC 周期完成的扫描量（B）之比，A/B。这一指标更加直观的反应了 GC 的实际工作难度：如果用户分配速率过高，那么 A 将增大，进而辅助率增高，需要助理提供更多的辅助；如果分配速率适中，辅助率下降。根据辅助率的引入，调步器便可动态的的调整助理的辅助工作，进而解决辅助时带来的停顿。

我们来看一个实际的场景：当突然出现大量峰值请求时，goroutine数量大量增加，从而产生大量栈和分配任务，极其模拟的结果：图 1 是调整前的调步器，图 2 是调整后的调步器。可见图1左下角显示，总是错误的低估了堆目标工作量，导致堆总是在过冲；而新的调步器能很快的收敛到零，完成堆目标的预测；图 1 右上角则表明实际的 GC CPU 使用率总是比目标使用率低，从而为能完成预期指标；而新设计的调步器则能很快收敛到目标的 CPU 使用率。

当然，限于篇幅上面只是对新的调步器设计做了一个非常简略的介绍。如果对这个内容感兴趣，可以查阅后面的这些链接，之后有机会再对此设计做进一步详细的分享。

1. GC 调步器现存的问题：https://golang.org/issue/42430
2. 新调步器的设计文档：https://go.googlesource.com/proposal/+/a216b56e743c5b6b300b3ef1673ee62684b5b63b/design/44167-gc-pacer-redesign.md
3. 相关的提案：https://golang.org/issue/44167
4. GC 新调步器模型的模拟器：https://github.com/mknyszek/pacer-model
{{% /zh %}}
