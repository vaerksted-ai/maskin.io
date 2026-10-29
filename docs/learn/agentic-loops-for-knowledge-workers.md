> Source: https://maskin.io/docs/learn/agentic-loops-for-knowledge-workers/

# The verifiable finish line: how agentic loops for knowledge workers prove they did the job right
**An agentic loop for knowledge workers proves it did the job right by closing on a finish line written before it started, not on the agent's say-so.** That finish line has three parts: a close condition (a checkable definition of done), a recorded verdict (pass or fail against it), and a human gate (a person approves the outcome).

## Key takeaways
Five things to know:
- Coders got verification for free; knowledge work has no compiler.
- A finish line is a close condition written before the work starts.
- The referee has three parts: close condition, verdict, human gate.
- A verdict stuck in a chat thread dies there, so store it with the work.
- You do not need engineers; you need a written definition of done.
Ready to run a loop with a written finish line on your own work? [Self-host Maskin free or start a hosted trial](https://maskin.io/?utm_source=maskin.io&utm_medium=article&utm_campaign=agentic-loops-for-knowledge-workers&utm_content=cta-top).

## Coders got verification for free. The rest of us have to manufacture the referee.
When a developer hands work to an agent, verification is built in. A test either passes or it does not. The compiler either accepts the code or refuses it. The build is green or red. The developer never has to ask "how do I know this is right?" The environment answers immediately and without argument.
Knowledge work has none of that. When a product manager, an analyst, or an ops lead hands a recurring task to an agent, the output lands in prose. There is no compiler for a weekly churn summary, a competitive brief, a support-triage digest, or a first-pass onboarding doc. The work is judged by reading it, and reading it is the human's job.
This is the gap the [loop frame](/docs/what-is-loop-engineering/) names. In late summer 2026 the idea moved from engineering blogs into the wider market. Tobias Weiss's essay "Loop Engineering" (2 August 2026) anchored the vocabulary on Boris Cherny's line that his job is no longer to prompt the model but to write loops, and The AI Daily Brief ran an episode titled "Agentic Loops for Knowledge Workers" on 3 September 2026. Two independent voices, about a month apart, landed the same claim: the loop, not the prompt, is the unit of delegated work, and a loop only counts as closed when something decides the output is good enough.
That decision-maker is what knowledge work is missing. Call it the referee.

## What "done" means when there is no compiler
Ask ten people what "done" means for a piece of knowledge work and you get ten answers, all reasonable, none checkable. "Done" for an agent loop cannot work that way, because the loop has no judgment of its own. It has whatever you gave it.
A close condition is the fix. It is a written statement, agreed before the loop runs, that a third party could use to decide whether the output is acceptable. It has to be specific enough to fail.
Compare two versions of the same request:
- Not a close condition: "Improve our onboarding documentation."
- A close condition: "The onboarding doc names every step a new user takes in their first session, lists the exact screen for each step, and flags every step that currently requires a support ticket. It is wrong if any first-session step is missing or if a step has no screen named."
The second version can be checked. The first cannot, so it can never close. The loop keeps producing drafts that look fine and no one can say whether they are.
This is the same discipline that makes acceptance criteria work in software, moved into prose. A statement that cannot fail is not a finish line.

## The three parts of a manufactured referee
A finish line you can trust has three parts, and they do different jobs.
**1. The close condition: the written finish line.** This is the checkable statement above. It is set before the loop starts, by the person who owns the outcome, and it does not move once the work begins. If the condition has to change, that is a new loop, not a moving target.
**2. The recorded verdict: the result, written down.** When the loop stops, it should stop with an answer, not a summary. Pass or fail against each part of the close condition, recorded as structured data rather than prose in a chat window. A verdict is what lets the next person, or the next agent, pick up the work without re-reading the whole run. It is also what makes the loop auditable weeks later, when someone asks why a decision was made.
**3. The human gate: the person who approves the outcome.** The human approves the result, not the process. They read the verdict and the output and decide whether the close condition was actually met. This is where judgment stays. An agent loop is deliberately **less permissive than an agent**, because a loop that can do anything is a loop you cannot trust with anything recurring.
Put the three together and you have the referee: a loop that starts from a written finish line, ends with a recorded verdict, and passes through a person before the outcome counts.

## What this looks like in practice
Take a recurring task most teams have: a weekly summary of customer accounts whose usage dropped.
Handed to an agent with no finish line, you get a summary that reads well and answers nothing in particular. Handed to a loop with a referee, it looks like this:
- **Close condition:** "The summary names every account that fell below 80% of its normal weekly usage, gives the week-over-week usage change for each, and flags any account where the drop followed a support ticket in the same week. It is wrong if an account meeting the threshold is missing, or if a listed account has no usage number."
- **Recorded verdict:** each line of the summary carries a pass or fail against those rules, plus the raw numbers the judgment was made from.
- **Human gate:** the account owner reviews the verdict and the flagged accounts before the summary goes to the wider team. They can overturn any line, and the correction is recorded.
Now the loop can close. It either met the condition or it did not, and there is a record either way. When the same task runs next week, the loop starts from the same finish line and the previous verdicts, so quality does not reset to zero each time. That is what separates a loop from a one-off agent run: the proof accumulates.

## Why this is not just a workflow automation
A workflow automation fires on a schedule and completes. It tells you it ran; it does not tell you the work was right. A loop closes on a verdict about the outcome.
The difference matters because most knowledge work fails quietly. An automation that emails a report every Monday keeps emailing it whether the report is good, stale, or wrong. A loop with a close condition does not close when the condition is unmet. It hands the failure to a person, which is exactly when you want to hear about it.
This is the distinction between a [workflow and a closed loop](/docs/learn/agentic-workflow-vs-closed-loop/), and it is why a loop is the right shape for recurring judgment work: it is built to terminate on a validated result, not on completion. The [check step](/docs/learn/agent-orchestration/), the verdict, is what separates a loop from a chatbot that merely routes work between tools.

## Where a finish line goes wrong
Three failure modes show up early, and none of them needs a number to spot.
**A close condition that passes trivially.** "The summary lists at-risk accounts" passes if the agent lists one account. If you cannot name an output that would fail the condition, rewrite it until you can. A good test: hand the condition to a colleague and ask them to write a bad answer that still passes.
**A human gate that becomes a rubber stamp.** When the loop passes ten weeks in a row, the reviewer starts approving without reading. Keep the gate honest by giving the reviewer something to decide, not just something to click: the verdict, the raw numbers, and the lines most likely to be wrong. Spot-check a passing run now and then, and treat a reviewer who has never overturned a line as a signal, not a success.
**No plan for a fail verdict.** Decide before the first run what a fail does. The usual answer: the loop does not close, the verdict names which part of the condition failed, and the owner decides whether to rerun, fix the input, or change the condition. Blind automatic retries only reproduce the same failure faster, and quietly loosening the condition so the loop passes defeats the point of having one.

## How to build a finish line for your own loop
You do not need engineers to do this. You need four things written down.
1. **Name the outcome, not the activity.** "The brief is done" is an activity. "The brief names the three competitors that moved price this month and cites the source for each" is an outcome.
2. **Write the close condition so it can fail.** If you cannot describe a version of the output that would be wrong, the condition is too vague to use.
3. **Decide the verdict's shape before the run.** What will the loop report back: a pass or fail per line, a number, a flagged list? Pick the shape and keep it stable, so verdicts are comparable week to week.
4. **Put the human gate at the outcome, not the steps.** Let the loop run; have the person approve the result and its verdict, not every action along the way.
Then store the verdict where the work lives. A verdict that stays inside the agent's chat thread is lost the moment the thread scrolls away. A verdict attached to the record it describes becomes [team memory](/docs/closed-loop-workspace/): the next agent, the next reviewer, and the next hire all start from proof instead of guesswork.
In Maskin, a loop's close condition is written in plain language when the loop is created, work items carry an owner, and closed bets carry a verdict. Loop-level verdicts are not shipped yet: today a person reads and judges a loop's close condition.
If you want to try this on one recurring task, [self-host Maskin free or start a hosted trial](https://maskin.io/?utm_source=maskin.io&utm_medium=article&utm_campaign=agentic-loops-for-knowledge-workers&utm_content=cta-mid) and write the close condition first.

## Frequently asked questions

### What is an agentic loop for knowledge workers?
It is a recurring piece of knowledge work (a report, a brief, a triage, a draft) run by agents inside a defined cycle that starts from a written finish line and ends with a recorded verdict a person approves. It is the non-engineering counterpart to the coding-agent loop, where tests and compilers supply the finish line automatically.

### How do you know an agent loop did the job right?
You decide in advance what "right" means, as a close condition that could fail, and you require the loop to return a verdict against it. If you cannot state what a wrong answer would look like, you have no way to know. That is the problem the finish line solves.

### What is a close condition?
A close condition is a written, checkable statement of done, set before the work starts, that a third party could use to judge the output. It is the difference between "improve the docs" (uncheckable) and "name every first-session step and the screen for each" (checkable).

### Is a loop just a workflow automation?
No. An automation runs on a schedule and completes; a loop closes on a verdict about the outcome. An automation keeps producing output whether or not it is right. A loop does not close while its close condition is unmet, and it routes the failure to a human.

### Do you still need a human in the loop?
Yes, at the outcome. The human approves the result and the verdict, not every step. That gate is what lets you hand over recurring work without handing over judgment. Trust is earned in stages: supervised runs first, more autonomy once the loop's verdicts hold up.
Read next

## Give your loop a finish line
Maskin is the open-source, MCP-native workspace where a loop carries a close condition, an owner and a recorded verdict. Apache 2.0. Self-host free, bring your own model.
