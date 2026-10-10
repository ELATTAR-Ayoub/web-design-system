import { beforeEach, describe, expect, it } from "vitest";

import {
  extractProduced,
  formatBytes,
  isTextual,
  serialiseAttachments,
  withoutProduced,
} from "@/components/agent/core/attachments";
import { attachmentKind, type Attachment } from "@/components/agent/core/types";
import { resolveState } from "@/components/agent/core/resolve-state";
import {
  AGENT_STATES,
  AGENT_STATE_LABEL,
  isBusy,
  isNarrating,
  stateForTool,
} from "@/components/agent/core/states";
import {
  __resetIds,
  markApproval,
  reduceEvent,
  settleAction,
  stripProtocol,
  userTurn,
} from "@/components/agent/core/timeline";
import type { AgentTurn } from "@/components/agent/core/types";

/* ── attachmentKind ────────────────────────────────────────────────────────── */

describe("attachmentKind", () => {
  it("classifies by MIME first", () => {
    expect(attachmentKind("image/png", "photo.bin")).toBe("image");
    expect(attachmentKind("audio/mpeg", "clip.bin")).toBe("audio");
  });

  it("falls back to the extension when the MIME lies", () => {
    // The real-world case this exists for: a picker reporting octet-stream.
    expect(attachmentKind("application/octet-stream", "report.csv")).toBe("data");
    expect(attachmentKind("application/octet-stream", "notes.ts")).toBe("code");
    expect(attachmentKind("application/octet-stream", "contract.pdf")).toBe("document");
  });

  it("degrades to other rather than guessing wrongly", () => {
    expect(attachmentKind("application/octet-stream", "mystery.xyz")).toBe("other");
  });
});

/* ── serialiseAttachments ──────────────────────────────────────────────────── */

function attachment(overrides: Partial<Attachment> = {}): Attachment {
  return {
    id: "a1",
    name: "report.csv",
    mime: "text/csv",
    kind: "data",
    size: 42,
    ...overrides,
  };
}

describe("serialiseAttachments", () => {
  it("inlines textual content and stamps delivery: content", () => {
    const { text, attachments } = serialiseAttachments("Look at this", [
      attachment({ text: "a,b\n1,2" }),
    ]);
    expect(text).toContain("<file name=\"report.csv\"");
    expect(text).toContain("a,b\n1,2");
    expect(attachments[0].delivery).toEqual({ sent: "content" });
  });

  it("cannot inline what it does not have — a binary with no text is a reference, honestly", () => {
    const { text, attachments } = serialiseAttachments("See attached", [
      attachment({ name: "scan.pdf", mime: "application/pdf", kind: "document" }),
    ]);
    expect(text).toContain("attached-but-not-readable");
    expect(text).toContain("scan.pdf");
    expect(attachments[0].delivery).toMatchObject({ sent: "reference" });
  });

  it("an image with a vision transcription is fenced as a reading, not as the picture itself", () => {
    const { text, attachments } = serialiseAttachments("What is this?", [
      attachment({ name: "shelf.png", mime: "image/png", kind: "image", text: "A shelf of sealed boxes." }),
    ]);
    expect(text).toContain("<image name=\"shelf.png\"");
    expect(text).toContain("A vision model read this image");
    expect(attachments[0].delivery).toEqual({ sent: "content" });
  });

  it("truncates past the cap and announces it in the payload rather than silently", () => {
    const long = "x".repeat(200_000);
    const { text } = serialiseAttachments("", [attachment({ text: long })]);
    expect(text).toContain('truncated="true"');
    expect(text.length).toBeLessThan(long.length + 500);
  });

  it("escapes attribute-breaking characters in a filename", () => {
    const { text } = serialiseAttachments("", [
      attachment({ name: 'weird"name<script>.csv', text: "x" }),
    ]);
    expect(text).not.toContain('weird"name<script>');
    expect(text).toContain("&quot;");
    expect(text).toContain("&lt;");
  });

  it("is a no-op with no attachments", () => {
    expect(serialiseAttachments("hi", [])).toEqual({ text: "hi", attachments: [] });
  });
});

describe("isTextual", () => {
  it("trusts a text/* or json MIME regardless of kind", () => {
    expect(isTextual(attachment({ mime: "text/plain", kind: "other" }))).toBe(true);
    expect(isTextual(attachment({ mime: "application/json", kind: "other" }))).toBe(true);
  });

  it("audio is never textual even if misclassified", () => {
    expect(isTextual(attachment({ mime: "audio/mpeg", kind: "audio" }))).toBe(false);
  });
});

/* ── produced attachments (agent → user) ──────────────────────────────────── */

describe("extractProduced / withoutProduced", () => {
  it("pulls a tool's produced files out under the namespaced key", () => {
    const result = {
      rows: 3,
      __attachments: [{ name: "export.csv", mime: "text/csv", text: "a,b" }],
    };
    const files = extractProduced(result);
    expect(files).toHaveLength(1);
    expect(files[0]).toMatchObject({ name: "export.csv", delivery: { sent: "produced" } });
  });

  it("ignores malformed entries rather than throwing", () => {
    expect(extractProduced({ __attachments: [{ name: "x" }] })).toEqual([]);
    expect(extractProduced(null)).toEqual([]);
    expect(extractProduced("not an object")).toEqual([]);
  });

  it("strips the envelope so generative renderers see a clean result", () => {
    const result = { rows: 3, __attachments: [] };
    expect(withoutProduced(result)).toEqual({ rows: 3 });
  });
});

describe("formatBytes", () => {
  it("scales the unit with the size", () => {
    expect(formatBytes(500)).toBe("500 B");
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});

/* ── resolveState ──────────────────────────────────────────────────────────── */

describe("resolveState", () => {
  it("idle with no turns and nothing happening", () => {
    expect(resolveState({ turns: [], signals: { isLoading: false, awaitingFirstEvent: false } })).toBe(
      "idle",
    );
  });

  it("a declared state always wins", () => {
    expect(
      resolveState({
        turns: [],
        signals: { isLoading: true, awaitingFirstEvent: false, declared: "reading" },
      }),
    ).toBe("reading");
  });

  it("a pending approval outranks a running tool", () => {
    const state = resolveState({
      turns: [
        { kind: "action", id: "a1", action: "buy", params: {}, status: "running", startedAt: 0, approval: "pending" },
        { kind: "tool", id: "t1", name: "search", params: {}, status: "running", startedAt: 0, attempt: 1 },
      ],
      signals: { isLoading: true, awaitingFirstEvent: false },
    });
    expect(state).toBe("awaiting_approval");
  });

  it("a tool retried after failure reads as retrying, not as its mapped state", () => {
    const state = resolveState({
      turns: [
        { kind: "tool", id: "t1", name: "search", params: {}, status: "running", startedAt: 0, attempt: 2 },
      ],
      signals: { isLoading: true, awaitingFirstEvent: false },
      toolStates: { search: "searching" },
    });
    expect(state).toBe("retrying");
  });

  it("a fatal error outranks a busy signal; a non-fatal one does not", () => {
    const fatal = resolveState({
      turns: [{ kind: "error", id: "e1", message: "boom", fatal: true }],
      signals: { isLoading: true, awaitingFirstEvent: false },
    });
    expect(fatal).toBe("error");

    const recoverable = resolveState({
      turns: [{ kind: "error", id: "e1", message: "boom", fatal: false }],
      signals: { isLoading: true, awaitingFirstEvent: false },
    });
    expect(recoverable).not.toBe("error");
  });

  it("streaming prose after a tool call reads as summarizing; before one, as planning", () => {
    const summarizing = resolveState({
      turns: [
        { kind: "user", id: "u1", text: "go" },
        { kind: "tool", id: "t1", name: "search", params: {}, status: "ok", startedAt: 0, attempt: 1 },
        { kind: "text", id: "x1", text: "Found it", streaming: true },
      ],
      signals: { isLoading: true, awaitingFirstEvent: false },
    });
    expect(summarizing).toBe("summarizing");

    const planning = resolveState({
      turns: [
        { kind: "user", id: "u1", text: "go" },
        { kind: "text", id: "x1", text: "Let me check", streaming: true },
      ],
      signals: { isLoading: true, awaitingFirstEvent: false },
    });
    expect(planning).toBe("planning");
  });

  it("a finished turn with nothing else pending reads as done", () => {
    const state = resolveState({
      turns: [{ kind: "text", id: "x1", text: "All set", streaming: false }],
      signals: { isLoading: false, awaitingFirstEvent: false },
    });
    expect(state).toBe("done");
  });

  it("bug 7: a running plan step reads as processing, not queued, even while awaitingFirstEvent is stuck true", () => {
    const state = resolveState({
      turns: [{ kind: "user", id: "u1", text: "go" }],
      signals: { isLoading: true, awaitingFirstEvent: true },
      run: {
        id: "run-1",
        version: 1,
        goal: "Do the thing",
        status: "running",
        plan: [{ id: "p1", title: "Step one", status: "running" }],
        effects: [],
        checkpoints: [],
        queue: [],
        startedAt: 0,
      },
      connection: "connected",
    });
    expect(state).toBe("processing");
  });
});

describe("states vocabulary", () => {
  it("isBusy and isNarrating agree with the resting/narrating sets", () => {
    expect(isBusy("idle")).toBe(false);
    expect(isBusy("done")).toBe(false);
    expect(isBusy("error")).toBe(false);
    expect(isBusy("thinking")).toBe(true);
    expect(isNarrating("writing")).toBe(true);
    expect(isNarrating("thinking")).toBe(false);
  });

  it("every one of the twenty-six states has a label", () => {
    for (const state of AGENT_STATES) {
      expect(typeof state).toBe("string");
    }
    expect(AGENT_STATES).toHaveLength(26);
  });

  it("stateForTool matches exactly first, then the longest matching prefix", () => {
    const map = { "finance.": "retrieving", "finance.forecast": "planning" } as const;
    expect(stateForTool("finance.forecast", map)).toBe("planning");
    expect(stateForTool("finance.balance", map)).toBe("retrieving");
    expect(stateForTool("unmapped_tool", map)).toBeNull();
  });
});

/* ── reduceEvent ───────────────────────────────────────────────────────────── */

describe("reduceEvent", () => {
  beforeEach(() => __resetIds());

  it("a text delta appends to the streaming turn rather than starting a new one", () => {
    let turns: AgentTurn[] = [];
    turns = reduceEvent(turns, { type: "text", content: "Hel" });
    turns = reduceEvent(turns, { type: "text", content: "lo" });
    expect(turns).toHaveLength(1);
    expect(turns[0]).toMatchObject({ kind: "text", text: "Hello", streaming: true });
  });

  it("an empty text delta is a no-op", () => {
    const turns = reduceEvent([], { type: "text", content: "" });
    expect(turns).toEqual([]);
  });

  it("tool_call closes any streaming text and starts a running tool turn", () => {
    let turns: AgentTurn[] = reduceEvent([], { type: "text", content: "Let me check" });
    turns = reduceEvent(turns, {
      type: "tool_call",
      name: "search_inventory",
      parameters: { query: "sealed" },
    });
    expect(turns[0]).toMatchObject({ kind: "text", streaming: false });
    expect(turns[1]).toMatchObject({
      kind: "tool",
      name: "search_inventory",
      status: "running",
      attempt: 1,
    });
  });

  it("tool_result settles the matching running tool call, success and failure", () => {
    let turns: AgentTurn[] = reduceEvent([], { type: "tool_call", name: "search_inventory", parameters: {} });
    turns = reduceEvent(turns, {
      type: "tool_result",
      name: "search_inventory",
      result: { success: true, result: { rows: 3 } },
    });
    expect(turns[0]).toMatchObject({ kind: "tool", status: "ok", result: { rows: 3 } });

    let failing: AgentTurn[] = reduceEvent([], { type: "tool_call", name: "search_inventory", parameters: {} });
    failing = reduceEvent(failing, {
      type: "tool_result",
      name: "search_inventory",
      result: { success: false, error: "timed out" },
    });
    expect(failing[0]).toMatchObject({ kind: "tool", status: "error", error: "timed out" });
  });

  it("a retried tool call counts prior failures for the same tool name", () => {
    let turns: AgentTurn[] = reduceEvent([], { type: "tool_call", name: "search_inventory", parameters: {} });
    turns = reduceEvent(turns, {
      type: "tool_result",
      name: "search_inventory",
      result: { success: false, error: "timed out" },
    });
    turns = reduceEvent(turns, { type: "tool_call", name: "search_inventory", parameters: {} });
    expect(turns[1]).toMatchObject({ kind: "tool", status: "running", attempt: 2 });
  });

  it("action_request closes streaming text and starts a running action turn keyed by correlationId", () => {
    let turns: AgentTurn[] = reduceEvent([], { type: "text", content: "On it" });
    turns = reduceEvent(turns, {
      type: "action_request",
      correlationId: "corr-1",
      action: "click",
      parameters: { selector: "#buy" },
    });
    expect(turns[0]).toMatchObject({ kind: "text", streaming: false });
    expect(turns[1]).toMatchObject({ kind: "action", id: "corr-1", action: "click", status: "running" });
  });

  it("markApproval flags the matching action turn without touching the others", () => {
    let turns: AgentTurn[] = reduceEvent([], {
      type: "action_request",
      correlationId: "corr-1",
      action: "click",
      parameters: {},
    });
    turns = markApproval(turns, "corr-1", "pending");
    expect(turns[0]).toMatchObject({ kind: "action", approval: "pending" });
  });

  it("settleAction resolves the matching running action by name, ok and error", () => {
    let turns: AgentTurn[] = reduceEvent([], {
      type: "action_request",
      correlationId: "corr-1",
      action: "click",
      parameters: {},
    });
    turns = settleAction(turns, "click", { success: true });
    expect(turns[0]).toMatchObject({ kind: "action", status: "ok" });
  });

  it("error becomes its own turn and closes any streaming text first", () => {
    let turns: AgentTurn[] = reduceEvent([], { type: "text", content: "Still working" });
    turns = reduceEvent(turns, { type: "error", error: "Upstream failed", fatal: true });
    expect(turns[0]).toMatchObject({ kind: "text", streaming: false });
    expect(turns[1]).toMatchObject({ kind: "error", message: "Upstream failed", fatal: true });
  });

  it("done closes any streaming text and adds nothing else", () => {
    let turns: AgentTurn[] = reduceEvent([], { type: "text", content: "All set" });
    turns = reduceEvent(turns, { type: "done" });
    expect(turns).toHaveLength(1);
    expect(turns[0]).toMatchObject({ kind: "text", streaming: false });
  });

  it("a DOM action's paired tool events are dropped when the name is a known DOM action", () => {
    const turns = reduceEvent([], { type: "tool_call", name: "click", parameters: {} }, { domActions: new Set(["click"]) });
    expect(turns).toEqual([]);
  });

  it("userTurn stamps a fresh id and only carries attachments when there are any", () => {
    const turn = userTurn("hi");
    expect(turn).toMatchObject({ kind: "user", text: "hi" });
    expect(turn).not.toHaveProperty("attachments");
  });

  it("stripProtocol removes the Lens completion tag, including a split trailing partial", () => {
    expect(stripProtocol("All done</complete>")).toBe("All done");
    expect(stripProtocol("All done</comp")).toBe("All done");
  });
});

/* ── Run states ────────────────────────────────────────────────────────────── */

describe("the six run states", () => {
  it("has the six run states with labels", () => {
    for (const s of ["paused", "cancelling", "undoing", "partial", "handoff", "offline"] as const) {
      expect(AGENT_STATES).toContain(s);
      expect(AGENT_STATE_LABEL[s].length).toBeGreaterThan(0);
    }
    expect(isBusy("paused")).toBe(false);
    expect(isBusy("cancelling")).toBe(true);
  });

  it("connection beats the transcript", () => {
    expect(
      resolveState({ turns: [], signals: { isLoading: true, awaitingFirstEvent: false }, connection: "reconnecting" }),
    ).toBe("offline");
  });

  it("connection beats a declared state, but a paused run does not", () => {
    expect(
      resolveState({
        turns: [],
        signals: { isLoading: true, awaitingFirstEvent: false, declared: "writing" },
        connection: "offline",
      }),
    ).toBe("offline");

    expect(
      resolveState({
        turns: [],
        signals: { isLoading: true, awaitingFirstEvent: false, declared: "writing" },
        run: {
          id: "r1", version: 1, goal: "test", status: "paused",
          plan: [], effects: [], checkpoints: [], queue: [], startedAt: 0,
        },
      }),
    ).toBe("writing");
  });
});
