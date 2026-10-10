import type { AgentState } from "./states";
import type { Attachment } from "./types";

export type RunStatus =
  | "proposed" | "queued" | "running" | "paused" | "waiting_for_approval"
  | "partially_failed" | "cancelling" | "cancelled"
  | "compensating" | "compensated" | "handoff_required" | "completed";

export type StepStatus = "pending" | "running" | "done" | "failed" | "skipped";
export type Confidence = "high" | "low";
export type EffectStatus = "committed" | "failed" | "unknown" | "reversed";
export type Connection = "connected" | "reconnecting" | "offline";

export type PlanStep = {
  id: string;
  title: string;
  detail?: string;
  status: StepStatus;
  confidence?: Confidence;
  ms?: number;
};

export type Effect = {
  id: string;
  stepId: string;
  description: string;
  target: string;
  status: EffectStatus;
  reversible: boolean;
  error?: string;
};

export type Checkpoint = { id: string; label: string; turnId: string; at: number; stepId?: string };
export type QueueItem = { id: string; text: string; attachments?: Attachment[]; model?: string; at: number };
export type Handoff = {
  goal: string;
  done: string[];
  failed: string[];
  unknown: string[];
  owner?: string;
  note?: string;
};

export type RunError = {
  what: string;
  why: string;
  next: string;
  kind: "understanding" | "tool" | "access" | "action" | "connection";
  fatal: boolean;
};

export type Run = {
  id: string;
  version: number;
  goal: string;
  status: RunStatus;
  plan: PlanStep[];
  effects: Effect[];
  checkpoints: Checkpoint[];
  queue: QueueItem[];
  handoff?: Handoff;
  error?: RunError;
  startedAt: number;
  endedAt?: number;
};

export type ActivityKind = "status" | "step" | "effect" | "checkpoint" | "approval" | "handoff" | "connection" | "queue";
export type ActivityEntry = {
  id: string;
  at: number;
  kind: ActivityKind;
  text: string;
  status?: StepStatus | EffectStatus | RunStatus;
  reason?: "approval_expired" | "approval_stale";
};

export type RunState = {
  run: Run | null;
  connection: Connection;
  timeline: ActivityEntry[];
  seen: readonly string[];
};

export const EMPTY_RUN_STATE: RunState = { run: null, connection: "connected", timeline: [], seen: [] };

type Base = { eventId: string; at: number };
export type RunEvent =
  | (Base & { type: "run_proposed"; runId: string; goal: string; version: number; plan: PlanStep[] })
  | (Base & { type: "plan_edited"; version: number; plan: PlanStep[] })
  | (Base & { type: "plan_approved"; version: number })
  | (Base & { type: "run_status"; status: RunStatus; error?: RunError; resumeFrom?: string })
  | (Base & { type: "step_status"; stepId: string; status: StepStatus; confidence?: Confidence; ms?: number })
  | (Base & { type: "effect"; outcome: "committed" | "failed" | "timeout" | "reversed"; effect: Omit<Effect, "status"> })
  | (Base & { type: "checkpoint"; checkpoint: Checkpoint })
  | (Base & { type: "approval_expired"; version: number })
  | (Base & { type: "handoff"; handoff: Handoff })
  | (Base & { type: "queue"; queue: QueueItem[] })
  | (Base & { type: "connection"; connection: Connection });

export const RUN_STATUS_LABEL: Record<RunStatus, string> = {
  proposed: "Waiting for your approval",
  queued: "Queued",
  running: "Running",
  paused: "Paused",
  waiting_for_approval: "Waiting for your approval",
  partially_failed: "Partly done",
  cancelling: "Stopping…",
  cancelled: "Stopped",
  compensating: "Undoing changes…",
  compensated: "Changes undone",
  handoff_required: "Needs a person",
  completed: "Done",
};

const EFFECT_STATUS: Record<"committed" | "failed" | "timeout" | "reversed", EffectStatus> = {
  committed: "committed",
  failed: "failed",
  timeout: "unknown",
  reversed: "reversed",
};

function log(state: RunState, e: RunEvent, kind: ActivityKind, text: string, status?: ActivityEntry["status"], reason?: ActivityEntry["reason"]): ActivityEntry[] {
  return [...state.timeline, { id: e.eventId, at: e.at, kind, text, status, ...(reason ? { reason } : {}) }];
}

function withRun(state: RunState, run: Run, timeline = state.timeline): RunState {
  return { ...state, run, timeline };
}

export function reduceRunEvent(state: RunState, e: RunEvent): RunState {
  if (state.seen.includes(e.eventId)) return state;
  const next = { ...state, seen: [...state.seen, e.eventId] };
  const run = next.run;

  switch (e.type) {
    case "run_proposed": {
      const fresh: Run = {
        id: e.runId, version: e.version, goal: e.goal, status: "proposed", plan: e.plan,
        effects: [], checkpoints: [], queue: run?.queue ?? [], startedAt: e.at,
      };
      return withRun(next, fresh, log(next, e, "status", `Plan proposed: ${e.goal}`, "proposed"));
    }
    case "connection":
      return {
        ...next,
        connection: e.connection,
        timeline: log(next, e, "connection", e.connection === "connected" ? "Connection restored" : e.connection === "reconnecting" ? "Connection lost — reconnecting" : "Offline"),
      };
    case "queue":
      return run
        ? withRun(next, { ...run, queue: e.queue })
        : { ...next, run: null };
  }

  if (!run) return next;

  switch (e.type) {
    case "plan_edited":
      return withRun(next, { ...run, version: e.version, plan: e.plan, status: "proposed" },
        log(next, e, "approval", `Plan edited — now v${e.version}`, "proposed"));
    case "plan_approved":
      if (e.version < run.version) {
        return { ...next, timeline: log(next, e, "approval", `Approval for plan v${e.version} rejected — the plan is now v${run.version}`, undefined, "approval_stale") };
      }
      return withRun(next, { ...run, status: "running" }, log(next, e, "approval", `Plan v${e.version} approved`, "running"));
    case "approval_expired": {
      const version = run.version + 1;
      return withRun(next, { ...run, version, status: "proposed" },
        log(next, e, "approval", `Approval for plan v${e.version} expired — approve v${version} to continue`, "proposed", "approval_expired"));
    }
    case "run_status": {
      let plan = run.plan;
      if (e.resumeFrom) {
        const rerun = new Set(stepsAfterCheckpoint(run, e.resumeFrom));
        plan = plan.map((p) => (rerun.has(p.id) ? { ...p, status: "pending" as const, ms: undefined } : p));
      }
      const terminal = e.status === "completed" || e.status === "cancelled" || e.status === "compensated";
      return withRun(next, { ...run, plan, status: e.status, error: e.error ?? run.error, endedAt: terminal ? e.at : run.endedAt },
        log(next, e, "status", e.resumeFrom ? `Resumed from checkpoint` : RUN_STATUS_LABEL[e.status], e.status));
    }
    case "step_status": {
      let plan = run.plan.map((p) =>
        p.id === e.stepId ? { ...p, status: e.status, confidence: e.confidence ?? p.confidence, ms: e.ms ?? p.ms } : p);
      let status = run.status;
      const settled = e.status !== "running" && e.status !== "pending";
      if (run.status === "cancelling" && settled) {
        status = "cancelled";
        plan = plan.map((p) => (p.status === "pending" ? { ...p, status: "skipped" as const } : p));
      }
      const title = run.plan.find((p) => p.id === e.stepId)?.title ?? e.stepId;
      return withRun(next, { ...run, plan, status, endedAt: status === "cancelled" ? e.at : run.endedAt },
        log(next, e, "step", title, e.status));
    }
    case "effect": {
      const status = EFFECT_STATUS[e.outcome];
      const exists = run.effects.some((f) => f.id === e.effect.id);
      const effects = exists
        ? run.effects.map((f) => (f.id === e.effect.id ? { ...f, ...e.effect, status } : f))
        : [...run.effects, { ...e.effect, status }];
      return withRun(next, { ...run, effects }, log(next, e, "effect", e.effect.description, status));
    }
    case "checkpoint":
      return withRun(next, { ...run, checkpoints: [...run.checkpoints, e.checkpoint] },
        log(next, e, "checkpoint", `Checkpoint: ${e.checkpoint.label}`));
    case "handoff":
      return withRun(next, { ...run, status: "handoff_required", handoff: e.handoff },
        log(next, e, "handoff", "Handed off to a person", "handoff_required"));
  }
  return next;
}

export function stepsAfterCheckpoint(run: Run, checkpointId: string): string[] {
  const cp = run.checkpoints.find((c) => c.id === checkpointId);
  if (!cp?.stepId) return run.plan.map((p) => p.id);
  const at = run.plan.findIndex((p) => p.id === cp.stepId);
  return run.plan.slice(at + 1).map((p) => p.id);
}

export function compensationOrder(run: Run): { reverse: Effect[]; irreversible: Effect[] } {
  const committed = run.effects.filter((f) => f.status === "committed");
  return {
    reverse: committed.filter((f) => f.reversible).reverse(),
    irreversible: committed.filter((f) => !f.reversible),
  };
}

export function runAvatarState(run: Run | null, connection: Connection): AgentState | null {
  if (connection !== "connected") return "offline";
  if (!run) return null;
  switch (run.status) {
    case "proposed":
    case "waiting_for_approval": return "awaiting_approval";
    case "queued": return "queued";
    case "paused": return "paused";
    case "cancelling": return "cancelling";
    case "cancelled": return "idle";
    case "compensating": return "undoing";
    case "compensated":
    case "completed": return "done";
    case "partially_failed": return "partial";
    case "handoff_required": return "handoff";
    case "running": return null;
  }
}
