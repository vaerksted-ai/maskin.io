> Source: https://maskin.io/docs/self-hosted-ai-workspace/

# Self-hosted AI workspace: bring your own model
For product teams that need to control their own data and models, Maskin is fully self-hostable, Apache-2.0, and bring-your-own-model. Self-hosting is the structural answer for teams searching for an open source alternative to Claude Cowork, Codex, or ChatGPT workspaces — the capability without the vendor’s lock-in.
> ✓
> **Key takeaways**
> Open source under Apache 2.0 — inspect every line, fork it, run it.
> Self-host is always free; managed plans offer EU & US data residency.
> Bring your own Claude, Codex, or custom model.
> Agents run in sandboxed sessions, not against your private keys.

## Why self-host
Three buyers ask for self-hosting: **data sovereignty** (the work never leaves your infrastructure), **model freedom** (you choose the models, including local ones), and **auditability** (the code is open and inspectable). Hosted vendor workspaces cannot answer these — your data and your model choice *are* the product.
Open-core self-host is also a governance stance: the closed loop runs on objects you own, inside a repository you control, under a permissive license.

## Apache 2.0: inspect every line
Apache 2.0 is a permissive open-source license — use it, modify it, run it commercially, keep your changes private or contribute them back. For an AI workspace, that license matters more than usual: the tool decides which agents see what, and you should be able to read how.

## Bring your own model
The workspace is model-agnostic at the protocol layer because it is [MCP-native](/docs/what-is-mcp-native/). You decide which model runs your agents: Claude for reasoning-heavy shaping, Codex or a local model for constrained tasks, or a fine-tuned model for your domain. See [how model providers and keys work](/docs/llm/).

## Sandboxed agents
Agents execute in **sandboxed sessions** — isolated environments that cannot touch your private keys or production state outside the workspace’s authority. Autonomous operation is safe because execution is contained, and every step is inspectable. See the [security model](/docs/security/) for auth, data isolation, and key handling.

## Managed vs self-hosted
| Factor | Self-hosted | Managed |
| --- | --- | --- |
| License | Apache 2.0 | Apache 2.0 + hosted |
| Data residency | Your infrastructure | EU & US |
| Model | Your choice | Your choice (BYO-model) |
| Cost | Free (you run it) | From $20/seat/month |
If you want the same loops without running infrastructure, [book a hosted trial](https://meshfirm.com/bookmagnus). If the *work* must never leave your infrastructure, self-host.

## Pricing
- **Self-host** — always free.
- **Pro** — $20/seat/month, agent credits included.
- **Team** — $200/workspace/month, unlimited seats.
- **Enterprise** — your own LLM and infrastructure.

## An open-source alternative to Claude Cowork / Codex
The “open source alternative to X” searches are filling fast with desktop coding apps. What is missing is a closed-loop workspace for *product work*: signals in, bets shaped, tasks executed, outcomes validated — self-hostable and model-agnostic. That is the niche Maskin occupies.
Start with the [get-started guide](/docs/get-started/) or the [self-hosted setup guide](/docs/get-started/self-hosted/) to stand up an instance on your own hardware.

## FAQ

### How hard is self-hosting?
Clone the repo, follow the onboarding guide, and connect your model provider — agents run in sandboxed sessions out of the box.

### Can I switch between self-hosted and managed later?
Yes — the license and object model are yours; hosted and self-hosted are the same product.

### Is self-host truly free?
Yes — the open-source software is Apache 2.0; you pay for infrastructure only.
Read next

## Run the closed loop on servers you control
Self-host free and keep your data and model choice on your own infrastructure.
