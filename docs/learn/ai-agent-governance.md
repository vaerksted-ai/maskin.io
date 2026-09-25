> Source: https://maskin.io/docs/learn/ai-agent-governance/

# AI agent governance for small teams: permissions, attribution, and the audit trail as workspace properties
AI agent governance is the set of practices that make agent actions attributable, permissioned, and auditable. For small teams, it means typed permissions on agent identities, first-class driver attribution on every action, and an audit trail that lives on the same object graph the work does — not enterprise SSO or SOC 2.
"Who let this agent do that, and can we prove it?" That is the AI-agent governance question small teams actually face in 2026 — and every ranking answer to it sells you SSO, SCIM, RBAC, and SOC 2 at enterprise altitude. That framing isn't wrong; it's just not the shape of the problem when your team is five people and two loops. This guide walks the small-team cut: governance as *workspace properties* — typed permissions, driver attribution, and an audit trail that lives on the same object graph the work does.
> ✓
> **Key takeaways**
> **Governance is not the same problem as enterprise GRC.** GRC (SSO/SCIM/SOC 2) answers "can we sell to Fortune 500?" Small-team governance answers "can I query who did what?" You can need the second long before the first.
> **Every agent is a first-class actor.** Not a service account belonging to a human. An agent identity carries its own permissions and shows up as the driver on every action it takes — the same way a human user does.
> **Permissions are typed and attached to actors, not to features.** "Can send LinkedIn DMs," "can promote a lead to a rep," "can validate a knowledge page." Sentence-shaped, granular, revocable in one click.
> **The audit trail is the object graph.** Every status transition, every metadata write, every relationship added is an event with an actor attached. Query "what did this agent do last week" the same way you query "which files did this user open."
> **The gate that matters is the material call, not the model call.** Sending a DM, promoting a lead, publishing a page — those are the transitions that need a governance answer. Model reasoning inside a session doesn't.

## Governance in three primitives
The three primitives of small-team agent governance are:
1. Actors as first-class identities, not human-owned service accounts.
2. Sentence-shaped permissions, granted per action and revocable in one click.
3. An audit trail that lives on the same object graph as the work.
Each is unpacked below — first the framing, then the three primitives in depth, then how they answer real operator questions.

## Why the enterprise framing is the wrong altitude
Open any current governance page on the top-10 SERP for `ai agent governance` and you'll see: SSO, SCIM, RBAC, SOC 2 / HIPAA, encryption at rest, DLP, procurement checklists. All of that is real. None of it answers the small-team question, which is closer to: an agent just posted something the customer noticed. Can I find out which agent, which prompt, which permission it had, and roll back that permission before the next similar action?
The enterprise stack answers this eventually, but only after you've spent procurement cycles buying the layers that make it answerable. Small teams get there faster by treating governance as a *product* concern from day one — permissions, attribution, and audit are properties the workspace has, not features you buy.
One empirical anchor is worth naming: per Guardrail Technologies' 2026 audit of all 503 S&P 500 10-K filings (surfaced in Cassie Kozyrkov's [Sep 2026 Decision Intelligence roundup](https://decision.substack.com/p/97-of-s-and-p-500-filings-mention)), 97% of filings mention AI, only 16% document an AI-specific cyber-risk process, fewer than 5% describe a governed program with a named policy or committee, and only 21% document governing non-human identities. Enterprise governance itself is undercooked; the small-team gap isn't that small teams are behind, it's that no one has answered this question well at any altitude.

## The three primitives in depth

### 1. Actors, first-class
An agent identity is an actor — the same primitive as a human user, with its own id and its own permissions. Not a service account owned by a human; a first-class entry in the actor table. Two consequences:
- **Every action carries the acting actor's id.** When a loop's Prospector agent creates a `bet`, the driver on that bet is the Prospector agent. When it changes a contact's status, the transition event carries the Prospector's id. Not "created by the automation"; created by *this* actor.
- **Retiring an agent is one revocation, not a hunt.** Delete an agent actor, or flip it to `deactivated`, and every trigger it was attached to stops firing under its identity. No orphaned automations.
The practical test: pick any object in your workspace and ask, "who drove the last five transitions on this?" The answer should be five actor ids — some human, some agent — each with a name you can click on and a permission list you can read.

### 2. Permissions, sentence-shaped
Permissions belong to actors and are named in the shape of an action, not a feature.
- "Can send messages via `linkedin-unipile.mcp`"
- "Can transition a `contact` from `qualified` to `promoted_to_rep`"
- "Can move a `knowledge` object to `validated`"
- "Can install a marketplace loop"
Sentence-shaped permissions read like the audit trail you'll want later; feature-shaped permissions ("can access Sales module") don't. Grant the smallest set that lets the agent do its job. If the Prospector needs to draft outreach but never send, its permission list includes drafting and excludes `send_message` — the send trigger belongs to a Sender identity with a narrower grant.
One useful default: material calls (sending, publishing, spending money, changing customer state) live on their own permission per surface. That way revoking one integration or one workflow is a targeted action.

### 3. Audit trail on the object graph
Audit is not a separate log. Every state transition on every object is an event. Every event has: the object, the field that changed, the before and after value, the actor, the timestamp, and (if applicable) the trigger that fired it.
What this buys you:
- **Per-object history in place.** Open any object; scroll the event feed on it. You see who touched it, when, and what changed — without leaving the object.
- **Cross-object queries.** "All contacts where the Prospector drafted outreach in the last week" is a `get_events` filter, not a report you have to build.
- **Rollback with attribution.** When a transition was wrong, the fix is another transition — same shape, another actor. Nothing is quietly overwritten.

## How this maps to real questions

### "An agent did something I didn't expect. Where do I look?"
Open the object it acted on. The event feed shows the transition with actor + trigger id. Click the actor — see its permission list. Click the trigger — see what fired it and with what config. If the answer is "the permission was wrong," revoke it in one click. If the answer is "the trigger's config drifted," edit the trigger. If the answer is "the model reasoned poorly," the drift is in the prompt or the model, not the governance layer — which is itself a useful finding.

### "How do I stop everything, right now, if a customer is affected?"
Loop-level `paused`. Every loop has a status; flipping the loop's status to `paused` disables every trigger that references it. On the trust ladder this is a rung reachable from any other rung. One click, cascading effect, reversible.

### "How do I graduate an agent's trust?"
Override rate. Look at the transitions the agent proposed vs the ones the human accepted, edited, or rejected. When the ratio crosses a threshold you set, the loop's trust rung can move — fewer transitions gated, same audit trail. The number is a query over events, not an aggregate dashboard.

### "What about the enterprise checklist — SSO, SCIM, SOC 2?"
Not the same question. Those are procurement-shaped: they let a Fortune 500 buy from you. Small-team governance is *operator-shaped*: it lets a five-person team run agents in production without losing track. Small teams generally need the operator answer first and the procurement answer when a specific customer needs it. Ship the loop; add SSO the day the deal requires it.

## The mapping to Maskin
Maskin's implementation of the primitives above:
- **Actors:** humans and agents are both entries in the actor table. Every `driver`, every comment, every event carries an actor id. `list_actors` returns them all.
- **Permissions:** attached to actors, granted per surface (MCP servers), per object-type transition, per admin action. Revocations are events themselves — you can see "the permission was removed at 14:22 by user X."
- **Audit trail:** the events table on every object. `get_events` queries it directly; the event feed on every object renders it inline.
- **Loop pause:** every `loop` has a status; `paused` is a rung reachable from any other rung and disables all attached triggers. Read the runtime set with `get_workspace_schema`.
The governance surface is Apache-2.0 and self-hostable, so the audit trail runs where your other data does. That matters if compliance ever escalates to procurement altitude — you didn't build the operator answer on a substrate that has to be replaced when the enterprise checklist arrives.

## FAQ

### What is AI agent governance?
The set of practices that make agent actions attributable, permissioned, and auditable. At small-team altitude: typed permissions on agent identities, first-class attribution on every action, and an audit trail that runs on the same graph the work does. At enterprise altitude: additionally, SSO/SCIM, SOC 2 / HIPAA, and formal risk documentation. Both are governance; they answer different scoping questions.

### Is AI agent governance the same as an agent control plane?
Overlapping, not identical. A control plane is the operator surface that runs a fleet of agent sessions. Governance is the set of properties (permissions, attribution, audit) that make that surface trustworthy. A control plane without governance is a nice dashboard; governance without a control plane is a policy without a surface to enforce it on.

### How is this different from enterprise AI governance?
Enterprise AI governance (as pitched by IBM, sim.ai, and the SOC-2/HIPAA cohort) starts from procurement requirements and works backward to controls. Small-team governance starts from operator questions ("who did what") and works up to controls only as they become load-bearing. Same word, different starting points — pick the one that matches your headcount and your current customer set.

### Do I need governance if I only run one agent?
Yes, but only the operator half. First-class actor id, sentence-shaped permissions, event history on every object. That's enough to answer "what happened" long before you have compliance pressure. Skip it and you'll add it later, painfully, with holes in the audit trail from before the switch.

### What's non-human identity governance?
The practice of treating agents (and other automated actors) as first-class identities with their own credentials, permissions, and audit trails — not as service accounts that inherit from a human. It's the same idea this guide names; enterprise-security vendors use the "NHI" acronym. Per Guardrail Technologies' 2026 audit of the S&P 500 10-Ks, only 21% of the filings describe governing non-human identities specifically — the gap between mentioning AI (97%) and governing it as an actor is large at every altitude.

### What is a good AI agent audit trail?
One with these properties: every action has an actor id (not "the system"), every state change is an event (not a log line), events live on the object they mutated (so you can find them by opening the object), and permissions are themselves events (so revocations are auditable). If any of those is missing, you'll hit the wall when someone asks "who did that."
Read next

## Governance as a workspace property
Maskin gives every agent a typed identity, attributes every action to a driver, and keeps the audit trail on the same object graph the work lives on. Open source under Apache 2.0. Self-host free, bring your own model.
