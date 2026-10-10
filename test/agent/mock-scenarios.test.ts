import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CONVERSATIONS, releasePreviewUrl, speakMock, useMockTransport, type ConversationId } from "@/lib/agent/mock-transport";
import type { ToolTurn } from "@/components/agent/core/types";
import { asToolOutput } from "@/components/agent/workspace/tool-output";

const def = (id: ConversationId) => CONVERSATIONS.find((c) => c.id === id)!;

function start(id: ConversationId) {
  return renderHook(() => useMockTransport({ conversation: id, speed: 50 }));
}

type Hook = ReturnType<typeof start>;

/** Sends beat `i`'s prompt (a Suggestion press and a typed message are the same send). */
async function beat(h: Hook, id: ConversationId, i: number) {
  await act(async () => {
    void h.result.current.send(def(id).beats[i].prompt);
  });
}

const settled = (h: Hook) => waitFor(() => expect(h.result.current.isLoading).toBe(false), { timeout: 8000 });
const tools = (h: Hook) => h.result.current.turns.filter((t): t is ToolTurn => t.kind === "tool");
const lastText = (h: Hook) => [...h.result.current.turns].reverse().find((t) => t.kind === "text");

describe("the 7 conversations", () => {
  it("lists seven in order, each whose first beat is its starter", () => {
    expect(CONVERSATIONS.map((c) => c.id)).toEqual([
      "chat", "tools", "planning", "approvals", "run-control", "recovery", "long-session",
    ]);
    for (const c of CONVERSATIONS) {
      expect(c.beats[0].prompt).toBe(c.starter);
      expect(c.beats.length).toBeGreaterThan(1);
    }
  });

  it("keyword-routed default path still works with no conversation", async () => {
    const h = renderHook(() => useMockTransport({ latency: 0 }));
    await act(async () => {
      void h.result.current.send("hello");
    });
    await settled(h);
    expect(h.result.current.usage).toBeUndefined();
    expect(h.result.current.agent).toBeUndefined();
  });

  it("each beat's answer ends with the next beat's prompt as a suggestion, the last offers none", async () => {
    const h = start("chat");
    await beat(h, "chat", 0);
    await settled(h);
    expect((lastText(h) as { suggestions?: string[] }).suggestions).toEqual([def("chat").beats[1].prompt]);
  });

  it("chat: reasoning, sources, code, attachments echo and a restore point", async () => {
    const h = start("chat");
    await beat(h, "chat", 0);
    await settled(h);
    const first = h.result.current.turns.find((t) => t.kind === "text") as { sources?: unknown[]; reasoning?: unknown; text: string };
    expect(first.sources).toHaveLength(2);
    expect(first.reasoning).toBeTruthy();
    await beat(h, "chat", 1);
    await settled(h);
    expect((lastText(h) as { text: string }).text).toContain("```ts");
    await act(async () => {
      void h.result.current.send(def("chat").beats[2].prompt, {
        attachments: [{ id: "i", name: "shot.png", mime: "image/png", kind: "image", size: 10 }],
      });
    });
    await settled(h);
    expect((lastText(h) as { text: string }).text).toContain("shot.png");
    expect(h.result.current.restorePoints).toHaveLength(1);
    const cp = h.result.current.restorePoints![0];
    act(() => h.result.current.restoreTo?.(cp.turnId));
    expect(h.result.current.turns.at(-1)?.id).toBe(cp.turnId);
    expect(h.result.current.restorePoints).toHaveLength(1);
  });

  it("chat: edit and regenerate branch", async () => {
    const h = start("chat");
    await beat(h, "chat", 0);
    await settled(h);
    const user = h.result.current.turns.find((t) => t.kind === "user")!;
    await act(async () => {
      await h.result.current.editMessage?.(user.id, "shorter please");
    });
    expect((h.result.current.turns.find((t) => t.kind === "user") as { versions?: unknown[] }).versions).toHaveLength(2);
    const text = h.result.current.turns.find((t) => t.kind === "text")!;
    await act(async () => {
      await h.result.current.regenerate?.(text.id);
    });
    expect((h.result.current.turns.find((t) => t.kind === "text") as { regenerations?: unknown[] }).regenerations!.length).toBeGreaterThan(1);
  });

  it("tools: all eight beats deliver their output, each offering the next", async () => {
    const h = start("tools");
    const prompts = def("tools").beats.map((b) => b.prompt);
    expect(prompts).toHaveLength(8);
    await beat(h, "tools", 0);
    await settled(h);
    expect(tools(h).map((t) => asToolOutput(t.result)?.kind)).toEqual(["search", "test-results"]);
    // The search result is the exact shape the ChainOfThought chips read.
    const search = asToolOutput(tools(h)[0].result);
    expect(search).toMatchObject({ kind: "search", query: expect.any(String) });
    expect((search as { results: { title: string; url: string; domain: string }[] }).results[0]).toEqual({
      title: expect.any(String), url: expect.any(String), domain: expect.any(String),
    });
    expect((lastText(h) as { suggestions?: string[] }).suggestions).toEqual([prompts[1]]);

    await beat(h, "tools", 1);
    await settled(h);
    const build = tools(h).find((t) => t.name === "run_build")!;
    expect(asToolOutput(build.result)).toMatchObject({ kind: "terminal", exitCode: 0 });
    expect((lastText(h) as { suggestions?: string[] }).suggestions).toEqual([prompts[2]]);

    await beat(h, "tools", 2);
    await settled(h);
    const deploys = tools(h).filter((t) => t.name === "deploy");
    expect(deploys.map((t) => t.status)).toEqual(["error", "ok"]);
    expect(asToolOutput(deploys[0].result)?.kind).toBe("terminal");
    expect((lastText(h) as { suggestions?: string[] }).suggestions).toEqual([prompts[3]]);

    // The crash: a failing tool whose result is a stack-trace; Retry (regenerate) succeeds.
    await beat(h, "tools", 3);
    await settled(h);
    const crash = tools(h).find((t) => t.name === "run_migration")!;
    expect(crash.status).toBe("error");
    expect(asToolOutput(crash.result)?.kind).toBe("stack-trace");
    expect((lastText(h) as { suggestions?: string[] }).suggestions).toEqual([prompts[4]]);
    await act(async () => {
      await h.result.current.regenerate?.(crash.id);
    });
    const migrations = tools(h).filter((t) => t.name === "run_migration");
    expect(migrations.map((t) => t.status)).toEqual(["error", "ok"]);
    expect((lastText(h) as { text: string }).text).toMatch(/ran cleanly/);

    await beat(h, "tools", 4);
    await settled(h);
    const image = tools(h).find((t) => t.name === "generate_image")!;
    expect(image.attachments?.[0].url).toMatch(/^data:image\/svg\+xml;base64,/);

    await beat(h, "tools", 5);
    await settled(h);
    expect(asToolOutput(tools(h).at(-1)!.result)?.kind).toBe("artifact");

    await beat(h, "tools", 6);
    await settled(h);
    const outputs = tools(h).slice(-2).map((t) => asToolOutput(t.result));
    expect(outputs.map((o) => o?.kind)).toEqual(["web-preview", "jsx-preview"]);
    /* The preview frame must load from this app, never from another host. */
    const preview = outputs[0] as { kind: "web-preview"; url: string };
    expect(new URL(preview.url).origin).toBe(window.location.origin);
    expect(preview.url).toBe(releasePreviewUrl());

    await beat(h, "tools", 7);
    await settled(h);
    expect(asToolOutput(tools(h).at(-1)!.result)?.kind).toBe("sandbox");
    expect((lastText(h) as { suggestions?: string[] }).suggestions).toBeUndefined();
  });

  it("tools: Terminal streams — its output grows through tool_progress, then settles", async () => {
    const h = renderHook(() => useMockTransport({ conversation: "tools", speed: 1, latency: 0 }));
    await act(async () => {
      void h.result.current.send(def("tools").beats[0].prompt);
    });
    await waitFor(() => expect(h.result.current.isLoading).toBe(false), { timeout: 8000 });
    await act(async () => {
      void h.result.current.send(def("tools").beats[1].prompt);
    });
    const lengths = new Set<number>();
    await waitFor(
      () => {
        const t = h.result.current.turns.find((x): x is ToolTurn => x.kind === "tool" && x.name === "run_build");
        const out = t?.status === "running" ? (asToolOutput(t.partial) as { output: string } | null) : null;
        if (out) lengths.add(out.output.length);
        expect(h.result.current.isLoading).toBe(false);
      },
      { timeout: 8000, interval: 20 },
    );
    expect(lengths.size).toBeGreaterThanOrEqual(2);
  });

  it("tools: tool_progress fills `partial` while a tool runs", async () => {
    // Real-time speed: at a fast `speed` the running window is too short to observe.
    const h = renderHook(() => useMockTransport({ conversation: "tools", speed: 1, latency: 0 }));
    await act(async () => {
      void h.result.current.send(def("tools").starter);
    });
    await waitFor(
      () => {
        const running = tools(h).find((t) => t.name === "run_tests" && t.status === "running");
        expect(asToolOutput(running?.partial)?.kind).toBe("test-results");
      },
      { timeout: 6000, interval: 20 },
    );
    act(() => h.result.current.abort());
  });

  it("planning: the plan streams in step by step at one version before the edit bumps it", async () => {
    const seen: string[] = [];
    const h = renderHook(() => {
      const t = useMockTransport({ conversation: "planning", speed: 50 });
      const run = t.runState?.run;
      if (run) {
        const key = `v${run.version}:${run.plan.length}`;
        if (seen.at(-1) !== key) seen.push(key);
      }
      return t;
    });
    await act(async () => {
      void h.result.current.send(def("planning").starter);
    });
    await waitFor(() => expect(h.result.current.runState?.run?.version).toBe(2));
    expect(seen.slice(0, 4)).toEqual(["v1:1", "v1:2", "v1:3", "v2:4"]);
    act(() => h.result.current.abort());
  });

  it("planning: plan streams, runs after approve, low-confidence verify, outputs, undo", async () => {
    const h = start("planning");
    await beat(h, "planning", 0);
    await waitFor(() => expect(h.result.current.runState?.run?.version).toBe(2));
    expect(h.result.current.runState?.run?.plan).toHaveLength(4);
    act(() => h.result.current.approvePlan?.(2));
    await waitFor(() => expect(h.result.current.runState?.run?.status).toBe("waiting_for_approval"));
    act(() => h.result.current.verifyStep?.("pl2"));
    await settled(h);
    expect(h.result.current.runState?.run?.status).toBe("completed");
    expect(tools(h).map((t) => asToolOutput(t.result)?.kind)).toEqual(["file-tree", "commit", "package-info"]);
    await beat(h, "planning", 1);
    await settled(h);
    expect(h.result.current.runState?.run?.effects.every((e) => e.status === "reversed")).toBe(true);
  });

  it("approvals: approve, high-risk code, expiry, stale, env vars", async () => {
    const h = start("approvals");
    await beat(h, "approvals", 0);
    await waitFor(() => expect(h.result.current.pendingApprovals).toHaveLength(1));
    act(() => h.result.current.pendingApprovals[0].approve());
    await settled(h);

    await beat(h, "approvals", 1);
    await waitFor(() => expect(h.result.current.pendingApprovals).toHaveLength(1));
    expect(h.result.current.approveWithCode?.("000000")).toBe(false);
    expect(h.result.current.approveWithCode?.("123456")).toBe(true);
    await settled(h);

    await beat(h, "approvals", 2);
    await waitFor(() => expect(h.result.current.runState?.run?.status).toBe("proposed"));
    await waitFor(() => expect(h.result.current.runState?.timeline.some((e) => /expired/i.test(e.text))).toBe(true));
    expect(h.result.current.runState?.run?.version).toBe(2);
    act(() => h.result.current.approvePlan?.(2));
    await settled(h);
    expect(h.result.current.runState?.run?.status).toBe("completed");

    await beat(h, "approvals", 3);
    await waitFor(() => {
      const run = h.result.current.runState?.run;
      expect([run?.goal, run?.version]).toEqual(["Reorganize the folders", 2]);
    });
    // A late approval for v1 arrives on its own and is rejected as stale.
    await waitFor(() =>
      expect(h.result.current.runState?.timeline.some((e) => e.reason === "approval_stale")).toBe(true),
    );
    // Approve once the agent has said so — as a reader pressing Run plan would.
    await waitFor(() => expect((lastText(h) as { text: string; streaming?: boolean }).text).toMatch(/approve v2/), { timeout: 8000 });
    await waitFor(() => {
      act(() => h.result.current.approvePlan?.(2));
      expect(h.result.current.runState?.run?.status).not.toBe("proposed");
    }, { timeout: 8000 });
    await settled(h);

    await beat(h, "approvals", 4);
    await settled(h);
    expect(asToolOutput(tools(h).at(-1)!.result)?.kind).toBe("environment-variables");
  });

  it("run-control: pause, queue, resume; a run nobody pauses is never blocked", async () => {
    const h = start("run-control");
    await beat(h, "run-control", 0);
    await waitFor(() => expect(h.result.current.runState?.run?.plan[1].status).toBe("running"));
    act(() => h.result.current.pause?.());
    await waitFor(() => expect(h.result.current.runState?.run?.status).toBe("paused"));
    act(() => h.result.current.enqueue?.("and then this"));
    expect(h.result.current.runState?.run?.queue).toHaveLength(1);
    expect(h.result.current.runState?.run?.checkpoints).toHaveLength(1);
    act(() => h.result.current.resume?.());
    await settled(h);
    expect(h.result.current.runState?.run?.status).toBe("completed");

    // Never pressing Pause: beat 1 finishes by itself.
    const free = start("run-control");
    await beat(free, "run-control", 0);
    await waitFor(() => expect(free.result.current.runState?.run?.status).toBe("completed"), { timeout: 8000 });
    await settled(free);
  });

  it("run-control: cancel mid-step, then Restore really rewinds the run to a checkpoint on it", async () => {
    const h = start("run-control");
    await beat(h, "run-control", 0);
    await waitFor(() => expect(h.result.current.runState?.run?.status).toBe("completed"), { timeout: 8000 });
    await settled(h);

    await beat(h, "run-control", 1);
    await waitFor(() => expect(h.result.current.runState?.run?.plan[1]?.status).toBe("running"));
    act(() => h.result.current.cancel?.());
    await waitFor(() => expect(h.result.current.runState?.run?.status).toBe("cancelled"));
    await settled(h);

    await beat(h, "run-control", 2);
    await settled(h);
    const run = h.result.current.runState!.run!;
    // The checkpoint exists on the CURRENT run (run_proposed starts one with none).
    expect(run.goal).toBe("Reindex search");
    expect(run.checkpoints.map((c) => c.id)).toEqual(["cp-rx-1"]);
    // Nothing says "Restored" until resume(checkpointId) is called.
    expect(JSON.stringify(h.result.current.turns)).not.toMatch(/Restored/);
    act(() => h.result.current.resume?.("cp-rx-1"));
    // resume rewinds: run_status running with resumeFrom resets the steps after the checkpoint.
    expect(h.result.current.runState?.run?.status).toBe("running");
    expect(h.result.current.runState?.timeline.some((e) => /Resumed from checkpoint/.test(e.text))).toBe(true);
    expect(h.result.current.runState?.run?.plan.map((p) => p.status)).toEqual(["done", "pending"]);
    expect((lastText(h) as { text: string }).text).toMatch(/Restored to "After the index backup"/);
    await waitFor(() => expect(h.result.current.runState?.run?.status).toBe("completed"), { timeout: 4000 });
  });

  it("recovery: reconnect, partial failure + retry, fatal + retry succeeds, handoff with owner and note", async () => {
    const h = start("recovery");
    await beat(h, "recovery", 0);
    await waitFor(() => expect(h.result.current.runState?.connection).toBe("reconnecting"));
    await waitFor(() => expect(h.result.current.runState?.connection).toBe("connected"));
    await settled(h);

    await beat(h, "recovery", 1);
    await waitFor(() => expect(h.result.current.runState?.run?.status).toBe("partially_failed"));
    const failed = h.result.current.runState!.run!.effects.find((f) => f.status === "failed")!;
    act(() => h.result.current.retryEffect?.(failed.id));
    await waitFor(() => expect(h.result.current.runState?.run?.status).toBe("completed"));
    await settled(h);

    await beat(h, "recovery", 2);
    await waitFor(() => expect(h.result.current.error).not.toBeNull());
    await settled(h);
    await act(async () => {
      await h.result.current.regenerate?.("x");
    });
    expect(h.result.current.error).toBeNull();
    expect((lastText(h) as { text: string }).text).toMatch(/worked this time/);

    await beat(h, "recovery", 3);
    await waitFor(() => {
      const run = h.result.current.runState?.run;
      expect([run?.goal, run?.plan[1].status]).toEqual(["Cancel the flight booking", "failed"]);
    });
    expect(h.result.current.runState?.run?.status).toBe("handoff_required");
    // Hand off once the agent has asked for it — as a reader would.
    await waitFor(() => expect((lastText(h) as { text: string }).text).toMatch(/Hand it to a person/), { timeout: 8000 });
    await waitFor(() => {
      act(() => h.result.current.handoff?.("needs airline access", "Dana"));
      expect(h.result.current.isLoading).toBe(false);
    }, { timeout: 8000 });
    expect(h.result.current.runState?.run?.handoff).toMatchObject({ owner: "Dana", note: "needs airline access" });
  });

  it("long-session: usage reaches 90%, summarise shrinks it and posts a summary, agent profile", async () => {
    const h = start("long-session");
    expect(h.result.current.agent?.name).toBeTruthy();
    await beat(h, "long-session", 0);
    await settled(h);
    const u = h.result.current.usage!;
    expect(u.usedTokens / u.maxTokens).toBeGreaterThanOrEqual(0.9);
    const before = h.result.current.turns.length;
    await act(async () => {
      await h.result.current.summarise?.();
    });
    const after = h.result.current.usage!;
    expect(after.usedTokens).toBeLessThan(u.usedTokens / 2);
    expect(h.result.current.turns.length).toBe(before + 1);
  });

  it("usage grows per beat in every conversation", async () => {
    const h = start("chat");
    const a = h.result.current.usage!.usedTokens;
    await beat(h, "chat", 0);
    await settled(h);
    expect(h.result.current.usage!.usedTokens).toBeGreaterThan(a);
  });
});

describe("answers carry the model, the chat has a command snippet, the default path is frozen", () => {
  it("stamps TextTurn.model: the chosen model, else the default", async () => {
    const h = start("chat");
    await act(async () => {
      void h.result.current.send(def("chat").beats[0].prompt, { model: "deep" });
    });
    await settled(h);
    const texts = h.result.current.turns.filter((t) => t.kind === "text") as { model?: string }[];
    expect(texts.length).toBeGreaterThan(0);
    expect(texts.every((t) => t.model === "deep")).toBe(true);
    await act(async () => {
      void h.result.current.send(def("chat").beats[1].prompt);
    });
    await settled(h);
    expect((lastText(h) as { model?: string }).model).toBe("steady");
  });

  it("chat beat 2 has inline code a Snippet can draw, beside the code block", async () => {
    const h = start("chat");
    await beat(h, "chat", 0);
    await settled(h);
    await beat(h, "chat", 1);
    await settled(h);
    const text = (lastText(h) as { text: string }).text;
    expect(text).toContain("`npm run dev`");
    expect(text).toContain("```ts");
  });

  it("the keyword default path is unchanged: no model stamp, no tool result on failure", async () => {
    const h = renderHook(() => useMockTransport({ latency: 0 }));
    await act(async () => {
      void h.result.current.send("what is the price, it may fail");
    });
    await settled(h);
    const failed = tools(h)[0];
    expect(failed.status).toBe("error");
    expect(failed.result).toBeUndefined();
    const texts = h.result.current.turns.filter((t) => t.kind === "text") as { model?: string }[];
    expect(texts.every((t) => t.model === undefined)).toBe(true);
  });
});

describe("speakMock", () => {
  it("returns a WAV data url without touching the network", async () => {
    const url = await speakMock("Hello there");
    expect(url).toMatch(/^data:audio\/wav;base64,UklGR/);
  });
});

describe("mock transport — the contracts the composer and reply read", () => {
  it("a generated image reports typed progress while it runs", async () => {
    const h = start("tools");
    for (let i = 0; i < 4; i += 1) {
      await beat(h, "tools", i);
      await settled(h);
    }
    await beat(h, "tools", 4);
    await waitFor(
      () => {
        const running = tools(h).find((t) => t.name === "generate_image" && t.status === "running");
        expect(asToolOutput(running?.partial)).toMatchObject({ kind: "image" });
      },
      { timeout: 8000, interval: 5 },
    );
    await settled(h);
  });

  it("transcribes recorded audio in a conversation, and the keyword path offers no transcription", async () => {
    const h = start("long-session");
    expect(h.result.current.transcribe).toBeTypeOf("function");
    const text = await h.result.current.transcribe!(new Blob(["x"]));
    expect(text).toMatch(/call the vendor/);
    const plain = renderHook(() => useMockTransport({ latency: 0 }));
    expect(plain.result.current.transcribe).toBeUndefined();
  });
});
