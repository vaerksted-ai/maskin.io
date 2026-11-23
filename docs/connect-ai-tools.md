> Source: https://maskin.io/docs/connect-ai-tools/

# Connect Maskin to your AI tool
Add Maskin to Claude Code, Codex, Copilot Studio or Grok in a few minutes. Each section has one command or one address to copy, the sign-in that works today, and one first thing to try.

## Before you start
All four tools connect to the same MCP server and sign in with a Maskin key. You need two things from your Maskin workspace:
1. In Maskin, open **Settings → MCP** and choose the **Other** tab. Under **Headers** it shows an `Authorization: Bearer ank_…` line with your Maskin key already filled in. Copy the key (the part after `Bearer`). Keep it private: anyone with it can act in your workspace.
2. On the same tab, the **X-Workspace-Id** line holds your workspace ID (a UUID). Copy that too.
The same tab shows the server address, `https://maskin.io/mcp`. If you run Maskin yourself, use `https://<your-maskin-host>/mcp` instead (see [Self-hosted setup](/docs/get-started/self-hosted/)). The **Claude Code** tab on that page shows the Claude Code command already filled in with your key.
> **Why a key, not a browser sign-in?** Maskin's browser sign-in only accepts the Claude and ChatGPT apps, by design. Any other tool is turned away, so these four use a key. Each section says what we tried and what we did not.

## Claude Code
Add the server with one command. Replace the two values in angle brackets:
```
claude mcp add --transport http maskin https://maskin.io/mcp \
  --header "Authorization: Bearer <YOUR_MASKIN_API_KEY>" \
  --header "X-Workspace-Id: <YOUR_WORKSPACE_ID>"
```
Add `--scope user` to make it available in every project. Then run `claude mcp list`, or `/mcp` inside Claude Code, and check that `maskin` says Connected.
**Sign-in:** the Maskin key above. Do not choose the browser sign-in in `/mcp`: Claude Code returns to a local address that Maskin does not accept.
**First thing to try:** ask Claude Code, *"Use the maskin MCP to list my workspaces, then show me what is active."*
**Checked:** on 23 November 2026 we ran the command above against maskin.io with a real key, and Claude Code reported `maskin` as connected. We did not run the browser sign-in.

## Codex
Put your key in an environment variable, then add the server:
```
export MASKIN_API_KEY=<YOUR_MASKIN_API_KEY>
codex mcp add maskin --url https://maskin.io/mcp --bearer-token-env-var MASKIN_API_KEY
```
The command writes this to `~/.codex/config.toml`. Add the workspace line under it:
```
[mcp_servers.maskin]
url = "https://maskin.io/mcp"
bearer_token_env_var = "MASKIN_API_KEY"
http_headers = { "X-Workspace-Id" = "<YOUR_WORKSPACE_ID>" }
```
Run `codex mcp list` to see it. Start Codex from a shell where `MASKIN_API_KEY` is set.
**Sign-in:** the Maskin key, read from the environment variable. Do not run `codex mcp login`: it starts a browser sign-in that Maskin does not accept for Codex.
**First thing to try:** ask Codex, *"Use the maskin MCP to list my workspaces, then show me what is active."*
**Checked:** on 23 November 2026 Codex CLI 0.171.0 accepted the add command and read this config, and the same key and header, sent straight to maskin.io, returned the workspace list. We did not run a full Codex session, because we had no OpenAI sign-in to run it with.

## Copilot Studio
Copilot Studio lets any maker add an MCP server by address, with no review. Your organisation's data policies can still block it, so ask your admin if the option is missing.
1. Open your agent, go to **Tools**, select **Add a tool**, then **New tool**, then **Model Context Protocol**.
2. **Server name:** `Maskin`. **Server description:** `Read and update bets, tasks and insights in a Maskin workspace.`
3. **Server URL:**
```
https://maskin.io/mcp?workspace=<YOUR_WORKSPACE_ID>
```
4. **Authentication:** choose **API key**, type **Header**, header name `Authorization`. Select **Create**.
5. When it asks for a connection, paste `Bearer <YOUR_MASKIN_API_KEY>` as the key (the word `Bearer`, a space, then the key), then select **Add to agent**.
**Sign-in:** the Maskin key. Do not choose OAuth 2.0: Copilot Studio's automatic sign-in registers itself as a new app, and Maskin turns that away.
**First thing to try:** in the agent's test chat, ask *"List my Maskin workspaces, then show me what is active."*
**Checked:** not tried in Copilot Studio, because we had no account for it. The steps follow Microsoft's page of 18 November 2026. The address with the workspace in it, and the key sent as an `Authorization` header, were checked against maskin.io with a plain request and worked. Whether Copilot Studio sends the key exactly as typed is unconfirmed.

## Grok
Grok has no directory for outside tools. You add Maskin yourself as a custom connector, and the address must be reachable from the internet (maskin.io is).
1. Open [grok.com/connectors](https://grok.com/connectors), select **New Connector**, then **Custom**.
2. Paste the server address:
```
https://maskin.io/mcp?workspace=<YOUR_WORKSPACE_ID>
```
3. Complete the sign-in step if Grok shows one (see below).
On Grok Business and Enterprise, a team admin has to provision the connector first.
**Sign-in:** not confirmed. xAI's page says only "complete any required authentication" and does not say which methods it supports. Maskin accepts a key sent as an `Authorization: Bearer <YOUR_MASKIN_API_KEY>` header. It does not accept Grok's browser sign-in. If Grok gives you no place to send a header, Maskin cannot be connected to Grok today.
**First thing to try:** if it connects, ask *"List my Maskin workspaces, then show me what is active."*
**Checked:** not tried in Grok, because we had no account for it. We do not know yet whether the connection works.

## If it does not connect
- **401 or no tools:** the key is missing, mistyped or revoked. Copy the key again from **Settings → MCP → Other**.
- **"No workspace specified":** the workspace ID is missing. Add the header or the `?workspace=` part of the address.
- More fixes: [Troubleshooting & FAQ](/docs/troubleshooting/). All the tools you can ask for: [MCP tools](/docs/mcp-tools/).
