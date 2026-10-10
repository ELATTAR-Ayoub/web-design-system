import { Mail } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note, Panel, Row, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "field",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "The whole anatomy at once: a label, a control, and a description underneath. Field owns the spacing relationship between the three — nothing here relies on a card's padding or a distant grid gap.",
      render: (
        <div className="max-w-sm">
          <Field>
            <FieldLabel htmlFor="preview-email">Email</FieldLabel>
            <Input id="preview-email" type="email" placeholder="you@example.com" />
            <FieldDescription>Receipts and nothing else.</FieldDescription>
          </Field>
        </div>
      ),
      source: `<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" placeholder="you@example.com" />
  <FieldDescription>Receipts and nothing else.</FieldDescription>
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
        "The minimal import and call — a labelled field with helper text. This is the shape every control in Inputs and Selection composes around.",
      language: "tsx",
      code: `import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function EmailField() {
  return (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" type="email" placeholder="you@example.com" />
      <FieldDescription>Receipts and nothing else.</FieldDescription>
    </Field>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "orientation controls how the label and control sit relative to each other. vertical (the default) stacks them for a text field; horizontal sits a label beside a small control — a checkbox, a switch; responsive starts vertical and switches to horizontal once its FieldGroup container is wide enough. See Responsive below for what that switch is actually keyed on.",
      label: "orientation",
      render: (
        <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
          <Panel label="vertical (default)">
            <Field orientation="vertical">
              <FieldLabel htmlFor="var-vertical">Handle</FieldLabel>
              <Input id="var-vertical" placeholder="ayoub" />
            </Field>
          </Panel>
          <Panel label="horizontal">
            <Field orientation="horizontal">
              <Checkbox id="var-horizontal" defaultChecked />
              <FieldLabel htmlFor="var-horizontal" className="font-normal">
                I accept the seller terms
              </FieldLabel>
            </Field>
          </Panel>
        </div>
      ),
      source: `<Field orientation="vertical">
  <FieldLabel htmlFor="handle">Handle</FieldLabel>
  <Input id="handle" placeholder="ayoub" />
</Field>

<Field orientation="horizontal">
  <Checkbox id="terms" defaultChecked />
  <FieldLabel htmlFor="terms" className="font-normal">I accept the seller terms</FieldLabel>
</Field>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "FieldGroup composes several fields with consistent gaps; FieldSet + FieldLegend groups related fields under one legend (the correct native grouping for a control with no single labelable element, such as a checkbox group); FieldContent pairs a FieldTitle with a FieldDescription beside a control that is not plain text; FieldSeparator draws a labelled rule between groups.",
      label: "Composition",
      render: (
        <div className="space-y-6">
          <Panel label="FieldGroup — several fields, one rhythm">
            <FieldGroup className="max-w-sm">
              <Field>
                <FieldLabel htmlFor="ex-handle">Handle</FieldLabel>
                <Input id="ex-handle" placeholder="ayoub" />
              </Field>
              <Field>
                <FieldLabel htmlFor="ex-email">Email</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Icon icon={Mail} size="sm" tone="subtle" />
                  </InputGroupAddon>
                  <InputGroupInput id="ex-email" type="email" placeholder="you@example.com" />
                </InputGroup>
              </Field>
            </FieldGroup>
          </Panel>

          <Panel label="FieldSet + FieldLegend — a group with no single label target">
            <FieldSet className="max-w-sm">
              <FieldLegend variant="label">Notifications</FieldLegend>
              <FieldGroup>
                <Field orientation="horizontal">
                  <Switch id="ex-digest" defaultChecked />
                  <FieldLabel htmlFor="ex-digest" className="font-normal">
                    Weekly digest
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Switch id="ex-beta" />
                  <FieldLabel htmlFor="ex-beta" className="font-normal">
                    Beta features
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
          </Panel>

          <Panel label="FieldContent — a title and description beside a control">
            <div className="max-w-sm">
              <Field orientation="horizontal">
                <Checkbox id="ex-titled" defaultChecked />
                <FieldContent>
                  <FieldLabel htmlFor="ex-titled">
                    <FieldTitle>Weekly digest</FieldTitle>
                  </FieldLabel>
                  <FieldDescription>
                    One email each Monday summarising the week. Nothing else.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </div>
          </Panel>

          <Panel label="FieldSeparator — a labelled rule between groups">
            <div className="max-w-sm">
              <Field>
                <FieldLabel htmlFor="ex-card">Card number</FieldLabel>
                <Input id="ex-card" placeholder="4242 4242 4242 4242" />
              </Field>
              <FieldSeparator>Or</FieldSeparator>
              <Field>
                <FieldLabel htmlFor="ex-invite">Invite code</FieldLabel>
                <Input id="ex-invite" placeholder="ECLIPSE-2K4A" className="type-identifier" />
              </Field>
            </div>
          </Panel>
        </div>
      ),
      source: `<FieldSet>
  <FieldLegend variant="label">Notifications</FieldLegend>
  <FieldGroup>
    <Field orientation="horizontal">
      <Switch id="digest" defaultChecked />
      <FieldLabel htmlFor="digest" className="font-normal">Weekly digest</FieldLabel>
    </Field>
  </FieldGroup>
</FieldSet>

<Field orientation="horizontal">
  <Checkbox id="titled" defaultChecked />
  <FieldContent>
    <FieldLabel htmlFor="titled"><FieldTitle>Weekly digest</FieldTitle></FieldLabel>
    <FieldDescription>One email each Monday summarising the week.</FieldDescription>
  </FieldContent>
</Field>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Every part reads its parent's className merge via cn() and forwards every other native attribute — none of these add props beyond what is listed.",
      blocks: [
        {
          label: "Field",
          body: (
            <Meta
              items={[
                {
                  k: "orientation",
                  v: '"vertical" (default) | "horizontal" | "responsive". See Variants and Responsive.',
                },
                {
                  k: "data-invalid",
                  v: "boolean, read as a data attribute rather than a prop. When true, cascades text-destructive-ink onto Field's own text via group/field — pair it with a FieldError so the colour is not the only signal.",
                },
                {
                  k: "role",
                  v: 'Always "group" — set unconditionally, not derived from children.',
                },
              ]}
            />
          ),
        },
        {
          label: "FieldLabel",
          body: (
            <Meta
              items={[
                {
                  k: "(all props)",
                  v: "Every prop Label (Radix) accepts, including htmlFor. Renders visually disabled when an ancestor Field carries data-disabled=\"true\".",
                },
              ]}
            />
          ),
        },
        {
          label: "FieldTitle, FieldDescription",
          body: (
            <Meta
              items={[
                {
                  k: "FieldTitle",
                  v: "A <div>, not a <label> — used inside FieldLabel (see the FieldContent example above) so the clickable label wraps a title-and-description pair rather than title text alone.",
                },
                {
                  k: "FieldDescription",
                  v: "A <p>. Text-balances under a horizontal-orientation Field so a two-line description does not ladder unevenly beside a small control.",
                },
              ]}
            />
          ),
        },
        {
          label: "FieldError",
          body: (
            <Meta
              items={[
                {
                  k: "errors",
                  v: "Array<{ message?: string } | undefined>. Deduplicated by message; renders the single message as text, or a <ul> once more than one unique message remains. Matches react-hook-form's FieldErrors shape verbatim — this is the exact contract components/ui/form.tsx's FormError feeds it.",
                },
                {
                  k: "children",
                  v: "Overrides errors entirely when supplied — pass a literal message instead of an array for a field with no form binding.",
                },
                {
                  k: "(renders nothing)",
                  v: "When neither children nor a non-empty errors array is given. No empty role=\"alert\" div is ever left mounted.",
                },
              ]}
            />
          ),
        },
        {
          label: "FieldSet, FieldLegend, FieldGroup, FieldSeparator, FieldContent",
          body: (
            <Meta
              items={[
                { k: "FieldSet", v: "A <fieldset>. Tightens its own gap when it directly contains a checkbox or radio group." },
                {
                  k: "FieldLegend",
                  v: 'variant: "legend" (default, larger) | "label" (matches FieldLabel\'s size — used for a group standing in for a single field, as in the Examples above).',
                },
                { k: "FieldGroup", v: "A flex column with the system's field-to-field gap. @container-scoped for the responsive orientation to read." },
                { k: "FieldSeparator", v: "children renders a centred caption breaking the rule (e.g. \"Or\"); omitted, it is a plain divider." },
                { k: "FieldContent", v: "A flex column for a title/description pair sitting beside a control, inside FieldLabel or Field." },
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
        "Field itself has no interaction states — hover, focus and press belong to the control it wraps (documented on Input, Checkbox, Switch and so on). What Field owns is the error and disabled cascade, and FieldError's own single-versus-list rendering.",
      blocks: [
        {
          body: (
            <StateGrid cols={3}>
              <StateCell label="rest">
                <Field className="max-w-40">
                  <FieldLabel htmlFor="st-rest">Handle</FieldLabel>
                  <Input id="st-rest" placeholder="ayoub" />
                </Field>
              </StateCell>
              <StateCell label="data-invalid" note="text cascades to -ink red">
                <Field data-invalid="true" className="max-w-40">
                  <FieldLabel htmlFor="st-invalid">Handle</FieldLabel>
                  <Input id="st-invalid" aria-invalid defaultValue="a" />
                </Field>
              </StateCell>
              <StateCell label="disabled" note="via group-data-[disabled]">
                <Field data-disabled="true" className="max-w-40">
                  <FieldLabel htmlFor="st-disabled">Handle</FieldLabel>
                  <Input id="st-disabled" disabled placeholder="ayoub" />
                </Field>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          label: "FieldError — one message vs. several",
          body: (
            <Row align="start" className="gap-8">
              <Panel label="Single" className="max-w-xs">
                <FieldError errors={[{ message: "At least 10 characters." }]} />
              </Panel>
              <Panel label="Multiple — a <ul>, not a run-on sentence" className="max-w-xs">
                <FieldError
                  errors={[
                    { message: "At least 10 characters." },
                    { message: "One capital letter." },
                    { message: "One number." },
                  ]}
                />
              </Panel>
            </Row>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "Field is a semantic wrapper, not a control — its accessibility contribution is structural: the right element for the right relationship, so a screen reader announces grouping and errors the same way sighted layout implies them.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Field role",
                  v: 'role="group", unconditionally — groups a label, control and description as one unit even where no native element would.',
                },
                {
                  k: "Label association",
                  v: "FieldLabel renders a real <label>; pass htmlFor matching the control's id. A control with no single labelable target (RadioGroup, a checkbox group) is captioned with FieldSet + FieldLegend instead — see the Examples panel above and RULES' note that <label for> may only point at a labelable element.",
                },
                {
                  k: "FieldError announcement",
                  v: 'role="alert" on the rendered <div>, and it renders nothing when empty — so a field that has never been touched leaves no live region behind to announce silence.',
                },
                {
                  k: "aria-describedby",
                  v: "Not set by Field itself — it is the caller's job to point a control's aria-describedby at FieldDescription's and FieldError's ids (components/ui/form.tsx's FormControl does this automatically for a react-hook-form-bound field; a hand-wired Field needs it set explicitly).",
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
        "Field intercepts no keys of its own. Tab order and every keypress belong entirely to the control it wraps.",
      blocks: [
        {
          body: (
            <Note tone="action" title="N/A on Field">
              <p>
                Field renders no focusable element itself — FieldLabel is a{" "}
                <Code>&lt;label&gt;</Code>, which clicking (not tabbing to)
                forwards focus to its associated control. Keyboard behaviour
                is documented on each control&rsquo;s own page: Input, Checkbox,
                Radio, Switch and Select all carry their own Keyboard
                section.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "orientation=\"responsive\" is the one place Field's own layout changes across a viewport — but the switch is keyed on the FieldGroup container's width, not the page's.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              A <Code>responsive</Code> Field starts stacked (matching{" "}
              <Code>vertical</Code>) and switches to a horizontal row once its
              nearest <Code>FieldGroup</Code> ancestor is wide enough, using a{" "}
              <Code>@md/field-group</Code> container query rather than a{" "}
              <Code>md:</Code> viewport breakpoint. That distinction matters
              in practice: a responsive Field inside a narrow sidebar column
              stays vertical even on a wide desktop viewport, and one inside a
              wide two-column form area can go horizontal on a narrower
              screen than 768px would suggest. This is deliberately a
              different axis from RULES&rsquo; 768px / 1024px page breakpoints —
              the container is the field&rsquo;s own layout slot, which a page
              breakpoint cannot see.
            </p>
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
