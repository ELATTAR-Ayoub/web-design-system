"use client";

/**
 * The live specimen for `agent-core`'s Preview section.
 *
 * A spec module (`page.tsx`) must stay plain data — `scripts/validate-docs.mjs`
 * fails the build on a `"use client"` directive there — so this is a sibling
 * file in the item's own directory, the same shape as
 * `components/docs/component-docs/form/account-form-specimen.tsx`: local to
 * the one page that needs it.
 *
 * `agent-core` has no component of its own to place in a stage — it is the
 * transport-agnostic contract every agent surface renders from. What it can
 * show is the reducer itself running: `reduceEvent` folding a real event
 * stream into turns, and `resolveState` deriving a real `AgentState` from the
 * result after every step, drawn through `AgentAvatar` and a
 * status line.
 */

import { useMemo, useState } from "react";

import {
  AGENT_STATE_LABEL,
  AgentAvatar,
  reduceEvent,
  resolveState,
  userTurn,
  type AgentEvent,
  type AgentTurn,
  type ToolStateMap,
} from "@/components/agent";
import { Button } from "@/components/ui/button";

/**
 * One walk through a full turn, as the raw events a transport would emit —
 * the same shape `lib/agent/mock-transport.ts` folds through `reduceEvent`,
 * just slowed down to one step per click instead of one every few
 * milliseconds. `kind: "user"` is not an `AgentEvent` — starting a turn is the
 * caller pushing a `UserTurn` onto the transcript, not something the wire
 * emits — so this script tags it separately and the walkthrough below
 * branches on it.
 */
type Step =
  | { kind: "user"; text: string; note: string }
  | { kind: "event"; event: AgentEvent; note: string };

const TOOL_STATES: ToolStateMap = { search_inventory: "searching" };

const SCRIPT: Step[] = [
  { kind: "user", text: "What sealed boxes are left?", note: "the user sends — nothing back yet" },
  {
    kind: "event",
    event: { type: "text", content: "Let me look that up." },
    note: "a text delta opens a streaming turn — prose before any tool call is a plan",
  },
  {
    kind: "event",
    event: { type: "tool_call", name: "search_inventory", parameters: { query: "sealed booster boxes" } },
    note: "tool_call closes the streaming turn and opens a running one",
  },
  {
    kind: "event",
    event: {
      type: "tool_result",
      name: "search_inventory",
      result: { success: true, result: { matches: 3, topResult: "Eclipse Vault — 1st Edition" } },
    },
    note: "tool_result finds its call by name and settles it — nothing else is running",
  },
  {
    kind: "event",
    event: { type: "text", content: "Three boxes match. The strongest is Eclipse Vault." },
    note: "prose after a tool call is an account of it, not a plan",
  },
  {
    kind: "event",
    event: { type: "done" },
    note: "done closes the streaming turn for good",
  },
];

export function ReducerWalkthrough() {
  const [stepIndex, setStepIndex] = useState(0);
  const [turns, setTurns] = useState<AgentTurn[]>([]);

  const finished = stepIndex >= SCRIPT.length;
  const awaitingFirstEvent = turns.length > 0 && turns.every((t) => t.kind === "user");
  const isLoading = stepIndex > 0 && !finished;

  const state = useMemo(
    () =>
      resolveState({
        turns,
        signals: { isLoading, awaitingFirstEvent, declared: null },
        toolStates: TOOL_STATES,
      }),
    [turns, isLoading, awaitingFirstEvent],
  );

  function step() {
    const next = SCRIPT[stepIndex];
    if (!next) return;
    setTurns((prev) => (next.kind === "user" ? [...prev, userTurn(next.text)] : reduceEvent(prev, next.event)));
    setStepIndex((i) => i + 1);
  }

  function reset() {
    setStepIndex(0);
    setTurns([]);
  }

  const applied = stepIndex > 0 ? SCRIPT[stepIndex - 1] : null;
  const upcoming = SCRIPT[stepIndex];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-5">
        <AgentAvatar state={state} size="lg" />
        <div className="min-w-0">
          <p className="type-body text-foreground" role="status">{AGENT_STATE_LABEL[state]}</p>
          <p className="type-small mt-1 text-muted-foreground">
            <code className="type-code">resolveState()</code> → {AGENT_STATE_LABEL[state]}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={step} disabled={finished}>
          {stepIndex === 0 ? "Send" : finished ? "Finished" : "Next event"}
        </Button>
        <Button size="sm" variant="outline" onClick={reset} disabled={stepIndex === 0}>
          Reset
        </Button>
        <p className="type-small text-muted-foreground">
          Step {Math.min(stepIndex, SCRIPT.length)} of {SCRIPT.length}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-background p-4">
        <p className="type-badge text-muted-foreground">
          {stepIndex === 0 ? "Not started" : "Last applied"}
        </p>
        <p className="type-small mt-1 text-foreground">
          {applied ? applied.note : "Nothing folded yet — press Send to push the user's turn."}
        </p>
        {!finished && upcoming && (
          <>
            <p className="type-badge mt-4 text-muted-foreground">Next</p>
            <p className="type-small mt-1 text-muted-foreground">{upcoming.note}</p>
          </>
        )}
      </div>
    </div>
  );
}
