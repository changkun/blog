---
date: 2026-05-31T10:00:00+01:00
toc: true
id:
scripts:
    - figures.js
slug: /posts/more-is-not-new
tags:
    - 随笔
    - 人生感悟
    - 研究
title: "Why High-Output Systems Are Often the First to Stop Growing"
title_zh: "为什么最高产的系统往往最先停止成长"
---

{{% en %}}

*On two kinds of novelty: the kind that compounds and the kind that only piles up.*

> "The limits of my language mean the limits of my world." -- _Wittgenstein, Tractatus 5.6_

For a while it looked like progress.

For a week, an AI agent pipeline I ran kept shipping. A commit landed roughly every hour: small fixes, minor improvements, an activity graph that looked alive. But the product itself did not get any bigger [^goalless]. Nothing was broken and nothing was idle; the pipeline was busy, but only within the vocabulary it already had.

This is a common confusion. Conway's Game of Life has kept producing new patterns for half a century, and when its central open question about oscillators was settled in 2023, the community sped up rather than winding down. Speedrunners deliberately ban whole classes of glitches and still find new routes within the smaller rule book. Out-of-print fighting games keep their tournaments going on rule sets frozen for decades. Most viral internet ideas, by contrast, are exhausted within a month and then dropped.

From the outside, all of these look like activity. The easy verdict is "the well has run dry," but that is usually too crude: the Game of Life community could be plateauing, the agent pipeline could still be growing, and the viral fad might come back in another form. What separates these cases does not show up in the usual activity metrics, but it can be named, and in principle measured.

So the question is: **what is the difference between a system that is producing and a system that is growing?** What separates motion from progress? A gut feeling is not a measure, so the difference deserves a name.

The distinction itself is not subtle; after the next two sections, most readers will find it obvious. Yet most of the systems we run, build, and reward are exactly the ones that blur it. So this essay is less about the distinction than about the structural reason we keep falling into it.

## More Is Not New

There are two kinds of novelty, and we routinely confuse them.

The first is **instance novelty**: an output not seen before, such as a new solution, a new feature, or a new generated artifact. The second is **primitive novelty**: a new reusable building block that enters the vocabulary and changes what becomes cheap to say or do next.

The trap is that a finite grammar can generate infinitely many sentences. A system can produce an unbounded stream of genuinely new instances without adding a single new primitive. It looks open-ended from the outside while its vocabulary has stopped growing: there is always something new to *say*, but nothing new to *say it with*.

Once you see the distinction, examples are everywhere. A pop-song generator can produce ten thousand chord progressions without introducing a new chord. A research subfield can publish for a decade, every paper different, while still running on the three theorems it started with. An organization can ship features for years on an architecture nobody is allowed to question. A solo creative practice can move between one-off experiments, each piece new and none of them making the next one easier. In each case the outputs are new but the vocabulary is frozen: the system is productive without becoming more generative.

![](fig2-hierarchy.png)
_Fig 1: Instance novelty vs primitive novelty. Filling a level with more instances (horizontal) is not the same as promoting a new reusable primitive that opens a level (vertical). A finite grammar yields unboundedly many instances at fixed primitive height._

Cellular automata give the cleanest example, and it is a proven result rather than a metaphor. In 2023 it was shown that Conway's Game of Life has an oscillator of *every* period; it is "omniperiodic" [^omniperiodic]. This settled a whole family of instance questions at once: *is there a pattern that blinks with period N?* Yes, for every N.

One might expect a community to slow down once its central open problem is solved. The opposite happened. The *constructions* invented along the way, reusable techniques for engineering behavior into the grid, were primitives, and the community took them straight to new questions. The oscillators were instances; the ways of building them were primitives. The two run on different clocks, and confusing them is an easy way to misjudge whether a field, a community, or any other system is still alive.

## The Two Curves

The rest of the argument needs only one picture. Run an open-ended system over time and track two numbers.

$g_{\text{inst}}$ (instance yield): how surprising each new output is, given everything before it; in other words, how much genuinely new *stuff* is arriving.

$g_{\text{prim}}$ (primitive yield): how often a genuinely new reusable building block is promoted into the vocabulary.

![](fig3-twocurves.png)
_Fig 2: The two-curve criterion. Instance-level marginal complexity $g_{\text{inst}}$ stays bounded away from zero while primitive-level marginal yield $g_{\text{prim}}$ decays to zero: unboundedly many novel instances, yet generative closure._

What matters is not the level of either curve but their **divergence**. The failure that looks healthy from a distance goes like this: $g_{\text{inst}}$ stays high and new instances keep coming, while $g_{\text{prim}}$ decays toward zero and no new building blocks appear. The result is infinitely many instances with generative closure, and the activity metrics stay green exactly when the curve that matters has gone flat.

The same shape appears at very different scales. A research group that keeps publishing variations of the same trick has high $g_{\text{inst}}$ and near-zero $g_{\text{prim}}$: every paper is new, but the toolkit is frozen. A craft practice that moves from one one-off experiment to the next has the same signature: a new piece each week, none of them building much on the last. A late paradigm in science can look similar: work continues and anomalies are absorbed, but no new explanatory primitives enter the canon. In each case the first useful question is where new primitives could form, rather than how to produce more instances of the old ones.

So the first practical step is simple: **watch both curves, not one.** Output volume and instance novelty are vanity metrics that can look great during a plateau. The number to watch is primitive yield, which behaves very differently.

## What Counts as a New Primitive

"Reusable building block" is still vague. Program synthesis offers a precise test, and it is the one formula in this essay worth remembering.

A candidate counts as a primitive only when **adding it to the library makes the total description of past work shorter.** Write the sum of two costs:

$$\text{cost}(\text{library}) \;+\; \text{cost}(\text{work, expressed in terms of the library})$$

An abstraction has a cost, because the library grows; it pays off only if the work written with it gets cheaper. The demanding part of this test is that it is *retrospective*. You cannot judge a new "abstraction" by its design, or by how clean it looks in code review. You have to apply it to old work and see the description get shorter. **If it does not compress past work, it probably will not compress future work either.** This is the working form of the distinction the rest of the essay builds on.

Library-learning systems such as DreamCoder [^dreamcoder] and Stitch [^stitch] do exactly this: they comb through a corpus of solutions and promote the abstractions that compress it most. **Nothing here depends on intuition.** A reusable skill is one that lets past work be re-described more compactly, because it factors out a pattern that kept being derived again. That gives a concrete test of whether a system is accumulating capability or only output: is its library compressing its own history?

This also changes what a good open-ended structure is *for*, whether it is a research group, an artistic movement, a software organization, or an autonomous system. Completing tasks is not enough for generativity [^openend]. The system needs a persistent, shared library and an incentive to compress into it: some reason for someone, or something, to notice that the same pattern has appeared five times and should become a primitive. Without that, every cycle starts from the same vocabulary, and the primitive curve never rises [^prospective].

## Why We Keep Forgetting This

So far this is mostly a definition, and an obvious one. Anyone with experience running systems already knows, in some form, that output is not capability. So why does the same pattern keep appearing, in product after product, agent system after agent system, lab after lab?

The reason is structural. Every running system has an accounting layer: a changelog, a velocity dashboard, an OKR sheet, an evaluation harness, a paper count. These track *output*; none of them tracks library compression. **The changelog records what the system did; the library records what it became.** The two never share a dashboard, because the second is hard to define and harder to reward, and people optimize what they can see being paid for.

In practice, what gets rewarded is what gets measured. A pull request closes a ticket, and the closing is visible. An engineer who instead spends a week retiring three modules in favor of one cleaner primitive does about as much work and produces nothing the system can count as "shipped." Over enough quarters, the incentives wear the library down, and the system drifts, predictably, toward higher $g_{\text{inst}}$ and lower $g_{\text{prim}}$.

Consider two systems. The first ships a feature every day, its dashboard is green, and its team gets praised. The second ships nothing for a month while its team rebuilds an internal representation that nobody outside will ever see. Six months later, the second is producing twice as many primitives per quarter as the first, and the first is heading toward exhaustion, yet most accounting layers show neither fact. Read honestly, the picture is the opposite of the obvious one.

The same pattern appears outside commerce. Research labs that count publications converge on instance work. AI agent benchmarks that score pass rates select for agents that solve more problems with the same vocabulary, not for agents that grow a vocabulary at all. Generative-AI products priced by the token are economically indifferent to whether the next token came from a compressed concept or a re-derivation. In each case the accounting layer cannot see the variable that matters, so the system optimizes a proxy.

So the problem is not that "more is not new" is a subtle insight that organizations fail to grasp. The insight is obvious, and almost everyone running these systems would agree with it at a whiteboard. The systems still produce the wrong answer because nobody has written the right one down where it affects what gets paid.

## The Second Trap: Lock-In

Now suppose the primitives *are* available: the current framing of the problem is exhausted, but a better one exists, such as a new representation, a new theoretical toolkit, or a new architecture that would reopen the primitive curve. Does the system move to it?

Usually not. This failure differs from "nothing left to find": it is **lock-in**, where the system should move and cannot. Kuhn's account of scientific revolutions is largely a study of it [^kuhn]: anomalies accumulate, the community keeps not switching, and eventually the cost of staying exceeds the cost of moving, so the field reorganizes in one jump rather than a smooth transition.

The math is a single comparison. A system switches frames when the gain from switching, $\Delta g$, exceeds the cost of switching, $c$, and stays locked in whenever $c > \Delta g$. Two kinds of lock-in matter:

**Pure convention.** The alternatives are about equally good, and the system is stuck with one for historical reasons because changing is not worth the cost. QWERTY is the classic case [^arthur]. This kind is often harmless.

**Coordination lock-in.** The new frame is genuinely better ($\Delta g > 0$), but the cost of everyone relearning the shared vocabulary, rebuilding the tooling, and agreeing on new evaluation standards exceeds the gain. This is the expensive kind. Pre-Copernican astronomy stacked epicycles on epicycles for centuries, each patch a competent local fix, while the underlying frame went unquestioned. Mature engineering organizations can end up the same way when their process has no room for the leap, so that "pause delivery for three weeks and rethink the topology" is not a proposal the structure can accept [^wallfacer]. A frame does not question itself.

![](fig4-landscape.png)
_Fig 3: Lock-in as a potential landscape. Even when a better framework $V'$ exists ($\Delta g > 0$), the collective stays in $V$ if the escape resistance $[c - \Delta g]_+$ exceeds the available perturbations: a metastable basin. Pure-convention lock-in is the special case $\Delta g \approx 0$._

Putting the two traps on perpendicular axes gives a fuller picture.

![](fig1-quadrants.png)
_Fig 4: Two axes generate four corners. **Generativity** (does discovery keep producing new primitives?) is the horizontal axis. **Epistemic lock-in** (when yield decays, does the collective stay?) is the vertical. Low-generativity, low-lock-in is the flash-in-the-pan fad: once people see through it, they leave. Low-generativity, high-lock-in is the long-lived culture on closed rules: an out-of-print game with a competitive scene that lasts decades. High-generativity, high-lock-in is the open community deliberately bounding itself: speedrunning a still-rich game under "glitchless" rules. High-generativity, low-lock-in is sustained deepening: Game of Life fifty years on._

Most writing about open-endedness looks at one axis at a time. With a stalled system, it helps to ask about both before settling on an answer. Even a genuinely generative system will plateau if it is tied to a representation whose primitive curve has flattened, and no amount of local cleverness will get it out. Migration is a different operation from optimization: it has a real cost, and someone, usually still a human, has to decide to pay it.

One more point applies to both traps. What we can measure is never a system's raw *capacity* for producing primitives, only how many primitives it *actually produced*, given where its attention went. Two systems with access to the same material can end up with very different libraries depending on how they allocate attention [^march]. Lock-in is the special case where attention is fixed on a flat curve and the structure will not let it move.

## The Hard Part Is Not the Idea

The argument consists of a definition, a test, an explanation of why systems keep failing the test, and a separate trap that catches those that pass it. None of these pieces is difficult. What is difficult is that knowing the distinction does not get a system out of the trap, because the trap lives in the accounting layer, not in anyone's understanding.

The working version of the test is short. A system's real state is not in its output but in its library: the changelog says what it did, and the library says what it became. Most measurement counts only the first. The few systems that grow have found some way to count the second as well; the rest stay busy.

{{% /en %}}

{{% zh %}}

*两种"新"：一种会复利，一种只会越堆越多。*

> 我语言的边界，就是我世界的边界。 -- _维特根斯坦《逻辑哲学论》5.6_

有一段时间，它看上去一直在进步。

我跑的一条 AI Agent 流水线，连续一周都在交付：差不多每小时一个 commit，修修小问题，做点小改进，提交记录看上去生机勃勃。可产品本身一点也没有变大[^goalless]。它没出故障，也没闲着，只是一直在用自己已经会的那些东西打转。

这种错觉并不少见。Conway 的生命游戏（Game of Life）五十年来一直有新图样被发现；2023 年，关于振子的核心问题被彻底解决，社区非但没有冷下来，反而更活跃了。速通（speedrun）玩家会主动禁掉一整类 glitch，在更小的规则里照样跑出新路线。一些早已绝版的格斗游戏，规则几十年没变，比赛却一直办了下来。相比之下，互联网上大多数爆火的点子，一个月就被玩尽，然后再没人提起。

从外面看，这些都叫"活跃"。最容易下的结论是"井已经干了"，但这往往太粗糙：生命游戏的社区可能正在触顶，那条 Agent 流水线也可能还在成长，一时的爆款也许会换个样子卷土重来。真正把它们区分开的东西，在常见的活跃度指标里看不到，但它说得清楚，原则上也测得出来。

所以问题是：**一个在产出的系统，和一个在成长的系统，差别到底在哪？** 忙碌和进步之间，差的是什么？光凭感觉不行，得给这个差别起个名字。

这个区分本身并不深奥，读完下面两节，多数人都会觉得理所当然。可我们实际运行、搭建和奖励的系统，往往正是把它抹平的那些。所以这篇文章想谈的，与其说是这个区分，不如说是：为什么明明懂，我们还是一再掉进去。

## 多不等于新

"新"有两种，而我们经常把它们混为一谈。

第一种是**实例层面的新**：以前没出现过的产出，比如一个新的解法、一个新功能、一件新生成的作品。第二种是**原语层面的新**：一块新的、可以反复使用的基本构件。它一旦进入词汇表，接下来什么事情容易说、容易做，就跟着变了。

麻烦在于，有限的语法可以生成无穷多的句子。一个系统可以源源不断地产出货真价实的新实例，却一个新原语也没有增加。从外面看它好像没有边界，其实词汇早就不再增长：总有新的话可说，却没有新的词可用。

看清这一点之后，例子随处可见。一个流行歌曲生成器可以写出一万种和弦进行，却不发明一个新和弦。一个研究方向可以连续十年发论文，篇篇不同，用的却始终是起步时那三个定理。一家公司可以在一套没人敢碰的架构上连着几年交付新功能。一个人的创作也可以在一次次互不相干的实验之间打转，每件作品都是新的，却没有哪一件让下一件更容易。产出确实是新的，词汇却没动：这样的系统很能产出，却没有变得更能生成。

![](fig2-hierarchy.png)
_图 1：实例层面的新与原语层面的新。在同一层里多放几个实例（横向），和提炼出一块能打开新一层的可复用原语（纵向），是两回事。有限的语法可以在原语高度不变的情况下，产出无穷多的实例。_

元胞自动机提供了最干净的例子，而且这是一个已经被证明的结论，不是比喻。2023 年，有人证明了生命游戏存在**任意**周期的振子，也就是说它是"全周期的"（omniperiodic）[^omniperiodic]。一整族实例层面的问题就此有了答案：*有没有以周期 N 闪烁的图样？* 有，对所有 N 都有。

按理说，核心难题解决之后，社区应该会慢下来，结果正好相反。为了解题发明出来的那些**构造方法**，也就是把特定行为"搭"进网格的可复用技巧，本身就是原语；问题一解决，社区马上把它们带去了新的问题。振子是实例，造振子的办法是原语。两者走的是两套时钟，把它们搞混，就很容易看错一个领域、一个社区，或者任何一个系统，到底还有没有生命力。

## 两条曲线

后面的论证只需要一张图。让一个开放式系统跑上一段时间，记录两个数。

$g_{\text{inst}}$（实例产率）：在此前一切的基础上，每个新产出有多出人意料，也就是真正新的**东西**来得有多快。

$g_{\text{prim}}$（原语产率）：真正新的可复用构件被收进词汇表的频率。

![](fig3-twocurves.png)
_图 2：两条曲线的判据。实例层的边际复杂度 $g_{\text{inst}}$ 一直明显高于零，原语层的边际产率 $g_{\text{prim}}$ 却衰减到了零：新实例无穷无尽，生成能力却已经封闭。_

要看的不是哪条曲线有多高，而是两条曲线之间的**分叉**。远看最像健康状态的那种失败，是这样的：$g_{\text{inst}}$ 一直很高，新实例不断涌出；$g_{\text{prim}}$ 却一路掉向零，再也没有新的构件出现。结果是实例无穷多，生成能力却封闭了；而偏偏在要紧的那条曲线走平的时候，各种活跃度指标还是一片绿色。

同样的形状会在很不同的尺度上出现。一个研究组反复发表同一个套路的变体，就是 $g_{\text{inst}}$ 高、$g_{\text{prim}}$ 接近零：每篇论文都是新的，工具箱却冻住了。一种手艺如果只是从一次性实验跳到下一次，也是同样的特征：每周都有新作品，却很少有哪件建立在上一件之上。一门科学走到范式晚期，看上去也差不多：研究照常进行，反常现象被逐个消化，但再没有新的解释性原语写进教科书。这些情况下，第一个有用的问题都是：新原语可能从哪里长出来？而不是：怎样用旧原语再多造一些实例。

所以第一步其实很简单：**两条曲线都要看，别只看一条。** 产出量和实例新度都是虚荣指标，系统触顶的时候，它们照样可以很好看。真正该看的是原语产率，它的走势完全是另一回事。

## 什么才算新原语

"可复用的构件"这个说法还是太虚。程序合成（program synthesis）里有一个精确的判据，也是这篇文章里唯一值得记住的公式。

一个候选构件只有满足下面这个条件，才算原语：**把它加进库里之后，对过去工作的总描述变短了。** 也就是把两份代价加起来：

$$\text{cost}(\text{library}) \;+\; \text{cost}(\text{work, expressed in terms of the library})$$

加入一个抽象是有代价的，库会变大；只有用它写出来的东西都变便宜了，才划得来。这个判据难就难在它是*往回看*的：一个新"抽象"好不好，不能看它设计得多漂亮，也不能看它在 code review 里多干净，而要拿它去重写过去的工作，看描述是不是真的短了。**连过去都压缩不了的抽象，多半也压缩不了将来。** 后面的论证，都建立在这个判据上。

DreamCoder [^dreamcoder] 和 Stitch [^stitch] 这类库学习系统做的就是这件事：把一批解法翻一遍，把最能压缩它们的抽象提升进库里。**这里不需要凭感觉。** 所谓可复用的技能，就是能让过去的工作被更简洁地重新描述的技能，因为它把一个被反复推导的模式提了出来。这就给出了一个具体的检验，能判断一个系统积累的是能力，还是只是产出：它的库，有没有在压缩它自己的历史？

这也改变了我们对一个好的开放式结构的期待，不管它是一个研究组、一场艺术运动、一个软件团队，还是一个自主系统。要有生成能力[^openend]，光把任务完成是不够的。系统需要一个长期存在、大家共享的库，还需要往里面压缩的动力：得有某种理由，让某个人或某个机制注意到，同一个模式已经出现了五次，该把它提炼成原语了。没有这一点，每一轮都从同一套词汇开始，原语曲线就永远起不来[^prospective]。

## 为什么明白了还会一再犯

到这里，基本上只是一个定义，而且是个很显然的定义。有经验的人多少都明白，产出不等于能力。那为什么同样的模式，还会在一个又一个产品、一个又一个 Agent 系统、一个又一个实验室里反复出现？

原因在结构上。任何在运转的系统都有一套记账方式：changelog、效率看板、OKR 表、评测管线、论文数量。这些记下来的都是*产出*，没有哪一项在记库有没有被压缩。**changelog 记下的是系统做了什么，库记下的是它变成了什么。** 这两样东西从来不在同一块看板上：后者难以定义，更难以奖励，而人总是去优化那些看得见、能拿到回报的东西。

被奖励的，就是被度量的。一个 pull request 关掉一个工单，这件事人人看得见。另一位工程师花一周时间，把三个模块收拢成一个更干净的原语，工作量差不多，却拿不出任何能算作"已交付"的东西。一个季度接一个季度下来，激励机制会把库慢慢磨掉，系统也就可想而知地滑向高 $g_{\text{inst}}$、低 $g_{\text{prim}}$。

想象两个系统。第一个每天交付一个新功能，看板一片绿，团队屡受表扬。第二个整整一个月什么也没交付，团队在重建一套外人永远看不到的内部表示。半年后，第二个系统每季度产出的原语是第一个的两倍，第一个则正在走向枯竭，可大多数记账方式对这两件事都毫无反应。认真看，结论和直觉正好相反。

商业之外也是一样。以发表数量为指标的实验室，会越来越偏向实例型的工作。以通过率打分的 AI Agent 基准，选出来的是用同一套词汇解更多题的 Agent，而不是能长出新词汇的 Agent。按 token 计价的生成式 AI 产品，在经济上根本不关心下一个 token 是来自一个压缩过的概念，还是又推导了一遍。每一种情况下，记账方式都看不见真正要紧的那个变量，系统只能去优化一个替代指标。

所以问题不在于"多不等于新"是什么深刻的洞见，组织领会不了。道理再明白不过，几乎每个运营这些系统的人站在白板前都会同意。系统之所以还是给出错误的答案，是因为没有人把正确的答案写进决定报酬的地方。

## 第二个陷阱：锁定

再假设原语**是有的**：当前理解问题的方式已经被用尽了，但存在一个更好的方式，比如一种新的表示、一套新的理论工具，或一种新的架构，能让原语曲线重新抬头。系统会换过去吗？

通常不会。这和"已经没什么可找的了"是两种不同的失败，它叫**锁定**（lock-in）：系统该动，却动不了。库恩对科学革命的描述，很大程度上就是在研究这件事[^kuhn]：反常不断累积，共同体却迟迟不换，直到留下的代价超过了迁移的代价，整个领域才一下子完成重组，而不是平滑过渡。

数学上只是一次比较。切换带来的收益 $\Delta g$ 超过切换成本 $c$ 时，系统才会切换；只要 $c > \Delta g$，它就被锁定。值得区分的锁定有两种：

**纯粹的惯例。** 几个选项差不多好，系统出于历史原因停在其中一个上，换了也不值得。QWERTY 键盘是经典例子[^arthur]。这种锁定通常无害。

**协调性锁定。** 新框架确实更好（$\Delta g > 0$），但要让所有人重新学习共同的词汇、重建工具、重新约定评估标准，这些成本加起来超过了收益。代价高的是这一种。哥白尼之前的天文学几百年来在本轮上叠本轮，每个补丁都是称职的局部修正，底层框架却从没被质疑。成熟的工程组织也会走到这一步：当流程里容不下这种跳跃时，"暂停交付三周，重新想想整体结构"就成了这个结构接受不了的提议[^wallfacer]。框架不会自己质疑自己。

![](fig4-landscape.png)
_图 3：把锁定看成一个势能地形。即使存在更好的框架 $V'$（$\Delta g > 0$），只要逃逸阻力 $[c - \Delta g]_+$ 大于系统能得到的扰动，集体就会停在 $V$ 里：这是一个亚稳态的洼地。纯惯例的锁定，是 $\Delta g \approx 0$ 时的特例。_

把两个陷阱放到两条互相垂直的轴上，图景会更完整。

![](fig1-quadrants.png)
_图 4：两条轴划出四个角。横轴是**生成性**（探索是否还在不断产出新原语？），纵轴是**认知锁定**（产率衰减之后，集体会不会留下来？）。低生成性、低锁定，是昙花一现的爆款：一旦被看穿，人就走了。低生成性、高锁定，是建立在封闭规则上的长寿文化：一款绝版游戏，竞技圈却延续了几十年。高生成性、高锁定，是一个开放的社区主动给自己设限：在内容依然丰富的游戏里按"无 glitch"规则速通。高生成性、低锁定，是持续深入：五十年后的生命游戏。_

关于"开放性"的讨论，大多一次只看一条轴。面对一个停滞的系统，最好两条轴都问一遍，再下结论。即使是一个真正有生成能力的系统，如果被绑在一种原语曲线已经走平的表示上，也会触顶，局部再怎么聪明也出不来。迁移和优化是两种不同的操作：迁移有实实在在的代价，而且通常得有人，多半仍然是人，下决心去付这笔代价。

对这两个陷阱，还要补充一点。我们能测到的，从来不是一个系统产生原语的原始*能力*，而只是在注意力实际投向的地方，它*实际*产出了多少原语。两个面对同样材料的系统，会因为注意力分配不同，长出截然不同的库[^march]。锁定是其中的特例：注意力被钉在一条已经走平的曲线上，而结构不允许它移开。

## 难的不在道理

整个论证包括一个定义，一个检验，一个解释，说明系统为什么一再通不过这个检验，以及另一个陷阱，专门困住那些通过了检验的系统。这些都不难。难的是，懂得这个区分并不能把系统从陷阱里救出来，因为陷阱不在任何人的理解里，而在系统的记账方式里。

真要用起来，判据只有一句话：一个系统的真实状态，不在它的产出里，而在它的库里。changelog 记下它做了什么，库记下它变成了什么。大多数度量只记前者；少数还在成长的系统，找到了办法把后者也记下来。其余的，只是在忙。

{{% /zh %}}

## References

[^goalless]: Changkun Ou. (2026). [AI Agents (or Humans) in Goal-Directed and Goalless Environments](/posts/goalless-agents). The prior essay this one extends.
[^wallfacer]: Changkun Ou. (2026). Wallfacer: Autonomous Engineering Pipeline that Orchestrates AI Agent Teams. [github.com/changkun/wallfacer](https://github.com/changkun/wallfacer)
[^march]: March, J. G. (1991). [Exploration and exploitation in organizational learning](https://doi.org/10.1287/orsc.2.1.71). *Organization Science*, 2(1), 71–87.
[^dreamcoder]: Ellis, K., Wong, C., Nye, M., Sablé-Meyer, M., Morales, L., Hewitt, L., Cary, L., Solar-Lezama, A., & Tenenbaum, J. B. (2023). [DreamCoder: growing generalizable, interpretable knowledge with wake–sleep Bayesian program learning](https://doi.org/10.1098/rsta.2022.0050). *Philosophical Transactions of the Royal Society A*, 381(2251).
[^stitch]: Bowers, M., Olausson, T. X., Wong, L., Grand, G., Tenenbaum, J. B., Ellis, K., & Solar-Lezama, A. (2023). [Top-down synthesis for library learning](https://doi.org/10.1145/3571234). *Proc. ACM Program. Lang.*, 7(POPL). [arXiv:2211.16605](https://arxiv.org/abs/2211.16605)
[^prospective]: Hernandez Cano, L., et al. (2026). Prospective compression in human abstraction learning. [arXiv:2605.09985](https://arxiv.org/abs/2605.09985). On library learning when the task distribution is non-stationary, the case that matters most for agents.
[^openend]: Hughes, E., Dennis, M. D., Parker-Holder, J., Behbahani, F., Mavalankar, A., Shi, Y., Schaul, T., & Rocktäschel, T. (2024). [Open-endedness is essential for artificial superhuman intelligence](https://proceedings.mlr.press/v235/hughes24a.html). *ICML*. [arXiv:2406.04268](https://arxiv.org/abs/2406.04268)
[^omniperiodic]: Brown, N., Cheney, C., Eppstein, D., Goucher, A. P., Hartzer, D., Jacobi, M. D., Knight, A. P., Mead, W. P., Niemiec, M. D., Raucci, S., Riley, M. D., Rokicki, T., Santiago, A., & Vagle, M. (2024). Conway's Game of Life is omniperiodic. [arXiv:2312.02799](https://arxiv.org/abs/2312.02799)
[^arthur]: Arthur, W. B. (1989). [Competing technologies, increasing returns, and lock-in by historical events](https://doi.org/10.2307/2234208). *Economic Journal*, 99(394), 116–131.
[^kuhn]: Kuhn, T. S. (1962). [*The Structure of Scientific Revolutions*](https://press.uchicago.edu/ucp/books/book/chicago/S/bo13179781.html). University of Chicago Press. The original account of frames that stop yielding and the cost of switching them.
