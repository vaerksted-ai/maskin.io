> Source: https://maskin.io/docs/troubleshooting/

# Troubleshooting & FAQ
The issues people hit most when self-hosting Maskin, and how to fix them. Most come down to one missing environment variable — see the [configuration reference](/docs/configuration/) for the full list.

## The UI or session logs don't update live
Real-time updates use PostgreSQL `LISTEN/NOTIFY` streamed over SSE. Connection poolers (PgBouncer, Supabase's pooled port, etc.) break LISTEN/NOTIFY. Set `DATABASE_URL_DIRECT` to a **non-pooled** connection in addition to `DATABASE_URL`. Also make sure your proxy isn't buffering `/api/events` responses.

## Agent sessions fail to start
- **Docker socket:** the app launches sessions via `/var/run/docker.sock` — confirm it's mounted into the app container and the process can access it.
- **Image missing:** the `agent-base` image must be built/pulled. In production, set `AGENT_BASE_IMAGE` to a full registry path (e.g. `yourorg/agent-base:latest`), not the local `:latest` tag.
- **Scaling out:** if you use `AGENT_SERVERS`, check each server is reachable and its `AGENT_SERVER_SECRET` matches.

## MCP calls return 401, or Claude sees no tools
- Check both headers: `Authorization: Bearer ank_…` and `X-Workspace-Id: <uuid>`.
- Confirm the URL ends in `/mcp` and points at your instance.
- In Claude Code, run `/reload-plugins` after adding the server. See [Self-hosted setup](/docs/get-started/self-hosted/).

## Integrations won't connect, or stop working
- `INTEGRATION_ENCRYPTION_KEY` must be set. If it was **changed**, previously stored tokens can no longer be decrypted — reconnect the affected integrations.
- OAuth redirects need a correct public `WEBHOOK_BASE_URL` / `FRONTEND_URL` and the provider's redirect URI registered. See [Integrations setup](/docs/integrations/).

## Webhooks aren't being received
Set a public `WEBHOOK_BASE_URL` reachable from the internet; providers deliver to `/api/webhooks/<provider>`. A 401/403 on delivery usually means a signing-secret mismatch — re-check the provider's secret (e.g. `SLACK_SIGNING_SECRET`, `GITHUB_APP_WEBHOOK_SECRET`, `LINEAR_WEBHOOK_SECRET`).

## I can't find my API key / can't sign in on a fresh instance
On an empty database Maskin auto-bootstraps a dev actor, workspace, and API key (controlled by `MASKIN_AUTO_BOOTSTRAP`, default `true`) and prints the key in the **startup banner**. Once you've created your real first workspace and key, set `MASKIN_AUTO_BOOTSTRAP=false`.

## Database / migration errors on boot
Migrations run automatically when the app starts. To run them out of band use `pnpm db:migrate`. Make sure `DATABASE_URL` points at a reachable PostgreSQL 16 instance and the role can create tables.

## Browser console shows CORS errors
Set `CORS_ORIGIN` to your frontend origin(s), comma-separated. The dev default is `http://localhost:5173`.

## Agents error with "no model configured"
A workspace needs a model. Add an Anthropic key or Claude subscription, or a custom LLM — Maskin resolves the model through a fixed priority order. See [LLM & models](/docs/llm/).

## FAQ
**Is Maskin open source?** Yes — Apache 2.0, on [GitHub](https://github.com/sindre-ai/maskin).
**Can I use models other than Claude?** Yes. Point a workspace at any OpenAI-compatible endpoint (OpenRouter, Ollama, vLLM) via a custom LLM — see [LLM & models](/docs/llm/).
**Where do I see what a run cost?** Each session records token usage and `totalCostUsd` — see [Agents & sessions](/docs/agents/).
**Do I have to self-host?** No — managed hosting is available. [Book a meeting](http://meshfirm.com/bookmagnus).
**Still stuck?** Open an issue on [GitHub](https://github.com/sindre-ai/maskin). For security reports, email the contact on the [Security](/docs/security/) page instead.
