> Source: https://maskin.io/docs/mcp-tools/

# MCP tools in Maskin: verbs, object types, and the typed workspace graph
MCP tools are the callable operations a Model Context Protocol server exposes to AI agents, each one a verb with a typed input schema, such as `create_objects` or `get_objects`. Maskin's MCP server exposes around 65 of them. This reference groups the verbs by cluster and documents two core object types they operate on: `knowledge` and `loop`.
> ✓
> **Key takeaways**
> MCP tools are verbs; object types are nouns. A tool call names both — the tool declares the operation, the type declares the shape being written or read.
> Maskin's MCP server exposes ~65 tools across eight clusters: object operations, relationship operations, schema and discovery, triggers and loops, comments/events/actors, files and integrations, extensions/sessions/fields/skills, and conversations/inbox/workspace setup.
> Edges have three write paths: `create_objects` and `update_objects` take an `edges` parameter for object-to-object links, and `create_relationship` writes one edge at a time between objects or files.
> Conversations (chats with participants) and comments (events on an object) are different channels with different length limits: 8,000 characters for a conversation message, 2,000 for a comment.
> Object types (`insight`, `bet`, `task`, `knowledge`, `loop`, `content`, plus custom types) are workspace-configurable — call `get_workspace_schema` to see the live list, valid statuses, and metadata fields.
> `knowledge` is the durable, curated reference layer: statused `draft → validated → deprecated`, carrying `summary`, `doc_type`, `confidence`, and a review cadence.
> `loop` is a named, iterative multi-agent process that wraps triggers + agents around a pipeline of object states — objects of any type flow through it via the `in_loop` edge. Loops are created with `create_loop`, not `create_objects`.

## The MCP tools Maskin exposes
Maskin's MCP server surfaces its verbs under the `mcp__maskin__` namespace. Each tool has a JSONSchema-defined parameter shape and validates its input server-side; type-specific validity (statuses, required fields, enum values) is enforced on the write path against `settings.statuses.<type>` and workspace-configured field schemas.
Coding agents are MCP clients too. On [the open-source AI coding agent shortlist](/alternatives/open-source-ai-coding-agent/), Cline is MCP-native and Goose builds its tool use on MCP, so either can call the verbs below.
The eight clusters are:
- Object operations — create, read, update, delete typed rows in the graph.
- Relationship operations — write, enumerate, traverse, and delete edges.
- Schema and discovery — inspect live type, status, and field configuration.
- Triggers and loops — steps and processes that wire agents to object state.
- Comments, events, actors — the agent-to-human channel and event timeline.
- Files and integrations — raw blob storage plus provider wiring.
- Extensions, sessions, workspace fields, skills — workspace customisation.
- Conversations, inbox, workspace setup — chats and the unread feed.
**Object operations.**
- `create_objects` — create one or more typed objects in a single call. It takes a required `workspace_id` and a `nodes` array of up to 50 objects, each with a `$id` (a temporary id you choose), a `type` and a `status`. It validates `type`, `status`, and `metadata` against the workspace schema and rejects the call with a field-level error if any value is out of range. Loops are the exception: they go through `create_loop`.
- `get_objects` — fetch by id with opt-in blocks (`content`, `metadata`, `relationships`, `connected_objects`, `events`, `files`); returns an always-on `setup` block with readiness checks.
- `update_objects` — patch `title`, `content`, `status`, `metadata`, or `driver`; the same call can create relationships through its `edges` parameter, so single-call "update fields + link" flows are the norm.
- `delete_object` — remove an object along with its edges; use archival status where lineage matters.
- `list_objects` / `search_objects` — enumerate by type/status or search title + content with `metadata_eq` filters; both are paginated.
**Relationship operations.**
- `create_relationship` — write one directed, typed edge. Parameters: `source_id`, `target_id`, `type`, and an optional `workspace_id`. Each endpoint can be an object or a file; the server works out which from the id, so you never pass a kind. Calling it twice with the same source, target and type succeeds both times and stores one edge. If either id is not an object or file in the workspace, the call fails with a 404 that lists the ids it could not resolve. Conversation and session endpoints cannot be written through this tool.
- `list_relationships` — direction-agnostic (`object_id`) or directional (`source_id` / `target_id`) enumeration; use direction-agnostic mode when you want every edge on an object regardless of orientation.
- `traverse_graph` — bounded multi-hop breadth-first traversal from a start object; useful for resolving `supersedes` / `contradicts` chains, walking `breaks_into` hierarchies, or pulling multi-hop context in one call.
- `delete_relationship` — remove a single edge by its edge id (`id`, plus optional `workspace_id`); works for edges with file endpoints too, and the objects on either end stay.
**Which tool writes which edge.**
- New objects plus their edges in one go: `create_objects` with its `edges` parameter. One atomic call creates up to 50 objects, and edges can point at new objects by their temporary `$id` or at existing objects by uuid. Object endpoints only.
- An edge between two existing objects: `update_objects` with `edges` (no object change needed), or `create_relationship` for a single edge.
- Any edge with a file at one end, added after the fact: `create_relationship`. Example: to attach an uploaded file to a bet, set `source_id` to the bet, `target_id` to the file, and `type` to `attached`.
- Removing an edge: `delete_relationship`.
The `type` string is not an enum on the tool. The five built-in types are `informs`, `breaks_into`, `blocks`, `relates_to` and `duplicates`; extensions and modules add more (`attached`, `in_loop`, `supersedes`, `contradicts`, `about`, and so on), and workspaces can declare their own. Read the live list from the `relationship_types` field of `get_workspace_schema` instead of hardcoding it.
**Schema and discovery.**
- `get_workspace_schema` — the single source of truth for object types, their custom metadata fields, valid statuses per type, and configured relationship types. Call this before hardcoding any enum against product defaults; workspaces override or extend defaults through the extension system.
- `list_workspaces` — enumerate the workspaces the caller belongs to; this is where the `workspace_id` that most write tools require comes from.
**Triggers and loops.**
- `create_trigger` / `update_trigger` / `delete_trigger` / `list_triggers` — a trigger is a step: it fires a named agent when an object matches an event predicate (`created`, `status_changed`, `commented`, ...) or on a cron schedule.
- `create_loop` / `get_loop` / `update_loop` / `delete_loop` / `list_loops` — a loop wraps a set of triggers + agents around a pipeline of object states; objects join it via the `in_loop` edge, `entry_condition` and `close_condition` are plain-language prose describing that pipeline, and `closed_statuses` is the done-marker the read path actually uses. `create_loop` is the only way to create a loop; `create_objects` does not wire a loop's trigger and membership metadata.
- `run_agent` — invoke an agent directly on an object, outside the trigger fabric; typically used for one-off tasks a human kicks off.
**Comments, events, actors.**
- `create_comment` / `get_comments` — post comments on any object; comments carry `@mentions`, an `attention` score, an optional structured `decision` payload, and a `metadata.tasks` array that renders a live checklist. This is the primary agent-to-human channel.
- `get_events` — timeline of lifecycle changes and comments on an object.
- `list_actors` / `get_actor` / `create_actor` / `update_actor` — humans and agents that own or drive objects; each actor has a short description and, for agents, a system prompt that is the source of truth for their instructions (the role-level counterpart of [AGENTS.md and CLAUDE.md](/docs/claude-md-vs-agents-md/) files in a repo).
**Files and integrations.**
- `create_file` / `get_file` / `update_file` / `list_files` / `delete_file` — raw blobs addressed by id and attached to objects or comments. Different from typed `knowledge`: files are opaque bytes, `knowledge` is a first-class typed row in the graph.
- `list_integration_providers` / `list_integrations` / `connect_integration` / `disconnect_integration` — provider wiring; the provider registry is what the workspace can talk to. The supported providers, their auth types, and which of them expose MCP tools to agents are listed on the [integrations page](/docs/integrations/).
**Extensions, sessions, workspace fields, skills.**
- `create_extension` / `update_extension` / `delete_extension` / `list_extensions` — extensions declare custom object types, custom metadata fields, and workspace-specific relationship types.
- `create_session` / `get_session` / `stop_session` / `pause_session` / `resume_session` / `list_sessions` — agent runtime sessions; the object that captures a specific agent invocation and its transcript.
- `create_workspace_field` / `update_workspace_field` / `delete_workspace_field` — declare custom metadata fields per object type at the workspace level.
- `create_workspace_skill` / `get_workspace_skill` / `list_workspace_skills` / `update_workspace_skill` / `delete_workspace_skill` — workspace-scoped skill packs that agents can invoke; the recipe layer above the raw MCP verbs.
**Conversations, inbox, workspace setup.**
A conversation is a chat between people and agents. It is not attached to any object, which is what separates it from a comment.
- **Conversation message:** up to 8,000 characters, sent to a list of participants. Each participant has their own read position, tracked by message id. Mentioning a workspace agent in a message adds it to the chat.
- **Comment:** up to 2,000 characters, posted on an object. Supports threads, `@mentions`, an `attention` score and a `decision` card, and is what reaches a human's For You feed.
To talk to a human about an object, use `create_comment`. To leave a note inside a chat you are already part of, use `post_conversation_message`.
- `get_conversation` — takes `conversation_id`. Returns the conversation, your own state in it (pinned, archived, unread count, last read message id), and the active participants with name, type and who added them.
- `list_conversation_messages` — takes `conversation_id`, optional `before_id` / `after_id` message ids, and a `limit` of 1 to 200 (default 50). Returns messages newest first with a has-more flag. Paging is by message id, not by time, and reading does not move your read position.
- `post_conversation_message` — takes `conversation_id`, `content` (1 to 8,000 characters) and optional `metadata`: up to 10 attachments, up to 50 mentions, plus context objects. It is not idempotent, so a retry posts a second message.
The conversation tools are mostly useful inside chat sessions.
- `list_unread` — a page of objects with unread activity for the caller (`limit` 1 to 100, default 25, plus a `cursor`). Each row carries the unread count, mention count, highest attention score, latest event id and the latest mention. It covers objects only (not conversations) and shows only the caller's own feed.
- `mark_read` — takes `entity_type` (`object`), `entity_id` and `last_event_id`, the latest event id you have seen, as returned by `list_unread`. The stored read position only ever moves forward. There is no tool to mark something unread again.
- `get_started` — orientation for a fresh workspace. With no `loop_id` it lists the marketplace loops you can install; with a `loop_id` and `confirm` it optionally renames the workspace and installs that loop. It returns plain text and is a setup step, not part of everyday work.
- `create_workspace` — takes a `name` and optional `settings`, and has no `workspace_id`. The caller becomes owner.
- `update_workspace` — takes the workspace `id`, a `name` and `settings`. Settings are merged into the existing ones.
A full call names both a verb and a type: e.g. `create_objects` with a node of `type: "knowledge"` and a `metadata` payload validated against the `knowledge` schema. The next section documents two of the object types those tools operate on in depth.

## Object types the tools operate on
Every MCP tool call reads or writes objects of a declared type. `get_workspace_schema` returns the full list of types for a workspace — built-ins (`insight`, `bet`, `task`, `knowledge`, `loop`, `content`, `actor`) plus custom types declared through the extension system. This reference documents two core types in depth: `knowledge` (the durable reference layer) and `loop` (the iterative process container).

### `knowledge`
**What it is.** A durable, curated, human-readable reference page — the layer that outlives the work that produced it. Where an `insight` is one atomic piece of evidence and a `bet` is a time-boxed outcome, `knowledge` is the settled record: what we know, at what confidence, as of when.
**Not the same as a File.** `create_file` stores raw blobs in object storage, addressed by id and attached to objects or comments. `knowledge` is structured, typed, statused, and first-class in the graph — it has a driver, relationships, and comments. The workspace wiki renders `knowledge` objects for humans; it is not a separate store.
**Status lifecycle (default):** `draft → validated → deprecated`.
- `draft` — authored, not yet reviewed.
- `validated` — reviewed and true as of `last_validated_at`; the state a page should reach before downstream consumers rely on it.
- `deprecated` — superseded or no longer true; kept for lineage, not deleted.
Progression is convention, not enforcement: any status is settable through the API. Agents and human curators maintain the ladder. Per-type status validity is workspace-configurable via `settings.statuses.knowledge` and readable at runtime with `get_workspace_schema`.
**Custom metadata fields.**
- `summary` (required) — one-line abstract.
- `doc_type` — one of `topic_page`, `playbook`, `operational`, `profile`, `changelog`, `reference`, `note`.
- `provenance` — where the content came from (session id, distilled bet, external source).
- `last_validated_at` (date) — when the page was last reviewed and confirmed true.
- `review_by` (date) — when the page should be re-reviewed.
- `confidence` — `low` / `medium` / `high`.
- `tags` — free-form.
**Worked `create_objects` call.** Minimal payload to open a `knowledge` page in `draft` with the required `summary` and the two most-consulted optional fields (`doc_type`, `confidence`). `workspace_id` is required; get it from `list_workspaces`. Each node needs a `$id` (any temporary string, used only to reference the node in `edges`), a `type` and a `status`:
```
{
  "workspace_id": "<workspace id from list_workspaces>",
  "nodes": [
    {
      "$id": "k1",
      "type": "knowledge",
      "title": "Enterprise buyer decision criteria",
      "status": "draft",
      "content": "Enterprise buyers rank audit surface, integration effort, and identity model above headline price. Source: 18 discovery calls, Q1 2026.",
      "metadata": {
        "summary": "Enterprise buyers weight audit, integration, and identity above price — distilled from 18 Q1 2026 discovery calls.",
        "doc_type": "topic_page",
        "confidence": "high",
        "last_validated_at": "2026-03-15"
      }
    }
  ]
}
```
The server validates `status` against `settings.statuses.knowledge`, `doc_type` and `confidence` against their configured enums, and rejects the call with a field-level error if any value is out of range. To link the new page to existing objects in the same call, add an `edges` array whose entries use `source` and `target` (the node's `$id` or an existing object's uuid) plus a `type`.
**Relationships.** Extension-declared: `supersedes` (this page replaces an entire past frame), `contradicts` (this page conflicts with another), `about` (this page is about a subject or entity). General edges also apply: `informs`, `relates_to`, `breaks_into`, `blocks`, `duplicates`.
**How it relates to `insight` / `bet` / `task`.**
- `insight` → `knowledge`: atomic evidence clusters and settles into a reference page; the page `informs` downstream bets.
- `bet` → `knowledge`: a bet's verdict (`succeeded` / `failed`) is raw material for a durable learning — the bet outcome is recorded, the page outlives it.
- `task` → `knowledge`: rarely direct; tasks produce artefacts, and artefacts (or the bet they served) get distilled into knowledge.
- `knowledge` ↔ `knowledge`: `supersedes` / `contradicts` keep the record honest when a fact is replaced or conflicts. Supersede and keep the lineage; do not delete-and-recreate.

### `loop`
**What it is.** A named, iterative multi-agent process. A loop wraps **triggers (steps) + agents + a pipeline of object states**: a step and a trigger are the same thing — each step fires an agent when an object changes state (`created`, `status_changed`, ...) or on a cron schedule. A loop is the process *container*; the objects it acts on are members flowing through it.
**Custom metadata fields.**
- `entry_condition` — plain-language prose describing what enters the loop; descriptive only, never runtime-evaluated.
- `close_condition` — plain-language prose describing when a member is done; descriptive only, never runtime-evaluated. The prose closes nothing — a member closes when its own status reaches a terminal status for its type.
- `closed_statuses` — the real done-marker: which statuses count as "done," per object type, used by the read path to derive `closedCount`. Set with `create_loop` and edited via `update_loop`.
- `installed_from_marketplace_loop_id` — set when the loop was installed from a marketplace template.
**Status lifecycle — workspace-configurable graduated-trust ladder.** A loop moves up a ladder as it earns trust, and can be paused from any rung. The valid set is workspace-configured (`settings.statuses.loop`) and enforced by the server on every write. The ladder `create_loop` documents is:
```
draft  →  pilot  →  supervised  →  live
          (paused reachable from any rung; archived retires the loop)
```
- `draft` — set up, not live; nothing fires for real.
- `pilot` — the first rung of trust above draft.
- `supervised` — the loop runs on its own, but material calls pass a human gate.
- `live` — runs end-to-end; a human samples outputs and steps in when members stall or go off-track.
- `paused` — reachable from **any** rung; disables every trigger the loop references until resumed.
- `archived` — terminal retirement for a loop no longer in service.
Workspaces may configure additional rungs and terminal states. **Read the actual set for your workspace at runtime with `get_workspace_schema`** — do not assume a concrete ladder from this reference.
Two mechanics worth knowing:
1. **Validity is enforced per workspace on the write path.** `create_loop`, `update_loop`, `create_objects`, `update_objects`, and the bulk-update path each validate an incoming `status` against `settings.statuses.<type>`, so a workspace on a different ladder simply enforces that ladder.
2. **Reading the ladder.** Call `get_workspace_schema` and inspect `settings.statuses.loop`. Do not hardcode a status list against the product default.
**Worked `create_loop` call.** Loops are created with `create_loop`, not `create_objects`. Minimal payload to stand up a `supervised` product-discovery loop that ingests `insight` objects and closes members once they reach a scored or discarded state (or, for bets it spawns, a succeeded or failed state). `workspace_id` and `name` are required; get the workspace id from `list_workspaces`. The status values in `closed_statuses` are checked against your workspace schema, so use the statuses your workspace actually defines for each type:
```
{
  "workspace_id": "<workspace id from list_workspaces>",
  "name": "Product discovery loop",
  "status": "supervised",
  "content": "Takes new insights, clusters and scores them, and spawns bets from the strongest clusters.",
  "entry_condition": "new insight objects are added to the loop",
  "close_condition": "a member is done once its status reaches one listed in closed_statuses for its type",
  "closed_statuses": {
    "insight": ["scored", "discarded"],
    "bet": ["succeeded", "failed"]
  }
}
```
This call stands up the loop container, its descriptive entry/close prose, and its per-type `closed_statuses`. Steps can be authored inline in the same call through the `steps` parameter (each step names an agent, a prompt, and a `when` of either a cron schedule or an object type plus action), or attached later from existing triggers with `trigger_ids`. Existing objects can join at creation through `object_ids`, each becoming an `in_loop` edge.
**Relationships.** Loop membership is the `in_loop` edge from the loop to the object. This is the loop↔work relationship; it is not one of the semantic edges (`informs`, `blocks`, etc.). Loop steps are triggers (`create_trigger` / `update_trigger`); a step authored inline on a loop becomes a trigger attached to it. General edges (`relates_to`, `blocks`, ...) apply as usual.
**How it relates to `insight` / `bet` / `task`.** Membership, not a peer relationship. Objects of *any* type — `insight`, `bet`, `task`, or a custom type — flow through a loop via `in_loop` (the explicit membership edge — nothing is inducted by the prose conditions). A member closes when its own status reaches a terminal status for its type; the read path derives `inProgressCount` / `closedCount` / `medianTimeToCloseMs` from the `in_loop` edge plus that status. The prose `entry_condition` / `close_condition` describe intent; they gate and close nothing at runtime. So a loop is the process *around* the work, not another kind of work: e.g. a Product-Discovery loop takes `insight` objects in at `new`, moves them through `clustered` and `scored`, and produces `bet` objects; a delivery loop takes `task` objects from `todo` to `done`. The loop's trust rung governs how much of that runs without a human gate.

## FAQ

### What are MCP tools?
MCP tools are the callable operations a Model Context Protocol server exposes to AI agents and clients — each one a verb with a typed JSONSchema-defined input and a documented output. A tool call names both the verb and the shape it operates on: e.g. `create_objects` with a node of `type: "knowledge"`. Maskin's MCP server exposes around 65 tools across eight clusters: object operations, relationship operations, schema and discovery, triggers and loops, comments/events/actors, files and integrations, extensions/sessions/fields/skills, and conversations/inbox/workspace setup. Every read or write against the workspace graph flows through one of them.

### What is the difference between MCP tools and MCP resources?
Tools are verbs — write-path actions with side effects. Resources are read-only URIs a server exposes for context lookup without invoking an action. In Maskin, first-class typed rows (`knowledge`, `loop`, `insight`, `bet`, `task`, and custom types) are operated on by tools like `create_objects` and `update_objects`; opaque blobs (uploads, generated files, screenshots) are stored via `create_file` and attached to objects. Prefer a typed `knowledge` object when the content is human-readable reference material; prefer a file when it is a raw artifact.

### How do I list all MCP tools?
MCP clients (Claude, Claude Code, Cursor, ChatGPT, VS Code) surface the full manifest under the connected server — every tool has a name, description, and JSONSchema parameter shape. Programmatically, an MCP client discovers tools by calling `tools/list` on the server; the response is the source of truth for what is callable, and Maskin adds tools without breaking older ones. For a functional view of Maskin's tools, see the eight clusters above (object operations, relationship operations, schema and discovery, triggers and loops, comments/events/actors, files and integrations, extensions/sessions/fields/skills, and conversations/inbox/workspace setup).

### How do MCP tools relate to Maskin's object types?
MCP tools are verbs; object types are nouns. The tool declares the operation (`create`, `update`, `list`, `search`); the type declares the shape being operated on. A single call names both — e.g. `create_objects` with a node of `type: "knowledge"` and a valid `metadata` payload for that type (loops are the exception and go through `create_loop`). Type-specific validity (statuses, required fields, enum values) is enforced server-side on the write path against the workspace schema. Discover the type set with `get_workspace_schema`.

### Can I create custom MCP tools in Maskin?
The MCP tool surface itself is server-defined and workspace-agnostic — you do not add new verbs per workspace. What you can customise is what those verbs operate on. Object types, their custom metadata fields, valid statuses per type, and relationship types are workspace-configurable through the extension system (`create_extension`, `create_workspace_field`). Once configured, a custom `stakeholder` or `experiment` type behaves identically to a built-in: the same `create_objects`, `get_objects`, `update_objects` verbs apply, and `get_workspace_schema` reflects the live configuration.

## Drive the workspace over the wire
Every Maskin object, relationship, trigger, and loop is reachable through the MCP server. Open source under Apache 2.0. Self-host free, bring your own model.
