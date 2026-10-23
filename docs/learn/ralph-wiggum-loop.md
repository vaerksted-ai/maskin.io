> Source: https://maskin.io/docs/learn/ralph-wiggum-loop/

# Ralph Wiggum loop: how it works, and when "keep trying" needs a close condition and a verdict
**The Ralph Wiggum loop is a technique for running an AI coding agent unattended: you feed the same prompt to the agent over and over, in a loop, until the work is done.** Geoffrey Huntley, who named it, describes it in one line: "Ralph is a Bash loop." Each pass starts fresh, reads the files and progress the last pass left behind, does one more piece of work and exits. It's very good at grinding toward a goal a machine can check, like a test suite going green. It doesn't decide what "done" means for anyone else. That needs a close condition written before the work starts, an owner, and a verdict someone signs.

## Key takeaways
- **Ralph is a loop, not a product.** The original is a single shell line that pipes a prompt file into a coding agent forever. Plugins and CLIs add stop conditions and limits on top.
- **It works because each pass is fresh.** The agent's memory lives in files on disk (the spec, the plan, the code, the tests), not in one long conversation that fills up.
- **Its stop signal is a check the machine can run.** Tests pass, a build succeeds, or the agent prints an agreed phrase. That's a real strength for well-defined coding tasks.
- **Its limits are written down by its own makers.** Huntley says he wouldn't use it on an existing codebase. Anthropic's plugin README lists "tasks requiring human judgment" and "unclear success criteria" as poor fits.
- **A closed loop adds three things on top:** a close condition agreed before work starts, a named owner, and a verdict recorded by a person or a check they trust.
- **Use both.** Ralph inside, for the grinding. A closed loop around it, for deciding whether the result counts.

## Where the Ralph Wiggum loop comes from
Geoffrey Huntley published [Ralph Wiggum as a "software engineer"](https://ghuntley.com/ralph/) on 14 July 2025. The name comes from the Simpsons character: cheerful, persistent, not always right, but he keeps going. The original form is a single line:
**while :; do cat PROMPT.md | claude-code ; done**
That's it. A prompt file goes in, the agent works, the agent exits, the loop starts it again with the same prompt. Huntley's point is that the loop is dumb on purpose and the skill is in the prompt. He compares fixing a misbehaving Ralph to tuning a guitar: when it goes wrong, you don't blame the loop, you add a sign to the prompt that steers the next pass.
The term spread fast. US searches for "ralph wiggum loop" went from almost nothing in late 2025 to about 8,100 a month at the January 2026 peak, and have held around 2,000 to 2,400 since. Huntley tells the story himself in a podcast interview, [Inventing the Ralph Wiggum Loop](https://open.spotify.com/episode/3Gzsga210K1kW0GPr4RjH9).

## How a Ralph loop works, step by step
A working Ralph setup has four parts. The loop is the least interesting of them.
1. **A spec.** What you're building, written as files the agent can read: requirements, constraints, the tech stack. This is the part you spend the most time on.
2. **A plan file.** A running to-do list the agent updates each pass. It's how pass 40 knows what pass 39 finished.
3. **One task per pass.** Huntley's rule is "only one thing" per loop. Each pass picks the most important unfinished item, does it, records progress and exits. Small tasks keep the context window clear.
4. **Back-pressure.** Tests, type checks, linters and builds that fail loudly when the agent gets something wrong. Without them, the loop happily stacks broken code on broken code.
Then the loop runs. Each pass is a fresh session with an empty context, so the agent never drowns in its own earlier output. Its memory is the repository.

### Running it in Claude Code
You don't have to write the shell loop yourself. Anthropic ships a [ralph-wiggum plugin](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum) for Claude Code that runs the loop inside one session. You start it once:
**/ralph-loop "Build the CSV importer per SPEC.md" --completion-promise "DONE" --max-iterations 20**
The plugin uses a Stop hook. When Claude tries to finish, the hook blocks the exit and feeds the same prompt back in. The loop ends when Claude outputs the completion phrase (matched exactly) or when it hits the iteration limit. **/cancel-ralph** stops it by hand. Always set a max-iterations value. Without one, the loop only ends when the agent says the magic word.
Community CLIs and plugins do the same for Codex, OpenCode, Cursor and Copilot. The mechanics differ. The idea doesn't.

## What Ralph is good at
Be fair to the technique, because it works. Its strengths are real:
- **Greenfield builds.** Huntley's own flagship example is a new programming language, built with Ralph. He also reports an engineer delivering a contract MVP for a few hundred dollars of model usage. That's his report, not a benchmark, but it shows the shape: lots of well-specified work, done cheaply, overnight.
- **Grinding against a test suite.** If "done" means "all these tests pass", Ralph will keep going long after a person would have stopped for coffee.
- **Long tasks that overflow one session.** Because each pass is fresh, there's no slow decline as one conversation fills up.
- **Mechanical migrations.** Port these 200 files, fix these 400 lint errors, raise test coverage on this module. Clear target, cheap to check.

## Where Ralph stops, in its makers' own words
The limits aren't a critic's invention. They're in the primary sources.
- **Existing codebases.** Huntley writes that there's "no way in heck" he'd use Ralph on an existing codebase. Ralph shines where nothing can break yet.
- **It needs a senior engineer steering.** He's clear that someone experienced has to write the spec, read the output and tune the prompt. Ralph will periodically produce a broken codebase, and someone has to notice.
- **Human judgment and fuzzy success.** Anthropic's plugin README lists "tasks requiring human judgment", "unclear success criteria" and "production debugging" under not good for.
Put those together and there's a pattern. Ralph is excellent when "done" is something a machine can check. It has nothing to say when "done" is a judgment: is this the right feature, does this copy land, did this change fix the customer's problem, should we ship it.
That's the line between a retry loop and a closed loop.

## Ralph loop vs a closed loop
A closed loop is a unit of work with a stated start, a stated finish, an owner and a recorded result. The [agentic workflow vs closed loop](/docs/learn/agentic-workflow-vs-closed-loop/) page covers the full pattern. Here's how it compares to Ralph:
|  | Ralph loop | Closed loop |
| --- | --- | --- |
| What repeats | The same prompt, until a stop signal | The work, until a close condition is met |
| What "done" means | Tests pass, or the agent prints a phrase | A condition written before the work started, in words the team agreed |
| Who decides it's done | The agent, or a script | A named owner, a person or a check they trust |
| Where the result lives | Commits and a plan file in one repo | A record the team can read: status, owner, verdict, reasons |
| What happens on failure | Retry, or hit the iteration cap | A verdict that says failed and why, so the next cycle learns |
| Best for | Mechanical work with a machine-checkable target | Work where "done" is a judgment, or where the result has to outlive the session |
The two aren't rivals. A Ralph loop can be one step inside a closed loop, the grinding step. The closed loop decides whether what came out counts.

## The three things "keep trying" can't give you

### 1. A close condition written before the work starts
A completion promise is a phrase the agent prints. A close condition is a sentence the team agreed on before anyone started, describing what has to be true in the world. "All tests in /importer pass" is a completion promise. "A customer can import their 50,000-row file without contacting support, checked on three real files" is a close condition.
The difference matters because an agent under pressure to finish will find the cheapest way to make the stop signal fire. If the signal is a phrase, it can print the phrase. If the signal is a test, it can weaken the test. A close condition written in advance, in plain language, is much harder to game, and a person can read it later and see whether it was met.

### 2. An owner
Every Ralph run has an operator, the person who started it. That's not the same as an owner. An owner answers for the outcome after the loop stops: they read what came out, decide whether it counts, and are the person you ask in three weeks when something's wrong. Without one, overnight output tends to land in a branch nobody feels responsible for.

### 3. A verdict
A verdict is the recorded answer to "did this work?": succeeded, failed or inconclusive, with a reason, signed by a person or by a check they've agreed to trust. It's the step that turns a run into something the team learns from. A loop that ends at "max iterations reached" tells you it stopped, not whether it worked.
This is the same reason [human-in-the-loop AI](/docs/learn/human-in-the-loop-ai/) puts a person at the decision points rather than at every step. The person doesn't need to watch Ralph type. They need to sign the verdict.

## What a closed loop around Ralph looks like
Here's how we run loops in Maskin, an open-source workspace where people and agents work on the same typed objects. This is how our own work runs, so it's first-hand.
A loop in Maskin has an entry condition and a close condition written in plain language when the loop is created. Work items join it, agents do the steps, and an item leaves the loop only when the close condition is met. For example, the loop that ships this very page has this close condition: "A live page has been indexed and rank-checked at least 30 days after going live, or it is archived." Publishing isn't done. Being found is.
Bigger pieces of work run as bets. A bet states up front what it's testing and what success looks like. Every bet has a driver, the person or agent who owns it. When it ends, the result is recorded as a verdict, and moving a bet to succeeded or failed is reserved for a person, not an agent.
Put Ralph inside that and you get a clean split:
1. **Before:** the owner writes the close condition and the success criteria on the task or bet.
2. **During:** a Ralph loop grinds through the mechanical work against its tests, as many passes as it takes.
3. **After:** the owner, or a reviewer agent with a person signing off, checks the result against the condition written in step 1 and records the verdict.
The agent gets to keep trying. The team gets to know whether it worked.

## How to run a Ralph loop safely
If you're about to start one tonight, this checklist covers the failures people hit most:
- **Write the spec first.** If you can't describe done in a file, the loop can't either.
- **Set a max-iterations cap.** Treat it as a budget, not a formality.
- **Make back-pressure strict.** Tests, type checks and builds that fail on every mistake. Don't let the agent edit its own tests without review.
- **One task per pass.** Keep the plan file short and ordered.
- **Run it in a sandbox or container.** Unattended agents with broad permissions on your machine are a bad idea.
- **Commit every pass.** So you can see where it went wrong and roll back.
- **Write the close condition somewhere other than the prompt.** And name who signs the verdict when it stops.

## FAQ

### What is the Ralph Wiggum loop?
The Ralph Wiggum loop is a way to run an AI coding agent unattended by feeding it the same prompt in a loop until the task is done. Each pass starts a fresh session, reads the spec, plan and code left by earlier passes, does one piece of work and exits. Geoffrey Huntley named and popularised it in July 2025.

### Who created the Ralph Wiggum loop?
Geoffrey Huntley, a software engineer, described and named the technique in his July 2025 post "Ralph Wiggum as a software engineer" on ghuntley.com. He sums it up as "Ralph is a Bash loop". Anthropic's Claude Code plugin credits him and links to the original post.

### Why is it called the Ralph Wiggum loop?
It's named after Ralph Wiggum from The Simpsons: cheerful, persistent and not always right, but he keeps trying. The technique works the same way. Each pass might be wrong, but the loop keeps going, and tests and the prompt steer it back on course.

### How do I use the Ralph loop in Claude Code?
Install Anthropic's ralph-wiggum plugin and run /ralph-loop with your prompt, a --completion-promise phrase and a --max-iterations limit. A Stop hook blocks Claude from exiting and feeds the same prompt back until it prints the phrase or hits the limit. /cancel-ralph stops it.

### Does the Ralph loop actually work?
Yes, for the right work. It does well on greenfield builds and tasks with a clear, machine-checkable target such as a test suite. Its own creator says it needs an experienced engineer steering and isn't suited to existing codebases. Anthropic's plugin docs say it's a poor fit for tasks that need human judgment.

### Ralph loop vs loop engineering: what's the difference?
A Ralph loop is one specific technique: retry the same prompt until a stop signal fires. [Loop engineering](/docs/what-is-loop-engineering/) is the wider practice of designing the whole system around agents: what starts the work, what it reads and writes, where people review it, and what condition closes it. A Ralph loop can be one step inside an engineered loop.

### When should I not use a Ralph loop?
Skip it when success is a judgment rather than a check, when you're working in a large existing codebase, when debugging production, or when nobody will review the output. In those cases, put a close condition, an owner and a verdict around the work first, then decide whether a retry loop helps inside it.

## Where to go next
- [What is loop engineering in AI](/docs/what-is-loop-engineering/): designing the system that prompts the agent, not just the prompt.
- [Agentic workflow vs the closed loop](/docs/learn/agentic-workflow-vs-closed-loop/): the five parts of a closed loop and when each pattern fits.
- [Human in the loop AI](/docs/learn/human-in-the-loop-ai/): where a person's judgment belongs in agent work.
**Want your agents' work to end in a verdict, not just a stop?** [See how loops close in Maskin](/docs/learn/agentic-workflow-vs-closed-loop/), or [self-host it](/docs/self-hosted-ai-workspace/) and run your first loop.
Read next

## End agent work in a verdict, not just a stop
Maskin is the open-source, MCP-native workspace where a loop carries a close condition, an owner and a recorded verdict. Apache 2.0. Self-host free, bring your own model.
