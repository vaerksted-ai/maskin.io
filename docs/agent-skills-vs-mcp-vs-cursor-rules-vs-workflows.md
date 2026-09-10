> Source: https://maskin.io/docs/agent-skills-vs-mcp-vs-cursor-rules-vs-workflows/

# Agent skills vs MCP vs cursor rules vs workflows: what each layer solves
**Agent skills, MCP, Cursor rules, and workflows are not four names for the same thing.** They sit at four different layers — protocol, packaged capability, behavioral directives, and orchestration. The `agent skills vs MCP` SERP debate is a category mistake; most real capabilities ship all four.
> ✓
> **Key takeaways**
> **MCP** is a protocol: what an agent can *reach* — typed tool contracts to external systems.
> **Agent skills** are packaged capability: what an agent *invokes* when a use case matches — a `SKILL.md` folder, optional scripts, an optional `plugin.json` bundle.
> **Cursor rules / AGENTS.md** are behavioral directives: how an agent *acts* in a repo — guardrails, style, path allowlists.
> **Workflows** are orchestration: who runs, in what order, on which trigger.
> The `agent skills vs MCP` debate is a category mistake. They sit at different layers. Most real capabilities ship both.
> The unclaimed slot beneath the whole conversation: skills that fire against typed workspace state, not against a git repo.

## The four-layer picture
Every agent that does real work touches four different concerns, and most of the confusion online comes from collapsing them into a two-way fight. Here is the layering the rest of this piece unpacks:
| Layer | Answers | Concrete example |
| --- | --- | --- |
| MCP (protocol) | What can I reach? | An MCP server exposing stripe.subscription.cancel(...) |
| Agent skills (packaged capability) | What do I invoke when a use case shows up? | A SKILL.md for refund a subscription that composes Stripe + audit-log tools |
| Cursor rules / AGENTS.md (behavioral directives) | How should I act in this context? | Never touch files under /vendor/; prefer pnpm over npm |
| Workflows (orchestration) | Who runs, in what order, on which trigger? | On refund_request.status = approved, run RefundAgent then NotifyAgent |
These layers do not compete; they stack. A working knowledge-work agent almost always uses all four.

## Definitions, one paragraph each

### MCP
Model Context Protocol is Anthropic’s open standard for how an agent talks to external systems. Each MCP server exposes typed tools (JSON Schema in, JSON out), resources, and prompts. The agent doesn’t know or care whether the tool is a Postgres query, a Stripe endpoint, or a Slack message — the protocol normalizes it. MCP is the substrate: it defines the surface an agent can touch. It says nothing about *when* to touch it. For the protocol layer specifically, we’ve written that up in [What is MCP-native?](/docs/what-is-mcp-native/) — the short version is that MCP is to agents what HTTP is to browsers.

### Agent skills
An *agent skill*, in Anthropic’s Skills framing (adopted across Claude, Cursor, Codex, VS Code), is a packaged capability the model loads when it recognizes a matching use case. Concretely: a folder with a `SKILL.md` file (YAML frontmatter describing when to invoke), optional scripts, and often a `plugin.json` bundling multiple skills into an installable unit. Anthropic’s docs formalized the format; Addy Osmani’s `agent-skills` repo — the top-ranking result on the head term today — turned it into shared vocabulary. A skill is *not* a tool. It’s a capability packaging that may compose several tools, prompt fragments, and scripts into one thing the model can pattern-match against.

### Cursor rules / AGENTS.md
Cursor rules (`.cursor/rules/*.mdc`) and their cross-editor cousin `AGENTS.md` are behavioral directives scoped to a repo (or a path inside a repo). They tell the agent *how to act*: which conventions to follow, which paths to avoid, which tooling to prefer. Rules don’t add capability — the agent could already do the thing. Rules constrain style, safety, and defaults so the agent behaves like the team behind the repo. In Anthropic’s own documentation these overlap with *policies*; in Cursor they surface as rule files the editor injects into every prompt.

### Workflows
A workflow is the composition layer: multiple agents (or one agent across multiple steps) coordinated by triggers, state transitions, and hand-offs. Some frameworks call these *chains* (LangChain), *graphs* (LangGraph), *flows* (CrewAI), or *orchestrations* (Temporal-shaped). The common thread: something outside any single agent invocation decides who runs, in what order, and on which event. Workflows answer *who runs when*, not *what any one agent can do*.

## Why the two-way SERP debate is a false frame
Every top result on `agent skills vs mcp` today — [LlamaIndex](https://www.llamaindex.ai/blog/skills-vs-mcp-tools-for-agents-when-to-use-what), [Red Hat Developers](https://developers.redhat.com/articles/2026/05/25/mcp-servers-vs-skills-choosing-right-context-your-ai), the Reddit thread, [ByteByteGo](https://blog.bytebytego.com/p/ep165-ai-agent-versus-mcp), and the [*MCP is dead* Medium hot-take](https://medium.com/@alonisser/mcp-is-dead-or-mcp-vs-skills-revisited-daaa51b9a519) — pits MCP and skills against each other and picks a winner. That framing is the mistake.
- MCP answers **reach**: I can call this tool.
- Skills answer **trigger + capability**: when this use case shows up, invoke this bundle of tools, prompts, and scripts.
- Rules answer **conduct**: while acting, stay inside these lines.
- Workflows answer **composition**: run these agents in this order on this event.
You don’t pick between them. A skill for *refund a customer* almost certainly calls tools exposed over MCP. Cursor rules govern *how* the skill executes when it’s a code-writing skill. Workflows fire the skill when a business event says it should. Every layer sits above the one below it and answers a question the one below cannot.

## `agent skills vs MCP` — protocol vs packaged capability
The core question the SERP keeps mis-answering: *do I ship an MCP server or an agent skill?* The honest answer is *usually both, and they’re not the same thing.*
**MCP is a protocol between the agent and the outside world.** It’s what makes `stripe.subscription.cancel` callable at all. When you ship an MCP server, you’re publishing typed tool contracts. Any MCP-capable agent (Claude, Cursor, Codex, VS Code, and now most harnesses) can wire the server in and use the tools. The unit of shipping is *the tool interface*.
**A skill is a bundle the agent loads when a use case matches.** It composes zero or more tools (often over MCP), prompt fragments, scripts, and a `SKILL.md` describing the trigger. The unit of shipping is *the capability package*. Skills are how you get the agent to reliably use the *right combination* of tools you’ve exposed.
Concrete example. You want an agent that can refund a Stripe subscription and log to your audit trail.
- **MCP layer:** `stripe-mcp` exposes `stripe.subscription.cancel` and `stripe.credit_note.create`. `audit-mcp` exposes `audit.log.write`.
- **Skill layer:** a `refund-subscription` skill with a `SKILL.md` saying *invoke when the user asks to refund a subscription*, plus a short script that cancels, credits, and writes the audit line.
Without MCP, the skill has nothing to call. Without the skill, the agent has to re-derive the sequence every time. Ship both.
Where the confusion becomes real: some capabilities are just one tool call. In that case a skill is thin — a `SKILL.md` pointing at a single MCP tool with a good description. That’s still a legitimate skill; it’s how you get the model to pick that tool reliably when it matches. But the two layers remain distinct.

## `agent skills vs cursor rules` — capability vs conduct
Cursor rules and skills look adjacent because both live near the agent and both influence what happens. They answer different questions.
**Rules constrain behavior**: which conventions to follow, which files to avoid, which tools to prefer, how to format output. Rules never add capability. A repo rule that says *always use `pnpm`* doesn’t teach the agent about pnpm — the agent already knows. The rule just makes the agent’s default reliable in this repo.
**Skills package capability**: a bundle the agent loads when a use case shows up. A skill for *generate a database migration* carries the recipe — which command, which naming convention, which template to fill in. Without the skill, the agent either doesn’t know or guesses.
Practical decision: if you’re teaching the agent something it doesn’t already know how to do, that’s a skill. If you’re constraining or defaulting how it does something it already knows, that’s a rule. Overlap happens in the middle — Anthropic’s own docs blur skills that carry heavy prompt instructions with policies — but the mental model above holds up under most decisions.
Rules ride *with the repo*. Skills ride *with the agent* — installable, sharable, versioned separately. That distinction matters for distribution: rules ship with your codebase; skills ship as their own artifact.

## `agent skills vs workflows` — capability vs orchestration
The `agent skills vs workflows` autocomplete gets confused because both feel like *the agent doing multiple things*. They live at different layers.
**A skill is what one agent invocation is capable of.** It might contain a script that does five API calls in sequence. That sequence is internal to the skill. From outside, the agent invoked one skill.
**A workflow decides who runs when.** It’s the orchestration layer above the agent. On a trigger — a webhook, a state change, a schedule — it kicks off one or more agents, hands their outputs to the next, and manages state between them. This is the layer LangGraph, CrewAI, Temporal-style orchestrators, and object-graph substrates operate on. We’ve written the substrate framing in [What is a stateful orchestration substrate?](/docs/what-is-a-stateful-orchestration-substrate/) — the workflow layer’s job is to keep composition legible when many agents share state.
The pragmatic split: if all the work happens inside one agent’s turn, it’s a skill. If work crosses agent turns, waits on an event, or hands off between agents, it’s a workflow.

## `agent skills vs subagents` — one more the SERP conflates
Subagents (Anthropic’s Claude Code term, mirrored in other harnesses) are separate agent invocations spawned from a parent agent, each with its own context window. They’re a *runtime primitive*, not a packaging primitive. A subagent might load skills. A subagent runs inside a workflow. But the subagent itself is neither.
Rule of thumb: **skills are what you author. Subagents are what you spawn. Workflows are what you compose. MCP is what you call.**

## The unclaimed slot: skills that fire against typed workspace state
Every canonical writeup on agent skills — Anthropic’s docs, Addy Osmani’s essay, the LlamaIndex piece, Red Hat, Sysdig, Elastic, NVIDIA’s glossary — assumes the skill lives in a repo and gets invoked when a developer prompts a coding agent. That’s one shape of agent work. It’s not the shape most knowledge-work agents have.
The unclaimed frame: **skills that fire against typed workspace state, not against a git repo.** The invocation trigger isn’t *a developer typed a prompt in Cursor*; it’s *an object of type `insight` just entered status `clustered`*. The skill runs against a typed graph the whole team can inspect, comment on, and re-run.
In Maskin — the workspace this piece was written in — that primitive is `workspace_skill`. A skill declares how it should be invoked and subscribes to state transitions on the typed object graph: an object entering a status, a field changing, an `@mention` landing on an object. The skill itself is still a `SKILL.md` plus scripts plus prompt fragments — the same shape as an Anthropic skill. What changes is *what the skill is watching*.
Concrete example. A *Signal Analyst* skill fires when an `insight` object enters status `clustered`. It reads the insight’s content and its `informs` edges, checks whether the cluster crosses a threshold, and either drafts a proposal object or posts a comment back to the researcher. No developer had to type *run signal analyst* anywhere. The workspace state was the trigger.
This isn’t a rejection of the coding-agent framing — coding is real work, and the `SKILL.md` format is genuinely useful there. It’s an extension. The same skill primitive, once the trigger surface moves from a repo to a typed state graph, unlocks a category of agent work that most current writing on skills doesn’t address. This is the shape [AI product workspace vs AI coding agent](/docs/ai-product-workspace-vs-coding-agent/) points at: composable pieces of capability that a team stitches into their own operating shape, rather than a monolithic *AI employee* persona.

## Deciding what to reach for
A rough decision table when you’re building something and asking which of these you need:
| You want to… | Reach for |
| --- | --- |
| Expose a new external system to the agent | MCP server |
| Teach the agent a repeatable capability it can pick up when a use case matches | Agent skill |
| Constrain how the agent acts inside a specific repo | Cursor rules / AGENTS.md |
| Trigger agents on state changes or hand off between them | Workflow (or a stateful substrate) |
| Fan out work into isolated agent contexts | Subagents |
You will usually reach for several. Shipping a real capability at knowledge-work scale looks like: expose two or three MCP tools, package them behind one skill, gate the skill’s invocation with a workflow that fires on a state change, and (if the skill also writes code) apply the repo’s rules.

## FAQ

### Is `agent skills vs MCP` a real choice?
Not usually. They sit at different layers — MCP is a protocol for reaching tools; skills package the capability the agent invokes. Most non-trivial skills call MCP-exposed tools. The one case where you might pick: a capability that’s a single tool call and doesn’t need a `SKILL.md` wrapper. Even then, the wrapper is what makes the model pick reliably.

### Is `agent skills vs cursor rules` a real choice?
Different jobs. Skills add capability the agent didn’t have. Rules constrain how the agent behaves inside a specific repo. Ship the skill when you’re teaching the agent something new; ship the rule when you’re setting local defaults.

### Is `agent skills vs workflows` a real choice?
Different layers. A skill is one agent invocation’s capability. A workflow orchestrates multiple invocations across triggers and state. You use workflows to fire skills at the right moment, not instead of skills.

### Is `agent skills vs subagents` a real choice?
No. Subagents are a runtime primitive (a spawned agent with its own context). Skills are a packaging primitive (a capability the agent loads). A subagent invokes skills.

### Is a skill a plugin?
Close but not identical. Anthropic’s `plugin.json` bundles one or more skills into a distribution unit. A skill is one capability; a plugin is a versioned bundle of skills you install as a group. All plugins contain skills; not all skills ship as plugins.

### Where do skills fit relative to workspace state?
The canonical framing assumes a developer-typed-prompt trigger. The extension the current writeups don’t cover: skills that fire on typed workspace state — an object entering a status, a field changing, an event on a graph. Same skill format, different invocation surface. Useful when the agent work is knowledge-work rather than code, and no human sits in the loop for every trigger.
Read next

## Build skills against typed state, not just repos
Maskin runs the same `SKILL.md` format Anthropic ships — against a typed workspace graph instead of a filesystem. Open source under Apache 2.0. Self-host free, bring your own model.
