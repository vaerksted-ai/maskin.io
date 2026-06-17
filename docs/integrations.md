> Source: https://maskin.io/docs/integrations/

# Integrations setup
Maskin ships with five first-class integrations — Slack, GitHub, Linear, Gmail, and PostHog. Each connects over OAuth or an API key, receives events via webhooks, and auto-injects its own MCP server so agents can act on it.

## Before you start (self-hosted)
Connecting integrations on a self-hosted instance needs two things set in your environment:
- `INTEGRATION_ENCRYPTION_KEY` — 32-byte hex (64 chars) used to encrypt stored OAuth tokens. `pnpm dev` auto-generates one in development; set it explicitly in production.
- `WEBHOOK_BASE_URL` — the public base URL providers call back to. Webhooks are delivered to `/api/webhooks/<provider>`.
Then connect from the app: **Settings → Integrations → Connect**, which runs the OAuth flow. See the full env list in the [configuration reference](/docs/configuration/).

## Slack
- **What it does:** read and post messages, watch channels/DMs, react, and respond to app mentions — agents can participate in Slack threads.
- **Auth:** OAuth2. Env vars: `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, `SLACK_SIGNING_SECRET`. Optionally `MASKIN_MACHINE_ICON_URL` for the agent avatar in Slack posts.
- **Webhook:** verified via the `x-slack-signature` header (HMAC-SHA256 with timestamp).
- **MCP:** a Slack MCP is auto-injected for every workspace with an active Slack connection.
> Slack also needs an app manifest and icon set up. The repo has a detailed walkthrough at [docs/integrations/slack](https://github.com/sindre-ai/maskin/tree/main/docs/integrations/slack).

## GitHub
- **What it does:** react to pull requests, issues, pushes, and reviews.
- **Auth:** GitHub App flow. Env vars: `GITHUB_APP_ID`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_APP_WEBHOOK_SECRET`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_APP_SLUG`.
- **Webhook:** verified via `x-hub-signature-256`; event type from `x-github-event`.
- **MCP:** the official GitHub MCP server is run via stdio (uses a `GITHUB_TOKEN` from the connection).

## Linear
- **What it does:** work with issues, comments, projects, cycles, and labels.
- **Auth:** OAuth2 (scopes include `read`, `write`, `issues:create`, `comments:create`). Env vars: `LINEAR_CLIENT_ID`, `LINEAR_CLIENT_SECRET`, `LINEAR_WEBHOOK_SECRET`.
- **Webhook:** verified via the `linear-signature` header.
- **MCP:** Linear's hosted MCP (`https://mcp.linear.app/mcp`).

## Gmail
- **What it does:** read, label, draft, and send email.
- **Auth:** OAuth2 with PKCE + offline access (forces a refresh token). Env vars: `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`.
- **Webhook:** Google Cloud Pub/Sub push with OIDC JWT verification. Configure `GMAIL_PUBSUB_TOPIC`, `GMAIL_PUBSUB_AUDIENCE`, and `GMAIL_PUBSUB_SERVICE_ACCOUNT`.
- **MCP:** Google's hosted Gmail MCP.

## PostHog
- **What it does:** pull product analytics into the workspace for feedback loops.
- **Auth:** API key (Bearer token) — no extra env vars beyond the stored token.
- **Webhook:** none; PostHog data is pull-based via MCP.
- **MCP:** PostHog's hosted MCP (`https://mcp.posthog.com/mcp`), auto-injected.
> Integration credentials are encrypted at rest and never written to logs or agent output. Disconnecting revokes tokens with the provider.
