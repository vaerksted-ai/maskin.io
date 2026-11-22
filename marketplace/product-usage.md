> Source: https://maskin.io/marketplace/product-usage/

# Read your product usage every week without opening analytics.
Run Product Analytics in Maskin so your team can decide what to improve while Maskin checks the feed every day and files findings, each with a recommended action, that challenge what you believe.
![Read your product usage every week without opening analytics. The Product Analytics flow.](/og-image-product-usage.png)

## The job
Your team gets a written finding when product usage changes what it believes, and no update when nothing changed. Each Monday, Maskin reads the last 7 days of real human usage from the analytics tool you connect and files each result that changed or contradicts what your team believes, with the count behind every number and a recommended action. Every day it also compares yesterday with the usual level and files an anomaly once.
**Replaces:** A person opening the analytics tool each week to scan usage by hand.
**Stays with your team:** Deciding whether a finding should change a product decision.

## What your team keeps, what Maskin runs
| Your team keeps | Maskin runs |
| --- | --- |
| Deciding which product beliefs to revisit | Finds usage that changed or contradicts what your team believes |
| Deciding what the numbers mean for a feature or goal | Includes the count behind every number, a recommended action, and a link to the feature or goal |
| Deciding what counts as critical and who is told | Mentions the person you name when a finding is critical, and nobody else |
| Choosing what to investigate when tracking is missing | Files a finding tagged gap when missing tracking blocks a question |
| Deciding whether a finding merits action | Shows only briefs that would change a decision |
| Deciding whether to change events or dashboards | Leaves events and dashboards unchanged |

## How the Flow runs
1. On Monday at 07:00 UTC, Maskin reads the Setup section of the Flow, then checks that the analytics feed is healthy by the rule you set there.
2. If the feed is unhealthy, Maskin says so once on the Flow and stops without filing anything. If access is refused, it says so once and names who can grant it.
3. If the feed is healthy, Maskin reads the last 7 days of real human usage, excluding internal and test accounts.
4. It checks activation as you define it in Setup, repeat use, drop-off by product area, and mobile events if you track them.
5. Maskin files one finding for each result that changed or contradicts what your team believes, with the count behind every number, a recommended action and a link to the relevant feature or goal. A critical finding mentions the person named in Setup. If missing tracking blocks a question, it files one finding tagged gap.
6. Every day at 06:30 UTC, Maskin compares yesterday with the same weekday over the last four weeks and files an anomaly once, only when a count of 10 or more stands behind it.
7. After each Monday read, Maskin refreshes the Results tab with up to three short briefs that deserve a person’s decision, or a quiet state, and the Lifecycle tab with a stage-by-stage snapshot.
8. Tuesday to Friday at 07:56 UTC, an owner check checks the feed, updates the Flow’s target for weekly reads, keeps both tabs fresh, and runs the Monday read if it did not run. A read with nothing new stays silent.
![Product Analytics flow in eight steps: Monday check that the feed is healthy, say so and stop if it is not, read 7 days of real usage, check activation and drop-off, file findings with a recommended action, a daily 06:30 UTC anomaly check, up to three briefs to decide on, then a Tuesday to Friday owner check before it runs again.](/marketplace/product-usage/flow.png)

## What you need to run it
- Install the Flow.
- Connect a product analytics tool, such as PostHog, Mixpanel or Amplitude.
- Fill in the Setup section in the Flow description: your product and platforms, the analytics tool and project, the tracking plan, how to leave out internal users, what counts as critical, who to notify and who owns tracking fixes. Empty lines are guessed from the analytics tool and marked as guesses.
- If no analytics tool is connected, the Monday read says so once and stops. If access is refused, Maskin names who can grant it.
- You will first see the Results and Lifecycle tabs, both quiet until the first read.
- Product discovery is optional. The Flow works without it.

## Trust surface
- **Human gates:** Your team decides whether a finding should change a product decision. Maskin sends nothing.
- **Your data stays yours:** Maskin reads the analytics feed you connect and never changes events or dashboards.
- **Fails safely:** If the feed is unhealthy or unavailable, Maskin says so once and stops without filing findings.

## Example first week
Example for fictional Brightlane, project software for architects.
Monday: The analytics feed is healthy. Maskin reads the last 7 days, excluding Brightlane’s own team.
Monday: The team’s meeting note says, “Mobile is where people abandon setup.”
Monday: No mobile events are tracked, so Maskin files one finding tagged gap instead of claiming where people drop off.
Tuesday: The Results tab shows the finding and what the team could investigate next.
Wednesday: The owner check runs and finds nothing new.
Thursday: The read stays silent.
Friday: Brightlane’s team decides whether to add mobile tracking.

## Install this flow in your workspace
Sign in or sign up, then confirm the flow in the Maskin app.
[Install this flow](/install/product-usage-loop) [Book a walkthrough](https://meshfirm.com/bookmagnus)

## Read next
- [Product discovery flow](/marketplace/product-discovery/): What customers and the market say, grouped into opportunities with the evidence behind each.
- [Customer voice flow](/marketplace/customer-voice/): Customer messages filed as written findings, never replied to.
- [Product release flow](/marketplace/product-release/): Merged work bundled into a release with notes confirmed live.
- [What is an AI-native agentic workspace?](/docs/what-is-an-agentic-workspace/): The cornerstone read on the workspace these flows run in.
