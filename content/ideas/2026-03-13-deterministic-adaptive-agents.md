---
date: 2026-03-13T03:43:42
slug: "deterministic-adaptive-agents"
title: "Deterministic Processes and Adaptive Multi-Agent Architecture"
title_zh: "确定性流程与自适应多智能体架构"
---

{{% en %}}
Recently I developed an automated software development pipeline, and the basic idea is: an idea agent proposes ideas, then the pipeline automatically implements them, runs tests after implementation, and then automatically submits.

I noticed a very interesting phenomenon. After showing this tool to some people, I found that their design approaches for similar ideas varied quite a bit.

**1. My design approach:**
My pipeline follows an engineering process, a typical software workflow:
(a) Propose an idea
(b) Automatic implementation
(c) Automated testing
(d) Automatic submission

The core of this design is "deterministic steps," essentially a fixed state machine transition.

**2. Engineering Managers' approach:**
Some Engineering Managers also built similar things (also vibe-coded), but their design thinking is:
(a) Only define the goal, don't prescribe the state machine for agent-to-agent communication.
(b) Hand the task to a bunch of agents and let them figure things out through mutual communication.
(c) Agents decide who to talk to on their own, and resolve issues independently after communication.

Under this architecture, the idea agent might not directly propose ideas, but instead first communicate with other agents. After communication is complete and proposals begin, other agents might discover that certain parts need implementation. At this point, the idea agent might go chat with the responsible agent. If the implementer feels they can't do it, they need to communicate with another person, so it will then go chat with that person instead.

I find the differences between these two architectural designs particularly interesting. I believe the essential distinction reflected behind this design difference lies in:

**1. The former adds constraints and control to uncertain systems**
Its constraints are typically expressed as state machines.

**2. The latter defines "goal-to-goal" architecture**
That is, it believes that under such an uncertain state machine, the system can achieve the leap from goal A to goal B.

What I find interesting is that one is about managing uncertainty, while the other is about trusting in uncertainty. It's hard to say which is better. It probably requires experiments to research this.

If most people’s workflows are implicit, then trying to extract, learn, and externalize those workflows ultimately leads to a situation where **“the system decides the intermediate process for us.”**
At a fundamental level, this is not different from what model providers are already doing. My approach may simply be taking a more complicated path to arrive at the same destination.

So perhaps a more honest reality is this: **my state-machine approach and the model providers’ approach are not two competing products in the same market. They serve two entirely different types of users.**

Most people truly only care about **“what I want”** and **“what I received.”**
For them, the intermediate process is a burden rather than a source of value. From their perspective, the direction taken by model providers is absolutely correct.

But there is a small group of people, such as experienced **Staff Engineers, architects, and researchers**, who care about the process itself.
Not because they distrust the system, but because they **extract information from the process**.

When they pause at an intermediate state, they are not simply checking whether the tests passed. At the same time, they are:

* observing the **quality of the code**,
* building a **mental model of the repository**,
* adjusting their **next strategic move**.

These accompanying cognitive activities are precisely what the **“goal → result”** model completely discards.

This is somewhat analogous to the relationship between **autonomous driving and manual driving**.
Most people simply want to get from point A to point B. For them, autonomous driving is a pure improvement.

But some people gain valuable understanding **during the act of driving**: awareness of road conditions, perception of vehicle behavior, and judgment of the environment. These capabilities gradually deteriorate when everything is handled automatically.

Therefore, the real value of my design might not be that it is **“better than the model providers’ approach.”**
Rather, it preserves something that model providers have intentionally abandoned:

**human cognitive participation in the process.**

For most users this value is essentially zero. But for a small group of users, it is irreplaceable.

This also implies that we may not need to solve the problem of **“how to let everyone customize workflows.”**
The people who truly need custom workflows already have the capability to define them themselves. And for those who do not need them, simply providing **goal → result** is sufficient.

Trying to find a middle ground between the two may end up satisfying neither side.

{{% augmented %}}
*The following content is generated by LLMs and may contain inaccuracies.*
# In-Depth Discussion: Control and Trust in LLM Multi-Agent Architectures

**Context**

This observation touches on a core architectural divergence in current LLM-driven autonomous software development systems. In the field of software development automation, researchers have already advanced code implementation, testing, and maintenance through LLM agents. However, multi-agent systems, by leveraging collaboration and specialized capabilities across multiple agents, enable autonomous problem solving, increase robustness, and provide scalable solutions for managing the complexity of real-world software projects.

The two architectural designs you describe represent a classic tension in software engineering replayed under a new technological context. Deterministic agentic workflows use explicit, predefined rules or protocols to manage agent interactions, coordination, and task delegation. Operation sequences, agent responsibilities, and communication flows are predetermined. In contrast, decentralized (fully collaborative) architectures treat all agents as peers, typically using a shared blackboard or group chat where task allocation and solution synthesis emerge through negotiation or consensus. This divergence is particularly pronounced in current autonomous software development systems because it directly relates to maintaining a balance between controllability and adaptability in the presence of uncertain LLM reasoning processes.

---

## Key Insights

### 1. Engineering Logic of Deterministic State Machine Architectures

Your pipeline design reflects the classic software engineering pursuit of predictability. The advantages of deterministic architectures include consistent system behavior under identical conditions, which is critical for reliability-sensitive applications, and easier debugging because failures and unexpected behaviors are easier to trace.

State machines represent a computational model that expresses business processes as a finite set of states, transitions, and rules. In traditional workflow automation, every possible business scenario must be anticipated, mapped, and programmed into specific paths through the system.

In LLM-based development systems, this determinism becomes particularly important. LLMs are inherently nondeterministic. Even if each step has only a 1% failure rate, errors accumulate across multi-step agentic processes. For example, in a 10-step pipeline with a 99% success rate per step (0.99¹⁰), the overall success rate is only about 90.4%, implying an unacceptable 10% failure rate in production environments. By introducing explicit state-machine control flows, you effectively build a reliable coordination framework around unreliable components.

Frameworks such as ALMAS orchestrate coding agents aligned with roles in agile development teams, from product managers and sprint planners to developers, testers, and peer reviewers. By mirroring real-world team hierarchies, ALMAS deploys lightweight agents for routine and low-complexity tasks while assigning more advanced agents to complex architectural and integration decisions. This approach translates deterministic processes from human teams into agent systems.

---

### 2. Goal-Driven Adaptive Communication Architectures

The architecture adopted by engineering managers represents trust in emergent intelligence. LLM orchestration excels at producing flexible solutions to problems that do not have fixed workflows, enabling emergent solutions where LLMs generate creative and context-appropriate strategies that rigid protocols could not anticipate.

The goal-oriented communication paradigm, often called task-driven messaging, shifts the focus from transmitting information for its own sake toward transmitting only information useful for accomplishing a specific task. Unlike traditional paradigms that emphasize information fidelity or throughput, task-driven communication prioritizes relevance, efficiency, and coordination impact.

The core idea of this design is that context management becomes a bottleneck. If context windows were infinite and latency zero, one could simply include all relevant information in advance. In practice, however, systems require strategies that selectively present information to agents during operation.

Recent research demonstrates advantages of multi-agent systems under these constraints. In Anthropic’s multi-agent research system, a multi-agent architecture with Claude Opus 4 as the lead agent and Claude Sonnet 4 as sub-agents outperformed a single-agent Claude Opus 4 by **90.2%** on internal research evaluations. This architecture distributes work among agents with independent context windows, enabling parallel reasoning capabilities unattainable by a single agent.

Agent-to-Agent (A2A) communication, a concept defined by Google Cloud, describes agents interacting with one another like collaborators in a conversation. They share goals, divide responsibilities, and sometimes even debate the best solution. The A2A protocol aims to facilitate structured communication between autonomous agents. It focuses on collaboration, identification, and message standards in multi-agent contexts, extending beyond tool invocation. It enables secure, decentralized, and trustworthy communication among agents created by different developers.

---

### 3. The Philosophical Difference Between Control and Trust

You sharply identified the central difference: one approach attempts to **impose constraints and control on uncertain systems**, while the other **trusts that within an uncertain state space the system can traverse from goal A to goal B**. In practice, this distinction manifests as different risk tolerance models.

For multi-agent systems, choosing between deterministic workflows and AI-based orchestration involves a trade-off between predictability and adaptability. Deterministic workflows suit domains where workflows are straightforward and well-defined. LLM orchestration allows flexible solutions for problems without fixed paths.

However, limitations exist: potential unpredictable or unintended behaviors, greater difficulty guaranteeing reliability, and higher computational resources required to run LLMs in production environments.

AI agent orchestration coordinates autonomous agents capable of reasoning, acting, and adapting, whereas traditional workflow automation executes predefined steps with limited flexibility. Prompt chaining links model outputs sequentially but lacks shared state, governance, and runtime decision control. Orchestration introduces dynamic delegation, persistent context, and policy enforcement, allowing systems to handle ambiguity, long-running tasks, and cross-system execution.

Interestingly, decentralized orchestration may not contain a single controlling agent at all. Each assistant operates autonomously, and coordination emerges through communication. Agents announce intentions, share partial results, respond to each other’s messages, and adjust their behavior based on others. Without any agent holding a global view or absolute authority, the system becomes highly flexible and resilient, but also harder to control and debug. This style is common in academic research and experimental systems, such as those built using CAMEL, where the goal is studying emergent behavior rather than delivering deterministic software.

---

### 4. Hybrid Strategies in Practice

In practice, the most successful systems often adopt hybrid approaches.

In graph-based designs, systems are modeled as graphs. Agents or processing stages are nodes, and transitions are edges. Execution follows explicit paths that may include branching, parallelism, and controlled loops. The workflow itself becomes a first-class construct.

This structure enables deterministic pipelines, conditional routing based on intent or state, parallel fan-out for independent tasks, and controlled iteration with explicit constraints.

One developer summarized the approach succinctly:

> “I want deterministic orchestration. LLMs do creative work (write code, review code, run tests). Machines do routing.”

This captures the essence of hybrid strategies: delegate uncertain reasoning tasks (idea generation, code implementation) to LLMs while keeping control flow (when to move from idea to implementation, when to trigger testing) deterministic.

Selecting the appropriate orchestration model depends on organizational goals, technical maturity, and operational priorities. A core principle is to choose the simplest model that effectively meets business requirements. Most enterprise implementations achieve the best outcomes using **Supervisor** or **Adaptive Network** patterns, reserving fully custom modes only when workflows require complete programmatic control.

---

### 5. Cost, Observability, and Production Readiness

Architectural choices directly affect system properties.

Efficiency becomes a concern because LLM agents involve many LLM-processed requests. This can impact operational efficiency due to dependence on LLM inference speed. Deploying multiple agents also introduces cost challenges.

Deterministic architectures provide strong operational clarity. It is easy to understand what will happen next and why. Explicit transitions simplify recovery and make auditing possible, which is particularly important in regulated or high-reliability environments. However, rigid graphs struggle with open-ended problems where the next step cannot be predicted in advance.

Adaptive architectures become more interesting in multi-agent environments. Agents collaborating on shared tasks may negotiate responsibilities, question each other’s outputs, or proactively take actions without explicit prompts. These behaviors are not hardcoded. They emerge from how agents interpret context and respond to shared goals.

However, not all emergent behaviors are beneficial. Agents are known to hallucinate tools, fabricate internal logic, or enter infinite loops when ambiguity is insufficiently constrained. The same unpredictability that drives adaptability can also lead to drift or failure.

---

### 6. Empirical Evidence and Benchmarks

Evidence on which architecture is superior remains mixed.

Recent advances using large language model agents for automated code generation have brought the vision of automated software development closer to reality. However, existing single-agent methods struggle with generating and improving large, complex codebases due to context length constraints.

To address this challenge, researchers proposed the **Self-Organized multi-Agent framework (SoA)**. In this framework, self-organizing agents independently generate and modify code components while collaborating to construct the overall codebase. A key feature of SoA is the **automatic proliferation of agents based on problem complexity**, enabling dynamic scalability. As a result, the total codebase can grow indefinitely with the number of agents while the amount of code managed by each agent remains constant.

Code Droid achieved **19.27%** on SWE-bench Full (2,294 issues from 12 Python open-source projects) and **31.67%** on SWE-bench Lite (300 issues), illustrating that while progress is real, autonomous systems still have significant room for improvement.

---

## Open Questions

1. **Where is the optimal level of control granularity?**
   One can imagine a spectrum: fully deterministic (every agent transition hardcoded) → semi-deterministic (state machine control flow with communication freedom) → constrained emergence (goal-oriented agents with timeouts and rollback mechanisms) → fully free collaboration. For the specific task of automated software development, where is the optimal point on this spectrum? Does it dynamically change with project complexity, team size, or risk tolerance?

2. **Can emergent architectures be formally verified?**
   A major advantage of deterministic state machines is formal verification. One can exhaustively test all state transitions and prove properties such as absence of deadlocks. But when agents negotiate cooperation through natural language communication, can we develop new verification techniques to guarantee critical properties such as termination and absence of cyclic dependencies while preserving adaptability? Perhaps this requires a new class of **“soft formal methods”**, positioned between rigid proofs and purely empirical observation.

{{% /augmented %}}
{{% /en %}}

{{% zh %}}
最近我开发了一个自动开发软件的管线，大致的想法是：由一个 idea agent 提出想法，然后这个管线会自动把 idea 拿去实现，实现完之后做测试，测试完再自动提交。

我注意到一个很有意思的现象。我把这套工具给一些人看后，发现大家实现类似想法的设计思路不太一样。

1. 我的设计思路
   我的管线是按工程流程来走的，是一个很典型的软件流程：
   (a) 提出想法
   (b) 自动实现
   (c) 自动化测试
   (d) 自动提交

   这种设计的核心是“确定性的步骤”，本质上是固定好的状态机转换。

2. Engineering Manager 们的思路
   一些做工程经理（Engineering Manager）的人也做了类似的东西（也是 Vibe-coded），但他们的设计思路是：
   (a) 只定义目标，不规定 agent 之间通信的状态机。
   (b) 将任务交给一堆 agent，让它们通过互相通信来 figure out。
   (c) Agent 会自己决定跟谁聊，聊完之后自行解决问题。

在这种架构下，idea agent 可能不会直接 propose idea，而是先跟其他 agent 沟通。沟通完开始 propose 之后，其他 agent 可能会发现某部分该实现了。这时 idea agent 会去跟负责实现的 agent 聊，如果实现的人觉得做不出来，需要跟另一个人沟通，它又会转而去跟那个人聊。

我发现这两种不同的架构设计差异特别有趣。这种设计差异背后反映出的本质区别，我觉得在于：

1. 前者是对不确定性系统增加约束和控制
   它的约束条件通常是状态机（State Machine）。

2. 后者是定义“目标到目标”的架构
   也就是说，它相信在这样一个不确定性的状态机下，系统能够实现从目标 A 到目标 B 的跨越。

我发现有趣的点在于，一种是对不确定性的管理，另一种是对不确定性的相信。很难说两者之间谁更好。可能需要做实验来研究研究。

如果大多数人的工作流是隐性的，那么试图去提取、学习、外化这些工作流，最终的效果就是"系统替我们决定中间过程"，
这和模型厂商做的事情没有本质区别。我的做法只是换了一条更复杂的路走到了同一个终点。

所以也许更诚实的现实是这样的：我的状态机方案和模型厂商的方案不是在同一个市场里竞争的两种产品，它们服务的是两类完全不同的用户。

大多数人确实只关心 "我要什么"和"我拿到了什么"。对他们来说，中间过程是负担，不是价值。
模型厂商的方向对他们来说是完全正确的。

但有一小部分人，像有经验的 Staff Engineer、架构师、研究者，他们关心过程本身。
不是因为他们不信任系统，而是因为他们从过程中获取信息。在等待的这个状态上停下来，
不只是为了"确认一下测试过了没有"，而同时在观察代码质量、在积累对这个 repo 的理解、在调整下一步的策略。
这些附带的认知活动是"目标到结果"模式完全丢掉的东西。

这有点像自动驾驶和手动驾驶的关系。大多数人就是想从 A 到 B，自动驾驶对他们来说是纯粹的提升。
但有些人在驾驶过程中获取对路况的理解、对车辆状态的感知、对环境的判断力，这些东西在自动驾驶模式下会逐渐退化。

所以我的方法设计的真正价值，可能不是"比模型厂商的方案更好"，而是它保留了一个模型厂商主动放弃的东西：
人在过程中的认知参与。这个价值对大多数用户是零，但对少数用户是不可替代的。

这也意味着，我们可能不需要解决"怎么让每个人自定义工作流"这个问题。
因为需要自定义工作流的人，本身就有能力自己定义。而不需要的人，给他们"目标到结果"就够了。
试图在两者之间找一个中间方案，可能反而两边都不讨好。

{{% augmented %}}
*以下内容由 LLM 生成，可能包含不准确之处。*

**Context**

这一观察触及了当前 LLM 驱动的自主软件开发系统中一个核心的架构分歧。在软件开发自动化领域,研究人员已经通过 LLM agents 推进了代码实现、测试和维护的自动化,但多智能体系统通过利用多个 agent 的协作和专业能力,能够实现自主问题解决、提高鲁棒性,并为管理现实世界软件项目的复杂性提供可扩展的解决方案。

你所描述的两种架构设计代表了软件工程中一个经典的张力在新技术场景下的重演:确定性的 agentic workflow 使用明确的、预定义的规则或协议来管理 agent 的交互、协调和任务委派,操作序列、agent 责任和通信流程都是预先设定的;而去中心化(完全协作)的架构中,所有 agent 都是对等的,利用共享的黑板或群聊,任务分配和解决方案综合通过协商或共识涌现出来。这一分歧在当前自主软件开发系统的实践中尤其突出,因为它直接关系到如何在不确定的 LLM 推理过程中维持可控性与适应性之间的平衡。

**Key Insights**

**1. 确定性状态机架构的工程逻辑**

你的管线设计体现了经典软件工程中对可预测性的追求。确定性架构的优势在于:系统在相同情况下行为一致,这对于可靠性至关重要的关键应用非常有用;更简单的调试,因为故障和意外行为更容易追踪。状态机是将业务流程表示为有限状态集、转换和规则的计算模型。在传统工作流自动化中,每个可能的业务场景都必须被预见、映射并编程为通过系统的特定路径。

在 LLM-based 开发系统中,这种确定性尤其重要。LLMs 本质上是非确定性的,即使每个步骤只有 1% 的失败率,在多步 agentic 过程中也会累积。一个 10 步流程,每步成功率 99%(0.99^10)的系统,总体成功率只有约 90.4%,这意味着生产环境中 10% 的不可接受的失败率。通过明确的状态机控制流,你实际上在为不可靠的组件构建可靠的协调框架。

像 ALMAS 这样的框架编排与敏捷开发团队中不同角色对齐的编码 agent:从产品经理和 sprint 规划者到开发者、测试者和同行评审者。通过镜像现实世界的团队层级,ALMAS 为例行、低复杂度任务部署轻量级 agent,同时将更高级的 agent 分配给复杂的架构和集成决策。这种方法将人类团队的确定性流程成功转译为 agent 系统。

**2. 目标驱动的自适应通信架构**

Engineering managers 采用的架构则代表了对涌现式智能的信任。LLM 编排的优势在于能够创造灵活的解决方案,用于没有固定工作路径的问题;涌现式解决方案:LLM 创造出刚性协议无法预测的创造性且上下文适当的策略。目标导向的通信范式(常称为任务驱动消息)将焦点从为其自身传输信息转向仅传输对实现特定任务有用的内容。与强调信息保真度或吞吐量的传统范式不同,任务驱动通信优先考虑相关性、效率和协调的影响。

这种设计的核心理念是当 context 管理成为瓶颈时——如果 context windows 是无限的且延迟为零,你可以预先包含所有相关信息。但在实践中,你需要策略在 agent 工作时选择性地呈现信息。最近的研究展示了多 agent 系统在这些情况下的优越表现。在 Anthropic 的多 agent 研究系统中,以 Claude Opus 4 为主导 agent、Claude Sonnet 4 为子 agent 的多 agent 架构,在内部研究评估中比单 agent Claude Opus 4 高出 90.2%。该架构通过在具有独立 context windows 的 agents 之间分配工作,实现了单个 agent 无法达成的并行推理能力。

Agent-to-Agent(A2A)通信是一个由 Google Cloud 定义的概念,就像 agents 互相聊天以共同解决问题——共享目标、分工,有时甚至辩论最佳方案。A2A(Agent-to-Agent Protocol)旨在促进自主 agents 之间的结构化通信。它关注多 agent 上下文中的合作、识别和消息标准,超越了工具调用的范畴。它促进了由不同开发者创建的各种 agents 之间安全、去中心化和值得信赖的通信。

**3. 控制 vs. 信任的哲学差异**

你敏锐地指出了关键差异:一种是"对不确定性系统增加约束和控制",另一种是"相信在不确定性的状态机下,系统能够实现从目标 A 到目标 B 的跨越"。这一分野在实践中表现为不同的风险承受模型。

对于多 agent 系统,在确定性工作流和基于 AI 的编排器方法之间选择是在可预测性和适应性之间的权衡。确定性工作流适合工作流简单明了的领域。LLM 编排让你为没有固定工作路径的问题创建灵活的解决方案。局限性包括:不可预测或意外行为的可能性,更难保证可靠性,以及在生产环境中运行 LLM 所需的更大资源。

AI agent 编排协调能够推理、行动和适应的自主 agent,而传统工作流自动化执行灵活性有限的预定义步骤。提示链接按顺序链接模型输出,但缺乏共享状态、治理和运行时决策控制。编排引入了动态委派、持久上下文和策略执行,使系统能够处理模糊性、长时间运行的任务和跨系统执行。

有趣的是,在去中心化编排中根本没有单一的控制 agent。每个 assistant 都是自主的,协调通过通信涌现。Agents 宣布意图、共享部分结果、响应彼此的消息,并根据他人的行为调整自己的行为。因为没有 agent 拥有全局视角或绝对权威,系统变得高度灵活和有韧性,但也更难控制和调试。这种风格在学术研究和实验系统中很常见,例如用 CAMEL 构建的系统,目标是研究涌现行为而非交付确定性软件。

**4. 实践中的混合策略**

现实中最成功的系统往往采用混合方法。基于图的设计中,系统被建模为图。Agents 或处理阶段是节点,转换是边,执行遵循可能包括分支、并行和受控循环的显式路径。工作流本身成为一级构件。这使得支持确定性管道、基于意图或状态的条件路由、用于独立工作的并行扇出以及带有明确约束的受控迭代。

一个开发者报告:"我想要确定性编排。LLM 做创造性工作(编写代码、审查代码、运行测试)。机器做路由。"这正是混合策略的体现:将不确定的推理任务(提出 idea、实现代码)委托给 LLM,但将控制流(何时从 idea 转向实现、何时触发测试)保持为确定性。

选择正确的编排模式取决于组织的目标、技术成熟度和运营优先级。核心原则是选择能够有效满足业务需求的最简单模式。大多数企业实施使用 Supervisor 或 Adaptive Network 模式实现最佳结果,仅在工作流需要完全程序化控制时才保留 Custom 模式。

**5. 成本、可观测性与生产就绪性**

架构选择直接影响系统特性。效率问题:LLM agents 涉及大量由 LLM 处理的请求,这可能影响 agent 操作的效率,因为它严重依赖 LLM 推理速度。当部署多个 agents 时,成本也是一个问题。

确定性架构的优势在于提供强大的操作清晰性。很容易理解接下来会发生什么以及为什么。显式转换简化了恢复并使审计成为可能,这在受监管或高可靠性环境中尤为重要。但刚性图在开放式问题上会遇到困难,因为下一步无法预先预测。

自适应架构则在多 agent 设置中变得更加有趣。协作完成共享任务的 agents 可能会开始协商谁做什么、质疑彼此的输出,甚至在没有提示的情况下主动采取行动。这些都不是硬编码的;它是从 agents 如何解释上下文并响应共享目标中涌现出来的。但并非所有涌现行为都有用。已知 agents 会产生幻觉工具、捏造内部逻辑,或在歧义未得到适当约束时陷入无限循环。驱动适应的同一不可预测性也可能导致偏移或失败。

**6. 经验证据与基准**

关于哪种架构更优,现有证据是混合的。最近在使用大语言模型 agent 进行自动代码生成的进展让我们更接近自动化软件开发的未来。然而,现有的单 agent 方法在生成和改进大规模、复杂代码库方面面临局限,这是由于 context 长度的约束。为了应对这一挑战,我们提出了 Self-Organized multi-Agent framework(SoA),一个新颖的多 agent 框架,能够实现大规模代码的可扩展和高效生成与优化。在 SoA 中,自组织的 agents 独立运作以生成和修改代码组件,同时无缝协作构建整体代码库。我们框架的一个关键特性是基于问题复杂度的 agents 自动增殖,允许动态可扩展性。这使得整体代码量可以根据 agents 数量无限增加,而每个 agent 管理的代码量保持恒定。

Code Droid 在 SWE-bench Full(来自 12 个 Python 开源项目的 2,294 个问题)上达到 19.27%,在 SWE-bench Lite(300 个问题)上达到 31.67%,显示了当前自主系统的能力水平仍有巨大提升空间。

**Open Questions**

1. **最优控制粒度在哪里?** 你可以想象一个光谱:完全确定性(每个 agent 转换都硬编码)→ 半确定性(状态机控制流,但 agent 有通信自由)→ 有约束的涌现(目标导向,但有超时和回退机制)→ 完全自由的协作。对于自动软件开发这一特定任务,最佳平衡点在光谱的哪个位置?它是否因项目复杂度、团队规模或风险承受度而动态变化?

2. **涌现式架构能否被形式化验证?** 确定性状态机的一大优势是可以进行形式化验证(穷尽测试所有状态转换、证明不存在死锁)。但当 agent 通过自然语言通信协商协作时,我们能否开发出新的验证技术来保证关键属性(如必然终止、无循环依赖)同时保留适应性的好处?这是否需要新的"软形式化方法"——介于刚性证明和纯实验观察之间?
{{% /augmented %}}
{{% /zh %}}
