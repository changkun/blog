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

*关于两种"新"：一种会复利，一种只是越堆越多。*

> 我语言的边界，就是我世界的边界。 -- _维特根斯坦《逻辑哲学论》5.6_

最初那一周，看起来一切都还挺正常。

我跑的那条 AI Agent 流水线几乎每小时提交一次 commit，活动图绿得发亮，从外面看完全是一个健康的系统该有的样子。问题只有一个：产品本身并没有变大[^goalless]。它没有崩，也没有停下，commit 一直在落，但所有动作都发生在它已经掌握的那点词汇之内。

这种错觉其实并不少见。Conway's Game of Life 持续产出新图样已经有半个世纪了，2023 年它关于振子的那个核心未解问题刚被解决，社区不仅没有冷下来，反而加了速。speedrunning 的圈子主动把整类 glitch 排除在比赛规则之外，可即便如此，依然能在剩下的更小的规则框架里挖出新的路线。一些早已绝版的格斗游戏，规则冻结了二十年，比赛照办不误。与此同时，互联网上绝大多数所谓"爆款"，往往一个月之内就被掏空，然后被悄无声息地放下。

从外面看，这几种情况其实都叫做"活跃"。最顺嘴的解释一般是"井干了"，但这句话往往太粗：Game of Life 也可能只是在触顶，那条 Agent 流水线也可能还在生长，"爆款"也未必死，它可能只是换了一种形态。真正把这几种情况分开的东西，并不在忙碌指标里，但它可以被说清楚，原则上也能测出来。

所以问题落到一句话上：**一个在产出的系统，和一个在成长的系统，到底差在哪里？** "运动"和"进步"之间差的那一截，究竟是什么？凭感觉不算数，这个差别需要一个名字。

这个区分本身并不微妙。下面两节看完，多数人都会觉得"这不显然吗"。可我们真正在跑的系统、在建的组织、在奖励的工作，往往正是把这个差别抹掉的那些。所以这篇文章要讲的，与其说是这个区分本身，不如说是为什么我们明明知道，却还是一次又一次地掉进去。

## 多不等于新

要把话讲清楚，得先把两种"新"分开。

第一种是**实例层面的新**（instance novelty）：又一个之前没出现过的输出。新的解法、新的功能、新的产物，都属于这一类。第二种是**原语层面的新**（primitive novelty）：一块新的可复用积木，它进入词汇表之后，会改变"下一次能轻松说出什么"的边界。

陷阱出在这两种"新"看起来太像同一种。有限的语法可以生成无穷多句子；同样，一个系统也可以源源不断地产出真正新颖的实例，而一个新原语都没添过。表面上看，它是开放的、无界的；骨子里，词汇早就停了。永远有新的话可以**说**，却没有新的东西**用来说**。

把这个区分摆出来之后，例子就一个接一个地浮上来。一个流行歌曲生成器可以产出一万种和弦走向，而新和弦的数量是零。一个研究子领域可以连发十年的论文，每一篇都不重样，但它一直只是在最初那三个定理上打转。一家公司可以在一个谁都不敢动的架构上连续交付几年的新功能。一个人的创作实践，也可以在一次性的实验之间反复横跳，每件作品都是新的，却没有任何一件让下一件做起来更省力。输出确实是新的，词汇却没动过。这样的系统在产出，但它并没有因此变得更会生成。

![](fig2-hierarchy.png)
_图 1：实例层面的新与原语层面的新。在同一层上多塞几个实例（横向），并不等于提升出一块能开下一层的可复用原语（纵向）。一个有限的语法，可以在固定的原语高度上产出无穷多实例。_

元胞自动机给出了最干净的例子，而且这是一个被证明的结论，不只是比喻。2023 年，有人证明了 Conway's Game of Life 拥有**任意**周期的振子，整个系统是"全周期的"（omniperiodic）[^omniperiodic]。这一下，一整族实例层面的问题就此关上了门：*是否存在以周期 N 闪烁的图样？* 存在，对所有 N 都存在。

按常理说，刚把一个核心未解问题解掉的社区应该平息下来，事实却正好相反。原因并不复杂：解题过程中发明出来的那些**构造方法**（也就是把行为工程化进网格的可复用技术）本身就是一批原语。问题一关门，社区立刻就把这些方法带去了新的问题上。振子是实例，造振子的方法是原语，二者跑在两个不同的时钟上。把它们混为一谈，就很容易误判一个领域、一个社区，或者任何一个系统是否还活着。

## 两条曲线

只需要一张图就够：让一个开放性系统跑得足够久，然后盯两个数字。

$g_{\text{inst}}$（实例产率）：在已知的一切之外，每个新输出有多出人意料，也就是真正新的**东西**到达的速度。

$g_{\text{prim}}$（原语产率）：真正新的、可复用的积木被提升进词汇表的频率。

![](fig3-twocurves.png)
_图 2：两条曲线的判据。实例层的边际复杂度 $g_{\text{inst}}$ 长期高于零，原语层的边际产率 $g_{\text{prim}}$ 却已经衰减到零：实例无穷无尽，生成性那边却已经关门。_

真正要看的并不是某一条曲线的高度，而是两条曲线之间的**背离**。最容易骗人的那种失败模式长这样：$g_{\text{inst}}$ 一直很高，新实例源源不断地涌出；$g_{\text{prim}}$ 却悄悄地掉到了零，没有新积木出现了。实例可以无穷无尽，生成性那一边却已经关门。所有"忙碌"指标偏偏在这种时候依然是绿的，而真正要紧的那条曲线已经走平。

同样的形状，会在很不同的尺度上反复出现。一个只在同一个套路上做变体的研究小组，看起来就是 $g_{\text{inst}}$ 很高、$g_{\text{prim}}$ 接近零：每篇论文都是新的，工具箱却从未变过。一个反复做一次性实验的创作者，也是同样的指纹：每周一件新作品，但没有任何一件接得上上一件。任何一门学科进入晚期范式的时候，也带着相似的印记：工作仍在继续，反例被一一吸收，但没有新的解释性原语进入正典。每一种情况下，第一个有用的问题都是同一个：新原语可能从哪里冒出来？而不是在旧原语身上再多堆几个新实例。

由此得出的第一步实践很简单：**两条曲线都要看，别只看一条。** 输出量和实例新度是虚荣指标，触顶的时候它们依然漂亮。真正该盯的，是原语产率，而它的行为完全是另一回事。

## 什么算一块新原语

"可复用积木"这个说法还是太空。程序合成（program synthesis）里有一个现成的判据，也是本文唯一值得记住的公式。

一个候选积木算不算原语，只看一件事：**把它加进库以后，过去工作的总描述长度有没有变短。** 把两份代价加在一起：

$$\text{cost}(\text{library}) \;+\; \text{cost}(\text{work, expressed in terms of the library})$$

加一个抽象是要付钱的，因为库会变大。它要划算，就得让其他一切都跟着变便宜。这个判据真正难的地方在于：它是*回溯性*的。一个新"抽象"成不成立，不能光看它的设计是否漂亮，也不能光看它在 code review 里读起来有多干净，必须把它套回到过去的工作上，看描述长度有没有掉下来。**压不动过去，多半也打不开未来。** 这就是这篇文章后面所有论证依赖的那个区分的可操作版本。

DreamCoder [^dreamcoder] 和 Stitch [^stitch] 这类库学习系统做的正是这件事：把一份解法语料梳一遍，把最能压缩历史的抽象提升进库。所谓可复用的技能，就是能让过去的工作被更紧凑地重新描述的那种技能，因为它把一个反复推导过的模式整个抽了出去。**这里不需要凭感觉。** 这就给了一个可操作的入口，用来判断一个系统到底是在积累能力，还是只在积累输出：它的库有没有在压缩它自己的历史？

由此还可以反过来重新界定一个好的开放性结构究竟是**为了什么**，不论那个结构是一个研究小组、一场艺术运动、一家软件公司，还是一个自主系统。如果要的是生成性[^openend]，光把任务做完是远远不够的：系统得有一个持久的、共享的库，得有一个把东西压缩进去的激励；同一种问题形状第五次出现的时候，应当有人、或者某个机制，把它提升成原语。否则每一轮都是从同一份词汇开始，原语曲线永远起不来 [^prospective]。

## 为什么我们一再忘记这件事

到这里为止，定义本身是明摆着的。在跑系统、做组织、写论文这些事情上有点经验的人，多多少少都明白"产出不等于能力"。既然这么明白，同一种模式为什么还是会在一个又一个产品里、一个又一个 Agent 系统里、一个又一个实验室里反复上演？

原因不在认知层，而在结构层。任何一个真正在运转的系统都会带着一个会计层：changelog、velocity 看板、OKR 表、评估管道、论文数。这些东西数的全部是*产出*，没有一项在数库的压缩。**changelog 记的是这个系统做了什么；library 记的是它变成了什么。** 这两件事永远不会出现在同一张表上，因为后者难定义、更难奖励，而人本能上就会去优化看得见、能换出工资的那一项。

具体到日常：奖励的东西，是测量的东西。一个 pull request 关掉一个 ticket，整个动作清清楚楚摆在那里。换一个工程师，花一整周把三个模块合并成一个更干净的原语，活做了，可没有任何一项"已交付"指标会把这件事记下来。几个季度下来，激励会一点点把库耗掉，系统也就可以预见地滑向高 $g_{\text{inst}}$、低 $g_{\text{prim}}$ 的方向。

不妨设想两个并存的系统。一个每天都有新功能交付，仪表盘绿得发亮，团队一次又一次被表扬；另一个一整个月对外什么都不交付，所有人在重构一个外部用户永远看不到的内部表示。半年之后，第二个系统每季度长出来的原语其实是第一个的两倍，而第一个早已在走向枯竭。可这件事，绝大多数会计层根本看不出来。

非商业的场景，长出的也是同一个形状。以发表数为指标的实验室，会一步一步地走向实例工作；以通过率为指标的 AI Agent benchmark，挑出来的是"用同一套词汇解出更多题"的 Agent，而不是会去长出一套新词汇的 Agent；按 token 计价的生成式 AI 产品，经济上根本分不清一个 token 是从一个已经压缩过的概念里出来的，还是又一次被重新推导出来的。每一种场景里，会计层都恰好屏蔽掉了那个真正要紧的变量，于是系统就一路把代理指标优化下去。

所以问题不在于"多不等于新"有多深奥、某些组织没能领会。这件事再明白不过，跑这些系统的人在白板前几乎都会点头同意，可系统照样给出错误的答案，因为没有人把正确答案写在决定报酬的地方。

## 第二个陷阱：锁定

退一步说，假设原语**确实存在**。当下框定问题的方式已经被掏空了，但旁边其实就有另一个更好的框架：一种新的表示，一套新的理论工具，一个新的架构，足以把原语曲线重新打开。系统会迁过去吗？

通常不会。这种失败和"已经没东西可找"是两回事，它叫**锁定**（lock-in）：系统该动，却动不了。库恩对"科学革命"的整套描述，本质上就是在研究这件事[^kuhn]：反例一再积累，社区却始终不切换，直到留在原地的成本最终压过了跳出去的成本，整个领域不是一点一点过渡过来的，而是以一次跳跃把自己重新组织一遍。

底下的数学其实只是个比较：切换带来的增益 $\Delta g$ 超过切换成本 $c$ 时，系统才会切；$c > \Delta g$ 时，系统就锁死。锁定一般分两种：

**纯粹的惯例（Pure convention）。** 几个备选项大致一样好，只是历史原因卡在了其中一个上，换的成本不值得付。QWERTY 是经典的例子[^arthur]。多数情况下无害。

**协调性锁定（Coordination lock-in）。** 新框架真的更好（$\Delta g > 0$），但所有人重新学共享词汇、重建工具链、重新协调评估标准的成本加起来，已经超过了那点增益。昂贵的就是这一种。哥白尼之前的天文学就是这副样子，几百年里本轮叠本轮：每一个补丁本身都是合格的局部修正，但底层框架始终没被人质疑过。成熟工程组织里的多数流程，性质也差不多：结构本身让"暂停交付三周，重新想一下拓扑"这种话根本无法被说出口[^wallfacer]。框架不会自己质疑自己。

![](fig4-landscape.png)
_图 3：锁定，作为一个势能景观。即便存在一个更好的框架 $V'$（$\Delta g > 0$），只要逃逸阻力 $[c - \Delta g]_+$ 超过了可用的扰动，集体就会停留在 $V$ 这个亚稳态的洼地里。纯惯例锁定不过是 $\Delta g \approx 0$ 这一特例。_

把这两个陷阱放到一对正交的轴上，更完整的图就出来了。

![](fig1-quadrants.png)
_图 4：两条轴生出四个角落。**生成性**（探索是否还在持续产出新的原语？）是横轴；**认知锁定**（在产率衰减之后，集体会不会停下来？）是纵轴。低生成性、低锁定，是流星式的"爆款"：一旦被看穿，人就走。低生成性、高锁定，是在已封闭规则上长期延续的文化：一款绝版游戏却拥有持续了几十年的竞技场。高生成性、高锁定，是一个开放的社区主动给自己设界，比如在仍然内容丰富的游戏中以"无 glitch"规则速通。高生成性、低锁定，是 Game of Life 五十年来始终所在的那一格："持续深入"。_

关于"开放性"的讨论，多数时候只看其中一条轴。但凡碰到一个触顶的系统，最稳妥的做法是把两条轴都问一遍，再急着下结论。哪怕一个有生成性的系统，被焊死在一个原语曲线已经走平的表示上，照样会触顶，再多的局部聪明也救不回来。迁移和优化是两件性质不同的事；迁移要付真金白银的代价，而且这笔代价通常还得有人主动决定承不承担。

关于这两个陷阱，还有一点：真正能被测出来的，从来不是系统**生成原语的原始能力**，而是在注意力实际落到的那条路径上，到底有多少原语被**实现**了。两个接触同样底层材料的系统，会因为注意力分配方式不同而长出截然不同的库[^march]。锁定不过是这个机制的一种特殊形态：注意力被指到了一条已经走平的曲线上，而结构不肯让它再动。

## 难的不是这个想法

到这里，能讲清楚的差不多都讲了：什么是原语，怎么测它，为什么系统再三测不出来，以及就算测出来又会被另一个陷阱接住。每一件单看都不复杂。可真正棘手的是另外一件事：**明白这个区分，并不能把系统救出来。陷阱根本不在认知层，它躲在会计层里。**

落到工作上，这个判据其实可以非常短。一个系统真正的状态，不在它的输出序列里，而在它的库里。changelog 记的是它做了什么，library 记的是它变成了什么。绝大多数测量系统只数前者；少数能成长的系统，找到了办法把后者也数进去。其余的，只是在忙。

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
