> Source: https://maskin.io/docs/mcp-tools/

# MCP tools reference
Maskin is MCP-native: the entire workspace is driven through MCP tools, the same surface humans' agents and your Claude client use. This page groups the tools by domain.
> This is a guided overview. The live, authoritative list comes from your instance — ask Claude to run `list_tools`. The set has grown over time, so your instance may expose more than is listed here.

## Connecting
The MCP endpoint is served over HTTP at `POST /mcp` and authenticates with two headers:
```
Authorization: Bearer <YOUR_MASKIN_API_KEY>   # ank_…
X-Workspace-Id: <YOUR_WORKSPACE_ID>           # workspace UUID
```
See [Self-hosted setup](/docs/get-started/self-hosted/) for the full `claude mcp add` command and the Claude Desktop config.

## Onboarding
| Tool | What it does |
| --- | --- |
| get_started | Apply a workspace template (development / growth / custom) with seed objects, agents, and triggers. Two-phase: call to preview + get tailoring questions, then call again with confirm: true to apply. |

## Objects
| Tool | What it does |
| --- | --- |
| create_objects | Create insights, bets, and tasks (with relationships and attachments) in one atomic call. |
| get_objects | Fetch objects with relationships, connected objects, recent activity, and files. |
| update_objects | Update fields (title, content, status, metadata) and create relationships. |
| delete_object | Delete an object by ID. |
| list_objects | List objects filtered by type, status, or driver; paginated. |
| search_objects | Full-text search over title and content with optional filters. |

## Relationships
| Tool | What it does |
| --- | --- |
| list_relationships | Query relationships for an object, by direction or type. |
| delete_relationship | Delete a relationship by ID. |

## Workspace schema & settings
| Tool | What it does |
| --- | --- |
| get_workspace_schema | Discover statuses per type, custom field definitions, relationship types, and rendering rules. |
| create_workspace_field · update_workspace_field · delete_workspace_field | Manage custom metadata fields on an object type. |
| create_workspace · update_workspace · list_workspaces | Create, rename/configure, and list workspaces. |
| create_extension · update_extension · delete_extension · list_extensions | Enable registered modules or define custom object types. |

## Actors
| Tool | What it does |
| --- | --- |
| create_actor | Create a human or agent actor and optionally add to a workspace with a role. |
| get_actor · list_actors | Fetch or list actors in the workspace. |
| update_actor | Update name, description, system prompt, tools config, memory, LLM provider, or attached skills. |

## Comments & activity
| Tool | What it does |
| --- | --- |
| create_comment | Post a comment (status update, question, finding). @-mentioning an agent spawns a session; supports attachments and decision chips. |
| get_comments | Fetch comments on an object, including replies and attachments. |
| get_events | Read the workspace activity log, filtered by entity type and action. |

## Files
| Tool | What it does |
| --- | --- |
| create_file | Author a file (markdown, code, PDF, image) and store it; returns a shareable URL. |
| get_file · list_files · update_file · delete_file | Read, list, rename, and delete files. |

## Skills & triggers
| Tool | What it does |
| --- | --- |
| create_workspace_skill · list_workspace_skills · get_workspace_skill · update_workspace_skill · delete_workspace_skill | Manage reusable skills (prompts, snippets, context) attachable to agents. |
| create_trigger · update_trigger · delete_trigger · list_triggers | Manage cron and event triggers that spawn agent sessions. |

## Sessions
| Tool | What it does |
| --- | --- |
| create_session | Spawn a containerized agent session with an action prompt (non-blocking). |
| run_agent | Blocking: spawn a session, poll until completion, and return the result with logs. |
| get_session · list_sessions | Fetch status/logs or list sessions. |
| stop_session · pause_session · resume_session | Terminate, snapshot, or resume a session. |

## Notifications & subscriptions
| Tool | What it does |
| --- | --- |
| create_notification · list_notifications · get_notification · update_notification · delete_notification | Raise and manage structured human-input requests. |
| subscribe · unsubscribe · list_subscribers · mark_read · list_unread | Track per-actor subscriptions and unread activity on objects. |

## Integrations & LLM keys
| Tool | What it does |
| --- | --- |
| list_integrations · list_integration_providers · connect_integration · disconnect_integration | List, connect (OAuth), and disconnect integrations. See Integrations setup. |
| set_llm_api_key · get_llm_api_keys · delete_llm_api_key | Manage workspace LLM provider keys (stored encrypted; never returned in full). |
| import_claude_subscription · get_claude_subscription_status · disconnect_claude_subscription | Use a Claude Pro/Max/Teams subscription for agent runs. |
