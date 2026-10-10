import { runAvatarState, type Connection, type Run } from "./run";
import { stateForTool, type AgentState, type ToolStateMap } from "./states";
import type { ActionTurn, AgentSignals, AgentTurn, TextTurn, ToolTurn } from "./types";

export type ResolveInput = {
  turns: AgentTurn[];
  signals: AgentSignals;
  toolStates?: ToolStateMap;
  run?: Run | null;
  connection?: Connection;
};

export function resolveState({ turns, signals, toolStates, run, connection }: ResolveInput): AgentState {
  // A dead transport outranks even a declared state.
  const resolvedConnection = connection ?? "connected";
  if (resolvedConnection !== "connected") return "offline";

  if (signals.declared) return signals.declared;

  // The run lifecycle outranks the turn ladder below; turns cannot see it.
  const forced = runAvatarState(run ?? null, resolvedConnection);
  if (forced) return forced;

  const last = turns.at(-1);

  // A fatal error outranks everything; a non-fatal one must not freeze the face.
  if (last?.kind === "error" && last.fatal) return "error";

  const heldForApproval = turns.some(
    (turn) => turn.kind === "action" && turn.approval === "pending",
  );
  if (heldForApproval) return "awaiting_approval";

  const runningTool = findLast(turns, (t): t is ToolTurn => t.kind === "tool" && t.status === "running");
  if (runningTool) {
    if (runningTool.attempt > 1) return "retrying";
    return stateForTool(runningTool.name, toolStates) ?? "calling_tools";
  }

  const runningAction = findLast(
    turns,
    (t): t is ActionTurn => t.kind === "action" && t.status === "running",
  );
  if (runningAction) return "processing";

  if (last?.kind === "text" && last.streaming) {
    return narrationState(turns, last);
  }

  // A running plan step produces no new turn, so nothing above sees it; keep it below the turn ladder.
  if (run?.status === "running") return "processing";

  if (signals.awaitingFirstEvent) return "queued";

  if (signals.isLoading) return "thinking";

  if (last && isSettled(last)) return "done";

  return "idle";
}

function narrationState(turns: AgentTurn[], current: TextTurn): AgentState {
  for (let i = turns.length - 1; i >= 0; i -= 1) {
    const turn = turns[i];
    if (turn === current) continue;
    if (turn.kind === "user") break;
    if (turn.kind === "tool" || turn.kind === "action") return "summarizing";
  }
  return "planning";
}

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
