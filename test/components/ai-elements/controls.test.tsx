import { ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Controls } from "@/components/ai-elements/controls";

if (typeof globalThis.DOMMatrixReadOnly === "undefined") {
  class DOMMatrixReadOnlyStub {
    m22 = 1;
  }
  // @ts-expect-error -- minimal stub, not a full DOMMatrix implementation
  globalThis.DOMMatrixReadOnly = DOMMatrixReadOnlyStub;
}

describe("Controls", () => {
  it("renders React Flow's zoom/fit-view buttons restyled onto the card token", () => {
    const { container } = render(
      <div style={{ height: 300, width: 300 }}>
        <ReactFlowProvider>
          <ReactFlow nodes={[]} edges={[]}>
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    );

    const root = container.querySelector(".react-flow__controls");
    expect(root).toBeInTheDocument();
    expect(root?.className).toContain("bg-card");
    expect(root?.className).toContain("rounded-md");
    // zoom-in, zoom-out, fit-view are always rendered by default.
    expect(container.querySelectorAll(".react-flow__controls-button").length).toBeGreaterThanOrEqual(3);
  });

  it("raises xyflow's 26px zoom/fit buttons to the 44px target floor and strips its chrome", () => {
    const { container } = render(
      <div style={{ height: 300, width: 300 }}>
        <ReactFlowProvider>
          <ReactFlow nodes={[]} edges={[]}>
            <Controls className="extra-class" />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    );

    const root = container.querySelector(".react-flow__controls");
    expect(root?.className).toContain("extra-class");
    // jsdom has no stylesheet, so the size is asserted as the applied
    // child-selector class (the built-CSS effect is covered by the browser).
    expect(root?.className).toContain("[&>button]:size-(--size-target-min)!");
    expect(root?.className).toContain("[&>button]:bg-transparent!");
    expect(root?.className).toContain("[&>button]:border-none!");
  });
});
