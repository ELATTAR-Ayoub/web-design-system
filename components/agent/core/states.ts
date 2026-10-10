/**
 * What the agent can be seen to be doing.
 *
 * Twenty-six states: the twenty from the avatar handoff's enum, plus six the
 * run lifecycle forces (`run.ts`), so the vocabulary and the artwork can never
 * drift apart. This file is the contract between three things
 * that otherwise know nothing about each other: the resolver that decides which
 * state is true, the avatar that draws it, and the caller that maps its own tool
 * names onto it.
 *
 * The list is deliberately closed. A caller who needs a state that is not here
 * is describing something the avatar cannot draw, and silently falling back to
 * a generic "working" is how a status indicator starts lying.
 */

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

/**
 * The sentence shown beside the face, and the accessible name for it.
 *
 * Present participles with an ellipsis for anything ongoing, bare words for the
 * three resting states — the punctuation is doing work, so a glance at the text
 * alone tells you whether to wait.
 */
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

/**
 * Which states mean "still working".
 *
 * The composer disables its send button on these, and the launcher shows its
 * live dot. `awaiting_approval` is busy but not blocking — the whole point is
 * that the user is the one who has to act — so it is listed as busy and handled
 * separately wherever that distinction matters.
 */
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

/**
 * States that are the agent's own voice rather than its hands.
 *
 * Used to decide whether the transcript should show a typing cursor: the model
 * is emitting prose in these, and emitting nothing visible in the rest.
 */
const NARRATING: ReadonlySet<AgentState> = new Set<AgentState>([
  "planning",
  "summarizing",
  "writing",
]);

export function isNarrating(state: AgentState): boolean {
  return NARRATING.has(state);
}

/**
 * A tool name → state map.
 *
 * This is the seam that lets one component describe any agent's work. The
 * resolver owns the twelve states it can prove from the event stream; the other
 * eight exist only because the caller knows what its own tools do. Keys are
 * matched exactly first, then by prefix on a `.` or `_` boundary, so a caller
 * can map a whole family (`finance.` → retrieving) without listing every member.
 */
export type ToolStateMap = Record<string, AgentState>;

export function stateForTool(name: string, map: ToolStateMap | undefined): AgentState | null {
  if (!map) return null;
  const exact = map[name];
  if (exact) return exact;

  // Longest prefix wins, so a specific `finance.forecast` mapping beats a
  // blanket `finance.` one regardless of declaration order.
  let best: { key: string; state: AgentState } | null = null;
  for (const [key, state] of Object.entries(map)) {
    if (!key.endsWith(".") && !key.endsWith("_")) continue;
    if (!name.startsWith(key)) continue;
    if (!best || key.length > best.key.length) best = { key, state };
  }
  return best?.state ?? null;
}
