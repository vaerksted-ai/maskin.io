> Source: https://maskin.io/docs/mcp-native-workspace/

# MCP-native workspace: a category, not a checkbox
**An MCP-native workspace is a shared, typed object graph where the entire product surface — every object, every operation, every event — is exposed to agents through the Model Context Protocol, not a chat app or a productivity tool with an MCP integration bolted on the side.** The distinction matters because “supports MCP” is now a checkbox almost every vendor can tick, while “the workspace *is* the MCP surface” is an architectural commitment far fewer products actually make. This page defines the category vendor-neutrally, names the four architectural markers that separate it from an app-with-an-MCP-integration, and clears up two common confusions: MCP-native workspaces are not marketplaces of MCP servers, and they are not the “workspace-as-sandbox” pattern AI21 and the agent-sh project use the same word for.
> ✓
> **Key takeaways**
> An MCP-native workspace exposes its **entire object model** as MCP tools, not a wrapper around a subset.
> The **workspace-graph** — typed objects plus relationships — is the surface humans and agents both operate on.
> **Event-driven triggers** and **sandboxed agent sessions** are load-bearing, not optional.
> The **judgment loop** — the human’s read-approve-reshape cycle on the workspace-graph — is what separates a workspace from an autonomous fleet.
> The category sits **one level above** individual MCP servers listed in marketplaces; a workspace is not a directory.
> “MCP-native workspace” is a **different meaning of “workspace”** than AI21’s isolated-sandbox usage; both are valid.

## What is an MCP-native workspace?
An MCP-native workspace is one where the product’s whole state — every object type, every relationship, every operation that mutates the graph, every event that flows across it — is callable and readable by agents through the Model Context Protocol from the first line of code. The same contract a human uses through the UI, an agent uses through the protocol.
Oxagen’s three-property definition of “MCP-native” applied to a data source — single-command install, typed responses, permission scoping composes[1](#fn1) — lifts cleanly one level up. Applied to a workspace, those properties hold across the entire object graph: any capable agent can reach every typed object, every operation returns typed responses, and the permission model composes with the host’s own authorization.

## The four architectural markers
Not every product that advertises MCP support is MCP-native at the workspace level. Four markers, together, separate the two:
- **The entire object model is exposed as MCP tools.** Not a subset — every object type the product knows about, every operation on it, every relationship type. A workspace with fifty typed objects and three exposed over MCP is MCP-integrated; all fifty exposed is MCP-native. Justin Poehnelt’s argument that *the audience for your application’s API is not just other programmers, it’s AI agents*[2](#fn2) is the individual-app version of this claim; the workspace version applies it at object-graph scale.
- **The workspace-graph is the human-review surface.** The same typed objects agents read and write are what the human opens, inspects, and reshapes. There is not a separate “AI dashboard” grafted on top of the “real” product; the graph *is* the product, and the review UI is the graph. That co-location is what makes the workspace-graph legible to both sides of the collaboration without translation.
- **Triggers are event-driven, not just chat-driven.** Work enters the workspace when the state changes — a new signal arrives, a bet reaches a decision gate, an object hits a threshold — and an agent runs against the change. A chat prompt is one legitimate trigger, but only one. Cron and object-transition triggers are equal citizens.
- **Agent sessions are sandboxed.** Each agent runs in an isolated execution context — typically a container — with its own scoped credentials and its own bounded lifetime, so an agent that misbehaves can only mutate the graph through the same typed operations any actor uses. The sandbox is not a hardening afterthought; it is what makes the judgment loop safe to run in production.
Any one of these on its own is a feature. All four together, wired to the same object model, are the category.

## Category vs marketplace: what an MCP-native workspace is *not*
The 2026 MCP-discovery SERP is dominated by marketplace guides. Seven independent 2026 comparison posts — DesignRevision, OpenHelm, ThinkNEO, Gingerlabs, ClawNewbie, App Store Operator, Apigene — all reproduce the same shape: the official MCP Registry as API-first metadata truth, plus five to seven community marketplaces layering discovery on top (Glama, PulseMCP, Smithery, mcp.so, MarketNow, Apigene, MCP Market).[3](#fn3) Every guide catalogs *individual servers* as the unit of discovery. Not one catalogs a workspace.
An MCP-native workspace is not a directory of MCP servers, and it is not a single MCP server; it is one layer up. A marketplace answers “where do I find an MCP server for X?” A workspace-shaped product answers “where does the work my team already does live now that agents can read and write it too?” Treating a workspace as a marketplace (“more tools = better”) gets the same wrong answer the marketplace guides push back on when they converge on *volume ≠ trust*[3](#fn3) — the point is a coherent, review-able surface, not raw server count.

## The AI21 disambiguation: two meanings of “workspace”
The word “workspace” carries a different technical meaning in one adjacent SERP cluster, and any serious explainer has to name the collision. AI21’s January-2026 essay on scaling state-modifying agents uses “workspace” to mean a **sandboxed isolation context** — a git worktree, a DB transaction, a snapshot — that a state-mutating subagent runs inside so parallel subagents don’t collide, and proposes five workspace primitives (`initialize`, `clone`, `merge`, `compare`, `delete`) to add to the MCP protocol itself.[4](#fn4) The community project `agent-workspace-linux` uses the same meaning: an isolated X11 desktop session an agent controls.[5](#fn5)
Both usages are legitimate; they answer different questions. AI21’s “workspace” is a **scoped execution context** — how to keep two agents from colliding. The “workspace” in “MCP-native workspace” is a **shared collaboration surface** — where many humans and many agents operate on the same state. A product can, and often should, use both: MCP-native workspaces run each agent session inside an isolated sandbox (the fourth architectural marker above) *and* keep the graph itself shared. The two nouns are not interchangeable, and LLM-answer engines will conflate them unless the collision is called out explicitly.

## The workspace-graph as the inbox — a fifth ambient-agent pattern
A workspace-graph doesn’t just hold state; it can serve as the review surface for ambient agents that fire on events. That claim — that the graph is a fifth pattern alongside verb surface, generative canvas, delegated agent, and ambient capture — is argued in [Ambient agent workspace: chat is the wrong UX, and the workspace-graph is the fifth pattern](/docs/ambient-agent-workspace/). For the category, what matters is that an MCP-native workspace can carry the pattern natively: because the graph is already the shared surface, using it as the inbox for background agents is a consequence, not a bolt-on.

## Vendors in the category today
The category is real and has adopters — no page benefits from pretending one vendor is alone in it. Two vendor-neutral examples make the shape concrete:
- **Maskin** ([github.com/sindre-ai/maskin](https://github.com/sindre-ai/maskin), Apache 2.0) — open-source MCP-native workspace for product management. Insights, bets, tasks, and loops as typed objects; the MCP server exposes the full graph and ~39 operations over stdio and HTTP; agents run in isolated Docker sessions; triggers fire on cron or object transitions. The [MCP-native cornerstone](/docs/what-is-mcp-native/) covers the architecture in depth.
- **Remnus** ([github.com/Ranork/remnus-app](https://github.com/Ranork/remnus-app), AGPL-3.0) — open-source Notion-like MCP-native workspace with pages, databases, kanbans, calendars. Nineteen MCP tools plus resources and prompts, OAuth 2.1 + PKCE, listed on the official MCP Registry. Fewer object types (no bet/loop primitives), same shape.
Different object models, same category. Adjacent adopters (Jade Note, MCPlato) are staking neighboring vocabulary — the shape is already recognizable enough to name.

## The judgment loop: what makes a workspace, and not a fleet
A workspace-shaped product is not the same thing as an autonomous multi-agent fleet; the difference is the judgment loop. In a fleet, agents run to a terminal outcome and the human sees the result. In an MCP-native workspace, agents propose changes to the graph, humans read-approve-reshape those changes, and the workspace-graph carries the state of that judgment across many parallel loops.
The judgment loop is the moat, not the stack. MCP-native, self-hostable, Apache-2.0 are table stakes across a growing set of open-source entrants; what a workspace-shaped product owns is the surface on which humans stay on-the-loop rather than in-it.

## MCP workspace vs MCP client — one more terminology tangle
An MCP client (Claude Desktop, Cursor, Windsurf) connects to MCP servers and issues tool calls. An MCP-native workspace is a product that *runs* an MCP server as its primary integration surface — the server exposes the workspace’s own object graph. A client consumes MCP; a workspace produces MCP. Some products are both, but the roles answer different questions: a client asks “what tools can I reach?”; a workspace answers “what is the shape of the graph you can now reach?”

## FAQ

### What is an MCP-native workspace, in one sentence?
A workspace whose entire object model — every object type, every operation, every event — is exposed to agents through the Model Context Protocol from the first line of code, not as an integration bolted on to a product built on a proprietary API.

### What’s the difference between an MCP-native workspace and an MCP-native app?
An MCP-native app ships an MCP server that makes one product surface callable by agents — Poehnelt’s canonical framing.[2](#fn2) An MCP-native workspace makes the *entire object graph* callable, plus the triggers, events, and sessions that operate on it. The workspace is one level of granularity up from the app.

### Is an MCP-native workspace the same as MCP Apps (SEP-1865)?
No. MCP Apps is the `io.modelcontextprotocol/ui` extension for shipping UI from an MCP server. An MCP-native workspace is a category of product; it may or may not use MCP Apps to render UI inside a host, and neither implies the other.

### How is this different from AI21’s “MCP workspaces” or agent-workspace-linux?
Different meaning of “workspace.” AI21 and agent-workspace-linux use the term for a scoped execution sandbox one agent runs inside.[4](#fn4) An MCP-native workspace is a shared typed object graph humans and agents operate on together. Both are legitimate; they answer different questions and often live inside the same product.

### Is an MCP-native workspace just a marketplace of MCP servers?
No. A marketplace catalogs individual servers as the unit of discovery; a workspace-shaped product exposes one coherent object graph as its own MCP surface. A marketplace answers “where do I find an MCP server for X?” A workspace answers “where does my team’s actual work now live?”

### How can I tell if a product is genuinely MCP-native versus “MCP integration bolted on”?
Check the four markers: is the *entire* object model exposed, or a subset? Is the workspace-graph the human-review surface, or is MCP a side-channel? Are triggers event-driven, or chat-only? Do agents run in isolated sessions? A product that fails any of the four is MCP-integrated, not MCP-native.

### Does an MCP-native workspace have to be self-hosted?
No — self-hosting is orthogonal to being MCP-native. What matters is where the MCP surface sits in the architecture, not where the compute runs. Most open-source examples today (Maskin, Remnus) happen to be self-hostable because the audience for the category leans that way.

### What’s the difference between an MCP-native workspace and an MCP client?
An MCP client (Claude Desktop, Cursor, Windsurf) *consumes* MCP — it connects to servers and issues tool calls. An MCP-native workspace *produces* MCP — it runs one or more MCP servers that expose its own object graph. A product can be both; the roles are distinct.

## Sources
1. **Oxagen**, *MCP-Native Ontology: Connecting AI Agents to Structured Data* (2026-04-19). [oxagen.ai/blog/mcp-native-ontology-connecting-agents-to-structured-data](https://www.oxagen.ai/blog/mcp-native-ontology-connecting-agents-to-structured-data). Three-property definition of MCP-native (single-command install, typed responses, permission-scoping composes). [↩](#fnref1)
2. **Justin Poehnelt**, *Your App Should Ship an MCP Server* (2026-05-01). [justin.poehnelt.com/posts/ship-mcp-server-native-app](https://justin.poehnelt.com/posts/ship-mcp-server-native-app/). Source for the “the audience for your application’s API is not just other programmers, it’s AI agents” framing. [↩](#fnref2)
3. **2026 MCP marketplace consensus.** Seven independent 2026 comparison guides catalog individual MCP servers as the unit of discovery and converge on *volume ≠ trust*: DesignRevision, OpenHelm, ThinkNEO, Gingerlabs, ClawNewbie, App Store Operator, and Apigene. Composite citation drawn from a workspace research sweep in August 2026. [↩](#fnref3)
4. **Eran Gat / AI21**, *Scaling State-Modifying AI Agents with MCP Workspaces* (2026-01-07). [ai21.com/blog/stateful-agent-workspaces-mcp](https://www.ai21.com/blog/stateful-agent-workspaces-mcp/). AI21’s “workspace = isolated execution context” meaning and the five proposed MCP workspace primitives. [↩](#fnref4)
5. **agent-sh**, `agent-workspace-linux` GitHub repo. [github.com/agent-sh/agent-workspace-linux](https://github.com/agent-sh/agent-workspace-linux). Community-side use of “workspace” as an isolated X11 sandbox for agents. [↩](#fnref5)
Read next

## Self-host the MCP-native workspace
The full object graph, the whole MCP surface, in your own boundary. Apache 2.0, MCP-native, EU/US data residency.
