> Source: https://maskin.io/docs/what-is-mcp-native/

# What is MCP-native? Why Maskin is built on the Model Context Protocol
**An MCP-native workspace is one built around the Model Context Protocol (MCP) from the first line of code** — the protocol is the substrate on which agents connect to models, tools, and memory, not an integration bolted on afterward.
For Maskin, that means the MCP server (`packages/mcp`, speaking stdio and HTTP over the `@modelcontextprotocol/sdk`) is the connective tissue of the whole product: it is how agents reach the tools your team already uses, how the workspace stays model-agnostic, and how bring-your-own-model becomes a real feature instead of a marketing line. This page explains what MCP is, what “MCP-native” means architecturally for Maskin, and why that design matters for determinism, safety, and scale.
> **Key takeaways**
> **MCP is the open wire protocol for AI tool calling** — the standard way a model learns what tools and data it can use, instead of a bespoke pipe per integration.
> **MCP-native means the protocol is the foundation of the stack**, not an add-on: Maskin’s MCP server connects agents to models and tools at the base layer.
> **It makes bring-your-own-model real** — Claude, Codex, a local model, or a custom model, all on the same objects.
> **The architecture is composable infrastructure** — typed objects, event-driven triggers, bounded human-gated loops — not a full-company simulation.
> **It’s the anti-lock-in move** — an open protocol stays independent of any single vendor’s API or model.

## What is MCP (the Model Context Protocol)?
MCP is an open protocol that standardizes how an AI model discovers and calls tools, and how tools feed context back. Before MCP, every AI integration was a bespoke pipe: a custom connector per tool, per vendor, per model. With MCP, an agent can be handed a list of typed tools and data sources and reason over them on a single contract. The model asks “what can I use?” and the protocol answers with a machine-readable description of the available tools — then the agent calls them the same way, regardless of which model or which tool is on the other end.
The practical effect is that integration work collapses. Instead of N tools &times; M models connectors, you build one MCP server and any MCP-capable client can use it. That is why being “MCP-native” is not a cosmetic claim: when the protocol is the substrate rather than a wrapper, the whole stack inherits its portability, which is exactly what makes bring-your-own-model possible in the first place.

## What does “MCP-native” mean architecturally for Maskin?
For an agent workspace, MCP-native is a property of the whole stack, not a single module. In Maskin’s case the architecture (verified against the [`github.com/sindre-ai/maskin`](https://github.com/sindre-ai/maskin) repo, last true 2026-08-21) is built around it in four concrete ways:
- **Agents connect to tools over MCP.** The MCP server (`packages/mcp`) speaks stdio and HTTP, and it is how agents reach the tools a product team already has in play — Slack, Linear, GitHub, Intercom, PostHog, HubSpot, Gmail, and Google Calendar among the connected actors and events. Your stack stays wired in; Maskin doesn’t ask you to move your work into a silo for the agents to see it.
- **The object model is typed and machine-readable.** Insights, bets, and tasks are all `objects` in one schema, connected by typed relationships and served to the UI and to agents through the same API — “everything is an API.” Agents don’t parse free-form notes; they read, create, and transition first-class typed objects. See [core concepts](/docs/concepts/) for the object model.
- **Triggers are event-driven.** A `trigger-runner` fires agents on cron schedules or on data changes. Work enters when a signal changes, not only when a human happens to ask.
- **Agents run in sandboxed sessions.** The runtime spawns ephemeral Docker containers running the Claude Code CLI (the default) or the Codex CLI, plus a browser-sidecar image for web tasks. Isolation is a design decision, not a hardening afterthought — see [agents & sessions](/docs/agents/).
That last point is worth stressing: MCP is the protocol, and the session model is where the safety lives. The protocol decides *what an agent can reach*; the container session decides *how much it can touch while working*. Both are first-class parts of an MCP-native design.

## Why does an open protocol make bring-your-own-model real?
Because the workspace is model-agnostic at the protocol layer, the model is decoupled from the platform. You decide which model runs your agents — Claude for reasoning-heavy shaping, Codex or a local model for constrained tasks, your own fine-tuned model for domain work — all inside the same workspace, all operating on the same typed objects. See [how model providers and keys work](/docs/llm/).
This is the clearest way to see what an open protocol buys. A closed, vendor-hosted workspace couples the product to a particular model family because the integration is bespoke. MCP-native inverts that: the contract is public, so swapping the model under an agent is a configuration change, not a re-platforming project. For teams that run a preferred model stack or need a [self-hosted model for compliance reasons](/docs/self-hosted-ai-workspace/), this is the difference between a workspace and a ceiling.

## What is composable infrastructure, and why is Maskin built in that camp?
In early 2026 the agent-workspace market split into two visible camps. One is **full-company simulation** — products that orchestrate an org chart of AI employees, each with a title and a budget, such as the open-source Paperclip (roughly 38K GitHub stars at the time) — which demos beautifully but has been hard to make reliable in production. The other is **composable infrastructure** — typed objects, event-driven triggers, and small agents that fire when data changes and are safe to run in production. Maskin is built in the latter camp.
At Maskin we treat work as a loop, not a one-shot prompt. A prompt produces text; a loop produces a shipped, validated outcome. Under the composable model, each agent does a narrow, well-defined job on typed objects; the loop is bounded by a close condition and human promote gates. Read more in [what is an agentic workspace](/docs/what-is-an-agentic-workspace/) and [bet-based product planning](/docs/bet-based-product-planning/).
The market context reinforces the timing. Tracxn counts roughly 60 companies in native-AI product management with about $500M raised over a decade and a single unicorn — early and fast-forming. Incumbents are staking the same ground: Atlassian opened its Teamwork Graph as an agent layer via Rovo, reporting use by 90%+ of its enterprise cloud customers and a 7&times; rise in agentic automations over six months (Atlassian Team ’26, May 2026). Notion shipped Custom Agents and a Developer Platform in early 2026, and Linear released its agent grounded in roadmap, code, and issues (TechCrunch, May 13 2026; Linear changelog, Mar 2026). The debate is no longer whether agents belong in the workspace; it is which architecture makes them trustworthy — and composable infrastructure is the answer that survives contact with production.

## How does the MCP server connect agents to your stack?
The MCP server is the single integration surface, which is what turns “MCP-native” from a noun into a practical advantage. Instead of maintaining one custom connector per tool, Maskin exposes the tools your team already uses through the protocol, so agents can act on real data rather than on screenshots of it — see [integrations](/docs/integrations/) for the current list:
- **Slack and Gmail** — signals arrive as insights; conversations stay where they are.
- **Linear and GitHub** — work and code context feed bets and tasks without leaving the tools engineers already live in.
- **Intercom and HubSpot** — customer conversations and contact context flow into product decisions.
- **PostHog** — product analytics surface as signals that can trigger a loop when a metric moves.
The result is that an agent doesn’t need special permission slips for each tool, because it only ever acts through the one typed contract. And because triggers are event-driven on top of that same backbone, a change in any connected source — a spike in PostHog, a support thread in Intercom, a pushed branch in GitHub — can enter the loop without anyone asking.

## How does composable infrastructure deliver determinism, safety, and scale?
Composability isn’t a philosophy; it maps to three concrete production properties that matter to any team running agents on real work:
- **Determinism.** An event fires an agent; the agent acts; the outcome is a state change you can inspect in the object model and the event-sourced audit trail. Every transition is recorded, so behavior is explainable and auditable rather than opaque.
- **Safety.** Agents execute in isolated Docker sessions that can’t reach your private keys or production state outside the workspace’s authority, and human promote gates bound the closed loop. The protocol defines what they can reach; the sandbox defines how far they can go. See [security](/docs/security/).
- **Scale.** A small team can run many agents because each one owns a narrow, well-defined role on typed objects. Load is delegated to many bounded loops rather than a few monolithic agents, sidestepping the wall where a handful of agents each carry too many responsibilities to be trusted.

## Getting started
Self-host the open-source repo (Apache 2.0), connect your model provider, and pick a marketplace loop — customer feedback, market signals, churn, lost deals, or competitive intelligence. Because the integration layer is a public protocol, adding your own tools means writing an MCP server once rather than building bespoke connectors for every model. The core loop, the typed object model, and the sandboxed agent runtime all work the same way whether you run it self-hosted for free or on a managed plan (Pro from $20/seat/month; Team $200/workspace/month with unlimited seats; Enterprise on your own LLM and infrastructure). The [self-hosted setup guide](/docs/get-started/self-hosted/) walks through it end to end.

## FAQ

### Do I need to be an MCP expert to use Maskin?
No. MCP is how the workspace connects under the hood, not something you have to operate day to day. Your administrator connects the tools the team already uses and picks a model, and agents work through the unified typed backend from there. The MCP layer is what makes that integration clean — it is the opposite of a product that demands protocol knowledge from every user. If you do want to add a custom tool later, that’s where a working knowledge of MCP pays off, because one server exposes the tool to every model.

### Which models work with Maskin?
Claude, Codex, or any model reachable over the protocol — including a local model or your own sandboxed, custom, or fine-tuned models. Because the workspace is model-agnostic at the protocol layer, the model is a configuration choice rather than a fixed part of the product. That is the practical payoff of building on an open protocol instead of a vendor-specific integration: you can change models, mix them by task, or run a self-hosted model for compliance reasons without re-platforming.

### Is MCP tied to one vendor?
No. MCP is an open protocol, not a proprietary API. That independence is precisely what makes bring-your-own-model possible — if the protocol were owned by a vendor, model choice would collapse into that vendor’s terms. Building the workspace around an open, portable contract is the difference between a product that offers model choice as a convenience and one that structurally depends on it.

### What is the difference between MCP-native and just using MCP?
A product can use MCP and still treat it as a bolt-on — one integration among several, with the core built on proprietary plumbing. An MCP-native product is constructed around the protocol from the start: agents, tools, triggers, and the typed object backend all assume MCP as the integration surface. For Maskin that is a load-bearing architectural decision, not a feature flag, and it is what keeps self-hosting, model choice, and tool portability coherent in one system.

### Is the composable-infrastructure approach safe to run in production?
More so, by design, than a full-company simulation. Composability maps directly to inspectability: every action is a typed object transition in an event-sourced audit trail, agents run in isolated container sessions, and human promote gates bound the loop. That does not mean there is no risk — LLM cost and latency at volume, and the operational complexity of container session orchestration, are real open concerns named in the architecture notes. But the failure surface is small, narrow, and auditable, which is the property teams need before putting agents on real work.
Read next

## Self-host, bring your own model
The workspace is model-agnostic at the protocol layer. Self-host free, or take a hosted trial and pick the model that fits your team.
