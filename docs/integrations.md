> Source: https://maskin.io/docs/integrations/

# Maskin integrations: the full provider registry
Maskin ships with ten first-party integrations. Three of them are auto-injected into every agent session, six are attachable MCP servers the agent must load, and one is provider-only with no MCP surface. This page documents the **product registry** — what Maskin supports out of the box — so it stays accurate whether or not a given workspace has each provider connected.
> ✓
> **Key takeaways**
> **10 first-party integrations, split by MCP exposure:** 3 auto-inject, 6 attachable, 1 provider-only.
> **Auto-inject (3):** GitHub, Slack, PostHog — live in every agent session with no attach step.
> **Attachable (6):** Linear, Gmail, Google Calendar, Google Meet, Ubersuggest, LinkedIn — each carries an `mcp.server` the agent must load.
> **Provider-only (1):** Skjald — Maskin's first-party meeting notetaker; emits `meeting` events onto the graph but exposes no MCP.
> **Four auth types across the registry:** `oauth2`, `oauth2_custom`, `api_key`, `manual`. The registry lists what the product supports; a workspace's connected set can be smaller.

## Auto-inject providers (live in every agent session)

### GitHub
- **Auth:** `oauth2_custom` (GitHub App).
- **MCP:** auto-inject. Every agent session sees the GitHub MCP server without an attach step.
- **What agents can do:** read/write issues and PRs, create branches, push files, search code and PRs, open reviews, list commits. The full surface of the GitHub MCP tool set.
- **Common use:** engineering loops (code review, issue triage), and cross-role loops that reference commits or PRs as `signal` objects.

### Slack
- **Auth:** `oauth2`.
- **MCP:** auto-inject. Every agent session can post to channels, DM users, read history, list channels, add reactions.
- **What agents can do:** send messages, read thread replies, open DM conversations, get channel history, add reactions to messages.
- **Common use:** notifying humans of state changes on objects (the `driver_id` on a status transition triggers a Slack DM), running scheduled digests, capturing threads back onto objects as comments.

### PostHog
- **Auth:** `api_key`.
- **MCP:** auto-inject. Every agent session can query events, insights, feature flags, dashboards, and the full PostHog analytics surface.
- **What agents can do:** execute product analytics queries (SQL and event-based), read insights and dashboards, resolve errors, inspect feature flags and experiments.
- **Common use:** product-analytics loops — an agent surfaces regressions on cohort trends, or drafts a hypothesis from an event-shape change and posts it as an `insight`.

## Attachable providers (agents must load the MCP server)

### Linear
- **Auth:** `oauth2`.
- **MCP:** attachable. Load `linear.mcp` in the agent's tool config.
- **What agents can do:** read/write issues, projects, and teams; comment; transition status; list cycles.
- **Common use:** engineering-team loops that mirror Linear issues into Maskin objects, or agents that write back to Linear from a Maskin bet.

### Gmail
- **Auth:** `oauth2`.
- **MCP:** attachable. Load `gmail.mcp` for read/send/search.
- **What agents can do:** read messages, send messages, search threads, manage drafts and labels.
- **Common use:** support-inbox loops, SDR follow-up sequences (with HITL on send), meeting-scheduling loops paired with Calendar.

### Google Calendar
- **Auth:** `oauth2`.
- **MCP:** attachable. Load `google-calendar.mcp` for read/write on events.
- **What agents can do:** read events, create events, invite attendees, propose times.
- **Common use:** meeting-scheduling loops, capacity-planning agents that read the calendar to guard against double-booking.

### Google Meet
- **Auth:** `oauth2`.
- **MCP:** attachable. Load `google-meet.mcp` for meeting-lifecycle access.
- **What agents can do:** read meeting metadata, join links, participant lists.
- **Common use:** paired with the Skjald notetaker or Calendar to close a meeting-scheduled → meeting-held → notes-captured loop. Registered but not connected in every workspace; workspace-verified examples are not printed for this provider here.

### Ubersuggest
- **Auth:** `oauth2_custom`.
- **MCP:** attachable. Load `ubersuggest.mcp` for SEO keyword, SERP, and backlink data.
- **What agents can do:** run keyword research, pull SERP analyses, read backlinks and competitors, run site audits, look up traffic value.
- **Common use:** SEO loops — an agent scans a keyword cluster weekly, files new `insight` objects on demand surges, drafts briefs.

### LinkedIn
- **Registry name:** LinkedIn (provider id: `linkedin-unipile`).
- **Auth:** `oauth2_custom`.
- **MCP:** attachable. Load the LinkedIn MCP for identity and messaging.
- **What agents can do:** read profiles, read messages, send DMs, follow connection activity.
- **Common use:** AI-SDR loops where an agent shapes an outbound draft on a signal and a human approves before the send.

## Provider-only (no MCP surface)

### Skjald
- **Auth:** manual.
- **MCP:** **no MCP surface.** Skjald does not expose an attachable MCP server. It emits `meeting` created/updated events onto the graph; agents subscribe to those events like they subscribe to any other object state change.
- **What it does:** first-party meeting notetaker — attaches to meetings, produces transcripts and notes as `meeting` objects (not files). Registered but not connected in every workspace.
- **Common use:** meeting → knowledge loops. A meeting object's `status → notes_ready` transition triggers a distiller agent that writes a `knowledge` page from the transcript and validates it under a human gate.

## Auth types at a glance
| Auth type | Providers |
| --- | --- |
| oauth2 | Linear, Slack, Gmail, Google Calendar, Google Meet |
| oauth2_custom | GitHub, Ubersuggest, LinkedIn |
| api_key | PostHog |
| manual | Skjald |

## MCP exposure at a glance
| Exposure | Providers | Count |
| --- | --- | --- |
| Auto-inject (live in every agent session) | GitHub, Slack, PostHog | 3 |
| Attachable (agent must load mcp.server) | Linear, Gmail, Google Calendar, Google Meet, Ubersuggest, LinkedIn | 6 |
| Provider-only (no MCP surface) | Skjald | 1 |

## FAQ

### How many integrations does Maskin support?
Ten first-party integrations, split by how each exposes MCP to agents: three auto-inject providers (GitHub, Slack, PostHog), six attachable MCP servers (Linear, Gmail, Google Calendar, Google Meet, Ubersuggest, LinkedIn), and one provider-only integration (Skjald, Maskin's first-party meeting notetaker). This is the product registry — a given workspace may have fewer providers actually connected.

### What is the difference between an auto-inject and an attachable MCP server in Maskin?
An auto-inject provider (GitHub, Slack, PostHog) is loaded into every agent session automatically — the agent sees those tools without any setup. An attachable provider (Linear, Gmail, Google Calendar, Google Meet, Ubersuggest, LinkedIn) exposes an `mcp.server` that the agent must explicitly load in its tool config before it can call any of that provider's tools. Both surface the same way once loaded; the difference is whether the agent has to opt in.

### Which Maskin integrations expose MCP to agents?
Nine of the ten first-party providers expose MCP: GitHub, Slack, and PostHog are auto-injected into every agent session, while Linear, Gmail, Google Calendar, Google Meet, Ubersuggest, and LinkedIn are attachable MCP servers the agent loads on demand. Skjald is the only registered provider without an MCP surface — it participates in agent workflows by emitting `meeting` created/updated events onto the object graph instead.

### Does Maskin need Zapier or another middleware to connect to these services?
No. Every integration on this page is a first-party Maskin provider — the auth, the MCP server (where present), and the object-graph emissions are all built into Maskin. There is no Zapier, Make, or generic iPaaS layer between the agent and the provider; agents call the provider's MCP tools directly.

### How does Skjald differ from Maskin's other integrations?
Skjald is Maskin's own first-party meeting notetaker, not a third-party service. Instead of exposing an MCP server for agents to call, it produces `meeting` objects (transcripts, notes) on the graph and emits status events (`created`, `updated`, `notes_ready`) that agents can subscribe to. Agents work with Skjald output the same way they work with any other object state change — by reading the object and reacting to its status transitions.

## Ten first-party providers, no middleware
Maskin wires auth, MCP servers, and object-graph emissions directly — agents call provider tools with no Zapier in between. Open source under Apache 2.0. Self-host free, bring your own model.
