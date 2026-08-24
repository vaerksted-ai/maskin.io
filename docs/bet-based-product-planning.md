> Source: https://maskin.io/docs/bet-based-product-planning/

# Bet-based product planning: the anti-backlog doctrine
**Bet-based product planning** is the anti-backlog doctrine: instead of managing a growing backlog of tickets, a team plans in a small set of shaped bets — appetite-bounded pieces of work with an explicit win condition — runs them on a fixed cycle, and validates the result before picking the next one. The idea was popularised by Shape Up, Basecamp’s planning methodology, and its core claim is that planning should be a loop of decisions you prove out, not a queue of tasks you grind through. Bet-based product planning has a genuine and growing following, and it is just as genuinely contested — a documented niche, not a settled consensus. (see [What is an agentic workspace?](/docs/what-is-an-agentic-workspace/) for the full model).
> ✓
> **Key takeaways**
> **Bet-based product planning means planning in shaped bets — bounded work with a clear win condition — instead of a running backlog:** the loop is insight → bet → execution → validation → repeat.
> **The doctrine comes from Shape Up (Basecamp, 2019).** It is influential but contested, with critics calling it company-specific and rigid and reporting teams that switch back.
> **In Maskin, a bet is not a label on a ticket.** It is a first-class, machine-readable object shaped from raw insight, carrying a win condition, and jointly owned by a human and by agents.
> **Bet-based planning pairs naturally with AI agents.** Agents can own continuous signal capture and mechanical closure while humans keep the taste decisions.
> **The niche is live and growing.** Tracxn counts ~60 native-AI-in-product-management companies, ~$500M raised, one unicorn, with 2026 funding up ~170% year-over-year (Tracxn, 2026).

## What is bet-based product planning?
Bet-based product planning is a method for deciding what to build that treats work as a repeated, measurable loop rather than a queue. Instead of maintaining a backlog sorted by priority, a team commits to a small number of bets — each a bounded chunk of work with a stated outcome — and runs them inside a fixed time-box, which Shape Up calls a cycle. When a bet ships, its outcome is measured against its win condition, and what was learned feeds the next cycle’s bets.
The unit of planning shifts. Under a backlog, the artifact is a ticket whose implied job is to get done. Under bets, the artifact is a hypothesis the team actually tests, with a definition of what winning means and a finite appetite for how much time and money it is worth spending. That shift is why the doctrine is sometimes called the anti-backlog doctrine: it removes the queue as the organising structure and replaces it with a small, validated set of commitments.
Bet-based planning also reframes how work is reviewed. There is no prioritisation ceremony scoring a long list against each other. Instead, a handful of shaped bets are chosen deliberately, given a real outcome, and then owned to completion. The result is a planning cadence that resembles how modern agentic systems operate — a closed loop that runs, measures, and repeats — rather than a repository that accumulates.

## Where the anti-backlog doctrine came from: Shape Up
The doctrine has a specific provenance. Shape Up is a planning methodology published by Basecamp in 2019, written by Ryan Singer. Its argument is structural: backlogs decay because tickets accumulate faster than they are worked, become aspirational rather than decision-grade, and eventually stop representing anything a team intends to ship. Shape Up’s answer is to plan in shaped bets — a piece of work bounded by an appetite (a time-box) and a clear outcome — run in six-week cycles followed by a cooldown. Work that is not shaped is not scheduled; work that does not fit an appetite is not a bet, it is noise.
Two ideas from Shape Up matter for the anti-backlog doctrine beyond Basecamp itself. First, *shaping* is a distinct planning step: an idea is only ready to be a bet once someone has defined its boundaries and its definition of done. Second, the fixed cycle is intentional: it forces trade-offs — if a bet does not fit the appetite, it is not extended, it is cut or reshaped. That discipline is the mechanism that keeps bets from quietly becoming backlogged tickets with a fancier name.

## Why backlogs decay
To understand why bet-based planning exists, it helps to name exactly what goes wrong with backlogs. The mechanism is accumulation. Tickets are cheap to create and expensive to delete, so a backlog grows toward aspiration: someone files every idea, every edge case, every someday task, and the list loses any signal about what matters now. Priority ordering becomes a fiction maintained in ceremonies rather than a real ranking of intent.
Backlogs then stop being decisions. A ticket in a backlog is a statement of possibility, not a commitment. It carries no win condition, so nothing in the system can tell whether working it was successful. Scope creeps in because a ticket’s boundaries are set at creation and never tightened. And because the queue never empties, focus dissipates — the team is permanently mid-everything and never finished-anything. This is the failure mode the anti-backlog doctrine is built against.

## The honest critique: contested, not consensus
Bet-based planning has a real following, and it has real critics — and the criticism is worth taking seriously rather than papering over. The doctrine is often called company-specific: it was designed inside Basecamp’s own culture, with specific rituals (six-week cycles, cooldowns, a particular shaped-marketing vocabulary) that do not transfer cleanly to every team. It has also been called rigid: a fixed cycle suits some product cadences and grinds against others, particularly teams with hard external release commitments or constant flow of small requests.
Practitioners report that teams sometimes adopt the form and then switch back, because the ceremony — cycle planning, shaping sheets, appetite debates — starts to feel like overhead without the promised focus. The honest framing is that bet-based planning is a documented niche with a strong, self-consistent logic, not an enterprise consensus. Teams adopt it, defend it, and write about it; equally, they critique it, modify it, and abandon it. Understanding this is part of planning well: the doctrine’s value is the loop it insists on, which survives even when the specific Basecamp rituals do not.

## The bet as a first-class object
Most planning tools treat a bet as a label pasted onto a ticket — a status field or a tag. Maskin takes the doctrine’s claim about the unit of work literally and makes the bet a first-class, machine-readable object, part of a unified object model in which insights, bets, and tasks are all objects connected by typed relationships (Maskin architecture, 2026). A bet in Maskin is defined by what it is, not by what it is called:
- **It is shaped from raw insight.** A bet begins as a signal — feedback, a market move, churn risk, a competitive shift — not a guess. The insight exists as an object before the bet does, and the bet carries the lineage back to it.
- **It carries a win condition.** A bet without an outcome is a ticket. The win condition is what makes the bet testable and what lets the loop measure whether it succeeded.
- **It is jointly owned.** Agents bring the signal and the execution; humans bring taste and the approval. The ownership is explicit on the object, not assumed.
The object model matters because it is what lets agents work. A bet that is a typed object with a win condition and a driver can be picked up, executed, and validated by an automated agent in a way a free-text ticket cannot be. The loop — shaped from insight, run to a win condition, closed by validation — is not a metaphor in Maskin; it is the product core, expressed as bounded, human-gated loops rather than code a developer writes (loop engineering, 2026).

## Bet vs backlog: the conceptual difference
| Dimension | Backlog | Bet (bet-based planning) |
| --- | --- | --- |
| Unit of work | Ticket | Shaped bet |
| What a unit carries | Description, priority | Win condition, appetite, driver |
| How it enters the system | Anyone can add | Shaped deliberately from insight |
| Definition of success | Completed | Win condition met |
| Organising structure | Running queue | Fixed cycle |
| What the team is committed to | Long list | Small validated set |
| What happens after | Ticket closes | Outcome measured, loop repeats |
| Agent-friendly | No — free text | Yes — typed object |
The table is the whole argument compressed. A backlog optimises for capturing everything; a bet loop optimises for committing to little and proving it. The difference is not cosmetic — it changes what the system can do with the work, including whether an agent can autonomously run, validate, and hand back a result.

## Why bet-based planning pairs with AI agents
Bet-based planning and AI agents fit together for a concrete reason: the doctrine’s loop maps almost exactly onto what agents are good at, and it moves the human to where humans are irreplaceable. Agents are strong at continuous signal capture — monitoring sources, synthesising raw insight, drafting a hypothesis from scattered evidence. That is precisely the insight-to-bet pipeline the doctrine depends on. Under a backlog, that pipeline is manual and slow; with agents, it can run continuously.
What agents are comparatively weak at is taste — judging which bets deserve the cycle and which outcomes actually matter. That is the human’s job, and it is also exactly the role Shape Up always needed. Research illustrates the split: in a supervised research test, a Claude agent recovered roughly 97% of a human researcher’s performance gap over about 800 cumulative hours of compute (~$18k), and the only role humans held was choosing the goal and the scoring rubric — "the bottleneck is which problems to run" (Anthropic, "When AI builds itself", 2026). Bet-based planning is the management expression of that same finding: agents do the running, humans choose the bets.
This is also why bet-based planning pairs with the broader shift to loop engineering — "a prompt is not a job, work is a loop" (Addy Osmani, 2026). A backlog is a collection of prompts waiting to be prompted. A bet, shaped with a win condition and closed by validation, is a loop: something runs it, something checks it, and it stops when it is done. That is the difference between a tracker and a working loop.

## The evidence it’s a live niche
Bet-based planning is not a footnote in an old methodology book; it sits inside a market that is actively forming around it. Tracxn counts roughly sixty companies in native-AI-in-product-management — including teams explicitly built around bet- and shape-based planning — with about $500M raised over a decade, eleven at Series A or beyond, and one unicorn (Tracxn, 2026). Funding in 2026 is up about 170% year-over-year. Those numbers describe a small, young, fast-moving wedge, not a settled category.
The incumbents' behaviour is the most telling signal. In 2026, Atlassian opened its Teamwork Graph as an agent context layer via Rovo and reported agentic automations up 7x in six months; Notion shipped Custom Agents and a Developer Platform; Linear released its own agent grounded in roadmap, code, and issues. Each of those moves is the big tooling players converging on the same human-plus-AI loop thesis that bet-based planning articulates — work as a closed loop over a shared model of what matters, rather than a queue of tickets. The doctrine’s focus on a small set of jointly-owned, outcome-carrying bets is the planning layer of that same thesis.

## FAQ

### What is bet-based product planning?
Bet-based product planning is a management doctrine that replaces the rolling backlog of tickets with a small set of shaped bets. Each bet is a bounded piece of work with an explicit win condition, run on a fixed cycle; when it ships, the outcome is measured against the win condition and the learning feeds the next cycle. The loop is insight → bet → execution → validation → repeat. It is called the anti-backlog doctrine because it removes the queue as the organising structure and replaces it with a small, validated set of commitments.

### Is bet-based product planning the same as Shape Up?
Bet-based product planning draws its core claim — bets, not backlogs — from Shape Up, the planning methodology Basecamp published in 2019. The two are closely related but not identical. Shape Up is the full package, including specific rituals like six-week cycles, cooldowns, and a shaping vocabulary. Bet-based planning is the underlying doctrine: plan in outcome-carrying bets on a closed loop rather than a queue. Teams can adopt the doctrine with or without Shape Up’s specific ceremonies, and Maskin implements the loop rather than mandating the rituals.

### Why do backlogs fail?
Backlogs fail by accumulation. Tickets are cheap to create and expensive to delete, so the list grows toward aspiration and stops representing real intent. A ticket carries no win condition, so nothing can tell whether working it succeeded. Without an appetite or time-box, scope creeps. Because the queue never empties, the team is permanently mid-everything and never finished-anything. The anti-backlog doctrine exists to replace that accumulation with a small set of bets that are actually run and validated.

### What is the difference between a bet and a ticket?
A ticket is a description of work without a definition of success; a bet is a bounded piece of work with a stated win condition, an appetite, and an owner. A ticket’s job is to get done; a bet’s job is to prove an outcome. Under a backlog, work enters because anyone can add it; under bet-based planning, work enters because it was shaped deliberately from insight. And materially, a bet can be a typed, machine-readable object that an agent can execute and validate, whereas a free-text ticket cannot be worked autonomously.

### Does Maskin implement Shape Up?
Maskin implements the loop Shape Up argues for — bets, not backlogs — on a machine-readable object model, but it does not impose Shape Up’s specific rituals. In Maskin, a bet is a first-class object shaped from raw insight, carrying a win condition, and jointly owned by a human and agents. You keep whatever ceremonies you want; the doctrine’s operational core — insight to bet to validated outcome on a closed loop — is what the product provides.

### How do AI agents fit into bet-based planning?
Agents fit by splitting the loop. They are strong at the continuous work the doctrine depends on: monitoring sources, synthesising raw signal into insight, and drafting a shaped bet. They can also carry the execution and the mechanical closure — running the bet, gathering evidence, checking the win condition. What humans keep is taste: which bets deserve the cycle and which outcomes actually matter. That is the same division of labour research shows in the 97%-gap-recovery finding — agents run, humans choose the bets (Anthropic, 2026).

### What happens after a bet ships?
Validation closes the loop. When a bet ships, its outcome is measured against the win condition, the requester is notified, and the follow-up bets are shaped from what was learned. The loop does not stop at delivery — that is precisely what distinguishes the anti-backlog doctrine from a backlog, where a shipped ticket is simply closed and forgotten. A bet’s result feeds the next cycle, so the team plans from evidence rather than from aspiration.
Read next

## Getting started is free
Self-host today, or take a hosted trial and read the [agentic-workspace guide](/docs/what-is-an-agentic-workspace/) while you decide.
