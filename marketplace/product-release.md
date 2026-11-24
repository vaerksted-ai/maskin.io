> Source: https://maskin.io/marketplace/product-release/

# Get merged work to customers with notes that are really live.
Run Product release in Maskin so your team gets merged work out to customers with notes that are really live while Maskin bundles changes and checks release status.
![Get merged work to customers with notes that are really live. The product release flow.](/og-image-product-release.png)

## The job
Your release is live on every surface it covers, its change log is written, and notable releases have their in-app note and public entry live and read back.
**Replaces:** Manual release bundling, note writing, and status chasing.
**Stays with your team:** Merging code, publishing the public entry, and answering the few questions only a person can answer, such as a positioning shift or a store rejection.

## What your team keeps, what Maskin runs
| Your team keeps | Maskin runs |
| --- | --- |
| Merging code | Reads merged work from your connected code host, but never merges code |
| Deciding how to handle a positioning shift | Asks a person when a release involves a positioning shift |
| Deciding whether a change is notable when it is unclear | Asks an agent that owns the product first, then decides and says so on the release task |
| Publishing the public release-log entry | Prepares the entry and hands it to the agent that publishes your website, or flags it for a person if you have none |
| Handling store rejections or store questions only a person can answer | Reports the issue and asks a person to take the next step |
| Owning the release outcome | Reads back notes, records dates, and marks the release done or names what is missing and who owns it |

## How the Flow runs
1. On Monday and Thursday at 08:00 UTC, Maskin reads work merged on your connected code host since the last release.
2. It groups every user-facing change into an open release bundle for that release, and proposes one version number for web and apps.
3. It proposes a major release type for breaking or large changes, minor for a new capability, or patch for fixes only. It lists the customer-facing items in the release, leaving out internal plumbing.
4. For a notable release, Maskin prepares the update text for the store or app, an in-app announcement note if your product has one, and a public release-log entry if you keep one. For a patch, it prepares one short change-log line and no announcement.
5. If Maskin is unsure whether a change is notable, it asks an agent that owns the product, then decides and says so on the release task. A person is needed only for a positioning shift, or when Maskin still cannot tell whether a change is notable.
6. If you connect a store, an optional weekday check at 08:00 UTC reports each app version's state and who takes the next step. It comments only when the state changes, retries a temporary store error once, and asks a person only for a store rejection or a store question only a person can answer. A second failure becomes a fix task for whoever owns the code.
7. When a release moves to "in review" (meaning live), Maskin reads back the notes, records the live date and note date, and adds a customer date to each listed item. It marks the release done or names what is missing and who owns it.
Amber steps are human approvals. The blue step is the close condition.
![Product release flow in seven steps, from reading newly merged work to reading back the notes and marking the release done, then it runs again.](/marketplace/product-release/flow.png)

## What you need to run it
- Install the Flow. It ships both roles, the release manager and the optional store release manager, so no agent is missing.
- Connect your code host after install. This is required for release bundling.
- If no code host is connected, the bundle step says so once and stops. If more than one repository is connected, it asks once which to read.
- Connect your store for the optional app version check. If no store is connected, that step says so once and switches its own check off. Turn the check back on after you connect a store.
- Public release-log entries go to whichever agent publishes your website. If you have none, the entry is flagged for a person.
- At the first scheduled check after merged work exists, you will see a release bundle with grouped changes and a proposed version and release type.

## Trust surface
- **Human gates:** A person is needed for a positioning shift, a store rejection, a store question only a person can answer, or when Maskin cannot tell whether a change is notable.
- **Your data stays yours:** You connect your own code host and optional store. Maskin never merges code and does not publish to your website.
- **Fails safely:** Without a code host, bundling stops. A temporary store error gets one retry, then a fix task. Missing release items are named with an owner.

## Example first week
Example for fictional Brightlane, project software for architects.
- Day 1, Monday: Maskin finds two user-facing changes merged since the last release.
- Day 1: It groups them into a release bundle and proposes a minor release type because one adds a new capability.
- Day 1: It lists the customer-facing item and leaves internal plumbing out.
- Day 2: Maskin asks the agent that owns the product whether the change is notable. It confirms, and Maskin records that on the release task.
- Day 2: Maskin prepares the release notes. The update text reads: "Share a project with a client without asking them to sign up."
- Day 3: The optional store check reports the app version's state and who takes the next step.
- Day 4: The release moves to "in review," meaning live.
- Day 4: Maskin reads back the notes, records the dates, adds a customer date to the item, and marks the release done.

## Install this flow in your workspace
Sign in or sign up, then confirm the flow in the Maskin app.
[Install this flow](/install/product-release-loop) [Book a walkthrough](https://meshfirm.com/bookmagnus)

## Read next
- [Product delivery flow](/marketplace/product-delivery/): Bets in, verified code out.
- [Customer voice flow](/marketplace/customer-voice/): Customer messages filed as written findings, never replied to.
- [Product discovery flow](/marketplace/product-discovery/): What customers and the market say, grouped into opportunities with the evidence behind each.
- [Product Analytics flow](/marketplace/product-usage/): A weekly read and a daily check of real usage, filing what changes what your team believes.
- [What is an AI-native agentic workspace?](/docs/what-is-an-agentic-workspace/): The cornerstone read on the workspace these flows run in.
