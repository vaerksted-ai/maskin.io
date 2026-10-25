> Source: https://maskin.io/docs/mcp-tools-vs-resources/

# MCP tools vs resources vs prompts: which primitive to expose, and what Maskin’s server does with each
**Expose a tool when the model should decide to act or fetch. Expose a resource when the application or the person should decide what context to attach. Expose a prompt when a person should launch a repeatable workflow.** The MCP specification (revision 2026-07-28) splits them by who is in control: tools are “model-controlled”, resources “application-driven”, prompts “user-controlled”.
Maskin’s own MCP server is a worked example. It has dozens of tools, three resource templates used as a picker for deep links, and no prompts at all. The reasons are below, along with a decision rule you can apply to your own server.
> ✓
> **Key takeaways**
> **The difference is who decides.** Tools: the model. Resources: the application or the user. Prompts: the user. Everything else follows from that.
> **Start with tools.** Most servers need them first. Claude Code, VS Code and Cursor all document support for tools, resources and prompts, but through different interfaces, so resources and prompts only pay off where your target client has a picker or a slash menu.
> **A resource is not a cheaper tool.** It is a URI the host can list, attach and cache. If the model has to be the one to fetch it, write a tool.
> **Resource lists can differ per caller.** The spec lets a server vary the list by authorization, and Maskin’s does: what you see depends on workspace and key scope.
> **Maskin runs tools plus a resource picker, zero prompts.** Resources hold a summary and a link, not the body. The full body always comes from a tool.
**Want to try this on a server you control?** [Self-host Maskin](/docs/self-hosted-ai-workspace/?utm_source=maskin.io&utm_medium=organic&utm_campaign=mcp-tools-vs-resources&utm_content=early-cta) and connect any MCP client to see all three primitives in practice.

## The three primitives in one table
|  | Tool | Resource | Prompt |
| --- | --- | --- | --- |
| Who decides to use it | The model (spec: “model-controlled”) | The application or user (spec: “application-driven”) | The user (spec: “user-controlled”) |
| What it is | A function with an input schema that can have side effects | Data identified by a URI, read-only context | A named message template with arguments |
| Typical client surface | The model calls it mid-task, ideally with a confirmation | An @ mention, an Add Context menu or a browse panel | A slash command |
| Discovery calls | tools/list, tools/call | resources/list, resources/templates/list, resources/read | prompts/list, prompts/get |
| Can change the world | Yes | No | No |
| Use it for | Actions and on-demand lookups | Context a person picks or an app attaches | Repeatable workflows a person starts |
The “who decides” row is the one to memorize. The spec is careful to say this describes who triggers use, not who writes the content: a prompt’s text is still defined by the server.

## Tools: the default, and the one agents actually use
Tools are what a model reaches for on its own. The spec says “the language model can discover and invoke tools automatically”, and it adds that there “SHOULD always be a human in the loop with the ability to deny tool invocations”. Each tool has a name, a description and a JSON Schema for input, and can declare an output schema so results come back as structured content.
Two details from the spec change how you design them:
- **Errors are part of the contract.** Execution errors go back in the result with the error flag set, so the model can read them and retry. Protocol errors, such as an unknown tool, are the ones a model is unlikely to fix.
- **A tool can hand back a resource link.** The spec notes that links returned by a tool “are not guaranteed to appear in the results of a `resources/list` request”. So a tool can point at a URI without the server listing it anywhere.
If the model needs to read something mid-task, make it a tool. A read-only lookup is still a tool when the model is the one asking. That is why reads like “get this object” or “list these events” sit in Maskin’s [tool list](/docs/mcp-tools/) next to the writes. Whether you need MCP at all, or a plain API call is enough, is a separate question covered in [MCP vs API](/docs/mcp-vs-api/).

## Resources: context the application or the user picks
The spec describes resources as designed to be application-driven, “with host applications determining how to incorporate context”. Its examples are a tree or list view for explicit selection, search and filter, and automatic inclusion by heuristic. A server that supports them must declare the resources capability. It can also offer resource templates, which are parameterized URIs (RFC 6570), and subscriptions so the host hears when a watched resource changes.
What the spec does not promise is a model-facing way to use them. That depends on the client:
- **Claude Code:** type @ to see resources from connected servers next to files, or write `@server:protocol://resource/path`. Its docs say it “automatically provides tools to list and read MCP resources when servers support them”, so the model can reach them too. Entries with a `ui://` address or the MCP Apps media type are left out of the @ list.
- **VS Code:** attach one from Add Context, then MCP Resources, or run MCP: Browse Resources.
- **Cursor:** its docs list resources among the supported capabilities, alongside tools, prompts, roots and elicitation.
Checked against each client’s own documentation on 2026-10-25. Other clients vary, and a client can support a feature in the protocol without giving it a good interface, so test before you build around it.
Use a resource when the thing is a stable address a person might want to attach, cite or watch: a file, a schema, a record. Do not use one for anything the model must fetch with arguments it chooses, and do not treat it as a way to avoid writing a tool.

## Prompts: workflows a person launches
Prompts are templates the server publishes, with arguments, that the client turns into a message. The spec’s own example is a slash command. In Claude Code an MCP prompt shows up as `/servername:promptname`, and typing `/mcp__servername__promptname` also runs it. In VS Code you type `/server.prompt` in chat.
Use them when there is a repeatable job, such as “review this change” or “write the weekly summary”, and you want a person to start it with the right framing every time. If the job is something an agent should start by itself on a schedule or an event, a prompt is the wrong shape, because nothing in the model’s loop picks it.

## What Maskin’s server exposes, and why
This part is read from the server’s source and confirmed by the team that owns it, in October 2026.
- **Tools:** the main surface. Reading and writing objects, actors, triggers, sessions and files all go through tools. The count changes as the tool set is trimmed, so the [tools page](/docs/mcp-tools/) is the place to read the current list.
- **Resources: three templates.** One each for objects, actors and triggers. The addresses are the web app’s deep links, for example a workspace id followed by an object id. Listing returns live rows for the connection’s default workspace. Reading one returns a short summary: id, type, title, status, a short preview and the deep link. It does not return the full body.
- **App resources: ten `ui://` cards.** These are interactive views that render inside clients that support MCP Apps, tied to tools. Claude Code, as noted above, leaves them out of the @ list.
- **Prompts: none.** Nothing in the server registers one, so the prompts capability is not offered.
Three choices follow from that, and they generalize:
1. **Resources are a picker, not a data layer.** A summary that leaves out the body cannot replace a tool, and it is not meant to. Its job is to let a person drop a link to a specific object into a conversation.
2. **The picker is configuration-dependent.** The three templates only register when the server knows the web app’s base URL. A self-hosted setup without that setting lists none. Ship resources only if you can say what turns them on.
3. **Prompts matter for manual jobs.** Nothing here is started by a person typing a command: Maskin’s loops start from events and schedules, so a prompt would only matter for a manual job. If that changes, prompts become worth adding.

## How to choose: a four-question rule
Ask in this order and stop at the first yes:
1. **Does it change something, or does the model need it on demand with arguments?** Tool.
2. **Is it a stable address a person or the app would attach as context?** Resource, and make sure the client you care about has a surface for it.
3. **Is it a job a person starts, with a fixed shape?** Prompt.
4. **None of these?** Put it in the tool description or your docs and expose nothing.
A fast way to find mistakes: if you built a resource that the model cannot reach in the clients you target, it is dead weight. If you built a tool that never takes an argument and always returns the same document, it may want to be a resource or a prompt.

## FAQ

### What is the difference between an MCP tool and an MCP resource?
A tool is a function the model can call, possibly with side effects. A resource is data at a URI that the application or user chooses to attach as context. The spec calls tools model-controlled and resources application-driven. If the model must decide to fetch something with its own arguments, that is a tool.

### When should I use an MCP resource instead of a tool?
Use a resource for stable, addressable content that a person or the host app picks as context, such as a file, a schema or a record. Use a tool for anything the model must request on demand, anything with arguments, and anything that changes state. When in doubt, ship the tool first.

### Do MCP clients support resources and prompts?
Many do, with different interfaces. Claude Code exposes resources through @ mentions and prompts as slash commands. VS Code has an Add Context menu for resources and slash commands for prompts. Cursor lists tools, prompts, resources, roots and elicitation as supported. Test in your target client before relying on either.

### Are MCP prompts the same as system prompts?
No. An MCP prompt is a named template a server publishes with arguments, and a person picks it, usually from a slash menu. It produces a message. A system prompt is instructions set by the application for the whole session. A server cannot rely on its prompts being used unless the person invokes them.

### Can a tool return a resource?
Yes. A tool can return a resource link or embed the resource contents in its result. The spec says links returned this way are not guaranteed to appear in the server’s resource list, so they work as pointers, not as a catalogue.

### Does Maskin’s MCP server expose resources and prompts?
Resources, yes: three templates for objects, actors and triggers, plus ten interactive app cards. The template listing only appears when the server has a web app address configured, so a self-hosted setup without one lists none. Prompts, no: the server registers none, so the prompts capability is not offered.
Where to go next

## Want an agent workspace you can connect any MCP client to?
Self-host Maskin and point your harness at it.
