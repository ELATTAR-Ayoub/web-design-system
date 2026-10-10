import { Code, Meta, Note } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

function SafeAreaSpecimen() {
  return (
    <div className="w-full rounded-lg border border-dashed border-border p-4">
      {/* `p-safe` sits on its OWN element, with nothing else setting padding on
          it. Both this utility and `p-4` write the `padding` longhands, so on
          one element the later rule silently wins and the specimen would
          measure 0px while claiming to show 4 — which is what the first draft
          of this panel did. Measured in the browser before it was split. */}
      <div className="p-safe rounded-md bg-muted/50">
        <p className="type-small text-muted-foreground p-4">
          The box around this text carries <Code>p-safe</Code> and nothing else.
          On a display with no notch, gesture bar or rounded corner — every
          desktop browser — all four insets report <Code>0px</Code>, so the only
          padding you see is this paragraph&rsquo;s own. Open the same page in an
          installed PWA on a notched phone, or in a simulator with a home
          indicator, and the box grows by the device&rsquo;s real inset.
        </p>
      </div>
    </div>
  );
}

export const spec: ComponentDocSpec = {
  name: "safe-area",
  omitted: {
    api: "The seven utilities are CSS classes, not a component — none takes a prop. Every one of them, and exactly what env() value it reads, is listed in \"The seven utilities\" below.",
    states: "A safe-area utility computes one static padding value from the device's reported inset — there is no interaction and nothing asynchronous about it. It is either 0px (no inset to honour) or the device's real number, decided once by the browser before paint, not something that changes as the user acts on the page.",
    keyboard: "Padding has no key handler and nothing to focus. The one place \"keyboard\" and safe-area genuinely meet is the on-screen keyboard's own inset on some platforms, and that is a value the browser folds into the same env() number — not a behaviour this utility adds.",
  },
  sections: [
    {
      kind: "effect",
      id: "preview",
      title: "What it does",
      label: "On a panel",
      appliedAs: "p-safe",
      render: <SafeAreaSpecimen />,
      source: `function SafeAreaSpecimen() {
  return (
    <div className="w-full rounded-lg border border-dashed border-border p-4">
      <div className="p-safe rounded-md bg-muted/50">
        <p className="type-small text-muted-foreground p-4">
          The box around this text carries <Code>p-safe</Code> and nothing else.
          On a display with no notch, gesture bar or rounded corner — every
          desktop browser — all four insets report <Code>0px</Code>, so the only
          padding you see is this paragraph's own. Open the same page in an
          installed PWA on a notched phone, or in a simulator with a home
          indicator, and the box grows by the device's real inset.
        </p>
      </div>
    </div>
  );
}

<SafeAreaSpecimen />`,
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
        "Reach for these on whatever actually touches the display's edge — the fallback after the comma is load-bearing (see \"When to reach for it\" below).",
      language: "tsx",
      code: `function BottomActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 pb-safe">
      {children}
    </div>
  );
}`,
    },
    {
      kind: "disclosure",
      id: "classes",
      title: "The seven utilities",
      blocks: [
        {
          body: (
            <div className="space-y-4">
              <p className="type-body text-muted-foreground">
                Flutter&rsquo;s <Code>SafeArea</Code> reads the window&rsquo;s view
                padding — the notch, the rounded corner, the home indicator, the
                on-screen keyboard shelf — and insets its child by it. The browser
                exposes the same four numbers as{" "}
                <Code>env(safe-area-inset-top)</Code>,{" "}
                <Code>env(safe-area-inset-right)</Code>,{" "}
                <Code>env(safe-area-inset-bottom)</Code> and{" "}
                <Code>env(safe-area-inset-left)</Code>. So the capability arrives
                as CSS with nothing for a component to do, which is why the
                contract classifies it <Code>css-native</Code> and it ships inside{" "}
                <Code>@elattar/source-foundation</Code> rather than as its own
                installable.
              </p>
              <ul className="type-body text-muted-foreground list-disc space-y-1 pl-5">
                <li>
                  <Code>pt-safe</Code>, <Code>pr-safe</Code>, <Code>pb-safe</Code>,{" "}
                  <Code>pl-safe</Code> — one edge each.
                </li>
                <li>
                  <Code>px-safe</Code> and <Code>py-safe</Code> — one axis, because
                  a bottom bar wants one class and not two.
                </li>
                <li>
                  <Code>p-safe</Code> — all four, because a full-screen overlay
                  wants one class and not four.
                </li>
              </ul>
              <p className="type-body text-muted-foreground">
                There is no token here and there should not be: the number comes
                from the device, not from the system. <Code>env()</Code> is a
                browser function rather than a hardcoded value, so{" "}
                <Code>npm run check:tokens</Code> is satisfied and no{" "}
                <Code>--safe-*</Code> variable needs to exist.
              </p>
            </div>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "when",
      title: "When to reach for it",
      blocks: [
        {
          body: (
            <Note tone="action" title="Screen edges only">
              Use these on something that sits against the edge of the display — a
              fixed bottom bar, a full-height drawer, a floating action. Padding a
              component that already lives inside a padded page adds the notch
              twice, and the second copy is invisible on the machine you are
              building on.
            </Note>
          ),
        },
        {
          body: (
            <p className="type-body text-muted-foreground">
              The <Code>, 0px</Code> fallback in each declaration is load-bearing.
              A bare <Code>env(safe-area-inset-bottom)</Code> resolves to nothing
              on a display that reports no inset, and a declaration whose value
              resolves to nothing is dropped entirely — taking any shorthand it
              shared with it. With the fallback the same class is simply{" "}
              <Code>0px</Code> everywhere it does not apply.
            </p>
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
            <p className="type-body text-muted-foreground">
              Padding carries no role and no announcement of its own — the utilities do
              not touch the accessibility tree. What they protect is physical reach:
              content padded by <Code>pb-safe</Code> or <Code>p-safe</Code> is pulled
              clear of the home-indicator gesture strip and the rounded display corner,
              so a button that would otherwise sit under the gesture area — reachable to
              a screen reader by focus, but not reliably tappable or swipeable past —
              stays inside the region a finger can actually land on. Omitting the
              utility on a full-bleed action bar is the accessibility failure this page
              exists to prevent, not a cosmetic one.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "This IS the responsive capability — not a component that happens to reflow, but the mechanism `docs/architecture/platform-parity.md` names for adapting to a device's own physical shape.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "What varies",
                  v: "The four env(safe-area-inset-*) numbers are per-device and per-orientation, not per-breakpoint — a notch or gesture bar reports a different inset in portrait than in landscape on the same phone, and 0px on every desktop browser regardless of window width. None of the seven utilities key off min-width at all; they key off the hardware.",
                },
                {
                  k: "200% text zoom",
                  v: "Zoom changes font and layout size, not the device's physical bezel, so the safe-area numbers do not move with it — a pb-safe bar keeps the same physical clearance whether the text inside it is doubled or not, though the content it wraps still has to reflow to fit the now-larger text in the remaining width.",
                },
                {
                  k: "RTL",
                  v: "pl-safe and pr-safe are physical (left/right), not logical (start/end) — env(safe-area-inset-left) is itself a physical value tied to the device's screen edges, not to writing direction, so there is no logical variant to be missing. A component that wants inline-start/end safe-area padding still has to pick pl-safe or pr-safe correctly for the direction it is rendering in.",
                },
                {
                  k: "Desktop measurement",
                  v: "Every width this system tests (375, 768, 1440, 1920) is a desktop browser, where all four insets report 0px and the fallback is what renders — confirmed no overflow at any of them, at 200% zoom, or under RTL. That 0px is the correct, unremarkable answer on hardware with no notch, not a sign the utilities are inert; the SafeAreaSpecimen panel above says so explicitly rather than showing an empty box.",
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
