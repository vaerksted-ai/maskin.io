> Source: https://maskin.io/docs/learn/claude-code-memory/

# Claude Code memory: one person’s notes, or a record the whole team shares
**Claude Code memory is two things: CLAUDE.md files you write, and auto memory, the notes Claude writes for itself.** Both load at the start of every session. Only CLAUDE.md can be shared with your team through git; auto memory is, in Anthropic’s words, “not shared across machines or cloud environments.”
So what Claude learns from you stays on your laptop. For a team, the fix is a habit of moving useful notes into shared files, plus a shared record for the decisions and owners that don’t belong in either.
*Checked against Anthropic’s Claude Code memory docs on 22 October 2026. The product changes often, so check the docs for the version you run.*
> ✓
> **Key takeaways**
> **There are two memory systems.** CLAUDE.md is instructions you write. Auto memory is notes Claude writes. Both load into every session as context.
> **Neither is enforced.** Anthropic’s docs say Claude treats both “as context, not enforced configuration.” Use a hook when something must never happen.
> **Auto memory is private to one machine.** It lives under ~/.claude/projects/ and is shared across worktrees of the same repo, but not with teammates.
> **Only the start of the index loads.** The first 200 lines or 25KB of MEMORY.md, whichever comes first. Topic files are read on demand.
> **CLAUDE.md is the shared layer.** Commit it, keep it under about 200 lines, and give it an owner.
> **Decisions and owners need a third place.** Neither file is built to hold who owns what, what was decided and why, and whether it worked.
![Claude Code memory in two layers. CLAUDE.md, written by you and committed to git, is shared with your team. Auto memory, written by Claude under ~/.claude/projects/, stays on one machine. Decisions and owners need a third place: a shared record.](/og-image-claude-code-memory.svg)
CLAUDE.md travels through git. Auto memory stays on one machine. Decisions and owners need a record you place on purpose.

## The layers of Claude Code memory at a glance
| Layer | Who writes it | Where it lives | Shared with your team? | Loaded when |
| --- | --- | --- | --- | --- |
| Managed CLAUDE.md | Your IT or platform team | A system path set by your organization | Yes, every user on managed machines | Every session, first |
| Project CLAUDE.md | You and your team | ./CLAUDE.md or ./.claude/CLAUDE.md | Yes, through git | Every session |
| Project rules | You and your team | .claude/rules/*.md | Yes, through git | Every session, or only for matching files |
| User CLAUDE.md | You | ~/.claude/CLAUDE.md | No | Every session, every project |
| CLAUDE.local.md | You | Project root, gitignored | No | Every session in that project |
| Auto memory | Claude | ~/.claude/projects/<project>/memory/ | No, machine-local | MEMORY.md index at start, topic files on demand |
The first three rows travel with your repository or your organization’s setup. The last three stay with one person.

## How CLAUDE.md works
CLAUDE.md is a plain markdown file of instructions Claude reads at the start of every session. Anthropic’s docs suggest keeping it to things Claude should hold every time: build and test commands, conventions, project layout and “always do X” rules. Multi-step procedures belong in a skill, and instructions for one part of the codebase belong in a path-scoped rule.
A few details that matter in practice:
- **Files stack, they don’t override.** Claude Code loads CLAUDE.md from your working directory and every directory above it, and joins them together. Files in subdirectories load when Claude starts working in that folder.
- **Imports keep it organized, not smaller.** You can pull in another file with an @path import, up to four hops deep. Imported files still load at launch, so they still cost context.
- **Shorter works better.** The docs target under 200 lines per file and warn that if two instructions contradict each other, “Claude may pick one arbitrarily.”
- **AGENTS.md works too.** Claude Code can read AGENTS.md in place of CLAUDE.md. Which file wins and how to use both is covered in [CLAUDE.md vs AGENTS.md](“/docs/claude-md-vs-agents-md/”).
- **You can check what loaded.** Run /context in a session and look under Memory files.

## How auto memory works
Auto memory is on by default in local sessions. As you work, Claude decides what’s worth keeping and saves it as small markdown files. Anthropic’s docs list four kinds:
1. **User:** your role, expertise and working preferences.
2. **Feedback:** corrections you give and approaches you confirm.
3. **Project:** ongoing work, deadlines and decisions Claude can’t work out from the code or git history.
4. **Reference:** where to find things outside the project, like an issue tracker or dashboard.
Claude skips anything it can read from the codebase and anything your CLAUDE.md already says.
The files live in ~/.claude/projects/<project>/memory/, with a MEMORY.md index and one topic file per memory. The project path comes from the git repository, so every worktree and subdirectory of the same repo shares one memory folder. When you see “Saved 2 memories” or “Recalled 2 memories” in the interface, that’s Claude writing to or reading from this folder.
Only the first 200 lines or 25KB of MEMORY.md load at the start of a session. Claude Code nudges Claude to keep the index short, one line per entry, with detail moved into topic files that Claude reads only when it needs them.

### Managing auto memory
- **See and edit it:** run /memory to browse and open the files. They’re plain markdown, so you can also edit or delete them directly.
- **Turn it off:** use the toggle in /memory, set autoMemoryEnabled to false in a project’s settings, or set the environment variable CLAUDE_CODE_DISABLE_AUTO_MEMORY=1.
- **Move it:** set autoMemoryDirectory in your settings to an absolute path or one starting with ~/.
- **Clear it:** delete files in the memory folder. Memory files are kept out of Claude Code’s automatic cleanup of old session transcripts, so they stay until you or Claude removes them.

### Claude Code memory vs the Claude API memory tool
The second result for “claude code memory” is often Anthropic’s [memory tool](“https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool”) for the Claude API. It’s a different thing. The memory tool is for developers building their own agents: Claude asks to read and write files under a /memories path, and your application decides where they’re stored. It isn’t something you switch on inside Claude Code.

## Where Claude Code memory stops for a team
For one developer, this setup works well. Claude picks up your habits, and CLAUDE.md holds the project’s rules. The gaps show up when four or five people use Claude Code on the same codebase.

### Gap 1: what Claude learns from you stays with you
Say Dana tells Claude “integration tests need the local queue running,” and Claude saves it to auto memory. Dana’s Claude now knows. Sam’s Claude doesn’t, and nobody wrote it down anywhere Sam can see. Multiply that by a team and a few months, and you get five private versions of what the project needs. This isn’t a bug. The docs are clear that auto memory is machine-local by design.

### Gap 2: CLAUDE.md drifts without an owner
The shared file is only as good as its upkeep. Everyone adds lines, nobody removes them, and soon it’s 400 lines with two rules that contradict each other. The docs' advice is to review it periodically and remove outdated or conflicting lines. That only happens if someone owns the job.

### Gap 3: decisions don’t fit in either file
Auto memory’s “project” type can hold a decision for you. CLAUDE.md can state a rule for everyone. Neither is built to hold the full story a team needs later:
- what was decided, and what was rejected
- why, and who approved it
- who owns the area now
- whether it worked
Put that in CLAUDE.md and it bloats a file meant to stay under 200 lines and load into every session. Leave it in auto memory and it’s on one laptop. Either way, a teammate (or a teammate’s Claude) asking “why do we do it this way?” has nowhere to look.

## How to share what Claude Code knows across a team
Here’s a setup that keeps the useful parts of memory shared and the private parts private.

### Step 1: commit one CLAUDE.md, and name its owner
Put one project CLAUDE.md (or AGENTS.md) in the repository. Give it a named owner, a person rather than “the team,” and treat changes like code: a pull request and one reviewer. Keep it to build commands, conventions and hard-won gotchas. If it passes 200 lines, move parts into path-scoped rules under .claude/rules/.

### Step 2: promote useful auto memories
Make it a habit: when Claude says it saved a memory, glance at it. If it would help everyone, like the queue tip above, open a pull request that adds it to CLAUDE.md, then delete the private note. If it’s personal, like “I prefer short commit messages,” leave it where it is or move it to CLAUDE.local.md or your user CLAUDE.md.
A quick test for each note:
- **Would a new teammate need this to be productive?** Shared file.
- **Is it about how I like to work?** Keep it private.
- **Is it a decision with a reason and an owner?** It belongs in the shared record in step 4.

### Step 3: enforce what must hold, don’t just write it down
A CLAUDE.md line saying “never touch the billing migrations” is a request. Anthropic points to a PreToolUse hook for blocking an action no matter what Claude decides. For organizations, managed settings can deny tools or paths on every machine. Write guidance in CLAUDE.md. Enforce rules in settings and hooks.

### Step 4: give decisions and owners a shared record
The last layer is the one Claude Code doesn’t try to be. You need somewhere your team and its agents can read and write that holds a decision, its reason, its owner and its outcome. Options that work:
- **A decisions folder in the repo.** Reviewable and versioned next to the code. Hard for people who don’t work in git.
- **Your issue tracker,** with a template for the reason and a check-by date. Without the template, issues say what was done but not why.
- **A shared workspace built for it.** Maskin is one. It’s an open-source workspace where people and agents work on the same typed objects: an insight, a bet with a stated success condition, the tasks under it, and the knowledge the team has validated. Each has a driver, the person or agent who owns it, and a comment thread. It gives your team and its agents a shared record they read and write, separate from what any one Claude Code session remembers. Its agent sessions run the Claude Code and Codex command-line tools in isolated microVMs. It’s early, so judge the design rather than a track record.
Whichever you pick, add one line to CLAUDE.md saying where decisions live, so every teammate’s Claude knows where to look.
For how a team shares settings, skills and onboarding in Claude Code, see [Claude Code team](“/docs/learn/claude-code-team/”). For memory across sessions with any agent, not just Claude Code, see [agent memory across sessions](“/docs/learn/agent-memory-across-sessions/”).

## FAQ

### Does Claude Code have memory across sessions?
Yes. Each session starts with a fresh context window, but two things carry over: CLAUDE.md files you write, and auto memory, notes Claude saves about your corrections and preferences. Both load at the start of every session. Auto memory loads the first 200 lines or 25KB of its MEMORY.md index, and reads topic files on demand.

### Where is Claude Code memory stored?
Auto memory is stored in ~/.claude/projects/<project>/memory/ on your machine, with a MEMORY.md index and one file per memory. The project folder comes from your git repository, so all worktrees share it. CLAUDE.md files live in your project (./CLAUDE.md or ./.claude/CLAUDE.md), your home folder (~/.claude/CLAUDE.md) or a managed system path.

### What is the difference between Claude Code memory and CLAUDE.md?
CLAUDE.md is instructions you write: build commands, conventions, rules. Auto memory is notes Claude writes itself: your preferences, corrections and context it couldn’t get from the code. CLAUDE.md can be committed and shared with a team. Auto memory stays on one machine. Both are treated as context, not enforced rules.

### Can a team share Claude Code memory?
Not auto memory: Anthropic’s docs say it’s machine-local and not shared across machines. A team shares through committed files instead: a project CLAUDE.md, .claude/rules/ and project skills. Organizations can also push a managed CLAUDE.md to every machine. The practical habit is to move useful auto memories into CLAUDE.md through a pull request.

### How do I turn off or clear Claude Code memory?
Open /memory in a session and use the auto memory toggle, set autoMemoryEnabled to false in a project’s settings, or set CLAUDE_CODE_DISABLE_AUTO_MEMORY=1. To clear it, delete files in ~/.claude/projects/<project>/memory/ or edit them through /memory. They’re plain markdown files.

### Is the Claude API memory tool the same as Claude Code memory?
No. The memory tool is an API feature for developers building their own agents. Claude requests file operations under a /memories path and your application stores them wherever you choose. Claude Code’s memory is built in: CLAUDE.md files and auto memory on your machine.

### Why does Claude ignore my CLAUDE.md?
Usually because the file is long, vague or contradicts itself. Anthropic’s docs recommend under 200 lines, specific instructions such as “run npm test before committing”, and removing conflicting lines, because Claude may pick one arbitrarily. Run /context to confirm the file loaded. For anything that must always hold, use a hook instead.
Read next

## Want a record your whole team and its agents read and write?
Self-host Maskin and give decisions and owners a home outside any one laptop. The [self-hosted AI workspace](/docs/self-hosted-ai-workspace/) guide covers the setup, and the [agentic-workspace cornerstone](/docs/what-is-an-agentic-workspace/) explains the model.
