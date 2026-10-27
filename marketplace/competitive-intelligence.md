> Source: https://maskin.io/marketplace/competitive-intelligence/

# Run competitor intelligence as one loop, not five dashboards.
Maskin watches every competitor move, drafts the battlecard for sales, and shapes the product-gap bet for the roadmap. Your team owns the strategic read.
Turn every competitor move into two shipped outcomes at once: a battlecard your sales team actually uses, and a shaped bet for product where the signal reveals a real gap. The work is done when the battlecard is live in the channel the field reads and the product bet has an outcome measured against competitor close-rate on the affected segment, not when a dashboard is updated.
**Replaces:** CI point-SaaS whose signal only reaches sales · analyst hours on manual competitor tracking · product-gap signals lost between sales and roadmap · dashboards nobody reads twice
**Stays human:** which competitors matter and why · the sales-narrative read on any battlecard change · the “is this a real product gap?” call · the roadmap decision

## Key takeaways
- Watches four signal types: competitor changelogs, pricing pages, GitHub release notes, and Product Hunt launches.
- Routes every signal into two lanes at once: a battlecard update for sales, and a shaped bet for product where the signal reveals a real gap.
- Human gates on both lanes: sales enablement approves the battlecard; a PM approves the bet in the workspace.
- Closes on shipped work: the battlecard lives in the sales channel the field reads, and the bet’s outcome is measured against competitor close-rate on the affected segment.
- Wedge vs. Klue, Crayon, and Contify: both lanes close, instead of the product-facing signal dying in a dashboard.
![Diagram: one competitor signal enters a classifier, splits into a battlecard lane for sales and a bet lane for product, each with a human gate, and both converge into one typed graph.](/og-image-competitive-intelligence.jpg)
One signal, two lanes, one graph: both lanes close.
Or email [ai@maskin.io](mailto:ai@maskin.io?subject=Waitlist:%20Competitive%20intelligence%20loop) with subject “Waitlist: Competitive intelligence loop” and we’ll send it the moment it drops.

## What your team keeps, what Maskin runs
| Your team keeps | Maskin runs |
| --- | --- |
| Which competitors to watch and why | Watching changelogs, pricing pages, releases, and launches |
| The sales-narrative read on battlecard updates | Drafting the battlecard update: new claim, counter, objection handling |
| The “is this a real gap?” product call | Drafting the shaped bet with a measurable win condition |
| The roadmap decision | Routing each signal to the right lane: sales, product, or both |
| The positioning strategy | Measuring after ship whether close-rate against the competitor actually moved |

## How the loop runs
1. A competitor ships something: a changelog entry, a pricing change, a new release, a Product Hunt launch.
2. Maskin catches the diff and classifies it: does this need a battlecard update, does it reveal a product gap, or both.
3. It drafts both lanes in parallel: the battlecard update for sales, and the shaped bet for product with a measurable win condition.
4. Sales enablement approves the battlecard from the channel it already lives in.
5. Your PM approves the bet in the workspace.
6. The battlecard ships to the sales channel the field reads; the bet moves into the roadmap.
7. After ship, the loop checks whether close-rate against the competitor actually moved on the affected segment. The outcome, not the dashboard, closes the work.

## Competitor monitoring in practice: one real week of output
Buyers ask what a competitor monitoring agent would actually hand them. This is the answer from Maskin’s own run of this loop, for the week ending 25 October 2026. It is real output, not a mock-up. Every Sunday at 07:00 UTC an agent scans a named list of competitors for the past seven days, files each move as a signal, and rewrites one briefing page. A person reads it and decides what becomes work.

### What landed in the briefing
| Date | Competitor | What changed | The agent’s read |
| --- | --- | --- | --- |
| 19 Oct | Notion | Agents can work up to 24 hours, with a review mode where a person approves proposed changes before they apply. One credit system covers all AI use, and a spending console was announced as coming soon. | Approve-before-apply and a cost view are now standard in the suites. |
| 22 Oct | Linear | Loops can start from Slack and GitHub and be saved as templates for the whole workspace. | Linear has used the word Loop since July. The agent did not find an owner or close condition there, and marked that as unconfirmed because it did not check inside the product. |
| 23 Oct | Paperclip (open source) | Private tasks and projects readable only by named people, an audited admin override, and an exact cost ledger. | The closest self-hosted rival now has item-level privacy. |
| 21 Oct | Microsoft | A customer-conversation harness for Copilot Studio. | Outside our slot. Logged so nobody checks it twice. |
Source: the Market Category and Competitor watch loop, which Maskin runs on its own competitor set. The agent’s confidence for the week was high on the facts and medium on the readings.

### What the agent handed over
1. **A signal for each move,** tagged with the company name. That week had 5 new signals across all lanes, against 14 the week before.
2. **One briefing page, rewritten in full.** A quick read of at most eight lines, then what needs a reaction this week, the storylines of the last 30 days, this week’s moves, what was passed to the product-strategy agent, and what to check next.
3. **A threat level with the date it last changed.** The agent labeled its own pick as a judgment, because the team has not yet written down what Low, Medium and High mean.
4. **A Monday deck for the founder,** built from the briefing. In the four weeks to 19 October it arrived on three Mondays, and a check at 08:00 UTC catches a miss.

### Who approves what
- **Nobody approves a signal.** The agent files it, and a second agent clusters it with related signals.
- **A person approves anything that becomes work.** That week one item was marked for action: a product bet waiting to be switched to active. Switching a bet to active is a status change only a person can make, so the agent named the owner, the deadline and its recommendation, then stopped.
- **A person approves the competitor list.** The agent proposes additions and removals once a month, on the 20th, and does not edit the list itself.
- **Long-term positioning has its own owner.** Findings that confirm or challenge the long view go to a separate agent that refreshes the outlook page monthly. Pivot calls stay with a person.

### What this run did not do
Two limits, both stated on the briefing page itself. OpenAI’s and xAI’s pages returned access errors that week, so nothing from them after 19 October is verified. And our own run is the research half of this loop: it ends in a briefing and a decision for a person. The battlecard draft and the close-rate check described on this page are not part of it.

### How hard is it to build?
Our run is made of a few plain parts:
- A competitor list, with each company tagged with how often it is checked: a full weekly scan, one line a week, monthly, or quarterly.
- Five schedules: the weekly scan, a monthly check of the competitor list, a monthly outlook refresh, the Monday deck, and the Monday check that the deck landed.
- Four agents: a researcher, a product-marketing owner, a product-strategy agent and a design agent for the deck. A weekly scan is expected to take about 15 minutes.
- Written instructions: the tag format for each signal, which list a finding goes in, and the fixed order of the briefing page.
For your team the pieces are the same: a competitor list, one weekly schedule, one page to rewrite and a named person for each decision. We have not timed a setup for another team, so we do not quote hours.

## Trust surface
- **Human gates:** sales enablement approves the battlecard; a PM approves the bet; no positioning claim goes out without your sign-off.
- **Your data stays yours:** Maskin watches public sources on your list; it writes back into your battlecard tool, your roadmap, and your CRM. No external dashboard to check.
- **Fails safely:** if the diff is ambiguous, the signal pauses for a human classifier read. Nothing ships with a wrong-lane routing.

## Run this loop
**[Book a demo](https://meshfirm.com/bookmagnus)**: see the loop running on our own competitor set, then decide whether to run it on yours.

## How the loop closes
The mechanics, the object model and the honest limits are in the [competitive intelligence loop deep doc](/loops/competitive-intelligence/).
- **Fires when** a competitor changelog, pricing page, GitHub release, or Product Hunt launch changes. Diffs on the page, not scrapes of the marketing copy.
- **Classifies into one or both lanes.** An agent asks two independent questions of every captured change: does this need a battlecard update, and does it reveal a product gap. Tags one, the other, or both.
- **Drafts both lanes in parallel.** The battlecard update (new claim, counter, objection handling) and the shaped bet (with a win condition like *“ship response X, close-rate against competitor Y improves by Z pp on the affected segment”*).
- **Human gates.** Sales enablement approves the battlecard from the tool it already lives in; a PM approves the bet in the workspace.
- **Closes on two outcomes.** The battlecard ships to the sales channel the field actually reads; the bet, once shipped, has its win condition measured against competitor close-rate movement.
- **Difference vs. Klue, Crayon, and Contify.** Those tools own the sales lane competently. The wedge here is not the classifier; it is that the product-facing signal reaches product as a shaped bet with a win condition, instead of dying in an enablement dashboard.

## FAQ

### What is competitor intelligence?
Competitor intelligence is the ongoing practice of tracking specific rival companies (what they ship, how they price, what they announce) and turning those signals into decisions your team can act on. It sits narrower than competitive intelligence, which spans the whole market. The value only lands when a signal reaches the person who ships work: an updated battlecard for sales, or a product-gap bet for the roadmap.

### How is competitive intelligence gathered?
Modern competitive intelligence is gathered from public signal sources, not human espionage. Four common ones: competitor changelogs, pricing pages, GitHub release notes, and Product Hunt launches. Diffs on those pages surface real product moves before the marketing copy catches up. The hard part isn’t the gathering. It’s routing each signal to the right person quickly enough that the decision still matters when it lands.

### Is competitive intelligence legal?
Yes, when it stays on public information: changelogs, pricing pages, release notes, product launches, patent filings, marketing copy. That’s standard competitive intelligence practice and how most programs run. What crosses the line is corporate espionage: obtaining trade secrets through misrepresentation, hacking, or breaches of confidentiality. Legitimate CI operates roughly under the same boundary investigative journalism does. Public sources are fine, unlawful access is not.

### What are competitive intelligence tools?
Competitive intelligence tools help teams capture competitor signals and turn them into deliverables. Klue and Crayon lead the sales-enablement side, strong at battlecards for the sales lane. Contify covers the market-monitoring side. What most of them share is a dashboard as the endpoint: signals get captured and displayed, but often don’t cross into product decisions. That’s the specific gap this loop is built around.

### What’s the difference between competitor intelligence and competitive intelligence?
In common use, the two terms are near-synonyms and get interchanged freely. Where they diverge: competitive intelligence usually spans the whole market (trends, adjacent categories, macro shifts). Competitor intelligence is narrower, focused on specific rival companies you track by name. This loop is competitor intelligence. It watches a defined list of competitors and routes their signals into two lanes with human gates on each.

### What does a competitor monitoring agent produce each week?
In Maskin’s own run it produces three things: a signal for each competitor move, tagged with the company name; one briefing page, rewritten every week, with a quick read, what needs a person this week and a read on each move; and a Monday deck for the founder. A person decides anything that becomes work, and the competitor list only changes when a person approves a proposal.

### How hard is it to build a competitor monitoring agent?
The parts are a competitor list, one weekly schedule, one page that gets rewritten and a named person for each decision. Our own run uses five schedules and four agents, and a weekly scan is expected to take about 15 minutes. We have not timed a setup for another team, so we do not quote hours. What you actually write is the instructions: signal tags, which list a finding goes in, and the order of the briefing page.

### Are there competitor monitoring tools that do this?
Yes, for the sales lane. Klue and Crayon lead the sales-enablement side, strong at battlecards, and Contify covers market monitoring. What most competitor monitoring tools share is a dashboard as the endpoint: signals get captured and displayed, but often don’t cross into product decisions. This loop routes the same signal to product as a shaped bet with a human gate on it.

## Built with
- **Signal sources:** competitor changelogs, pricing pages, GitHub release notes, Product Hunt launches.
- **Agents:** competitor watcher, dual classifier, battlecard drafter, bet shaper, close-rate validator.
- **MCPs:** Slack, HubSpot or Salesforce, GitHub, PostHog, the sales enablement platform of record.
- **Skills:** *write in our voice*, *shape a bet against a competitor signal*.
- **Human gates:** sales enablement on the battlecard; a PM on the bet.
Every listing on the Marketplace is a loop: something fires it, agents do the work, a human gates the taste-sensitive parts, and it ends on a concrete outcome. Agents, MCPs and skills show up here only as the parts the loop is built from.

## Related loops on the marketplace
- [Product discovery loop](/marketplace/product-discovery/): interviews, tickets, and reviews land as typed insight, and the loop closes when a shaped bet ships against them.
- [Knowledge wiki loop](/marketplace/knowledge-wiki/): team memory that new hires and new agents bootstrap from.
- [SEO publishing loop](/marketplace/seo-publishing/): one loop from keyword bracket to indexed rank, with humans gating the intent read and the send-to-publish.
- [Outbound loop](/marketplace/outbound/): prospect research, personalized draft, and reply-handling as one loop, with humans gating the send.
- [What is an AI-native agentic workspace?](/docs/what-is-an-agentic-workspace/): the cornerstone read on the workspace these loops run in.
