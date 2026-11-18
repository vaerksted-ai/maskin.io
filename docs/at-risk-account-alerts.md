> Source: https://maskin.io/docs/at-risk-account-alerts/

# At-risk account alerts: when churn signals become bets, not dashboard noise
**At-risk account alerts turn the early signals of churn (dropping usage plus rising error rates) into a shaped bet to save the account, fired with full context instead of a bare dashboard notification.** The loop replaces a wall of alerts you scroll past with one at-risk alert you can act on, because the signal has already become a bet.
> ✓
> **Key takeaways**
> The churn & expansion loop is usage-drop + error-spike → bet → at-risk alert with full context.
> Signals stay as dashboard noise until they become a bet; the bet is what makes them actionable.
> The point of an at-risk alert is not to fire more loudly. It is to carry full context and a prepared recovery bet.
> The loop is one of Maskin’s five [marketplace loops](/marketplace/), alongside the customer feedback loop ([product discovery](/marketplace/product-discovery/)).
> Agents run detection and triage; humans keep the decision on the recovery bet.

## What at-risk account alerts are
The direct answer: an at-risk account alert is a notification that an account is on a path to churn, produced automatically from a falling success signal and a rising problem signal, and delivered with enough context that a human can act immediately. The two signals a churn & expansion loop watches are usage (is the account using less than it was?) and errors (is the product failing them?). When both move the wrong way at once, that is not noise, it is a leading indicator.
The failure it fixes is familiar: every product generates a steady stream of dashboards and alerts, and every account team learns to ignore most of them. The volume is why churn signals are usually noticed late, when the account is already reducing seats or has decided to leave. At-risk alerts in this loop win by converting the signal into a [bet](/docs/bet-based-product-planning/) (a bounded plan to recover the account) so the alert is not a blinking light but a prepared action.

## The churn & expansion loop: signal, then action
**Usage drops.** The account’s engagement declines over a period: fewer logins, fewer active seats, declining feature use. Alone, a dip can be seasonal or transient, which is why it rarely triggers a useful alert on its own.
**Errors spike.** At the same time, the account hits a rising rate of product failures. The combination is the signal that matters: an account that is using your product less because it keeps failing them is an account considering leaving. One moving wrong is a flag; both moving wrong at once is an at-risk pattern.
**It becomes a bet.** Instead of logging an alert into another dashboard, the loop shapes the signal into a churn-recovery bet: a time-bounded action with a win condition, such as re-engaging the account within a cycle. Now the churn risk has an owner, a time-box, and a measurable end state, which is the property that separates a bet from a dashboard row.
**An at-risk alert fires with full context.** The alert reaches the right person with everything they need (the usage trajectory, the error spike, the accounts and contacts involved, and the shaped recovery bet) rather than a bare “account at risk” ping that forces them to go hunting for context.
The loop closes when the bet is validated: if the account re-engages, the bet succeeded and the learning feeds the next detection; if it does not, the bet failed honestly and the loop records why. The account either stops churning or the team gets a clear, evidence-backed reason it did not. That is the [closed-loop workspace](/docs/closed-loop-workspace/) pattern applied to the customer side of the business.

## Signals become bets, not dashboard noise
The core claim for anyone running enterprise accounts: all the churn signals you already collect stay as noise until they become a bet. A dashboard warning is a fact you must interpret. A bet is a decision: “here is the account, here is why it is at risk, here is the bounded action we are taking to keep it, here is what winning looks like.” Triage and recovery preparation happen before the alert, not after, which is exactly what makes the alert actionable in the seconds it takes to read it.
Dashboard noise is also a governance problem. Standard practice leaves detection and judgement to whoever happens to look; a loop makes the alert a machine-readable object with a driver, so a named owner is accountable for the recovery bet. The principle generalises beyond churn. An at-risk alert that is a bet is work with a closure condition; an at-risk alert that is a row in a dashboard is just another prompt for a busy human. The [agentic workflow vs the closed loop](/docs/learn/agentic-workflow-vs-closed-loop/) comparison covers why that closure condition is the difference.

## Why full context is the point of the alert
An alert that says “account at risk” costs you your scarcest resource twice: first the attention to read it, then the time to gather context before you can act. The at-risk alert in this loop is built so the context arrives with the signal. It carries the usage drop over time, the error spike and what it correlates with, the contacts and accounts involved, and the shaped recovery bet with its win condition.
Delivering that context is possible because the loop runs on a unified object model. The account, the usage signal, the error signal, and the bet are typed objects connected by relationships (see the [architecture](/docs/architecture/) page), so the alert can assemble them rather than stringing together text from four screens. Human judgement is still required (whether the recovery bet is the right one and whether to commit resources) but it is judgement applied to a prepared decision, not detective work.

## The honest limits of churn prediction
No alert predicts churn perfectly, and the loop is honest about that. A usage drop plus an error spike is a strong leading indicator, but it is a heuristic, not a guarantee: accounts dip in usage for benign reasons, and error spikes are sometimes one-off incidents. The loop reduces false urgency by requiring the combination rather than a single spiking metric, but a human still judges each bet.
Where the model genuinely earns its place is process, not prophecy. It standardises detection so nothing slips silently, it converts every signal into a bounded bet so nothing sits as an unowned warning, and it records the outcome so the loop learns which recovering actions actually work. The durable edge is not predicting churn with certainty (nobody can) but making the at-risk moment a decision with a plan.

## FAQ

### What is an at-risk account alert?
An at-risk account alert is a notification that an account is heading toward churn, generated automatically from a declining usage signal combined with a rising error signal, and delivered with full context so a human can act immediately. It is the output of the churn & expansion loop: usage-drop + error-spike → a shaped recovery bet → an at-risk alert that carries the context and the plan with it.

### Which signals should I watch for at-risk accounts?
Watch two moving together: usage declining (fewer logins, seats, or key feature use) and errors rising. One moving wrong is a flag you can reasonably wait on; both moving wrong at once is an at-risk pattern because an account using less because the product is failing them is an account considering leaving. The combination filters out the benign one-off dips that make single-metric alerts useless.

### How is this different from a churn dashboard or alert tool?
The differentiator is that the signal becomes a bet, not a row in a dashboard. A churn dashboard tells you what happened and lets you decide what to do; an at-risk alert here arrives as a prepared decision: the account, the evidence, the contacts, and a shaped recovery bet with a win condition. Dashboard noise still needs interpretation; a [bet](/docs/bet-vs-backlog/) is already a bounded action with an owner, which is what makes the alert actionable.

### Do I still need a human, or can it run fully automatically?
A human keeps the judgement calls. An agent runs the mechanical part (detecting the combined signal, assembling context, and triaging the alert) but a person decides whether the recovery bet is right and commits the resources to it. Full automation without a human gate risks shipping bad recovery actions. The loop shortens the path to a good human decision; it does not remove the decision. See [human in the loop](/docs/learn/human-in-the-loop/).

### Can the same loop handle expansion, not just churn?
Yes. The churn & expansion loop runs both directions. At-risk detection keeps accounts from leaving, and the same model surfaces expansion opportunity when healthy usage rises and adoption grows: instead of waiting for at-risk signals, the loop can shape an expansion bet for accounts that are clearly getting value. The mechanism is identical (a signal becomes a shaped bet with a win condition); only the direction of the outcome differs.
Read next

## Make churn a decision, not a surprise
You already have the usage and error data. The question is whether it reaches you as a blinking dashboard or as a prepared bet you can act on in the seconds it takes to read it. Stand the churn & expansion loop up on Maskin, where signals become bets with full context and human taste gates. [Self-host free](https://maskin.io/), or run a hosted trial for a team, and get the next at-risk account alert as a plan, not a ping.
