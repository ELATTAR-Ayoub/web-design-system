import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Record the props Canvas hands to ReactFlow, rendering the real component.
const rfProps = vi.hoisted(() => ({ last: undefined as Record<string, unknown> | undefined }));
vi.mock("@xyflow/react", async () => {
  const actual = await vi.importActual<typeof import("@xyflow/react")>("@xyflow/react");
  return {
    ...actual,
    ReactFlow: (props: Record<string, unknown>) => {
      rfProps.last = props;
      return <actual.ReactFlow {...(props as object)} />;
    },
  };
});

import { Canvas } from "@/components/ai-elements/canvas";
import { Node, NodeContent, NodeHeader, NodeTitle } from "@/components/ai-elements/node";

// @xyflow/react measures node/viewport geometry with browser APIs jsdom does
// not implement. ResizeObserver is already stubbed globally in test/setup.ts;
// DOMMatrixReadOnly is xyflow-specific (used by its internal transform math)
// and is mocked here rather than globally, since this group's components are
// the only ones in the suite that render a live ReactFlow instance.
if (typeof globalThis.DOMMatrixReadOnly === "undefined") {
  class DOMMatrixReadOnlyStub {
    m22 = 1;
  }
  // @ts-expect-error -- minimal stub, not a full DOMMatrix implementation
  globalThis.DOMMatrixReadOnly = DOMMatrixReadOnlyStub;
}

const nodeTypes = {
  workflow: ({ data }: { data: { label: string } }) => (
    <Node handles={{ source: true, target: true }}>
      <NodeHeader>
        <NodeTitle>{data.label}</NodeTitle>
      </NodeHeader>
      <NodeContent>content</NodeContent>
    </Node>
  ),
};

const nodes = [
  { id: "a", position: { x: 0, y: 0 }, data: { label: "Start" }, type: "workflow" },
  { id: "b", position: { x: 200, y: 0 }, data: { label: "End" }, type: "workflow" },
];

const edges = [{ id: "e1", source: "a", target: "b" }];

describe("Canvas", () => {
  it("renders its nodes through the given nodeTypes, inside a Background", () => {
    const { container } = render(
      <div style={{ height: 400, width: 400 }}>
        <Canvas edges={edges} fitView nodes={nodes} nodeTypes={nodeTypes} />
      </div>
    );

    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("End")).toBeInTheDocument();
    // Background is always rendered ahead of children, per the component's
    // own contract (RULES-driven bg token instead of a raw colour).
    expect(container.querySelector(".react-flow__background")).toBeInTheDocument();
  });

  it("passes its opinionated defaults to ReactFlow, and lets the caller override them", () => {
    const box = (ui: React.ReactElement) => (
      <div style={{ height: 400, width: 400 }}>{ui}</div>
    );
    const { rerender } = render(box(<Canvas edges={edges} nodes={nodes} nodeTypes={nodeTypes} />));
    expect(rfProps.last).toMatchObject({
      deleteKeyCode: ["Backspace", "Delete"],
      fitView: true,
      panOnDrag: false,
      panOnScroll: true,
      selectionOnDrag: true,
      zoomOnDoubleClick: false,
    });

    rerender(box(<Canvas edges={edges} nodes={nodes} nodeTypes={nodeTypes} panOnDrag zoomOnDoubleClick />));
    expect(rfProps.last).toMatchObject({ panOnDrag: true, zoomOnDoubleClick: true });
  });
});
