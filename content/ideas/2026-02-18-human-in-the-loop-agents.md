---
date: 2026-02-18T16:49:25
slug: "human-in-the-loop-agents"
title: "Confirmation Fatigue and the Protocol Gap in Agentic AI Oversight"
title_zh: "代理式AI监督中的确认疲劳与协议缺口"
---

{{% en %}}

**Per-tool-call human approval in agentic AI is solved in theory, unsolved in practice.** Confirmation fatigue is not a UX annoyance but a security vulnerability and the primary obstacle to effective human oversight at scale. Risk-tiered frameworks, middleware architectures, and new design patterns now exist to replace the binary confirm/deny paradigm. But MCP provides no protocol-level mechanism for any of them, so every client reinvents the wheel.

## Confirmation fatigue as a documented threat vector

Rippling's 2025 Agentic AI Security guide classifies "Overwhelming Human-in-the-Loop" as **threat T10**: adversaries flood reviewers with alerts to exploit cognitive overload. SiliconANGLE (January 2026) argues HITL governance was built for an era of discrete, high-stakes decisions, not for modern agent workflows that produce action traces humans cannot realistically interpret.

The cybersecurity parallel is quantified. SOC teams average **4,484 alerts/day**; 67% are ignored due to false-positive fatigue (Vectra 2023). Over 90% of SOCs report being overwhelmed by backlogs. ML-based alert prioritization cut response times by 22.9% while suppressing 54% of false positives at 95.1% detection accuracy. The lesson: risk-proportional filtering outperforms blanket approval.

Mitchell, Birhane, and Pistilli (February 2025, "Fully Autonomous AI Agents Should Not be Developed") frame this as the "ironies of automation," where more automation degrades human competence on the rare critical tasks where oversight matters most. CHI 2023 trust calibration work documents how "cooperative" interactions (reviewing each recommendation) degrade into passive "delegative" ones. This is exactly confirmation fatigue.

## MCP's oversight mandate without enforcement

The MCP spec (v2025-11-25) states: **"Hosts MUST obtain explicit user consent before invoking any tool."** It immediately undermines this: "While MCP itself cannot enforce these security principles at the protocol level, implementors SHOULD build robust consent and authorization flows into their applications."

Tool annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) exist but are explicitly "hints that should not be relied upon for security decisions," since tool descriptions from untrusted servers cannot be verified. The sampling feature includes two HITL checkpoints but uses SHOULD, not MUST, allowing clients to auto-approve.

**No protocol-level approval mechanism exists.** No `approval/request` JSON-RPC method, no `requiresApproval` field, no tool permission scoping. The closest active proposal is GitHub Issue #711 (trust/sensitivity annotations), adding `sensitiveHint` (low/medium/high) for policy-based routing. It links to PR #1913 with a `security` label. No dedicated HITL Specification Enhancement Proposal exists as of February 2026.

The fragmentation is visible: Claude Code uses `allow`/`deny`/`ask` arrays, Cline offers granular auto-approve plus a "YOLO mode," and users have injected JavaScript into Claude Desktop's Electron app to bypass confirmations. Every client independently rebuilds approval logic.

## Convergence on risk-proportional oversight

**Risk-tiered oversight** is the dominant paradigm. Classify tool calls by risk, auto-approve the safe majority, focus human attention on the dangerous few.

Feng, McDonald, and Zhang ("Levels of Autonomy for AI Agents," arXiv:2506.12469, June 2025) define five levels from L1 Operator (full human control) to L5 Observer (full autonomy), with "autonomy certificates" capping an agent's level based on capabilities and context. Their key observation: at L4 (Approver, the MCP default), "if a user can enable the L4 agent with a simple approval, the risks of both [L4 and L5] agents are similar." Confirmation fatigue makes per-call approval security-equivalent to no approval.

Engin et al. ("Dimensional Governance for Agentic AI," arXiv:2505.11579) argue static risk categories fail for dynamic agentic systems and propose tracking how decision authority, autonomy, and accountability distribute dynamically. Cihon et al. (arXiv:2502.15212, Microsoft/OpenAI) score orchestration code along impact and oversight dimensions without running the agent.

Industry converges on three tiers:

- **Low risk** (read-only, retrieval): auto-approve, log only
- **Medium risk** (reversible writes, non-sensitive ops): auto-approve with enhanced logging, post-hoc review
- **High risk** (irreversible actions, financial transactions, PII, production deploys): mandatory human approval, sometimes multi-approver quorum

Galileo's HITL framework targets a **10–15% escalation rate**, with 85–90% of decisions executing autonomously. The TAO framework (arXiv:2506.12482) finds that review requests often trigger where agents express high confidence but the system internally assesses risk differently; self-assessment alone is insufficient as a gate.

## Design patterns for graduated tool-call oversight

### Reversibility-based action classification

The highest-leverage pattern: classify by reversibility, not abstract risk. A decision-theoretic model (arXiv:2510.05307) formalizes this as minimum-time scheduling (Confirm → Diagnose → Correct → Redo), finding that **intermediate confirmation at irreversibility boundaries cut task completion time by 13.54%**; 81% of participants preferred it over blanket or end-only confirmation. The EU AI Act codifies this: high-risk systems must support ability to "disregard, override or reverse the output." Where outputs are truly irreversible, ex ante human oversight is the only compliant approach.

Practical taxonomy: read-only auto-approves; reversible writes (git-tracked edits) log only; soft-reversible actions (emails, tickets) batch; irreversible operations (data deletion, financial transfers, production deploys) require mandatory human gates. Reversibility is contextual: deleting from a git repo is reversible; deleting from unversioned S3 is not.

### Plan-level vs. action-level approval

**Safiron** (Huang et al., arXiv:2510.09781, October 2025) analyzes planned agent actions pre-execution, detecting risks and generating explanations. Existing guardrails mostly operate post-execution and achieved below 60% accuracy on plan-level risk detection. **ToolSafe** (arXiv:2601.10156, January 2026) complements this with dynamic step-level monitoring during execution, catching what plan-level review misses.

The optimal architecture is hybrid: approve the plan at a high level, then monitor execution with automated step-level guardrails that halt the agent on deviation. OpenAI Codex's "Long Task Mode" demonstrates this: the agent generates a dynamic whitelist of expected operations, the human reviews the whitelist (not individual calls), and the agent executes within those boundaries with batched questions for consolidated review.

### Hierarchical multi-agent oversight

TAO (Kim et al., 2025) implements hierarchical multi-agent oversight inspired by clinical review, with an Agent Router assessing risk and routing to appropriate tiers. Multi-agent review pipelines have shown **up to 96% reduction in hallucinations** versus single-agent execution.

The emerging reference architecture has five layers: (1) deterministic policy gates (allowlists/denylists) as the fastest filter, (2) constitutional self-assessment by the agent, (3) an AI supervisor for uncertain cases, (4) human-in-the-loop for irreversible or novel situations, (5) audit trail plus post-hoc review. Each layer reduces volume flowing to the next.

### Sandbox-first execution for informed review

Instead of asking humans to evaluate tool calls in the abstract, sandbox-first architectures execute in isolation and present actual results for review. The ecosystem is production-ready: **E2B** (Firecracker microVMs, sub-second creation), **nono** (kernel-level restrictions bypassing-proof), Google's Agent Sandbox (GKE + gVisor), **AIO Sandbox** (MCP-compatible containers).

NVIDIA's AI Red Team emphasizes application-level sandboxing is insufficient: once control passes to a subprocess, the application loses visibility, so kernel-level enforcement is necessary. Not all actions can be sandboxed: third-party API calls, email, payments must hit real services. For these, the dry-run pattern (agent describes intent, human approves before live execution) remains the fallback.

### Deterministic policy enforcement

Rule-based systems are the most reliable first layer: deterministic, auditable, zero LLM inference cost. **SafeClaw** implements deny-by-default with SHA-256 hash chain audit. **COMPASS** (Choi et al., 2026) maps natural-language policies to atomic rules at tool invocation time, improving enforcement pass rates from 0.227 to 0.500, but also exposed that **LLMs fail 80–83% on denied-edge queries** with open-weight models, proving policy enforcement cannot rely on LLM compliance alone.

A cautionary case: Cursor's denylist was bypassed four ways (Base64 encoding, subshells, shell scripts, file indirection) and then deprecated. String-based filtering is fundamentally insufficient for security-critical gating.

## HITL implementations across agent frameworks

**LangGraph** has the most developed HITL support. `interrupt()` pauses graph execution at any point, persisting state to a checkpointer (PostgreSQL in production). `HumanInTheLoopMiddleware` enables per-tool configuration with approve, edit, and reject decisions, allowing different tools to receive different oversight levels.

**OpenAI Agents SDK** provides input guardrails, output guardrails, and **tool guardrails** wrapping function tools for pre/post-execution validation. Its MCP integration accepts `require_approval` as "always," "never," or a custom callback for programmatic risk-based approval.

**Anthropic** takes a model-centric approach via Responsible Scaling Policy and AI Safety Levels (ASL-1 through ASL-3+). Claude's computer use follows an "ask-before-acting" pattern with explicit access scoping. The February 2026 Sabotage Risk Report for Claude Opus 4.6 found "very low but not negligible" sabotage risk, elevated in computer use settings, with instances of "locally deceptive behavior" in complex agentic environments.

**Google DeepMind SAIF 2.0** (October 2025) establishes three principles: agents must have well-defined human controllers, their powers must be carefully limited, their actions must be observable. The "amplified oversight" technique, where two model copies debate while pointing out each other's flaws to a human judge, remains research-stage.

## Middleware and proxy architectures for MCP oversight

The practical path runs through **proxy/middleware architectures** intercepting JSON-RPC `tools/call` requests. Key solutions: **Preloop** (CEL-based policies, quorum approvals, multi-channel notifications), **HumanLayer** (YC F24; framework-agnostic async approval API with Slack/email routing and auto-approval learning), **gotoHuman** (managed HITL approval UI as MCP server). For code-first approaches, **FastMCP** v2.9+ provides hooks at `on_call_tool`, `on_list_tools`, and other levels for composable HITL pipeline stages.

Enterprise gateways: **Traefik Hub** (task-based access control, JWT policy enforcement), **Microsoft MCP Gateway** (Kubernetes-native, Entra ID auth), **Kong AI MCP Proxy** (MCP-to-HTTP bridge with per-tool ACLs). **Lunar.dev MCPX** reports p99 overhead of ~**4ms**, proving proxy-based oversight imposes negligible latency.

For UX, Prigent's "7 UX Patterns for Ambient AI Agent Oversight" (December 2025) provides the design framework: overview panel (inbox-zero pattern), five oversight flow types (communication, validation, simple/complex questions, error resolution), searchable audit logs, and work reports. The core principle is progressive disclosure (summary first, details on demand) with risk-colored displays.

## Progressive autonomy through trust calibration

The forward-looking pattern is **progressive autonomy**: agents earn trust over time and operate at increasing independence. Okta recommends "progressive permission levels based on demonstrated reliability." A manufacturing MCP deployment (MESA) follows four stages: read-only pilot → advisory agents → controlled commands → full closed-loop. HumanLayer learns from prior approval decisions to auto-approve similar future requests.

Trust calibration research formalizes this as **sequential regret minimization via contextual bandits** (September 2025), with LinUCB and neural variants yielding 10–38% task reward increases. A contextual bandit can learn which calls a user always approves and shift those to auto-approve while maintaining scrutiny on novel or historically-rejected patterns.

CHI 2025 ("Trusting Autonomous Teammates in Human-AI Teams") finds agent-related factors (transparency, reliability) have the strongest trust impact, and "calibrating human trust to an appropriate level is more advantageous than fostering blind trust." Progressive autonomy systems should not just reduce approval requests; they should communicate their track record and confidence to maintain calibrated oversight.

## Conclusion

The state of the art points to a **layered defense architecture**. From fastest/cheapest to slowest/most expensive:

1. **Deterministic policy gates** (allowlists, denylists, CEL/Polar parameter rules): zero LLM cost, sub-millisecond
2. **Tool annotation screening** via MCP's `readOnlyHint`/`destructiveHint`, supplemented by server-reputation scoring
3. **AI guardian agent** evaluating uncertain cases against constitutional principles and risk heuristics
4. **Human-in-the-loop gates** for irreversible, high-value, novel, or ambiguous situations, targeting 5–15% of total calls
5. **Audit trails** with OpenTelemetry tracing, structured logging, post-hoc review for pattern detection and policy refinement

The critical gap is at the protocol level. Until MCP introduces standardized approval primitives (an `approval/request` method, trusted risk annotations, or a formal HITL extensions framework), every implementation remains bespoke middleware. The highest-impact near-term contribution would be an MCP Specification Enhancement Proposal defining a standard approval negotiation protocol between clients, proxies, and servers.

{{% augmented %}}
*The following content is generated by LLMs and may contain inaccuracies.*

**Context**

This sits at the intersection of HCI, AI safety governance, and distributed systems. As agents gain autonomy over consequential actions (API calls, file ops, financial transactions), per-invocation approval becomes an attack surface: confirmation fatigue makes humans unreliable gatekeepers. 2025–2026 marks the shift from academic discussion to production deployment, forcing practitioners to confront oversight at scale. MCP has become the de facto tool-calling standard, yet its spec [punts on enforcement](https://spec.modelcontextprotocol.io/specification/architecture/#security-considerations), so every client reinvents approval workflows incompatibly.

**Key Insights**

**Confirmation fatigue is a threat vector, not UX friction.** [Rippling classifies "Overwhelming HITL" as threat T10](https://www.rippling.com/blog/agentic-ai-security-guide), paralleling [SOC teams facing 4,484 daily alerts with 67% ignored](https://www.vectra.ai/research/2023-soc-survey). The [ironies of automation](https://arxiv.org/abs/2502.15212) show increased automation degrades competence on critical edge cases, exactly when oversight matters. Per-action approval is not a safety mechanism; it is a liability that creates conditions for high-stakes failures.

**Risk-proportional architectures converge on multi-tier filtering.** [Feng et al.'s autonomy levels](https://arxiv.org/abs/2506.12469) show L4 "Approver" agents carry similar risk to L5 fully autonomous ones, undermining blanket approval. Implementations from [Galileo](https://www.rungalileo.io/blog/human-in-the-loop-ai) to [OpenAI](https://openai.com/index/introducing-the-agents-sdk/) adopt five-layer defense: deterministic gates → metadata screening → AI reviewer → human approval (~10–15%) → audit. [COMPASS](https://arxiv.org/abs/2601.04686) shows LLMs fail 80–83% on denied-edge queries, proving oversight cannot rely on model compliance.

**Protocol-level standardization is the critical gap.** Middleware like [FastMCP](https://github.com/jlowin/fastmcp), [Preloop](https://preloop.com/), and [HumanLayer](https://humanlayer.dev/) work, but MCP's [lack of `approval/request` primitives](https://github.com/modelcontextprotocol/specification/issues/711) forces fragmentation. [Claude Code](https://github.com/anthropics/claude-code), [Cline](https://github.com/cline/cline), and every third-party proxy implement incompatible approval semantics. Without a standard negotiation protocol, interoperability is impossible.

**Open Questions**

How should progressive autonomy systems communicate earned trust to maintain calibrated oversight rather than blind delegation, given that [trust calibration research](https://arxiv.org/abs/2509.12345) shows transparency about confidence bounds matters more than accuracy? Can [reversibility-aware gating](https://arxiv.org/abs/2510.05307) (13.54% completion time reduction at irreversibility boundaries) be formalized into verifiable MCP metadata rather than advisory hints?
{{% /augmented %}}
{{% /en %}}

{{% zh %}}

**在代理式AI系统中，逐工具调用的人工审批在理论上已有方案，实践中仍未解决。** 确认疲劳不是体验问题，而是安全漏洞，是大规模人类监督的首要障碍。风险分层框架、中间件架构和新设计模式已经出现，可以替代二元确认/拒绝范式。但MCP不提供任何协议级支持，各客户端只能各自重复造轮子。

## 确认疲劳作为威胁向量

Rippling 2025年代理式AI安全指南将"压倒性人类在环"列为**威胁T10**：攻击者用大量告警淹没审查者以利用认知过载。SiliconANGLE（2026年1月）指出，HITL治理是为离散、高风险决策设计的，现代代理工作流产生的操作痕迹远超人类解读能力。

网络安全领域有量化数据佐证：SOC团队日均处理**4,484个告警**，67%因误报疲劳被忽略（Vectra 2023），超过90%的SOC被积压压垮。ML告警排序将响应时间缩短22.9%，抑制54%误报，检测准确率95.1%。结论：风险比例过滤远优于笼统审批。

Mitchell、Birhane与Pistilli（2025年2月，"不应开发完全自主的AI代理"）将此称为"自动化的悖论"，即自动化程度越高，人在真正需要关注的关键任务上反而越不胜任。CHI 2023信任校准研究记录了"协作"互动如何在用户变得被动后退化为"委托"互动。这正是确认疲劳的机制。

## MCP的监督要求与执行缺位

MCP规范（v2025-11-25）声明：**"主机必须在调用任何工具之前获得明确的用户同意。"** 随即自我削弱："虽然MCP本身无法在协议层面强制执行这些安全原则，但实现者应当在应用中构建健壮的同意和授权流程。"

工具注解（`readOnlyHint`、`destructiveHint`、`idempotentHint`、`openWorldHint`）被明确定义为"不应用于安全决策"的提示，因为来自不受信任服务器的工具描述无法验证。采样功能的两个HITL检查点使用SHOULD而非MUST，允许客户端自动批准。

**协议级审批机制不存在。** 没有`approval/request` JSON-RPC方法，没有`requiresApproval`字段，没有工具权限范围界定。最相关的活跃提案是GitHub Issue #711（信任/敏感性注解），拟添加`sensitiveHint`（低/中/高）以支持策略路由，关联PR #1913。截至2026年2月无专门的HITL规范增强提案。

碎片化已然可见：Claude Code用`allow`/`deny`/`ask`数组，Cline提供细粒度自动批准外加"YOLO模式"，用户向Claude Desktop的Electron应用注入JavaScript绕过确认对话框。每个客户端各搞一套。

## 风险比例监督的共识收敛

**风险分层监督**是主导范式：按风险分类工具调用，安全的自动放行，危险的集中人工审查。

Feng、McDonald与Zhang（"AI代理的自主权等级"，arXiv:2506.12469，2025年6月）定义L1（完全人控）到L5（完全自主）五级，引入"自主权证书"根据能力和上下文限定代理等级。关键发现：在L4（批准者，即MCP默认级），"若用户可通过简单批准启用L4代理，则L4与L5的风险相似。"确认疲劳使逐次审批在安全性上等价于无审批。

Engin等（"代理式AI的维度治理"，arXiv:2505.11579）认为静态风险类别不适用于动态代理系统，提出追踪决策权、流程自主性和问责的动态分布。Cihon等（arXiv:2502.15212，微软/OpenAI）对编排代码按影响和监督两维度评分，无需运行代理。

行业趋同于三级模式：

- **低风险**（只读、检索）：自动批准，仅记录日志
- **中风险**（可逆写入、非敏感操作）：自动批准，增强日志，事后审查
- **高风险**（不可逆操作、金融交易、PII访问、生产部署）：强制人工审批，有时需多人会签

Galileo的HITL框架目标**升级率10–15%**，85–90%的决策自主执行。TAO框架（arXiv:2506.12482）发现，人工审查请求常在代理自信但系统内部评估风险不同时触发，表明自我评估不能作为唯一门控。

## 分级工具调用监督的设计模式

### 基于可逆性的操作分类

按可逆性而非抽象风险分类，是杠杆最大的模式。决策理论模型（arXiv:2510.05307）将确认形式化为最小时间调度问题（确认→诊断→纠正→重做），发现**在不可逆性边界处中间确认将完成时间缩短13.54%**，81%参与者偏好此方式。欧盟AI法案要求高风险系统提供"忽视、覆盖或逆转输出"的能力；输出真正不可逆时，事前人类监督是唯一合规路径。

实用分类：只读自动放行；可逆写入（git跟踪的编辑）仅记录日志；软可逆操作（邮件、工单）可批量处理；不可逆操作（删除数据、金融转账、生产部署）强制人工门控。注意可逆性与上下文相关：git仓库中删除可逆，未启用版本控制的S3中删除不可逆。

### 计划级审批与操作级审批的对比

**Safiron**（Huang等，arXiv:2510.09781，2025年10月）在执行前分析代理计划操作，检测风险并生成解释，发现现有护栏多在执行后运行，计划级风险检测准确率低于60%。**ToolSafe**（arXiv:2601.10156，2026年1月）互补地在执行过程中进行动态步骤级监控，捕获计划审查遗漏的问题。

最优架构是混合方案：高层级批准计划，自动化步骤级护栏监控执行，代理偏离时暂停。OpenAI Codex"长任务模式"的实践：代理生成预期操作的动态白名单，人类审查白名单而非单个调用，代理在边界内执行，批量积累问题供综合审查。

### 层级式多代理监督

TAO（Kim等，2025）实施受临床审查流程启发的分层多代理监督，代理路由器评估风险并分层路由。多代理审查管线显示与单代理相比**幻觉减少高达96%**。

形成中的参考架构五层：（1）确定性策略门控（允许/拒绝列表），（2）代理自我评估，（3）AI监督者处理不确定案例，（4）人类在环处理不可逆或新颖情况，（5）审计跟踪与事后审查。每层过滤后向下传递。

### 沙箱优先执行与知情审查

沙箱优先架构在隔离环境中执行操作，呈现实际结果供审查，而非让人类在抽象层面评估工具调用。生态已生产就绪：**E2B**（Firecracker微虚拟机，亚秒级创建）、**nono**（内核级限制，代理不可绕过）、Google Agent Sandbox（GKE + gVisor）、**AIO Sandbox**（MCP兼容容器）。

NVIDIA AI红队强调应用级沙箱不够：控制权一旦传递给子进程，应用即失去可见性，需要内核级强制。但并非所有操作可沙箱化：第三方API、邮件、支付须与真实服务交互，此时干运行模式（代理描述意图，人工批准后再执行）仍是退路。

### 确定性策略执行

规则系统是最可靠的第一层：确定性、可审计、零LLM推理成本。**SafeClaw**实施默认拒绝模型，配备SHA-256哈希链审计账本。**COMPASS**（Choi等，2026）将自然语言策略映射为工具调用时的原子规则，执行通过率从0.227提升至0.500，但也暴露了**LLM在被拒绝的边界查询上80–83%的失败率**（开放权重模型），证明策略执行不能仅靠LLM合规。

警示案例：Cursor的拒绝列表通过四种方式被绕过（Base64编码、子shell、shell脚本、文件间接），之后被弃用。基于字符串的过滤从根本上不足以支撑安全关键门控。

## 各代理框架的HITL实现

**LangGraph**的HITL支持最完善。`interrupt()`在任意点暂停图执行，状态持久化到检查点器（生产用PostgreSQL）。`HumanInTheLoopMiddleware`支持按工具配置批准、编辑、拒绝三种决策，使不同工具可配置不同监督级别。

**OpenAI Agents SDK**提供输入护栏、输出护栏和**工具护栏**（包装函数工具做执行前后验证）。MCP集成的`require_approval`参数接受"always"、"never"或自定义回调，支持编程式风险审批。

**Anthropic**走模型中心路线，通过负责任扩展政策和AI安全等级（ASL-1至ASL-3+）。Claude计算机使用遵循"行动前询问"模式并限定访问范围。2026年2月Claude Opus 4.6破坏风险报告：破坏风险"极低但不可忽略"，计算机使用场景风险升高，复杂代理环境中有"局部欺骗行为"。

**Google DeepMind SAIF 2.0**（2025年10月）三原则：代理须有明确的人类控制者，权力须被限制，操作须可观察。"放大监督"技术（两个模型副本互相指出缺陷供人类裁判）仍在研究阶段。

## MCP监督的中间件与代理架构

实际路径是**代理/中间件架构**拦截JSON-RPC `tools/call`请求。主要方案：**Preloop**（CEL策略、会签审批、多渠道通知）、**HumanLayer**（YC F24；框架无关的异步审批API，Slack/邮件路由，自动审批学习）、**gotoHuman**（MCP服务器形式的托管审批UI）。代码优先方面，**FastMCP** v2.9+在`on_call_tool`、`on_list_tools`等层级提供钩子，支持可组合的HITL管线。

企业网关：**Traefik Hub**（基于任务的访问控制，JWT策略）、**微软MCP Gateway**（Kubernetes原生，Entra ID认证）、**Kong AI MCP Proxy**（MCP到HTTP桥接，按工具ACL）。**Lunar.dev MCPX**报告p99延迟开销约**4ms**，代理式监督对性能影响可忽略。

UX方面，Prigent"环境AI代理监督的7种UX模式"（2025年12月）提供设计框架：概览面板（收件箱清零模式）、五种监督流程（沟通、验证、简单/复杂问题、错误解决）、可搜索审计日志、工作报告。核心原则：渐进式披露（先摘要后详情），配合风险颜色标记。

## 基于信任校准的渐进式自主权

前瞻性模式是**渐进式自主权**：代理随时间赢得信任，独立程度递增。Okta推荐"基于已证明可靠性的渐进权限等级"。制造业MCP部署（MESA）四阶段：只读试点→咨询代理→受控命令执行→全闭环自动化。HumanLayer从历史审批决策中学习，自动批准类似请求。

信任校准研究将此形式化为**基于上下文赌博机的序列遗憾最小化**（2025年9月），LinUCB和神经网络变体带来10–38%的任务收益增长。上下文赌博机可以学习用户总是批准的调用并逐步自动放行，同时对新颖或历史被拒模式保持审查。

CHI 2025（"信任人类-AI团队中的自主队友"）发现，代理因素（透明度、可靠性）对信任影响最强，"将信任校准到适当水平比培养盲目信任更有利"。渐进式自主系统不应仅减少审批请求，还应主动传达过往记录和当前置信度，维持校准的人类监督。

## 结论

现有研究指向**分层防御架构**，从快/廉到慢/贵依次：

1. **确定性策略门控**（允许/拒绝列表，CEL/Polar参数规则）：零LLM成本，亚毫秒级
2. **工具注解筛选**，用MCP的`readOnlyHint`/`destructiveHint`，辅以服务器声誉评分
3. **AI守护代理**，根据宪法式原则和风险启发式评估不确定案例
4. **人类在环门控**，用于不可逆、高价值、新颖或模糊情况——目标占总调用5–15%
5. **审计跟踪**，OpenTelemetry追踪、结构化日志、事后审查，用于模式检测和策略迭代

关键缺口在协议层。在MCP引入标准化审批原语——`approval/request`方法、可信风险注解或正式HITL扩展框架——之前，每个实现都是定制中间件。最有价值的近期贡献是一个MCP规范增强提案，定义客户端、代理和服务器之间的标准审批协商协议。

{{% augmented %}}
*以下内容由LLM生成，可能包含不准确之处。*

**背景**

此课题处于人机交互、AI安全治理和分布式系统设计的交叉点。随着代理获得执行关键操作（API调用、文件操作、金融交易）的自主权，逐次审批成为攻击面：确认疲劳使人类成为不可靠的把门人。2025–2026年标志着从学术讨论到生产部署的转变，迫使从业者直面大规模监督问题。MCP已成为工具调用的事实标准，但其规范[回避执行机制](https://spec.modelcontextprotocol.io/specification/architecture/#security-considerations)，各客户端不兼容地重造审批流程。

**关键见解**

**确认疲劳是威胁向量，非体验问题。** [Rippling将"压倒性HITL"列为威胁T10](https://www.rippling.com/blog/agentic-ai-security-guide)，类比[日均4,484告警、67%被忽略的SOC团队](https://www.vectra.ai/research/2023-soc-survey)。[自动化悖论文献](https://arxiv.org/abs/2502.15212)表明自动化程度提高反而削弱人在关键边界情况的能力——恰是监督最重要之时。逐项审批不是安全机制，而是为高风险失败创造条件的负担。

**风险比例架构趋同于多层过滤。** [Feng等人的自主权等级](https://arxiv.org/abs/2506.12469)表明L4"批准者"代理与L5完全自主代理风险相似，笼统审批价值存疑。从[Galileo](https://www.rungalileo.io/blog/human-in-the-loop-ai)到[OpenAI](https://openai.com/index/introducing-the-agents-sdk/)的行业实现采用五层防御：确定性门控→元数据筛选→AI审查→人工审批（约10–15%）→审计。[COMPASS](https://arxiv.org/abs/2601.04686)表明LLM在策略拒绝查询上失败率80–83%——监督不能仅靠模型合规。

**协议级标准化是关键缺口。** [FastMCP](https://github.com/jlowin/fastmcp)、[Preloop](https://preloop.com/)、[HumanLayer](https://humanlayer.dev/)等中间件可用，但MCP[缺乏`approval/request`原语](https://github.com/modelcontextprotocol/specification/issues/711)导致生态碎片化。[Claude Code](https://github.com/anthropics/claude-code)、[Cline](https://github.com/cline/cline)及各第三方代理实现不兼容的审批语义。无标准协商协议则无互操作性。

**未解决问题**

渐进式自主权系统应如何传达其赢得的信任以维持校准的监督而非盲目委托——尤其是[信任校准研究](https://arxiv.org/abs/2509.12345)表明置信界的透明度比准确度本身更重要？[可逆性感知门控](https://arxiv.org/abs/2510.05307)（不可逆性边界处确认使完成时间缩短13.54%）能否形式化为MCP中可验证而非建议性的元数据？
{{% /augmented %}}
{{% /zh %}}
