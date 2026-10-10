"use client";

/**
 * The frozen state atlas for the `agent-workspace` documentation page.
 *
 * A server spec module cannot hold `useState` (trap 29), so — like every
 * other `component-docs/**` page — the atlas lives in its own client file.
 * Unlike `workspace-live-specimen.tsx`, nothing here is wired to a
 * transport: every grid is static props only. Each grid answers one question:
 * "what does this state look like", not "how do you get there" — the live
 * specimen next to it already answers that.
 *
 * Two grids:
 *  1. All 12 run statuses, each beside the mark a plan step wears in the
 *     workspace (`StepStatusMark`).
 *  2. All 26 avatar states (`AgentAvatar` + `AGENT_STATE_LABEL`).
 */

import { AGENT_STATES, AGENT_STATE_LABEL, AgentAvatar, type AgentState } from "@/components/agent";
import { RUN_STATUS_LABEL, type RunStatus, type StepStatus } from "@/components/agent/core/run";
import { STEP_STATUS_LABEL, StepStatusMark } from "@/components/agent/workspace/step-status";
import { DsSection, StateCell, StateGrid } from "@/components/ds/kit";

/* ── 1. Run statuses ─────────────────────────────────────────────────────── */

const RUN_STATUSES: RunStatus[] = [
  "proposed", "queued", "running", "paused", "waiting_for_approval",
  "partially_failed", "cancelling", "cancelled", "compensating",
  "compensated", "handoff_required", "completed",
];

/**
 * `StepStatus` is the five-value vocabulary of ONE step, not the twelve-value
 * `RunStatus` of the whole run. Documentation-only map: nothing shared reads
 * it, so a drift here cannot break a real screen — only this atlas's picture
 * of "what does a `RunStatus` look like" once flattened onto a step's mark.
 */
const RUN_TO_STEP: Record<RunStatus, StepStatus> = {
  proposed: "pending",
  queued: "pending",
  running: "running",
  paused: "pending",
  waiting_for_approval: "pending",
  partially_failed: "failed",
  cancelling: "running",
  cancelled: "skipped",
  compensating: "running",
  compensated: "done",
  handoff_required: "failed",
  completed: "done",
};

export function RunStatusAtlas() {
  return (
    <StateGrid cols={4}>
      {RUN_STATUSES.map((status) => (
        <StateCell key={status} label={RUN_STATUS_LABEL[status]} note={status}>
          <div className="flex items-center gap-2">
            <StepStatusMark status={RUN_TO_STEP[status]} decorative />
            <span className="type-small text-muted-foreground">{STEP_STATUS_LABEL[RUN_TO_STEP[status]]}</span>
          </div>
        </StateCell>
      ))}
    </StateGrid>
  );
}

/* ── 2. Avatar states ────────────────────────────────────────────────────── */

export function AvatarStateAtlas() {
  return (
    <StateGrid cols={6}>
      {AGENT_STATES.map((state: AgentState) => (
        <StateCell key={state} label={AGENT_STATE_LABEL[state]} note={state}>
          <AgentAvatar state={state} size="sm" />
        </StateCell>
      ))}
    </StateGrid>
  );
}

/* ── Export ──────────────────────────────────────────────────────────────── */

export function WorkspaceAtlas() {
  return (
    <div className="flex flex-col">
      <DsSection
        id="atlas-run-status"
        title="Run statuses"
        description="All 12 RunStatus values — RUN_STATUS_LABEL beside the StepStatusMark a step wears in the workspace, mapped for display only."
      >
        <RunStatusAtlas />
      </DsSection>
      <DsSection
        id="atlas-avatar-states"
        title="Avatar states"
        description="All 26 AgentState values — AgentAvatar and AGENT_STATE_LABEL."
      >
        <AvatarStateAtlas />
      </DsSection>
    </div>
  );
}
