---
date: 2026-04-04T00:00:00+01:00
toc: true
id:
slug: /posts/dark-forest-theory
tags:
    - 宇宙社会学
    - 博弈论
    - 决策理论
title: "Dark Forest Theory: A Formal Derivation"
title_zh: "黑暗森林理论：一个形式化推导"
---


{{% en %}}

## 0. Introduction

The "Dark Forest Theory" proposed by Liu Cixin in the *Three-Body Problem* series is a speculative theory about interaction strategies among cosmic civilizations. This article attempts to provide a rigorous formal derivation of the theory using tools from game theory and decision theory, starting from the axioms given in the novel.

The core argument proceeds in three steps: first, we prove that the two original axioms from the novel are insufficient on their own to derive the Dark Forest; then we supplement the necessary structural conditions and construct an incomplete information game model; finally, we derive sufficient conditions for the Dark Forest as a risk-dominant equilibrium and discuss the limitations of this conclusion.

## 1. Axiomatic System

Let $\mathcal{U}$ be the set of all civilizations in the universe, with $|\mathcal{U}| \geq 2$.

**Axiom A1 (Survival Axiom):** For any civilization $c_i \in \mathcal{U}$, survival is its highest-priority objective. Let $u_i$ be the utility function of civilization $c_i$, and $S_i$ be the event "civilization $c_i$ persists." Then:

$$\forall c_i \in \mathcal{U}, \quad \forall X: \quad u_i(S_i) > u_i(X \mid \neg S_i)$$

Survival has lexicographic priority.

**Axiom A2 (Finite Resources Axiom):** The total amount of matter and energy in the universe is finite. Let $R$ be the total resource quantity of the universe and $r_i(t)$ the resources held by civilization $c_i$ at time $t$. Then:

$$\sum_{i} r_i(t) \leq R, \quad \forall t$$

One civilization's resource expansion compresses the available resource space of others.

## 2. Insufficiency of the Axioms

Before proceeding to the formal derivation, it is necessary to address a fundamental question: can the Dark Forest be derived from A1 and A2 alone?

**Proposition 0: A1 and A2 alone cannot imply the Dark Forest.**

**Proof (by counterexample construction):** Let two civilizations $c_1, c_2$ satisfy A1 (survival priority) and A2 (finite resources). Consider scenarios in which any of the following additional conditions hold:

(a) **Verifiable intentions:** There exists a mechanism enabling $c_1$ to reliably verify $c_2$'s goodwill, and vice versa. In this case, both parties can confirm the other's non-hostility, and cooperation becomes a sustainable equilibrium.

(b) **Enforceable contracts:** There exists an enforceable interstellar treaty mechanism (e.g., arbitration by a super-civilization or some universe-level locking protocol), such that violators are punished. Cooperation can then be maintained by institutional means.

(c) **Defense significantly dominates offense:** If technological conditions make first strikes nearly impossible to succeed (defense costs are far lower than offense costs), then a surprise attack has no positive expected payoff, and the security dilemma does not escalate.

(d) **Minimal communication delay with frequent interaction:** If civilizations can interact at high frequency, then by the Folk Theorem, patient participants can sustain cooperative equilibria in repeated games.

Under any of these conditions, even with finite resources and survival priority, both parties may maintain peace through division of labor, trade, boundary agreements, or deterrence equilibria.

Therefore, A1 and A2 at most imply that "conflict pressure exists" or "a security dilemma may arise," but they cannot imply "one must remain silent and destroy upon discovery." $\square$

**Implication:** The Dark Forest is not a direct logical consequence of the two axioms. To complete the derivation, additional conditions regarding information structure, communication constraints, and capability evolution must be supplied.

## 3. Structural Conditions

The following five conditions, together with A1 and A2, constitute the minimal sufficient assumption set for the Dark Forest. Each condition is independent — it cannot be derived from the others — and removing any one may open a channel to cooperative equilibrium.

**Condition B1 (Anarchic Structure):** There exists no supra-sovereign institution in the universe capable of enforcing adjudication, punishing contract violations, or imposing peace. Formally, there is no external enforcement function $E$ such that any agreement $A_{ij}$ between civilizations can be credibly enforced.

**Condition B2 (Unverifiable Intentions):** For any two civilizations $c_i, c_j$, $c_i$ cannot reliably infer the true type $\theta_j \in \{\text{benign}, \text{hostile}, \text{neutral}\}$ of $c_j$. Let $m_j$ be any signal emitted by $c_j$. Then:

$$P(\theta_j \mid m_j) = P(\theta_j), \quad \forall m_j$$

Communication is cheap talk and carries no verifiable information about intentions. Benign and hostile civilizations can emit identical signals.

**Condition B3 (Light-Speed Lag):** Information propagation speed is bounded (at most the speed of light $c$). Let $d_{ij}$ be the distance between civilizations $c_i$ and $c_j$. The minimum round-trip communication delay is $\tau_{ij} \geq 2d_{ij}/c$. This implies:

- Verification cycles are extremely long: any information about the other party's current state is already outdated.
- Repeated game frequency is extremely low: the Folk Theorem requires sufficiently high interaction frequency and sufficiently low discount rates. When $\tau_{ij}$ is very large, the effective discount factor $\delta \approx e^{-r\tau_{ij}} \to 0$, making the Folk Theorem's cooperation conditions hard to satisfy.
- This is a physical constraint, independent of civilizations' willingness or technological level.

**Condition B4 (Technological Explosion):** A civilization's technological capability may undergo exponential growth in a time span far shorter than a communication cycle. Let $x_i(t)$ be the strategic capability of civilization $c_i$ at time $t$, with evolution:

$$x_i(t + \tau) = x_i(t) \cdot e^{g_i \tau + \xi_i}$$

where $g_i$ is the base growth rate and $\xi_i$ is a random term with positive variance $\sigma^2 > 0$. Since $\sigma^2 > 0$, a current $x_j(t) \ll x_i(t)$ does not constitute a reliable upper bound on $x_j(t + \tau)$.

**Condition B5 (First-Mover Advantage):** Once both parties have located each other, a first strike can, under certain parameter conditions, significantly increase the attacker's survival probability. Let $q_i$ be the probability of a successful first strike and $K_i$ the cost of striking. There exists a non-empty parameter interval in which the expected utility of a first strike exceeds that of restraint.

## 4. Formal Model

### 4.1 Utility Function

Let the extinction loss be $M$ (taken to be extremely large), the first-strike cost be $K_i$, and the ordinary gains from cooperation/trade be $G_i$. The utility of civilization $c_i$ is:

$$U_i = -M \cdot \mathbf{1}\{\text{extinction}\} - K_i \cdot \mathbf{1}\{\text{first strike}\} + \varepsilon G_i$$

where $M \gg K_i \gg \varepsilon G_i$. This structure directly reflects A1: survival overrides everything — no cooperation gain, however large, outweighs "not being annihilated."

### 4.2 Threat Probability

Define the following probabilities:

- $p$: prior probability that the other party is currently hostile
- $\gamma$: probability that the other party, currently non-hostile, evolves into a lethal threat within the verification window $\tau$ (driven by B4)
- Base threat probability: $\pi = 1 - (1-p)(1-\gamma)$

$\pi$ integrates two types of risk: the other party is dangerous now, or the other party is not dangerous now but will become so soon. By B4 ($\sigma^2 > 0$), $\gamma > 0$; by B2 (unverifiable intentions), $p$ cannot be updated to 0. Therefore $\pi > 0$.

## 5. Core Derivation

### Proposition 1: Peace Declarations Cannot Constitute Credible Commitments

By B2, signals carry no verifiable information. Any "I have no hostile intent" declaration is cheap talk: benign and hostile civilizations alike can emit identical signals.

Therefore, for any peace declaration $m$, as long as $\pi > 0$:

$$0 < P(\text{the other is a threat} \mid m) < 1$$

Communication cannot eliminate fear. Not because no one would express goodwill, but because hostile parties would express goodwill too.

### Proposition 2: The Chain of Suspicion Drives Subjective Threat Probability Toward 1

Under the constraints of B2 and B3, $c_i$ faces not only first-order uncertainty about "whether the other is dangerous," but also recursive higher-order uncertainty:

- Order 0: The other party may be a threat, with probability $\pi$
- Order 1: Even if the other party is not a base threat, it may preemptively strike out of fear of me
- Order 2: Even if the other party does not fear me, it may fear that I fear it...

Linearly approximating the "strike out of fear" probability as the current subjective threat estimate $r_n$, we obtain the recurrence:

$$r_0 = \pi, \qquad r_{n+1} = \pi + (1 - \pi) r_n$$

The meaning of this recurrence: the $(n+1)$-th order threat = base threat + (probability the other party is not a base threat but attacks due to $n$-th order fear).

**Solution:**

$$r_n = 1 - (1 - \pi)^{n+1}$$

**Limit:**

$$\lim_{n \to \infty} r_n = 1 \qquad (\text{provided } \pi > 0)$$

As long as the base threat probability is nonzero, the higher-order belief recurrence causes subjective threat perception to converge exponentially to 1.

**Robustness note on the linear approximation:**

The above recurrence assumes a linear reaction function. If the reaction function is nonlinear (e.g., a threshold effect where civilizations take no action when threat perception falls below some threshold $r^\text{*}$),

the chain of suspicion may not monotonically converge to 1 but instead have a stable intermediate fixed point $r^\text{*} < 1$. In such cases, the strong Dark Forest conclusion weakens to a "partial vigilance state." However, by A1 (extinction loss $M$ is extremely large),

a rational civilization's action threshold $r^\text{*}$ is pushed very low, and the linear approximation remains reasonable across most parameter ranges.

### Proposition 3: After Exposure, Preemptive Strike Becomes the Rational Strategy Across a Broad Parameter Range

Once both parties have located each other, the game enters the post-exposure phase. Civilization $c_i$ faces two choices:

**Expected utility of first strike (Attack):**

$$U_i(A) = -(1 - q_i) M - K_i$$

where $q_i$ is the probability of a successful strike. If the strike succeeds, survival; if it fails, extinction by retaliation.

**Expected utility of restraint (Wait):**

$$U_i(W) = -r_n M$$

where $r_n$ is the $n$-th order subjective threat probability (the probability the other party eventually attacks).

A first strike is preferable to waiting if and only if:

$$U_i(A) > U_i(W) \quad \Longleftrightarrow \quad r_n > 1 - q_i + \frac{K_i}{M}$$

Since $M$ is extremely large, $K_i / M \approx 0$. The condition simplifies to $r_n > 1 - q_i$.

By Proposition 2, $r_n$ increases monotonically with higher-order reasoning and approaches 1. Therefore, as long as the probability of a successful first strike $q_i$ is not extremely close to 0, the inequality is satisfied after finitely many levels of reasoning.

This is the post-exposure logic of the Dark Forest: not because the other party is certainly an enemy, but because under the conditions of unverifiable intentions and infinite extinction cost, "possibly an enemy" is sufficient to drive rational preemption.

### Proposition 4: Before Exposure, Hiding Dominates Revealing

Let the detection probability when civilization $c_i$ chooses to reveal be $\lambda_R$, and when it chooses to hide be $\lambda_H$, with $\lambda_R > \lambda_H$. Let the post-detection extinction risk be $r^\text{*}$ (determined by Proposition 3)

and the background extinction risk when undetected be $\bar{r}$, where $r^\text{*} > \bar{r}$. Let $B_i$ be the cooperation benefits of public exposure and $C_i$ the operational cost of hiding.

$$U_i(\text{reveal}) = -[\lambda_R r^\text{*} + (1 - \lambda_R) \bar{r}] M + B_i$$

$$U_i(\text{hide}) = -[\lambda_H r^\text{*} + (1 - \lambda_H) \bar{r}] M - C_i$$

The difference:

$$U_i(\text{reveal}) - U_i(\text{hide}) = (B_i + C_i) - (\lambda_R - \lambda_H)(r^\text{*} - \bar{r}) M$$

Therefore, as long as:

$$(\lambda_R - \lambda_H)(r^\text{*} - \bar{r}) M > B_i + C_i$$

we have $U_i(\text{hide}) > U_i(\text{reveal})$.

Since $M$ is extremely large, this inequality holds under the vast majority of parameter conditions. Even if public broadcasting only slightly increases the probability of detection, the amplification effect of extinction cost is sufficient to make broadcasting a negative-expected-value action.

## 6. Main Theorem

**Definition (Dark Forest State):** A system is in the Dark Forest state if for every civilization $c_i \in \mathcal{U}$, both of the following hold simultaneously:

1. Actively revealing one's own location decreases its expected survival rate
2. Once mutually located with another civilization, restraint is not a risk-dominant strategy

**Theorem (Sufficient Conditions for the Dark Forest):** In a civilization system satisfying A1, A2, and B1–B5, if the base threat probability $\pi > 0$, then there exists a risk-dominant sequential equilibrium:

1. **Pre-exposure:** Civilizations prefer hiding to active broadcasting (Proposition 4).
2. **Post-exposure:** Civilizations prefer preemptive strike to restraint, holding across a broad parameter range (Proposition 3).
3. **System level:** The multi-civilization environment exhibits widespread silence and low visibility. Moreover, the more conspicuous a civilization, the more likely it is to be detected and eliminated; the surviving sample is negatively selected by the "silence strategy."

**Proof sketch (backward induction):**

- Endgame stage: Once mutually located, by Propositions 2 and 3, preemptive strike dominates waiting when $r_n > 1 - q_i$. Since $r_n \to 1$, this condition is met after finitely many levels of reasoning.
- Preceding stage: Anticipating the post-exposure danger, by Proposition 4, hiding dominates revealing.
- Evolutionary level: In a multi-civilization environment, civilizations adopting the silence strategy have systematically higher survival probabilities than those adopting the exposure strategy, so long-run evolution selects for silence. $\square$

**Caveat on "unique equilibrium":** This theorem asserts that the Dark Forest is a risk-dominant equilibrium under the given conditions, but does not rule out the theoretical possibility of cooperative equilibria under certain extreme parameter combinations. Specifically, if $q_i$ is very small (strikes almost never succeed) or $B_i$ is very large (cooperation benefits are overwhelmingly high), a first strike may not satisfy the risk-dominance condition. However, under the premise that $M$ is extremely large, the parameter space for such exceptions is very narrow.

## 7. Connections to Classical Theory

### 7.1 Isomorphism with the Hobbesian State of Nature

The Dark Forest Theory is structurally isomorphic to the "state of nature" described by Hobbes in *Leviathan*:

| Hobbesian State of Nature        | Dark Forest                              | Corresponding Condition |
|----------------------------------|------------------------------------------|------------------------|
| No central authority (no Leviathan) | No universe-level governance body       | B1                     |
| Everyone seeks self-preservation | Civilizations prioritize survival        | A1                     |
| Fear of others' intentions       | Chain of suspicion                        | B2                     |
| Preemptive strike is rational    | Destroy upon discovery                    | B5                     |

The key difference lies in the exit mechanism: Hobbes argued that rational individuals could escape the state of nature by entering a social contract, delegating authority to a sovereign to maintain order. In the Dark Forest, B1 (no supra-sovereign institution), B2 (unverifiable intentions), and B3 (light-speed lag making interaction frequency extremely low) jointly block the path to establishing a social contract. Hobbes's "state of nature" has an exit; the Dark Forest (under the given conditions) does not.

### 7.2 Relation to the Fermi Paradox

The Fermi Paradox asks: if many civilizations exist in the universe, why have we observed no evidence of any?

The Dark Forest Theory offers one possible answer: civilizations exist, but silence is the equilibrium strategy. The absence of observable signals is not evidence that civilizations do not exist, but may instead indicate that civilizations are rationally hiding.

However, it should be noted that this is only one of many candidate explanations for the Fermi Paradox. Other explanations (the Great Filter hypothesis, the Zoo hypothesis, extremely short civilizational lifespans, etc.) can equally account for observational silence without relying on the strong assumptions of the Dark Forest. From the single fact that "we have detected no signals," it is impossible to determine which explanation is closer to reality.

## 8. Theoretical Limitations and Critiques

The above derivation is logically self-consistent within its assumption framework. However, each structural condition (B1–B5) can be challenged, and relaxing any one may fundamentally alter the equilibrium structure.

### 8.1 Fragility of the Unverifiable Intentions Assumption (Relaxing B2)

B2 assumes communication is completely untrustworthy. But game theory offers multiple mechanisms for breaking the cheap talk impasse:

**Costly signaling:** Conveying intention information by incurring an unforgeable cost (cf. Spence's education signaling model). A civilization could send credible signals through irreversible self-disarmament, resource gifts, or technology disclosure. The key requirement: the cost of faking such signals must be high enough that hostile parties are unwilling to pay it. Whether this is feasible at cosmic scales remains an open question.

**Repeated games and reputation:** If interactions between civilizations are repeated, the Folk Theorem shows that cooperation can be sustained as an equilibrium among participants with sufficiently high discount factor $\delta$. The Dark Forest indirectly suppresses $\delta$ through B3 (light-speed lag), but if two civilizations are close enough ($\tau_{ij}$ is sufficiently small), repeated-game cooperation remains theoretically viable.

**Third-party arbitration and institutions:** Trustless mechanisms such as blockchain or adjudication systems maintained by super-civilizations could partially substitute for credible commitments. B1 rules out this possibility, but B1 is itself an empirical assumption, not a logical necessity.

### 8.2 Questionability of the Technological Explosion Assumption (Relaxing B4)

B4 assumes high uncertainty in technological capability growth ($\sigma^2 > 0$). If $\sigma^2$ is constrained to be sufficiently small (i.e., technological development is smooth and predictable), then $\gamma \to 0$, the base threat probability $\pi \to p$, and the amplification effect of the chain of suspicion weakens.

From an empirical standpoint: while human history has seen periods of accelerated technological development, there has never been an instantaneous jump spanning orders of magnitude. Technological development may face physical upper bounds (thermodynamic limits, speed-of-light constraints, computational complexity lower bounds), making infinite explosion physically impossible. On the other hand, this possibility cannot be ruled out either, since we have only one civilization as a sample.

### 8.3 Strike Costs and Exposure Risk (Relaxing B5)

The model assumes first strikes have a positive net-benefit interval (B5). But at cosmic scales:

- Interstellar strikes require enormous energy investments; $K_i$ may not be negligible relative to $M$.
- The act of striking may itself expose the attacker's location to third-party civilizations $c_k$ (e.g., through observable energy-release signatures), increasing the attacker's risk. This means $U_i(A)$ should include an additional penalty term for "exposure to third parties."
- If defensive technology significantly dominates offensive technology ($q_i \to 0$), first strikes almost never succeed, and the attack option no longer has positive expected payoff.

### 8.4 Absolutization of the Survival Axiom (Relaxing A1)

A1 sets survival as the lexicographically highest priority. But civilizations may have more complex value systems:

- They may be willing to accept some survival risk in pursuit of other goals (knowledge, aesthetics, moral principles).
- The "better to kill by mistake" logic driven by extreme risk aversion may itself be considered an unacceptable moral cost.
- If the utility function is not lexicographic but instead admits a finite rate of substitution among objectives, then the extinction loss $M$ is no longer "infinite," and the model's extreme conclusions soften significantly.

### 8.5 Complexity of Multi-Civilization Extensions

The two-player analysis cannot be directly extended to $n$-player games. In a multi-civilization environment:

- **Coalition formation** may alter the equilibrium structure. If multiple civilizations can form defensive alliances, a single civilization's first strike faces coalition retaliation, reducing the expected payoff of an attack.
- **Signal externalities:** Even if one civilization is destroyed, the observable signals produced by the attack (energy release, matter ejection) may be detected by third parties, exposing the attacker's existence and location. This makes the net benefit of the attack strategy lower in multi-civilization environments than the two-player model predicts.
- These effects make the optimality of "destroy upon discovery" no longer certain in multi-civilization environments, but the conclusion that "hiding is preferable" may actually be strengthened (since exposure entails facing more potential adversaries).

### 8.6 Linearity Assumption in the Chain of Suspicion Recurrence

The recurrence $r_{n+1} = \pi + (1-\pi) r_n$ in Proposition 2 assumes a linear reaction function. This is a simplification for tractability, but if civilizations' decision-making exhibits threshold effects (no action is taken when threat perception falls below a threshold $r^\text{*}$), the fixed-point equation becomes:

$$r = \pi + (1-\pi) f(r)$$

where $f(r)$ is a nonlinear reaction function with $f(r) = 0$ when $r < r^\text{*}$. In this case, the system may have a stable intermediate fixed point, and the chain of suspicion does not converge to 1. Under such conditions, the Dark Forest conclusion must be weakened to a "local vigilance state."

However, since A1 sets the extinction loss to an extremely large value, the action threshold $r^\text{*}$ for rational civilizations is pushed very low, and the threshold effect does not alter the qualitative conclusion across most parameter ranges.

## 9. Conclusion

Translating the Dark Forest Theory of *Three-Body Problem* into rigorous game-theoretic form yields a clearer — and more circumscribed — conclusion:

**The two axioms "survival priority" and "finite resources" alone are insufficient to derive the Dark Forest.** What truly drives the system toward silence and preemption is the combination of unverifiable intentions (B2), light-speed communication lag (B3), uncertainty in technological capability growth (B4), and the possibility of positive first-mover payoffs (B5), all within an anarchic structure (B1). Finite resources (A2) functions more as an amplifier: it raises $\gamma$, making the Dark Forest easier to emerge, but even without extreme scarcity, the mechanisms above can still operate as long as the base threat probability $\pi > 0$.

The Dark Forest is a highly stable risk-dominant equilibrium under specific conditions, but it is not the universe's only possible fate. It provides sufficient conditions, not inevitability. Relaxing any one of B1–B5 may open a path toward cooperative equilibrium.

Thus, the Dark Forest Theory is less a moral judgment that "all civilizations in the universe are evil" than a cooler structural proposition:

> **In a universe where extinction cost overrides all else, intentions cannot be credibly verified, and communication delay renders repeated games ineffective, silence is more stable than goodwill.**

---

*Note: The formalization in this article is a theoretical reconstruction of the novel's text, not Liu Cixin's own formulation. Cosmic sociology as a discipline does not actually exist; its "axioms" can be neither verified nor falsified.*

{{% /en %}}

{{% zh %}}

## 0. 引言

刘慈欣在《三体》系列中提出的"黑暗森林理论"是一个关于宇宙文明间交互策略的推测性理论。本文试图从小说给出的公理出发，运用博弈论和决策理论的工具，对该理论进行严格的形式化推导。

文的核心论证分为三步：首先证明小说中的两条原始公理不足以单独推出黑暗森林；然后补充必要的结构性条件，构建不完全信息博弈模型；最后推导出黑暗森林作为风险占优均衡的充分条件，并讨论该结论的局限性。

## 1. 公理体系

设 $\mathcal{U}$ 为宇宙中所有文明的集合，$|\mathcal{U}| \geq 2$。

**公理 A1（生存公理）：** 对于任意文明 $c_i \in \mathcal{U}$，生存是其最高优先级目标。设 $u_i$ 为文明 $c_i$ 的效用函数，$S_i$ 为"文明 $c_i$ 存续"这一事件，则：

$$\forall c_i \in \mathcal{U}, \quad \forall X: \quad u_i(S_i) > u_i(X \mid \neg S_i)$$

生存是字典序意义上的最高优先级（lexicographic priority）。

**公理 A2（资源有限公理）：** 宇宙中的物质与能量总量有限。设 $R$ 为宇宙总资源量，$r_i(t)$ 为文明 $c_i$ 在时刻 $t$ 占有的资源量，则：

$$\sum_{i} r_i(t) \leq R, \quad \forall t$$

一个文明的资源扩张会压缩其他文明的可用资源空间。

## 2. 公理的不充分性

在进入形式化推导之前，有必要先回答一个基本问题：仅凭 A1 和 A2，能否直接推出黑暗森林？

**命题 0：仅由 A1 与 A2，不能推出黑暗森林。**

**证明（反例构造）：** 设两个文明 $c_1, c_2$ 满足 A1（生存优先）和 A2（资源有限）。考虑以下任一附加条件成立的情形：

(a) **意图可验证：** 存在某种机制使 $c_1$ 能够可靠验证 $c_2$ 的善意，且反之亦然。此时双方可以确认对方无敌意，合作成为可支撑的均衡。

(b) **可信契约可执行：** 存在可执行的星际协约机制（如由超文明仲裁或某种宇宙级锁定协议），使违约方被惩罚。此时合作可由制度维持。

(c) **防御显著优于进攻：** 若技术条件使得先发打击几乎无法成功（防御成本远低于进攻成本），则偷袭不具有正的期望收益，安全困境不会激化。

(d) **通信延迟极小且交互频繁：** 若文明间可以高频重复交互，由 Folk Theorem，耐心的参与者可以在重复博弈中维持合作均衡。

在上述任一条件下，即使资源有限且生存优先，双方仍可能通过分工、交换、边界划分或威慑均衡维持和平。

因此，A1 与 A2 最多推出"冲突压力存在"或"安全困境可能出现"，但不能推出"必须沉默且发现即摧毁"。$\square$

**含义：** 黑暗森林不是两条公理的直接逻辑后果。要完成推导，必须补充关于信息结构、通信约束和能力演化的条件。

## 3. 结构性条件

以下五个条件与 A1、A2 共同构成黑暗森林的最小充分假设组。每个条件都是独立的，不能从其他条件推出，且移除任一条件都可能打开合作均衡的通道。

**条件 B1（无政府结构）：** 宇宙中不存在能够执行裁决、惩罚违约、强制和平的超主权机构。形式化地，不存在一个外部执行函数 $E$ 使得任意文明间的协议 $A_{ij}$ 可被可信执行。

**条件 B2（意图不可验证）：** 对于任意两个文明 $c_i, c_j$，$c_i$ 无法可靠地推断 $c_j$ 的真实类型 $\theta_j \in \{\text{善意}, \text{恶意}, \text{中性}\}$。设 $m_j$ 为 $c_j$ 发出的任何信号，则：

$$P(\theta_j \mid m_j) = P(\theta_j), \quad \forall m_j$$

通信是 cheap talk，不携带可验证的意图信息。善意文明和恶意文明可以发出完全相同的信号。

**条件 B3（光速迟滞）：** 信息传播速度有限（不超过光速 $c$）。设文明 $c_i, c_j$ 之间的距离为 $d_{ij}$，则一次往返通信的最小延迟为 $\tau_{ij} \geq 2d_{ij}/c$。这意味着：

- 验证周期极长：任何关于对方当前状态的信息都已经是过时的。
- 重复博弈频率极低：由 Folk Theorem 的要求，合作均衡需要足够高的交互频率和足够低的折扣率。当 $\tau_{ij}$ 极大时，有效折扣因子 $\delta \approx e^{-r\tau_{ij}} \to 0$，Folk Theorem 的合作条件难以满足。
- 这是一个物理约束，不取决于文明的意愿或技术水平。

**条件 B4（技术爆炸可能）：** 文明的技术能力可能在远短于通信周期的时间内发生跳跃式增长。设 $x_i(t)$ 为文明 $c_i$ 在时刻 $t$ 的战略能力，其演化满足：

$$x_i(t + \tau) = x_i(t) \cdot e^{g_i \tau + \xi_i}$$

其中 $g_i$ 为基础增长率，$\xi_i$ 为带有正方差 $\sigma^2 > 0$ 的随机项。由于 $\sigma^2 > 0$，当前的 $x_j(t) \ll x_i(t)$ 不构成对 $x_j(t + \tau)$ 的可靠上界。

**条件 B5（先手正收益区间）：** 一旦双方相互定位，先发打击在某些参数条件下能显著提高攻击方的生存概率。设 $q_i$ 为先发打击成功概率，$K_i$ 为打击成本，存在非空的参数区间使得先发打击的期望效用高于克制等待。

## 4. 形式模型

### 4.1 效用函数

设灭绝损失为 $M$（取极大值），先发打击成本为 $K_i$，合作/交换等常规收益为 $G_i$。文明 $c_i$ 的效用为：

$$U_i = -M \cdot \mathbf{1}\{\text{灭绝}\} - K_i \cdot \mathbf{1}\{\text{先发打击}\} + \varepsilon G_i$$

其中 $M \gg K_i \gg \varepsilon G_i$。这个结构直接反映了 A1：生存压倒一切，合作收益再大也比不过"别被灭掉"。

### 4.2 威胁概率

定义以下概率：

- $p$：对方当前为敌对型的先验概率
- $\gamma$：对方当前非敌对，但在验证窗口 $\tau$ 内演化为致命威胁的概率（由 B4 驱动）
- 基础威胁概率：$\pi = 1 - (1-p)(1-\gamma)$

$\pi$ 综合了两类风险：对方现在就危险，或对方现在不危险但很快会变得危险。由 B4（$\sigma^2 > 0$），$\gamma > 0$；由 B2（意图不可验证），$p$ 无法被更新为 0。因此 $\pi > 0$。

## 5. 核心推导

### 命题 1：和平声明无法构成可信承诺

由 B2，信号不携带可验证信息。任何"我没有恶意"的声明都是 cheap talk：善意文明与恶意文明都能发出完全相同的信号。

因此，对任意和平声明 $m$，只要 $\pi > 0$：

$$0 < P(\text{对方是威胁} \mid m) < 1$$

通信不能消除恐惧。不是因为没有人会表达善意，而是因为恶意方也会表达善意。

### 命题 2：猜疑链使主观威胁概率趋近于 1

在 B2 和 B3 的约束下，$c_i$ 面临的不仅是"对方是否危险"的一阶不确定性，还有递归的高阶不确定性：

- 第 0 阶：对方可能是威胁，概率为 $\pi$
- 第 1 阶：即使对方不是基础威胁，它可能因为担心我而先发制人
- 第 2 阶：即使对方不担心我，它可能担心我担心它……

将"因恐惧而先打"的概率线性近似为当前主观威胁估计 $r_n$，得到递推关系：

$$r_0 = \pi, \qquad r_{n+1} = \pi + (1 - \pi) r_n$$

这个递推的含义是：第 $n+1$ 阶的威胁 = 基础威胁 + （对方不是基础威胁但因第 $n$ 阶恐惧而攻击的概率）。

**求解：**

$$r_n = 1 - (1 - \pi)^{n+1}$$

**极限：**

$$\lim_{n \to \infty} r_n = 1 \qquad (\text{只要 } \pi > 0)$$

只要基础威胁概率不为零，高阶信念的递推会使主观威胁感知指数级收敛到 1。

**关于线性近似的稳健性说明：**

上述递推假设反应函数是线性的。如果反应函数是非线性的（例如存在阈值效应：威胁感知低于某个门槛 $r^\text{*}$ 时文明不采取行动），猜疑链可能不会单调收敛到 1。

而是存在一个稳定的中间不动点 $r^\text{*} < 1$。

在这种情况下，黑暗森林的强结论会被弱化为"部分警惕态"。然而，由 A1（灭绝损失 $M$ 极大），理性文明的行动阈值 $r^\text{*}$ 会被压得很低，线性近似在大多数参数区间内仍是合理的近似。

### 命题 3：暴露后，先发制人在广泛参数区间内成为理性策略

一旦双方相互定位，博弈进入暴露后阶段。文明 $c_i$ 面临两个选择：

**先发打击（Attack）的期望效用：**

$$U_i(A) = -(1 - q_i) M - K_i$$

其中 $q_i$ 为打击成功概率。打击成功则存活，失败则被反击灭绝。

**克制等待（Wait）的期望效用：**

$$U_i(W) = -r_n M$$

其中 $r_n$ 为第 $n$ 阶主观威胁概率（对方最终攻击我的概率）。

先发打击优于等待，当且仅当：

$$U_i(A) > U_i(W) \quad \Longleftrightarrow \quad r_n > 1 - q_i + \frac{K_i}{M}$$

由于 $M$ 极大，$K_i / M \approx 0$。条件简化为 $r_n > 1 - q_i$。

由命题 2，$r_n$ 随高阶推理单调递增并趋近于 1。因此，只要先发打击的成功概率 $q_i$ 不是极端接近 0，上述不等式在有限阶推理后即可满足。

这就是黑暗森林的暴露后逻辑：不是因为对方一定是敌人，而是因为在无法验证对方意图、且灭绝代价无穷大的条件下，"可能是敌人"就足以驱动理性的先发制人。

### 命题 4：暴露前，隐藏优于公开

设文明 $c_i$ 选择公开暴露时被发现的概率为 $\lambda_R$，选择隐藏时为 $\lambda_H$，且 $\lambda_R > \lambda_H$。设被发现后的灭绝风险为 $r^\text{*}$（由命题 3 确定）。

未被发现时的背景灭绝风险为 $\bar{r}$，其中 $r^\text{*} > \bar{r}$。设公开暴露带来的合作收益为 $B_i$，隐藏的运营成本为 $C_i$。

$$U_i(\text{暴露}) = -[\lambda_R r^\text{*} + (1 - \lambda_R) \bar{r}] M + B_i$$

$$U_i(\text{隐藏}) = -[\lambda_H r^\text{*} + (1 - \lambda_H) \bar{r}] M - C_i$$

两者之差：

$$U_i(\text{暴露}) - U_i(\text{隐藏}) = (B_i + C_i) - (\lambda_R - \lambda_H)(r^\text{*} - \bar{r}) M$$

因此，只要：

$$(\lambda_R - \lambda_H)(r^\text{*} - \bar{r}) M > B_i + C_i$$

就有 $U_i(\text{隐藏}) > U_i(\text{暴露})$。

由于 $M$ 极大，这个不等式在绝大多数参数条件下成立。即使公开广播只略微提高被发现的概率，灭绝代价的放大效应也足以使广播成为负期望行为。

## 6. 主定理

**定义（黑暗森林态）：** 若对任意文明 $c_i \in \mathcal{U}$，同时满足：

1. 主动暴露自身位置会降低其期望生存率
2. 一旦与其他文明相互定位，克制等待不是风险占优策略

则称该系统处于黑暗森林态。

**定理（黑暗森林的充分条件）：** 在满足 A1、A2 与 B1 -- B5 的文明系统中，若基础威胁概率 $\pi > 0$，则存在一个风险占优的序贯均衡（risk-dominant sequential equilibrium）：

1. **暴露前：** 文明倾向于隐藏而非主动广播（命题 4）。
2. **暴露后：** 文明倾向于先发制人而非克制等待，在广泛的参数区间内成立（命题 3）。
3. **系统层面：** 多文明环境表现为广泛沉默和低可见度。此外，越高调的文明越容易被发现并淘汰，幸存样本被"沉默策略"负向筛选。

**证明思路（逆向归纳）：**

- 终局阶段：一旦相互定位，由命题 2 和命题 3，先发制人在 $r_n > 1 - q_i$ 时优于等待。由于 $r_n \to 1$，该条件在有限阶推理后成立。
- 前一阶段：预期到暴露后的危险，由命题 4，隐藏优于公开。
- 演化层面：在多文明环境中，采取沉默策略的文明生存概率系统性高于暴露策略的文明，因此长期演化会选择沉默策略。$\square$

**关于"唯一均衡"的限定：** 本定理断言黑暗森林是在给定条件下的风险占优均衡，但不排除在某些极端参数组合下合作均衡的理论可能性。具体而言，如果 $q_i$ 极小（打击几乎不可能成功）或 $B_i$ 极大（合作收益压倒性地高），先发打击可能不满足风险占优条件。但在 $M$ 极大的前提下，这些例外的参数空间非常狭窄。

## 7. 与经典理论的关联

### 7.1 与霍布斯自然状态的同构

黑暗森林理论在结构上与霍布斯在《利维坦》中描述的"自然状态"（state of nature）同构：

| 霍布斯自然状态           | 黑暗森林                    | 对应条件 |
|--------------------------|------------------------------|----------|
| 无中央权威（无利维坦）   | 无宇宙级治理机构            | B1       |
| 人人自保                 | 文明以生存为第一需要         | A1       |
| 对他人意图的恐惧         | 猜疑链                       | B2       |
| 先发制人是理性选择       | 发现即摧毁                   | B5       |

关键区别在于退出机制：霍布斯认为理性个体可以通过社会契约（social contract）委托主权者维持秩序，从而逃离自然状态。在黑暗森林中，B1（无超主权机构）、B2（意图不可验证）和 B3（光速迟滞使交互频率极低）共同阻断了社会契约的建立路径。霍布斯的"自然状态"有出口，黑暗森林（在给定条件下）没有。

### 7.2 与费米悖论的关系

费米悖论问：如果宇宙中存在大量文明，为什么我们没有观察到任何迹象？

黑暗森林理论提供了一个可能的回答：文明存在，但沉默是均衡策略。可观测信号的缺失不是文明不存在的证据，而可能是文明在理性地隐藏自己。

但需指出，这只是费米悖论的众多候选解释之一。其他解释（如大过滤器假说、动物园假说、文明寿命极短等）同样能解释观测上的沉默，且不依赖黑暗森林的强假设。仅从"我们没观测到信号"这一事实，无法判断哪种解释更接近真实。

## 8. 理论局限性与批判

上述推导在其假设框架内是逻辑自洽的。但每一条结构性条件（B1 -- B5）都可以被质疑，且放松任一条件都可能从根本上改变均衡结构。

### 8.1 意图不可验证假设的脆弱性（B2 的松弛）

B2 假设通信完全不可信。但博弈论中存在多种打破 cheap talk 困境的机制：

**Costly signaling（代价信号）：** 通过付出不可伪造的成本来传递意图信息（如 Spence 的教育信号模型）。文明可以通过不可逆的自我裁军、资源赠与或技术公开来发送可信信号。关键在于：这类信号的伪造成本必须高到恶意方不愿支付。在宇宙尺度上这是否可行，是一个开放问题。

**重复博弈与声誉：** 如果文明间的交互是重复的，Folk Theorem 表明合作可以在折扣因子 $\delta$ 足够大的参与者之间作为均衡被维持。黑暗森林通过 B3（光速迟滞）间接压低了 $\delta$，但如果两个文明距离足够近（$\tau_{ij}$ 足够小），重复博弈合作仍然理论上可行。

**第三方仲裁与制度：** 区块链式的去信任机制或超文明的裁决体系可以部分替代可信承诺。B1 排除了这种可能，但 B1 本身是一个经验假设，不是逻辑必然。

### 8.2 技术爆炸假设的可疑性（B4 的松弛）

B4 假设技术能力增长具有高不确定性（$\sigma^2 > 0$）。如果 $\sigma^2$ 被约束得足够小（技术发展平稳可预测），则 $\gamma \to 0$，基础威胁概率 $\pi \to p$，猜疑链的放大效应减弱。

从经验角度看：人类历史中的技术发展虽有加速期，但从未出现过跨数量级的瞬间跳跃。技术发展可能存在物理上限（热力学极限、光速约束、计算复杂性下界），使得无限爆炸在物理上不可能。但反过来也无法排除这种可能性，因为我们只有一个文明的样本。

### 8.3 打击成本与暴露风险（B5 的松弛）

模型假设先发打击有正的净收益区间（B5）。但在宇宙尺度上：

- 跨星际打击需要巨大能量投入，$K_i$ 可能不是相对于 $M$ 可忽略的。
- 打击行为本身可能暴露攻击者的位置于第三方文明 $c_k$（例如通过能量释放的可观测信号），增大攻击者的风险。这意味着 $U_i(A)$ 应包含一个"暴露于第三方"的额外惩罚项。
- 如果防御技术显著强于进攻技术（$q_i \to 0$），先发打击几乎不可能成功，$D$ 不再具有正的期望收益。

### 8.4 生存公理的绝对化（A1 的松弛）

A1 将生存设为字典序最高优先级。但文明可能有更复杂的价值体系：

- 愿意承担一定生存风险来追求其他目标（知识、美学、道德准则）。
- 极端风险规避导致的"宁可误杀"逻辑，本身可能被视为不可接受的道德代价。
- 如果效用函数不是字典序的，而是各目标间存在有限的替代率（finite rate of substitution），则灭绝损失 $M$ 不再是"无穷大"，模型的极端结论会显著软化。

### 8.5 多文明扩展的复杂性

二人博弈的分析不能直接推广到 $n$ 人博弈。在多文明环境中：

- **联盟形成（coalition formation）** 可能改变均衡结构。如果多个文明能够形成防御联盟，则单个文明的先发打击面临联盟报复，打击的期望收益下降。
- **信号外部性：** 即使消灭了一个文明，攻击行为产生的可观测信号（能量释放、物质抛射）可能被第三方探测到，暴露攻击者的存在和位置。这使得 $D$ 策略在多文明环境中的净收益比二人博弈模型预测的更低。
- 这些效应使得"发现即摧毁"在多文明环境下的最优性不再确定，但"倾向隐藏"的结论可能反而被强化（因为暴露后面临的潜在敌手更多）。

### 8.6 猜疑链递推的线性假设

命题 2 中的递推 $r_{n+1} = \pi + (1-\pi) r_n$ 假设反应函数是线性的。这是一个便于求解的简化，但如果文明的决策存在阈值效应（威胁感知低于门槛 $r^\text{*}$ 时不采取行动），递推的不动点方程变为：

$$r = \pi + (1-\pi) f(r)$$

其中 $f(r)$ 是一个非线性反应函数，$f(r) = 0$ 当 $r < r^\text{*}$。
此时系统可能存在稳定的中间不动点，猜疑链不会收敛到 1。

在这种情况下，黑暗森林的结论需要弱化为"局部警惕态"。但由于 A1 将灭绝损失设为极大值，理性文明的行动阈值 $r^\text{*}$ 会被压得非常低，阈值效应在多数参数区间内不改变定性结论。

## 9. 结论

将《三体》的黑暗森林理论翻译成严格的博弈论形式后，可以得到一个更清晰、也更有限度的结论：

**仅有"生存优先"和"资源有限"两条公理，不足以推出黑暗森林。** 真正将系统推向沉默与先发制人的，是无政府结构（B1）下的意图不可验证（B2）、光速导致的通信迟滞（B3）、技术能力增长的不确定性（B4），以及先手打击的正收益可能性（B5）。资源有限（A2）更像一个放大器：它提高了 $\gamma$，使黑暗森林更容易出现，但即使没有极端稀缺，只要基础威胁概率 $\pi > 0$，上述机制仍可能运转。

黑暗森林是一个在特定条件下非常稳定的风险占优均衡，但不是宇宙的唯一可能命运。它给出的是充分条件，不是必然性。放松 B1 -- B5 中的任意一条，均可能打开通向合作均衡的通道。

因此，黑暗森林理论与其说是"宇宙里的文明都是坏的"这样一个道德判断，不如说是一个更冷静的结构性命题：

> **在灭绝代价压倒一切、意图无法可信互证、通信延迟使重复博弈失效的宇宙里，沉默比善意更稳定。**

---

*附注：本文中的形式化是对小说文本的理论重构，并非刘慈欣本人的表述。宇宙社会学作为一个学科本身并不存在，其"公理"的真实性无法被验证或证伪。*

{{% /zh %}}