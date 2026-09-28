> Source: https://maskin.io/docs/learn/choose-a-knowledge-layer/

# How to choose a knowledge layer for your agents — a decision guide

Four places agent knowledge can live in 2026: **retrieval-beside** (Mem0-shaped vectors), **stateful-runtime** (Letta-shaped state blocks), **temporal-knowledge-graph** (Zep-shaped nodes and edges), and a **typed workspace graph** (Maskin). None of them is universally best, and the head-of-SERP question — *which framework remembers best?* — is the wrong one to answer. The right one is two questions: **what has to survive between runs, and who has to read it without tooling?** This page turns those into a decision.

**Key takeaways**

- **The choice is architectural, not vendor-tier.** Star counts don't predict fit; where memory has to live does.
- **Four architectures cover the honest field.** Retrieval-beside, stateful-runtime, temporal-knowledge-graph, and typed workspace graph — each with a shipping exemplar (Mem0, Letta, Zep, Maskin).
- **The two decisive questions are structural.** What survives between runs (decisions, corrections, artifacts) — and who reads it without tooling (agents only, or humans too).
- **Retrieval quality is close to solved on the standard benchmark;** synthesis and provenance are the frontier. Chasing a better vector store is optimising a mostly-solved layer.
- **None of these formats is human-readable by default** — except the typed workspace graph, whose contents are typed objects a person can open and audit.
- **Two knowledge layers often compose better than one replaces another.** The decision guide names when to pair and when to pick.

## Why "which framework remembers best" is the wrong frame

The three top-ranking 2026 comparisons of agent memory frameworks all open with the same reframe. DreamingPress (June 2026) puts it plainly: *the question isn't which framework remembers best. It's whether you want a retrieval add-on, a temporal graph, or an agent that runs inside someone else's server.* PLUR (July 2026): *none is universally best. Choose by use case, not by star count.* AgentsCamp (June 2026) names the same three architectures as competing bets on where memory should live.

There is a fourth answer no top-ranking comparison names, and it becomes obvious once you split *what carries state* from *what runs the agent*: a typed store of workspace objects a person can open and read, with agents writing and reading against it. Every 2026 comparison leaves that slot unclaimed — and every one of them frames the "vs" between three frameworks whose formats a human cannot read without tooling.

The rest of this page is the decision. It names the four architectures with their exemplars, walks the two questions that actually change the answer, gives a decision matrix, and closes on the composition patterns that beat picking one architecture and hoping.

## The four architectures, named with exemplars

### 1. Retrieval-beside (Mem0-shaped vectors)

The retrieval-beside architecture bolts a vector store next to the agent. On each run, the agent embeds the current query, retrieves the most similar previous messages or extracted facts, and stuffs them into the context window. Mem0 is the vendor exemplar: an add-on that watches the conversation, extracts durable claims, embeds them, and re-injects them at the top of the next turn.

**What it stores.** Embeddings of extracted text, plus metadata pointing back to the source turn. The vectors themselves are unreadable; the metadata makes them addressable.

**What it is good at.** Open-ended recall over long, unstructured conversation histories. Personalisation. Any case where the state to carry forward is *content* (what was said, what was preferred) rather than *structure* (what was decided, and why).

**Where it breaks.** Two places, both hard. Format lock-in — six incompatible long-term-memory formats shipped in 2026 alone (Mem0, Letta, Zep, khive, Graphiti, growmos), and migrating between any two means re-extracting from source. Silent context injection — Simon Willison's ChatGPT complaint at the 2026 AI Engineer Summit was that a memory feature quietly slipped *Half Moon Bay* into an image prompt, which is the failure mode any retrieval-beside layer inherits: a store you cannot see is a store you cannot correct. Retrieval quality has also plateaued rather than scaled: on LongMemEval, first-stage retrieval is close to saturated at roughly **97% recall@5**, but of 65 wrong answers, **54 already had the correct evidence sitting in the top-5** (AutoMem's 2026 full-slice comparison). The evidence was found; it was not used.

**Pick it when** the JTBD is "the assistant should remember what I told it last week," the reader of that memory is the agent only, and the failure mode of a silent injection is acceptable to your users.

### 2. Stateful-runtime (Letta-shaped state blocks)

The stateful-runtime architecture removes the retrieval step entirely. Instead of storing embeddings and re-fetching them per turn, the agent runs on a server that keeps its state blocks — a working memory, a scratchpad, an evolving persona — in place between calls. Letta (formerly MemGPT) is the vendor exemplar: an agent runtime that owns memory as first-class state, promotes and demotes blocks between hot and cold storage, and hands the agent a durable "self" across sessions.

**What it stores.** Structured state blocks — named regions of persistent context — plus a memory hierarchy that decides what lives in the working set and what gets paged out. The blocks are typed and editable at the API level.

**What it is good at.** Long-running single-agent processes where the *agent* is the entity that has to accumulate context, not the *system around it*. Personas. Ongoing companion or assistant loops that need to feel continuous rather than fresh-per-turn.

**Where it breaks.** Two places. The agent lives inside the vendor's server, which is the exact framing DreamingPress used — *an agent that runs inside someone else's server* — and that couples memory to compute. And the state blocks are the agent's memory, not the team's: two agents doing related work do not automatically read each other's blocks. The board that RedHat's *Taming the Agent Beast* piece (August 2026) named — *stateless agents, stateful orchestration* — is not what stateful-runtime buys. It buys the opposite: stateful agents, unshared board.

**Pick it when** the JTBD is "one long-running agent needs to accumulate a persona and a working memory," you are comfortable with the runtime coupling, and the memory does not need to be read by other agents or by humans.

### 3. Temporal-knowledge-graph (Zep-shaped nodes and edges)

The temporal-knowledge-graph architecture extracts entities, relationships, and events from the conversation into a graph, and tracks how facts change over time. Zep is the vendor exemplar: entities become nodes, relationships become edges, and each edge carries a validity window so *the customer was on the Pro plan* and *the customer is on the Enterprise plan* can both be true — just not at the same time.

**What it stores.** Typed nodes (people, projects, decisions), typed edges (worked on, decided against, escalated to), and a temporal window per fact. Provenance is usually attached.

**What it is good at.** Multi-hop questions the vector store cannot answer — *who decided X, and what depended on it?* — over conversation histories where relationships matter more than paragraphs. Cases where the answer to *is this still true?* is load-bearing.

**Where it breaks.** Ontology drift and upkeep cost. A knowledge graph that gets typed once and then leaks decays into a graph nobody trusts. Graphs are also opinionated: the shipping-code consensus this year — khive, Graphiti, and growmos, three separate projects — converged within months on typed ontologies, typed edges, and provenance on every item, and their shared claim is that *typed structure is not a similarity result*. That is the strength of the architecture. Keeping the types current is the cost of the strength.

**Pick it when** the JTBD is "we need to answer traversal questions, not just retrieval questions," you can invest in the ontology, and the reader of the graph is the agent (or, with a query language, an analyst).

### 4. Typed workspace graph (Maskin)

The typed workspace graph is the fourth answer, and it is a different kind of object from the other three. The other three are memory *for the agent*; the typed workspace graph is the shared substrate the *team* is already working on — insights, bets, tasks, comments — that agents read from and write to as first-class participants. In Maskin, the workspace graph is the same object model humans see in the UI: a decision is a bet with a status, a correction is a comment attached to the thing it corrects, and an artifact is the object the run produced. Every item is human-readable by default.

That last property is the wedge. The typed workspace graph is the only one of the four architectures whose long-term state a person can open, read, and edit without special tooling. Vectors need a search; state blocks need an API; graph nodes need a query. A workspace object needs a click.

**What it stores.** Typed objects a person can open and read (insights, bets, tasks, comments, artifacts). Typed edges between them (`informs`, `blocks`, `in_loop`). Provenance on every item — who wrote it, when, from which upstream signal — and a live status.

**What it is good at.** Multi-agent work where run one and run two are done by different agents but share a board. The three-item persistence checklist — *decisions, corrections, artifacts* — because a workspace object is exactly the shape of each one. Any case where the human needs to be able to correct the memory, not just consume it.

**Where it breaks.** The upfront cost of a schema. If your only need is *the assistant should remember what I told it*, a retrieval-beside vector store is faster to stand up and enough. The typed workspace graph pays off when the state is *decisions and corrections a team has to carry across time*, not raw content.

**Pick it when** the JTBD is "our scheduled agents have to pick up where the last run left off, and a human has to be able to correct what they remember," the readers of the memory include humans as well as agents, and the state to carry forward is structured (decisions with reasons, corrections with attribution) rather than a wall of extracted prose.

## The two questions that actually change the answer

Before the matrix, walk two questions in order. They collapse the field faster than any feature list.

### Question 1: What has to survive between runs?

There are only three categories of state worth persisting, and they map cleanly to the checklist worked out in [agent memory across sessions](/docs/learn/agent-memory-across-sessions/):

- **Decisions** — what was chosen, and why. Not the receipt (*sent the follow-up email*) but the reason (*sent it to the tier-2 segment because the tier-1 list was rejected on Tuesday*).
- **Corrections** — the gap between what the agent produced and what a human accepted. The most valuable signal in the system, and the one most setups discard.
- **Artifacts** — the outputs themselves, still addressable, so run two can read run one's work instead of regenerating it.

Miss any one of these and the failure is silent. The run completes, the output looks fine, and the loss surfaces weeks later — an agent confidently repeating a settled call, or a correction you made three times still not sticking.

Now map that back to the four architectures:

- **Retrieval-beside** captures the content of what was said, not the decision behind it. It can hold artifacts as embedded text, but the addressability is the metadata, not the vector. Corrections have to be re-extracted or re-said.
- **Stateful-runtime** holds working memory well but does not naturally represent the "why" behind a decision or a human's after-the-fact correction; the block is the agent's, not a shared record.
- **Temporal-knowledge-graph** represents decisions and their timing beautifully, and corrections can be modelled as new edges with new validity windows. Artifacts sit outside the graph unless you wire them in.
- **Typed workspace graph** stores all three natively — a decision is a bet, a correction is a comment on the thing it corrects, an artifact is an object with a link — and every item is typed, provenanced, and time-stamped.

### Question 2: Who reads it without tooling?

Long-term memory that only the agent can read is a lock-in decision, whether you frame it that way or not. Three of the four architectures store their long-term state in a format a human cannot open: Mem0 stores vectors, Letta stores runtime state blocks, Zep stores graph nodes and edges. Each vendor offers a UI on top of the store — but the UI is a viewer, not the storage. If you swap vendors, the format goes with them.

The typed workspace graph is the one architecture whose storage format *is* the read surface. The bet is a page. The comment is a comment. The artifact is a file with a link. A new hire, a support engineer, or an agent from a different vendor can open the item and read it — because there is no format to decode, just the object.

This is not an argument against the other three. It is the thing that makes the fourth answer a different kind of thing. If your memory has to be auditable by a human at any point — for correction, for compliance, or for a taste-sensitive review — the format has to be human-readable by default, not through a tool.

## The decision matrix

Rows are the four architectures; columns are the four questions that decide it.

| Architecture | What survives between runs | Who reads it without tooling | Where the human gate lives | Where Maskin sits |
| --- | --- | --- | --- | --- |
| **Retrieval-beside** (Mem0) | Extracted text, embedded — content, not structure | Nobody — vectors are not readable | Nowhere by default; edits happen by re-saying | Not this — retrieval-beside is a component you can point at Maskin objects, not a substitute for them |
| **Stateful-runtime** (Letta) | Agent state blocks — working memory for one agent | The agent, via API — humans need a viewer | On the block edit, if the runtime exposes one | Not this — Maskin is not an agent runtime; it is the substrate agents (from any runtime) read and write |
| **Temporal-knowledge-graph** (Zep) | Typed nodes, typed edges, with temporal windows | The agent, via query — humans need a graph viewer | On graph writes, if you build one | Adjacent — Maskin's typed graph carries some of the same primitives, but with a workspace UI rather than a query language |
| **Typed workspace graph** (Maskin) | Decisions (bets), corrections (comments), artifacts (typed objects) — all three checklist items | Anyone with access — the object is the read surface | Wherever the loop is shaped to gate; corrections are first-class comments | This — the shared substrate itself, human-readable, MCP-native |

The matrix is honest about scope. Maskin is not trying to be a retrieval-beside vector store or an agent runtime. Those are components you can compose against a typed workspace graph — and the composition is often the right answer, not the pick.

## When two layers compose better than one replaces another

The comparison spokes under this decision cover the three composition patterns worth knowing. All three end the same way: a typed store carries what has to persist, and the other layer handles what it is good at.

- **A wiki inside a vector database.** A [knowledge wiki is a compiled artifact, not a storage engine](/docs/knowledge-wiki-vs-vector-database/) — you can put wiki pages *into* a vector database and get the best of both. The wiki is the curated source; the database is the index over it.
- **RAG on top of the graph.** [MCP is the wire and RAG is a retrieval mechanism](/docs/mcp-vs-rag/) — neither carries state. Point a retrieval pipeline at the typed graph's settled knowledge and you have a system where the retrieval is good *and* the state is auditable. The retrieval mechanism is not the memory; the graph is.
- **A wiki instead of raw documents.** [An LLM wiki versus RAG](/docs/llm-wiki-vs-rag/) is not really a "vs" — the wiki replaces the *corpus* RAG retrieves from, not the retrieval layer. Most teams end up with both.

The composition question resolves the same way each time. Retrieval is a mechanism. A vector store is an index. A wiki is an artifact. A graph is a substrate. The four are not rivals — they are layers, and the honest question is which layer is missing from your stack.

## The upkeep question that outlives the architecture choice

Every architecture on this page has the same failure mode, and it is the one nobody scores in the demos. Whatever you pick, someone has to keep it current after its first author changes roles.

- The vector store rots when the extraction rules stop matching the way people talk about the work.
- The state blocks rot when nobody edits the runtime memory after a decision changes.
- The temporal graph rots when the ontology drifts and no one owns the schema.
- The workspace graph rots when the loop that writes to it stops closing.

The architecture decision determines *what shape* the rot takes. It does not exempt you from the rot. The teams that keep a memory alive make writing to it a byproduct of work that already closes, and reading it a byproduct of work that already starts — never a separate writing chore. That is why the deciding factor is usually not the architecture at all. It is whether the loop that maintains the memory is closed, or whether *keep the memory current* is a side-project nobody owns.

If the loop is closed, any of the four architectures will hold. If it is not, none of them will.

## FAQ

### How do I choose a knowledge layer for my agents?

Walk two questions before you compare vendors. First, what has to survive between runs — decisions, corrections, and artifacts, or just content? Second, who reads that memory without tooling — agents only, or humans too? The answers collapse a four-way field into two or three candidates. Then decide by composition: often the right answer is a shared substrate that carries state, plus one of the other layers for retrieval or working memory, rather than one architecture for everything.

### What are the main types of agent memory?

Retrieval-beside (Mem0-shaped vectors) — an embedded store the agent queries per turn. Stateful-runtime (Letta-shaped state blocks) — an agent runtime that keeps working memory in place between calls. Temporal-knowledge-graph (Zep-shaped nodes and edges) — a graph of typed entities and time-windowed relationships. Typed workspace graph (Maskin) — the shared substrate of workspace objects the team already operates on, that agents read and write against as first-class participants.

### Is a vector database the same as agent memory?

No. A vector database is one storage format for long-term memory, useful for recall. But it holds text, not structure, and it does not carry the status, the provenance, or the audit trail a decision needs. Treating a vector store as *the* memory is the mistake that keeps agents stateless — you can retrieve a paragraph, but you cannot tell whether a choice is settled. See [knowledge wiki vs vector database](/docs/knowledge-wiki-vs-vector-database/) for the storage-versus-artifact cut.

### What is the difference between Mem0, Letta, and Zep?

They are shaped for different questions. Mem0 is retrieval-beside — a vector store that watches the conversation and re-injects extracted claims. Letta is stateful-runtime — an agent runtime that carries state blocks across sessions. Zep is a temporal knowledge graph — typed nodes, typed edges, and validity windows over time. All three are memory *for the agent*; none is a shared substrate a team's humans and agents both read.

### Where does Maskin sit among the four?

Maskin is the typed workspace graph — the shared substrate itself, not a memory add-on. Insights, bets, tasks, and comments are the same object model the team's humans use; agents read and write against the same graph over MCP. Because the storage format is the read surface, a human can open any item, correct it, or add context without a viewer.

### Can I use two of these together?

Almost always yes, and it is usually the right answer. A typed workspace graph can carry the decisions, corrections, and artifacts while a vector store indexes long-form content for retrieval; a knowledge wiki can sit as a curated source that both an agent and a retrieval pipeline read; a stateful-runtime agent can work against a shared workspace graph as its board. The comparison spokes under this guide cover the specific pair-ups.

### What is the biggest mistake in choosing a knowledge layer?

Optimising the wrong axis. Retrieval quality is close to solved on the standard benchmarks — LongMemEval reports roughly 97% recall@5, and swapping the embedding model alone can shift end-to-end scores by more than 6 points (MemDelta, June 2026). The unsolved layers are provenance, correction, and human readability. Picking the vendor with the biggest recall number does not close those gaps.

### Do I have to write my own agents to use the workspace-graph approach?

No. Agents from any runtime (Claude Code, Claude Agent SDK, Letta, custom) can read and write the workspace graph over MCP. The graph is the substrate; the agents are interchangeable. That is precisely what makes it a shared board and not a per-agent memory.

## The primitives underneath

A short vocabulary note, because the words collide across vendors, and the loop word in particular is now a two-vendor category noun (Linear September 2026, Atlassian ten days later).

### Loop

A closed cycle: something fires it (a signal, a schedule, a click), agents do the work, a human gates the taste-sensitive parts, and it ends on a concrete outcome — not on *done for now*. Every listing on the Marketplace is a loop.

**Maskin loops carry typed outcomes and verdicts that persist across tools, not recurring workflow execution inside one product.**

### Agent

A named role a model performs — an SEO analyst, a discovery synthesizer, an outbound writer. Not an *AI teammate*: a role with a job description, tools it can use, and gates it has to pass before its work leaves the workspace.

### MCP

The wire an agent uses to reach the tools your team already uses — the CRM, the docs, the inbox, the analytics. If a human on your team can log in and click, an MCP-native agent can be given the same access under the same gates.

### Skill

A packaged capability you attach to an agent — *draft a follow-up in our voice*, *summarize a customer call against our discovery template*. Skills are the reusable pieces of judgment your team is already building without realising it.
