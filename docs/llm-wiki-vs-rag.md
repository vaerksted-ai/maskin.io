> Source: https://maskin.io/docs/llm-wiki-vs-rag/

# LLM wiki vs RAG: which one your team actually needs
**An LLM wiki and RAG are not competitors.** RAG embeds your sources and retrieves fragments at query time, assembling an answer fresh on every request. An LLM wiki compiles those sources into interlinked pages ahead of time, so an agent reads a stable artifact a human can audit. The wiki can feed a retrieval pipeline, and most teams end up running both — for different jobs.
This page is for a CTO or head of engineering choosing how agents should read team knowledge from internal documents, tickets, and decisions. It explains the structural difference between retrieval and a compiled wiki, what a preregistered 2026 study found, and a ten-question test you can run on your own corpus before choosing RAG, a wiki, or both.
[Book a meeting](https://meshfirm.com/bookmagnus) Bring your ten questions. We’ll score them together and read what the results point to.
> ✓
> **Key takeaways**
> **RAG is a retrieval mechanism; an LLM wiki is a compiled artifact.** They sit at different layers, which is why comparing them head-to-head produces more heat than light.
> **They compose.** The wiki is a clean source a retrieval pipeline can read; RAG serves the volatile material a wiki deliberately leaves out.
> **A preregistered 2026 study found no architecture won on all three axes** — evidence organization, citation support, and cost. RAG held the cost line, the wiki connected findings better, and the judge was the tie-breaker.
> **The deciding factor for a team is upkeep, not build.** Whoever owns the wiki after its first author changes roles decides whether it survives.
> **Test it on your own corpus.** Ten real questions, scored for source citation and tokens per query, show whether the study’s result holds on your documents.
> **One wiki advantage survived the study:** every page cites the object its claim came from, so a reader walks back to the source instead of trusting a summary.

## The short answer: “versus” is the wrong frame
The top of this SERP is a genuine two-way question, not a settled one. A thread on r/ObsidianMD asks the anxiety out loud — *why is the LLM wiki framed as the opposite of RAG?* — and a widely-read LinkedIn essay from Kefu Zhang lands the more useful claim: an LLM wiki isn’t a better RAG, it’s **a different kind of object entirely**.
Google’s autocomplete agrees. The same query space carries `llm wiki and rag`, `llm wiki rag hybrid`, and `is llm part of rag`. People aren’t asking *which one wins*. They’re asking *do I need both, and which does what*. A purely oppositional answer reads as ideological. The honest one is structural.

## What RAG actually does
Retrieval-augmented generation is a **query-time** pattern. You embed your sources into vectors, store them, and at question time retrieve the closest fragments, hand them to the model, and let it assemble an answer from what it caught.
That shape is genuinely good at one thing: open-ended recall over a large, shifting corpus. It is also stateless by design. The same question can produce a different answer next week, because the retrieved set changed underneath it. Standing it up is cheap; its cost scales with how often you ask, not how much you know — and for the sibling cut between a retrieval mechanism and the protocol an agent uses to reach tools, [why MCP replaces RAG for tool access](/docs/mcp-vs-rag/) covers the wire-versus-retrieval layer.

## What an LLM wiki actually does
An LLM wiki is a **compile-time** pattern. Andrej Karpathy named it in a public gist in April 2026 as the alternative to two things teams were already doing: stuffing per-agent memory files, and bolting a retrieval layer onto raw documents.
An LLM reads your sources once, extracts the durable claims, and writes them into interlinked pages with links back to the object each claim came from. Agents then read those pages before they answer. The difference that matters is who the artifact is for: a Notion or Confluence space is written for humans and searched by humans, while a wiki is written to be read by an agent and cites where each claim came from. Because the artifact is compiled ahead of time, the same question tends to return the same answer — and a reader can check the page it came from.
Maskin’s [LLM knowledge wiki](/marketplace/knowledge-wiki/) turns finished work and shipped decisions into pages agents can read.

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
**You run both** when the wiki is the curated core and RAG serves the volatile edge — new tickets, fresh transcripts, anything that changes faster than a compile cycle. That hybrid is what the autocomplete traffic is already searching for — and if you are mapping the compiled artifact to the storage engine underneath it, [wiki-style knowledge vs an embedding store](/docs/knowledge-wiki-vs-vector-database/) covers where those two layers meet. For the wider decision across all four architectures agent knowledge can live in — retrieval-beside, stateful-runtime, temporal knowledge graph, and typed workspace graph — [how to choose a knowledge layer for your agents](/docs/learn/choose-a-knowledge-layer/) walks the two structural questions that decide it.

## Test it on your own corpus before you commit
The preregistered 2026 study found no architecture won on every measure. RAG held the cost line, while the wiki connected findings better and provided claim-by-claim citations. The result also depended on the retrieval baseline and how answers were scored. The practical lesson is to measure on your own corpus, not assume the study predicts your costs or answer quality.
1. Pick ten real questions your agents get asked. Use questions that reflect actual work, not examples invented to make one approach look good.
2. Split them into single-fact lookups and questions that need the answer to connect information across several documents.
3. Run both approaches on the same questions: retrieve source fragments at query time with RAG, and answer from a compiled wiki.
4. For each answer, record whether it cites its source. Also record the tokens spent per query, so the query cost is visible.
5. Compare the build cost separately from the query cost. The study found the wiki build cost about two orders of magnitude more, and it spent roughly 21 times more tokens per query. Check both costs for your own setup.
Then read the numbers by question type, and keep build cost separate from per-query tokens:
- **Points to RAG:** single-fact lookups dominate, the answers already cite their sources, and tokens per query matter more than connecting findings across documents.
- **Points to a wiki:** the cross-document questions are answered better and claim-by-claim citations are worth the build cost and the extra tokens per query.
- **Points to both:** you have both kinds of question. Use the wiki for settled, citeable answers and RAG for the rest.
Keep the questions and the way you assess answers consistent across both runs. For single-fact questions, check whether the answer finds the fact. For questions that need several documents, check whether it connects the findings. A citation is useful only if you can follow it back to the object the claim came from.

## Who owns the wiki next quarter
Upkeep is the failure mode to plan for. A wiki written only when someone remembers can decay within a quarter. Pages can become stale, or nobody may review what agents are reading. Before building one, settle these responsibilities:
- **A named owner:** one person responsible for keeping the wiki useful after its first author changes roles.
- **What feeds it:** decide which team documents, tickets, and decisions belong in the source material.
- **Who reviews a compile:** name who checks the compiled pages before agents read them.
- **How stale pages are retired:** agree how the team identifies and removes pages that no longer reflect current decisions.
If the answer to who owns it is nobody, use RAG for now rather than build a wiki without an owner. Maskin’s [LLM knowledge wiki](/marketplace/knowledge-wiki/) turns finished work and shipped decisions into pages that cite the source object behind each claim.

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

### How do I test an LLM wiki against RAG on my own documents?
Choose ten real questions your agents get asked, then split them into single-fact lookups and questions that need information connected across documents. Run both approaches on the same questions. For each answer, record whether it cites its source and the tokens spent per query. Compare build cost separately from query cost, since a wiki can cost more to build and more per query.

### Who should own an LLM wiki on an engineering team?
Name one person who is responsible for the wiki after its first author changes roles. Before building, also decide what material feeds it, who reviews compiled pages before agents read them, and how stale pages are retired. If nobody can own those tasks, the wiki is likely to rot. Use RAG for now rather than create an artifact the team will not maintain.
Read next

## CTOs: test your agent knowledge setup
Book a meeting and bring ten real questions your agents get asked. We’ll score them together and read the result.
