import { Code, Note } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

import { meta } from "./meta";

function SelectionRows() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <Field orientation="horizontal">
        <Checkbox id="sc-digest" defaultChecked />
        <FieldContent>
          <FieldLabel htmlFor="sc-digest">
            <FieldTitle>Weekly digest</FieldTitle>
          </FieldLabel>
          <FieldDescription>
            One email each Monday summarising the week. Nothing else.
          </FieldDescription>
        </FieldContent>
      </Field>

      <Field orientation="horizontal" className="group/beta">
        <Switch id="sc-beta" />
        <FieldContent>
          <FieldLabel htmlFor="sc-beta">
            <FieldTitle>Beta features</FieldTitle>
          </FieldLabel>
          <FieldDescription>
            <span className="group-has-data-[state=checked]/beta:hidden">
              Turn on work in progress. Some of it will break.
            </span>
            <span className="hidden group-has-data-[state=checked]/beta:inline">
              Beta features are on — expect rough edges.
            </span>
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  );
}

export const spec: ComponentDocSpec = {
  name: "selection-control",
  omitted: {
    usage: "There is no separate minimal call to show — composing Field with Checkbox, Radio or Switch already IS the usage, and the Preview section's source is that exact snippet. A Usage section here would repeat it under a second heading rather than say anything new.",
    api: "SelectionControl exports nothing of its own — no component, no props. The real API surface is Field's (FieldContent, FieldLabel, FieldTitle, FieldDescription) plus whichever control is composed in, and each is tabled on its own page. Inventing a props list for a name that has no implementation would be worse than pointing at the real ones.",
    states: "The row has no interaction state independent of the control it wraps — a checked/unchecked Checkbox or an on/off Switch carries its own full state model, documented on that component's own page. Duplicating it here would drift the moment one page's copy was updated and the other's was not.",
    keyboard: "Keyboard behaviour belongs entirely to the control inside the row (Checkbox, Radio or Switch) — Field and its label add no key handling of their own beyond the native label-click-forwards-to-control association covered in Accessibility above. See the control's own page for its key table.",
    responsive: "Field's horizontal orientation here is a fixed two-column row at every width this page's Preview renders — there is no breakpoint in Field or in this composition that changes that layout. A caller who needs the row to stack on narrow screens does so with the same className lever every other flex layout in this system uses, not through something SelectionControl configures.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A checkbox row and a switch row, each built from Field and the control itself. Flip Beta features — the description line underneath it changes with the switch, driven by group-has-data-[state=checked] rather than script, since the row is otherwise plain server-rendered data.",
      label: "Selection rows",
      render: <SelectionRows />,
      source: `<Field orientation="horizontal" className="group/beta">
  <Switch id="beta" />
  <FieldContent>
    <FieldLabel htmlFor="beta">
      <FieldTitle>Beta features</FieldTitle>
    </FieldLabel>
    <FieldDescription>
      <span className="group-has-data-[state=checked]/beta:hidden">
        Turn on work in progress. Some of it will break.
      </span>
      <span className="hidden group-has-data-[state=checked]/beta:inline">
        Beta features are on — expect rough edges.
      </span>
    </FieldDescription>
  </FieldContent>
</Field>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <Note>
          Install the pieces you actually use: <Code>@elattar/field</Code> plus{" "}
          <Code>@elattar/checkbox</Code>, <Code>@elattar/radio</Code> or{" "}
          <Code>@elattar/switch</Code>. There is no <Code>selection-control</Code>{" "}
          item to add, and that is deliberate rather than an omission.
        </Note>
      ),
    },
    {
      kind: "disclosure",
      id: "why",
      title: "Why there is no component here",
      blocks: [
        {
          body: (
            <div className="space-y-4">
              <p className="type-body text-muted-foreground">
                Flutter&rsquo;s <Code>SelectionControl</Code> exists to stop three
                controls each inventing their own row: it owns the label, the
                description, the error text, the relationships between them, and
                the minimum target size.
              </p>
              <p className="type-body text-muted-foreground">
                On the web that owner already exists and is called{" "}
                <Code>Field</Code>. It ships <Code>FieldLabel</Code>,{" "}
                <Code>FieldTitle</Code>, <Code>FieldDescription</Code>,{" "}
                <Code>FieldError</Code>, <Code>FieldSet</Code>,{" "}
                <Code>FieldLegend</Code> and <Code>FieldGroup</Code>, and it is
                what every other form control in this system already composes
                with. <Code>Checkbox</Code>, <Code>Radio</Code> and{" "}
                <Code>Switch</Code> render the control and nothing else — that is
                why each is under eighty lines.
              </p>
              <p className="type-body text-muted-foreground">
                Adding a <Code>SelectionControl</Code> would give the system two
                ways to build a selection row, and the second one would be the
                only one that did not work with the rest of the form stack. The
                name is kept here so the shared capability stays findable; the
                implementation is the composition above.
              </p>
            </div>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      blocks: [
        {
          body: (
            <ul className="type-body list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                <Code>FieldLabel</Code> carries <Code>htmlFor</Code>, so clicking
                the label text activates the control and a screen reader reads the
                two together.
              </li>
              <li>
                <Code>FieldDescription</Code> is associated through{" "}
                <Code>aria-describedby</Code> when the field is wired by{" "}
                <Code>Form</Code>, so the explanation is announced rather than
                merely visible.
              </li>
              <li>
                The control itself, not the row, owns the interactive target. The
                row is a label and a description around it.
              </li>
              <li>
                Grouped rows belong in a <Code>FieldSet</Code> with a{" "}
                <Code>FieldLegend</Code>, which is what names the group.
              </li>
            </ul>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        {
          body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} />,
        },
      ],
    },
  ],
};
