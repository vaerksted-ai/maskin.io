> Source: https://maskin.io/docs/deployment/

# Production deployment
The [self-hosted setup](/docs/get-started/self-hosted/) gets you running locally. This page covers the differences for a real deployment — the production stack, durable data, agent execution, and networking.
> The repo's `docker-compose.prod.yml` is the source of truth. Treat the commands here as orientation and adapt to your platform (a managed Postgres + object store is recommended over in-cluster containers).

## The production stack
The prod compose file builds on the dev services and adds an application container plus the agent base image:
```
docker compose -f docker-compose.prod.yml up -d --build
```
- **app** — runs database migrations on boot, then starts the backend. It serves the built frontend SPA from `STATIC_DIR` (e.g. `/app/apps/web/dist`), so one container answers both the UI and the API on `PORT` (3000).
- **postgres** — PostgreSQL 16 (use a managed instance in production where possible).
- **seaweedfs** — S3-compatible storage (or point `S3_*` at AWS S3 / MinIO).
- **agent-base** — the image used for agent sessions; built from `docker/agent-base/`.
To run agent sessions on the host's Docker, the app container mounts the Docker socket
      (`/var/run/docker.sock`). Restrict access to it.

## Essentials to set
- `NODE_ENV=production`
- `DATABASE_URL` — your Postgres connection. If you front Postgres with a pooler, also set `DATABASE_URL_DIRECT` (a non-pooled connection) so PG LISTEN/NOTIFY — and therefore real-time SSE — keeps working.
- `S3_ENDPOINT` / `S3_BUCKET` / `S3_ACCESS_KEY` / `S3_SECRET_KEY` / `S3_REGION` — durable object storage.
- `INTEGRATION_ENCRYPTION_KEY` — set explicitly (don't rely on the dev auto-generated key, which would invalidate stored tokens on rotation).
- `MASKIN_AUTO_BOOTSTRAP=false` once you've created your real first workspace and key.
Migrations run automatically on app start; you can also run `pnpm db:migrate` out of band.

## Agent execution at scale
By default sessions are local Docker containers on the app host. For throughput, run dedicated
      [agent servers](/docs/agents/) and point the app at them:
- `AGENT_BASE_IMAGE` — a full registry path (e.g. `yourorg/agent-base:latest`), not the local tag.
- `AGENT_SERVERS` — comma-separated `url|secret` entries; sessions are dispatched to the least-loaded server.
- `AGENT_SERVER_SECRET`, `MASKIN_AGENT_SERVER_PUBLIC_HOST`, `AGENT_SERVER_MAX_SESSIONS` — agent-server auth, public host, and concurrency.
- `WARM_POOL_IMAGE` / `WARM_POOL_REFRESH_MINUTES` — optional warm pool to cut cold starts.

## Networking, webhooks & security
- `WEBHOOK_BASE_URL` — your public URL; providers deliver to `/api/webhooks/<provider>`. Required for [integrations](/docs/integrations/).
- `CORS_ORIGIN` — set to your real frontend origin(s).
- `TRUSTED_PROXY_CIDRS` — set to your CDN/load-balancer ranges so `X-Forwarded-For` is honored only from trusted hops.
- `FRONTEND_URL` / `API_BASE_URL` — used for redirects and by MCP agents.
- Terminate TLS at your proxy/load balancer in front of the app.

## Pre-flight checklist
- Durable Postgres + object storage provisioned and backed up.
- `NODE_ENV=production`, encryption key, and S3 creds set.
- `DATABASE_URL_DIRECT` set if using a pooler (keeps SSE alive).
- Public `WEBHOOK_BASE_URL` + TLS; `CORS_ORIGIN` and `TRUSTED_PROXY_CIDRS` locked down.
- Agent image pushed to a registry; `AGENT_SERVERS` configured if scaling out.
- Optional analytics keys (`POSTHOG_*`) and integration OAuth credentials.
Full variable list: [configuration reference](/docs/configuration/).
