> Source: https://maskin.io/docs/learn/agent-orchestration/

# Agent orchestration, agentic loops, and control planes: what the coordination layer actually is — and which one a small team needs
Agent orchestration is the coordination layer between multiple AI agents — the pattern deciding which one runs, when, and how they share state. It sits alongside the *agentic loop* (the shape of one agent's work) and the *agent control plane* (governance around the loops); a small team should model the loop first.
![Agent orchestration, the agentic loop and the control plane as a three-layer stack: loop first, orchestration when work branches, control plane when a second person cares.](/og-image-agent-orchestration.png)
> ✓
> **Key takeaways**
> The market uses three overlapping terms — **agent orchestration**, **agentic loop**, and **agent control plane** — for what is actually one coordination layer with three concerns.
> **Orchestration is a framework problem**: how you wire multiple agents together (LangGraph, CrewAI, AutoGen, the OpenAI Agents SDK, and their peers).
> **The agentic loop is a work-shape problem**: how a single job runs to completion instead of stopping at a single prompt.
> **The control plane is a governance problem**: who let this agent do that, and can we prove it.
> Sequence the layers: model the loop first, adopt an orchestration framework only when work genuinely branches across agents, add a control plane the moment a second person needs to know what the agents did.
> Today's ranking answers are almost all vendor listicles (for orchestration) or enterprise-GRC pitches (for governance). The definitional slot — how the three relate — is unclaimed.

## The three frames, defined
The vocabulary is used interchangeably in the wild, but the concepts are distinct. The shortest useful cut is three items:
1. **Agent orchestration** — the coordination mechanism between multiple agents (handoffs, routing, shared state, error handling). The frame most vendors sell.
2. **Agentic loop** — the shape of the work itself: a bounded cycle of perceive, decide, act, check, and either continue or close. The frame most builders actually operate.
3. **Agent control plane** — the governance layer around the loops and the orchestration: permissions, attribution, audit trail, budgets, kill switch. The frame most compliance teams need.
Read that as a stack, not a menu. A loop is what runs. Orchestration is how many loops fit together when the work branches. A control plane is the surface an operator uses to say *which loops are allowed, run by whom, against what*. Miss one and the other two eventually break: a loop with no orchestration cannot fan out; orchestration with no control plane is unsafe in production; a control plane with no loop is a policy engine wrapped around nothing.

## Orchestration vs loop vs control plane, at a glance
|  | Agent orchestration | Agentic loop | Agent control plane |
| --- | --- | --- | --- |
| Problem it solves | How do multiple agents work together | How does one job run to completion | Who is allowed to run what, and can we prove it |
| Primary buyer | Developer picking a framework | Builder shaping the work | Team operating agents in production |
| Primitive | Graph, DAG, handoff, router | Cycle: perceive → decide → act → check → close | Policy, permission, audit event |
| Typical vendor / project | LangGraph, CrewAI, AutoGen, OpenAI Agents SDK | Anthropic's harness pattern, Claude Code, home-rolled | agentcontrol.dev, IBM watsonx orchestrate, sim.ai, Maskin |
| Failure mode when missing | One agent dead-ends when work needs to branch | Prompt returns a paragraph, not a result | Nobody can answer "who let this agent do that" |
| When it starts to matter | The moment work branches across roles | Always — from agent #1 | The moment a second person cares |
The rest of this piece takes each row in turn, then answers which one a small team needs first.

## Agent orchestration: the framework problem
The search term *agent orchestration* is where most of the informational demand sits — around 1,000 US searches a month at KD 44, with an autocomplete field dominated by comparisons (*vs harness*, *vs workflow*, *vs choreography*, *vs code*) and the biggest ranking page being a DA-37 listicle out-ranking IBM, Redis, AWS, and GitHub (Ubersuggest, 2026-09-18). That tells you two things. The category is real, and it is not yet owned by an authoritative definition — the SERP is still a shortlist of frameworks.
At the level below the search bar, orchestration is a wiring problem. When one agent stops being enough — usually because the job branches (research, then draft, then critique) or because the tool surface is too wide for one context window — you need a mechanism to hand work between agents without losing state. That mechanism is what LangGraph, CrewAI, AutoGen, the OpenAI Agents SDK, and their peers package. Each ships an opinion on how graphs, handoffs, and shared memory should work.
Two clarifications worth making explicit, because the SERP does not:
- **Orchestration is not the same as workflow.** A workflow is a fixed set of steps someone drew ahead of time. Agent orchestration lets the *runtime* decide the path based on what the agents observe. That is what the "graph vs DAG" argument in the frameworks is really about. The workflow side of that split is worked through in [agentic workflow vs the closed loop](/docs/learn/agentic-workflow-vs-closed-loop/).
- **Orchestration is not the same as coordination inside a single agent.** A single agent picking which tool to call is a loop concern, not an orchestration concern. If you find yourself reaching for an orchestrator when one agent with better tool use would do, the loop is what you need to fix first. The simplest single-agent loop is the [Ralph Wiggum loop](/docs/learn/ralph-wiggum-loop/), which reruns one prompt until a stop signal fires.
The practical upshot: pick an orchestration framework when — and only when — work genuinely branches across roles a single agent should not play. Otherwise the framework buys you complexity you have to feed.

## The agentic loop: the work-shape problem
The autocomplete on *agentic loop* is the clearest signal that the buyer knows something the orchestration listicles miss. People search *agentic loop meaning*, *agentic loop engineering*, *agentic loop diagram*, *agentic loop lifecycle*. They are not shopping for a framework, they are trying to model the work. That is the frame Addy Osmani has been driving under the banner *loop engineering*: **a prompt is not a job; work is a loop.**
A loop is the shape of a single job an agent runs. The classic version, adapted from the OODA and control-theory literature, has four moves:
1. **Perceive** — read the current state (a task, a signal, an incoming message, a piece of code).
2. **Decide** — choose the next action against a goal.
3. **Act** — take the action (call a tool, write to a store, hand off to another agent).
4. **Check** — verify the action produced the intended change, and decide whether to continue, iterate, or close.
The check step is what separates a loop from a chatbot. A chatbot returns a paragraph and stops; a loop keeps running until the outcome is verified against a close condition, then reports back. Anthropic's own [harness patterns](/docs/learn/what-is-an-agent-harness/) and the Claude Code agent loop describe exactly this cycle — perceive, act, check, close — because it is what a real agent needs to do work instead of narrate it.
Two things routinely make loops unsafe in practice, and both are structural:
- **No close condition.** A loop with no ceiling on iterations or spend keeps burning until someone notices. A well-shaped loop has a close condition — a specific state that says *the job is done* — before it ever runs.
- **No inspectable state.** If the loop's intermediate work lives only in a hidden scratchpad, nobody can see what happened. The fix is to make each move create or update a typed object, so the whole loop is a trail of real work you can read. This is the argument for a [stateful orchestration substrate](/docs/what-is-a-stateful-orchestration-substrate/) — persistent state as a first-class part of the loop, not an afterthought — and the reason we treat [the workspace itself as the trace](/docs/agent-observability/).
For a small team, the loop is the primitive to model first. You can run a loop with no orchestration framework and no control plane, and it will still be safer and more useful than a hundred single-shot prompts. The design side of this, triggers, checks, stopping conditions and human gates, is covered in [what loop engineering is](/docs/what-is-loop-engineering/). For one loop run over software delivery, with a person on only three decisions, see [agentic SDLC](/docs/learn/agentic-sdlc/).

## The agent control plane: the governance problem
The third frame is the youngest, the softest on the SERP, and the fastest-forming. *Agent control plane* runs at roughly 110 US searches a month at KD 15 — the softest slot of the coordination-layer sweep — and its ranking-page mix is already a category conversation: IBM at position two, a DA-14 property (agentcontrol.dev) at position three positioning itself as "the open-source control plane for AI agents", the humanlayer/agentcontrolplane repo at position four, and a Reddit thread titled *Agent control planes feel like an inevitable category* at position five (Ubersuggest, 2026-09-18). A category is forming faster than the framework listicles have noticed.
A control plane is *not* the loop and *not* the orchestrator. It is the surface an operator uses to answer three questions the loop cannot answer on its own:
- **Who let this agent do that?** Which policy, which permission, which human approval routed the loop's action.
- **Can we prove it?** The audit trail of what the agent did, when, and against which object — inspectable after the fact.
- **What is it allowed to do next?** The permission model that decides which tools, data, and destinations any given agent can touch.
The market's ranking answers to this question are almost all sold to a CISO. The commercial term *ai agent governance* carries the highest CPC in the coordination-layer sweep — $51.65 — because every enterprise-GRC vendor is chasing it (Ubersuggest, 2026-09-18). That framing is real; it is also wrong for a small team. When ten people share a workspace and each of them is spawning agents, the governance surface a small team actually needs is not an SSO/SCIM/SOC2 procurement cycle. It is typed permissions, driver attribution, and an audit trail that lives on the object graph, so a teammate can open the work an agent did and see who let it happen without a compliance ticket. That is what a [self-hosted AI agent control plane for knowledge work](/alternatives/self-hosted-ai-agent-control-plane/) looks like when it is not a GRC platform in disguise, and [AI agent governance for small teams](/docs/learn/ai-agent-governance/) walks the permissions, attribution and audit primitives one by one. Paperclip, the open-source orchestrator built around an org chart of AI employees, ships budgets and approval stages as part of its control plane; the [Paperclip alternative](/alternatives/paperclip/) comparison covers when that fits and when to switch.
One load-bearing distinction sits next to the control plane: the safety literature converges on a *human-in-the-loop* pattern where a human backs the irreversible or taste-driven decisions. The control plane is what makes that pattern real — it is where the loop asks for the human, records the answer, and holds the audit. The deeper piece on [when human in the loop AI is real and when it is theatre](/docs/learn/human-in-the-loop-ai/) works through the honest metric (override rate). For the coordination-layer purpose here, it is enough to say the control plane is the surface the loop uses to reach the human, and the audit lives there when the human answers.

## Which one does a small team actually need?
The listicles cannot answer this question because they are selling one of the three. The honest answer for a small team building with agents in 2026 is a sequence, not a shortlist:
1. **Start with the loop.** Shape one job as a bounded cycle with a close condition, inspectable state, and a place for a human to gate the taste-sensitive move. This works with no framework and no platform. If you cannot cleanly describe the perceive-decide-act-check moves of your first agent, an orchestration framework will not save you.
2. **Add orchestration when work genuinely branches.** The trigger is not "I have more than one agent" — it is "these agents need to hand work between them and share state, and doing it by hand is losing information". Pick the lightest framework that matches your language and runtime. Wire graphs, not DAGs, so the runtime can decide the path.
3. **Add a control plane the moment a second person cares.** Not later. *A second person cares* happens the first time a teammate asks what an agent did overnight, the first time an agent touches production, or the first time the answer to "who let this agent do that" cannot be recovered from a chat log. Do not wait for a compliance ticket.
The order matters because each layer depends on the previous being real. An orchestration graph over unshaped loops is a fast way to produce agents that lose state at every handoff. A control plane over ungoverned orchestration is a policy engine sitting on top of work nobody can trace. Model the loop, coordinate loops when work branches, govern the coordination when someone else has to trust it.
This is why the coordination layer in Maskin is loop-first by design. Every unit of work — an insight, a bet, a task — is a typed object on a shared graph. Agents run bounded loops against those objects, humans gate the moves that need taste, and the workspace itself is the audit trail. Orchestration is a pattern you compose over the same object model rather than a separate framework you fight; governance is a property of the workspace rather than an add-on you procure. The wider frame this belongs to — humans and agents co-operating on the same typed objects — is the [agentic workspace](/docs/what-is-an-agentic-workspace/) the loop lives in, and the argument that the loop is the diagnostic sits in [the closed-loop workspace](/docs/closed-loop-workspace/).

## FAQ

### What is agent orchestration?
Agent orchestration is the pattern for coordinating multiple AI agents — routing tasks between agents, sharing state, handling handoffs, and recovering from errors. In practice it means picking a framework (LangGraph, CrewAI, AutoGen, the OpenAI Agents SDK, or similar) that models the graph of agents and how work flows through it. Orchestration is the *how they fit together* layer, distinct from the shape of the work each agent runs and from the governance around the whole thing.

### What is the difference between agent orchestration and an agentic loop?
An agentic loop is the shape of the work one agent runs to completion — perceive, decide, act, check, close. Agent orchestration is how you coordinate multiple loops when a job branches across agents. A loop can exist without orchestration (one agent, one job), but orchestration without well-shaped loops produces agents that lose state at every handoff. Model the loop first, add orchestration when work genuinely branches.

### What is an agent control plane?
An agent control plane is the governance surface around a fleet of agents. It answers three questions: which agents are allowed to do what, who authorised any given action, and what is the audit trail of what actually happened. A control plane is not a loop and not an orchestrator — it is the layer an operator uses to keep agents running safely once more than one person cares what they did. Enterprise vendors sell it as GRC; a small team needs it as typed permissions plus driver attribution plus an audit trail on the object graph.

### Is agent orchestration the same as workflow orchestration?
No. A workflow is a fixed sequence of steps a human drew ahead of time. Agent orchestration lets the *runtime* decide the path based on what the agents observe — the graph is a set of possibilities the agents choose between, not a straight line. The *vs workflow* comparison shows up all over the autocomplete for *agent orchestration* because buyers are trying to place the new pattern against the older one. Short answer: workflows are static, agent orchestration is dynamic.

### Do I need an orchestration framework to run agents?
No — you need a well-shaped loop. A single agent running a bounded loop with a close condition and inspectable state is often enough to retire real work. Reach for an orchestration framework only when your job actually branches across agents that need to hand work between each other. Otherwise the framework is complexity you have to feed.

### How does an agentic loop work?
An agentic loop runs four moves in a cycle: perceive (read current state), decide (choose the next action), act (call a tool, write to a store, hand off), and check (verify the action produced the intended change). The loop continues until a close condition is met, then reports the outcome. The check step is what separates a loop from a chatbot — a chatbot returns a paragraph and stops; a loop keeps running until the work is done.

### What is the difference between agent orchestration and MCP?
Agent orchestration is how you coordinate multiple agents; MCP (Model Context Protocol) is how any one agent reaches the tools and data it needs. They are complementary, not competing. An orchestrator decides which agent runs next; MCP is the protocol that agent uses to actually do anything. A well-designed system usually has both — MCP as the wire agents use for tools, orchestration as the shape of how many agents coordinate. See [what MCP-native means](/docs/what-is-mcp-native/), and the [MCP tools Maskin exposes](/docs/mcp-tools/) for the concrete tool surface.

## Where to go next
If this piece is the map, the deeper pieces on each frame are the terrain:
- **The loop as the shape of real work.** [The closed-loop workspace: what tier 4 of AI-native work actually is](/docs/closed-loop-workspace/) argues that the loop is the diagnostic — a system either closes or it does not.
- **Governance for small teams, not the CISO.** [Self-hosted AI agent control plane for knowledge work](/alternatives/self-hosted-ai-agent-control-plane/) names the small-team surface directly; [AI agent governance for small teams](/docs/learn/ai-agent-governance/) goes deeper on permissions, attribution, and audit.
- **The OSS landscape, honestly categorised.** [Self-hosted AI agents in 2026](/alternatives/self-hosted-ai-agents/) is the map of who is actually shipping what across orchestration, loops, and control planes.
- **The observability side.** [Agent observability: when the workspace is the trace](/docs/agent-observability/) — because the object graph you run loops on is also the trace an operator reads.
- **Packaged capability.** [What are agent skills?](/docs/learn/agent-skills/) covers the SKILL.md primitive an agent invokes inside a loop, and how it differs from tools, prompts and workflows.
The frame we start from at Maskin: **a prompt is not a job — work is a loop.** Orchestration is a pattern you compose over loops when work branches. A control plane is the governance surface once a second person cares. Model the loop first; the rest of the coordination layer earns its keep from there.
Read next

## Model the loop first
Maskin is loop-first by design: every unit of work is a typed object, agents run bounded loops against it, humans gate the calls that need taste, and the workspace is the audit trail. Open source under Apache 2.0. Self-host free, bring your own model.
