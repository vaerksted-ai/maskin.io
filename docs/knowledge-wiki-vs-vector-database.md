> Source: https://maskin.io/docs/knowledge-wiki-vs-vector-database/

# Knowledge wiki vs vector database: a compiled artifact is not a storage engine
A vector database stores embeddings and returns nearest-neighbour matches; a knowledge wiki is a set of compiled, human-auditable pages. They are not competitors. A vector database is one component inside a retrieval pipeline — a storage engine — while the wiki is the artifact you might store. You can put wiki pages **into** a vector database and retrieve from them; you cannot retire one with the other.
> ✓
> **Key takeaways**
> **A vector database is storage for embeddings** — vectors plus metadata, chunked and indexed for similarity search. It is a component, not an architecture.
> **A knowledge wiki is a compiled artifact** — interlinked pages a human can read and audit, each citing the object its claim came from.
> **They compose rather than compete.** The wiki is a clean source; the vector database is one way to index it. The direction runs one way: pages go into the database, not the reverse.
> **Most "vs" questions here are really asking which layer is missing** from your stack — a place to store vectors, or a stable artifact worth retrieving from.
> **On the standard agent-memory benchmarks, retrieval is close to solved** (~97% recall@5 on LongMemEval); the unsolved part is synthesis over what was retrieved.

## The short answer: an artifact and a component are different kinds of thing
A vector database and a knowledge wiki sit at different layers, which is why a head-to-head "which wins" framing produces heat rather than an answer. The cleanest cut is **storage engine versus compiled artifact**. A vector database is infrastructure: it holds embeddings and answers a similarity query. A knowledge wiki is content: a set of pages written once, linked, and read many times by humans and agents. Infrastructure holds content. It does not replace it.
If your actual question is whether a compiled wiki beats a query-time retrieval architecture, that comparison lives one page over — [LLM wiki vs RAG](/docs/llm-wiki-vs-rag/) covers the mechanism-versus-artifact decision in full. This page answers the narrower question: what a vector database is on its own, and how it relates to a wiki once you stop treating the two as rivals.

## What a vector database actually is
A vector database is a store built for one job: keep embeddings and find the vectors nearest a query vector, fast. An embedding is a fixed-length numeric representation of a piece of text — a list of floats, not the text itself. "Nearest" is measured by distance (cosine, dot product, Euclidean), and the lookup is approximate, because exact nearest-neighbour search over millions of vectors is too slow to serve. That approximation is the whole point of a specialised engine.

### What actually gets stored
Not documents. A vector database stores three things together: the vector, the metadata attached to it, and (usually) a pointer back to the original chunk of text.
1. Your source is split into chunks — a paragraph, or a page section.
2. Each chunk is passed through an embedding model, which returns a vector.
3. The vector is written into an index (HNSW and IVF are two common structures) alongside metadata: source ID, page ID, section heading, timestamp.
4. At query time your question is embedded the same way, and the index returns the closest vectors — and, through the metadata, the chunks they point at.
You cannot read a vector. You can only search it. The original text has to live somewhere else, which is the first reason the wiki and the database are not the same thing: the database indexes the artifact, it does not become it.

### It is neither relational nor a document store
People reach for the nearest familiar category and miss. A vector database is not relational — it has no joins in the SQL sense, and one of the most-searched questions around it is literally "is a vector database relational?" The answer is no: its query primitive is similarity, not selection. Nor is it a document store in the Elasticsearch sense, though some engines blur the line by supporting hybrid lexical-plus-vector search. It is a purpose-built index for approximate nearest-neighbour search, with metadata bolted on for filtering. Useful, narrow, and one layer down from anything a human reads.

## What a knowledge wiki actually is
A knowledge wiki is a set of interlinked pages an LLM compiles from your own material, that other agents read before they answer. Andrej Karpathy published the pattern as a public gist in April 2026, framing it as the alternative to per-agent memory files and to bolting retrieval onto raw documents. Three properties matter for this comparison:
- **It is compiled ahead of time.** Pages exist before the question is asked, so the same question tends to return the same answer. A compiled artifact is checkable; a fresh retrieval is not.
- **It is human-auditable.** A person can open a page and read it. You cannot open a vector and read it.
- **It cites its sources.** Each page links back to the object the claim came from, so a reader walks back to the source instead of trusting a summary.
That is the artifact half of the pair. The failure mode is not the compile step; it is upkeep. A wiki that only gets written when someone remembers to write it decays into a folder of half-true pages inside a quarter. The [knowledge-wiki loop](/marketplace/knowledge-wiki/) is the working shape of keeping one alive.

## Why "versus" collapses: you put wiki pages into a vector database
Here is the move that ends the comparison. A wiki is a source. A vector database is an index. To search a wiki by meaning rather than by title, you embed its pages and store those vectors in a database — which is exactly what people do. The wiki does not compete with the database; it is one of the best things you can put in it.
**Can you store wiki pages in a vector database? Yes.** Split each page into sections, embed each section, and write the vectors with metadata that points back to the page and heading. A query then returns the most relevant *sections of your wiki*, and because you kept the pointer, the agent can open the page and read the full, linkable context around the retrieved fragment. You have used the database as a lookup mechanism over a curated artifact. Nothing was replaced.
That is the composition, and it is why the honest framing is layered rather than oppositional: the wiki is the curated core, the vector database is one index over it, and a retrieval pipeline serves whatever volatile material a wiki deliberately leaves out.

## The mistake this comparison exposes
Treat the vector database as "the knowledge layer" and you inherit a solved problem as if it were the whole problem. The 2026 benchmark picture is blunt about where the difficulty actually sits. On LongMemEval, first-stage retrieval is close to saturated — recall@5 around **97%**, while end-to-end accuracy lands near **87%**. Of the 65 wrong answers, **54 had the correct evidence sitting in the top-5 retrieval**; only 11 were genuine retrieval misses (AutoMem's 2026 comparison, over the LongMemEval full slice). The evidence was found. It was not used well.
The same split shows up in evaluation. MemDelta (June 2026) found that swapping the embedding model alone moves LongMemEval by **+6.2 points** — enough to flip which system "wins" — while the model family doing the answering swings results by up to **45 points**, and Mem0 tied plain verbatim RAG at **50× the write-path cost**. A benchmark whose own answer key is 6.4% wrong (the Penfield Labs LoCoMo audit) cannot separate an 88% system from a 94% one.
Read together, the message is that a vector database is a component whose behaviour depends heavily on the model around it, and that adding a better retriever will not move a system that is failing at synthesis. The artifact layer — a clean, well-structured page an agent can reason over — is where the remaining gains are. That is the wiki's job, and it is a job the database cannot do.

## Vector database vs knowledge graph: the other neighbour worth not confusing
One more distinction, because the vocabulary overlaps and people blur it. A vector database stores embeddings and answers similarity queries. A knowledge graph stores typed nodes and typed edges and answers traversal queries — "what depends on X, and who owns it." A knowledge wiki is a compiled artifact a person reads. Three different things.
The shipping-code consensus this year has moved toward the graph for agent memory: khive, Graphiti, and growmos, three separate projects, converged within months on typed ontologies, typed edges, and provenance on every item — and all three explicitly position typed structure against raw similarity. Their shared claim is that "what depends on X" is structure, not a similarity result. Worth separating one more step: a typed *workspace graph* where agents write and read typed objects is a control plane, not a retrieval index — a distinction that matters because the AI-search vocabulary has trained buyers to hear "vector database" whenever anyone says "knowledge graph." When Maskin says the workspace graph is where persistence lives, it does not mean an index you query. It means the substrate agents read and write.

## How to decide which layer you actually need
Stop asking which wins. Ask which layer is missing.
| Layer | What it answers | Its failure mode |
| --- | --- | --- |
| Vector database | "Find text like this" — similarity over embeddings | Retrieval noise; the right chunk was never the problem |
| Knowledge graph | "How is X connected to Y" — traversal over typed edges | Ontology drift; expensive to keep typed and current |
| Knowledge wiki | "What do we know, stated once" — a compiled, citeable page | Staleness and orphaned pages; upkeep nobody owns |
Run four questions:
1. **Can a human read the answer where it lives?** If it must be auditable, you need an artifact — a vector is not reviewable.
2. **Does the same question come back?** Repeated questions favour a compiled page; one-off exploration favours an index.
3. **Do you need to trace a claim to a source?** If yes, the wiki's citation structure is the feature, and it survives being indexed into a database.
4. **Who keeps it current next quarter?** If the answer is "nobody," no storage choice will save it.
Most teams that adopt a wiki still run a vector database underneath it — for search over the pages, and for the volatile material the wiki leaves out. The two are a stack, not a choice.

## Making the wiki a maintained artifact, not a folder
The database is the easy half. Standing one up is an afternoon. Keeping a compiled artifact *true* is the hard half, and it is an ownership problem, not a storage problem. Writing to the wiki has to be a byproduct of work that already closes, and reading it a byproduct of work that already starts, or it decays regardless of how good the index on top is. That is the shape of the [knowledge-wiki loop](/marketplace/knowledge-wiki/): a closed work item fires it, agents write the verdict and link the artifact, a human gates the taste-sensitive summaries, and it closes when a new hire or a new agent can read the page and stop needing to ask. For how the artifact relates to the volatile store beside it, see [agent memory across sessions](/docs/learn/agent-memory-across-sessions/), where the same vector-store-is-not-memory distinction is worked through from the persistence side.

## FAQ

### Is a vector database the same as a knowledge wiki?
No. A vector database stores embeddings and returns nearest-neighbour matches; it is a storage engine, not a readable artifact. A knowledge wiki is a set of compiled, interlinked pages a human can read and audit, with each claim linked to the object it came from. You can store wiki pages in a vector database, but the database is the index, not the knowledge.

### Can you store wiki pages in a vector database?
Yes, and it is a common pattern. Split each page into sections, embed each section, and store the vectors with metadata pointing back to the page and heading. Queries then return the most relevant sections of your wiki, and the pointer lets an agent open the full page for context it can cite.

### What is stored in a vector database?
Vectors, plus metadata, plus usually a pointer to the original text. The source is chunked, each chunk is turned into an embedding by a model, and the vector is written to an approximate-nearest-neighbour index (HNSW and IVF are two common structures) with metadata such as source ID, page ID, and timestamp. The original text lives elsewhere; the database indexes it.

### Is a vector database relational?
No. It has no SQL-style joins, and its query primitive is similarity, not selection. It is also not a document store in the Elasticsearch sense, though some engines add hybrid lexical-plus-vector search. It is a purpose-built index for approximate nearest-neighbour search with metadata filtering.

### Does a knowledge wiki replace a vector database?
No. A wiki can replace the *corpus* you retrieve from — compiled, citeable pages beat raw chunks as a source — but you still need something to retrieve from it, and a vector database is one way to do that. What the wiki replaces is the pile of unprocessed documents, not the index on top of them.

### Vector database vs knowledge graph — what is the difference?
A vector database answers "find content like this" using similarity over embeddings. A knowledge graph answers "how is this connected to that" using traversal over typed nodes and edges. Typed structure is not a similarity result: "what depends on X, and who owns it" is a traversal query. The graph is the better fit for agent memory that has to reason about relationships.

### Why do you need a vector database at all?
For semantic search over a corpus too large or too varied to pre-write answers for. When your team asks the same settled questions, a compiled wiki answers them more stably and more cheaply to audit. When the corpus is large and moving, a similarity index is what lets an agent find the relevant fragment without a human having filed it first. Most teams end up with both.
Read next

## Compile the artifact, then index it
Maskin compiles closed bets into typed pages agents read before they answer — an artifact you can point any retrieval pipeline at. Open source under Apache 2.0. Self-host free, bring your own model.
