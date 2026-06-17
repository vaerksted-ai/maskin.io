> Source: https://maskin.io/docs/llm/

# LLM & models
Maskin defaults to Claude but lets you bring your own model. For every agent run it resolves a model through a fixed priority order, so you can set a default and override it where you need to.

## Routing priority
When a session starts, Maskin picks the first option that's configured, in this order:
1. **Agent-level key** — an Anthropic key set directly on the agent actor.
2. **Workspace custom LLM** — a bring-your-own endpoint configured on the workspace (OpenRouter, Ollama, vLLM, or any OpenAI-compatible API).
3. **Claude OAuth** — a workspace-level Claude Pro / Max / Teams subscription.
4. **Workspace Anthropic key** — an Anthropic API key saved in workspace settings.
5. **System fallback** — the operator-configured OpenRouter fallback (with a daily token cap).

## Using Claude (the default)
Two ways to give a workspace Claude access, both set **in the app** (Settings → Integrations / LLM keys) and stored encrypted per workspace:
- **Anthropic API key** — paste your key; usage is billed to your Anthropic account.
- **Claude subscription** — import a Pro/Max/Teams subscription via the `import_claude_subscription` tool / Claude OAuth flow, then check it with `get_claude_subscription_status`.
The default model is `claude-sonnet-4-6`, with a separate small/fast model for lightweight steps.

## Bring your own model
Set a **custom LLM** on the workspace to route agents to any OpenAI-compatible endpoint. The configuration carries:
| Field | Purpose |
| --- | --- |
| base_url | The provider's API base (e.g. OpenRouter, a local Ollama/vLLM server). |
| api_key | Credential for that provider (encrypted at rest). |
| model | Main model id. |
| small_fast_model | Cheaper model for lightweight steps. |
This is set in workspace settings, not via environment variables.

## System fallback (operator)
For workspaces with no model configured, operators can enable a shared fallback via environment. It's off unless a key is provided, and it enforces a per-actor daily token cap:
| Variable | Default | Purpose |
| --- | --- | --- |
| MASKIN_FALLBACK_OPENROUTER_KEY | — | Enables the fallback when set. |
| MASKIN_FALLBACK_BASE_URL | https://openrouter.ai/api | Fallback provider base URL. |
| MASKIN_FALLBACK_MODEL · MASKIN_FALLBACK_SMALL_MODEL | deepseek/deepseek-v4-flash | Fallback main / small models. |
| MASKIN_FALLBACK_DAILY_TOKEN_LIMIT | 550000 | Per-actor daily token cap. |
See the [configuration reference](/docs/configuration/) for the full environment list.
> Whatever model runs, per-session token usage and `totalCostUsd` are recorded — see [Agents & sessions](/docs/agents/).
