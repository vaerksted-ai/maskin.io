> Source: https://maskin.io/marketplace/lead-qualification/

# Lead qualification on a loop, not a spreadsheet
Run lead qualification in Maskin so your team owns your ICP and the rep conversations — while Maskin reads every inbound lead, gates the noise, and hands only the ones worth working to your team.
Stop burning SDR hours on inbound leads that never convert. Every form-fill, demo request, and pricing-page bounce is read the moment it lands and cleared against what your team has learned from every deal that closed and every one that didn’t — so your reps only ever work leads a human has confirmed. Every rejection stamps a reason on the record, and next week’s leads are read against a sharper definition than last week’s.
**Replaces:** third-party lead-scoring SaaS · manual SDR triage on inbound queues · custom CRM scoring that rots between quarters · agency-run BDR retainers
**Stays human:** what your ICP actually is · which leads are worth a rep’s time · the read on why a lead was wrong · the change to how future leads are read

## What your team keeps, what Maskin runs
| Your team keeps | Maskin runs |
| --- | --- |
| The ICP definition and how it evolves | Reading every inbound lead as it lands |
| The promote-to-rep call | Running the account-fit, role, and intent reads |
| The reject-with-reason judgement | Enriching the account and contact before your team looks |
| The actual rep conversations | Stamping every rejection with a reason on the record |
| The strategy call on which segments to chase | Clustering the reject reasons weekly into an ICP update proposal |

## How the loop runs
1. A lead lands — a demo form, a downloaded asset, a pricing-page bounce, an SDR-sourced contact.
2. Maskin reads the account against your ICP and the human on the form against your buyer / user / gatekeeper shape.
3. It checks the intent — is this a real buying signal (demo, pricing, integration doc, comparison) or noise (blog subscribe, event RSVP, competitor content).
4. Only leads that clear all three land in the queue for a rep to look at.
5. Your rep confirms and promotes, or rejects with a reason.
6. Every rejection stamps the reason on the record; the qualifier clusters those reasons weekly and drafts an ICP update.
7. Your team approves the ICP change — the next lead is read against the sharper definition.

## Trust surface
- **Human gates:** every promote-to-rep and every reject-with-reason is a human call; the ICP definition only changes when your team says so.
- **Your data stays yours:** Maskin reads your CRM, your enrichment tools, and your form data; it writes the qualification decision back to the same records — no shadow queue.
- **Fails safely:** if the three reads can’t agree with confidence, the lead pauses for a human read — nothing gets promoted without confirmation and nothing gets rejected silently.
Run this loop
See the loop running on the Maskin Team’s own inbound, then decide whether to run it on yours.
> ✓
> **Key takeaways**
> Lead qualification closes on a typed transition (`qualified` or `rejected` with a reason on the object), not on a numeric score in a CRM field.
> The SDR hour is the operational constraint. The loop’s job is to pre-clear the queue so the rep only works leads a human has confirmed.
> Every rejection updates the ICP hypothesis the next lead is read against — the reject side is what makes it a loop, not a filter.
> BANT, MEDDIC, and any other framework fit inside the loop as typed fields. The loop is framework-agnostic and survives framework changes.
> The qualifier agent runs on your own model keys and is inspectable end to end — not a black-box score returned from a vendor’s API.

## What lead qualification actually is (and where teams get burned)
Lead qualification is the process of evaluating whether an inbound or outbound prospect fits your ideal customer profile (ICP) and has the budget, authority, need, and timeline to buy — before a sales rep spends time on outreach. It is the gate between the traffic your marketing spend produces and the hours your sales team can actually work.
In practice, most teams get burned in one of three shapes. They eyeball each lead and burn qualified-time on unqualified names. They buy a dedicated qualification tool and inherit its scoring assumptions unchanged. Or they bolt custom scoring onto a CRM and rebuild it every quarter as the ICP drifts and the sales team stops trusting the handoff. The pattern underneath all three is the same: qualification is treated as a step (a score, a flag, a status change) rather than a bounded cycle that ends on a concrete outcome.
The loop framing corrects for that. Qualification is not a step in a spreadsheet; it is a cycle that ends on a promoted lead (with a rep working it) or a rejected one (with a reason stamped on it that feeds back into how the next lead gets read). The typed rejection reasons are what the eyeball approach loses first, and what the score-in-a-CRM approach never captures in the first place.

## Lead qualification in sales: gating the SDR hour
An SDR hour is the most expensive minute in an early-stage go-to-market motion. If your SDR spends it on a lead that never converts, you didn’t just lose the hour — you lost the outreach that a real ICP-fit lead would have gotten instead. The qualification loop gates the SDR hour by name.
The move is: every inbound lead lands as a typed contact object with status `new_lead`. Agents run three reads before an SDR ever sees it. Is this account in the ICP shape (industry, size band, buying stage)? Is the human on the form the right role (buyer, user, or gatekeeper)? Is the intent signal real (demo booked, pricing page, integration doc, comparison page) or noise (blog subscribe, event RSVP, competitor content download)? Only leads that clear all three get promoted to `qualified` for a human gate. Everything else lands on `rejected` with a reason stamped on the record — the human never has to sort through the false positives, but the rejection is legible, countable, and re-readable later.
The result is that the SDR only ever works leads a human has confirmed. The rep’s calendar shifts from “chase every form fill” to “work the queue of pre-cleared handoffs”. That’s the sales-side outcome the loop is built to close on. Once a lead is qualified, the next step is the [outbound loop](/marketplace/outbound/), which runs the researched, human-approved first touch.

## Lead qualification in marketing: MQL to SQL without the guessing
The classic marketing move is a lead scoring model — every action worth some points, one threshold hands off as an MQL, a higher threshold becomes an SQL. It works for a while, then the ICP drifts, the scoring stays fixed, and the sales team stops trusting the handoff. The qualification loop replaces the scoring model with a running conversation between what marketing sent and what sales rejected.
Every rejected lead’s reason updates the ICP hypothesis the next lead is read against. If sales keeps rejecting leads from sub-50-employee SaaS accounts because they can’t afford the tier, that reason accumulates on the object graph and the ICP band narrows on the next weekly read. If the reason is “right company, wrong role”, the marketing form asks for role sooner. The typed graph makes the feedback loop mechanical — marketing sees which of their signals actually promote to a rep-worked handoff, and which don’t. That’s the difference between a scoring model and a qualification loop: one is a static function, the other is a system that learns from its own rejects.

## BANT, MEDDIC, and the qualification frameworks
BANT — Budget, Authority, Need, Timeline — is still the dominant practitioner vocabulary, and the phrase most sales teams reach for when they explain qualification to a new hire. MEDDIC (Metrics, Economic buyer, Decision criteria, Decision process, Identify pain, Champion) is what enterprise sales teams use when the deal complexity outgrows BANT’s four questions. CHAMP and GPCTBA/C&I are the same idea reshuffled. Neither the choice of framework nor the acronym is where teams win or lose; the checklist is not the constraint.
The qualification loop is agnostic to which framework you pick. The framework fits inside the loop, not the other way around. Whatever fields your qualifier agent reads — budget bands, authority signal, urgency criteria, or the deeper MEDDIC properties — become typed properties on the contact object. When a lead is promoted, those fields are on the record for the rep to open the call on. When it’s rejected, the field that failed becomes the reason. That’s what makes the framework durable across ICP changes: you can change which fields you gate on without rebuilding the model, because the loop, not the checklist, is doing the work.

## AI lead qualification tools versus the qualification loop
“AI lead qualification” and “lead qualification tools” are search terms with real buyer intent — the CPC on the AI-frame is around $39, on the tools-frame around $35, per Ubersuggest’s US pull for September 2026. What the SERP is largely selling under those queries is a black-box scoring API: give it your CRM, get a score back, trust the vendor’s model. Salesforce Einstein and HubSpot Predictive Lead Scoring are the incumbent versions of this shape; Clay and Instantly.ai are the newer specialist versions.
The loop is a different shape. Instead of a score, you get a typed transition (`new_lead` → `qualified` or `rejected`) with a reason on the object. Instead of trusting a vendor’s model, you can inspect and edit the qualifier agent’s prompt and the ICP fields it reads. Instead of paying a per-lead API bill priced against the vendor’s cost of goods plus their margin, the agents run on your own model keys — Claude, GPT, or a fine-tuned local model routed through your own inference stack. If the qualifier agent gets a call wrong, the reason is on the record, the human can flip the status in a click, and the correction feeds the next lead’s read. A closed-box score doesn’t have that surface at all — you can override, but you can’t teach it what you overrode and why.

## How rejected leads feed ICP refinement
The single sentence a closed-SaaS lead-qualification page won’t write is this: the rejected lead is worth more than the accepted one. An accepted lead confirms your ICP; a rejected lead teaches you where your ICP hypothesis is wrong.
Every rejection stamps a typed reason on the contact object. Weekly, the qualifier agent clusters those reasons and drafts an ICP update. Which segments are over-fitting (too many rejections on “wrong-industry”, the segment cost is now visible)? Which are under-fitting (a segment that keeps making it past the gate and converting but was never in the original ICP shape)? Which criteria are noise (a field that predicts nothing and can be dropped from the read)? A human gates the ICP update itself — this is a taste call, not an automation — but the draft is done, and the evidence is on the object graph, not in someone’s memory or in a screenshot in Slack.
That is the loop that no scoring model produces. It is also what makes lead qualification a loop rather than a step: the reject side has to feed the read side, or the qualifier is just a filter that never learns.

## FAQ

### What is lead qualification?
Lead qualification is the process of evaluating whether an inbound or outbound prospect fits your ideal customer profile (ICP) and has the budget, authority, need, and timeline to buy — before a sales rep spends time on outreach. In the loop framing, it ends on a typed transition: `qualified` (a rep works it) or `rejected` (with a reason stamped on the record that feeds back into the ICP).

### How does lead qualification work?
Every inbound lead lands as a typed contact object. Agents run three reads — ICP-fit, buyer-role, intent-signal — against your validated ICP. A human gates the promote-to-rep and the reject-with-reason. Rejected leads carry a typed reason (`wrong_industry`, `sub_50_employees`, `wrong_role`, `noise_intent`) that the qualifier clusters weekly into an ICP update proposal — the reject side is where the ICP learns.

### How do you qualify a lead?
Ask three questions in order. Does the account fit the ICP shape (industry, size band, buying stage)? Is the human on the form the right role (buyer, user, or gatekeeper)? Is the intent signal real (demo booked, pricing page, integration doc) or noise (blog subscribe, event RSVP, competitor content)? Only leads clearing all three get promoted to a rep — everything else is rejected with the specific reason on the record.

### What is lead qualification in sales?
In sales, lead qualification gates the SDR hour — the most expensive minute in an early-stage go-to-market motion. An unqualified lead doesn’t just cost that hour; it costs the outreach a real ICP-fit lead would have gotten instead. The rep’s calendar shifts from “chase every form fill” to “work the queue of pre-cleared handoffs a human has confirmed.”

### What is lead qualification in marketing?
In marketing, lead qualification is the MQL-to-SQL handoff — but reframed as a running conversation with sales, not a scoring threshold. Every rejected lead’s reason updates the ICP hypothesis the next lead is read against. Marketing sees which of their signals actually promote to a rep-worked handoff, and which don’t. It’s a system that learns from its own rejects, not a static function.

### What is the BANT lead qualification framework?
BANT — Budget, Authority, Need, Timeline — is a four-axis rubric for qualifying a lead. It’s still the dominant practitioner vocabulary in sales. In the loop framing, BANT (or MEDDIC, CHAMP, or a custom rubric) isn’t the constraint. It fits inside the loop as typed fields on the contact object — the loop, not the checklist, is what does the work.

## AI lead follow up for small business
A new enquiry comes in through a form or an email, and the reply arrives hours later, or never. For a small business, that gap is where the sale goes. In this loop Maskin reads each new enquiry the moment it lands, looks the lead up in your CRM or inbox history, drafts a reply that answers what they asked, and proposes the next step, such as a time to talk. A person approves every reply before it is sent.
This is for people who came to you. Reaching out to people who have not is the [outbound loop](/marketplace/outbound/).
It works with the CRM or inbox you already use, so nobody switches systems.

## What this loop is built with
Loop
A closed cycle: something fires it (a signal, a schedule, a click), agents do the work, a human gates the taste-sensitive parts, and it ends on a concrete outcome — not on *done for now*. Every listing on the Marketplace is a loop. Maskin loops carry typed outcomes and verdicts that persist across tools, not recurring workflow execution inside one product.
Agent
A named role a model performs — an SEO analyst, a discovery synthesizer, an outbound writer. Not an *AI teammate*: a role with a job description, tools it can use, and gates it has to pass before its work leaves the workspace.
MCP
The wire an agent uses to reach the tools your team already uses — the CRM, the docs, the inbox, the analytics. If a human on your team can log in and click, an MCP-native agent can be given the same access under the same gates.
Skill
A packaged capability you attach to an agent — *draft a follow-up in our voice*, *summarize a customer call against our discovery template*. Skills are the reusable pieces of judgment your team is already building without realising it.
Read next
