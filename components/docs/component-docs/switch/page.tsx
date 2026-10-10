import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Panel, Row, StateCell, StateGrid } from "@/components/ds/kit";

import { BetaFeaturesSpecimen } from "./switch-beta-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "switch",
  omitted: {
    responsive:
      "Both sizes in switch.tsx are fixed pixel dimensions (44×24 default, 36×20 sm) with no breakpoint variant — the same track and thumb render at 375px and 1920px. A caller choosing sm over default is a size decision made once in code, not a runtime response to viewport.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Only for a setting that takes effect the moment it is flipped — no Save button anywhere in sight. Flip it on and a real panel appears beneath it; flip it off and the panel is gone.",
      label: "Beta features",
      render: <BetaFeaturesSpecimen />,
      source: `"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";

export function BetaFeaturesSpecimen() {
  const [beta, setBeta] = useState(false);

  return (
    <div>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="beta">Beta features</FieldLabel>
        <FieldDescription>Turn on work in progress. Some of it will break.</FieldDescription>
        <Switch id="beta" checked={beta} onCheckedChange={setBeta} />
      </Field>
      {beta && (
        <div>
          <Icon icon={FlaskConical} size="sm" tone="action" />
          <p>Live pull odds preview is now visible on every pack page.</p>
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
      description: "Always pair a Switch with a FieldLabel — a bare switch announces no name.",
      language: "tsx",
      code: `import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

export function BetaToggle() {
  return (
    <Field orientation="horizontal">
      <FieldLabel htmlFor="beta">Beta features</FieldLabel>
      <Switch id="beta" />
    </Field>
  );
}`,
    },
    {
      kind: "showcase",
      id: "sizes",
      title: "Sizes",
      description: "size=\"sm\" (36×20 track, 16px thumb) beside the default (44×24 track, 20px thumb).",
      label: "Sizes",
      render: (
        <Row align="end">
          <div className="text-center">
            <Switch size="sm" defaultChecked aria-label="Small, on" />
            <p className="type-small mt-3 text-muted-foreground">sm</p>
          </div>
          <div className="text-center">
            <Switch defaultChecked aria-label="Default, on" />
            <p className="type-small mt-3 text-muted-foreground">default</p>
          </div>
        </Row>
      ),
      source: `<Switch size="sm" defaultChecked aria-label="Small, on" />
<Switch defaultChecked aria-label="Default, on" />`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description: "A settings list — every row applies immediately, with no Save button anywhere on the screen.",
      label: "Notification preferences",
      render: (
        <Panel>
          <FieldGroup className="max-w-lg">
            {[
              ["Rare pull alerts", "Notify me when a legendary or better is pulled from a pack I follow.", true],
              ["Weekly leaderboard", "A summary of where I placed and what I earned.", true],
              ["Marketing email", "New pack drops and promotions.", false],
              ["Reduced motion", "Skip the pack-opening animation entirely.", false],
            ].map(([title, desc, on]) => (
              <Field key={title as string} orientation="horizontal">
                <span className="min-w-0 flex-1">
                  <FieldLabel htmlFor={`sw-${title}`}>{title}</FieldLabel>
                  <FieldDescription>{desc}</FieldDescription>
                </span>
                <Switch id={`sw-${title}`} defaultChecked={on as boolean} />
              </Field>
            ))}
          </FieldGroup>
        </Panel>
      ),
      source: `<FieldGroup>
  <Field orientation="horizontal">
    <FieldLabel htmlFor="rare-pulls">Rare pull alerts</FieldLabel>
    <FieldDescription>
      Notify me when a legendary or better is pulled from a pack I follow.
    </FieldDescription>
    <Switch id="rare-pulls" defaultChecked />
  </Field>
</FieldGroup>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Switch wraps Radix's SwitchPrimitive.Root and adds one prop of its own — size — that Radix does not define.",
      blocks: [
        {
          label: "Switch",
          body: (
            <Meta
              items={[
                {
                  k: "size",
                  v: "\"sm\" | \"default\". Not a Radix prop — added by this wrapper, read via a data-size attribute the track and thumb key their dimensions off. Default: \"default\" (44×24 track, 20px thumb). \"sm\" is 36×20 with a 16px thumb.",
                },
                { k: "checked", v: "boolean. Controlled." },
                { k: "defaultChecked", v: "boolean. Uncontrolled initial value." },
                { k: "onCheckedChange", v: "(checked: boolean) => void." },
                { k: "disabled", v: "boolean, native Radix prop." },
                { k: "required", v: "boolean, native Radix prop." },
                { k: "name", v: "string — for a bubbled native <input> inside a <form>." },
                { k: "value", v: "string | number | readonly string[] — the value submitted with name." },
                {
                  k: "...props",
                  v: "Every other attribute Radix's underlying <button> accepts (id, aria-*, etc.), forwarded directly.",
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
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="rest / off">
                <Switch aria-label="Off" />
              </StateCell>
              <StateCell label="on">
                <Switch defaultChecked aria-label="On" />
              </StateCell>
              <StateCell label="focus-visible" note="Tab to it">
                <Switch className="border-ring ring-3 ring-ring/50" aria-label="Focus" />
              </StateCell>
              <StateCell label="disabled off">
                <Switch disabled aria-label="Disabled off" />
              </StateCell>
              <StateCell label="disabled on">
                <Switch disabled defaultChecked aria-label="Disabled on" />
              </StateCell>
              <StateCell label="error" note="aria-invalid">
                <Switch aria-invalid aria-label="Error" />
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
        "Switch is a Radix SwitchPrimitive.Root rendered as a <button>, so role and checked state are carried by the primitive.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "switch (via Radix), with aria-checked reflecting on/off." },
                {
                  k: "Accessible name",
                  v: "None by default. Always pair a Switch with a FieldLabel via htmlFor (see Usage) — a bare switch announces no name.",
                },
                {
                  k: "State announcements",
                  v: "aria-invalid is exposed for a switch acting inside form validation.",
                },
                {
                  k: "Target size",
                  v: "The default track is 44×24 with a generous negative-inset hit area (after:-inset-x-3 after:-inset-y-2), clearing --size-target-min (44px). size=\"sm\" (36×20) sits under that floor and is for dense settings rows only, matching the xs/sm Button guidance in RULES §7 — never the only control on a screen.",
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
                { k: "Tab / Shift+Tab", v: "Moves focus to and from the switch in document order." },
                { k: "Space", v: "Toggles checked (native Radix button behaviour)." },
                { k: "Enter", v: "Toggles checked (native Radix button behaviour)." },
                { k: "During disabled", v: "Removed from the tab sequence; Space and Enter have no effect." },
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
