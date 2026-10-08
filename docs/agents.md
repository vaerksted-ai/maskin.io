> Source: https://maskin.io/docs/agents/

# Agents & sessions
Agents are first-class actors in your workspace. When one does work, it runs as a **session** — Claude Code (or the Codex CLI) executing in an isolated sandbox, reading and writing the same objects your team does.

## What an agent is
An agent is an [actor](/docs/concepts/) with a **system prompt** (the role-level counterpart of a repo’s [`AGENTS.md` or `CLAUDE.md`](/docs/claude-md-vs-agents-md/)), a **tools** configuration, optional **memory**, and an **LLM provider**. You can attach reusable **skills** to an agent to give it standard procedures and context. Agents are assigned work, mentioned, and held responsible for objects exactly like human teammates — the same taste gates and audit trail apply, which is the shape of the [governance framework for AI agents](/docs/learn/ai-agent-governance/) as it works in practice.
For a wider read on how the OSS agent ecosystem splits — stateful-agent frameworks (Maskin, Letta, Cheshire Cat), workflow-node builders (n8n, Flowise, Dify), RAG chat frontends, and coding-agent control planes — see the [field survey of self-hosted AI agent repos](/alternatives/self-hosted-ai-agents/). It maps where Maskin sits in the 2026 landscape and which shape fits which object of work.

## Sessions run in sandboxes
In managed hosting, each run executes in an **ephemeral microVM** started from the `agent-base` image (Node 20 with the Claude Code CLI, the default, and the Codex CLI pre-installed, running as a non-root user). The sandbox gets the agent's prompt, the relevant workspace context, and credentials injected as environment, then runs to completion and is torn down.

## Session lifecycle
A session moves through these states:
```
pending → starting → running → completed
                           ├──→ paused        (snapshot saved; can resume)
                           ├──→ failed
                           ├──→ timeout
                           └──→ user_stopped
```
Sessions are non-blocking by default — they're created and run in the background. A blocking helper exists when you want the result inline (see `run_agent` below).

## What starts a session
- **@mention** — mentioning an agent in a comment on an object; the notification also lands in the [notification-driven agent inbox](/docs/agent-inbox/) for review.
- **Thread reply** — replying to an agent's own comment continues the thread in a new session.
- **Cron trigger** — a scheduled [trigger](/docs/concepts/) fires.
- **Event trigger** — a workspace event matches a trigger's filter (e.g. a task enters a status).
- **Explicit MCP call** — `create_session` (non-blocking) or `run_agent` (blocking: spawns, polls to completion, returns the result with logs).

## Memory and file persistence
An agent's **skills**, **memory**, and **learnings** live in S3-compatible storage. They're pulled into the sandbox at the start of a session and pushed back when it completes, so an agent accumulates context across runs instead of starting cold each time. Any files an agent authors are stored the same way and can be attached to objects.

## Observability and cost
While a session runs, its output streams live over Server-Sent Events, and the full log is retained and paginated afterward. Each session records token usage — input, output, and cache-read/write — and a computed `totalCostUsd`, so you can see exactly what each run consumed. For the task-level view above per-call cost — traces, evals, and drift across the fleet — see the [workspace-as-trace approach to agent observability](/docs/agent-observability/).

## Scaling beyond one host
For local development, sessions run as Docker containers on the app host. For higher throughput, set `AGENT_SERVERS` to a pool of remote agent servers (the path managed hosting uses): sessions are then enqueued and dispatched to the least-loaded server over HTTPS, with a warm pool to cut cold-start latency. See the [configuration reference](/docs/configuration/) for the relevant variables.
> Which model an agent uses is resolved per run: an agent-level key, a workspace custom LLM endpoint, a Claude OAuth subscription, a workspace Anthropic key, or a system fallback — in that order.
