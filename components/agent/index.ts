/**
 * The agent workspace — public surface.
 *
 * Everything a caller needs, and nothing they should not reach for. The internal
 * shape of `core/`, `avatar/`, `voice/`, `parts/` and `workspace/` is free to
 * move as long as this file keeps its promises.
 *
 * To point the workspace at a different agent, implement `AgentTransport`.
 * To give it a different face, implement `AvatarRenderer`.
 * To give it a different voice, implement `SpeechAdapter`.
 */

/* The block itself: the one complete agent surface, built from AI Elements —
 * history sidebar, header, the reply thread with its run inline, and composer. */
export { AgentWorkspace } from "./agent-workspace";
export type { AgentWorkspaceProps } from "./agent-workspace";

/* The state machine. */
export { AGENT_STATES, AGENT_STATE_LABEL, isBusy, isNarrating, stateForTool } from "./core/states";
export type { AgentState, ToolStateMap } from "./core/states";
export { resolveState } from "./core/resolve-state";
export type { ResolveInput } from "./core/resolve-state";

/* The timeline. */
export { markApproval, reduceEvent, settleAction, stripProtocol, userTurn } from "./core/timeline";
export type {
  ActionTurn,
  AgentCommand,
  AgentEvent,
  AgentSignals,
  AgentTransport,
  AgentTurn,
  Attachment,
  AttachmentDelivery,
  AttachmentKind,
  ErrorTurn,
  ModelOption,
  PendingApproval,
  PromptSource,
  SendOptions,
  TextTurn,
  ToolTurn,
  Source,
  TransportCapabilities,
  TurnStatus,
  UserTurn,
} from "./core/types";
export { DEFAULT_EFFORTS, attachmentKind } from "./core/types";

/* Attachments, both directions. */
export {
  MAX_FILE_BYTES,
  MAX_INLINE_CHARS,
  extractProduced,
  formatBytes,
  readAttachment,
  serialiseAttachments,
  withoutProduced,
} from "./core/attachments";
export type { ProducedAttachment } from "./core/attachments";

/* The face.
 *
 * `AgentAvatar` is the public name; `CubeAvatar` is the file that happens to
 * implement it today, and the cube is a rendering decision rather than part of
 * the vocabulary. The renderer's own internals — the scene graph, its
 * primitives, its per-frame helpers — are deliberately NOT exported: a caller
 * that reached for `CubeScene` would be writing against the cube rather than
 * against the avatar, and replacing the cube would then be a breaking change
 * for them. `AvatarRenderer` is the seam for a different face. */
export { CubeAvatar as AgentAvatar } from "./avatar/cube-avatar";
export type { AvatarRenderer, AvatarRendererProps, AvatarSize } from "./avatar/types";

/* The voice. */
export { useBrowserSpeech, speakableText } from "./voice/speech";
export type { SpeechAdapter, SpeechVoice } from "./voice/speech";

/* Chat history — the fourth seam. */
export type {
  ConversationStore,
  ConversationSummary,
  RestoredMessage,
} from "./core/conversations";

/* The two parts built here for the composer. */
export { EffortSlider } from "./parts/effort-slider";
export type { EffortSliderProps } from "./parts/effort-slider";
export { SparkField } from "./parts/spark-field";
export type { SparkFieldHandle } from "./parts/spark-field";

/* Transports.
 *
 * The workspace ships without one, deliberately. A transport is the seam between
 * this component and whatever is actually answering, and every product answers
 * differently — so the system defines the contract (`AgentTransport`, above) and
 * leaves the implementation to the product. `lib/agent/mock-transport.ts` is a
 * complete, offline reference implementation; read that before writing a real
 * one. */
