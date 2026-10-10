/**
 * Authored documentation page for `ai-controls`.
 *
 * Live specimens render the real `Controls` inside a real `Canvas`
 * (`controls-specimen.tsx`) — the buttons need React Flow's store to work.
 */

import { ControlsPreview, ControlsStateGrid } from "./controls-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-controls",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "Zoom in, zoom out and fit view, bottom-left of the canvas. Press them: the graph above responds.",
      label: "Controls",
      render: <ControlsPreview />,
      source: `import { Canvas } from "@/components/ai-elements/canvas";
import { Controls } from "@/components/ai-elements/controls";

<Canvas edges={edges} nodes={nodes} nodeTypes={nodeTypes}>
  <Controls showInteractive={false} />
</Canvas>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It needs <code className="type-code">@xyflow/react</code>.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Controls is a child of Canvas — it reads the surrounding React Flow store, so it cannot sit outside one. It takes every prop of React Flow's Controls. The workflow dialog passes showInteractive={false}: the graph is read-only, so a lock toggle would do nothing.",
      language: "tsx",
      code: `import { Controls } from "@/components/ai-elements/controls";

<Canvas edges={edges} nodes={nodes} nodeTypes={nodeTypes}>
  {/* zoom and fit only */}
  <Controls showInteractive={false} />

  {/* a row instead of a column, top-right */}
  {/* <Controls orientation="horizontal" position="top-right" /> */}
</Canvas>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Each button is a native button inside a bordered card; the configurations below are what the props change.",
      blocks: [
        { body: <ControlsStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: a card surface with a border and no shadow, buttons transparent on it.{" "}
                <strong>hover</strong>: a button fills with the secondary surface.{" "}
                <strong>focus-visible</strong>: the buttons are native, so they take the browser&apos;s focus ring; the wrapper sets none of its own, and its overflow-hidden clips anything that is drawn outside the box.{" "}
                <strong>pressed</strong>: no press treatment beyond hover — N/A by design; the click acts at once.{" "}
                <strong>disabled</strong>: React Flow disables zoom in at the maximum zoom and zoom out at the minimum; the disabled button keeps its place and loses its action. Try zooming all the way in on the preview.{" "}
                <strong>loading</strong>, <strong>success</strong>, <strong>error</strong>: N/A — each action is synchronous and visible in the graph itself.{" "}
                <strong>empty</strong>: with showZoom, showFitView and showInteractive all false the container renders with no buttons — leave Controls out instead.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description: "The default set, a horizontal row, and zoom without fit view.",
      label: "Configurations",
      render: <ControlsStateGrid />,
      source: `<Controls />
<Controls orientation="horizontal" showInteractive={false} />
<Controls showFitView={false} showInteractive={false} />`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/controls.tsx. ControlsProps is the props of React Flow's Controls.",
      blocks: [
        {
          label: "Controls",
          body: (
            <Meta
              items={[
                { k: "className?", v: "string — merged after gap-px overflow-hidden rounded-md border bg-card p-1 shadow-none! and a rule that sets each child button to --size-target-min (44px), rounded-md, no border, transparent, with a secondary hover fill." },
                { k: "showZoom?", v: "boolean, default true — the zoom in and zoom out buttons." },
                { k: "showFitView?", v: "boolean, default true — the fit view button." },
                { k: "showInteractive?", v: "boolean, default true — the lock button that toggles dragging, connecting and selecting." },
                { k: "fitViewOptions?", v: "FitViewOptions — padding, duration and so on, for the fit view button." },
                { k: "onZoomIn? / onZoomOut? / onFitView?", v: "() => void — called after the built-in action." },
                { k: "onInteractiveChange?", v: "(interactive: boolean) => void — called when the lock button toggles." },
                { k: "position?", v: 'PanelPosition, default "bottom-left".' },
                { k: "orientation?", v: '"horizontal" or "vertical", default "vertical".' },
                { k: "aria-label?", v: 'string — names the group. Defaults to React Flow\'s "Control Panel".' },
                { k: "children?", v: "ReactNode — extra ControlButtons after the built-in ones." },
                { k: "style?", v: "CSSProperties." },
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
      description: "The buttons are named and labelled by React Flow; this system sizes them.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: 'The container is a Panel with an aria-label ("Control Panel" by default — set a more useful one). Each button has both an aria-label and a title: "Zoom In", "Zoom Out", "Fit View", "Toggle Interactivity". The icons inside are svg with no text.' },
                { k: "Keyboard", v: "Every button is a native button in the tab order; Enter and Space activate. Zoom in and out are disabled at the zoom limits and drop out of the tab order there." },
                { k: "Target size", v: "Each button is held at --size-target-min (44px) with !important, because xyflow's own stylesheet sets 26px and is unlayered. They are icon-only controls in a column, so the 44px meets the 40px floor rather than relying on the 32px toolbar exemption." },
                { k: "Colour", v: "Card surface, border and foreground roles; the hover fill is the secondary surface, which differs per theme." },
                { k: "Motion", v: "None of its own; the zoom animation is React Flow's, with fit view taking an optional duration through fitViewOptions." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why",
      title: "Why this exists",
      blocks: [
        {
          body: (
            <Note tone="action">
              The workflow dialog (<code className="type-code">components/agent/workspace/workflow-dialog.tsx</code>)
              shows Controls so a long plan can be zoomed and fitted without a mouse
              wheel; scroll pans (it does not zoom), so a button is the plain way to zoom. The wrapper&apos;s only
              job is dressing xyflow&apos;s buttons in the system&apos;s card surface and the
              44px target size. It was vendored without a &ldquo;Vendored change&rdquo; marker
              in the source: the shadow and button overrides use <code className="type-code">!</code>
              because xyflow&apos;s stylesheet is unlayered and would otherwise win.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [{ body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> }],
    },
  ],
};
