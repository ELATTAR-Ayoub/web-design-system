/**
 * Which of the twenty-six states is true right now.
 *
 * A pure function of the transcript plus a few signals, with no memory of its
 * own. That is the whole design: the face is *derived*, never set, so it cannot
 * claim to be running code when no tool is running. Every branch below points at
 * something that demonstrably happened.
 *
 * Twelve states are structural — they come out of the event stream and are true
 * for any agent. The other eight exist only because the caller told us what its
 * own tools do, through `toolStates`. That split is deliberate: this file will
 * not guess that a tool called `search_docs` means searching, because the next
 * codebase along will have one called `search` that formats a hard drive.
 *
 * Order is the specification. First match wins, and the ladder runs from "the
 * user must act" down through "the agent is acting" to "nothing is happening".
 */

import { runAvatarState, type Connection, type Run } from "./run";
import { stateForTool, type AgentState, type ToolStateMap } from "./states";
import type { ActionTurn, AgentSignals, AgentTurn, TextTurn, ToolTurn } from "./types";

export type ResolveInput = {
  turns: AgentTurn[];
  signals: AgentSignals;
  toolStates?: ToolStateMap;
  /** The run in progress, when there is one. Its status can force the face. */
  run?: Run | null;
  /** Transport connection health. Offline/reconnecting forces the face too. */
  connection?: Connection;
};

export function resolveState({ turns, signals, toolStates, run, connection }: ResolveInput): AgentState {
  // -1. A dead transport outranks even a declared state — an agent cannot
  //     assert "writing" over a socket that is not there to assert it on.
  //     This is the one part of the run/connection ladder that has to come
  //     before `declared`; the rest (run status) stays below it.
  const resolvedConnection = connection ?? "connected";
  if (resolvedConnection !== "connected") return "offline";

  // 0. An agent that reports its own state is believed. Nothing in this file can
  //    know better than the runtime does, so a declared state short-circuits the
  //    whole ladder. No Lens agent sends one today; the channel exists so that
  //    adding it later is a transport change and not a rewrite of this file.
  if (signals.declared) return signals.declared;

  // 0.5. The run lifecycle outranks the turn ladder below. A run that is
  //      paused, cancelling, undoing, partly failed or handed off is not
  //      something the ladder can see — it lives in `run.ts`, not in the
  //      events that make up `turns`.
  const forced = runAvatarState(run ?? null, resolvedConnection);
  if (forced) return forced;

  const last = turns.at(-1);

  // 1. A fatal error outranks everything. A non-fatal one does not: the agent
  //    recovers from those, and freezing the face on a red cube while it carries
  //    on working is worse than not showing it at all.
  if (last?.kind === "error" && last.fatal) return "error";

  // 2. Something is waiting on a human. This sits above the working states
  //    because it is the one situation where the agent has stopped and the user
  //    has not been told why.
  const heldForApproval = turns.some(
    (turn) => turn.kind === "action" && turn.approval === "pending",
  );
  if (heldForApproval) return "awaiting_approval";

  // 3. A tool in flight. What the tool *means* is the caller's to declare; all
  //    this knows is that one is running, hence the honest fallback.
  const runningTool = findLast(turns, (t): t is ToolTurn => t.kind === "tool" && t.status === "running");
  if (runningTool) {
    // A tool being tried again after it failed is a retry first and whatever it
    // does second — that is the more useful thing to show, because it is the
    // signal that the agent may be stuck.
    if (runningTool.attempt > 1) return "retrying";
    return stateForTool(runningTool.name, toolStates) ?? "calling_tools";
  }

  // 4. The browser is doing something on the agent's behalf.
  const runningAction = findLast(
    turns,
    (t): t is ActionTurn => t.kind === "action" && t.status === "running",
  );
  if (runningAction) return "processing";

  // 5. Prose is arriving. Which kind of prose depends on where in the turn we
  //    are, and that is knowable: text before any tool call is the model saying
  //    what it intends to do, text after one is it accounting for what it found,
  //    and text in a turn with no tools at all is just an answer.
  if (last?.kind === "text" && last.streaming) {
    return narrationState(turns, last);
  }

  // 5.5. A plan step is running. `runAvatarState` (0.5, above) returns null
  //      for `run.status === "running"` on purpose — a run mid-step still
  //      wants the turn ladder's finer-grained states (a running tool, a
  //      pending approval) when one applies. But a run can advance a step
  //      with no new *turn* at all — `reduceRunEvent` folds `step_status`
  //      into `run.plan`, never into `turns` — so nothing above this line
  //      necessarily saw it happen. Bug 7: without this, a run that started
  //      running while `awaitingFirstEvent` was still true (see
  //      `agent-workspace.tsx`'s own fix for why that flag used to outlive
  //      the whole run) fell through to `queued` and stayed there for as
  //      long as the step ran.
  if (run?.status === "running") return "processing";

  // 6. Sent, nothing back yet. Distinct from `thinking` — the request may not
  //    have reached a model at all, and a queue is an honest thing to show.
  if (signals.awaitingFirstEvent) return "queued";

  // 7. Loading with nothing else to say about it.
  if (signals.isLoading) return "thinking";

  // 8. A turn that finished. The console holds this briefly and then falls to
  //    idle; the hold is a render concern, not a resolution one, so all that
  //    happens here is reporting that the last thing was a completed answer.
  if (last && isSettled(last)) return "done";

  return "idle";
}

/**
 * Planning or summarizing.
 *
 * The distinction is what came before this paragraph *in the current turn*, so
 * the scan walks back only as far as the user's last message. Text after work is
 * an account of it; text before work is a plan for it.
 *
 * Note what is NOT decided here: `writing`. Mid-stream there is no way to tell
 * an opening paragraph that precedes three tool calls from one that is the whole
 * answer — the difference is entirely in tokens that have not arrived yet.
 * Rather than guess, prose always reads as planning or summarizing, and
 * `writing` is reached the one way it can be proven: a caller maps its mutating
 * tools onto it (`orders.create`, `fs.write`, `leave.decide`). The avatar's
 * writing scene fills a grid in cube by cube, which reads correctly for a record
 * being written — and would read as a lie over a paragraph that turned out to be
 * a preamble.
 */
function narrationState(turns: AgentTurn[], current: TextTurn): AgentState {
  for (let i = turns.length - 1; i >= 0; i -= 1) {
    const turn = turns[i];
    if (turn === current) continue;
    if (turn.kind === "user") break;
    if (turn.kind === "tool" || turn.kind === "action") return "summarizing";
  }
  return "planning";
}

/** A turn that represents a finished piece of work. */
function isSettled(turn: AgentTurn): boolean {
  if (turn.kind === "text") return turn.streaming !== true;
  if (turn.kind === "tool" || turn.kind === "action") return turn.status !== "running";
  return turn.kind === "error";
}

function findLast<T extends AgentTurn>(
  turns: AgentTurn[],
  predicate: (turn: AgentTurn) => turn is T,
): T | null {
  for (let i = turns.length - 1; i >= 0; i -= 1) {
    if (predicate(turns[i])) return turns[i] as T;
  }
  return null;
}
