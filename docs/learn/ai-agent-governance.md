> Source: https://maskin.io/docs/learn/ai-agent-governance/

# AI agent governance for CTOs: permissions, attribution and an audit trail you can query
AI agent governance is the set of controls that make every agent action attributable, permissioned and auditable. For a CTO running agents across several teams, it comes down to three checks: each agent has its own identity, each permission covers one action, and every change lands in an audit trail attached to the work.
[Book a meeting](https://calendar.app.google/r4v9xQp9S2p3TVFq5) Bring one agent you run today and we will show where its permissions and audit trail sit in Maskin.
You are the person who gets the call when an agent sends the wrong thing to a customer. The first question is always the same: who let it do that, and can we prove it? Most pages that rank for this answer a CISO's procurement question: SSO, SCIM, RBAC, SOC 2. This guide answers the engineering leader's version. Can you find the agent, the permission and the change in minutes, and switch the permission off before the next one? It also gives you six questions to put to any platform, ours included. Governance is the third layer of the coordination stack; the other two, the loop and orchestration, are laid out in [how orchestration, loops and control planes fit together](/docs/learn/agent-orchestration/).
> ✓
> **Key takeaways**
> **Governance is not enterprise GRC.** GRC (SSO, SCIM, SOC 2) answers "can we sell to a Fortune 500?" Operator governance answers "can I find who did what, and stop it?" You need the second long before the first.
> **Every agent is a first-class actor.** Not a service account that belongs to a person. The agent has its own permissions and shows up as the driver on every action it takes, the same way a human user does.
> **Permissions are named after actions, not features.** "Can send LinkedIn messages", "can promote a lead to a rep", "can validate a knowledge page". Granular, and revocable in one step.
> **The audit trail is the object graph.** Every status change, metadata write and new relationship is an event with an actor attached. "What did this agent do last week" is a query, not a project.
> **Gate the material call, not the model call.** Sending a message, promoting a lead, publishing a page: these transitions need a governance answer. The model's reasoning inside a session does not.

## Governance in three primitives
The three primitives of operator-level agent governance are:
1. Actors as first-class identities, not service accounts owned by a person.
2. Permissions named after one action each, granted per action and revocable in one step.
3. An audit trail that lives on the same object graph as the work.
Each is unpacked below, followed by a pre-flight check you can run before any agent gets write access, an illustrative incident walked end to end, and the answers to the questions engineering leaders ask most.

## Why the CISO framing is the wrong starting point for a CTO
Open any current governance page in the top ten for `ai agent governance` and you will see SSO, SCIM, RBAC, SOC 2 and HIPAA, encryption at rest, DLP and procurement checklists. All of that is real. None of it answers the question you get after an incident: an agent just posted something the customer noticed. Can I find out which agent, which trigger, which permission it had, and revoke that permission before the next similar action?
The enterprise stack answers this eventually, but only after you have spent procurement cycles buying the layers that make it answerable. You get there faster by treating governance as a property of the workspace from day one: permissions, attribution and audit are things the workspace has, not features you buy later.
One empirical anchor: per Guardrail Technologies' 2026 audit of all 503 S&P 500 10-K filings (surfaced in Cassie Kozyrkov's [Sep 2026 Decision Intelligence roundup](https://decision.substack.com/p/97-of-s-and-p-500-filings-mention)), 97% of filings mention AI, only 16% document an AI-specific cyber-risk process, fewer than 5% describe a governed program with a named policy or committee, and only 21% document governing non-human identities. Enterprise governance itself is undercooked. The gap is not that your company is behind; nobody has answered this question well at any altitude. Open-source orchestrators are starting to build it in: Paperclip documents budget hard stops by company, agent and project, plus approval stages and an activity log, and the [Paperclip alternative](/alternatives/paperclip/) page sets that against a typed-object workspace and says when to stay on Paperclip.

## The three primitives in depth

### 1. Actors, first-class
An agent identity is an actor: the same primitive as a human user, with its own id and its own permissions. Not a service account owned by a person; a first-class entry in the actor table. Two consequences:
- **Every action carries the acting actor's id.** When an agent creates a task, the driver on that task is that agent. When it changes a contact's status, the transition event carries that agent's id. Not "created by the automation"; created by *this* actor.
- **Retiring an agent is one revocation, not a hunt.** Delete an agent actor, or flip it to `deactivated`, and every trigger it was attached to stops firing under its identity. No orphaned automations.
The practical test: pick any object in your workspace and ask "who drove the last five transitions on this?" The answer should be five actor ids, some human and some agent, each with a name you can click on and a permission list you can read. It is the same record a team keeps after a multi-agent run, which is where [Claude Code agent teams](/docs/learn/claude-code-agent-teams/) end up: owners, decisions with reasons, and outcome checks.

### 2. Permissions, one action each
Permissions belong to actors and are named in the shape of an action, not a feature.
- "Can send messages via `linkedin-unipile.mcp`"
- "Can transition a `contact` from `qualified` to `promoted_to_rep`"
- "Can move a `knowledge` object to `validated`"
- "Can install a marketplace loop"
Permissions written as sentences read like the audit trail you will want later; feature-shaped permissions ("can access Sales module") do not. Grant the smallest set that lets the agent do its job. If an outreach agent needs to draft but never send, its permission list includes drafting and excludes `send_message`; sending belongs to a separate identity with a narrower grant.
One useful default: material calls (sending, publishing, spending money, changing customer state) get their own permission per surface, so revoking one integration or one workflow is a targeted action. The same material calls are where the [approval-gate primitive](/docs/learn/human-in-the-loop/) shipped by OpenAI, Cloudflare, Microsoft and Temporal fires. The permission answers *may this agent do this?*; the gate answers *did a human sign off on this specific instance?*. Both live on the object, and the audit trail collects them together. A small-business version of the same rule, where only a human can set the approved status, is worked through in [the same approval rule applied to lead follow-up, in Danish](/da/ai-automatisering/).

### 3. Audit trail on the object graph
Audit is not a separate log. Every state transition on every object is an event. Every event has the object, the field that changed, the before and after value, the actor, the timestamp and, if applicable, the trigger that fired it. This is also the practical difference between persona-level trust and [per-action gates](/docs/composable-ai-agents-vs-ai-employees/): trust attaches to the action and its event, not to the agent's job title.
What this buys you:
- **Per-object history in place.** Open any object and scroll its event feed. You see who touched it, when, and what changed, without leaving the object.
- **Cross-object queries.** "All contacts where the outreach agent drafted a message in the last week" is a `get_events` filter, not a report you have to build.
- **Rollback with attribution.** When a transition was wrong, the fix is another transition: same shape, another actor. Nothing is quietly overwritten.

## A pre-flight check before an agent gets write access
Run these six questions for every agent, and for every platform you are evaluating. They are written so a yes or no is enough.
1. **Identity.** Does the agent act as its own actor, with its own id, rather than under a person's login or a shared key?
2. **Verbs.** Can you list the exact actions it may take? Anything that sends, publishes, spends or changes customer state should be a separate permission.
3. **Gate.** Which of those actions need a human to approve each instance, and where does that approval get recorded?
4. **Stop.** Who can pause the agent, and does pausing stop every trigger that references it, not only the one you remember?
5. **Trace.** Pick one action it will take. From the object alone, can you find the actor, the permission, the trigger and the before and after value?
6. **Exit.** How is a permission revoked, and does the revocation show up in the same audit trail?
If a platform cannot answer all six in a demo, it will not answer them during an incident. Questions 2 and 3 are the easiest to skip. Skipping them is how drafting and sending end up granted together, which is the failure the example below walks through.

## A worked example (illustrative)
This is an illustrative scenario, not a customer story. A software company runs a reply agent on inbound refund requests. A customer points out that a reply quoted a refund window you do not offer. Here is the path from complaint to fix.
1. Open the reply object. The event feed shows the transition that sent it, with the acting agent and the trigger that fired it.
2. Click the actor and read its permission list. It holds "can draft replies" and "can send replies", granted together. That is the finding: drafting and sending were one grant.
3. Revoke the send permission. The revocation is itself an event, so the change is visible to whoever audits this later.
4. Put the approval back: the agent drafts, and only a human can move the reply to approved. From here the gate answers "did a person sign off on this reply?"
5. Filter events by that actor for the past week. Every reply that went out under the same grant is a candidate to re-read.
6. If you want everything quiet while you check, set the loop to `paused`. Every trigger that references it stops.
None of those steps needs a separate log system or an export. That is the test the pre-flight check is designed to catch.

## How this maps to real questions

### "An agent did something I didn't expect. Where do I look?"
Open the object it acted on. The event feed shows the transition with the actor and trigger id. Click the actor to see its permission list. Click the trigger to see what fired it and with what config. If the answer is "the permission was wrong", revoke it. If the trigger's config drifted, edit the trigger. If the model reasoned poorly, the drift is in the prompt or the model, not the governance layer, which is itself a useful finding.

### "How do I stop everything, right now, if a customer is affected?"
Loop-level `paused`. Every loop has a status; setting it to `paused` disables every trigger that references it. On the trust ladder this is a rung reachable from any other rung. One step, cascading effect, reversible.

### "How do I graduate an agent's trust?"
Override rate. Compare the transitions the agent proposed with the ones a human accepted, edited or rejected. When the ratio crosses a threshold you set, the loop's trust rung can move: fewer transitions gated, same audit trail. The number is a query over events, not a separate dashboard.

### "What about the enterprise checklist: SSO, SCIM, SOC 2?"
Not the same question. Those are procurement-shaped: they let a large customer buy from you. Operator governance lets your team run agents in production without losing track. Most engineering leaders need the operator answer first and the procurement answer when a specific deal requires it. Ship the loop; add SSO the day the deal asks for it.

## What Maskin gives you
Maskin's implementation of the primitives above:
- **Actors:** humans and agents are both entries in the actor table. Every `driver`, every comment and every event carries an actor id. `list_actors` returns them all.
- **Permissions:** attached to actors, granted per surface (MCP servers), per object-type transition and per admin action. Revocations are events themselves, so you can see "the permission was removed at 14:22 by user X".
- **Audit trail:** the events table on every object. `get_events` queries it directly; the event feed on every object renders it inline.
- **Loop pause:** every `loop` has a status, and `paused` disables all attached triggers. Read the runtime set with `get_workspace_schema`.
The governance surface is Apache-2.0 and [self-hostable](/docs/get-started/self-hosted/), so the audit trail runs where your other data does. That matters if compliance ever escalates to procurement altitude: you did not build the operator answer on a substrate that has to be replaced when the enterprise checklist arrives.

## FAQ

### What is AI agent governance?
The set of controls that make agent actions attributable, permissioned and auditable. For an engineering leader that means three things: each agent has its own identity, each permission covers one action, and every change is an event on the object it touched. Enterprise programs add SSO, SCIM, SOC 2 and formal risk documentation on top. Both are governance; they answer different questions.

### Is AI agent governance the same as an agent control plane?
Overlapping, not identical. A control plane is the operator surface that runs a fleet of agent sessions. Governance is the set of properties (permissions, attribution, audit) that make that surface trustworthy. A control plane without governance is a dashboard; governance without a control plane is a policy with nothing to enforce it on.

### How is this different from enterprise AI governance?
Enterprise AI governance, as pitched by IBM, sim.ai and the SOC 2 and HIPAA vendors, starts from procurement requirements and works backward to controls. Operator-level governance starts from the incident question (who did what, under which permission) and adds controls as they become load-bearing. Same word, different starting points. Most engineering leaders need the second one first and the first when a specific customer asks.

### What should a CTO ask before giving an agent write access?
Six things: which identity it acts as, which exact actions it may take, which of those need a human to approve each instance, who can pause it and what that stops, whether you can trace one action back to its actor and permission from the object alone, and how a permission is revoked. The pre-flight check above has the full list. If a platform cannot answer all six in a demo, it will not answer them during an incident.

### Do I need governance if I only run one agent?
Yes, but only the operator half: a first-class actor id, permissions named after actions, and event history on every object. That is enough to answer what happened long before you have compliance pressure. Skip it and you will add it later with holes in the audit trail from before the switch.

### What is non-human identity governance?
Treating agents and other automated actors as first-class identities with their own credentials, permissions and audit trails, not as service accounts that inherit from a person. Enterprise security vendors call it NHI. Per Guardrail Technologies' 2026 audit of the S&P 500 10-Ks, only 21% of filings describe governing non-human identities, against 97% that mention AI.

### What is a good AI agent audit trail?
Every action has an actor id (not 'the system'), every state change is an event (not a log line), events live on the object they changed, and permission changes are events too. If any of those is missing, you will hit the wall when someone asks who did that.
Read next

## See it on your own agents
Book a meeting and bring one agent you run today. We will walk through who it acts as, what it may do, and how you would trace and revoke one of its actions in Maskin.
