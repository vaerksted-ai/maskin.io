> Source: https://maskin.io/docs/agent-inbox/

# What is an Agent Inbox? (LangChain's ambient-agent UX pattern, and when a workspace-graph beats it)
**An Agent Inbox is the UX pattern Harrison Chase named at LangChain for ambient AI agents: a queue where a background agent posts interrupts to a human — `notify`, `question`, `review` — instead of running a chat conversation.** The pattern replaces the chat window as the primary surface for agents that fire on events rather than prompts and take longer than a spinner’s worth of time to finish.[1](#fn1) This page defines the term the way Chase defined it, walks the three interrupt types with concrete examples, points to the open-source reference implementation on GitHub, and contrasts inbox-as-queue with the **workspace-graph-as-inbox** shape it starts to buckle into once you’re supervising many parallel loops.
> ✓
> **Key takeaways**
> **Definitional citation:** Harrison Chase, LangChain, January 2025 — *Introducing Ambient Agents*. The Agent Inbox is the UX half of the ambient-agent pattern.[1](#fn1)
> **Three interrupt types:** `notify` (something happened, no response needed), `question` (I need input to continue), `review` (I drafted this, approve or edit).[1](#fn1)
> **Design shift:** human-**on**-the-loop, not human-**in**-the-loop — the human sets the autonomy dial and answers interrupts on their own schedule instead of sitting in front of a chat.
> **Reference implementation:** open-source at [github.com/langchain-ai/agent-inbox](https://github.com/langchain-ai/agent-inbox), designed to plug into LangGraph runtimes.
> **The queue holds up** for one-agent, atomic-decision flows (Superhuman-style email triage is the canonical case[2](#fn2)) and starts to buckle when many parallel loops need to carry state between agents and humans.
> **The fifth pattern** — workspace-graph-as-inbox — treats the human’s review surface as a typed object graph rather than a flat queue. Same intent, different substrate; see the [ambient agent workspace explainer](/docs/ambient-agent-workspace/) for the full spine.

## What is an Agent Inbox? (Chase’s definition, plainly)
Chase gave the Agent Inbox its working definition in his January 2025 LangChain post *Introducing Ambient Agents* and expanded it on the Sequoia *Training Data* podcast that followed.[1](#fn1) The claim is small and precise: if an agent runs continuously against a stream of events, it needs a place to reach the human that is *not* a chat window. That place is an inbox.
The inbox does three things at once. It is a **queue** of interrupts the agent has raised, a **decision surface** where the human resolves each with minimal context-switching, and a **contract** that says, in effect: “I run on my own; I interrupt you only in these named ways; you don’t have to be watching for me to keep working.”
In a chat, the human is the trigger — you type, the model waits. In an ambient system, an *event* is the trigger — a new email, a metric moving, a scheduled scan — and the human enters only when the agent decides taste is required. Chase names the shift precisely: **human-on-the-loop**, not human-in-the-loop.[1](#fn1) In-the-loop makes the human a required step on every action; on-the-loop lets the agent act autonomously within a defined envelope and pull the human in only at named checkpoints. The Agent Inbox is the UI that makes on-the-loop legible. The companion piece on [human in the loop AI](/docs/learn/human-in-the-loop-ai/) walks the HITL/HOTL failure modes and the override-rate test in detail.

## The three interrupt types: notify, question, review
Chase’s inbox exposes three interrupt types the agent can raise. Every reasonable ambient-agent product ends up implementing at least two of them, and the vocabulary is stable enough now that treating it as your own local nomenclature is a mistake — use Chase’s names.

### Notify
`notify` is an interrupt with no expected response. The agent completed a task, ran into a soft edge, or observed something the human should know about — and the human doesn’t need to reply for the loop to continue. In an email agent, a `notify` might read: *“I archived 12 newsletters matching your usual pattern; here’s the list.”* In a monitoring agent: *“P95 latency crossed 800ms at 14:03 and recovered at 14:07 without intervention.”* The point of `notify` is not to demand attention — it is to make agent activity **auditable without forcing a decision**. Without a `notify` channel, ambient agents drift into what Tianpan calls “invisible failures”: the agent is doing things, but the human has no surface to see it doing them.[3](#fn3)

### Question
`question` is the interrupt that blocks. The agent needs input it can’t infer from the current state — a preference, a fact, a piece of context — and the loop is paused until the human answers. *“Reply to this vendor with your usual 30-day terms, or the new 45-day terms you agreed with two vendors last week?”* A well-shaped `question` interrupt has three properties: it is answerable in one interaction, it names the specific decision, and it carries enough context that the human can decide without opening five other tabs. When teams complain that their ambient agent feels “chatty,” the usual cause is `question` interrupts that should have been `review` interrupts — they are asking for permission when they should be showing draft work.

### Review
`review` is the highest-value interrupt in the pattern. The agent drafted an artefact — an email reply, a JIRA ticket, a code change, a customer response — and is asking the human to approve, edit, or reject it. The human sees the drafted output alongside the reasoning, and the resolution is one of *accept*, *edit-and-accept*, or *reject-with-note*. This is the interrupt that makes ambient agents genuinely useful in high-stakes flows: the agent does the work, the human owns the judgment, and both are legible in the audit trail. Superhuman’s AI features are the reference example shipped in production on the Agent Inbox pattern; LangChain publishes the collaboration as a Breakout Agents case study.[2](#fn2)

## Where the Agent Inbox lives: LangGraph, the open-source UI, GitHub
The Agent Inbox is not just a design pattern — it ships as running code. LangChain maintains a reference UI at [github.com/langchain-ai/agent-inbox](https://github.com/langchain-ai/agent-inbox) that consumes interrupts raised by [LangGraph](https://langchain-ai.github.io/langgraph/) runtimes. The wiring is small: the graph raises typed interrupts, the UI subscribes, and the human’s resolution posts back to the graph as the next node’s input.
The pattern is portable in spirit — a queue of typed interrupts works against any runtime — but the *reference implementation* is LangGraph-shaped. Teams outside the LangChain stack usually either re-implement the inbox against their own runtime, or adopt LangGraph for the ambient half of their product to get the inbox UI for free. Cloudflare’s [agentic-inbox](https://github.com/cloudflare/agentic-inbox) is a different flavor of the same shape applied to email specifically: an inbox of interrupts wired to a background email agent, self-hosted on Cloudflare Workers.
The Agent Inbox is an open, inspectable reference UX. If you are evaluating ambient-agent products, this is the code to read to see what the interaction actually feels like, and the `notify` / `question` / `review` vocabulary is what to expect the market to standardize on.

## When the inbox pattern holds up — and when it starts to buckle
The inbox is an excellent shape when three conditions hold: the interrupts are **atomic** (one decision, resolvable in one interaction), the loops are **shallow** (one agent, one artefact, one review), and the volume is **triageable** (a human can walk the queue on their own cadence). Email triage is the canonical case, and Superhuman’s shipped implementation lives inside exactly those bounds.[2](#fn2)
The inbox starts to buckle when the work is shaped differently, and it is worth naming the three conditions because most teams hit at least one within a quarter of shipping:
- **Deep hand-offs.** A loop that spans multiple agents (research → draft → fact-check → publish) raises interrupts at each hop. In a flat inbox they arrive as unrelated rows; the human loses the thread of which review is downstream of which question they answered yesterday.
- **Many parallel loops.** At a dozen agents raising two-to-five interrupts a day, the queue itself becomes the bottleneck. Triage is now the work — and a flat queue can’t weight interrupts by which loop, bet, or downstream commitment they belong to.
- **Multiple humans on the taste gates.** A shared inbox needs concepts the flat model doesn’t carry: assignment, hand-off, “I have context on this,” “this is blocked on legal.” Slack spent 15 years learning those; a fresh interrupt queue rediscovers them the hard way.
None of this is an argument that the Agent Inbox is wrong. A queue is the right shape *for the interrupts a single agent raises about atomic decisions*; a different shape is right for *state that many agents and humans share across loops*. The two aren’t in conflict — the second includes the first.

## The fifth pattern: workspace-graph-as-inbox
The shape most 2026 taxonomies don’t yet name is **a shared typed object graph where the human’s “inbox” is the state model itself.** The Agent Inbox is a queue of discrete decisions — one interrupt per row, resolve and move on. A workspace graph is different: it is state, and state carries context across many parallel loops. It is what shows up as the fifth pattern in the [ambient agent workspace explainer](/docs/ambient-agent-workspace/) alongside Nilesh Barla’s four (verb surface, generative canvas, delegated agent, ambient capture) and Chase’s inbox.
The distinction matters because a serious ambient-agent system doesn’t run one loop, it runs dozens. In the workspace-graph pattern:
- The **object** is the unit of review — an insight, a bet, a task, a loop — not a message or an approval row.
- **Typed relationships** carry context between objects (`informs`, `breaks_into`, `blocks`, `supersedes`), so an agent reading a task can see the bet it belongs to and the insight that motivated it without extra prompting.
- **Close conditions live on the object**, so a loop terminates when the outcome is verified rather than when the human remembers to close it.
- **Agents mutate the graph, humans reshape it.** The audit trail is the graph’s own history, not a separate log.
A workspace-graph pattern still has interrupts — Chase’s three types are as useful here as in the queue — but the interrupts are attached to typed objects that already carry the loop context. You aren’t triaging unrelated rows; you’re walking a graph where each interrupt is anchored to the bet, insight, or task it belongs to. The inbox becomes a view on the graph rather than the graph’s replacement. This is the pattern [Maskin](/) is built on, and it is why the [agentic workspace cornerstone](/docs/what-is-an-agentic-workspace/) opens with “the object of work is the workspace, not the chat.”

## Which shape should you build?
Ship the Agent Inbox if your work is *one agent, one artefact, atomic interrupts, one human on the taste gate* — the Superhuman shape. The LangChain reference implementation will save you months of UI work.
Ship a workspace-graph if any of three signals are true: loops **hand off between multiple agents** and the human needs to see the thread; **multiple humans** share the same review state; or you run **enough parallel loops that triage is now the primary work**. In that case the queue is a data-structure mismatch, and shoehorning a graph-shaped problem into an inbox produces the “which-review-is-this-again” thrash teams describe six months after shipping.
Both shapes share the same primitives: event-driven triggers, `notify`/`question`/`review` interrupts, an explicit autonomy dial, audit logs as first-class UI. The choice is about **what the human’s review surface is a view onto** — a flat queue or a typed graph.

## FAQ

### What is an Agent Inbox in one sentence?
An Agent Inbox is a queue where an ambient AI agent posts three types of interrupts — `notify`, `question`, and `review` — to a human, replacing the chat window as the primary interaction surface for agents that run on events rather than user prompts.[1](#fn1)

### Is Agent Inbox open source?
Yes. LangChain maintains an open-source reference implementation at [github.com/langchain-ai/agent-inbox](https://github.com/langchain-ai/agent-inbox), designed to consume typed interrupts raised by LangGraph runtimes. Cloudflare ships a related email-flavored variant at [github.com/cloudflare/agentic-inbox](https://github.com/cloudflare/agentic-inbox).

### How does the Agent Inbox work with LangGraph?
A LangGraph node raises a typed interrupt (`notify`, `question`, or `review`). The Agent Inbox UI subscribes to those interrupts, renders them as rows, and posts the human’s resolution back into the graph as the next node’s input — letting the human sit *on* the loop rather than *in* it.[1](#fn1)

### What’s the difference between an Agent Inbox and a workspace-graph?
An Agent Inbox is a flat queue of interrupts a single agent raises. A workspace-graph is a shared typed object graph (insights, bets, tasks, loops) where interrupts are attached to the objects they belong to. The queue fits atomic, one-agent decisions; the graph fits state that spans many loops, agents, and humans. See the [ambient agent workspace explainer](/docs/ambient-agent-workspace/) for the full contrast.

### Do I still need chat if I have an Agent Inbox?
Often yes — for quick synchronous questions, verb-surface commands, and solo-operator flows at n=1. The Agent Inbox replaces chat as the *default* for background work; it doesn’t remove chat as an option for sync cases. A serious product usually has both.

### Is Chase’s `notify` / `question` / `review` vocabulary stable?
Stable enough that renaming is a mistake. Every 2026 piece on ambient-agent UX cites Chase’s LangChain post as the definitional source, and downstream implementations — including Superhuman’s shipped features[2](#fn2) and the reference UI on GitHub — use the same three names.

## Own the interrupts, not the chat
If your agents run on events and your team supervises more than one loop at a time, the shape of the UX is an inbox, a workspace-graph, or both — not a chat window. [Maskin](/) is the open-source, [MCP-native](/docs/mcp-native-workspace/), self-hostable workspace-graph. If Claude Cowork is the vendor-hosted answer, Maskin is the open-source alternative where the object model, the model, and the loop all live inside your own boundary. Self-host free forever under Apache 2.0, or start a hosted trial with EU/US data residency.

## Sources
1. **Harrison Chase / LangChain**, *Introducing Ambient Agents* (Jan 2025). [langchain.com/blog/introducing-ambient-agents](https://www.langchain.com/blog/introducing-ambient-agents). Plus the Sequoia *Training Data* podcast appearance on *Ambient Agents and the Agent Inbox*, [sequoiacap.com/podcast/training-data-harrison-chase-2](https://sequoiacap.com/podcast/training-data-harrison-chase-2). Definitional citations for the Agent Inbox, the three interrupt types (`notify`, `question`, `review`), and the human-on-the-loop vs human-in-the-loop shift. [↩](#fnref1)
2. **LangChain**, *Superhuman* (Breakout Agents case study). [langchain.com/breakoutagents/superhuman](https://www.langchain.com/breakoutagents/superhuman). Concrete shipped-in-production example of an ambient-agent pattern running against email — the canonical atomic-decision, single-agent case teams point to when defending the flat-queue shape. [↩](#fnref2)
3. **Tianpan**, *Async Agents Need an Inbox, Not a Chat* (2026-04-23) and *Ambient AI Design: When the Chat Interface Is the Wrong Abstraction* (2026-04-15). [tianpan.co/blog/2026-04-23-async-agents-inbox-not-chat](https://tianpan.co/blog/2026-04-23-async-agents-inbox-not-chat) and [tianpan.co/blog/2026-04-15-ambient-ai-design-chat-interface](https://tianpan.co/blog/2026-04-15-ambient-ai-design-chat-interface). Names the four failure modes of ambient agents, including “invisible failures,” which motivates the `notify` interrupt channel. [↩](#fnref3)
Read next

## Self-host the ambient loop
Own the object graph, own the model, own the loop. Apache 2.0, MCP-native, EU/US data residency.
