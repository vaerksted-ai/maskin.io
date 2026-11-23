> Source: https://maskin.io/marketplace/knowledge-wiki/

# Know the pages your team reads are current.
Run Knowledge Wiki in Maskin so your team can make decisions with confidence while Maskin keeps your knowledge pages current.

## The job
A new note about pricing lands on the page that already covers pricing instead of becoming a near-duplicate, and old drafts get merged or retired, so what people read is current. The Flow keeps the wiki current.
**Replaces:** Manual wiki cleanup, searching for duplicate notes, and checking for stale pages.
**Stays with your team:** Decisions about what the business claims and anything Maskin cannot verify.

## What your team keeps, what Maskin runs
| Your team keeps | Maskin runs |
| --- | --- |
| Deciding what the business says about itself | Checks pages for contradictions and outdated facts, fixes them or marks an older page superseded |
| Naming who owns a page | Adds a missing owner to each page it touches |
| Deciding who needs to read a page | Adds a missing reader to each page it touches |
| Setting when a page should be reviewed | Adds a missing review date to each page it touches |
| Choosing which pages are key | Keeps Home, Status, and key pages out of weekly deprecation |

## How the Flow runs
1. When a knowledge page is created, the Knowledge Curator reads it and looks for an existing page that covers the topic.
2. If a page already covers the topic, the Curator updates it. If the knowledge is new, it files the page with its source and links it to anything it replaces or contradicts. A replaced page is marked deprecated, and the Flow gets a short note about where the page landed.
3. Monday and Thursday at 05:45 UTC, the Curator refreshes Home and Status with recent changes, coverage, freshness, and what needs checking. It posts one digest under 250 words covering what is new, changed, stale, and worth looking at next.
4. A daily check compares the Flow’s targets with its current state and picks up anything stuck. It runs the digest early if Home or Status is more than 4 days old.
5. Tuesday at 06:00 UTC, the Curator reviews up to 40 pages, oldest first. It checks drafts untouched for at least 14 days and validated pages untouched for at least 60 days.
6. For each page, it chooses to keep it and set a review date, merge it into a page that covers the topic, shorten it, or deprecate it. Before deprecating a page, it checks whether an open item links to it.
7. A pass ends with a digest posted and Home and Status refreshed. Deprecation is reversible, and the Flow keeps running.
The blue step is the close condition.

## What you need to run it
- Install the Flow.
- Nothing needs to be connected. It works on knowledge pages in your workspace and uses no outside accounts.
- If nothing is connected, it still works, and it sends nothing outside your workspace.
- When a new page is handled, you will see a short note on the Flow saying where it landed. After a pass, you will see the digest and refreshed Home and Status pages.

## Trust surface
- **Human gates:** Your team decides what the business claims and handles anything Maskin cannot verify.
- **Your data stays yours:** The Flow works on knowledge pages in your workspace and sends nothing outside it.
- **Fails safely:** It never permanently deletes pages. Before deprecating a page, it checks for open items that link to it.

## Example first week
Example for fictional Brightlane, project software for architects.
Monday: A new pricing decision is written up. The Curator finds the existing Pricing page and updates it.
Tuesday: The weekly clean-up merges a three-week-old pricing draft into the Pricing page and sets a review date.
Thursday: The digest lists one page updated, one draft merged, and two pages to check.

## What an LLM wiki is, and what it is not
An LLM wiki is a knowledge base an LLM compiles from your own material into interlinked pages that other agents read before they answer. Andrej Karpathy published the pattern in April 2026 as a public gist, framing it as the alternative to two things teams were already doing: stuffing per-agent memory files, and bolting a retrieval layer onto raw documents. The wiki is compiled ahead of time, so the agent reads a stable artifact a human can audit, rather than a fresh pile of retrieved fragments.
It is worth separating the wiki from its neighbours. A RAG index embeds your sources and retrieves pieces at query time; an LLM wiki compiles the sources into pages once and links them, so the same question tends to return the same answer. A Notion or Confluence space is written for humans and searched by humans; an LLM wiki is written to be read by an agent, and it cites the object each claim came from. Both are a durable, interlinked record, but the reader is different, and that changes how the record has to be maintained — and for the storage-engine side of the same distinction, [wiki-style knowledge vs an embedding store](/docs/knowledge-wiki-vs-vector-database/) walks through why one is content and the other is infrastructure.
The failure mode is not the compile step. It is the upkeep. A wiki that only gets written when someone remembers to write it decays into a folder of half-true pages inside a quarter.

## Install this flow in your workspace
Sign in or sign up, then confirm the flow in the Maskin app.
[Install this flow](/install/knowledge-wiki-loop) [Book a walkthrough](https://meshfirm.com/bookmagnus)

## Read next
- [Product discovery flow](/marketplace/product-discovery/): What customers and the market say, grouped into opportunities with the evidence behind each.
- [Meeting insights flow](/marketplace/meeting-loop/): Every meeting turned into filed tasks, decisions and findings.
- [Customer voice flow](/marketplace/customer-voice/): Customer messages filed as written findings, never replied to.
- [Competitor watch flow](/marketplace/competitor-watch/): A weekly sourced briefing on what changed in your market.
- [What is an AI-native agentic workspace?](/docs/what-is-an-agentic-workspace/): The cornerstone read on the workspace these flows run in.
