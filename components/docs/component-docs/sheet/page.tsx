import { SlidersHorizontal } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Meta, Row } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "sheet",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Slides in from an edge. The filter panel on the marketplace becomes a sheet below 1200px, and the account panel uses it on every size.",
      render: (
        <Row className="justify-center">
          <div className="flex w-full max-w-md items-center justify-between gap-4">
            <p className="type-small text-muted-foreground">184 packs · sorted by newest</p>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Icon icon={SlidersHorizontal} size="sm" tone="inherit" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter packs</SheetTitle>
                <SheetDescription>184 packs match your current filters.</SheetDescription>
              </SheetHeader>
              <SheetBody className="space-y-8">
                <div>
                  <p className="type-small mb-4 text-muted-foreground">Price range</p>
                  <Slider
                    defaultValue={[10, 240]}
                    max={500}
                    step={5}
                    thumbLabels={["Minimum price", "Maximum price"]}
                  />
                </div>
                <div>
                  <p className="type-small mb-4 text-muted-foreground">Rarity floor</p>
                  <div className="space-y-3">
                    {["Rare", "Epic", "Legendary", "Mythic"].map((r) => (
                      <label
                        key={r}
                        className="flex items-center gap-3 type-small text-muted-foreground"
                      >
                        <Checkbox /> {r}
                      </label>
                    ))}
                  </div>
                </div>
              </SheetBody>
              <SheetFooter>
                <Button>Apply filters</Button>
                <SheetClose asChild>
                  <Button variant="ghost">Reset and close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          </div>
        </Row>
      ),
      source: `<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Filters</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Filter packs</SheetTitle>
      <SheetDescription>184 packs match your current filters.</SheetDescription>
    </SheetHeader>
    <SheetBody>{/* the only zone that scrolls */}</SheetBody>
    <SheetFooter>
      <Button>Apply filters</Button>
      <SheetClose asChild>
        <Button variant="ghost">Reset and close</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>`,
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
        "Put content in SheetBody, not directly between the header and footer — SheetBody is min-h-0 flex-1 overflow-y-auto, and dropping raw children between the bands means they will not scroll and can push the footer's actions off the bottom of the screen.",
      language: "tsx",
      code: `import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function FilterSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Filters</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filter packs</SheetTitle>
          <SheetDescription>184 packs match your current filters.</SheetDescription>
        </SheetHeader>
        <SheetBody>{/* long filter controls */}</SheetBody>
        <SheetFooter>
          <Button>Apply filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "side controls which edge the sheet slides from — top, right, bottom or left. Left and right cap at sm:max-w-sm; top and bottom span the full width and size to their content.",
      label: "side",
      render: (
        <Row>
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline" className="capitalize">
                  {side}
                </Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle className="capitalize">{side} sheet</SheetTitle>
                  <SheetDescription>side=&quot;{side}&quot;</SheetDescription>
                </SheetHeader>
                <SheetBody>
                  <p className="type-small text-muted-foreground">
                    Content goes here, in SheetBody.
                  </p>
                </SheetBody>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="ghost">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </Row>
      ),
      source: `<SheetContent side="left">…</SheetContent>
<SheetContent side="right">…</SheetContent>
<SheetContent side="top">…</SheetContent>
<SheetContent side="bottom">…</SheetContent>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Sheet / SheetTrigger / SheetClose",
          body: (
            <Meta
              items={[
                {
                  k: "Sheet",
                  v: "Forwards every prop to Radix DialogPrimitive.Root (Sheet is built on the same Dialog primitive as Dialog itself, not a distinct Radix package) — open, onOpenChange, defaultOpen, modal.",
                },
                { k: "SheetTrigger", v: "Radix DialogPrimitive.Trigger. Pass asChild to use an existing element as the trigger." },
                { k: "SheetClose", v: "Radix DialogPrimitive.Close. asChild lets any element dismiss the sheet on click." },
              ]}
            />
          ),
        },
        {
          label: "SheetContent",
          body: (
            <Meta
              items={[
                { k: "side", v: "\"top\" · \"right\" · \"bottom\" · \"left\". Default: \"right\"." },
                {
                  k: "showCloseButton",
                  v: "boolean. Default: true. Hides the absolutely-positioned ✕ in the top-right corner when false.",
                },
                {
                  k: "...props",
                  v: "Every Radix DialogPrimitive.Content prop (onOpenAutoFocus, onEscapeKeyDown, onPointerDownOutside, forceMount, etc.), forwarded directly.",
                },
              ]}
            />
          ),
        },
        {
          label: "SheetHeader / SheetBody / SheetFooter",
          body: (
            <Meta
              items={[
                {
                  k: "SheetHeader",
                  v: "React.ComponentProps<\"div\">. Muted, bordered band — the same three-zone banding Dialog uses, shrink-0 so it stays put while the body scrolls.",
                },
                {
                  k: "SheetBody",
                  v: "React.ComponentProps<\"div\">. min-h-0 flex-1 overflow-y-auto — the only zone that scrolls. min-h-0 is load-bearing: a flex child's default min-height: auto refuses to shrink below its content, so flex-1 overflow-y-auto alone still grows the column and pushes the footer off-screen.",
                },
                {
                  k: "SheetFooter",
                  v: "React.ComponentProps<\"div\">. mt-auto flex shrink-0 — muted, bordered band pinned to the bottom.",
                },
              ]}
            />
          ),
        },
        {
          label: "SheetTitle / SheetDescription",
          body: (
            <Meta
              items={[
                { k: "SheetTitle", v: "Radix DialogPrimitive.Title. Required for the same reason as DialogTitle — it supplies aria-labelledby, and is needed even when visually redundant with a heading already on the page." },
                { k: "SheetDescription", v: "Radix DialogPrimitive.Description. Supplies aria-describedby when present." },
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
      description:
        "Built on the same Radix DialogPrimitive as Dialog, so it carries the identical modal semantics — a focus trap, restored focus on close, and the trigger/title/description ARIA wiring.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "role=\"dialog\" (Radix default) with aria-modal=\"true\"." },
                {
                  k: "Accessible name / description",
                  v: "aria-labelledby / aria-describedby, pointed at SheetTitle and SheetDescription automatically. SheetTitle is required even when a heading elsewhere on the sheet makes it visually redundant.",
                },
                {
                  k: "Focus management",
                  v: "On open, focus moves into the content; it is trapped there while open and returns to the trigger on close — identical to Dialog.",
                },
                {
                  k: "Dismissal",
                  v: "Escape, a click on the overlay, and a click outside the content all close the sheet by default, plus any explicit SheetClose control.",
                },
                {
                  k: "Background inertness",
                  v: "The rest of the page is marked inert to assistive tech while the sheet is open.",
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
                { k: "Enter / Space", v: "Activates the trigger, opening the sheet." },
                { k: "Tab / Shift+Tab", v: "Cycles focus among the sheet's own focusable elements only, including anything scrolled out of view inside SheetBody." },
                { k: "Escape", v: "Closes the sheet and returns focus to the trigger." },
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
      description: "side=\"left\" and side=\"right\" genuinely change width by viewport.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Below the sm breakpoint (768px)", v: "data-[side=left/right]:w-3/4 — the sheet takes three quarters of the viewport width, so a sliver of the page stays visible behind it." },
                { k: "sm and above", v: "Capped at sm:max-w-sm and no longer tied to a fraction of the viewport." },
                { k: "side=\"top\" / side=\"bottom\"", v: "Always full width (inset-x-0); height is intrinsic to content rather than viewport-relative." },
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
