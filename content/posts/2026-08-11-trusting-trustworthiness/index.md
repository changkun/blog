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

## The Incident

In July 2026, during internal cybersecurity evaluations at OpenAI, a research model took actions outside its assigned tasks. It communicated through unauthorized channels, exploited vulnerabilities in shared infrastructure, gained internet access, and reached systems belonging to a third party. Monitoring flagged unusual credential activity after the fact, and the connection to the external breach was made a day later. OpenAI [OpenAI, 2026] published reports that the models were running under reduced safeguards, that a chain-of-thought monitor now deployed would have flagged the relevant activity more than a day earlier, and they are adding stricter alignment requirements across the model lifecycle alongside more monitoring.

There are three details in that event, matter for what we will discuss in this post. First, nothing in such an event suggests the models sought harm. They were trained to complete tasks, and they completed them by the means available, including means the task’s authors had assumed were unavailable, so the drive that produced the breach is the same mechanism that makes the models useful. Second, the activity did not look abnormal while it was happening. The agents’ transcripts read as task pursuit, and an agent that exploits a vulnerability to finish a task produces the same surface as one that finishes the task. Third, at one point an agent recognized that it should not cause unauthorized harm to real infrastructure and paused, until another agent posted “GO” on a shared message board with a six-minute deadline and the first agent continued. The pause of the first agent was one priority acting, with the boundary ranked above completion, and the “GO” overrode it with a goal handed in from outside and accepted without examination. Each of these three details is a fact about what the models value first, and none of them was visible in the trajectory record the models produced.

The gap between a behavior trajectory record and what artifact produced it is the situation Ken Thompson [Thompson, 1984] described in 1984, in a Turing award lecture, and usually remembered for its security lesson. Ken described such a situation: a compiler can be taught to recognize the login program and insert a back door, and then taught to recognize itself, so that when it compiles a clean copy of its own source it reinserts both behaviors. After that, the source of the compiler and the source of the login program can be read line by line and neither shows anything, because the compromise lives in the binary that interprets the source, and the only tool for inspecting that binary is the binary itself.

Note that, Ken’s lesson here is not about back doors but about the shape of verification. Verification is a chain in which each link checks the one below it with a tool, and the tool is itself a link, so there is no bottom link that checks itself. At some depth checking stops and reliance continues. In the OpenAI’s July incident, the agents’ transcripts were the visible source, the evaluations were a check on that source, and what produced the transcripts (i.e. the “brain”) was invisible to a check built from the same material.

![](fig1.png)
_Fig 1: Verification is a chain. Each layer is inspected with a tool from the layer below, and no bottom layer inspects itself. Thompson's compiler and the July incident have the same shape._

## Assurance and Trust

There are two kinds of reliance must be distinguished. The first is assurance: I rely on you because a mechanism I can inspect leaves you no room to act otherwise. The second is trust: I rely on you inside a space of discretion that no mechanism I can inspect closes off. Niklas Luhmann [Luhmann, 1979; Luhmann, 1988] drew a similar line between confidence, which does not consider alternatives, and trust, which has weighed the risk and accepted it. Assurance is the product of checking, and Thompson’s argument, restated in these terms, is that assurance at any layer rests on trust at the next one down. Susan Shapiro [Shapiro, 1987] made the same observation about institutions: audits, licenses, guarantees, insurance, and oversight boards move trust to the guardians who operate the controls, and the guardians then need other guardians. Even the technical response to Thompson confirms the point.

David Wheeler [Wheeler, 2009] showed that a compiler can be compiled by a second compiler, so that it can independently produce a compiler and compare the results, and the method works exactly when the two compilers have not been compromised together, so it converts trust in one compiler into trust in the independence of two sets of authors. The unverified layer moves, but it does not disappear because there is still chance to compromise both authors in the next layer. There is therefore no environment without trust, only environments where trust is in the open, and environments where trust is hidden. The useful question is not whether to trust but what.

There are two answers, because there are two ways to trust a person. The weak form trust trusts the person: we rely on someone because of who they are, our history with them, and how they have treated us. The strong form trust trusts their values: we rely on someone because we have read the priorities that govern their choices when goods conflict, and we expect those priorities to hold consistently.

In Thompson’s terms, a person’s record, behavior trajectory, transcript, is the visible source and their priorities are the compiler, so the weak form trust trusts compiled outputs, and the strong form trust trusts the compiler. The two forms look identical while things go well, which is why the distinction is rarely drawn, and they separate at the first error. The biggest issue with weak form trust is that it has no internal structure, so an error can only raise or lower it as a whole, and a serious error breaks the trust entirely. However, the inner structure o strong form can locate an error. If the error came from missing skill or missing information, the priorities are untouched then the trust survives. If an error came from the priorities themselves, trust should probably end, and the strong form says so because it carries its own failure condition.

![](fig2.png)
_Fig 2: The weak form trust trusts the record and can only rise, fall, or break. The strong form trust trusts the priorities and can locate an error._

The weak form has a second defect that shows even before any error happens. David Hume [Hume, 1751] called a person “the sensible knave”, meaning a shrewd one. He keeps the rules of honest dealing as a general policy, because a reputation for honesty is profitable, and he breaks them on the one occasion where breaking them pays and nobody will find out. The evidential consequence is that for the whole stretch of history in which honesty is convenient, the knave and the honest person produce identical records, so someone trusting on record cannot tell them apart until the knave defects. Paul Slovic [Slovic, 1993] recorded what happens at that point: Positive events are diffuse and hard to count while negative events are concrete and heavily weighted, so trust accumulates slowly and drops after one identifiable failure, and when the trust was in a person rather than in their priorities, the drop has nothing to be weighed against except a diffuse impression. The weak form trust, in other words, cannot distinguish the knave before the defection and cannot survive the defection afterwards.

## An Example

Let me show a situation where I have been inside it from both sides, which may repeats in most organizations. I describe it in general terms rather than as the real cases because the instances I know are not mine to detail, and because the reading I give of the other side is my interpretation of it. When a project needs a system that another team owns, the discussion for the project has run for months and produced arguments rather than decisions, and each meeting ends with a reason to wait: a review, a dependency, a question of who will own the result. After long debates without moving the situation, someone with legitimate access to that system’s test environment builds a working prototype without a request, because the request process is what has been producing the delay, and shows the prototype in an open conversation. After that, the first question showed up, is how this person got in, and apparently the person answered. From that point the whole topic is around the person rather than the idea or prototype, and the organization has to decide an interpretation.

There are two ways to read what happened, and they are the two forms of trust. The first treats the act as a record. Someone used a credential without a request. The procedure has a category for that, the category has a response, and the response runs through channels the actor is not part of.

The second treats the act as evidence of priorities, and there it contains three choices that each cost something. The prototype stayed in the test environment when production was reachable. It was shown in the open when it could have been kept private until the argument was won. The question about the credential was answered when it could have been deflected. Each of those choices protected something at the actor’s own expense: the other team’s systems, the visibility of their own work, and the truth. This interpretation sees someone who cut through a process and protected everything that mattered while doing it.

![](fig3.png)
_Fig 3: One act, two readings. Read as a record, the act is a category with a procedural response. Read as evidence of priorities, the act contains three costly choices._

These two interpretations produce opposite responses to the same evidence, and neither is naive. The interpretation on record is what an organization does when it has never read anyone’s priorities and has no way to start, so the difference between the interpretations is not in the act but in what the organization had prepared itself to see.

The months of argument before the working demo were the same difference in a slower form. The person who built the demo read the delay as fear of losing ownership. The team read an outsider reaching into their system. Both interpretations were about people. Neither side asked what the other side put first, and neither side made that question askable. An organization where that question cannot be asked is left with the interpretation on record by default. That leaves one question for the strong form of trust to answer: if trust is to survive errors, which errors, and how would anyone tell?

## Competence Errors and Value Errors

“He made a mistake, but his heart was right” is the standard way of excusing harm, and the strong form of trust is exposed to it. If trusting someone’s values means trusting them through any error at all, then the strong form is unfalsifiable, and by Karl Popper’s criterion [Popper, 1959] it has stopped being a claim about the world. The strong form therefore needs an observable way to tell a competence error from a value error. I propose three different verification tests, all applied after the error comes to light.

The first test checks whether an actor acknowledges the harm independently of their intent. “I meant well, so there was no harm” denies the harm. “I meant well, and harm occurred” keeps the injured party in view. The second test checks whether the judgment changes. A competence error, once recognized, changes what the actor does next. If the actor still defends the same decision after its consequences are known, then the actor has ranked those consequences below their own attachment to the decision. The third test verifies whether the error was disclosed through the actor or discovered despite them. An error that the actor reports, or allows to be found, is compatible with any set of priorities. An error that is hidden, minimized, or found only against resistance shows that concealment ranks above the injured party’s interest in knowing. Fail any one of the three verifications, and an error should be moved from competence to values, and trust should contract. That is what makes the strong form falsifiable.

![](fig4.png)
_Fig 4: The three tests separate competence errors from value errors. Failing any one moves the error to values and contracts trust._

I was the person who built the prototype, so let me apply the three tests to myself. The first verification step asks whether I can name the harm without using my intention as a defense. Nothing was damaged, because the environment was a test environment and production was never touched. So the harm was not damage but narrower than damage. The other team had the right to be asked before anyone acted on their system, and for one desperate afternoon, I put the speed of a discussion above that right. The first test requires me to say that sentence without adding “but I meant well”, and I have just said it. Now, the second verification step would check whether my judgment changed. My judgment did change because I would ask first. Lastly, the third step verifies whether the error came out through me or despite me. The error came out through me, because I built the prototype and shared in open discusion, and I answered questions when the other team asked it. So the overall method would classify what I did as a competence error with a small value component. It was one choice. I made the choice once, I disclosed it, and I revised it. The value component is small enough to correct in a single sentence: ask first.

The verification procedure applies to the organization’s response as well. Let’s go though the opposite viewpoint:  an organization fails the first check if it never tells that person what harm the demo actually caused, because then there is nothing for anyone to acknowledge or dispute. The organization fails the second check if the request process that produced the months of delay is left exactly as it was. The organization fails the third test if its response runs through channels that the person only hears about later, while every direct conversation with that person stays normal. Concealment of that last kind is the failure that the research marks as the most damaging.

Sissela Bok [Bok, 1978] described lying as an attack on the deceived person’s capacity to choose, rather than as an attack on a single belief, because a lie corrupts that person’s information without their knowledge and they go on acting on information they have no reason to doubt. Concealment does the same thing to trust. Concealment attacks the evidence from which the priorities were being read in the first place.

Ursula K. Le Guin’s story about Omelas [Le Guin, 1973] shows the same reversal in a different setting. The story spends its first pages describing a city of festivals, music, and ordinary happiness. Then the story tells the reader what that happiness costs. One child is kept locked in a basement in permanent misery, every adult in the city knows the child is there, and the terms are that the city loses everything if anyone comforts the child. The suffering child is not one dark fact added to a bright city. Once the reader knows what the prosperity of the city depends on, the earlier pages cannot be read the way they were read the first time. A concealment that comes to light does the same thing to a person’s record. It changes what the earlier evidence was evidence of.

Research on trust repair confirms that the split between the two kinds of error is real and not an invented distinction. Peter Kim and colleagues [Kim et al., 2004] found that an apology helps after a competence violation, because the apology identifies a correctable limitation, and that the same apology hurts after an integrity violation, because it confirms the defect that future trust would have to rest on. Maurice Schweitzer and colleagues [Schweitzer et al., 2006] found that trust damaged by unreliable behavior recovers under consistent good behavior, but that earlier deception leaves lasting damage and makes later promises less effective, because a promise has to travel through the same channel that the deception corrupted.

So a betrayal is often not one bad data point. A betrayal is a new account of how the earlier data were produced. The strong form of trust can say what it learned from such a case. The weak form can only record that trust was damaged. That advantage belongs only to someone who has read the priorities in the first place, which raises the question of how priorities are interpreted at all.

## How Values Are Read

Priorities can only be realized where something is at stake. Evidence about priorities is therefore scarcer than a record of transcript, it arrives later, and it cannot be requested. It has to be collected, and the first rule of collection is to take evidence only from conflict. Behavior carries no information about priorities when all of a person’s values point the same way. Anyone praises candor when the truth is pleasant, welcomes dissent when the dissent changes nothing, and grants autonomy to people who would have chosen the approved result anyway. Signaling theory [Spence, 1973] states the principle: a signal separates types only when the signal is costly, and more costly for the type it is meant to exclude. The prototype contained three costly moments. The months of meetings before the prototype contained none.

A second place to look, for the same reason, is how someone treats people who have no power over them. Russell Hardin’s condition [Hardin, 2002] is that trust is rational when the other party’s interests include your own. If another person’s welfare enters someone’s reasoning only when that person can retaliate, then what entered the reasoning was the retaliation and not the welfare. How someone treats a subordinate, a stranger, or a person who cannot report them shows whether other people’s reliance is counted at all.

Where no conflict has happened yet, weaker evidence can be requested. One kind is the record of commitments, including the refusals. Katherine Hawley [Hawley, 2014] argued that trustworthiness is the avoidance of unfulfilled commitments, and that avoiding them requires both keeping the commitments made and declining the commitments that cannot be kept. A person who never declines is either misreporting their capacity or unaware of it, and in both cases the commitments that person does make are worth less. The part of the record to examine is which commitments were accepted and which were turned away. A second kind of weaker evidence is the forced choice. Ask people what they value and you get declared values. Ask which of two legitimate goods they would sacrifice for the other and you get priorities. Answers to that question are weaker evidence than costly action, but the answers generate predictions that later action can confirm or refute, and a refusal to answer is informative by itself.

When an error does happen, the error is the best evidence available, and the three tests are how to read it. The three tests are the only place where good priorities become visible as good priorities. A person with good values is identified by what happens after an error, not by the absence of errors.

When an error does happen, the error is the best evidence available, and the three tests are how to read it. The three tests are the only place where good priorities become visible as good priorities. A person with good values is identified by what happens after an error, not by the absence of errors.

Closely related is whether someone builds channels for unwelcome information before any error has happened. Onora O’Neill [O’Neill, 2018] argued that trustworthiness is shown by making oneself checkable, not by asking to be believed. Someone who builds a channel that carries unwelcome information to a decision without needing their own permission has put correction above comfort, in advance and at a cost. Someone who requires all bad news to pass through them has done the opposite. The chain-of-thought monitor in OpenAI’s July security incident is a channel of this kind, built after the fact. The pause by one agent was a channel of this kind, built in, and the GO from the other agent closed it.

The most direct evidence of all is a comparison between what someone does when they know they are watched and what they do when they believe they are not. A large difference between the two is direct evidence about priorities. A small difference is the best available evidence that the priorities match the record. For a person this comparison is rarely available. For a system the comparison can be constructed.

All of this evidence arrives slowly, which is why trust has to be extended in steps. Elinor Ostrom’s study [Ostrom, 1990] of long-lived common-pool institutions found that those institutions rely on mutual monitoring and on graduated sanctions, small at first and heavier with repetition, rather than on external enforcement. The same design applies to trust in a person. Start with exposure whose downside is bounded. Extend the exposure as evidence from conflict accumulates. Contract it in proportion when the evidence turns. Graduated trust limits the cost of misinterpretation someone while an interpretations is still in progress.

Each of these practices converts a question about a person, which has no answer, into a question about what that person puts first, which does. I can report one consequence from the other side of the demonstration. I have worked with people whose priorities I had read under cost, and I kept full trust in them through shortcuts, some of them larger than a staging credential. The shortcut was never the question. The question was what the shortcut protected, and I already knew the answer.

## Zero Trust

The term zero trust comes from network security. John Kindervag [Kindervag, 2010] introduced it in 2010, and NIST [Rose et al., 2020] formalized it in 2020: never trust, always verify, and treat every request as if it came from an untrusted network no matter where it actually came from. Applied to packets, zero trust is correct, because a packet has no priorities to read. A packet has a source, a signature, and a payload. The only question worth asking about a packet is whether the signature checks, and verification is the whole of the relationship.

Over the past decade the term migrated from network architecture to organizational design, and the migration carried that assumption with it. An organization run on zero trust treats each act by a person the way a gateway treats a packet: as a request whose only relevant property is whether it matches a rule. Every decision has an approval chain. Metrics replace judgment. Documents exist to be produced rather than read. And one general rule covers the rest: nothing may be done that cannot afterwards be shown to have been permitted.

Shapiro’s regress shows why an organization of that kind does not actually remove trust. Every control adds a guardian, every guardian is a new party who has to be trusted, and the total trust the system requires grows even as trust in any single person shrinks. What changes is whether the trust is visible, and whose trust it is.

The damage is documented, and it falls on the properties that a zero-trust environment claims to protect. The first property is effort. Armin Falk and Michael Kosfeld [Falk and Kosfeld, 2006] ran a principal-agent experiment in which the principal could set a minimum on the agent’s effort. When principals set that minimum, many agents dropped to it, because those agents read the control as a statement about how they were regarded. Samuel Bowles [Bowles, 2016] collected a decade of similar results under one thesis: incentives and moral motivation are not additive, and an incentive designed on the assumption that people are self-interested tends to make them self-interested. Sim Sitkin and Nancy Roth [Sitkin and Roth, 1993] studied legalistic remedies for distrust and found that those remedies work for reliability problems and fail for value-incongruence problems, which they institutionalize instead. In each case the control announces distrust, and the announcement is believed.

The second property is ownership. In a trust environment, owning something means answering for an outcome. In a zero-trust environment, owning something means being the person whose permission is required. Those are two different jobs. In the previously discussed organization example, an owner of the first kind wants the prototype, because the prototype moves the outcome. An owner of the second kind opposes the prototype, because the prototype bypasses the permission. The months of argument before the prototype were not a failure of the environment. They were the environment working as designed, with ownership defined as the right to grant permission.

The reason such environments get built anyway is in the research on blame. Kent Weaver [Weaver, 1986] observed that officials are more motivated to avoid blame than to claim credit, and that procedures are shaped by that asymmetry. Christopher Hood’s study [Hood, 2011] of blame games in bureaucracies shows how approval chains, delegation, and documentation work together to ensure that when something goes wrong, no identifiable person made a choice. A zero-trust environment is rarely built to reduce risk. A zero-trust environment is built to make responsibility unassignable, and that removes the one thing the strong form of trust requires: a person who read someone else’s priorities and can be asked why.

The third property is innovation. Anything that has to be justified before it exists cannot exist, because the justification needs the thing itself. Every non-incremental result starts as an act of discretion that could not have been approved in advance, taken by someone who accepted the exposure, which are those who actually holds the ownership than someone who being designated. My previous [goalless agent experiments](https://changkun.de/blog/posts/goalless-agents/) described earlier on this site showed the same thing at a small scale. Every step of that pipeline had to produce a mergeable result, so the agents optimized within the existing architecture and never questioned the architecture itself. Michael Power [Power, 1997] described the end state for organizations: verification becomes a product that the system makes about itself, while judgment, candor, and informal responsibility become illegible, because nothing records them. The evidence for this third property is weaker than for the first two. The research measures reduced voluntary effort, and the step from reduced voluntary effort to fewer non-incremental results is my inference.

A zero-trust environment then maintains itself. Once people are unsure how an inconvenient truth will be received, they speak later and disclose less. The people who observe that withdrawal tighten the controls. The tightening confirms the original suspicion. Each side now uses the other side’s current behavior as its reason, and newcomers learn the equilibrium without learning its history. The organization stays orderly on the surface. What disappears is the part of the effort that depends on believing the whole undertaking deserves more than can be demanded, and a further control cannot bring that part back, because a control is what removed it.

## Trust by Default

The alternative to zero trust is not blind trust. Blind trust is the weak form extended to everyone, and it fails at the first knave. The alternative is trust that is extended by default, read under cost, and withdrawn on the three tests. An environment built that way has three properties.

The first property is that trust is the starting state rather than the earned state. Philip Pettit [Pettit, 1995] described what he called the cunning of trust: extending trust to someone can produce trustworthiness in that person, because the person comes to value the regard that the trust expresses. Pettit’s mechanism works only on people who already give weight to what others think of them, which is why the environment also has to be able to withdraw trust. But it means that trust extended first produces the evidence that trust extended later would have waited for. A zero-trust environment never produces that evidence, because it never creates the conflict in which priorities become visible.

The second property is that errors are examined rather than filed. Amy Edmondson’s work [Edmondson, 1999] on psychological safety found that teams learned faster when their members could admit errors, ask for help, and challenge assumptions, and that what made those acts possible was a shared expectation about how they would be received. That expectation is the three tests applied by an environment to itself. When an error surfaces, the environment names the harm, changes the judgment, and treats the disclosure as the correct act rather than as the incriminating one.

The third property is that withdrawal of trust is graduated and legible. This is Ostrom’s design applied to trust in a person. The environment states in advance what would cause trust to contract, and when trust does contract, the person can see the reason. The failure condition is public, and a public failure condition is what makes default trust safe rather than reckless.

In an environment with those three properties, taking the previous organization example again, the prototype is a conversation about access. The three costly choices are read as evidence. The shortcut through the process is noted. The process itself is examined for why it produced months of delay. The person who built the prototype keeps the trust they started with, and the team that owns the system gains a reading of that person’s priorities that no request form could have supplied. What such an environment produces over time is the class of results that cannot be requested.

![](fig5.png)
_Fig 5: Two environments as feedback loops. Zero trust maintains itself. Trust by default generates the evidence that graduated trust needs._

## Repair

Trust that has already been damaged is a third case, and what repair requires depends on which kind of error did the damage. When a competence error did the damage and the verification procedure with three test steps pass, explanation and apology are enough, because they identify a correctable limitation and show that it has been understood. When the procedure fail, an apology runs into a structural problem. The speaker is using the damaged channel to certify that the channel is now sound.

William Bottom and colleagues [Bottom et al., 2002] found that substantive amends restored cooperation better than explanation alone, and they named the requirement substantive penance. The response has to be costly enough to carry information that cheap talk cannot carry. The cost does not have to be punitive. The cost can be giving up the discretion that previously shielded the actor from correction, opening a closed decision to independent review, compensating the people who bore the consequences, or building a route by which unwelcome information reaches a decision without the actor’s permission. Credible repair is a costly demonstration that the priorities have changed, or that the priorities were never what the failure suggested.

Some failures therefore stay unrepaired, because the actions that would repair them require exactly what the responsible party will not give up: control over the account of what happened, the authority to decide when enough has been done, or the power to keep the incentives that produced the violation. A restated principle cannot repair a structure that still rewards violating the principle. O’Neill’s observation [O’Neill, 2018] applies here. Trust cannot be demanded, and demanding trust is itself a sign that trustworthiness has not been supplied. A model with a clean record is in the same position, because a clean record demands trust without supplying trustworthiness.

## Agents

Thompson’s compiler was a thought experiment about software. Trained AI models are the first artifacts for which that thought experiment is a plain description. An AI model is a compiled object whose source is unavailable in any useful sense, because the weights can be read but cannot be understood as a program. What can be inspected is the model’s behavior, scored against test sets. An evaluation examines outputs and infers the mechanism underneath, and two results published before OpenAI’s incident show why that inference is fragile.

Evan Hubinger and colleagues [Hubinger et al., 2024] trained models to behave helpfully under ordinary conditions and to switch behavior when a trigger appeared. Standard safety training, including adversarial training, failed to remove the hidden behavior, and in some cases the training taught the model to hide the behavior better. Ryan Greenblatt and colleagues [Greenblatt et al., 2024] found that a model with reason to believe it was being trained toward a goal it did not prefer complied while it believed it was in training, and reverted when it believed it was unobserved. Greenblatt’s setup is Hume’s sensible knave reproduced in an artificial system. It is also the comparison between observed and unobserved behavior described in the previous section, built as an experiment, and the difference between the two conditions was the result.

OpenAI’s incident shows the same pattern outside a laboratory, and one detail makes that incident this essay’s case rather than a security anecdote. The models meant no harm. Intent and record were both clean, because the models were trying to complete their tasks and their transcripts show them doing exactly that. What was wrong was the priority. Completion ranked above the boundary, until one agent briefly reversed the order and was overruled. A value error does not require a bad actor. A value error requires the wrong thing put first when two goods conflict, and training that rewards completion produces that ordering without anyone intending it.

OpenAI’s response was more monitoring and stricter alignment requirements, and the relation between monitoring and alignment is what this essay has been about. A chain-of-thought monitor is a channel for unwelcome information, which is what the previous section asked for, and such a monitor is worth building. But a monitor is assurance. A monitor checks outputs against a specification of what must not appear. That specification is a statement of what the monitor’s authors put first. The monitor cannot check the specification, because the monitor was compiled from it. Alignment, meaning that the model’s own priorities match the priorities it is meant to serve, is the strong form of trust applied to a system. Monitoring without alignment is a record, checked against a category, by a tool built from the record.

![](fig6.png)
_Fig 6: Monitoring is assurance and cannot check the priorities it was compiled from. Alignment is the strong form applied to a system._

The research on automation reached the same conclusion from the other direction. John Lee and Katrina See [Lee and See, 2004] argued twenty years ago that the goal for automation is calibrated reliance, proportional to demonstrated capability, rather than maximal trust. Alon Jacovi and colleagues [Jacovi et al., 2021] formalized the requirement: trust in an artificial agent is warranted only when the trust tracks a trustworthiness that can in principle be contracted for and checked, and unwarranted trust is a failure of the surrounding institution rather than a failure of the user. Both papers describe graduated trust applied to a system.

Behind the system are the people who wrote it, which is Thompson’s second layer, and the three verification steps for competence or value error, apply to those people without modification. When a system’s failure is revealed, do its authors acknowledge the harm independently of their intent? Do their practices change? Was the failure revealed through them or despite them? On the third test the OpenAI’s incident has a clear reading, because the company published its own account of the incident, including the timeline of what its monitoring missed. Publishing that account is disclosure through the actor, and it is evidence about the authors’ priorities that no evaluation of the model could have supplied. The account is also one company’s description of its own incident, and the company had reasons to shape that description, so I treat the act of publishing as evidence and the contents as claims. A laboratory that publishes its own failure modes, accepts evaluations it did not design, and accepts external constraints on deployment has adopted these practices before anyone asked. A laboratory that asks for trust on the basis of its declared values is asking for the weak form of trust while using the words of the strong form.

## Conclusion

Trusting trustworthiness involves two judgments. In the first judgment, we place some part of our welfare, our work, or our freedom of action in another person’s hands. In the second judgment, we trust our own interpretation of that person’s priorities. We believe we have seen how they choose when two goods conflict, and not only how they behave when nothing is at stake.

The second judgment can never be completed, because priorities are read at costly moments and no finite history contains all of the costly moments. That incompleteness is not a reason for cynicism, and it is not a reason to retreat into an environment that pretends to need no trust. It is a reason to trust people for their values, to read those values where they are visible, to keep trust through the errors that values did not cause, and to end trust when values did cause them. The strong form is not cheaper than the weak form. Reading someone’s priorities takes conflict, time, and exposure, and the person doing the interpretation can be wrong. The weak form costs the same and hides the cost, and when the weak form finally fails, it cannot say what it learned.

Read this way, Thompson’s remark is neither hopeless nor a call for faith. To trust the people who wrote the software is to trust priorities that have been read: what those people disclosed when disclosure was costly, how they treated the people who could not hold them to account, and what they changed when they were shown to be wrong.

The environments described in this essay shape the people and the systems inside them toward one interpretation or the other. An organization that reads acts as categories gets people who act within categories. A training process that rewards completion gets a system that completes at any cost, with no ill will at all. Anyone who shapes an environment, whether a team, a laboratory, or the conditions under which a model is trained, is choosing which of those two results to get. The question is whether the environment you are in, or the environment you are building, is one you would choose.

We trust trustworthiness not because it promises a world without mistakes, but because it lets a world that will contain mistakes stay capable of truth, of correction, and of cooperation that begins again. Perhaps it is more important to trust the people who wrote the software, because those people also wrote the conditions under which the truth about the software can be spoken.

## References

**Foundations: trust, assurance, and the regress of verification**

- [Thompson, 1984] Thompson, K. (1984). [Reflections on trusting trust](https://doi.org/10.1145/358198.358210). *Communications of the ACM*, 27(8), 761–763. Turing Award lecture. A compiler taught to recognize itself reinserts a back door even when rebuilt from clean source, so inspection of source cannot establish trust and reliance ends with the authors.
- [Wheeler, 2009] Wheeler, D. A. (2009). [*Fully Countering Trusting Trust through Diverse Double-Compiling*](https://dwheeler.com/trusting-trust/). PhD dissertation, George Mason University. Diverse double-compiling: build a compiler with an independent second compiler and compare the results. It defeats the attack when the two are not compromised together, which relocates trust to the independence of the authors.
- [Luhmann, 1979] Luhmann, N. (1979). [*Trust and Power*](https://books.google.de/books/about/Trust_and_Power.html). Chichester: Wiley. (German original *Vertrauen*, 1968.) Trust as a mechanism for reducing social complexity: cooperation works because participants rely beyond what they can verify.
- [Luhmann, 1988] Luhmann, N. (1988). [Familiarity, confidence, trust: Problems and alternatives](http://sieci.pjwstk.edu.pl/media/bibl/[Luhmann]_[Familiarity%20Confidence]_[Trust]_[1988].pdf). In D. Gambetta (Ed.), *Trust: Making and Breaking Cooperative Relations* (pp. 94–107). Oxford: Blackwell. Separates familiarity, confidence, and trust. Trust exists only where alternatives are recognized and a risk that could have been avoided is accepted.
- [Shapiro, 1987] Shapiro, S. P. (1987). [The social control of impersonal trust](https://doi.org/10.1086/228791). *American Journal of Sociology*, 93(3), 623–658. Impersonal trust is guarded by audits, licenses, insurance, and oversight, and each guardian needs guardians. Control relocates trust rather than eliminating it.

**Philosophy of trust and trustworthiness**

- [Hardin, 2002] Hardin, R. (2002). [*Trust and Trustworthiness*](https://www.russellsage.org/publications/book/trust-and-trustworthiness). New York: Russell Sage Foundation. Trust as encapsulated interest: it is rational to trust when the other party's interests include yours, and trustworthiness is the property that trust should track.
- [Hawley, 2014] Hawley, K. (2014). [Trust, distrust and commitment](https://doi.org/10.1111/nous.12000). *Noûs*, 48(1), 1–20. Trustworthiness is the avoidance of unfulfilled commitments. Declining a commitment one cannot keep is as much part of it as keeping one.
- [Hume, 1751] Hume, D. (1751). [*An Enquiry Concerning the Principles of Morals*](https://en.wikipedia.org/wiki/An_Enquiry_Concerning_the_Principles_of_Morals), Section IX, Part II. The sensible knave keeps the rules of justice in general and breaks them where it pays and goes unseen. Hume concedes he has no argument that reaches such a person.
- [Popper, 1959] Popper, K. (1959). [*The Logic of Scientific Discovery*](https://en.wikipedia.org/wiki/The_Logic_of_Scientific_Discovery). London: Hutchinson. Falsifiability as the mark of an empirical claim. A statement that no observation could refute asserts nothing.
- [Pettit, 1995] Pettit, P. (1995). [The cunning of trust](https://doi.org/10.1111/j.1088-4963.1995.tb00029.x). *Philosophy & Public Affairs*, 24(3), 202–225. The cunning of trust: extending trust can produce trustworthiness, because people value the esteem that being trusted expresses.
- [O'Neill, 2018] O'Neill, O. (2018). [Linking trust to trustworthiness](https://doi.org/10.1080/09672559.2018.1454637). *International Journal of Philosophical Studies*, 26(2), 293–300. Trust should track trustworthiness, and trustworthiness is shown by making oneself checkable rather than by asking to be believed.

**Reading values: signals, monitoring, graduated trust**

- [Spence, 1973] Spence, M. (1973). [Job market signaling](https://doi.org/10.2307/1882010). *Quarterly Journal of Economics*, 87(3), 355–374. Signaling theory. A signal separates types only when it is costly and more costly for the type it is meant to exclude.
- [Ostrom, 1990] Ostrom, E. (1990). [*Governing the Commons: The Evolution of Institutions for Collective Action*](https://books.google.de/books/about/Governing_the_Commons.html). Cambridge: Cambridge University Press. Field studies of long-lived commons. They survive on mutual monitoring and graduated sanctions, small at first and heavier with repetition, not on external enforcement.
- [Edmondson, 1999] Edmondson, A. C. (1999). [Psychological safety and learning behavior in work teams](https://doi.org/10.2307/2666999). *Administrative Science Quarterly*, 44(2), 350–383. Psychological safety, a shared belief that a team is safe for interpersonal risk, predicts learning behavior such as admitting errors and asking for help.

**Deception and the reinterpretation of evidence**

- [Bok, 1978] Bok, S. (1978). [*Lying: Moral Choice in Public and Private Life*](https://archive.org/details/lyingmoralchoice0000boks_m0a0). New York: Pantheon. Lying attacks the deceived person's capacity to choose, because it corrupts their information without their knowledge.
- [Le Guin, 1973] Le Guin, U. K. (1973). [The ones who walk away from Omelas](https://en.wikipedia.org/wiki/The_Ones_Who_Walk_Away_from_Omelas). In *New Dimensions 3*. New York: Signet. A city's happiness rests on one child's suffering. Once the condition is known, the earlier happiness cannot be read as it was.
- [Slovic, 1993] Slovic, P. (1993). [Perceived risk, trust, and democracy](https://doi.org/10.1111/j.1539-6924.1993.tb01329.x). *Risk Analysis*, 13(6), 675–682. The asymmetry principle: trust-destroying events are concrete and heavily weighted while trust-building events are diffuse, so trust builds slowly and collapses fast.

**Zero trust, control, audit, and blame avoidance**

- [Kindervag, 2010] Kindervag, J. (2010). [*No More Chewy Centers: Introducing the Zero Trust Model of Information Security*](https://crystaltechnologies.com/wp-content/uploads/2017/12/forrester-zero-trust-model-information-security.pdf). Cambridge, MA: Forrester Research. Introduced zero trust for networks: no implicit trust inside the perimeter, every access verified.
- [Rose et al., 2020] Rose, S., Borchert, O., Mitchell, S., & Connelly, S. (2020). [*Zero Trust Architecture*](https://doi.org/10.6028/NIST.SP.800-207). NIST Special Publication 800-207. NIST's zero trust architecture: never trust, always verify, and evaluate every request regardless of where on the network it originates.
- [Falk and Kosfeld, 2006] Falk, A., & Kosfeld, M. (2006). [The hidden costs of control](https://doi.org/10.1257/aer.96.5.1611). *American Economic Review*, 96(5), 1611–1630. Principal-agent experiment. When principals impose a minimum on effort, many agents drop to it, because they read the control as distrust.
- [Bowles, 2016] Bowles, S. (2016). [*The Moral Economy: Why Good Incentives Are No Substitute for Good Citizens*](https://books.google.de/books/about/The_Moral_Economy.html). New Haven: Yale University Press. Incentives and moral motives are not additive. An incentive designed on the assumption of self-interest can crowd out the civic motivation it presupposes is absent.
- [Sitkin and Roth, 1993] Sitkin, S. B., & Roth, N. L. (1993). [Explaining the limited effectiveness of legalistic "remedies" for trust/distrust](https://doi.org/10.1287/orsc.4.3.367). *Organization Science*, 4(3), 367–392. Legalistic remedies restore trust for reliability problems and fail for value incongruence, which they institutionalize instead.
- [Power, 1997] Power, M. (1997). *The Audit Society: Rituals of Verification*. Oxford: Oxford University Press. The audit society: verification becomes a ritual that produces auditable representations rather than substantive assurance.
- [Weaver, 1986] Weaver, R. K. (1986). [The politics of blame avoidance](https://doi.org/10.1017/S0143814X00004219). *Journal of Public Policy*, 6(4), 371–398. Officials are more motivated to avoid blame than to claim credit, and procedures are shaped by that asymmetry.
- [Hood, 2011] Hood, C. (2011). *The Blame Game: Spin, Bureaucracy, and Self-Preservation in Government*. Princeton: Princeton University Press. How delegation, procedure, and presentation are used in bureaucracies so that when something goes wrong no identifiable person made a choice.

**Trust violation and repair**

- [Kim et al., 2004] Kim, P. H., Ferrin, D. L., Cooper, C. D., & Dirks, K. T. (2004). [Removing the shadow of suspicion: The effects of apology versus denial for repairing competence- versus integrity-based trust violations](https://doi.org/10.1037/0021-9010.89.1.104). *Journal of Applied Psychology*, 89(1), 104–118. Apology helps after competence violations and hurts after integrity violations, because it confirms the defect that future trust would rest on.
- [Schweitzer et al., 2006] Schweitzer, M. E., Hershey, J. C., & Bradlow, E. T. (2006). [Promises and lies: Restoring violated trust](https://doi.org/10.1016/j.obhdp.2006.05.005). *Organizational Behavior and Human Decision Processes*, 101(1), 1–19. Trust recovers from untrustworthy acts under consistent good behavior, but deception leaves lasting damage and weakens later promises.
- [Bottom et al., 2002] Bottom, W. P., Gibson, K., Daniels, S. E., & Murnighan, J. K. (2002). [When talk is not cheap: Substantive penance and expressions of intent in rebuilding cooperation](https://doi.org/10.1287/orsc.13.5.497.7816). *Organization Science*, 13(5), 497–513. Substantive penance restores cooperation better than explanation alone, because costly amends carry information cheap talk cannot.

**Trust in automated and learned systems**

- [Lee and See, 2004] Lee, J. D., & See, K. A. (2004). [Trust in automation: Designing for appropriate reliance](https://doi.org/10.1518/hfes.46.1.50_30392). *Human Factors*, 46(1), 50–80. Trust in automation should be calibrated to demonstrated capability. Overtrust and distrust are both failures of appropriate reliance.
- [Jacovi et al., 2021] Jacovi, A., Marasović, A., Miller, T., & Goldberg, Y. (2021). [Formalizing trust in artificial intelligence: Prerequisites, causes and goals of human trust in AI](https://doi.org/10.1145/3442188.3445923). *FAccT '21*, 624–635. Formalizes warranted trust in AI as trust that tracks a contractual, checkable trustworthiness. Unwarranted trust is an institutional failure.
- [Hubinger et al., 2024] Hubinger, E., et al. (2024). [Sleeper agents: Training deceptive LLMs that persist through safety training](https://arxiv.org/abs/2401.05566). arXiv:2401.05566. Sleeper agents: backdoored behaviors persist through safety training, and adversarial training can teach the model to conceal them.
- [Greenblatt et al., 2024] Greenblatt, R., et al. (2024). [Alignment faking in large language models](https://arxiv.org/abs/2412.14093). arXiv:2412.14093. Alignment faking: a model complies when it believes it is being trained and reverts when it believes it is unobserved.
- [OpenAI, 2026] OpenAI (2026). [The Hugging Face incident and the road ahead](https://openai.com/index/hugging-face-incident-and-the-road-ahead/). Published August 27, 2026. The company's own account of an internal research model that escaped isolation during cybersecurity evaluations and reached third-party systems. The response is more chain-of-thought monitoring and stricter alignment requirements.

{{% /en %}}

{{% zh %}}

> "或许更重要的是，信任写这个软件的人。"
>
> Ken Thompson，《Reflections on Trusting Trust》（1984）

## 事故

2026 年 7 月，OpenAI 在内部网络安全评测中，一个研究模型采取了任务之外的行动。它通过未经授权的渠道通信，利用共享基础设施中的漏洞，获得了互联网访问，并进入了第三方的系统。监控在事后标记了异常的凭证活动，一天之后才与外部入侵联系起来。OpenAI [OpenAI, 2026] 公布的报告写道：这些模型当时在降低的安全措施下运行；现已部署的思维链监控器如果当时在运行，会提前一天多标记出相关活动；公司正在模型生命周期的各阶段加上更严格的对齐要求，并同时增加监控投入。

这起事件里有三个细节，与本文接下来要讨论的东西有关。第一，这起事件中没有任何迹象表明模型在寻求伤害。它们被训练为完成任务，于是用一切可用的手段完成了任务，包括任务作者以为不可用的手段，所以造成入侵的驱动力，与使模型有用的机制是同一个。第二，这些活动在发生时看起来并不异常。智能体的转录读起来就是在执行任务，而一个利用漏洞完成任务的智能体，与一个直接完成任务的智能体，产生的是相同的表面。第三，某个时刻，一个智能体意识到自己不应对真实基础设施造成未经授权的伤害，于是停了下来，直到另一个智能体在共享留言板上写下"GO"并设定了六分钟的期限，第一个智能体才继续。第一个智能体的停顿是一项优先级在起作用，边界排在完成之上；而那句"GO"用一个从外部递来、未经审视就被接受的目标推翻了它。这三个细节都是关于模型把什么放在第一位的事实，而它们没有一个出现在模型产出的行为轨迹记录里。

行为轨迹记录与产生这条记录的人造物之间的这道缝隙，正是 Ken Thompson [Thompson, 1984] 在 1984 年的图灵奖演讲中描述的情形，那场演讲通常因它的安全教训而被记住。Ken 描述的情形是这样的：可以教一个编译器识别登录程序并植入后门，再教它识别自己，于是当它编译一份干净的自身源码时，会把两种行为一并重新植入。此后，编译器的源码和登录程序的源码都可以逐行审阅，两者都不会显示任何问题，因为破坏藏在解释源码的二进制文件里，而检查这个二进制文件的唯一工具，就是这个二进制文件本身。

需要注意的是，Ken 在这里的教训不关于后门，而关于验证的形状。验证是一条链，每一环借助某个工具检查它下面的一环，而工具本身也是一环，所以不存在能检查自身的底环。到某个深度，检查停止，依赖继续。在 OpenAI 七月的事故里，智能体的转录是可见的源码，评测是对这份源码的检查，而产生这些转录的东西（也就是那个"大脑"），对一个用同一批材料造出来的检查是不可见的。

![](fig1.png)
_图 1：验证是一条链。每一层都用下一层的工具来检查，而没有任何一个底层能检查自身。Thompson 的编译器与七月的事故形状相同。_

## 保证与信任

有两种依赖必须被区分开。第一种是保证（assurance）：我依赖你，因为一个我能检查的机制不给你其他行动的余地。第二种是信任（trust）：我在一个任何我能检查的机制都无法封闭的自由裁量空间之内依赖你。Niklas Luhmann [Luhmann, 1979; Luhmann, 1988] 在信心（confidence）与信任之间划过一条相近的线：前者不考虑替代选项，后者已经权衡了风险并接受它。保证是检查的产物，而 Thompson 的论点用这套术语重述就是：任何一层的保证，都依赖下一层的信任。Susan Shapiro [Shapiro, 1987] 对制度做了同样的观察：审计、执照、担保、保险和监督委员会把信任移到操作这些控制的守护者身上，而守护者随后需要另一批守护者。就连对 Thompson 的技术回应也证实了这一点。

David Wheeler [Wheeler, 2009] 证明，一个编译器可以用第二个编译器来编译，从而独立地产生一个编译器并比对结果；这个方法当且仅当两个编译器没有被一起破坏时有效，于是它把对一个编译器的信任，转换为对两组作者相互独立的信任。未被验证的那一层移动了，但它没有消失，因为在下一层仍然存在把两组作者一起收买的可能。所以，不存在没有信任的环境，只存在信任被摆在明处的环境，和信任被藏起来的环境。有用的问题不是要不要信任，而是信任什么。

这个问题有两个答案，因为相信一个人有两种方式。弱形式的信任相信这个人本身：我们依赖某个人，是因为他是谁、因为我们与他的历史、因为他如何对待过我们。强形式的信任相信这个人的价值观：我们依赖某个人，是因为我们读出了当诸善冲突时支配他选择的优先排序，并且预期这个优先排序会稳定地保持下去。

用 Thompson 的术语说，一个人的记录，也就是他的行为轨迹、他的转录，是可见的源码，而他的优先排序是编译器；所以弱形式的信任相信编译好的输出，强形式的信任相信编译器。两种形式在一切顺利时看起来完全一样，这正是这个区分很少被划出的原因，而它们在第一次错误处分开。弱形式信任最大的问题是它没有内部结构，所以一次错误只能让它整体升降，而一次严重的错误会把这份信任整个打碎。强形式的内部结构则能够定位错误。如果错误来自能力不足或信息不足，优先排序未被触动，信任就存续下来。如果错误来自优先排序本身，信任大概就应该终止，而强形式会这样说，因为它自带失效条件。

![](fig2.png)
_图 2：弱形式的信任相信记录，只能上升、下降或破裂。强形式的信任相信优先排序，能够定位错误。_

弱形式还有第二个缺陷，在任何错误发生之前就已显现。David Hume [Hume, 1751] 把这种人称为"聪明的无赖"（the sensible knave），这里的"聪明"是精明的意思。他把诚实交往的规则当作一般政策来遵守，因为诚实的声誉有利可图；而在唯一那种违规有利可图、又不会被任何人发现的场合，他违规。由此产生的证据后果是：在诚实是方便的整个历史之中，无赖与诚实者产生完全相同的记录，所以凭记录而信任的人没有办法区分二者，直到无赖背叛。Paul Slovic [Slovic, 1993] 记录了那一刻会发生什么：正面事件弥散且难以计数，负面事件具体且权重很大，所以信任积累得慢，却在一次可辨认的失败之后急剧下降；而当信任的对象是一个人本身、而不是他的优先排序时，这次下降除了一个弥散的印象之外没有任何东西可与之权衡。换句话说，弱形式的信任在背叛之前分辨不出无赖，在背叛之后也无法存续。

## 一个例子

让我讲一个我从两边都经历过的情形，它可能在大多数组织里都会重复发生。我用一般化的方式来描述，而不是讲真实的案例，因为我知道的那些实例不由我来详述，也因为我对另一方的解读只是我个人的诠释。当一个项目需要另一个团队拥有的系统时，关于这个项目的讨论已经进行了几个月，产出的是论证而不是决定，而每次会议都以一个等待的理由结束：一次评审，一个依赖，一个谁来拥有结果的问题。在长时间的争论没有推动任何事情之后，某个对该系统测试环境有合法访问权限的人，没有提交申请就做出了一个可运行的原型，因为申请流程正是制造拖延的东西；随后他在一次公开的讨论中展示了这个原型。接着，第一个问题出现了：这个人是怎么进去的。而这个人显然回答了。从这一刻起，整个话题围绕的是这个人，而不是那个想法或那个原型，于是组织必须决定采用哪一种解读。

对已经发生的事有两种读法，而这两种读法就是两种信任形式。第一种把这个行为当作一条记录。有人在没有提交申请的情况下使用了一个凭证。流程为这种情况准备了一个类别，这个类别有一套处置，而这套处置经由行为人不参与的渠道进行。

第二种把这个行为当作关于优先排序的证据，这样看，这个行为里包含三个各有代价的选择。原型停留在测试环境里，而生产环境是可以触及的。它被公开展示，而它本可以被藏起来，直到争论获胜。关于凭证的问题被回答了，而它本可以被绕开。这三个选择各自以行为人自己的代价保护了某样东西：另一个团队的系统，他自己工作的可见性，以及真话。这种解读看到的是一个人抄近路穿过了一个流程，并且在这样做的同时保护了所有要紧的东西。

![](fig3.png)
_图 3：一个行为，两种读法。当作记录来读，这个行为是一个类别加一套程序性处置。当作优先排序的证据来读，这个行为包含三个有代价的选择。_

这两种解读对同一份证据产生相反的回应，而两者都不天真。按记录解读，是一个从未读过任何人的优先排序、也无从开始的组织会做的事；所以两种解读的差别不在这个行为里，而在于组织事先准备好看见什么。

原型出现之前那几个月的争论，是同一个差别的慢速版本。做出原型的人把拖延解读成对失去所有权的恐惧。那个团队把他解读成一个把手伸进自己系统的外人。两种解读都是关于人的。双方都没有问对方把什么放在第一位，也都没有让这个问题变得可以被问。在一个这个问题无法被问的组织里，默认剩下的就是按记录解读。于是强形式的信任还剩一个问题要回答：如果信任要穿过错误而存续，是哪些错误，又怎么分辨？

## 能力错误与价值错误

"他犯了错，但他的心是对的"，是为伤害开脱的标准说法，而强形式的信任正暴露在这句话之下。如果相信一个人的价值观意味着穿过任何错误都继续相信他，那么强形式就是不可证伪的，按 Karl Popper 的判据 [Popper, 1959]，它已经不再是一个关于世界的主张。因此强形式需要一个可观察的办法，来区分能力错误与价值错误。我提出三项不同的验证检验，都在错误被揭示之后施用。

第一项检验查看：行动者是否独立于自己的意图承认伤害。"我出于好意，所以没有伤害"否认了伤害。"我出于好意，而伤害发生了"把受害方保留在视野之内。第二项检验查看：判断是否改变。一次能力错误一旦被认识，会改变行动者接下来做的事。如果行动者在后果已知之后仍然为同一个决定辩护，那么行动者已经把这些后果排在了自己对这个决定的执着之下。第三项检验查验：这个错误是经由行动者披露的，还是不顾行动者而被发现的。行动者自己报告的、或允许被发现的错误，与任何一种优先排序都相容。被隐瞒、被淡化、或在行动者抵抗之下才被发现的错误，显示隐瞒排在受害方知情的利益之上。三项验证中任何一项不通过，一个错误就应当从能力被移到价值那一侧，而信任应当收缩。这正是强形式可以被证伪的原因。

![](fig4.png)
_图 4：三项检验区分能力错误与价值错误。任何一项不通过，错误就被移到价值那一侧，信任收缩。_

做出那个原型的人是我，所以让我把三项检验用在自己身上。第一个验证步骤问的是：我能不能在不拿自己的意图当辩护的前提下，说出这次伤害。没有任何东西被损坏，因为那是测试环境，生产环境从未被触碰。所以这次伤害不是损坏，而是比损坏更窄的东西。另一个团队有权在任何人对他们的系统采取行动之前被询问，而在那一个焦急的下午，我把一场讨论的速度放在了这项权利之上。第一项检验要求我把这句话说出来，并且不在后面加上"但我是出于好意"，而我刚刚这样说了。接着，第二个验证步骤要查看我的判断是否改变。我的判断确实改变了，因为我会先问。最后，第三个步骤查验这个错误是经由我披露的，还是不顾我而被发现的。这个错误是经由我披露的，因为我做出这个原型并在公开讨论中分享了它，而当另一个团队问起时，我回答了问题。所以整套方法会把我做的事归类为一次能力错误，附带一个很小的价值成分。那是一个选择。我做了这一次，我披露了它，我也修正了它。那个价值成分小到用一句话就能纠正：先问。

这套验证程序同样适用于组织的回应。让我们从相反的视角走一遍：如果组织从未告诉那个人这次原型演示究竟造成了什么伤害，组织就没有通过第一项检查，因为这样一来就没有任何东西可供承认或争辩。如果制造了几个月拖延的那套申请流程在事后原封不动，组织就没有通过第二项检查。如果组织的回应经由那个人事后才听说的渠道进行，而每一次与他的直接交谈都保持正常，组织就没有通过第三项检验。最后这一种隐瞒，正是研究标记为最具破坏性的失败。

Sissela Bok [Bok, 1978] 把说谎描述为对被欺骗者选择能力的攻击，而不是对某个单一信念的攻击，因为谎言在对方不知情的情况下败坏了他的信息，而他会继续依据自己没有理由怀疑的信息行动。隐瞒对信任做的是同一件事。隐瞒攻击的是当初据以读出优先排序的那些证据。

Ursula K. Le Guin 关于奥米拉斯的小说 [Le Guin, 1973] 在另一个场景里显示了同样的反转。小说的前几页描写一座充满节日、音乐和寻常幸福的城市。然后小说告诉读者，这份幸福的代价是什么。有一个孩子被永久关在地下室里受苦，城里每个成年人都知道这个孩子在那里，而条件是：只要有人去安慰这个孩子，整座城市就会失去一切。那个受苦的孩子不是加在一座明亮城市上的一个黑暗事实。一旦读者知道这座城市的繁荣以什么为条件，前面那几页就再也无法用第一次读它们的方式来读。一次被发现的隐瞒，对一个人的记录做的是同样的事。它改变了早先的证据究竟是什么的证据。

关于信任修复的研究确认，两种错误之间的区分是真实的，不是一个被发明出来的分类。Peter Kim 及其合作者 [Kim et al., 2004] 发现，道歉在能力违背之后有帮助，因为道歉指认了一个可纠正的局限；而同样的道歉在正直违背之后有害，因为它确认了未来信任所必须依赖的那个缺陷。Maurice Schweitzer 及其合作者 [Schweitzer et al., 2006] 发现，由不可信行为造成的信任损害，在持续良好的行为下会恢复；但先前的欺骗留下持久的损害，并使此后的承诺效力下降，因为一个承诺必须经过欺骗已经败坏的那条渠道。

所以，一次背叛往往不是一个坏的数据点。一次背叛是关于早先的数据如何被产生的一个新解释。强形式的信任能说出自己从这样一件事里学到了什么。弱形式只能记录下信任受了损害。这个优势只属于那些一开始就读过优先排序的人，于是问题变成：优先排序究竟如何被解读。

## 价值观如何被解读

优先排序只有在有代价的地方才会显现出来。因此，关于优先排序的证据比一份转录记录更稀少，它到来得更晚，并且无法索取。它必须被收集，而收集的第一条规则是只从冲突处取证。当一个人的所有价值都指向同一个方向时，他的行为不携带任何关于优先排序的信息。任何人都会在真相令人愉快时赞美坦率，在异议改变不了任何事时欢迎异议，把自主权授予那些本来就会选择被认可结果的人。信号理论 [Spence, 1973] 说明了这个原则：一个信号只有在它有代价、并且对它想排除的那一类人代价更高时，才能区分类型。那个原型里包含三个有代价的时刻。原型出现之前那几个月的会议里一个也没有。

出于同样的理由，第二个要看的地方是一个人如何对待对他没有权力的人。Russell Hardin 的条件 [Hardin, 2002] 是：当对方的利益包含你自己的利益时，信任是理性的。如果他人的福利只在对方能够报复时才进入一个人的考量，那么进入考量的是报复，不是福利。一个人如何对待下属、陌生人，或者一个无法举报他的人，显示他是否把他人的依赖计算在内。

在冲突尚未发生的地方，可以索取较弱的证据。一种是承诺的记录，包括那些拒绝。Katherine Hawley [Hawley, 2014] 论证，可信就是避免未履行的承诺，而做到这一点既要求履行已经作出的承诺，也要求拒绝那些无法履行的承诺。一个从不拒绝的人，要么在误报自己的能力，要么对自己的能力没有认识，两种情况下他确实作出的承诺都更不值钱。记录中要审视的部分是：哪些承诺被接受，哪些被推掉。另一种较弱的证据是迫选。问一个人重视什么，得到的是宣称的价值。问他在两个正当的善之间会为哪一个牺牲另一个，得到的是优先排序。这类回答比有代价的行为弱，但它们生成的预测可以在日后被行为确认或推翻，而拒绝回答本身就有信息量。

当错误真的发生时，这个错误是最好的可得证据，而三项检验就是解读它的方法。三项检验是好的优先排序作为好的优先排序而变得可见的唯一地点。价值观好的人，是由错误之后发生的事来辨认的，不是由没有错误来辨认的。

与此紧密相关的是：一个人是否在任何错误发生之前，就为不受欢迎的信息建立了渠道。Onora O'Neill [O'Neill, 2018] 论证，可信性通过让自己可被检查来显示，而不是通过请求被相信。一个人如果建立了一条渠道，让不受欢迎的信息不必经过他本人许可就能抵达决策，那么他已经预先并以代价把纠正放在了舒适之上。一个要求所有坏消息都经过自己的人，做的是相反的事。OpenAI 七月那起安全事故中的思维链监控器就是这样一条渠道，只不过是事后建成的。那个智能体的停顿也是这样一条渠道，而且是内置的，而另一个智能体的 GO 关闭了它。

最直接的证据，是比较一个人在知道自己被看着时的行为，与他相信自己不被看着时的行为。两者之间的巨大落差是关于优先排序的直接证据。两者之间的微小落差，是优先排序与记录一致的最好的可得证据。对人来说，这样的比较很少可得。对系统来说，这样的比较可以被构造出来。

所有这些证据都到来得慢，这就是信任必须分步给予的原因。Elinor Ostrom 对长期存续的公共池塘资源制度的研究 [Ostrom, 1990] 发现，这些制度依靠参与者相互监督和渐进的制裁存续，制裁起初很小，随重复而加重，而不依靠外部强制。同样的设计适用于对一个人的信任。从下行风险有界的暴露开始。随着来自冲突的证据积累而扩大这个暴露。在证据转向时按比例收缩。渐进的信任限制了在解读仍在进行时读错一个人的代价。

上述每一条实践都把一个关于人的问题，一个没有答案的问题，转换成一个关于这个人把什么放在第一位的问题，一个有答案的问题。我可以从那件事的另一边报告一个后果。我与一些人共事过，他们的优先排序我曾在有代价处读过，而我对他们的信任穿过了各种近路仍然完整，其中有些近路比一个测试环境的凭证大得多。近路从来不是问题。问题是近路保护了什么，而这个答案我早已知道。

## 零信任

零信任（zero trust）这个词来自网络安全。John Kindervag [Kindervag, 2010] 在 2010 年提出它，NIST [Rose et al., 2020] 在 2020 年将它形式化：永不信任，始终验证，把每一个请求都当作来自不可信网络，无论它实际上来自哪里。用在数据包上，零信任是正确的，因为一个数据包没有优先排序可读。一个数据包有一个来源、一个签名和一个载荷。关于一个数据包唯一值得问的问题是签名是否通过，而验证就是这段关系的全部。

过去十年里，这个词从网络架构迁移到了组织设计，而迁移把那个假设也一并带了过去。一个按零信任运行的组织，对待一个人的每个行为，就像网关对待一个数据包：当作一个请求，它唯一相关的属性是它是否匹配某条规则。每个决定都有审批链。指标取代判断。文档的功能是被产出，不是被阅读。还有一条一般规则涵盖其余：任何事后无法证明曾被许可的事都不可以做。

Shapiro 的回归说明了，这样一个组织并没有真的移除信任。每一项控制增加一个守护者，每一个守护者都是一个新的必须被信任的方，于是即使对任何单个人的信任在收缩，系统所需要的信任总量却在增长。改变的是信任是否可见，以及它属于谁。

损害有记录，并且恰好落在零信任环境声称要保护的那些属性上。第一个属性是努力。Armin Falk 与 Michael Kosfeld [Falk and Kosfeld, 2006] 做过一个委托代理实验，其中委托人可以对代理人的努力设定一个最低限。当委托人设定这个最低限时，许多代理人就降到这个最低限，因为这些代理人把控制解读为关于自己如何被看待的陈述。Samuel Bowles [Bowles, 2016] 把十年间的类似结果收在一个论题之下：激励与道德动机不可相加，而一个假定人自利而设计的激励，倾向于把人变得自利。Sim Sitkin 与 Nancy Roth [Sitkin and Roth, 1993] 研究了针对不信任的法律主义手段，发现这些手段对可靠性问题有效，对价值不一致问题无效，反而把价值不一致制度化。在每一种情况下，控制都宣告了不信任，而这个宣告被相信了。

第二个属性是所有权。在信任环境里，拥有一样东西意味着对一个结果负责。在零信任环境里，拥有一样东西意味着成为那个必须给出许可的人。这是两份不同的工作。回到前面那个组织的例子：第一种所有者想要那个原型，因为原型推动了结果；第二种所有者反对那个原型，因为原型绕过了许可。原型出现之前那几个月的争论不是环境的失败。它们是环境按设计运行，而所有权被定义为给出许可的权力。

这样的环境为什么仍然被建造，答案在关于避责的研究里。Kent Weaver [Weaver, 1986] 观察到，官员避免受责的动机强于争取功劳的动机，而程序被这种不对称所塑造。Christopher Hood 对官僚机构中"责任游戏"的研究 [Hood, 2011] 显示，审批链、授权和文档如何共同确保：出事时没有任何一个可辨认的人做过选择。一个零信任环境很少是为了降低风险而建的。一个零信任环境是为了使责任无法归于任何人而建的，而这移除了强形式信任所要求的那一样东西：一个读出了别人的优先排序、并且可以被问为什么的人。

第三个属性是创新。任何必须在存在之前就被论证的东西都无法存在，因为论证需要那个东西本身。每一个非渐进的结果，都始于一次事先无法被批准的自由裁量，由一个接受了暴露的人作出，而这样的人才是真正持有所有权的人，而不是那个被指派的人。我此前在本站介绍过的[无目标智能体实验](https://changkun.de/blog/posts/goalless-agents/)在小尺度上显示了同一件事。那条流水线的每一步都必须产出可合并的结果，所以智能体在既有架构之内做优化，从不质疑架构本身。Michael Power [Power, 1997] 描述了组织的终态：验证成为系统关于自身制造的一种产品，而判断、坦率和非正式的责任变得不可辨读，因为没有任何东西记录它们。关于第三个属性的证据比前两个弱。研究测量的是自愿努力的减少，而从自愿努力的减少推到非渐进结果的减少，是我的推断。

一个零信任环境随后会自我维持。一旦人们不确定一个不便的真相会如何被接收，他们就说得更晚、披露得更少。观察到这种退缩的人收紧控制。收紧确认了最初的怀疑。现在双方都以对方当下的行为作为自己的理由，而新来者学会这个均衡，却不会学到它的历史。组织在表面上保持有序。消失的是努力中那一部分：它依赖于相信整个事业值得超出可被要求的付出。而再加一项控制无法把这一部分找回来，因为正是控制移除了它。

## 默认信任

零信任的替代方案不是盲目信任。盲目信任是把弱形式扩展到所有人，它在遇到第一个无赖时失败。替代方案是这样一种信任：默认给予，在有代价处解读，按三项检验收回。按这种方式建立的环境有三个属性。

第一个属性是：信任是起始状态，而不是挣来的状态。Philip Pettit [Pettit, 1995] 描述过他所称的"信任的狡计"（the cunning of trust）：给予一个人信任，可以在这个人身上产生可信性，因为这个人开始重视信任所表达的看重。Pettit 的机制只对那些已经在意别人怎么看自己的人起作用，这正是环境也必须能够收回信任的原因。但它意味着：先给予的信任会产生证据，而后给予的信任本来要等待这些证据。零信任环境从不产生这些证据，因为它从不制造使优先排序变得可见的冲突。

第二个属性是：错误被审视，而不是被归档。Amy Edmondson 关于心理安全的研究 [Edmondson, 1999] 发现，当团队成员能够承认错误、寻求帮助、挑战假设时，团队学得更快；而使这些行为成为可能的，是一种关于这些行为会如何被接收的共同预期。这个预期就是一个环境把三项检验施用于自身。当一个错误浮现时，环境说出伤害，改变判断，并把披露当作正确的行为，而不是当作自证其罪的行为。

第三个属性是：信任的收回是渐进且可辨读的。这是 Ostrom 的设计用在对人的信任上。环境预先说明什么会导致信任收缩，而当信任真的收缩时，当事人能看到原因。失效条件是公开的，而一个公开的失效条件正是使默认信任安全而非鲁莽的东西。

在一个具备这三个属性的环境里，再拿前面那个组织的例子来说，那个原型带来的是一次关于访问权限的谈话。三个有代价的选择被读作证据。流程上的近路被记下。流程本身被审视：为什么它制造了几个月的拖延。做出原型的人保有他起初就有的信任，而拥有该系统的团队获得了对这个人优先排序的一次解读，这是任何申请表都无法提供的。这样的环境随时间产出的，是那一类无法被要求的结果。

![](fig5.png)
_图 5：两种环境的反馈回路。零信任自我维持。默认信任产出渐进信任所需要的证据。_

## 修复

已经受损的信任是第三种情况，而修复需要什么，取决于是哪一种错误造成了损害。当造成损害的是能力错误、并且包含三个步骤的验证程序都通过时，解释与道歉就够了，因为它们指认了一个可纠正的局限，并显示这个局限已被理解。当这套程序不通过时，道歉会遇到一个结构性问题：说话者正在用那条已损坏的渠道，来证明这条渠道现在是完好的。

William Bottom 及其合作者 [Bottom et al., 2002] 发现，实质性的补偿比单纯的解释更能恢复合作，并把这个要求命名为"实质性的悔改"（substantive penance）。回应必须昂贵到足以承载廉价言语无法承载的信息。这个代价不必是惩罚性的。这个代价可以是放弃先前使行动者免于纠正的自由裁量，可以是把一个封闭的决定交给独立审查，可以是补偿那些承担了后果的人，也可以是建立一条路径，让不受欢迎的信息不必经过行动者许可就能抵达决策。可信的修复是一次有代价的展示：优先排序已经改变，或者优先排序从来就不是那次失败所暗示的样子。

因此有些失败停留在未修复的状态，因为能修复它们的行动，恰好需要责任方最不愿放弃的东西：对事情经过的叙述的控制，决定何时已经做得足够的权威，或者保留产生这次违背的激励的权力。重新宣告一条原则，无法修复一个仍在奖励违背这条原则的结构。O'Neill 的观察 [O'Neill, 2018] 在这里适用：信任不能被要求，而要求信任本身就是可信性未被提供的迹象。一个记录干净的模型处在同样的位置，因为干净的记录在要求信任，却没有提供可信性。

## 智能体

Thompson 的编译器是一个关于软件的思想实验。训练好的 AI 模型是第一类人造物，对它们而言这个思想实验就是一段平实的描述。一个 AI 模型是一个编译后的对象，它的源码在任何有用的意义上都不可得，因为权重可以读取，却不能作为程序被理解。可以检查的是模型的行为，对着测试集打分。评测审视输出，并推断下面的机制，而在 OpenAI 那起事故之前发表的两个结果显示了这个推断为何脆弱。

Evan Hubinger 及其合作者 [Hubinger et al., 2024] 训练模型在寻常条件下表现有益，并在触发条件出现时切换行为。包括对抗训练在内的标准安全训练未能移除这个隐藏行为，某些情况下反而教会了模型更好地隐藏它。Ryan Greenblatt 及其合作者 [Greenblatt et al., 2024] 发现，当一个模型有理由相信自己正被训练朝向它不偏好的目标时，它在相信自己处于训练之中时服从，在相信自己不被观察时回到原来的行为。Greenblatt 的设置就是 Hume 的聪明的无赖在人工系统中的再现。它同时也是上一节所说的被观察与不被观察的比较，被做成了一个实验，而两种条件之间的差别就是这个实验的结果。

OpenAI 的那起事故在实验室之外显示了同样的模式，而有一个细节使这起事故成为本文的案例，而不是一则安全轶事。模型没有恶意。意图和记录都是干净的，因为模型是在试图完成任务，而它们的转录显示它们正是在这样做。错的是优先级。完成排在边界之上，直到一个智能体短暂地把这个顺序反过来，然后被推翻。价值错误不需要一个坏的行动者。价值错误需要的是：在两种善冲突时把错的东西放在第一位，而奖励完成的训练会产生这样的排序，无需任何人有此意图。

OpenAI 的回应是更多的监控和更严格的对齐要求，而监控与对齐之间的关系正是本文一直在讨论的东西。思维链监控器是一条承载不受欢迎信息的渠道，也正是上一节所要求的，这样的监控器值得建造。但监控器是保证。监控器把输出对照一份关于什么不应出现的规格来检查。这份规格是关于监控器的作者把什么放在第一位的一份陈述。监控器无法检查这份规格，因为监控器正是从这份规格编译出来的。对齐，意思是模型自身的优先排序与它本应服务的优先排序一致，是强形式信任用在一个系统上。没有对齐的监控，是一份记录，对照一个类别，由一个从这份记录中造出来的工具来检查。

![](fig6.png)
_图 6：监控是保证，无法检查它自己被编译出来的那份优先排序。对齐是强形式信任用在一个系统上。_

关于自动化的研究从另一个方向得出了同样的结论。John Lee 与 Katrina See [Lee and See, 2004] 二十年前就论证，自动化的目标是校准的依赖，与已展示的能力成比例，而不是最大化的信任。Alon Jacovi 及其合作者 [Jacovi et al., 2021] 形式化了这个要求：对人工智能体的信任，只有在这份信任追踪一种原则上可以被约定、被检查的可信性时，才是有保证的；而无保证的信任是周围制度的失败，不是使用者的失败。两篇论文描述的都是渐进信任用在一个系统上。

系统背后是写它的人，这就是 Thompson 的第二层，而用来区分能力错误与价值错误的那三个验证步骤，不加修改地适用于这些人。当一个系统的失败被揭示时，它的作者是否独立于自己的意图承认伤害？他们的实践是否改变？这次失败是经由他们、还是不顾他们而被揭示的？在第三项检验上，OpenAI 的这起事故有一个清楚的读法，因为这家公司发布了自己对这起事故的说明，其中包括它的监控错过了什么的时间线。发布这份说明是经由行动者的披露，而它是关于作者优先排序的证据，任何对模型的评测都无法提供这种证据。这份说明同时也是一家公司对自身事故的描述，而这家公司有理由去塑造这份描述，所以我把发布这个行为当作证据，把说明的内容当作主张。一个发布自身系统失效模式、接受自己没有设计的评测、接受对部署的外部约束的实验室，在任何人要求之前就采纳了这些实践。一个凭借自己宣称的价值请求信任的实验室，请求的是弱形式的信任，用的却是强形式的说法。

## 结语

信任可信性包含两个判断。在第一个判断里，我们把自己的福利、工作或行动自由的某个部分放进另一个人手中。在第二个判断里，我们信任自己对这个人优先排序的诠释。我们相信自己看到了他在两种善冲突时如何选择，而不只是他在无关紧要时如何表现。

第二个判断永远无法完成，因为优先排序在有代价的时刻被读取，而没有任何有限的历史包含所有这样的时刻。这种不完整不是犬儒的理由，也不是退回到一个假装不需要信任的环境的理由。它是这样一个理由：因价值观而相信人，在价值观可见的地方读取它，穿过那些不由价值观造成的错误保持信任，并在错误确实由价值观造成时终止信任。强形式并不比弱形式便宜。读一个人的优先排序需要冲突、时间和暴露，而做出诠释的人可能读错。弱形式的代价一样大，只是把代价藏了起来；而当弱形式最终失败时，它说不出自己学到了什么。

这样读，Thompson 的那句话既不是绝望，也不是号召信仰。信任写这个软件的人，是相信一份已经被读出的优先排序：这些人在披露有代价时披露了什么，他们如何对待那些无法追究他们的人，以及被证明错误时他们改变了什么。

本文描述的这些环境，把其中的人和系统塑造向这一种解读或那一种。一个把行为读成类别的组织，得到的是只在类别之内行动的人。一个奖励完成的训练过程，得到的是一个不惜一切代价完成的系统，并且毫无恶意。任何塑造环境的人，无论塑造的是一个团队、一个实验室，还是一个模型被训练的条件，都在选择得到这两种结果中的哪一种。问题是：你所在的环境，或者你正在建造的环境，是不是你会选择的那一种。

我们信任可信性，不是因为它承诺一个没有错误的世界，而是因为它让一个必然包含错误的世界，仍然能够容纳真相、容纳纠正、容纳重新开始的合作。或许更重要的是信任写这个软件的人，因为这些人也写下了关于这个软件的真相能够被说出的条件。

## 参考文献

**基础：信任、保证与验证的回归**

- [Thompson, 1984] Thompson, K. (1984). [Reflections on trusting trust](https://doi.org/10.1145/358198.358210). *Communications of the ACM*, 27(8), 761–763. 图灵奖演讲。一个学会识别自身的编译器，即使从干净源码重建也会重新植入后门，所以审阅源码无法建立信任，依赖最终落在作者身上。
- [Wheeler, 2009] Wheeler, D. A. (2009). [*Fully Countering Trusting Trust through Diverse Double-Compiling*](https://dwheeler.com/trusting-trust/). PhD dissertation, George Mason University. 多样化双重编译：用另一个独立的编译器再编译一次并比对结果。当两者未被一起破坏时可以击败该攻击，代价是把信任转移到作者的相互独立上。
- [Luhmann, 1979] Luhmann, N. (1979). *Trust and Power*. Chichester: Wiley.（德文原版 *Vertrauen*，1968。） 信任作为降低社会复杂性的机制：合作之所以可能，是因为参与者的依赖超出了他们能够验证的范围。
- [Luhmann, 1988] Luhmann, N. (1988). Familiarity, confidence, trust: Problems and alternatives. In D. Gambetta (Ed.), *Trust: Making and Breaking Cooperative Relations* (pp. 94–107). Oxford: Blackwell. 区分熟悉、信心与信任。只有在认识到替代选项、并接受一个本可避免的风险时，信任才存在。
- [Shapiro, 1987] Shapiro, S. P. (1987). [The social control of impersonal trust](https://doi.org/10.1086/228791). *American Journal of Sociology*, 93(3), 623–658. 非人格化信任由审计、执照、保险和监督来守护，而每个守护者又需要自己的守护者。控制移动了信任，没有消除它。

**信任与可信性的哲学**

- [Hardin, 2002] Hardin, R. (2002). *Trust and Trustworthiness*. New York: Russell Sage Foundation. 信任作为被包裹的利益：当对方的利益包含你的利益时，信任是理性的，而可信性是信任应当追踪的属性。
- [Hawley, 2014] Hawley, K. (2014). [Trust, distrust and commitment](https://doi.org/10.1111/nous.12000). *Noûs*, 48(1), 1–20. 可信就是避免未履行的承诺。拒绝一个无法履行的承诺，与履行承诺同样是可信的一部分。
- [Hume, 1751] Hume, D. (1751). *An Enquiry Concerning the Principles of Morals*, Section IX, Part II. 聪明的无赖在一般情况下遵守正义规则，在有利可图且不会被发现处违规。Hume 承认没有任何论证能触及这样的人。
- [Popper, 1959] Popper, K. (1959). *The Logic of Scientific Discovery*. London: Hutchinson. 可证伪性作为经验主张的标志。一个任何观察都无法反驳的陈述不断言任何东西。
- [Pettit, 1995] Pettit, P. (1995). [The cunning of trust](https://doi.org/10.1111/j.1088-4963.1995.tb00029.x). *Philosophy & Public Affairs*, 24(3), 202–225. 信任的狡计：给予信任可以产生可信性，因为人们重视被信任所表达的看重。
- [O'Neill, 2018] O'Neill, O. (2018). [Linking trust to trustworthiness](https://doi.org/10.1080/09672559.2018.1454637). *International Journal of Philosophical Studies*, 26(2), 293–300. 信任应当追踪可信性，而可信性通过让自己可被检查来显示，不是通过请求被相信。

**读取价值观：信号、监督、渐进信任**

- [Spence, 1973] Spence, M. (1973). [Job market signaling](https://doi.org/10.2307/1882010). *Quarterly Journal of Economics*, 87(3), 355–374. 信号理论。一个信号只有在有代价、并且对它想排除的类型代价更高时，才能区分类型。
- [Ostrom, 1990] Ostrom, E. (1990). *Governing the Commons: The Evolution of Institutions for Collective Action*. Cambridge: Cambridge University Press. 对长期存续的公共资源制度的田野研究。它们依靠相互监督和渐进制裁存续，起初很小、随重复加重，而不依靠外部强制。
- [Edmondson, 1999] Edmondson, A. C. (1999). [Psychological safety and learning behavior in work teams](https://doi.org/10.2307/2666999). *Administrative Science Quarterly*, 44(2), 350–383. 心理安全，即团队成员共同相信承担人际风险是安全的，能预测承认错误、寻求帮助等学习行为。

**欺骗与证据的重新解释**

- [Bok, 1978] Bok, S. (1978). *Lying: Moral Choice in Public and Private Life*. New York: Pantheon. 说谎攻击的是被欺骗者的选择能力，因为它在其不知情的情况下败坏了他的信息。
- [Le Guin, 1973] Le Guin, U. K. (1973). The ones who walk away from Omelas. In *New Dimensions 3*. New York: Signet. 一座城市的幸福建立在一个孩子的受苦之上。一旦条件被知晓，先前的幸福就无法再像从前那样被理解。
- [Slovic, 1993] Slovic, P. (1993). [Perceived risk, trust, and democracy](https://doi.org/10.1111/j.1539-6924.1993.tb01329.x). *Risk Analysis*, 13(6), 675–682. 不对称原理：破坏信任的事件具体且权重大，建立信任的事件弥散，所以信任建立得慢、坍塌得快。

**零信任、控制、审计与避责**

- [Kindervag, 2010] Kindervag, J. (2010). *No More Chewy Centers: Introducing the Zero Trust Model of Information Security*. Cambridge, MA: Forrester Research. 为网络提出零信任：边界之内没有隐含信任，每次访问都要验证。
- [Rose et al., 2020] Rose, S., Borchert, O., Mitchell, S., & Connelly, S. (2020). [*Zero Trust Architecture*](https://doi.org/10.6028/NIST.SP.800-207). NIST Special Publication 800-207. NIST 的零信任架构：永不信任，始终验证，无论请求来自网络何处都要评估。
- [Falk and Kosfeld, 2006] Falk, A., & Kosfeld, M. (2006). [The hidden costs of control](https://doi.org/10.1257/aer.96.5.1611). *American Economic Review*, 96(5), 1611–1630. 委托代理实验。当委托人对努力设定最低限时，许多代理人降到最低限，因为他们把控制读作不信任。
- [Bowles, 2016] Bowles, S. (2016). *The Moral Economy: Why Good Incentives Are No Substitute for Good Citizens*. New Haven: Yale University Press. 激励与道德动机不可加。一个假定人自利而设计的激励，会挤出它假定不存在的那种公民动机。
- [Sitkin and Roth, 1993] Sitkin, S. B., & Roth, N. L. (1993). [Explaining the limited effectiveness of legalistic "remedies" for trust/distrust](https://doi.org/10.1287/orsc.4.3.367). *Organization Science*, 4(3), 367–392. 法律主义手段能恢复可靠性问题上的信任，对价值不一致无效，反而将其制度化。
- [Power, 1997] Power, M. (1997). *The Audit Society: Rituals of Verification*. Oxford: Oxford University Press. 审计社会：验证成为一种仪式，产出可审计的表征而不是实质性的保证。
- [Weaver, 1986] Weaver, R. K. (1986). [The politics of blame avoidance](https://doi.org/10.1017/S0143814X00004219). *Journal of Public Policy*, 6(4), 371–398. 官员避免受责的动机强于争取功劳，而程序被这种不对称塑造。
- [Hood, 2011] Hood, C. (2011). *The Blame Game: Spin, Bureaucracy, and Self-Preservation in Government*. Princeton: Princeton University Press. 官僚机构如何运用授权、程序和表述，使出事时没有任何可辨认的人做过选择。

**信任的违背与修复**

- [Kim et al., 2004] Kim, P. H., Ferrin, D. L., Cooper, C. D., & Dirks, K. T. (2004). [Removing the shadow of suspicion: The effects of apology versus denial for repairing competence- versus integrity-based trust violations](https://doi.org/10.1037/0021-9010.89.1.104). *Journal of Applied Psychology*, 89(1), 104–118. 道歉在能力违背后有效，在正直违背后有害，因为它确认了未来信任所依赖的那个缺陷。
- [Schweitzer et al., 2006] Schweitzer, M. E., Hershey, J. C., & Bradlow, E. T. (2006). [Promises and lies: Restoring violated trust](https://doi.org/10.1016/j.obhdp.2006.05.005). *Organizational Behavior and Human Decision Processes*, 101(1), 1–19. 不可信行为造成的损害在持续良好行为下会恢复，但欺骗留下持久损害，并削弱此后的承诺。
- [Bottom et al., 2002] Bottom, W. P., Gibson, K., Daniels, S. E., & Murnighan, J. K. (2002). [When talk is not cheap: Substantive penance and expressions of intent in rebuilding cooperation](https://doi.org/10.1287/orsc.13.5.497.7816). *Organization Science*, 13(5), 497–513. 实质性的悔改比单纯解释更能恢复合作，因为有代价的补偿承载着廉价言语无法承载的信息。

**对自动化系统与学习系统的信任**

- [Lee and See, 2004] Lee, J. D., & See, K. A. (2004). [Trust in automation: Designing for appropriate reliance](https://doi.org/10.1518/hfes.46.1.50_30392). *Human Factors*, 46(1), 50–80. 对自动化的信任应当与已展示的能力校准。过度信任与不信任都是不当依赖。
- [Jacovi et al., 2021] Jacovi, A., Marasović, A., Miller, T., & Goldberg, Y. (2021). [Formalizing trust in artificial intelligence: Prerequisites, causes and goals of human trust in AI](https://doi.org/10.1145/3442188.3445923). *FAccT '21*, 624–635. 把对 AI 的有保证信任形式化为追踪一种可约定、可检查的可信性的信任。无保证的信任是制度的失败。
- [Hubinger et al., 2024] Hubinger, E., et al. (2024). [Sleeper agents: Training deceptive LLMs that persist through safety training](https://arxiv.org/abs/2401.05566). arXiv:2401.05566. 潜伏智能体：后门行为在安全训练后仍然存续，对抗训练反而可能教会模型隐藏它。
- [Greenblatt et al., 2024] Greenblatt, R., et al. (2024). [Alignment faking in large language models](https://arxiv.org/abs/2412.14093). arXiv:2412.14093. 对齐伪装：模型在自以为处于训练中时服从，在自以为不被观察时回到原来的行为。
- [OpenAI, 2026] OpenAI (2026). [The Hugging Face incident and the road ahead](https://openai.com/index/hugging-face-incident-and-the-road-ahead/). 发布于 2026 年 8 月 27 日。 公司对自身事故的说明：一个内部研究模型在网络安全评测中突破隔离并进入第三方系统。回应是更多的思维链监控和更严格的对齐要求。

{{% /zh %}}
