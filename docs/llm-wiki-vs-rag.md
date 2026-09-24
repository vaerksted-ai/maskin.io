> Source: https://maskin.io/docs/llm-wiki-vs-rag/

# LLM wiki vs RAG: which one your team actually needs
**An LLM wiki and RAG are not competitors.** RAG embeds your sources and retrieves fragments at query time, assembling an answer fresh on every request. An LLM wiki compiles those sources into interlinked pages ahead of time, so an agent reads a stable artifact a human can audit. The wiki can feed a retrieval pipeline, and most teams end up running both — for different jobs.
> ✓
> **Key takeaways**
> **RAG is a retrieval mechanism; an LLM wiki is a compiled artifact.** They sit at different layers, which is why comparing them head-to-head produces more heat than light.
> **They compose.** The wiki is a clean source a retrieval pipeline can read; RAG serves the volatile material a wiki deliberately leaves out.
> **A preregistered 2026 study found no architecture won on all three axes** — evidence organization, citation support, and cost. RAG held the cost line, the wiki connected findings better, and the judge was the tie-breaker.
> **The deciding factor for a team is upkeep, not build.** Whoever owns the wiki after its first author changes roles decides whether it survives.
> **One wiki advantage survived the study:** every page cites the object its claim came from, so a reader walks back to the source instead of trusting a summary.

## The short answer: “versus” is the wrong frame
The top of this SERP is a genuine two-way question, not a settled one. A thread on r/ObsidianMD asks the anxiety out loud — *why is the LLM wiki framed as the opposite of RAG?* — and a widely-read LinkedIn essay from Kefu Zhang lands the more useful claim: an LLM wiki isn’t a better RAG, it’s **a different kind of object entirely**.
Google’s autocomplete agrees. The same query space carries `llm wiki and rag`, `llm wiki rag hybrid`, and `is llm part of rag`. People aren’t asking *which one wins*. They’re asking *do I need both, and which does what*. A purely oppositional answer reads as ideological. The honest one is structural.

## What RAG actually does
Retrieval-augmented generation is a **query-time** pattern. You embed your sources into vectors, store them, and at question time retrieve the closest fragments, hand them to the model, and let it assemble an answer from what it caught.
That shape is genuinely good at one thing: open-ended recall over a large, shifting corpus. It is also stateless by design. The same question can produce a different answer next week, because the retrieved set changed underneath it. Standing it up is cheap; its cost scales with how often you ask, not how much you know.

## What an LLM wiki actually does
An LLM wiki is a **compile-time** pattern. Andrej Karpathy named it in a public gist in April 2026 as the alternative to two things teams were already doing: stuffing per-agent memory files, and bolting a retrieval layer onto raw documents.
An LLM reads your sources once, extracts the durable claims, and writes them into interlinked pages with links back to the object each claim came from. Agents then read those pages before they answer. The difference that matters is who the artifact is for: a Notion or Confluence space is written for humans and searched by humans, while a wiki is written to be read by an agent and cites where each claim came from. Because the artifact is compiled ahead of time, the same question tends to return the same answer — and a reader can check the page it came from.
That compiled shape is what [the LLM knowledge wiki loop](/marketplace/knowledge-wiki/) runs on: closed bets and shipped decisions written as typed pages agents pick up on the same graph they already work on.

## Mechanism vs artifact, and why the “vs” collapses
RAG is a **mechanism**. An LLM wiki is an **artifact**. The cleanest way to hold the distinction is compiled versus interpreted: RAG interprets at request time, a wiki compiles ahead of it. A mechanism can read an artifact. An artifact does not replace the mechanism that reads it.
That is the whole reason the framing collapses. The wiki is not a faster RAG or a RAG-killer; it is a different layer. You can point a retrieval pipeline at wiki pages and get the best of both — a curated, citeable source with a mechanism on top of it.

## What the research actually found
In May 2026, Theodore O. Cochran published a preregistered study — *Single-Round Vector RAG vs an LLM-Compiled Wiki: A Preregistered Comparison on a Small Multi-Domain Research Corpus* ([arXiv:2605.18490](https://arxiv.org/abs/2605.18490)). It answered the same 13 questions over 24 papers, under both systems, scored by two blinded LLM judges. Three predictions were registered in advance, and the results are more useful than a scoreboard:
- **The wiki was predicted to synthesize better across papers. Weakly supported.** It “scored much better at connecting findings,” but its organization advantage fell below the registered threshold once both judges’ scores were combined.
- **RAG was predicted to hold its own on single-fact lookup. Supported** — it met the registered test, though the second judge alone would have refuted it.
- **The wiki was predicted to be expensive to build and cheap to query. Refuted.** The build side held by about two orders of magnitude, but the query side reversed: the wiki spent roughly **21× more tokens per query**, so no break-even point exists.
Two follow-ons matter as much as the headline. A decomposition-retrieval RAG variant removed nearly all of the wiki’s synthesis advantage at lower token cost, while preserving the wiki’s claim-by-claim citation advantage. And the judges disagreed sharply on holistic “groundedness” (rank agreement ρ = 0.04) but closely on the most concrete criterion (ρ = 0.81) — so the result depends partly on how you score it.
The sentence to carry is the paper’s conclusion: **“Grounded research synthesis is therefore not a single capability.”** No architecture was best on all three axes. Which one looks like the winner depends on your retrieval baseline, your scoring granularity, and your judge.
For a team, that is liberating rather than deflating. You are not choosing between a right answer and a wrong one. You are choosing which axis to optimize — and paying for it honestly.

## The cost intuition most comparisons get backwards
The popular decision pages on this SERP hand you a framework and a hedged cost estimate, then send you off. The part they leave thin is the one the study actually contradicts. The widespread intuition — “compile once, query cheap forever” — did not hold on this corpus. Building the wiki cost roughly two orders of magnitude more, *and* it spent about 21× more tokens per query. If your reason for choosing a wiki is that it will be cheaper to run, test that assumption on your own corpus before you commit engineering time.
The wiki’s defensible reason to exist is not cost. It is the third axis: citation support. Each page points at the object its claim came from. When a claim turns out wrong, you can find the page, follow the link, and fix the source.

## How to decide for your team
| Dimension | RAG | LLM wiki |
| --- | --- | --- |
| When the work happens | At query time — retrieve and assemble per request | Ahead of time — compile once into pages |
| Best at | Open-ended recall over a large, volatile corpus | Stable, citeable answers your team already agrees on |
| Answer stability | Varies as the retrieved set changes | Same question, same page |
| Auditability | Fragments, hard to trace to a source | Every claim links to the object it came from |
| Cost shape | Cheap to stand up; pays per query | Expensive to build; per-query cost can exceed RAG |
| Failure mode | Retrieval noise, stale or missing fragments | Staleness, orphaned pages, a bad compile nobody reviews |
Run those against six questions, in the order that changes the answer:
1. **Who reads it** — humans, agents, or both? If agents read it before they answer, the artifact has to be stable and linkable, which favours a wiki.
2. **Do you need the same answer twice?** Auditable answers favour the wiki; open-ended exploration favours RAG.
3. **How big and how volatile is the corpus?** Big and shifting leans RAG; small and settled leans wiki.
4. **Does a claim have to trace to a source?** If yes, the wiki’s citation structure is the feature you are buying.
5. **What is your cost model, honestly?** Do not assume the wiki is cheaper to run — the study says check.
6. **Who owns it next quarter?** If the answer is “nobody,” you are about to build a wiki that rots.

## Where each one wins, and where you run both
**The wiki wins** when the knowledge is settled, the answers need to be stable and citeable, and the same questions get asked repeatedly — the things your team has already learned and wants to keep answering the same way.
**RAG wins** when the corpus is large and moving, the questions are open-ended, and “close enough, retrieved fresh” beats “stable but expensive to keep current.”
**You run both** when the wiki is the curated core and RAG serves the volatile edge — new tickets, fresh transcripts, anything that changes faster than a compile cycle. That hybrid is what the autocomplete traffic is already searching for.

## Running a wiki as a loop, not a side project
Here the comparison stops being about architecture and starts being about ownership. The compile is the easy part. The failure mode is upkeep: a wiki that only gets written when someone remembers decays into a folder of half-true pages inside a quarter. Writing to it is a separate job from doing the work, and separate jobs lose.
The teams that keep one alive do not add a writing chore. They make writing a byproduct of work that already closes, and reading a byproduct of work that already starts. That is the shape of a Maskin loop: a closed work item fires it, agents write the verdict and link the artifact, a human gates the taste-sensitive summaries, and it closes when a new hire or a new agent can read the page and stop needing to ask.
One vocabulary note, because it matters when you go looking for tooling. “Loop” is now a two-vendor category noun — Linear shipped one in early September 2026, Atlassian followed ten days later — and in both cases the noun means recurring execution that lives inside that vendor’s own product. That naming collision is exactly why the primitives below are worded as carefully as they are.

### Loop
A closed cycle: something fires it (a signal, a schedule, a click), agents do the work, a human gates the taste-sensitive parts, and it ends on a concrete outcome — not on *done for now*. Every listing on the Marketplace is a loop.
**Maskin loops carry typed outcomes and verdicts that persist across tools, not recurring workflow execution inside one product.**

### Agent
A named role a model performs — an SEO analyst, a discovery synthesizer, an outbound writer. Not an *AI teammate*: a role with a job description, tools it can use, and gates it has to pass before its work leaves the workspace.

### MCP
The wire an agent uses to reach the tools your team already uses — the CRM, the docs, the inbox, the analytics. If a human on your team can log in and click, an MCP-native agent can be given the same access under the same gates.

### Skill
A packaged capability you attach to an agent — *draft a follow-up in our voice*, *summarize a customer call against our discovery template*. Skills are the reusable pieces of judgment your team is already building without realising it.
Inside a loop listing, agents / MCPs / skills appear as “built with” components of the loop, never as top-level marketplace sections of their own.

## FAQ

### Is an LLM wiki a RAG?
No. A RAG system embeds raw sources and retrieves fragments at query time, so the answer is assembled fresh on every request. An LLM wiki compiles those sources into interlinked pages ahead of time and stores them as a durable artifact. The wiki can feed a retrieval pipeline, but the wiki itself is the compiled knowledge, not the mechanism that reads from it.

### Is an LLM wiki better than RAG?
Neither is better in general. They solve different problems, and the honest answer is that most teams end up with both. The one head-to-head preregistered study found no architecture best on evidence organization, citation support, and cost at the same time. Pick the axis that matters to your team and accept the trade-off.

### Can an LLM wiki replace RAG?
Not as a mechanism. A wiki can replace the *corpus* RAG retrieves from — a compiled, citeable set of pages beats raw chunks as a source — but you still need something to retrieve from it. What the wiki replaces is the pile of unprocessed documents, not the retrieval layer on top.

### Do you need both an LLM wiki and RAG?
Most teams converge on both: the wiki as the curated core of settled knowledge, RAG for the volatile material that changes faster than a compile cycle. The wiki handles the questions your team answers the same way every time; RAG handles the long tail you cannot pre-write.

### LLM wiki vs a vector database — what is the difference?
A vector database is storage for embeddings; it is one component inside RAG, not a rival to the wiki. An LLM wiki produces human-auditable, interlinked pages. A vector database produces nearest-neighbour matches. You can put wiki pages *into* a vector database and retrieve from them.

### What is Karpathy’s LLM wiki, and how does it relate to RAG?
Andrej Karpathy published the pattern as a public gist in April 2026, framing a compiled wiki as an alternative to per-agent memory files and query-time retrieval. The framing that stuck — including in this comparison — is that the wiki is a different kind of artifact, not a faster RAG.

### Graph RAG vs LLM wiki?
Graph RAG builds a knowledge graph at retrieval time to improve multi-hop recall; an LLM wiki builds an interlinked page set ahead of time. They overlap in spirit — both trade raw chunks for structure — but graph RAG is still a query-time mechanism, while the wiki is a reviewable artifact a human can edit.
Read next

## Run your wiki as a loop, not a side project
Maskin is the MCP-native workspace where closed bets compile into typed pages agents read before they answer — so the wiki is a byproduct of work that already closes. Open source under Apache 2.0. Self-host free, bring your own model.
