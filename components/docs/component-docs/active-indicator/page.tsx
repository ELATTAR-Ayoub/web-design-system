import {
  Code,
  Meta,
  Note,
  Row,
  StateCell,
  StateGrid,
} from "@/components/ds/kit";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "active-indicator",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "The pill behind the active tab is one element that travels to the selected option, rather than each option painting its own background. Switch tabs to see it move and land with a squash.",
      render: (
        <Row>
          <Tabs defaultValue="collection" className="w-full max-w-sm">
            <TabsList>
              <TabsTrigger value="collection">Collection</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="sold">Sold</TabsTrigger>
            </TabsList>
            <TabsContent value="collection">
              <p className="type-small text-muted-foreground">184 cards.</p>
            </TabsContent>
            <TabsContent value="wishlist">
              <p className="type-small text-muted-foreground">37 cards.</p>
            </TabsContent>
            <TabsContent value="sold">
              <p className="type-small text-muted-foreground">12 cards.</p>
            </TabsContent>
          </Tabs>
        </Row>
      ),
      source: `<Tabs defaultValue="collection">
  <TabsList>
    <TabsTrigger value="collection">Collection</TabsTrigger>
    <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
    <TabsTrigger value="sold">Sold</TabsTrigger>
  </TabsList>
  {/* ...TabsContent */}
</Tabs>`,
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
      description:
        "The hook returns three refs. containerRef goes on the group (it must be position: relative — the pill is positioned absolutely from it). indicatorRef and arrivalRef both go on one ActiveIndicator, rendered as the group's first child so it sits behind the options in paint order.",
      language: "tsx",
      code: `"use client";

import { useActiveIndicator, ActiveIndicator } from "@/components/ui/active-indicator";

function MyToggleGroup({ options }: { options: string[] }) {
  const { containerRef, indicatorRef, arrivalRef } =
    useActiveIndicator<HTMLDivElement>();
    // default selector: '[data-state="on"],[data-state="active"]'
    // default attribute watched: data-state

  return (
    <div ref={containerRef} className="relative flex gap-1">
      <ActiveIndicator
        indicatorRef={indicatorRef}
        arrivalRef={arrivalRef}
        className="block size-full rounded-lg bg-secondary shadow-chip"
      />
      {options.map((label) => (
        <button key={label} data-state={label === "collection" ? "active" : undefined}>
          {label}
        </button>
      ))}
    </div>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "The hook takes three parameters that change what it watches, not what it looks like — the pill itself has no variant of its own; its class is passed straight through to ActiveIndicator by the caller (Tabs, ToggleGroup and SidebarMenu each choose their own).",
      label: "Selector and attribute",
      render: (
        <div className="space-y-6">
          <div>
            <p className="type-small mb-3 text-muted-foreground">
              ToggleGroup — Radix writes data-state=&quot;on&quot;, matching
              the hook&rsquo;s default selector and default watched attribute.
            </p>
            <ToggleGroup type="single" defaultValue="grid" variant="outline">
              <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
              <ToggleGroupItem value="list">List</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <Note tone="action" title="The parameter the sidebar needs">
            <p>
              <Code>SidebarMenu</Code> calls{" "}
              <Code>{'useActiveIndicator(\'[data-active="true"]\', undefined, "data-active")'}</Code>{" "}
              — a custom selector and a custom watched attribute, because a
              sidebar row wrapped in a <Code>CollapsibleTrigger</Code> already
              carries Radix&rsquo;s own <Code>data-state=&quot;open&quot;
              |&quot;closed&quot;</Code> for its disclosure state. Leaving the
              hook on its default would make the pill chase which group is
              expanded instead of which row is selected. See the Sidebar
              page&rsquo;s Menu section for the running specimen.
            </p>
          </Note>
        </div>
      ),
      source: `useActiveIndicator<HTMLUListElement>(
  '[data-active="true"]', // activeSelector
  undefined,               // arrivalAnimation — default "anim-change"
  "data-active",           // attributeName — default "data-state"
)`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "useActiveIndicator<T>(activeSelector?, arrivalAnimation?, attributeName?)",
          body: (
            <Meta
              items={[
                {
                  k: "activeSelector",
                  v: 'string, default \'[data-state="on"],[data-state="active"]\'. A CSS selector run against the container to find the currently active element.',
                },
                {
                  k: "arrivalAnimation",
                  v: 'string, default "anim-change". The anim-* utility class replayed on the pill each time it lands on a new element. Must be an @utility defined in globals.css and drive transform only — the element already carries a transform for its travel.',
                },
                {
                  k: "attributeName",
                  v: 'string, default "data-state". The attribute whose mutation means "the selection moved" — what the MutationObserver watches.',
                },
                {
                  k: "Returns",
                  v: "{ containerRef: RefObject<T | null>, indicatorRef: RefObject<HTMLSpanElement | null>, arrivalRef: RefObject<HTMLSpanElement | null> }.",
                },
                {
                  k: "Type parameter T",
                  v: "extends HTMLElement, default HTMLDivElement. Tabs and ToggleGroup use the default; Sidebar passes HTMLUListElement for its <ul> container.",
                },
              ]}
            />
          ),
        },
        {
          label: "ActiveIndicator",
          body: (
            <Meta
              items={[
                { k: "indicatorRef", v: "RefObject<HTMLSpanElement | null> — required, from the hook." },
                { k: "arrivalRef", v: "RefObject<HTMLSpanElement | null> — required, from the hook." },
                {
                  k: "className",
                  v: 'string, optional. Defaults to "block size-full rounded-pill bg-primary shadow-chip" when omitted.',
                },
                {
                  k: "children",
                  v: "ReactNode, optional. Painted inside the pill — needed for an effect like bloom-cosmic whose starfield must be a child of the bloom host.",
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
      description:
        "The pill has no interaction states of its own — it is aria-hidden and never receives pointer or keyboard focus. What changes is which measurement it is currently showing.",
      blocks: [
        {
          body: (
            <StateGrid cols={3}>
              <StateCell label="on first mount" note="No travel animation">
                <div className="w-full max-w-xs">
                  <Tabs defaultValue="a">
                    <TabsList>
                      <TabsTrigger value="a">A</TabsTrigger>
                      <TabsTrigger value="b">B</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </StateCell>
              <StateCell label="after selection changes" note="Travels, then squashes">
                <div className="w-full max-w-xs">
                  <Tabs defaultValue="b">
                    <TabsList>
                      <TabsTrigger value="a">A</TabsTrigger>
                      <TabsTrigger value="b">B</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </StateCell>
              <StateCell label="nothing active" note="Opacity 0, ToggleGroup only">
                <ToggleGroup type="single" variant="outline">
                  <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
                  <ToggleGroupItem value="list">List</ToggleGroupItem>
                </ToggleGroup>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A states">
              <p>
                <strong>hover</strong>, <strong>pressed</strong>,{" "}
                <strong>disabled</strong>, <strong>loading</strong>,{" "}
                <strong>success</strong> and <strong>error</strong> are all
                N/A: the pill carries <Code>pointer-events-none</Code> and{" "}
                <Code>aria-hidden</Code> — it is a visual echo of whatever
                option is selected, never a target of its own. Those states
                belong to the option underneath it (a Tab, a ToggleGroupItem,
                a SidebarMenuButton), which is documented on that
                component&rsquo;s own page.
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
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "aria-hidden",
                  v: "Always set on the outer indicator span. Selection is announced by the underlying primitive (Radix Tabs, ToggleGroup, or the sidebar's own aria-current) — the pill is a sighted-user affordance layered on top of that, not a second source of truth.",
                },
                {
                  k: "pointer-events-none",
                  v: "The pill never intercepts a click meant for the option beneath it, including while it is mid-travel.",
                },
                {
                  k: "Reduced motion",
                  v: "The arrival class is one of the system's shared anim-* utilities (default anim-change), and every anim-* utility in this system is written to collapse under prefers-reduced-motion — this hook does not special-case it because the utility already does.",
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
      description:
        "Not applicable — the pill is never a tab stop, and it has no keyboard behaviour of its own. Every keyboard interaction belongs to the host (Tabs, ToggleGroup, Sidebar) and is documented on that component's page.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "N/A", v: "aria-hidden and pointer-events-none together remove it from both the tab sequence and hit-testing." },
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
        "What it measures, and exactly when it re-measures, read from the effect in components/ui/active-indicator.tsx.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "What it measures",
                  v: "getBoundingClientRect() of the active element and of the container, plus the container's computed border-left and border-top widths (subtracted so a bordered container doesn't shift the pill by its border), plus the container's own scrollLeft/scrollTop.",
                },
                {
                  k: "Why rects, not offsetLeft/offsetTop",
                  v: "offsetLeft/offsetTop are relative to the nearest POSITIONED ancestor, which stopped being the container once the sidebar wrapped each row in a position: relative <li> (for its own absolutely-positioned action and badge) — every row reported offsetTop: 0 and the pill silently parked at the container's origin, correct-looking only because the active row happened to be first.",
                },
                {
                  k: "Initial mount",
                  v: "The pill's transition is set to \"none\" for one frame (removed again on the next requestAnimationFrame), so it appears already in place with no travel on first paint — animating in from the left edge on mount would look like a glitch, not a selection.",
                },
                {
                  k: "Re-measures on: attribute mutation",
                  v: "A MutationObserver watches the container (subtree: true, attributeFilter: [attributeName]) for changes to the watched attribute — selection changing anywhere inside the group.",
                },
                {
                  k: "Re-measures on: resize",
                  v: "A ResizeObserver watches the container itself, so the pill re-measures when the container's box changes size — including an orientation change, since that changes the container's own dimensions.",
                },
                {
                  k: "RTL",
                  v: "No dedicated RTL listener. Position is derived from rect.left minus the container's rect.left, which is a visual (LTR/RTL-agnostic) delta, not a logical-direction calculation — so a dir flip is only picked up if it also triggers a resize or a watched-attribute mutation on the container, not through a dir-change handler of its own.",
                },
                {
                  k: "Cleanup",
                  v: "Both observers are disconnected in the effect's cleanup, and the effect re-runs if activeSelector, arrivalAnimation or attributeName change.",
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
