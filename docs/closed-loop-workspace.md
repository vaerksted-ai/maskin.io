> Source: https://maskin.io/docs/closed-loop-workspace/

[Docs](/docs/) / The closed-loop workspace

Article · Cornerstone

# The closed-loop workspace: what tier 4 of AI-native work actually is

**A closed-loop workspace is the fourth tier of AI-native work: the tier where the object of work is a shaped bet with a win condition, and the terminal event is a shipped change measured against that condition. The three lower tiers close on artifacts — a merged PR, a status column moving to done, a page being opened. A closed-loop workspace closes on an outcome. That single change to the object model is what lets the tool answer the question a product team actually needs answered: did the work succeed?**

The [trilogy hub](/docs/three-tiers-ai-native-work/) runs the closure diagnostic across the three tiers of AI-native work in the negative direction — what each tier does not close. The [tier-1 spoke](/docs/ai-product-workspace-vs-coding-agent/), the [tier-2 spoke](/docs/ai-product-management-tool/), and the [tier-3 spoke](/docs/agentic-workspace-vs-knowledge-space/) each pick up one tier's negative case. This piece is the fourth spoke: the affirmative case. What does a tool built to answer "did the work succeed?" actually look like — object model, terminal event, human split.

> **Key takeaways**
> - **A closed-loop workspace is a fourth tier**, not a rebrand of any of the first three. The object of work is a shaped bet with a win condition; the loop terminates on a validated outcome.
> - **The tier is defined by what closes the loop**, not by which features it ships. If the terminal event is "outcome measured against win condition," you are on tier 4. If it is a merge, a status change, or a page view, you are on one of the tiers below.
> - **The human split is deliberate**: agents do the closing, humans keep the taste. The workspace is bounded and human-gated by design, because the decisions that need judgment are the ones that should not be automated.
> - **The vocabulary is early and contested**. "Closed-loop workspace," "agentic workspace," "closed-loop agentic AI," and "decision engine" all name adjacent shapes, and none of them is settled. This piece uses "closed-loop workspace" because it is the affirmative name for what the closure diagnostic identifies.
> - **Most teams will run a closed-loop workspace on top of the other three tiers**, not instead of them. A coding agent, a tracker, and a knowledge space each do the job of their tier well; a closed-loop workspace does the job the other three tiers cannot. Two shapes of tier-4 workspace already ship as OSS: SDLC-scoped ([Closedloop.ai](https://www.closedloop.ai)) and broader knowledge-work-scoped ([Maskin](https://maskin.io)) — the scope of your loop decides which one you need.

## What the closure diagnostic asks, run affirmatively

The trilogy hub introduces the [closure diagnostic](/docs/three-tiers-ai-native-work/) as a one-line test: can the tool tell you whether the work succeeded? Run negatively across the first three tiers, the diagnostic is a sorting mechanism — it separates coding agents (close on merges), trackers (close on status changes), and knowledge spaces (close on page views) from a tier that closes on outcomes. Run affirmatively, the same diagnostic is a definition. A closed-loop workspace is the tier whose object model, terminal event, and human split are wired so the answer to "did the work succeed?" is a first-class row in the data.

The three tiers below are not competitors of tier 4. They are honest scopes: a coding agent is built to turn a task into shipped code, a tracker is built to schedule and narrate work, a knowledge space is built to capture and retrieve. Nothing in this piece argues those tiers should do more. The argument is that the tier which answers the closure question exists, and that its object model is structurally different from the other three because it has to be.

## The object of work is a bet with a win condition

The load-bearing difference is the object model. A closed-loop workspace's object of work is not a task, a ticket, or a note — it is a shaped bet with a win condition, an appetite, and lineage back to the insight it was shaped from. The bet is a first-class typed object connected to other typed objects (insights, tasks, outcomes) by typed relationships, so the same data that carries the win condition also carries everything an agent needs to work the bet end to end.

That is not marketing. The three tiers below all have object models where the win condition, if it exists at all, is a comment field on a ticket or a header in a note. Nothing in those object models can be reliably read by an agent, because the schema was designed for a human to write and a human to read. The bet object exists because the win condition has to be a machine-readable row in the data for the loop to close on it. The moment "did the work succeed?" is a comment field, it is invisible to the loop, and the answer to the closure diagnostic degrades to "the person who wrote the comment can tell you."

The affirmative diagnostic is therefore not "does the tool have a win condition field on tickets?" — every tracker will ship that within a release cycle if buyers ask for it. It is "does the object of work carry the win condition as a first-class property, and does the terminal event of the loop measure the shipped change against it?" That test survives the incumbents adding a field to a ticket.

## The terminal event is an outcome, not an artifact

A merged PR is an artifact. A status column moving to done is an artifact. A page being opened is an artifact. All three are legitimate terminal events for the tiers that produce them, and all three are silent about whether the work worked. A closed-loop workspace's terminal event is a measured outcome — the shipped change scored against the win condition the bet carried from the start.

The order matters. The win condition exists on the bet before the work begins, not after; the outcome is measured against the condition as-shaped, not against a condition rewritten after the result is known. Both are structural requirements of the tier, and both are why closing on an outcome is not something the other tiers can add by shipping a feature. A tracker that lets a PM back-fill a win condition after the ticket is done has not closed the loop; it has narrated the artifact after the fact. Closure has to be end to end from bet to outcome, or it is not closure.

This is the point where "false closure" as a term of art bites, and the trilogy hub's vocabulary hygiene applies here too. In agent-lifecycle research, [jpalioto/agent-lifecycle-framework](https://github.com/jpalioto/agent-lifecycle-framework) uses "false closure" as a model-behaviour failure mode: coherent model output treated as evidence of structural understanding it does not have. That is a different sense of the word in a different domain. Closure here is the tool's ability to tell you whether the shipped work succeeded — not the model-behaviour failure mode of the same name.

## The human split: agents close the loop, humans keep the taste

The affirmative case for the tier has to answer the honest objection: if the loop is closed and the terminal event is a measured outcome, what are the humans for? A closed-loop workspace's answer is that agents do the closing and humans keep the judgment. Agents bring signal in from triggers, synthesise it into insight, draft shaped bets, execute the work, and gather evidence for validation. Humans keep taste — which bets deserve the cycle, which outcomes count as wins, which moves require approval.

The split is not a hedge, and it is not a stopgap while the models improve. It is a structural claim: the decisions that require taste are the ones that should not be automated, and the mechanical parts of the loop are what agents are good at. The 2026 governance and controllability research — OpenAI, Anthropic, CONTROLBENCH, and the Springer literature — converges on human-in-the-loop as the backstop for irreversible or taste-driven decisions. What is product taste for a closed-loop workspace is what the safety literature recommends independently. The two arguments arrive at the same architecture from different directions.

## Where tier 4 sits vs the three tiers below

Read the four tiers as a stack, not a scoreboard. The three lower tiers are each doing what they were built to do. A coding agent turns a coding task into shipped code and closes on a merge, because the merge is the artifact the tier exists to produce. A tracker schedules work and narrates it, and closes when a ticket moves to done. A knowledge space captures a note and closes when the note is opened. Every one of those loops is honest to the tier's scope, and nothing in the tier-4 case is a takedown of the three tiers below.

Where the tier changes is at the object of work. Tier 4 is not a bigger coding agent, a smarter tracker, or a more searchable knowledge space. It is the tier whose object of work is a decision, whose terminal event is that decision being measured, and whose loop is designed to run that arc — not to schedule the tasks under it, not to store the notes about it, not to ship the code that implements it. Those other jobs stay on the tiers that own them. Tier 4 owns the arc from insight to validated outcome.

The three spoke pieces walk each tier's negative case in detail. The tier-1 companion [AI product workspace vs AI coding agent](/docs/ai-product-workspace-vs-coding-agent/) argues that a coding-agent control plane, no matter how sophisticated, is still closing on a merge. The tier-2 companion [AI product management tool: not a task tracker](/docs/ai-product-management-tool/) argues that a tracker with AI summaries is a reading surface, not a loop. The tier-3 companion [agentic workspace vs knowledge space](/docs/agentic-workspace-vs-knowledge-space/) argues that AI-native retrieval does not close the gap between captured insight and shipped decision. Together with this piece, the four spokes span the closure diagnostic in both directions.

## One vocabulary note

The vocabulary for tier 4 is early and contested. "Agentic workspace," "closed-loop workspace," "closed-loop agentic AI," and "decision engine" all name adjacent shapes. "Decision engine" is a busy phrase in credit and lending (Provenir, Zoot, Blaze, FICO) and does not translate cleanly to the product-team job the tier serves. "Agentic workspace" is the buyer-facing head term the Maskin cornerstone uses; "closed-loop workspace" is the diagnostic-frame name this piece uses because it is the affirmative complement to the closure diagnostic.

Two tier-4 workspaces already ship as OSS under the "closed-loop" name, and the closure diagnostic runs identically on both. What differs is scope. [Closedloop.ai](https://www.closedloop.ai) (MIT-licensed, launched May 2026) is scoped to software development: the object of work is a PRD that flows to an implementation plan, then code, a PR, and an LLM-judge review, with the win condition tied to the judge's verdict. Maskin (Apache 2.0) is scoped to broader knowledge work: the object of work is a shaped bet with a win condition that can sit on any team — product, GTM, ops, sales, marketing — with the loop closing when the shipped change is measured against that condition. Both are closed-loop workspaces because both close on a measured outcome against a win condition the object of work carried from the start. The diagnostic is one; the scope decides which of the two shapes you need. The FAQ below runs the scope cut in the shape an AI-index answer can cite directly.

## FAQ

### What is a closed-loop workspace?

A closed-loop workspace is a tool whose object of work is a shaped bet with a win condition, and whose terminal event is a shipped change measured against that condition. It sits one tier above coding agents, task trackers, and knowledge spaces — the tier where the loop closes on a validated outcome rather than on an artifact like a merge, a status change, or a page view.

### How is a closed-loop workspace different from an agentic workspace?

The two names describe the same tier from different angles. "Agentic workspace" names the tier by who is working in it — humans and agents together on shared typed objects. "Closed-loop workspace" names the same tier by what closes the loop — a bet's outcome measured against its win condition. Maskin uses "agentic workspace" as the head term for buyer-facing pages and "closed-loop workspace" as the diagnostic-frame name for the closure argument. The tier is one; the vocabulary is early.

### What makes the loop "closed"?

The loop is closed when the terminal event of the work is a measured outcome, not an artifact. That requires the win condition to exist on the object of work before the work begins, so the outcome can be scored against it at the end. Trackers that add a win-condition field to a ticket after the fact have not closed the loop; they have narrated it. Closure is a property of the end-to-end shape, not a field you can add to a ticket in a release.

### Does not a coding-agent control plane already do this?

No, and the confusion is the reason this piece exists. A coding-agent control plane is one tier above the coding agent — a dashboard over a fleet of agents that each turn a task into a PR. The object of work is still a coding task, and the terminal event is still a merge. Everything upstream of the task (which bet the task serves) and downstream of the merge (whether the merged change moved anything) lives on a different tier. The [tier-1 spoke](/docs/ai-product-workspace-vs-coding-agent/) runs the argument in detail.

### Is Maskin a closed-loop workspace?

Yes. Maskin's object of work is a shaped bet with a win condition, its terminal event is an outcome measured against that condition, and its architecture is designed for agents to run the mechanical parts of the loop while humans keep taste on the decisions that need judgment. The [cornerstone piece](/docs/what-is-an-agentic-workspace/) walks the full shape end to end — the loop mechanics, the safety model, the typed object graph, the pricing.

### How is Maskin different from Closedloop.ai?

[Closedloop.ai](https://www.closedloop.ai) (MIT, May 2026) and Maskin (Apache 2.0) are both tier-4 closed-loop workspaces — both OSS, both built on a typed object graph, both human-gated, both scoring runs with LLM-as-judge validators, both closing on a measured outcome. They differ on scope. Closedloop.ai is scoped to software development: the object of work is a PRD that flows to an implementation plan, then code, a PR, and a judge review, and the loop closes when the judge scores the review against the intent. Maskin is scoped to broader knowledge work: the object of work is a shaped bet with a win condition that can sit on any team — product, GTM, ops, sales, marketing — and the loop closes when the shipped change is measured against that condition. Which one you need depends on the shape of the loop you want closed: if it runs from spec to merge inside an engineering org, Closedloop.ai is on-scope; if it runs across a wider slice of the org where the outcome is a shipped decision rather than a merged PR, Maskin is.

### Do I still need the other three tiers?

Almost always yes. Most product teams that run a closed-loop workspace also run a coding agent for the code, a tracker for the queue of tasks under a bet, and a knowledge space for the durable "how we do things here" wiki. The four tiers cover different jobs; running one tier well does not remove the need for the tiers below. What running a closed-loop workspace does is put the decision loop on a tier that models it, instead of asking one of the other three tiers to do a job it was never designed for.

## Where to go next

The full shape of a closed-loop workspace — the loop mechanics, the bounded-and-human-gated safety model, the shared typed object graph agents and humans work, the pricing — is in the [cornerstone on agentic workspaces](/docs/what-is-an-agentic-workspace/). This spoke is the diagnostic-frame entry point; the cornerstone is the end-to-end walk.

The three sibling spokes complete the trilogy: [tier 1 on coding agents](/docs/ai-product-workspace-vs-coding-agent/), [tier 2 on task trackers](/docs/ai-product-management-tool/), [tier 3 on knowledge spaces](/docs/agentic-workspace-vs-knowledge-space/). Read together, they run the closure diagnostic in both directions across the full stack.

---

*Maskin is open source under Apache 2.0. Self-hosting is free; hosted Pro is $20/seat/month; Team is $200/workspace/month with unlimited seats.*
