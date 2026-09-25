> Source: https://maskin.io/docs/agent-skills-marketplace/

# Agent skills marketplace: how to evaluate one
An **agent skills marketplace** is where you find, choose, and get agent skills — the on-demand instruction folders that teach an agent one job well. The phrase covers three different things today, and only one behaves like a marketplace. Before you compare listings, work out which shape you are looking at, and whether the skills will run where your work happens.
> ✓
> **Key takeaways**
> **"Agent skills marketplace" names three different things**: open collections and directories, vendor-hosted libraries, and skills bundled inside a product. Most of them are discovery surfaces, not commercial marketplaces.
> **The format is open, so nothing locks skills to one store.** An agent skill is a folder with a `SKILL.md` file — a `name`, a `description`, an on-demand body, and optional supporting files — all set out in Anthropic's agent skills specification (2025), an open format, so nothing forces you into a single vendor's catalogue. For the definition itself, start with [what agent skills are](https://maskin.io/docs/learn/agent-skills/).
> **Evaluate any marketplace on six checks**: provenance, versioning, reach, maintenance, spec conformance, and trigger model.
> **The trigger model is the check people skip and later regret.** A skill that only loads when someone remembers to invoke it is a snippet with better packaging. A skill that runs when workspace state changes is infrastructure.
> **You browse skills; you run them inside loops.** The browse surface and the run surface are different products, and a marketplace of skills is not the same thing as a marketplace of loops.
> **Nothing about the noun requires a store.** Plenty of teams adopt the primitive with a folder in a repository and no marketplace at all. A store is a distribution choice, not a requirement of the format.

## The three shapes of an "agent skills marketplace"
People arrive at the phrase expecting a shop and land on one of three very different things. Being precise about which one you are looking at is the first move, because each shape fails in a different way.

### Open collections and directories
Community repositories and catalogues that list skills you can copy into your own project. These are the most common result for the phrase, and they are usually not products — they are indexes maintained by contributors. A directory tells you a skill exists and where to find it. It does not sign it, version it, or support it. They tend to rank on domain age and repository stars rather than on any commercial relationship with the skills they list.

### Vendor-hosted libraries
Collections published by the model vendor or a tool vendor, tied to that vendor's agent and sometimes to a signing or review process. A vendor library is closer to a marketplace: there is a publisher, an audience, and a distribution channel. The trade-off is reach. A library that only serves one vendor's agent routes every skill through that vendor's review, and the skills you find there tend to assume that vendor's environment.

### Skills bundled inside a product
A capability a tool ships that happens to be packaged as a skill, where the folder is an implementation detail rather than something you browse. You do not choose these; they arrive with the product. They are worth understanding because they set a user's expectation of what a skill is — often invisibly, and often more narrowly than the open format allows.
What the phrase does not yet describe, in most cases, is a live commercial marketplace where skills are bought, sold, and versioned as products with support behind them. If you are evaluating an "agent skills marketplace," establish which of the three shapes it actually is before assuming the third-party product model applies.

## How to evaluate an agent skills marketplace
Once you know the shape, the differences that decide the outcome are the same six, whichever vendor is in front of you. Score each one honestly before you commit a team to the tool.
| Check | What to ask | Why it matters |
| --- | --- | --- |
| Provenance | Who published this skill, and can you verify them? | An unsigned folder from an unknown author runs with whatever reach the agent holding it has. |
| Versioning | Can you pin a version and see what changed between releases? | Skills are instruction sets. A silent edit changes agent behavior with no diff for you to review. |
| Reach | What can the skill touch once it loads — files, tools, connected data? | A skill inherits the permissions of the agent that carries it, so a small skill can act with large scope. |
| Maintenance | Who fixes it when the tool or API underneath it changes? | A skill that wraps a live system decays the moment that system moves. Unmaintained skills fail quietly. |
| Spec conformance | Does it follow the open SKILL.md format, or a private one? | Conformance is what lets you move a skill between agents instead of being locked to the listing that sold it. |
| Trigger model | How does the skill decide when to load? | This is what separates a snippet you paste from a capability that fires on its own. |
Most directory-shaped results do well on the first two checks and badly on the last. The trigger model deserves its own look, because it is the one buyers routinely skip.
Skills load in three levels: the name and description first, the body of `SKILL.md` when a task matches, and bundled files only when the agent reaches for them. That design lets a skill stay dormant until it is relevant, and it keeps a long playbook out of context until the moment it is needed. But *relevance* has to be signalled by something. If the only signal is a person remembering to mention the skill, then the skill is a snippet of text with a folder around it. If the signal is state — a record changing status, a stage completing, an object arriving — the skill becomes part of how work moves rather than something you have to remember. When you evaluate a marketplace, ask how its skills load, and whether that answer survives a busy week.

## Library, registry, and marketplace: three words doing different jobs
These terms get used as synonyms. They should not be. The distinction is the difference between finding a skill and being able to rely on it.
A **library** is a collection: a body of skills someone curates, whether or not you can act on it directly. A **registry** is an index with identity — names, versions, and where to fetch each one — closer to a package manager than to a shop. A **marketplace** adds a transaction and a relationship: a publisher accountable for a listing, terms under which you obtain it, and some expectation of support afterwards. A folder on a code host can be a library. A vendor's signed index can be a registry. Neither becomes a marketplace until somebody stands behind the listing.
That distinction is why a search for an "agent skills marketplace" is really two questions stacked together: *where do I find skills*, and *who is accountable once I use one*. Directories answer the first well. Very little answers the second today, which is the gap the phrase keeps reaching for.

## You browse skills; you run them inside loops
Here is the split the noun hides. Whatever surface you use to find a skill is a **browse surface**. The place the skill actually does its work is a **run surface**, and the two are not the same product. You browse a skill the way you browse a package: read the description, check the author, decide. You *run* it inside something that gives it a job, a trigger, and a place to report back.
That is the layer the category noun does not yet describe. Maskin's skill surface is a run surface: a skill attaches to an agent and ships as a ["built with" component of a loop](https://maskin.io/marketplace/), where the loop holds the trigger and the state. Maskin's Marketplace lists those loops — it is a catalogue of runnable loops, not a shelf of standalone skill folders, so you do not visit it to browse a plain skill directory; you use it to put a skill to work inside a defined process. The browse-versus-run distinction is also why the fast comparison people reach for — [agent skills versus MCP, cursor rules, and their neighbours](https://maskin.io/docs/agent-skills-vs-mcp-vs-cursor-rules-vs-workflows/) — matters: the instruction layers do different jobs, and only one of them carries state. If you want the layer-by-layer breakdown, that page is the hub for it.
A marketplace of skills, in other words, is not automatically a marketplace of loops. Buying a skill and running a loop are different acts, and the products that do the first rarely do the second.

## Where a skill actually runs
This is the practical question behind the commercial one. A skill is a folder, and a folder does not run itself. Three places a skill can live:
- **In a repository or prompt.** The skill sits in the project, and someone loads it when they remember. Simple, portable, and entirely dependent on human recall.
- **Inside a vendor's agent.** The skill loads when the vendor's agent decides a task matches its description. You get automatic loading, and you accept that vendor's environment and review process.
- **Inside a workspace that holds state.** The skill loads when the workspace changes in a way the trigger defines — a record moves status, a stage completes. The skill is invoked by the work itself, not by a person and not by a description match alone.
The third is where the category is heading, and it is the reason a marketplace built only for browsing will feel incomplete to a team that has to ship. It is also the reason to ask, of any marketplace, not just what it lists but what runs the listing. Skills are the primitive. Something has to give them a job.

## FAQ

### Is there an agent skills marketplace?
Not one, in the sense of a single commercial store where skills are bought and sold with support behind them. What exists today is mostly open collections and directories, plus vendor-hosted libraries and skills bundled inside products. The phrase is ahead of the market it describes. You can adopt agent skills today — the format is open and the tooling exists — without waiting for a store.

### What is the difference between an agent skills marketplace and a library?
A library is a collection of skills. A marketplace implies a publisher who is accountable for a listing, terms for obtaining it, and some expectation of support. Many things called an "agent skills marketplace" are libraries or directories wearing the commercial word.

### Do I need a marketplace to use agent skills?
No. A skill is a folder with a `SKILL.md` file and no build step or registration call. If the agent reads the folder, the skill exists. A marketplace is a distribution convenience, not a precondition — and a team that writes its own skills can go a long way before it ever needs one.

### Are agent skills free?
The format itself is free: a skill is a folder you can read, and there is no build step or registration call standing between you and the file. What you pay for, when you pay, is the support and maintenance around a skill, not the ability to open it. Plenty of teams run on skills they wrote and maintain in-house, with no third-party listing involved at all.

### How do I choose between them?
Run the six checks above, in order, and stop at the trigger model. Provenance, versioning, reach, maintenance, and spec conformance tell you whether a skill is safe to adopt. The trigger model tells you whether it will actually run. A listing that passes the first five and fails the sixth is a well-documented snippet.

## Skills that run where the work happens
Maskin is the MCP-native workspace where a skill is a packaged capability attached to a named agent inside a closed loop — not a snippet in a directory. Open source under Apache 2.0. Self-host free, bring your own model.
