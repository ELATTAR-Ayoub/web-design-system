import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Panel } from "@/components/ds/kit";

import { AdminSplitShowcase } from "./resizable-showcase";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "resizable",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Drag the handle — or tab to it and use the left and right arrow keys — and each pane prints its own live width. Not used in the collector-facing product; reserved for the admin surface, where a card table beside a detail pane needs an adjustable split.",
      render: (
        <Panel label="Admin split view" note="Future admin surface" flush>
          <AdminSplitShowcase />
        </Panel>
      ),
      source: `const [layout, setLayout] = useState<Layout>({ list: 40, detail: 60 });

<ResizablePanelGroup
  className="min-h-56 rounded-lg border border-border"
  onLayoutChanged={(next) => setLayout(next)}
>
  <ResizablePanel id="list" defaultSize={40} minSize={25}>
    <p>{Math.round(layout.list)}%</p>
  </ResizablePanel>
  <ResizableHandle withHandle aria-label="Resize the card list" />
  <ResizablePanel id="detail" defaultSize={60}>
    <p>{Math.round(layout.detail)}%</p>
  </ResizablePanel>
</ResizablePanelGroup>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "Name the handle — see Accessibility for why it is not optional.",
      language: "tsx",
      code: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export function AdminSplitView() {
  return (
    <ResizablePanelGroup className="min-h-56 rounded-lg border border-border">
      <ResizablePanel defaultSize={40} minSize={25}>
        <CardList />
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Resize the card list" />
      <ResizablePanel defaultSize={60}>
        <CardDetail />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "ResizablePanelGroup is horizontal by default; orientation=\"vertical\" stacks panels top-to-bottom with a horizontal handle between them.",
      label: "Vertical split",
      render: (
        <Panel label="Vertical split" className="max-w-md">
          <ResizablePanelGroup
            orientation="vertical"
            className="min-h-56 rounded-lg border border-border"
          >
            <ResizablePanel defaultSize={50} minSize={25}>
              <div className="h-full bg-background p-5">
                <p className="type-small text-muted-foreground">Top pane</p>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle aria-label="Resize the top pane" />
            <ResizablePanel defaultSize={50}>
              <div className="h-full bg-card p-5">
                <p className="type-small text-muted-foreground">Bottom pane</p>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Panel>
      ),
      source: `<ResizablePanelGroup orientation="vertical" className="min-h-56 rounded-lg border border-border">
  <ResizablePanel defaultSize={50} minSize={25}>{/* top */}</ResizablePanel>
  <ResizableHandle withHandle aria-label="Resize the top pane" />
  <ResizablePanel defaultSize={50}>{/* bottom */}</ResizablePanel>
</ResizablePanelGroup>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Each part forwards straight to react-resizable-panels beyond the className merge and, on the handle, the withHandle grip.",
      blocks: [
        {
          label: "ResizablePanelGroup",
          body: (
            <Meta
              items={[
                {
                  k: "(props)",
                  v: "react-resizable-panels' own GroupProps — orientation (\"horizontal\" | \"vertical\", default \"horizontal\"), autoSaveId, disabled, onLayoutChange, etc. — forwarded directly. This wrapper adds flex layout classes that read the resulting aria-orientation attribute to switch from a row to a column.",
                },
              ]}
            />
          ),
        },
        {
          label: "ResizablePanel",
          body: (
            <Meta
              items={[
                { k: "defaultSize", v: "number (0–100). Initial size as a percentage of the group." },
                { k: "minSize / maxSize", v: "number (0–100). Constrains how far the handle can drag this panel." },
                {
                  k: "...props",
                  v: "Every other react-resizable-panels PanelProps (collapsible, order, id, onResize, etc.), forwarded directly.",
                },
              ]}
            />
          ),
        },
        {
          label: "ResizableHandle",
          body: (
            <Meta
              items={[
                {
                  k: "withHandle",
                  v: "boolean. Default: false. Draws the visible grip bar inside the handle; the draggable/focusable separator itself is present either way.",
                },
                {
                  k: "...props",
                  v: "Every other react-resizable-panels SeparatorProps, forwarded directly — pass aria-label here (see Accessibility).",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "rest", v: "Panels at their defaultSize, handle idle." },
                {
                  k: "hover",
                  v: "N/A as a drawn style — this component declares no hover: class on the handle. The only pointer feedback on hover comes from the library setting the resize cursor on the separator element.",
                },
                { k: "focus-visible", v: "Tab to the handle — ring-1 ring-ring on the separator (see the outline in the preview above when tabbed to)." },
                { k: "pressed / dragging", v: "Handle is actively resizing its neighbouring panels, live." },
                {
                  k: "loading / success / error / empty",
                  v: "N/A — resizing is a synchronous, local layout change with no request, no completion and no content state of its own.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "react-resizable-panels gives the handle role=\"separator\", a tab stop, arrow-key resizing and aria-valuenow. What it does not invent is a name.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "separator (react-resizable-panels), on ResizableHandle." },
                {
                  k: "Accessible name",
                  v: "None by default. A valued control with no name announces as \"separator, 40\" with nothing to say what is being resized — pass aria-label describing what the handle resizes.",
                },
                { k: "State announcements", v: "aria-valuenow (and the implicit min/max) are set by the library as the handle moves." },
                { k: "Focus order", v: "The handle is a normal tab stop in document order, between the two panels it separates." },
                {
                  k: "Target size",
                  v: "The drawn separator is a 1px hairline, but its hit area is an invisible ::after widened to --size-target-min (44px) across the drag axis — react-resizable-panels' own stock class only reached 4px, a mouse-only target. Measured with elementFromPoint: a point 20px off the drawn line still resolves to the handle; a point past 22px does not, matching the 44px floor.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Tab / Shift+Tab", v: "Moves focus to and from the handle in document order." },
                { k: "Left / Right arrow", v: "Resizes a focused horizontal handle by 5% per press (react-resizable-panels)." },
                { k: "Up / Down arrow", v: "Resizes a focused vertical handle by 5% per press (react-resizable-panels)." },
                { k: "Home / End", v: "Drives the handle to its minimum / maximum extent." },
                { k: "Enter", v: "Collapses or expands the adjoining panel, only when that panel is configured collapsible — no-op otherwise." },
                { k: "F6", v: "Moves focus to the next separator in a group with more than one handle (Shift+F6 for the previous one)." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "Panels are sized in percentages of the group, not pixels — the group itself has no breakpoint, so its shape at any width is whatever percentages the caller passed to defaultSize.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "The group",
                  v: "ResizablePanelGroup is h-full w-full flex, switching to flex-col only via aria-[orientation=vertical] — there is no responsive variant that flips a horizontal split to a stacked one at a breakpoint; that is a layout decision the caller makes by rendering a different orientation prop, not something resizable.tsx does for you.",
                },
                {
                  k: "A real gap",
                  v: "A panel given a fixed minSize in pixels rather than a percentage can force the group wider than a narrow viewport, since react-resizable-panels enforces that minimum regardless of available width — this page's own specimens use percentage minSize/defaultSize for that reason.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920 for the percentage-based specimens on this page, none at 200% text zoom, and none under RTL — the handle's cursor and drag axis follow the group's own orientation rather than a hardcoded screen direction.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        {
          body: (
            <>
              <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} />
              <p className="type-small mt-3 text-muted-foreground">
                Built on <Code>react-resizable-panels</Code>, the same dependency
                that supplies role, tab stop, arrow-key resizing and{" "}
                <Code>aria-valuenow</Code> documented above.
              </p>
            </>
          ),
        },
      ],
    },
  ],
};
