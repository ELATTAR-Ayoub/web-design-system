export const AGENT_STATES = [
  "idle",
  "queued",
  "planning",
  "retrieving",
  "ingesting",
  "running",
  "delegating",
  "awaiting_approval",
  "validating",
  "retrying",
  "error",
  "summarizing",
  "thinking",
  "processing",
  "calling_tools",
  "searching",
  "reading",
  "recalling",
  "writing",
  "done",
  "paused",
  "cancelling",
  "undoing",
  "partial",
  "handoff",
  "offline",
] as const;

export type AgentState = (typeof AGENT_STATES)[number];

export const AGENT_STATE_LABEL: Record<AgentState, string> = {
  idle: "Ready",
  queued: "Queued",
  planning: "Planning",
  retrieving: "Retrieving knowledge",
  ingesting: "Ingesting data",
  running: "Running code",
  delegating: "Delegating to agent",
  awaiting_approval: "Awaiting approval",
  validating: "Validating",
  retrying: "Retrying",
  error: "Something went wrong",
  summarizing: "Summarizing",
  thinking: "Thinking",
  processing: "Processing",
  calling_tools: "Calling tools",
  searching: "Searching",
  reading: "Reading files",
  recalling: "Recalling context",
  writing: "Writing",
  done: "Done",
  paused: "Paused",
  cancelling: "Stopping",
  undoing: "Undoing changes",
  partial: "Partly done",
  handoff: "Needs a person",
  offline: "Reconnecting",
};

const RESTING: ReadonlySet<AgentState> = new Set<AgentState>([
  "idle",
  "done",
  "error",
  "paused",
  "partial",
  "handoff",
]);

export function isBusy(state: AgentState): boolean {
  return !RESTING.has(state);
}

const NARRATING: ReadonlySet<AgentState> = new Set<AgentState>([
  "planning",
  "summarizing",
  "writing",
]);

export function isNarrating(state: AgentState): boolean {
  return NARRATING.has(state);
}

export type ToolStateMap = Record<string, AgentState>;

export function stateForTool(name: string, map: ToolStateMap | undefined): AgentState | null {
  if (!map) return null;
  const exact = map[name];
  if (exact) return exact;

  // Longest prefix wins, regardless of declaration order.
  let best: { key: string; state: AgentState } | null = null;
  for (const [key, state] of Object.entries(map)) {
    if (!key.endsWith(".") && !key.endsWith("_")) continue;
    if (!name.startsWith(key)) continue;
    if (!best || key.length > best.key.length) best = { key, state };
  }
  return best?.state ?? null;
}
