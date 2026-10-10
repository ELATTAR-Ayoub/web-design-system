/**
 * Documentation page for `icon-swap`.
 *
 * Authored, not generated, and the one page in this batch that documents a
 * real React component rather than a CSS capability: `IconSwap`. The rule it
 * exists to enforce — "every control that alternates between icons swaps them
 * through this, no crossfades, no instant swaps" — only holds if the four
 * demos that used to live on the old base/selection category page are visible
 * somewhere; they were dropped in the docs migration and are restored here
 * from `components/ds/icon-swap-demo.tsx`.
 */

import { Pause, Play } from "lucide-react";

import {
  FavouriteDemo,
  MuteDemo,
  PlayPauseDemo,
  ViewSwitchDemo,
} from "@/components/ds/icon-swap-demo";
import { Icon } from "@/components/ui/icon";
import { IconSwap } from "@/components/ui/icon-swap";

import { Code, Meta, Note, Panel, Row } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { SortToggleDemo } from "./icon-swap-showcase";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "icon-swap",
  omitted: {
    responsive: "IconSwap's box comes from the className the caller sizes it with (size-5, size-6, ...), not a breakpoint or container query, and overflow-hidden clips the strip to that box — there is nothing about the roll or the grid cell that reflows differently across widths, 200% zoom or RTL.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "IconSwap renders every icon in the set as a physical strip, stacked in the same grid cell, and only the active one is visible — advancing rolls the strip up, going back rolls it down. Two independent controls to flip: play/pause, and a sort-direction toggle. Put it inside a Button as the child, not beside one.",
      label: "Play / pause, and a sort toggle",
      render: (
        <Row>
          <PlayPauseDemo />
          <SortToggleDemo />
        </Row>
      ),
      source: `<IconSwap
  active={playing ? "pause" : "play"}
  icons={{
    play: <Icon icon={Play} size="lg" tone="inherit" />,
    pause: <Icon icon={Pause} size="lg" tone="inherit" />,
  }}
  className="size-6"
/>

<IconSwap
  active={dir}
  icons={{
    desc: <Icon icon={ArrowDownNarrowWide} size="sm" tone="inherit" />,
    asc: <Icon icon={ArrowUpNarrowWide} size="sm" tone="inherit" />,
  }}
  className="size-4"
/>`,
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
        "active must be one of the keys in icons. The first key given sits at the top of the strip; icons before the active key in that order roll down to reach it, icons after roll up.",
      language: "tsx",
      code: `import { IconSwap } from "@/components/ui/icon-swap";
import { Icon } from "@/components/ui/icon";
import { Play, Pause } from "lucide-react";

function PlayButton({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <Button size="icon-lg" aria-label={playing ? "Pause" : "Play"} onClick={onToggle}>
      <IconSwap
        active={playing ? "pause" : "play"}
        icons={{
          play: <Icon icon={Play} size="lg" tone="inherit" />,
          pause: <Icon icon={Pause} size="lg" tone="inherit" />,
        }}
        className="size-6"
      />
    </Button>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Every control in the product that alternates between two icon meanings goes through IconSwap — view mode, favourite, mute, in addition to play/pause above. Restored here from the pre-migration base/selection page, which is where these four demos originally lived.",
      label: "Alternating controls",
      render: (
        <Row>
          <ViewSwitchDemo />
          <FavouriteDemo />
          <MuteDemo />
        </Row>
      ),
      source: `<IconSwap
  active={view}
  icons={{ grid: <Icon icon={LayoutGrid} .../>, list: <Icon icon={Rows3} .../> }}
  className="size-5"
/>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "The complete prop surface — three props, all required except className.",
      blocks: [
        {
          label: "IconSwap",
          body: (
            <Meta
              items={[
                { k: "active", v: "string — the key of icons currently shown. Must match one of the keys in the icons object." },
                { k: "icons", v: "Record<string, React.ReactNode> — the full set, in strip order. The first key given sits at the top of the wheel." },
                { k: "className", v: "string — sizes the swap surface (e.g. size-5, size-6); each icon inside should be sized to match." },
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
        "IconSwap has no state of its own — active is fully controlled by the parent. What varies is which two icons are being alternated between and which direction the strip rolls.",
      blocks: [
        {
          body: (
            <Panel label="Roll direction">
              <div className="flex items-center gap-10">
                <div className="flex flex-col items-center gap-2">
                  <IconSwap
                    active="pause"
                    icons={{
                      play: <Icon icon={Play} size="lg" tone="inherit" />,
                      pause: <Icon icon={Pause} size="lg" tone="inherit" />,
                    }}
                    className="size-6"
                  />
                  <span className="type-small text-muted-foreground">
                    play → pause rolls up
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <IconSwap
                    active="play"
                    icons={{
                      play: <Icon icon={Play} size="lg" tone="inherit" />,
                      pause: <Icon icon={Pause} size="lg" tone="inherit" />,
                    }}
                    className="size-6"
                  />
                  <span className="type-small text-muted-foreground">
                    pause → play rolls down
                  </span>
                </div>
              </div>
            </Panel>
          ),
        },
        {
          body: (
            <Note tone="action">
              disabled, loading, error and empty are N/A: IconSwap only ever
              renders one of the icons it was given, in the position `active`
              names — any of those states belongs to the interactive control
              wrapping it (usually a Button), not to the swap itself.
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
                  k: "Accessible name",
                  v: (
                    <>
                      None of its own — <Code>IconSwap</Code> renders decorative
                      icons only. The host control supplies the name (
                      <Code>aria-label</Code> on the Button, as in every demo
                      above) and updates it to match the new state.
                    </>
                  ),
                },
                {
                  k: "State announcement",
                  v: "Pair aria-pressed (for a toggle) or the label text itself with the swap, so a screen reader announces the change the icon alone conveys visually.",
                },
                {
                  k: "Hidden icons",
                  v: "Every non-active icon in the strip carries aria-hidden — only the visible one is ever in the accessibility tree.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "reduced-motion",
      title: "Reduced motion",
      blocks: [
        {
          body: (
            <Note tone="action">
              The roll runs on <Code>swap-roll</Code> (translateY over{" "}
              <Code>--duration-slow</Code>) and the squash on arrival runs{" "}
              <Code>anim-change</Code>; the blanket prefers-reduced-motion
              rule collapses both to 0.01ms. Neither ends at zero opacity — the
              icon is fully visible at rest before and after — so freezing them
              loses no information, only the travel.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      description:
        "IconSwap renders a span strip with no interactive role of its own — it intercepts no keys.",
      blocks: [
        {
          body: (
            <Note tone="action" title="N/A on IconSwap">
              <p>
                Every icon but the active one carries <Code>aria-hidden</Code>{" "}
                and none of them is a tab stop. Put <Code>IconSwap</Code>{" "}
                inside a <Code>Button</Code> (the pattern in every demo above)
                and the button owns focus, activation and its own Keyboard
                section — the swap only ever reacts to the{" "}
                <Code>active</Code> prop changing.
              </p>
            </Note>
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
          body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} />,
        },
      ],
    },
  ],
};
