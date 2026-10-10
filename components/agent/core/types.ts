import type { LucideIcon } from "lucide-react";
import type { RestoredMessage } from "./conversations";
import type { AgentState } from "./states";

export type AttachmentKind = "image" | "document" | "data" | "code" | "audio" | "other";

export type Attachment = {
  id: string;
  name: string;
  mime: string;
  kind: AttachmentKind;
  size: number;
  url?: string;
  text?: string;
  delivery?: AttachmentDelivery;
};

export type AttachmentDelivery =
  | { sent: "content" }
  | { sent: "reference"; reason: string }
  | { sent: "produced" };

export function attachmentKind(mime: string, name: string): AttachmentKind {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  const ext = name.slice(name.lastIndexOf(".") + 1).toLowerCase();
  if (mime === "application/pdf" || ext === "pdf") return "document";
  if (/^(docx?|odt|rtf|pages)$/.test(ext)) return "document";
  if (/^(csv|tsv|json|xlsx?|ods|parquet)$/.test(ext)) return "data";
  if (mime === "application/json" || mime === "text/csv") return "data";
  if (/^(ts|tsx|js|jsx|py|rb|go|rs|java|c|h|cpp|sql|sh|yml|yaml|toml|css|html)$/.test(ext)) {
    return "code";
  }
  if (mime.startsWith("text/") || /^(txt|md|log)$/.test(ext)) return "other";
  return "other";
}

export type AgentEvent =
  | { type: "text"; content: string }
  | { type: "tool_call"; name: string; parameters: Record<string, unknown> }
  | { type: "tool_progress"; name: string; partial: unknown }
  | {
      type: "tool_result";
      name: string;
      result: { success: boolean; result?: unknown; error?: string };
      attachments?: Attachment[];
    }
  | { type: "action_request"; correlationId: string; action: string; parameters: Record<string, unknown> }
  | { type: "error"; error: string; fatal: boolean }
  | { type: "done" }
  | { type: "sources"; sources: Source[] }
  | { type: "reasoning"; step: string }
  | { type: "reasoning_done"; ms: number }
  | { type: "confidence"; confidence: import("./run").Confidence }
  | { type: "suggestions"; items: string[] }
  | { type: "run"; event: import("./run").RunEvent };

export type Source = { id: string; n: number; title: string; url: string; domain: string; snippet?: string };

export type Version = { id: string; text: string };

export type TurnStatus = "running" | "ok" | "error";

export type UserTurn = {
  kind: "user";
  id: string;
  text: string;
  attachments?: Attachment[];
  versions?: Version[];
  activeVersion?: number;
  at?: number;
};

export type TextTurn = {
  kind: "text";
  id: string;
  text: string;
  attachments?: Attachment[];
  at?: number;
  streaming?: boolean;
  sources?: Source[];
  regenerations?: Version[];
  activeVersion?: number;
  confidence?: import("./run").Confidence;
  suggestions?: string[];
  reasoning?: { steps: string[]; ms?: number };
  model?: string;
};

export type ToolTurn = {
  kind: "tool";
  id: string;
  name: string;
  params: Record<string, unknown>;
  status: TurnStatus;
  result?: unknown;
  partial?: unknown;
  error?: string;
  attachments?: Attachment[];
  startedAt: number;
  ms?: number;
  attempt: number;
};

export type ActionTurn = {
  kind: "action";
  id: string;
  action: string;
  params: Record<string, unknown>;
  status: TurnStatus;
  error?: string;
  startedAt: number;
  ms?: number;
  approval?: "pending" | "approved" | "rejected";
};

export type ErrorTurn = { kind: "error"; id: string; message: string; fatal: boolean };

export type AgentTurn = UserTurn | TextTurn | ToolTurn | ActionTurn | ErrorTurn;

export type SendOptions = {
  attachments?: Attachment[];
  model?: string;
  wireText?: string;
  settings?: {
    autonomy: "ask" | "plan" | "act";
    temperature: number;
    length: number;
    effort?: string;
  };
  sources?: string[];
  webSearch?: boolean;
};

export type AgentTransport = {
  turns: AgentTurn[];
  send: (text: string, options?: SendOptions) => Promise<void>;
  abort: () => void;
  reset: () => void;
  isLoading: boolean;
  error: Error | null;
  isReady: boolean;
  restore?: (messages: RestoredMessage[]) => void;
  pendingApprovals: PendingApproval[];
  capabilities: TransportCapabilities;
  sessionId?: string;

  runState?: import("./run").RunState;
  approvePlan?: (version: number, plan?: import("./run").PlanStep[]) => void;
  pause?: () => void;
  resume?: (checkpointId?: string) => void | Promise<void>;
  cancel?: () => void;
  skipStep?: (stepId: string) => void;
  retryStep?: (stepId: string) => void;
  verifyStep?: (stepId: string) => void;
  retryEffect?: (effectId: string) => void;
  compensate?: () => void;
  handoff?: (note?: string, owner?: string) => void;
  approveWithCode?: (code: string) => boolean | Promise<boolean> | void;

  enqueue?: (text: string, options?: SendOptions) => void;
  reorderQueue?: (ids: string[]) => void;
  dequeue?: (id: string) => void;
  sendQueuedNow?: (id: string) => void;

  editMessage?: (turnId: string, text: string) => Promise<void>;
  regenerate?: (turnId: string) => Promise<void>;
  selectBranch?: (turnId: string, index: number) => void;

  usage?: ContextUsage;
  summarise?: () => void | Promise<void>;
  restoreTo?: (turnId: string) => void;
  restorePoints?: import("./run").Checkpoint[];
  agent?: AgentProfile;
  transcribe?: (audio: Blob) => Promise<string>;
};

export type ContextUsage = {
  usedTokens: number;
  maxTokens: number;
  inputTokens?: number;
  outputTokens?: number;
  reasoningTokens?: number;
  cachedInputTokens?: number;
  modelId?: string;
};

export type AgentProfile = {
  name: string;
  model?: string;
  instructions?: string;
  tools?: { name: string; description: string; schema?: Record<string, unknown> }[];
  outputSchema?: string;
};

export type PendingApproval = {
  turnId: string;
  action: string;
  params: Record<string, unknown>;
  approve: () => void;
  reject: (reason?: string) => void;
};

export type TransportCapabilities = {
  attachments: "content" | "reference" | "none";
  models: boolean;
  approvals: boolean;
  plans?: boolean;
  pause?: boolean;
  checkpoints?: boolean;
  queue?: boolean;
  compensation?: boolean;
  effects?: boolean;
  handoff?: boolean;
  branching?: boolean;
  sources?: boolean;
  settings?: boolean;
};

export type AgentSignals = {
  isLoading: boolean;
  awaitingFirstEvent: boolean;
  declared?: AgentState | null;
};

export type PromptSource = { id: string; label: string; description?: string; icon?: LucideIcon };

export type AgentCommand = {
  id: string;
  label: string;
  hint?: string;
  group: "command" | "skill";
  icon?: LucideIcon;
  run?: () => void;
  directive?: string;
};

export type ModelOption = { value: string; label: string; description?: string };

export const DEFAULT_EFFORTS = ["Low", "Medium", "High", "Extra", "Max"] as const;
