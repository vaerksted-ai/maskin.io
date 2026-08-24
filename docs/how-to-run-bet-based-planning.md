> Source: https://maskin.io/docs/how-to-run-bet-based-planning/

# How to run bet-based planning
**Bet-based planning is run in four steps:** shape a bet from raw insight, give it a win condition, run it inside a fixed-size cycle, then close the loop by validating the outcome against that win condition and feeding what you learned into the next cycle. The unit of work changes from a never-ending queue of tickets to a small set of time-bounded, falsifiable bets the team actually runs and proves out.
> ✓
> **Key takeaways**
> Bet-based planning replaces the backlog with a loop: **insight → bet → execution → validation → repeat**.
> Run it in four steps: shape a bet from raw signal, give it a win condition, run it in a fixed-size cycle, and validate before picking the next one.
> The doctrine comes from Shape Up (Basecamp, 2019). It is influential but contested — a documented niche, not a settled consensus.
> A bet is strongest as a first-class, machine-readable object that humans and agents jointly own, so an agent can execute it and check the win condition.
> The full doctrine and its trade-offs live in the cluster anchor: [Bet-based product planning: the anti-backlog doctrine](/docs/bet-based-product-planning/).

## What bet-based planning actually is
Bet-based planning is a method for deciding what to build that treats work as a repeated, measurable loop instead of a queue. Instead of maintaining a backlog sorted by priority, you commit to a small number of bets — each a bounded chunk of work with a stated outcome — and run them inside a fixed time-box, which Shape Up calls a cycle. When a bet ships, its outcome is measured against its win condition, and what was learned feeds the next cycle’s bets. The doctrine itself, the criticism against it, and where it fits in the market are covered in [the anti-backlog doctrine anchor](/docs/bet-based-product-planning/); this guide is the four-step how-to.
The artifact at the centre changes. Under a backlog, the unit is a ticket whose implied job is to get done. Under bets, the unit is a hypothesis you actually test, with a definition of what winning means and a finite appetite for how much time and money it is worth. That shift is the whole point: it removes the queue and replaces it with a small, validated set of commitments. You run four repeatable steps — shape, win condition, cycle, validate — and the loop is what keeps bets from quietly turning back into tickets with a fancier name.

## Step 1 — Shape a bet from raw insight
Shaping is a distinct planning step, not a formality. An idea is only ready to become a bet once someone has defined its boundaries and its definition of done. This is the step Shape Up introduces as its core discipline: unshaped work is not scheduled, and work without an appetite is noise, not a candidate (Shape Up, Basecamp, 2019).
A bet begins as a signal, not a guess. The raw material is feedback, a market move, churn risk, a competitive shift — evidence that something is worth pursuing. Before the bet exists, the insight behind it should be captured on its own. In Maskin, this lineage is structural: the insight exists as an object before the bet, and the bet carries a reference back to it, so anyone later can trace why the work was chosen (Maskin architecture, 2026).
In practice, shaping means answering four questions on paper before anything is scheduled:
- **The problem** — what is wrong or what opportunity is open, stated plainly.
- **The scope** — what is in and, at least as importantly, what is explicitly out.
- **The appetite** — how much time and money this is worth, before you know how long it will take.
- **The shape** — a rough sketch of the approach and the boundary it will stay inside.
The output is not a detailed plan; it is a bounded proposal. If you cannot state the appetite, the work is not shaped yet, and it should not become a bet.

## Step 2 — Give it a win condition
A bet without an outcome is a ticket. The win condition is what makes the bet testable and what lets the loop measure success at the end. It should be specific enough that an outside observer can say, without debate, whether the bet won or lost — the falsifiability that separates a bet from a wish.
The win condition does the heavy lifting later. When the loop closes, the outcome is compared against this statement rather than against anyone’s memory of what was intended. That is why the condition must be written down when the bet is shaped, not improvised when it ships. In Maskin the win condition is a field on the typed bet object, which is what lets an automated agent check it after execution rather than relying on a human to reconstruct intent ([Maskin architecture](/docs/architecture/), 2026).
A good test: would you be willing to let a machine read the win condition and report whether it was met? If you would not, sharpen it before you spend a cycle on it.

## Step 3 — Run fixed-size cycles
The appetite from Step 1 becomes the time-box. The cycle is fixed and non-negotiable: if a bet does not fit the appetite, it is not extended, it is cut or reshaped. Shape Up runs six-week cycles followed by a cooldown, but the exact length is a team decision — what matters is that the box stays fixed (Shape Up, Basecamp, 2019).
Fixing the box is what forces trade-offs. When a bet runs long, the pressure is to reshape the scope down to what fits, rather than to quietly slip the schedule. This is the mechanism that stops bets from decaying into backlogged tickets: a ticket can grow in place forever, but a bet that overruns its appetite is visibly failing the discipline and gets reshaped or dropped.
You also run only a small set of bets in parallel. The doctrine’s intent is that the team is committed to little and proving it, not juggling a long list. If the cycle is six weeks, pick the handful of bets that genuinely deserve it. Everything else waits for a future cycle or is discarded on purpose.

## Step 4 — Close the loop on validation
When a bet ships, the loop is not finished — validation is the step that separates the method from a backlog. Measure the shipped outcome against the win condition from Step 2, record the result, notify the people who need to know, and shape follow-up bets from what was learned. A shipped ticket in a backlog is simply closed and forgotten; a shipped bet produces evidence that feeds the next cycle.
Two things make validation honest. First, the win condition was fixed up front, so you are measuring against intent rather than hindsight. Second, the outcome is recorded on the object itself, so the learning is durable and can feed later bets instead of living in someone’s head. In Maskin, closing the loop means the bet moves to a validated state and its requester is notified on the object, giving the whole chain — insight to bet to validated outcome — an auditable trail ([Maskin architecture](/docs/architecture/), 2026).
This is also where the human stays in charge. Agents can run the execution and gather the evidence, but the call on whether the win condition is genuinely met is a taste decision worth keeping with a person. That division — agents run the loop, humans judge the outcome — is the emerging governance pattern, and it is why bet-based planning pairs with AI agents rather than competing with them.

## Why the bet has to be an object, not a label
Most planning tools treat a bet as a status field or a tag on a ticket. That misses the point. A bet only works as the engine of a closed loop if it is a first-class, machine-readable object: in Maskin, insights, bets, and tasks are all objects in one unified model connected by typed relationships ([Core concepts](/docs/concepts/), 2026).
The practical consequence is that work can be automated end to end. A free-text ticket cannot be picked up, executed, and validated by an agent, because it carries no structured win condition and no machine-readable shape. A typed bet object can: it has a driver, a win condition, and a bounded scope, so an agent can run it and hand back a result a human judges. The loop — shaped from insight, closed by validation — is the product core, expressed as bounded, human-gated loops rather than code (loop engineering, 2026).
This maps to the wider shift in how teams run agents. “A prompt is not a job — work is a loop” (Addy Osmani, 2026): a backlog is a collection of prompts waiting to be prompted, while a bet shaped with a win condition and closed by validation is a loop that something runs, something checks, and that stops when done. Making the bet an object is what lets agents participate in the loop at all.

## Why the loop is worth running
The case for bet-based planning is not that the market has proven it out — it is that the alternative silently fails. A backlog can absorb any idea, and because tickets are cheap to add and expensive to delete, the list grows toward aspiration rather than intent. Nothing in a ticket queue can tell you whether the work you shipped was worth doing, because a ticket carries no definition of success. A bet closes that gap by carrying its win condition with it: the loop’s output is evidence, not a completion count.
The productivity case for pairing this discipline with agents is what makes the loop worth automating. In a supervised research test, Claude agents recovered roughly 97% of a human researcher’s performance gap over about 800 cumulative hours of compute (~$18k), and the only role humans held was choosing the goal and the scoring rubric — “the bottleneck is which problems to run” (Anthropic, “When AI builds itself”, 2026). That is bet-based planning in miniature: agents do the running, humans choose which bets are worth the cycle. Where the doctrine and its critics stand in the wider market is covered in the [cluster anchor](/docs/bet-based-product-planning/).

## Common failure modes to watch for
The doctrine has real critics, and knowing its failure modes keeps you honest. It is often called company-specific — it was designed inside Basecamp’s own culture, with rituals that do not transfer cleanly. It is also called rigid: a fixed cycle grinds against teams with hard external release commitments or a constant flow of small requests. Teams sometimes adopt the form and then revert, because the ceremony starts to feel like overhead without the promised focus.
The fixes are pragmatic: keep the loop and drop the ritual you do not need. If six weeks is wrong for you, run four or eight; if cooldowns feel wasteful, fold them in. What survives is the loop itself — insight to shaped bet to validated outcome — which is worth keeping even when Shape Up’s specific ceremonies are not. Guard against proxy collapse as bets run longer, too: a long-running loop can start optimizing for its checker rather than the real outcome, which is an argument for keeping a person on the taste decision (loop engineering, ttoss, 2026).

## FAQ

### How long does a bet-based planning cycle take?
The length is a team decision, not a fixed rule. Shape Up prescribes six-week cycles followed by a cooldown, but the method works on any fixed box, from two weeks to a quarter. What matters is that the box is fixed and small enough to force trade-offs — if a bet does not fit, it gets cut or reshaped rather than extended. A small set of bets runs per cycle, so the team stays committed to little and proves it.

### What should a good win condition look like?
A good win condition is specific, observable, and falsifiable — specific enough that an outside observer can say without debate whether the bet won or lost. It is written down when the bet is shaped, not improvised when it ships. A useful test: would you let a machine read the condition and report whether it was met? If not, sharpen it. In Maskin the win condition lives on the typed bet object, which is what lets an automated agent verify it after execution.

### Does bet-based planning replace Scrum?
Not necessarily — bet-based planning is about what you commit to and how you decide it has succeeded, while Scrum is about execution cadence. You can run bets on top of sprint delivery: the bet defines the outcome and the appetite, and the sprint structure handles the mechanics. What bet-based planning replaces is the backlog-as-planning-artifact, where a long queue sorted by priority substitutes for a small, validated set of commitments. The [cluster anchor](/docs/bet-based-product-planning/) covers the full doctrine and its trade-offs against backlog-first methods.

### What happens to ideas that are not chosen?
They wait, or they are discarded on purpose. Under a backlog, every idea is captured and the list grows toward aspiration. Under bets, an idea is only scheduled once it is shaped, and unshaped or unchosen work is not tracked as if it were committed. Insight is captured and retained, but it does not sit in a queue pretending to be a commitment. When a future cycle opens, it can be shaped and proposed again with evidence.

### Can AI agents run bet-based planning?
Agents can run the parts that are mechanical and continuous — monitoring sources, synthesising raw insight, shaping a draft bet, executing the work, and gathering evidence against the win condition. What stays with a human is taste: which bets deserve the cycle and whether an outcome genuinely counts as a win. That division matches what research shows — agents run, humans choose the bets (Anthropic, “When AI builds itself”, 2026). In Maskin, a bet is a typed object a human and agent jointly own, which is what makes that split executable.
Read next

## Start running bets today
You don’t need to buy a planning framework to start — the four steps are process, and you can run them in a shared document tonight. What Maskin adds is making the bet a machine-readable object an agent can execute and validate, so the loop runs continuously instead of on your discipline alone.
