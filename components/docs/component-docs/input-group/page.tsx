/**
 * Authored documentation page for `input-group`.
 *
 * Replaces the generated baseline. Migrated from the old `base/inputs`
 * category page (`app/design-system/components/base/inputs/page.tsx`, since deleted), which
 * used InputGroup throughout its "Input types" section for every leading
 * icon, addon, and trailing action. Every specimen below renders the real
 * InputGroup family from `components/ui/input-group.tsx` — nothing here is a
 * styled div standing in for a bordered control.
 */

import { AtSign, Percent, Ticket } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Meta, Note, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "input-group",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A bordered control that wraps InputGroupInput with a leading icon addon — the focus ring and invalid state live on the group, not on the inner field, so the whole shape reacts as one control.",
      render: (
        <div className="max-w-sm">
          <InputGroup>
            <InputGroupAddon>
              <Icon icon={AtSign} size="sm" tone="subtle" />
            </InputGroupAddon>
            <InputGroupInput type="email" placeholder="collector@pulls.xyz" aria-label="Email" />
          </InputGroup>
        </div>
      ),
      source: `<InputGroup>
  <InputGroupAddon>
    <Icon icon={AtSign} size="sm" tone="subtle" />
  </InputGroupAddon>
  <InputGroupInput type="email" placeholder="collector@pulls.xyz" aria-label="Email" />
</InputGroup>`,
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
      description: "The minimal import and call — a leading icon addon paired with a labelled field.",
      language: "tsx",
      code: `import { Field, FieldLabel } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { AtSign } from "lucide-react";

export function EmailField() {
  return (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <Icon icon={AtSign} size="sm" tone="subtle" />
        </InputGroupAddon>
        <InputGroupInput id="email" type="email" placeholder="collector@pulls.xyz" autoComplete="email" />
      </InputGroup>
    </Field>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Every addon position and content type this page's source used: a leading icon, a trailing unit label, a leading text addon (country code), a trailing icon, and a trailing button — plus InputGroupTextarea, the multi-line counterpart to InputGroupInput.",
      label: "Addon positions and contents",
      render: (
        <FieldGroup className="max-w-sm">
          <Field>
            <FieldLabel htmlFor="ex-qty">Quantity</FieldLabel>
            <InputGroup className="max-w-40">
              <InputGroupInput id="ex-qty" type="number" defaultValue={3} min={1} max={10} className="type-number-base" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>packs</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="ex-phone">Phone number</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText className="type-number-sm">+1</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput id="ex-phone" type="tel" placeholder="555 0134 908" className="type-number-base" />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="ex-referral">Referral percentage</FieldLabel>
            <InputGroup className="max-w-40">
              <InputGroupInput id="ex-referral" type="number" defaultValue={5} className="type-number-base" />
              <InputGroupAddon align="inline-end">
                <Icon icon={Percent} size="sm" tone="subtle" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="ex-invite">Invite code</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Icon icon={Ticket} size="sm" tone="subtle" />
              </InputGroupAddon>
              <InputGroupInput id="ex-invite" placeholder="ECLIPSE-2K4A" className="type-identifier" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant="ghost">Apply</InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="ex-ta">Shipping note</FieldLabel>
            <InputGroup>
              <InputGroupTextarea id="ex-ta" placeholder="Anything the packing team should know" />
            </InputGroup>
            <FieldDescription>InputGroupTextarea swaps the control; the group chrome is unchanged.</FieldDescription>
          </Field>
        </FieldGroup>
      ),
      source: `<InputGroup className="max-w-40">
  <InputGroupInput type="number" defaultValue={3} min={1} max={10} />
  <InputGroupAddon align="inline-end">
    <InputGroupText>packs</InputGroupText>
  </InputGroupAddon>
</InputGroup>

<InputGroup>
  <InputGroupAddon>
    <Icon icon={Ticket} size="sm" tone="subtle" />
  </InputGroupAddon>
  <InputGroupInput placeholder="ECLIPSE-2K4A" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton variant="ghost">Apply</InputGroupButton>
  </InputGroupAddon>
</InputGroup>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "InputGroup",
          body: (
            <Meta
              items={[
                { k: "role", v: "\"group\", fixed. Every InputGroupAddon inside also carries role=\"group\"." },
                { k: "className", v: "Merged onto the pill-shaped root; the shared focus ring and invalid ring live here, driven by has-[[data-slot=input-group-control]:focus-visible] and has-[[data-slot][aria-invalid=true]]." },
                { k: "...props", v: "Every other <div> attribute, forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "InputGroupAddon",
          body: (
            <Meta
              items={[
                { k: "align", v: "\"inline-start\" | \"inline-end\" | \"block-start\" | \"block-end\". Default \"inline-start\". block-start / block-end stack the group into a column, for a label-like addon above or below the control." },
                { k: "className", v: "Merged onto the addon root." },
                { k: "onClick", v: "Fixed: clicking the addon focuses the group's input, unless the click landed on a nested <button> — that is why InputGroupButton keeps its own click behaviour instead of triggering the addon's." },
              ]}
            />
          ),
        },
        {
          label: "InputGroupButton",
          body: (
            <Meta
              items={[
                { k: "size", v: "\"xs\" | \"sm\" | \"icon-xs\" | \"icon-sm\". Default \"xs\" — sized to sit inside the group's addon padding rather than Button's own size scale." },
                { k: "variant", v: "Any Button variant. Default \"ghost\"." },
                { k: "type", v: "Default \"button\" — set explicitly so a group inside a <form> never submits by accident." },
                { k: "...props", v: "Every Button prop except size, forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "InputGroupText",
          body: (
            <Meta
              items={[
                { k: "className", v: "Merged onto a plain <span> — use for static text or a unit label that is not interactive (\"USD\", \"packs\", \"+1\")." },
              ]}
            />
          ),
        },
        {
          label: "InputGroupInput / InputGroupTextarea",
          body: (
            <Meta
              items={[
                { k: "data-slot", v: "\"input-group-control\", fixed — this is the attribute the group's has-[...] selectors key focus and invalid styling on." },
                { k: "...props", v: "Every native <input> or <textarea> prop respectively (InputGroupInput wraps Input, InputGroupTextarea wraps Textarea), with the border, shadow and ring stripped so only the group chrome shows." },
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
        "State lives on the group, not the inner control — the whole pill takes the ring, so an addon icon and the text share one focus and one invalid signal.",
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="rest">
                <InputGroup className="max-w-full">
                  <InputGroupAddon>
                    <Icon icon={AtSign} size="sm" tone="subtle" />
                  </InputGroupAddon>
                  <InputGroupInput placeholder="collector@pulls.xyz" aria-label="Rest" />
                </InputGroup>
              </StateCell>
              <StateCell label="focus-visible" note="Click or tab into the field">
                <InputGroup className="max-w-full">
                  <InputGroupAddon>
                    <Icon icon={AtSign} size="sm" tone="subtle" />
                  </InputGroupAddon>
                  <InputGroupInput placeholder="collector@pulls.xyz" aria-label="Focus" />
                </InputGroup>
              </StateCell>
              <StateCell label="filled">
                <InputGroup className="max-w-full">
                  <InputGroupAddon>
                    <Icon icon={AtSign} size="sm" tone="subtle" />
                  </InputGroupAddon>
                  <InputGroupInput defaultValue="collector@pulls.xyz" aria-label="Filled" />
                </InputGroup>
              </StateCell>
              <StateCell label="error" note="aria-invalid on the control">
                <InputGroup className="max-w-full">
                  <InputGroupAddon>
                    <Icon icon={AtSign} size="sm" tone="subtle" />
                  </InputGroupAddon>
                  <InputGroupInput defaultValue="not-an-email" aria-invalid aria-label="Error" />
                </InputGroup>
              </StateCell>
              <StateCell label="disabled" note="50% opacity, whole group">
                <InputGroup className="max-w-full">
                  <InputGroupAddon>
                    <Icon icon={AtSign} size="sm" tone="subtle" />
                  </InputGroupAddon>
                  <InputGroupInput placeholder="Unavailable" disabled aria-label="Disabled" />
                </InputGroup>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="States the group does not own">
              <p>
                <strong>pressed, loading, success</strong> are N/A for the same reasons as
                Input: the group is a container around a synchronous text field, not an
                action with its own press or async outcome to draw. An
                InputGroupButton inside the group (the Apply example above) has its own
                pressed state as a Button, documented on Button&rsquo;s page — it is not a
                state of the group itself.
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
        "InputGroup and InputGroupAddon both render role=\"group\" — the group is a visual and interactive unit, but the accessible name and value still come from the inner control, exactly as with a bare Input.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "group (InputGroup and each InputGroupAddon). The inner InputGroupInput or InputGroupTextarea keeps its native textbox role." },
                {
                  k: "Accessible name",
                  v: "Still comes from the inner control's associated <label htmlFor> or aria-label — an icon-only addon (as in every specimen above) supplies no name on its own, so the field must carry one directly.",
                },
                {
                  k: "Addon click-through",
                  v: "Clicking anywhere in an InputGroupAddon that is not itself a button focuses the group's input — this extends the effective hit area of a leading icon without making the icon a separate interactive element with its own tab stop.",
                },
                {
                  k: "Error announcement",
                  v: "aria-invalid on the inner control drives has-[[data-slot][aria-invalid=true]] on the group visually; pair it with aria-describedby pointing at a FieldError, same as Input.",
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
                { k: "Tab / Shift+Tab", v: "Moves focus in document order; the group itself is not a tab stop, only its control and any InputGroupButton are." },
                { k: "Typing", v: "Native text entry on the inner control; the group does not intercept keys." },
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
        "InputGroup is fluid (w-full min-w-0, min-h-10) like Input itself, so it takes whatever width its container gives it at every viewport. The one structural switch it has is not viewport-driven at all: an addon aligned block-start or block-end flips the whole group to flex-col, stacking the addon above or below the control regardless of screen width.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "375–1920px",
                  v: "No breakpoint of its own — width comes from the parent (Field, a form grid); min-w-0 lets it shrink inside a flex row without forcing an overflow.",
                },
                {
                  k: "block-start / block-end addons",
                  v: "has-[>[data-align=block-end]]:flex-col and the block-start equivalent switch the group to a column layout whenever that addon is present — a structural reflow triggered by composition, not by the viewport.",
                },
                {
                  k: "200% zoom",
                  v: "min-h-10 is a floor, not a fixed height, so the group grows with the control's own text zoom instead of clipping it.",
                },
                {
                  k: "RTL",
                  v: "InputGroupAddon's order-first / order-last (for inline-start / inline-end) is a flex order, which flips automatically under dir=\"rtl\"; its horizontal padding (pl-4 / pr-4 in the source) is physical rather than logical, so that spacing does not mirror with it — worth a visual check on an RTL screen that uses an addon.",
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
