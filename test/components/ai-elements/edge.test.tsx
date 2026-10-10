import { ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Edge } from "@/components/ai-elements/edge";

if (typeof globalThis.DOMMatrixReadOnly === "undefined") {
  class DOMMatrixReadOnlyStub {
    m22 = 1;
  }
  // @ts-expect-error -- minimal stub, not a full DOMMatrix implementation
  globalThis.DOMMatrixReadOnly = DOMMatrixReadOnlyStub;
}

// test/setup.ts's ResizeObserver stub is a deliberate no-op (it exists only so
// libraries that call `.observe()` don't throw), which is exactly the
// behaviour that leaves xyflow's nodes permanently "unmeasured": it computes
// a node's real size from the ResizeObserver callback via
// `node.offsetWidth`/`offsetHeight` (@xyflow/system's `getDimensions`), and
// without a fired callback `handleBounds` never populates, so `Edge.Animated`
// (which reads handle positions through `useInternalNode`) never has
// coordinates to draw from and both edge types stay unrendered. Overriding it
// here, scoped to this file, to synchronously report a plausible node size —
// this is the "mock what jsdom cannot run" case the brief calls out, not a
// claim about real layout.
Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
  configurable: true,
  value: 150,
});
Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
  configurable: true,
  value: 40,
});
class SyncResizeObserverStub {
  private readonly cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
  }
  observe(target: Element) {
    const size = { blockSize: 40, inlineSize: 150 };
    this.cb(
      [
        {
          target,
          contentRect: { width: 150, height: 40, top: 0, left: 0, right: 150, bottom: 40, x: 0, y: 0 },
          borderBoxSize: [size],
          contentBoxSize: [size],
        } as unknown as ResizeObserverEntry,
      ],
      this as unknown as ResizeObserver
    );
  }
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver =
  SyncResizeObserverStub as unknown as typeof ResizeObserver;

// jsdom never fires ResizeObserver, so React Flow never learns a node's real
// size and refuses to draw an edge to/from an "unmeasured" node. Supplying
// `measured` up front (as its own real, if headless, layout pass would)
// sidesteps that without faking the ResizeObserver callback itself.
const nodes = [
  { id: "a", position: { x: 0, y: 0 }, data: {}, measured: { width: 150, height: 40 } },
  { id: "b", position: { x: 200, y: 0 }, data: {}, measured: { width: 150, height: 40 } },
];

describe("Edge", () => {
  it("Temporary renders a dashed BaseEdge on the ring token, not a raw colour", () => {
    const edges = [{ id: "e1", source: "a", target: "b", type: "temporary" }];
    const { container } = render(
      <div style={{ height: 300, width: 300 }}>
        <ReactFlowProvider>
          <ReactFlow
            edges={edges}
            edgeTypes={{ temporary: Edge.Temporary }}
            nodes={nodes}
          />
        </ReactFlowProvider>
      </div>
    );

    const path = container.querySelector(".react-flow__edge-path");
    expect(path).toBeInTheDocument();
    expect(path?.getAttribute("class")).toContain("stroke-ring");
    // Set inline: the class loses to xyflow's unlayered edge-path rule.
    const style = path?.getAttribute("style") ?? "";
    expect(style).toContain("stroke: var(--color-ring)");
    expect(style).toContain("5, 5");
  });

  it("Animated renders a BaseEdge plus a travelling dot filled with the action-ink token", () => {
    const edges = [{ id: "e1", source: "a", target: "b", type: "animated" }];
    const { container } = render(
      <div style={{ height: 300, width: 300 }}>
        <ReactFlowProvider>
          <ReactFlow
            edges={edges}
            edgeTypes={{ animated: Edge.Animated }}
            nodes={nodes}
          />
        </ReactFlowProvider>
      </div>
    );

    const dot = container.querySelector("circle[fill]");
    expect(dot).toBeInTheDocument();
    expect(dot?.getAttribute("fill")).toBe("var(--color-action-ink)");
    expect(dot?.querySelector("animateMotion")).toBeInTheDocument();
  });
});
