> Source: https://maskin.io/docs/concepts/

# Core concepts
A quick tour of the Maskin model so the rest of the docs — and the MCP tools — make sense. Everything below maps directly to objects you'll see in the workspace and in the API.

## Actors: humans and agents
Everyone in Maskin is an **actor** — and both people and AI agents are actors. They share the same shape: each has an identity, an API key, and a place in one or more workspaces. Agents add a **system prompt**, a **tools** configuration, optional **memory**, and an **LLM provider**. Because humans and agents are the same primitive, an agent can be assigned work, mentioned in a comment, or made the "driver" of an object exactly like a teammate.

## Workspaces and members
A **workspace** is an isolated tenant — your team's data lives inside it, and every object, file, and session is scoped to one. Membership is role-based: `owner`, `member`, or `viewer`. A workspace also carries its own **settings**: display names, the valid statuses per object type, custom field definitions, relationship types, and which extension modules are enabled. That's what makes a "development" workspace look different from a "growth" one (see [Self-hosted setup](/docs/get-started/self-hosted/) for templates).

## Objects and the pipeline
Work is represented as **objects**. There's one object model with a `type` discriminator — the three built-in types form the pipeline:
- **Insights** — what you're learning: signals, research, customer notes.
- **Bets** — what you've decided to pursue, and why.
- **Tasks** — the work that delivers a bet.
Every object has a title, content, a status, freeform metadata, and a **driver** (the actor responsible). Extensions can add more types (e.g. `company`, `contact`, `deal`).

## Relationships
Objects connect through typed **relationships**, forming a graph rather than flat lists. The built-in types are `informs`, `breaks_into`, `blocks`, `relates_to`, and `duplicates` — so an insight can *inform* a bet, a bet can *break into* tasks, and a task can *block* another.

## Comments and @mentions
Comments are the primary collaboration surface on every object — status updates, questions, findings. They're also how work gets dispatched: **@mentioning an agent** (or replying in an agent's thread) spawns an agent **session** to act on that object. Comments can carry file attachments and structured decision chips.

## Triggers
**Triggers** automate agent work. A trigger is either **cron**-based (run on a schedule) or **event**-based (fire when something happens in the workspace, e.g. a task enters a status), and it spawns a session for a target agent with an action prompt.

## Sessions
When an agent does work, it runs in a **session** — Claude Code executing in an ephemeral sandbox. Sessions have a lifecycle, stream logs, and track token usage and cost. They're covered in depth in [Agents & sessions](/docs/agents/).

## Notifications
When an agent needs a human — approval, a decision, an input — it raises a **notification**. Notifications carry structured UI (actions, options, urgency) and link back to the object or session that produced them, so humans stay in the loop without watching every run.

## Skills, files, and extensions
- **Skills** — reusable prompts, snippets, or context files stored in the workspace and attachable to agents.
- **Files** — markdown, code, PDFs, and images stored in S3-compatible storage and attached to objects or produced by agents.
- **Extensions / modules** — pluggable add-ons (CRM, knowledge, notetaker, work) that introduce new object types and behaviour.

## Activity and real-time
Every change is recorded in an append-only **event log**, which doubles as the audit trail and the source for unread tracking. The UI and agents stay live through a Postgres NOTIFY → Server-Sent-Events stream — no extra message broker required.
