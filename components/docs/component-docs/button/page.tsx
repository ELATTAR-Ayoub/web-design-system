import { Heart, PackageOpen, Search, Share2, Trash2, Wallet } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Button, ButtonLabel } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Code, Meta, Note, Row, StateCell, StateGrid } from "@/components/ds/kit";

import { OpenPackSpecimen } from "./button-open-pack-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "button",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Press Open Pack: it loads with Button's own loading prop, then a pull reveals below it — the same round trip a real action takes, not a lone element in space. Every size and state gets its own static specimen further down the page — see Variants and Sizes below.",
      label: "Open a pack",
      render: <OpenPackSpecimen />,
      source: `"use client";

import { useState } from "react";
import { PackageOpen } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const PULLS = [
  { name: "Voidwing Ascendant", rarity: "Legendary", value: "$248.00" },
  { name: "Emberlash Prime", rarity: "Epic", value: "$64.00" },
  { name: "Tidecaller", rarity: "Rare", value: "$12.00" },
];

export function OpenPackSpecimen() {
  const [status, setStatus] = useState<"idle" | "opening" | "done">("idle");
  const [pull, setPull] = useState<typeof PULLS[number] | null>(null);

  async function openPack() {
    setStatus("opening");
    setPull(null);
    await new Promise((r) => setTimeout(r, 1100));
    const result = PULLS[Math.floor(Math.random() * PULLS.length)];
    setPull(result);
    setStatus("done");
    toast.success(\`Pulled \${result.name} — \${result.value}\`);
  }

  return (
    <div className="text-center">
      <Button size="lg" variant="premium" loading={status === "opening"} onClick={openPack}>
        {status === "opening" ? "Opening" : (
          <>
            <Icon icon={PackageOpen} size="sm" tone="inherit" />
            Open Pack
          </>
        )}
      </Button>
      {pull && status === "done" && (
        <div className="rounded-xl border border-border bg-card p-5 text-left">
          <p className="type-h4 text-foreground">{pull.name}</p>
          <Badge variant="premium">{pull.rarity}</Badge>
          <p className="type-number-lg text-value-ink">{pull.value}</p>
        </div>
      )}
    </div>
  );
}`,
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

export function DepositAction() {
  return (
    <Button variant="premium" size="lg">
      Deposit Funds
    </Button>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "Seven variants, ordered by emphasis. Only one primary or premium button should be visible in any single decision area — if two compete, the user cannot tell what the screen wants.",
      label: "Variants",
      render: (
        <StateGrid cols={4}>
          <StateCell label="default" note="Primary action. Blue.">
            <Button>Open Pack</Button>
          </StateCell>
          <StateCell label="premium" note="Money & reward. Lime.">
            <Button variant="premium">Deposit Funds</Button>
          </StateCell>
          <StateCell label="secondary" note="Neutral, beside a primary.">
            <Button variant="secondary">View Hits</Button>
          </StateCell>
          <StateCell label="outline" note="Must not compete.">
            <Button variant="outline">Filters</Button>
          </StateCell>
          <StateCell label="ghost" note="Toolbars, dismissals.">
            <Button variant="ghost">Skip</Button>
          </StateCell>
          <StateCell label="destructive" note="Sell back, delete.">
            <Button variant="destructive">Sell All</Button>
          </StateCell>
          <StateCell label="link" note="Inline text action.">
            <Button variant="link">Forgot password?</Button>
          </StateCell>
          <StateCell label="premium + caps" note="Hero CTA treatment.">
            <Button variant="premium" emphasis="caps">
              Claim Reward
            </Button>
          </StateCell>
        </StateGrid>
      ),
      source: `<Button>Open Pack</Button>
<Button variant="premium">Deposit Funds</Button>
<Button variant="secondary">View Hits</Button>
<Button variant="outline">Filters</Button>
<Button variant="ghost">Skip</Button>
<Button variant="destructive">Sell All</Button>
<Button variant="link">Forgot password?</Button>
<Button variant="premium" emphasis="caps">Claim Reward</Button>`,
    },
    {
      kind: "showcase",
      id: "sizes",
      title: "Sizes",
      description:
        "32 / 40 / 48 / 56, plus a 24px step for dense internal use, and a matching icon-only ladder.",
      label: "Sizes",
      render: (
        <div className="space-y-6">
          <Row align="end">
            <div className="text-center">
              <Button size="xs">Extra small</Button>
              <p className="type-small mt-3 text-muted-foreground">xs · 24px</p>
            </div>
            <div className="text-center">
              <Button size="sm">Small</Button>
              <p className="type-small mt-3 text-muted-foreground">sm · 32px</p>
            </div>
            <div className="text-center">
              <Button>Medium</Button>
              <p className="type-small mt-3 text-muted-foreground">default · 40px</p>
            </div>
            <div className="text-center">
              <Button size="lg">Large</Button>
              <p className="type-small mt-3 text-muted-foreground">lg · 48px</p>
            </div>
            <div className="text-center">
              <Button size="xl">Hero</Button>
              <p className="type-small mt-3 text-muted-foreground">xl · 56px</p>
            </div>
          </Row>
          <Row align="end" className="border-t border-border pt-6">
            <div className="text-center">
              <Button size="icon-xs" variant="ghost" aria-label="Search, extra small">
                <Icon icon={Search} size="xs" tone="inherit" />
              </Button>
              <p className="type-small mt-3 text-muted-foreground">icon-xs · 24px</p>
            </div>
            <div className="text-center">
              <Button size="icon-sm" variant="ghost" aria-label="Search, small">
                <Icon icon={Search} size="sm" tone="inherit" />
              </Button>
              <p className="type-small mt-3 text-muted-foreground">icon-sm · 32px</p>
            </div>
            <div className="text-center">
              <Button size="icon" variant="outline" aria-label="Search">
                <Icon icon={Search} size="md" tone="inherit" />
              </Button>
              <p className="type-small mt-3 text-muted-foreground">icon · 40px</p>
            </div>
            <div className="text-center">
              <Button size="icon-lg" aria-label="Search, large">
                <Icon icon={Search} size="lg" tone="inherit" />
              </Button>
              <p className="type-small mt-3 text-muted-foreground">icon-lg · 48px</p>
            </div>
          </Row>
        </div>
      ),
      source: `<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button>Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Hero</Button>

<Button size="icon" variant="outline" aria-label="Search">
  <Icon icon={Search} size="md" tone="inherit" />
</Button>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Icon placement, icon-only buttons, and ButtonLabel for a label that must truncate rather than wrap.",
      label: "Icons and constrained labels",
      render: (
        <div className="space-y-6">
          <Row>
            <Button>
              <Icon icon={PackageOpen} size="sm" tone="inherit" />
              Open Pack
            </Button>
            <Button variant="premium">
              <Icon icon={Wallet} size="sm" tone="inherit" />
              Deposit Funds
            </Button>
            <Button variant="destructive">
              <Icon icon={Trash2} size="sm" tone="inherit" />
              Sell Selected
            </Button>
          </Row>
          <Row>
            <Button size="icon-sm" variant="ghost" aria-label="Search packs">
              <Icon icon={Search} size="sm" tone="inherit" />
            </Button>
            <Button size="icon" variant="outline" aria-label="Add to favourites">
              <Icon icon={Heart} size="md" tone="inherit" />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Share pull">
              <Icon icon={Share2} size="md" tone="inherit" />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Favourite this card">
              <Icon icon={Heart} size="md" tone="value" />
            </Button>
          </Row>
          <p className="type-small text-muted-foreground">
            The last icon-only button above uses the lime <Code>value</Code> tone
            deliberately — a favourited card is a value signal, and that is one of
            lime&rsquo;s permitted jobs outside the <Code>premium</Code> variant itself.
          </p>
          <div className="max-w-40">
            <Button className="w-full" variant="outline">
              <ButtonLabel>A label long enough to truncate inside a narrow button</ButtonLabel>
            </Button>
          </div>
        </div>
      ),
      source: `<Button size="icon" variant="outline" aria-label="Add to favourites">
  <Icon icon={Heart} size="md" tone="inherit" />
</Button>

<Button size="icon" variant="ghost" aria-label="Favourite this card">
  <Icon icon={Heart} size="md" tone="value" />
</Button>

<Button variant="outline" className="w-40">
  <ButtonLabel>A label long enough to truncate inside a narrow button</ButtonLabel>
</Button>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Button, ButtonLabel and the buttonVariants config they share.",
      blocks: [
        {
          label: "Button",
          body: (
            <Meta
              items={[
                {
                  k: "variant",
                  v: "\"default\" · \"premium\" · \"secondary\" · \"outline\" · \"ghost\" · \"destructive\" · \"link\". Default: \"default\".",
                },
                {
                  k: "size",
                  v: "\"xs\" · \"sm\" · \"default\" · \"lg\" · \"xl\" · \"icon-xs\" · \"icon-sm\" · \"icon\" · \"icon-lg\". Default: \"default\".",
                },
                {
                  k: "emphasis",
                  v: "\"none\" · \"caps\". \"caps\" sets the type-cta role (semibold) for headline and money CTAs, in place of the size's role. Default: \"none\".",
                },
                {
                  k: "loading",
                  v: "boolean. Default: false. Swaps the leading content for a Spinner, sets aria-busy and disables the button; the label stays in place so the control does not change width mid-action.",
                },
                {
                  k: "asChild",
                  v: "boolean. Default: false. Renders the single child via Radix Slot instead of a <button> — for a link that must look like a button. The loading spinner and disabled-from-loading logic are skipped in this mode, since there is no <button> to disable.",
                },
                {
                  k: "disabled",
                  v: "boolean, native <button> prop. Combined with loading: the element is disabled when either is true.",
                },
                {
                  k: "...props",
                  v: "Every other native <button> attribute (onClick, type, aria-*, etc.), forwarded directly.",
                },
              ]}
            />
          ),
        },
        {
          label: "ButtonLabel",
          body: (
            <Meta
              items={[
                {
                  k: "(all)",
                  v: "React.ComponentProps<\"span\">. A text slot with min-w-0 and truncate applied, for a button whose label must ellipsis instead of forcing the control wider or wrapping to a second line.",
                },
              ]}
            />
          ),
        },
        {
          label: "buttonVariants",
          body: (
            <p className="type-small text-muted-foreground">
              The class-variance-authority function Button is built on
              (<Code>variant</Code>, <Code>size</Code>, <Code>emphasis</Code>). Exported so a
              consumer can style a non-button element — an anchor rendered without{" "}
              <Code>asChild</Code>, for instance — with the identical visual treatment.
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
        "Hover, focus and press are live below — interact with them directly.",
      blocks: [
        {
          body: (
            <StateGrid cols={5}>
              <StateCell label="rest">
                <Button>Open Pack</Button>
              </StateCell>
              <StateCell label="hover" note="Hover it">
                <Button>Open Pack</Button>
              </StateCell>
              <StateCell label="focus-visible" note="Tab to it">
                <Button>Open Pack</Button>
              </StateCell>
              <StateCell label="pressed" note="Click and hold">
                <Button>Open Pack</Button>
              </StateCell>
              <StateCell label="loading" note="aria-busy, width held">
                <Button loading>Open Pack</Button>
              </StateCell>
              <StateCell label="disabled" note="50% opacity, exempt from contrast">
                <Button disabled>Open Pack</Button>
              </StateCell>
              <StateCell label="error" note="aria-invalid">
                <Button aria-invalid>Open Pack</Button>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A rows">
              <p>
                <strong>success</strong> is N/A: a Button has no completion state of its own
                to draw. The action it triggers is synchronous from the button&rsquo;s point of
                view — press in, press out — and the outcome (a toast, a navigation, a
                dialog closing) is owned by whatever the press caused, not by the control
                itself. See <Code>toaster</Code> and <Code>dialog</Code> for the outcome
                half of the two-signal pattern.
              </p>
              <p className="mt-2">
                <strong>empty</strong> is N/A for the same reason a control can never be
                empty: emptiness describes a collection or a region with nothing in it, and
                a Button either renders its label/icon or it does not render at all.
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
        "Button is a real <button> (or, with asChild, whatever element it wraps), so focus, activation and the disabled state come from the platform rather than being reimplemented.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "button (native). No role attribute is set or needed." },
                {
                  k: "Accessible name",
                  v: "The rendered text content by default. An icon-only button (no visible text) must be given an explicit aria-label — the icon alone announces nothing.",
                },
                {
                  k: "State announcements",
                  v: "loading sets aria-busy=\"true\" and disables the control, so assistive tech reports the button as unavailable rather than silently ignoring a second press. aria-invalid is exposed for a button acting inside form validation.",
                },
                {
                  k: "Focus order",
                  v: "Tab order follows document order. A disabled (or loading) button is removed from the tab sequence, matching native <button disabled>.",
                },
                {
                  k: "Target size",
                  v: "default (40px), lg (48px) and xl (56px) all clear --size-target-min (44px) or are close enough that the icon variants at those steps meet it exactly; xs (24px) and sm (32px) are documented as dense/internal-only precisely because they sit under the floor — RULES reserves them for chips inside a combobox or attachment, never a standalone target.",
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
                { k: "Tab / Shift+Tab", v: "Moves focus to and from the button in document order." },
                { k: "Space", v: "Activates the button (native <button> behaviour)." },
                { k: "Enter", v: "Activates the button (native <button> behaviour)." },
                {
                  k: "During loading",
                  v: "The control is disabled, so it is skipped by Tab and neither Space nor Enter can re-fire it — the platform-level guard against a double submit.",
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
        "Button has no breakpoint classes of its own — size is a caller-chosen prop, fixed at every viewport, and the label is what actually adapts to a narrow box.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Fixed heights",
                  v: "Every size step (min-h-8 through min-h-14) is a fixed pixel value with no sm:/md:/lg: variant — a button does not shrink itself at a narrow viewport; a caller reaching for a smaller control on mobile passes a smaller size explicitly.",
                },
                {
                  k: "Width and truncation",
                  v: "min-w-0 max-w-full shrink-0 whitespace-nowrap lets a Button shrink inside a narrow flex or grid parent without wrapping its label to a second line; ButtonLabel adds truncate for a label that must ellipsis rather than force the control wider — see the constrained-label specimen under Examples.",
                },
                {
                  k: "Target size at 200% zoom",
                  v: "Because height is a fixed rem-based value rather than tied to font metrics, a button stays at its own size under 200% text zoom rather than growing or shrinking with it; the label inside may wrap if it no longer fits, per Width and truncation above.",
                },
                {
                  k: "RTL",
                  v: "Icon placement (leading/trailing) is written with logical spacing, so an icon-and-label button reads correctly right-to-left without a mirrored variant.",
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
