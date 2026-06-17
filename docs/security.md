> Source: https://maskin.io/docs/security/

# Security
How Maskin protects credentials, isolates tenants, and contains agent execution — and how to report a vulnerability. Because you self-host, you own the deployment surface; this page covers both the built-in model and what's yours to harden.

## Authentication
Every request authenticates with a bearer API key (prefixed `ank_`). Keys are stored only as **SHA-256 hashes** — the plaintext is shown once at creation and never again. Auth is **stateless**: no cookies or server sessions. Keys are per-actor and can be rotated with `regenerate_api_key`, which immediately invalidates the old value.

## Authorization & tenant isolation
Workspace-scoped requests carry an `X-Workspace-Id` header, and every query is scoped to that workspace — data does not cross tenant boundaries. Membership is role-based: `owner`, `member`, and `viewer`.

## Credential encryption at rest
Integration OAuth tokens and workspace LLM API keys are encrypted with **AES-256-GCM** using `INTEGRATION_ENCRYPTION_KEY` (a 32-byte hex key). Each value gets a random 12-byte IV and a 16-byte authentication tag, stored as `iv:authTag:ciphertext`. In the UI only the last four characters are ever shown, and secrets are never written to logs or exposed in agent output.
> Set `INTEGRATION_ENCRYPTION_KEY` explicitly in production and keep it stable — rotating it makes previously stored credentials undecryptable, so connections must be re-established.

## Sandboxed agent execution
Agent sessions run as **ephemeral, non-root Docker containers** (from the `agent-base` image), one per run, torn down on completion. To launch them the app uses the host Docker socket (`/var/run/docker.sock`) — treat access to that socket as root-equivalent and restrict it to the app. For stronger isolation, run sessions on dedicated [agent servers](/docs/agents/) rather than the app host.

## Webhook verification
Inbound webhooks are signature-verified per provider before processing:
| Provider | Verification |
| --- | --- |
| Slack | HMAC-SHA256 over the raw body + timestamp (x-slack-signature). |
| GitHub | x-hub-signature-256 HMAC. |
| Linear | linear-signature HMAC. |
| Gmail | Pub/Sub push with OIDC JWT verification. |

## Audit log
Every change is recorded in an append-only event log (see [Architecture](/docs/architecture/)), giving you an immutable trail of who — human or agent — did what, and when.

## Hardening your deployment
- Terminate **TLS** at your proxy/load balancer in front of the app.
- Set `CORS_ORIGIN` to your real frontend origin(s) only.
- Set `TRUSTED_PROXY_CIDRS` to your CDN/LB ranges so `X-Forwarded-For` is honored only from trusted hops.
- Restrict access to the Docker socket and your database/object-store credentials.
- See the [configuration reference](/docs/configuration/) and [production deployment](/docs/deployment/) for the full list.

## Reporting a vulnerability
> **Please do not open a public GitHub issue for security reports.** Email [magnus@meshfirm.com](mailto:magnus@meshfirm.com) with a description and reproduction steps. You can expect acknowledgment within **48 hours**, with critical fixes targeted within **7 days**. Responsible reporters are credited in release notes unless they prefer to stay anonymous. See [SECURITY.md](https://github.com/sindre-ai/maskin/blob/main/SECURITY.md) for the full policy.
