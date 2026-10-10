import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "checkbox",
  omitted: {
    responsive: "A checkbox is a fixed 20px box with a hit area already extended to the 44px target floor via after:-inset-x-3 after:-inset-y-2, regardless of viewport — there is no breakpoint at which it resizes, and no layout of its own to reflow: it takes whatever width Field or the caller's row gives it.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A checkbox is a control inside a row, not a standalone element — the label is what makes it usable, so the preview shows the two together.",
      render: (
        <div className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-card p-4">
          <Field orientation="horizontal">
            <Checkbox id="preview-terms" defaultChecked />
            <FieldLabel htmlFor="preview-terms" className="font-normal">
              I accept the seller terms
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="preview-updates" />
            <FieldLabel htmlFor="preview-updates" className="font-normal">
              Email me when a pack I own re-lists
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="preview-partial" checked="indeterminate" />
            <FieldLabel htmlFor="preview-partial" className="font-normal">
              Select all 12 cards
            </FieldLabel>
          </Field>
        </div>
      ),
      source: `<Field orientation="horizontal">
  <Checkbox id="terms" defaultChecked />
  <FieldLabel htmlFor="terms" className="font-normal">
    I accept the seller terms
  </FieldLabel>
</Field>`,
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
        "The accessible name comes from FieldLabel via htmlFor, not from the control alone.",
      language: "tsx",
      code: `import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";

export function TermsField() {
  return (
    <Field orientation="horizontal">
      <Checkbox id="terms" />
      <FieldLabel htmlFor="terms" className="font-normal">
        I accept the seller terms
      </FieldLabel>
    </Field>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Checkbox used for filters, bulk card selection and terms acceptance. Selection is blue, always.",
      label: "Common compositions",
      render: (
        <div className="space-y-6">
          <Panel label="In a filter list">
            <FieldSet className="max-w-sm">
              <FieldLegend variant="label">Availability</FieldLegend>
              <FieldGroup>
                {[
                  ["Available now", "184 packs", true],
                  ["Limited edition", "12 packs", true],
                  ["Coming soon", "6 packs", false],
                  ["Sold out", "41 packs", false],
                ].map(([label, count, checked]) => (
                  <Field key={label as string} orientation="horizontal">
                    <Checkbox id={`f-${label}`} defaultChecked={checked as boolean} />
                    <FieldLabel htmlFor={`f-${label}`} className="font-normal">
                      {label}
                    </FieldLabel>
                    <span className="type-number-sm ml-auto text-muted-foreground">
                      {count}
                    </span>
                  </Field>
                ))}
              </FieldGroup>
            </FieldSet>
          </Panel>

          <Panel label="Bulk selection header">
            <div className="max-w-lg space-y-px overflow-hidden rounded-lg border border-border">
              <div className="flex items-center gap-3 bg-muted px-4 py-3">
                <Checkbox checked="indeterminate" aria-label="Select all cards" />
                <span className="type-small text-foreground">3 of 12 cards selected</span>
                <span className="type-number-sm ml-auto text-value-ink">$2,481.00</span>
              </div>
              {["Voidwing Ascendant", "Emberlash Prime", "Tidecaller"].map((n) => (
                <div key={n} className="flex items-center gap-3 bg-action/12 px-4 py-3">
                  <Checkbox defaultChecked aria-label={n} />
                  <span className="type-small text-foreground">{n}</span>
                </div>
              ))}
              {["Stonewarden", "Glasswing Drift"].map((n) => (
                <div key={n} className="flex items-center gap-3 bg-background px-4 py-3">
                  <Checkbox aria-label={n} />
                  <span className="type-small text-muted-foreground">{n}</span>
                </div>
              ))}
            </div>
            <p className="type-small mt-5 text-muted-foreground">
              The indeterminate state is what makes a bulk header honest — it says
              &ldquo;some&rdquo; rather than lying with checked or unchecked. Selected rows
              also take the blue tint, so selection reads without inspecting the box.
            </p>
          </Panel>
        </div>
      ),
      source: `<FieldSet>
  <FieldLegend variant="label">Availability</FieldLegend>
  <FieldGroup>
    <Field orientation="horizontal">
      <Checkbox id="available" defaultChecked />
      <FieldLabel htmlFor="available" className="font-normal">Available now</FieldLabel>
    </Field>
  </FieldGroup>
</FieldSet>

<Checkbox checked="indeterminate" aria-label="Select all cards" />`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Checkbox forwards every prop to Radix's CheckboxPrimitive.Root beyond the className merge and the squash-on-toggle ref.",
      blocks: [
        {
          label: "Checkbox",
          body: (
            <Meta
              items={[
                {
                  k: "checked",
                  v: "boolean | \"indeterminate\". Controlled. \"indeterminate\" is a real third state, not a style — use it for partial bulk selection.",
                },
                {
                  k: "defaultChecked",
                  v: "boolean | \"indeterminate\". Uncontrolled initial value.",
                },
                {
                  k: "onCheckedChange",
                  v: "(checked: boolean | \"indeterminate\") => void.",
                },
                { k: "disabled", v: "boolean, native Radix prop." },
                { k: "required", v: "boolean, native Radix prop." },
                { k: "name", v: "string — for a bubbled native <input> inside a <form>." },
                { k: "value", v: "string | number | readonly string[] — the value submitted with name." },
                {
                  k: "...props",
                  v: "Every other attribute Radix's underlying <button> accepts (onClick, aria-*, etc.), forwarded directly.",
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
        "checked is a value, not an interaction state — it is shown alongside the interaction states below because both compose on the same control.",
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="rest / unchecked">
                <Checkbox aria-label="Unchecked" />
              </StateCell>
              <StateCell label="checked">
                <Checkbox defaultChecked aria-label="Checked" />
              </StateCell>
              <StateCell label="indeterminate" note="Partial bulk selection">
                <Checkbox checked="indeterminate" aria-label="Indeterminate" />
              </StateCell>
              <StateCell label="focus-visible" note="Tab to it">
                <Checkbox className="border-ring ring-3 ring-ring/50" aria-label="Focus" />
              </StateCell>
              <StateCell label="disabled">
                <Checkbox disabled aria-label="Disabled" />
              </StateCell>
              <StateCell label="disabled checked">
                <Checkbox disabled defaultChecked aria-label="Disabled checked" />
              </StateCell>
              <StateCell label="error" note="aria-invalid">
                <Checkbox aria-invalid aria-label="Error" />
              </StateCell>
              <StateCell label="error checked">
                <Checkbox aria-invalid defaultChecked aria-label="Error checked" />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A rows">
              <p>
                <strong>pressed</strong> is N/A: toggling squashes the box via
                useReplayOnStateChange on every change, but there is no held-down
                visual distinct from that transition — press and release collapse
                into the same checked-change animation a native checkbox already has.
              </p>
              <p className="mt-2">
                <strong>loading</strong> and <strong>success</strong> are N/A: toggling
                is synchronous and has no completion of its own to draw — an
                async consequence of the toggle (a saved preference, a submitted form)
                is owned by whatever the change caused, not by the control.
              </p>
              <p className="mt-2">
                <strong>empty</strong> is N/A for the same reason as any control: a
                Checkbox always renders one of its three checked values, never nothing.
              </p>
            </Note>
          ),
        },
        {
          label: "The error a real form reaches",
          body: (
            <Panel>
              <Field orientation="horizontal" data-invalid="true" className="max-w-lg">
                <Checkbox id="terms-err" aria-invalid aria-describedby="terms-err-msg" />
                <FieldContent>
                  <FieldLabel htmlFor="terms-err" className="font-normal">
                    I accept the seller terms
                  </FieldLabel>
                  <FieldError id="terms-err-msg">
                    Accept the terms before withdrawing.
                  </FieldError>
                </FieldContent>
              </Field>
              <p className="type-small mt-5 text-muted-foreground">
                The box turns red, and the sentence says what to do about it. A red box
                on its own is one signal, and RULES §7 asks for two.
              </p>
            </Panel>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "Checkbox is a Radix CheckboxPrimitive.Root rendered as a <button>, so role and checked state are carried by the primitive rather than reimplemented.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: "checkbox (via Radix). aria-checked reflects true, false or \"mixed\" for the indeterminate state.",
                },
                {
                  k: "Accessible name",
                  v: "None by default — Checkbox renders no visible text. Pair it with FieldLabel via htmlFor (see Usage), or supply aria-label directly for a bare control such as a row-select checkbox.",
                },
                {
                  k: "State announcements",
                  v: "aria-invalid is exposed for a checkbox acting inside form validation; pair it with a written FieldError, not the red ring alone.",
                },
                {
                  k: "Focus order",
                  v: "Tab order follows document order. A disabled checkbox is removed from the tab sequence.",
                },
                {
                  k: "Target size",
                  v: "Drawn at 20px, but the hit area is extended with after:-inset-x-3 after:-inset-y-2, reaching the 44px floor (--size-target-min) without changing the visual box.",
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
                { k: "Tab / Shift+Tab", v: "Moves focus to and from the checkbox in document order." },
                { k: "Space", v: "Toggles checked. From indeterminate, Space sets it to checked, matching native <input type=\"checkbox\">." },
                { k: "During disabled", v: "Removed from the tab sequence; Space has no effect." },
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
