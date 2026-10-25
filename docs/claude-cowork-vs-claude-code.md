> Source: https://maskin.io/docs/claude-cowork-vs-claude-code/

# Claude Cowork vs Claude Code: what each is for, and when neither fits a team
Anthropic’s own pages say Claude Cowork is no longer a separate product: it merged with chat into one Claude on 16 September 2026, rolling out in stages. Claude Code is still its own product, built for software engineering. The practical choice is now Claude for documents, research and spreadsheets, or Claude Code for a codebase.
*Read against Anthropic’s own pages on 2026-10-04 (sources linked inline); pricing re-checked on 2026-10-25. The rollout is staged, so what your account shows may differ from what is described here.*
> ✓
> **Key takeaways**
> **Cowork merged into chat; Claude Code did not.** Anthropic’s help center says what Cowork did is now available from any Claude conversation, and that “the Code tab” stays where it was.
> **Choose by what the work touches.** Reports, spreadsheets, decks and folders of documents suit the Cowork-style task. Repositories, tests, commits and pull requests suit Claude Code.
> **Same engine, different hands.** Anthropic says Cowork uses the same agentic architecture as Claude Code, with no terminal required.
> **Setups do not carry over by default.** Cowork loads the connectors, skills and plugins enabled on your claude.ai account and does not read the **~/.claude** directory that Claude Code uses.
> **Both come with paid plans.** On Anthropic’s pricing page, Claude Code is included from Pro ($17 a month billed annually, $20 monthly) upward and is not on Free.
> **Neither is a shared record for a team.** Each keeps work inside Anthropic’s product. What a team still needs is one place that says who owns a piece of work, what was decided and whether it worked.
![Two boxes, Claude (Cowork-style tasks on documents, sheets and decks) and Claude Code (repository, tests and pull requests), both feeding one team record that holds an owner, a decision with its reason and an outcome condition.](/og-image-claude-cowork-vs-claude-code.png)
Two Claude products, two kinds of work, and one record a team still has to keep somewhere else.

## Are Claude Cowork and Claude Code still separate products?
For Cowork and chat, no. For Cowork and Claude Code, yes, with a lot of shared plumbing.
On 16 September 2026 Anthropic announced that Claude Cowork and chat are merging into one Claude. Its own explanation: it built Cowork as a separate place for bigger work, people used both, and the frustrating part was deciding where a task belonged. The details that matter if you are choosing a tool now:
- **It is rolling out gradually.** Pro and Max first, then Team and Free “soon”. Enterprise admins get at least 30 days’ notice before anything changes for their organization.
- **Your account may not have it yet.** If your message box still shows “Chat” and “Cowork” options, you are on the old experience. Once your account moves, you cannot switch back.
- **Nothing you built is lost.** Existing Cowork tasks, projects, connectors, skills, artifacts and files carry over.
- **Claude Code stays where it was.** The help center says the model picker and the “Code” tab are where they were, and the pricing page still lists Claude Code as its own feature.
One thing is easy to misread. Anthropic also redesigned Projects inside Claude Code in the same week. Anthropic’s Claude Code docs describe it narrowly: Projects are in public beta on Pro and Max plans, not yet on Team or Enterprise, and a project is one coordinating conversation that starts threads, each usually a Claude Code cloud session. Existing projects on Pro and Max keep working as they do today until the rollout reaches chat and Cowork. That is not a merger of Claude Code with chat.
Sources: [Claude Cowork and chat are now one Claude](https://claude.com/blog/cowork-is-now-claude), [Claude Cowork and chat are one Claude (help center)](https://support.claude.com/en/articles/16761823-claude-cowork-and-chat-are-one-claude), [Claude Code Projects docs](https://code.claude.com/docs/en/claude-projects.md).

## Cowork vs Claude Code at a glance
|  | Claude Cowork (now part of Claude) | Claude Code |
| --- | --- | --- |
| Built for | Non-coding knowledge work: research, analysis, documents, spreadsheets, presentations | Software engineering: writing, debugging and shipping code |
| Where you use it | Claude desktop, web and mobile, from any conversation once your account has the new experience | Terminal, VS Code, JetBrains, the Code tab in Claude desktop, web and mobile |
| What it works on | Folders you grant on desktop, connected apps, a built-in browser | A codebase: edits files, runs commands, uses git, opens pull requests |
| Where it runs | Anthropic’s cloud by default (in beta); local files and browser reached through the desktop app | Your machine, or a cloud session |
| Instructions it reads | Instructions for Claude in settings, folder instructions, skills and plugins on your account | CLAUDE.md files, skills, hooks and MCP servers in your project and home directory |
| Parallel work | Coordinates sub-agents on parallel workstreams | Subagents, agent teams (experimental), worktrees, Projects (beta) |
| Scheduled work | Scheduled tasks that run in the cloud | Routines that run on a schedule, an API call or a GitHub event |
| Sharing with a team | Sessions cannot be shared; live artifacts can be shared inside a Team or Enterprise organization | Output can be shared as artifacts; Projects not yet on Team or Enterprise |
| Plans | Pro, Max, Team, Enterprise | Pro, Max, Team, Enterprise; not Free |
Sources: Anthropic’s [Claude Cowork product page](https://claude.com/product/cowork), [Get started with Claude Cowork](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork), [Claude Code overview](https://code.claude.com/docs/en/overview.md), [Claude Code docs index](https://code.claude.com/docs/llms.txt) and [pricing page](https://claude.com/pricing).

## What Cowork is for
Anthropic’s examples all have the same shape: the inputs are scattered across folders and apps, and the output is a document a person reviews.
- A weekly marketing readout that pulls numbers from an analytics tool and a Drive folder, compares them to the week before, flags anything that moved more than 10%, and saves a three-slide deck.
- Reconciling regional spreadsheet exports against budget files and returning a working spreadsheet with variances flagged.
- A first-pass review of a folder of inbound contracts against your playbook, one memo per contract with each departure cited to the clause.
- A quarter of sales call notes turned into a memo on where each open deal stands and which objections keep coming up.
You describe the outcome, Claude plans the steps, and by default it asks before taking actions. A permission setting lets it run with fewer check-ins (Auto) or ask every time (Manual). Anthropic’s advice for work with real consequences, such as messages sent as you, is to stay close and review.

## What Claude Code is for
Claude Code’s output is a diff. Anthropic’s overview lists writing tests for untested code, fixing lint errors across a project, resolving merge conflicts, updating dependencies, writing release notes, building features, fixing bugs, and creating commits and pull requests. It reads a CLAUDE.md file at the start of every session, connects to tools over MCP, and runs in CI through GitHub Actions or GitLab.
“Code” does not mean it only touches code. The Projects docs list non-code work as a fit too, such as a folder of contracts or a support-ticket export that you keep returning to with new questions. But if your day is documents and spreadsheets and you do not want a terminal or a repository in the picture, the Cowork-style task is the shorter path.

## Choosing by job
| If the job is | Reach for | Why |
| --- | --- | --- |
| A weekly report built from several apps | Claude (Cowork-style task) | Connectors and scheduled tasks are built for this |
| Reconciling spreadsheets or reviewing a folder of documents | Claude (Cowork-style task) | The output is a file you review |
| Fixing a failing test or refactoring a module | Claude Code | It works in the repo and runs the tests |
| Opening a pull request or reacting to a GitHub event | Claude Code | Git, CI and routines are native |
| A recurring job tied to code | Claude Code routines | They can trigger on a schedule, an API call or a GitHub event |
| A recurring job tied to documents and apps | Cowork scheduled tasks | They run in the cloud with no device online |
| Spec in, shipped feature out | Both, with a handoff | See the next section |

## The handoff problem: what does not carry between them
The case that trips people up is the job that crosses both. A product manager drafts a spec as a document, and a developer builds it from the spec. Anthropic’s pages are specific about what does and does not travel:
- **Cowork does not read your Claude Code setup.** Anthropic’s Cowork docs say it loads the connectors, skills and plugins enabled for your claude.ai account, synced at session start, and does not read the **~/.claude** directory on your machine. A skill that exists only there is invisible to Cowork until you add it under Customize.
- **Cloud threads do not either.** The Projects docs say cloud threads pick up nothing from the Claude Code setup on your own machine, so skills, plugins, connectors and tools have to be given to them.
- **Plugins are the shared route.** Anthropic says a plugin you add is saved to your account, so it works in chat, Claude Code and Cowork.
- **Local memory stays local.** Memory from Cowork tasks that ran only on your computer stays with those tasks.
So pick one home for the instructions a team relies on, and put each one where both products can reach it. Otherwise the spec and the code drift apart, and the explanation of why lives in whoever remembers the conversation.

## Cost and usage
Anthropic’s pricing page on 2026-10-25 lists Free at $0 (no Claude Code), Pro at $17 a month billed annually ($200 up front) or $20 monthly, and Max from $100 a month. Claude Code is included in Pro, Max, Team and Enterprise. Anthropic says prices and plans are subject to change.
On usage, everything you do with Claude counts toward your plan limits, and longer agentic tasks that search the web, run code or create files generally use more than a quick question. Auto mode uses more of your limit than the other permission modes, because Claude reviews each action. On Team and Enterprise plans, Claude Code’s usage draws from a per-seat allowance that Anthropic says is shared with chat and Cowork.
Anthropic’s pages do not publish a per-product token comparison, so this page does not give one. If you are choosing on cost, track your own usage for a week in each.

## When neither fits a team
Both products are good at what they are for. They are less good at being the place where a team’s work is recorded, because each keeps work inside Anthropic’s product, in one person’s account.
Anthropic’s Cowork help article lists “no session sharing” as a limitation: sessions cannot be shared with others, though on Team and Enterprise plans live artifacts can be shared inside the organization. The pricing page shows project sharing and collaboration on Team and Enterprise plans but not on Pro or Max, and the Claude Code Projects beta is not yet on Team or Enterprise. Team plans also add admin controls and usage analytics. None of that is a record that spans both products and everything else a team uses.
Here is an illustrative scenario (made up, not a customer story). On Monday, someone uses a Cowork-style task to build the weekly readout, and it flags a drop in activations. A developer fixes a likely cause in Claude Code on Tuesday. On Friday the product manager asks whether the fix worked and who decided it was the right fix. The readout is in one account’s task history, the pull request is in the repository, and the decision is in a chat thread. Nothing links the signal, the decision and the outcome.
What closes that gap is the same four things whichever tool you use: an owner per piece of work, a decision with its reason, an outcome condition you can check later, and links between them. A tracker you already have can hold these at small scale.
Maskin is one way to hold them with typed objects. It is an open-source (Apache 2.0), MCP-native, self-hostable workspace where a signal enters as an insight, becomes a bet with a win condition, and runs as tasks that people and agents share. Maskin’s agent sessions use the Claude Code CLI by default, or the Codex CLI, inside isolated microVMs, so it sits alongside the tools above rather than replacing them. Three honest limits: it is not a personal-files agent, so for one person’s folders and documents the Cowork-style task is the better fit; cross-conversation agent memory is a known gap; and Maskin is early, so judge the architecture, not a track record. For the longer argument, see [AI product workspace vs AI coding agent](/docs/ai-product-workspace-vs-coding-agent/) and [the closed-loop workspace](/docs/closed-loop-workspace/). If you came here looking for an open-source option, see the [open source alternative to Claude Cowork](/alternatives/open-source-alternative-to-claude-cowork/), and to try Maskin yourself, you can [self-host it](/docs/self-hosted-ai-workspace/).

## FAQ

### What is the difference between Claude Cowork and Claude Code?
Claude Code is built for software engineering: it works in a codebase, runs commands, and opens pull requests. Cowork was built for non-coding knowledge work such as research, spreadsheets and presentations, with no terminal needed. Anthropic says they share the same agentic architecture. Since 16 September, Cowork’s abilities are part of regular Claude conversations as accounts migrate.

### Is Claude Cowork still a separate product?
Not from chat. Anthropic announced on 16 September 2026 that Cowork and chat merge into one Claude, rolling out gradually to Pro and Max first. Existing Cowork tasks, projects, skills and files carry over, and you cannot switch back once your account moves. Claude Code is not part of that merger and keeps its own Code tab and docs.

### When should I use Claude Cowork vs Claude Code?
Use the Cowork-style task when the output is a file someone reviews: a report, a spreadsheet, a deck, a memo on a folder of documents. Use Claude Code when the output is a change to a repository: tests, a bug fix, a refactor, a pull request. For a spec that becomes a feature, use both and decide where shared instructions live.

### Is Claude Cowork the same as Claude Code?
No. They share an architecture and an account, but they are built for different work and read different setups. Cowork loads the skills, connectors and plugins enabled on your claude.ai account. It does not read the .claude directory on your machine that Claude Code uses. Plugins you add are saved to your account and work in both.

### Do Claude Cowork and Claude Code cost extra?
Per Anthropic’s pricing page on 2026-10-25, Claude Code is included in Pro ($17 a month billed annually, $20 monthly), Max (from $100), Team and Enterprise, and is not on Free. Cowork is on paid plans only. Usage counts toward your plan limits, and longer agentic tasks use more. Prices can change, so check the page.

### Can Claude Code do non-coding work?
Yes, to a degree. Anthropic’s Claude Code Projects docs list non-code work as a fit, such as a folder of contracts or a support-ticket export you keep asking questions of, with results delivered as files. But if you do not want a terminal or a repository involved, the Cowork-style task in Claude is the shorter path. Anthropic positions Cowork for non-coding knowledge work.

### Can a team share Claude Cowork sessions?
Not sessions. Anthropic’s help article lists “no session sharing” as a limitation, though on Team and Enterprise plans live artifacts can be shared inside your organization. If a team needs one view of who owns what and what was decided across Claude, Claude Code and other tools, that record has to live outside any single account, in a tracker or a workspace.
Read next

## Getting started is free
Self-host Maskin today, or take a hosted trial. Run Claude Code or Codex on the work, and keep one record of what was decided. The [agentic-workspace cornerstone](/docs/what-is-an-agentic-workspace/) and the [self-hosted AI workspace](/docs/self-hosted-ai-workspace/) guide are the two best next reads.
