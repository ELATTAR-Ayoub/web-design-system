import { ScrollArea } from "@/components/ui/scroll-area";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

const PACKS = [
  "Eclipse Vault",
  "Golden Rift",
  "Mystic Surge",
  "Shadow Core",
  "Celestial Strike",
  "Origin Pulse",
];

export const spec: ComponentDocSpec = {
  name: "scroll-area",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A styled scroll container with its own drawn rail — used wherever a list is taller than its panel: filter lists, the possible-hits gallery, notification panels.",
      render: (
        <Panel label="Possible hits" className="max-w-sm">
          <ScrollArea className="h-64" aria-label="Possible hits">
            <div className="divide-y divide-border">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <span className="type-small text-foreground">
                    Card #{String(i + 1).padStart(3, "0")}
                  </span>
                  <span className="type-number-sm text-value-ink">
                    ${(1200 - i * 73).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Panel>
      ),
      source: `<ScrollArea className="h-64 rounded-lg border border-border" aria-label="Possible hits">
  {/* tall content */}
</ScrollArea>`,
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
      description: "Set an explicit dimension on the axis that scrolls, and always name the region.",
      language: "tsx",
      code: `import { ScrollArea } from "@/components/ui/scroll-area";

export function PossibleHits() {
  return (
    <ScrollArea className="h-64 rounded-lg border border-border" aria-label="Possible hits">
      {/* tall content */}
    </ScrollArea>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description: "Vertical and horizontal ScrollArea, each with an explicit dimension on its scrolling axis.",
      label: "Vertical and horizontal",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel label="Vertical — possible hits">
            <ScrollArea className="h-64" aria-label="Possible hits">
              <div className="divide-y divide-border">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <span className="type-small text-foreground">
                      Card #{String(i + 1).padStart(3, "0")}
                    </span>
                    <span className="type-number-sm text-value-ink">
                      ${(1200 - i * 73).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Panel>

          <Panel label="Horizontal — card set rail">
            <ScrollArea className="w-full" aria-label="Card set rail">
              <div className="flex gap-3 p-4">
                {PACKS.map((name) => (
                  <div
                    key={name}
                    className="grid h-28 w-28 shrink-0 place-items-center rounded-md border border-border bg-muted"
                  >
                    <span className="type-small text-center text-muted-foreground">{name}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Panel>
        </div>
      ),
      source: `<ScrollArea className="h-64 rounded-lg border border-border" aria-label="Possible hits">
  <div className="divide-y divide-border">{/* rows */}</div>
</ScrollArea>

<ScrollArea className="w-full rounded-lg border border-border" aria-label="Card set rail">
  <div className="flex gap-3 p-4">{/* cards */}</div>
</ScrollArea>`,
    },
    {
      kind: "showcase",
      id: "scroll-area-vs-browser-scrollbar",
      title: "ScrollArea vs. the browser scrollbar",
      description:
        "Two different things solve overflow in this system, and they are not interchangeable. The native browser rail is styled globally from app/globals.css and needs no class on the page itself; a nested overflow region opts in with scrollbar-thin (defined in styles/utilities.css). ScrollArea replaces that native rail entirely with a composed Radix control.",
      label: "Native scrollbar-thin vs. composed ScrollArea",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel label="Native — scrollbar-thin">
            <div
              className="scrollbar-thin scrollbar-gutter-stable h-52 overflow-y-scroll rounded-lg border border-border bg-background"
              tabIndex={0}
              aria-label="Vertical browser scrollbar example"
            >
              <div className="divide-y divide-border">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <span className="type-small text-foreground">
                      Activity {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="type-small text-muted-foreground">Ready</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel label="Composed — ScrollArea">
            <ScrollArea className="h-52" aria-label="Vertical ScrollArea example">
              <div className="divide-y divide-border">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <span className="type-small text-foreground">
                      Activity {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="type-small text-muted-foreground">Ready</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Panel>
        </div>
      ),
      source: `{/* Native — the page and simple shelves get this for free */}
<div className="scrollbar-thin overflow-y-scroll" tabIndex={0} aria-label="…">
  {/* tall content */}
</div>

{/* Composed — a contained application panel that wants a drawn rail */}
<ScrollArea className="h-52 rounded-lg border border-border" aria-label="…">
  {/* tall content */}
</ScrollArea>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "ScrollArea forwards every prop to Radix's ScrollAreaPrimitive.Root beyond the className merge and the viewport tab-stop wiring below.",
      blocks: [
        {
          label: "ScrollArea",
          body: (
            <Meta
              items={[
                {
                  k: "aria-label / aria-labelledby",
                  v: "Read off the root and moved onto the scrollable viewport, along with role=\"group\" and its tabIndex={0}. Always pass one — see Accessibility.",
                },
                {
                  k: "...props",
                  v: "Every other prop Radix's ScrollAreaPrimitive.Root accepts (type, scrollHideDelay, dir, etc.), forwarded directly.",
                },
              ]}
            />
          ),
        },
        {
          label: "ScrollBar",
          body: (
            <Meta
              items={[
                {
                  k: "orientation",
                  v: "\"vertical\" | \"horizontal\". Default: \"vertical\". ScrollArea renders one vertical ScrollBar itself; add a second ScrollBar orientation=\"horizontal\" for a region that scrolls both axes.",
                },
                {
                  k: "...props",
                  v: "Every other prop Radix's ScrollAreaScrollbar accepts, forwarded directly.",
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
      description: "focus-visible is the only interaction state ScrollArea itself draws; everything else belongs to its content.",
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="rest">
                <ScrollArea className="h-20 w-32" aria-label="Rest state example">
                  <div className="space-y-2 p-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <p key={i} className="type-small text-foreground">Row {i + 1}</p>
                    ))}
                  </div>
                </ScrollArea>
              </StateCell>
              <StateCell label="focus-visible" note="Tab to it">
                <ScrollArea className="h-20 w-32" aria-label="Focus-visible state example">
                  <div className="space-y-2 p-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <p key={i} className="type-small text-foreground">Row {i + 1}</p>
                    ))}
                  </div>
                </ScrollArea>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A rows">
              <p>
                <strong>pressed</strong>, <strong>loading</strong>,{" "}
                <strong>disabled</strong>, <strong>error</strong> and{" "}
                <strong>success</strong> are N/A: ScrollArea is a passive
                container, not a control with a value or an outcome of its own —
                those states belong to whatever is placed inside it.
                An empty message belongs to the content, not to ScrollArea.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "Radix hides the native rail and does not make its viewport focusable on its own. This component's viewport carries tabIndex={0} and focus-visible:ring-3 so the region stays reachable and arrow-scrollable from the keyboard — the correction this file's own header comment documents.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: "role=\"group\" on the viewport, but only when a label is supplied — see below.",
                },
                {
                  k: "Accessible name",
                  v: "None by default. aria-label or aria-labelledby passed to ScrollArea is read off the root and moved onto the viewport along with its tab stop — a keyboard stop with no name announces as nothing, so always pass one.",
                },
                {
                  k: "Focus order",
                  v: "The viewport carries tabIndex={0}, joining the tab order in document position — a positive tabindex is deliberately avoided so it cannot jump the page's order.",
                },
                {
                  k: "Target size",
                  v: "The drawn ScrollBar thumb is a drag target, not a discrete interactive control with its own accessible name; keyboard users reach the same content via the viewport's own arrow-key scrolling instead.",
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
                { k: "Tab / Shift+Tab", v: "Moves focus to and from the scrollable viewport in document order." },
                { k: "Arrow keys", v: "Scroll the focused viewport, once it holds focus (native browser scrolling behaviour on a focused, overflowing, focusable element)." },
                { k: "Space / Page Up / Page Down / Home / End", v: "Scroll the focused viewport by the platform's native step (native browser behaviour, not code this component adds)." },
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
        "ScrollArea takes exactly the box its host gives it — the reflow question is really \"what decides that box's size\", and this component is not it.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Sizing",
                  v: "ScrollArea sets no width or height of its own beyond size-full rounded-[inherit] on the viewport — the caller's own className (a fixed h-64, a flex-1 inside a panel) decides how much room it has at any breakpoint, and content past that box scrolls rather than resizing it.",
                },
                {
                  k: "The scrollbar",
                  v: "ScrollBar is h-2.5 / w-2.5 regardless of viewport — it does not grow into a wider, easier-to-grab touch target on narrow screens, which is why the viewport itself stays keyboard- and touch-scrollable independent of the drawn thumb (see Keyboard above).",
                },
                {
                  k: "Measured",
                  v: "No overflow of the ScrollArea's own frame at 375, 768, 1440 or 1920, and none at 200% text zoom or under RTL. One real gap: the vertical scrollbar's separating border is a hardcoded border-l-transparent rather than a logical border-inline-start, so a scrollbar that Radix places on the opposite edge under RTL keeps a border drawn for the LTR side.",
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
        { body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> },
      ],
    },
  ],
};
