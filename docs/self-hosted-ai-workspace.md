> Source: https://maskin.io/docs/self-hosted-ai-workspace/

# Self-hosted AI workspace: bring your own Claude or Codex
A self-hosted AI workspace runs your product-management loops on your own infrastructure, under a license you can audit, with agents that use your own model access. Maskin is Apache-2.0 and self-hostable at no software cost. Agent sessions run the Claude Code CLI by default, or the Codex CLI, so you bring your own Anthropic or OpenAI access. For teams that can’t send product data to a hosted vendor, that’s the structural answer — the same capability as a hosted agentic workspace, with data custody on your side of the line.
> ✓
> **Key takeaways**
> Self-hosting answers three buyer needs: data sovereignty, control over your model access, and auditability.
> Maskin is licensed Apache 2.0 — inspect every line, fork it, run it commercially.
> Bring your own Anthropic or OpenAI access: agents run the Claude Code CLI by default, or the Codex CLI. The MCP protocol layer is model-agnostic; the agent runtime is not.
> Agents run in sandboxed sessions, each in an ephemeral microVM (microsandbox and libkrun).
> Self-host is always free; managed plans offer EU and US data residency.

## Why self-host an AI workspace at all
Three buyers reach for self-hosting, and they want different things:
- **Data sovereignty.** The work — customer feedback, churn signals, roadmap material — never leaves your infrastructure. No hosted vendor’s retention policy to trust, no third-party subprocessors to audit, no cross-border transfer question to answer.
- **Control over model access.** Hosted workspaces tend to bundle the vendor’s model. Self-hosting decouples the workspace from that bundle: you run the Claude Code or Codex CLI with your own Anthropic or OpenAI access, on your terms.
- **Auditability.** The code is open and inspectable. For an AI tool that decides which agents see what and how loops are bounded, read-the-code becomes a governance feature, not a nicety.
Hosted vendor workspaces can’t fully answer any of these — your data and your model access are the product. Self-host is the control-plane answer, and open source is what makes each of the three claims verifiable rather than a promise.

## Open source is also a governance stance
Open-core self-hosting isn’t only about cost. Running the tool you plan to hand your roadmap to, under a permissive license, means the loop’s boundaries are a property you can verify rather than a promise from a vendor. The vision driving Maskin is explicit about where governance lives: a small team keeps the judgment, and a fleet of agents does the closing — so the human stops being the bottleneck on the work and becomes the judge of the outcome (Maskin vision, ratified 2026-08-21). Judgment and oversight are the moat; self-hosting is how a team makes that oversight inspectable.

## Apache 2.0: what the license actually buys you
Apache 2.0 is a permissive open-source license. You may use the software, modify it, run it commercially, and keep your own modifications private — with an explicit patent grant and no copyleft obligation to open your changes. For an AI workspace, the license matters more than it does for a normal tool, because the software decides how agents are wired in, how loops are bounded, and what data flows where. Being able to read that — and change it without relicensing your own work — is the difference between hosting someone’s black box and running your own system. Because the modifications you make to a self-hosted copy stay your own, Apache 2.0 is the license a security- or compliance-minded team can adopt without asking legal to unpick a copyleft dependency later.

## Bring your own model: what that means here
Maskin is [MCP-native](/docs/what-is-mcp-native/): agents, the UI, and integrations all talk to one unified object model over one API (see the [architecture overview](/docs/architecture/)). “Model-agnostic” is true of that protocol layer, not of the agent runtime. The agent image installs the Claude Code CLI by default, or the Codex CLI, and a browser sidecar is available for web tasks. So “bring your own model” means bring your own access to those two runtimes — see [how model providers and keys work](/docs/llm/). Practical ways teams use that:
- **Claude Code** for reasoning-heavy shaping and bet definition. If your team also runs Cursor, [Claude Code vs Cursor](/docs/claude-code-vs-cursor/) covers how to pick by job and keep one shared record.
- **Codex** for well-bounded execution tasks.
- **Your own keys and billing.** You pay Anthropic or OpenAI directly for the model usage behind your agents, and you can change which CLI runs a task without changing the workspace.
Local and fine-tuned models are not a path we have validated, so we don’t claim them here. If running local models is a hard requirement, check that before you commit.
The same principle runs through the whole surface: everything in Maskin is an object, and every object is reachable over one API — the UI and the agents serve the identical object model through the same routes. Authentication is built the same way for humans and agents: API-key auth with no browser sessions, so an agent can act as a first-class citizen of the workspace rather than a scripted imitation of a logged-in user (architecture decision record ADR-002, summarised in the [architecture overview](/docs/architecture/)). For a self-hosted deployment, that means the workspace behaves the same whether an operator, a CI pipeline, or an autonomous loop agent is driving it.

## Sandboxed agents: the safety argument for going autonomous
An autonomous AI workspace is only safe if execution is contained. Maskin runs agents in **sandboxed sessions** — each in an ephemeral microVM built on microsandbox and libkrun, with the coding CLI installed, an isolated workspace, and a browser sidecar for web tasks. That is the difference between an agent that “has access to everything” and an agent that executes inside a bounded environment with a close condition and human promote gates. See the [security model](/docs/security/) for auth, data isolation, and key handling.
It’s also the pragmatic reason automation is tractable. Because sessions are ephemeral and bounded, the blast radius of any single failure is contained, and every step is inspectable on the way back out. The one real constraint: self-hosting means running the microsandbox and libkrun runtime on the agent-server host. Docker is used only for local development, and there is no fallback that runs agents without a microVM runtime. When you evaluate self-host, plan that infrastructure dependency up front.

## Managed vs self-hosted
The engineering is the same either way — the same unified object model, the same loops, the same sandboxed agent sessions. The choice is who runs the infrastructure and where the data lives.
|  | Self-hosted | Managed (hosted) |
| --- | --- | --- |
| License | Apache 2.0 (yours) | Apache 2.0 + hosted service |
| Data residency | Your infrastructure | EU & US |
| Model | Claude Code CLI by default, or Codex CLI; your own Anthropic or OpenAI access | Claude Code CLI by default, or Codex CLI; your own Anthropic or OpenAI access |
| Agents | Sandboxed microVM sessions on your agent-server host | Sandboxed microVM sessions, operated for you |
| Infrastructure | You run it | We run it |
| Cost | Always free (you pay infra + model usage) | From $20/seat/month (agent credits included) |
Self-host keeps everything inside your walls and costs nothing for software; managed gets you running without provisioning agent-server hosts, with EU or US residency. Because the product is identical, moving between the two later is a deployment decision, not a migration. If you want the same loops without running infrastructure, [book a hosted trial](https://meshfirm.com/bookmagnus).

## Pricing
- **Self-host** — always free. You pay only for your own infrastructure and model usage.
- **Pro** — $20 per seat per month, agent credits included.
- **Team** — $200 per workspace per month, unlimited seats.
- **Enterprise** — bring your own Anthropic or OpenAI access.

## Who this competes with, and why it matters
The “open-source alternative to X” searches are filling fast with desktop coding apps (the [open source alternative to Claude Cowork](/alternatives/open-source-alternative-to-claude-cowork/) page compares those options directly). What is rarer is a self-hostable workspace for product work: signals in, bets shaped, tasks executed, outcomes validated. The closest named open-source rival in the agent-orchestration camp, [Paperclip](/alternatives/paperclip/), had roughly 95K GitHub stars when we read its repository on 1 October 2026 and sells “hire AI employees, run a company with AI” — the [full-company-simulation camp](/docs/composable-ai-agents-vs-ai-employees/). Maskin sits in the other camp: typed objects, event-driven triggers, agents that fire when data changes, and a closed loop that terminates against an outcome. For how the same object-model argument plays against the crowded coding-agent lane, see the [self-hosted AI agent control plane](/alternatives/self-hosted-ai-agent-control-plane/) comparison, and for the wider field of self-hosted agent repos, the [field survey of self-hosted AI agents](/alternatives/self-hosted-ai-agents/). If you are coming from Jira, the [open source Jira alternative](/alternatives/open-source-jira-alternative/) page compares the self-hosted ticket trackers (Plane, OpenProject, Taiga) with a self-hosted workspace built around bets.
The whole category is early — Tracxn counts roughly 60 native-AI product-management companies with about $500 million raised and one unicorn. Self-hostable closed-loop product workspaces are a thin slice of an early field — exactly the opening Maskin occupies.

## Why this matters for agent adoption
If you’re watching the market, the incumbents are also making data portability a live debate. Atlassian reports agentic automations up 7x in six months on its Teamwork Graph — evidence that agentic work is real demand, not demo. For a security- or sovereignty-constrained team, the question isn’t whether to adopt agents; it’s whether the platform it adopts lets the team keep custody of the data. That is the self-hosted AI workspace’s whole reason to exist. For the category itself, start with [what is an agentic workspace](/docs/what-is-an-agentic-workspace/) and [the AI product management tool overview](/docs/ai-product-management-tool/).

## Self-host it yourself
Cloning and running Maskin is the fastest way to see whether a self-hosted workspace fits. The source is on GitHub under Apache 2.0 — fork it, run it on your own infrastructure, connect your own Claude or Codex access, and keep your data on your side of the line. No software license, no seat fee.
Start at **[github.com/sindre-ai/maskin](https://github.com/sindre-ai/maskin)** — clone, run the onboarding guide, connect your Anthropic or OpenAI access. The [self-hosted setup guide](/docs/get-started/self-hosted/) and the [get-started guide](/docs/get-started/) walk through it. Or, if you’d rather not provision agent-server hosts, start on a [managed workspace](/) from $20/seat so you can move to full self-host later.

## FAQ

### How hard is self-hosting?
Clone the repository and follow the onboarding guide, then connect your Anthropic or OpenAI access; agents run in sandboxed microVM sessions. The one dependency to plan for is the agent-server host: it has to run the microsandbox and libkrun runtime, and agents won’t start without it. Docker is for local development only.

### Can I switch between managed and self-hosted later?
Yes. The license and the object model are yours, and hosted and self-hosted are the same product — the same loops, objects, and agent sessions. The choice at any point is where data lives and who runs infrastructure, and that’s a decision you can revisit rather than a migration you’ll dread.

### Can I bring my own model?
Within what Maskin runs today. Agent sessions use the Claude Code CLI by default, with the Codex CLI as an alternative, so you bring your own Anthropic or OpenAI access rather than an arbitrary model. The MCP protocol layer is model-agnostic; the agent runtime is not. Local models and fine-tunes are not a path we have validated.

### Is self-host truly free?
Yes — the software is open source under Apache 2.0, so it costs nothing to run. You pay for your own infrastructure and for whatever model usage you generate. There’s no per-seat fee hiding behind the self-host floor.

### Is a self-hosted workspace the same as running a desktop coding agent myself?
Not the same layer. Desktop coding agents automate a coding session in your editor; a self-hosted workspace runs the product-management loop — signal in, bet shaped, tasks executed, outcome validated — with agents as the hands and a human judging the outcome. If your job is shipping code interactively, the coding tools are the right tool; if your job is running a governed product loop your team owns, that’s the workspace layer.
Read next

## Run the closed loop on servers you control
Self-host free and keep your data on your own infrastructure, with your own Claude or Codex access.
