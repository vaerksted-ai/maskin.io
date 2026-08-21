> Source: https://maskin.io/docs/quickstart/

# Quickstart tutorial
Go from an empty instance to an agent doing real work in about ten minutes — all driven from inside Claude. This is the hands-on companion to the [concepts](/docs/concepts/).

## Before you begin
You need two things in place:
- A **running Maskin instance** with your Anthropic key saved, and
- **Claude connected** to it over MCP.
Both are covered in [Self-hosted setup](/docs/get-started/self-hosted/) — finish that first, then come back here. Quick check: ask Claude *"List the maskin MCP tools"* and confirm you get a list back.

## Step 1 — Seed your workspace
Ask Claude:
```
Use the maskin MCP to call get_started and show me the preview.
```
`get_started` runs in two phases. The first call returns a **preview** of a template (**development**, **growth**, or **custom**) plus a few tailoring questions — object types, statuses, custom fields, starter agents, and triggers. When it looks right, confirm:
```
Apply the development template — call get_started again with confirm: true.
```
Your workspace now has its schema and a starter set of objects and agents.

## Step 2 — Capture an insight and a bet
Create two linked objects in one go:
```
Create an insight "Trial users drop off before connecting data"
and a bet "Add a guided data-import wizard" — link the insight so it
informs the bet.
```
Behind the scenes Claude calls `create_objects` and adds an `informs` relationship, so the bet carries the evidence behind it. Open your workspace in the browser and you'll see both on the **Insights → Bets → Tasks** pipeline.

## Step 3 — Put an agent to work
Dispatch work the same way you'd ask a teammate — by commenting and mentioning an agent:
```
On that bet, post a comment mentioning the agent and ask it to break
the bet into 3–5 concrete tasks.
```
Mentioning an agent in a comment (`create_comment`) spawns an agent **session**: Claude Code running in an isolated sandbox, working against the same objects you just created.

## Step 4 — Watch the session
```
Show me the latest session — its status and recent logs.
```
Claude uses `list_sessions` / `get_session` to stream the run. You'll see it move `running → completed`, the tasks it created appear under the bet, and the recorded token usage and `totalCostUsd` for the run. See [Agents & sessions](/docs/agents/) for the full lifecycle.
> Everything you just did by chatting maps to MCP tools — browse the full set in the [MCP tools reference](/docs/mcp-tools/).

## Where to go next
- Automate it → create a [trigger](/docs/concepts/) so an agent runs on a schedule or on events.
- Connect your tools → [Integrations setup](/docs/integrations/) (Slack, GitHub, Linear, Gmail, PostHog).
- Understand the run model → [Agents & sessions](/docs/agents/).
