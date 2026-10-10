import { describe, expect, it } from "vitest";
import { reduceEvent, userTurn } from "@/components/agent/core/timeline";
import type { AgentTurn, SendOptions } from "@/components/agent/core/types";

describe("transcript additions", () => {
  it("attaches reasoning, sources and confidence to the streaming answer", () => {
    let turns: AgentTurn[] = [userTurn("hi")];
    turns = reduceEvent(turns, { type: "reasoning", step: "Read the question" });
    turns = reduceEvent(turns, { type: "reasoning_done", ms: 4200 });
    turns = reduceEvent(turns, { type: "text", content: "Answer [1]" });
    turns = reduceEvent(turns, { type: "sources", sources: [{ id: "a", n: 1, title: "Doc", url: "https://example.com", domain: "example.com" }] });
    turns = reduceEvent(turns, { type: "confidence", confidence: "low" });
    const last = turns.at(-1);
    expect(last?.kind).toBe("text");
    if (last?.kind !== "text") return;
    expect(last.reasoning).toEqual({ steps: ["Read the question"], ms: 4200 });
    expect(last.sources?.[0].n).toBe(1);
    expect(last.confidence).toBe("low");
  });

  it("ignores run events in the transcript reducer", () => {
    const turns: AgentTurn[] = [userTurn("hi")];
    const next = reduceEvent(turns, { type: "run", event: { type: "connection", eventId: "c", at: 1, connection: "offline" } });
    expect(next).toBe(turns);
  });
});

describe("SendOptions.sources (bug 5)", () => {
  it("accepts an array of source ids — a transport without retrieval simply ignores the field", () => {
    // This is a compile-time contract more than a runtime one: the point of
    // this test is that `SendOptions` type-checks with `sources` present.
    // Wiring `@`-picked sources into `AgentWorkspace`'s composer is Task 6.
    const options: SendOptions = { sources: ["s1", "s2"] };
    expect(options.sources).toEqual(["s1", "s2"]);

    const withoutSources: SendOptions = {};
    expect(withoutSources.sources).toBeUndefined();
  });
});
