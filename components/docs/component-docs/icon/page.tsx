import { Bell, Check, Package, Sparkle } from "lucide-react";

import { Code, Meta, Note, Panel, Row, StateCell, StateGrid } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Button } from "@/components/ui/button";
import { Icon, ICON_SIZES, ICON_TONES } from "@/components/ui/icon";

import { meta } from "./meta";

const SIZE_NAMES = Object.keys(ICON_SIZES) as (keyof typeof ICON_SIZES)[];
const TONE_NAMES = Object.keys(ICON_TONES) as (keyof typeof ICON_TONES)[];

export const spec: ComponentDocSpec = {
  name: "icon",
  omitted: {
    responsive: "Icon's size comes from the fixed size prop ladder (12px through 40px), never a breakpoint or container query — it does not grow, shrink or reflow differently across widths, 200% zoom or RTL; it scales only the way any inline SVG does under the browser's own page zoom.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Every size on the ladder, at the default tone. Stroke weight is scaled with the box rather than fixed at 2px, so a 12px glyph and a 40px glyph carry the same optical weight.",
      label: "Sizes",
      render: (
        <Row align="end">
          {SIZE_NAMES.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Icon icon={Package} size={size} />
              <span className="type-badge text-muted-foreground">{size}</span>
            </div>
          ))}
        </Row>
      ),
      source: `<Icon icon={Package} size="xs" />
<Icon icon={Package} size="sm" />
<Icon icon={Package} size="md" />
<Icon icon={Package} size="lg" />
<Icon icon={Package} size="xl" />
<Icon icon={Package} size="2xl" />
<Icon icon={Package} size="3xl" />`,
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
        "A Lucide component is never imported and rendered directly on a screen — going through Icon is what guarantees a ladder size, a token tone and an explicit accessibility decision on every instance.",
      language: "tsx",
      code: `import { Bell } from "lucide-react";
import { Icon } from "@/components/ui/icon";

// Decorative — adjacent text already says "Notifications".
<Icon icon={Bell} tone="muted" />

// The only content — needs an accessible name.
<Icon icon={Bell} tone="muted" label="Notifications" />`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Tones in context: inherit inside a filled button, a semantic tone standing alone, and a labelled icon acting as the entire content of a control.",
      label: "Tone in context",
      render: (
        <Row>
          <Button>
            <Icon icon={Check} tone="inherit" />
            Confirm
          </Button>
          <Panel label="Semantic tones" className="min-w-0">
            <Row>
              {(["success", "warning", "info", "error", "value", "action"] as const).map(
                (tone) => (
                  <Icon key={tone} icon={Sparkle} tone={tone} size="lg" />
                ),
              )}
            </Row>
          </Panel>
          <Button variant="ghost" size="icon">
            <Icon icon={Bell} label="Notifications" />
          </Button>
        </Row>
      ),
      source: `<Button>
  <Icon icon={Check} tone="inherit" />
  Confirm
</Button>

<Button variant="ghost" size="icon">
  <Icon icon={Bell} label="Notifications" />
</Button>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Every other SVG attribute (aria-*, id, event handlers, ...) is forwarded to the underlying Lucide glyph — width, height, className, strokeWidth and ref are not, since Icon owns those.",
      blocks: [
        {
          label: "Icon",
          body: (
            <Meta
              items={[
                { k: "icon", v: "LucideIcon — required. The glyph component, e.g. Package." },
                {
                  k: "size",
                  v: (
                    <>
                      <Code>IconSize</Code>, default <Code>&quot;md&quot;</Code>. One of{" "}
                      {SIZE_NAMES.map((s, i) => (
                        <span key={s}>
                          <Code>{s}</Code>
                          {i < SIZE_NAMES.length - 1 ? ", " : ""}
                        </span>
                      ))}{" "}
                      — {ICON_SIZES.xs}px through {ICON_SIZES["3xl"]}px.
                    </>
                  ),
                },
                {
                  k: "tone",
                  v: (
                    <>
                      <Code>IconTone</Code>, default <Code>&quot;inherit&quot;</Code>. One of{" "}
                      {TONE_NAMES.map((t, i) => (
                        <span key={t}>
                          <Code>{t}</Code>
                          {i < TONE_NAMES.length - 1 ? ", " : ""}
                        </span>
                      ))}
                      .
                    </>
                  ),
                },
                {
                  k: "label",
                  v: "string, optional. Supply it when the icon is the only thing conveying meaning; omit it when adjacent text already says the same thing.",
                },
                { k: "className", v: "string, optional. Merged after the tone class, so a one-off override wins." },
              ]}
            />
          ),
        },
        {
          label: "ICON_SIZES (px)",
          body: (
            <Meta
              items={SIZE_NAMES.map((s) => ({ k: s, v: `${ICON_SIZES[s]}px` }))}
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
        "Icon is presentational and synchronous — it has no interaction states of its own. The one thing that varies at runtime is the accessibility branch label selects, shown below.",
      blocks: [
        {
          body: (
            <StateGrid cols={2}>
              <StateCell label="decorative" note="no label — aria-hidden, focusable=false">
                <Icon icon={Sparkle} size="lg" tone="muted" />
              </StateCell>
              <StateCell label="labelled" note="role=&quot;img&quot;, aria-label set">
                <Icon icon={Sparkle} size="lg" tone="muted" label="Featured" />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Why the rest is N/A">
              An icon has no interaction of its own to hover, focus or press — those
              states belong to whatever control it sits inside (a Button&rsquo;s hover
              ring, a Tab&rsquo;s focus outline). Loading, success, error, disabled and
              empty are states of an operation or a control, and Icon renders neither;
              a spinner icon inside a loading Button is the button&rsquo;s loading state,
              not the icon&rsquo;s.
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
        "The branch is picked automatically from whether label is set — there is no third option that gets this wrong by omission.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "No label",
                  v: 'aria-hidden="true", focusable="false", no role — hidden from assistive tech, exactly right when adjacent text already carries the meaning.',
                },
                {
                  k: "label set",
                  v: 'role="img", aria-label={label}, aria-hidden left unset — announced as an image with that name, for an icon-only control.',
                },
                {
                  k: "Colour is never the only signal",
                  v: "A semantic tone (success, warning, error) always pairs with adjacent text or an accessible name — RULES §7 forbids colour as the sole carrier of meaning.",
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
        "Icon renders focusable=\"false\" unconditionally — even in the labelled, role=\"img\" branch — so it is never part of the tab sequence.",
      blocks: [
        {
          body: (
            <Note tone="action" title="N/A on Icon">
              <p>
                An icon is never a tab stop by itself, labelled or not — the
                interactive target is whatever control it sits inside (a{" "}
                <Code>Button</Code>, a <Code>Tab</Code>), and that control
                owns the keyboard behaviour, documented on its own page.
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
        { body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> },
      ],
    },
  ],
};
