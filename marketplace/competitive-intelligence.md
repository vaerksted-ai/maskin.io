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
