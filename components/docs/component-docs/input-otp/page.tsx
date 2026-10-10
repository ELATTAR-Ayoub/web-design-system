/**
 * Authored documentation page for `input-otp`.
 *
 * Replaces the generated baseline. Migrated from the old `base/inputs`
 * category page (`app/design-system/components/base/inputs/page.tsx`, since deleted) under
 * its "Verification code" section. Every specimen below renders the real
 * `InputOTP` family from `components/ui/input-otp.tsx`, itself a thin
 * wrapper around the `input-otp` package's `OTPInput` — nothing here is a
 * styled div standing in for a slot.
 *
 * A spec module is plain data rendered by a server component, so it cannot
 * hold the `value`/`onChange` state a real verification flow needs.
 * `InputOTP` manages an internal value when left uncontrolled (no `value`
 * prop), which is what every specimen below relies on; the controlled
 * pattern is shown as a snippet in Usage instead.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Meta, Note, Panel } from "@/components/ds/kit";

import { VerifyCodeSpecimen } from "./input-otp-verify-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "input-otp",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Six digits, grouped three and three, using the shared numerical mono foundation for the printed characters. Type the code below and it actually verifies on the sixth digit.",
      label: "Verify email",
      render: <VerifyCodeSpecimen />,
      source: `"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";

const VALID_CODE = "408291";

export function VerifyCodeSpecimen() {
  const [status, setStatus] = useState<"entering" | "checking" | "verified" | "rejected">("entering");

  async function handleComplete(value: string) {
    setStatus("checking");
    await new Promise((r) => setTimeout(r, 700));
    setStatus(value === VALID_CODE ? "verified" : "rejected");
  }

  return (
    <div>
      <InputOTP maxLength={6} onComplete={handleComplete} disabled={status !== "entering" && status !== "rejected"} aria-label="Verification code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {status === "checking" && <p><Spinner aria-hidden /> Checking</p>}
      {status === "verified" && <p><Icon icon={CheckCircle2} tone="success" /> Email verified</p>}
      {status === "rejected" && <p><Icon icon={XCircle} tone="error" /> That code doesn't match.</p>}
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
        "Email verification and two-factor authentication. A product screen controls the value so it can submit as soon as the sixth digit lands.",
      language: "tsx",
      code: `"use client";

import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

export function VerificationCodeField() {
  const [code, setCode] = useState("");
  return (
    <InputOTP
      maxLength={6}
      value={code}
      onChange={setCode}
      onComplete={(value) => submitCode(value)}
      aria-label="Verification code"
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Empty and partially filled, both uncontrolled here via defaultValue so the specimen needs no client state — a real flow passes value and onChange as shown in Usage.",
      label: "Empty and partially filled",
      render: (
        <div className="space-y-8">
          <div>
            <p className="type-small mb-4 text-muted-foreground">Empty</p>
            <InputOTP maxLength={6} aria-label="Verification code, empty">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div>
            <p className="type-small mb-4 text-muted-foreground">Partially filled</p>
            <InputOTP maxLength={6} defaultValue="4082" aria-label="Verification code, partially filled">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
      ),
      source: `<InputOTP maxLength={6} defaultValue="4082" aria-label="Verification code">
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "InputOTP",
          body: (
            <Meta
              items={[
                { k: "maxLength", v: "number, required. Sets the digit count — the OTPInput primitive it wraps." },
                { k: "value", v: "string. Controlled value; pair with onChange for a real flow." },
                { k: "defaultValue", v: "string. Uncontrolled initial value." },
                { k: "onChange", v: "(value: string) => void, from the underlying OTPInput." },
                { k: "onComplete", v: "(value: string) => void — fires once maxLength digits are entered." },
                { k: "containerClassName", v: "Merged onto the outer flex container (data-slot=\"input-otp\")." },
                { k: "className", v: "Merged onto the input-otp package's hidden native input." },
                { k: "...props", v: "Every other OTPInput prop from the input-otp package, forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "InputOTPGroup",
          body: (
            <Meta
              items={[
                { k: "className", v: "Merged onto the group root. Carries has-aria-invalid: styling for the destructive border and ring." },
                { k: "...props", v: "Every other <div> attribute, forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "InputOTPSlot",
          body: (
            <Meta
              items={[
                { k: "index", v: "number, required. Which OTPInputContext slot (char, hasFakeCaret, isActive) this box renders." },
                { k: "className", v: "Merged onto the slot root." },
                { k: "...props", v: "Every other <div> attribute, forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "InputOTPSeparator",
          body: (
            <Meta
              items={[
                { k: "role", v: "\"separator\", fixed — a decorative divider between groups, not a slot." },
                { k: "...props", v: "Every other <div> attribute, forwarded directly." },
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
        "InputOTP has one control-level disabled state and one per-slot condition — active — driven by the caret position rather than by focus alone.",
      blocks: [
        {
          body: (
            <div className="space-y-6">
              <Panel label="rest / empty">
                <InputOTP maxLength={6} aria-label="Rest">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </Panel>
              <Panel label="filled">
                <InputOTP maxLength={6} defaultValue="408291" aria-label="Filled">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </Panel>
              <Panel label="error" note="aria-invalid on the group">
                <InputOTP maxLength={6} defaultValue="4082" aria-invalid aria-label="Error">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </Panel>
              <Panel label="disabled" note="50% opacity on the container">
                <InputOTP maxLength={6} defaultValue="4082" disabled aria-label="Disabled">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </Panel>
            </div>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the omitted rows">
              <p>
                <strong>hover</strong> and <strong>focus-visible</strong> are not drawn as
                separate static specimens: the active slot (data-active, driven by caret
                position, not CSS :focus) already carries the ring and border treatment,
                and it can only be demonstrated by focusing the live control, not
                screenshotted as a fixed state.
              </p>
              <p className="mt-2">
                <strong>pressed, loading, success</strong> are N/A: entry is synchronous
                keystroke-by-keystroke, there is no held-down visual distinct from typing,
                and a completed code&rsquo;s outcome (verified or rejected) belongs to whatever
                the submission produced, not to the control itself.
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
        "InputOTP renders a single hidden native <input> beneath the visible slots — the slots are decorative rendering, and the real text field carries focus, typing, selection and paste.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Accessible name",
                  v: "None by default — pass aria-label (as every specimen above does) or aria-labelledby, since InputOTP renders no visible label of its own.",
                },
                {
                  k: "Paste",
                  v: "Pasting a full code fills every slot from a single paste event on the hidden input, rather than requiring one paste per digit.",
                },
                {
                  k: "Error announcement",
                  v: "aria-invalid is exposed on the group (has-aria-invalid: styling) for the destructive border and ring; pair it with a written error message elsewhere on the screen, as with any field.",
                },
                {
                  k: "Target size",
                  v: "Each slot is drawn at size-8 (32px), under --size-target-min (44px) — the six-slot row is treated as one continuous control rather than six discrete targets, matching how a native OTP input group is operated (typing, not individually tapping each box).",
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
                { k: "Tab / Shift+Tab", v: "Moves focus to and from the whole control in document order — Tab does not step between individual slots." },
                { k: "Digits", v: "Advance the caret to the next slot automatically as each character is typed." },
                { k: "Backspace", v: "Deletes the current digit and moves the caret back one slot." },
                { k: "Left / Right arrows", v: "Move the caret between slots without deleting." },
                { k: "Ctrl/Cmd+V", v: "Pastes a full code across every slot from one event; see Accessibility." },
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
        "Every slot is a fixed size-8 (32px) box laid out in an inline flex row that never wraps — InputOTP does not reflow across widths, it simply stays the width its maxLength dictates.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "375–1920px",
                  v: "A 6-digit code (the shape in every specimen above) renders at roughly 200px wide including borders and the separator — well inside a 375px viewport with room to spare; there is no breakpoint that changes slot size or wrapping.",
                },
                {
                  k: "Very long codes",
                  v: "Because the row never wraps, a maxLength large enough to exceed the viewport (well beyond the 4–8 digit codes this system uses) would overflow rather than reflow — a caller choosing an unusually long code is responsible for checking it fits.",
                },
                {
                  k: "200% zoom",
                  v: "Slots are a fixed pixel size (size-8), not typographic, so zoom scales the whole control like any other fixed-size box rather than reflowing its layout.",
                },
                {
                  k: "RTL",
                  v: "first:rounded-l-lg / last:rounded-r-lg are physical corners tied to source order, not dir — the group's rounded ends do not swap sides under dir=\"rtl\", though the digit entry order itself is unaffected since OTPInput tracks the underlying value, not visual position.",
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
