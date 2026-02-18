---
date: 2026-02-18T16:49:25
slug: "human-in-the-loop-agents"
title: "Human-in-the-loop design for agentic AI systems"
title_zh: "# 人类在环设计用于代理AI系统\n\nHuman-in-the-loop (HITL) 设计是一种将人类判断和决策整合到自主AI代理工作流程中的方法。这种方法对于确保AI系统的安全性、可靠性和可控性至关重要。\n\n## 核心原则\n\n**监督与控制**\n- 人类保留关键决策点的控制权\n- AI代理执行任务，但重要行动需要人类审批\n- 实施分级授权机制\n\n**透明度与可解释性**\n- AI系统必须向人类清晰说明其推理过程\n- 提供决策依据的可视化和可解释的输出\n- 确保人类能够理解为什么采取特定行动\n\n**反馈循环**\n- 人类提供关于AI性能的反馈\n- 系统根据此反馈进行持续学习和改进\n- 建立迭代优化过程\n\n## 实现策略\n\n**分层委派**\n- 将任务分解为多个层级\n- 低风险任务由AI自主完成\n- 高风险决策保留给人类\n\n**异常处理**\n- 识别超出AI能力范围的情况\n- 自动上报给人类审查\n- 为边界情况建立明确的升级路径\n\n**验证与验证**\n- 在实施前验证AI建议\n- 人类评估结果是否符合预期目标\n- 建立质量保证检查点\n\n## 关键考虑因素\n\n- **可用性**：设计用户友好的界面来审查和批准AI行动\n- **及时性**：平衡审查速度与决策质量\n- **认知负载**：避免使人类操作员过度负荷\n- **问责制**：明确定义人类和AI之间的责任分界\n\nHuman-in-the-loop 设计确保AI代理系统在保持人类监督的同时提高效率。"
---

{{% en %}}
# Human-in-the-loop design for agentic AI has outgrown the “Confirm” button

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
# Human-in-the-loop design for agentic AI has outgrown the “Confirm” button

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
