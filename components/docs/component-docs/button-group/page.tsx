import { ChevronDown, Minus, Plus } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";
import { Icon } from "@/components/ui/icon";
import { Code, Meta, Note, Row } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "button-group",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Joins related buttons into one visually continuous control by removing the borders and corner radii at each seam.",
      render: (
        <Row>
          <ButtonGroup>
            <Button variant="outline">Newest</Button>
            <Button variant="outline">Price</Button>
            <Button variant="outline">Popularity</Button>
          </ButtonGroup>
        </Row>
      ),
      source: `<ButtonGroup>
  <Button variant="outline">Newest</Button>
  <Button variant="outline">Price</Button>
  <Button variant="outline">Popularity</Button>
</ButtonGroup>`,
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
      code: `import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export function SortBar() {
  return (
    <ButtonGroup>
      <Button variant="outline">Newest</Button>
      <Button variant="outline">Price</Button>
      <Button variant="outline">Popularity</Button>
    </ButtonGroup>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "One prop, orientation, switches which edge each button gives up: horizontal buttons lose their left border and left corners, vertical buttons lose their top border and top corners.",
      label: "Orientation",
      render: (
        <div className="space-y-6">
          <div>
            <p className="type-badge mb-3 text-muted-foreground">horizontal (default)</p>
            <ButtonGroup>
              <Button variant="outline">Newest</Button>
              <Button variant="outline">Price</Button>
              <Button variant="outline">Popularity</Button>
            </ButtonGroup>
          </div>
          <div>
            <p className="type-badge mb-3 text-muted-foreground">vertical</p>
            <ButtonGroup orientation="vertical">
              <Button variant="outline">Newest</Button>
              <Button variant="outline">Price</Button>
              <Button variant="outline">Popularity</Button>
            </ButtonGroup>
          </div>
        </div>
      ),
      source: `<ButtonGroup>
  <Button variant="outline">Newest</Button>
  <Button variant="outline">Price</Button>
  <Button variant="outline">Popularity</Button>
</ButtonGroup>

<ButtonGroup orientation="vertical">
  <Button variant="outline">Newest</Button>
  <Button variant="outline">Price</Button>
  <Button variant="outline">Popularity</Button>
</ButtonGroup>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "A quantity stepper built from ButtonGroupText and two icon buttons, and a split action: a primary button with a chevron trigger for secondary options.",
      label: "Stepper and split action",
      render: (
        <div className="space-y-6">
          <ButtonGroup>
            <ButtonGroupText>Quantity</ButtonGroupText>
            <ButtonGroupSeparator />
            <Button variant="outline" size="icon" aria-label="Decrease quantity">
              <Icon icon={Minus} size="sm" tone="inherit" />
            </Button>
            <ButtonGroupText className="type-number-base">3</ButtonGroupText>
            <Button variant="outline" size="icon" aria-label="Increase quantity">
              <Icon icon={Plus} size="sm" tone="inherit" />
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button>Open Pack</Button>
            <ButtonGroupSeparator />
            <Button size="icon" aria-label="More open options">
              <Icon icon={ChevronDown} size="sm" tone="inherit" />
            </Button>
          </ButtonGroup>
        </div>
      ),
      source: `<ButtonGroup>
  <ButtonGroupText>Quantity</ButtonGroupText>
  <ButtonGroupSeparator />
  <Button variant="outline" size="icon" aria-label="Decrease quantity">
    <Icon icon={Minus} size="sm" tone="inherit" />
  </Button>
  <ButtonGroupText className="type-number-base">3</ButtonGroupText>
  <Button variant="outline" size="icon" aria-label="Increase quantity">
    <Icon icon={Plus} size="sm" tone="inherit" />
  </Button>
</ButtonGroup>

<ButtonGroup>
  <Button>Open Pack</Button>
  <ButtonGroupSeparator />
  <Button size="icon" aria-label="More open options">
    <Icon icon={ChevronDown} size="sm" tone="inherit" />
  </Button>
</ButtonGroup>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "ButtonGroup, ButtonGroupText, ButtonGroupSeparator and the buttonGroupVariants config.",
      blocks: [
        {
          label: "ButtonGroup",
          body: (
            <Meta
              items={[
                {
                  k: "orientation",
                  v: "\"horizontal\" · \"vertical\". Default: \"horizontal\". Controls which border and corners each non-edge child gives up.",
                },
                {
                  k: "...props",
                  v: "Every native <div> attribute. Renders role=\"group\" and data-slot=\"button-group\" automatically.",
                },
              ]}
            />
          ),
        },
        {
          label: "ButtonGroupText",
          body: (
            <Meta
              items={[
                {
                  k: "asChild",
                  v: "boolean. Default: false. Renders the single child via Radix Slot instead of a <div> — for a label built from a different element.",
                },
                {
                  k: "...props",
                  v: "Every native <div> attribute.",
                },
              ]}
            />
          ),
        },
        {
          label: "ButtonGroupSeparator",
          body: (
            <Meta
              items={[
                {
                  k: "orientation",
                  v: "\"horizontal\" · \"vertical\", from the underlying Separator. Default: \"vertical\" — the opposite of ButtonGroup's own default, since a separator inside a horizontal group is drawn as a vertical line.",
                },
                {
                  k: "...props",
                  v: "Every prop Separator accepts, forwarded directly.",
                },
              ]}
            />
          ),
        },
        {
          label: "buttonGroupVariants",
          body: (
            <p className="type-small text-muted-foreground">
              The class-variance-authority function <Code>ButtonGroup</Code> is built on
              (<Code>orientation</Code>). Exported for a consumer that needs the identical
              join treatment on an element other than the default wrapper.
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
        "ButtonGroup renders no state of its own — every rest, hover, focus, pressed, loading and disabled state belongs to the Button (or other control) placed inside it. See the Button page's States section.",
      blocks: [
        {
          body: (
            <Note tone="action" title="What the group itself adds">
              <p>
                Two things, both structural rather than visual: <Code>role=&quot;group&quot;</Code>{" "}
                for assistive tech, and a focus-visible rule that lifts the focused
                child above its neighbours (<Code>z-10</Code>) so a ring drawn at the
                shared border is never clipped by the button beside it.
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
        "The group is a landmark for assistive tech, not an interactive widget of its own.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: "group (native, via role=\"group\"). Give it an aria-label when the group's purpose is not obvious from the buttons alone — a sort bar reads fine unlabelled, a row of icon-only actions usually does not.",
                },
                {
                  k: "Focus order",
                  v: "Tab order follows document order — the same as the buttons rendered on their own. ButtonGroup adds no roving tabindex or arrow-key handling.",
                },
                {
                  k: "Target size",
                  v: "Inherited entirely from the size of the Button (or other control) placed inside. ButtonGroup has no size of its own to check against --size-target-min.",
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
        "No composite widget behaviour is added — each child keeps its own native keyboard contract.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Tab / Shift+Tab",
                  v: "Moves focus between the group's children in document order, exactly as if ButtonGroup were not there.",
                },
                {
                  k: "Space / Enter",
                  v: "Activates whichever button has focus (native <button> behaviour).",
                },
                {
                  k: "Arrow keys",
                  v: "Not handled. ButtonGroup is a visual join, not a Radix composite — use ToggleGroup instead when arrow-key roving between options is the intent.",
                },
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
        "ButtonGroup has no breakpoint classes of its own — orientation is a caller-chosen prop rather than something that switches automatically at a viewport width, and the group's own width is always w-fit.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "w-fit, not w-full",
                  v: "The group sizes itself to the sum of its children at every width; it does not stretch to fill its container, so it never needs to wrap its children onto a second line on its own.",
                },
                {
                  k: "orientation is not responsive",
                  v: "There is no built-in \"horizontal above this breakpoint, vertical below it\" behaviour — a caller wanting a stepper to stack vertically only on a phone would pass orientation conditionally themselves; ButtonGroup does not do this automatically.",
                },
                {
                  k: "Children",
                  v: "Whatever the group joins (usually Button) keeps its own fixed height and truncation behaviour at every width — see the Button page's own Responsive section for how a label inside the group adapts.",
                },
                {
                  k: "RTL",
                  v: "The seam-removal classes (rounded-l-none, border-l-0, etc.) are written against physical left/right edges, not logical start/end — under a right-to-left document the joined seam does not automatically follow the mirrored reading order. No overflow was measured under RTL, but the seam side itself has not been verified to flip.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920px, no overflow under 200% text zoom, and no overflow under RTL.",
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
