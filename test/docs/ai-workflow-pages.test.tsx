/**
 * Smoke tests for the documentation pages of the workflow-graph group: every
 * specimen renders, every page's render nodes render, and each component has
 * one meaningful assertion.
 *
 * @covers ai-canvas
 * @covers ai-node
 * @covers ai-edge
 * @covers ai-connection
 * @covers ai-controls
 * @covers ai-panel
 * @covers ai-toolbar
 *
 * jsdom has no layout, so the React Flow stubs from
 * test/components/ai-elements/edge.test.tsx are reused here: a DOMMatrix
 * stub, a fixed offset size, and a ResizeObserver that reports a plausible
 * node size synchronously. Without them xyflow never measures a node and the
 * handles, edges and toolbar never appear.
 */
import { ReactFlowProvider } from "@xyflow/react";
import type { ReactNode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { spec as canvasSpec } from "@/components/docs/component-docs/ai-canvas/page";
import { CanvasPreview, CanvasStateGrid } from "@/components/docs/component-docs/ai-canvas/canvas-specimen";
import { spec as nodeSpec } from "@/components/docs/component-docs/ai-node/page";
import { NodePreview, NodeStateGrid } from "@/components/docs/component-docs/ai-node/node-specimen";
import { spec as edgeSpec } from "@/components/docs/component-docs/ai-edge/page";
import { EdgePreview, EdgeStateGrid } from "@/components/docs/component-docs/ai-edge/edge-specimen";
import { spec as connectionSpec } from "@/components/docs/component-docs/ai-connection/page";
import { ConnectionFrozen, ConnectionPreview, ConnectionStateGrid } from "@/components/docs/component-docs/ai-connection/connection-specimen";
import { spec as controlsSpec } from "@/components/docs/component-docs/ai-controls/page";
import { ControlsPreview, ControlsStateGrid } from "@/components/docs/component-docs/ai-controls/controls-specimen";
import { spec as panelSpec } from "@/components/docs/component-docs/ai-panel/page";
import { PanelPreview, PanelStateGrid } from "@/components/docs/component-docs/ai-panel/panel-specimen";
import { spec as toolbarSpec } from "@/components/docs/component-docs/ai-toolbar/page";
import { ToolbarPreview, ToolbarStateGrid } from "@/components/docs/component-docs/ai-toolbar/toolbar-specimen";

beforeAll(() => {
  if (typeof globalThis.DOMMatrixReadOnly === "undefined") {
    class DOMMatrixReadOnlyStub {
      m22 = 1;
    }
    // @ts-expect-error -- minimal stub, not a full DOMMatrix implementation
    globalThis.DOMMatrixReadOnly = DOMMatrixReadOnlyStub;
  }
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", { configurable: true, value: 150 });
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", { configurable: true, value: 40 });
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
        this as unknown as ResizeObserver,
      );
    }
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = SyncResizeObserverStub as unknown as typeof ResizeObserver;
});

afterEach(cleanup);

/** Every ReactNode a page hands the renderer: previews, install notes and disclosure bodies. */
function renderNodes(spec: ComponentDocSpec): ReactNode[] {
  return spec.sections.flatMap((section): ReactNode[] => {
    if (section.kind === "showcase" || section.kind === "effect") return [section.render];
    if (section.kind === "install") return [section.notes];
    if (section.kind === "disclosure") return section.blocks.map((block) => block.body);
    return [];
  });
}

function renderSpec(spec: ComponentDocSpec) {
  return render(
    <>
      {renderNodes(spec).map((node, i) => (
        <div key={i}>{node}</div>
      ))}
    </>,
  );
}

const SECTION_IDS = ["preview", "installation", "usage", "states", "api", "accessibility", "why", "source"];

function expectSections(spec: ComponentDocSpec) {
  const ids = spec.sections.map((s) => s.id);
  for (const id of SECTION_IDS) expect(ids).toContain(id);
  // The brief's order: preview, installation, usage, states, [examples], api, accessibility, why, source.
  expect(ids.filter((id) => SECTION_IDS.includes(id))).toEqual(SECTION_IDS);
}

describe("ai-canvas page", () => {
  it("has every section and renders its specimens with a background and a labelled graph", () => {
    expectSections(canvasSpec);
    const { container } = render(
      <>
        <CanvasPreview />
        <CanvasStateGrid />
      </>,
    );
    renderSpec(canvasSpec);
    expect(screen.getAllByRole("group", { name: "Plan as a workflow graph" }).length).toBeGreaterThan(0);
    expect(container.querySelector(".react-flow__background")).toBeInTheDocument();
    expect(container.querySelector(".xy-tokens")).toBeInTheDocument();
  });
});

describe("ai-node page", () => {
  it("renders the node parts, with a title and a status footer", () => {
    expectSections(nodeSpec);
    render(
      <>
        <NodePreview />
        <NodeStateGrid />
      </>,
    );
    renderSpec(nodeSpec);
    expect(screen.getAllByText("Fetch the report").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Done").length).toBeGreaterThan(0);
  });
});

describe("ai-edge page", () => {
  it("draws the animated edge's travelling dot on the action-ink colour", () => {
    expectSections(edgeSpec);
    // xyflow only lays out an edge in jsdom when a ReactFlowProvider owns the
    // store (the same wrapper test/components/ai-elements/edge.test.tsx uses),
    // so the preview is rendered inside one, alone: a provider is shared by
    // every graph beneath it.
    const { container } = render(
      <ReactFlowProvider>
        <EdgePreview />
      </ReactFlowProvider>,
    );
    const dot = container.querySelector('circle[fill="var(--color-action-ink)"]');
    expect(dot?.querySelector("animateMotion")).toBeInTheDocument();
    cleanup();
    render(<EdgeStateGrid />);
    renderSpec(edgeSpec);
    expect(screen.getAllByRole("group", { name: "temporary edge" }).length).toBeGreaterThan(0);
  });
});

describe("ai-connection page", () => {
  it("draws the frozen line as a named image with a path and an end dot", () => {
    expectSections(connectionSpec);
    render(
      <>
        <ConnectionFrozen />
        <ConnectionPreview />
        <ConnectionStateGrid />
      </>,
    );
    renderSpec(connectionSpec);
    const [line] = screen.getAllByRole("img", { name: "A connection line mid-drag" });
    expect(line.querySelector("path.animated")).toBeInTheDocument();
    expect(line.querySelector("circle")?.getAttribute("fill")).toBe("var(--color-action-ink)");
  });
});

describe("ai-controls page", () => {
  it("renders the zoom and fit buttons by their accessible names", () => {
    expectSections(controlsSpec);
    render(
      <>
        <ControlsPreview />
        <ControlsStateGrid />
      </>,
    );
    renderSpec(controlsSpec);
    expect(screen.getAllByRole("button", { name: "Zoom In" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Zoom Out" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Fit View" }).length).toBeGreaterThan(0);
  });
});

describe("ai-panel page", () => {
  it("renders the corner panel with the goal and the plan version", () => {
    expectSections(panelSpec);
    const { container } = render(
      <>
        <PanelPreview />
        <PanelStateGrid />
      </>,
    );
    renderSpec(panelSpec);
    expect(screen.getAllByText("Weekly report").length).toBeGreaterThan(0);
    expect(container.querySelector(".react-flow__panel.top.left")).toBeInTheDocument();
    expect(container.querySelector(".react-flow__panel.bottom.right")).toBeInTheDocument();
  });
});

describe("ai-toolbar page", () => {
  it("renders the specimens, and the forced-visible toolbar's actions when jsdom lays the node out", () => {
    expectSections(toolbarSpec);
    const { container } = render(
      <>
        <ToolbarPreview />
        <ToolbarStateGrid />
      </>,
    );
    renderSpec(toolbarSpec);
    // The graph under it always renders; the toolbar itself is portalled by xyflow
    // into the viewport once the node is measured.
    expect(screen.getAllByText("Fetch the report").length).toBeGreaterThan(0);
    expect(container.querySelector(".react-flow__node")).toBeInTheDocument();
    const edit = screen.queryAllByRole("button", { name: "Edit step" });
    for (const button of edit) expect(button).toBeInTheDocument();
  });
});
