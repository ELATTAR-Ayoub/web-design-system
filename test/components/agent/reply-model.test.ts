import { describe, expect, it } from "vitest";

import { reduceEvent } from "@/components/agent/core/timeline";
import type { ActionTurn, AgentTurn, Attachment, ToolTurn } from "@/components/agent/core/types";
import type { PlanStep, QueueItem } from "@/components/agent/core/run";
import {
  checkpointsByTurn,
  contextProps,
  generatedImage,
  groupReplies,
  queueMessages,
  runOwner,
  stepChainStatus,
  toolApproval,
  toolState,
} from "@/components/agent/workspace/reply-model";
import { asToolOutput, fileTree, toolOutput } from "@/components/agent/workspace/tool-output";

const user = (id: string, text = "hi"): AgentTurn => ({ kind: "user", id, text, at: 1 });
const text = (id: string, t: string, extra: Partial<Extract<AgentTurn, { kind: "text" }>> = {}): AgentTurn => ({
  kind: "text",
  id,
  text: t,
  at: 2,
  ...extra,
});
const tool = (status: ToolTurn["status"], extra: Partial<ToolTurn> = {}): ToolTurn => ({
  kind: "tool",
  id: "t",
  name: "run",
  params: {},
  status,
  startedAt: 0,
  attempt: 1,
  ...extra,
});
const action = (status: ActionTurn["status"], approval?: ActionTurn["approval"], error?: string): ActionTurn => ({
  kind: "action",
  id: "a",
  action: "send",
  params: {},
  status,
  startedAt: 0,
  approval,
  error,
});

describe("groupReplies", () => {
  it("pairs each user turn with every turn up to the next user turn", () => {
    const turns = [user("u1"), text("x1", "One"), tool("ok"), text("x2", "Two"), user("u2"), text("y1", "Three")];
    const pairs = groupReplies(turns, false);
    expect(pairs).toHaveLength(2);
    expect(pairs[0].user.id).toBe("u1");
    expect(pairs[0].reply?.turns.map((t) => t.id)).toEqual(["x1", "t", "x2"]);
    expect(pairs[0].reply?.id).toBe("x1");
    expect(pairs[0].reply?.userTurnId).toBe("u1");
    expect(pairs[1].reply?.turns.map((t) => t.id)).toEqual(["y1"]);
  });

  it("joins the text turns, skipping empty ones, for Copy and Read aloud", () => {
    const [pair] = groupReplies([user("u"), text("a", " One "), text("b", ""), text("c", "Two")], false);
    expect(pair.reply?.text).toBe("One\n\nTwo");
  });

  it("gives a user turn with nothing after it a null reply", () => {
    expect(groupReplies([user("u")], true)[0].reply).toBeNull();
  });

  it("drops turns before the first user turn — they answer nothing", () => {
    const pairs = groupReplies([text("pre", "Hello"), user("u"), text("a", "Hi")], false);
    expect(pairs).toHaveLength(1);
    expect(pairs[0].reply?.turns.map((t) => t.id)).toEqual(["a"]);
  });

  it("merges sources across text turns, de-duplicated by url, first seen wins", () => {
    const s = (id: string, url: string) => ({ id, n: 1, title: id, url, domain: "x" });
    const [pair] = groupReplies(
      [user("u"), text("a", "A", { sources: [s("1", "u1"), s("2", "u2")] }), text("b", "B", { sources: [s("3", "u1"), s("4", "u3")] })],
      false,
    );
    expect(pair.reply?.sources.map((x) => x.id)).toEqual(["1", "2", "4"]);
  });

  it("streams while a text turn streams, or while busy on the last reply only", () => {
    const turns = [user("u1"), text("a", "A"), user("u2"), text("b", "B")];
    expect(groupReplies(turns, false).map((p) => p.reply?.streaming)).toEqual([false, false]);
    expect(groupReplies(turns, true).map((p) => p.reply?.streaming)).toEqual([false, true]);
    const streaming = [user("u"), text("a", "A", { streaming: true })];
    expect(groupReplies(streaming, false)[0].reply?.streaming).toBe(true);
  });

  it("takes `at` from the first turn when it has one", () => {
    expect(groupReplies([user("u"), text("a", "A")], false)[0].reply?.at).toBe(2);
    expect(groupReplies([user("u"), tool("ok")], false)[0].reply?.at).toBeUndefined();
  });
});

describe("runOwner", () => {
  const u = (id: string, at?: number): AgentTurn => ({ kind: "user", id, text: "", at });

  it("is the last user turn sent at or before the run started", () => {
    const pairs = groupReplies([u("a", 10), u("b", 20), u("c", 30)], false);
    expect(runOwner(pairs, 25)).toBe("b");
    expect(runOwner(pairs, 30)).toBe("c");
  });

  it("falls back to the last user turn when every turn is later, and null with none", () => {
    expect(runOwner(groupReplies([u("a", 50), u("b", 60)], false), 5)).toBe("b");
    expect(runOwner([], 5)).toBeNull();
  });
});

describe("toolState", () => {
  it("maps a tool call's status", () => {
    expect(toolState(tool("running"))).toBe("input-available");
    expect(toolState(tool("ok"))).toBe("output-available");
    expect(toolState(tool("error"))).toBe("output-error");
  });

  it("lets an open or refused approval win, then the action's own status", () => {
    expect(toolState(action("running", "pending"))).toBe("approval-requested");
    expect(toolState(action("error", "rejected"))).toBe("output-denied");
    expect(toolState(action("running", "approved"))).toBe("approval-responded");
    expect(toolState(action("ok", "approved"))).toBe("output-available");
    expect(toolState(action("error", "approved"))).toBe("output-error");
  });

  it("treats an ungated action like a tool call", () => {
    expect(toolState(action("running"))).toBe("input-available");
    expect(toolState(action("ok"))).toBe("output-available");
  });
});

describe("toolApproval", () => {
  it("is the id alone while pending, and carries the answer after", () => {
    expect(toolApproval(action("running", "pending"))).toEqual({ id: "a" });
    expect(toolApproval(action("ok", "approved"))).toEqual({ id: "a", approved: true });
    expect(toolApproval(action("error", "rejected", "Not now"))).toEqual({ id: "a", approved: false, reason: "Not now" });
  });

  it("is undefined for an action nobody had to approve", () => {
    expect(toolApproval(action("ok"))).toBeUndefined();
  });
});

describe("plan, task and queue mappers", () => {
  const plan: PlanStep[] = [
    { id: "1", title: "Read", status: "done" },
    { id: "2", title: "Write", detail: "Draft", status: "running" },
    { id: "3", title: "Ship", status: "pending" },
    { id: "4", title: "Oops", status: "failed" },
    { id: "5", title: "Skip", status: "skipped" },
  ];

  it("maps step status to ChainOfThought status", () => {
    expect(plan.map((s) => stepChainStatus(s.status))).toEqual(["complete", "active", "pending", "complete", "complete"]);
  });

  it("maps queued messages to Queue messages: the text, then each file", () => {
    const file: Attachment = { id: "f", name: "a.pdf", mime: "application/pdf", kind: "document", size: 1, url: "blob:x" };
    const queue: QueueItem[] = [
      { id: "q1", text: "Also this", at: 0, attachments: [file] },
      { id: "q2", text: "And that", at: 0 },
    ];
    expect(queueMessages(queue)).toEqual([
      {
        id: "q1",
        parts: [
          { type: "text", text: "Also this" },
          { type: "file", url: "blob:x", filename: "a.pdf", mediaType: "application/pdf" },
        ],
      },
      { id: "q2", parts: [{ type: "text", text: "And that" }] },
    ]);
  });
});

describe("checkpointsByTurn", () => {
  it("keys checkpoints by the turn they follow, keeping order", () => {
    const map = checkpointsByTurn([
      { id: "c1", label: "A", turnId: "t1", at: 0 },
      { id: "c2", label: "B", turnId: "t2", at: 0 },
      { id: "c3", label: "C", turnId: "t1", at: 0 },
    ]);
    expect(map.get("t1")?.map((c) => c.id)).toEqual(["c1", "c3"]);
    expect(map.get("t2")?.map((c) => c.id)).toEqual(["c2"]);
  });
});

describe("contextProps", () => {
  it("passes the totals through and leaves usage out when there is no breakdown", () => {
    expect(contextProps({ usedTokens: 10, maxTokens: 100, modelId: "m" })).toEqual({
      usedTokens: 10,
      maxTokens: 100,
      modelId: "m",
      usage: undefined,
    });
  });

  it("builds the AI SDK usage object from a breakdown", () => {
    const { usage } = contextProps({
      usedTokens: 90,
      maxTokens: 100,
      inputTokens: 60,
      outputTokens: 20,
      reasoningTokens: 5,
      cachedInputTokens: 10,
    });
    expect(usage?.inputTokens).toBe(60);
    expect(usage?.outputTokens).toBe(20);
    expect(usage?.reasoningTokens).toBe(5);
    expect(usage?.cachedInputTokens).toBe(10);
    expect(usage?.inputTokenDetails.cacheReadTokens).toBe(10);
    expect(usage?.outputTokenDetails.reasoningTokens).toBe(5);
    expect(usage?.totalTokens).toBe(90);
  });
});

describe("generatedImage", () => {
  const img = (url?: string): Attachment => ({ id: "i", name: "i.png", mime: "image/png", kind: "image", size: 3, url });

  it("reads base64 and bytes from a data url", () => {
    const out = generatedImage(img("data:image/png;base64,QUJD"));
    expect(out?.base64).toBe("QUJD");
    expect(out?.mediaType).toBe("image/png");
    expect(Array.from(out?.uint8Array ?? [])).toEqual([65, 66, 67]);
  });

  it("is null for a url with no inline bytes", () => {
    expect(generatedImage(img("blob:abc"))).toBeNull();
    expect(generatedImage(img())).toBeNull();
  });
});

describe("tool_progress", () => {
  it("sets the running call's partial output, and tool_result settles it", () => {
    let turns: AgentTurn[] = reduceEvent([], { type: "tool_call", name: "sh", parameters: {} });
    turns = reduceEvent(turns, { type: "tool_progress", name: "sh", partial: { kind: "terminal", command: "ls", output: "a" } });
    turns = reduceEvent(turns, { type: "tool_progress", name: "sh", partial: { kind: "terminal", command: "ls", output: "a\nb" } });
    const running = turns.at(-1) as ToolTurn;
    expect(running.status).toBe("running");
    expect(toolOutput(running)).toEqual({ kind: "terminal", command: "ls", output: "a\nb" });

    turns = reduceEvent(turns, {
      type: "tool_result",
      name: "sh",
      result: { success: true, result: { kind: "terminal", command: "ls", output: "a\nb\nc", exitCode: 0 } },
    });
    const done = turns.at(-1) as ToolTurn;
    expect(done.status).toBe("ok");
    expect(toolOutput(done)).toEqual({ kind: "terminal", command: "ls", output: "a\nb\nc", exitCode: 0 });
  });

  it("ignores progress for a tool that is not running", () => {
    const turns: AgentTurn[] = [tool("ok", { name: "sh" })];
    expect(reduceEvent(turns, { type: "tool_progress", name: "sh", partial: 1 })).toBe(turns);
  });
});

describe("asToolOutput", () => {
  it("accepts a result that keeps its kind's promise", () => {
    expect(asToolOutput({ kind: "stack-trace", trace: "Error: x" })).toEqual({ kind: "stack-trace", trace: "Error: x" });
    expect(
      asToolOutput({ kind: "test-results", summary: { passed: 1, failed: 0, skipped: 0, total: 1 }, suites: [] })?.kind,
    ).toBe("test-results");
  });

  it("accepts an image progress report with a known stage and rejects any other", () => {
    expect(asToolOutput({ kind: "image", stage: "generating" })).toEqual({ kind: "image", stage: "generating" });
    expect(asToolOutput({ kind: "image", stage: "complete" })?.kind).toBe("image");
    expect(asToolOutput({ kind: "image", stage: "painting" })).toBeNull();
    expect(asToolOutput({ kind: "image" })).toBeNull();
  });

  it("rejects a result that breaks it, or has no known kind", () => {
    expect(asToolOutput({ kind: "terminal", command: "ls" })).toBeNull();
    expect(asToolOutput({ kind: "test-results", summary: { passed: 1 }, suites: [] })).toBeNull();
    expect(asToolOutput({ kind: "nope" })).toBeNull();
    expect(asToolOutput({ status: "shipped" })).toBeNull();
    expect(asToolOutput(null)).toBeNull();
    expect(asToolOutput("text")).toBeNull();
  });
});

describe("fileTree", () => {
  it("nests paths into folders, folders first, each alphabetical", () => {
    const tree = fileTree([
      { path: "src/b.ts", change: "modified" },
      { path: "README.md", change: "modified" },
      { path: "src/lib/a.ts", change: "added" },
      { path: "src/a.ts", change: "deleted" },
    ]);
    expect(tree.map((n) => n.name)).toEqual(["src", "README.md"]);
    const src = tree[0];
    if (src.type !== "folder") throw new Error("src should be a folder");
    expect(src.path).toBe("src");
    expect(src.children.map((n) => n.name)).toEqual(["lib", "a.ts", "b.ts"]);
    const lib = src.children[0];
    if (lib.type !== "folder") throw new Error("lib should be a folder");
    expect(lib.path).toBe("src/lib");
    expect(lib.children).toEqual([{ type: "file", name: "a.ts", path: "src/lib/a.ts", change: "added" }]);
  });
});

describe("web-preview urls", () => {
  it("accepts only http(s) — a javascript: or data: url never reaches the iframe or window.open", () => {
    expect(asToolOutput({ kind: "web-preview", url: "https://preview.example.com" })?.kind).toBe("web-preview");
    expect(asToolOutput({ kind: "web-preview", url: "http://localhost:3000" })?.kind).toBe("web-preview");
    expect(asToolOutput({ kind: "web-preview", url: "javascript:alert(1)" })).toBeNull();
    expect(asToolOutput({ kind: "web-preview", url: " JavaScript:alert(1)" })).toBeNull();
    expect(asToolOutput({ kind: "web-preview", url: "data:text/html,<script>1</script>" })).toBeNull();
    expect(asToolOutput({ kind: "web-preview", url: "/relative" })).toBeNull();
  });
});
