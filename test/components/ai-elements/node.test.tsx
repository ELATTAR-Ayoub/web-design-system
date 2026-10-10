import { ReactFlowProvider } from "@xyflow/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@/components/ai-elements/node";

// `Handle` (rendered by `Node` when `handles.target`/`handles.source` is true)
// reads the nearest React Flow store via context, so every render needs a
// `ReactFlowProvider` even outside a full `<ReactFlow>` tree.
const renderNode = (ui: React.ReactElement) =>
  render(<ReactFlowProvider>{ui}</ReactFlowProvider>);

describe("Node", () => {
  it("renders the three-band card (header / content / footer) from the official workflow example shape", () => {
    renderNode(
      <Node handles={{ source: true, target: true }}>
        <NodeHeader>
          <NodeTitle>Process Data</NodeTitle>
          <NodeDescription>Transform input</NodeDescription>
        </NodeHeader>
        <NodeContent>
          <p>Validating records</p>
        </NodeContent>
        <NodeFooter>
          <p>Duration: ~2.5s</p>
        </NodeFooter>
      </Node>
    );

    expect(screen.getByText("Process Data")).toBeInTheDocument();
    expect(screen.getByText("Transform input")).toBeInTheDocument();
    expect(screen.getByText("Validating records")).toBeInTheDocument();
    expect(screen.getByText("Duration: ~2.5s")).toBeInTheDocument();
  });

  it("renders a target handle only when handles.target is true", () => {
    const { container, rerender } = renderNode(
      <Node handles={{ source: false, target: true }}>
        <NodeHeader>
          <NodeTitle>Start</NodeTitle>
        </NodeHeader>
      </Node>
    );
    expect(container.querySelectorAll(".react-flow__handle")).toHaveLength(1);

    rerender(
      <ReactFlowProvider>
        <Node handles={{ source: true, target: true }}>
          <NodeHeader>
            <NodeTitle>Middle</NodeTitle>
          </NodeHeader>
        </Node>
      </ReactFlowProvider>
    );
    expect(container.querySelectorAll(".react-flow__handle")).toHaveLength(2);
  });

  it("carries the token-driven band classes (border-b/border-t, bg-secondary) rather than an arbitrary value", () => {
    const { container } = renderNode(
      <Node handles={{ source: false, target: false }}>
        <NodeHeader>
          <NodeTitle>Header band</NodeTitle>
        </NodeHeader>
        <NodeFooter>
          <p>Footer band</p>
        </NodeFooter>
      </Node>
    );

    const header = container.querySelector('[data-slot="card-header"]');
    const footer = container.querySelector('[data-slot="card-footer"]');
    expect(header?.className).toContain("bg-secondary");
    expect(header?.className).toContain("border-b");
    expect(footer?.className).toContain("bg-secondary");
    expect(footer?.className).toContain("border-t");
  });
});
