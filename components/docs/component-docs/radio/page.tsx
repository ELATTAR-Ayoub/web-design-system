import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { PaymentMethodSpecimen } from "./radio-payment-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "radio",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "One choice from a set the user can see at once — the whole option card is the target, not just the 20px circle. Pick a withdrawal method and the fee/arrival summary beneath it actually changes.",
      label: "Withdrawal method",
      render: <PaymentMethodSpecimen />,
      source: `"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

const METHODS = [
  { value: "usdc", title: "USDC", desc: "Network fee applies.", fee: "$1.20", arrival: "Minutes" },
  { value: "bank", title: "Bank transfer", desc: "Standard ACH.", fee: "$0.00", arrival: "1–3 business days" },
  { value: "card", title: "Card refund", desc: "Back to the original card.", fee: "$0.00", arrival: "5–10 business days" },
];

export function PaymentMethodSpecimen() {
  const [value, setValue] = useState("usdc");
  const chosen = METHODS.find((m) => m.value === value)!;

  return (
    <div>
      <RadioGroup value={value} onValueChange={setValue}>
        {METHODS.map((m) => (
          <Label
            key={m.value}
            htmlFor={\`pm-\${m.value}\`}
            className="has-[[data-state=checked]]:border-action/50 has-[[data-state=checked]]:bg-action/12"
          >
            <RadioGroupItem value={m.value} id={\`pm-\${m.value}\`} />
            <span>{m.title}</span>
          </Label>
        ))}
      </RadioGroup>
      <p>Fee {chosen.fee} · Arrives {chosen.arrival}</p>
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
      description:
        "Wrap each item in a Label so the whole row — not just the 20px circle — is the click target.",
      language: "tsx",
      code: `import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

export function PlanChoice() {
  return (
    <RadioGroup defaultValue="monthly">
      <Label htmlFor="monthly">
        <RadioGroupItem value="monthly" id="monthly" />
        Monthly
      </Label>
      <Label htmlFor="annual">
        <RadioGroupItem value="annual" id="annual" />
        Annual
      </Label>
    </RadioGroup>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "One choice from a visible set. If the options need explaining, the description belongs inside the option, not beneath the group.",
      label: "Withdrawal method",
      render: (
        <Panel>
          <RadioGroup defaultValue="usdc" className="max-w-lg gap-3">
            {[
              ["usdc", "USDC", "Arrives in minutes. Network fee applies.", "No fee"],
              ["bank", "Bank transfer", "1–3 business days.", "$0.00"],
              ["card", "Card refund", "Back to the original card. 5–10 days.", "$0.00"],
            ].map(([value, title, desc, fee]) => (
              <Label
                key={value}
                htmlFor={`w-${value}`}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors duration-fast has-[[data-state=checked]]:border-action/50 has-[[data-state=checked]]:bg-action/12 hover:border-input"
              >
                <RadioGroupItem value={value} id={`w-${value}`} className="mt-0.5" />
                <span className="min-w-0 flex-1">
                  <span className="type-h4 block text-foreground">{title}</span>
                  <span className="type-small mt-1 block text-muted-foreground">{desc}</span>
                </span>
                <span className="type-number-sm shrink-0 text-muted-foreground">{fee}</span>
              </Label>
            ))}
          </RadioGroup>
          <p className="type-small mt-5 text-muted-foreground">
            The whole card is the target, not just the 20px circle. Selected takes a blue
            border plus the blue tint — the same has-[[data-state=checked]]: pattern
            Checkbox&rsquo;s bulk header uses, applied to the wrapper rather than the
            control.
          </p>
        </Panel>
      ),
      source: `<RadioGroup defaultValue="usdc">
  <Label
    htmlFor="usdc"
    className="has-[[data-state=checked]]:border-action/50 has-[[data-state=checked]]:bg-action/12"
  >
    <RadioGroupItem value="usdc" id="usdc" />
    <span>USDC</span>
    <span>No fee</span>
  </Label>
</RadioGroup>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "RadioGroup wraps Radix's RadioGroupPrimitive.Root; RadioGroupItem wraps RadioGroupPrimitive.Item. Both forward every other prop straight through.",
      blocks: [
        {
          label: "RadioGroup",
          body: (
            <Meta
              items={[
                { k: "value", v: "string | null. Controlled selection, matching one item's value." },
                { k: "defaultValue", v: "string. Uncontrolled initial selection." },
                { k: "onValueChange", v: "(value: string) => void." },
                { k: "name", v: "string — for a bubbled native <input> inside a <form>." },
                { k: "disabled", v: "boolean — disables every item in the group." },
                { k: "required", v: "boolean." },
                { k: "orientation", v: "\"horizontal\" | \"vertical\" — governs arrow-key traversal direction. Radix default: \"vertical\"." },
                { k: "loop", v: "boolean — whether arrow-key traversal wraps from the last item to the first. Radix default: true." },
                { k: "dir", v: "\"ltr\" | \"rtl\"." },
              ]}
            />
          ),
        },
        {
          label: "RadioGroupItem",
          body: (
            <Meta
              items={[
                { k: "value", v: "string, required. The value this item represents within the group." },
                { k: "disabled", v: "boolean — disables this item only." },
                { k: "disabledReason", v: "Why this item is disabled, shown as a reason surface via components/ui/disabled.tsx (native mode — Radix's RadioGroupItem is a real <button disabled>). Mirrors Flutter's RadioGroupItem.disabledReason." },
                {
                  k: "...props",
                  v: "Every other attribute Radix's underlying <button> accepts (id, aria-*, etc.), forwarded directly.",
                },
              ]}
            />
          ),
        },
        {
          label: "has-[[data-state=checked]]:",
          body: (
            <p className="type-small text-muted-foreground">
              The Tailwind pattern used above for styling a wrapper based on the control
              inside it — the selected-option-card treatment relies on it rather than a
              separate selected prop.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="rest / unselected">
                <RadioGroup>
                  <RadioGroupItem value="a" aria-label="Unselected" />
                </RadioGroup>
              </StateCell>
              <StateCell label="selected">
                <RadioGroup defaultValue="a">
                  <RadioGroupItem value="a" aria-label="Selected" />
                </RadioGroup>
              </StateCell>
              <StateCell label="focus-visible" note="Tab to it">
                <RadioGroup>
                  <RadioGroupItem
                    value="a"
                    className="border-ring ring-3 ring-ring/50"
                    aria-label="Focus"
                  />
                </RadioGroup>
              </StateCell>
              <StateCell label="disabled">
                <RadioGroup>
                  <RadioGroupItem value="a" disabled aria-label="Disabled" />
                </RadioGroup>
              </StateCell>
              <StateCell label="disabled selected">
                <RadioGroup defaultValue="a">
                  <RadioGroupItem value="a" disabled aria-label="Disabled selected" />
                </RadioGroup>
              </StateCell>
              <StateCell label="disabled reason" note="Focus it — the reason is announced">
                <RadioGroup>
                  <RadioGroupItem
                    value="a"
                    disabled
                    disabledReason="Only available on the annual plan."
                    aria-label="Disabled with reason"
                  />
                </RadioGroup>
              </StateCell>
              <StateCell label="error" note="aria-invalid">
                <RadioGroup>
                  <RadioGroupItem value="a" aria-invalid aria-label="Error" />
                </RadioGroup>
              </StateCell>
            </StateGrid>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "RadioGroup and RadioGroupItem are Radix primitives that carry group and item role and state themselves.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: "radiogroup on the RadioGroup root, wrapping radio items. aria-checked on each item reflects selection.",
                },
                {
                  k: "Accessible name",
                  v: "Each item needs its own name — a visible label (via a wrapping Label with htmlFor, as in Usage) or an explicit aria-label. RadioGroup itself has no name of its own; a group description belongs in a FieldSet/FieldLegend pair around it.",
                },
                {
                  k: "State announcements",
                  v: "aria-invalid is available per item; pair it with a written error rather than relying on the destructive ring alone.",
                },
                {
                  k: "Target size",
                  v: "Drawn at 20px with the same after:-inset-x-3 after:-inset-y-2 hit-area extension as Checkbox, reaching --size-target-min (44px). Composed inside a card layout (see Examples), the whole card becomes the effective target.",
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
        "Traversal within the group, not per-item Tab stops, is what makes a radio group a single control rather than several.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Tab / Shift+Tab", v: "Enters and leaves the group as one stop — lands on the selected item, or the first item if none is selected." },
                { k: "Arrow Down / Arrow Right", v: "Moves selection to the next item and selects it immediately (roving-focus + selection combined)." },
                { k: "Arrow Up / Arrow Left", v: "Moves selection to the previous item and selects it immediately." },
                { k: "Home / End", v: "Jumps to the first / last item in the group." },
                { k: "loop", v: "When true (Radix default), Arrow Down on the last item wraps to the first." },
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
        "RadioGroup lays out its own items in a plain CSS grid, so its column count — and how it reflows — is entirely the caller's grid-cols choice, not something radio.tsx decides.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "The group",
                  v: "grid w-full gap-2 with no grid-template-columns of its own — one column by default. A caller adds sm:grid-cols-2 or similar to lay items side by side above a breakpoint and stack them below it; RadioGroup does not choose that for you.",
                },
                {
                  k: "Touch target",
                  v: "Each RadioGroupItem is a 20px visual circle, but its real hit area is the ::after pseudo-element's -inset-x-3 -inset-y-2 — expanding it to size-target-min territory without inflating the drawn control, so the target stays reachable at any width or density.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920, none at 200% text zoom, and none under RTL — the grid and the Label beside each item both reflow with the page's own direction, since nothing in radio.tsx hardcodes a left/right offset.",
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
