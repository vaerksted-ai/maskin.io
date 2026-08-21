> Source: https://maskin.io/docs/architecture/

# Architecture overview
A map of how Maskin fits together — useful if you're evaluating it, operating it, or contributing. The throughline: humans and agents share one data model, one API, and one real-time stream.

## Monorepo & stack
Maskin is a pnpm + Turborepo monorepo:
- `apps/` — the application (backend API + the React web client).
- `packages/` — shared libraries, including `db` (schema + migrations), `mcp` (the tool layer), and `shared` (types, templates, utilities).
- `docker/` — images, including `agent-base` used for agent sessions.
The stack is TypeScript end to end: **Hono** for the HTTP API, **React + Vite** for the web client, **PostgreSQL 16** with **Drizzle ORM**, **S3-compatible** object storage (SeaweedFS in dev), **Docker** for agent sandboxes, and the **Claude Code** CLI inside them.

## Data flow
```
Humans (web)  Agents (Claude Code)   External (Slack/GitHub/…)
      │              │                         │
   REST /api      MCP /mcp                webhooks /api/webhooks
      └──────────────┴───────────┬─────────────┘
                                 ▼
                      Services  →  PostgreSQL ──┐
                                 │   (Drizzle)  │ LISTEN/NOTIFY
                                 ▼              ▼
                         S3 storage        SSE /api/events → live UI + logs
```

## Unified object model
Insights, bets, tasks (and extension types) live in **one objects table** with a `type` discriminator; a separate **relationships** table connects them into a graph. This is why an agent and a human can operate on exactly the same records. See [Core concepts](/docs/concepts/).

## Event-sourced activity
Every change appends to an immutable **events** table. That log is both the audit trail and the basis for unread tracking — state is derived, not overwritten.

## Real-time without a broker
Writes emit PostgreSQL `NOTIFY`; the API `LISTEN`s and fans changes out to clients as **Server-Sent Events**, so the UI and live session logs update with no extra message queue. Behind a connection pooler, set `DATABASE_URL_DIRECT` to a non-pooled connection so LISTEN/NOTIFY keeps working (see [Troubleshooting](/docs/troubleshooting/)).

## Actors & auth
Humans and agents are unified as **actors**. Requests authenticate with a bearer API key (stored as a SHA-256 hash) and carry `X-Workspace-Id`; every query is scoped to that workspace. Details on the [Security](/docs/security/) page.

## Agent execution
Each agent run is a **session** in an ephemeral, non-root Docker container built from `agent-base`. By default these run on the app host's Docker; set `AGENT_SERVERS` to distribute them across dedicated agent servers with a warm pool. See [Agents & sessions](/docs/agents/).

## MCP layer & extensions
The `mcp` package exposes the workspace as MCP tools over `/mcp` — a thin layer over the same services the REST API uses, so both surfaces stay in lock-step ([MCP tools](/docs/mcp-tools/) / [API reference](/docs/api/)). **Integrations** add provider adapters, webhook handlers, and auto-injected MCPs; **extensions/modules** register new object types and routes under `/api/m/{extension-id}`.

## Working in the repo
Common commands: `pnpm dev` (Docker + migrations + servers), `pnpm build`, `pnpm test`, `pnpm test:e2e`, and `pnpm lint` / `pnpm lint:fix`. The project is Apache-2.0 licensed — [browse the source](https://github.com/sindre-ai/maskin).
