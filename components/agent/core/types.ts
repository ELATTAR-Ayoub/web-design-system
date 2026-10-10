/**
 * The vocabulary the workspace renders.
 *
 * Everything here is transport-agnostic on purpose. A transport adapter turns
 * one agent's wire protocol into these shapes; another agent gets another
 * adapter and the rest of the component does not move. Nothing in this file
 * imports React, an SDK, or anything from the product.
 */

import type { LucideIcon } from "lucide-react";
import type { RestoredMessage } from "./conversations";
import type { AgentState } from "./states";

/* ── Attachments ─────────────────────────────────────────────────────────────
 *
 * Deliberately one type in both directions. A file the user picks and a file the
 * agent produces are the same object to everything that draws them, which is
 * what stops the transcript growing two parallel renderers that drift.
 *
 * `text` is the content when we actually hold it. `url` is a blob: or data:
 * source for previewing and downloading. Either may be absent: a 40MB PDF has a
 * url and no text, a tool-generated CSV may have text and no url until one is
 * minted for the download link.
 */

export type AttachmentKind = "image" | "document" | "data" | "code" | "audio" | "other";

export type Attachment = {
  id: string;
  name: string;
  /** MIME type as reported by the picker, or asserted by the producing tool. */
  mime: string;
  kind: AttachmentKind;
  /** Bytes. Shown to the user, and what the size cap is enforced against. */
  size: number;
  /** Object URL for preview and download. Revoked when the workspace unmounts. */
  url?: string;
  /**
   * Decoded content, for the kinds where holding it is useful and cheap.
   * This is also what the transport inlines into the message — see
   * `serialiseAttachments` in `attachments.ts`.
   */
  text?: string;
  /** Set by the transport once it knows whether the content actually travelled. */
  delivery?: AttachmentDelivery;
};

/**
 * Whether the agent can genuinely see this attachment.
 *
 * Stated rather than implied, because the honest answer varies by transport and
 * by file type, and a paperclip icon that means "we sent the name" looks exactly
 * like one that means "we sent the file". The workspace renders this.
 */
export type AttachmentDelivery =
  /** Content was inlined into the message. The agent can read it. */
  | { sent: "content" }
  /** Only the filename and type travelled. The agent knows it exists, nothing more. */
  | { sent: "reference"; reason: string }
  /** Produced by the agent, so delivery does not apply. */
  | { sent: "produced" };

/** Classify by MIME first, extension second — pickers lie about MIME often enough. */
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

/* ── Events ──────────────────────────────────────────────────────────────────
 *
 * The wire contract, restated locally. The Lens SDK declares equivalents but
 * does not re-export them from any of its entry points, and restating them is
 * what lets a non-Lens transport exist at all.
 */

export type AgentEvent =
  | { type: "text"; content: string }
  | { type: "tool_call"; name: string; parameters: Record<string, unknown> }
  /**
   * What a running tool has produced so far — a terminal's output, the tests
   * finished yet. Replaces the running call's `partial`; `tool_result` settles it.
   */
  | { type: "tool_progress"; name: string; partial: unknown }
  | {
      type: "tool_result";
      name: string;
      result: { success: boolean; result?: unknown; error?: string };
      /** Files the tool produced. Rendered in the transcript beside the chip. */
      attachments?: Attachment[];
    }
  | { type: "action_request"; correlationId: string; action: string; parameters: Record<string, unknown> }
  | { type: "error"; error: string; fatal: boolean }
  | { type: "done" }
  | { type: "sources"; sources: Source[] }
  | { type: "reasoning"; step: string }
  | { type: "reasoning_done"; ms: number }
  | { type: "confidence"; confidence: import("./run").Confidence }
  /** Follow-up prompts the agent offers under this answer. */
  | { type: "suggestions"; items: string[] }
  | { type: "run"; event: import("./run").RunEvent };

/* ── Sources & regenerations ─────────────────────────────────────────────── */

/** A citation the answer points at. `n` is the footnote number shown inline. */
export type Source = { id: string; n: number; title: string; url: string; domain: string; snippet?: string };

/** One alternative wording of a turn, kept so the user can flip between them. */
export type Version = { id: string; text: string };

/* ── Turns ───────────────────────────────────────────────────────────────── */

export type TurnStatus = "running" | "ok" | "error";

export type UserTurn = {
  kind: "user";
  id: string;
  text: string;
  attachments?: Attachment[];
  /** Prior wordings of this message, when it has been edited. */
  versions?: Version[];
  /** Index into `versions` currently shown, when there are any. */
  activeVersion?: number;
  /** When the message was sent, epoch ms — the meta row's "2m ago". Absent renders no time. */
  at?: number;
};

export type TextTurn = {
  kind: "text";
  id: string;
  text: string;
  attachments?: Attachment[];
  /** When the answer started arriving, epoch ms. Absent renders no time. */
  at?: number;
  /**
   * True while this is the turn the model is still streaming into. The
   * transcript uses it for the cursor, and the resolver uses it to tell
   * "writing" from "written".
   */
  streaming?: boolean;
  /** Citations the answer points at, keyed by footnote number. */
  sources?: Source[];
  /** Prior regenerated answers, when the user asked for another take. */
  regenerations?: Version[];
  /** Index into `regenerations` currently shown, when there are any. */
  activeVersion?: number;
  /** How sure the model says it is about this answer. */
  confidence?: import("./run").Confidence;
  /**
   * Follow-up prompts offered under this answer — distinct from a workspace's
   * starter prompts, which only belong to an empty conversation.
   */
  suggestions?: string[];
  /** The chain-of-thought summary shown collapsed above the answer. */
  reasoning?: { steps: string[]; ms?: number };
  /** The model that wrote this answer, when the transport knows it. */
  model?: string;
};

export type ToolTurn = {
  kind: "tool";
  id: string;
  name: string;
  params: Record<string, unknown>;
  status: TurnStatus;
  result?: unknown;
  /** What the call has produced while still running — see `tool_progress`. */
  partial?: unknown;
  error?: string;
  attachments?: Attachment[];
  /** Wall-clock at dispatch, and how long the call took once settled. */
  startedAt: number;
  ms?: number;
  /** Incremented when the same tool is re-called after a failure. Drives `retrying`. */
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
  /** Set when this action is held at an approval card rather than run. */
  approval?: "pending" | "approved" | "rejected";
};

export type ErrorTurn = { kind: "error"; id: string; message: string; fatal: boolean };

export type AgentTurn = UserTurn | TextTurn | ToolTurn | ActionTurn | ErrorTurn;

/* ── Transport ───────────────────────────────────────────────────────────────
 *
 * The one interface that has to be implemented to point this workspace at a
 * different agent. Everything above the line is pure; everything below it is
 * somebody else's protocol.
 */

export type SendOptions = {
  attachments?: Attachment[];
  /** Chosen in the model picker. A transport that cannot switch models ignores it. */
  model?: string;
  /**
   * What actually goes on the wire, when that differs from what the user wrote.
   *
   * Attachments are folded into the message text — see `serialiseAttachments` —
   * which means the string the agent receives carries file contents and a block
   * explaining what could not be sent. None of that is the user's sentence, and
   * showing it back to them in their own message bubble reads as the product
   * leaking its plumbing. So the transcript keeps `text` and the transport sends
   * this.
   */
  wireText?: string;
  /**
   * Workspace preferences chosen in the settings sheet — autonomy mode,
   * sampling temperature, response length — forwarded only when the
   * transport advertises `capabilities.settings`. A transport with no way to
   * receive these never sees the field at all, so the gate stays honest end
   * to end rather than only hiding the controls that would have set it.
   */
  settings?: {
    autonomy: "ask" | "plan" | "act";
    temperature: number;
    length: number;
    /** The Prompt Bar's effort level, low to high — "Low" … "Max". */
    effort?: string;
  };
  /**
   * Ids of the sources the user picked with @. A transport without retrieval
   * ignores it — nothing renders or forwards this unless
   * `capabilities.sources` is true, the same honesty rule every other
   * `SendOptions` field follows.
   */
  sources?: string[];
  /** The composer's web-search toggle. A transport without search ignores it. */
  webSearch?: boolean;
};

export type AgentTransport = {
  /** The transcript, in order. Owned by the transport so it can settle tool calls. */
  turns: AgentTurn[];
  send: (text: string, options?: SendOptions) => Promise<void>;
  abort: () => void;
  reset: () => void;
  isLoading: boolean;
  error: Error | null;
  /**
   * False while the transport is still acquiring whatever it needs before it can
   * carry a message — a session cookie, a socket, a warm handler. The composer
   * disables itself rather than dropping the first message on the floor.
   */
  isReady: boolean;
  /**
   * Replace the timeline with a stored conversation.
   *
   * The transport owns `turns`, so it is what restores them. Optional: a
   * transport with no history behind it simply does not implement this, and the
   * workspace renders no history control.
   */
  restore?: (messages: RestoredMessage[]) => void;
  /**
   * Requests the transport is holding at an approval gate, keyed by turn id.
   * Answering one resolves the promise the agent is blocked on.
   */
  pendingApprovals: PendingApproval[];
  /** Advertised so the workspace can render only what this agent can actually do. */
  capabilities: TransportCapabilities;
  /**
   * The agent-side session this conversation is running under, when the
   * transport has one. Stored alongside a conversation so reopening it resumes
   * the agent's own memory rather than starting a stranger behind an old title.
   */
  sessionId?: string;

  /* ── Run lifecycle ─────────────────────────────────────────────────────
   *
   * All optional. A transport with no run model (most of them, today) simply
   * does not implement these, and the workspace renders none of the plan/queue/
   * checkpoint UI — `capabilities` is what a control actually gates on, this
   * is what makes the gate honest.
   */

  /** The run in progress, when the transport has one. */
  runState?: import("./run").RunState;
  /** Approve a proposed or edited plan. `plan` when the caller is also editing it. */
  approvePlan?: (version: number, plan?: import("./run").PlanStep[]) => void;
  pause?: () => void;
  resume?: (checkpointId?: string) => void | Promise<void>;
  cancel?: () => void;
  skipStep?: (stepId: string) => void;
  retryStep?: (stepId: string) => void;
  /** Re-confirms a low-confidence step, clearing its `ConfidenceMark` banner. */
  verifyStep?: (stepId: string) => void;
  retryEffect?: (effectId: string) => void;
  compensate?: () => void;
  /** Hand the run to a person. `owner` names who takes it, when the caller chose one. */
  handoff?: (note?: string, owner?: string) => void;
  /**
   * Answers an approval gate that requires a one-time code rather than a
   * plain yes/no. `false` means the code was wrong — the caller (`CodeGate`,
   * `components/agent/parts/approval-card.tsx`) clears the field and shows an
   * inline error rather than silently doing nothing. `true`, `void` or a
   * promise of either means it landed; `void` is kept for backward
   * compatibility with a transport (such as the mock) written before this
   * type widened.
   */
  approveWithCode?: (code: string) => boolean | Promise<boolean> | void;

  /* ── Queue ─────────────────────────────────────────────────────────────── */

  enqueue?: (text: string, options?: SendOptions) => void;
  reorderQueue?: (ids: string[]) => void;
  dequeue?: (id: string) => void;
  sendQueuedNow?: (id: string) => void;

  /* ── Editing & branching ──────────────────────────────────────────────── */

  editMessage?: (turnId: string, text: string) => Promise<void>;
  regenerate?: (turnId: string) => Promise<void>;
  selectBranch?: (turnId: string, index: number) => void;

  /* ── Context, checkpoints, identity ───────────────────────────────────── */

  /** How full the model's context window is. Absent renders no meter. */
  usage?: ContextUsage;
  /** Condense the conversation so far to free context. */
  summarise?: () => void | Promise<void>;
  /**
   * Return the conversation to how it stood right after `turnId`, dropping
   * everything later. The chat-level restore point; a run's own checkpoints
   * resume through `resume(checkpointId)`.
   */
  restoreTo?: (turnId: string) => void;
  /** Chat-level restore points, each drawn after its `turnId`; restoring one calls `restoreTo`. */
  restorePoints?: import("./run").Checkpoint[];
  /** What this agent is, for "About this agent". Absent renders no section. */
  agent?: AgentProfile;
  /**
   * Server-side speech-to-text. When present, the composer's speech input records
   * audio from the input device the user chose and sends it here; the returned
   * text goes into the message box. Absent, it falls back to the browser's own
   * recogniser, which cannot pick a device.
   */
  transcribe?: (audio: Blob) => Promise<string>;
};

/** Token accounting for the context meter. Counts are tokens. */
export type ContextUsage = {
  usedTokens: number;
  maxTokens: number;
  inputTokens?: number;
  outputTokens?: number;
  reasoningTokens?: number;
  cachedInputTokens?: number;
  /** The model the counts are for — prices the cost line when the meter knows it. */
  modelId?: string;
};

export type AgentProfile = {
  name: string;
  model?: string;
  instructions?: string;
  tools?: { name: string; description: string; schema?: Record<string, unknown> }[];
  /** JSON schema of the structured output, when the agent has one. */
  outputSchema?: string;
};

export type PendingApproval = {
  /** The ActionTurn this belongs to. */
  turnId: string;
  action: string;
  params: Record<string, unknown>;
  approve: () => void;
  reject: (reason?: string) => void;
};

export type TransportCapabilities = {
  /** Can carry attachment *content*, not just filenames. */
  attachments: "content" | "reference" | "none";
  /** Can the model be chosen per message. */
  models: boolean;
  /** Can a tool call or action be held for the user to approve. */
  approvals: boolean;
  /** Can propose and run a multi-step plan. */
  plans?: boolean;
  /** Can pause a running plan and resume it later. */
  pause?: boolean;
  /** Can resume from a saved checkpoint. */
  checkpoints?: boolean;
  /** Can hold messages sent while a run is busy, in order, for later delivery. */
  queue?: boolean;
  /** Can undo its own committed effects. */
  compensation?: boolean;
  /** Can retry a single failed or unknown effect. */
  effects?: boolean;
  /** Can hand a stuck run off to a person. */
  handoff?: boolean;
  /** Can regenerate a turn or switch between alternative answers. */
  branching?: boolean;
  /** Can attach citations to an answer. */
  sources?: boolean;
  /** Can receive per-message settings (autonomy, temperature, response length) via `SendOptions.settings`. */
  settings?: boolean;
};

/* ── Resolver input ──────────────────────────────────────────────────────── */

/**
 * Everything outside the transcript that changes what the face should show.
 * Kept separate from the turns so `resolveState` stays a pure function of its
 * arguments and can be tested without a DOM.
 */
export type AgentSignals = {
  isLoading: boolean;
  /** True between hitting send and the first event coming back. */
  awaitingFirstEvent: boolean;
  /** A state the agent asserted about itself. Wins over everything derived. */
  declared?: AgentState | null;
};

/* ── Composer vocabulary ─────────────────────────────────────────────────────
 *
 * What the workspace composer's menus and pickers are made of. They live here,
 * with the rest of the vocabulary, so the workspace imports nothing from the
 * older agent files.
 */

/** One thing `@` can pull into a message. */
export type PromptSource = { id: string; label: string; description?: string; icon?: LucideIcon };

/** A `/` command or a + menu skill. `run` and `directive` are mutually exclusive. */
export type AgentCommand = {
  id: string;
  label: string;
  hint?: string;
  group: "command" | "skill";
  /**
   * The glyph shown in the plus menu and the slash palette. Usually derived from
   * the state the command's tool maps to — see `state-icons.ts` — so one
   * capability carries one mark everywhere it appears.
   */
  icon?: LucideIcon;
  /** Runs in the browser. Mutually exclusive with `directive`. */
  run?: () => void;
  /** Text written into the composer for the user to send. */
  directive?: string;
};

/** One entry of the composer's model picker. */
export type ModelOption = { value: string; label: string; description?: string };

/** Effort levels, low to high; the last arms the spark field. */
export const DEFAULT_EFFORTS = ["Low", "Medium", "High", "Extra", "Max"] as const;
