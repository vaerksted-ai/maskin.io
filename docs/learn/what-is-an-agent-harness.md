> Source: https://maskin.io/docs/learn/what-is-an-agent-harness/

# What is an agent harness? A plain definition, the main options, and where the work lands
**An agent harness is everything in an AI agent except the model: the code, prompts, tools and loop that turn a model’s answers into actions.** The model predicts the next step. The harness gives it instructions, tools, a place to work, and the loop that runs it until the job is done. Claude Code is one.
The shorthand “Agent = Model + Harness” comes from LangChain, and Martin Fowler’s site quotes it: “The term harness has emerged as a shorthand to mean everything in an AI agent except the model itself.” The Claude Agent SDK, OpenAI’s Codex CLI and LangChain’s Deep Agents are harnesses too. What a harness doesn’t keep is the team’s record of the work: who asked for it, who owns it, and whether it worked.
> ✓
> **Key takeaways**
> **Agent = model + harness.** LangChain’s shorthand: if it isn’t the model weights, it’s harness: prompts, tools, context handling, permissions, the loop.
> **The harness decides most of what you experience.** The same model behaves very differently in two harnesses, because the harness controls what it sees and what it can do.
> **A harness is more opinionated than a framework.** Frameworks give you building blocks. Runtimes give you durable execution. Harnesses come with defaults already wired in.
> **Good harnesses have guides and sensors.** Guides steer the agent before it acts. Sensors such as tests and linters catch mistakes after.
> **Harnesses are swappable.** Teams change harnesses as models and tools move. That’s a reason to keep the record of the work somewhere that outlasts any one of them.

## Where the word “harness” comes from
In agent work the word took hold in 2025 and 2026. A few definitions that have stuck:
- **Martin Fowler’s site** (Birgitta Böckeler, April 2026), quoting LangChain’s “Agent = Model + Harness”: “The term harness has emerged as a shorthand to mean everything in an AI agent except the model itself.”
- **LangChain** (Harrison Chase, October 2025) places a harness above frameworks and runtimes: it “adds in default prompts, opinionated handling for tool calls, tools for planning, has access to a filesystem, and more.”
- **Anthropic** (November 2025) calls its own Claude Agent SDK “a powerful, general-purpose agent harness adept at coding” and other tool-using tasks.
US searches for “agent harness” went from almost none in August 2025 to a peak of about 6,600 a month in April 2026. The idea caught on because it named something builders already felt: most of the work in making an agent reliable happens outside the model.

## What’s inside an agent harness
Strip any harness down and you’ll find roughly the same parts. This is a working map, not a standard. A harness has eight parts:
1. **The loop**: call the model, run its tool, repeat.
2. **Instructions**: system prompt plus files like CLAUDE.md or AGENTS.md.
3. **Tools**: file edits, shell, web search, MCP servers.
4. **Context management**: what fits in the context window each call.
5. **State and memory**: progress that survives between sessions.
6. **Permissions and sandboxing**: what the agent may touch, and where it runs.
7. **Guides and sensors**: rules before it acts, checks after.
8. **Hooks and extensions**: your own code at set points.
A few of these need more than a label. The loop is the part every harness has: call the model, run the tool it asked for, feed the result back, repeat until it stops. Instruction files are loaded every session so the agent starts with your project’s rules. Context management means summarizing or dropping old material when the window fills up. State can be as plain as a plan file or a progress log on disk.
Guides and sensors are Böckeler’s terms. Guides steer the agent before it acts (rules, examples, specs). Sensors check after it acts (tests, type checks, linters, reviews) so it can correct itself. Hooks are where you can run your own code, for example to block a command or add a check when the agent tries to stop.
Anthropic’s write-up on long-running agents shows how much of this is plain engineering. Their harness has a first session that sets up the environment and a progress file, then asks each later session to work on “only one feature at a time.” None of that is the model. All of it changes the result.

## Agent harness vs framework vs runtime
These three get mixed up constantly. Harrison Chase’s split is the clearest one in use:
|  | Agent framework | Agent runtime | Agent harness |
| --- | --- | --- | --- |
| What it gives you | Building blocks and abstractions | Infrastructure to run agents reliably in production | A ready-made agent with defaults wired in |
| Typical features | Model wrappers, tool definitions, chains | Durable execution, streaming, persistence, human-in-the-loop pauses | System prompt, planning tools, filesystem, tool-call handling, context management |
| How opinionated | Low | Low to medium | High |
| You write | Most of the agent | The agent logic, not the plumbing | Your task and your domain tools |
| Examples | LangChain, OpenAI Agents SDK, Google ADK, Vercel AI SDK | LangGraph, Temporal, Inngest | Claude Code, Claude Agent SDK, Deep Agents, Codex CLI |
The runtime gives you the most control and the least abstraction. The harness gives you the reverse. Many teams use a harness without ever touching the layers below it.

## Agent harness vs model
A question that comes up a lot: if the model is so capable, why does the harness matter? Because the model only sees what the harness shows it and can only do what the harness lets it do. Two practical consequences:
- **Benchmarks measure a pair, not a model.** A coding score is really a model-plus-harness score. Change the harness and the number moves.
- **You can improve an agent without touching the model.** Better instructions, tighter tools, stricter tests and smarter context handling are all harness work, and they’re usually the cheapest gains available.

## The main types of agent harness
A fair way to compare harnesses is by what they’re built for, rather than by a feature checklist that changes every month.

### Coding harnesses you use directly
Claude Code, OpenAI’s Codex CLI and open-source options such as OpenCode are harnesses you run in a terminal or an editor. They come with file editing, shell access, project instruction files, permissions and a loop tuned for software work. **Pick one of these** if your job is writing and changing code and you want something that works today.

### General-purpose harnesses you build on
The Claude Agent SDK and LangChain’s Deep Agents give you a harness as a library. You bring the model and your domain tools, and they supply the loop, planning, filesystem access and context handling. Anthropic positions its SDK for coding and for other tasks that need tools to gather context, plan and act. LangChain describes Deep Agents as a general-purpose equivalent of Claude Code. **Pick one of these** when you’re building an agent into your own product or workflow.

### Your own harness on a framework or runtime
Some teams start from a framework and a runtime and assemble their own harness. It’s more work, but every default is yours. **Do this** when no off-the-shelf harness fits your constraints, such as strict data handling or an unusual tool set, and you have the engineering time to maintain it.

### How to choose
Ask four questions, in order:
1. **What’s the work?** Code changes point to a coding harness. Anything else points to a general-purpose one.
2. **Where must it run?** Your laptop, a CI job, a sandbox, your own servers. This rules out options fast.
3. **What must it never do?** Check how each harness handles permissions, approvals and blocking actions.
4. **How will you know it worked?** If the harness has no place for tests and checks to feed back, you’ll be the sensor.

## Harness engineering
“Harness engineering” is the practice of improving an agent by changing its harness rather than its model. In practice that means writing clearer instruction files, trimming and describing tools well, adding hooks that block risky actions, and building fast checks the agent can run on its own work.
Böckeler’s framing is a useful checklist. A well-built harness should do two things: raise the odds the agent gets it right the first time, and give it a feedback loop that catches as many problems as possible “before they even reach human eyes.” Guides handle the first. Sensors handle the second.
The step after harness engineering is [loop engineering](/docs/what-is-loop-engineering/): designing the system that decides when an agent runs, what it reads and writes, where a person reviews it, and what condition closes the work.

## What a harness doesn’t keep
A harness is built to run a session well. When the session ends, most of what made it meaningful to a team isn’t held anywhere the team can see:
- **Why the work was started.** The request, the customer signal or the bet behind the task.
- **Who owns it.** The person or agent who answers for the result after the session closes.
- **What was decided along the way.** Including what was tried and rejected.
- **Whether it worked.** Not “the agent stopped,” but whether the change did what it was for.
Harnesses also change. A team might use Claude Code this quarter, add Codex for some jobs next quarter and build on an SDK the quarter after. Each keeps its own sessions, settings and notes in its own format. If the record of the work lives inside one harness, switching harnesses means losing it.
That’s why it helps to keep the record of the work in a shared place your harnesses write to, rather than inside any single one of them.

## Where the harness’s work lands in Maskin
Maskin is an open-source workspace built for this. It’s the shared record where the harness’s work lands: bets, tasks, owners and outcomes, which last longer than any one harness.
Work in Maskin is held as typed objects. A signal comes in as an insight, becomes a bet with a stated success condition, and breaks into tasks. Every object has a driver, the person or agent who owns it, and a comment thread where agents report back and people decide. When a bet ends, its outcome is recorded against the condition it started with. Agents reach all of this over MCP, so any MCP-capable harness can read the context before it starts and write back what it did. Maskin’s own agent sessions run the Claude Code and Codex command-line tools in isolated microVMs.
The harness does the work. The record says why it was done, who owns it, and whether it worked. If you swap the harness next quarter, the record stays.

## FAQ

### What is an agent harness in simple words?
An agent harness is the software wrapped around an AI model that lets it act, not just answer. It gives the model instructions, tools, a place to work, a way to track progress and a loop that keeps it going until the task is done. The model is the brain. The harness is everything else that makes it an agent.

### What does an agent harness do?
It runs the agent loop: sends the model a prompt and context, executes the tools the model asks for, feeds results back, and repeats. Along the way it manages what fits in the context window, enforces permissions, saves progress, and runs checks such as tests so the agent can correct its own mistakes.

### What is the difference between an agent and a harness?
An agent is the whole system that acts on a task. A harness is the agent minus the model. In the shorthand LangChain uses, Agent = Model + Harness. Swap the model and keep the harness, and you have a different agent with the same tools and rules.

### Is Claude Code an agent harness?
Yes. Claude Code wraps Claude models with a system prompt, file and shell tools, project instruction files, permissions, hooks and an agent loop tuned for software work. Anthropic also offers the Claude Agent SDK, which it describes as a general-purpose agent harness, for building agents outside a terminal.

### What is the difference between an agent harness and an agent framework?
A framework gives you building blocks: model wrappers, tool definitions and abstractions you assemble yourself. A harness is higher level and opinionated: it comes with default prompts, planning tools, filesystem access and tool handling already wired in. LangChain is a framework. Deep Agents, built on it, is a harness.

### What is harness engineering?
Harness engineering is improving an agent by changing everything around the model: instructions, tools, context handling, permissions, hooks and automated checks. The aim is for the agent to get things right more often and to catch its own mistakes before a person has to, without changing the model itself.

### Is MCP part of an agent harness?
MCP is how a harness connects to outside tools and data. The harness is the MCP host, with a client inside it: it discovers tools on MCP servers and calls them when the model asks. MCP itself is the wire, not the harness, so any MCP-capable harness can use the same servers.

## Where to go next
- [What is loop engineering in AI](/docs/what-is-loop-engineering/): designing the system around agents, not just the agent.
- [Agent orchestration, agentic loops and control planes](/docs/learn/agent-orchestration/): what coordinates several agents, and which a small team needs.
- [AI product workspace vs AI coding agent](/docs/ai-product-workspace-vs-coding-agent/): why the coding agent and the record of the work are different jobs.
**Want your harnesses’ work to land somewhere the whole team can see?** [Self-host Maskin](/docs/self-hosted-ai-workspace/) and keep bets, owners and outcomes in one shared record.
