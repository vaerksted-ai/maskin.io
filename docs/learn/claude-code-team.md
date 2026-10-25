> Source: https://maskin.io/docs/learn/claude-code-team/

# Claude Code team: how to share context and decisions, not six private setups
**How do you use Claude Code as a team, and not as six people with six private setups?** Move three things out of private laptops: the setup (settings, skills, hooks), the context (what Claude should know about the project) and the record (who owns what, what was decided and why). The first two travel in your repository. The third needs a home you pick on purpose.
This guide covers how people and Claude Code work together. It does not cover plans, seats or prices. For those, start with Anthropic’s own page, [Use Claude Code with your Team or Enterprise plan](https://support.claude.com/en/articles/11845131-use-claude-code-with-your-team-or-enterprise-plan).
*Read against [Anthropic’s Claude Code docs](https://code.claude.com/docs/en/settings) on 2026-10-15. The product changes often, so check the docs for the version you run before relying on any detail below.*
> ✓
> **Key takeaways**
> **Most of the setup already travels through git.** Commit the shared settings file and project skills, and every teammate who clones gets them.
> **Claude’s own notes do not travel.** Anthropic’s docs say auto memory is machine-local and not shared across machines. Something one person taught Claude stays on that person’s laptop until someone writes it into a shared file.
> **/team-onboarding spreads a setup, not a decision.** It builds a guide from one person’s last 30 days of usage. It does not keep owners or decisions current.
> **A rule file is a request, not a lock.** Anthropic’s docs say Claude treats CLAUDE.md as context, not enforced configuration. Use a hook when something must never happen.
> **The gap is the record.** Who owns what, what was chosen, what was rejected, and whether it worked. Nothing in Claude Code’s team features is described as keeping that, so pick a home for it.
![Three columns. In git: settings.json, CLAUDE.md and project skills, which reach every teammate who clones. On a laptop: auto memory and settings.local.json, which stay with one person. Needs a record: an owner, a decision with its reason, and an outcome check, which have no home by default.](/og-image-claude-code-team.svg)
Git carries the setup. Laptops hold private notes. The record is the part a team has to place on purpose.

## What a team shares by default, and what it doesn’t
Here is what reaches a teammate who clones your repository, based on Anthropic’s settings, memory and skills docs:
| What you want to share | Where it lives | Reaches teammates? |
| --- | --- | --- |
| Permissions, hooks, plugins | .claude/settings.json in the repo | Yes, once committed |
| Your personal overrides | .claude/settings.local.json | No, kept out of commits |
| Project rules and conventions | CLAUDE.md in the repo | Yes, once committed |
| Reusable procedures | .claude/skills/ in the repo | Yes, once committed |
| What Claude learned from your corrections | Auto memory under ~/.claude/projects/ | No, machine-local |
| Who owns what, and why a call was made | Nowhere by default | No |
The last two rows are the whole problem. The first four are configuration, and git handles configuration well. The last two are knowledge about the work, and nobody has decided where it goes.

## Step 1: Commit the setup so there is one
Anthropic’s settings docs describe four places a setting can live: managed (set by your organization), user, shared project and project local. The one that makes a team is the shared project file, `.claude/settings.json`. Commit it and everyone who clones gets the same permissions, hooks and plugins. Each person can still override it for themselves in `.claude/settings.local.json`, which Claude Code keeps out of commits, so personal exceptions never need a pull request.
Two details that surprise teams:
- **Some committed keys wait for trust.** Allow rules and most environment variables apply only after each teammate trusts the folder. Until then they still see permission prompts. If a rule “isn’t working” for a new hire, check this first.
- **The session reads the file from where it starts.** Claude Code reads the shared file from the session’s primary working directory, so start at the repository root.
Do the same for skills. A skill committed at `.claude/skills/<name>/SKILL.md` is available to everyone who clones. Plugins are the other route, and organizations can push skills and a managed CLAUDE.md to every machine through managed settings. For a small team, committing to the repo is enough and needs no admin. If you are new to skills, [what are agent skills?](/docs/learn/agent-skills/) explains the format.

## Step 2: One context file, with an owner
Instructions belong in one committed CLAUDE.md (or AGENTS.md) that says how to build, test and name things. Which filename to use and how nested files combine is a separate question, covered in [CLAUDE.md vs AGENTS.md](/docs/claude-md-vs-agents-md/). This page assumes you have one and asks a different question: who keeps it true? If part of your team runs Codex, which reads AGENTS.md, [Claude Code vs Codex](/docs/claude-code-vs-codex/) covers sharing one instructions file across both tools.
Give it an owner, a person’s name, not “the team”. Treat changes like code: a pull request, one reviewer. Without an owner the file only grows, and a long file with contradicting lines is worse than a short one.
Then deal with auto memory, because it is where private knowledge builds up. Claude saves notes about your corrections and preferences on its own, in a directory under your home folder. The docs state those files are not shared across machines. So if Dana tells Claude “tests need Docker running” and Sam never does, Dana’s Claude knows and Sam’s does not, and neither of them has written it down. A habit that fixes this: when Claude saves a memory that would help everyone, move it into CLAUDE.md in a pull request and let the private note go.
Remember what the file can and cannot do. If a rule must hold every time, such as “never touch the billing migrations”, a CLAUDE.md line is a request. Anthropic’s docs point to a PreToolUse hook for blocking an action, and a hook can live in the committed settings file.

## What /team-onboarding does, and what it doesn’t
If you searched “claude code team onboarding”, you probably meant this. `/team-onboarding` is a built-in Claude Code command. Per Anthropic’s [commands reference](https://code.claude.com/docs/en/commands), it analyzes your sessions, commands and MCP server usage from the past 30 days and writes a markdown guide that a teammate can paste as a first message to get set up fast. For claude.ai subscribers on Pro, Max, Team and Enterprise plans, it also returns a share link teammates can open directly in Claude Code.
It is useful for the problem it targets: a new person does not know which commands, skills and connected tools the experienced person reaches for. One command beats a Slack thread of tips.
What it does not do follows from how it works:
- **It describes one person’s habits.** The input is one person’s recent usage. It reflects how that person works, which may not be how the team agreed to work.
- **It is a snapshot.** A guide made today does not update when conventions change. Third-party explainers such as [ClaudeLog](https://claudelog.com/faqs/what-is-team-onboarding-in-claude-code/) suggest regenerating it periodically for the same reason.
- **It holds no decisions or owners.** Usage history shows what someone did, not what the team chose, what it rejected, or who answers for an area.
Treat it as a good first-day handout. It spreads a setup. It does not keep decisions or owners current, and nothing in Anthropic’s description claims it does.

## Step 3: Give decisions and owners a home
This is the step teams skip, and it is the one that stops the six-private-setups drift from coming back. You need three things written somewhere more durable than a session and more visible than a laptop:
1. **An owner per area or piece of work.** One name, a person or an agent.
2. **A decision with its reason.** What was chosen, what was rejected, who approved it.
3. **An outcome you can check.** What “this worked” means, stated before you ship, so someone can look later.
A record this small is enough to start:
- **Decision:** one sentence.
- **Why, and what we rejected:** two lines.
- **Owner:** one name.
- **Check by:** a date.
- **Outcome:** filled in later, against the condition you set.
Where it lives is a real choice, and none of these is wrong:
- **A decisions folder in the repo.** Good for code-shaped calls. Reviewable, versioned, next to the code. Weak for people who do not live in git.
- **The tracker you already use.** Works if you add fields or a template for the reason and the check date. Without them, an issue says what was done but not why.
- **A workspace built for it.** Maskin is one option. It is an open-source, MCP-native workspace where people and agents work on typed objects: a signal comes in as an insight, becomes a bet with a stated win condition, and runs as tasks. Each object has a driver (the owner) and a comment thread, and the bet closes with an outcome measured against its condition. Its agent sessions run the Claude Code and Codex command-line tools in isolated microVMs, so it sits beside the tools your developers already use. It is early, so judge the design, not a long track record. The longer argument is in [the closed-loop workspace](/docs/closed-loop-workspace/), and you can [self-host it](/docs/self-hosted-ai-workspace/).
The choice matters less than having one and saying where it is.

### An illustrative week
This scenario is made up to show the gap. It is not a Maskin customer story.
A team of four developers and a product manager all use Claude Code. On Monday, Sam asks Claude to refactor the export module and tells it to leave the legacy CSV path alone because a customer still depends on it. Claude saves a note. On Wednesday, Dana runs a cleanup and removes the legacy path. Her Claude had no such note, and CLAUDE.md never mentioned it.
Nothing in the shared setup was wrong. The settings matched, the skills matched, the CLAUDE.md was clean. What was missing was a decision with a reason and an owner: “Keep the legacy CSV export until the customer migrates. Owner: Sam. Check: end of quarter.” With that in the record, and the one-line rule promoted into CLAUDE.md, Dana’s session starts with the answer.

## Common ways this goes wrong
- **Everyone commits to CLAUDE.md and nobody prunes it.** Rules pile up and start to contradict. Anthropic warns that when two instructions conflict, Claude may pick one arbitrarily. Give the file an owner and a size budget.
- **Personal settings leak into the shared file.** Keep preferences in the local file. Review changes to the committed settings like code, since they change what every session is allowed to do.
- **A guide replaces a conversation.** A generated onboarding guide gets a person running. It does not tell them what the team decided last month.
- **Treating the several-agents feature as the team answer.** Having Claude coordinate several agents in one session is a different thing from coordinating several people. If you are asking about that, read [Claude Code agent teams](/docs/learn/claude-code-agent-teams/).
- **Memory without a decision trail.** Notes from past sessions help an agent remember. They do not tell a human reviewer why something was decided. For that distinction, see [agent memory across sessions](/docs/learn/agent-memory-across-sessions/).

## A first-week checklist
1. Commit `.claude/settings.json` with the permissions and hooks the whole team needs. Tell people to use `settings.local.json` for the rest.
2. Name one owner for CLAUDE.md. Cut it to rules you could check in a pull request.
3. Move any project skills your best user has into `.claude/skills/` and commit them.
4. Run `/team-onboarding` on your most experienced user’s machine and hand the result to the next hire, as a starting point, not a standard.
5. Pick the home for decisions. Write the first five from the last month, with an owner and a check date each.
6. Add one line to your pull request template: “Does this change a decision? If so, update the record.”
7. Review the record and CLAUDE.md together once a month. A short review beats a rewrite.

## FAQ

### What does Claude Code team onboarding do?
/team-onboarding is a Claude Code command that reads your last 30 days of sessions, commands and MCP server usage and writes a markdown guide a teammate can paste as a first message. On Pro, Max, Team and Enterprise plans it also returns a share link. It shares one person's setup. It does not track decisions or owners.

### How do you use Claude Code as a team?
Share the setup through git: commit the shared settings file, project skills and one CLAUDE.md with a named owner. Then pick a place for decisions and owners, since Claude's own memory is private to each machine. A decisions folder, your tracker or a workspace all work, as long as everyone knows which one.

### Do teammates share Claude Code settings?
Yes, through the repository. Commit .claude/settings.json and teammates who clone it get the same permissions, hooks and plugins. Each person can override it in .claude/settings.local.json, which stays out of commits. Some committed keys, such as allow rules, apply only after each teammate trusts the folder.

### Does Claude Code share memory between teammates?
No. Anthropic's docs say auto memory is machine-local and its files are not shared across machines. CLAUDE.md is the shared channel, because you commit it. If Claude learns something the whole team needs, move it into CLAUDE.md through a pull request.

### Can I make Claude Code follow a team rule every time?
Not with a rule file alone. Anthropic's docs say Claude treats CLAUDE.md as context, not enforced configuration. To block an action regardless of what Claude decides, use a PreToolUse hook in the committed settings, and keep CLAUDE.md for guidance.

### How is this different from Claude Code agent teams?
Agent teams put several Claude sessions to work on one task, coordinated by a lead. This page is about several people and their agents sharing context and decisions over weeks. They solve different problems. The agent teams feature is covered in [Claude Code agent teams](/docs/learn/claude-code-agent-teams/).
Read next

## Getting started is free
Self-host Maskin today, or take a hosted trial. Run Claude Code, Codex or both on the work, and keep one record of who owns what and what was decided. The [agentic-workspace cornerstone](/docs/what-is-an-agentic-workspace/) and the [self-hosted AI workspace](/docs/self-hosted-ai-workspace/) guide are the two best next reads.
