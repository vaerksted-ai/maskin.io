> Source: https://maskin.io/docs/learn/agentic-workflow-vs-closed-loop/

# Agentic workflow vs the closed loop: the third pattern beyond workflow-vs-agent
**An agentic workflow is a predetermined chain of steps with an LLM slotted into one or more of them. An agent is an open-ended, tool-using LLM that decides its own next step. The closed loop is a third pattern: a workflow-shaped container with an entry condition, typed objects, human-taste gates, and a close condition — with agent-execution inside the shape.**

## Key takeaways
The five essentials break down like this:
- **Workflow** = predetermined chain of steps, LLM optional. Cheap, predictable, brittle when the world moves.
- **Agent** = open-ended LLM using tools to decide its own path. Flexible, expensive, hard to audit.
- **Closed loop** = a workflow-shaped structure (entry → typed objects → close condition) with agent-execution slots and human-taste gates. Neither pure workflow nor pure agent.
- The workflow-vs-agent binary comes from Anthropic's [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) and has been absorbed by every enterprise vendor page. It's a useful distinction — but it's not the only choice.
- **When to pick each:** workflow when the path is stable and the reader wants determinism. Agent when the environment shifts faster than any chain can be maintained. Loop when the *outcome* is well-defined but the *path* to it isn't — and the work has to close on something a human can inspect.

## Where the workflow-vs-agent binary comes from
The framing is Anthropic's. In *Building Effective Agents* (Dec 2024), the Anthropic engineering team drew a hard line between two things people were both calling "agents":
- **Workflows** — systems where LLMs and tools are orchestrated through *predefined code paths*. The engineer wrote the topology; the LLM fills in the blanks.
- **Agents** — systems where LLMs *dynamically direct their own processes and tool use*, maintaining control over how they accomplish tasks. The topology emerges at runtime.
That distinction was clarifying, and the industry ran with it. IBM's ["What are Agentic Workflows?"](https://www.ibm.com/think/topics/agentic-workflows), Weaviate's [Patterns, Memory, Use Cases](https://weaviate.io/blog/what-are-agentic-workflows), orkes.io's [Agentic AI Explained: Workflows vs Agents](https://orkes.io/blog/agentic-ai-explained-agents-vs-workflows), IBM's YouTube [Agentic AI: Workflows vs. agents](https://www.youtube.com/watch?v=Qd6anWv0mv0) — every one reproduces the two-pattern framing. Salesforce, Atlassian, Zapier, ServiceNow all speak the same binary. Reddit's r/ExperiencedDevs thread ["What has everyone been building with agentic workflows in ..."](https://www.reddit.com/r/ExperiencedDevs/comments/1r1chos/what_has_everyone_been_building_with_agentic/), sitting at position one on the SERP with over a thousand practitioner clicks, is the same conversation replayed at the ground level.
The framing is not wrong. It's just incomplete.

## What the binary misses
Here is the shape the binary can't describe cleanly: a *structured container* — with an entry event, typed inputs and outputs, and a defined close condition — that contains one or more *open-ended agent-execution slots* and one or more *human-taste checkpoints*. It looks workflow-shaped from the outside because it has structure and closure. It looks agent-shaped inside because the steps aren't predetermined at design time.
That's a **closed loop**, and it's the third pattern.
A loop has five properties the binary flattens:
1. **Entry condition** — a specific trigger that fires the loop (a new insight lands; a bet moves to `shaped`; a customer reply hits the inbox). Not a schedule, not a chat message.
2. **Typed objects** — the loop reads from and writes to first-class objects (a bet, an insight, a piece of content), not free-text chat state.
3. **Agent-execution slots** — inside the shape, agents choose their own path within a bounded scope. The topology is *shaped*, not fully predetermined.
4. **Human-taste gates** — designated checkpoints where a human's judgment is enforced (approve, reject, revise), not requested. The controllability literature ([OpenAI](https://cdn.openai.com/papers/practices-for-governing-agentic-ai-systems.pdf), [Springer's *On Controllability in Agentic AI*](https://link.springer.com/article/10.1007/s11023-026-09783-y)) converges on this pattern.
5. **Close condition** — a falsifiable outcome that terminates the loop. "The agent says done" is not a close condition. "Tests pass", "the editor approved", "the customer replied" are.
A loop is structurally more than a workflow (agent-execution slots inside a shaped chain) and less permissive than an agent (structural bounds on what the loop is allowed to touch). It occupies the middle. The [closed-loop workspace piece](https://maskin.io/docs/closed-loop-workspace/) develops this argument in more depth.
![Three patterns compared: workflow as a linear chain of predetermined steps, agent as open-ended exploration with tool arrows, and closed loop as a shaped container with a typed entry event, first-class objects, an agent-execution slot, a human taste gate, and a falsifiable close condition](agentic-workflow-vs-closed-loop.png)

## The three patterns, side by side
|  | Workflow | Agent | Closed loop |
| --- | --- | --- | --- |
| Entry | Schedule or manual trigger | Prompt / chat message | Typed event on a workspace object |
| Execution mode | Predetermined chain of steps | Open-ended, agent-directed | Shaped container; agent-directed inside slots |
| State | Task queue, run log | Conversation history + scratch | First-class typed objects (bet, insight, task) |
| Review discipline | Optional monitoring | Trust the model | Enforced human-taste gates at named points |
| Close condition | "The chain finished" | "The agent stopped" | Falsifiable outcome tied to the typed object |
| Fails on | Any variation the chain didn't anticipate | Long horizons, ambiguity, cost drift | The trigger firing on the wrong event |
| When it fits | Path is stable, output is deterministic | Environment shifts faster than any chain | Outcome is defined; path to it isn't |
The difference between a workflow and a loop is not "a workflow with an LLM step in it". A workflow with an LLM step is still a workflow: the LLM fills a blank in a chain someone else designed. A loop lets the agent decide *how* to close the condition, and lets a human review the closing, but constrains *what* the loop is allowed to touch.

## What a loop looks like in production
A concrete example from Maskin's own dogfooding — the SEO content loop that produced this article.
- **Entry condition:** a triage agent creates a `content` object at status `proposed` and moves it to `in_progress` after human approval.
- **Typed objects:** the loop reads a knowledge brief (typed `insight`), writes a `content` object (with `primary_keyword`, `content_type`, and body fields), and links both into the loop via `in_loop` edges.
- **Agent-execution slot:** the SEO Writer agent picks the structure, runs SERP analysis via an Ubersuggest MCP, drafts the piece against the quality bar, and links citations. The agent chooses the shape; the agent does not choose the topic.
- **Human-taste gate:** the SEO Editor agent reviews the draft. If it clears, the Editor moves the object to `published`; if it doesn't, it returns with numbered fixes. A human owns the final promotion; the Editor gate is the enforced checkpoint.
- **Close condition:** the piece reaches `published` status with the primary keyword, title, and metadata locked. Not "the writer said it was done." A promoted `content` object with a specific measurable state.
Run that loop against a different trigger and the same shape produces a discovery loop, a competitor-intel loop, a signal-triage loop. The primitives don't change; the trigger and typed objects do. That is what "[loop engineering](https://addyosmani.com/blog/loop-engineering/)" (Addy Osmani, Jun 2026) points at when it says the job shifted from *prompting the agent* to *designing the system that prompts the agent* — but productized as first-class objects a team configures, not code a developer writes.
**Maskin loops carry typed outcomes and verdicts that persist across tools, not recurring workflow execution inside one product.**
The important word is *across*. A workflow inside a ticket tracker terminates when a ticket closes. A loop terminates when the typed outcome it exists to produce — the shipped bet, the approved content, the qualified pipeline — reaches a state a human can inspect, regardless of which tool the underlying work happened in.

## When workflow is fine, when agent is fine, when a loop is the answer
The honest cases for each — not a strawman.
**Pick a workflow** when the path is stable and the desired output is deterministic. Invoice processing, expense categorisation, a well-defined ETL job. Adding an LLM to one node doesn't change the answer; a chain with a slot is still a chain. Zapier, n8n, ServiceNow flows, GitHub Actions all shine here. Do not upgrade to a loop just because the marketing says so.
**Pick an agent** when the environment shifts faster than any chain can be maintained and the cost of unstructured exploration is worth paying. Deep research, code debugging in an unfamiliar repo, browsing tasks with unknown depth. The [Anthropic recursive-self-improvement result](https://www.anthropic.com/institute/recursive-self-improvement) — Claude agents recovering ~97% of a human-researcher performance gap over 800 hours — landed in this regime, with humans holding only the goal and the scoring rubric. Bounded, but open.
**Pick a loop** when the outcome is well-defined but the path to it isn't, *and* the work has to close on something a human can inspect. SEO content production. Sales-cycle qualification. Product-management triage from raw insight to shipped bet. Compliance work that requires audit trails. Anywhere the answer to "is this done?" needs to be a state on a typed object, not "the agent stopped talking." This is where [loop engineering as a discipline](https://maskin.io/docs/what-is-loop-engineering/) earns its keep.
The test is not "how autonomous do I want the AI to be?" The test is: *does the work I'm shaping have a falsifiable outcome, and does that outcome live on a typed object across tools?* If yes, you're building a loop whether you call it that or not. Naming it makes it debuggable.

## FAQ

### What is an agentic workflow?
An agentic workflow is a predetermined chain of steps with an LLM slotted into one or more of them. The engineer writes the topology; the model fills in the blanks. Common shapes are routing (an LLM picks the next branch), tool use (an LLM calls a defined function), and reflection (an LLM critiques its own draft). The path is fixed at design time; the LLM smooths over predictable variation inside it.

### What is agentic workflow in AI?
In AI, an agentic workflow is a system where an LLM directs the routing between steps as well as the work inside them, but the overall chain is still designed by an engineer. It sits between a pure workflow (LLM optional, path predetermined) and an agent (LLM decides its own next step). Anthropic's *Building Effective Agents* is the canonical framing most vendors adopt.

### What makes a workflow agentic?
An LLM-directed decision at more than one step. A workflow with a single LLM node is still a workflow — the LLM fills a predetermined blank. An agentic workflow, as most vendors define it, hands the LLM the routing between steps as well as the work inside them. The wider frame is the closed loop: a shaped container with agent-execution slots and enforced human gates, closing on a typed outcome.

### Agentic workflow vs agent — which should I pick?
Agentic workflow when the path is stable and the output is deterministic, and you want the LLM to smooth over predictable variation. Agent when the environment shifts too fast for any chain to hold, and unstructured exploration is worth paying for. If you need both — a defined outcome *and* a flexible path to reach it — you want a closed loop, not either endpoint.

### What is a closed loop in AI?
A cycle with an entry condition, typed objects the work operates on, agent-execution inside the shape, human-taste gates at named checkpoints, and a close condition that terminates on a falsifiable outcome. Structurally, a workflow-shaped container with agent-driven internals.

### Is agentic AI the same as agentic workflow?
No. Agentic AI is the wider capability — systems that plan, act, and revise using tools. An agentic workflow is one product-shape that capability can take (an LLM-directed chain). A closed loop is a different product-shape of the same capability. They're not synonyms — the workflow is the design surface, the AI is what runs inside it.

### How can agentic workflows be triggered?
Three common patterns: (1) a schedule (cron), (2) a user prompt or chat message, (3) a typed event on a workspace object (a new insight lands, a bet moves to `shaped`, a customer reply hits the inbox). The third is what turns an agentic workflow into a closed loop — the trigger is a state change on data the team already owns, not a message a human had to remember to send.

### Agentic workflow vs MCP — how do they fit together?
MCP is a substrate the workflow runs on, not a competitor. An agentic workflow (or a closed loop) uses MCP to give the agent tools with typed inputs and outputs; agent skills package prompt-time behaviour; cursor rules constrain what a coding agent may do inside an IDE. See [agent skills vs MCP vs cursor rules vs workflows](https://maskin.io/docs/agent-skills-vs-mcp-vs-cursor-rules-vs-workflows/) for the layer map.

### Is a loop the same as a directed cyclic graph?
Structurally, yes — a loop is a directed graph with cycles (retry, revise, wait for human). The frame in this piece is at a higher level: the [three-layer decomposition of harness, loop, graph](https://ttoss.dev/blog/2026/08/08/you-probably-dont-need-a-graph) matters — a loop is the feedback cycle a team designs, the graph is the topology it compiles to. Most teams get more out of investing in the harness and the loop shape than in explicit graph engineering.
Read next

## Run the loop, not just the workflow
Maskin is the MCP-native workspace where a workflow-shaped container carries typed objects, human-taste gates, and a close condition — with agent execution inside the shape. Open source under Apache 2.0. Self-host free, bring your own model.
