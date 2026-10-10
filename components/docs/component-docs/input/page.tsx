/**
 * Authored documentation page for `input`.
 *
 * Replaces the generated baseline. Every specimen renders the real `Input`
 * from `components/ui/input.tsx`. Field/FieldLabel/FieldDescription compose
 * around it for realistic context (a field needs a label to be usable) but
 * are documented on their own `field` page — the API Reference below covers
 * only Input's own props, which is this item's actual export surface.
 */

import { AtSign, Lock, Percent, Search, Ticket } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Code, Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "input",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A labelled field with helper text, beside the same control composed inside InputGroup for a leading icon — the two shapes Input actually ships in. Type into either; both are the real element, not a picture of one.",
      render: (
        <FieldGroup className="max-w-sm">
          <Field>
            <FieldLabel htmlFor="pv-username">Username</FieldLabel>
            <Input id="pv-username" placeholder="voidwing" />
            <FieldDescription>Shown on live pulls and the leaderboard.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="pv-email">Email</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Icon icon={AtSign} size="sm" tone="subtle" />
              </InputGroupAddon>
              <InputGroupInput
                id="pv-email"
                type="email"
                placeholder="collector@pulls.xyz"
                autoComplete="email"
              />
            </InputGroup>
          </Field>
        </FieldGroup>
      ),
      source: `<Field>
  <FieldLabel htmlFor="username">Username</FieldLabel>
  <Input id="username" placeholder="voidwing" />
  <FieldDescription>Shown on live pulls and the leaderboard.</FieldDescription>
</Field>

<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <InputGroup>
    <InputGroupAddon>
      <Icon icon={AtSign} size="sm" tone="subtle" />
    </InputGroupAddon>
    <InputGroupInput id="email" type="email" placeholder="collector@pulls.xyz" autoComplete="email" />
  </InputGroup>
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
import { Input } from "@/components/ui/input";

export function UsernameField() {
  return (
    <Field>
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <Input id="username" placeholder="voidwing" />
    </Field>
  );
}`,
    },
    {
      kind: "snippet",
      id: "password-toggle",
      title: "Password visibility toggle",
      description:
        "The Examples panel below shows a bare password Input — a real show/hide control needs client state to flip type between \"password\" and \"text\", which a spec module (this documentation page) cannot hold. This is the controlled pattern a product screen should use instead.",
      language: "tsx",
      code: `"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

export function PasswordField() {
  const [visible, setVisible] = useState(false);
  return (
    <InputGroup>
      <InputGroupAddon>
        <Icon icon={Lock} size="sm" tone="subtle" />
      </InputGroupAddon>
      <InputGroupInput
        type={visible ? "text" : "password"}
        defaultValue="correct-horse-battery"
        aria-label="Password"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          <Icon icon={visible ? EyeOff : Eye} size="sm" tone="subtle" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Input composed with a Field (for the label/description wiring) and with InputGroup (for a leading icon or addon) — both are separate registry items, shown here because Input is rarely used bare. type is not cosmetic: it drives the mobile keyboard, autofill and native validation, so every text-entry shape the product needs is one Input with a different type, not a separate component. A password field's show/hide toggle needs state to work — it is a real control with its own aria-pressed, so it is shown as a controlled snippet in Usage rather than faked here with an inert icon.",
      label: "Every type, one component",
      render: (
        <FieldGroup className="max-w-sm">
          <Field>
            <FieldLabel htmlFor="ex-username">Username</FieldLabel>
            <Input id="ex-username" placeholder="voidwing" />
            <FieldDescription>Shown on live pulls and the leaderboard.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="ex-email">Email</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Icon icon={AtSign} size="sm" tone="subtle" />
              </InputGroupAddon>
              <InputGroupInput
                id="ex-email"
                type="email"
                placeholder="collector@pulls.xyz"
                autoComplete="email"
              />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="ex-password">Password</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Icon icon={Lock} size="sm" tone="subtle" />
              </InputGroupAddon>
              <InputGroupInput
                id="ex-password"
                type="password"
                defaultValue="correct-horse-battery"
                autoComplete="current-password"
              />
            </InputGroup>
            <FieldDescription>
              A visibility toggle needs state — see the controlled pattern in Usage.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="ex-search">Search</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Icon icon={Search} size="sm" tone="subtle" />
              </InputGroupAddon>
              <InputGroupInput
                id="ex-search"
                type="search"
                placeholder="Search packs, cards and sets"
              />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="ex-number">Quantity</FieldLabel>
            <InputGroup className="max-w-40">
              <InputGroupInput
                id="ex-number"
                type="number"
                defaultValue={3}
                min={1}
                max={10}
                className="type-number-base"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>packs</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>
              Numerical values use the shared mono foundation, even inside inputs.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="ex-phone">Phone number</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText className="type-number-sm">+1</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="ex-phone"
                type="tel"
                placeholder="555 0134 908"
                autoComplete="tel"
                className="type-number-base"
              />
            </InputGroup>
            <FieldDescription>
              Country code is a separate addon so it never gets validated as part
              of the number.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="ex-invite">Invite code</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Icon icon={Ticket} size="sm" tone="subtle" />
              </InputGroupAddon>
              <InputGroupInput
                id="ex-invite"
                placeholder="ECLIPSE-2K4A"
                className="type-identifier"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant="ghost">Apply</InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="ex-referral">Referral percentage</FieldLabel>
            <InputGroup className="max-w-40">
              <InputGroupInput
                id="ex-referral"
                type="number"
                defaultValue={5}
                className="type-number-base"
              />
              <InputGroupAddon align="inline-end">
                <Icon icon={Percent} size="sm" tone="subtle" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      ),
      source: `<Field>
  <FieldLabel htmlFor="username">Username</FieldLabel>
  <Input id="username" placeholder="voidwing" />
  <FieldDescription>Shown on live pulls and the leaderboard.</FieldDescription>
</Field>

<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <InputGroup>
    <InputGroupAddon>
      <Icon icon={AtSign} size="sm" tone="subtle" />
    </InputGroupAddon>
    <InputGroupInput id="email" type="email" placeholder="collector@pulls.xyz" autoComplete="email" />
  </InputGroup>
</Field>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Input",
          body: (
            <Meta
              items={[
                {
                  k: "type",
                  v: "Native input type attribute (text, email, password, search, number, tel, …). No default is imposed — omitting it renders a plain text field, matching the native element.",
                },
                {
                  k: "className",
                  v: "Merged onto the root via cn(); an application may add contextual styling, but the built-in Input states are focus-visible, aria-invalid, and disabled.",
                },
                {
                  k: "disabled",
                  v: "Native boolean. Applies pointer-events-none and 50% opacity.",
                },
                {
                  k: "aria-invalid",
                  v: "Native ARIA boolean. Switches the border to destructive and adds a destructive focus ring — the single flag the error appearance is keyed on.",
                },
                {
                  k: "...props",
                  v: "Every other native <input> attribute (value, onChange, placeholder, readOnly, min/max, autoComplete, aria-*, etc.), forwarded directly — Input adds no props of its own beyond styling.",
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
        "The distinct states Input actually renders. Focus the live field to see its ring; aria-invalid and disabled are visible without interaction. Hover has no separate visual treatment.",
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="rest">
                <Input placeholder="Search packs" aria-label="Rest" />
              </StateCell>
              <StateCell label="focus-visible" note="Click or tab into it">
                <Input placeholder="Search packs" aria-label="Focus" />
              </StateCell>
              <StateCell label="filled">
                <Input defaultValue="Eclipse Vault" aria-label="Filled" />
              </StateCell>
              <StateCell label="error" note="aria-invalid">
                <Input defaultValue="not-an-email" aria-invalid aria-label="Error" />
              </StateCell>
              <StateCell label="disabled" note="50% opacity, exempt from contrast">
                <Input placeholder="Unavailable" disabled aria-label="Disabled" />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="States the input does not own">
              <p>
                <strong>pressed</strong> is N/A: a text field has no momentary press,
                then release gesture the way a Button does — clicking it produces
                focus, which is already its own row.
              </p>
              <p className="mt-2">
                <strong>loading</strong> is N/A on Input itself: typing is synchronous and
                Input has no async effect of its own to inject. A field that is disabled
                while a request is in flight (for example while a form submits) is
                expressed with the existing <Code>disabled</Code> prop, not a separate
                loading state.
              </p>
              <p className="mt-2">
                <strong>success</strong> is validation feedback from the form, not a
                built-in Input state. Pair a valid value with explanatory text or
                another outcome component rather than inventing a success border.
                An empty Input is the rest state with a placeholder, not a second
                visual state.
              </p>
            </Note>
          ),
        },
        {
          label: "Validation message",
          body: (
            <Panel label="Error paired with FieldError" className="max-w-sm">
              <Field>
                <FieldLabel htmlFor="st-email">Email</FieldLabel>
                <Input
                  id="st-email"
                  defaultValue="collector@pulls"
                  aria-invalid
                  aria-describedby="st-email-err"
                />
                <FieldError id="st-email-err">
                  That address is missing a domain. Try collector@pulls.xyz.
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
        "Input is a real <input>, so typing, selection, clipboard and platform autofill all come from the browser rather than being reimplemented.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "textbox (native, from the input element and its type)." },
                {
                  k: "Accessible name",
                  v: "Comes from an associated <label htmlFor> (via FieldLabel) or an explicit aria-label / aria-labelledby. Input renders no label itself — an Input used bare, as in the Preview above, must carry aria-label or it announces as unnamed.",
                },
                {
                  k: "Error announcement",
                  v: "aria-invalid alone changes only the visual treatment. Pair it with aria-describedby pointing at a FieldError (role=\"alert\") so the message itself is announced, not just the invalid flag.",
                },
                {
                  k: "Placeholder",
                  v: "Never a substitute for a label — it is not exposed as the accessible name by most screen readers once a value is entered, and it disappears from view entirely while typing.",
                },
                {
                  k: "Target size",
                  v: "min-h-10 sets a 40px floor, 4px under --size-target-min (44px). Input is treated as the RULES §7 inline-text exception rather than a violation: the field's target is its full width, not a fixed-size icon, and text-entry controls on this ladder are consistently 40px so they sit level with a default Button.",
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
                { k: "Typing", v: "Native text entry; no keys are intercepted or remapped." },
                {
                  k: "Ctrl/Cmd+A, arrows, Home/End",
                  v: "Native text-selection and caret-movement behaviour, unchanged.",
                },
                {
                  k: "type=\"search\"",
                  v: "Most browsers add a native clear (×) affordance and an Escape-to-clear behaviour; this is platform behaviour Input does not alter.",
                },
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
        "w-full min-w-0 with a min-h-10 floor and no max-height: Input is fluid by construction, so it never overflows or needs a breakpoint of its own — the width it takes comes entirely from whatever Field, FieldGroup or InputGroup wraps it.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "375–1920px",
                  v: "No layout change — text-sm and the fixed 16px horizontal padding stay constant at every width; only the available width (set by the parent) changes, and min-w-0 lets it shrink inside a flex row (InputGroup) without blowing out the container.",
                },
                {
                  k: "200% zoom",
                  v: "The field grows with the browser's own text zoom like any native <input>; nothing here caps font-size or clips it.",
                },
                {
                  k: "Touch target",
                  v: "min-h-10 is a 40px floor, 4px under the 44px --size-target-min — see the Target size row in Accessibility above for why that is treated as the RULES §7 inline-text exception rather than a violation.",
                },
                {
                  k: "RTL",
                  v: "Caret, text alignment and selection follow dir automatically — Input sets no text-align or padding side explicitly, so nothing needs to be mirrored by hand.",
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
