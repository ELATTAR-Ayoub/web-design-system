/**
 * The one adapter between our transcript and AI Elements.
 *
 * AI Elements is written against the AI SDK's message parts: one assistant
 * message per reply, one seven-value state per tool part, an approval object
 * on the part it gates. Our transcript is flatter — a run of `AgentTurn`s,
 * tools and approvals as separate kinds, a run model beside it. Everything
 * the workspace draws goes through these functions, so the translation lives
 * in one tested place instead of being re-derived inside each component.
 *
 * Pure: no React, no DOM. Types from `ai` are imported as types only.
 */

import type { LanguageModelUsage, ToolUIPart } from "ai";

import type { QueueMessage } from "@/components/ai-elements/queue";

import type { Checkpoint, QueueItem, RunStatus, StepStatus } from "@/components/agent/core/run";
import type {
  ActionTurn,
  AgentTurn,
  Attachment,
  ContextUsage,
  Source,
  ToolTurn,
  UserTurn,
} from "@/components/agent/core/types";

/* ── Replies ─────────────────────────────────────────────────────────────── */

/** One assistant reply: every turn between two user turns, in order. */
export type Reply = {
  /** First turn's id. */
  id: string;
  /** The user turn it answers. */
  userTurnId: string;
  /** Text / tool / action / error turns, in order. */
  turns: AgentTurn[];
  /** All text turns joined (Copy, Read aloud). */
  text: string;
  /** Merged, de-duplicated by url, in first-seen order. */
  sources: Source[];
  /** A text turn still streams, or the transport is busy on this last reply. */
  streaming: boolean;
  /** First turn's `at`, when it has one. */
  at?: number;
};

export type ReplyPair = { user: UserTurn; reply: Reply | null };

/**
 * Pair every user turn with the reply that answers it.
 *
 * A user turn with nothing after it yet has `reply: null` — the thread draws
 * the waiting state there. Turns before the first user turn have no question
 * to answer and are not paired; every transport here starts a transcript
 * with the user's send, so none exist in practice.
 */
export function groupReplies(turns: AgentTurn[], busy: boolean): ReplyPair[] {
  const pairs: { user: UserTurn; turns: AgentTurn[] }[] = [];
  for (const turn of turns) {
    if (turn.kind === "user") pairs.push({ user: turn, turns: [] });
    else pairs.at(-1)?.turns.push(turn);
  }
  return pairs.map((pair, i) => ({
    user: pair.user,
    reply: pair.turns.length ? toReply(pair.user.id, pair.turns, busy && i === pairs.length - 1) : null,
  }));
}

/**
 * Which user turn a run answers: the last one sent at or before the run
 * started. The run's Plan, Task and Commit render inside that turn's reply.
 * Falls back to the last user turn when none carries a time, and null only
 * when there is no user turn at all.
 */
export function runOwner(pairs: ReplyPair[], runStartedAt: number): string | null {
  let owner: string | null = null;
  for (const { user } of pairs) {
    if (user.at === undefined || user.at <= runStartedAt) owner = user.id;
  }
  return owner ?? pairs.at(-1)?.user.id ?? null;
}

function toReply(userTurnId: string, turns: AgentTurn[], lastAndBusy: boolean): Reply {
  const first = turns[0];
  const texts = turns.filter((t) => t.kind === "text");
  return {
    id: first.id,
    userTurnId,
    turns,
    text: texts.map((t) => t.text.trim()).filter(Boolean).join("\n\n"),
    sources: mergeSources(texts.flatMap((t) => t.sources ?? [])),
    streaming: lastAndBusy || texts.some((t) => t.streaming),
    at: "at" in first ? first.at : undefined,
  };
}

function mergeSources(sources: Source[]): Source[] {
  const seen = new Set<string>();
  return sources.filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)));
}

/**
 * Run statuses during which the run is still going — a new message waits in the
 * queue, and the reply that owns the run is not finished (no actions, no
 * follow-ups) even when nothing is streaming, e.g. while it is paused.
 */
export const RUN_IN_FLIGHT: ReadonlySet<RunStatus> = new Set(["queued", "running", "paused", "waiting_for_approval", "cancelling"]);

/* ── Tools and approvals ─────────────────────────────────────────────────── */

export type ToolState = ToolUIPart["state"];

/**
 * The AI Elements `Tool` state for a tool call or a gated action.
 *
 * We carry a call's progress (`status`) and its approval separately; AI
 * Elements carries one value. The approval wins while it is open or refused,
 * then the call's own status takes over. There is no `input-streaming`: our
 * tool turns exist only once their parameters are complete.
 */
export function toolState(turn: ToolTurn | ActionTurn): ToolState {
  if (turn.kind === "action" && turn.approval) {
    if (turn.approval === "pending") return "approval-requested";
    if (turn.approval === "rejected") return "output-denied";
    if (turn.status === "running") return "approval-responded";
  }
  if (turn.status === "running") return "input-available";
  return turn.status === "ok" ? "output-available" : "output-error";
}

/** AI Elements' `ToolUIPartApproval` — the shape `Confirmation` reads. */
export type ToolApproval =
  | { id: string; approved?: never; reason?: never }
  | { id: string; approved: true; reason?: string }
  | { id: string; approved: false; reason?: string }
  | undefined;

/** The `approval` prop for `Confirmation`, or undefined for an ungated action. */
export function toolApproval(turn: ActionTurn): ToolApproval {
  switch (turn.approval) {
    case "pending": return { id: turn.id };
    case "approved": return { id: turn.id, approved: true };
    case "rejected": return { id: turn.id, approved: false, reason: turn.error };
    default: return undefined;
  }
}

/* ── Plan, task, queue ───────────────────────────────────────────────────── */

export type { QueueMessage };

/** `ChainOfThoughtStep` status for a plan step. Failed and skipped steps are finished. */
export function stepChainStatus(status: StepStatus): "complete" | "active" | "pending" {
  if (status === "running") return "active";
  if (status === "pending") return "pending";
  return "complete";
}

/** Messages held behind a busy run, as `Queue` messages: the text, then each file. */
export function queueMessages(queue: QueueItem[]): QueueMessage[] {
  return queue.map((item) => ({
    id: item.id,
    parts: [
      { type: "text", text: item.text },
      ...(item.attachments ?? []).map((a) => ({
        type: "file",
        url: a.url,
        filename: a.name,
        mediaType: a.mime,
      })),
    ],
  }));
}

/* ── Checkpoints ─────────────────────────────────────────────────────────── */

/**
 * Restore points keyed by the turn they follow, so the thread can draw each
 * `Checkpoint` right after its turn. Several on one turn keep their order.
 */
export function checkpointsByTurn(checkpoints: Checkpoint[]): Map<string, Checkpoint[]> {
  const byTurn = new Map<string, Checkpoint[]>();
  for (const cp of checkpoints) byTurn.set(cp.turnId, [...(byTurn.get(cp.turnId) ?? []), cp]);
  return byTurn;
}

/* ── Context ─────────────────────────────────────────────────────────────── */

export type ContextMeterProps = {
  usedTokens: number;
  maxTokens: number;
  usage?: LanguageModelUsage;
  modelId?: string;
};

/** Our token accounting as the props AI Elements' `Context` takes. */
export function contextProps(usage: ContextUsage): ContextMeterProps {
  const hasBreakdown =
    usage.inputTokens !== undefined ||
    usage.outputTokens !== undefined ||
    usage.reasoningTokens !== undefined ||
    usage.cachedInputTokens !== undefined;
  return {
    usedTokens: usage.usedTokens,
    maxTokens: usage.maxTokens,
    modelId: usage.modelId,
    usage: hasBreakdown
      ? {
          inputTokens: usage.inputTokens,
          inputTokenDetails: {
            noCacheTokens: undefined,
            cacheReadTokens: usage.cachedInputTokens,
            cacheWriteTokens: undefined,
          },
          outputTokens: usage.outputTokens,
          outputTokenDetails: { textTokens: undefined, reasoningTokens: usage.reasoningTokens },
          totalTokens: usage.usedTokens,
          reasoningTokens: usage.reasoningTokens,
          cachedInputTokens: usage.cachedInputTokens,
        }
      : undefined,
  };
}

/* ── Images ──────────────────────────────────────────────────────────────── */

export type GeneratedImage = { base64: string; uint8Array: Uint8Array; mediaType: string };

/**
 * An image attachment as the `Image` component's props, when its bytes are
 * inline (a `data:` url). A blob: or remote url has no base64 to hand over —
 * null, and the caller draws it as an attachment instead. So is a data url
 * whose payload does not decode.
 */
export function generatedImage(attachment: Attachment): GeneratedImage | null {
  const match = attachment.url?.match(/^data:([^;,]+);base64,([\s\S]*)$/);
  if (!match) return null;
  const [, mediaType, base64] = match;
  let binary: string;
  try {
    binary = atob(base64);
  } catch {
    // Not valid base64 after all — no bytes to hand over.
    return null;
  }
  const uint8Array = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return { base64, uint8Array, mediaType };
}
