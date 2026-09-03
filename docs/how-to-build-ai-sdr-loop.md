> Source: https://maskin.io/docs/how-to-build-ai-sdr-loop/

# How to build an AI SDR loop in Maskin (MCP + Unipile, HITL approval on outbound)

**An AI SDR is a loop, not a product.** Seven repeatable steps — signal, research, draft, human approval, send, reply routing, close — run on Maskin's typed object graph, with the sender lane called through MCP (Unipile for LinkedIn, a mail provider for email) and a human on every outbound approval until the override rate stabilises. This guide is the concrete build side; the honest map of the OSS AI SDR repos and where each one fits sits in the companion comparison, [Open source AI SDR: the honest map](/alternatives/open-source-ai-sdr/).

**Key takeaways**

- **The unit of work is the loop, not the message.** Every AI SDR failure mode — ghost drafts, silent sends, blacklisted domains — is a broken step in the loop, not a bad model.
- **Seven typed steps**: signal → research → draft → approval → send → reply routing → close. Each step is a state transition on a typed object, not a chat message.
- **Human-on-the-loop on outbound is non-negotiable at day one**, and the honest metric is [override rate](/docs/learn/human-in-the-loop-ai/): 0% is rubber-stamping, above 20% is a broken model, real HITL sits in the middle band.
- **MCP is the sender lane**: Unipile for LinkedIn (and email, WhatsApp, Slack behind one API), Postmark/Resend for a warmed email domain. Swap providers without touching the loop.
- **Close conditions are load-bearing.** A loop without a written close condition is a cost leak; every send should map to one of meeting-booked (win), explicit-no (drop), or N-touches-without-response (exit).
- **Companion reading**: the OSS-vs-closed cost split, the six real GitHub repos, and the loop-shape argument live in [Open source AI SDR](/alternatives/open-source-ai-sdr/). The workspace pattern this loop runs on lives in [Ambient agent workspace](/docs/ambient-agent-workspace/).

## What we're building

The output of this guide is a working AI SDR loop — not a chatbot, not a script that sends whatever the model generates — running on your own Maskin instance, sending real messages through a real sender lane (Unipile for LinkedIn, a warmed email domain for email), with a human approving every outbound touch until the override rate has stabilised. Once the loop is up, you can raise the autonomy dial per segment, sample the approval instead of gating every message, and let the loop run continuously on triggers. The load-bearing decision is the loop shape, not the model choice, and the seven steps below are the shape.

Every step lands as a state transition on a typed object — insights, tasks, events — on the workspace graph. That's the difference between an SDR loop you can audit and one that lives in a chat window nobody reopens. If the workspace-graph frame is new, the [ambient agent workspace](/docs/ambient-agent-workspace/) piece has the full argument for why the graph is the fifth post-chat pattern and what it buys you over a queue of discrete approvals.

## Prerequisites

- A running Maskin instance (self-hosted under Apache 2.0 or a hosted trial — [Get started](/docs/get-started/)).
- A model key configured on the workspace (Anthropic, OpenAI, or a local model — see [LLM & models](/docs/llm/)).
- A Unipile account for the LinkedIn sender lane, or a Postmark/Resend account plus a warmed email domain for email.
- An enrichment provider your account already uses (Apollo, Clay, or Tavily are the common shapes) — wired in as an MCP tool the research step can call.
- A human on-call for the approval gate until the override rate settles.

## Step 1 — Define the signal

Pick a single, observable event that starts the loop. "All prospects that match our ICP" is not a signal, it is a wish; a signal is something a machine can see fire. Concrete examples: an account moves into a Clay list, a HubSpot contact reaches a lead score threshold, a LinkedIn job-change event lands, a competitor's customer shows PostHog activity on your site. Register the event as a [workspace trigger](/docs/concepts/) that creates an insight object when it fires; the insight carries the raw signal (source, timestamp, IDs) and becomes the anchor for the rest of the loop.

Keeping the trigger observable is what stops *polling-loop hell* — the ambient-agent failure mode where an SDR runs every 30 seconds and floods the reviewer with drafts nobody asked for. Trigger on state changes, not on time.

## Step 2 — Run the research step

The trigger spawns an agent session against the new insight. The session's job is to enrich the account and contact, pull the last 90 days of public signal (funding, hiring, product changes, competitor moves), and write a *why-now* hypothesis onto the insight's metadata. Enrichment MCPs (Apollo, Clay, Tavily) are the tools the session calls; the findings become typed fields on the object, not a paragraph in a chat log.

Writing structured findings back to the object matters because the draft step in Step 3 needs machine-readable inputs to produce a message that actually cites the research. A blob of text is a prompt; a typed field is context the agent can reason over. Recording the enrichment sources and timestamps on the insight also gives compliance a trail without extra work.

## Step 3 — Draft the first-touch message

The agent drafts an outbound message calibrated to the research and to the sender's voice. In Maskin the draft creates a task in `status=needs_approval`, linked back to its parent insight with a typed relationship, and carrying: the message body, the intended channel (LinkedIn DM, email), the intended recipient, the model and prompt used, and the research fields the draft cited. Storing the prompt inputs on the task is what makes the audit trail meaningful — when a message goes sideways later, you can walk back to why the model wrote what it wrote.

Voice tuning is where most AI SDR drafts fail. A frontier model prompted generically writes generic drafts; a mid-tier model prompted with the sender's last twenty successful opens produces messages a reviewer will approve without editing. Keep the sender's writing samples as a stored asset the drafting agent injects on every run — that's prompt-as-configuration, and it's the piece a closed AI SDR is quietly doing for you at $2k+/mo.

## Step 4 — Gate on human approval

The `needs_approval` status raises a review interrupt to the account owner. They approve, edit-then-approve, or reject. This is the step that separates a working AI SDR from a demo, and skipping it is the shortest path to your primary domain landing on a blacklist because one prompt regression sent 500 off-tone messages to the wrong segment.

The metric to watch is the *override rate*: the fraction of drafts the reviewer edits or rejects. Stuck at 0% is rubber-stamping (the reviewer isn't reading; one bad prompt away from disaster). Stuck above 20% is a broken model (the reviewer is doing the model's job under an AI SDR banner). Real HITL sits in the middle band and is watched over time. The [Human in the loop AI](/docs/learn/human-in-the-loop-ai/) piece walks the failure modes in detail; the short version is that human-on-the-loop with a measured override rate is what makes the "human review" claim real rather than theatre.

Once the override rate has stabilised in a healthy middle band for a segment, sampling is fine — review 10% of drafts rather than 100%, keep the sample audit-visible, raise it if the rate drifts. Sending unreviewed at day one is not.

## Step 5 — Send via a sender-lane MCP (Unipile for LinkedIn, or a warmed email domain)

On approval the task transitions to `sending` and the agent calls the sender-lane MCP. For LinkedIn that's **Unipile** — the compliant, MCP-shaped API that exposes LinkedIn (and email, WhatsApp, Slack) behind a single tool surface. For an email-first loop the send goes through a warmed domain via Postmark or Resend. Because both live behind MCP calls the loop shape does not change; only the tool the send step invokes changes. Swap providers with a workspace configuration write, not a code change.

The provider response — message id, thread id, timestamp — is stored on the task so incoming replies can be threaded back in Step 6. Silent failures at this step are the failure mode you cannot recover from: a send that dies without a state transition looks identical to a message the recipient just hasn't opened yet. Every send lands as a typed event on the object, success or failure, so a stuck loop is visible state, not silence.

Deliverability and sender reputation are the piece OSS pushes onto the buyer — warmed domains, IP pool management, DMARC/SPF hygiene, bounce handling. The loop shape doesn't rescue you from that work; a compliant sender MCP just gives you a legible surface to run it on.

## Step 6 — Route replies as typed events

Incoming replies come back through the same sender MCP (Unipile threads LinkedIn DMs and email replies; a mail provider webhooks email replies). Each reply lands as an event on the parent insight and gets classified into one of three buckets: **warm** (route to the account owner as a booked-conversation candidate, notify them where they already work), **objection** (route back to the drafting agent for the next follow-up in the sequence), **unsubscribe** (honour immediately, add to the suppression list, close the loop as dropped).

Classification uses the same model as the draft step, prompted with the recipient's history on the graph — that's the payoff of typed objects, the classifier gets full context without extra plumbing. Keep the unsubscribe path as its own state transition rather than a soft label; compliance surface (CAN-SPAM, GDPR, CCPA) breaks quietly when suppression is an afterthought.

## Step 7 — Set a close condition

Every loop needs a defined close condition or it runs forever and pays for the privilege. Three shapes cover almost every case: **meeting booked** (win — the loop closes as converted), **explicit no or unsubscribe** (drop — the loop closes as suppressed), **N touches without response** (exit — the loop closes as cold, N is usually 3-5 depending on segment). The outcome is written back to the parent insight; a closed loop with a recorded outcome is what feeds the next cycle's learning.

A loop without a close condition is exactly the pattern the ambient-agent literature warns about — a "ghost interface" that keeps running because nobody explicitly stopped it. The close condition is what makes an SDR loop bounded work rather than a cost leak.

## Operating the loop

Once the seven steps are wired, the loop runs continuously on the triggers you defined in Step 1. Three operational levers matter:

- **The autonomy dial per segment.** Not every recipient class needs 100% human approval. Cold-list first-touches at day one, yes; a follow-up to a warm reply from a known contact, probably not. Keep the dial explicit on the object, not implicit in the prompt.
- **The override rate as the honest evaluation.** Model swaps, prompt tweaks, and sender-voice updates all move the override rate. That's your rubric, not the leaderboard.
- **The close-rate on outcomes.** Meeting-booked over sent, per segment, per week. This is the number that tells you whether the loop is actually earning its API budget.

The workspace-graph pattern makes all three levers observable without extra tooling — the state is on the objects, the audit trail is the graph's own history. If you're running this loop at scale (dozens of parallel loops, multiple humans on the taste gates), the [ambient agent workspace](/docs/ambient-agent-workspace/) piece has the full pattern; if you want the OSS-vs-closed cost picture and the six real repos on GitHub, that's [Open source AI SDR](/alternatives/open-source-ai-sdr/).

## Common failure modes to watch for

- **Rubber-stamped approvals.** Override rate at 0% for a week means the reviewer isn't reading. Force a sample-audit, or the first bad prompt cascades.
- **Silent sends.** A send failure that never surfaces looks identical to a slow recipient. Every send transition writes a typed event — success or failure — and stuck tasks alert the account owner.
- **Voice drift.** The drafting model works great for two weeks, then a model or prompt swap subtly changes the voice. Store the sender's writing samples as a first-class asset the draft step injects, not as a system-prompt paragraph that decays.
- **Missing close conditions.** A loop with no defined close is a cost leak wearing a hoodie. Every loop closes on win, drop, or exit — no exceptions.
- **Unsubscribe as a soft label.** Suppression is a state transition, not a tag. Miss this and the compliance failure will find you.

## FAQ

### Do I really need a human approval gate on outbound?

Yes, on any outbound of consequence. The failure mode of an AI SDR without a real approval gate isn't a bad message — it's your domain landing on a blacklist because one prompt regression sent 500 off-tone messages to a segment. Human-on-the-loop with a measured [override rate](/docs/learn/human-in-the-loop-ai/) is the operational difference between a working AI SDR loop and a demo. You can sample the approval (review 10% of drafts rather than 100%) once the override rate has stabilised at a healthy middle band, but sending unreviewed at day one is how OSS AI SDRs earn a bad reputation they don't deserve.

### Why Unipile for the sender lane?

Unipile exposes LinkedIn, email, WhatsApp and Slack behind a single API and ships an MCP surface, which means the outbound sender is a swappable tool call rather than hard-coded plumbing. For LinkedIn specifically the alternative is a fragile scrape or a paid platform lock-in; a compliant, MCP-shaped API is the difference between an SDR loop you can trust in production and one that will silently drop messages. Email can go through the same MCP or through a warmed domain via Postmark/Resend — the loop shape does not change, only the tool the send step calls.

### How is this different from a closed AI SDR SaaS?

The loop shape is the same — signal, research, draft, approval, send, reply, close. What Maskin gives you is the loop as typed objects on a shared graph you own, running on your own model keys, with an audit trail that is the graph's own history. A closed AI SDR (11x, Artisan, Qualified, SalesForge, AiSDR) bundles deliverability, prompt-tuning-as-a-service, and CRM plumbing into a $2,000-$5,000/mo bill; running the loop on Maskin puts you on the OSS side of that cost split (roughly $50-$200/mo in API costs) but pushes deliverability and sender-reputation work onto your team. The honest map of the six OSS AI SDR repos and where each one fits is in the companion piece, [Open source AI SDR](/alternatives/open-source-ai-sdr/).

### Where does the loop actually live in Maskin?

As typed objects and relationships. The signal is an insight object created by a trigger; the draft is a task in `needs_approval` linked to the insight; the send is a task transition to `sending`; the reply is an event on the parent insight; the outcome is a status write on the insight itself. All of it lives on the same object graph as the rest of the workspace, so an agent can walk from insight to task to reply to outcome without leaving the substrate, and a human can review any step of any loop without opening a separate tool. The [Core concepts](/docs/concepts/) page has the full object-model reference.

### What model should I use for the drafting step?

Whichever your team can hold taste on. Draft quality is a prompt-and-voice problem more than a raw-capability problem; a well-prompted mid-tier model with the sender's writing samples in context outperforms a frontier model prompted generically. Because Maskin is [MCP-native](/docs/what-is-mcp-native/), the model call is a workspace configuration, not a code change: swap Anthropic for OpenAI or a local model without touching the loop shape. Keep the override rate as the honest evaluation metric — the model that produces the healthiest middle-band override rate in your reviewer's hands is the right one, regardless of the leaderboard.

### How does this connect to the open-source AI SDR comparison?

The companion page, [Open source AI SDR: the honest map](/alternatives/open-source-ai-sdr/), covers the six OSS AI SDR repos on GitHub in 2026 (MatthewDailey/open-sdr, OpenOutreach, ZeroGTM, Signal, personizeai/revenue-os, kandksolvefast/ai-sdr-agent), the $50-200/mo vs $2k-5k/mo cost split against closed SaaS, and the failure modes of running outbound without a real approval gate. This page is the concrete build side: given you have accepted the loop framing and want to run it on your own object graph, this is how the seven steps get wired inside Maskin.
