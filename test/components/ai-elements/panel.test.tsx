import { ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Panel } from "@/components/ai-elements/panel";

if (typeof globalThis.DOMMatrixReadOnly === "undefined") {
  class DOMMatrixReadOnlyStub {
    m22 = 1;
  }
  // @ts-expect-error -- minimal stub, not a full DOMMatrix implementation
  globalThis.DOMMatrixReadOnly = DOMMatrixReadOnlyStub;
}

describe("Panel", () => {
  it("floats arbitrary children over the canvas on the card token", () => {
    render(
      <div style={{ height: 300, width: 300 }}>
        <ReactFlowProvider>
          <ReactFlow nodes={[]} edges={[]}>
            <Panel position="top-right">
              <button type="button">Run plan</button>
            </Panel>
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    );

    const button = screen.getByRole("button", { name: "Run plan" });
    expect(button).toBeInTheDocument();
    const panelRoot = button.closest(".react-flow__panel");
    expect(panelRoot?.className).toContain("bg-card");
    expect(panelRoot?.className).toContain("rounded-md");
  });

  it("respects the position prop React Flow uses for placement", () => {
    render(
      <div style={{ height: 300, width: 300 }}>
        <ReactFlowProvider>
          <ReactFlow nodes={[]} edges={[]}>
            <Panel position="bottom-left">legend</Panel>
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    );

    const panelRoot = screen.getByText("legend").closest(".react-flow__panel");
    expect(panelRoot?.className).toContain("bottom");
    expect(panelRoot?.className).toContain("left");
  });
});
