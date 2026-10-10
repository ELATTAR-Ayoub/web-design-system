import type { AgentEvent, AgentTurn, Attachment, TextTurn, ToolTurn } from "./types";

let seq = 0;
const nextId = () => `turn-${(seq += 1)}`;

export function __resetIds() {
  seq = 0;
}

function settleLast(
  turns: AgentTurn[],
  match: (turn: AgentTurn) => boolean,
  update: (turn: AgentTurn) => AgentTurn,
): AgentTurn[] {
  for (let i = turns.length - 1; i >= 0; i -= 1) {
    if (match(turns[i])) {
      const next = turns.slice();
      next[i] = update(turns[i]);
      return next;
    }
  }
  return turns;
}

export function userTurn(text: string, attachments?: Attachment[]): AgentTurn {
  return {
    kind: "user",
    id: nextId(),
    text,
    at: Date.now(),
    ...(attachments?.length ? { attachments } : {}),
  };
}

function priorFailures(turns: AgentTurn[], name: string): number {
  let count = 0;
  for (const turn of turns) {
    if (turn.kind === "tool" && turn.name === name && turn.status === "error") count += 1;
  }
  return count;
}

export type ReduceOptions = { domActions?: ReadonlySet<string> };

export function reduceEvent(
  turns: AgentTurn[],
  event: AgentEvent,
  options: ReduceOptions = {},
): AgentTurn[] {
  const domActions = options.domActions;
  if (
    (event.type === "tool_call" || event.type === "tool_result") &&
    domActions?.has(event.name)
  ) {
    return turns;
  }

  switch (event.type) {
    case "text": {
      if (!event.content) return turns;
      const last = turns.at(-1);
      if (last?.kind === "text") {
        return settleLast(
          turns,
          (turn) => turn === last,
          (turn) => ({ ...(turn as TextTurn), text: last.text + event.content, streaming: true }),
        );
      }
      return [...turns, { kind: "text", id: nextId(), text: event.content, streaming: true, at: Date.now() }];
    }

    case "tool_call":
      return [
        ...closeStreaming(turns),
        {
          kind: "tool",
          id: nextId(),
          name: event.name,
          params: event.parameters ?? {},
          status: "running",
          startedAt: Date.now(),
          attempt: priorFailures(turns, event.name) + 1,
        },
      ];

    case "tool_progress":
      return settleLast(
        turns,
        (turn) => turn.kind === "tool" && turn.name === event.name && turn.status === "running",
        (turn) => ({ ...(turn as ToolTurn), partial: event.partial }),
      );

    case "tool_result":
      return settleLast(
        turns,
        (turn) => turn.kind === "tool" && turn.name === event.name && turn.status === "running",
        (turn) => {
          const tool = turn as ToolTurn;
          return {
            ...tool,
            status: event.result?.success ? "ok" : "error",
            result: event.result?.result,
            error: event.result?.error,
            ...(event.attachments?.length ? { attachments: event.attachments } : {}),
            ms: Date.now() - tool.startedAt,
          };
        },
      );

    case "action_request":
      return [
        ...closeStreaming(turns),
        {
          kind: "action",
          id: event.correlationId,
          action: event.action,
          params: event.parameters ?? {},
          status: "running",
          startedAt: Date.now(),
        },
      ];

    case "error":
      return [
        ...closeStreaming(turns),
        { kind: "error", id: nextId(), message: event.error, fatal: event.fatal },
      ];

    case "done":
      return closeStreaming(turns);

    case "sources":
      return withStreamingText(turns, (turn) => ({ ...turn, sources: event.sources }));

    case "suggestions":
      return withStreamingText(turns, (turn) => ({ ...turn, suggestions: event.items }));

    case "reasoning":
      return withStreamingText(turns, (turn) => ({
        ...turn,
        reasoning: { steps: [...(turn.reasoning?.steps ?? []), event.step], ms: turn.reasoning?.ms },
      }));

    case "reasoning_done":
      return withStreamingText(turns, (turn) => ({
        ...turn,
        reasoning: { steps: turn.reasoning?.steps ?? [], ms: event.ms },
      }));

    case "confidence":
      return withStreamingText(turns, (turn) => ({ ...turn, confidence: event.confidence }));

    case "run":
      // Run events are folded by the transport, not the transcript.
      return turns;

    default:
      return turns;
  }
}

function withStreamingText(
  turns: AgentTurn[],
  update: (turn: TextTurn) => TextTurn,
): AgentTurn[] {
  const last = turns.at(-1);
  if (last?.kind === "text" && last.streaming) {
    return settleLast(turns, (turn) => turn === last, (turn) => update(turn as TextTurn));
  }
  return [...turns, update({ kind: "text", id: nextId(), text: "", streaming: true, at: Date.now() })];
}

function closeStreaming(turns: AgentTurn[]): AgentTurn[] {
  const last = turns.at(-1);
  if (last?.kind !== "text" || !last.streaming) return turns;
  return settleLast(
    turns,
    (turn) => turn === last,
    (turn) => ({ ...(turn as TextTurn), streaming: false }),
  );
}

export function settleAction(
  turns: AgentTurn[],
  action: string,
  outcome: { success: boolean; error?: string },
): AgentTurn[] {
  return settleLast(
    turns,
    (turn) => turn.kind === "action" && turn.action === action && turn.status === "running",
    (turn) => {
      const step = turn as Extract<AgentTurn, { kind: "action" }>;
      return {
        ...step,
        status: outcome.success ? "ok" : "error",
        error: outcome.error,
        ms: Date.now() - step.startedAt,
      };
    },
  );
}

export function markApproval(
  turns: AgentTurn[],
  turnId: string,
  approval: "pending" | "approved" | "rejected",
): AgentTurn[] {
  return settleLast(
    turns,
    (turn) => turn.kind === "action" && turn.id === turnId,
    (turn) => ({ ...(turn as Extract<AgentTurn, { kind: "action" }>), approval }),
  );
}

export function stripProtocol(text: string): string {
  return text.replace(/<\/?complete>/g, "").replace(/<\/?[a-z]*$/i, "");
}
