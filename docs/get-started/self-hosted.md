> Source: https://maskin.io/docs/get-started/self-hosted/

# Self-hosted setup
Run your own Maskin instance and connect Claude — Code or Desktop — to it over MCP, so you can drive a workspace from inside Claude.
> This guide is for the **self-hosted** version of Maskin — connecting Claude to a Maskin instance you run yourself. Want us to host it instead? [Book a meeting](http://meshfirm.com/bookmagnus).

## Prerequisites
- **Claude Code** or **Claude Desktop** installed.
- An **Anthropic API key** — Maskin runs Claude Code in sandboxes and uses this key.
- A **running Maskin instance** (set one up below).

## Run your Maskin server
Maskin self-hosts from a single docker-compose file. Clone the repo and start the stack:
```
git clone https://github.com/sindre-ai/maskin.git && cd maskin
docker-compose up
```
This brings up the full stack — PostgreSQL, SeaweedFS, and the Maskin server — serving at `http://localhost:3000`. On first run it bootstraps a dev actor, a workspace, and an API key (printed in the startup banner). For a real deployment, put it behind your own domain (referred to below as `https://<your-maskin-host>`) and review the [configuration reference](/docs/configuration/).

## Step 1 — Sign in and create a workspace
1. Open your instance at `http://localhost:3000` (or `https://<your-maskin-host>`) and sign in.
2. Create your first workspace when prompted.
Once you're in, you'll see the unified pipeline view: **Insights → Bets → Tasks**.

## Step 2 — Paste your Anthropic API key
1. Open **Settings → Integrations** (or **Settings → LLM keys**).
2. Paste your Anthropic API key and **Save**.
Only the last four characters are shown after saving.

## Step 3 — Get your Maskin API key and workspace ID
1. Open **Settings → API keys**, click **Create key**, and copy the `ank_…` value.
2. Open **Settings → Workspace** and copy the **Workspace ID** (a UUID).

## Step 4 — Connect Claude to your Maskin MCP

### Claude Code
Register the MCP server, pointing the URL at your instance:
```
claude mcp add maskin \
  --transport http \
  --url https://<your-maskin-host>/mcp \
  --header "Authorization: Bearer <YOUR_MASKIN_API_KEY>" \
  --header "X-Workspace-Id: <YOUR_WORKSPACE_ID>"
```
Then reload plugins:
```
/reload-plugins
```

### Claude Desktop
Open **Settings → Developer → Edit config** and add the `maskin` server:
```
{
  "mcpServers": {
    "maskin": {
      "type": "http",
      "url": "https://<your-maskin-host>/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_MASKIN_API_KEY>",
        "X-Workspace-Id": "<YOUR_WORKSPACE_ID>"
      }
    }
  }
}
```
Save and restart Claude Desktop.

## Step 5 — Make your first MCP call
Ask Claude:
```
Use the maskin MCP to call get_started.
```
The `get_started` tool previews and applies a workspace template — **development**, **growth**, or **custom** — seeding your workspace with object types, statuses, custom fields, and an initial set of objects. See the full tool set in the [MCP tools reference](/docs/mcp-tools/).

## What's next
- Invite teammates from **Settings → Members**.
- Wire up integrations (Slack, GitHub, Linear, Gmail, PostHog) — see [Integrations setup](/docs/integrations/).
- Tune your deployment with the [configuration reference](/docs/configuration/).
- Learn how agents run → [Agents & sessions](/docs/agents/).
Questions or issues? Open an issue on [GitHub](https://github.com/sindre-ai/maskin), or read the README for the data model and agent-session details.
