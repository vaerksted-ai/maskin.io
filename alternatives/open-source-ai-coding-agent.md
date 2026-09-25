> Source: https://maskin.io/alternatives/open-source-ai-coding-agent/

# Open source AI coding agent — the shortlist, honestly tiered

An open source AI coding agent is a self-installable software agent that reads a codebase, drafts changes, runs tests, and commits work through a coding loop. In 2026 the category spans three tiers: single-developer runtimes, multi-session control planes, and cross-role product workspaces. All are free to install; the paid piece is the model API key you bring.

There is no single "open source AI coding agent." What people ship under that name lives on three tiers: **runtimes** that hold a coding loop end-to-end, **control planes** that orchestrate a set of runtimes, and **product workspaces** that hold the loops non-engineering teams run alongside code. Every listicle currently on the SERP flattens them into one list. This page doesn't. Below: a shortlist, sorted by tier, with what each is actually for.

## Key takeaways

- **Runtime vs. control plane vs. workspace — the three tiers.** A runtime holds the coding loop for one developer (OpenCode, Kilo, OpenHands, Aider, Cline, Continue, Goose). A control plane orchestrates a fleet of runtimes and their sandboxes (amux, herdctl, and the rest of the recent formation-tier wave). A workspace holds the whole cross-role loop including non-engineering work (Maskin).
- **Licence is not the same question as tier.** All of the below are OSS. The runtimes and workspaces are mostly Apache-2.0 or MIT; the control-plane tier is licensed less predictably. Pick tier first, then read the licence.
- **Buyers land on listicles, not vendor pages.** No OSS project has claimed a definitional slot on this SERP — every top result is someone else's ranked table, not the tools themselves. That gap is what this page tries to close.
- **Three questions decide the tier.** What's the object of work? What ends the loop? How much of the loop does the tool actually close? The section below walks each.

## The shortlist, by tier

### Tier 1 — Runtimes: one developer, one coding loop

A runtime is the thing that holds a coding session. You describe an object of work (a bug, a feature, a refactor), it drafts a change, tests, iterates, and commits. Below is the OSS shortlist. Every entry has a live GitHub repo, an install path that doesn't require signing up for a hosted service, and a public first-commit date. 

| Name | Licence | Install shape | One-line differentiator |
|---|---|---|---|
| **OpenCode** | Apache-2.0 | CLI (`opencode`) | Terminal-native. Model-agnostic (you bring the API key). The runtime most listicles rank at pos-2 for a reason — tight loop, no editor lock-in. |
| **Kilo** | Apache-2.0 | VS Code extension + CLI | Editor-embedded. Multi-agent inside one repo (Architect, Coder, Reviewer). Fork of Roo Code, itself a fork of Cline. |
| **OpenHands** | MIT | CLI + Docker | Sandboxed execution first-class. The runtime that treats "agent can break things" as the design centre, not the after-thought. |
| **Aider** | Apache-2.0 | CLI | Git-native. Every change is a commit; every commit has the diff and the prompt that produced it. The oldest of the shortlist. |
| **Cline** | Apache-2.0 | VS Code extension | The runtime the fork tree started from. Editor-embedded, MCP-native. |
| **Continue** | Apache-2.0 | VS Code + JetBrains extension | IDE-first. Configurable per-project via a single YAML. Less agent, more autocomplete-plus-context. |
| **Goose (Block)** | Apache-2.0 | CLI + desktop | Backed by Block (Square/Cash App). Extension-heavy — tool use through MCP is the design spine. |

What separates them, in one line each: **OpenCode** is terminal-first and model-agnostic; **Kilo** is editor-embedded and multi-agent inside a repo; **OpenHands** treats sandboxed execution as the design centre; **Aider** is git-native (every change is a commit); **Cline** is the fork root of the VS-Code-native tree; **Continue** is autocomplete-plus-context more than agent; **Goose** is MCP-forward with Block backing it.

If you're a single developer choosing a runtime, this is where the SERP's top 15 listicles do a reasonable job — they compare features inside this tier.

### Tier 2 — Control planes: many runtimes, many sessions, one operator

A control plane isn't another runtime. It's the layer that runs *a fleet of runtimes* — kicks off sessions on the right repo, on the right sandbox, with the right access, and keeps the outputs legible when you have five or fifty running in parallel. The category is forming fast in 2026; the head keywords are still soft (`agent control plane` KD 15). Every listicle currently on the coding-agent SERP misses this tier entirely.

Representative entrants (live public repos or hosted OSS): **amux**, **Crewship**, **Preloop**, **Nora**, **Musematic**, **Mission Control**, **Clawix**, **Vornik**, **Zoink**, **herdctl**, **danrex/fleet**. Licences here are mixed — some Apache-2.0, some MIT, some AGPL, a few dual-licensed. If you're evaluating this tier, read the licence file on each repo.

The honest signal: if your job is "a developer wants to code with an agent," you're on the wrong tier — use a runtime. If your job is "my team runs many agent sessions and I need to see who did what, where, on which sandbox," you're shopping the control-plane tier and the runtime-listicles won't help.

### Tier 3 — Product workspaces: code plus the rest of the loop

This is where **[Maskin](https://maskin.io)** sits, and it is a genuinely different question. A workspace holds the loops non-engineering teams run alongside code — discovery, marketing, sales, support — in the same graph the engineering work lives in. Coding runtimes plug in through MCP; they aren't the workspace, they're a tenant of it. Apache-2.0, self-hostable, MCP-native.

The shape of the question this tier answers: "how do the non-engineering agents on my team hand work to — and read work from — the coding agents?" A runtime doesn't answer this. A control plane doesn't either. A product workspace does, and Maskin is the only OSS one this section knows about; if you know another, the PR button on the repo is open.

**Try Maskin →** Self-host from GitHub ([`sindre-ai/maskin`](https://github.com/sindre-ai/maskin)) — Apache-2.0, MCP-native, one Docker Compose away. Or read the tier boundary in the [workspace-vs-coding-agent doc](https://maskin.io/docs/ai-product-workspace-vs-coding-agent/) before you install.

## How to pick — three questions

**1. What's the object of work?** If it's a file, a diff, a repo — you want a Tier 1 runtime. If it's a session (session over which repo, on which sandbox) — Tier 2 control plane. If it's a shipped outcome that spans engineering and non-engineering roles — Tier 3 workspace.

**2. What ends the loop?** A runtime's loop ends at "tests pass and commit lands." A control plane's loop ends at "session closed with a legible audit trail across all repos." A workspace's loop ends at "the bet the engineering work was serving is resolved as succeeded or failed." Pick the tier whose end-state is what you're actually trying to reach.

**3. How much of the loop does the tool close on its own?** Some Tier 1 runtimes are essentially very good autocomplete (Continue). Some close full features under human review (OpenHands, Aider). Same tier, different closure rates. A shortlist that ignores this gets you a benchmark answer, not a fit answer.

## FAQ (people-also-ask)

### Is there an open source AI coding agent CLI?

Yes — the CLI-first runtimes on this shortlist are **OpenCode**, **Aider**, **OpenHands**, and **Goose**. If terminal is your primary surface, start with those four; the Kilo/Cline/Continue trio is designed around an editor.

### Is there an open source AI coding agent for VS Code?

Yes — **Kilo**, **Cline**, and **Continue** all install as VS Code extensions. Kilo layers multi-agent orchestration inside the editor; Cline is the tree root the fork lineage came from; Continue leans toward autocomplete-plus-context rather than an agent that plans over many files.

### Is there a free open source AI coding agent?

All seven runtimes in Tier 1 are free to install and use — the licences are Apache-2.0 or MIT. The paid part, when there is one, is the model API key you bring. If you want end-to-end free (open weights), pair any of them with an OSS model (Qwen, Llama, DeepSeek-Coder) via LiteLLM or Ollama. The runtimes are model-agnostic; they don't care which endpoint they call.

### Are these open source AI coding agents on GitHub?

Yes — every entry above has a public GitHub repo and public first-commit history. Aider is the oldest (2023); OpenHands, OpenCode, Cline, and Continue all sit inside the 2024 formation window; Kilo forks from Roo which forks from Cline. Read the CONTRIBUTORS, CHANGELOG, and licence file before betting on any single project — the shortlist changes faster than the SERP does.

### What's the best open source AI coding agent?

Wrong question — the tier-honest one is: for **which** object of work? If the answer is one developer, one repo: **OpenCode** and **Aider** are the ones the shortlist would ship with by default in September 2026. If the answer is a fleet of sessions across many repos: shop the control-plane tier. If the answer includes non-engineering work in the same graph as the code: a product workspace.

## Cross-linking / further reading

- **[AI product workspace vs AI coding agent](https://maskin.io/docs/ai-product-workspace-vs-coding-agent/)** — the definitional cut at the tier boundary.
- **[Self-hosted AI agent control plane for knowledge work](https://maskin.io/alternatives/self-hosted-ai-agent-control-plane/)** — the sibling landing on the control-plane tier.
- **[Open source Codex alternative](https://maskin.io/alternatives/open-source-alternative-to-codex/)** — sibling entry on the /alternatives/ shelf.
