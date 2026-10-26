> Source: https://maskin.io/docs/learn/human-in-the-loop-ai/

# Human on the loop: the honest oversight pattern for autonomous agents
**Human on the loop (HOTL) means a person supervises an autonomous AI agent through review surfaces and named escalation gates, instead of approving every action before it runs.** The agent works on its own; events, not people, trigger a human. Human in the loop (HITL) is the opposite: nothing commits until a person says yes.
Neither is automatically safer. Which one is real oversight depends on one measurable thing: override rate. If you run agents that act on their own schedule, this page covers the vocabulary, the failure mode of each pattern, what EU AI Act Article 14 actually requires, and how to set the dial per action class. For the developer-side question of how agent SDKs implement the approval gate itself, see the sibling page [Human in the loop, re-defined: the approval gate before side-effecting tool calls](/docs/learn/human-in-the-loop/).
> ✓
> **Key takeaways**
> **Human on the loop** means a human supervises an autonomous agent through review surfaces and escalation gates. **Human in the loop** means a human approves an output before it commits. The preposition is a design decision, not a semantic quibble.
> **The two patterns fail differently.** HITL fails when the reviewer becomes a rubber stamp. HOTL fails when the escalation policy is under-specified and the agent commits something irreversible because nothing flagged it.
> **The honest metric is override rate.** Stuck at 0%, the reviewer is rubber-stamping. Stuck above 20%, the model is broken and the human is doing its job. Both bounds apply to any review surface, including HOTL sample audits.
> **Override latency matters as much.** If the human’s response time is slower than the action’s commit window, the oversight claim is theater by construction.
> **EU AI Act Article 14 does not mandate human in the loop by name.** It requires effective, commensurate oversight and lists five duties in Article 14(4)(a) to (e). HOTL can satisfy them for many action classes.
> **The right architecture is a tiered approval policy**: autonomy for low-stakes work, HOTL for bulk reversible work, HITL for irreversible or high-blast-radius actions, enforced at a governance layer and not inside agent code.

## What is human on the loop?
Human on the loop describes a system where the agent runs continuously and the person sits above the work: watching dashboards, sampling outputs, and answering when the agent escalates. The human is the auditor, not the trigger.
The design problem is not new for background agents. In his January 2025 post on ambient agents, Harrison Chase of LangChain describes three human-in-the-loop patterns for agents that run on events: notify, question, and review.[3](#fn3) In our reading, each is an escalation gate: notify flags something the agent should not act on alone, question asks for missing input, and review hands a proposed action back for sign-off. The [ambient agent workspace](/docs/ambient-agent-workspace/) explainer walks through why that shift matters: chat is the wrong interface for work that runs on events, and the “inbox” of an ambient system is a typed object graph, not a queue of approvals.
Two things make HOTL different from “the agent just runs”:
- **Named escalation gates.** The agent has an explicit list of conditions under which it must stop and ask: confidence below a threshold, an action that crosses a blast-radius line, an action class nobody has cleared yet.
- **Review surfaces the human actually reads.** Dashboards, sampled audits, and an event trail of everything the agent did. If nobody looks at them, you have autonomy with a logo on it.

## Human on the loop vs human in the loop: what is the difference?
![Diagram comparing human in the loop (human inside the approval transaction) with human on the loop (human above an autonomous agent, reached through escalation gates)](/docs/learn/images/maskin-hotl-vs-hitl-diagram.png)
Human in the loop puts the human inside the transaction: nothing ships until they approve. Human on the loop puts the human above it. In HITL the human is the trigger. In HOTL an event is the trigger and the human is the auditor. A third state, human out of the loop, means no person reviews outputs at all, and it is only defensible where being wrong costs almost nothing.
|  | Human in the loop (HITL) | Human on the loop (HOTL) |
| --- | --- | --- |
| Where the human sits | Inside the transaction | Above the work |
| What triggers a human | Every action in the gated class | An escalation event or a scheduled review |
| The human’s job | Approve, edit, or reject | Supervise, sample, intervene, stop |
| Typical failure | Rubber-stamping once the queue gets long | Under-specified escalation: an irreversible action nobody flagged |
| Best fit | Irreversible or high-blast-radius actions | Bulk, reversible, high-frequency actions |
| What to measure | Override rate and override latency | Override rate on sampled audits, plus whether escalations fire at all |
HITL and HOTL are not synonyms in disguise. They fail differently, so choosing between them is a decision about which failure mode you can live with, per action class. HITL is also the pattern the agent frameworks have standardised on at the code level: OpenAI, Cloudflare, Microsoft and Temporal all ship an approval primitive. That story is covered in [the SDK-primitive page](/docs/learn/human-in-the-loop/); this page stays on the oversight question that sits above it. Loop engineers hit the same wall: in [loop engineering](/docs/what-is-loop-engineering/), the scheduled human gate is the part that erodes first.

## When is human oversight real, and when is it theater? The override-rate test
The honest way to tell whether an oversight claim is real is to measure one number: **override rate**, the share of AI outputs the human actually changes, rejects, or escalates before or after the action commits.
Two bounds separate real oversight from theater. If the override rate is stuck at **0%**, the reviewer has become a rubber stamp: nothing has ever come back wrong, so they click approve without reading. If it is stuck **above 20%**, the model is broken and the human is doing the model’s job under an oversight banner. Real oversight sits in the middle band and is watched over time, because a drifting override rate is the earliest signal that something has changed.
For HOTL the same logic applies to the review surfaces. A sampled audit that never finds anything to fix is either a perfect agent or a reviewer who is not reading, and you cannot tell which without the number. Our view: a HOTL setup where no escalation has ever fired deserves suspicion, not applause.
The frame did not originate here. MIT Technology Review’s April 16, 2026 piece on the illusion of AI oversight made the point plainly: humans nominally in the loop but working under workflow pressure and without visibility produce the appearance of oversight, not the substance.[1](#fn1) The phrase for the failure mode is the **“warm body in the loop”**: a person kept in place for the sake of having one, with no real ability to intervene. Crootof, Kaminski and Price include “warm body” roles in their 2023 typology of the jobs a human can be given in a human-in-the-loop system.[4](#fn4) Schwemer and Koivisto’s 2025 Verfassungsblog piece, “A Warm Body in the Loop,” carries the idea into EU tech regulation and asks whether human involvement is meaningful or merely symbolic.[2](#fn2)
A second metric belongs next to override rate: **override latency**. If the reviewer’s median time-to-intervene is longer than the time it takes the wrong outcome to commit, the oversight claim is theater by construction, whatever the override rate says. A moderator with a two-minute median response on a queue that ships in ten seconds is not in any operational sense “in the loop,” and a supervisor who reads the dashboard on Fridays is not “on the loop” of an agent that acts hourly.
The two-metric frame, override rate plus override latency, watched per action class, is what turns an oversight claim from marketing into something an auditor can check. It also explains why a uniform “add a human review step” policy destroys agent value without buying real safety: the queue gets too long, the reviewer’s context gets too thin, and the override rate collapses to zero.

## What does EU AI Act Article 14 actually require?
Article 14 of the EU AI Act is the section most often cited in “the AI Act requires human in the loop” claims. Read the text: **Article 14 does not mandate human in the loop by name.** It requires *effective, commensurate human oversight* for high-risk AI systems, which is a different thing.
Article 14(4) lists five things the oversight arrangement must enable the assigned natural persons to do, as appropriate and proportionate, in points (a) to (e):
1. **Understand and monitor.** Properly understand the relevant capacities and limitations of the high-risk system, and duly monitor its operation, including to detect and address anomalies, dysfunctions and unexpected performance. (Article 14(4)(a))
2. **Resist automation bias.** Remain aware of the possible tendency to rely, or over-rely, on the system’s output, in particular where the system provides information or recommendations for decisions that people take. (Article 14(4)(b))
3. **Interpret the output.** Correctly interpret the system’s output, taking into account the interpretation tools and methods available. (Article 14(4)(c))
4. **Decide to override.** Decide, in any particular situation, not to use the system, or to disregard, override or reverse its output. (Article 14(4)(d))
5. **Intervene or stop.** Intervene in the operation of the system or interrupt it through a “stop” button or a similar procedure that lets it come to a halt in a safe state. (Article 14(4)(e))
The word “loop” does not appear. The article is agnostic on whether the human sits in the transaction (HITL) or on it (HOTL). What it demands is that the arrangement, whichever shape it takes, actually delivers the five capabilities in practice. That is why the honest way to design against Article 14 is to specify oversight per action class, not per system: a HOTL arrangement can cover bulk pipeline actions and a HITL arrangement the irreversible or high-blast-radius ones, in the same product.
The compliance implication is uncomfortable for vendors selling “HITL for AI Act” as a single feature. A uniform HITL policy that produces a 0% override rate fails Article 14’s effectiveness test as clearly as no oversight at all. The auditor’s question is not “is there a human?” It is “can the human do all five: understand and monitor, resist automation bias, interpret the output, override it, and stop the system?” Read [Article 14 on EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689) directly before you build against it.

## When to use human on the loop, human in the loop, or a tiered policy
Deciding between HITL and HOTL is not a system-wide choice. It is a per-action-class choice, and the right architecture for most production systems is a **tiered approval policy**: HOTL as the default for bulk reversible actions, HITL routed only to irreversible or high-blast-radius actions, and full autonomy where being wrong costs next to nothing.
One agent usually spans several classes. A support agent might tag and route incoming tickets on its own, have a person sample-audit its draft replies, and require explicit approval before issuing a refund. The autonomy dial differs by class, and that is the point. A delivery lifecycle is the same pattern at team scale: in the [agentic SDLC](/docs/learn/agentic-sdlc/) a person approves three decisions, and nobody approves build, review or verify.
Three questions set the dial for a given action class:
- **Reversibility.** Reversible at negligible cost (a draft the user will edit, a tag on an internal note): autonomy or sample-audit HOTL. Irreversible (email sent, payment moved, record deleted): HITL or a hard confirmation gate.
- **Blast radius.** How many downstream systems, customers, or dollars does the wrong action touch? A wrong tag on one internal document is small. A wrong bulk email to a customer segment is large.
- **Frequency and review capacity.** If an action class fires a thousand times a day, per-action approval will collapse to a 0% override rate within a week because the queue is too deep to review. Either tighten the model, or split the class and gate only the high-stakes fraction.
A tiered policy avoids the “uniform HITL everywhere” trap, which destroys agent value without buying safety. It introduces its own failure: under-specification. An action class not assigned to a tier defaults to whatever autonomy the agent already has, which is often more than the operator would have chosen. Name the classes and their tiers before the agent ships, and enforce the policy at a governance layer, not in agent code. An agent that decides its own oversight is a self-signed certificate.
Putting that policy into practice is what the free onboarding is for: [loops that graduate from dry run to semi- or fully autonomous](/onboarding/) earn their tier on evidence, with a human gate on every material call.

## What real human on the loop looks like in a workspace
Real HOTL is a set of visible artefacts, not a slogan. Four things are load-bearing:
- **Named oversight gates on the object model.** Each action class the agent can take is assigned a tier (autonomy, HOTL sample, or HITL), and the tier is a property of the object, not a runtime decision the agent makes for itself.
- **Override rate and override latency visible per class.** Both live on a dashboard the operator actually reads, watched over time.
- **Tiered approvals enforced at the governance layer.** The agent cannot escalate its own tier. Policy is set outside the agent and enforced when the agent tries to act.
- **An event-sourced audit trail.** Every action, intervention and halt is a typed event, so an auditor can reconstruct the oversight arrangement after the fact.
Maskin’s workspace is built on a typed object graph of insights, bets, tasks and loops, with per-loop autonomy settings and an audit trail that treats every agent action as a typed transition. Gates live on the object, override rate is measurable per action class, and the audit trail is the graph’s own history. The deeper architecture write-up is the [ambient agent workspace](/docs/ambient-agent-workspace/) piece. A concrete example of a human gate on a decision is [the human call on an at-risk account’s recovery bet](/docs/at-risk-account-alerts/), where a person decides whether the bet is right and commits the resources. A lighter-weight example is the [LinkedIn content loop](/marketplace/linkedin-content/): an editor agent checks every draft, and the account owner approves each post before it goes live.

## FAQ

### What is human on the loop?
Human on the loop is an oversight pattern where an autonomous AI agent runs on its own and a person supervises through review surfaces, sampled audits, and named escalation gates. The human is the auditor, not the per-action approver. It works for bulk, reversible actions and fails when the escalation policy is under-specified.

### What is the difference between human in the loop and human on the loop?
Human in the loop puts the person inside the transaction: nothing ships until they approve. Human on the loop puts them above it: the agent runs, and the human supervises through dashboards and escalation gates. HITL fails when reviewers rubber-stamp; HOTL fails when escalation rules are vague. Most production systems use both, chosen per action class.

### What does human out of the loop mean?
Human out of the loop means the system acts with no person reviewing or approving its outputs, before or after. It is only defensible where a wrong action is cheap and fully reversible. Everywhere else, the usual move is to put a human on the loop for bulk work and in the loop for irreversible actions.

### What is an example of human on the loop?
A background agent that triages and tags incoming work on its own, while a person reviews a sampled audit and gets paged when the agent hits a named escalation condition, is human on the loop. The same agent still asks for explicit approval before an irreversible step such as issuing a refund, which is human in the loop for that one action class.

### Does the EU AI Act require human in the loop?
No. Article 14 of the EU AI Act requires effective, commensurate human oversight of high-risk AI systems. Article 14(4) lists five duties the arrangement must enable: understand and monitor, resist automation bias, interpret the output, decide to override or reverse it, and intervene or stop the system. The word “loop” does not appear. HOTL can satisfy Article 14 for many action classes.

### What is override rate?
Override rate is the share of AI outputs a human reviewer changes, rejects, or escalates. It is the honest way to tell real oversight from theater. Stuck at 0% signals rubber-stamping; stuck above 20% signals a broken model. Real oversight sits between the two and is monitored per action class, alongside override latency.

### When is human in the loop not enough?
When the reviewer lacks context, visibility, or time, any one of the three, the loop is compliance decoration. It is also not enough when action volume is too high for meaningful review, when the model’s failure modes sit outside the reviewer’s expertise, or when the wrong-outcome window closes faster than the response time.

## Sources
1. **Stephanie Arnett / MIT Technology Review**, *Why having “humans in the loop” in an AI war is an illusion* (2026-04-16). [technologyreview.com/2026/04/16/1136029/humans-in-the-loop-ai-war-illusion](https://www.technologyreview.com/2026/04/16/1136029/humans-in-the-loop-ai-war-illusion/). Source for the illusion-of-oversight framing: a human nominally in the loop but under workflow pressure and without visibility provides the appearance of oversight, not the substance. [↩](#fnref1)
2. **Sebastian Schwemer and Ida Koivisto / Verfassungsblog**, *A Warm Body in the Loop: Rethinking Human Control of AI in EU Tech Regulation* (2025-09-18). [verfassungsblog.de/warm-body-in-the-loop](https://verfassungsblog.de/warm-body-in-the-loop/). Applies the “warm body” idea to EU tech regulation and asks whether human involvement is meaningful or merely symbolic. [↩](#fnref2)
3. **Harrison Chase / LangChain**, *Introducing Ambient Agents* (Jan 2025). [langchain.com/blog/introducing-ambient-agents](https://www.langchain.com/blog/introducing-ambient-agents). Describes three human-in-the-loop patterns for ambient agents: notify, question, and review. [↩](#fnref3)
4. **Rebecca Crootof, Margot E. Kaminski and W. Nicholson Price II**, *Humans in the Loop*, 76 Vanderbilt Law Review 429 (2023). [scholarship.law.vanderbilt.edu/vlr/vol76/iss2/2](https://scholarship.law.vanderbilt.edu/vlr/vol76/iss2/2). Its typology of human roles includes “warm body” roles. [↩](#fnref4)
Read next

## Design oversight per action class, not per system
Maskin is the open-source, MCP-native workspace where oversight lives on the object model — per-loop autonomy, an event-sourced audit trail, and tiered approvals enforced at the governance layer. Apache 2.0, self-hostable, EU/US data residency.
