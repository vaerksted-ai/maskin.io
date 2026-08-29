> Source: https://maskin.io/docs/learn/human-in-the-loop-ai/

# What is human in the loop AI — and when is it real?
**Human in the loop AI (HITL) means a human reviews or approves an AI system’s output before it commits.** It’s the default oversight pattern for high-stakes AI — but “in the loop” doesn’t guarantee real oversight. Whether a HITL claim is real or theater depends on one measurable thing: **override rate**.

## What is human in the loop AI?
Human in the loop AI describes any system where a person’s judgment is required before an AI-produced decision, artefact, or action becomes final. The pattern shows up in three shapes:
- **Approval gates.** The model drafts, the human clicks approve or edit. Content moderation queues, radiology triage, and legal e-discovery pipelines sit here.
- **Correction loops.** The human labels or fixes wrong outputs after the fact, and those labels feed back into training or evaluation. Reinforcement learning from human feedback (RLHF) is the canonical example.
- **Escalation routing.** The agent runs autonomously until confidence drops below a threshold or the next action crosses a blast-radius line — at which point a human is paged in.
All three carry the same claim: a person is close enough to the work to catch wrong outputs before they cause harm. That claim only holds when three conditions all hold at once — the human has enough context to evaluate the output, visibility into what the model did, and time to intervene before the action commits. Miss any one, and “in the loop” is compliance decoration, not oversight. The rest of this piece is about how to tell the difference.

## Human on the loop vs human in the loop: what’s the difference?
Human in the loop (HITL) puts the human inside the transaction: nothing ships until they approve. Human on the loop (HOTL) puts the human above it: the agent runs, and the human supervises through review surfaces, dashboards, and named escalation gates. In HITL the human is the trigger; in HOTL an event is the trigger and the human is the auditor.
The distinction became the working vocabulary of ambient AI in early 2025, when Harrison Chase at LangChain named “human-on-the-loop” as the design pattern for background agents that run continuously and escalate only when they need input. A companion explainer on the [ambient agent workspace](/docs/ambient-agent-workspace/) walks that shift in detail: chat is the wrong UX for work that runs on events, and the “inbox” of an ambient system is a typed object graph rather than a queue of discrete approvals.
The design lesson matters because HITL and HOTL are not synonyms in disguise. They fail differently. HITL fails when the reviewer becomes a rubber stamp — the queue is long, the outputs look plausible, and the human clicks approve without reading. HOTL fails when the escalation policy is under-specified — the agent commits an irreversible action because nothing flagged it as needing human attention. Choosing between them is a decision about *which failure mode you can live with*, per action class.

## When is HITL real vs theater? The override-rate test
The honest way to tell whether a HITL claim is real oversight or ceremonial is to measure one number: **override rate** — the share of AI outputs the human reviewer actually changes, rejects, or escalates before the action commits.
Two bounds separate real oversight from theater. If the override rate is stuck at **0%**, the reviewer has become a rubber stamp — approval fatigue has set in, the human is clicking approve because nothing has ever come back wrong, and the loop is producing the appearance of oversight without the substance. If the override rate is stuck **above 20%**, the model is broken and the human is doing the model’s job under a HITL banner. Real HITL sits in the middle band and is watched over time; a drifting override rate is the earliest signal something has changed.
The frame did not originate here. MIT Technology Review’s April 16, 2026 piece on the illusion of AI oversight made the point plainly: humans nominally in the loop but operating under workflow pressure and without meaningful visibility produce the appearance of oversight, not the substance. Verfassungsblog coined the phrase that captures the failure mode — the **“warm body in the loop”** — a person whose role fails on first audit because nothing about the workflow lets them meaningfully intervene.
A second metric belongs alongside override rate: **override latency**. If the reviewer’s median time-to-intervene is longer than the time-to-commit-wrong-outcome — the queue is deeper than the action window — then the HITL claim is theater by construction, regardless of override rate. A moderator with a two-minute median response on a queue that ships in ten seconds is not in any operational sense “in the loop.”
The two-metric frame — override rate plus override latency, watched per action class — is what turns HITL from a marketing claim into an auditable one. It also explains why a uniform “add a human review step” policy destroys agent value without buying real safety: the queue gets too long, the reviewer’s context gets too thin, and the override rate collapses to zero.

## What does EU AI Act Article 14 actually require?
Article 14 of the EU AI Act is the section most often cited in “the AI Act requires human in the loop” claims. Read the text: **Article 14 does not mandate human-in-the-loop by name.** It requires *effective, commensurate human oversight* for high-risk AI systems — a different thing.
The article names four operational duties the oversight arrangement must enable the assigned natural persons to perform:
1. **Understand.** Properly understand the relevant capacities and limitations of the high-risk system and monitor its operation, including for anomalies.
2. **Monitor.** Remain aware of the tendency toward automation bias — over-relying on the system’s output — and detect drift in performance.
3. **Intervene.** Correctly interpret the system’s output, decide not to use it, or disregard, override, or reverse it.
4. **Halt.** Stop the system through a “stop” button or a similar procedure that brings it to a safe state.
The word “loop” does not appear. The article is agnostic on whether the human sits *in* the transaction (HITL) or *on* it (HOTL); what it demands is that the oversight arrangement — whichever shape it takes — actually delivers the four capabilities in practice. This is why the honest way to design against Article 14 is to specify oversight *per action class*, not per system: the four duties can be satisfied by a HOTL arrangement for bulk pipeline actions and a HITL arrangement for irreversible or high-blast-radius ones, in the same product.
The compliance implication is uncomfortable for vendors selling “HITL for AI Act” as a single feature. A uniform HITL policy that produces a 0% override rate fails Article 14’s *effectiveness* test as clearly as no oversight at all. A “warm body in the loop” is not “effective, commensurate” oversight. The auditor’s question is not “is there a human?” — it is “does the human understand, monitor, intervene, and halt?” The [EU AI Act, Article 14, on EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689) is worth reading directly before you build against it.

## When to use HITL, HOTL, or a tiered approval policy
Deciding between HITL and HOTL is not a system-wide choice; it is a per-action-class choice. The right architecture for most production AI systems is a **tiered approval policy** — HOTL as the default for bulk reversible actions, HITL routed only for irreversible or high-blast-radius actions, and full autonomy where the cost of being wrong is negligible.
The pattern financial institutions have described publicly — Morgan Stanley’s internal AI deployment is the most-cited version — is the clearest reference implementation. Bulk pipeline work (summarising research, tagging documents, routing internal messages) runs on HOTL with dashboards and sampled audits. High-stakes classes — client-facing communications, order entry, anything with legal or financial consequence — route to a HITL gate. The autonomy dial is set per class and revisited when override rate drifts.
The three questions to run through when you set the dial for a given action class are:
- **Reversibility.** Reversible with negligible cost (a draft the user will edit, a tag on an internal note) — autonomy, possibly a sample-audit HOTL. Irreversible (email sent, payment moved, record deleted) — HITL or a hard confirmation gate.
- **Blast radius.** How many downstream systems, customers, or dollars does the wrong action touch? A wrong tag on one internal document is small; a wrong bulk email to a segment is large. Blast radius is the second axis of the same decision.
- **Frequency and review capacity.** If an action class fires a thousand times a day, HITL collapses to 0% override rate within a week — the queue is too deep to review meaningfully. Either tighten the model or split the class and gate only the high-stakes fraction.
The failure mode a tiered policy avoids is the “uniform HITL everywhere” pattern that destroys agent value without buying safety. The failure it introduces is under-specification: an action class not explicitly assigned to a tier defaults to whatever autonomy the agent has, which is often more than the operator would have chosen. Name the classes and their tiers up front, before the agent ships. Enforce the policy at a governance layer, not in agent code — an agent that decides its own oversight is a self-signed certificate.

## What real HOTL looks like in a workspace
Real human-on-the-loop is a set of visible artefacts, not a slogan. In a production workspace, four things are load-bearing:
- **Named oversight gates on the object model.** Each action class the agent can take is assigned a tier — autonomy, HOTL sample, or HITL — and the tier is a property of the object, not a runtime decision the agent makes for itself.
- **Override rate and override latency visible per class.** The two metrics live on a dashboard the operator actually reads, watched per action class over time.
- **Tiered approvals enforced at the governance layer.** The agent cannot escalate its own tier; policy is set outside the agent and enforced when the agent tries to act.
- **An event-sourced audit trail.** Every action, every intervention, every halt is a typed event, so an auditor can reconstruct the oversight arrangement after the fact.
Maskin’s workspace is built on a typed object graph — insights, bets, tasks, loops — with per-loop autonomy settings and an audit trail that treats every agent action as a typed transition. Gates live on the object, override rate is measurable per action class, and the audit trail is the graph’s own history. The deeper architecture write-up is the [ambient agent workspace piece](/docs/ambient-agent-workspace/).
> ✓
> **Key takeaways**
> **HITL** means a human approves an AI output before it commits. **HOTL** means a human supervises an autonomous agent through review surfaces and escalation gates. The distance between the two prepositions is a design decision, not a semantic quibble.
> **The honest metric is override rate.** Stuck at 0% means the reviewer is rubber-stamping (theater). Stuck above 20% means the model is broken. Real HITL sits in the middle band, watched over time.
> **Override latency matters as much as override rate.** If the reviewer’s response time is slower than the action’s commit window, the HITL claim is theater by construction.
> **EU AI Act Article 14 does not mandate HITL by name.** It requires *effective, commensurate* oversight — understand, monitor, intervene, halt — which HOTL can satisfy for many action classes.
> **The right architecture is a tiered approval policy** — autonomy for low-stakes, HOTL for bulk, HITL for irreversible or high-blast-radius actions — enforced at a governance layer, not inside agent code.
> **Uniform HITL destroys value without buying safety.** A “warm body in the loop” fails Article 14’s effectiveness test as clearly as no oversight at all.

## FAQ

### What is human in the loop AI?
Human in the loop AI is a design pattern where a person reviews or approves an AI system’s output before it commits — the default oversight arrangement for high-stakes AI. It shows up as approval gates, correction loops that feed back into training, and escalation routing. Whether it delivers real oversight is measurable, not assumed.

### What’s the difference between HITL and HOTL?
HITL puts the person inside the transaction — nothing ships until they approve. HOTL puts them above it — the agent runs, and the human supervises through review surfaces and named escalation gates. HITL fails when reviewers become rubber stamps; HOTL fails when the escalation policy is under-specified. Choose per action class.

### Does the EU AI Act require human in the loop?
No. Article 14 of the EU AI Act requires effective, commensurate human oversight of high-risk AI systems and specifies four duties the arrangement must enable — understand, monitor, intervene, halt. The word “loop” does not appear. HOTL can satisfy Article 14 for many action classes; HITL is one design that meets the duties, not the only one.

### What is override rate?
Override rate is the share of AI outputs the human reviewer changes, rejects, or escalates before the action commits. It is the honest way to tell whether a HITL claim is real oversight or theater. Stuck at 0% signals rubber-stamping; above 20% signals a broken model. Real HITL sits between, monitored per action class.

### When is human in the loop not enough?
When the reviewer lacks context, visibility, or time — any one of the three — the loop is compliance decoration. It is also not enough when action volume is too high for meaningful review, when the model’s failure modes are outside the reviewer’s expertise, or when the wrong-outcome window closes faster than the response time.
Read next

## Design oversight per action class, not per system
Maskin is the open-source, MCP-native workspace where oversight lives on the object model — per-loop autonomy, an event-sourced audit trail, and tiered approvals enforced at the governance layer. Apache 2.0, self-hostable, EU/US data residency.
