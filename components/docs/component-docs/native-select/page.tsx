/**
 * Authored documentation page for `native-select`.
 *
 * Replaces the generated baseline. Migrated from the old `base/selects`
 * category page. Every specimen renders the real `NativeSelect` from
 * `components/ui/native-select.tsx` — a styled wrapper around the browser's
 * own <select>, not a reimplementation of one.
 */

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "native-select",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Renders the operating system's own picker rather than a custom listbox.",
      render: (
        <div className="w-full max-w-xs space-y-2">
          <p className="type-small text-muted-foreground">Shipping country</p>
          <NativeSelect aria-label="Country" defaultValue="us">
            <NativeSelectOption value="us">United States</NativeSelectOption>
            <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
            <NativeSelectOption value="ca">Canada</NativeSelectOption>
          </NativeSelect>
        </div>
      ),
      source: `<NativeSelect aria-label="Country" defaultValue="us">
  <NativeSelectOption value="us">United States</NativeSelectOption>
  <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
</NativeSelect>`,
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
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export function CountryField() {
  return (
    <Field>
      <FieldLabel htmlFor="country">Country</FieldLabel>
      <NativeSelect id="country" defaultValue="us">
        <NativeSelectOption value="us">United States</NativeSelectOption>
        <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
      </NativeSelect>
    </Field>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Used in shipping and account settings — long, boring lists like country, region and timezone where the OS picker beats anything custom, especially on mobile.",
      label: "Common compositions",
      render: (
        <Panel label="Shipping address">
          <FieldGroup className="max-w-sm">
            <Field>
              <FieldLabel htmlFor="ex-country">Country</FieldLabel>
              <NativeSelect id="ex-country" defaultValue="us">
                <NativeSelectOption value="us">United States</NativeSelectOption>
                <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
                <NativeSelectOption value="ca">Canada</NativeSelectOption>
                <NativeSelectOption value="de">Germany</NativeSelectOption>
                <NativeSelectOption value="jp">Japan</NativeSelectOption>
              </NativeSelect>
              <FieldDescription>Used in shipping and account settings.</FieldDescription>
            </Field>
          </FieldGroup>
        </Panel>
      ),
      source: `<Field>
  <FieldLabel htmlFor="country">Country</FieldLabel>
  <NativeSelect id="country" defaultValue="us">
    <NativeSelectOption value="us">United States</NativeSelectOption>
  </NativeSelect>
</Field>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "NativeSelect wraps a real <select> in a positioning div for its own chevron icon; it does not intercept or reimplement any native behaviour.",
      blocks: [
        {
          label: "NativeSelect",
          body: (
            <Meta
              items={[
                { k: "size", v: '"sm" | "default" (default). Sets the min-height rung, matching Select and Input.' },
                { k: "disabled", v: "Native boolean. The wrapper drops to 50% opacity via has-[select:disabled]." },
                { k: "aria-invalid", v: "Native ARIA boolean. Switches the border to destructive and adds a destructive focus ring." },
                { k: "...props", v: "Every other native <select> attribute (value, onChange, name, required, multiple, etc.), forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "NativeSelectOption / NativeSelectOptGroup",
          body: (
            <Meta
              items={[
                { k: "NativeSelectOption", v: "A real <option>. Its background/text are set to the OS system keywords Canvas / CanvasText so it renders correctly in the browser's own popup, not the page's theme." },
                { k: "NativeSelectOptGroup", v: "A real <optgroup>, same system-keyword styling." },
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
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="rest">
                <NativeSelect aria-label="Rest" defaultValue="">
                  <NativeSelectOption value="" disabled hidden>
                    Choose a country
                  </NativeSelectOption>
                  <NativeSelectOption value="us">United States</NativeSelectOption>
                </NativeSelect>
              </StateCell>
              <StateCell label="filled">
                <NativeSelect aria-label="Filled" defaultValue="us">
                  <NativeSelectOption value="us">United States</NativeSelectOption>
                </NativeSelect>
              </StateCell>
              <StateCell label="focus-visible" note="Click or tab into it">
                <NativeSelect aria-label="Focus" defaultValue="us">
                  <NativeSelectOption value="us">United States</NativeSelectOption>
                </NativeSelect>
              </StateCell>
              <StateCell label="error" note="aria-invalid">
                <NativeSelect aria-invalid aria-label="Error" defaultValue="us">
                  <NativeSelectOption value="us">United States</NativeSelectOption>
                </NativeSelect>
              </StateCell>
              <StateCell label="disabled">
                <NativeSelect disabled aria-label="Disabled" defaultValue="us">
                  <NativeSelectOption value="us">United States</NativeSelectOption>
                </NativeSelect>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A rows">
              <p>
                <strong>pressed</strong>, <strong>loading</strong> and{" "}
                <strong>success</strong> are N/A for the same reasons as Select:
                the control opens the OS picker rather than drawing its own
                pressed state, and choosing an option is synchronous.
              </p>
              <p className="mt-2">
                <strong>empty</strong> is N/A: a native <Code>{"<select>"}</Code>{" "}
                always has a current option — there is no way to render it with
                nothing selected short of a hidden disabled placeholder option,
                shown in the rest row above.
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
        "NativeSelect defers entirely to the browser's own <select> — full native keyboard, screen reader and mobile-picker support with zero extra wiring, which is the reason it exists for long lists like country.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "combobox (native, from the select element)." },
                {
                  k: "Accessible name",
                  v: "Comes from an associated <label htmlFor> (via FieldLabel) or an explicit aria-label — NativeSelect renders no label itself.",
                },
                {
                  k: "Mobile", v: "Opens the OS's own picker sheet/wheel rather than an in-page popup — the reason this exists instead of Select for country, region and timezone.",
                },
                {
                  k: "Target size",
                  v: "Default min-h-10 (40px), sm rung min-h-8 (32px) — same ladder as Select and Input; both are exempt from --size-target-min for the same reason Input is: the target is the field's full width, not a fixed-size icon.",
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
      description: "Entirely native — nothing here is reimplemented.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Tab / Shift+Tab", v: "Moves focus to and from the field in document order." },
                { k: "Space / Enter / ArrowDown (desktop)", v: "Opens the native popup." },
                { k: "Typing a letter", v: "Jumps to the next option starting with that letter — native browser typeahead." },
                { k: "Escape", v: "Closes the popup without changing the value — native browser behaviour." },
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
        "The field is w-fit and the popup is the operating system's own — there is very little here for this layer to get wrong.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "The field",
                  v: "The wrapper is w-fit and the select itself min-h-10 (min-h-8 at size=\"sm\") w-full min-w-0, so it sizes to its own longest option text rather than a fixed width — it shrinks and grows with its container's font size and available space, with no breakpoint of its own.",
                },
                {
                  k: "The popup",
                  v: "Opened, the option list is the browser/OS-rendered native popup, not a component this system draws — its position, size and touch targets follow the platform's own responsive and accessibility rules rather than this library's, and doubling text zoom or switching to RTL is handled by the same native layer that handles it for every other <select> on the page.",
                },
                {
                  k: "Measured",
                  v: "No overflow of the trigger at 375, 768, 1440 or 1920, at 200% text zoom, or under RTL.",
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
