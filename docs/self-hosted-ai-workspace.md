> Source: https://maskin.io/docs/self-hosted-ai-workspace/

# Self-hosted AI workspace: run Claude agents on your own infrastructure
Self-hosted AI means the AI runs on infrastructure you control, not a vendor’s. Maskin is open source under Apache 2.0, and technical teams can run it on their own infrastructure, under a license you can audit. Agents run on Claude by default. Enterprise teams can bring their own Claude subscription, API key or model endpoint.
> ?
> **Can it run inside our closed network?**
> We do not make claims about closed or air-gapped networks. Maskin is open source under Apache 2.0, and technical teams can run it on their own infrastructure. [Book a call](https://meshfirm.com/bookmagnus) and we will walk through your network.
> ✓
> **Key takeaways**
> Maskin is open source, so technical teams can run it on their own infrastructure and audit the code.
> Maskin is licensed Apache 2.0 — inspect every line, fork it, run it commercially.
> Agents run on Claude by default. Enterprise teams can bring their own Claude subscription, API key or model endpoint.
> Moving data between your own instance and managed is a manual copy that has not been tested.

## Why run an AI workspace on your own infrastructure
Two things draw technical teams to an open-source workspace:
- **Control over where it runs.** Technical teams can run Maskin on their own infrastructure instead of a vendor’s hosting.
- **Auditability.** The code is open and inspectable. For an AI tool that decides which agents see what and how loops are bounded, read-the-code becomes a governance feature, not a nicety.
Open source is what makes the auditability claim verifiable rather than a promise. If you are still choosing between kinds of self-hosted agent tooling, the [2026 landscape of self-hosted AI agents](/alternatives/self-hosted-ai-agents/) sorts the open-source field into four categories and shows where a workspace like Maskin fits.

## Open source is also a governance stance
Running the tool you plan to hand your roadmap to, under a permissive license, means the loop’s boundaries are a property you can verify rather than a promise from a vendor. The vision driving Maskin is explicit about where governance lives: a small team keeps the judgment, and a fleet of agents does the closing — so the human stops being the bottleneck on the work and becomes the judge of the outcome (Maskin vision, ratified 2026-08-21). Judgment and oversight are the moat; open source is how a team makes that oversight inspectable.

## Apache 2.0: what the license actually buys you
Apache 2.0 is a permissive open-source license. You may use the software, modify it, run it commercially, and keep your own modifications private — with an explicit patent grant and no copyleft obligation to open your changes. For an AI workspace, the license matters more than it does for a normal tool, because the software decides how agents are wired in, how loops are bounded, and what data flows where. Being able to read that — and change it without relicensing your own work — is the difference between hosting someone’s black box and running your own system. Because the modifications you make to your own copy stay your own, Apache 2.0 is the license a security- or compliance-minded team can adopt without asking legal to unpick a copyleft dependency later.

## Which model agents run on
Maskin is [MCP-native](/docs/what-is-mcp-native/): agents, the UI, and integrations all talk to one unified object model over one API (see the [architecture overview](/docs/architecture/)). Agents run on Claude by default. Enterprise teams can bring their own Claude subscription, API key or model endpoint. See [how model providers and keys work](/docs/llm/). If your team also runs Cursor, [Claude Code vs Cursor](/docs/claude-code-vs-cursor/) covers how to pick by job and keep one shared record.
Everything in Maskin is an object, and every object is reachable over one API — the UI and the agents serve the identical object model through the same routes. Authentication is built the same way for humans and agents: API-key auth with no browser sessions, so an agent can act as a first-class citizen of the workspace rather than a scripted imitation of a logged-in user (architecture decision record ADR-002, summarised in the [architecture overview](/docs/architecture/)). That means the workspace behaves the same whether an operator, a CI pipeline, or an autonomous loop agent is driving it.

## Run it on your own infrastructure or managed
The engineering is the same either way — the same unified object model and the same loops. The choice is who runs the infrastructure.
|  | On your own infrastructure | Managed (hosted) |
| --- | --- | --- |
| License | Apache 2.0 (yours) | Apache 2.0 + hosted service |
| Where it runs | Your infrastructure | Our hosting |
| Model | Claude by default | Claude by default |
| Infrastructure | You run it | We run it |
| Cost | You run your own infrastructure | From $20/seat/month (agent credits included) |
Running it yourself means you operate the infrastructure; managed means we do. Moving data between the two is a manual copy that has not been tested, so decide where the workspace should live before you fill it. If you want the same loops without running infrastructure, [book a hosted trial](https://meshfirm.com/bookmagnus).

## Pricing
- **Pro** — $20 per seat per month, agent credits included.
- **Team** — $200 per workspace per month, unlimited seats.
- **Enterprise** — bring your own Claude subscription, API key or model endpoint.

## Who this competes with, and why it matters
The “open-source alternative to X” searches are filling fast with desktop coding apps (the [open source alternative to Claude Cowork](/alternatives/claude-cowork/) page compares those options directly). What is rarer is an open-source workspace for product work: signals in, bets shaped, tasks executed, outcomes validated. The closest named open-source rival in the agent-orchestration camp, [Paperclip](/alternatives/paperclip/), had roughly 95K GitHub stars when we read its repository on 1 October 2026 and sells “hire AI employees, run a company with AI” — the [full-company-simulation camp](/docs/composable-ai-agents-vs-ai-employees/). Maskin sits in the other camp: typed objects, event-driven triggers, agents that fire when data changes, and a closed loop that terminates against an outcome. For how the same object-model argument plays against the crowded coding-agent lane, see the [self-hosted AI agent control plane](/alternatives/self-hosted-ai-agents/) comparison, and for the wider field of self-hosted agent repos, the [field survey of self-hosted AI agents](/alternatives/self-hosted-ai-agents/). If you are coming from Jira, the [open source Jira alternative](/alternatives/open-source-jira-alternative/) page compares the self-hosted ticket trackers (Plane, OpenProject, Taiga) with an open-source workspace built around bets.
The whole category is early — Tracxn counts roughly 60 native-AI product-management companies with about $500 million raised and one unicorn. Open-source closed-loop product workspaces are a thin slice of an early field — exactly the opening Maskin occupies.

## Why this matters for agent adoption
If you’re watching the market, the incumbents are also making data portability a live debate. Atlassian reports agentic automations up 7x in six months on its Teamwork Graph — evidence that agentic work is real demand, not demo. For a security-conscious team, the question isn’t whether to adopt agents; it’s whether the platform it adopts lets the team inspect how it works. Open source under Apache 2.0 is Maskin’s answer to that. For the category itself, start with [what is an agentic workspace](/docs/what-is-an-agentic-workspace/) and [the AI product management tool overview](/docs/ai-product-management-tool/).

## Run it on your own infrastructure
Maskin is open source under Apache 2.0, and technical teams can run it on their own infrastructure. The source is on GitHub: **[github.com/sindre-ai/maskin](https://github.com/sindre-ai/maskin)**.
Technical details are on the [self-hosted setup page](/docs/get-started/self-hosted/) and in the [get-started overview](/docs/get-started/). If you’d rather not run infrastructure, start on a [managed workspace](/) from $20/seat.

## FAQ

### Can we run Maskin on our own infrastructure?
Yes, if you have a technical team. Maskin is open source under Apache 2.0, and technical teams can run it on their own infrastructure. The source is on GitHub.

### Can I switch between managed and self-hosted later?
You can run your own instance from the open-source repo at any time. Moving data between managed and self-hosted is a manual copy that has not been tested, and there is no workspace export in the API or tools today. Decide where the workspace should live before you fill it.

### Which model do agents run on?
Agents run on Claude by default. Enterprise teams can bring their own Claude subscription, API key or model endpoint.

### Is a self-hosted workspace the same as running a desktop coding agent myself?
Not the same layer. Desktop coding agents automate a coding session in your editor; a self-hosted workspace runs the product-management loop — signal in, bet shaped, tasks executed, outcome validated — with agents as the hands and a human judging the outcome. If your job is shipping code interactively, the coding tools are the right tool; if your job is running a governed product loop your team owns, that’s the workspace layer.
Read next

## Run the closed loop on your own infrastructure
Maskin is open source under Apache 2.0, and technical teams can run it on their own infrastructure.
