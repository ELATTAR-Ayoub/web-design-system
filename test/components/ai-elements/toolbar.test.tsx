import { ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Record the props Toolbar hands to NodeToolbar, rendering the real component.
const tbProps = vi.hoisted(() => ({ calls: [] as Record<string, unknown>[] }));
vi.mock("@xyflow/react", async () => {
  const actual = await vi.importActual<typeof import("@xyflow/react")>("@xyflow/react");
  return {
    ...actual,
    NodeToolbar: (props: Record<string, unknown>) => {
      tbProps.calls.push(props);
      return <actual.NodeToolbar {...(props as object)} />;
    },
  };
});

import { Toolbar } from "@/components/ai-elements/toolbar";

if (typeof globalThis.DOMMatrixReadOnly === "undefined") {
  class DOMMatrixReadOnlyStub {
    m22 = 1;
  }
  // @ts-expect-error -- minimal stub, not a full DOMMatrix implementation
  globalThis.DOMMatrixReadOnly = DOMMatrixReadOnlyStub;
}

const nodes = [{ id: "n1", position: { x: 0, y: 0 }, data: {} }];

const nodeTypes = {
  withToolbar: ({ id }: { id: string }) => (
    <Toolbar isVisible nodeId={id}>
      <button type="button">Delete step</button>
    </Toolbar>
  ),
};

describe("Toolbar", () => {
  it("attaches a per-node action row, forced visible via isVisible", () => {
    render(
      <div style={{ height: 300, width: 300 }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes.map((n) => ({ ...n, type: "withToolbar" }))}
            edges={[]}
            nodeTypes={nodeTypes}
          />
        </ReactFlowProvider>
      </div>
    );

    const button = screen.getByRole("button", { name: "Delete step" });
    expect(button).toBeInTheDocument();
    const root = button.closest(".react-flow__node-toolbar");
    expect(root?.className).toContain("bg-background");
    expect(root?.className).toContain("rounded-sm");
  });

  it("an explicit position prop overrides the Bottom default", () => {
    tbProps.calls.length = 0;
    const lastPosition = () => tbProps.calls[tbProps.calls.length - 1]?.position;
    const nodeTypesTop = {
      withToolbar: ({ id }: { id: string }) => (
        <Toolbar isVisible nodeId={id} position={"top" as never}>
          <button type="button">Top action</button>
        </Toolbar>
      ),
    };

    render(
      <div style={{ height: 300, width: 300 }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes.map((n) => ({ ...n, type: "withToolbar" }))}
            edges={[]}
            nodeTypes={nodeTypesTop}
          />
        </ReactFlowProvider>
      </div>
    );

    expect(screen.getByRole("button", { name: "Top action" })).toBeInTheDocument();
    expect(lastPosition()).toBe("top");
  });

  it("uses Position.Bottom when no position is given", () => {
    tbProps.calls.length = 0;
    render(
      <div style={{ height: 300, width: 300 }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes.map((n) => ({ ...n, type: "withToolbar" }))}
            edges={[]}
            nodeTypes={nodeTypes}
          />
        </ReactFlowProvider>
      </div>
    );
    expect(tbProps.calls[tbProps.calls.length - 1]?.position).toBe("bottom");
  });
});
