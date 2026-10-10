/**
 * @covers agent-core
 *
 * `agent-core` is not a component — it is the transport-agnostic contract
 * every agent surface renders from: `reduceEvent` folds raw wire events into
 * turns, `resolveState` derives one of twenty `AgentState`s from the result.
 * Neither imports React, so the first half of this file drives them exactly
 * as a transport does: through `useMockTransport` from
 * `lib/agent/mock-transport.ts`, the reference implementation named in
 * `docs/agent-workspace.md` as "the file to read before writing a real
 * transport" — sending its unkeyworded message runs the "default" script
 * (say → tool_call/tool_result → say → done), and every turn that lands is
 * therefore the product of `reduceEvent`, not a shape this test invented.
 *
 * The state SEQUENCE is asserted, not just the end state: `resolveState` is
 * recomputed after every change to `turns`/`isLoading` and deduplicated, so a
 * flaky exact-count assertion is avoided while still proving the ladder in
 * `core/resolve-state.ts` is walked in the order its own comments claim —
 * `thinking` before a tool is seen, `calling_tools` while it runs, prose
 * after it resolving to `summarizing` (text following a tool in the same
 * turn), and `done` once the transport settles.
 *
 * The second half renders `ReducerWalkthrough`
 * (`components/docs/component-docs/agent-core/reducer-walkthrough.tsx`) —
 * the family's own Preview specimen for this exact capability, driving
 * `reduceEvent`/`resolveState` through the identical script one step per
 * click — and axes it, which is the only way a capability with no component
 * of its own earns an axe pass.
 */

import * as React from "react";
import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { useMockTransport } from "@/lib/agent/mock-transport";
import { resolveState } from "@/components/agent/core/resolve-state";
import type { AgentState } from "@/components/agent/core/states";
import type { AgentTurn } from "@/components/agent/core/types";
import { ReducerWalkthrough } from "@/components/docs/component-docs/agent-core/reducer-walkthrough";

/** A host that runs the real hook and records every distinct resolved state. */
function TransportHost({ onStates, onTurns, message = "look up sealed boxes" }: {
  onStates: (states: AgentState[]) => void;
  onTurns: (turns: AgentTurn[]) => void;
  /** Which mock script to run — see `scriptFor` in `lib/agent/mock-transport.ts`. */
  message?: string;
}) {
  const transport = useMockTransport({ latency: 10 });
  const seen = useRef<AgentState[]>([]);

  const state = resolveState({
    turns: transport.turns,
    signals: { isLoading: transport.isLoading, awaitingFirstEvent: false, declared: null },
  });

  // Record after every commit — the test drives this by waiting for the
  // button click's effects to settle, so an effect per render captures
  // exactly the sequence `resolveState` produced as the transport progressed.
  // (An effect rather than a render-time push: refs are not for reading or
  // writing during render, and the lint rule is right about it.)
  React.useEffect(() => {
    if (seen.current[seen.current.length - 1] !== state) seen.current.push(state);
    onStates(seen.current);
    onTurns(transport.turns);
  });

  return (
    <>
      <button type="button" onClick={() => transport.send(message)}>
        Send
      </button>
      {/* Answers through the same channel the console's own ApprovalCard uses
          — `transport.pendingApprovals[n].approve()` — not a direct turn
          mutation, so this exercises the real resolve path. */}
      {transport.pendingApprovals.map((approval) => (
        <button key={approval.turnId} type="button" onClick={approval.approve}>
          Approve
        </button>
      ))}
    </>
  );
}

describe("agent-core: reduceEvent + resolveState, driven by the mock transport", () => {
  it("folds a real turn from lib/agent/mock-transport.ts and walks the state ladder in order", async () => {
    const user = userEvent.setup();
    let turns: AgentTurn[] = [];
    const states: AgentState[] = [];

    render(
      <TransportHost
        onStates={(s) => states.splice(0, states.length, ...s)}
        onTurns={(t) => (turns = t)}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(
      () => {
        expect(turns.some((t) => t.kind === "tool" && t.status === "ok")).toBe(true);
      },
      { timeout: 10_000 },
    );
    await waitFor(
      () => {
        const last = turns.at(-1);
        expect(last?.kind === "text" && last.streaming === false).toBe(true);
      },
      { timeout: 10_000 },
    );

    // The shape reduceEvent actually built: a user turn, a settled tool call
    // it found by name, and a settled text turn — never mutated in place.
    expect(turns[0]).toMatchObject({ kind: "user", text: "look up sealed boxes" });
    const tool = turns.find((t) => t.kind === "tool");
    expect(tool).toMatchObject({
      kind: "tool",
      name: "search_inventory",
      status: "ok",
      result: { matches: 3, topResult: "Eclipse Vault — 1st Edition" },
    });
    const finalText = turns.at(-1);
    expect(finalText?.kind === "text" && finalText.text).toContain("Three sealed boxes match");

    // The ladder in core/resolve-state.ts, walked in the order its comments
    // claim: queued/thinking before anything is seen, calling_tools while the
    // tool runs, prose afterwards resolving to summarizing, done once settled.
    const thinkingIx = states.findIndex((s) => s === "thinking" || s === "queued");
    const toolIx = states.indexOf("calling_tools");
    const doneIx = states.indexOf("done");
    expect(thinkingIx).toBeGreaterThanOrEqual(0);
    expect(toolIx).toBeGreaterThan(thinkingIx);
    expect(doneIx).toBeGreaterThan(toolIx);
    expect(states).toContain("summarizing");
    expect(states.indexOf("summarizing")).toBeGreaterThan(toolIx);
  }, 15_000);
});

describe("agent-core: awaiting_approval is reachable through the shipped transport", () => {
  /**
   * `AgentState`'s `awaiting_approval` is driven entirely by
   * `turn.approval === "pending"` (`core/resolve-state.ts`). `reduceEvent`'s
   * `action_request` branch does not — and should not — set that on its own:
   * an `action_request` also covers a DOM action nobody is meant to approve,
   * so the reducer has no way to know a given one blocks on a human. It is
   * `useMockTransport`'s `askPermission` — the one place that actually knows
   * this particular request is an approval — that must mark the turn pending
   * the moment it opens, symmetric with the `markApproval("approved" |
   * "rejected")` call once it is answered. Before that call existed, nothing
   * ever wrote "pending" onto the turn at all, and this state was provably
   * unreachable through the real transport despite `ApprovalCard` rendering
   * correctly (it reads `transport.pendingApprovals`, not the turn).
   */
  it("'buy' walks the mock transport's approval script to awaiting_approval and back to done", async () => {
    const user = userEvent.setup();
    let turns: AgentTurn[] = [];
    const states: AgentState[] = [];

    render(
      <TransportHost
        onStates={(s) => states.splice(0, states.length, ...s)}
        onTurns={(t) => (turns = t)}
        message="buy a pack"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Send" }));

    // The script streams two sentences and runs a 700ms tool call before it
    // asks — longer than testing-library's default 1000ms `waitFor` window.
    await waitFor(
      () => {
        expect(states).toContain("awaiting_approval");
      },
      { timeout: 10_000 },
    );

    // While held, the action turn itself is pending — not just the console's
    // separate pendingApprovals list — which is exactly the field
    // `resolveState` reads.
    const action = turns.find((t) => t.kind === "action");
    expect(action).toMatchObject({ kind: "action", approval: "pending" });

    // Approve through the same channel the console does: the pending
    // approval's own `approve()`, not a direct turn mutation.
    await user.click(screen.getByRole("button", { name: "Approve" }));

    // Same window as the wait above: after approval the script still runs
    // the tool and streams its closing sentence, which under a loaded full
    // suite overruns testing-library's default 1000ms.
    await waitFor(
      () => {
        expect(turns.some((t) => t.kind === "action" && t.approval === "approved")).toBe(true);
      },
      { timeout: 10_000 },
    );

    await waitFor(
      () => {
        const last = turns.at(-1);
        expect(last?.kind === "text" && last.streaming === false).toBe(true);
      },
      { timeout: 10_000 },
    );

    expect(states.indexOf("done")).toBeGreaterThan(states.indexOf("awaiting_approval"));
  }, 15_000);
});

describe("agent-core: the reducer-walkthrough specimen", () => {
  it("steps reduceEvent/resolveState through the documented script to completion", async () => {
    const user = userEvent.setup();
    render(<ReducerWalkthrough />);

    expect(screen.getByText("Not started")).toBeInTheDocument();

    const step = () => screen.getByRole("button", { name: /Send|Next event|Finished/ });
    // Six scripted steps: user turn, then five folded events ending in `done`.
    for (let i = 0; i < 6; i += 1) {
      await user.click(step());
    }

    expect(screen.getByRole("button", { name: "Finished" })).toBeDisabled();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("axe: the walkthrough after a few steps, avatar and status line both live", async () => {
    const user = userEvent.setup();
    const { container } = render(<ReducerWalkthrough />);
    await user.click(screen.getByRole("button", { name: "Send" }));
    await user.click(screen.getByRole("button", { name: "Next event" }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
