> Source: https://maskin.io/docs/security/

# Security
How Maskin protects credentials, separates workspaces in the API, and contains agent execution — and how to report a vulnerability. Because you self-host, you own the deployment surface; this page covers both the built-in model and what's yours to harden.

## Authentication
Every request authenticates with a bearer API key (prefixed `ank_`). Keys are **stored as issued**, not hashed; hashing is planned. Auth is **stateless**: no cookies or server sessions. Keys are per-actor and can be rotated with `regenerate_api_key`, which immediately invalidates the old value.

## Authorization & tenant isolation
Workspace-scoped requests carry an `X-Workspace-Id` header. Workspace isolation is enforced in the API, route by route, not by database-level row security, so it depends on each route checking the workspace. Memberships carry a role (`owner`, `admin`, `member`, `viewer`). Owner and admin roles gate member management, invites, billing and workspace settings. The `viewer` role is defined but not yet enforced as read-only (planned).

## Credential encryption at rest
Integration credentials, including OAuth tokens, are encrypted with **AES-256-GCM** using `INTEGRATION_ENCRYPTION_KEY` (a 32-byte hex key). Each value gets a random 12-byte IV and a 16-byte authentication tag, stored as `iv:authTag:ciphertext`.
> Set `INTEGRATION_ENCRYPTION_KEY` explicitly in production and keep it stable — rotating it makes previously stored credentials undecryptable, so connections must be re-established.

## Sandboxed agent execution
Each agent session runs in its own **ephemeral microVM** (libkrun, managed through microsandbox) on a dedicated [agent server](/docs/agents/), started from the `agent-base` image, one per run and stopped and removed when the session completes. The app hands sessions to the agent server over HTTPS and does not launch them through a Docker socket.
Docker is for local development only. There is no fallback that runs agents without the microVM runtime, so a self-host needs an agent server running microsandbox and libkrun. Locally, treat access to the host Docker socket (`/var/run/docker.sock`) as root-equivalent and restrict it to the app. For the policy layer above the sandbox — who signs off on agent actions, and how those approvals get recorded — see the [governance framework for AI agents](/docs/learn/ai-agent-governance/).

## Webhook verification
Inbound webhooks are signature-verified per provider before processing:
| Provider | Verification |
| --- | --- |
| Slack | HMAC-SHA256 over the raw body + timestamp (x-slack-signature). |
| GitHub | x-hub-signature-256 HMAC. |
| Linear | linear-signature HMAC. |
| Gmail | Pub/Sub push with OIDC JWT verification. |

## Audit log
Every change is recorded in an event log that is insert-only by convention (see [Architecture](/docs/architecture/)), giving you a trail of who — human or agent — did what, and when.

## Hardening your deployment
- Terminate **TLS** at your proxy/load balancer in front of the app.
- Set `CORS_ORIGIN` to your real frontend origin(s) only.
- Set `TRUSTED_PROXY_CIDRS` to your CDN/LB ranges so `X-Forwarded-For` is honored only from trusted hops.
- Restrict access to the Docker socket and your database/object-store credentials.
- See the [configuration reference](/docs/configuration/) and [production deployment](/docs/deployment/) for the full list.

## Reporting a vulnerability
> **Please do not open a public GitHub issue for security reports.** Email [ai@maskin.io](mailto:ai@maskin.io) with a description and reproduction steps. You can expect acknowledgment within **48 hours**, with critical fixes targeted within **7 days**. Responsible reporters are credited in release notes unless they prefer to stay anonymous. See [SECURITY.md](https://github.com/sindre-ai/maskin/blob/main/SECURITY.md) for the full policy.
