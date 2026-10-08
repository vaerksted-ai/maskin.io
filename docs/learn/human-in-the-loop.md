> Source: https://maskin.io/docs/learn/human-in-the-loop/

# Human in the loop: the approval gate before side-effecting tool calls
**Human in the loop, in 2026, means an approval gate before an AI agent’s side-effecting tool call.** The agent pauses, a person approves or rejects, and only then does the tool fire. Four vendors — OpenAI, Cloudflare, Microsoft, Temporal — shipped the primitive under nearly identical names in the last twelve months.
If you build agents that touch the outside world, this is the contract your users will expect. “Human in the loop” used to describe a person labeling training data; it now describes a runtime gate inside your agent code. This piece walks the four vendor primitives, what the shared contract is, and what a workspace-shaped version of the same gate adds on top — the part where the approval is recorded next to the work it approves, not just resolved in memory.
> ✓
> **Key takeaways**
> **The phrase means something new.** In 2026, “human in the loop” means an approval step before a side-effecting tool call, not a person labeling training data. The vocabulary shifted with the agent stack.
> **Four major vendors converged on the same primitive in twelve months.** OpenAI’s `needs_approval`, Cloudflare’s `waitForApproval()`, Microsoft’s `RequestPort`, Temporal’s signal-based approval — four SDKs, one contract: pause the agent, surface the pending action, wait for a person, then resume or cancel.
> **The contract is: stop, surface, wait, resume.** Every agent framework that ships approvals ships some version of these four moves. If yours doesn’t, buyers who have used any of the four will notice.
> **Approval is not the same as record.** An SDK gate resolves an approval; a workspace-shaped gate records it. The decision, the reason, and the person who made it survive the session that produced them — because the next auditor, the next agent, or the next you will need to reconstruct why.
> **Design per action class, not per system.** Read a doc, no gate. Send an email, gate. Move money, gate with a second reviewer. Uniform gates on everything collapse into rubber-stamping; ungated on everything shifts risk into your users’ inboxes.

## What “human in the loop” means in 2026
Open the docs for any major agent framework shipped in the last twelve months and search for “human in the loop.” You will find the same story told four different ways: the agent proposes a tool call that would do something in the real world — send an email, run a shell command, transfer money — and the SDK pauses the run, hands the pending call up to the calling application, and waits for a person to approve or reject before the tool actually fires. The phrase used to point at data labeling. It now points at approval gates.
The reason the meaning moved is that the underlying job moved. Until about 2024, “human in the loop” was a machine-learning phrase — the human in the loop was a labeler correcting model outputs so the next training run would be a little less wrong. It was slow, offline, and shaped by the training cycle. What builders need in 2026 is different. Agents now take actions in production, live, on user data. The gap between the model’s decision and the world’s state is a tool call, and that tool call needs a stop-and-check before it commits when the blast radius is bigger than a bad guess.
So the SDKs added the stop-and-check. That’s what “human in the loop” now describes for anyone building on the current agent stack: not offline labeling of training data but an inline pause in front of side-effecting tool calls at runtime. Both meanings exist in the wild; the current SDK-shaped meaning is the one that shows up in your codebase and in your buyer’s expectations.
A more careful read of when the gate belongs there and where the related “human on the loop” pattern picks up sits in the [human in the loop vs human on the loop](/docs/learn/human-in-the-loop-ai/) piece — that page carries the HOTL/HITL vocabulary cut and the EU AI Act Article 14 read. The rest of this page stays on the SDK-primitive contract and what a workspace-shaped version of the gate adds on top.

## Four vendors, four APIs, one primitive
Here is the SDK vocabulary the four major agent frameworks have converged on, all inside the last twelve months.

### OpenAI Agents SDK — `needs_approval`
OpenAI’s Agents SDK ships a `needs_approval` flag you attach to a tool (or a function that returns one at runtime). When the agent tries to call the tool, the run halts, the current `RunState` is serialized so the run can be resumed later, and the caller receives a list of tool-approval items. The application decides whether to approve or reject each one, then resumes the run with the decisions attached. Approvals are first-class run interruptions, not middleware.

### Cloudflare Agents — `waitForApproval()`
Cloudflare’s Agents runtime exposes `waitForApproval()`, an async primitive an agent (or MCP tool) can call at the point in its work where a decision is needed. The runtime persists the pending request against the durable object that owns the agent, resumes when an external system posts the decision back, and treats the wait as an ordinary suspension. Cloudflare pairs this with MCP elicitation for the same shape at the protocol level, and Code Mode approvals for gating generated code before it executes.

### Microsoft Agent Framework — `RequestPort` / `RequestInfoEvent`
Microsoft’s Agent Framework models the gate as a `RequestPort`: a typed input the workflow declares it needs, which the runtime turns into a `RequestInfoEvent` when the agent hits that point. The event goes up to the host application, which fulfills it — with a person’s approval, or a machine-supplied answer — and the workflow continues from where it paused. The type of the request is part of the contract, so approvals can carry structured payloads and not just yes/no.

### Temporal — signal-based approval
Temporal doesn’t ship an “approval” primitive so much as it re-uses its existing one: a signal. An approval-gated workflow enters a wait state, a signal handler receives the human’s decision, and the workflow resumes. Because Temporal workflows are durable by construction, the wait can last minutes or weeks with the same code — the state survives process restarts, deploys, and machine failures.
Four SDKs, four names, the same primitive underneath: **stop the agent, surface the pending action to a caller, wait for a decision, then resume or cancel.** The differences are ergonomic — flag vs function vs typed port vs signal — not architectural. The convergence is the interesting part: two years ago none of these existed by name; twelve months ago maybe one did; today all four do, and their docs describe them in almost interchangeable language.

## The approval-gate contract buyers now expect
Because the primitive has converged, so has the buyer expectation. A team evaluating your agent product in late 2026 has probably prototyped against at least one of the four SDKs above. When they look at how your product handles a risky action, they’re testing whether it does the four moves the SDKs already ship:
- **Stop.** The agent halts before the side-effecting call, not after. “We’ll audit it afterward” isn’t the same feature.
- **Surface.** The pending action is visible somewhere a human can see it — with enough context to decide, not just a yes/no button on an opaque payload.
- **Wait.** The pause can outlast the model’s context window, the caller’s browser tab, and the reviewer’s lunch break. Approvals that expire silently are worse than no approvals.
- **Resume or cancel.** The decision resolves the pause deterministically; the agent picks up exactly where it paused, or the action is cleanly dropped. No half-committed state.
If your product does the four moves, you’re speaking the language the buyer already knows. If it doesn’t, the conversation stalls at “how does approval work?” and doesn’t get to your differentiator.
The reason to name the vendor primitives explicitly is that this is now the market’s vocabulary. Positioning a competing gate as “like `needs_approval`, plus X” or “we call `waitForApproval()` under the hood, and here’s what we do with the pending request” moves faster than trying to re-invent the vocabulary. The SDK contract is the shared floor. What matters is what you build above it.

## What a workspace-shaped gate adds
The SDK primitives all resolve an approval — they pause, they hand off, they resume. They do not, on their own, record the decision anywhere the next auditor, the next agent, or the next you can find it a week later. That gap is where a workspace-shaped gate does its work.
**Maskin loops carry typed outcomes and verdicts that persist across tools, not recurring workflow execution inside one product.**
That sentence is the whole difference in one line. The SDK gate lives inside one agent’s runtime; the workspace-shaped gate lives on a shared object that survives the runtime. When Maskin’s `needs_input` notification pauses a loop for an approval, the pending decision is a comment on the object the loop is acting on — the bet, the content piece, the outbound message. The person who approves it does so against that object; the approval, the reason, and the person land as an event on the same object. Six months later, someone reading that object sees not just what shipped but who said yes, when, and why.
That’s a shift from **transient approval** to **persistent verdict**. Concretely, four things change:
- **The decision is recorded next to the work it approves.** Not in a log the reviewer will never open. On the object itself, in the same feed as the transitions the approval unblocked.
- **The reason survives the session.** Because the approval carries structured metadata — attention, decision options, who was mentioned — the *why* is legible after the person who wrote it has moved on.
- **The next agent can read the verdict.** A downstream agent that acts on the approved object can query the approval event the same way it queries any other state. The approval is not model-visible only at the moment of the pause; it is graph-visible forever.
- **The audit is a query, not a rebuild.** “Show me every send-message that a human approved in the last month, and who approved it” is one filter on the events table, not a log-scraping project.
On a single-vendor SDK the same information exists but scattered — some in the run trace, some in the callback that resolved the approval, some in whatever the caller chose to persist. A workspace shape doesn’t replace the SDK primitive; it gives the approval a place to live once the run is over. The typed object graph, in this cut, is the store the approval is written to; the SDK is the runtime that surfaces it.
The deeper architecture write-up sits in the [ambient agent workspace](/docs/ambient-agent-workspace/) piece, which walks the graph-shaped alternative to the chat-shaped agent inbox. The governance side — how approvals compose with typed permissions and the audit trail — is in [AI agent governance for small teams](/docs/learn/ai-agent-governance/). The developer-register substrate reference is [the stateful orchestration substrate](/docs/what-is-a-stateful-orchestration-substrate/).

## How to design an approval gate that’s actually useful
Having the primitive isn’t enough. The gate has to be applied to the right actions, in the right shape, or it becomes decoration. Four design moves that separate a real approval gate from a compliance sticker.

### 1. Gate the material call, not the model call
The thing that needs approval is the tool call that changes the world — the email being sent, the payment being moved, the record being deleted. Not the LLM inference that decided to propose it. Model reasoning without a side effect is reversible by definition; the side effect is not. Wire the gate on the tool, not on the agent’s reasoning step.

### 2. Give the reviewer enough context to actually decide
A reviewer clicking approve on a payload they can’t evaluate is worse than no reviewer at all — you get the appearance of oversight and none of the substance. When you surface a pending action, surface with it: the intent (what the agent said it was doing), the payload (what will actually happen), the object the action touches (so the reviewer can see the surrounding work), and the blast radius (who it affects and whether it’s reversible).

### 3. Design per action class, and set the tier once
The worst pattern in production HITL is the one where every action gates identically. Read-only calls gate the same as sends; low-blast-radius drafts gate the same as billing changes. The queue gets deep, the reviewer’s context gets thin, and the approval rate collapses toward reflexive yes. Tier the action classes up front: autonomy for low-stakes reads, sampled review for bulk actions, per-call approval for irreversible or high-blast-radius operations. Enforce the tier at the platform layer, not inside agent code — an agent that sets its own approval tier is signing its own permission slip.

### 4. Make the approval an event on the object, not a modal on the screen
Approvals routed through modals in a browser tab die when the tab closes. Approvals routed through a typed object survive the tab, the session, the person who was on-call. The reviewer’s decision is another transition on the object, with an actor id and a timestamp — the same shape as every other state change. That’s what makes the approval queryable a month later.

## When the SDK-primitive is enough — and when it isn’t
The honest scope of the SDK-primitive gate is single-vendor, single-run, in-session. That’s plenty for a lot of jobs — a prototype agent, a single-purpose tool with a small user base, a script an engineer runs and watches. If you don’t need to audit the approval later, don’t need to compose it with other approvals, and don’t need it to survive a session restart, the SDK primitive is the whole answer.
The places it stops being enough are the places the workspace shape matters:
- **Long-lived work.** An approval that needs to wait a week for the right person survives the process; the SDK’s in-memory pause usually does not (Temporal is the exception — signals are durable by construction).
- **Cross-agent work.** A downstream agent that needs to know the approval happened has no path to the SDK’s callback. It needs the approval as a fact on a shared object.
- **Multi-tool work.** The team’s Ops agent runs on Temporal, the Sales agent on OpenAI’s SDK, the internal tool on Cloudflare Agents. The approvals from each shouldn’t live in three incompatible run traces if the underlying business is one thing.
- **Audit and compliance work.** “Who approved that send, and when?” is a legitimate question a year later. The SDK’s per-run callback is not built for that horizon.
A useful mental model: SDK primitives are the runtime; a workspace-shaped store is the record layer. Both exist together in a production system. You don’t rip out `needs_approval` to use Maskin; you keep it, and you write its resolutions to the typed object the loop is acting on, so the run and the record aren’t the same thing. How persona-level autonomy dials compare with [per-action gates](/docs/composable-ai-agents-vs-ai-employees/) is the adjacent question.

## FAQ

### What does “human in the loop” mean in 2026?
In 2026, human in the loop means an approval step in front of an agent’s side-effecting tool call. The agent proposes an action, the SDK pauses the run, a person approves or rejects, and the run resumes or cancels. The older meaning — a person labeling training data — still exists but is not what agent-framework docs describe when they use the phrase now.

### What’s the difference between “human in the loop” and “human on the loop”?
Human in the loop puts the person inside the transaction: nothing ships until they approve. Human on the loop puts the person above it: the agent runs, and the human supervises through review surfaces and escalation gates rather than per-action approval. The two fail differently, and most production systems use both — HOTL for bulk reversible work, HITL for irreversible or high-blast-radius actions. The vocabulary and the failure-mode differences are covered in detail in the [human in the loop vs human on the loop](/docs/learn/human-in-the-loop-ai/) piece; this page stays on the SDK-primitive contract.

### Which agent frameworks ship an approval primitive?
As of late 2026: OpenAI Agents SDK (`needs_approval` with resumable `RunState`), Cloudflare Agents (`waitForApproval()`, plus MCP elicitation and Code Mode approvals), Microsoft Agent Framework (`RequestPort` / `RequestInfoEvent`), and Temporal (signal-based approval on durable workflows). Four vendors, four API shapes, one underlying contract. Workflow engines ship the same idea: [n8n’s human-in-the-loop for tools](/alternatives/n8n/) pauses a tool call inside a workflow, which the n8n comparison sets against a gate attached to the object.

### Do I still need a workspace if my SDK already has approvals?
Depends on how long the approval needs to matter. If the whole audience for the decision is the code that resumes the run, the SDK primitive is the whole answer. If the decision needs to be discoverable a week later, composed with other approvals, or read by a different agent, the SDK is the runtime and you need a record layer above it — the object the approval was made about, with the approval landing as an event on it.

### What is a side-effecting tool call?
A tool call that changes state outside the agent — sends an email, hits an external API, writes to a database, moves money, deletes a record. The distinction that matters for approvals is reversibility: side-effecting calls change the world; the agent’s own reasoning does not, until it decides to call one of them.

### Where does a workspace-shaped gate fit alongside the SDK primitive?
It sits above it. The SDK handles the runtime pause; the workspace records the decision as a durable fact on the object the action was about — who approved, when, why, in the same feed as the transitions the approval unblocked. That verdict then travels with the work: the next agent, the next auditor, and the next you can all read it a week or a year later, without asking the run trace it came from.

## Sources
**External (vendor documentation, primary sources, 2026-09-25):**
1. **OpenAI Agents SDK, human-in-the-loop guide** — `needs_approval`, `RunState`, resumable interruptions. [openai.github.io/openai-agents-python/agents/#human-in-the-loop](https://openai.github.io/openai-agents-python/agents/#human-in-the-loop).
2. **Cloudflare Agents, human-in-the-loop** — `waitForApproval()`, durable-object suspension, MCP elicitation. [developers.cloudflare.com/agents/api-reference/human-in-the-loop](https://developers.cloudflare.com/agents/api-reference/human-in-the-loop/).
3. **Microsoft Agent Framework, request-response workflows** — `RequestPort`, `RequestInfoEvent`. [learn.microsoft.com/en-us/agent-framework/tutorials/workflows/human-in-the-loop](https://learn.microsoft.com/en-us/agent-framework/tutorials/workflows/human-in-the-loop).
4. **Temporal, signal-based human approval** — durable workflow signals. [temporal.io/blog/human-in-the-loop-with-temporal](https://temporal.io/blog/human-in-the-loop-with-temporal).
Read next

## Give the approval a place to live
Maskin is the open-source, MCP-native workspace where the approval gate is a first-class transition on a typed object — the decision recorded next to the work it approves. Apache 2.0, self-hostable, EU/US data residency.
