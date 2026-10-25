> Source: https://maskin.io/marketplace/product-delivery/

# Bets in. Verified code out.
Run agentic software development in Maskin so your team owns the bet and the final call, while Maskin plans the work, builds it, reviews every change, and checks the result against the success criteria you wrote first.
![The product delivery loop — bets in, verified code out.](/og-image-product-delivery.png)
A shaped bet goes in, code checked against the bet’s own success criteria comes out, and a human approves the one step that deploys.

## The job
A bet is only done when the change is live and the numbers say it worked. Most teams lose that second half. The ticket closes when the code merges, nobody goes back to check the result, and the next planning meeting starts from memory.
This loop keeps both halves attached. Success criteria are written and checked for measurability before any work starts. The work is planned into tasks with an owner each. Every change gets reviewed against its task. The release gets a final check before it can reach main. After it ships, the loop reads your product data and your customer feedback and posts a verdict on the bet. Your team keeps the shaping taste, the merge approval, and the last word on whether the bet won.
It is the output side of the [product discovery loop](/marketplace/product-discovery/): discovery turns customer signal into a shaped bet, delivery turns that bet into shipped, verified code. The [bet-based planning](/docs/bet-based-product-planning/) method sits underneath both.
**Replaces:** sprint-planning ceremonies · a delivery lead chasing status across tickets and pull requests · hand-run release checklists · close-out reviews nobody gets round to.
**Stays human:** which bets are worth shaping · approving the merge to main · the final call on every bet (succeeded, failed, paused, archived).

## Your team and Maskin: who does what
| Your team keeps | Maskin runs |
| --- | --- |
| The taste on which bets are worth shaping | Checking the success criteria can actually be measured before work starts |
| Approving the merge to main | Breaking the bet into tasks, with an owner and a branch for each |
| The final call on the bet | Building each task and opening the pull request |
| What goes back into discovery | Reviewing every change against the task it came from |
| The decision to pause or kill a bet | Checking the release, then reading product data and customer feedback after it ships |

## How the loop runs
1. A bet is shaped and ready to build. Maskin checks that its Won and Lost criteria can be measured with the data you already collect, and flags any that can’t.
2. Maskin locks the spec, breaks the bet into tasks, gives each task an owner and sets up the branch the work lands on.
3. Each task goes to the agent that owns it. For code, a developer agent writes the change and opens a pull request.
4. A reviewer agent checks each pull request against its task’s acceptance criteria and merges it into the bet’s branch.
5. When the last task passes review, Maskin runs one review across the whole bet.
6. A release check scores the risk of the bet’s pull request. A human approves the merge to main. Nothing deploys without that approval.
7. After it is live, Maskin reads your product data and posts a Won, Lost or Inconclusive verdict on the bet.
8. It then reads what customers and your own team said and posts a second verdict next to the first.
9. You make the final call. Anything that came up outside the bet’s scope goes back into discovery as a new signal, so the next bet starts from what this one learned.

## What you can rely on
- **Human gates:** you approve the merge to main, and you make the final call on every bet. Agents never close a bet themselves.
- **Your code stays yours:** Maskin works through your repository and your pull requests. The history lives in your repo and on the bet, not in a shadow system.
- **Fails safely:** if a change fails review or the release check, it stops there and goes back to the task. A safety-net sweep also catches any merged pull request whose bet was left open.

## Pick per bet, not per team
You don’t have to move everything. Run this loop on the bets that suit it, such as AI-heavy work or small teams with tight engineering time, and keep the rest in Jira or Linear. Both paths read from the same shaped bet and write the result back to the same place. If you are weighing a full move off Jira, the [open source Jira alternative](/alternatives/open-source-jira-alternative/) page compares the open source trackers with this bet-based approach. The [product teams guide](/solutions/product-teams/) walks through both paths.

## Frequently asked questions

### What is agentic software development?
Software work where AI agents each own a step: planning, building, reviewing, checking the release. In Maskin they work from a shaped bet and its success criteria, and a person approves what reaches main.

### Does it replace my engineers?
No. Your team decides which bets are worth shaping, approves the merge to main, and makes the final call on every bet. The agents take the planning, building and review steps in between.

### Do I have to leave Jira or Linear?
No. Pick per bet. Run this loop on the bets that suit it and keep the rest in Jira or Linear. Both read from the same shaped bet and write the result back to the same place.

### Can anything reach production without a person?
No. A release check scores the risk of the bet’s pull request, and a person approves the merge to main. Nothing deploys without that approval.

### Where does my code live?
In your repository. Maskin works through your repo and your pull requests, so the history stays there and on the bet.

### How do I know the bet worked?
You write the Won and Lost criteria first, and Maskin checks they can be measured with data you already collect. After release it reads your product data and posts a Won, Lost or Inconclusive verdict, then reads customer and team feedback and posts a second one. You make the final call.

## Proof
The Maskin Team ships Maskin through this loop. Shaping, planning, building, review, release check and verdict all run inside the product described on this page.

## Run it
See the loop run, then decide whether to run it on your repo. Or [start your workspace](https://maskin.io/signup).

## Related loops
- [The product discovery loop](/marketplace/product-discovery/): what feeds this loop.
- [The LLM knowledge wiki loop](/marketplace/knowledge-wiki/): the context agents read before they plan.
- [The SEO publishing loop](/marketplace/seo-publishing/): another shaped bet turned into a shipped page.

## What this loop is built with
Named the same on every loop page so the shape is portable. Below the fold on purpose — the loop is what closes; the primitives are just the parts. Inside a loop listing, agents / MCPs / skills appear as “built with” components of the loop, never as top-level marketplace sections of their own.
Loop
A closed cycle: something fires it (a signal, a schedule, a click), agents do the work, a human gates the taste-sensitive parts, and it ends on a concrete outcome — not on *done for now*. Every listing on the Marketplace is a loop. Maskin loops carry typed outcomes and verdicts that persist across tools, not recurring workflow execution inside one product.
Agent
A named role a model performs — an SEO analyst, a discovery synthesizer, an outbound writer. Not an *AI teammate*: a role with a job description, tools it can use, and gates it has to pass before its work leaves the workspace.
MCP
The wire an agent uses to reach the tools your team already uses — the CRM, the docs, the inbox, the analytics. If a human on your team can log in and click, an MCP-native agent can be given the same access under the same gates.
Skill
A packaged capability you attach to an agent — *draft a follow-up in our voice*, *summarize a customer call against our discovery template*. Skills are the reusable pieces of judgment your team is already building without realising it.
