# The agent workspace

`AgentWorkspace` is the agent family: one complete AI chat surface — history
sidebar, header with the animated avatar, the reply thread with its run inline,
and a composer — pointed at a transport the product supplies. It is composed
from Vercel AI Elements, restyled onto this system's tokens.

It is the second component family. `components/ui/*` is shadcn restyled —
vendored, generic, regenerable. The workspace is none of those, but it knows
nothing about any particular product, so it travels with the system. It lives in
`components/agent/*`; the AI Elements it is built from live in
`components/ai-elements/*`.

Live reference: `/design-system/components/agent-workspace`. Each AI Element has
its own page, `/design-system/components/ai-<name>`, and the page carries its usage notes.

## Layout

```
components/agent/
  index.ts              the public surface — what a caller may reach for
  agent-workspace.tsx   the block
  workspace/            history, header, thread, reply, composer, settings,
                        run-inline, workflow dialog, and the two adapters
                        (reply-model.ts, tool-output.ts)
  core/                 types, run model, state machine, timeline reducer,
                        attachments, conversations
  avatar/               the animated isometric cube avatar
  voice/speech.ts       the browser speech adapter
  parts/                EffortSlider and SparkField (original code)
components/ai-elements/ vendored Vercel AI Elements (Apache-2.0)
lib/agent/
  mock-transport.ts     a complete offline transport — the reference implementation
```

`core/` imports nothing. Not React, not an SDK, not a component. That is what
lets the transcript vocabulary be shared by a transport that has never heard of
the workspace.

## The four seams

The workspace owns the conversation and nothing else. Everything specific
arrives as a prop.

| Seam | Type | What it decides |
|---|---|---|
| `transport` | `AgentTransport` | What it talks to |
| `avatar` | `AvatarRenderer` | What it looks like (default: the animated `CubeAvatar`) |
| `speech` | `SpeechAdapter` | What it sounds like (`useBrowserSpeech` is the browser implementation) |
| `toolStates` | `ToolStateMap` | What its tools mean, so the face can be honest |

Other `AgentWorkspaceProps`: `name`, `title`, `conversations` (`activeId`,
`onNew`, `onRestore`, …), `models`, `sources`, `commands`, `efforts`,
`suggestions`, `speak`, and the controllable panels `settingsOpen` and
`historyOpen` (each with an `onXChange`; both default to uncontrolled).

## Pointing it at a real agent

Implement `AgentTransport` (`components/agent/core/types.ts`). Nothing else
moves.

```ts
export type AgentTransport = {
  turns: AgentTurn[]              // the transcript, owned here so tool calls can settle
  send: (text: string, options?: SendOptions) => Promise<void>
  abort: () => void               // the user pressed stop. Not an error.
  reset: () => void
  isLoading: boolean
  isReady: boolean                // false while acquiring a session, socket or handler
  error: Error | null
  pendingApprovals: PendingApproval[]
  capabilities: TransportCapabilities
  // …and the optional methods below
}
```

**Read `lib/agent/mock-transport.ts` first.** It is a working implementation of
every line above — streaming, tool calls, produced attachments, an approval the
agent blocks on, abort and the failure path. Swap its scripted beats for a
`fetch` and the rest of that file is what a production transport looks like.

Three rules it demonstrates and a real one must keep:

1. **Fold events through `reduceEvent`.** It owns how a text delta appends to the
   turn already streaming and how a `tool_result` finds and settles its own call.
   Duplicating that in a transport is how a transport drifts from the transcript
   it feeds.
2. **Abort is not an error.** It is the user pressing stop. Surfacing it as a
   failure puts a red state on a working component.
3. **`capabilities` must be honest.** See the next section.

### Capabilities gate every control

`TransportCapabilities` is what the workspace renders on: `attachments`
(`"content" | "reference" | "none"`), `models`, `approvals`, and the optional
`plans`, `pause`, `checkpoints`, `queue`, `compensation`, `effects`, `handoff`,
`branching`, `sources`, `settings`.

**A control renders only when the capability flag is true AND the matching
method exists on the transport.** Neither alone is enough: a flag with no method
would draw a button that does nothing, and a method with no flag is a transport
that has not promised it. When either is missing the control is absent — not
disabled, absent. The UI a transport shows is exactly the UI it can back up.
The same rule covers `SendOptions`: `settings`, `sources` and `webSearch` are
only ever sent to a transport that advertised them.

### Optional methods and fields

All optional; a transport without them simply gets no matching UI.

- **Run lifecycle:** `runState`, `approvePlan`, `pause`, `resume`, `cancel`,
  `skipStep`, `retryStep`, `verifyStep`, `retryEffect`, `compensate`,
  `handoff(note?, owner?)`, `approveWithCode`, plus the queue and branching
  methods.
- **Context:** `usage` + `summarise` drive the context meter ring and its
  "Summarise to free space" button (shown past the critical tier).
- **Chat checkpoints:** `restorePoints` + `restoreTo`.
- **Dictation:** `transcribe(audio)` — the composer records from the chosen
  microphone and sends the audio; the transport returns text.
- **About this agent:** `agent` (an `AgentProfile`).
- **History:** the `conversations` prop, with `sessionId` on the transport so a
  reopened conversation resumes the agent's own memory.

## Events and turns

A transport emits `AgentEvent`s and folds them through `reduceEvent` into
`AgentTurn`s: `UserTurn`, `TextTurn`, `ToolTurn`, `ActionTurn`, `ErrorTurn`.

- `tool_progress` fills `ToolTurn.partial` while a tool runs (a terminal
  streaming, tests filling in, `{ kind: "image", stage }` for a generation).
- `TextTurn.model` names the model that answered; `AgentTurn.at` is the epoch ms
  a turn was sent, shown as a relative time in the reply's meta row.
- `ActivityEntry.reason` marks an expired or stale plan approval.
- `SendOptions` carries `settings` (autonomy, temperature, length, effort),
  `sources` (ids picked with `@`) and `webSearch`.

## The run model

The transcript (`core/timeline.ts`) is what was *said*; a run is what was
*done*. `core/run.ts` defines the lifecycle of one task: twelve `RunStatus`
values (`proposed` through `completed`), a `PlanStep` list with per-step
`status` and `confidence`, the `Effect`s a run produced outside the chat, the
`checkpoints` it can resume from, the `queue` of messages held while it is busy
and — when it cannot finish — a `Handoff`. `reduceRunEvent` is the pure reducer
the run-model rules are tested against. Like everything under `core/`, it
imports nothing but types from `core/`.

The avatar's `AGENT_STATES` (`core/states.ts`) has twenty-six entries, six of
them for the run model: `paused`, `cancelling`, `undoing`, `partial`, `handoff`
and `offline`, each with its own scene in `avatar/scenes.ts`.

## How the workspace composes the reply

Everything the workspace draws goes through one adapter,
`components/agent/workspace/reply-model.ts`: it groups turns into replies and
maps tool and approval states, plan and queue, context usage and images onto
what AI Elements expects. It is pure and tested; translating in one place is what
keeps each component free of transcript knowledge.

- **History** is a shadcn Sidebar (`workspace-history.tsx`).
- **A reply** is one AI Elements `Message` in a fixed order
  (`workspace-reply.tsx`).
- **The run** — Plan, Task, Undo, handoff — sits inline in the reply that started
  it (`run-inline.tsx`); the Queue docks above the composer; "View as workflow"
  opens a React Flow graph (`workflow-dialog.tsx`).
- **The composer** is PromptInput (`workspace-composer.tsx`): `@` and `/` open
  command palettes (picked sources ride `SendOptions.sources`); the + menu holds
  files, sources and skills; Effort is a chip that opens the shared
  `EffortSlider`, and at the last level the box runs the shared `SparkField`; the
  mic sits beside Send. Under 448px wide only +, the mic and Send stay in the
  box; Search, the model, Effort and the context meter move to a row under it.
- **Status lives in the reply that has it.** There is no separate status row,
  run bar or activity column.

### Typed tool output

`ToolTurn.result` is `unknown` on purpose. A result that carries a `kind` from
`workspace/tool-output.ts` promises a shape — `terminal`, `test-results`,
`stack-trace`, `file-tree`, `commit`, `package-info`, `environment-variables`,
`schema-display`, and the rest of that file — and `toolOutput` validates the
promise before the thread trusts it. The thread then draws the AI Elements
component made for that kind. A malformed result falls back to the plain `Tool`
output, never to a crash. The same shapes are what `tool_progress` reports.

## The mock transport

`lib/agent/mock-transport.ts` has no backend, no key and no socket. Its
keyword-routed default path answers any text; on top of that `CONVERSATIONS`
plays seven multi-beat conversations, each a script of events:

| Id | Shows |
|---|---|
| `chat` | Streaming text, sources |
| `tools` | Tool calls and typed tool output |
| `planning` | A multi-step plan being proposed, approved, run |
| `approvals` | Approval gates, an expired/stale approval |
| `run-control` | Pause, resume, cancel, the queue |
| `recovery` | A failed step, retry, undo, handoff |
| `long-session` | A long thread, context usage, checkpoints |

## Theming notes

The workspace adds no colour of its own. Where an AI Element ships a library
that draws its own colours, a utility in `styles/utilities.css` points it at
this system's roles:

- **Code roles.** Code blocks and inline code use the `code` typography role and
  the code colour roles in `styles/tokens.css`; nothing carries a highlighter's
  own theme.
- **`streamdown-chrome`.** A reply is `.prose`; its plain elements are styled by
  `typeset.css`. The parts that keep Streamdown's behaviour — links (the "open
  this link?" check), code blocks (copy, download), tables (copy, fullscreen) —
  wear this utility so they read as the system's own.
- **`xy-tokens`.** Puts React Flow (`@xyflow/react`) on our roles for the
  workflow graph and the AI Canvas, Node and Edge elements.
- **`terminal-colors`.** ANSI colours in a terminal result resolve to `-ink` roles,
  readable in both themes. 256-colour and truecolor output falls back to the
  terminal's foreground.
- **The avatar.** `--agent` is the action ramp (the agent acts): action-dark in light mode
  (`styles/tokens.css`), action-bright in dark; the
  twelve `--agent-cube-*` values draw the faces, and
  **`--agent-cube-accent` is the single knob** that recolours all twenty-six
  scenes. `agent-cube-*` keyframes live with the avatar.

All motion uses the system's utilities and duration and easing scale in
`styles/motion.css`.

## Licences

AI Elements is Apache-2.0. The notice and the statement of what was modified are
in `components/ai-elements/NOTICE.md`; keep both with any copy you redistribute.
`EffortSlider`, `SparkField`, `GeneratedImage`, `VoiceOrb`, the avatar and
everything else under `components/agent/` is original code to this system.
There is no site-only component: the registry's `agent-workspace` block ships
the whole family.

## Known outstanding work

1. **Speech recognition support is uneven across browsers.** The dictation
   fallback (`transcribe`) exists for that reason; the browser speech adapter has
   only been exercised in Chromium here.
2. **The browser automation pane runs hidden**, so animation-driven states are
   verified by seeking animations and reading computed styles rather than by
   screenshots.
