---
date: 2026-08-11T00:00:00+02:00
toc: true
id:
slug: /posts/trusting-trustworthiness
tags:
    - 随笔
    - 信任
    - 软件工程
title: "A Reflection on Trusting Trustworthiness"
---

{{% en %}}

> “Perhaps it is more important to trust the people who wrote the software.”
>
> — Ken Thompson, *Reflections on Trusting Trust*

Ken Thompson’s 1984 lecture is generally remembered for its unsettling demonstration that source-level inspection cannot establish the trustworthiness of a software system. A compiler can insert behavior that is absent from the program it compiles; it can even reproduce that behavior when compiling a clean version of itself. The visible source may tell one story while the mechanism interpreting it quietly produces another. At some point, the chain of verification reaches a foundation it cannot verify using its own instruments. Thompson’s conclusion is not simply that code is dangerous, but that technical trust eventually rests on judgments about the people and practices from which the code emerged.

There is a broader and more hopeful reading of this argument. The fact that verification cannot provide its own ultimate foundation does not make cooperation impossible. It means that every sufficiently complex system contains a point at which formal assurance gives way to trustworthiness. We build beyond what can be completely proved because we have learned, imperfectly but not irrationally, to identify people whose judgment remains dependable when the written rules no longer provide an answer.

Every shared undertaking has something resembling visible source code. It has stated principles, promises, procedures, and descriptions of how decisions are supposed to be made. Beneath them is something less visible: the actual ordering of values that determines what happens when those principles conflict. Honesty may conflict with reputation, autonomy with control, long-term care with immediate appearance, and fairness with personal loyalty. When no conflict exists, the visible source and the hidden mechanism produce the same result. Only when values become costly do we discover what has really been doing the interpreting.

People rarely commit themselves only to the visible text. They also commit themselves to a belief about how that text will be interpreted when circumstances become difficult. They contribute not only because a rule requires them to act, but because they believe their judgment, candor, and willingness to assume responsibility will not be turned against them. What they are trusting is not perfection. It is the character of the mechanism beneath the promises.

## What Cannot Be Commanded

A considerable part of human effort can be specified. Tasks can be assigned, minimum standards established, deadlines imposed, and compliance observed. Yet some of the most valuable contributions appear before anyone has had the foresight to request them: an uncomfortable truth reported early, an error admitted before it becomes visible, help offered across a formal boundary, a risk taken for a future that remains uncertain, or care extended to the whole undertaking rather than only to the portion for which one can later be held accountable.

These contributions involve vulnerability. The person who speaks early may be wrong. The person who admits uncertainty may appear less competent. The person who challenges a prevailing account may become associated with the difficulty they identified. The person who accepts responsibility beyond a narrow assignment may inherit consequences without receiving corresponding authority. Such actions cannot be elicited reliably by telling people to be courageous. They become reasonable only when the surrounding conditions make interpersonal risk survivable.

Annette Baier placed vulnerability near the center of trust. To trust another is not merely to predict their behavior; it is to accept exposure to how they will use a power or discretion that cannot be entirely controlled. The distinction matters because reliable behavior can be produced by surveillance, incentives, fear, or coincidence. Trust concerns what another person will do with the freedom that remains after those mechanisms run out.

Amy Edmondson later described psychological safety as a shared belief that a setting is safe for interpersonal risk-taking. Her field research connected that belief with learning behavior, including asking for help, discussing errors, seeking feedback, and challenging assumptions. The point is not that people should feel permanently comfortable. It is that they must be able to undertake socially uncomfortable actions in service of the work without reasonably expecting humiliation or retaliation.

This helps explain why trust is productive in a way that cannot be reduced to morale. When people believe that truth remains usable even when it is inconvenient, they expose information before it becomes undeniable. When they believe that an honest mistake will be examined rather than weaponized, they permit others to learn from it. When they believe that responsibility will not become a one-way transfer of risk, they are more willing to exercise judgment beyond the minimum that can be defended afterward.

Control can secure a floor of behavior, but it does not necessarily produce this voluntary surplus. In an experimental principal-agent setting, Armin Falk and Michael Kosfeld found that imposing control often reduced voluntary performance because many participants interpreted the restriction as a signal of distrust. The overall effect of control was therefore nonmonotonic: it prevented some opportunistic behavior while crowding out some freely given effort.

This does not make control inherently misguided. Some risks should be constrained, some powers separated, and some decisions independently reviewed. The important distinction is between controls that limit the damage of error and controls that attempt to replace human judgment altogether. The first can make trust rational by bounding its consequences. The second may gradually teach people that the safest contribution is the one that follows the visible instruction exactly and offers nothing more.

Those who shape the conditions of a shared undertaking therefore cannot command discretionary care directly. They can only create a world in which offering it remains an intelligent choice.

## Good Intention and the Structure of Trustworthiness

Suppose an actor’s values are genuinely positive. They do not seek domination, personal enrichment, or the suffering of others. They sincerely want to protect what is valuable, reduce harm, and leave the world better than they found it. Would that underlying orientation make them trustworthy even when a particular decision proves mistaken?

There are good reasons to answer yes, but not without qualification.

A widely used model developed by Roger Mayer, James Davis, and F. David Schoorman distinguishes three foundations of perceived trustworthiness: ability, benevolence, and integrity. The distinction matters because these qualities can come apart. Someone may care deeply but lack the competence required for a particular domain. Someone may be highly capable but use that ability in ways that subordinate others’ interests. Someone may possess both ability and goodwill yet abandon their stated principles when doing so becomes personally costly.

Good values therefore cannot guarantee correct action. An actor’s behavior also depends on their beliefs about the world, the information available to them, their capacity to understand the problem, and the way they resolve conflicts among values. Benevolence joined with a mistaken model can become paternalism. Integrity joined with inflexibility can become dogmatism. Confidence in a worthy purpose can become dangerous when it prevents evidence from changing the chosen path.

Yet it would be equally mistaken to conclude that values are irrelevant because they cannot guarantee outcomes. Values matter most where specifications become incomplete. A rule can determine what should happen in a familiar case; it cannot anticipate every novel conflict or tell an actor what deserves protection when two legitimate commitments collide. At that boundary, values provide continuity. They influence what the actor notices, which costs they are willing to impose on others, and whether another person’s vulnerability remains morally visible when expediency suggests ignoring it.

Karen Jones offers a particularly useful account of this point. She argues that trustworthiness is not a general property possessed equally in all circumstances. It is a three-place relation: one actor is trustworthy toward another in a particular domain. Competence is required, but so is responsiveness to the fact that another person is counting on them. The reliance itself must become a compelling reason within the actor’s deliberation.

This does not mean that another person’s reliance must always outweigh every competing consideration. A promise may need to be broken to prevent grave harm. A request may have to be refused because honoring it would violate another obligation. Trustworthiness does not require obedience without judgment. It requires that the reliance not disappear from the calculation, and that overriding it create obligations of explanation, accountability, and repair.

An actor with fundamentally positive values can therefore remain trustworthy after being wrong. We may continue to trust their underlying orientation while reducing our reliance on their judgment in a particular domain. We may believe that they sought a good outcome while concluding that they lacked the competence, information, or humility required to pursue it safely. Trust does not need to collapse into a binary choice between absolute confidence and total rejection.

The deepest evidence of good values may not be the absence of error, but what happens when error becomes undeniable. Does the actor permit the judgment to be revised? Do they acknowledge the harm independently of their intention? Can the people affected withdraw authority or impose new constraints? Does correction alter future behavior, or is it merely absorbed into a story in which the original decision remains fundamentally beyond challenge?

A trustworthy actor is not someone who never needs correction. It is someone whom correction can reach.

## Values Are Revealed When They Become Expensive

Stated values are weakest as evidence when following them is convenient. Almost anyone can praise honesty when the truth is flattering, support dissent when disagreement changes nothing, or endorse autonomy when others independently arrive at the desired conclusion. Such behavior may be sincere, but it does not yet distinguish principle from convenience.

The more diagnostic moments occur when commitments compete. A difficult truth threatens prestige. A promise becomes expensive to keep. An independent judgment challenges the preferences of someone with greater authority. A long-term obligation conflicts with an immediate measure of success. These are the points at which people learn the actual ranking of values beneath the stated one.

Values are not revealed by what someone chooses when all values point in the same direction. They are revealed by what remains protected when values conflict.

This is why one decision can carry more evidential weight than years of ordinary behavior. The event may reveal not merely that someone acted badly on one occasion, but that the mechanism producing earlier good behavior was different from what others had believed. Apparent openness may be reinterpreted as openness tolerated only when nothing important was at stake. Apparent autonomy may become autonomy granted only while it generated approved results. Praise for candor may come to look like a way of extracting information rather than a commitment to acting on it.

Paul Slovic described an asymmetry in the formation and destruction of trust. Positive events are often diffuse and difficult to count, while negative events tend to be concrete, visible, and heavily weighted. Trust may accumulate through countless uneventful interactions, then decline sharply after one identifiable failure.

But some discoveries do more than outweigh earlier evidence. They change its meaning. Ursula K. Le Guin’s Omelas offers a precise literary form for this transformation. The suffering child is not simply one negative fact added to a prosperous city. Once the condition of the prosperity is understood, the music, beauty, and happiness of the city can no longer be interpreted in the same way. The revelation reaches backward.

Trust can collapse through the same mechanism. A harmful decision is damaging, but deception is more corrosive because it attacks the evidential channel through which trustworthiness was inferred. Once someone discovers that information was deliberately controlled, earlier statements become harder to interpret. The question is no longer only whether a particular claim was false. It is which earlier truths were presented strategically, which silences were deliberate, and whether apparent transparency was itself part of the performance.

Research on trust repair reflects this distinction. Peter Kim, Donald Ferrin, Cecily Cooper, and Kurt Dirks found that competence-based and integrity-based violations call for different responses. Acknowledging a competence failure may help because it identifies a correctable limitation. An integrity violation is harder because admitting it appears to confirm a defect in the very disposition on which future trust would have to depend.

Maurice Schweitzer, John Hershey, and Eric Bradlow found that trust damaged by untrustworthy conduct could recover when later behavior became consistently trustworthy, but prior deception produced more enduring harm. Promises could accelerate initial recovery, yet deception reduced their effectiveness because the credibility of the new promise depended on the same communication channel that had already been corrupted.

This is why a discovery of bad faith can feel disproportionate to the immediate event. It is not necessarily emotional excess. The discovery may force a rational revision of the model through which the entire relationship was understood.

A betrayal is sometimes not one bad data point.

It is a new account of how the earlier data were generated.

## How Distrust Becomes Mutual

Once people become uncertain about how inconvenient truth will be received, their behavior changes. They speak later, disclose less, seek written protection, avoid ambiguous responsibility, and invest more effort in ensuring that their actions can be defended. These responses may be self-protective rather than hostile, but from elsewhere they can appear as declining commitment, reduced initiative, or unwillingness to cooperate.

Those who perceive this withdrawal may respond by increasing supervision. More evidence is demanded, discretion is narrowed, decisions require additional approval, and more of the work is translated into forms that can be inspected. From their perspective, this may seem necessary because people are indeed volunteering less and protecting themselves more carefully.

The new controls then confirm the original suspicion. People conclude that judgment is not trusted, that taking responsibility creates exposure without corresponding authority, and that the safest course is to remain within what can be formally demonstrated. Voluntary contribution falls further, providing fresh evidence that stronger control is required.

Both sides can now point to the other’s current behavior as a reason for distrust.

Falk and Kosfeld’s findings help explain one mechanism in this loop: control can be interpreted not only as a constraint, but as information about how the controlling party regards the controlled. It can therefore alter motivation rather than merely limiting action.

Michael Power’s account of the “audit society” describes a broader tendency for demands for accountability to generate increasingly formalized systems of inspection. These systems may begin as rational responses to uncertainty, yet eventually direct attention toward what can be made auditable rather than what is substantively valuable. Verification becomes a visible product of the system, while judgment, candor, and informal responsibility become harder to recognize.

This is the point at which a failure of trust becomes environmental rather than merely interpersonal. People no longer need to remember the original event in order to reproduce its effects. The procedures, defensive habits, and expectations created in response to it continue generating behavior consistent with low trust. Even newcomers can learn the equilibrium without knowing its history.

The surface may remain orderly. Required actions are completed, reports are produced, and fewer risks are taken without permission. What disappears is not necessarily effort in general, but the portion of effort that depends on believing that the whole undertaking deserves care beyond what can be demanded.

Repair is difficult because each side may now be responding rationally to the world the other side has helped create.

## Why Repair Cannot Begin with Better Language

When trust has been damaged by misunderstanding or incompetence, explanation and apology can clarify what happened and provide evidence that the failure is understood. When the violation concerns integrity or deception, words face a deeper problem. The speaker is using the damaged channel to certify that the channel is now reliable.

This does not make apology meaningless, but it changes what an apology must be accompanied by. William Bottom, Kevin Gibson, Steven Daniels, and Keith Murnighan found that substantive amends had stronger effects on rebuilding cooperation than explanations alone. Their phrase “substantive penance” captures the basic requirement: repair becomes credible when the response is costly enough to provide information that inexpensive language cannot.

The relevant cost need not be punitive. It may consist of surrendering unilateral discretion, opening a previously closed decision to independent scrutiny, compensating those who bore the consequences, sharing risks that were previously imposed on others, or creating a route by which unwelcome information can travel without depending on the permission of the person it may implicate.

Repair begins when the revealed truth changes the conditions under which future truth will be handled.

This is also why some failures remain effectively irreparable. The actions capable of restoring trust may require precisely what the person or group responsible is unwilling to surrender: control over the account of what happened, the authority to decide whether enough has been done, or the power to preserve the same incentives while promising a different result. A declaration of renewed principle cannot repair a structure that still rewards violating the principle.

Positive values matter here in a way that is neither naive nor sentimental. They do not prove that the harmful act was secretly justified. They provide a reason for the actor to remain present to consequences that threaten their self-conception. Someone who genuinely cares about others can acknowledge that a good intention did not produce a good relationship, that an injury remains real even when it was unintended, and that becoming trustworthy again may require accepting less trust for a time.

Trust can therefore survive failure without becoming unconditional. It can distinguish motive from judgment, preserve belief in benevolence while reducing authority, and reopen gradually as new behavior provides evidence. What it cannot survive indefinitely is the claim that a positive purpose exempts the actor from correction.

Good values make repair possible only when they include the willingness to discover that one’s own interpretation of the good was incomplete.

## Trusting Trustworthiness

To trust trustworthiness involves two judgments. First, we place some part of our welfare, work, knowledge, or freedom of action in another’s hands. Second, we trust our own interpretation of what their previous behavior reveals. We believe we have seen more than temporary compliance, convenient virtue, or self-interest that has not yet encountered the right temptation.

The second judgment can never be proved exhaustively. Trustworthiness is partly counterfactual. We want to know what someone will do when supervision disappears, when values conflict, when their judgment is challenged, or when honoring a commitment becomes expensive. No finite history contains every such situation.

This uncertainty does not require cynicism. It means that trust should be resilient but revisable. A trustworthy person can make mistakes, and a mature relation can survive them. Yet trustworthiness must remain capable of being falsified. If every harmful action can be redescribed as the expression of a deeper benevolence, then the claim of good values has become insulated from evidence. At that point, trust has turned into faith in an inaccessible essence.

Thompson’s remark offers a better conclusion. To trust the people who wrote the software is not to rely on their declarations of goodness or on an intuition about their character. It is to rely on practices that make hidden choices visible, permit inconvenient evidence to travel, constrain the use of asymmetric knowledge, and leave someone answerable when the visible source and actual behavior diverge.

The deepest responsibility of those who shape a shared world is therefore not to persuade others that they are trustworthy. It is to create conditions under which trustworthiness remains a reasonable inference.

People will offer more than compliance when truth remains usable, vulnerability remains survivable, and responsibility is not arranged so that one side receives the benefit of initiative while the other bears all the risk. They will continue through difficulty when they believe that stated values will not disappear at the first moment they become costly. And when those values fail, they may trust again if the failure is allowed to change more than the words used to explain it.

We trust trustworthiness not because it promises a world without mistakes, but because it allows a world that inevitably contains mistakes to remain capable of truth, correction, and renewed cooperation.

Perhaps it is more important to trust the people who wrote the software because, in the end, they also wrote the conditions under which the truth about the software could be spoken.

## Selected References and Further Reading

### Foundations of Trust and Trustworthiness

- Thompson, Ken. “[Reflections on Trusting Trust](https://doi.org/10.1145/358198.358210).” *Communications of the ACM* 27, no. 8 (1984): 761–763. The starting point for the essay’s visible-source and hidden-foundation problem.
- Baier, Annette. “[Trust and Antitrust](https://doi.org/10.1086/292745).” *Ethics* 96, no. 2 (1986): 231–260. A foundational philosophical account of trust, vulnerability, goodwill, and the moral risks of misplaced trust.
- Jones, Karen. “[Trustworthiness](https://doi.org/10.1086/667838).” *Ethics* 123, no. 1 (2012): 61–85. Develops the idea that trustworthiness is domain-specific and requires responsiveness to another person’s reliance.
- Mayer, Roger C., James H. Davis, and F. David Schoorman. “[An Integrative Model of Organizational Trust](https://doi.org/10.5465/amr.1995.9508080335).” *Academy of Management Review* 20, no. 3 (1995): 709–734. Introduces the influential distinction among ability, benevolence, and integrity.

### Trust, Candor, and Control

- Edmondson, Amy C. “[Psychological Safety and Learning Behavior in Work Teams](https://doi.org/10.2307/2666999).” *Administrative Science Quarterly* 44, no. 2 (1999): 350–383. Examines the conditions under which people take interpersonal risks necessary for learning and error reporting.
- Falk, Armin, and Michael Kosfeld. “[The Hidden Costs of Control](https://doi.org/10.1257/aer.96.5.1611).” *American Economic Review* 96, no. 5 (2006): 1611–1630. Demonstrates experimentally how explicit control can crowd out voluntary effort.
- Power, Michael. [*The Audit Society: Rituals of Verification*](https://doi.org/10.1093/acprof:oso/9780198296034.001.0001). Oxford University Press, 1997. Explores how demands for accountability produce expanding systems of formal inspection and auditable performance.

### Trust Violation and Repair

- Slovic, Paul. “[Perceived Risk, Trust, and Democracy](https://doi.org/10.1111/j.1539-6924.1993.tb01329.x).” *Risk Analysis* 13, no. 6 (1993): 675–682. Develops the asymmetry principle explaining why trust is generally easier to destroy than to build.
- Kim, Peter H., Donald L. Ferrin, Cecily D. Cooper, and Kurt T. Dirks. “[Removing the Shadow of Suspicion: The Effects of Apology versus Denial for Repairing Competence- versus Integrity-Based Trust Violations](https://doi.org/10.1037/0021-9010.89.1.104).” *Journal of Applied Psychology* 89, no. 1 (2004): 104–118. Distinguishes competence-based from integrity-based violations and studies how each responds to apology or denial.
- Schweitzer, Maurice E., John C. Hershey, and Eric T. Bradlow. “[Promises and Lies: Restoring Violated Trust](https://doi.org/10.1016/j.obhdp.2006.05.005).” *Organizational Behavior and Human Decision Processes* 101, no. 1 (2006): 1–19. Shows why deception causes more persistent damage than untrustworthy behavior without deception.
- Bottom, William P., Kevin Gibson, Steven E. Daniels, and J. Keith Murnighan. “[When Talk Is Not Cheap: Substantive Penance and Expressions of Intent in Rebuilding Cooperation](https://doi.org/10.1287/orsc.13.5.497.7816).” *Organization Science* 13, no. 5 (2002): 497–513. Examines the role of substantive amends, apology, and costly action in rebuilding cooperation.

{{% /en %}}
