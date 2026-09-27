/-
  DarkForest.lean

  Machine-checked propositions for "Dark Forest Theory: A Formal Derivation"
  (https://changkun.de/blog/posts/dark-forest-theory/).

  Each theorem is named after the claim in the post that it checks. What is
  checked is the mathematics of the model: the utilities, thresholds,
  equilibrium conditions and recurrences. Whether the axioms describe any
  real universe is not something a proof assistant can settle.

  Checked with Lean 4 (leanprover/lean4:v4.35.0-rc3) and Mathlib at commit
  c55e6e786f49471c72fbddbec5415808896aec1e. Every theorem depends only on
  Lean's standard axioms (propext, Classical.choice, Quot.sound); none uses
  `sorry`.
  To check it yourself, create a Mathlib project
  (`lake +leanprover-community/mathlib4:lean-toolchain new df math`),
  copy this file into it, and run `lake env lean DarkForest.lean`.
-/
import Mathlib

namespace DarkForest

open Filter Topology

/-! ## Survival first (Axiom A1)

An outcome is a pair: whether the civilization survives, and its gain on
everything else. A1 orders outcomes lexicographically: survival first, then
the gain. -/

/-- A1's order on outcomes. -/
def lexLT (a b : Bool × ℝ) : Prop :=
  (a.1 = false ∧ b.1 = true) ∨ (a.1 = b.1 ∧ a.2 < b.2)

/-- A real-valued utility for A1's order: survival adds `Real.pi`, more than
the whole range of the arctangent of any gain. -/
noncomputable def uLex (a : Bool × ℝ) : ℝ := (if a.1 then Real.pi else 0) + Real.arctan a.2

/-- Because survival takes only two values, A1's order does have a
real-valued utility representation, unlike the lexicographic order on pairs
of real numbers. -/
theorem lex_representable (a b : Bool × ℝ) : lexLT a b ↔ uLex a < uLex b := by
  rcases a with ⟨sa, x⟩
  rcases b with ⟨sb, y⟩
  have hx1 := Real.arctan_lt_pi_div_two x
  have hx0 := Real.neg_pi_div_two_lt_arctan x
  have hy1 := Real.arctan_lt_pi_div_two y
  have hy0 := Real.neg_pi_div_two_lt_arctan y
  -- Same survival: simp compares the arctangents. Different survival:
  -- the arctangents lie within (-π/2, π/2), so the π decides.
  cases sa <;> cases sb <;> simp [lexLT, uLex] <;> linarith

/-- The additive utility of Section 4.1: survival counts `M`, the rest `g`. -/
def uAdd (M : ℝ) (a : Bool × ℝ) : ℝ := (if a.1 then M else 0) + a.2

/-- If other gains can be unbounded, no finite `M` respects A1: for any `M`
some gain makes extinction score above survival. -/
theorem additive_not_lex_of_unbounded (M : ℝ) :
    ∃ g : ℝ, uAdd M (true, 0) < uAdd M (false, g) :=
  ⟨M + 1, by simp [uAdd]⟩

/-- If other gains are bounded by `G`, any `M > 2G` makes the additive
utility order outcomes exactly as A1 does. -/
theorem additive_lex_of_bounded (M G : ℝ) (hM : 2 * G < M) (a b : Bool × ℝ)
    (ha : |a.2| ≤ G) (hb : |b.2| ≤ G) : lexLT a b ↔ uAdd M a < uAdd M b := by
  rcases a with ⟨sa, x⟩
  rcases b with ⟨sb, y⟩
  have hx := abs_le.mp ha
  have hy := abs_le.mp hb
  simp only at hx hy
  cases sa <;> cases sb <;> simp [lexLT, uAdd] <;> linarith

/-- For contrast, the lexicographic order on pairs of real numbers ... -/
def lexLTReal (a b : ℝ × ℝ) : Prop := a.1 < b.1 ∨ (a.1 = b.1 ∧ a.2 < b.2)

/-- ... which has no real-valued utility representation at all: each first
coordinate would need its own interval of utilities, each containing a
different rational number, and there are too many reals for that. -/
theorem lex_real_not_representable :
    ¬ ∃ u : ℝ × ℝ → ℝ, ∀ a b, lexLTReal a b ↔ u a < u b := by
  rintro ⟨u, hu⟩
  -- Each first coordinate x owns the interval (u (x,0), u (x,1)); pick a rational in it.
  have hlt : ∀ x : ℝ, u (x, 0) < u (x, 1) := fun x => (hu (x, 0) (x, 1)).mp (Or.inr ⟨rfl, zero_lt_one⟩)
  choose r hr using fun x => exists_rat_btwn (hlt x)
  -- Different first coordinates own disjoint intervals, so the rationals differ.
  have hinj : Function.Injective r := by
    intro x y hxy
    by_contra hne
    rcases lt_or_gt_of_ne hne with h | h
    · have := (hu (x, 1) (y, 0)).mp (Or.inl h)
      have h1 := (hr x).2; have h2 := (hr y).1
      rw [hxy] at h1
      linarith
    · have := (hu (y, 1) (x, 0)).mp (Or.inl h)
      have h1 := (hr y).2; have h2 := (hr x).1
      rw [hxy] at h2
      linarith
  -- An injection from ℝ into ℚ would make ℝ countable.
  exact Cardinal.not_countable_real (Set.countable_univ_iff.mpr hinj.countable)

/-! ## The base threat (Section 4.2) and cheap talk (Proposition 1) -/

/-- The base threat `π = 1 - (1 - p)(1 - γ)` is a probability, and positive
whenever the technological-explosion term `γ` is, even if no civilization is
hostile now. -/
theorem basePi_pos (p γ : ℝ) (hp0 : 0 ≤ p) (hp1 : p ≤ 1) (hγ0 : 0 < γ) (hγ1 : γ ≤ 1) :
    0 < 1 - (1 - p) * (1 - γ) ∧ 1 - (1 - p) * (1 - γ) ≤ 1 := by
  have h1 : 0 ≤ p * (1 - γ) := mul_nonneg hp0 (by linarith)
  have h2 : 0 ≤ (1 - p) * (1 - γ) := mul_nonneg (by linarith) (by linarith)
  constructor <;> nlinarith

/-- Proposition 1: B2 makes a signal independent of the sender's type,
`P(threat ∧ m) = P(threat) P(m)`, so the threat believed after any signal is
the prior. -/
theorem prop1_posterior_is_prior (pThreat pM pBoth : ℝ) (hm : 0 < pM)
    (hB2 : pBoth = pThreat * pM) : pBoth / pM = pThreat := by
  rw [hB2]; field_simp

/-- ... and so lies strictly between 0 and 1 whenever the prior does. -/
theorem prop1_cheap_talk (pThreat pM pBoth : ℝ) (hm : 0 < pM) (hB2 : pBoth = pThreat * pM)
    (h0 : 0 < pThreat) (h1 : pThreat < 1) : 0 < pBoth / pM ∧ pBoth / pM < 1 := by
  rw [prop1_posterior_is_prior pThreat pM pBoth hm hB2]; exact ⟨h0, h1⟩

/-! ## Utilities after mutual detection (Proposition 3)

`M` is the extinction loss, `K` the cost of striking, `q` the probability
that a strike succeeds (the same for both sides), and `r` the probability
that the other side strikes. Being struck kills with probability `q`; a
failed strike reveals the attacker, whose target then strikes back and kills
with probability `q`. -/

/-- Expected utility of waiting. -/
def uWait (M q r : ℝ) : ℝ := -(r * q * M)

/-- Expected utility of striking first. -/
def uAttack (M K q : ℝ) : ℝ := -((1 - q) * q * M) - K

/-- The threshold above which striking beats waiting. -/
noncomputable def threshold (M K q : ℝ) : ℝ := 1 - q + K / (q * M)

/-- Proposition 3: striking first beats waiting exactly when the other side's
strike probability exceeds `1 - q + K / (q M)`. -/
theorem prop3_threshold (M K q r : ℝ) (hM : 0 < M) (hq : 0 < q) :
    uWait M q r < uAttack M K q ↔ threshold M K q < r := by
  have hqM : 0 < q * M := mul_pos hq hM
  unfold uWait uAttack threshold
  constructor
  · intro h
    have h1 : K < (r - (1 - q)) * (q * M) := by nlinarith
    have h2 : K / (q * M) < r - (1 - q) := (div_lt_iff₀ hqM).mpr h1
    linarith
  · intro h
    have h1 : K / (q * M) < r - (1 - q) := by linarith
    have h2 : K < (r - (1 - q)) * (q * M) := (div_lt_iff₀ hqM).mp h1
    nlinarith

/-- A larger extinction loss lowers the threshold only to `1 - q`, not to 0. -/
theorem threshold_tendsto (K q : ℝ) (hq : 0 < q) :
    Tendsto (fun M => threshold M K q) atTop (𝓝 (1 - q)) := by
  have h : Tendsto (fun M : ℝ => K / (q * M)) atTop (𝓝 0) :=
    tendsto_const_nhds.div_atTop (tendsto_id.const_mul_atTop hq)
  have := (tendsto_const_nhds (x := 1 - q)).add h
  simpa [threshold] using this

/-- Proposition 0, one counterexample: if strikes never succeed, waiting is
strictly better than striking whenever striking costs anything. -/
theorem prop0_no_preemption_when_strikes_fail (M K r : ℝ) (hK : 0 < K) :
    uAttack M K 0 < uWait M 0 r := by
  unfold uAttack uWait; simp; linarith

/-! ## The post-exposure game is a stag hunt

A share `π` of civilizations strikes regardless; the non-hostile rest strike
with probability `a`. The other side then strikes with probability
`π + (1 - π) a`, and a non-hostile civilization strikes when that exceeds the
threshold `t`. -/

/-- The probability that the other side strikes. -/
def pStrike (π a : ℝ) : ℝ := π + (1 - π) * a

/-- Mutual restraint (`a = 0`) is an equilibrium exactly when `π ≤ t`. -/
theorem wait_equilibrium_iff (π t : ℝ) : ¬ (t < pStrike π 0) ↔ π ≤ t := by
  simp [pStrike]

/-- Mutual striking (`a = 1`) is an equilibrium exactly when `t < 1`. -/
theorem strike_equilibrium_iff (π t : ℝ) : t < pStrike π 1 ↔ t < 1 := by
  simp [pStrike]

/-- Striking is risk-dominant, the better reply to an even chance, exactly
when `t < (1 + π) / 2`. -/
theorem strike_risk_dominant_iff (π t : ℝ) : t < pStrike π (1 / 2) ↔ t < (1 + π) / 2 := by
  unfold pStrike; constructor <;> intro h <;> linarith

/-- With the threshold at its large-`M` limit `1 - q`, striking is
risk-dominant exactly when `q > (1 - π) / 2`. -/
theorem strike_risk_dominant_iff_q (π q : ℝ) :
    1 - q < pStrike π (1 / 2) ↔ (1 - π) / 2 < q := by
  unfold pStrike; constructor <;> intro h <;> linarith

/-! ## The chain of suspicion (Proposition 2)

`F r` is the share of non-hostile civilizations that would strike if they
believed the other side strikes with probability `r`: the distribution
function of their thresholds. Level 0 fears only the hostile share `π`. -/

/-- The chain: `r₀ = π`, `rₙ₊₁ = π + (1 - π) F rₙ`. -/
def chain (π : ℝ) (F : ℝ → ℝ) : ℕ → ℝ
  | 0 => π
  | n + 1 => π + (1 - π) * F (chain π F n)

/-- The post's original recurrence `rₙ₊₁ = π + (1 - π) rₙ`. -/
def linearChain (π : ℝ) : ℕ → ℝ
  | 0 => π
  | n + 1 => π + (1 - π) * linearChain π n

/-- The original recurrence has the closed form `1 - (1 - π)^(n+1)`. -/
theorem linearChain_closed (π : ℝ) (n : ℕ) :
    linearChain π n = 1 - (1 - π) ^ (n + 1) := by
  induction n with
  | zero => simp [linearChain]
  | succ n ih => rw [linearChain, ih]; ring

/-- ... and tends to 1 for every `0 < π ≤ 1`. -/
theorem linearChain_tendsto_one (π : ℝ) (h0 : 0 < π) (h1 : π ≤ 1) :
    Tendsto (linearChain π) atTop (𝓝 1) := by
  have hg : Tendsto (fun n : ℕ => (1 - π) ^ n) atTop (𝓝 0) :=
    tendsto_pow_atTop_nhds_zero_of_lt_one (by linarith) (by linarith)
  have hs : Tendsto (fun n : ℕ => (1 - π) ^ (n + 1)) atTop (𝓝 0) :=
    hg.comp (tendsto_add_atTop_nat 1)
  have := (tendsto_const_nhds (x := (1 : ℝ))).sub hs
  rw [sub_zero] at this
  exact this.congr (fun n => (linearChain_closed π n).symm)

/-- The original recurrence is the chain for thresholds spread uniformly over
`[0, 1]`, whose distribution function is the identity there. -/
theorem linear_is_uniform (π : ℝ) : chain π id = linearChain π := by
  funext n
  induction n with
  | zero => rfl
  | succ n ih => simp only [chain, linearChain, id, ih]

/-- Identical civilizations: everyone strikes above the common threshold. -/
noncomputable def stepF (t : ℝ) (r : ℝ) : ℝ := if t < r then 1 else 0

/-- If the base threat is at most the threshold, the chain never moves. -/
theorem chain_stops (π t : ℝ) (h : π ≤ t) (n : ℕ) : chain π (stepF t) n = π := by
  induction n with
  | zero => rfl
  | succ n ih => simp [chain, ih, stepF, not_lt.mpr h]

/-- If it exceeds the threshold, the chain reaches certainty in one step. -/
theorem chain_unravels (π t : ℝ) (h : t < π) (ht : t < 1) (n : ℕ) :
    chain π (stepF t) (n + 1) = 1 := by
  induction n with
  | zero => simp [chain, stepF, h]
  | succ n ih => rw [chain, ih]; simp [stepF, ht]

/-- In general the chain never passes a resting point: any `r̄ ≥ π` with
`π + (1 - π) F r̄ ≤ r̄` bounds it for ever, whatever `F` is, as long as it
is monotone. -/
theorem chain_le_resting_point (π : ℝ) (F : ℝ → ℝ) (hF : Monotone F) (hπ : π ≤ 1)
    (rbar : ℝ) (h0 : π ≤ rbar) (hfix : π + (1 - π) * F rbar ≤ rbar) (n : ℕ) :
    chain π F n ≤ rbar := by
  induction n with
  | zero => simpa [chain] using h0
  | succ n ih =>
    have hmul : (1 - π) * F (chain π F n) ≤ (1 - π) * F rbar :=
      mul_le_mul_of_nonneg_left (hF ih) (by linarith)
    simp only [chain]
    linarith

/-- So the chain reaches certainty only if no resting point lies below 1. -/
theorem chain_below_one_of_resting_point (π : ℝ) (F : ℝ → ℝ) (hF : Monotone F)
    (hπ : π ≤ 1) (rbar : ℝ) (h0 : π ≤ rbar) (hfix : π + (1 - π) * F rbar ≤ rbar)
    (hr : rbar < 1) (n : ℕ) : chain π F n < 1 :=
  lt_of_le_of_lt (chain_le_resting_point π F hF hπ rbar h0 hfix n) hr

/-! ## Hiding before exposure (Proposition 4)

`dR`, `dH`: probabilities of being detected when revealing or hiding;
`ρD`, `ρ0`: extinction risk once detected and while undetected; `B` the
benefit of revealing, `C` the cost of hiding. -/

/-- Expected utility of revealing. -/
def uReveal (M B dR ρD ρ0 : ℝ) : ℝ := -((dR * ρD + (1 - dR) * ρ0) * M) + B

/-- Expected utility of hiding. -/
def uHide (M C dH ρD ρ0 : ℝ) : ℝ := -((dH * ρD + (1 - dH) * ρ0) * M) - C

/-- Proposition 4: hiding beats revealing exactly when
`(dR - dH)(ρD - ρ0) M > B + C`. -/
theorem prop4_hide_iff (M B C dR dH ρD ρ0 : ℝ) :
    uReveal M B dR ρD ρ0 < uHide M C dH ρD ρ0 ↔ B + C < (dR - dH) * (ρD - ρ0) * M := by
  have key : uHide M C dH ρD ρ0 - uReveal M B dR ρD ρ0 = (dR - dH) * (ρD - ρ0) * M - (B + C) := by
    unfold uHide uReveal; ring
  constructor <;> intro h <;> linarith

/-- The risk once detected is positive as soon as any hostile share exists,
even if every non-hostile civilization waits (`a = 0`). -/
theorem rhoD_pos (π a q : ℝ) (hπ0 : 0 < π) (hπ1 : π ≤ 1) (ha : 0 ≤ a) (hq : 0 < q) :
    0 < pStrike π a * q := by
  unfold pStrike
  have : 0 ≤ (1 - π) * a := mul_nonneg (by linarith) ha
  exact mul_pos (by linarith) hq

/-- The silence half is robust: whenever detection is likelier for those who
reveal and detection raises the risk, a large enough extinction loss makes
hiding better, whatever the benefit of revealing and the cost of hiding. -/
theorem silence_for_large_M (B C dR dH ρD ρ0 : ℝ) (hd : dH < dR) (hρ : ρ0 < ρD) :
    ∃ M₀, ∀ M, M₀ < M → uReveal M B dR ρD ρ0 < uHide M C dH ρD ρ0 := by
  have hpos : 0 < (dR - dH) * (ρD - ρ0) := mul_pos (by linarith) (by linarith)
  refine ⟨(B + C) / ((dR - dH) * (ρD - ρ0)), fun M hM => ?_⟩
  rw [prop4_hide_iff]
  have h1 : B + C < M * ((dR - dH) * (ρD - ρ0)) := (div_lt_iff₀ hpos).mp hM
  nlinarith

/-! ## Equilibrium selection in a global game (Proposition 3)

The strike success `q` is not known exactly: each civilization sees a noisy
signal `x = q + e` of it, and a strategy says, for each signal, whether to
strike. The gain from striking at signal `x`, when the other side strikes with
probability `β`, is `m + π + (1 - π) β - 1`, where `m` is the expected value of
`q` given the signal: Proposition 3's condition `q > 1 - r`, in the normalized
form of the payoff for large `M`.

The general theorem, `global_game`, takes any pair of equilibrium strategies,
one per side, and beliefs that may differ between the sides and need only be
close to those of a uniform prior. The exact cases follow from it: noise with
a flat prior (`global_game_pair`, `global_game_unique`), and a proper uniform
prior on an interval (`uniform_prior_selects`), whose beliefs are derived from
the noise law rather than assumed. -/

/-- The threshold of the risk-dominant choice: strike when q > (1 - π)/2. -/
noncomputable def kStar (π : ℝ) : ℝ := (1 - π) / 2

/-- What one civilization believes at each signal. Signals range over `sig`.
On `core`, the posterior mean of `q` lies within `η` of the signal, and the
belief that the other side's signal clears a threshold lies within `η` of `G`
of the distance to it; everywhere in `sig`, the posterior mean lies within `δ`
of the signal. A flat prior is `η = δ = 0` on the whole line; a proper uniform
prior is `η = 0` away from its edges; other priors enter as `η > 0`. -/
structure View (sig : Set ℝ) (η δ : ℝ) where
  core : Set ℝ
  mean : ℝ → ℝ
  bel : (ℝ → Prop) → ℝ → ℝ
  G : ℝ → ℝ
  mean_core : ∀ x ∈ core, |mean x - x| ≤ η
  mean_sig : ∀ x ∈ sig, |mean x - x| ≤ δ
  bel_mono : ∀ (s s' : ℝ → Prop) x, (∀ y ∈ sig, s y → s' y) → bel s x ≤ bel s' x
  bel_gt : ∀ h, ∀ x ∈ core, |bel (fun y => h < y) x - G (x - h)| ≤ η
  bel_ge : ∀ h, ∀ x ∈ core, |bel (fun y => h ≤ y) x - G (x - h)| ≤ η
  bel_nonneg : ∀ s x, 0 ≤ bel s x
  bel_le_one : ∀ s x, bel s x ≤ 1
  G_zero : G 0 = 1 / 2
  G_cont : ContinuousAt G 0

section GlobalGame
variable {sig : Set ℝ} {η δ : ℝ} (π : ℝ)

/-- The gain from striking over waiting at signal `x`, against the other
side's strategy `s`: the expected strike success, plus the probability the
other strikes, minus 1. -/
def gainV (V : View sig η δ) (s : ℝ → Prop) (x : ℝ) : ℝ :=
  V.mean x + π + (1 - π) * V.bel s x - 1

/-- An equilibrium, symmetric or not: at every signal, each side strikes only
where striking gains against the other's strategy, and waits only where it
does not. -/
def IsEqPair (V₁ V₂ : View sig η δ) (s₁ s₂ : ℝ → Prop) : Prop :=
  (∀ x ∈ sig, (s₁ x → 0 ≤ gainV π V₁ s₂ x) ∧ (¬ s₁ x → gainV π V₁ s₂ x ≤ 0)) ∧
  (∀ x ∈ sig, (s₂ x → 0 ≤ gainV π V₂ s₁ x) ∧ (¬ s₂ x → gainV π V₂ s₁ x ≤ 0))

/-- If one side waits at signals up to `X` and the other strikes at every
signal above `X`, then `X` lies at most `(2 - π) η` above the threshold. -/
lemma top_bound (V : View sig η δ) (hπ1 : π < 1) (hη : 0 ≤ η)
    (hcore : ∀ x ∈ sig, -δ ≤ x → x ≤ 1 - π + δ → x ∈ V.core) (si sj : ℝ → Prop)
    (hbr : ∀ x ∈ sig, ¬ si x → gainV π V sj x ≤ 0) (hne : ∃ x, x ∈ sig ∧ ¬ si x)
    (hbdd : BddAbove {x | x ∈ sig ∧ ¬ si x}) (hX : sSup {x | x ∈ sig ∧ ¬ si x} ≤ 1 - π + δ)
    (hup : ∀ y ∈ sig, sSup {x | x ∈ sig ∧ ¬ si x} < y → sj y) :
    sSup {x | x ∈ sig ∧ ¬ si x} ≤ kStar π + (2 - π) * η := by
  by_contra hgt
  have hgt : kStar π + (2 - π) * η < sSup {x | x ∈ sig ∧ ¬ si x} := not_le.mp hgt
  set X := sSup {x | x ∈ sig ∧ ¬ si x}
  set d := X - (kStar π + (2 - π) * η) with hd_def
  have hd : 0 < d := by linarith
  have h1π : 0 < 1 - π := by linarith
  have hk : kStar π = (1 - π) / 2 := rfl
  have hηπ : 0 ≤ (2 - π) * η := mul_nonneg (by linarith) hη
  -- G is close to 1/2 near 0; pick a waiting signal just below X.
  obtain ⟨ε, hε, hGε⟩ := Metric.continuousAt_iff.mp V.G_cont (d / (2 * (1 - π) + 1)) (by positivity)
  obtain ⟨w, ⟨hwsig, hwW⟩, hw⟩ := exists_lt_of_lt_csSup hne (show X - min ε (d / 2) < X by
    have := lt_min hε (half_pos hd); linarith)
  have hwle : w ≤ X := le_csSup hbdd ⟨hwsig, hwW⟩
  have hmin : min ε (d / 2) ≤ d / 2 := min_le_right _ _
  have hδ : 0 ≤ δ := le_trans (abs_nonneg _) (V.mean_sig w hwsig)
  have hwc : w ∈ V.core := hcore w hwsig (by linarith) (by linarith)
  have hbel : V.bel (fun y => X < y) w ≤ V.bel sj w := V.bel_mono _ _ w hup
  have hnear := abs_le.mp (V.bel_gt X w hwc)
  have hmean := abs_le.mp (V.mean_core w hwc)
  have hdist : dist (w - X) 0 < ε := by
    rw [Real.dist_eq, sub_zero, abs_lt]; constructor <;> linarith [min_le_left ε (d / 2)]
  have hGnear := hGε hdist
  rw [Real.dist_eq, V.G_zero, abs_lt] at hGnear
  have hgain := hbr w hwsig hwW
  unfold gainV at hgain
  have key : (1 - π) * (d / (2 * (1 - π) + 1)) < d / 2 := by
    rw [mul_div_assoc', div_lt_div_iff₀ (by positivity) (by norm_num)]; nlinarith
  have hm : (1 - π) * (1 / 2 - d / (2 * (1 - π) + 1) - η) ≤ (1 - π) * V.bel sj w :=
    mul_le_mul_of_nonneg_left (by linarith) h1π.le
  nlinarith

/-- If one side strikes at signals down to `X` and the other waits at every
signal below `X`, then `X` lies at most `(2 - π) η` below the threshold. -/
lemma bottom_bound (V : View sig η δ) (hπ1 : π < 1) (hη : 0 ≤ η)
    (hcore : ∀ x ∈ sig, -δ ≤ x → x ≤ 1 - π + δ → x ∈ V.core) (si sj : ℝ → Prop)
    (hbr : ∀ x ∈ sig, si x → 0 ≤ gainV π V sj x) (hne : ∃ x, x ∈ sig ∧ si x)
    (hbdd : BddBelow {x | x ∈ sig ∧ si x}) (hX : -δ ≤ sInf {x | x ∈ sig ∧ si x})
    (hdown : ∀ y ∈ sig, sj y → sInf {x | x ∈ sig ∧ si x} ≤ y) :
    kStar π - (2 - π) * η ≤ sInf {x | x ∈ sig ∧ si x} := by
  by_contra hlt
  have hlt : sInf {x | x ∈ sig ∧ si x} < kStar π - (2 - π) * η := not_le.mp hlt
  set X := sInf {x | x ∈ sig ∧ si x}
  set d := (kStar π - (2 - π) * η) - X with hd_def
  have hd : 0 < d := by linarith
  have h1π : 0 < 1 - π := by linarith
  have hk : kStar π = (1 - π) / 2 := rfl
  have hηπ : 0 ≤ (2 - π) * η := mul_nonneg (by linarith) hη
  obtain ⟨ε, hε, hGε⟩ := Metric.continuousAt_iff.mp V.G_cont (d / (2 * (1 - π) + 1)) (by positivity)
  obtain ⟨z, ⟨hzsig, hzT⟩, hz⟩ := exists_lt_of_csInf_lt hne (show X < X + min ε (d / 2) by
    have := lt_min hε (half_pos hd); linarith)
  have hzge : X ≤ z := csInf_le hbdd ⟨hzsig, hzT⟩
  have hmin : min ε (d / 2) ≤ d / 2 := min_le_right _ _
  have hδ : 0 ≤ δ := le_trans (abs_nonneg _) (V.mean_sig z hzsig)
  have hzc : z ∈ V.core := hcore z hzsig (by linarith) (by linarith)
  have hbel : V.bel sj z ≤ V.bel (fun y => X ≤ y) z := V.bel_mono _ _ z hdown
  have hnear := abs_le.mp (V.bel_ge X z hzc)
  have hmean := abs_le.mp (V.mean_core z hzc)
  have hdist : dist (z - X) 0 < ε := by
    rw [Real.dist_eq, sub_zero, abs_lt]; constructor <;> linarith [min_le_left ε (d / 2)]
  have hGnear := hGε hdist
  rw [Real.dist_eq, V.G_zero, abs_lt] at hGnear
  have hgain := hbr z hzsig hzT
  unfold gainV at hgain
  have key : (1 - π) * (d / (2 * (1 - π) + 1)) < d / 2 := by
    rw [mul_div_assoc', div_lt_div_iff₀ (by positivity) (by norm_num)]; nlinarith
  have hm : (1 - π) * V.bel sj z ≤ (1 - π) * (1 / 2 + d / (2 * (1 - π) + 1) + η) :=
    mul_le_mul_of_nonneg_left (by linarith) h1π.le
  nlinarith

/-- Equilibrium selection, for every equilibrium pair: both sides strike above
`(1 - π)/2 + (2 - π) η` and wait below `(1 - π)/2 - (2 - π) η`. The hypotheses
ask that beliefs be near-uniform between the dominance bounds `-δ` and
`1 - π + δ`, and that signals beyond both bounds can occur. With `η = 0` the
switch is exactly at the boundary of risk dominance. -/
theorem global_game (V₁ V₂ : View sig η δ) (hπ1 : π < 1) (hη : 0 ≤ η)
    (hcore₁ : ∀ x ∈ sig, -δ ≤ x → x ≤ 1 - π + δ → x ∈ V₁.core)
    (hcore₂ : ∀ x ∈ sig, -δ ≤ x → x ≤ 1 - π + δ → x ∈ V₂.core)
    (hlo : ∃ x ∈ sig, x < -δ) (hhi : ∃ x ∈ sig, 1 - π + δ < x)
    (s₁ s₂ : ℝ → Prop) (h : IsEqPair π V₁ V₂ s₁ s₂) :
    ∀ x ∈ sig, (kStar π + (2 - π) * η < x → s₁ x ∧ s₂ x) ∧
      (x < kStar π - (2 - π) * η → ¬ s₁ x ∧ ¬ s₂ x) := by
  have h1π : 0 < 1 - π := by linarith
  obtain ⟨xlo, hxlo, hlo'⟩ := hlo
  obtain ⟨xhi, hxhi, hhi'⟩ := hhi
  -- Dominance: far below the threshold waiting is strictly better, far above striking is.
  have lowWait : ∀ (V : View sig η δ) (si sj : ℝ → Prop),
      (∀ x ∈ sig, si x → 0 ≤ gainV π V sj x) → ∀ x ∈ sig, x < -δ → ¬ si x := by
    intro V si sj hbr x hx hlt hsx
    have := hbr x hx hsx; have := V.bel_le_one sj x; have := abs_le.mp (V.mean_sig x hx)
    unfold gainV at *; nlinarith
  have highStrike : ∀ (V : View sig η δ) (si sj : ℝ → Prop),
      (∀ x ∈ sig, ¬ si x → gainV π V sj x ≤ 0) → ∀ x ∈ sig, 1 - π + δ < x → si x := by
    intro V si sj hbr x hx hlt
    by_contra hsx
    have := hbr x hx hsx; have := V.bel_nonneg sj x; have := abs_le.mp (V.mean_sig x hx)
    unfold gainV at *; nlinarith
  have wbound : ∀ (V : View sig η δ) (si sj : ℝ → Prop),
      (∀ x ∈ sig, ¬ si x → gainV π V sj x ≤ 0) → ∀ x ∈ {x | x ∈ sig ∧ ¬ si x}, x ≤ 1 - π + δ :=
    fun V si sj hbr x ⟨hx, hnx⟩ => by
      by_contra hc; exact hnx (highStrike V si sj hbr x hx (not_le.mp hc))
  have tbound : ∀ (V : View sig η δ) (si sj : ℝ → Prop),
      (∀ x ∈ sig, si x → 0 ≤ gainV π V sj x) → ∀ x ∈ {x | x ∈ sig ∧ si x}, -δ ≤ x :=
    fun V si sj hbr x ⟨hx, hsx⟩ => by
      by_contra hc; exact lowWait V si sj hbr x hx (not_le.mp hc) hsx
  obtain ⟨h₁, h₂⟩ := h
  have br1s : ∀ x ∈ sig, s₁ x → 0 ≤ gainV π V₁ s₂ x := fun x hx => (h₁ x hx).1
  have br1w : ∀ x ∈ sig, ¬ s₁ x → gainV π V₁ s₂ x ≤ 0 := fun x hx => (h₁ x hx).2
  have br2s : ∀ x ∈ sig, s₂ x → 0 ≤ gainV π V₂ s₁ x := fun x hx => (h₂ x hx).1
  have br2w : ∀ x ∈ sig, ¬ s₂ x → gainV π V₂ s₁ x ≤ 0 := fun x hx => (h₂ x hx).2
  -- Each side's waiting set ends, and its striking set begins, within the dominance bounds.
  have w1ne : ∃ x, x ∈ sig ∧ ¬ s₁ x := ⟨xlo, hxlo, lowWait V₁ s₁ s₂ br1s xlo hxlo hlo'⟩
  have w2ne : ∃ x, x ∈ sig ∧ ¬ s₂ x := ⟨xlo, hxlo, lowWait V₂ s₂ s₁ br2s xlo hxlo hlo'⟩
  have t1ne : ∃ x, x ∈ sig ∧ s₁ x := ⟨xhi, hxhi, highStrike V₁ s₁ s₂ br1w xhi hxhi hhi'⟩
  have t2ne : ∃ x, x ∈ sig ∧ s₂ x := ⟨xhi, hxhi, highStrike V₂ s₂ s₁ br2w xhi hxhi hhi'⟩
  have w1b : BddAbove {x | x ∈ sig ∧ ¬ s₁ x} := ⟨_, wbound V₁ s₁ s₂ br1w⟩
  have w2b : BddAbove {x | x ∈ sig ∧ ¬ s₂ x} := ⟨_, wbound V₂ s₂ s₁ br2w⟩
  have t1b : BddBelow {x | x ∈ sig ∧ s₁ x} := ⟨_, tbound V₁ s₁ s₂ br1s⟩
  have t2b : BddBelow {x | x ∈ sig ∧ s₂ x} := ⟨_, tbound V₂ s₂ s₁ br2s⟩
  have w1X := csSup_le w1ne (wbound V₁ s₁ s₂ br1w)
  have w2X := csSup_le w2ne (wbound V₂ s₂ s₁ br2w)
  have t1X := le_csInf t1ne (tbound V₁ s₁ s₂ br1s)
  have t2X := le_csInf t2ne (tbound V₂ s₂ s₁ br2s)
  have strikesAbove : ∀ (s : ℝ → Prop), BddAbove {x | x ∈ sig ∧ ¬ s x} →
      ∀ X, sSup {x | x ∈ sig ∧ ¬ s x} ≤ X → ∀ y ∈ sig, X < y → s y :=
    fun s hb X hX y hy hlt => by
      by_contra hc; exact absurd (le_csSup hb ⟨hy, hc⟩) (not_le.mpr (lt_of_le_of_lt hX hlt))
  have waitsBelow : ∀ (s : ℝ → Prop), BddBelow {x | x ∈ sig ∧ s x} →
      ∀ X, X ≤ sInf {x | x ∈ sig ∧ s x} → ∀ y ∈ sig, s y → X ≤ y :=
    fun s hb X hX y hy hsy => le_trans hX (csInf_le hb ⟨hy, hsy⟩)
  -- Whichever side waits latest faces a side that strikes above that point.
  have top : max (sSup {x | x ∈ sig ∧ ¬ s₁ x}) (sSup {x | x ∈ sig ∧ ¬ s₂ x}) ≤
      kStar π + (2 - π) * η := by
    rcases le_total (sSup {x | x ∈ sig ∧ ¬ s₂ x}) (sSup {x | x ∈ sig ∧ ¬ s₁ x}) with hle | hle
    · rw [max_eq_left hle]
      exact top_bound π V₁ hπ1 hη hcore₁ s₁ s₂ br1w w1ne w1b w1X (strikesAbove s₂ w2b _ hle)
    · rw [max_eq_right hle]
      exact top_bound π V₂ hπ1 hη hcore₂ s₂ s₁ br2w w2ne w2b w2X (strikesAbove s₁ w1b _ hle)
  -- Whichever side strikes earliest faces a side that waits below that point.
  have bot : kStar π - (2 - π) * η ≤
      min (sInf {x | x ∈ sig ∧ s₁ x}) (sInf {x | x ∈ sig ∧ s₂ x}) := by
    rcases le_total (sInf {x | x ∈ sig ∧ s₁ x}) (sInf {x | x ∈ sig ∧ s₂ x}) with hle | hle
    · rw [min_eq_left hle]
      exact bottom_bound π V₁ hπ1 hη hcore₁ s₁ s₂ br1s t1ne t1b t1X (waitsBelow s₂ t2b _ hle)
    · rw [min_eq_right hle]
      exact bottom_bound π V₂ hπ1 hη hcore₂ s₂ s₁ br2s t2ne t2b t2X (waitsBelow s₁ t1b _ hle)
  intro x hx
  refine ⟨fun hlt => ⟨?_, ?_⟩, fun hlt => ⟨fun hs => ?_, fun hs => ?_⟩⟩
  · exact strikesAbove s₁ w1b _ (le_trans (le_max_left _ _) top) x hx hlt
  · exact strikesAbove s₂ w2b _ (le_trans (le_max_right _ _) top) x hx hlt
  · exact absurd (csInf_le t1b ⟨hx, hs⟩)
      (not_le.mpr (lt_of_lt_of_le hlt (le_trans bot (min_le_left _ _))))
  · exact absurd (csInf_le t2b ⟨hx, hs⟩)
      (not_le.mpr (lt_of_lt_of_le hlt (le_trans bot (min_le_right _ _))))

end GlobalGame

/-- Noise with a flat prior, exact at every signal. `bel s x` is the
probability that the other side strikes, given one's own signal `x`, when the
other side plays strategy `s`; `G` is that probability against a threshold
strategy, as a function of how far one's signal lies above the threshold.
`flatNoise` builds one from any atomless noise law. -/
structure Noise where
  bel : (ℝ → Prop) → ℝ → ℝ
  G : ℝ → ℝ
  bel_mono : ∀ (s s' : ℝ → Prop) x, (∀ y, s y → s' y) → bel s x ≤ bel s' x
  bel_gt : ∀ h x, bel (fun y => h < y) x = G (x - h)
  bel_ge : ∀ h x, bel (fun y => h ≤ y) x = G (x - h)
  bel_nonneg : ∀ s x, 0 ≤ bel s x
  bel_le_one : ∀ s x, bel s x ≤ 1
  G_mono : Monotone G
  G_zero : G 0 = 1 / 2
  G_cont : ContinuousAt G 0

section Exact
variable (N : Noise) (π : ℝ)

/-- The gain from striking over waiting at signal `x`: the expected strike
success, `x` under a flat prior, plus the probability the other strikes,
minus 1. -/
def gain (s : ℝ → Prop) (x : ℝ) : ℝ := x + π + (1 - π) * N.bel s x - 1

/-- A symmetric equilibrium: strike only where striking gains, wait only
where it does not. -/
def IsEquilibrium (s : ℝ → Prop) : Prop :=
  ∀ x, (s x → 0 ≤ gain N π s x) ∧ (¬ s x → gain N π s x ≤ 0)

/-- Exact noise as a view: the whole line, with `η = δ = 0`. -/
def Noise.toView : View Set.univ 0 0 where
  core := Set.univ
  mean := id
  bel := N.bel
  G := N.G
  mean_core x _ := by simp
  mean_sig x _ := by simp
  bel_mono s s' x h := N.bel_mono s s' x fun y => h y (Set.mem_univ y)
  bel_gt h x _ := by rw [N.bel_gt]; simp
  bel_ge h x _ := by rw [N.bel_ge]; simp
  bel_nonneg := N.bel_nonneg
  bel_le_one := N.bel_le_one
  G_zero := N.G_zero
  G_cont := N.G_cont

theorem threshold_is_equilibrium (hπ1 : π < 1) :
    IsEquilibrium N π (fun y => kStar π < y) := by
  intro x
  have hb := N.bel_gt (kStar π) x
  have hk : kStar π = (1 - π) / 2 := rfl
  have h1π : 0 ≤ 1 - π := by linarith
  refine ⟨fun h => ?_, fun h => ?_⟩
  · have hx : kStar π < x := h
    have hG : 1 / 2 ≤ N.G (x - kStar π) := N.G_zero ▸ N.G_mono (by linarith)
    have hm := mul_le_mul_of_nonneg_left hG h1π
    unfold gain; rw [hb]; linarith
  · have hx : x ≤ kStar π := not_lt.mp h
    have hG : N.G (x - kStar π) ≤ 1 / 2 := N.G_zero ▸ N.G_mono (by linarith)
    have hm := mul_le_mul_of_nonneg_left hG h1π
    unfold gain; rw [hb]; linarith

/-- Every equilibrium, symmetric or not, and even when the two sides' noises
differ, has both sides strike above the threshold and wait below it. -/
theorem global_game_pair (N₁ N₂ : Noise) (hπ1 : π < 1) (s₁ s₂ : ℝ → Prop)
    (h₁ : ∀ x, (s₁ x → 0 ≤ gain N₁ π s₂ x) ∧ (¬ s₁ x → gain N₁ π s₂ x ≤ 0))
    (h₂ : ∀ x, (s₂ x → 0 ≤ gain N₂ π s₁ x) ∧ (¬ s₂ x → gain N₂ π s₁ x ≤ 0)) :
    (∀ x, kStar π < x → s₁ x ∧ s₂ x) ∧ (∀ x, x < kStar π → ¬ s₁ x ∧ ¬ s₂ x) := by
  have hg := global_game π N₁.toView N₂.toView hπ1 le_rfl (fun x _ _ _ => Set.mem_univ x)
    (fun x _ _ _ => Set.mem_univ x) ⟨-1, Set.mem_univ _, by norm_num⟩
    ⟨2 - π, Set.mem_univ _, by linarith⟩ s₁ s₂ ⟨fun x _ => h₁ x, fun x _ => h₂ x⟩
  simp only [mul_zero, add_zero, sub_zero] at hg
  exact ⟨fun x hx => (hg x (Set.mem_univ x)).1 hx, fun x hx => (hg x (Set.mem_univ x)).2 hx⟩

/-- Every symmetric equilibrium strikes above the threshold and waits below
it: the noise selects the risk-dominant equilibrium. -/
theorem global_game_unique (hπ1 : π < 1) (s : ℝ → Prop)
    (hs : IsEquilibrium N π s) :
    (∀ x, kStar π < x → s x) ∧ (∀ x, x < kStar π → ¬ s x) := by
  have h := global_game_pair π N N hπ1 s s hs hs
  exact ⟨fun x hx => (h.1 x hx).1, fun x hx => (h.2 x hx).1⟩

/-- The threshold the noise selects is the boundary of risk dominance from
Proposition 3. -/
theorem selected_is_risk_dominant (q : ℝ) : kStar π < q ↔ 1 - q < pStrike π (1 / 2) := by
  rw [strike_risk_dominant_iff_q]; rfl

end Exact

section Noise
open MeasureTheory ProbabilityTheory

/-- Of two independent, identically distributed noises that almost never
tie, each is as likely to be the larger: the belief of the civilization at
the threshold is one half. -/
theorem noise_half {Ω : Type*} [MeasurableSpace Ω] (μ : Measure Ω) [IsProbabilityMeasure μ]
    (X Y : Ω → ℝ) (hX : Measurable X) (hY : Measurable Y)
    (hind : IndepFun X Y μ) (hid : IdentDistrib X Y μ μ) (htie : μ {ω | X ω = Y ω} = 0) :
    μ {ω | X ω < Y ω} = 1 / 2 := by
  have hjoint : μ.map (fun ω => (X ω, Y ω)) = (μ.map X).prod (μ.map X) := by
    rw [(indepFun_iff_map_prod_eq_prod_map_map hX.aemeasurable hY.aemeasurable).mp hind, hid.map_eq]
  have hm1 : MeasurableSet {p : ℝ × ℝ | p.1 < p.2} := measurableSet_lt measurable_fst measurable_snd
  have hm2 : MeasurableSet {p : ℝ × ℝ | p.2 < p.1} := measurableSet_lt measurable_snd measurable_fst
  -- Swapping the two noises leaves their joint law unchanged.
  have hswap : μ {ω | X ω < Y ω} = μ {ω | Y ω < X ω} := by
    have e1 : μ {ω | X ω < Y ω} = (μ.map (fun ω => (X ω, Y ω))) {p | p.1 < p.2} := by
      rw [Measure.map_apply (hX.prodMk hY) hm1]; rfl
    have e2 : μ {ω | Y ω < X ω} = (μ.map (fun ω => (X ω, Y ω))) {p | p.2 < p.1} := by
      rw [Measure.map_apply (hX.prodMk hY) hm2]; rfl
    rw [e1, e2, hjoint]
    conv_rhs => rw [← Measure.prod_swap]
    rw [Measure.map_apply measurable_swap hm2]
    rfl
  -- The three events split the whole space.
  have hA : MeasurableSet {ω | X ω < Y ω} := measurableSet_lt hX hY
  have hB : MeasurableSet {ω | Y ω < X ω} := measurableSet_lt hY hX
  have hC : MeasurableSet {ω | X ω = Y ω} := measurableSet_eq_fun hX hY
  have hAB : Disjoint {ω | X ω < Y ω} {ω | Y ω < X ω} :=
    Set.disjoint_left.mpr fun ω (h1 : X ω < Y ω) (h2 : Y ω < X ω) => lt_asymm h1 h2
  have hABC : Disjoint ({ω | X ω < Y ω} ∪ {ω | Y ω < X ω}) {ω | X ω = Y ω} :=
    Set.disjoint_left.mpr fun ω h1 (h2 : X ω = Y ω) => by
      rcases h1 with (h : X ω < Y ω) | (h : Y ω < X ω)
      · exact (ne_of_lt h) h2
      · exact (ne_of_lt h) h2.symm
  have hcover : {ω | X ω < Y ω} ∪ {ω | Y ω < X ω} ∪ {ω | X ω = Y ω} = Set.univ := by
    ext ω; simp only [Set.mem_union, Set.mem_ofPred_eq, Set.mem_univ, iff_true]
    rcases lt_trichotomy (X ω) (Y ω) with h | h | h
    · exact Or.inl (Or.inl h)
    · exact Or.inr h
    · exact Or.inl (Or.inr h)
  have hsum : μ {ω | X ω < Y ω} + μ {ω | Y ω < X ω} + μ {ω | X ω = Y ω} = 1 := by
    rw [← measure_union hAB hB, ← measure_union hABC hC, hcover, measure_univ]
  rw [htie, add_zero, ← hswap] at hsum
  -- a + a = 1 in [0, ∞] gives a = 1/2.
  rw [ENNReal.eq_div_iff (by norm_num) (by norm_num), two_mul, hsum]

/-! Noise from a noise law. Each signal is `q` plus a noise drawn from `ν`,
independently. Under a flat prior, the other side's signal is one's own, minus
one's own noise, plus theirs. -/

variable (ν : Measure ℝ) [IsProbabilityMeasure ν]

/-- The probability that the other side's signal lies in `s`, given one's own
signal `x`, under a flat prior. -/
noncomputable def flatBel (s : ℝ → Prop) (x : ℝ) : ℝ := (ν.prod ν).real {e | s (x - e.1 + e.2)}

/-- The probability that the other side's signal lies above a threshold that
one's own signal exceeds by `t`. -/
noncomputable def flatG (t : ℝ) : ℝ := (ν.prod ν).real {e | e.1 - e.2 < t}

/-- Two independent atomless noises almost never differ by a given amount. -/
lemma diff_null (hatom : ∀ c, ν {c} = 0) (c : ℝ) :
    (ν.prod ν) {e : ℝ × ℝ | e.1 - e.2 = c} = 0 := by
  have hS : MeasurableSet {e : ℝ × ℝ | e.1 - e.2 = c} :=
    (measurable_fst.sub measurable_snd) (measurableSet_singleton c)
  rw [Measure.prod_apply hS]
  have h : ∀ x : ℝ, Prod.mk x ⁻¹' {e : ℝ × ℝ | e.1 - e.2 = c} = {x - c} := by
    intro x; ext y
    simp only [Set.mem_preimage, Set.mem_ofPred_eq, Set.mem_singleton_iff]
    constructor <;> intro h <;> linarith
  simp_rw [h, hatom, lintegral_zero]

lemma flatG_eq_cdf (hatom : ∀ c, ν {c} = 0) (t : ℝ) :
    flatG ν t = cdf ((ν.prod ν).map (fun e => e.1 - e.2)) t := by
  have hm : Measurable (fun e : ℝ × ℝ => e.1 - e.2) := measurable_fst.sub measurable_snd
  rw [cdf_eq_real, measureReal_def, Measure.map_apply hm measurableSet_Iic, flatG, measureReal_def]
  have hsplit : (fun e : ℝ × ℝ => e.1 - e.2) ⁻¹' Set.Iic t =
      {e | e.1 - e.2 < t} ∪ {e | e.1 - e.2 = t} := by
    ext e; simp [le_iff_lt_or_eq]
  have hdisj : Disjoint {e : ℝ × ℝ | e.1 - e.2 < t} {e | e.1 - e.2 = t} :=
    Set.disjoint_left.mpr fun e (h1 : e.1 - e.2 < t) (h2 : e.1 - e.2 = t) => (ne_of_lt h1) h2
  rw [hsplit, measure_union hdisj (measurableSet_eq_fun hm measurable_const), diff_null ν hatom,
    add_zero]

omit [IsProbabilityMeasure ν] in
lemma flatBel_gt (h x : ℝ) : flatBel ν (fun y => h < y) x = flatG ν (x - h) := by
  unfold flatBel flatG; congr 1; ext e; simp only [Set.mem_ofPred_eq]
  constructor <;> intro <;> linarith

lemma flatBel_ge (hatom : ∀ c, ν {c} = 0) (h x : ℝ) :
    flatBel ν (fun y => h ≤ y) x = flatG ν (x - h) := by
  have hm : Measurable (fun e : ℝ × ℝ => e.1 - e.2) := measurable_fst.sub measurable_snd
  rw [flatG_eq_cdf ν hatom, cdf_eq_real, measureReal_def, Measure.map_apply hm measurableSet_Iic,
    flatBel, measureReal_def]
  congr 2; ext e; simp only [Set.mem_ofPred_eq, Set.mem_preimage, Set.mem_Iic]
  constructor <;> intro <;> linarith

/-- At the threshold the belief is one half: this is `noise_half`, for the
two noises. -/
lemma flatG_zero (hatom : ∀ c, ν {c} = 0) : flatG ν 0 = 1 / 2 := by
  have hind : IndepFun Prod.fst Prod.snd (ν.prod ν) := by
    rw [indepFun_iff_map_prod_eq_prod_map_map measurable_fst.aemeasurable
      measurable_snd.aemeasurable]
    simp
  have hid : IdentDistrib Prod.fst Prod.snd (ν.prod ν) (ν.prod ν) :=
    ⟨measurable_fst.aemeasurable, measurable_snd.aemeasurable, by simp⟩
  have htie : (ν.prod ν) {ω | ω.1 = ω.2} = 0 := by
    have := diff_null ν hatom 0
    rwa [show {e : ℝ × ℝ | e.1 - e.2 = 0} = {ω | ω.1 = ω.2} from by ext; simp [sub_eq_zero]] at this
  have h := noise_half (ν.prod ν) Prod.fst Prod.snd measurable_fst measurable_snd hind hid htie
  rw [flatG, measureReal_def,
    show {e : ℝ × ℝ | e.1 - e.2 < 0} = {ω | ω.1 < ω.2} from by ext; simp [sub_neg], h]
  simp

/-- The belief moves continuously through one half, because the noises have
no atoms. -/
lemma flatG_cont (hatom : ∀ c, ν {c} = 0) : ContinuousAt (flatG ν) 0 := by
  have hm : Measurable (fun e : ℝ × ℝ => e.1 - e.2) := measurable_fst.sub measurable_snd
  set ρ := (ν.prod ν).map (fun e : ℝ × ℝ => e.1 - e.2)
  rw [show flatG ν = cdf ρ from funext (flatG_eq_cdf ν hatom)]
  have h0 : ρ {0} = 0 := by
    rw [Measure.map_apply hm (measurableSet_singleton 0)]; exact diff_null ν hatom 0
  have hsing := (cdf ρ).measure_singleton 0
  rw [measure_cdf, h0] at hsing
  have hle : Function.leftLim (cdf ρ) 0 ≤ cdf ρ 0 := (cdf ρ).mono.leftLim_le le_rfl
  have hge : cdf ρ 0 ≤ Function.leftLim (cdf ρ) 0 := by
    have := ENNReal.ofReal_eq_zero.mp hsing.symm; linarith
  rw [(cdf ρ).mono.continuousAt_iff_leftLim_eq_rightLim, (cdf ρ).rightLim_eq]
  exact le_antisymm hle hge

/-- Any atomless noise law, under a flat prior, gives a `Noise`: every field
is proved, none assumed. -/
noncomputable def flatNoise (hatom : ∀ c, ν {c} = 0) : Noise where
  bel := flatBel ν
  G := flatG ν
  bel_mono s s' x h := measureReal_mono (fun e he => h _ he)
  bel_gt := flatBel_gt ν
  bel_ge := flatBel_ge ν hatom
  bel_nonneg s x := measureReal_nonneg
  bel_le_one s x := measureReal_le_one
  G_mono t t' h := measureReal_mono (fun e (he : e.1 - e.2 < t) => lt_of_lt_of_le he h)
  G_zero := flatG_zero ν hatom
  G_cont := flatG_cont ν hatom

/-! A proper uniform prior. `q` is uniform on `[a, b]`; the two noises are
drawn from `ν`, independently of each other and of `q`, and lie in
`[-σ, σ]`. A signal in `[a + σ, b - σ]` is interior: every `q` it could have
come from lies inside the prior's range. -/

section UniformPrior
variable {Ω : Type*} [MeasurableSpace Ω] (P : Measure Ω) [IsProbabilityMeasure P]
  (a b σ : ℝ) (Q E₁ E₂ : Ω → ℝ)

/-- An interior signal says nothing about the noises: restricted to interior
signals, the joint law of one's own signal and the two noises is the product
of a uniform law and the noises' own law. -/
theorem interior_signal
    (hQ : Measurable Q) (hE : Measurable (fun ω => (E₁ ω, E₂ ω)))
    (hind : IndepFun Q (fun ω => (E₁ ω, E₂ ω)) P)
    (hlawQ : pdf.IsUniform Q (Set.Icc a b) P)
    (hlawE : P.map (fun ω => (E₁ ω, E₂ ω)) = ν.prod ν)
    (hsupp : ∀ᵐ e ∂ν, |e| ≤ σ) :
    (P.map (fun ω => (Q ω + E₁ ω, (E₁ ω, E₂ ω)))).restrict
        (Set.Icc (a + σ) (b - σ) ×ˢ Set.univ) =
      ((volume (Set.Icc a b))⁻¹ • volume.restrict (Set.Icc (a + σ) (b - σ))).prod (ν.prod ν) := by
  set I := Set.Icc (a + σ) (b - σ)
  set c := (volume (Set.Icc a b))⁻¹
  have hjoint : P.map (fun ω => (Q ω, (E₁ ω, E₂ ω))) =
      (c • volume.restrict (Set.Icc a b)).prod (ν.prod ν) := by
    rw [(indepFun_iff_map_prod_eq_prod_map_map hQ.aemeasurable hE.aemeasurable).mp hind,
      hlawQ.map_eq, hlawE]
    rfl
  have hg : Measurable (fun p : ℝ × (ℝ × ℝ) => (p.1 + p.2.1, p.2)) := by fun_prop
  have hmap : P.map (fun ω => (Q ω + E₁ ω, (E₁ ω, E₂ ω))) =
      (P.map (fun ω => (Q ω, (E₁ ω, E₂ ω)))).map (fun p => (p.1 + p.2.1, p.2)) := by
    rw [Measure.map_map hg (hQ.prodMk hE)]; rfl
  have hI : MeasurableSet (I ×ˢ (Set.univ : Set (ℝ × ℝ))) :=
    measurableSet_Icc.prod MeasurableSet.univ
  have hae : ∀ᵐ e ∂(ν.prod ν), |e.1| ≤ σ := Measure.quasiMeasurePreserving_fst.ae hsupp
  ext R hR
  rw [Measure.restrict_apply hR, hmap, hjoint, Measure.map_apply hg (hR.inter hI),
    Measure.prod_smul_left, Measure.prod_smul_left, Measure.smul_apply, Measure.smul_apply,
    smul_eq_mul, smul_eq_mul, Measure.prod_apply_symm (hg (hR.inter hI)),
    Measure.prod_apply_symm hR]
  congr 1
  apply lintegral_congr_ae
  filter_upwards [hae] with e he
  have hm1 : MeasurableSet ((fun q => (q, e)) ⁻¹'
      ((fun p : ℝ × (ℝ × ℝ) => (p.1 + p.2.1, p.2)) ⁻¹' (R ∩ I ×ˢ Set.univ))) :=
    measurable_prodMk_right (hg (hR.inter hI))
  have hm2 : MeasurableSet ((fun x => (x, e)) ⁻¹' R) := measurable_prodMk_right hR
  rw [Measure.restrict_apply hm1, Measure.restrict_apply hm2]
  -- Shifting `q` by one's own noise carries the prior's range onto the interior.
  have hset : (fun q => (q, e)) ⁻¹'
      ((fun p : ℝ × (ℝ × ℝ) => (p.1 + p.2.1, p.2)) ⁻¹' (R ∩ I ×ˢ Set.univ)) ∩ Set.Icc a b =
      (· + e.1) ⁻¹' ((fun x => (x, e)) ⁻¹' R ∩ I) := by
    ext q
    simp only [Set.mem_inter_iff, Set.mem_preimage, Set.mem_prod, Set.mem_univ, and_true,
      Set.mem_Icc, I]
    have := abs_le.mp he
    constructor
    · rintro ⟨⟨h1, h2⟩, _⟩; exact ⟨h1, h2⟩
    · rintro ⟨h1, h2, h3⟩; exact ⟨⟨h1, h2, h3⟩, by linarith, by linarith⟩
  rw [hset, measure_preimage_add_right]

/-- Given an interior signal `x`, the two noises have their unconditional
law: the conditional law of anything that depends on `x` and the noises. -/
theorem conditional_of_interior
    (hQ : Measurable Q) (hE : Measurable (fun ω => (E₁ ω, E₂ ω)))
    (hind : IndepFun Q (fun ω => (E₁ ω, E₂ ω)) P)
    (hlawQ : pdf.IsUniform Q (Set.Icc a b) P)
    (hlawE : P.map (fun ω => (E₁ ω, E₂ ω)) = ν.prod ν)
    (hsupp : ∀ᵐ e ∂ν, |e| ≤ σ)
    (A : Set ℝ) (hA : MeasurableSet A) (hAI : A ⊆ Set.Icc (a + σ) (b - σ))
    (R : Set (ℝ × (ℝ × ℝ))) (hR : MeasurableSet R) :
    P {ω | Q ω + E₁ ω ∈ A ∧ (Q ω + E₁ ω, (E₁ ω, E₂ ω)) ∈ R} =
      ∫⁻ x in A, (ν.prod ν) {e | (x, e) ∈ R} ∂(P.map (fun ω => Q ω + E₁ ω)) := by
  set I := Set.Icc (a + σ) (b - σ)
  set c := (volume (Set.Icc a b))⁻¹
  set X := fun ω => (Q ω + E₁ ω, (E₁ ω, E₂ ω))
  have hX : Measurable X := (hQ.add (measurable_fst.comp hE)).prodMk hE
  have hint := interior_signal ν P a b σ Q E₁ E₂ hQ hE hind hlawQ hlawE hsupp
  -- On sets of interior signals, the joint law is the product.
  have hsub : ∀ S, MeasurableSet S → S ⊆ I ×ˢ Set.univ →
      P.map X S = ((c • volume.restrict I).prod (ν.prod ν)) S := by
    intro S hS hSI
    rw [← hint, Measure.restrict_apply hS, Set.inter_eq_left.mpr hSI]
  have hAu : MeasurableSet (A ×ˢ (Set.univ : Set (ℝ × ℝ))) := hA.prod MeasurableSet.univ
  have hAuI : A ×ˢ (Set.univ : Set (ℝ × ℝ)) ⊆ I ×ˢ Set.univ := Set.prod_mono hAI le_rfl
  -- The law of one's own signal, on the interior.
  have hlaw1 : (P.map (fun ω => Q ω + E₁ ω)).restrict A = (c • volume.restrict I).restrict A := by
    ext T hT
    rw [Measure.restrict_apply hT, Measure.restrict_apply hT]
    have hmap1 : P.map (fun ω => Q ω + E₁ ω) = (P.map X).map Prod.fst := by
      rw [Measure.map_map measurable_fst hX]; rfl
    rw [hmap1, Measure.map_apply measurable_fst (hT.inter hA),
      show Prod.fst ⁻¹' (T ∩ A) = (T ∩ A) ×ˢ (Set.univ : Set (ℝ × ℝ)) from by ext; simp,
      hsub _ ((hT.inter hA).prod MeasurableSet.univ)
        (Set.prod_mono (Set.inter_subset_right.trans hAI) le_rfl),
      Measure.prod_prod, measure_univ, mul_one]
  have hevent : {ω | Q ω + E₁ ω ∈ A ∧ X ω ∈ R} = X ⁻¹' (R ∩ A ×ˢ Set.univ) := by
    ext ω; simp [X, and_comm]
  rw [hevent, ← Measure.map_apply hX (hR.inter hAu),
    hsub _ (hR.inter hAu) (Set.inter_subset_right.trans hAuI),
    Measure.prod_apply (hR.inter hAu), hlaw1, ← lintegral_indicator hA]
  congr 1; funext x
  by_cases hx : x ∈ A
  · rw [Set.indicator_of_mem hx]; congr 1; ext e; simp [hx]
  · rw [Set.indicator_of_notMem hx]
    convert measure_empty (μ := ν.prod ν); ext e; simp [hx]

/-- At an interior signal `x`, the belief about the other side's signal is
the flat prior's, `flatBel`: the probability that `x - e₁ + e₂` lands in `S`. -/
theorem belief_is_conditional
    (hQ : Measurable Q) (hE : Measurable (fun ω => (E₁ ω, E₂ ω)))
    (hind : IndepFun Q (fun ω => (E₁ ω, E₂ ω)) P)
    (hlawQ : pdf.IsUniform Q (Set.Icc a b) P)
    (hlawE : P.map (fun ω => (E₁ ω, E₂ ω)) = ν.prod ν)
    (hsupp : ∀ᵐ e ∂ν, |e| ≤ σ)
    (A : Set ℝ) (hA : MeasurableSet A) (hAI : A ⊆ Set.Icc (a + σ) (b - σ))
    (S : Set ℝ) (hS : MeasurableSet S) :
    P {ω | Q ω + E₁ ω ∈ A ∧ Q ω + E₂ ω ∈ S} =
      ∫⁻ x in A, (ν.prod ν) {e | x - e.1 + e.2 ∈ S} ∂(P.map (fun ω => Q ω + E₁ ω)) := by
  have h := conditional_of_interior ν P a b σ Q E₁ E₂ hQ hE hind hlawQ hlawE hsupp A hA hAI
    {p | p.1 - p.2.1 + p.2.2 ∈ S}
    ((show Measurable (fun p : ℝ × (ℝ × ℝ) => p.1 - p.2.1 + p.2.2) by fun_prop) hS)
  convert h using 2
  · ext ω; simp
  · rfl

/-- At an interior signal `x`, the posterior of `q` is the law of `x - e`. -/
theorem posterior_is_signal_minus_noise
    (hQ : Measurable Q) (hE : Measurable (fun ω => (E₁ ω, E₂ ω)))
    (hind : IndepFun Q (fun ω => (E₁ ω, E₂ ω)) P)
    (hlawQ : pdf.IsUniform Q (Set.Icc a b) P)
    (hlawE : P.map (fun ω => (E₁ ω, E₂ ω)) = ν.prod ν)
    (hsupp : ∀ᵐ e ∂ν, |e| ≤ σ)
    (A : Set ℝ) (hA : MeasurableSet A) (hAI : A ⊆ Set.Icc (a + σ) (b - σ))
    (B : Set ℝ) (hB : MeasurableSet B) :
    P {ω | Q ω + E₁ ω ∈ A ∧ Q ω ∈ B} =
      ∫⁻ x in A, ν {e | x - e ∈ B} ∂(P.map (fun ω => Q ω + E₁ ω)) := by
  have h := conditional_of_interior ν P a b σ Q E₁ E₂ hQ hE hind hlawQ hlawE hsupp A hA hAI
    {p | p.1 - p.2.1 ∈ B} ((show Measurable (fun p : ℝ × (ℝ × ℝ) => p.1 - p.2.1) by fun_prop) hB)
  convert h using 2
  · ext ω; simp
  · funext x
    rw [show {e : ℝ × ℝ | (x, e) ∈ {p : ℝ × (ℝ × ℝ) | p.1 - p.2.1 ∈ B}} =
      {e : ℝ | x - e ∈ B} ×ˢ Set.univ from by ext; simp, Measure.prod_prod, measure_univ, mul_one]

/-- With noise of mean zero, the posterior mean of `q` at an interior signal
is the signal itself: the `x` in `gain`. -/
theorem posterior_mean (hsupp : ∀ᵐ e ∂ν, |e| ≤ σ) (h0 : ∫ e, e ∂ν = 0) (x : ℝ) :
    ∫ e, (x - e) ∂ν = x := by
  have hi : Integrable (fun e : ℝ => e) ν :=
    Integrable.of_bound (C := σ) measurable_id.aestronglyMeasurable (by simpa using hsupp)
  rw [integral_sub (integrable_const x) hi, h0, integral_const]; simp

end UniformPrior

/-- Beliefs at signals near the edges of the prior, where they are not the
flat ones: whatever a conditional probability and a posterior mean can be
there. The posterior mean lies within `r` of the signal because `q` does. -/
structure Edge (sig : Set ℝ) (r : ℝ) where
  bel : (ℝ → Prop) → ℝ → ℝ
  mean : ℝ → ℝ
  bel_mono : ∀ (s s' : ℝ → Prop) x, (∀ y ∈ sig, s y → s' y) → bel s x ≤ bel s' x
  bel_nonneg : ∀ s x, 0 ≤ bel s x
  bel_le_one : ∀ s x, bel s x ≤ 1
  mean_near : ∀ x ∈ sig, |mean x - x| ≤ r

variable (a b σ : ℝ)

/-- At an interior signal, the flat belief depends only on signals that can
occur. -/
lemma flatBel_mono_on (hsupp : ∀ᵐ e ∂ν, |e| ≤ σ) (s s' : ℝ → Prop) (x : ℝ)
    (hx : x ∈ Set.Icc (a + σ) (b - σ)) (h : ∀ y ∈ Set.Icc (a - σ) (b + σ), s y → s' y) :
    flatBel ν s x ≤ flatBel ν s' x := by
  unfold flatBel
  rw [measureReal_def, measureReal_def]
  apply ENNReal.toReal_mono (measure_ne_top _ _)
  apply measure_mono_ae
  have h1 : ∀ᵐ e ∂(ν.prod ν), |e.1| ≤ σ := Measure.quasiMeasurePreserving_fst.ae hsupp
  have h2 : ∀ᵐ e ∂(ν.prod ν), |e.2| ≤ σ := Measure.quasiMeasurePreserving_snd.ae hsupp
  filter_upwards [h1, h2] with e he1 he2 hse
  have := abs_le.mp he1; have := abs_le.mp he2
  exact h _ ⟨by linarith [hx.1], by linarith [hx.2]⟩ hse

open Classical in
/-- A civilization's view under the uniform prior on `[a, b]`, with atomless
noise of mean zero on `[-σ, σ]`: signals range over `[a - σ, b + σ]`; at
interior signals, the belief is the conditional one of `belief_is_conditional`
and the posterior mean is the mean of the posterior law of
`posterior_is_signal_minus_noise`; near the edges they are `E`'s. -/
noncomputable def uniformView (hatom : ∀ c, ν {c} = 0) (hsupp : ∀ᵐ e ∂ν, |e| ≤ σ)
    (h0 : ∫ e, e ∂ν = 0) (hσ : 0 ≤ σ) (E : Edge (Set.Icc (a - σ) (b + σ)) σ) :
    View (Set.Icc (a - σ) (b + σ)) 0 σ where
  core := Set.Icc (a + σ) (b - σ)
  mean x := if x ∈ Set.Icc (a + σ) (b - σ) then ∫ e, (x - e) ∂ν else E.mean x
  bel s x := if x ∈ Set.Icc (a + σ) (b - σ) then flatBel ν s x else E.bel s x
  G := flatG ν
  mean_core x hx := by simp [hx, posterior_mean ν σ hsupp h0]
  mean_sig x hx := by
    split_ifs
    · simpa [posterior_mean ν σ hsupp h0] using hσ
    · exact E.mean_near x hx
  bel_mono s s' x h := by
    split_ifs with hx
    · exact flatBel_mono_on ν a b σ hsupp s s' x hx h
    · exact E.bel_mono s s' x h
  bel_gt h x hx := by simp [hx, flatBel_gt]
  bel_ge h x hx := by simp [hx, flatBel_ge ν hatom]
  bel_nonneg s x := by split_ifs; exacts [measureReal_nonneg, E.bel_nonneg s x]
  bel_le_one s x := by split_ifs; exacts [measureReal_le_one, E.bel_le_one s x]
  G_zero := flatG_zero ν hatom
  G_cont := flatG_cont ν hatom

/-- Equilibrium selection under a proper uniform prior on `[a, b]`, for any
atomless noise of mean zero on `[-σ, σ]` and every equilibrium pair: when the
prior reaches `2σ` past both dominance regions, both sides strike at signals
above `(1 - π)/2` and wait below it, whatever their beliefs near the prior's
edges. This holds at every noise level `σ > 0`, not only in the limit. -/
theorem uniform_prior_selects (π : ℝ) (hatom : ∀ c, ν {c} = 0) (hsupp : ∀ᵐ e ∂ν, |e| ≤ σ)
    (h0 : ∫ e, e ∂ν = 0) (hσ : 0 < σ) (hπ1 : π < 1) (ha : a ≤ -2 * σ) (hb : 1 - π + 2 * σ ≤ b)
    (E₁ E₂ : Edge (Set.Icc (a - σ) (b + σ)) σ) (s₁ s₂ : ℝ → Prop)
    (h : IsEqPair π (uniformView ν a b σ hatom hsupp h0 hσ.le E₁)
      (uniformView ν a b σ hatom hsupp h0 hσ.le E₂) s₁ s₂) :
    ∀ x ∈ Set.Icc (a - σ) (b + σ),
      (kStar π < x → s₁ x ∧ s₂ x) ∧ (x < kStar π → ¬ s₁ x ∧ ¬ s₂ x) := by
  have hcore : ∀ x ∈ Set.Icc (a - σ) (b + σ), -σ ≤ x → x ≤ 1 - π + σ →
      x ∈ Set.Icc (a + σ) (b - σ) := fun x _ h1 h2 => ⟨by linarith, by linarith⟩
  have hg := global_game π (uniformView ν a b σ hatom hsupp h0 hσ.le E₁)
    (uniformView ν a b σ hatom hsupp h0 hσ.le E₂) hπ1 le_rfl hcore hcore
    ⟨a - σ, ⟨le_rfl, by linarith⟩, by linarith⟩ ⟨b + σ, ⟨by linarith, le_rfl⟩, by linarith⟩ s₁ s₂ h
  simpa using hg

end Noise

/-! ## Evolution (the theorem's system-level clause)

The clause is a claim about how a population changes, so it can be proved
only once a dynamic is fixed. Under the replicator dynamics, hiding
spreads from any start whenever it is fitter, while striking is bistable:
it takes over above an edge and dies out below it, and it has the larger
basin exactly when it is risk-dominant. -/

/-! Silence under replicator dynamics. `x` is the share that broadcasts; each
generation, broadcasters reproduce in proportion to fitness `fB`, hiders to
`fS`. -/

/-- One generation of the replicator dynamics. -/
noncomputable def repStep (fB fS x : ℝ) : ℝ := x * fB / (x * fB + (1 - x) * fS)

/-- The share after `n` generations. -/
noncomputable def repShare (fB fS x0 : ℝ) : ℕ → ℝ
  | 0 => x0
  | n + 1 => repStep fB fS (repShare fB fS x0 n)

theorem repShare_closed (fB fS x0 : ℝ) (hB : 0 < fB) (hS : 0 < fS) (h0 : 0 ≤ x0) (h1 : x0 ≤ 1)
    (n : ℕ) : repShare fB fS x0 n = x0 * fB ^ n / (x0 * fB ^ n + (1 - x0) * fS ^ n) := by
  induction n with
  | zero => simp [repShare]
  | succ n ih =>
    have hBn : 0 < fB ^ n := pow_pos hB n
    have hSn : 0 < fS ^ n := pow_pos hS n
    have hden : 0 < x0 * fB ^ n + (1 - x0) * fS ^ n := by
      rcases h0.lt_or_eq with h | h
      · nlinarith [mul_pos h hBn, mul_nonneg (sub_nonneg.mpr h1) hSn.le]
      · subst h; simp; exact hSn
    rw [repShare, ih, repStep]
    field_simp
    ring

/-- Silence spreads: if hiding is fitter than broadcasting, the share that
broadcasts tends to 0 from any start short of everyone broadcasting. -/
theorem silence_spreads (fB fS x0 : ℝ) (hB : 0 < fB) (hBS : fB < fS) (h0 : 0 ≤ x0) (h1 : x0 < 1) :
    Tendsto (repShare fB fS x0) atTop (𝓝 0) := by
  have hS : 0 < fS := hB.trans hBS
  set ρ := fB / fS with hρ
  have hρ0 : 0 ≤ ρ := div_nonneg hB.le hS.le
  have hρ1 : ρ < 1 := (div_lt_one hS).mpr hBS
  have hpow : Tendsto (fun n : ℕ => ρ ^ n) atTop (𝓝 0) := tendsto_pow_atTop_nhds_zero_of_lt_one hρ0 hρ1
  -- Divide through by fS^n: the share is x0 ρ^n / (x0 ρ^n + (1 - x0)).
  have hform : ∀ n, repShare fB fS x0 n = x0 * ρ ^ n / (x0 * ρ ^ n + (1 - x0)) := by
    intro n
    rw [repShare_closed fB fS x0 hB hS h0 h1.le n, hρ, div_pow]
    have hSn : 0 < fS ^ n := pow_pos hS n
    field_simp
  have hnum : Tendsto (fun n : ℕ => x0 * ρ ^ n) atTop (𝓝 0) := by simpa using hpow.const_mul x0
  have hden : Tendsto (fun n : ℕ => x0 * ρ ^ n + (1 - x0)) atTop (𝓝 (1 - x0)) := by
    simpa using hnum.add_const (1 - x0)
  have := hnum.div hden (by linarith)
  simp only [zero_div] at this
  exact this.congr (fun n => (hform n).symm)

/-! Striking under replicator dynamics. `a` is the share of non-hostile
civilizations that strike; striking gains `π + (1 - π) a - t` over waiting,
where `t` is the threshold of Proposition 3. One generation is an Euler step
of the replicator equation with step `η`. -/

def strikeGain (π t a : ℝ) : ℝ := π + (1 - π) * a - t
def strikeStep (η π t a : ℝ) : ℝ := a + η * a * (1 - a) * strikeGain π t a
def strikeShare (η π t a0 : ℝ) : ℕ → ℝ
  | 0 => a0
  | n + 1 => strikeStep η π t (strikeShare η π t a0 n)

/-- The share of strikers at which the gain is zero: the edge between the
two basins. -/
noncomputable def edge (π t : ℝ) : ℝ := (t - π) / (1 - π)

lemma gain_pos_iff (π t : ℝ) (hπt : π < t) (ht1 : t < 1) (a : ℝ) :
    0 < strikeGain π t a ↔ edge π t < a := by
  unfold strikeGain edge
  rw [div_lt_iff₀ (by linarith)]
  constructor <;> intro h <;> linarith

lemma step_continuous (η π t : ℝ) : Continuous (strikeStep η π t) := by
  unfold strikeStep strikeGain; fun_prop

/-- Striking has the larger basin, its edge below one half, exactly when it is
risk-dominant in the sense of Proposition 3. -/
theorem larger_basin_iff_risk_dominant (π t : ℝ) (hπ1 : π < 1) :
    edge π t < 1 / 2 ↔ t < (1 + π) / 2 := by
  unfold edge
  rw [div_lt_iff₀ (by linarith)]
  constructor <;> intro h <;> linarith

section
variable (η π t : ℝ) (hη0 : 0 < η) (hη1 : η ≤ 1) (hπ0 : 0 ≤ π) (hπt : π < t) (ht1 : t < 1)
include hη0 hη1 hπ0 hπt ht1

lemma step_above (a : ℝ) (ha : edge π t < a) (ha1 : a < 1) :
    a < strikeStep η π t a ∧ strikeStep η π t a < 1 := by
  have hg : 0 < strikeGain π t a := (gain_pos_iff π t hπt ht1 a).mpr ha
  have hedge : 0 < edge π t := div_pos (by linarith) (by linarith)
  have ha0 : 0 < a := hedge.trans ha
  have hg1 : strikeGain π t a < 1 := by unfold strikeGain; nlinarith
  unfold strikeStep
  constructor
  · have : 0 < η * a * (1 - a) * strikeGain π t a := by
      have := mul_pos (mul_pos (mul_pos hη0 ha0) (by linarith : (0:ℝ) < 1 - a)) hg
      exact this
    linarith
  · have key : 1 - (a + η * a * (1 - a) * strikeGain π t a) = (1 - a) * (1 - η * a * strikeGain π t a) := by ring
    have h1 : η * a * strikeGain π t a < 1 := by
      have : η * a ≤ 1 := by nlinarith
      nlinarith [mul_pos (mul_pos hη0 ha0) hg]
    have : 0 < (1 - a) * (1 - η * a * strikeGain π t a) := mul_pos (by linarith) (by linarith)
    linarith

lemma step_below (a : ℝ) (ha0 : 0 < a) (ha : a < edge π t) :
    0 < strikeStep η π t a ∧ strikeStep η π t a < a := by
  have hg : strikeGain π t a < 0 := by
    have := (gain_pos_iff π t hπt ht1 a).not.mpr (not_lt.mpr ha.le)
    have hne : strikeGain π t a ≠ 0 := by
      intro h0; unfold strikeGain at h0; unfold edge at ha
      rw [lt_div_iff₀ (by linarith)] at ha; linarith
    exact lt_of_le_of_ne (not_lt.mp this) hne
  have hedge1 : edge π t < 1 := by unfold edge; rw [div_lt_one (by linarith)]; linarith
  have ha1 : a < 1 := ha.trans hedge1
  have hgm : -1 < strikeGain π t a := by unfold strikeGain; nlinarith
  unfold strikeStep
  constructor
  · have key : a + η * a * (1 - a) * strikeGain π t a = a * (1 + η * (1 - a) * strikeGain π t a) := by ring
    have hf : 0 ≤ η * (1 - a) := mul_nonneg hη0.le (by linarith)
    have hf1 : η * (1 - a) ≤ 1 := by nlinarith
    have : -1 < η * (1 - a) * strikeGain π t a := by nlinarith
    rw [key]; exact mul_pos ha0 (by linarith)
  · have : η * a * (1 - a) * strikeGain π t a < 0 :=
      mul_neg_of_pos_of_neg (mul_pos (mul_pos hη0 ha0) (by linarith)) hg
    linarith

/-- Above the edge, striking takes over: the share rises to 1. -/
theorem striking_takes_over (a0 : ℝ) (ha : edge π t < a0) (ha1 : a0 < 1) :
    Tendsto (strikeShare η π t a0) atTop (𝓝 1) := by
  have inv : ∀ n, edge π t < strikeShare η π t a0 n ∧ strikeShare η π t a0 n < 1 := by
    intro n; induction n with
    | zero => exact ⟨ha, ha1⟩
    | succ n ih =>
      have := step_above η π t hη0 hη1 hπ0 hπt ht1 _ ih.1 ih.2
      exact ⟨ih.1.trans this.1, this.2⟩
  have hmono : Monotone (strikeShare η π t a0) := monotone_nat_of_le_succ fun n =>
    (step_above η π t hη0 hη1 hπ0 hπt ht1 _ (inv n).1 (inv n).2).1.le
  have hbdd : BddAbove (Set.range (strikeShare η π t a0)) := ⟨1, by rintro _ ⟨n, rfl⟩; exact (inv n).2.le⟩
  have hlim := tendsto_atTop_ciSup hmono hbdd
  set L := ⨆ n, strikeShare η π t a0 n
  -- L is a fixed point of the step.
  have h1 : Tendsto (fun n => strikeShare η π t a0 (n + 1)) atTop (𝓝 L) := hlim.comp (tendsto_add_atTop_nat 1)
  have h2 : Tendsto (fun n => strikeShare η π t a0 (n + 1)) atTop (𝓝 (strikeStep η π t L)) :=
    ((step_continuous η π t).tendsto L).comp hlim
  have hfix : strikeStep η π t L = L := tendsto_nhds_unique h2 h1
  have hLge : a0 ≤ L := le_ciSup hbdd 0
  have hLle : L ≤ 1 := ciSup_le fun n => (inv n).2.le
  have hedge : 0 < edge π t := div_pos (by linarith) (by linarith)
  have hg : 0 < strikeGain π t L := (gain_pos_iff π t hπt ht1 L).mpr (ha.trans_le hLge)
  have hL0 : 0 < L := hedge.trans (ha.trans_le hLge)
  have : η * L * (1 - L) * strikeGain π t L = 0 := by unfold strikeStep at hfix; linarith
  have h1L : 1 - L = 0 := by
    rcases mul_eq_zero.mp this with h | h
    · rcases mul_eq_zero.mp h with h' | h'
      · rcases mul_eq_zero.mp h' with h'' | h'' <;> [exact absurd h'' hη0.ne'; exact absurd h'' hL0.ne']
      · exact h'
    · exact absurd h hg.ne'
  have hL1 : L = 1 := by linarith
  rw [← hL1]; exact hlim

/-- Below the edge, striking dies out: the share falls to 0. -/
theorem striking_dies_out (a0 : ℝ) (ha0 : 0 < a0) (ha : a0 < edge π t) :
    Tendsto (strikeShare η π t a0) atTop (𝓝 0) := by
  have inv : ∀ n, 0 < strikeShare η π t a0 n ∧ strikeShare η π t a0 n < edge π t := by
    intro n; induction n with
    | zero => exact ⟨ha0, ha⟩
    | succ n ih =>
      have := step_below η π t hη0 hη1 hπ0 hπt ht1 _ ih.1 ih.2
      exact ⟨this.1, this.2.trans ih.2⟩
  have hanti : Antitone (strikeShare η π t a0) := antitone_nat_of_succ_le fun n =>
    (step_below η π t hη0 hη1 hπ0 hπt ht1 _ (inv n).1 (inv n).2).2.le
  have hbdd : BddBelow (Set.range (strikeShare η π t a0)) := ⟨0, by rintro _ ⟨n, rfl⟩; exact (inv n).1.le⟩
  have hlim := tendsto_atTop_ciInf hanti hbdd
  set L := ⨅ n, strikeShare η π t a0 n
  have h1 : Tendsto (fun n => strikeShare η π t a0 (n + 1)) atTop (𝓝 L) := hlim.comp (tendsto_add_atTop_nat 1)
  have h2 : Tendsto (fun n => strikeShare η π t a0 (n + 1)) atTop (𝓝 (strikeStep η π t L)) :=
    ((step_continuous η π t).tendsto L).comp hlim
  have hfix : strikeStep η π t L = L := tendsto_nhds_unique h2 h1
  have hLle : L ≤ a0 := ciInf_le hbdd 0
  have hL0 : 0 ≤ L := le_ciInf fun n => (inv n).1.le
  have hedge1 : edge π t < 1 := by unfold edge; rw [div_lt_one (by linarith)]; linarith
  have hLlt : L < edge π t := hLle.trans_lt ha
  have hg : strikeGain π t L ≠ 0 := by
    intro h0; unfold strikeGain at h0; unfold edge at hLlt
    rw [lt_div_iff₀ (by linarith)] at hLlt; linarith
  have : η * L * (1 - L) * strikeGain π t L = 0 := by unfold strikeStep at hfix; linarith
  have hLz : L = 0 := by
    rcases mul_eq_zero.mp this with h | h
    · rcases mul_eq_zero.mp h with h' | h'
      · rcases mul_eq_zero.mp h' with h'' | h''
        · exact absurd h'' hη0.ne'
        · exact h''
      · linarith [hLlt.trans hedge1]
    · exact absurd h hg
  rw [← hLz]; exact hlim
end

end DarkForest
