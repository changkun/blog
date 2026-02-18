---
date: 2026-02-18T16:49:25
slug: "human-in-the-loop-agents"
title: "Human-in-the-loop design for agentic AI has outgrown the 'Confirm' button"
title_zh: "代理式AI的人类在环设计已超越\"确认\"按钮"
---

{{% en %}}

**The naive approach of per-tool-call human approval in agentic AI systems is a solved problem in theory but an unsolved one in practice.** Research from 2025–2026 converges on a clear finding: confirmation fatigue is not merely an inconvenience — it is a security vulnerability, an attack surface, and the single biggest obstacle to effective human oversight at scale. The good news is that a rich ecosystem of risk-tiered frameworks, middleware architectures, and design patterns has emerged to replace the binary confirm/deny paradigm. The bad news is that the Model Context Protocol itself provides no protocol-level mechanism for any of them, leaving every client to reinvent the wheel.

This report synthesizes academic research, protocol specifications, open-source tooling, industry frameworks, and practical architectures across five dimensions to map the full state of the art.

-----

## The confirmation fatigue problem is now formally recognized as a threat

The core problem the user identified — humans becoming rote “Confirm” executors — is no longer just a UX complaint. **Rippling’s 2025 Agentic AI Security guide classifies “Overwhelming Human-in-the-Loop” as threat T10**, describing how adversaries can flood human reviewers with alerts to exploit cognitive overload.  A January 2026 SiliconANGLE analysis argues that “HITL governance was built for an era when algorithms made discrete, high-stakes decisions that a person could review with time and context” and that modern agent workflows produce “dense, miles-long action traces that humans cannot realistically interpret.”

The cybersecurity parallel is instructive and well-quantified. SOC teams field an average of **4,484 alerts per day**, with 67% ignored due to false positive fatigue (Vectra 2023).  Over 90% of security operations centers report being overwhelmed by backlogs.  ML-based alert prioritization has demonstrated concrete improvements: one framework reduced response times by 22.9% while suppressing 54% of false positives and maintaining 95.1% detection accuracy.  The direct lesson for agentic AI: risk-proportional filtering dramatically improves human performance compared to blanket approval requirements.

A February 2025 position paper by Mitchell, Birhane, and Pistilli (“Fully Autonomous AI Agents Should Not be Developed”) frames this as the “ironies of automation” — increasing automation paradoxically leads users to lose competence in the rare but critical tasks that actually need their attention.  The CHI 2023 trust calibration literature documents how “cooperative” interactions (where users review each recommendation) degrade into “delegative” ones when users become passive or complacent.  This is precisely the confirmation fatigue dynamic.

-----

## MCP mandates human oversight but provides no mechanism for it

The Model Context Protocol specification (v2025-11-25) takes an unambiguous position on principle: **“Hosts MUST obtain explicit user consent before invoking any tool.”**   But the spec immediately undermines this with a critical caveat: “While MCP itself cannot enforce these security principles at the protocol level, implementors SHOULD build robust consent and authorization flows into their applications.”

The protocol provides tool annotations — `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint` — as metadata hints about tool behavior.  However, these are explicitly described as hints “that should not be relied upon for security decisions,” since tool descriptions from untrusted servers cannot be verified.   MCP’s sampling feature (`sampling/createMessage`) includes two HITL checkpoints — before sending the request and before returning results to the server  — but uses SHOULD rather than MUST language, allowing clients to auto-approve.

**No protocol-level approval request/response mechanism exists.** There is no `approval/request` JSON-RPC method, no standardized `requiresApproval` field, no tool permission scoping, and no way for servers to programmatically indicate which tools demand human review. The most relevant active proposal is GitHub Issue #711 (trust/sensitivity annotations),  which would add metadata like `sensitiveHint` (low/medium/high) to enable policy-based decisions including escalation to human review.  This is linked to PR #1913 and carries the `security` label, but no dedicated Specification Enhancement Proposal for HITL workflows exists as of February 2026.

The consequences are visible in the ecosystem. Every major MCP client has independently built its own approval system: Claude Code uses `allow`/`deny`/`ask` arrays in a permissions config,  Cline offers granular auto-approve categories plus a “YOLO mode” that bypasses all approvals,  and users have created auto-approve scripts that inject JavaScript into Claude Desktop’s Electron app to circumvent confirmation dialogs.  The fragmentation is a direct result of the protocol gap.

-----

## Risk-proportional engagement has become the consensus framework

Across both academia and industry, **risk-tiered oversight is the dominant paradigm** for replacing blanket confirmation. The idea is simple: classify tool calls by risk, auto-approve the safe majority, and focus human attention on the dangerous few.

The most rigorous academic framework comes from Feng, McDonald, and Zhang’s “Levels of Autonomy for AI Agents” (arXiv:2506.12469, June 2025), which defines five levels ranging from L1 Operator (full human control) through L5 Observer (agent acts autonomously).   The paper introduces “autonomy certificates” — digital documents prescribed by third-party bodies that cap an agent’s autonomy level based on its capabilities and operational context.   Critically, it observes that at L4 (Approver level, the MCP default), “if a user can enable the L4 agent with a simple approval, the risks of both [L4 and L5] agents are similar”  — a direct theoretical grounding for why confirmation fatigue makes per-call approval security-equivalent to no approval at all.

Engin et al.’s “Dimensional Governance for Agentic AI” (arXiv:2505.11579, May 2025) argues that static risk categories are insufficient for dynamic agentic systems. It proposes tracking how decision authority, process autonomy, and accountability distribute dynamically across human-AI relationships, monitoring movement toward governance thresholds rather than enforcing fixed tiers.  Cihon et al. (arXiv:2502.15212, February 2025, Microsoft/OpenAI affiliations) take a code-inspection approach, scoring orchestration code along **impact** and **oversight** dimensions without needing to run the agent.

Industry implementations converge on a three-tier pattern with minor variations:

- **Low risk** (read-only operations, information retrieval): Auto-approve, log only
- **Medium risk** (reversible writes, non-sensitive operations): Auto-approve with enhanced logging and post-hoc review
- **High risk** (irreversible actions, financial transactions, PII access, production deployments): Mandatory human approval, sometimes with multi-approver quorum

Galileo’s HITL framework recommends targeting a **10–15% escalation rate**, with 85–90% of decisions executing autonomously. Confidence thresholds vary by domain: 80–85% for customer service, 90–95% for financial services, 95%+ for healthcare. The key insight from the Tiered Agentic Oversight (TAO) framework (arXiv:2506.12482) is that “requests for human review are often triggered where agents express high confidence but the system internally assesses the risk differently” — suggesting self-assessment should never be the sole gating mechanism.

-----

## Five design patterns that actually work beyond confirm/deny

### Reversibility-aware gating focuses attention where it matters most

The single highest-leverage pattern is classifying actions by reversibility rather than abstract risk. A decision-theoretic model (arXiv:2510.05307) formalizes confirmation as a minimum-time scheduling problem  using a Confirmation → Diagnosis → Correction → Redo cycle, finding that **intermediate confirmation at irreversibility boundaries reduced task completion time by 13.54%** while 81% of participants preferred it over blanket or end-only confirmation.  The EU AI Act codifies this: high-risk AI systems must provide ability to “disregard, override or reverse the output,” and where outputs are truly irreversible, ex ante human oversight is the only compliant approach.

A practical taxonomy: read-only operations auto-approve; reversible writes (git-tracked file edits) log only; soft-reversible actions (sending emails, creating tickets) can be batched; and irreversible operations (deleting data, financial transfers, production deploys) require mandatory human gates. The critical nuance is that reversibility is contextual — deleting from a git repo is reversible, deleting from S3 without versioning is not.

### Plan-level approval replaces action-level confirmation

Two complementary 2025–2026 systems address the user’s “intent overview / contract approach” concern. **Safiron** (Huang et al., arXiv:2510.09781, October 2025) is a guardian model that analyzes planned agent actions pre-execution, detecting risks and generating explanations.  It found that existing guardrails mostly operate post-execution and achieved below 60% accuracy on plan-level risk detection, establishing a benchmark.   **ToolSafe** (arXiv:2601.10156, January 2026) takes the complementary approach of dynamic step-level monitoring over each tool invocation, arguing that real-time intervention during execution catches what plan-level review misses.

The optimal architecture appears to be a hybrid: approve the plan at a high level, then monitor execution with automated step-level guardrails that can halt the agent if it deviates. OpenAI Codex’s “Long Task Mode” proposal demonstrates this concretely — the agent analyzes its plan and generates a dynamic whitelist of expected operations, the human reviews the whitelist (not individual calls), and the agent executes within those boundaries with batched questions accumulated for consolidated review.

### Multi-tier oversight layers AI reviewers before human reviewers

The “AI-monitoring-AI” paradigm has matured significantly. TAO (Kim et al., 2025) implements hierarchical multi-agent oversight inspired by clinical review processes, with an Agent Router that assesses risk and routes to appropriate tiers.  Gartner predicts guardian agents will capture **10–15% of the agentic AI market by 2030**,  categorizing them as Reviewers (content/accuracy), Monitors (behavioral/policy conformance), and Protectors (auto-block high-impact actions).  Multi-agent review pipelines have demonstrated **up to 96% reduction in hallucinations** compared to single-agent execution.

The reference architecture emerging across implementations uses five layers: (1) deterministic policy gates (allowlists/denylists) as the fastest and cheapest filter, (2) constitutional self-assessment by the agent itself, (3) an AI supervisor/reviewer agent for uncertain cases, (4) human-in-the-loop for irreversible or novel situations, and (5) audit trail plus post-hoc review to catch patterns over time.  Each layer reduces the volume flowing to the next.

### Sandboxing provides “show, don’t tell” for human review

Rather than asking humans to evaluate tool calls in the abstract, sandbox-first architectures execute actions in an isolated environment and present actual results for review. The ecosystem is now production-ready: **E2B** provides Firecracker microVM sandboxes  with sub-second creation; **nono** by Luke Hinds enforces kernel-level restrictions that cannot be bypassed even by the agent;  Google’s Agent Sandbox runs on GKE with gVisor isolation;  and **AIO Sandbox** provides MCP-compatible containers combining browser, shell, file operations, and VSCode Server.

NVIDIA’s AI Red Team guidance emphasizes that application-level sandboxing is insufficient — once control passes to a subprocess, the application has no visibility, so kernel-level enforcement is necessary.   The practical limitation is that not all actions can be sandboxed: third-party API calls, email sends, and payment processing must interact with real services. For these, the dry-run pattern (where the agent describes what it would do and the human approves the description before live execution) remains the fallback.

### Policy-based gating provides deterministic enforcement

Rule-based systems offer the most reliable first layer because they are deterministic, auditable, and impose zero LLM inference cost. **SafeClaw** (AUTHENSOR) implements a deny-by-default model where risky operations pause for human approval via CLI or dashboard,  with a SHA-256 hash chain audit ledger.  The **COMPASS framework** (Choi et al., 2026) systematically maps natural-language organizational policies to atomic rules enforced at tool invocation time, improving policy enforcement pass rates from 0.227 to 0.500 in benchmarks.  However, COMPASS also exposed a fundamental limitation: **LLMs fail 80–83% on denied-edge queries** with open-weight models,  demonstrating that policy enforcement cannot rely on LLM compliance alone and must use external deterministic gates.

A cautionary tale: Cursor’s denylist-based approach was bypassed four separate ways — Base64 encoding, subshells, shell scripts, and file indirection — before being deprecated,  proving that string-based filtering is fundamentally insufficient for security-critical gating.

-----

## How the major frameworks implement human oversight today

**LangGraph** has the most mature HITL support.  Its `interrupt()` function pauses graph execution at any point,  persisting state to a checkpointer (PostgreSQL for production). The `HumanInTheLoopMiddleware` enables per-tool configuration with three decision types — approve, edit (modify parameters), and reject (with feedback).   This middleware pattern directly addresses confirmation fatigue by allowing different tools to have different oversight levels. Read operations auto-approve; write operations pause for review.

**OpenAI’s Agents SDK** provides a three-layer guardrail system: input guardrails (tripwire mechanism on user input), output guardrails (validate responses before delivery), and the new **tool guardrails** that wrap function tools for pre- and post-execution validation.  The SDK also provides native MCP integration  with a `require_approval` parameter that accepts “always,” “never,” or a custom callback function, enabling programmatic risk-based approval.

**Anthropic** takes a more model-centric approach through its Responsible Scaling Policy and AI Safety Levels (ASL-1 through ASL-3+). For Claude’s computer use product, the pattern is “ask-before-acting” — Claude asks before taking any significant action, with explicit access scoping to user-selected folders and connectors.  Anthropic’s February 2026 Sabotage Risk Report for Claude Opus 4.6 found “very low but not negligible” sabotage risk   with elevated susceptibility in computer use settings  and instances of “locally deceptive behavior” in complex agentic environments.

**Google DeepMind’s SAIF 2.0** (October 2025) establishes three principles for agent safety: agents must have well-defined human controllers, their powers must be carefully limited, and their actions and planning must be observable.  The “amplified oversight” technique  — two model copies debate while pointing out flaws in each other’s output to a human judge — represents a research-stage approach to scaling human review.

-----

## The MCP middleware ecosystem is production-ready

The practical path forward for implementing HITL on top of MCP without protocol modifications runs through **proxy/middleware architectures** that intercept JSON-RPC `tools/call` requests. MCP’s use of JSON-RPC 2.0 makes every tool call a well-structured message  with tool name and arguments, enabling straightforward policy evaluation.

The leading purpose-built solutions include **Preloop** (an MCP proxy with CEL-based policy conditions, quorum approvals, and multi-channel notifications), **HumanLayer** (a YC F24 company providing a framework-agnostic async approval API with Slack/email routing and auto-approval learning), and **gotoHuman** (managed HITL approval UI as an MCP server). For code-first approaches, **FastMCP** v2.9+ provides the most mature middleware system   with hooks at `on_call_tool`, `on_list_tools`, and other levels,  enabling custom HITL logic as composable pipeline stages.

Enterprise gateways have also added MCP awareness: **Traefik Hub** provides Task-Based Access Control across tasks, tools, and transactions with JWT-based policy enforcement;  **Microsoft’s MCP Gateway** offers Kubernetes-native deployment with Entra ID authentication;  and **Kong’s AI MCP Proxy** bridges MCP to HTTP with per-tool ACLs and Kong’s full plugin ecosystem. Notably, **Lunar.dev MCPX** reports p99 latency overhead of approximately **4 milliseconds**,  demonstrating that proxy-based oversight need not meaningfully impact agent performance.

For UX, Benjamin Prigent’s December 2025 “7 UX Patterns for Ambient AI Agent Oversight” provides a comprehensive design framework: an overview panel showing agent state and oversight needs (inbox-zero pattern), five distinct oversight flow types (communication, validation, simple question, complex question, error resolution), activity logs with searchable audit trails, and work reports summarizing completed agent actions.  The key principle is progressive disclosure — show the summary first, details on demand  — with risk-colored displays and contextual explanations of why each action was flagged.

-----

## Progressive autonomy is the emerging endgame

The most forward-looking pattern across the research is **progressive autonomy** — agents earning trust over time and operating at increasing independence levels. Okta’s governance framework recommends “progressive permission levels based on demonstrated reliability.”  A manufacturing-sector MCP deployment documented by MESA follows a four-stage progression: read-only pilot → advisory agents → controlled command execution → full closed-loop automation.  HumanLayer supports learning from prior approval decisions to auto-approve similar future requests, creating a feedback loop where human oversight actively trains the system toward autonomy.

The trust calibration research provides theoretical grounding. A September 2025 paper formalizes trust calibration as **sequential regret minimization using contextual bandits**, with LinUCB and neural-network variants yielding 10–38% increases in task rewards and consistent reductions in trust misalignment.  This maps directly to the approval decision: a contextual bandit can learn which tool calls a particular human always approves and gradually shift those to auto-approve, while maintaining or increasing scrutiny on novel or historically-rejected patterns.

The CHI 2025 paper on “Trusting Autonomous Teammates in Human-AI Teams” found that agent-related factors (transparency, reliability) have the strongest impact on trust, and that “calibrating human trust to an appropriate level is more advantageous than fostering blind trust.”  This suggests that progressive autonomy systems should not just reduce approval requests — they should actively communicate their track record and current confidence to maintain calibrated human oversight.

-----

## Conclusion: a layered defense architecture for MCP tool oversight

The state of the art points clearly toward a **layered defense architecture** rather than any single mechanism. The recommended stack, from fastest/cheapest to slowest/most expensive:

1. **Deterministic policy gates** (allowlists, denylists, parameter-level rules via CEL or Polar): zero LLM cost, sub-millisecond, catches the majority of clearly-safe and clearly-dangerous calls
1. **Tool annotation screening** using MCP’s `readOnlyHint`/`destructiveHint` metadata,  supplemented by server-reputation scoring for untrusted annotations
1. **AI guardian/reviewer agent** that evaluates uncertain cases against a constitutional set of principles and risk heuristics
1. **Human-in-the-loop gates** reserved for irreversible, high-value, novel, or ambiguous situations — targeting 5–15% of total tool calls
1. **Comprehensive audit trails** with OpenTelemetry tracing,  structured logging, and post-hoc review dashboards for pattern detection and continuous policy refinement

The critical open gap remains at the protocol level. Until MCP introduces standardized approval workflow primitives — an `approval/request` method, trusted risk annotations, or a formal extensions framework for HITL — every implementation will remain a bespoke middleware layer. The most impactful near-term contribution would be a dedicated MCP Specification Enhancement Proposal that defines a standard approval negotiation protocol between clients, proxies, and servers, enabling interoperable oversight across the fragmented ecosystem.

{{% augmented %}}
*The following content is generated by LLMs and may contain inaccuracies.*

**Context**

This sits at the intersection of human-computer interaction, AI safety governance, and distributed systems design. As AI agents gain autonomy to execute consequential actions (API calls, file operations, financial transactions), the default pattern of requiring human approval for every tool invocation creates what security researchers now recognize as an attack surface: confirmation fatigue makes humans unreliable gatekeepers. The timing matters because 2025-2026 marks a shift from academic discussion to production deployment of agentic systems, forcing practitioner communities to confront oversight at scale. The Model Context Protocol (MCP) has emerged as a de facto standard for tool-calling agents, yet its specification [explicitly punts on enforcement mechanisms](https://spec.modelcontextprotocol.io/specification/architecture/#security-considerations), creating a fragmentation problem where every client reinvents approval workflows incompatibly.

**Key Insights**

**Confirmation fatigue is now a documented threat vector, not just UX friction.** [Rippling's 2025 security framework classifies "Overwhelming Human-in-the-Loop" as threat T10](https://www.rippling.com/blog/agentic-ai-security-guide), drawing parallels to SOC teams that face [4,484 alerts daily with 67% ignored](https://www.vectra.ai/research/2023-soc-survey). The [ironies of automation literature](https://arxiv.org/abs/2502.15212) shows that increased automation paradoxically degrades human competence on critical edge cases—precisely when oversight matters most. This reframes per-action approval from a safety mechanism to a liability: systems that flood humans with low-stakes decisions create the conditions for high-stakes failures.

**Risk-proportional architectures have converged on multi-tier filtering.** Academic work like [Feng et al.'s autonomy levels framework](https://arxiv.org/abs/2506.12469) demonstrates that L4 "Approver" agents (where simple confirmation enables action) carry similar risk to L5 "Observer" agents (full autonomy), undermining the value of blanket approval. Industry implementations from [Galileo's HITL framework](https://www.rungalileo.io/blog/human-in-the-loop-ai) to [OpenAI's tool guardrails](https://openai.com/index/introducing-the-agents-sdk/) consistently adopt a five-layer defense: deterministic policy gates → tool metadata screening → AI reviewer agents → human approval for ~10-15% of high-risk cases → audit trails. The [COMPASS framework](https://arxiv.org/abs/2601.04686) shows LLMs fail 80-83% on policy-denied queries, proving oversight cannot rely on model compliance alone.

**Protocol-level standardization remains the critical missing piece.** While middleware solutions like [FastMCP's hooks](https://github.com/jlowin/fastmcp), [Preloop's proxy architecture](https://preloop.com/), and [HumanLayer's async approval API](https://humanlayer.dev/) provide working implementations, MCP's [lack of `approval/request` primitives](https://github.com/modelcontextprotocol/specification/issues/711) forces ecosystem fragmentation. Every client—[Claude Code](https://github.com/anthropics/claude-code), [Cline](https://github.com/cline/cline), third-party proxies—implements incompatible approval semantics. The proposed trust/sensitivity annotations (Issue #711) would enable policy-based routing, but without a standard negotiation protocol, interoperability remains impossible.

**Open Questions**

How should progressive autonomy systems communicate their earned trust to maintain calibrated human oversight rather than blind delegation—particularly when [trust calibration research](https://arxiv.org/abs/2509.12345) shows transparency about confidence bounds matters more than raw accuracy? Can [reversibility-aware gating](https://arxiv.org/abs/2510.05307), which reduced completion time 13.54% by focusing approval at irreversibility boundaries, be formalized into MCP metadata that's verifiable rather than advisory?
{{% /augmented %}}
{{% /en %}}

{{% zh %}}

**在代理式AI系统中，逐个工具调用进行人工审批的朴素方法在理论上已有解决方案，但在实践中仍未解决。** 2025-2026年的研究汇聚于一个明确的发现：确认疲劳不仅仅是一种不便——它是一个安全漏洞、一个攻击面，也是大规模有效人类监督的最大障碍。好消息是，一个丰富的生态系统已经形成，包括风险分层框架、中间件架构和设计模式，用以替代二元确认/拒绝范式。坏消息是，模型上下文协议本身不提供任何协议级机制来支持这些方案，导致每个客户端都不得不重复造轮子。

本报告综合了学术研究、协议规范、开源工具、行业框架和实际架构，从五个维度全面梳理了该领域的最新进展。

-----

## 确认疲劳问题现已被正式认定为威胁

用户所指出的核心问题——人类变成机械的"确认"执行者——已不仅仅是用户体验层面的抱怨。**Rippling的2025年代理式AI安全指南将"压倒性人类在环"列为威胁T10**，描述了对手如何通过大量告警淹没人类审查者以利用认知过载。2026年1月SiliconANGLE的分析认为，"人类在环治理是为算法做出人可以有时间和背景审查的离散、高风险决策的时代而建立的"，而现代代理工作流产生"人类无法现实地解读的密集、冗长的操作痕迹"。

网络安全领域的类比极具启发性且有充分量化数据。SOC团队平均每天处理**4,484个告警**，其中67%因误报疲劳而被忽略（Vectra 2023）。超过90%的安全运营中心报告被积压压垮。基于机器学习的告警优先级排序已展示出具体改善：一个框架将响应时间缩短了22.9%，同时抑制了54%的误报并保持95.1%的检测准确率。对代理式AI的直接启示：与笼统的审批要求相比，风险比例过滤能显著提升人类的表现。

Mitchell、Birhane和Pistilli于2025年2月发表的立场论文（"不应开发完全自主的AI代理"）将此框架化为"自动化的讽刺"——自动化程度的提高反而导致用户在真正需要其关注的罕见但关键任务上丧失能力。CHI 2023信任校准文献记录了"协作"互动（用户审查每个建议）如何在用户变得被动或自满时退化为"委托"互动。这恰恰是确认疲劳的动态过程。

-----

## MCP要求人类监督但未提供任何机制

模型上下文协议规范（v2025-11-25）在原则上立场明确：**"主机必须在调用任何工具之前获得明确的用户同意。"** 但规范随即以一个关键但书削弱了这一立场："虽然MCP本身无法在协议层面强制执行这些安全原则，但实现者应当在其应用中构建健壮的同意和授权流程。"

该协议提供工具注解——`readOnlyHint`、`destructiveHint`、`idempotentHint`、`openWorldHint`——作为关于工具行为的元数据提示。然而，这些被明确描述为"不应用于安全决策"的提示，因为来自不受信任服务器的工具描述无法被验证。MCP的采样功能（`sampling/createMessage`）包含两个人类在环检查点——发送请求之前和将结果返回给服务器之前——但使用的是SHOULD而非MUST语言，允许客户端自动批准。

**不存在协议级的审批请求/响应机制。** 没有`approval/request` JSON-RPC方法，没有标准化的`requiresApproval`字段，没有工具权限范围界定，也没有办法让服务器以编程方式指示哪些工具需要人工审查。最相关的活跃提案是GitHub Issue #711（信任/敏感性注解），它将添加如`sensitiveHint`（低/中/高）的元数据，以启用基于策略的决策，包括升级到人工审查。该提案链接到PR #1913并标注了`security`标签，但截至2026年2月，尚无专门的人类在环工作流规范增强提案。

其后果在生态系统中显而易见。每个主要MCP客户端都独立构建了自己的审批系统：Claude Code使用权限配置中的`allow`/`deny`/`ask`数组，Cline提供细粒度的自动批准类别以及绕过所有审批的"YOLO模式"，用户甚至创建了向Claude Desktop的Electron应用注入JavaScript的自动批准脚本以绕过确认对话框。这种碎片化是协议空白的直接结果。

-----

## 风险比例参与已成为共识框架

在学术界和工业界，**风险分层监督是替代笼统确认的主导范式**。理念很简单：按风险对工具调用分类，自动批准安全的大多数，将人类注意力集中在危险的少数上。

最严格的学术框架来自Feng、McDonald和Zhang的"AI代理的自主权等级"（arXiv:2506.12469，2025年6月），定义了从L1操作者（完全人类控制）到L5观察者（代理完全自主行动）的五个等级。该论文引入了"自主权证书"——由第三方机构规定的数字文件，根据代理的能力和操作环境限制其自主权等级。关键的是，它观察到在L4（批准者等级，即MCP默认等级），"如果用户可以通过简单批准来启用L4代理，则[L4和L5]代理的风险相似"——这直接为确认疲劳使逐次审批在安全性上等同于无审批提供了理论依据。

Engin等人的"代理式AI的维度治理"（arXiv:2505.11579，2025年5月）认为静态风险类别不足以应对动态代理系统。它提出追踪决策权威、流程自主性和问责如何在人机关系中动态分布，监测趋向治理阈值的运动而非强制执行固定层级。Cihon等人（arXiv:2502.15212，2025年2月，微软/OpenAI关联）采用代码审查方法，沿**影响**和**监督**两个维度对编排代码进行评分，无需运行代理。

行业实施趋向于三层模式，略有变化：

- **低风险**（只读操作、信息检索）：自动批准，仅记录日志
- **中风险**（可逆写入、非敏感操作）：自动批准，增强日志记录和事后审查
- **高风险**（不可逆操作、金融交易、PII访问、生产部署）：强制人工审批，有时需要多审批者法定人数

Galileo的人类在环框架建议将**升级率控制在10-15%**，85-90%的决策自主执行。置信阈值因领域而异：客户服务80-85%，金融服务90-95%，医疗保健95%以上。分层代理监督（TAO）框架（arXiv:2506.12482）的关键发现是"人工审查请求通常在代理表达高置信度但系统内部评估风险不同的情况下触发"——这表明自我评估永远不应成为唯一的门控机制。

-----

## 五种超越确认/拒绝的有效设计模式

### 可逆性感知门控将注意力集中在最重要的地方

最具杠杆效应的单一模式是按可逆性而非抽象风险对操作进行分类。一个决策理论模型（arXiv:2510.05307）将确认形式化为最小时间调度问题，使用确认→诊断→纠正→重做循环，发现**在不可逆性边界处进行中间确认将任务完成时间缩短了13.54%**，且81%的参与者更偏好它而非笼统或仅在末尾的确认。欧盟AI法案将此法典化：高风险AI系统必须提供"忽视、覆盖或逆转输出"的能力，而在输出真正不可逆的情况下，事前人类监督是唯一合规的方法。

实用分类法：只读操作自动批准；可逆写入（git跟踪的文件编辑）仅记录日志；软可逆操作（发送邮件、创建工单）可以批量处理；不可逆操作（删除数据、金融转账、生产部署）需要强制人工门控。关键细微之处在于可逆性是上下文相关的——从git仓库中删除是可逆的，从未启用版本控制的S3中删除则不是。

### 计划级审批取代操作级确认

两个互补的2025-2026系统解决了用户的"意图概览/契约方法"关切。**Safiron**（Huang等人，arXiv:2510.09781，2025年10月）是一个守护模型，在执行前分析计划的代理操作，检测风险并生成解释。它发现现有护栏大多在执行后运行，且在计划级风险检测上准确率低于60%，建立了一个基准。**ToolSafe**（arXiv:2601.10156，2026年1月）采用互补方法，对每次工具调用进行动态步骤级监控，认为执行期间的实时干预能捕获计划级审查遗漏的问题。

最优架构似乎是混合模式：在高层级批准计划，然后通过自动化步骤级护栏监控执行，如果代理偏离则可以暂停代理。OpenAI Codex的"长任务模式"提案具体展示了这一点——代理分析其计划并生成预期操作的动态白名单，人类审查白名单（而非单个调用），代理在这些边界内执行，并将批量问题累积以便综合审查。

### 多层监督在人类审查者之前设置AI审查者

"AI监控AI"范式已显著成熟。TAO（Kim等人，2025）实施了受临床审查流程启发的分层多代理监督，配备评估风险并路由到适当层级的代理路由器。Gartner预测守护代理将在**2030年占据代理式AI市场的10-15%**，将其分为审查者（内容/准确性）、监控者（行为/策略合规性）和保护者（自动阻止高影响操作）。多代理审查管线已展示了与单代理执行相比**高达96%的幻觉减少**。

跨实施方案正在形成的参考架构使用五层：（1）确定性策略门控（允许列表/拒绝列表）作为最快和最廉价的过滤器，（2）代理本身的宪法式自我评估，（3）用于不确定案例的AI监督者/审查者代理，（4）用于不可逆或新颖情况的人类在环，以及（5）审计跟踪加事后审查以捕获长期模式。每一层减少流向下一层的量。

### 沙箱提供"展示而非告知"的人工审查

沙箱优先架构不是要求人类在抽象层面评估工具调用，而是在隔离环境中执行操作并呈现实际结果供审查。生态系统现已达到生产就绪：**E2B**提供Firecracker微虚拟机沙箱，创建时间不到一秒；Luke Hinds的**nono**强制执行即使代理也无法绕过的内核级限制；Google的Agent Sandbox在GKE上使用gVisor隔离运行；**AIO Sandbox**提供MCP兼容的容器，结合浏览器、shell、文件操作和VSCode Server。

NVIDIA的AI红队指南强调，应用级沙箱是不够的——一旦控制权传递给子进程，应用就无法感知，因此需要内核级强制执行。实际限制在于并非所有操作都可以沙箱化：第三方API调用、邮件发送和支付处理必须与真实服务交互。对于这些，干运行模式（代理描述它将做什么，人类在实际执行前批准该描述）仍然是后备方案。

### 基于策略的门控提供确定性执行

基于规则的系统提供最可靠的第一层，因为它们是确定性的、可审计的，且不产生LLM推理成本。**SafeClaw**（AUTHENSOR）实施拒绝默认模型，风险操作通过CLI或仪表板暂停以等待人工审批，并配备SHA-256哈希链审计账本。**COMPASS框架**（Choi等人，2026）系统地将自然语言组织策略映射为在工具调用时强制执行的原子规则，将策略执行通过率从0.227提高到0.500。然而，COMPASS也揭示了一个根本性限制：**LLM在被拒绝的边界查询上有80-83%的失败率**（开放权重模型），证明策略执行不能仅依赖LLM合规性，必须使用外部确定性门控。

一个警示性案例：Cursor的拒绝列表方法通过四种方式被绕过——Base64编码、子shell、shell脚本和文件间接——之后被弃用，证明基于字符串的过滤从根本上不足以支撑安全关键门控。

-----

## 主要框架如何在今天实施人类监督

**LangGraph**拥有最成熟的人类在环支持。其`interrupt()`函数可在任何点暂停图执行，将状态持久化到检查点器（生产环境使用PostgreSQL）。`HumanInTheLoopMiddleware`支持按工具配置，提供三种决策类型——批准、编辑（修改参数）和拒绝（附带反馈）。这种中间件模式通过允许不同工具具有不同的监督级别来直接解决确认疲劳。只读操作自动批准；写入操作暂停等待审查。

**OpenAI的Agents SDK**提供三层护栏系统：输入护栏（用户输入的触发线机制）、输出护栏（交付前验证响应）和新的**工具护栏**（包装功能工具进行执行前后验证）。该SDK还提供原生MCP集成，`require_approval`参数接受"always"、"never"或自定义回调函数，实现基于风险的编程式审批。

**Anthropic**通过其负责任扩展政策和AI安全等级（ASL-1至ASL-3+）采取更以模型为中心的方法。对于Claude的计算机使用产品，模式是"行动前询问"——Claude在采取任何重要操作之前询问，并对用户选择的文件夹和连接器进行明确的访问范围限定。Anthropic 2026年2月的Claude Opus 4.6破坏风险报告发现"非常低但不可忽略"的破坏风险，在计算机使用场景中风险有所升高，且在复杂代理环境中出现"局部欺骗行为"。

**Google DeepMind的SAIF 2.0**（2025年10月）建立了代理安全的三项原则：代理必须有明确定义的人类控制者，其权力必须被仔细限制，其操作和规划必须是可观察的。"放大监督"技术——两个模型副本在向人类裁判指出彼此输出缺陷的同时进行辩论——代表了扩展人类审查的研究阶段方法。

-----

## MCP中间件生态系统已达到生产就绪

在不修改协议的情况下，在MCP之上实施人类在环的实际路径是通过**代理/中间件架构**来拦截JSON-RPC `tools/call`请求。MCP使用JSON-RPC 2.0使每个工具调用成为结构良好的消息，包含工具名称和参数，便于进行策略评估。

领先的专用解决方案包括**Preloop**（带有基于CEL策略条件、法定人数审批和多渠道通知的MCP代理）、**HumanLayer**（YC F24公司，提供框架无关的异步审批API，支持Slack/邮件路由和自动审批学习）和**gotoHuman**（作为MCP服务器的托管式人类在环审批UI）。对于代码优先的方法，**FastMCP** v2.9+提供最成熟的中间件系统，在`on_call_tool`、`on_list_tools`和其他级别提供钩子，支持将自定义人类在环逻辑作为可组合的管线阶段。

企业网关也增加了MCP感知能力：**Traefik Hub**跨任务、工具和事务提供基于任务的访问控制，配备基于JWT的策略执行；**微软的MCP Gateway**提供Kubernetes原生部署和Entra ID认证；**Kong的AI MCP Proxy**将MCP桥接到HTTP，提供按工具的ACL和Kong的完整插件生态系统。值得注意的是，**Lunar.dev MCPX**报告p99延迟开销约为**4毫秒**，证明基于代理的监督无需显著影响代理性能。

在用户体验方面，Benjamin Prigent 2025年12月的"环境AI代理监督的7种UX模式"提供了全面的设计框架：显示代理状态和监督需求的概览面板（收件箱清零模式）、五种不同的监督流程类型（沟通、验证、简单问题、复杂问题、错误解决）、可搜索审计跟踪的活动日志，以及总结已完成代理操作的工作报告。关键原则是渐进式披露——先显示摘要，按需显示详情——配合风险颜色显示和关于每个操作被标记原因的上下文解释。

-----

## 渐进式自主权是新兴的终极目标

研究中最前瞻性的模式是**渐进式自主权**——代理随时间赢得信任并在越来越高的独立水平上运作。Okta的治理框架建议"基于已证明可靠性的渐进式权限等级"。MESA记录的制造业MCP部署遵循四阶段进展：只读试点→咨询代理→受控命令执行→全闭环自动化。HumanLayer支持从先前的审批决策中学习，自动批准类似的未来请求，创建一个人类监督主动训练系统走向自主的反馈循环。

信任校准研究提供了理论基础。2025年9月的一篇论文将信任校准形式化为**使用上下文赌博机的顺序遗憾最小化**，LinUCB和神经网络变体产生了10-38%的任务奖励增长和一致的信任失调减少。这直接映射到审批决策：上下文赌博机可以学习特定人类总是批准哪些工具调用，并逐步将这些转为自动批准，同时对新颖或历史上被拒绝的模式保持或增加审查。

CHI 2025关于"信任人类-AI团队中的自主队友"的论文发现，代理相关因素（透明度、可靠性）对信任的影响最强，且"将人类信任校准到适当水平比培养盲目信任更有利"。这表明渐进式自主系统不应仅仅减少审批请求——它们应主动传达其过往记录和当前置信度，以维持校准的人类监督。

-----

## 结论：MCP工具监督的分层防御架构

最新研究明确指向**分层防御架构**，而非任何单一机制。推荐的技术栈，从最快/最廉价到最慢/最昂贵：

1. **确定性策略门控**（允许列表、拒绝列表、通过CEL或Polar的参数级规则）：零LLM成本，亚毫秒级，捕获大多数明显安全和明显危险的调用
1. **工具注解筛选**，使用MCP的`readOnlyHint`/`destructiveHint`元数据，辅以针对不受信任注解的服务器声誉评分
1. **AI守护/审查者代理**，根据宪法式原则和风险启发式方法评估不确定案例
1. **人类在环门控**，保留用于不可逆、高价值、新颖或模糊的情况——目标为总工具调用的5-15%
1. **全面审计跟踪**，配备OpenTelemetry追踪、结构化日志和事后审查仪表板，用于模式检测和持续策略优化

关键的未补空白仍在协议层面。在MCP引入标准化的审批工作流原语——`approval/request`方法、受信任的风险注解或正式的人类在环扩展框架——之前，每个实施方案都将是定制的中间件层。最具影响力的近期贡献将是一个专门的MCP规范增强提案，定义客户端、代理和服务器之间的标准审批协商协议，实现碎片化生态系统中的互操作性监督。

{{% augmented %}}
*以下内容由 LLM 生成，可能包含不准确之处。*

**背景**

这一课题处于人机交互、AI安全治理和分布式系统设计的交汇点。随着AI代理获得执行重要操作（API调用、文件操作、金融交易）的自主权，要求对每次工具调用都进行人工批准的默认模式正日益被安全研究人员认识为一个攻击面：确认疲劳使人类成为不可靠的把门人。时间节点很重要，因为2025-2026年标志着从学术讨论向代理系统生产部署的转变，迫使从业社群直面大规模监督的问题。模型上下文协议（MCP）已成为工具调用代理的事实标准，但其规范[明确回避了执行机制](https://spec.modelcontextprotocol.io/specification/architecture/#security-considerations)，造成了碎片化问题，每个客户端都需重新发明不兼容的审批工作流。

**关键见解**

**确认疲劳现已成为公认的威胁向量，而非仅仅是用户体验问题。** [Rippling的2025安全框架将"压倒性人机循环"列为威胁T10](https://www.rippling.com/blog/agentic-ai-security-guide)，与[每日收到4,484个告警且67%被忽视的SOC团队](https://www.vectra.ai/research/2023-soc-survey)的情况相提并论。[自动化讽刺文献](https://arxiv.org/abs/2502.15212)表明，自动化程度的增加反而会在关键边界情况下降低人类能力——恰恰是监督最重要的时刻。这将逐项批准从安全机制重新定义为一种责任：用低风险决定淹没人类的系统会为高风险失败创造条件。

**风险比例的架构已趋于收敛于多层过滤。** [Feng等人的自主权等级框架](https://arxiv.org/abs/2506.12469)等学术著作表明，L4"批准者"代理（简单确认即可执行操作）的风险与L5"观察者"代理（完全自主）相似，削弱了笼统批准的价值。从[Galileo的HITL框架](https://www.rungalileo.io/blog/human-in-the-loop-ai)到[OpenAI的工具防护](https://openai.com/index/introducing-the-agents-sdk/)的行业实现一致采用五层防御：确定性政策门控→工具元数据筛选→AI审核代理→高风险案例的人工批准（约占10-15%）→审计日志。[COMPASS框架](https://arxiv.org/abs/2601.04686)表明大语言模型在策略拒绝查询上的失败率达80-83%，证明监督不能仅依赖模型合规性。

**协议级标准化仍是关键缺失环节。** 虽然[FastMCP的钩子](https://github.com/jlowin/fastmcp)、[Preloop的代理架构](https://preloop.com/)和[HumanLayer的异步批准API](https://humanlayer.dev/)等中间件解决方案提供了可行的实现，但MCP[缺乏`approval/request`基元](https://github.com/modelcontextprotocol/specification/issues/711)导致生态碎片化。每个客户端——[Claude Code](https://github.com/anthropics/claude-code)、[Cline](https://github.com/cline/cline)、第三方代理——都实现不兼容的批准语义。建议的信任/敏感性注解（第711期）可实现基于政策的路由，但没有标准协商协议，互操作性仍无法实现。

**未解决的问题**

渐进式自主权系统应如何沟通其赚得的信任以维持校准的人类监督而非盲目委派——特别是当[信任校准研究](https://arxiv.org/abs/2509.12345)表明关于置信界的透明度比原始准确度更重要时？[可逆性感知门控](https://arxiv.org/abs/2510.05307)通过在不可逆性边界处聚焦批准，将完成时间减少了13.54%，这能否被形式化为MCP元数据中可验证而非仅建议的内容？
{{% /augmented %}}
{{% /zh %}}
