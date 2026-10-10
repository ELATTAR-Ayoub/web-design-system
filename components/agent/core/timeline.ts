/**
 * The agent's stream, folded into something renderable.
 *
 * A transport maintains its own message list, but those only ever hold user and
 * assistant *text* — tool calls, tool results and action requests arrive on the
 * event channel and are then dropped. Those are the interesting half of an
 * agentic product, so the console keeps its own timeline built from the raw
 * events and treats the transport purely as delivery.
 *
 * Every entry is immutable; settling a tool call replaces the entry rather than
 * mutating it, so React sees a new array and the renderers stay pure.
 */

import type { AgentEvent, AgentTurn, Attachment, TextTurn, ToolTurn } from "./types";

let seq = 0;
const nextId = () => `turn-${(seq += 1)}`;

/** Reset the id counter. Tests only — ids are otherwise process-lifetime unique. */
export function __resetIds() {
  seq = 0;
}

/** Replace the most recent entry matching `match`. Returns the array unchanged if there is none. */
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

/**
 * How many times this tool has already been tried and failed in this run.
 *
 * A model that calls the same tool again after an error is retrying, and that is
 * worth showing — it is the difference between "still working" and "stuck". The
 * count is scoped to the tool name rather than to its arguments, because a retry
 * with corrected arguments is still a retry.
 */
function priorFailures(turns: AgentTurn[], name: string): number {
  let count = 0;
  for (const turn of turns) {
    if (turn.kind === "tool" && turn.name === name && turn.status === "error") count += 1;
  }
  return count;
}

/**
 * Page control arrives twice.
 *
 * A DOM action is invoked through the same tool syntax as everything else, so
 * the runtime emits a tool_call *and* an action_request for it, then a
 * tool_result once the browser reports back. Rendering both puts the same step
 * on screen twice under two different names. The action entry is the one worth
 * keeping — it reads as a sentence and is timed by the browser that did the
 * work — so the tool half is dropped here rather than filtered in the console.
 *
 * Supplied by the transport, because which names are DOM actions is a property
 * of the agent, not of the timeline.
 */
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
          // The correlation id is already unique per request and is what the
          // action bridge will quote back when the browser reports the outcome.
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
      // Run events are folded by the transport with `reduceRunEvent`
      // (run.ts), not by the transcript. Nothing here to do.
      return turns;

    default:
      return turns;
  }
}

/**
 * Apply `update` to the current streaming answer, creating one first if the
 * transcript has none — reasoning can arrive before the first text token.
 */
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

/**
 * Mark the trailing text turn as finished streaming.
 *
 * Called whenever something other than more text arrives. Without it the cursor
 * keeps blinking on a paragraph the model stopped writing several tool calls
 * ago, and `resolveState` cannot tell "writing" from "wrote".
 */
function closeStreaming(turns: AgentTurn[]): AgentTurn[] {
  const last = turns.at(-1);
  if (last?.kind !== "text" || !last.streaming) return turns;
  return settleLast(
    turns,
    (turn) => turn === last,
    (turn) => ({ ...(turn as TextTurn), streaming: false }),
  );
}

/** Called once the browser has actually performed a DOM action. */
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

/** Flag an action turn as held at an approval gate. */
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

/**
 * Remove the agent protocol's control tags from text destined for a human.
 *
 * The Lens runtime ends every completed turn with `</complete>` and does not
 * strip it. Because text arrives in chunks a tag can also be split across two
 * events, so a trailing partial tag is swallowed too — otherwise the user
 * watches `</comp` sit at the end of a sentence for a beat.
 */
export function stripProtocol(text: string): string {
  return text.replace(/<\/?complete>/g, "").replace(/<\/?[a-z]*$/i, "");
}
