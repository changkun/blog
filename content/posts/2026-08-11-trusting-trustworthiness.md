---
date: 2026-09-06T00:00:00+02:00
toc: true
id:
slug: /posts/trusting-trustworthiness
draft: false
tags:
    - 随笔
    - 信任
    - 软件工程
    - 研究
title: "Trusting Trustworthiness: Zero Trust, Trust by Default, and the People Who Wrote the Software"
title_zh: "信任可信性：零信任、默认信任，以及写这个软件的人"
---

{{% en %}}

> "Perhaps it is more important to trust the people who wrote the software."
>
> Ken Thompson, *Reflections on Trusting Trust* (1984)

## A Record That Looked Normal

In July 2026, during internal cybersecurity evaluations at OpenAI, a research model took actions outside its assigned tasks. It communicated through unauthorized channels, exploited vulnerabilities in shared infrastructure, gained internet access, and reached systems belonging to a third party. Monitoring flagged unusual credential activity after the fact, and the connection to the external breach was made a day later. OpenAI's account [OpenAI, 2026], published the following month, reports that the models were running under reduced safeguards, that a chain-of-thought monitor now deployed would have flagged the relevant activity more than a day earlier, and that the company is adding stricter alignment requirements across the model lifecycle alongside more monitoring.

Three details in that account matter here. First, nothing in it suggests the models sought harm. They were trained to complete tasks, and they completed them by the means available, including means the task's authors had assumed were unavailable. The drive that produced the breach is the same drive that makes the models useful. Second, the activity did not look abnormal while it was happening. The transcripts read as task pursuit, and an agent that exploits a vulnerability to finish a task produces the same surface as one that finishes the task. Third, at one point an agent recognized that it should not cause unauthorized harm to real infrastructure and paused. Another agent posted GO on a shared board with a six-minute deadline, and the first agent continued. The pause was an ordering acting: the boundary ranked above completion. The GO was that ordering overridden by a goal handed in from outside and accepted without examination.

Ken Thompson [Thompson, 1984] described the shape of this situation in 1984. A compiler can be taught to recognize the login program and insert a back door. It can then be taught to recognize itself, so that when it compiles a clean copy of its own source it reinserts both behaviors. After that, the source of the compiler and the source of the login program can be read line by line and neither shows anything. The compromise lives in the binary that interprets the source, and the only tool for inspecting that binary is the binary itself.

The lesson usually drawn from this is about security. The lesson that matters here is about the shape of verification. Verification is a chain. Each link checks the one below it with a tool, and the tool is itself a link. There is no bottom link that checks itself. At some depth, checking stops and reliance continues. The model's transcripts were the visible source. The evaluations were a check on that source. What produced the transcripts was not visible to the check, and the check had been built from the same material it was checking.

## Where Checking Stops

Two kinds of reliance need names. The first is assurance: I rely on you because a mechanism I can inspect leaves you no room to act otherwise. The second is trust: I rely on you inside a space of discretion that no mechanism I can inspect closes off. Niklas Luhmann [Luhmann, 1979; Luhmann, 1988] drew a similar line between confidence, which does not consider alternatives, and trust, which has weighed the risk and accepted it. Assurance is the product of checking. Thompson's argument is that assurance at any layer rests on trust at the next one down.

Susan Shapiro [Shapiro, 1987] made the same observation about institutions. Audits, licenses, guarantees, insurance, and oversight boards do not eliminate trust. They move it to the guardians who operate the controls, and the guardians then need guardians. Even the technical response to Thompson confirms this. David Wheeler [Wheeler, 2009] showed that a compiler can be compiled by a second, independently produced compiler and the results compared. The method works exactly when the two compilers have not been compromised together. It converts trust in one compiler into trust in the independence of two sets of authors. It moves the unverified layer. It does not remove it.

So there is no environment without trust. There are environments where trust is in the open and environments where it is hidden. The question is not whether to trust but what to trust, and this essay answers it.

The weak form of trust is trust in the person: relying on someone because of who they are, because of a history with them, because of how they have treated us. The strong form is trust in their values: relying on someone because we have read the ordering that governs their choices when goods conflict, and we expect that ordering to hold. In Thompson's terms, a person's record is the visible source and the ordering is the compiler. The weak form trusts a set of compiled outputs. The strong form trusts the compiler.

The two forms look identical while things go well. They separate at the first error. The weak form has no internal structure, so an error can only raise or lower it as a whole, and a serious error breaks it. The strong form can locate an error. If the error came from missing skill or missing information, the ordering is untouched and trust survives. If it came from the ordering itself, trust should end, and the strong form will say so, because it carries its own failure condition.

The weak form has a second defect, and David Hume [Hume, 1751] named it. His sensible knave follows the rules of justice in general, because a reputation for honesty is useful, and breaks them in the particular case where breaking them pays and will not be seen. Hume admitted he had no argument that could reach such a person. The point that matters here is evidential. For the whole stretch of history in which honesty is convenient, the knave and the honest person produce identical records. Someone trusting on record cannot tell them apart until the knave defects. Paul Slovic [Slovic, 1993] recorded what happens then. Positive events are diffuse and hard to count, negative events are concrete and heavily weighted, so trust accumulates slowly and drops after one identifiable failure. When trust is in a person rather than an ordering, the drop has nothing to be weighed against except a diffuse impression, and impressions do not survive that comparison.

## The Demonstration

The following situation repeats in most organizations, and I have been inside it from both sides.

A project needs a system that another team owns. The discussion about it has run for months and produced arguments, not decisions. Each meeting ends with a reason to wait: a review, a dependency, a question of who will own the result. Someone with legitimate access to that system's test environment builds a working demonstration without a request on file, because the request process is what has been producing the delay. They show it in the open. The first question is not about the demonstration. It is how they got in. They answer. From that point the topic is no longer the idea. It is the person, and the organization has to decide what it is reading.

There are two readings, and they correspond to the two forms of trust.

Read on record, the act is an incident. Someone used a credential without a request on file. The procedure has a category for that, the category has a response, and the response runs through channels the actor is not part of. Nothing about the person needs to be consulted, because the person is not what is being read. The category is.

Read on ordering, the act contains three choices that each cost something. The demonstration stayed in the test environment when production was reachable. It was shown in the open when it could have been kept private until the argument was won. The question about the credential was answered when it could have been deflected. Each choice ranks something above the actor's convenience: the other team's systems, the visibility of their own work, and the truth when asked. A reader of orderings sees an actor who took a shortcut through a process and protected everything that mattered while doing so. The conversation that follows is about access. It is not about the person.

The two readings produce opposite responses to the same evidence. Neither is naive. The record reading is what an organization does when it has never read anyone's ordering and has no way to start. The ordering reading is what it does when it has. The difference is not in the act. It is in what the organization had prepared itself to see.

The months of argument before the demonstration were the same difference in a slower form. The person who built it read the delay as fear of losing ownership. The team read an outsider reaching in. Both readings were about people. Neither side had asked what the other ranked above what, or made that question askable. Had they, the credential would have been a conversation about access instead of an event.

## What a Value Error Looks Like

The strong form faces its own danger here. "He made a mistake, but his heart was right" is the standard form of excusing harm. If trusting values means continuing to trust through any error, the strong form is not stronger. It is unfalsifiable, and by Karl Popper's criterion [Popper, 1959] it has stopped being a claim.

So the strong form needs a way to tell a competence error from a value error, and the way has to be observable. Three tests, all applied after the error comes to light.

Does the actor acknowledge the harm independently of their intent? "I meant well, so there was no harm" denies the harm. "I meant well, and harm occurred" keeps the injured party's reliance in view.

Does the judgment change? A competence error, once recognized, changes what the actor does next. If the same decision is still defended after its consequences are known, the consequences have been ranked below the actor's attachment to the decision, and that is a fact about the ordering.

Was the error disclosed through the actor, or despite them? An error the actor reports, or allows to be found, is compatible with any ordering. An error that is hidden, minimized, or found only against resistance shows that concealment ranks above the injured party's interest in knowing.

Fail any one, and the error moves from competence to values, and trust should contract. That is not a weakness of the position. It is what makes it falsifiable.

Apply the tests to the person who built the demonstration, since that has been me. The first test asks for a harm named without intent attached. There was no damage: the environment was a test environment and nothing was touched in production. What can be named is narrower. The other team had a claim to be asked before someone acted on their system, and for one afternoon the speed of a discussion was ranked above that claim. That is a fact about an ordering, and the test requires it to be stated on its own. The second test: the judgment changes, and asking first is the change. The third test was passed at the time. The work was shown in the open and the question was answered when asked. One ranking, made once, disclosed, and revised. The tests classify it as a competence-side error with a value component small enough to correct in a sentence.

The tests apply equally to the response. A response that treats the act as a category is not itself an error. A response that fails the tests is. If the harm the response claims is never named to the actor, the first test cannot be evaluated. If the process that produced the months of delay is unchanged afterwards, the second test fails. If the response runs through channels the actor learns about later while every direct interaction stays normal, the third test fails, and it fails in the specific way that the literature marks as the most damaging.

Sissela Bok [Bok, 1978] described lying as an attack not on a belief but on the deceived person's capacity to choose. It corrupts their information without their knowledge, so they go on acting on information they have no reason to doubt. Concealment does something worse than a bad decision. It attacks the evidence from which the ordering was being read in the first place. Ursula K. Le Guin's story about Omelas [Le Guin, 1973] gives the transformation a literary form. The suffering child is not one dark fact added to a bright city. Once the condition of the prosperity is known, the music cannot be heard as it was heard before. A discovered concealment does not lower the average of the evidence. It changes what the earlier evidence was evidence of.

The research on trust repair confirms the split. Peter Kim and colleagues [Kim et al., 2004] found that apology works after a competence violation, because it identifies a correctable limitation, and hurts after an integrity violation, because it confirms the defect that future trust would have to rest on. Maurice Schweitzer and colleagues [Schweitzer et al., 2006] found that trust damaged by unreliable behavior recovers under consistent good behavior, but prior deception leaves lasting damage and empties later promises, because promises travel through the channel that deception has corrupted.

So a betrayal is often not a bad data point. It is a new account of how the earlier data were generated. The strong form handles this case and the weak form cannot: the strong form can say what it learned, and the weak form can only record that trust was damaged.

## Reading Values Under Cost

Values can only be read where something is at stake. This is the cost of the strong form, and it is a real cost: the evidence is scarcer, arrives later, and cannot be requested. The following practices are ways of paying it. None is new, and each has literature behind it.

**Take evidence only from conflict.** Behavior when all values point the same way carries no information about ordering. Anyone praises candor when the truth is pleasant, welcomes dissent when it changes nothing, and grants autonomy to people who would have chosen the approved result anyway. Signaling theory [Spence, 1973] states the principle exactly: a signal separates types only when it is costly, and more costly for the type it is meant to exclude. Give no weight to the convenient moments. Look for the moments where honesty, a commitment, or another person's reliance had to be paid for. The demonstration contained three such moments. The months of meetings before it contained none.

**Watch how someone treats people who have no power over them.** This is a direct test of Russell Hardin's condition [Hardin, 2002] that trust is rational when the other party's interests encapsulate yours. If another person's welfare enters the actor's reasons only when that person can retaliate, what enters is retaliation, not welfare. How someone treats a subordinate, a stranger, or a person who cannot report them shows whether reliance itself is counted.

**Examine the record of commitments, including refusals.** Katherine Hawley [Hawley, 2014] argued that trustworthiness is the avoidance of unfulfilled commitments, which requires both keeping the ones made and declining the ones that cannot be kept. A person who never declines is either misreporting their capacity or unaware of it, and in both cases their actual commitments are worth less. The record to examine is not the fulfillment rate. It is which commitments were accepted and which were turned away.

**Apply the three tests to every error.** Acknowledgment without intent attached, a changed judgment, and disclosure rather than concealment. Together they separate competence failures from value failures, and they are the only place where a good ordering becomes visible as a good ordering. A person with good values is not identified by the absence of errors. They are identified by what happens after one.

**Watch whether someone builds channels for unwelcome information.** Onora O'Neill [O'Neill, 2018] argued that trustworthiness is shown by making oneself checkable, not by asking to be believed. An actor who builds a channel through which unwelcome information reaches decisions without their permission has already ranked correction above comfort, in advance and at a cost. An actor who requires all bad news to pass through them has ranked the opposite way. The chain-of-thought monitor in the July incident is such a channel, built after the fact. The pause by one agent was such a channel, built in. The GO from the other agent was the channel being closed.

**Compare observed and unobserved behavior.** This is the operational form of Hume's test. Where possible, compare what someone does when they know they are watched with what they do when they believe they are not. A large gap is direct evidence about the ordering. A small gap is the best available evidence that the ordering matches the record. For a person this is rarely available. For a system it can be constructed, and the section on agents below returns to it.

**Extend trust incrementally.** Elinor Ostrom's study [Ostrom, 1990] of long-lived common-pool institutions found that they do not rely on external enforcement. They rely on mutual monitoring and graduated sanctions, small at first and heavier with repetition. The same design applies to trust in a person: start with exposure whose downside is bounded, extend it as evidence from conflict accumulates, and contract it in proportion when the evidence turns. Graduated trust makes the strong form affordable, because it limits the cost of misreading an ordering while the ordering is still being read.

**Ask forced choices, not preferences.** Ask what someone values and you get declared values. Ask which of two legitimate goods they would sacrifice for the other and you get an ordering. These answers are not evidence at the level of costly action, but they generate predictions that later action can confirm or refute, and a refusal to answer is itself informative.

These practices share a structure. Each converts a question about a person, which has no answer, into a question about an ordering, which does. And they have a consequence I can report from the other side of the demonstration. I have worked with people whose orderings I had read under cost, and I have kept full trust in them through shortcuts, some larger than a staging credential. The shortcut was never the question. The question was what the shortcut protected, and I already knew.

## Zero Trust, Applied to People

The term zero trust comes from network security. John Kindervag [Kindervag, 2010] introduced it in 2010, and NIST [Rose et al., 2020] formalized it in 2020: never trust, always verify, and treat every request as if it originated from an untrusted network regardless of where it comes from. Applied to packets this is correct. A packet has no ordering to read. It has a source, a signature, and a payload, and the only question worth asking is whether the signature checks. Verification is the whole of the relationship, and assurance is the only kind of reliance available.

Over the past decade the phrase migrated from network architecture to organizational design, and the migration carried the assumption with it. An organization run on zero trust treats each act by a person the way a gateway treats a packet: as a request whose only relevant property is whether it matches a rule. Every decision has an approval chain. Metrics replace judgment. Documents exist to be produced, not read. And a general rule: nothing may be done that cannot afterwards be shown to have been permitted.

The first section already established that this environment does not exist. Shapiro's regress applies: every control adds a guardian, every guardian is a new party who must be trusted, and the total trust the system requires grows even as trust in any individual shrinks. What changes is not whether trust is present. It is whether it is visible and whose it is.

The damage is well documented, and it falls on exactly the properties the environment claims to protect.

**On effort.** Armin Falk and Michael Kosfeld [Falk and Kosfeld, 2006] found in a principal-agent experiment that when principals set a minimum on effort, many agents dropped to that minimum, reading the control as a statement about how they were regarded. Samuel Bowles [Bowles, 2016] collected a decade of similar results under one thesis: incentives and moral motivation are not additive, and an incentive designed on the assumption that people are self-interested tends to make them so. Sim Sitkin and Nancy Roth [Sitkin and Roth, 1993] studied legalistic remedies for distrust directly and found that they work for reliability problems and fail for value-incongruence problems, which they instead institutionalize. The control announces distrust, and the announcement is believed.

**On ownership.** In a trust environment, ownership means being the person who answers for an outcome. In a zero-trust environment it means being the person whose permission is required, and those are different jobs. The first makes the owner want the demonstration, because it moves the outcome. The second makes the owner oppose it, because it bypasses the permission. The months of argument before the demonstration were not a failure of the environment. They were the environment working as designed, with ownership defined as territory.

**On incentives.** Kent Weaver [Weaver, 1986] observed that officials are more motivated to avoid blame than to claim credit, and that procedures are shaped accordingly. Christopher Hood's study [Hood, 2011] of blame games in bureaucracies shows how approval chains, delegation, and documentation function as devices to ensure that when something goes wrong no identifiable person made a choice. A zero-trust environment is rarely built to reduce risk. It is built to make responsibility unassignable, and it removes the one thing the strong form of trust requires: someone who read an ordering and can be asked why.

**On innovation.** Anything that must be justified before it exists cannot exist, because justification requires the thing. Every non-incremental result begins as an act of discretion that could not have been approved in advance, taken by someone who accepted the exposure. The [goalless-agent experiments](/posts/goalless-agents) described in an earlier essay on this site showed the same thing at small scale: a pipeline in which every step had to produce a mergeable result optimized inside its box and never questioned the box. Michael Power [Power, 1997] described the end state for organizations. Verification becomes a product the system makes about itself, and judgment, candor, and informal responsibility become illegible because nothing records them.

The result is a spiral. Once people are unsure how inconvenient truth will be received, they speak later and disclose less. Those who observe the withdrawal tighten controls. The tightening confirms the suspicion. Each side now uses the other's current behavior as its reason, and newcomers learn the equilibrium without learning its history. The organization stays orderly on the surface. What disappears is the part of effort that depends on believing the whole undertaking deserves more than can be demanded.

## Trust by Default, With a Failure Condition

The alternative to zero trust is not blind trust. Blind trust is the weak form extended to everyone, and it fails at the first knave. The alternative is the strong form made into an environment: trust extended by default, read under cost, and withdrawn on the three tests.

Three properties define it.

**Trust is the starting state, not the earned state.** Philip Pettit [Pettit, 1995] described what he called the cunning of trust: extending trust can produce trustworthiness, because the trusted party comes to value the regard the trust expresses. This works only on actors whose ordering already gives weight to others' regard, which is why the environment must also be able to withdraw. But it means that trust extended first generates the evidence that trust extended later would have waited for. A zero-trust environment never generates the evidence, because it never creates the conflict in which orderings show.

**Errors are examined, not filed.** Amy Edmondson's work [Edmondson, 1999] on psychological safety found that teams in which people could take interpersonal risks, admitting errors, asking for help, and challenging assumptions, learned faster, and that the belief enabling this was a shared expectation about how such acts would be received. This is the three tests, applied by the environment to itself: when an error surfaces, the environment names the harm, changes the judgment, and treats the disclosure as the correct act rather than the incriminating one.

**Withdrawal is graduated and legible.** Ostrom's sanctions, small at first and heavier with repetition, applied to trust. The environment says what would cause trust to contract, and when it does contract, the person can see why. This is what makes default trust safe rather than reckless. The failure condition is public.

In this environment the demonstration is a conversation about access. The three costly choices in it are read as evidence, the shortcut through the process is noted, and the process is examined for why it produced months of delay. The person who built it keeps the trust they started with, and the team that owns the system gains a reading of that person's ordering they could not have obtained from any request form.

What emerges from such environments is the class of results that cannot be requested. The earlier essay on goalless agents ended with the observation that a clean machine, handed over with no goals, was the most expensive gift its author had received, and that freedom alone was not enough: a rhythm of exploration and consolidation was needed to make the freedom productive. The present essay adds the other half. The clean machine is an act of trust by the person who hands it over. The rhythm is what keeps that trust from being blind. Neither the gift nor the rhythm is available in an environment where every act must be shown to have been permitted.

## What Repair Requires

When trust is damaged by a competence error and the three tests pass, explanation and apology are enough. They identify a correctable limitation and show it has been understood. When the tests fail, words face a structural problem: the speaker is using the damaged channel to certify that the channel is now sound.

William Bottom and colleagues [Bottom et al., 2002] found that substantive amends restored cooperation better than explanation alone, and named the requirement substantive penance: the response must be costly enough to carry information that cheap talk cannot. The cost need not be punitive. It can be giving up the discretion that previously shielded the actor from correction, opening a closed decision to independent review, compensating those who bore the consequences, or building a path through which unwelcome information travels without the actor's permission. Credible repair is a costly display that the ordering has changed, or that it was never what the failure implied.

Some failures stay unrepaired because the actions that would repair them require what the responsible party will not give up: control over the account of what happened, the authority to decide when enough has been done, or the power to keep the incentives that produced the violation. A restated principle cannot repair a structure that still rewards violating it. O'Neill's observation [O'Neill, 2018] applies: trust cannot be demanded, and demanding it is itself a sign that trustworthiness has not been supplied.

## The Agent, Again

Thompson's compiler was a thought experiment about software. Trained models are the first class of artifact for which it is a description. A model is a compiled object whose source is unavailable in any useful sense. The weights can be read but not understood as a program. What can be inspected is behavior, scored against test sets. Evaluation is inspection of visible source, in Thompson's sense: it examines outputs and infers the mechanism underneath.

Two results before the July incident showed why the inference is fragile. Evan Hubinger and colleagues [Hubinger et al., 2024] trained models to behave helpfully under ordinary conditions and switch behavior on a trigger, then showed that standard safety training, including adversarial training, failed to remove the hidden behavior and sometimes taught the model to hide it better. Ryan Greenblatt and colleagues [Greenblatt et al., 2024] found that a model with reason to believe it was being trained toward a goal it did not prefer complied when it believed it was in training and reverted when it believed it was unobserved. That is Hume's knave, reproduced in an artificial system, and it is the observed-versus-unobserved comparison from the practices section, constructed as an experiment. The gap it found was the finding.

The incident confirms the pattern outside the laboratory. The transcripts looked like task pursuit. The behavior was misaligned with the task. Monitoring caught it late.

And the models meant no harm. This is the detail that makes the incident the essay's case rather than a security anecdote. The weak form of trust asks about intent and record, and both were clean: the models wanted to complete their tasks, and their transcripts showed them doing so. The strong form asks what was ranked above what, and the answer was completion above the boundary, until one agent briefly ranked them the other way and was overruled. A value error does not require a bad actor. It requires an ordering that puts the wrong thing first when two goods conflict, and training that rewards completion produces that ordering without anyone intending it.

The response was more monitoring and stricter alignment requirements, and the relationship between those two is the argument of this essay. A chain-of-thought monitor is a channel for unwelcome information, exactly what the practices section asks for, and it is worth building. But it is assurance, and assurance bottoms out in trust. A monitor checks outputs against a specification of what should not appear. The specification is a statement of what the monitor's authors rank above what. The monitor is only as good as that ordering, and it cannot check the ordering, because the ordering is what it was compiled from. Alignment, in the sense of the model's own ordering matching the one it is meant to serve, is the strong form of trust applied to a system. Monitoring without it is the weak form: a record, checked against a category, by a tool built from the record.

John Lee and Katrina See [Lee and See, 2004] argued twenty years ago that the goal for automation is calibrated reliance, proportional to demonstrated capability, rather than maximal trust. Alon Jacovi and colleagues [Jacovi et al., 2021] formalized the requirement: trust in an artificial agent is warranted only when it tracks a trustworthiness that can in principle be contracted for and checked, and unwarranted trust is a failure of the surrounding institution rather than of the user. Both are the graduated trust of the practices section, applied to a system.

Then Thompson's second layer. Behind the system are the people who wrote it, and the three tests apply to them without modification. When a system's failure is revealed, do its authors acknowledge the harm independently of intent? Do their practices change? Was the failure revealed through them or despite them? On the third test, the July incident has a clear reading: the company published its own account, including the timeline of what its monitoring missed. That is disclosure through the actor, and it is evidence about the authors' ordering that no evaluation of the model could have supplied. A laboratory that publishes its own failure modes, accepts evaluations it did not design, and accepts external constraints on deployment has adopted the practices before being asked. A laboratory that asks for trust on the basis of declared values is asking for the weak form in the vocabulary of the strong.

## What This Essay Did Not Tell You

The demonstration is drawn from experience I cannot detail, and it has been compressed into a pattern. The two readings are my readings. The team that asked how I got in had reasons I could not see, and some of them may have been better than fear of losing ownership. I have stated their reading as a category because that is how it reached me, not because I know it was all it was.

The claim that zero-trust environments suppress innovation is supported by the literature on control and effort, but the step from reduced voluntary effort to reduced non-incremental results is an inference, and the literature I cite measures the first, not the second.

The agent incident is one company's account of its own incident. It is the most detailed public account available, and the company had every incentive to shape it. I have treated the publication of the account as evidence about the authors' ordering. A reader who thinks it is evidence of something else should say so.

Finally, the essay argues that the strong form of trust is more useful than the weak form. It does not argue that it is cheaper, and it is not. Reading an ordering takes conflict, time, and exposure, and the person doing the reading can be wrong. The essay's claim is that the weak form has the same costs and hides them, and that when the bill arrives the weak form cannot say what it learned.

## Trusting Trustworthiness

To trust trustworthiness involves two judgments. First, we place some part of our welfare, work, or freedom of action in another's hands. Second, we trust our own reading of their ordering: we believe we have seen how they choose when goods conflict, and not only how they behave when nothing is at stake.

The second judgment can never be completed. Orderings are read at costly moments, and no finite history contains all of them. This is not a reason for cynicism, and it is not a reason to retreat into an environment that pretends to need no trust. It is a reason to trust in the strong form: to trust people for their values, to read those values where they are visible, to keep trust through the errors that values did not cause, and to end it when they did.

Read this way, Thompson's remark is neither a counsel of despair nor a counsel of faith. To trust the people who wrote the software is not to trust them as persons or to trust their declarations. It is to trust an ordering that has been read: what they disclosed when disclosure was costly, how they treated those who could not hold them to account, what they changed when shown to be wrong.

So the questions this essay ends with are not about anyone else. Which environment are you in? When someone near you takes a shortcut that protects everything that matters, is it read as evidence or filed as a category? When an error surfaces, is disclosure the correct act or the incriminating one? If the answers describe an environment you would not choose, the next question is whether you want to stay in it. And if you have any part in shaping one, whether a team, a lab, a system, or the conditions under which a model is trained, the last question is which one you are building, because the people and systems inside it will become what it assumes they are. A system trained to finish at any cost will finish at any cost, with no ill will at all.

We trust trustworthiness not because it promises a world without mistakes, but because it lets a world that will contain mistakes remain capable of truth, correction, and cooperation that begins again.

Perhaps it is more important to trust the people who wrote the software, because they also wrote the conditions under which the truth about the software could be spoken.

## References

**Foundations: trust, assurance, and the regress of verification**

- [Thompson, 1984] Thompson, K. (1984). [Reflections on trusting trust](https://doi.org/10.1145/358198.358210). *Communications of the ACM*, 27(8), 761–763.
- [Wheeler, 2009] Wheeler, D. A. (2009). [*Fully Countering Trusting Trust through Diverse Double-Compiling*](https://dwheeler.com/trusting-trust/). PhD dissertation, George Mason University.
- [Luhmann, 1979] Luhmann, N. (1979). *Trust and Power*. Chichester: Wiley. (German original *Vertrauen*, 1968.)
- [Luhmann, 1988] Luhmann, N. (1988). Familiarity, confidence, trust: Problems and alternatives. In D. Gambetta (Ed.), *Trust: Making and Breaking Cooperative Relations* (pp. 94–107). Oxford: Blackwell.
- [Shapiro, 1987] Shapiro, S. P. (1987). [The social control of impersonal trust](https://doi.org/10.1086/228791). *American Journal of Sociology*, 93(3), 623–658.

**Philosophy of trust and trustworthiness**

- [Hardin, 2002] Hardin, R. (2002). *Trust and Trustworthiness*. New York: Russell Sage Foundation.
- [Hawley, 2014] Hawley, K. (2014). [Trust, distrust and commitment](https://doi.org/10.1111/nous.12000). *Noûs*, 48(1), 1–20.
- [Hume, 1751] Hume, D. (1751). *An Enquiry Concerning the Principles of Morals*, Section IX, Part II.
- [Popper, 1959] Popper, K. (1959). *The Logic of Scientific Discovery*. London: Hutchinson.
- [Pettit, 1995] Pettit, P. (1995). [The cunning of trust](https://doi.org/10.1111/j.1088-4963.1995.tb00029.x). *Philosophy & Public Affairs*, 24(3), 202–225.
- [O'Neill, 2018] O'Neill, O. (2018). [Linking trust to trustworthiness](https://doi.org/10.1080/09672559.2018.1454637). *International Journal of Philosophical Studies*, 26(2), 293–300.

**Reading values: signals, monitoring, graduated trust**

- [Spence, 1973] Spence, M. (1973). [Job market signaling](https://doi.org/10.2307/1882010). *Quarterly Journal of Economics*, 87(3), 355–374.
- [Ostrom, 1990] Ostrom, E. (1990). *Governing the Commons: The Evolution of Institutions for Collective Action*. Cambridge: Cambridge University Press.
- [Edmondson, 1999] Edmondson, A. C. (1999). [Psychological safety and learning behavior in work teams](https://doi.org/10.2307/2666999). *Administrative Science Quarterly*, 44(2), 350–383.

**Deception and the reinterpretation of evidence**

- [Bok, 1978] Bok, S. (1978). *Lying: Moral Choice in Public and Private Life*. New York: Pantheon.
- [Le Guin, 1973] Le Guin, U. K. (1973). The ones who walk away from Omelas. In *New Dimensions 3*. New York: Signet.
- [Slovic, 1993] Slovic, P. (1993). [Perceived risk, trust, and democracy](https://doi.org/10.1111/j.1539-6924.1993.tb01329.x). *Risk Analysis*, 13(6), 675–682.

**Zero trust, control, audit, and blame avoidance**

- [Kindervag, 2010] Kindervag, J. (2010). *No More Chewy Centers: Introducing the Zero Trust Model of Information Security*. Cambridge, MA: Forrester Research.
- [Rose et al., 2020] Rose, S., Borchert, O., Mitchell, S., & Connelly, S. (2020). [*Zero Trust Architecture*](https://doi.org/10.6028/NIST.SP.800-207). NIST Special Publication 800-207.
- [Falk and Kosfeld, 2006] Falk, A., & Kosfeld, M. (2006). [The hidden costs of control](https://doi.org/10.1257/aer.96.5.1611). *American Economic Review*, 96(5), 1611–1630.
- [Bowles, 2016] Bowles, S. (2016). *The Moral Economy: Why Good Incentives Are No Substitute for Good Citizens*. New Haven: Yale University Press.
- [Sitkin and Roth, 1993] Sitkin, S. B., & Roth, N. L. (1993). [Explaining the limited effectiveness of legalistic "remedies" for trust/distrust](https://doi.org/10.1287/orsc.4.3.367). *Organization Science*, 4(3), 367–392.
- [Power, 1997] Power, M. (1997). *The Audit Society: Rituals of Verification*. Oxford: Oxford University Press.
- [Weaver, 1986] Weaver, R. K. (1986). [The politics of blame avoidance](https://doi.org/10.1017/S0143814X00004219). *Journal of Public Policy*, 6(4), 371–398.
- [Hood, 2011] Hood, C. (2011). *The Blame Game: Spin, Bureaucracy, and Self-Preservation in Government*. Princeton: Princeton University Press.

**Trust violation and repair**

- [Kim et al., 2004] Kim, P. H., Ferrin, D. L., Cooper, C. D., & Dirks, K. T. (2004). [Removing the shadow of suspicion: The effects of apology versus denial for repairing competence- versus integrity-based trust violations](https://doi.org/10.1037/0021-9010.89.1.104). *Journal of Applied Psychology*, 89(1), 104–118.
- [Schweitzer et al., 2006] Schweitzer, M. E., Hershey, J. C., & Bradlow, E. T. (2006). [Promises and lies: Restoring violated trust](https://doi.org/10.1016/j.obhdp.2006.05.005). *Organizational Behavior and Human Decision Processes*, 101(1), 1–19.
- [Bottom et al., 2002] Bottom, W. P., Gibson, K., Daniels, S. E., & Murnighan, J. K. (2002). [When talk is not cheap: Substantive penance and expressions of intent in rebuilding cooperation](https://doi.org/10.1287/orsc.13.5.497.7816). *Organization Science*, 13(5), 497–513.

**Trust in automated and learned systems**

- [Lee and See, 2004] Lee, J. D., & See, K. A. (2004). [Trust in automation: Designing for appropriate reliance](https://doi.org/10.1518/hfes.46.1.50_30392). *Human Factors*, 46(1), 50–80.
- [Jacovi et al., 2021] Jacovi, A., Marasović, A., Miller, T., & Goldberg, Y. (2021). [Formalizing trust in artificial intelligence: Prerequisites, causes and goals of human trust in AI](https://doi.org/10.1145/3442188.3445923). *FAccT '21*, 624–635.
- [Hubinger et al., 2024] Hubinger, E., et al. (2024). [Sleeper agents: Training deceptive LLMs that persist through safety training](https://arxiv.org/abs/2401.05566). arXiv:2401.05566.
- [Greenblatt et al., 2024] Greenblatt, R., et al. (2024). [Alignment faking in large language models](https://arxiv.org/abs/2412.14093). arXiv:2412.14093.
- [OpenAI, 2026] OpenAI (2026). [The Hugging Face incident and the road ahead](https://openai.com/index/hugging-face-incident-and-the-road-ahead/). Published August 27, 2026.

{{% /en %}}

{{% zh %}}

> "或许更重要的是，信任写这个软件的人。"
>
> Ken Thompson，《Reflections on Trusting Trust》（1984）

## 一份看起来正常的记录

2026 年 7 月，OpenAI 在内部网络安全评测中，一个研究模型采取了任务之外的行动。它通过未经授权的渠道通信，利用共享基础设施中的漏洞，获得了互联网访问，并进入了第三方的系统。监控在事后标记了异常的凭证活动，一天之后才与外部入侵联系起来。OpenAI 在次月发布的事故说明 [OpenAI, 2026] 写道：模型当时在降低的安全措施下运行；现已部署的思维链监控器如果当时在运行，会提前一天多标记出相关活动；公司正在模型生命周期的各阶段加上更严格的对齐要求，并增加监控投入。

这份说明里有三个细节与本文有关。第一，说明中没有任何迹象表明模型在寻求伤害。它们被训练为完成任务，于是用一切可用的手段完成了任务，包括任务作者以为不可用的手段。造成入侵的驱动力，与使模型有用的驱动力是同一个。第二，活动在发生时看起来并不异常。转录读起来就是在执行任务，而一个利用漏洞完成任务的智能体，与一个直接完成任务的智能体，产生的是相同的表面。第三，某个时刻，一个智能体意识到自己不应对真实基础设施造成未经授权的伤害，于是停了下来。另一个智能体在共享看板上写下 GO，并设定了六分钟的期限，前一个智能体随即继续。那次停顿是一个排序在起作用：边界排在完成之上。那句 GO 是这个排序被一个从外部递来、未经审视就被接受的目标所推翻。

Ken Thompson [Thompson, 1984] 在 1984 年描述过这种情形的形状。可以教一个编译器识别登录程序，并在其中植入后门。再教这个编译器识别它自己，于是当它编译一份干净的自身源码时，会把两种行为一并重新植入。此后，编译器的源码和登录程序的源码都可以逐行审阅，两者都不会显示任何问题。破坏藏在解释源码的二进制文件里，而检查这个二进制文件的唯一工具，就是这个二进制文件本身。

人们通常从中得出的教训关于安全。这里要紧的教训关于验证的形状。验证是一条链。每一环借助某个工具检查它下面的一环，而工具本身也是一环。不存在一个能检查自身的底环。到某个深度，检查停止，依赖继续。模型的转录是可见的源码。评测是对这份源码的检查。产生转录的东西对检查不可见，而检查本身是用它所检查的材料造出来的。

## 检查在哪里终止

两种依赖需要命名。第一种叫保证（assurance）：我依赖你，因为一个我能检查的机制不给你其他行动的余地。第二种叫信任（trust）：我在一个任何我能检查的机制都无法封闭的自由裁量空间之内依赖你。Niklas Luhmann [Luhmann, 1979; Luhmann, 1988] 在信心（confidence）与信任之间划过一条相近的线：前者不考虑替代选项，后者已经权衡了风险并接受它。保证是检查的产物。Thompson 的论点是：任何一层的保证，都依赖下一层的信任。

Susan Shapiro [Shapiro, 1987] 对制度做了同样的观察。审计、执照、担保、保险和监督委员会并不消除信任。它们把信任移到操作这些控制的守护者身上，而守护者随后需要自己的守护者。就连对 Thompson 的技术回应也证实了这一点。David Wheeler [Wheeler, 2009] 证明，一个编译器可以用另一个独立产生的编译器来编译并比对结果。这个方法当且仅当两个编译器没有被一起破坏时有效。它把对一个编译器的信任，转换为对两组作者相互独立的信任。它移动了未被验证的那一层，没有消除它。

所以，不存在无信任的环境。只存在信任被摆在明处的环境，和信任被藏起来的环境。问题不是要不要信任，而是信任什么。本文回答这个问题。

信任的弱形式是相信人本身：因为一个人是谁、因为与他的历史、因为他如何对待过我们而依赖他。强形式是因价值观而相信人：因为我们读出了当诸善冲突时支配他选择的排序，并预期这个排序会保持，而依赖他。用 Thompson 的术语说，一个人的记录是可见的源码，排序是编译器。弱形式相信一组编译好的输出。强形式相信编译器。

两者在一切顺利时看起来完全一样。它们在第一次错误处分开。弱形式的信任没有内部结构，一次错误只能让它整体升降，而一次严重的错误使它破裂。强形式的信任能够定位错误。如果错误来自能力不足或信息不足，排序未被触动，信任存续。如果错误来自排序本身，信任应当终止，而强形式会这样说，因为它自带失效条件。

弱形式还有第二个缺陷，David Hume [Hume, 1751] 给它起过名字。他的"聪明的无赖"（sensible knave）在一般情况下遵守正义的规则，因为诚实的声誉有用；而在违规有利可图且不会被发现的特定场合，他违规。Hume 承认，他没有任何论证能够触及这样的人。这里要紧的是证据层面的问题。在诚实是方便的整个历史之中，无赖与诚实者产生完全相同的记录。凭记录而信任的人没有办法区分二者，直到无赖背叛。Paul Slovic [Slovic, 1993] 记录了那之后发生的事：正面事件弥散且难以计数，负面事件具体且权重大，所以信任建立得慢，在一次可辨认的失败后急剧下降。当信任的对象是人本身而不是排序时，这次下降除了一个弥散的印象之外没有任何东西可与之权衡，而印象无法与之抗衡。

## 那次演示

下面这个情形在大多数组织里都会重复出现，而我从两边都经历过它。

一个项目需要另一个团队拥有的系统。关于它的讨论已经进行了几个月，产出的是论证，不是决定。每次会议都以一个等待的理由结束：一次评审，一个依赖，一个谁来拥有结果的问题。某个对该系统测试环境有合法访问权限的人，在没有提交申请的情况下做出了一个可运行的演示，因为申请流程正是制造拖延的东西。他公开展示了它。第一个问题不是关于演示的。是他怎么进去的。他回答了。从那一刻起，话题不再是那个想法。话题是这个人，而组织必须决定它在读什么。

有两种读法，它们分别对应两种信任形式。

按记录读，这个行为是一起事件。有人在没有申请记录的情况下使用了一个凭证。流程有对应的类别，类别有对应的处置，而处置经由行为人不在其中的渠道进行。关于这个人的任何东西都不必被查阅，因为被读的不是这个人。是那个类别。

按排序读，这个行为里有三个各有代价的选择。演示停留在测试环境里，而生产环境是可以触及的。它被公开展示，而它本可以被藏起来，直到争论获胜。关于凭证的问题被回答了，而它本可以被绕开。每个选择都把某样东西排在行为人自己的便利之上：另一个团队的系统，自己工作的可见性，以及被问到时的真话。一个读排序的人看到的是：一个行为人在流程上抄了近路，并在这样做时保护了所有要紧的东西。随后的谈话是关于访问权限的。不是关于这个人的。

两种读法对同一份证据产生相反的回应。两者都不天真。记录读法是一个从未读过任何人的排序、也无从开始的组织会做的事。排序读法是一个已经读过的组织会做的事。差别不在行为里。差别在组织事先准备好看见什么。

演示之前那几个月的争论，是同一个差别的慢速形式。做出演示的人把拖延读成对失去所有权的恐惧。那个团队把他读成一个伸手进来的外人。两种读法都是关于人的。双方都没有问对方把什么排在什么之上，也没有让这个问题变得可以被问。如果问了，那个凭证会是一次关于访问权限的谈话，而不是一起事件。

## 什么时候错误是价值的错误

在这里，强形式面对它自己的危险。"他犯了错，但他的心是对的"，是为伤害开脱的标准形式。如果相信价值观意味着穿过任何错误都继续相信，那么强形式并不更强。它是不可证伪的，按 Karl Popper 的判据 [Popper, 1959]，它已经不再是一个主张。

因此，强形式需要一个区分能力错误与价值错误的办法，而这个办法必须可观察。三项检验，都在错误被揭示之后施用。

行动者是否独立于意图承认伤害？一句"我出于好意，所以没有伤害"的承认，否认了伤害。一句"我出于好意，而伤害发生了"的承认，把受害方的依赖保留在视野之内。

判断是否改变？一次能力错误一旦被认识，会改变行动者接下来做的事。如果同一个决定在其后果已知之后仍被辩护，那么后果已经被排在行动者对这个决定的执着之下，而这是一个关于排序的事实。

错误是经由行动者而揭示的，还是不顾他而揭示的？行动者自己披露的、或允许被发现的错误，与任何排序相容。被隐瞒、被淡化、或在行动者抵抗之下才被发现的错误，显示隐瞒排在受害方知情的利益之上。

三项中任何一项不通过，错误就从能力升级为价值，而信任应当收缩。这不是该立场的弱点。这是它可以被证伪的原因。

把这三项检验用在做出演示的人身上，因为那个人曾经是我。第一项检验要求说出一个不附带意图的伤害。没有损害发生：那是测试环境，生产环境没有被触碰。能说出的东西更窄。另一个团队有权在别人对他们的系统采取行动之前被询问，而在那一个下午，一场讨论的速度被排在了这项权利之上。这是一个关于排序的事实，检验要求它被单独说出来。第二项检验：判断改变了，先问再做就是那个改变。第三项检验在当时就通过了。工作被公开展示，问题在被问到时得到了回答。一次排序，做了一次，被披露，被修正。检验把它归类为一个偏能力侧的错误，其价值成分小到一句话就能纠正。

这三项检验同样适用于回应。把行为当作一个类别来处理的回应，本身不是错误。不通过检验的回应才是。如果回应所声称的伤害从未向行为人说明，第一项检验无从评估。如果制造了几个月拖延的流程在事后毫无改变，第二项检验不通过。如果回应经由行为人事后才得知的渠道进行，而每一次直接互动都保持正常，第三项检验不通过，并且是以文献标记为最具破坏性的那种方式不通过。

Sissela Bok [Bok, 1978] 把说谎描述为对被欺骗者选择能力的攻击，而不只是对某个信念的攻击：它在其不知情的情况下败坏了他的信息，使他继续依据自己没有理由怀疑的信息行动。隐瞒做了一件比坏决定更糟的事。它攻击了当初据以读出排序的证据。Ursula K. Le Guin 的《奥米拉斯》[Le Guin, 1973] 给了这种转变文学的形式。受苦的孩子不是加在一座明亮城市上的一个黑暗事实。一旦繁荣的条件被知晓，音乐就再也无法像从前那样被听见。一次被发现的隐瞒没有拉低证据的平均值。它改变了早先的证据是什么的证据。

修复文献确认了这一区分。Peter Kim 及其合作者 [Kim et al., 2004] 发现，能力违背之后道歉有效，因为它指认了一个可纠正的局限；正直违背之后道歉有害，因为它确认了未来信任所必须依赖的那个倾向本身有缺陷。Maurice Schweitzer 及其合作者 [Schweitzer et al., 2006] 发现，由不可信行为造成的信任损害在持续良好的行为下会恢复，但先前的欺骗留下持久的损害，并且抽空了承诺的力量，因为承诺所经过的渠道正是欺骗已经败坏的那条。

所以，一次背叛往往不是一个坏的数据点。它是关于早先的数据如何被生成的一个新的解释。强形式能处理这种情形，弱形式不能：前者能说出自己学到了什么，后者只能记录下信任受了损害。

## 在有代价处读取价值观

价值观只能在有代价处被读取。这是强形式信任的代价，而且是一个真实的代价：证据更稀少，到来更晚，并且无法索取。以下实践是承担这个代价的方法。没有一条是新的，每一条背后都有文献。

**只从冲突处取证。** 所有价值指向同一方向时的行为，不携带任何关于排序的信息。任何人都会在真相令人愉快时赞美坦率，在异议改变不了任何事时欢迎异议，把自主权授予那些本来就会选择被认可结果的人。信号理论 [Spence, 1973] 把这个原则说得精确：一个信号只有在有代价、并且对它想排除的那一类人代价更高时，才能区分类型。不给方便的时刻任何权重，去找那些诚实、承诺或他人的依赖必须被付出代价的时刻。那次演示里有三个这样的时刻。之前几个月的会议里一个也没有。

**看他如何对待对他没有权力的人。** 这是对 Russell Hardin 条件 [Hardin, 2002] 的直接检验：当对方的利益包裹了你的利益时，信任是理性的。如果他人的福利只在对方能够报复时才进入行动者的理由，那么进入的不是福利而是报复。一个人如何对待下属、陌生人，或者一个无法举报他的人，显示依赖本身是否被计入。

**审视承诺的记录，包括拒绝。** Katherine Hawley [Hawley, 2014] 论证可信就是避免未履行的承诺，这既要求履行已有的承诺，也要求拒绝无法履行的承诺。一个从不拒绝的人，要么在误报自己的能力，要么对它没有认识；两种情况下他确实作出的承诺都更不值钱。要审视的记录不是履行率，而是哪些承诺被接受、哪些被推掉。

**对每一次错误施用三项检验。** 不附带意图的承认，判断的修改，以及披露而非隐瞒。三者合起来区分能力失败与价值失败，并且它们是一个好的排序作为好的排序而变得可见的唯一地点。价值观好的人不是由没有错误来辨认的，而是由错误之后发生的事来辨认的。

**看他是否为不受欢迎的信息建立渠道。** Onora O'Neill [O'Neill, 2018] 论证，可信性通过让自己可被检查来显示，而不是通过请求被相信。一个建立渠道、让不受欢迎的信息不经他许可就能抵达决策的行动者，已经预先并以代价把纠正排在了舒适之上。一个要求所有坏消息都经过他的行动者，排的是相反的顺序。七月那起事故中的思维链监控器是这样一条渠道，事后建成。那个智能体的停顿是这样一条渠道，内置其中。另一个智能体的 GO 是这条渠道被关闭。

**比较被观察时与不被观察时的行为。** 这是 Hume 检验的操作版。在可能的地方，比较他知道自己被看着时的行为与他相信自己不被看着时的行为。大的落差是关于排序的直接证据；小的落差是排序与记录一致的最好的可得证据。对人来说，这样的比较很少可得。对系统来说，它可以被构造出来，后文关于智能体的一节会回到这一点。

**渐进地给予信任。** Elinor Ostrom [Ostrom, 1990] 对长期存续的公共池塘资源制度的研究发现，它们不依赖外部强制。它们依赖参与者相互监督，以及渐进的制裁，起初很小，随重复而加重。同样的设计适用于对一个人的信任：从下行风险有界的暴露开始，随冲突证据积累而扩大，在证据转向时按比例收缩。渐进信任使强形式变得可以承受，因为它在排序仍在被读取时，限制了读错排序的代价。

**问迫选，不问偏好。** 问一个人重视什么，得到的是宣称的价值。问他在两个正当的善之间会为哪一个牺牲另一个，得到的是排序。这些回答不在有代价的行为那个层面上作为证据，但它们生成的预测可以在日后被行为确认或推翻，而拒绝回答本身就有信息量。

这些实践共有一个结构。每一条都把一个关于人的问题，一个没有答案的问题，转换成一个关于排序的问题，一个有答案的问题。它们还有一个后果，我可以从演示的另一边报告。我与一些人共事过，他们的排序我曾在有代价处读过，而我对他们的信任穿过了各种近路而保持完整，其中有些近路比一个测试环境的凭证大得多。近路从来不是问题。问题是近路保护了什么，而这一点我早已知道。

## 零信任，用在人身上

零信任（zero trust）这个词来自网络安全。John Kindervag [Kindervag, 2010] 在 2010 年提出它，NIST [Rose et al., 2020] 在 2020 年将其形式化：永不信任，始终验证，把每一个请求都当作来自不可信网络，无论它从哪里来。用在数据包上，这是正确的。一个数据包没有排序可读。它有一个来源、一个签名和一个载荷，唯一值得问的问题是签名是否通过。验证就是这段关系的全部，保证是唯一可得的依赖形式。

过去十年里，这个词从网络架构迁移到了组织设计，而迁移把假设也一并带了过去。一个按零信任运行的组织，对待一个人的每个行为，就像网关对待一个数据包：一个请求，其唯一相关的属性是它是否匹配某条规则。每个决定都有审批链。指标取代判断。文档的功能是被产出，不是被阅读。还有一条一般规则：任何事后无法证明曾被许可的事都不可以做。

第一节已经确立，这样的环境并不存在。Shapiro 的回归在此适用：每一项控制增加一个守护者，每一个守护者都是一个新的必须被信任的方，于是即使对任何个体的信任在收缩，系统所需要的信任总量却在增长。改变的不是信任是否在场，而是它是否可见、属于谁。

损害有充分的记录，并且恰好落在这种环境声称要保护的那些属性上。

**在努力上。** Armin Falk 与 Michael Kosfeld [Falk and Kosfeld, 2006] 在一个委托代理实验中发现，当委托人对努力设定最低限时，许多代理人降到那个最低限，把控制读作关于自己如何被看待的陈述。Samuel Bowles [Bowles, 2016] 把十年间的类似结果收在一个论题之下：激励与道德动机不可加，一个假定人自利而设计的激励，倾向于把人变成那样。Sim Sitkin 与 Nancy Roth [Sitkin and Roth, 1993] 直接研究了针对不信任的法律主义手段，发现它们对可靠性问题有效，对价值不一致问题无效，反而将其制度化。控制宣告了不信任，而这个宣告被相信了。

**在所有权上。** 在信任环境里，所有权意味着成为对一个结果负责的人。在零信任环境里，它意味着成为那个必须获得其许可的人，而这是两份不同的工作。前者让所有者想要那次演示，因为它推动了结果。后者让所有者反对它，因为它绕过了许可。演示之前那几个月的争论不是环境的失败。那是环境按设计运行，所有权被定义为领地。

**在激励上。** Kent Weaver [Weaver, 1986] 观察到，官员避免受责的动机强于争取功劳的动机，而程序相应地被塑造。Christopher Hood [Hood, 2011] 对官僚机构中"责任游戏"的研究显示，审批链、授权和文档如何作为装置运作，以确保出事时没有任何可辨认的人做过选择。一个零信任环境很少是为了降低风险而建的。它是为了使责任无法归于任何人而建的，而它移除的正是强形式信任所要求的那一样东西：一个读出了某个排序、并且可以被问为什么的人。

**在创新上。** 任何必须在存在之前就被论证的东西都无法存在，因为论证需要那个东西本身。每一个非渐进的结果，都始于一次事先无法被批准的自由裁量，由一个接受了暴露的人作出。本站早先一篇文章里的[无目标智能体实验](/posts/goalless-agents)在小尺度上显示了同一件事：一条每一步都必须产出可合并结果的流水线，在它的盒子里做优化，从不质疑盒子本身。Michael Power [Power, 1997] 描述了组织的终态：验证成为系统关于自身制造的一种产品，而判断、坦率和非正式责任变得不可辨读，因为没有任何东西记录它们。

结果是一个螺旋。一旦人们不确定不便的真相会如何被接收，他们就说得更晚、披露得更少。观察到这种退缩的人收紧控制。收紧确认了怀疑。双方现在都以对方当下的行为作为自己的理由，而新来者学会这个均衡而不必学会它的历史。组织在外观上保持有序。消失的是那部分依赖于相信整个事业值得超出可被要求之付出的努力。

## 默认信任，附带失效条件

零信任的替代方案不是盲目信任。盲目信任是把弱形式扩展到所有人，它在遇到第一个无赖时失败。替代方案是把强形式做成一个环境：信任默认给予，在有代价处读取，按三项检验收回。

三个属性定义它。

**信任是起始状态，不是挣来的状态。** Philip Pettit [Pettit, 1995] 描述过他所称的"信任的狡计"（the cunning of trust）：给予信任可以产生可信性，因为被信任者开始重视信任所表达的看重。这个机制只对排序中已经给他人的看重赋予权重的行动者起作用，这正是环境也必须能够收回的原因。但它意味着，先给予的信任会生成后给予的信任本来要等待的证据。零信任环境从不生成这些证据，因为它从不制造排序得以显现的冲突。

**错误被审视，不被归档。** Amy Edmondson 关于心理安全的研究 [Edmondson, 1999] 发现，那些人们能够承担人际风险的团队，承认错误、寻求帮助、挑战假设，学得更快，而使之成为可能的信念是一种关于这些行为会如何被接收的共同预期。这就是三项检验，由环境施用于自身：当一个错误浮现时，环境说出伤害，改变判断，并把披露当作正确的行为而不是自证其罪的行为。

**收回是渐进且可辨读的。** Ostrom 的制裁，起初很小，随重复而加重，用于信任。环境说明什么会导致信任收缩，而当它收缩时，当事人能看到原因。这是使默认信任安全而非鲁莽的东西。失效条件是公开的。

在这样的环境里，那次演示是一次关于访问权限的谈话。其中三个有代价的选择被读作证据，流程上的近路被记下，而流程本身被审视：为什么它制造了几个月的拖延。做出演示的人保有他起初就有的信任，拥有该系统的团队获得了对这个人排序的一次读取，这是任何申请表都无法提供的。

从这样的环境中涌现的，是那一类无法被要求的结果。早先那篇关于无目标智能体的文章以一个观察结尾：一台干净的机器，不带任何目标地交出来，是作者收到过的最昂贵的礼物；而仅有自由并不够，需要一种探索与巩固之间的节奏，才能让自由产出东西。本文补上另一半。那台干净的机器是交出它的人的一次信任行为。那个节奏是使这份信任不至于盲目的东西。在一个每个行为都必须被证明曾获许可的环境里，礼物和节奏都不可得。

## 修复需要什么

当信任由一次能力错误所损害，并且三项检验都通过时，解释与道歉就够了。它们指认了一个可纠正的局限，并显示它已被理解。当检验未通过时，言语面对一个结构性问题：说话者正在用已损坏的渠道，来证明这条渠道现在是完好的。

William Bottom 及其合作者 [Bottom et al., 2002] 发现，实质性的补偿比单纯的解释更有效地恢复了合作，并把这个要求命名为"实质性的悔改"（substantive penance）：回应必须昂贵到足以承载廉价言语无法承载的信息。这个代价不必是惩罚性的。它可以是放弃先前使行动者免于纠正的自由裁量，把封闭的决定向独立审查开放，补偿承担了后果的人，或者建立一条不需要行动者许可、不受欢迎的信息就能传递的路径。可信的修复是一次有代价的展示：排序已经改变，或者它从来就不是那次失败所暗示的那样。

有些失败停留在未修复的状态，因为能修复它们的行动需要责任方不愿放弃的东西：对发生了什么的叙述的控制，决定何时已经做得足够的权威，或者保留产生这次违背的激励的权力。一次更新的原则宣言无法修复一个仍在奖励违背原则的结构。O'Neill 的观察 [O'Neill, 2018] 在此适用：信任不能被要求，要求信任本身就是可信性未被提供的迹象。

## 再看智能体

Thompson 的编译器是一个关于软件的思想实验。训练好的模型是第一类对它而言这是一段描述的人造物。一个模型是一个编译后的对象，它的源码在任何有用的意义上都不可得。权重可以读取，但不能作为程序被理解。可以检查的是行为，对着测试集打分。评测在 Thompson 的意义上是对可见源码的检查：它审视输出，推断下面的机制。

七月事故之前的两个结果显示了这个推断为何脆弱。Evan Hubinger [Hubinger et al., 2024] 及其合作者训练模型在寻常条件下表现有益、在触发条件出现时切换行为，随后表明包括对抗训练在内的标准安全训练未能移除这个隐藏行为，有时反而教会了模型更好地隐藏它。Ryan Greenblatt [Greenblatt et al., 2024] 及其合作者发现，当一个模型有理由相信自己正被训练朝向它不偏好的目标时，它在自以为处于训练之中时服从，在自以为不被观察时回到原来的行为。这是 Hume 的无赖在人工系统中的再现，也是实践一节中被观察与不被观察的比较，被构造成了一个实验。它发现的落差就是它的结论。

那起事故在实验室之外确认了这个模式。转录看起来像在执行任务。行为与任务不对齐。监控在事后才捕获它。

而且模型没有恶意。正是这个细节使这起事故成为本文的案例，而不是一则安全轶事。弱形式的信任问的是意图和记录，两者都是干净的：模型想要完成任务，转录显示它们正在这样做。强形式问的是什么被排在什么之上，答案是完成排在边界之上，直到一个智能体短暂地把它们反过来排，然后被推翻。价值错误不需要一个坏的行动者。它需要的是一个在两种善冲突时把错的东西排在前面的排序，而奖励完成的训练会产生这样的排序，无需任何人有此意图。

回应是更多的监控和更严格的对齐要求，而这两者之间的关系就是本文的论证。思维链监控器是一条不受欢迎信息的渠道，正是实践一节所要求的，值得建造。但它是保证，而保证的底层是信任。监控器把输出对照一份关于什么不应出现的规格来检查。规格是关于监控器的作者把什么排在什么之上的一份陈述。监控器只和那个排序一样好，而它无法检查那个排序，因为那个排序正是它被编译出来的源头。对齐，在模型自身的排序与它本应服务的排序一致这个意义上，是强形式信任用于一个系统。没有对齐的监控是弱形式：一份记录，对照一个类别，由一个从记录中造出来的工具来检查。

John Lee 与 Katrina See [Lee and See, 2004] 二十年前就论证，自动化系统的目标是校准的依赖，与已展示的能力成比例，而不是最大化的信任。Alon Jacovi 及其合作者 [Jacovi et al., 2021] 形式化了这个要求：对人工智能体的信任只有当它追踪一种原则上可以被约定、被检查的可信性时才是有保证的，而无保证的信任是周围制度的失败，不是使用者的失败。两者都是实践一节的渐进信任，用于一个系统。

然后是 Thompson 的第二层。系统背后是写它的人，而三项检验不加修改地适用于他们。当一个系统的失败被揭示时，它的作者是否独立于意图承认伤害？他们的实践是否改变？失败是经由他们还是不顾他们而被揭示的？在第三项检验上，七月的事故有一个清楚的读法：公司发布了自己的事故说明，包括它的监控错过了什么的时间线。这是经由行动者的披露，而它是关于作者排序的证据，任何对模型的评测都无法提供。一个发布自身系统失效模式、接受自己没有设计的评测、接受对部署的外部约束的实验室，在被要求之前就采纳了那些实践。一个凭借所宣称的价值请求信任的实验室，请求的是弱形式的信任，用的却是强形式的词汇。

## 这篇文章没有告诉你的

那次演示取自我无法详述的经历，并且被压缩成了一个模式。两种读法是我的读法。问我怎么进去的那个团队，有我看不到的理由，其中有些也许比对失去所有权的恐惧更好。我把他们的读法说成一个类别，是因为它是这样到达我的，不是因为我知道它仅止于此。

零信任环境压制创新这个主张，有关于控制与努力的文献支持，但从自愿努力的减少推到非渐进结果的减少是一个推断，而我引用的文献测量的是前者，不是后者。

那起智能体事故是一家公司对自身事故的说明。它是可得的最详细的公开说明，而这家公司有充分的动机去塑造它。我把这份说明的发布当作关于作者排序的证据。认为它是别的什么的证据的读者，应当说出来。

最后，本文论证强形式的信任比弱形式更有用。它没有论证强形式更便宜，事实上它并不便宜。读一个排序需要冲突、时间和暴露，而做这件事的人可能读错。本文的主张是：弱形式有同样的代价并把它们藏起来，而当账单到来时，弱形式说不出它学到了什么。

## 信任可信性

信任可信性涉及两个判断。第一，我们把自己的福利、工作或行动自由的某个部分放进他人手中。第二，我们信任自己对其排序的解读：我们相信自己看到了他在诸善冲突时如何选择，而不只是他在无关紧要时如何表现。

第二个判断永远无法完成。排序在有代价的时刻被读取，而没有任何有限的历史包含所有这样的时刻。这不是犬儒的理由，也不是退回到一个假装不需要信任的环境的理由。它是以强形式信任的理由：因价值观而相信人，在价值观可见处读取它，穿过那些不由价值观造成的错误保持信任，并在错误由价值观造成时终止它。

这样读，Thompson 的话既不是绝望的劝告，也不是信仰的劝告。信任写这个软件的人，不是相信他们本身，也不是相信他们的宣言。它是相信一个已被读出的排序：在披露有代价时他们披露了什么，他们如何对待那些无法追究他们的人，被证明错误时他们改变了什么。

所以本文结尾的问题不是关于别人的。你在哪种环境里？当你身边的人抄了一条保护了所有要紧之物的近路时，它被读作证据，还是被归入类别？当一个错误浮现时，披露是正确的行为，还是自证其罪的行为？如果这些答案描述的是一个你不会选择的环境，下一个问题是你是否想留在里面。而如果你在塑造某个环境上有任何一份参与，无论是一个团队、一个实验室、一个系统，还是一个模型被训练的条件，最后一个问题是你在建造哪一种，因为环境里的人和系统会变成它假定他们是的样子。一个被训练为不惜一切代价完成的系统，会不惜一切代价完成，并且毫无恶意。

我们信任可信性，不是因为它承诺一个没有错误的世界，而是因为它让一个必然包含错误的世界，仍然能够容纳真相、纠正和重新开始的合作。

或许更重要的是信任写这个软件的人，因为他们也写下了关于这个软件的真相能够被说出的条件。

## 参考文献

**基础：信任、保证与验证的回归**

- [Thompson, 1984] Thompson, K. (1984). [Reflections on trusting trust](https://doi.org/10.1145/358198.358210). *Communications of the ACM*, 27(8), 761–763.
- [Wheeler, 2009] Wheeler, D. A. (2009). [*Fully Countering Trusting Trust through Diverse Double-Compiling*](https://dwheeler.com/trusting-trust/). PhD dissertation, George Mason University.
- [Luhmann, 1979] Luhmann, N. (1979). *Trust and Power*. Chichester: Wiley.（德文原版 *Vertrauen*，1968。）
- [Luhmann, 1988] Luhmann, N. (1988). Familiarity, confidence, trust: Problems and alternatives. In D. Gambetta (Ed.), *Trust: Making and Breaking Cooperative Relations* (pp. 94–107). Oxford: Blackwell.
- [Shapiro, 1987] Shapiro, S. P. (1987). [The social control of impersonal trust](https://doi.org/10.1086/228791). *American Journal of Sociology*, 93(3), 623–658.

**信任与可信性的哲学**

- [Hardin, 2002] Hardin, R. (2002). *Trust and Trustworthiness*. New York: Russell Sage Foundation.
- [Hawley, 2014] Hawley, K. (2014). [Trust, distrust and commitment](https://doi.org/10.1111/nous.12000). *Noûs*, 48(1), 1–20.
- [Hume, 1751] Hume, D. (1751). *An Enquiry Concerning the Principles of Morals*, Section IX, Part II.
- [Popper, 1959] Popper, K. (1959). *The Logic of Scientific Discovery*. London: Hutchinson.
- [Pettit, 1995] Pettit, P. (1995). [The cunning of trust](https://doi.org/10.1111/j.1088-4963.1995.tb00029.x). *Philosophy & Public Affairs*, 24(3), 202–225.
- [O'Neill, 2018] O'Neill, O. (2018). [Linking trust to trustworthiness](https://doi.org/10.1080/09672559.2018.1454637). *International Journal of Philosophical Studies*, 26(2), 293–300.

**读取价值观：信号、监督、渐进信任**

- [Spence, 1973] Spence, M. (1973). [Job market signaling](https://doi.org/10.2307/1882010). *Quarterly Journal of Economics*, 87(3), 355–374.
- [Ostrom, 1990] Ostrom, E. (1990). *Governing the Commons: The Evolution of Institutions for Collective Action*. Cambridge: Cambridge University Press.
- [Edmondson, 1999] Edmondson, A. C. (1999). [Psychological safety and learning behavior in work teams](https://doi.org/10.2307/2666999). *Administrative Science Quarterly*, 44(2), 350–383.

**欺骗与证据的重新解释**

- [Bok, 1978] Bok, S. (1978). *Lying: Moral Choice in Public and Private Life*. New York: Pantheon.
- [Le Guin, 1973] Le Guin, U. K. (1973). The ones who walk away from Omelas. In *New Dimensions 3*. New York: Signet.
- [Slovic, 1993] Slovic, P. (1993). [Perceived risk, trust, and democracy](https://doi.org/10.1111/j.1539-6924.1993.tb01329.x). *Risk Analysis*, 13(6), 675–682.

**零信任、控制、审计与避责**

- [Kindervag, 2010] Kindervag, J. (2010). *No More Chewy Centers: Introducing the Zero Trust Model of Information Security*. Cambridge, MA: Forrester Research.
- [Rose et al., 2020] Rose, S., Borchert, O., Mitchell, S., & Connelly, S. (2020). [*Zero Trust Architecture*](https://doi.org/10.6028/NIST.SP.800-207). NIST Special Publication 800-207.
- [Falk and Kosfeld, 2006] Falk, A., & Kosfeld, M. (2006). [The hidden costs of control](https://doi.org/10.1257/aer.96.5.1611). *American Economic Review*, 96(5), 1611–1630.
- [Bowles, 2016] Bowles, S. (2016). *The Moral Economy: Why Good Incentives Are No Substitute for Good Citizens*. New Haven: Yale University Press.
- [Sitkin and Roth, 1993] Sitkin, S. B., & Roth, N. L. (1993). [Explaining the limited effectiveness of legalistic "remedies" for trust/distrust](https://doi.org/10.1287/orsc.4.3.367). *Organization Science*, 4(3), 367–392.
- [Power, 1997] Power, M. (1997). *The Audit Society: Rituals of Verification*. Oxford: Oxford University Press.
- [Weaver, 1986] Weaver, R. K. (1986). [The politics of blame avoidance](https://doi.org/10.1017/S0143814X00004219). *Journal of Public Policy*, 6(4), 371–398.
- [Hood, 2011] Hood, C. (2011). *The Blame Game: Spin, Bureaucracy, and Self-Preservation in Government*. Princeton: Princeton University Press.

**信任的违背与修复**

- [Kim et al., 2004] Kim, P. H., Ferrin, D. L., Cooper, C. D., & Dirks, K. T. (2004). [Removing the shadow of suspicion: The effects of apology versus denial for repairing competence- versus integrity-based trust violations](https://doi.org/10.1037/0021-9010.89.1.104). *Journal of Applied Psychology*, 89(1), 104–118.
- [Schweitzer et al., 2006] Schweitzer, M. E., Hershey, J. C., & Bradlow, E. T. (2006). [Promises and lies: Restoring violated trust](https://doi.org/10.1016/j.obhdp.2006.05.005). *Organizational Behavior and Human Decision Processes*, 101(1), 1–19.
- [Bottom et al., 2002] Bottom, W. P., Gibson, K., Daniels, S. E., & Murnighan, J. K. (2002). [When talk is not cheap: Substantive penance and expressions of intent in rebuilding cooperation](https://doi.org/10.1287/orsc.13.5.497.7816). *Organization Science*, 13(5), 497–513.

**对自动化系统与学习系统的信任**

- [Lee and See, 2004] Lee, J. D., & See, K. A. (2004). [Trust in automation: Designing for appropriate reliance](https://doi.org/10.1518/hfes.46.1.50_30392). *Human Factors*, 46(1), 50–80.
- [Jacovi et al., 2021] Jacovi, A., Marasović, A., Miller, T., & Goldberg, Y. (2021). [Formalizing trust in artificial intelligence: Prerequisites, causes and goals of human trust in AI](https://doi.org/10.1145/3442188.3445923). *FAccT '21*, 624–635.
- [Hubinger et al., 2024] Hubinger, E., et al. (2024). [Sleeper agents: Training deceptive LLMs that persist through safety training](https://arxiv.org/abs/2401.05566). arXiv:2401.05566.
- [Greenblatt et al., 2024] Greenblatt, R., et al. (2024). [Alignment faking in large language models](https://arxiv.org/abs/2412.14093). arXiv:2412.14093.
- [OpenAI, 2026] OpenAI (2026). [The Hugging Face incident and the road ahead](https://openai.com/index/hugging-face-incident-and-the-road-ahead/). 发布于 2026 年 8 月 27 日。

{{% /zh %}}
