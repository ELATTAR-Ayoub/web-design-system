import { Heart } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Icon } from "@/components/ui/icon";
import { Toggle } from "@/components/ui/toggle";
import { Code, Meta, Note, Row, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "toggle",
  omitted: {
    responsive:
      "Every size in toggleVariants (sm/default/lg) is a fixed min-h/min-w pair with no breakpoint variant baked into toggle.tsx — the same control renders identically at 375px and 1920px. Sizing is a prop choice made in code, not a runtime response to viewport width.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A two-state button that stays visibly pressed once activated — for state that persists, not an action that fires once. Off and on, side by side; click either to feel the pressed edge for yourself.",
      render: (
        <Row>
          <div className="text-center">
            <Toggle size="lg" aria-label="Favourite">
              <Icon icon={Heart} size="sm" tone="inherit" />
            </Toggle>
            <p className="type-small mt-3 text-muted-foreground">off</p>
          </div>
          <div className="text-center">
            <Toggle size="lg" defaultPressed aria-label="Favourite">
              <Icon icon={Heart} size="sm" tone="inherit" />
            </Toggle>
            <p className="type-small mt-3 text-muted-foreground">on</p>
          </div>
        </Row>
      ),
      source: `<Toggle size="lg" aria-label="Favourite">
  <Icon icon={Heart} size="sm" tone="inherit" />
</Toggle>
<Toggle size="lg" defaultPressed aria-label="Favourite">
  <Icon icon={Heart} size="sm" tone="inherit" />
</Toggle>`,
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
      code: `import { Heart } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Toggle } from "@/components/ui/toggle";

export function FavouriteToggle() {
  return (
    <Toggle size="lg" aria-label="Favourite">
      <Icon icon={Heart} size="sm" tone="inherit" />
    </Toggle>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "default is borderless; outline draws a border so the control reads even before it is pressed on.",
      label: "Variants",
      render: (
        <Row>
          <Toggle aria-label="Favourite, default variant">
            <Icon icon={Heart} size="sm" tone="inherit" />
          </Toggle>
          <Toggle variant="outline" aria-label="Favourite, outline variant">
            <Icon icon={Heart} size="sm" tone="inherit" />
          </Toggle>
        </Row>
      ),
      source: `<Toggle aria-label="Favourite">
  <Icon icon={Heart} size="sm" tone="inherit" />
</Toggle>
<Toggle variant="outline" aria-label="Favourite">
  <Icon icon={Heart} size="sm" tone="inherit" />
</Toggle>`,
    },
    {
      kind: "showcase",
      id: "sizes",
      title: "Sizes",
      description:
        "sm (28px) and default (32px) belong in a toolbar beside other small controls. lg (40px) is the floor RULES §7 sets for an icon-only control standing on its own — use it whenever the toggle is not surrounded by other dense controls.",
      label: "Sizes",
      render: (
        <Row align="end">
          <div className="text-center">
            <Toggle size="sm" aria-label="Favourite, small">
              <Icon icon={Heart} size="sm" tone="inherit" />
            </Toggle>
            <p className="type-small mt-3 text-muted-foreground">sm · 28px</p>
          </div>
          <div className="text-center">
            <Toggle aria-label="Favourite, default">
              <Icon icon={Heart} size="sm" tone="inherit" />
            </Toggle>
            <p className="type-small mt-3 text-muted-foreground">default · 32px</p>
          </div>
          <div className="text-center">
            <Toggle size="lg" aria-label="Favourite, large">
              <Icon icon={Heart} size="sm" tone="inherit" />
            </Toggle>
            <p className="type-small mt-3 text-muted-foreground">lg · 40px</p>
          </div>
        </Row>
      ),
      source: `<Toggle size="sm" aria-label="Favourite">…</Toggle>
<Toggle aria-label="Favourite">…</Toggle>
<Toggle size="lg" aria-label="Favourite">…</Toggle>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Toggle and the toggleVariants config it is built on.",
      blocks: [
        {
          label: "Toggle",
          body: (
            <Meta
              items={[
                {
                  k: "variant",
                  v: "\"default\" · \"outline\". Default: \"default\".",
                },
                {
                  k: "size",
                  v: "\"sm\" · \"default\" · \"lg\". Default: \"default\".",
                },
                {
                  k: "pressed / defaultPressed",
                  v: "boolean, from Radix Toggle.Root. Controlled / uncontrolled pressed state.",
                },
                {
                  k: "onPressedChange",
                  v: "(pressed: boolean) => void, from Radix Toggle.Root.",
                },
                {
                  k: "disabled",
                  v: "boolean, native prop forwarded to Radix Toggle.Root.",
                },
                {
                  k: "...props",
                  v: "Every other prop Radix Toggle.Root accepts (aria-invalid, aria-label, etc.), forwarded directly.",
                },
              ]}
            />
          ),
        },
        {
          label: "toggleVariants",
          body: (
            <p className="type-small text-muted-foreground">
              The class-variance-authority function <Code>Toggle</Code> is built on
              (<Code>variant</Code>, <Code>size</Code>). <Code>ToggleGroupItem</Code>{" "}
              is built on the same function, which is why a Toggle and a
              ToggleGroupItem of the same size and variant match pixel for pixel.
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
        "Hover, focus and press are live below — interact with them directly. On/off is the state this control exists for.",
      blocks: [
        {
          body: (
            <StateGrid cols={5}>
              <StateCell label="off">
                <Toggle aria-label="Favourite, off">
                  <Icon icon={Heart} size="sm" tone="inherit" />
                </Toggle>
              </StateCell>
              <StateCell label="on" note="defaultPressed">
                <Toggle defaultPressed aria-label="Favourite, on">
                  <Icon icon={Heart} size="sm" tone="inherit" />
                </Toggle>
              </StateCell>
              <StateCell label="focus-visible" note="Tab to it">
                <Toggle aria-label="Favourite">
                  <Icon icon={Heart} size="sm" tone="inherit" />
                </Toggle>
              </StateCell>
              <StateCell label="disabled" note="Unavailable">
                <Toggle disabled aria-label="Favourite, unavailable">
                  <Icon icon={Heart} size="sm" tone="inherit" />
                </Toggle>
              </StateCell>
              <StateCell label="error" note="aria-invalid">
                <Toggle aria-invalid aria-label="Favourite, in error">
                  <Icon icon={Heart} size="sm" tone="inherit" />
                </Toggle>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A rows">
              <p>
                <strong>loading</strong> and <strong>success</strong> are N/A: Toggle has
                no asynchronous behaviour of its own — pressed state flips synchronously,
                with no request in flight to show progress or completion for.
              </p>
              <p className="mt-2">
                <strong>empty</strong> is N/A for the same reason it is N/A on Button: it
                describes a collection or region, not a single control.
              </p>
              <p className="mt-2">
                The pressed fill is the same muted background used for hover
                (<Code>data-[state=on]:bg-muted</Code>), which is why an <strong>on</strong>{" "}
                toggle and a <strong>hovered off</strong> toggle can look identical at rest —
                rely on the pressed/depressed edge and, where it matters, an adjacent label,
                rather than colour alone.
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
        "Built on Radix Toggle.Root, which stamps the ARIA pressed state so on/off is announced without extra wiring.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "button (native), with aria-pressed reflecting the on/off state." },
                {
                  k: "Accessible name",
                  v: "The rendered text content, or an explicit aria-label for an icon-only toggle — exactly as with Button.",
                },
                {
                  k: "aria-invalid",
                  v: "Styles the destructive ring; pair it with a written error elsewhere on the page.",
                },
                {
                  k: "Target size",
                  v: "lg (40px) clears --size-target-min (44px) closely enough to stand alone per RULES §7; sm (28px) and default (32px) are documented as toolbar-only, beside other dense controls, never a standalone target.",
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
                { k: "Tab / Shift+Tab", v: "Moves focus to and from the toggle in document order." },
                { k: "Space", v: "Toggles pressed state (Radix Toggle.Root behaviour)." },
                { k: "Enter", v: "Toggles pressed state (Radix Toggle.Root behaviour)." },
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
