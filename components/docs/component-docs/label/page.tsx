import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Row, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "label",
  omitted: {
    responsive: "Label is inline text with no width, breakpoint or container query of its own — it wraps and sizes exactly the way any flex row of text-sm text does, so there is nothing about it that reflows, zooms or mirrors differently from the container it sits in.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A Radix LabelPrimitive.Root wired to a native input via htmlFor — clicking the text focuses the field, exactly like a native <label>.",
      render: (
        <div className="w-full max-w-xs space-y-6">
          <div className="space-y-2">
            <Label htmlFor="preview-username">Username</Label>
            <Input id="preview-username" placeholder="voidwing" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preview-display">Display name</Label>
            <Input id="preview-display" defaultValue="Voidwing" />
          </div>
        </div>
      ),
      source: `<Label htmlFor="username">Username</Label>
<Input id="username" placeholder="voidwing" />`,
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
        "Most product code reaches for FieldLabel (from field), which renders this component with the group-aware styling a Field needs. Use Label directly only outside of a Field — a bare form control with no other furniture around it.",
      language: "tsx",
      code: `import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function UsernameField() {
  return (
    <div className="space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input id="username" placeholder="voidwing" />
    </div>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Label paired with a text field (the direct case) and Label rendered as FieldLabel inside Field, the composition every other input page on this system actually uses.",
      label: "Bare Label and FieldLabel inside Field",
      render: (
        <div className="max-w-sm space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ex-username">Username</Label>
            <Input id="ex-username" placeholder="voidwing" />
          </div>
          <Field orientation="horizontal">
            <Checkbox id="ex-terms" defaultChecked />
            <FieldLabel htmlFor="ex-terms" className="font-normal">
              I accept the seller terms
            </FieldLabel>
          </Field>
        </div>
      ),
      source: `<Label htmlFor="username">Username</Label>
<Input id="username" placeholder="voidwing" />

<Field orientation="horizontal">
  <Checkbox id="terms" defaultChecked />
  <FieldLabel htmlFor="terms" className="font-normal">
    I accept the seller terms
  </FieldLabel>
</Field>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Label forwards every prop to Radix's LabelPrimitive.Root beyond the className merge.",
      blocks: [
        {
          label: "Label",
          body: (
            <Meta
              items={[
                { k: "htmlFor", v: "string. Associates the label with a control by id, the same as a native <label for>." },
                { k: "className", v: "Merged onto the root. Carries group-data-[disabled=true]: and peer-disabled: variants so a label dims automatically when the control it names is disabled." },
                { k: "...props", v: "Every other attribute Radix's LabelPrimitive.Root accepts, forwarded directly." },
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
        "Label has no interaction of its own — clicking or tabbing targets the control it names, not the label. Its only state is inherited: dimmed when that control is disabled.",
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="rest">
                <Row>
                  <Label htmlFor="st-1">Username</Label>
                </Row>
              </StateCell>
              <StateCell label="disabled" note="Via peer-disabled / group-data-disabled">
                <div className="flex items-center gap-2 group" data-disabled="true">
                  <Checkbox id="st-disabled" disabled />
                  <Label htmlFor="st-disabled">Disabled option</Label>
                </div>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A rows">
              <p>
                Label is inert text: it carries no pointer, focus, press, async or
                validation state of its own. <strong>hover</strong>,{" "}
                <strong>focus-visible</strong>, <strong>pressed</strong>,{" "}
                <strong>loading</strong>, <strong>success</strong>, <strong>error</strong>{" "}
                and <strong>empty</strong> are all N/A for that reason — every one of
                those states belongs to the control the label names (see Input, Checkbox
                and Textarea&rsquo;s own States sections), and clicking the label text
                activates that control rather than the label itself.
              </p>
              <p className="mt-2">
                <strong>disabled</strong> is the one state Label does express, and only
                indirectly: <code>peer-disabled:</code> dims it when placed after a
                peer-marked disabled sibling, and <code>group-data-[disabled=true]:</code>{" "}
                dims it when an ancestor carries <code>data-disabled=&quot;true&quot;</code> and
                the group class — Field applies the latter automatically for FieldLabel.
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
        "Label association is what turns a bare input into an accessible form field — everything here is native <label> behaviour, carried through Radix's primitive rather than reimplemented.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "No implicit ARIA role of its own; it renders a real <label> element, so assistive technology treats it exactly as a native label." },
                {
                  k: "Association",
                  v: "htmlFor must match the id of the control it names. Without a matching id, the label is visually present but not programmatically associated, and the control announces as unnamed.",
                },
                {
                  k: "Click-to-focus",
                  v: "Clicking the label text moves focus to (and, for a checkbox or radio, toggles) the associated control — native <label> behaviour, unchanged by this wrapper.",
                },
                {
                  k: "Disabled inheritance",
                  v: "peer-disabled: and group-data-[disabled=true]: only change the VISUAL opacity; they do not remove the label from the accessibility tree. The disabled state itself must still live on the control (Input's disabled prop, Checkbox's disabled prop), which is what assistive technology actually reads.",
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
                { k: "Tab / Shift+Tab", v: "Label itself is never a tab stop — focus moves to the control it names, in that control's own position in document order." },
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
