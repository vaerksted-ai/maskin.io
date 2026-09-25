> Source: https://maskin.io/docs/learn/agent-memory-across-sessions/

# Agent memory across sessions: what has to survive between scheduled runs
Agent memory across sessions is the state your agent has to carry from one run to the next, and only three things are worth carrying: **decisions** (what was chosen, and why), **corrections** (what a human changed after the fact), and **artifacts** (what the run actually produced). If your scheduled agent wakes up Monday with no idea what it did Friday, one of those three fell on the floor.
> ✓
> **Key takeaways**
> Scheduled agents forget for a structural reason, not a storage reason. The state they need is split across three kinds of knowledge, and most setups persist none of them.
> The persistence checklist is decisions, corrections, artifacts. Each one fails silently, and each fails differently.
> "Agent memory" as a feature (a vector store you bolt on) and persistence as a constraint (state lives in the substrate the agent runs on) are different designs. Only one survives an unattended run.
> The pattern that carries all three is a shared workspace graph: typed objects an agent reads from and writes to, with loops that hold state between runs.

## Why your scheduled agent forgets by Monday
When an agent that runs on a schedule starts from scratch every morning, three separate things are broken. They usually get diagnosed as one problem, which is why the fix never sticks.
**It does not get smarter.** This is already visible inside a single conversation: teams on r/AI_Agents report that agents forget the original goal by around step 10 and start hallucinating details from step 2. Across runs the floor is lower, because there is no step 11. Run two has no access to run one at all. RedHat's Jira-triage writeup ("Taming the Agent Beast", August 2026) names the pattern and the fix in one line: *stateless agents, stateful orchestration*, and *agents don't remember each other; the board does*. The agents are disposable. The board is not.
**It has no shared context.** The agent that researched on Friday and the agent that drafts on Monday are strangers. Even when both are good at their job, neither can see the other's work. Every run re-derives context that already exists, and re-derivation is where drift creeps in.
**It needs your laptop open.** If the agent only runs when you are at the keyboard, the work stops when you sleep. A schedule that pauses overnight is not a schedule. It is a reminder. The answer to this failure mode is an [ambient agent workspace](https://maskin.io/docs/ambient-agent-workspace/) that keeps running whether or not a window is open.
None of these are model problems. They are harness problems. Memory, tools, permissions, and environment all live in the harness around the model, and the real failures live in the harness too. It is also why memory is a layer of its own, sitting alongside skills, tool bridges, and workflows rather than replacing any of them. For how those layers separate, see [agent skills vs MCP vs cursor rules vs workflows](https://maskin.io/docs/agent-skills-vs-mcp-vs-cursor-rules-vs-workflows/).

## The persistence checklist: decisions, corrections, artifacts
If you want your agent to pick up where it left off, there are exactly three categories of state to persist. Name them and you can audit any agent setup against them in about a minute.

### 1. Decisions
A decision is what the agent chose, plus the reason it chose it. Most setups store the first half and drop the second. Your agent logs "sent the follow-up email," but not "sent it to the tier-2 segment because the tier-1 list was rejected on Tuesday." Next run, it cannot tell a settled choice from an open one, so it either repeats the work or quietly reverses a decision a human already approved. The reason is the part that carries forward. The action is just the receipt.

### 2. Corrections
A correction is the gap between what the agent produced and what a human accepted. This is the most valuable signal in the system, and it is almost always thrown away. When you edit the agent's draft, retitle its ticket, or reject its outreach, you hand it the one piece of feedback it cannot generate on its own. If that edit lives in your head or in a chat window, the next run makes the same mistake at the same rate. A correction that gets written down turns into a rule. A correction that does not, turns into a recurring bug.

### 3. Artifacts
An artifact is the output itself, stored where the next run can find and reuse it rather than regenerate it. The research memo, the drafted ticket, the built page. If run one produced something useful and run two cannot address it, you paid twice for the same work. Artifacts double as the audit trail: they are how you answer "what did the agent actually do last week?" without guessing.
Miss any one of these and the failure stays silent. The run completes, the output looks fine, and the loss only surfaces weeks later, when the agent confidently repeats a settled decision or a correction you made three times never sticks.

## Memory as a feature vs persistence as a constraint
Most "agent memory" products answer the wrong question. They ask *where do we store text?* and answer with a vector database you bolt onto the agent. The question that matters is *what has to survive the run?*, and the answer is a property of the substrate, not an add-on.
The difference is not academic. Chip Huyen, in the vocabulary her AI Engineer Summit keynote formalized, splits agent memory into three tiers: short-term (the context window), long-term (an external store), and internal (the model weights). Long-term is the tier everyone argues about, and it is where the lock-in lives. Mem0 stores vectors, Letta stores agent state blocks, Zep stores graph nodes and edges, and this year added three more shapes: khive (closed-enum SQLite), Graphiti (Pydantic over Neo4j), and growmos (JSONL). Six incompatible formats. Migrating between any two means re-extracting everything.
Simon Willison's complaint points at the same wall from the user's side. In his AI Engineer keynote he described ChatGPT's silent memory feature quietly injecting "Half Moon Bay" into an image prompt, and named the problem as losing control of context. A memory you cannot see is a memory you cannot correct, which is the opposite of what a scheduled agent needs, because correction is item two on the checklist.
So the frame swap is this: stop treating memory as a feature you add to a stateless agent, and start treating persistence as a constraint on the [stateful orchestration substrate](https://maskin.io/docs/what-is-a-stateful-orchestration-substrate/) the agent runs on. When the state lives in the substrate, there is no format to migrate and no context to lose.

## What actually carries persistence: the workspace graph
A substrate that carries all three checklist items has three properties. Maskin's own setup is the working example.
**State lives in typed objects in a shared graph.** Not a text blob, not an embedding you cannot inspect. A decision is a bet with a status. A correction is a comment attached to the object it concerns. An artifact is the object the run produced. Because the objects are typed and connected, the agent reads structure, not a wall of recalled prose. Independent research this year (khive, Graphiti, growmos) landed on the same three ingredients: a typed ontology, typed edges, and provenance on every item. Provenance is what makes a decision auditable later.
**Loops carry the state, not the agent.** A loop is the process, and it holds the cursor, which is what makes it a [closed loop](https://maskin.io/docs/closed-loop-workspace/) rather than a one-shot job. Maskin's go-to-market loop is a live example: it carries 353 in-flight contacts, each one a record whose status is the cursor (`new_lead -> qualified -> ...`), with terminal states for converted, not interested, and rejected. The agents that work those records are interchangeable. The record outlives the run. That is the difference between a process that is record-scoped and one that is run-scoped, and it is why the loop keeps working across weeks with no single agent holding the whole picture.
**It runs without you.** Because the state lives in the shared workspace and not on your laptop, the loop advances while you are away. This is the part chat-shaped tools cannot do: a conversation ends when you close the window, but a loop does not.
Persistence is the point. The workspace graph is what makes it possible, and it is the fourth place agent memory can live, alongside the context window, the external vector store, and the model weights. You can see it, edit it, and correct it, which matters, because correction is item two on the checklist.

## FAQ

### Does Claude Code have memory?
Claude Code has project memory: files such as CLAUDE.md that carry instructions into a session, and a memory tool for managed agents. That is real, but it is memory of instructions and project context, not memory of runs. On its own it does not persist what your scheduled agent decided, what you corrected, or what it produced last Monday. If your scheduled run starts from scratch, the gap is on the run side, not the project side.

### How do agents remember across sessions?
By writing their state somewhere that outlives the process, then reading it back at the start of the next run. That store has to hold three things to work: the decisions made, the corrections applied, and the artifacts produced. Anything less and the agent re-derives context it already had, which is where drift and repeated mistakes come from.

### What state should an agent persist between runs?
Three categories: decisions (what was chosen and why), corrections (what a human changed afterward), and artifacts (the outputs, still addressable). If you can only start with one, start with corrections, because it is the signal the agent cannot generate for itself and the one most setups discard.

### Is a vector database the same as agent memory?
No. A vector database is one storage format for long-term memory, and a useful one for recall. But it holds text, not structure, and it does not carry the status, the provenance, or the audit trail a decision needs. Treating a vector store as "the memory" is the mistake that keeps agents stateless: you can retrieve a paragraph, but you cannot tell whether a choice is settled.
Persistence is not a feature you buy and bolt on at the end. It is a property of where the agent runs, and it is the difference between an agent that improves every week and one that starts over every Monday.

## Persistence is where the agent runs
Maskin carries decisions, corrections, and artifacts on a typed object graph every run reads and writes — so Monday starts where Friday stopped. Open source under Apache 2.0. Self-host free, bring your own model.
