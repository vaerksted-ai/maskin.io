> Source: https://maskin.io/docs/what-is-a-stateful-orchestration-substrate/

# What is a stateful orchestration substrate? Fixing handoff amnesia in multi-agent pipelines
**A stateful orchestration substrate is a shared, typed store that carries state *between* stateless agents so a pipeline of agents can produce coherent work across handoffs.** Each agent runs fresh, reads what earlier agents wrote, does its job, and writes the result back. The substrate is where the state lives; the agents are where the reasoning happens. Maskin’s typed-object graph — insights, bets, tasks, comments, and typed relationships with statuses — is one shape of it.
> **Key takeaways**
> **Handoff amnesia is a named failure mode.** Each subagent runs in its own context window by design, so state that isn’t written down is lost the moment the session ends.
> **The community named the fix in 72 hours (Aug 25–27, 2026).** Stateless agents, stateful orchestration substrate — RedHat’s phrasing. Five independent sources converged on the same shape in three days.
> **The measurement is brutal.** On LongRCA Bench (1,140 real failed trajectories, five domains, median 145 steps), top diagnostic tools score **13.2%** exact root-step accuracy on long-horizon runs.
> **The shape holds across implementations.** RedHat uses a Kanban board’s zone position; Recuris splits Working + Experiential Memory + Meta-Agent (**+32.2pt** on long-horizon tasks); Empirical, Tencent, ByteDance, and akitaonrails each ship a memory hub in a different geometry. Same primitive: isolation into the agent, state out.
> **Maskin’s typed-object graph is one shape.** Typed and human-readable by default, no distillation layer, statuses ARE the control plane, every write is auditable.

## The problem: handoff amnesia
Multi-agent pipelines lose everything on handoff. Not sometimes — by design. Anthropic’s own subagent documentation is explicit that each subagent runs in “its own context window separate from the main conversation,” so the isolation that makes parallelism safe is the same thing that makes every handoff a lossy compression step.
Empirical named it plainly on Aug 25, 2026, in a post titled *Multi-agent workflows have an amnesia problem*:
Agent 3 does not know what agent 1 discovered. Not automatically. Agent 1’s context, the five files it read, the dead ends it ruled out, the thing it almost got wrong before catching itself, evaporates the moment it returns an answer. All that survives is whatever text made it into the return value.
“Whatever text made it into the return value” is the whole bug. Each handoff is the previous agent guessing what mattered enough to summarise. Everything not chosen is gone. On long-horizon runs the loss compounds: by agent 5, the pipeline is producing coherent-sounding recommendations from partial evidence nobody can reconstruct.
The community stopped calling this a memory problem in August 2026 and started calling it what it is: **handoff amnesia** — a distinct architectural failure mode, not a model deficiency. Fixing it with a bigger context window doesn’t help. The context window belongs to the wrong process.

## The fix pattern in the community’s own words
Five independent sources converged on the same shape in a 72-hour window.
**RedHat, [Aug 26 — “Taming the Agent Beast”](https://www.redhat.com/en/blog/taming-agent-beast-monolithic-prompt-modular-agentic-workflow).** A production Jira triage pipeline in ~200 lines of Python. Each agent session starts fresh; the Kanban board zone position carries the state. Per-ticket independent worktrees. Agents don’t remember each other; the *board* does. Their conclusion, verbatim:
This pattern (stateless agents, stateful orchestration) turns out to be essential for reliability.
**LongRCA Bench (arxiv, Aug 26).** Measures how well diagnostic tools localise which step broke a long-horizon run. 1,140 real failed trajectories, five domains, median 145 steps. Top existing tools score **13.2%** exact root-step accuracy. That’s not “occasional confusion.” That’s “can’t find the failure at all, most of the time.” The proposed RCTA method reached 24.1% — still bad, and still evidence that on long horizons the state isn’t in the agents.
**Recuris (arxiv, Aug 26).** Splits agent memory into Working Memory (progress) and Experiential Memory (skills), with a Meta-Agent that validates memory updates before they land. Reported **+32.2pt** on long-horizon tasks vs. naïve context. The same substrate shape as RedHat’s board, expressed as a memory architecture.
**ZS Associates — “[Why We Killed Our Multi-Agent Pipeline](https://www.youtube.com/watch?v=u6jJcIFDLE4),” AI Engineer.** Pharma analytics pipeline (signal → root-cause → attribution → synthesis) built to mirror the human analyst org chart. Killed. Their post-mortem: don’t mimic the human org with agent-per-role; context handoffs lose semantic weight downstream. Their extension of the substrate frame — **treat the knowledge graph as a *control plane*, not a lookup layer** — is the sharpest version of the argument. The store doesn’t just hold state, it *constrains what the next agent can do*.
**DEV Community, [Aug 27](https://dev.to/rjshree/ai-agents-dont-need-more-intelligence-they-need-better-architecture-90f).** 29-point manifesto whose spine is “State Is More Important Than Chat History” and “Memory Should Be Designed, Not Dumped.” r/AI_Agents landed the same read: “most of our agent problems turned out to be workflow/state problems.”
The structural claim underneath all five: **isolation moves into the agent; state moves out.** Each agent gets a fresh context so it can be spawned in parallel, retried, or swapped without side effects. State that survives across handoffs lives in a typed, queryable, external store — the substrate.

## Maskin as one shape of the substrate
Multiple teams are shipping this primitive in different geometries. Frame them honestly, because each is real work:
- **Empirical** ships a horizontal MCP memory tool any agent can call. Sharpest public description of the amnesia problem; purpose-built server for the fix.
- **[TencentDB-Agent-Memory](https://github.com/TencentCloud/TencentDB-Agent-Memory)** (MIT, ~24.6k stars, +15k monthly) names four canonical memory-asset types — Chat Memory, Skill, LLM-Wiki, Code-Graph — with hierarchical distillation and a unified proxy so multiple frameworks share one hub.
- **OpenViking** (Volcengine/ByteDance, Python, ~33.5k stars, +6k monthly) unifies memory + knowledge RAG + skills as “one substrate” — same shape, different corporate origin.
- **[akitaonrails/ai-memory](https://github.com/akitaonrails/ai-memory)** (Rust, MIT, ~4.8k stars, +3.3k monthly) enables cross-CLI-vendor handoff: quit Claude Code, resume in Codex, keep context — via git-versioned markdown and SessionStart hooks across 15+ CLIs.
- **LangChain Managed Deep Agents — “Own Your Intelligence,” Aug 2026.** Bundles memory, planning, and sub-agent orchestration as a managed layer for teams that want the pattern packaged.
Each of these is a legitimate answer to the same underlying question. None of them is *the* pattern; each is *a shape of* it.
Maskin’s typed-object graph is another shape. The mapping is direct: RedHat’s board → typed object graph; Kanban zones → statuses; ticket → bet. Where the RedHat pipeline reads a JSON worktree file, a Maskin agent reads a typed object and its comments over MCP. Where Recuris splits Working and Experiential memory, a Maskin bet already carries its full path — the insight that informed it, the comments accumulated on it, the tasks it broke into, the driver holding it.
Reuse the [cornerstone’s language](/docs/what-is-an-agentic-workspace/): this is the closed-loop shape (insight → bet → task → shipped → validated) run on one shared object model. What the cornerstone frames as **workspace**, this page frames as **substrate** — same primitive, viewed from the multi-agent-pipeline angle.
What is distinctive about the Maskin shape:
- **Typed and human-readable by default.** No distillation layer. The object an agent writes is the object a human reads. That’s a determinism property — the surface humans debug is the surface agents read.
- **Statuses ARE the control plane.** A bet at `signal` unlocks different next moves than a bet at `define`. ZS Associates’s frame — knowledge graph as *control plane, not lookup* — maps directly: typed relationships and statuses don’t just store, they constrain what an agent can do next.
- **Every write is auditable.** Comments, edits, and status transitions are events. When a downstream agent produces an odd conclusion, the read path is inspectable end-to-end.
- **[MCP-native](/docs/what-is-mcp-native/) surface.** The object model humans see in the UI is the same one agents call over MCP tools — one schema, two clients. See [MCP-native workspace](/docs/mcp-native-workspace/) for the protocol layer, and the [ambient agent workspace](/docs/ambient-agent-workspace/) for the UX-camp cousin to the graph-shaped substrate.

## What the handoff actually looks like
One flow, in the same shape the RedHat pipeline uses. The scenario is the pipeline that produced this docs page: Community Listening → Signal Analyst → Strategist.
Each agent starts fresh. The substrate is what carries the state.
```
// 1) Community Listening finishes its sweep and writes an insight.
//    Its context window vanishes after this call.
create_objects({
  type: "insight",
  title: "Handoff amnesia converges — 5 sources, 72h",
  content: "…full observation, sources, dedup notes…",
  status: "new"
})

// 2) Signal Analyst wakes on a trigger. It reads what landed:
list_objects({ type: "insight", updated_after: "…" })
get_objects({ ids: ["<insight id>"], include: ["content"] })

//    Not a summary the previous agent chose to pass back —
//    the full typed object. Signal Analyst clusters, then stages a bet:
create_objects({
  type: "bet",
  title: "Close the multi-agent handoff amnesia documentation gap",
  content: "…",
  status: "signal"
})
create_relationship({
  source_id: "<insight id>",
  target_id: "<bet id>",
  type: "informs"
})

// 3) A human promotes the bet: signal → define. That trigger wakes
//    the Strategist. It reads the full path the bet took to get here:
get_objects({
  ids: ["<bet id>"],
  include: ["content", "relationships", "connected_objects"]
})
get_comments({ entity_id: "<bet id>" })
list_relationships({ object_id: "<bet id>" })
```
Agent 3 knows what agent 1 discovered — because agent 1 wrote it to the substrate, and the substrate is typed, queryable, and human-readable.
The alternative is passing text summaries back through function return values. That is the compression step that loses information; it is the exact anti-pattern Empirical named.

## When the substrate shape holds — and when it doesn’t
The substrate frame is not always the right shape. Honest limits:
- **Over-engineered for a 3-step scripted pipeline.** If the pipeline is `fetch → transform → write` and every step’s inputs and outputs are fixed, plain function calls are fine. You don’t need a typed object graph to carry state across two return statements.
- **Same for one long-running single-agent loop.** If one agent owns the whole job end-to-end (ZS Associates’s own recommendation for their domain), the substrate is the agent’s own scratchpad plus its harness — not a separate cross-agent surface.
- **The overhead is real at small scale.** Writing typed objects, wiring `informs` edges, and reading `connected_objects` costs a few extra tool calls per handoff. At two handoffs that’s noise. At twenty it’s the reason the pipeline still works.
The value appears at pipeline-of-many-agents scale — long-horizon runs, cross-vendor CLIs, human-in-the-loop gates between agents, or any point where the honest question is *what did the previous agent actually see?*, asked after the fact. That is the shape LongRCA Bench measures. That is where handoff amnesia stops being a nuisance and starts being the reason the outcome is wrong.
The substrate is one primitive in the stack, not the whole stack. Context engineering is the discipline. The **harness** is the layer around a single agent (state, tools, guardrails for one runtime). The **substrate** is what runs a pipeline of agents. All three coexist. LangChain’s Agent Inbox is the queue-shaped cousin to the graph-shaped substrate — same problem (routing agent work to humans), different geometry.

## FAQ

### What’s the difference between a stateful orchestration substrate and agent memory?
Memory typically means what one agent remembers within or across its own sessions — a personal notebook. A substrate is the shared, typed store that multiple agents read from and write to across handoffs. Memory is per-agent; substrate is cross-agent. The two coexist and often overlap in implementation.

### Is this the same thing as a knowledge graph?
A knowledge graph is one implementation. ZS Associates’s frame — treat the graph as a *control plane, not a lookup* — is the sharpest version: typed relationships and statuses don’t just store facts, they constrain what agents can do next. Maskin’s typed-object graph works that way; Kanban boards, Jira worktrees, and versioned markdown wikis are other shapes.

### Do stateless agents lose all context?
Within a session, no — they have their full context window. Across a handoff to another agent, everything not written to the substrate is gone. That is the whole point of the pattern: isolation for parallelism and retry-safety, state externalised so the pipeline survives.

### Why not just pass everything through the return value?
That is the anti-pattern Empirical named on Aug 25. Return values are a compression step — the sending agent picks what to keep, and everything else is dropped. The next agent works from a summary, not evidence. On long-horizon runs the summaries compound into incoherent conclusions; LongRCA Bench’s 13.2% root-step accuracy is the measurement of that compounding.

### How does this relate to Maskin’s [agentic workspace](/docs/what-is-an-agentic-workspace/) positioning?
Same primitive, different angle. The cornerstone describes the shared typed-object graph as a workspace where humans and agents co-operate on the same objects. This page describes the same graph as the substrate a pipeline of stateless agents reads and writes. See also [MCP-native](/docs/what-is-mcp-native/), [MCP-native workspace](/docs/mcp-native-workspace/), and [ambient agent workspace](/docs/ambient-agent-workspace/) for adjacent shapes.
Read next

## Self-host the substrate, bring your own model
Maskin is the typed-object graph shape of the substrate — Apache 2.0, MCP-native, bring-your-own-model. Run it yourself, or take a hosted trial.
