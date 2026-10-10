export { AgentWorkspace } from "./agent-workspace";
export type { AgentWorkspaceProps } from "./agent-workspace";

export { AGENT_STATES, AGENT_STATE_LABEL, isBusy, isNarrating, stateForTool } from "./core/states";
export type { AgentState, ToolStateMap } from "./core/states";
export { resolveState } from "./core/resolve-state";
export type { ResolveInput } from "./core/resolve-state";

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

export { CubeAvatar as AgentAvatar } from "./avatar/cube-avatar";
export type { AvatarRenderer, AvatarRendererProps, AvatarSize } from "./avatar/types";

export { useBrowserSpeech, speakableText } from "./voice/speech";
export type { SpeechAdapter, SpeechVoice } from "./voice/speech";

export type {
  ConversationStore,
  ConversationSummary,
  RestoredMessage,
} from "./core/conversations";

export { EffortSlider } from "./parts/effort-slider";
export type { EffortSliderProps } from "./parts/effort-slider";
export { SparkField } from "./parts/spark-field";
export type { SparkFieldHandle } from "./parts/spark-field";

