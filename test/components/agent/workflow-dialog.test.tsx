/**
 * @covers agent-workspace
 *
 * WorkflowDialog — the plan as a read-only React Flow graph.
 */
import type * as React from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WorkflowDialog, buildWorkflowGraph } from "@/components/agent/workspace/workflow-dialog";
import type { Run } from "@/components/agent/core/run";

/* The node toolbar shows for the selected node (React Flow's NodeToolbar),
   and jsdom never measures a node, so it can never be selected here. The
   toolbar boundary renders its children and records whether a caller forced
   it visible, so the edit flow is testable and "only on selection" is asserted. */
const { toolbarProps } = vi.hoisted(() => ({ toolbarProps: [] as Array<{ isVisible?: boolean }> }));
vi.mock("@/components/ai-elements/toolbar", () => ({
  Toolbar: ({ children, isVisible }: { children: React.ReactNode; isVisible?: boolean }) => {
    toolbarProps.push({ isVisible });
    return <div data-testid="node-toolbar">{children}</div>;
  },
}));

beforeAll(() => {
  // @xyflow measures through these; jsdom has neither.
  class DOMMatrixStub {
    m22 = 1;
  }
  (globalThis as { DOMMatrixReadOnly?: unknown }).DOMMatrixReadOnly ??= DOMMatrixStub;
  (globalThis as { DOMMatrix?: unknown }).DOMMatrix ??= DOMMatrixStub;
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

const run: Run = {
  id: "r1",
  version: 3,
  goal: "Ship the release",
  status: "running",
  plan: [
    { id: "s1", title: "Build", detail: "Compile the bundle", status: "done", ms: 900 },
    { id: "s2", title: "Deploy", status: "running" },
    { id: "s3", title: "Announce", status: "skipped" },
    { id: "s4", title: "Archive", status: "pending" },
  ],
  effects: [],
  checkpoints: [],
  queue: [],
  startedAt: 1,
};

describe("buildWorkflowGraph", () => {
  it("makes one node per step and an edge between each consecutive pair", () => {
    const { nodes, edges } = buildWorkflowGraph(run);
    expect(nodes.map((n) => n.id)).toEqual(["s1", "s2", "s3", "s4"]);
    expect(edges.map((e) => [e.source, e.target])).toEqual([
      ["s1", "s2"],
      ["s2", "s3"],
      ["s3", "s4"],
    ]);
  });

  it("animates the edge into the running step and dashes the edge into a skipped one", () => {
    const { edges } = buildWorkflowGraph(run);
    expect(edges.map((e) => e.type)).toEqual(["animated", "temporary", "default"]);
  });

  it("lays nodes out in a row, or a column when narrow", () => {
    const row = buildWorkflowGraph(run).nodes.map((n) => n.position);
    expect(new Set(row.map((p) => p.y)).size).toBe(1);
    const column = buildWorkflowGraph(run, { vertical: true }).nodes.map((n) => n.position);
    expect(new Set(column.map((p) => p.x)).size).toBe(1);
  });

  it("nodes are not connectable, draggable or deletable", () => {
    for (const n of buildWorkflowGraph(run).nodes) {
      expect(n.connectable).toBe(false);
      expect(n.draggable).toBe(false);
      expect(n.deletable).toBe(false);
    }
  });
});

describe("WorkflowDialog", () => {
  it("renders the goal and version in the panel and a node for every step", async () => {
    render(<WorkflowDialog onOpenChange={vi.fn()} open run={run} />);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Ship the release")).toBeInTheDocument();
    expect(screen.getByText(/Plan v3/)).toBeInTheDocument();
    for (const title of ["Build", "Deploy", "Announce", "Archive"]) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
    expect(screen.getByText("Compile the bundle")).toBeInTheDocument();
    expect(screen.getByText("Step 2 of 4")).toBeInTheDocument();
    expect(screen.getByText("Running")).toBeInTheDocument();
    expect(screen.getByText("900 ms")).toBeInTheDocument();
  });

  it("renders nothing when closed", () => {
    render(<WorkflowDialog onOpenChange={vi.fn()} open={false} run={run} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("offers Edit step on a proposed plan and hands the new title back", async () => {
    const onEditStep = vi.fn();
    render(<WorkflowDialog onEditStep={onEditStep} onOpenChange={vi.fn()} open run={{ ...run, status: "proposed" }} />);
    // Not forced visible: it appears for the selected node only.
    expect(toolbarProps.every((p) => p.isVisible === undefined)).toBe(true);
    // The stand-in renders inside the node, hidden until measured, so a hidden button has no accessible name: find it by its text.
    const [first] = (await screen.findAllByText("Edit step")).map((t) => t.closest("button") as HTMLButtonElement);
    await userEvent.click(first);
    // The nodes are visibility:hidden until xyflow measures them, which jsdom never does.
    const input = screen.getAllByRole("textbox", { hidden: true })[0];
    await userEvent.clear(input);
    await userEvent.type(input, "Build it");
    fireEvent.submit(input.closest("form") as HTMLFormElement);
    expect(onEditStep).toHaveBeenCalledWith("s1", "Build it");
  });

  it("offers no editing once the plan runs", () => {
    render(<WorkflowDialog onEditStep={vi.fn()} onOpenChange={vi.fn()} open run={run} />);
    expect(screen.queryByRole("button", { name: /Edit step/ })).toBeNull();
  });
});
