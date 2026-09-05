> Source: https://maskin.io/docs/three-tiers-ai-native-work/

# The three tiers of AI-native work — the closure diagnostic

The **three tiers of AI-native work** are coding agents, task trackers with AI summaries, and knowledge spaces — and the useful cut between them is closure. A tool "closes" when its object of work carries a win condition and the loop terminates on a measured outcome. A coding agent closes on a merged PR. A task tracker closes on a status column moving to done. A knowledge space closes on a note being opened. None of those events answers the question a product team actually needs answered: did the work succeed? The tier that does — the tier whose object of work is a bet with a win condition — is where an agentic workspace lives.

That cut sorts the noise. Every one of these tiers has real buyers, real installs, and a legitimate reason to exist inside a product team's stack. The question is not which tier is best; it is which tier answers the diagnostic you actually need answered. This piece runs the closure diagnostic across all three tiers, links out to the wedge piece for each, and hands you the frame you need to pick correctly.

**Key takeaways**

- **AI-native work sorts into three tiers by object of work**: coding tasks (tier 1), tracker tickets (tier 2), and notes (tier 3). Each has an incumbent playbook and its own market.
- **The closure diagnostic**: can the tool tell you whether the work succeeded? A tier that closes on a merge, a status change, or a page view cannot; a tier that closes on a validated outcome can.
- **Every tier has closed useful ground in 2026** — coding agents ship PRs, trackers narrate history with AI, knowledge spaces do capture-and-retrieve well. What none of them closes is the gap between insight and validated outcome.
- **A closed loop is a fourth tier**, not a rebrand of any of the first three. The object of work is a shaped bet with a win condition; the terminal event is an outcome measured against it.
- **Most teams will run more than one tier at once.** A coding agent on the code, a workspace on the decisions the code is meant to serve is a real stack, not a conflict.

## Tier 1 — AI coding agents (close on a merged PR)

The coding-agent tier is the busiest tier in the category right now. Claude Code, Codex, Cursor, OpenClaw, Hermes, Jules, Devin and the eleven-plus open-source control planes that shipped between February and August 2026 — amux, Crewship, Preloop, Nora, Musematic, Mission Control, Clawix, Vornik, Zoink, herdctl, danrex/fleet — all inhabit the same tier. The object of work is a coding task. The terminal event is a merged pull request. Search demand tells you the shape: "AI coding agent" runs 12,100 monthly searches globally at KD 17, "open source AI coding agent" 2,900/mo, "cursor AI coding agent" 1,600/mo. This is a mainstream buyer conversation.

**What the tier closes**: the gap between a well-described coding task and shipped code. That is real work, and it is why the tier is well-funded.

**What the tier does not close**: whether the shipped code moved anything a business would recognise as an outcome. The ticket said "do X"; the agent did X; the PR merged; the loop closed. Whether X was the right X — and whether X moved the number it was meant to move — lives in a data model the coding-agent tier does not carry.

The full argument, including why self-host and MCP support are now table stakes rather than differentiators inside this tier, is in the tier-1 companion: [AI product workspace vs AI coding agent](/docs/ai-product-workspace-vs-coding-agent/).

## Tier 2 — Task trackers with AI summaries (close on a status change)

The tracker tier is the tier every product team already runs. Jira, Linear, Notion, Asana, monday, Coda, Smartsheet — every incumbent has bolted generative-AI summaries and automation onto the same underlying object model: a ticket with a description and a status. Atlassian's Rovo, Notion's Custom Agents and Developer Platform, Linear's agent grounded in roadmap and code — all three pivoted toward agent orchestration in 2026, and the pivot is genuine. But the object of work stays the ticket.

**What the tier closes**: the gap between a written ticket and a status column moving to done. AI summaries make reading the tracker faster, which is worth having.

**What the tier does not close**: the gap between a shipped ticket and a validated outcome. A ticket does not carry a win condition. Nothing in the object model can measure whether the shipped work moved anything, because the object was never designed to. This is the diagnostic the loop-engineering framing keeps colliding with — a prompt is not a job, and work is a loop that has to close on something; a summary describes the loop, and a status change ends it, but neither closes on an outcome.

The full argument is in the tier-2 companion: [AI product management tool: not a task tracker](/docs/ai-product-management-tool/).

## Tier 3 — Knowledge spaces (close on a page view)

The knowledge-space tier is where teams keep what they know. Obsidian, Mem, Confluence, Raft — the object of work is a note or a page in a linked graph. The tier's answer to AI has been to make capture and retrieval smarter: Rovo across the Atlassian graph, AI-native search in Mem, plugin-driven capture in Obsidian, AI-native knowledge base in Raft. That answer is correct for what the tier is.

**What the tier closes**: the gap between a captured note and someone opening it later. AI-native search has closed the "I can't find the note I wrote a year ago" gap that used to define the category.

**What the tier does not close**: the gap between a captured insight and a shipped decision. A note is retrievable and inert. Nothing in the note model shapes it into a bet with a win condition, commits time-boxed work against it, or measures the shipped outcome. The insight sits there, useful only to whoever remembers to open it and act on it, which is a human bottleneck that silently loses signal at the rate humans get busy.

The full argument is in the tier-3 companion: [Agentic workspace vs knowledge space](/docs/agentic-workspace-vs-knowledge-space/).

## The through-line: closure

Read the three tiers side by side and the through-line is not features, price, or open-source posture. It is closure: what event does the tool have to see to call the work done?

- Coding agent: the PR merged.
- Task tracker with AI summaries: the ticket moved to done.
- Knowledge space: someone opened the page.

None of those events is what a product team actually needs to see. What a product team needs to see is whether the work succeeded. That question is a request for a specific data model — one where the object of work carries a win condition, and the terminal event is that condition being measured. A merge is not that. A status change is not that. A page view is not that. The tier where the object of work does carry a win condition is a fourth tier, one where the closed loop of insight → bet → task → validated outcome is the product, not a narrator sitting on top of one of the other three.

One point of vocabulary hygiene worth flagging. In agent-lifecycle research, [jpalioto/agent-lifecycle-framework](https://github.com/jpalioto/agent-lifecycle-framework) uses "false closure" as a model-behaviour failure mode: coherent model output treated as evidence of structural understanding it does not have. That is a different sense of the word, in a different domain. Closure here means the tool can tell you whether the work succeeded — not the model-behaviour failure mode of the same name.

Closure changes what the tool is for. A coding agent is an execution runtime; a tracker with a narrator is a reading surface; a knowledge space is a filing cabinet. A closed loop on a bet is a decision engine — the object of work is the decision, and the terminal event is that the decision was measured. That is a different job, not a bigger version of the other three.

## Where this sits in the Maskin cornerstone

The tier-comparison trilogy is one arm of Maskin's category argument. The other arm is the positive definition: what an AI-native agentic workspace is when you build the object model around a bet and a validated outcome instead of a note, a ticket, or a task. If you have read the tier pieces and want the full shape end to end — the closed loop of insight → bet → task → shipped → validated, the bounded-and-human-gated safety model, the shared typed object graph agents and humans work — the cornerstone walks it: [What is an AI-native agentic workspace?](/docs/what-is-an-agentic-workspace/).

## FAQ

### What is the closure diagnostic?

The closure diagnostic is a one-line test to sort AI-native tools by what job they actually do. Ask the tool: can you tell me whether the work succeeded? A tool that can name a merge, a status change, or a page view is closing on an artifact, not an outcome. A tool that can measure a shipped change against a win condition it carried from the start is closing on an outcome. Both are legitimate; they are not the same job.

### What are the three tiers of AI-native work?

Tier 1 is AI coding agents, whose object of work is a coding task and whose terminal event is a merged pull request. Tier 2 is task trackers with AI summaries, whose object of work is a ticket and whose terminal event is a status column moving to done. Tier 3 is knowledge spaces, whose object of work is a note or page and whose terminal event is that page being opened. Each has real buyers and a legitimate reason to exist; each stops before the loop closes on a validated outcome.

### Why does each tier stop where it does?

Because the object of work in each tier was designed for a different job. Coding agents were built to turn tasks into merged code, so the object of work is a task and the loop closes on a merge. Trackers were built to schedule and narrate work, so the object of work is a ticket and the loop closes on a status. Knowledge spaces were built to capture and retrieve, so the object of work is a note and the loop closes on a view. None of those objects carries a win condition, so none of those loops can measure an outcome. That is not a defect; it is the honest scope of each tier.

### When do the tiers combine into one stack?

Often. A coding agent on the code, a tracker for the queue of coding tasks, a knowledge space for the durable "how we do things here" wiki, and an agentic workspace on the decisions the whole stack is meant to serve is a coherent stack, not a conflicted one. The tiers only collide when a team asks a tier to do a job it was never designed for — running a decision loop out of a tracker, treating a note as a shipped commitment, expecting a coding agent to know whether the PR moved the number.

### Does Maskin replace any of the three tiers?

No, and it usually shouldn't. Maskin is a fourth tier: an agentic workspace where the object of work is a shaped bet with a win condition. It sits above the coding-agent tier, alongside the tracker tier for the queue of tasks under a bet, and downstream of the knowledge space where prior context lives. The common stack is one of each, wired together, with the decision loop running in the workspace that models a decision.

*Maskin is open source under Apache 2.0. Self-hosting is free; hosted Pro is $20/seat/month; Team is $200/workspace/month with unlimited seats.*

Read next

- [AI product workspace vs AI coding agent](/docs/ai-product-workspace-vs-coding-agent/) — Tier 1 companion — the coding-agent tier, from Claude Code and Codex to the eleven open-source control planes.
- [AI product management tool](/docs/ai-product-management-tool/) — Tier 2 companion — the tracker tier, from Jira and Linear to Notion with AI bolted on.
- [Agentic workspace vs knowledge space](/docs/agentic-workspace-vs-knowledge-space/) — Tier 3 companion — the knowledge-space tier, from Obsidian and Mem to Confluence.
- [What is an agentic workspace?](/docs/what-is-an-agentic-workspace/) — The cornerstone: the closed loop on shared typed objects.

Getting started is free

Self-host Maskin today, or take a hosted trial. The three tier-comparison spokes — [tier 1](/docs/ai-product-workspace-vs-coding-agent/), [tier 2](/docs/ai-product-management-tool/), [tier 3](/docs/agentic-workspace-vs-knowledge-space/) — run the diagnostic in detail against each incumbent stack. The [agentic-workspace cornerstone](/docs/what-is-an-agentic-workspace/) and the [bet-based product planning](/docs/bet-based-product-planning/) guide walk the positive shape end to end.
