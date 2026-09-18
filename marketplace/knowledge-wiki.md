> Source: https://maskin.io/marketplace/knowledge-wiki/

# A wiki your agents read before they answer.
Team memory that new hires and new agents bootstrap from — indexed, typed, MCP-native.
The knowledge wiki loop keeps a living, agent-readable record of every decision your team ships. A closed bet fires the loop; agents write the verdict, index the artifacts, and link them to the object they came from; a human gates the taste-sensitive summaries. Every future agent your team spawns reads from the same graph before it answers — so the wiki isn’t a Notion side-project that rots the moment its author changes roles, it’s the same substrate the rest of your team already operates on.
For product teams tired of re-answering the same question because the last answer lived in someone’s DMs.
A full walkthrough of the LLM knowledge wiki loop — how a closed bet becomes a citable page your agents read before they answer. Sign up below to get it in your inbox the moment it’s live.
Or email [ai@maskin.io](mailto:ai@maskin.io?subject=Waitlist:%20LLM%20knowledge%20wiki%20loop) with subject “Waitlist: LLM knowledge wiki loop” and we’ll send it the moment it drops.

## Key takeaways
- An LLM wiki is a knowledge base an LLM compiles from your own sources into interlinked pages that agents read before they answer. Andrej Karpathy named the pattern in April 2026 as the alternative to per-agent memory files and query-time RAG.
- This loop keeps that base alive: a closed bet fires it, agents write the verdict and index the artifact, and a human gates the taste-sensitive summaries.
- Team memory is the unit here, not personal memory. Most of the head volume on the search term is Karpathy-navigational; the unclaimed slice is how a team actually runs one.
- Every entry is typed and linked to the bet, insight, or decision it came from, so a reader walks back to the source instead of trusting a summary.
- New hires and new agents bootstrap from the same graph, so onboarding stops being a separate doc that drifts from the work.

## What an LLM wiki is, and what it is not
An LLM wiki is a knowledge base an LLM compiles from your own material into interlinked pages that other agents read before they answer. Andrej Karpathy published the pattern in April 2026 as a public gist, framing it as the alternative to two things teams were already doing: stuffing per-agent memory files, and bolting a retrieval layer onto raw documents. The wiki is compiled ahead of time, so the agent reads a stable artifact a human can audit, rather than a fresh pile of retrieved fragments.
It is worth separating the wiki from its neighbours. A RAG index embeds your sources and retrieves pieces at query time; an LLM wiki compiles the sources into pages once and links them, so the same question tends to return the same answer. A Notion or Confluence space is written for humans and searched by humans; an LLM wiki is written to be read by an agent, and it cites the object each claim came from. Both are a durable, interlinked record, but the reader is different, and that changes how the record has to be maintained.
The failure mode is not the compile step. It is the upkeep. A wiki that only gets written when someone remembers to write it decays into a folder of half-true pages inside a quarter.

## How the loop closes
- **Fires when** a bet closes, a decision ships, or a piece of work ends with a verdict worth keeping.
- **Writes the verdict** — an agent captures what was decided, why, and what it displaced, in the voice and format the team already reads.
- **Indexes and links** — the entry is attached to the bet, insight, or object it came from, so the graph stays walkable in both directions.
- **Human gates** the taste-sensitive summaries: positioning, customer-facing language, anything that states a fact about the company rather than about the work.
- **Closes on** a page a new hire or a new agent can read to answer a question without asking a person.
That last line is the close condition. The loop is not done when the page is written. It is done when someone, or something, reads it and stops needing to ask.

## Why team wikis rot, and why this one does not
Every team has tried the shared wiki. The pattern is always the same: a burst of writing at the start, a slow drift, and a final state where the newest pages are the least accurate and nobody trusts any of it. The cause is not laziness. It is that writing to the wiki is a separate job from doing the work, and separate jobs lose.
This loop removes the separate job. Writing to the wiki is a byproduct of closing a bet, which the team is already doing. Reading from the wiki is a byproduct of starting work, because the agent reads it before it answers. Nobody has to remember the wiki exists, because it sits on the path of work the team already runs.
The typed graph is what makes that possible. A page is not a floating document; it is attached to the object it describes. When the object changes, the link tells you which page to revisit. When a new agent joins, it does not read a stale onboarding doc. It reads the same graph the rest of the team operates on.

## Built with
- **Signal sources** — closed bets, shipped decisions, customer calls, and the object graph the team already works on.
- **Agents** — verdict writer, artifact indexer, link resolver, staleness checker.
- **MCPs** — the docs tool, the chat tool, the repo, and the analytics your team already logs into.
- **Skills** — *write the verdict in our voice*, *summarize a decision against our template*.
- **Human gates** — the person who owns the summary when it states something customer-facing or company-level.

## What’s inside the loop
Loop
A closed cycle: something fires it (a signal, a schedule, a click), agents do the work, a human gates the taste-sensitive parts, and it ends on a concrete outcome — not on *done for now*. Every listing on the Marketplace is a loop.
**Maskin loops carry typed outcomes and verdicts that persist across tools, not recurring workflow execution inside one product.**
Agent
A named role a model performs — an SEO analyst, a discovery synthesizer, an outbound writer. Not an *AI teammate*: a role with a job description, tools it can use, and gates it has to pass before its work leaves the workspace.
MCP
The wire an agent uses to reach the tools your team already uses — the CRM, the docs, the inbox, the analytics. If a human on your team can log in and click, an MCP-native agent can be given the same access under the same gates.
Skill
A packaged capability you attach to an agent — *draft a follow-up in our voice*, *summarize a customer call against our discovery template*. Skills are the reusable pieces of judgment your team is already building without realising it.
Inside a loop listing, agents / MCPs / skills appear as “built with” components of the loop, never as top-level marketplace sections of their own.

## FAQ

### What is an LLM wiki?
An LLM wiki is a knowledge base an LLM compiles from your own sources into interlinked pages that agents read before they answer. Andrej Karpathy named the pattern in April 2026 as an alternative to per-agent memory and query-time RAG. The point is a compiled, human-auditable artifact: the agent reads a stable page instead of retrieving a fresh set of fragments for every question.

### Is an LLM wiki a RAG?
No. A RAG system embeds raw sources and retrieves fragments at query time, so the answer is assembled fresh on every request. An LLM wiki compiles those sources into interlinked pages ahead of time and stores them as a durable artifact. The wiki can feed a retrieval pipeline, but the wiki itself is the compiled knowledge, not the retrieval mechanism that reads from it.

### Is an LLM wiki better than RAG?
They solve different problems, so the honest answer is that most teams end up with both. RAG retrieves fragments from raw sources at query time and is good at open-ended recall over a large corpus. An LLM wiki compiles sources into interlinked pages ahead of time and is good at stable, citeable answers a human can check. Use the wiki for what your team has already learned and wants to keep answering the same way.

### How does an LLM wiki work?
An LLM reads your sources, extracts the durable claims, and writes them into interlinked pages with links back to the object each claim came from. Agents then read those pages before they answer, instead of searching raw documents. The compile runs on a schedule or when a source changes, so the wiki stays a maintained artifact rather than a one-time export.

### How do you run an LLM wiki for a team?
Running one for a team is an upkeep problem more than a build problem. The build is straightforward: point an LLM at your sources, compile interlinked pages, let agents read them. The hard part is keeping pages current once the person who wrote them changes roles. The fix is to make writing a byproduct of work that already closes, and reading a byproduct of work that already starts.

### How do you scale an LLM wiki?
Scaling is a linking and ownership problem, not a storage problem. Past a few hundred pages the failure is orphaned and stale entries, not volume. Give every page a type, an owner, and a link to the object it describes, and re-check the ones whose source object changed. That is what keeps a large wiki trustworthy where a flat folder of markdown stops being.

### Is an LLM wiki open source?
Karpathy published the pattern as a public gist, so the approach itself is open, and implementations range from a personal Obsidian vault to a cross-platform desktop app to a shared substrate inside a workspace. What differs is who reads it. A personal vault serves one person; a team wiki has to serve every agent the team spawns, which changes how it is indexed and linked.

### How does an LLM wiki connect to MCP?
MCP is the wire. The wiki lives in one place and agents reach it through an MCP server, the same way they reach the CRM or the repo. That matters because it keeps the wiki out of any single tool. A coding agent, a research agent, and a support agent can all read the same pages under the same gates, without anyone copying the content between products.
Related loops on the marketplace
