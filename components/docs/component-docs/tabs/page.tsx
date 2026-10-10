/**
 * Authored documentation page for `tabs`.
 *
 * Replaces the generated baseline. Every specimen renders the real `Tabs`
 * composition from `components/ui/tabs.tsx`, including the travelling
 * indicator from `active-indicator`. Tabs has no size prop — see the Sizes
 * omission recorded in the handoff — so this page has no Sizes section.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "tabs",
  omitted: {
    responsive:
      "TabsList lays out its triggers with flex and w-fit and has no overflow-x-auto built into tabs.tsx — a horizontal list with more triggers than a narrow viewport can hold overflows rather than scrolling or wrapping on its own. Switching to orientation=\"vertical\" is a prop a caller sets deliberately, not a runtime response to width, so it is documented under Variants rather than here.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "The default filled-pill list, switching real content panels.",
      render: (
        <Tabs defaultValue="live" className="max-w-md">
          <TabsList>
            <TabsTrigger value="live">Live Pulls</TabsTrigger>
            <TabsTrigger value="hits">Top Hits</TabsTrigger>
            <TabsTrigger value="mine">My Pulls</TabsTrigger>
          </TabsList>
          <TabsContent value="live" className="pt-4">
            <p className="type-small text-muted-foreground">
              A live feed of every pull across the platform.
            </p>
          </TabsContent>
          <TabsContent value="hits" className="pt-4">
            <p className="type-small text-muted-foreground">
              The highest-value cards pulled in the last 24 hours.
            </p>
          </TabsContent>
          <TabsContent value="mine" className="pt-4">
            <p className="type-small text-muted-foreground">Your own pull history.</p>
          </TabsContent>
        </Tabs>
      ),
      source: `<Tabs defaultValue="live">
  <TabsList>
    <TabsTrigger value="live">Live Pulls</TabsTrigger>
    <TabsTrigger value="hits">Top Hits</TabsTrigger>
  </TabsList>
  <TabsContent value="live">A live feed of every pull across the platform.</TabsContent>
  <TabsContent value="hits">The highest-value cards pulled in the last 24 hours.</TabsContent>
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
      description: "The minimal import and call.",
      language: "tsx",
      code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PullFeedTabs() {
  return (
    <Tabs defaultValue="live">
      <TabsList>
        <TabsTrigger value="live">Live Pulls</TabsTrigger>
        <TabsTrigger value="hits">Top Hits</TabsTrigger>
      </TabsList>
      <TabsContent value="live">…</TabsContent>
      <TabsContent value="hits">…</TabsContent>
    </Tabs>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "default travels as a filled pill that physically slides between triggers. line travels as a 2px underline instead — for a lighter-weight tab set that should not compete visually with a filled control nearby.",
      label: "default vs. line",
      render: (
        <div className="max-w-md space-y-8">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="odds">Odds</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4">
              <p className="type-small text-muted-foreground">Set overview and contents.</p>
            </TabsContent>
            <TabsContent value="odds" className="pt-4">
              <p className="type-small text-muted-foreground">Published pull odds by rarity.</p>
            </TabsContent>
            <TabsContent value="history" className="pt-4">
              <p className="type-small text-muted-foreground">Past pulls from this set.</p>
            </TabsContent>
          </Tabs>

          <Tabs defaultValue="all">
            <TabsList variant="line">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="graded">Graded</TabsTrigger>
              <TabsTrigger value="raw">Raw</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-4">
              <p className="type-small text-muted-foreground">Every card in the vault.</p>
            </TabsContent>
            <TabsContent value="graded" className="pt-4">
              <p className="type-small text-muted-foreground">Professionally graded cards only.</p>
            </TabsContent>
            <TabsContent value="raw" className="pt-4">
              <p className="type-small text-muted-foreground">Ungraded cards only.</p>
            </TabsContent>
          </Tabs>
        </div>
      ),
      source: `<TabsList>{/* variant="default" — filled travelling pill */}</TabsList>
<TabsList variant="line">{/* 2px travelling underline */}</TabsList>`,
    },
    {
      kind: "disclosure",
      id: "active-indicator",
      title: "Why one pill, not per-trigger backgrounds",
      description:
        "Tabs and ToggleGroup both use the same ActiveIndicator primitive (components/ui/active-indicator.tsx) rather than each implementing its own selected-state fill.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              A group with an active option owns <strong>one pill that travels</strong> —
              options never light their own background. Instead of every trigger owning its
              own selected fill and one blinking on while another blinks off, the list
              measures the active trigger&rsquo;s layout box and physically slides a single
              indicator to it, landing with a state-change squash. You see{" "}
              <em>where the selection went</em>, which per-trigger backgrounds cannot show.
              The same <Code>useActiveIndicator</Code> hook backs the sidebar&rsquo;s active
              row for the identical reason — one definition of the travel and the squash,
              reused everywhere a group has exactly one active option.
            </p>
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Vertical orientation, and a disabled trigger — arrow navigation skips it and it cannot be activated.",
      label: "Vertical orientation and a disabled trigger",
      render: (
        <div className="space-y-8">
          <Panel label="orientation=&quot;vertical&quot;" bodyClassName="p-4">
            <Tabs defaultValue="a" orientation="vertical" className="flex-row gap-6">
              <TabsList className="w-40">
                <TabsTrigger value="a">General</TabsTrigger>
                <TabsTrigger value="b">Security</TabsTrigger>
                <TabsTrigger value="c">Billing</TabsTrigger>
              </TabsList>
              <TabsContent value="a">
                <p className="type-small text-muted-foreground">General account settings.</p>
              </TabsContent>
              <TabsContent value="b">
                <p className="type-small text-muted-foreground">Password and two-factor auth.</p>
              </TabsContent>
              <TabsContent value="c">
                <p className="type-small text-muted-foreground">Plan and payment method.</p>
              </TabsContent>
            </Tabs>
          </Panel>

          <Tabs defaultValue="a" className="max-w-md">
            <TabsList>
              <TabsTrigger value="a">Odds</TabsTrigger>
              <TabsTrigger value="b" disabled>
                History (unavailable)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="a" className="pt-4">
              <p className="type-small text-muted-foreground">Published pull odds by rarity.</p>
            </TabsContent>
          </Tabs>
        </div>
      ),
      source: `<Tabs defaultValue="a" orientation="vertical">
  <TabsList>
    <TabsTrigger value="a">General</TabsTrigger>
    <TabsTrigger value="b">Security</TabsTrigger>
  </TabsList>
  <TabsContent value="a">…</TabsContent>
  <TabsContent value="b">…</TabsContent>
</Tabs>

<TabsTrigger value="b" disabled>History (unavailable)</TabsTrigger>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Tabs",
          body: (
            <Meta
              items={[
                {
                  k: "orientation",
                  v: "\"horizontal\" · \"vertical\". Default: \"horizontal\". Also drives ArrowUp/ArrowDown vs ArrowLeft/ArrowRight for trigger navigation via Radix.",
                },
                {
                  k: "defaultValue / value / onValueChange",
                  v: "Radix TabsPrimitive.Root props for uncontrolled or controlled selection.",
                },
                {
                  k: "...props",
                  v: "Every other Radix TabsPrimitive.Root prop (activationMode, dir, etc.), forwarded directly.",
                },
              ]}
            />
          ),
        },
        {
          label: "TabsList",
          body: (
            <Meta
              items={[
                {
                  k: "variant",
                  v: "\"default\" · \"line\". Default: \"default\". Controls both the track's own styling and the shape of the travelling ActiveIndicator (filled pill vs. 2px rule) it renders as its first child.",
                },
                {
                  k: "...props",
                  v: "Every Radix TabsPrimitive.List prop, forwarded directly. TabsList also reads its selected trigger via useActiveIndicator internally — no extra wiring needed at the call site.",
                },
              ]}
            />
          ),
        },
        {
          label: "TabsTrigger",
          body: (
            <Meta
              items={[
                {
                  k: "value",
                  v: "string, required. Must match the value of exactly one sibling TabsContent.",
                },
                {
                  k: "disabled",
                  v: "boolean. Removes the trigger from arrow-key navigation and blocks activation, matching native disabled controls.",
                },
                {
                  k: "...props",
                  v: "Every other Radix TabsPrimitive.Trigger prop, forwarded directly.",
                },
              ]}
            />
          ),
        },
        {
          label: "TabsContent",
          body: (
            <Meta
              items={[
                {
                  k: "value",
                  v: "string, required. Matches the TabsTrigger that reveals this panel.",
                },
                {
                  k: "...props",
                  v: "Every other Radix TabsPrimitive.Content prop (forceMount included), forwarded directly.",
                },
              ]}
            />
          ),
        },
        {
          label: "tabsListVariants",
          body: (
            <p className="type-small text-muted-foreground">
              The class-variance-authority function TabsList&rsquo;s track is built on
              (<Code>variant</Code> only). Exported for a consumer styling a non-standard
              tab-list container with the same track treatment.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "Hover, focus-visible and press are live on the triggers below — interact with them directly.",
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="rest">
                <Tabs defaultValue="a">
                  <TabsList>
                    <TabsTrigger value="a">Odds</TabsTrigger>
                    <TabsTrigger value="b">History</TabsTrigger>
                  </TabsList>
                </Tabs>
              </StateCell>
              <StateCell label="hover" note="Hover the unselected tab">
                <Tabs defaultValue="a">
                  <TabsList>
                    <TabsTrigger value="a">Odds</TabsTrigger>
                    <TabsTrigger value="b">History</TabsTrigger>
                  </TabsList>
                </Tabs>
              </StateCell>
              <StateCell label="focus-visible" note="Tab to a trigger">
                <Tabs defaultValue="a">
                  <TabsList>
                    <TabsTrigger value="a">Odds</TabsTrigger>
                    <TabsTrigger value="b">History</TabsTrigger>
                  </TabsList>
                </Tabs>
              </StateCell>
              <StateCell label="selected / active" note="data-state=active">
                <Tabs defaultValue="b">
                  <TabsList>
                    <TabsTrigger value="a">Odds</TabsTrigger>
                    <TabsTrigger value="b">History</TabsTrigger>
                  </TabsList>
                </Tabs>
              </StateCell>
              <StateCell label="pressed" note="Click and hold a trigger">
                <Tabs defaultValue="a">
                  <TabsList>
                    <TabsTrigger value="a">Odds</TabsTrigger>
                    <TabsTrigger value="b">History</TabsTrigger>
                  </TabsList>
                </Tabs>
              </StateCell>
              <StateCell label="disabled" note="Skipped by arrow keys">
                <Tabs defaultValue="a">
                  <TabsList>
                    <TabsTrigger value="a">Odds</TabsTrigger>
                    <TabsTrigger value="b" disabled>
                      History
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A rows">
              <p>
                <strong>loading</strong>, <strong>success</strong> and{" "}
                <strong>error</strong> are N/A: switching tabs is a synchronous,
                client-side reveal of already-rendered content — there is no request in
                flight for Tabs to represent, and no effect to inject. A tab panel that
                itself fetches data owns its own loading/error state inside{" "}
                <Code>TabsContent</Code>; Tabs the control has nothing to show for that.
              </p>
              <p className="mt-2">
                <strong>empty</strong> is N/A on the control: Tabs always requires at
                least one TabsTrigger/TabsContent pair to be meaningful, so there is no
                valid &ldquo;zero tabs&rdquo; rendering for this component to define. A tab whose
                panel has no content is the panel&rsquo;s own empty state, not Tabs&rsquo;s.
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
        "Built on Radix TabsPrimitive, which supplies the WAI-ARIA Tabs pattern's roles and relationships.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "TabsList role", v: "tablist." },
                {
                  k: "TabsTrigger role",
                  v: "tab, with aria-selected reflecting the active trigger and aria-controls pointing at its TabsContent's id.",
                },
                {
                  k: "TabsContent role",
                  v: "tabpanel, with aria-labelledby pointing back at its TabsTrigger's id and tabIndex={0} so it is reachable and scrollable by keyboard even with no focusable content inside.",
                },
                {
                  k: "Accessible name",
                  v: "Each trigger's visible text is its accessible name; an icon-only trigger would need an aria-label, though every specimen on this page uses a text label.",
                },
                {
                  k: "Activation model",
                  v: "Automatic by default — moving focus with the arrow keys also selects the tab and swaps the panel. This matches native OS tab-strip behaviour and is what Radix ships without extra configuration.",
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
                { k: "Tab", v: "Moves focus into the tab list (landing on the selected trigger) and, on a second Tab, out to the active panel's content." },
                { k: "← / →", v: "horizontal orientation: moves focus to and selects the previous/next trigger, wrapping at the ends." },
                { k: "↑ / ↓", v: "vertical orientation: moves focus to and selects the previous/next trigger, wrapping at the ends." },
                { k: "Home / End", v: "Jumps to and selects the first / last trigger." },
                { k: "Disabled triggers", v: "Skipped entirely by arrow-key traversal, matching native disabled controls." },
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
