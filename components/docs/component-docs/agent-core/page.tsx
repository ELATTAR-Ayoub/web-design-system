/**
 * Authored documentation page for `agent-core`.
 *
 * `components/agent/core/types.ts` imports nothing — not React, not an SDK,
 * not a component. That is what lets the transcript vocabulary be shared by a
 * transport that has never heard of `AgentWorkspace`. This item has no UI of its
 * own — it is the transport-agnostic contract every agent surface renders
 * from — so its opener cannot place a component the way every other page
 * does. What it CAN show is the reducer itself running: `reduceEvent` folding
 * a real event stream into turns, and `resolveState` deriving a real
 * `AgentState` from the result at every step, drawn through the same
 * `AgentAvatar` and a status line, as the workspace header does.
 *
 * The stepper itself lives in `./reducer-walkthrough.tsx`, not here —
 * `scripts/validate-docs.mjs` requires every spec module to stay plain data,
 * so the one file in this pair allowed a `"use client"` directive is the
 * sibling, the same shape as `form/account-form-specimen.tsx`.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel } from "@/components/ds/kit";

import { meta } from "./meta";
import { ReducerWalkthrough } from "./reducer-walkthrough";

export const spec: ComponentDocSpec = {
  name: "agent-core",
  omitted: {
    states: "core/types.ts and reduceEvent/resolveState are pure functions and type declarations, not a rendered element — they have no hover, focus, loading or disabled state of their own. The Step/Reset buttons in the Preview are documentation tooling for stepping through the reducer, not this item's own surface, the same way MicControl demonstrates but does not document voice.",
    accessibility: "Nothing here renders, so nothing here has a name, role or announcement — the accessible surfaces the reducer feeds (the workspace header, its status line, the thread) are documented on their own pages.",
    keyboard: "A pure function is never focused or reached by Tab. The Step/Reset buttons in the Preview are native <button>s belonging to the walkthrough demo, not a keyboard contract this item defines.",
    responsive: "Types and reducers have no layout — nothing here reflows, zooms or mirrors, because there is nothing drawn on screen to do it.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "The reducer, not a picture of one. Every click folds one real AgentEvent through reduceEvent — the exact function lib/agent/mock-transport.ts calls — and resolveState derives a real AgentState from the resulting turns, drawn through the same AgentAvatar and status line the workspace header uses. Nothing here is faster or slower than the real thing except the pacing: a live transport folds these in milliseconds, this needs a click.",
      label: "reduceEvent + resolveState, stepped by hand",
      render: (
        <Panel label="State machine" note="reduceEvent · resolveState">
          <ReducerWalkthrough />
        </Panel>
      ),
      source: `const [turns, setTurns] = useState<AgentTurn[]>([]);

// Push the user's own turn — starting a turn is the caller's job, not the wire's.
setTurns((prev) => [...prev, userTurn("What sealed boxes are left?")]);

// Fold each event the transport emits through the one function that owns the rules.
setTurns((prev) => reduceEvent(prev, { type: "tool_call", name: "search_inventory", parameters: {} }));
setTurns((prev) => reduceEvent(prev, { type: "tool_result", name: "search_inventory", result: { success: true } }));

// Derive what the face should show — never set it.
const state = resolveState({
  turns,
  signals: { isLoading: true, awaitingFirstEvent: false },
  toolStates: { search_inventory: "searching" },
});`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Installed as a dependency of every agent item — there is nothing to
          install on its own, and nothing to render: this item is types.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "The one interface that has to be implemented to point AgentWorkspace at a different agent. Everything above the line in this file is pure; AgentTransport is where somebody else's protocol enters.",
      language: "ts",
      code: `import type { AgentTransport, AgentTurn, SendOptions } from "@/components/agent";

// The shape a real transport must satisfy. lib/agent/mock-transport.ts is a
// complete, offline reference implementation of every line below.
declare function useMyTransport(): AgentTransport;

const transport = useMyTransport();
transport.turns satisfies AgentTurn[];
transport.send("What is left?", {} satisfies SendOptions);`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "A ToolStateMap, the one place a product tells this vocabulary what its own tools mean. Matched exactly first, then by the longest \".\" or \"_\" prefix, so a whole family (finance.) can be mapped without listing every member.",
      label: "ToolStateMap",
      render: (
        <Note tone="action" title="Declared, not guessed">
          <code className="type-code">resolveState</code> will not infer that a
          tool called <code className="type-code">search_docs</code> means
          searching — the next codebase along has one called{" "}
          <code className="type-code">search</code> that formats a hard drive.
          The map is how a caller says so honestly.
        </Note>
      ),
      source: `const TOOL_STATES: ToolStateMap = {
  search_inventory: "searching",
  read_wallet: "retrieving",
  export_activity: "writing",
  "finance.": "retrieving", // prefix match — finance.forecast, finance.report, …
};`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Every export of components/agent/core/types.ts. Attachment and the turn/event unions are documented in full on the agent-workspace page (/design-system/components/agent-workspace), against the components that actually render them, and lib/agent/mock-transport.ts is the reference transport; this table is the type-level contract.",
      blocks: [
        {
          label: "Attachments",
          body: (
            <Meta
              items={[
                { k: "Attachment", v: "{ id, name, mime, kind, size, url?, text?, delivery? } — one type in both directions: a file the user picks and a file the agent produces are the same object to everything that draws them." },
                { k: "AttachmentKind", v: '"image" | "document" | "data" | "code" | "audio" | "other"' },
                { k: "AttachmentDelivery", v: '{ sent: "content" } | { sent: "reference"; reason: string } | { sent: "produced" } — whether the agent can genuinely see this attachment, stated rather than implied.' },
                { k: "attachmentKind(mime, name)", v: "AttachmentKind — classifies by MIME first, extension second, because pickers lie about MIME often enough." },
              ]}
            />
          ),
        },
        {
          label: "Events and turns",
          body: (
            <Meta
              items={[
                { k: "AgentEvent", v: '{ type: "text" } | { type: "tool_call" } | { type: "tool_result" } | { type: "action_request" } | { type: "error" } | { type: "done" } — the wire contract, restated locally.' },
                { k: "AgentTurn", v: "UserTurn | TextTurn | ToolTurn | ActionTurn | ErrorTurn" },
                { k: "TurnStatus", v: '"running" | "ok" | "error"' },
                { k: "TextTurn", v: "{ kind: \"text\", id, text, attachments?, streaming? } — streaming distinguishes \"writing\" from \"written\"." },
                { k: "ToolTurn", v: "{ kind: \"tool\", id, name, params, status, result?, error?, attachments?, startedAt, ms?, attempt } — attempt drives the retrying state when a tool is re-called after failing." },
                { k: "ActionTurn", v: '{ kind: "action", id, action, params, status, error?, startedAt, ms?, approval? } — approval is set when this action is held at an approval card rather than run.' },
                { k: "ErrorTurn", v: "{ kind: \"error\", id, message, fatal }" },
              ]}
            />
          ),
        },
        {
          label: "Transport",
          body: (
            <Meta
              items={[
                { k: "AgentTransport", v: "turns, send, abort, reset, isLoading, error, isReady, pendingApprovals, capabilities, restore?, sessionId? — the contract documented in full on the agent-workspace page (/design-system/components/agent-workspace); lib/agent/mock-transport.ts is the reference implementation." },
                { k: "SendOptions", v: "{ attachments?, model?, wireText? } — wireText is what actually goes on the wire when it differs from the sentence the transcript keeps." },
                { k: "PendingApproval", v: "{ turnId, action, params, approve(), reject(reason?) }" },
                { k: "TransportCapabilities", v: '{ attachments: "content" | "reference" | "none", models: boolean, approvals: boolean } — advertised so the workspace renders only what this agent can actually do.' },
                { k: "AgentSignals", v: "{ isLoading, awaitingFirstEvent, declared? } — everything outside the transcript that changes what the face should show, kept separate so resolveState stays a pure function of its arguments." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        { body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> },
      ],
    },
  ],
};
