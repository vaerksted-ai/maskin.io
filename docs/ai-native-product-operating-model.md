> Source: https://maskin.io/docs/ai-native-product-operating-model/

# The AI-native product operating model: how the SVPG model evolves for AI-native product teams
An AI-native product operating model is a way to organize product work so empowered teams and AI agents can use shared context to solve customer problems and deliver outcomes. It extends the product model Marty Cagan describes and keeps its empowered teams. The change is in how teams curate evidence, make decisions, preserve intent, and govern recurring agent work.
[Book a meeting](https://meshfirm.com/bookmagnus) Bring one current product bet and we will trace where its signal, evidence and continuity hold up and where they do not.
> ✓
> **Key takeaways**
> Keep the empowered trio as the default, and bring in specialists when the problem requires them.
> Treat curation of signals and evidence as core product work.
> Agree decision ownership before a decision is needed to avoid committee drift.
> Preserve the customer reason from discovery through delivery in linked records.
> Give recurring agent work a stopping condition and a named owner.
> Let the problem set the team shape.

## The Cagan model in one paragraph
Marty Cagan’s product operating model is the base this page builds on. In [SVPG's introduction](https://www.svpg.com/the-product-operating-model-an-introduction/), empowered cross-functional teams, usually a product manager, designer and tech lead, are given problems to solve and are held to outcomes. AI does not make those responsibilities disappear. It changes the flow of information and work around them, while the team continues to own its outcomes.

## Three gaps the AI-native product operating model closes
In his June 2026 essay, [Ravi Mehta frames the PM job as shifting from prioritization to curation](https://blog.ravi-mehta.com/p/prioritization-vs-curation): making sure the best available context reaches the people and systems shaping the work. Every team walks into three gaps. AI can help work move across them, but it cannot decide what matters or supply missing context by itself. Mehta’s point is that models are becoming a commodity; the differentiator is shared team-level context.
![Diagram of the AI-native product operating model's three gaps: signal (does customer reality reach the decision), evidence (can a new idea be compared with a roadmap bet) and continuity (does the reason for a bet survive every handoff), each with a test to run this week.](/og-image-ai-native-product-operating-model-three-gaps.png)
The three gaps in an AI-native product operating model, each with a test you can run on one current bet.

### The SIGNAL gap: customer reality does not reach the decision
Sales calls, support tickets, Slack conversations, reviews and analytics may all contain useful signals, but the people deciding what to pursue often see only a summary or a selected anecdote. In a 200 to 3,000 person company, those inputs may sit with different functions and teams, while a product group makes its plan from the evidence that happens to reach its meeting.
**Test it this week:** Take one current product bet and ask the team to point to the customer signals behind it. Note which sources they can inspect directly and which they know only through someone else’s summary.

### The EVIDENCE gap: new ideas cannot be compared objectively
A shiny new idea can arrive with a persuasive demo or senior sponsor. Existing roadmap work is often represented by a short title and a delivery estimate. Without a common view of the customer evidence and intended outcome, teams cannot make a fair comparison. The result is a choice whose basis is hard to inspect or revisit.
**Test it this week:** Put one new idea beside one existing roadmap bet. Ask the decision-makers to compare the customer problem, evidence and expected outcome for both. If the comparison depends on information only one side has, record what is missing.

### The CONTINUITY gap: the why disappears at handoffs
Discovery may establish a customer problem, but the reason for a bet can get reduced to a ticket, then detached from the delivery work and the outcome review. In a larger organization, product, design, engineering and other specialists may each inherit a different slice of the context. The team can complete the requested work without being able to explain which customer evidence prompted it.
**Test it this week:** Pick the last feature you shipped and try to trace it back to customer evidence in under fifteen minutes. Count how many handoffs lost the reason and how often you had to rely on somebody’s memory.
These are connected tests of whether the team can gather relevant signals, compare options and retain intent as work changes hands. AI can summarize or move information, while the team curates what is relevant and makes the decision explicit.
> ✓
> **Run the three tests on one of your own bets**
> Bring one current bet to a meeting and we will trace its signal, evidence and continuity with you, and show you where the trail breaks.
> [Book a meeting](https://meshfirm.com/bookmagnus)

## What changes in practice
**Teams:** The product manager, designer and tech lead form the default stable core. That core owns a problem space and pulls in specialists such as data, security, legal, domain or ML experts when the problem needs their expertise. Almosafer’s LLM search bet brought in ML and domain experts; Kaiser Permanente’s Get Care Now brought in legal and clinical operations.
For work that cuts across product boundaries, a mission team can bring together 5 to 10 people for 8 to 12 weeks around a problem such as churn, activation, cost of serve or a cross-product AI capability. The team can focus on that problem for the agreed period, then dissolve, morph or be promoted. Use the smallest viable group. Three is right when three can do the work; ten is right only when ten are required.
**Decisions:** Flexibility works when decision ownership is agreed once per class of decision. The allocations below are one worked example. Exact allocations vary; what matters is that people know who decides before the decision comes up.
| Decision | Primary owner | Contributors |
| --- | --- | --- |
| Which customer problem to pursue | Product | Design, Engineering, Data, Business |
| UX approach | Design | Product, Engineering, Research |
| Technical architecture | Engineering | Product, Security, Architecture |
| Experiment design | Product and Design | Data, Engineering |
| Regulatory interpretation | Legal and Compliance | Product, Engineering |
| Commercial model | Product and Business | Finance, Sales, Marketing |
**Discovery:** Curation means selecting and connecting evidence that can inform a decision. Teams assess each signal for its usefulness and evaluate each new idea against priorities. They still need to test whether a problem is worth solving and whether an option addresses it. The three gap tests make that work inspectable: check the signals, compare the evidence and trace the reason into delivery.
**Cadence:** A recurring agent loop is bounded work that repeats. Marily Nika’s July 2026 [loop engineering essay](https://marily.substack.com/p/loop-engineering-is-your-new-job) sets the rule: an agent loop needs a stopping condition before it runs. See [how a loop earns autonomy](/loops/loops-that-graduate/) and [permissions and audit trail](/docs/learn/ai-agent-governance/). The operating model should make the boundary of recurring work clear before the loop begins.

## Where AI makes the old model worse
The honest counter-view is that adopting the visible signals of a mature product model leaves the conditions for success unaddressed. [John Cutler’s critique](https://cutlefish.substack.com/p/ai-wont-save-the-kingdoms-we-built) is that roles, rituals and artifacts alone do not empower teams; the companies held up as examples went through several waves of reworking. A new team diagram or a set of AI rituals can reproduce the old constraints under new names.
AI can reduce information friction, but it cannot resolve contested ownership or misaligned incentives. A new failure mode is coordination theater: agents talking to agents while the humans avoid the decision that matters. Faster summaries and more activity leave open who owns the outcome and who has authority to change the plan.
Christian Idiodi’s July 2026 [AI Productivity Paradox](https://www.linkedin.com/posts/cidiodi_the-ai-productivity-paradox-silicon-valley-activity-7486429440051281920-qQxG) post makes the point directly: put AI on top of the old project model and the same problems happen faster. If teams move faster and business results stay flat, the operating model is where to look. For a product leader, that means clarifying who decides and what outcome the team owns before buying tooling.

## Five questions to test whether your teams really work this way
1. **Who owns the outcome?** Name the person or team accountable for the result, beyond the delivery date.
2. **Who can make the decisions?** Check whether decision rights are clear before the team reaches a point of disagreement.
3. **Does the group contain the expertise required?** Identify missing expertise and decide how the team will bring it in.
4. **Can the group directly reach customers, data and technology?** Check whether it can inspect the evidence and systems needed to understand the problem.
5. **Can its composition change as the problem changes?** Confirm that the group can add, release or reshape its membership when the work requires it.
Any no means the old shape with new labels.

## Where the shared record fits
The gaps above are record-keeping problems as much as people problems. Signal, evidence and continuity all depend on whether insights, bets, decisions and outcomes live as linked records that people and agents both read and write. Maskin is an open-source workspace built that way: insights, bets, tasks and outcomes are typed records with links between them. For further reading, see [bet-based planning](/docs/bet-based-product-planning/), [bet vs backlog](/docs/bet-vs-backlog/) and the [closed-loop workspace](/docs/closed-loop-workspace/). The useful test is whether someone can follow a bet from its customer insight through the decision and work to the outcome, without relying on scattered explanations.

## How to move an existing product organization toward it
1. **Diagnose with the five questions.** Use one real team and one current problem. Record where ownership, expertise, access or adaptability is missing.
2. **Pick one cross-cutting problem and run it as a mission team.** Choose a problem that crosses product boundaries, assemble the smallest viable group and set the 8 to 12 week span described above.
3. **Write the decision-ownership matrix for that team.** Agree primary owners and contributors for the decision classes it is likely to face, before the first contentious decision arrives.
4. **Run the three-gap tests and fix the worst gap first.** Find out whether the team is blocked by missing signals, weak comparison of evidence or lost continuity. Start with the gap that most limits its ability to make and carry through a decision.
5. **Give any recurring agent work a stopping condition and a named owner.** Define when the loop stops before it runs, and make clear who is accountable for that recurring work.
Expect stepping-stone changes and temporary centralization during a rollout. Cutler’s point is that organizations move through waves of reworking, so judge a transitional arrangement as one step in that sequence.

## FAQ

### What is a product operating model?
A product operating model is how an organization creates, delivers, and operates products. Marty Cagan’s model replaces project-based delivery with continuous, empowered product teams, usually a product manager, designer, and tech lead. Teams receive problems to solve rather than features to build, and are held to outcomes. The model describes how product work is organized across ownership, discovery and delivery.

### What does an AI-native product operating model look like?
An AI-native product operating model keeps empowered product teams and adds three operating practices. Teams share context so customer signals, evidence, and the reason for a bet survive handoffs. Team shape follows the problem: a stable core of a product manager, designer, and tech lead with specialists, or a 5 to 10 person mission team for 8 to 12 weeks. Teams agree decision ownership in advance and set a stopping condition and named owner for recurring agent work.

### Will AI replace product managers?
Ravi Mehta’s line is that AI exposes the job the role should have been doing all along. For product managers, that means curating which problems and options earn a place in the product, with evidence behind those choices. The role still calls for judgment, customer closeness and conviction. AI changes how context and work move through a team, and those responsibilities stay with the product manager.

### Does the AI-native model replace Marty Cagan's product operating model?
The AI-native product operating model extends Marty Cagan’s model and keeps its empowered teams and team-shape guidance. AI changes how context and work move. Installing visible artifacts alone does not create the conditions behind the model. AI also cannot resolve contested ownership, so teams need decision ownership agreed before decisions arise.

### Product operating model vs agile: what is the difference?
Agile, including Scrum and similar approaches, is a way to run delivery work in short cycles. A product operating model is broader: it defines who owns outcomes, how teams choose problems, how discovery connects to delivery, and how leaders fund and steer teams. Teams can use agile ways of working within a product operating model. Agile alone does not determine who decides what to build.

## Trace one of your bets end to end
Book a meeting and bring one product bet you are running now. We will follow it from the customer evidence to the decision to the outcome, and tell you plainly where the reason gets lost.
