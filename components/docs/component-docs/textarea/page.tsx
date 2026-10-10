/**
 * Authored documentation page for `textarea`.
 *
 * Replaces the generated baseline. Migrated from the old `base/inputs`
 * category page (`app/design-system/components/base/inputs/page.tsx`, since deleted), which
 * held every text-entry control's real documentation on one page. Every
 * specimen below renders the real `Textarea` from `components/ui/textarea.tsx`
 * — nothing here is a styled div. Field/FieldLabel/FieldDescription compose
 * around it for realistic context but are documented on their own `field`
 * page.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "textarea",
  omitted: {
    responsive:
      "Textarea is w-full with no breakpoint rule in textarea.tsx — it fills whatever container width it is given and grows vertically via field-sizing-content from a min-h-20 floor, at every viewport. There is no separate mobile layout: the same element, the same growth behaviour, only the surrounding Field width changes.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A single multi-line field. It grows with its content via field-sizing-content rather than scrolling internally, down to a minimum height of 80px — this one already holds three lines, taller than its own floor, to show the grow in the resting screenshot rather than only on typing.",
      render: (
        <div className="max-w-sm">
          <Field>
            <FieldLabel htmlFor="textarea-preview">Shipping note</FieldLabel>
            <Textarea
              id="textarea-preview"
              defaultValue={"Leave at the front desk.\nRing the bell twice — the dog barks at one.\nText on arrival if no one answers."}
            />
            <FieldDescription>Shown to the courier, not the seller.</FieldDescription>
          </Field>
        </div>
      ),
      source: `<Field>
  <FieldLabel htmlFor="note">Shipping note</FieldLabel>
  <Textarea id="note" defaultValue={"Leave at the front desk.\\nRing the bell twice — the dog barks at one.\\nText on arrival if no one answers."} />
  <FieldDescription>Shown to the courier, not the seller.</FieldDescription>
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
      description: "The minimal import and call — a labelled field.",
      language: "tsx",
      code: `import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export function ShippingNoteField() {
  return (
    <Field>
      <FieldLabel htmlFor="note">Shipping note</FieldLabel>
      <Textarea id="note" placeholder="Anything the packing team should know" />
    </Field>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Textarea composed with Field for the label/description wiring, and paired with FieldError for the invalid case — the same wiring Input uses, since both share Field's plumbing.",
      label: "Common compositions",
      render: (
        <FieldGroup className="max-w-lg">
          <Field>
            <FieldLabel htmlFor="ex-ta">Shipping note</FieldLabel>
            <Textarea id="ex-ta" placeholder="Anything the packing team should know" />
            <FieldDescription>Grows as you type. Minimum height is 80px.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="ex-ta-err">With an error</FieldLabel>
            <Textarea id="ex-ta-err" aria-invalid defaultValue="Too short" aria-describedby="ex-ta-err-msg" />
            <FieldError id="ex-ta-err-msg">Please provide at least 20 characters.</FieldError>
          </Field>
        </FieldGroup>
      ),
      source: `<Field>
  <FieldLabel htmlFor="note">Shipping note</FieldLabel>
  <Textarea id="note" placeholder="Anything the packing team should know" />
  <FieldDescription>Grows as you type. Minimum height is 80px.</FieldDescription>
</Field>

<Field>
  <FieldLabel htmlFor="note-err">With an error</FieldLabel>
  <Textarea id="note-err" aria-invalid defaultValue="Too short" aria-describedby="note-err-msg" />
  <FieldError id="note-err-msg">Please provide at least 20 characters.</FieldError>
</Field>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Textarea",
          body: (
            <Meta
              items={[
                {
                  k: "className",
                  v: "Merged onto the root via cn(); every token class below can be overridden per instance.",
                },
                {
                  k: "disabled",
                  v: "Native boolean. Applies cursor-not-allowed and 50% opacity.",
                },
                {
                  k: "aria-invalid",
                  v: "Native ARIA boolean. Switches the border to destructive and adds a destructive focus ring — the single flag the error appearance is keyed on, same as Input.",
                },
                {
                  k: "...props",
                  v: "Every other native <textarea> attribute (value, onChange, placeholder, rows, readOnly, aria-*, etc.), forwarded directly — Textarea adds no props of its own beyond styling.",
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
        "The distinct states Textarea actually renders. Focus the live field to see its ring; aria-invalid and disabled are visible without interaction. Hover has no separate visual treatment.",
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="rest">
                <Textarea placeholder="Shipping note" aria-label="Rest" />
              </StateCell>
              <StateCell label="focus-visible" note="Click or tab into it">
                <Textarea placeholder="Shipping note" aria-label="Focus" />
              </StateCell>
              <StateCell label="filled">
                <Textarea defaultValue="Leave at the front desk." aria-label="Filled" />
              </StateCell>
              <StateCell label="error" note="aria-invalid">
                <Textarea defaultValue="Too short" aria-invalid aria-label="Error" />
              </StateCell>
              <StateCell label="disabled" note="50% opacity, exempt from contrast">
                <Textarea placeholder="Unavailable" disabled aria-label="Disabled" />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="States the textarea does not own">
              <p>
                <strong>pressed</strong> is N/A for the same reason as Input: clicking
                produces focus, which is already its own row, and there is no separate
                momentary-press treatment.
              </p>
              <p className="mt-2">
                <strong>loading</strong> is N/A: typing is synchronous and Textarea has
                no async effect of its own to inject.
              </p>
              <p className="mt-2">
                <strong>success</strong> is N/A: unlike a single-value field such as an
                email or username Input, free-form prose has no single condition that
                reads as &ldquo;valid&rdquo; worth a dedicated affordance — only the
                error case is drawn.
              </p>
            </Note>
          ),
        },
        {
          label: "Validation message",
          body: (
            <Panel label="Error paired with FieldError" className="max-w-sm">
              <Field>
                <FieldLabel htmlFor="st-ta">Shipping note</FieldLabel>
                <Textarea
                  id="st-ta"
                  defaultValue="Too short"
                  aria-invalid
                  aria-describedby="st-ta-err"
                />
                <FieldError id="st-ta-err">
                  Please provide at least 20 characters.
                </FieldError>
              </Field>
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
        "Textarea is a real <textarea>, so typing, selection, clipboard and platform spellcheck all come from the browser rather than being reimplemented.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "textbox, multiline (native, from the textarea element)." },
                {
                  k: "Accessible name",
                  v: "Comes from an associated <label htmlFor> (via FieldLabel) or an explicit aria-label / aria-labelledby. Textarea renders no label itself.",
                },
                {
                  k: "Error announcement",
                  v: "aria-invalid alone changes only the visual treatment. Pair it with aria-describedby pointing at a FieldError (role=\"alert\") so the message itself is announced.",
                },
                {
                  k: "Placeholder",
                  v: "Never a substitute for a label — it is not exposed as the accessible name by most screen readers once a value is entered, and it disappears from view while typing.",
                },
                {
                  k: "Target size",
                  v: "min-h-20 sets an 80px floor, comfortably above --size-target-min (44px) — a multi-line field is never the tight case Input's 40px floor has to justify.",
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
                { k: "Tab / Shift+Tab", v: "Moves focus to and from the field in document order." },
                { k: "Enter", v: "Inserts a newline rather than submitting a form, unlike a single-line Input." },
                {
                  k: "Ctrl/Cmd+A, arrows, Home/End",
                  v: "Native text-selection and caret-movement behaviour, unchanged.",
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
