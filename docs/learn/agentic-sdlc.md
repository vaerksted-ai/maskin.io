> Source: https://maskin.io/docs/learn/agentic-sdlc/

# Agentic SDLC: where agents fit across plan, build, review, verify and release, and who approves each step
**Agentic SDLC is the software development lifecycle run so that AI agents do the work inside each stage (plan, build, review, verify) and people make the decisions between stages. The unit that moves through it is a bet with success criteria written first. Work finishes when someone has checked the result, which can be well after the code merges.**
> ✓
> **Key takeaways**
> **An agentic SDLC has six stages:** plan, build, review, verify, release, learn. Agents run the work in each. People hold the decisions around it.
> **Only three decisions need a person:** which bets are worth shaping, the merge to main, and the final call on whether the bet worked. Everywhere else, “nobody, on purpose” is a valid answer if you can say why.
> **Write the success criteria before any work starts,** and check that your data can actually measure them. A criterion you cannot measure is a plan-stage failure, not a release-stage surprise.
> **The lifecycle ends with a verdict on the bet:** Won, Lost or Inconclusive.
> **Run this lifecycle on the bets that suit it** and keep the rest in Jira or Linear.

## The six stages, and who approves each one
![Six lifecycle stages with the agent’s job in each. A person approves only three: which bets to shape, the merge to main, and the final call on the bet.](/docs/learn/agentic-sdlc/agentic-sdlc-lifecycle-phone-640.png)
This table is the whole idea on one screen. It describes how the [Product delivery loop](/marketplace/product-delivery/) in Maskin runs a shaped bet, stage by stage.
| Stage | What the agent does | What a person approves | Evidence that closes the stage |
| --- | --- | --- | --- |
| Plan | Checks that the Won and Lost criteria can be measured with data you already collect, locks the spec, breaks the bet into tasks with an owner and a branch each | Which bets are worth shaping (decided before the stage starts) | A spec with measurable criteria and a task list with owners |
| Build | A developer agent writes the change for its task and opens a pull request | Nobody per task. The criteria were agreed at shaping | One pull request per task |
| Review | A reviewer agent checks each pull request against its task’s acceptance criteria and merges it into the bet’s branch | Nobody per pull request | Each change passes against the task it came from |
| Verify | One review across the whole bet once the last task has passed | Nobody at this stage | A whole-bet review, with every task’s change checked together |
| Release | A release check scores the risk of the bet’s pull request | A person approves the merge to main. Nothing deploys without it | A risk score and a named approval |
| Learn | Reads your product data and posts a Won, Lost or Inconclusive verdict, then reads customer and team feedback and posts a second one. Anything outside the bet’s scope goes back into discovery | The final call on the bet: succeeded, failed, paused or archived | Two verdicts on the bet and a human decision |
The third column is mostly “nobody” by design. Approval sits where being wrong is expensive or irreversible: before work starts, at the merge that deploys, and at the end when someone has to decide what the evidence means. Per-task and per-pull-request sign-off would bring the old bottleneck straight back, so the criteria agreed at shaping carry those stages.

## Where the old lifecycle breaks
In most delivery processes the ticket closes when the code merges. Nobody goes back to check whether the change did what the bet was supposed to do, and the next planning meeting starts from memory. Putting agents inside the old lifecycle makes that gap easier to hit: when changes are cheap to produce, the scarce thing is knowing whether a change was the right one.
That is why an agentic SDLC adds a stage the old model leaves out (learn), and moves a step to the front of the line (writing down what success means).

## Three rules that make it work

### 1. Write the success criteria first
Before a plan exists, the bet needs a Won condition and a Lost condition, and your existing data has to be able to tell the two apart. Here is an illustrative example, not a customer case:
- **Bet:** new accounts reach their first report faster.
- **Won:** median time from signup to first report is under 10 minutes for accounts created in the 30 days after release.
- **Lost:** the median is unchanged or worse over the same window.
If the product does not record when a first report is created, that is the thing to find out at the plan stage. In the Product delivery loop, Maskin runs this measurability check before any work starts and flags the criteria it cannot measure with the data you already collect. Finding the gap in week zero costs a conversation. Finding it after release costs the whole bet.

### 2. Name one approver per stage, including “nobody”
For each stage, write down who answers when it fails. Sometimes the answer is a named person, as with the merge to main. Sometimes it is “nobody, because the previous approval covers it”, as with a single task inside an already-approved bet. Every stage needs one of those two answers on paper. A stage with no answer is where a lifecycle quietly stops being a lifecycle.
If you want the longer argument for where a person adds value and where one only adds delay, [human in the loop AI](/docs/learn/human-in-the-loop-ai/) works through it.

### 3. Check the result after release
After the change is live, the loop reads your product data and posts a verdict on the bet: Won, Lost or Inconclusive. It then reads what customers and your own team said and posts a second verdict next to the first. Two sources matter because they answer different questions. The numbers tell you what happened. The feedback tells you whether it landed the way you meant it to.
Inconclusive is a legitimate result. A bet that cannot be called either way is information for the next bet, and it beats a ticket that closed with no verdict at all. Then a person makes the final call.

## How one loop runs the lifecycle end to end
The Product delivery loop compresses to six lines:
1. A shaped bet goes in. Maskin checks that its criteria are measurable and flags any that are not.
2. It locks the spec, splits the bet into tasks, gives each an owner and sets up the branch.
3. Each task goes to the agent that owns it. For code, a developer agent writes the change and opens a pull request.
4. A reviewer agent checks each pull request against its task and merges it into the bet’s branch. When the last task passes, one review runs across the whole bet.
5. A release check scores the risk. A person approves the merge to main.
6. After release, Maskin posts the product-data verdict, then the feedback verdict. You make the final call, and anything out of scope goes back into discovery as a new signal.
The input side of this, how a bet gets shaped in the first place, is the [Product discovery loop](/marketplace/product-discovery/). Pair the two and you have the full path from customer signal to checked result. If you want to see it run on one of your own bets, [book a meeting on the Product delivery listing](/marketplace/product-delivery/).

## Keep Jira or Linear where they fit
You do not have to move a whole team. Pick per bet. Run the loop on the bets that suit it, such as AI-heavy work or small teams with tight engineering time, and keep the rest in Jira or Linear. Both paths read from the same shaped bet and write the result back to the same place, so the verdict does not depend on which path a bet took.
Maskin works through your repository and your pull requests, so the history stays in your repo and on the bet. The Maskin Team ships Maskin through this loop.

## Where it sits next to orchestration
An agentic SDLC sits a level above orchestration. It says which decisions stay with people and what counts as done. How several agents hand work to each other is a different question, covered in [agent orchestration, agentic loops and control planes](/docs/learn/agent-orchestration/). Your engineers keep three jobs: deciding which bets are worth shaping, approving the merge to main and making the final call on every bet. The agents take the planning, building and review in between.

## FAQ

### What is agentic SDLC?
Agentic SDLC is a software development lifecycle where AI agents each own a step, such as planning, building, reviewing and checking the release, and people approve the decisions between steps. In Maskin the agents work from a shaped bet and its success criteria, and a person approves what reaches main.

### Who approves each step in an agentic SDLC?
Not every step needs an approver. In the Product delivery loop a person decides which bets are worth shaping, approves the merge to main, and makes the final call on the bet. The steps in between are run by agents and checked against the task’s acceptance criteria. Agents never close a bet themselves.

### How is an agentic SDLC different from the traditional SDLC?
The stages look similar. Three things differ. Success criteria are written and checked for measurability before work starts. Each change is reviewed by an agent against the task it came from. And the lifecycle ends with a verdict on the bet, read from product data and customer feedback, with the merged pull request as a midpoint.

### Is agentic SDLC the same as vibe coding?
No. Vibe coding is accepting what a model writes without a defined check. An agentic SDLC puts success criteria first, reviews every change against its task, and keeps a person on the merge to main and the final call. The difference is the loop around the code, not the model that writes it.

### Can anything reach production without a person?
No. A release check scores the risk of the bet’s pull request, and a person approves the merge to main. Nothing deploys without that approval. If a change fails review or the release check, it stops there and goes back to the task.

## Run the lifecycle on one bet
Pick one shaped bet, write its Won and Lost criteria, and let the loop take it from plan to verdict. [Book a meeting on the Product delivery listing](/marketplace/product-delivery/) to see it run on a real bet of yours, then decide how far to take it.
