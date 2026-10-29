> Source: https://maskin.io/docs/learn/claude-code-agent-teams/

# Claude Code agent teams: when they are enough, and when a team needs a shared record
Claude Code agent teams are an experimental feature: one session acts as team lead and spawns teammates, each with its own context window, coordinating through a shared task list and messages. They are enough for one developer, one repo, one sitting. They stop being enough when people, decisions or time must outlast the session.
*Read against [Anthropic’s agent teams docs](https://code.claude.com/docs/en/agent-teams) and [costs page](https://code.claude.com/docs/en/costs#agent-team-token-costs) on 2026-10-04. The feature is experimental and the docs change often, so check them before you rely on any detail below.*
> ✓
> **Key takeaways**
> **Agent teams are a coordination feature inside one session.** The lead, the teammates, the task list and the mailbox all belong to that session on that machine.
> **They are enough for bounded, parallel, one-person work:** parallel code review, competing-hypothesis debugging, research, and new modules where each teammate owns different files.
> **They cost more.** Anthropic says to start with 3 to 5 teammates, and its costs page puts teams at approximately 7x the tokens of a standard session when teammates run in plan mode.
> **Lighter rungs come first:** a single session, subagents, git worktrees or cross-session messaging. Anthropic’s own page says to check whether one of them does the job before you set up a team.
> **They stop being enough at four boundaries:** the session ends, a second person needs to see the work, a decision needs a reason attached, or an outcome needs checking weeks later. The docs state the first two and part of the third. The rest is what the docs do not describe.
> **A shared record is a layer above any tool.** It needs an owner per piece of work, a decision with its reason, and an outcome checked against a stated condition. A tracker you already use can do this. Maskin is one way to do it with typed objects.
![Two boxes. On the left, one session on one machine holding a team lead, teammates with a task list, and a mailbox. An arrow leads to a box on the right, the record, holding an owner, a decision with its reason, and an outcome condition.](/og-image-claude-code-agent-teams.png)
Agent teams coordinate work inside one session. The record is the part that outlasts it.

## What Claude Code agent teams are
An agent team is four parts, per Anthropic’s docs:
1. **Team lead:** the main session. It spawns teammates and coordinates the work.
2. **Teammates:** separate Claude Code instances, each with its own context window.
3. **Task list:** a shared list of work items with three states (pending, in progress, completed) and optional dependencies. Teammates can self-claim the next unblocked task.
4. **Mailbox:** messages between agents, stored as a JSON file per agent.
You enable the feature by setting the environment variable **CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS** to 1, either in your shell or under “env” in settings.json. Without it, Claude does not spawn or propose teammates. Then you describe the task and the roles in plain language. The docs’ own starter prompt asks for three teammates to explore a command-line tool from three angles: one on UX, one on architecture, one playing devil’s advocate.
Two practical details that trip people up. First, Claude sometimes spawns subagents instead of a team, and both show up in the same agent panel, so if you wanted a team, say so explicitly. Second, the default display mode is in-process (all teammates inside your terminal, switch between them with the arrow keys). Split panes need tmux or iTerm2, and the docs list VS Code’s integrated terminal, Windows Terminal and Ghostty as unsupported for split panes.

### Agent teams vs subagents vs a shared record
Anthropic’s own comparison is between subagents and agent teams. The third column is the one that does not exist inside either feature, and it is the subject of the rest of this page.
|  | Subagents | Agent teams | Shared record (tracker or workspace) |
| --- | --- | --- | --- |
| Who coordinates | Main agent manages all work | Lead, plus teammates that self-claim tasks | People and agents, against the same objects |
| Communication | Results return to the caller; subagents Claude has named can also message each other | Teammates message each other directly | Comments and links on the work item |
| Task tracking | Main agent | Shared task list | Typed work items with owners |
| Talk to the worker yourself | Through the main agent | Yes, every teammate is a full session you can message | Yes, on the work item |
| Where state lives | Inside the session | Local files, one team per session | A store outside any session |
| Visible to a second person | No | Only on your machine | Yes, by design |
| Survives the session | Within the session | Task list files persist locally; in-process teammates do not resume | Yes |
| Best for | Focused jobs where only the result matters | Parallel work that needs discussion | Work that spans people, days and agents |
Sources for the first two columns: Anthropic’s [agent teams docs](https://code.claude.com/docs/en/agent-teams) (compare-with-subagents table, Architecture and Limitations sections) and the [subagents docs](https://code.claude.com/docs/en/sub-agents). Named subagents blur the line a little, so the clean difference is not communication. It is what teams add: a shared task list with self-claiming, and a full session per teammate that you can talk to directly.

## When plain agent teams are enough
The docs are candid about the costs. They say agent teams “add coordination overhead” and that for sequential tasks, same-file edits, or work with many dependencies, a single session or subagents are more effective. The strongest uses they list are research and review, new modules, debugging with competing hypotheses, and cross-layer changes.
Use plain agent teams when all of these are true:
- **One person is steering.** You are the only human who needs to know what happened.
- **The work fits one sitting.** If the lead can finish and synthesize before you close the laptop, nothing needs to persist.
- **The pieces are independent.** Each teammate owns different files. Two teammates editing the same file leads to overwrites, per the docs.
- **The output is a result, not a decision trail.** A review summary or a bug diagnosis is consumed once.
The docs’ competing-hypotheses example is a good fit. You spawn five teammates to investigate why an app exits after one message, and tell them to try to disprove each other’s theories. The debate is the mechanism: sequential investigation anchors on the first plausible theory, and adversarial teammates counter that. You read the consensus, fix the bug, and move on. Nothing about it needs to outlive the session.
If you are new to the feature, the docs recommend starting with review and research tasks that have clear boundaries and do not write code. That advice holds up. Parallel implementation is where coordination costs show.

### Try the lighter rungs first
Before you set up a team, Anthropic’s page tells you to check whether a lighter option does the job. Climb one rung at a time:
1. **A single session.** Sequential tasks, same-file edits and dependency-heavy work belong here.
2. **[Subagents](https://code.claude.com/docs/en/sub-agents).** Helpers for research or verification inside your session. Only a summary returns to your main context, so they cost fewer tokens than teammates.
3. **[Git worktrees](https://code.claude.com/docs/en/worktrees) or [cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging).** You run several sessions yourself. With messaging, Claude can pass findings between them. No team machinery.
4. **An agent team.** Teammates share a task list, self-claim work and message each other, and you can message any of them.
5. **A shared record.** Add it when people, decisions or time outlast the session. It sits above all four rungs, because it holds what they produced, not how they ran.
Each rung up costs more. Anthropic’s [costs page](https://code.claude.com/docs/en/costs#agent-team-token-costs) says agent teams use approximately 7x more tokens than standard sessions when teammates run in plan mode. Its advice for keeping the bill down: use Sonnet for teammates, keep teams small, keep spawn prompts focused, and shut teammates down when their work is done. If your team also runs Codex, [Claude Code vs Codex](/docs/claude-code-vs-codex/) covers what changes when a team runs both.

## Where agent teams stop: four boundaries
None of the following are bugs. The first two are documented limits of an experimental, per-session feature. The third is partly documented and partly a gap. The fourth is not in the docs at all; it is what a team has no place to store. Together they are where a second layer starts to matter.
**1. The session ends.** The docs say the team config directory is removed when the session ends. The task list directory persists locally and is never uploaded, so resumed sessions keep their tasks. But in-process teammates are not restored by **/resume** or **/rewind**, and after a resume the lead may try to message teammates that no longer exist. Work state survives on your disk. The teammates themselves do not come back.
**2. A second person needs to see it.** A session has exactly one team, scoped to that session. You cannot share a team across sessions. The task list is local files under your home directory. A colleague who runs their own session cannot open it. For several people on one repo, [Claude Code team](/docs/learn/claude-code-team/) covers what travels through git and what needs a record. Teammates’ permission prompts also appear in the lead’s session, so you approve them there.
**3. A decision needs its reason.** The docs describe the task list as three states plus dependencies. Nothing described there records why a plan was approved, who overruled whom, or what you decided to leave alone. The docs also note that task status can lag: teammates sometimes fail to mark tasks complete, which blocks dependent tasks, and you check by hand.
**4. An outcome needs checking later.** “Completed” in a task list means a teammate said it finished. Whether the change held up, whether the bug came back, whether the review caught what mattered: that is a separate question, and nothing the docs describe stores the answer.

## What a shared record has to hold
You do not need a product to answer this. You need four things written down somewhere more durable than a session:
1. **An owner per piece of work.** One name, human or agent, on each item.
2. **A decision with its reason.** What was chosen, what was rejected, and who approved it.
3. **A stated outcome condition.** What “done” means in terms you can check later, not “the agent said it finished”.
4. **Links between them.** The signal that started the work, the decision it led to, the tasks that carried it out.
Shared instructions for several people are a separate question. [CLAUDE.md vs AGENTS.md](/docs/claude-md-vs-agents-md/) covers which file to keep them in.
Plenty of people already build this by hand. One Hacker News post, [What is the control plane for local AI agents?](https://news.ycombinator.com/item?id=47242849), describes using GitHub Issues as a temporary backend for agent state: the agent opens or updates an issue at session start, posts findings as comments, and the human replies from a phone. The author’s own complaint is that issue trackers were not built for an agent’s high-frequency event loop, and they ask for something more purpose-built. Our read is that the gap is also structural: an issue has no slot for a decision’s reason or an outcome condition unless you add one by convention.

### An illustrative scenario
Take a team of three developers and a product manager. If you are the product manager, [Claude Code for product managers](/docs/learn/claude-code-for-product-managers/) covers what you can do with Claude Code on your own. On Monday, one developer asks the lead to spawn three teammates to review a large pull request: security, performance, test coverage. The review is good. Two findings are real, one is deferred on purpose because a migration lands next week.
On Wednesday the product manager asks why the deferred finding was not fixed. The answer is in Monday’s session, on one laptop, in a lead’s synthesis that was never written anywhere a second person could read. The task list says three tasks were completed. It does not say one was deferred and why.
With a shared record, the review produces a work item with an owner, the deferral is a decision with a stated reason, and the follow-up check after the migration has an outcome condition. This scenario is made up to show the gap. It is not a Maskin customer story.

## How the shape of the record differs
The question is not which tool is better. It is what each one keeps, for how long, and who can read it. Here are three shapes, described from each project’s own material.
|  | Claude Code agent teams | Gas Town | Maskin |
| --- | --- | --- | --- |
| What it is | A feature inside Claude Code for coordinating teammates in one session | A multi-agent workspace manager by Steve Yegge, for Claude Code, Copilot, Codex, Gemini and others | An open-source workspace where people and agents work on shared typed objects |
| Coordinator | The team lead session | A “Mayor” agent you talk to; per-project workers, a Refinery merge queue, and a Witness and a Deacon that supervise | People and agents as drivers (owners) of objects |
| Where work state lives | Local task list and mailbox files, scoped to a session | “Beads”, a git-backed issue ledger, so work survives when a session ends | Typed objects (insight, bet, task) linked by relationships, readable by the UI, agents and people over the same API |
| Unit of record | A task with three states | A code-repo issue | A signal, a decision with a win condition, and the tasks under it |
| Stated scale | Start with 3 to 5 teammates | README contrasts “4-10 agents become chaotic” with “scale comfortably to 20-30 agents” | Not applicable. It holds the record above the sessions that do the work |
Gas Town facts are from its [README](https://github.com/gastownhall/gastown/blob/main/README.md) and Yegge’s [Welcome to Gas Town](https://yegge.ai/essays/welcome-to-gas-town/) essay, both read on 2026-10-04. The essay itself says the project was under three weeks old and that you probably do not want to use it yet, so read the table as a comparison of record shape, not of maturity. This page does not claim Maskin beats Gas Town or Anthropic’s feature. They solve different parts of the problem. Gas Town keeps work state in the code repo, which is a good place for code-shaped work. Maskin keeps it as objects that a product manager and an agent can both open, which is a good place for decisions that are not code.

## How Maskin keeps the record
Maskin is an open-source (Apache 2.0), MCP-native, self-hostable workspace. Work moves as typed objects: a signal enters as an insight, gets shaped into a bet with a win condition, and runs as tasks that people and agents share. Each object has a driver (an owner, person or agent) and a comment thread, and the bet closes with an outcome measured against its condition. The objects are the work, not a log of it, which is the property the four boundaries above are missing. The longer argument is in [the closed-loop workspace](/docs/closed-loop-workspace/), and how a record doubles as an audit trail is in [agent observability](/docs/agent-observability/).
Maskin’s agent sessions use the Claude Code and Codex command-line tools and execute in isolated microVMs, so it sits alongside the tools you already run agent teams in. It is not a replacement for agent teams, and it does not make them unnecessary. Use agent teams to do a parallel burst of work. Use the record to hold who owns what, what was decided, and what happened after. The [product delivery loop](/marketplace/product-delivery/) shows that record in use: a developer agent writes the change, a reviewer checks it against the task, and a person approves the merge before a verdict is recorded on the bet. Maskin is early, so evaluate the architecture, not a long track record. If you want to try it, you can [self-host it](/docs/self-hosted-ai-workspace/).
For adjacent decisions, [agent skills vs MCP vs Cursor rules vs workflows](/docs/agent-skills-vs-mcp-vs-cursor-rules-vs-workflows/) covers where shared instructions live, and [agent memory across sessions](/docs/learn/agent-memory-across-sessions/) covers what an agent remembers from one session to the next, and [Claude Code memory](/docs/learn/claude-code-memory/) covers what Claude Code itself keeps. If you are comparing open-source coding agents more broadly, see the [open source AI coding agent alternatives](/alternatives/open-source-ai-coding-agent/).

## A quick decision rule
- **Solo, one repo, one sitting, independent pieces:** agent teams, 3 to 5 teammates, start with review or research.
- **Solo, and a subagent or a second worktree session would do:** skip the team. It costs less.
- **Solo but the work runs over several days:** agent teams for the burst, and write the decisions and outcomes into whatever tracker you already have.
- **Two or more people, or you will need to explain it next week:** add a shared record before you add more teammates. More agents without one means more output nobody can account for.
- **More than 5 agents at once:** you are in coordination-overhead territory by Anthropic’s own guidance. Fix the bookkeeping before the headcount.

## FAQ

### What are Claude Code agent teams?
Claude Code agent teams are an experimental feature in which one Claude Code session acts as team lead and spawns teammates. Each teammate is a separate Claude Code instance with its own context window. They coordinate through a shared task list and a mailbox for direct messages, and you can message any teammate yourself. The feature is off by default.

### How do I enable Claude Code agent teams?
Set the environment variable CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS to 1, either in your shell or under “env” in settings.json. Then describe the task and the teammates you want in plain language. To open split panes instead of the default in-process view, set teammateMode in settings.json to auto or tmux; split panes need tmux or iTerm2.

### What is the difference between agent teams and subagents?
Subagents return their results to the caller, though subagents Claude has named can also message each other. Agent teams add a shared task list that teammates self-claim from, plus a full Claude session per teammate that you can message directly. Subagents cost fewer tokens because results are summarized back. Teams cost more because every teammate is a separate Claude instance.

### How many teammates should I use?
Anthropic recommends starting with 3 to 5 teammates for most workflows, with roughly 5 to 6 tasks per teammate. Token costs scale linearly with the number of teammates, coordination overhead grows, and returns diminish beyond a point. The docs say three focused teammates often outperform five scattered ones.

### Are Claude Code agent teams still experimental?
Yes, as of the docs read on 2026-10-04. Anthropic labels them experimental and disabled by default, with known limitations around session resumption, task coordination and shutdown. Because the feature is experimental, details can change between Claude Code versions, so check the current docs for the version you run.

### Can several people or sessions share one agent team?
No. A session has exactly one team, scoped to that session, and you cannot share a team across sessions or promote a teammate to lead. The task list lives in local files and is never uploaded. If several people need the same view of the work, you need a record outside the session, such as a tracker or a workspace. For the people side, read about [sharing Claude Code across a human team](/docs/learn/claude-code-team/).

### Do Claude Code agent teams work in VS Code or on Windows?
The default in-process mode works in any terminal. Split-pane mode needs tmux or iTerm2, and the docs say it is not supported in VS Code’s integrated terminal, Windows Terminal or Ghostty. The docs also note tmux has known limitations on some operating systems and works best on macOS.
Read next

## Getting started is free
Self-host Maskin today, or take a hosted trial. Run Claude Code, Codex or both on the work, and keep one record of what was decided. The [agentic-workspace cornerstone](/docs/what-is-an-agentic-workspace/) and the [self-hosted AI workspace](/docs/self-hosted-ai-workspace/) guide are the two best next reads.
