> Source: https://maskin.io/docs/api/

# API reference
Maskin is API-first: the UI and agents share one HTTP surface, built with Hono and documented with OpenAPI. The [MCP tools](/docs/mcp-tools/) are a thin layer over these same endpoints.

## Base URL & OpenAPI
All routes are served under `/api` (e.g. `http://localhost:3000/api` in dev). The full, authoritative spec is generated from the code and served live:
```
GET /openapi.json
```
Point any OpenAPI viewer or client generator at that URL for the exact request/response schemas on your instance.

## Authentication
Every request carries an API key; workspace-scoped routes also carry a workspace ID:
```
Authorization: Bearer <YOUR_API_KEY>     # ank_…
X-Workspace-Id: <YOUR_WORKSPACE_ID>       # workspace UUID
```
Keys are stored as SHA-256 hashes; auth is stateless (no cookies/sessions). A small allowlist needs no auth: `/api/health`, `/openapi.json`, signup, OAuth callbacks, and webhook ingest.

## Resource groups
| Mount | Purpose |
| --- | --- |
| /api/objects | CRUD + search for insights, bets, tasks. |
| /api/graph | Atomic batch create (objects + relationships). |
| /api/relationships | Typed edges between objects. |
| /api/actors | Humans & agents; signup; API-key rotation. |
| /api/workspaces | Workspaces, members, and settings. |
| /api/sessions | Agent session lifecycle + logs. |
| /api/triggers | Cron & event automations. |
| /api/integrations | OAuth connect/disconnect + provider discovery. |
| /api/webhooks/{provider} | Inbound webhook ingest (no auth; signature-verified). |
| /api/events | Activity log + real-time SSE stream. |
| /api/notifications · /api/subscriptions | Human alerts and unread tracking. |
| /api/files · /api/imports | File upload/download; CSV imports. |
| /api/claude-oauth | Claude subscription token management. |
| /api/m/{extension-id} | Routes contributed by extension modules. |
| /mcp | MCP over HTTP (see MCP tools). |

## Representative endpoints

### Objects
```
POST   /api/objects          # create (single or bulk)
GET    /api/objects          # list (filter: type, status, driver)
GET    /api/objects/search   # full-text search
GET    /api/objects/:id      # fetch with relationships + connected objects
PATCH  /api/objects/:id      # update title/content/status/metadata
DELETE /api/objects/:id      # delete
```

### Sessions
```
POST   /api/sessions               # create & optionally auto-start
GET    /api/sessions               # list (filter: status, actor_id)
GET    /api/sessions/:id           # details
POST   /api/sessions/:id/stop      # force stop
POST   /api/sessions/:id/pause     # snapshot & pause
POST   /api/sessions/:id/resume    # resume from snapshot
GET    /api/sessions/:id/logs      # paginated logs
GET    /api/sessions/:id/logs/stream  # SSE (live)
GET    /api/sessions/usage         # bucketed cost & token usage
```

### Integrations
```
GET    /api/integrations                  # active integrations
GET    /api/integrations/providers        # available providers + schema
POST   /api/integrations/:provider/connect   # start OAuth/API-key flow
GET    /api/integrations/:provider/callback  # OAuth redirect (no auth)
DELETE /api/integrations/:id              # disconnect + revoke
```
> Endpoints evolve — treat `/openapi.json` on your instance as the source of truth, and the lists above as orientation.

## Real-time (SSE)
The activity stream and live session logs are delivered as Server-Sent Events, backed by Postgres NOTIFY. Clients can resume after a disconnect by sending the `Last-Event-ID` header — event IDs are monotonic.
