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

export type Reply = {
  id: string;
  userTurnId: string;
  turns: AgentTurn[];
  text: string;
  sources: Source[];
  streaming: boolean;
  at?: number;
};

export type ReplyPair = { user: UserTurn; reply: Reply | null };

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

export const RUN_IN_FLIGHT: ReadonlySet<RunStatus> = new Set(["queued", "running", "paused", "waiting_for_approval", "cancelling"]);

export type ToolState = ToolUIPart["state"];

export function toolState(turn: ToolTurn | ActionTurn): ToolState {
  if (turn.kind === "action" && turn.approval) {
    if (turn.approval === "pending") return "approval-requested";
    if (turn.approval === "rejected") return "output-denied";
    if (turn.status === "running") return "approval-responded";
  }
  if (turn.status === "running") return "input-available";
  return turn.status === "ok" ? "output-available" : "output-error";
}

export type ToolApproval =
  | { id: string; approved?: never; reason?: never }
  | { id: string; approved: true; reason?: string }
  | { id: string; approved: false; reason?: string }
  | undefined;

export function toolApproval(turn: ActionTurn): ToolApproval {
  switch (turn.approval) {
    case "pending": return { id: turn.id };
    case "approved": return { id: turn.id, approved: true };
    case "rejected": return { id: turn.id, approved: false, reason: turn.error };
    default: return undefined;
  }
}

export type { QueueMessage };

export function stepChainStatus(status: StepStatus): "complete" | "active" | "pending" {
  if (status === "running") return "active";
  if (status === "pending") return "pending";
  return "complete";
}

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

export function checkpointsByTurn(checkpoints: Checkpoint[]): Map<string, Checkpoint[]> {
  const byTurn = new Map<string, Checkpoint[]>();
  for (const cp of checkpoints) byTurn.set(cp.turnId, [...(byTurn.get(cp.turnId) ?? []), cp]);
  return byTurn;
}

export type ContextMeterProps = {
  usedTokens: number;
  maxTokens: number;
  usage?: LanguageModelUsage;
  modelId?: string;
};

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

export type GeneratedImage = { base64: string; uint8Array: Uint8Array; mediaType: string };

export function generatedImage(attachment: Attachment): GeneratedImage | null {
  const match = attachment.url?.match(/^data:([^;,]+);base64,([\s\S]*)$/);
  if (!match) return null;
  const [, mediaType, base64] = match;
  let binary: string;
  try {
    binary = atob(base64);
  } catch {
    return null;
  }
  const uint8Array = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return { base64, uint8Array, mediaType };
}
