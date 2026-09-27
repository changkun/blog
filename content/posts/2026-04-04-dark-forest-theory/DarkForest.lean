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

end DarkForest
