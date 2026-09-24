> Source: https://maskin.io/docs/learn/agent-skills/

# What are agent skills: Anthropic’s primitive, with a Maskin workspace example
**An agent skill is a folder that teaches an AI agent how to do one job well.** The folder holds a `SKILL.md` file with a short `name` and a `description` at the top, plus any scripts or reference documents the job needs. An agent reads the description first, decides the skill is relevant, then loads the rest. That design is what makes a skill cheap to keep around and precise to use.
This page covers what agent skills are, where the format came from, what lives inside a skill folder, how skills differ from tools and prompts and MCP servers, how to write your first one, and how skills appear inside a Maskin workspace.
> ✓
> **Key takeaways**
> An **agent skill** is a folder containing a `SKILL.md` file. The file opens with YAML frontmatter carrying a `name` and a `description`; everything else in the folder is optional supporting material.
> Anthropic introduced the format in **October 2025**, and the specification is published openly at `agentskills.io/specification`.
> Skills load in **three levels**: name and description first, the body of `SKILL.md` when a task matches, and bundled files only when the agent reaches for them. A one-line description can unlock a long playbook without that playbook sitting in context.
> A skill is not a tool, a prompt, an MCP server, or a workflow. Each of those is a different layer; the skill is the reusable judgment you author and attach.
> Inside a Maskin workspace, a skill is a **component of a loop**, never a top-level surface. You attach it to an agent working inside a loop, and it can fire when typed workspace state changes.

## What are agent skills?
An agent skill is a portable, self-contained instruction folder. Point an agent at the folder and it learns a capability without you changing the model, the tool list, or the surrounding application. The agent decides when to use it by reading one sentence: the `description` in the frontmatter.
The practical effect is that capability becomes something you carry between agents and between tools, rather than something you rebuild per integration. Anthropic shipped the format in October 2025 as a way to package capability for its agents: a known folder structure, an open file format, and a loading strategy that keeps context small.
Searches for “agent skills” jumped sharply after the release and have stayed high through 2026.[1](#fn1) The interest is not only in Claude. Teams want a unit of instruction that survives a change of model vendor, which is why the same folder now runs inside several different coding agents.

## Where agent skills came from
[Anthropic announced agent skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) in October 2025 as a way to package instructions for Claude and Claude Code. The format is deliberately plain: folders, markdown, and a small block of YAML. Nothing about it needs a proprietary runtime.
That plainness is why the format spread. The [specification is published openly](https://agentskills.io/specification), and community collections have grown up around it. One of the most-read references is the [agent-skills repository maintained by Addy Osmani on GitHub](https://github.com/addyosmani/agent-skills), which collects working examples and explains the layout in plain terms.[4](#fn4) Anthropic’s own documentation walks through the three loading levels and the frontmatter fields in detail.[2](#fn2)
The relevant point for a product team is not the history. It is that a skill authored today against the public format is not locked to one vendor’s agent. The folder runs where the format is supported, and the format is supported in more places every quarter.

## What an agent skill actually contains
A skill is a directory. Inside it, one required file and a set of optional supporting files.

### The folder and the `SKILL.md` file
The required piece is `SKILL.md`. It has two parts: a block of YAML frontmatter and a markdown body.
```
---
name: refund-subscription
description: Issue a subscription refund when a customer cancels within 14 days and was billed in the last cycle. Use when a support ticket asks for money back on a recent charge.
---

# Refund a subscription

1. Confirm the charge falls inside the 14-day window.
2. Confirm the customer was billed in the last cycle.
3. Issue the refund through the billing tool, then post the confirmation to the ticket.

See `references/refund-policy.md` for the exceptions list.
```
The frontmatter carries two fields that matter most. `name` is the skill’s identifier, kept short and lowercase. `description` is the sentence an agent reads to decide whether to load the skill at all. Writing a good description is the single highest-leverage part of authoring a skill, because it is the only part that is always in front of the agent.
Everything else is optional. A skill folder can include a `references/` directory of documents the agent reads on demand, a `scripts/` directory of code the agent runs, and asset files such as templates. None of it is required for a skill to work.

### Progressive disclosure, in three levels
Skills load in three levels, and the levels are the point.
1. **Metadata.** The name and description of every installed skill sit in the agent’s context. This is cheap. A hundred skills cost about a hundred sentences.
2. **Body.** When the agent decides a skill matches the task, it loads the body of `SKILL.md`. This holds the actual instructions for the job.
3. **Bundled files.** If the body points at a reference document or a script, the agent loads that file only when it gets there.
A skill can therefore hold thousands of words of procedure while costing the agent one sentence until the moment it is needed. That is why skills scale where pasting an instruction block into a system prompt does not.

### What a minimal skill looks like
The smallest useful skill is a folder and one file. `SKILL.md` with a name, a description, and three or four lines of instruction is a complete skill. There is no build step, no manifest beyond the frontmatter, and no registration call. If the folder is in a location the agent reads, the skill exists.

## How agent skills relate to tools, prompts, rules, and workflows
These terms get used interchangeably in marketing copy and mean different things. The clean way to hold them apart:
- **A prompt** is a message you send. It lives for one turn.
- **A tool** is a function the agent can call. It does one thing and returns a result.
- **An MCP server** is the wire that exposes tools and data from systems your team already runs, such as a CRM or an inbox.
- **A rule** is a standing constraint on how the agent behaves, applied across every task.
- **A workflow** is a fixed sequence of steps executed the same way each time.
- **A skill** is packaged judgment about how to do a specific job, loaded on demand.
A useful shorthand: skills are what you author, tools are what you call, MCP is what you connect, and rules are what you always apply. Skills are the layer that carries your team’s way of doing a piece of work, which is why they tend to be the artifact people most want to share.
The distinctions matter in practice because the layers solve different problems and are frequently confused. Our [comparison of agent skills with MCP, cursor rules, and workflows](/docs/agent-skills-vs-mcp-vs-cursor-rules-vs-workflows/) walks through each layer side by side, including the state problem that none of the instruction layers solve on their own.[5](#fn5)

## Where to find agent skills (and what “agent skills marketplace” means)
People search for an “agent skills marketplace” and the phrase covers a few different things today. It is worth being precise about which is which.
- **Open collections and directories.** Community repositories and catalogues that list skills you can copy into your own project. These are the most common result for the phrase. Most are not products; they are indexes maintained by contributors.
- **Vendor-hosted libraries.** Collections published by the model vendor or a tool vendor, tied to that vendor’s agent and sometimes to a signing or review process.
- **Skills bundled inside a product.** A capability a tool ships that happens to be packaged as a skill, where the folder is an implementation detail rather than something you browse.
What the phrase does not yet describe, in most cases, is a live commercial marketplace where skills are bought, sold, and versioned as products with support behind them. If you are evaluating an “agent skills marketplace,” check which of the three shapes it actually is before assuming the third-party product model.
One more distinction worth holding: a marketplace of skills is not the same as a marketplace of loops. A skill is a component. A loop is a complete process with a trigger, agents, human gates, and a close condition, and it is the unit a buyer normally shops for. Skills are the parts inside it. The [Maskin Marketplace](/marketplace/) lists loops on that reading.

## A live example: skills that fire on workspace state
In Maskin, skills are attached to an agent working inside a loop. They are not a top-level section of their own. The Marketplace lists loops; agents, MCP servers, and skills appear as the “built with” components of a loop listing.
What makes the skill primitive in a Maskin workspace different from a folder you paste into a chat is the thing it can react to. A workspace-attached skill can fire against typed state in the object graph: an object entering a status, a field changing value, or an @mention landing on an object. The skill is not something an agent happens to have loaded; it is something that runs when the workspace reaches a state it was written for.
Concretely, a skill attached to a discovery agent might fire when an interview note object moves to `ready`. It reads that object, applies the team’s synthesis template, and writes a drafted insight back to the graph. The next agent to work on the same topic reads from the same typed state, so the skill’s output is not stranded in a chat transcript.
That is the difference between a skill as a document and a skill as a working part. Both use the same folder format. One is loaded by hand; the other is wired into the place the work actually happens. The [stateful orchestration substrate](/docs/what-is-a-stateful-orchestration-substrate/) is what carries that typed state between agents, and the [closed-loop workspace](/docs/closed-loop-workspace/) is the shape the whole arrangement forms.

## Are agent skills an open standard?
The format is public. Anthropic documented it, the specification is hosted openly, and the loading rules are readable.[3](#fn3) Skills written for one supported agent generally run in another that implements the format, which is the concrete test of portability.
Portability is not total. Vendor libraries can add review or signing steps, and a skill that calls a specific tool only works where that tool is reachable. The folder itself travels; the integrations it depends on may not. As the format has been adopted more widely, community collections have rebranded and expanded beyond a single vendor, which is itself a signal that the format is behaving like a standard rather than a single product feature.
For a team deciding where to invest authoring time, that is the relevant fact: instruction written as a skill is more portable than instruction written into one vendor’s prompt format.

## How to write your first agent skill
1. **Pick one job.** Choose a task your team repeats and can describe in a page. “Draft a follow-up in our voice” is a job. “Be helpful” is not.
2. **Write the description first.** One or two sentences: what the skill does and when it should be used. This is what the agent reads before anything else.
3. **Write the body as steps.** Keep it to the instructions a competent person would need, in order, with the decision points called out.
4. **Move the bulk into references.** Long policy documents, examples, and templates belong in `references/` so they load only when the body reaches for them.
5. **Test it against a real task.** Run the skill on something you would actually do, watch where the agent goes wrong, and tighten the description and the steps until it lands. The description is usually where the fix is.

## FAQ

### What are agent skills used for?
They give an agent a repeatable, specialised capability without retraining a model or rewriting its prompt. Common uses include enforcing a team’s code-review process, applying a document-extraction workflow, and handling a support task such as refunds. Because a skill loads only when its description matches the task, it can hold a long procedure while costing the agent a single sentence of context the rest of the time.

### Who introduced agent skills?
Anthropic introduced the format in October 2025 for Claude and Claude Code, then published it as an open specification at agentskills.io. The plain folder-and-markdown design is why other agent products could adopt it quickly, and why community collections such as Addy Osmani’s repository grew up alongside it. Today the format is implemented across several coding agents, not only Anthropic’s.

### Are agent skills just prompts?
No. A prompt is a message you send, and it lives for one turn. A skill is a folder the agent discovers and loads when a task matches, and it stays available across every conversation. A prompt competes for space in the context window and has to be resent; a skill sits on disk and costs one description line until it is needed. Skills can also bundle scripts and reference files, which a prompt cannot.

### Do agent skills work across different AI tools?
Mostly. The folder format is public and implemented by several agents, so a skill generally runs wherever the format is supported. Skills that depend on a specific integration only run where that integration is reachable, and a vendor library can add its own review or signing step. The folder itself travels further than the tools it calls. For most teams, that portability is the reason to author in this format.

### Is there an agent skills marketplace?
Most results for “agent skills marketplace” are open collections, vendor libraries, or skills bundled inside a product, rather than a mature commercial marketplace where skills are bought, sold, and supported as products. If you are evaluating one, check which of those three shapes it is. A marketplace of skills is also not a marketplace of loops: a skill is a component, while a loop is a complete process with a trigger, agents, and a close condition.

### What is the difference between agent skills and MCP?
They are different layers, and the two are often confused. MCP is the protocol that exposes tools and data from systems your team already runs, such as a CRM or an inbox. A skill is the packaged judgment about how and when to use those tools for a specific job. You connect MCP servers; you author skills. A skill frequently directs an agent to call several tools that MCP has exposed.

## Sources
1. **Maskin — ‘Agent skills’ keyword research** (US, 8,100/mo, KD 47; pulled 2026-09-23). Internal demand, trend, and SERP-composition analysis showing the head SERP is spec/directory-shaped. [↩](#fnref1)
2. **Anthropic engineering**, *Equipping agents for the real world with Agent Skills*. [anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills). Anthropic’s canonical write-up on progressive disclosure, the `SKILL.md` format, and the folder layout. [↩](#fnref2)
3. **Agent Skills specification**, agentskills.io. [agentskills.io/specification](https://agentskills.io/specification). The open format spec: `SKILL.md` frontmatter fields, directory layout, and the three-level loading model. [↩](#fnref3)
4. **addyosmani/agent-skills** (GitHub). [github.com/addyosmani/agent-skills](https://github.com/addyosmani/agent-skills). A production-grade reference collection of working skills — the top-ranking page on the “agent skills” SERP. [↩](#fnref4)
5. **Maskin**, *Agent skills vs MCP vs cursor rules vs workflows*. [maskin.io/docs/agent-skills-vs-mcp-vs-cursor-rules-vs-workflows](/docs/agent-skills-vs-mcp-vs-cursor-rules-vs-workflows/). The sister page that walks the layer comparison in full. [↩](#fnref5)
Read next

## Author the skill once, attach it to a loop
Maskin is the open-source, MCP-native workspace where skills are components of a loop, not a surface of their own — attached to an agent, firing on typed workspace state, with the output landing back on the object graph. Apache 2.0, self-hostable, EU/US data residency.
