> Source: https://maskin.io/docs/integrations/

# Maskin integrations: the full provider registry
Maskin's registry holds twelve first-party integrations. Tools for four of them (GitHub, Slack, PostHog and Resend) are available to every agent once the integration is connected. Other integrations are added per agent. One, Skjald, is provider-only with no agent tools. One, Google Search Console, is a search-data sync that is coming and has no agent tools. This page documents the **product registry**: what Maskin supports out of the box, so it stays accurate whether or not a given workspace has each provider connected.
> ✓
> **Key takeaways**
> **12 first-party integrations, split by how agents get them:** 4 available to every agent once connected, 6 added per agent, 1 provider-only, 1 search-data sync (coming).
> **Available to every agent once connected (4):** GitHub, Slack, PostHog, Resend.
> **Added per agent (6):** Linear, Gmail, Google Calendar, Google Meet, Ubersuggest, LinkedIn. Each carries an `mcp.server` the agent must load.
> **Provider-only (1):** Skjald, Maskin's first-party meeting notetaker. It emits `meeting` events onto the graph but exposes no MCP.
> **Search-data sync, coming (1):** Google Search Console. It is a data sync, not an agent tool.
> **Four auth types across the registry:** `oauth2`, `oauth2_custom`, `api_key`, `manual`. The registry lists what the product supports; a workspace's connected set can be smaller.

## Available to every agent once connected

### GitHub
- **Auth:** `oauth2_custom` (GitHub App).
- **MCP:** the GitHub tool set is available to every agent once GitHub is connected.
- **What agents can do:** read/write issues and PRs, create branches, push files, search code and PRs, open reviews, list commits. The full surface of the GitHub MCP tool set.
- **Common use:** engineering loops (code review, issue triage), and cross-role loops that reference commits or PRs as `signal` objects.

### Slack
- **Auth:** `oauth2`.
- **MCP:** the Slack tool set is available to every agent once Slack is connected. Agents can post to channels, DM users, read history, list channels, add reactions.
- **What agents can do:** send messages, read thread replies, open DM conversations, get channel history, add reactions to messages.
- **Common use:** notifying humans of state changes on objects (the `driver_id` on a status transition triggers a Slack DM), running scheduled digests, capturing threads back onto objects as comments.

### PostHog
- **Auth:** `api_key`.
- **MCP:** the PostHog tool set is available to every agent once PostHog is connected. Agents can query events, insights, feature flags, dashboards, and the full PostHog analytics surface.
- **What agents can do:** execute product analytics queries (SQL and event-based), read insights and dashboards, resolve errors, inspect feature flags and experiments.
- **Common use:** product-analytics loops. An agent surfaces regressions on cohort trends, or drafts a hypothesis from an event-shape change and posts it as an `insight`.

### Resend
- **Auth:** `manual`. You bring your own Resend account and paste your own API key.
- **MCP:** tools for Resend are available to every agent once Resend is connected.
- **Events:** emits a `resend.email` event when an email is received, so loops can react to inbound mail the way they react to any other object change.
- **Common use:** loops that react to inbound mail or send email from your own Resend account. We suggest a human approves anything that goes out under your name.

## Added per agent (the agent must load the MCP server)

### Linear
- **Auth:** `oauth2`.
- **MCP:** added per agent. Load `linear.mcp` in the agent's tool config.
- **What agents can do:** read/write issues, projects, and teams; comment; transition status; list cycles.
- **Common use:** engineering-team loops that mirror Linear issues into Maskin objects, or agents that write back to Linear from a Maskin bet.

### Gmail
- **Auth:** `oauth2`.
- **MCP:** added per agent. Load `gmail.mcp` for read/send/search.
- **What agents can do:** read messages, send messages, search threads, manage drafts and labels.
- **Common use:** support-inbox loops, SDR follow-up sequences (with a human approving each send), meeting-scheduling loops paired with Calendar.

### Google Calendar
- **Auth:** `oauth2`.
- **MCP:** added per agent. Load `google-calendar.mcp` for read/write on events.
- **What agents can do:** read events, create events, invite attendees, propose times.
- **Common use:** meeting-scheduling loops, capacity-planning agents that read the calendar to guard against double-booking.

### Google Meet
- **Auth:** `oauth2`.
- **MCP:** added per agent. Load `google-meet.mcp` for meeting-lifecycle access.
- **What agents can do:** read meeting metadata, join links, participant lists.
- **Common use:** paired with the Skjald notetaker or Calendar to close a meeting-scheduled → meeting-held → notes-captured loop. Registered but not connected in every workspace; workspace-verified examples are not printed for this provider here.

### Ubersuggest
- **Auth:** `oauth2_custom`.
- **MCP:** added per agent. Load `ubersuggest.mcp` for SEO keyword, SERP, and backlink data.
- **What agents can do:** run keyword research, pull SERP analyses, read backlinks and competitors, run site audits, look up traffic value.
- **Common use:** SEO loops. An agent scans a keyword cluster weekly, files new `insight` objects on demand surges, drafts briefs.

### LinkedIn
- **Registry name:** LinkedIn (provider id: `linkedin-unipile`).
- **Auth:** `oauth2_custom`.
- **MCP:** added per agent. Load the LinkedIn MCP for identity and messaging.
- **What agents can do:** read profiles, read messages, send DMs, follow connection activity.
- **Common use:** AI-SDR loops where an agent shapes an outbound draft on a signal and a human approves before the send. Content loops are a second use: [a LinkedIn content loop that plans and drafts a fortnight of posts](/marketplace/linkedin-content/) for the account owner to approve. On some accounts the loop posts for you; on others the owner pastes the approved text into LinkedIn.

## Provider-only (no MCP surface)

### Skjald
- **Auth:** manual.
- **MCP:** **no MCP surface.** Skjald does not expose an attachable MCP server. It emits `meeting` created/updated events onto the graph; agents subscribe to those events like they subscribe to any other object state change.
- **What it does:** first-party meeting notetaker. It attaches to meetings and produces transcripts and notes as `meeting` objects (not files). Registered but not connected in every workspace.
- **Common use:** meeting → knowledge loops. A meeting object's `status → notes_ready` transition triggers a distiller agent that writes a `knowledge` page from the transcript and validates it under a human gate.

## Search-data sync (coming, no agent tools)

### Google Search Console
- **Auth:** `oauth2` (Google sign-in).
- **Status:** coming. It is a registry entry that is not yet announced as available.
- **MCP:** none. The provider does not hand agents Search Console tools, and it emits no events.
- **What to expect:** Search Console is a data sync, not an agent tool. If a loop needs to query Search Console live inside an agent session, this provider does not do that.

## Auth types at a glance
| Auth type | Providers |
| --- | --- |
| oauth2 | Linear, Slack, Gmail, Google Calendar, Google Meet, Google Search Console |
| oauth2_custom | GitHub, Ubersuggest, LinkedIn |
| api_key | PostHog |
| manual | Skjald, Resend |

## How agents get each provider at a glance
| How agents get it | Providers | Count |
| --- | --- | --- |
| Available to every agent once connected | GitHub, Slack, PostHog, Resend | 4 |
| Added per agent (agent must load mcp.server) | Linear, Gmail, Google Calendar, Google Meet, Ubersuggest, LinkedIn | 6 |
| Provider-only (no MCP surface) | Skjald | 1 |
| Search-data sync, coming (no agent tools) | Google Search Console | 1 |
Once a provider is connected, agents work through the same verbs on every object type. The [verbs agents call once a provider is connected](/docs/mcp-tools/) are listed in the MCP tools reference.

## FAQ

### How many integrations does Maskin support?
Twelve first-party integrations in the registry, split by how agents get them: four whose tools are available to every agent once connected (GitHub, Slack, PostHog, Resend), six added per agent (Linear, Gmail, Google Calendar, Google Meet, Ubersuggest, LinkedIn), one provider-only integration (Skjald, Maskin's first-party meeting notetaker) and one search-data sync that is coming (Google Search Console). This is the product registry. A given workspace may have fewer providers actually connected.

### What is the difference between an always-available and a per-agent MCP server in Maskin?
For GitHub, Slack, PostHog and Resend, the tools are available to every agent once the integration is connected. For Linear, Gmail, Google Calendar, Google Meet, Ubersuggest and LinkedIn, the provider exposes an `mcp.server` that the agent must explicitly load in its tool config before it can call any of that provider's tools. Both surface the same way once loaded; the difference is whether the agent has to opt in.

### Which Maskin integrations expose MCP to agents?
Ten of the twelve first-party providers expose MCP: GitHub, Slack, PostHog, and Resend are available to every agent once connected, while Linear, Gmail, Google Calendar, Google Meet, Ubersuggest, and LinkedIn are added per agent. Skjald has no MCP surface. It participates in agent workflows by emitting `meeting` created/updated events onto the object graph. Google Search Console gives agents no tools.

### Does Maskin need Zapier or another middleware to connect to these services?
No. Every integration on this page is a first-party Maskin provider. The auth, the MCP server (where present), and the object-graph emissions are all built into Maskin. There is no Zapier, Make, or generic iPaaS layer between the agent and the provider; agents call the provider's MCP tools directly.

### How does Skjald differ from Maskin's other integrations?
Skjald is Maskin's own first-party meeting notetaker, not a third-party service. Instead of exposing an MCP server for agents to call, it produces `meeting` objects (transcripts, notes) on the graph and emits status events (`created`, `updated`, `notes_ready`) that agents can subscribe to. Agents work with Skjald output the same way they work with any other object state change: by reading the object and reacting to its status transitions.

### Can agents read Google Search Console data through Maskin?
Not through agent tools. Google Search Console is coming as a search-data sync, and the provider exposes no MCP tools and emits no events, so an agent session has nothing to call on it directly.

### How does Resend work in Maskin?
You bring your own Resend account and API key. Tools for Resend are available to every agent once Resend is connected, and when an email arrives, Maskin emits an email-received event that can trigger an automation.

## Twelve first-party providers, no middleware
Maskin wires auth, MCP servers, and object-graph emissions directly — agents call provider tools with no Zapier in between. Open source under Apache 2.0. Self-host free, bring your own model.
