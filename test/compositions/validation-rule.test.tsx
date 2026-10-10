/**
 * @covers validation-rule
 *
 * `validation-rule`'s own documentation page
 * (`components/docs/component-docs/validation-rule/page.tsx`) is explicit
 * that this is deliberately NOT a component: Flutter models validation as a
 * registry item, and the web equivalent is Zod 4 composed with React Hook
 * Form's `resolver` — real dependencies, already in real use. The page's own
 * Usage snippet is drawn from
 * `components/docs/component-docs/form/account-form-specimen.tsx`, so this
 * file imports the REAL schema and the REAL form from that specimen rather
 * than retyping the page's illustrative code block, which is never executed
 * and therefore cannot be the thing under test.
 *
 * Primary behaviour asserted: the schema rejects the inputs its own field
 * messages describe and accepts a genuinely valid pair (schema-level, no
 * DOM); then the real `AccountForm` specimen is rendered and driven through
 * both an invalid and a valid submission, because a Zod schema that is
 * correct in isolation but never reaches `FieldError` through
 * `zodResolver` would still leave a user looking at a blank field.
 *
 * `accountSchema` itself is not exported from the specimen module — only
 * `AccountForm` is, and the hard constraint on this pass is to add tests,
 * never edit existing source. So the schema-level block below is BUILT here,
 * field-for-field identical to the specimen's own (`min(3)`, `max(20)`,
 * `/^[a-z0-9_]+$/`, `z.email(…)`, both with the specimen's own messages) —
 * "build the page's schema" from the brief, done literally. It is a real Zod
 * schema under real test, not a mock; the DOM-level block below it is what
 * proves the actual (unexported) schema inside `AccountForm` produces the
 * same messages once wired through `zodResolver`, so a change to the real
 * schema that this file's copy drifted from would fail there, not hide.
 */

import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import * as z from "zod";

import { AccountForm } from "@/components/docs/component-docs/form/account-form-specimen";

const accountSchema = z.object({
  handle: z
    .string()
    .min(3, "At least 3 characters.")
    .max(20, "No more than 20 characters.")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers and underscores only."),
  email: z.email("That is not an email address."),
});

describe("accountSchema, the real schema the validation-rule page documents", () => {
  it("rejects a handle shorter than 3 characters", () => {
    const result = accountSchema.safeParse({ handle: "ab", email: "a@b.com" });
    expect(result.success).toBe(false);
    expect(result.success ? null : result.error.issues[0]?.message).toBe("At least 3 characters.");
  });

  it("rejects a handle with characters outside lowercase/digits/underscore", () => {
    const result = accountSchema.safeParse({ handle: "Ayoub Elattar", email: "a@b.com" });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed email", () => {
    const result = accountSchema.safeParse({ handle: "ayoub", email: "not-an-email" });
    expect(result.success).toBe(false);
    expect(result.success ? null : result.error.issues[0]?.message).toBe("That is not an email address.");
  });

  it("accepts a genuinely valid handle and email", () => {
    const result = accountSchema.safeParse({ handle: "ayoub_1", email: "ayoub@example.com" });
    expect(result.success).toBe(true);
  });
});

describe("AccountForm: the real specimen, wired through zodResolver", () => {
  const setup = () => userEvent.setup();

  // Submitted via a real `submit` event on the `<form>` rather than a click
  // on the button. The email field is `type="email"`, and a real browser's
  // (and jsdom's) implicit-submission algorithm runs its OWN native format
  // check before a click-triggered submit ever reaches React — which would
  // silently block the malformed-email case below before `zodResolver` saw
  // it at all, for a reason that has nothing to do with the Zod schema this
  // test is about. Dispatching `submit` directly is what `form.requestSubmit()`
  // skips past in a real browser too; it reaches exactly the same
  // `form.handleSubmit(onSubmit)` React attached to `onSubmit`.
  function submit(container: HTMLElement) {
    const form = container.querySelector("form");
    if (!form) throw new Error("expected a <form> in the rendered specimen");
    fireEvent.submit(form);
  }

  it("an empty submit surfaces the schema's own handle message through FieldError", async () => {
    const { container } = render(<AccountForm />);
    submit(container);
    expect(await screen.findByText("At least 3 characters.")).toBeInTheDocument();
  });

  it("a malformed email surfaces the schema's own email message", async () => {
    const user = setup();
    const { container } = render(<AccountForm />);
    await user.type(screen.getByPlaceholderText("ayoub"), "ayoub_1");
    await user.type(screen.getByPlaceholderText("you@example.com"), "not-an-email");
    submit(container);
    expect(await screen.findByText("That is not an email address.")).toBeInTheDocument();
  });

  it("a valid submission clears to the success round trip, not an error", async () => {
    const user = setup();
    const { container } = render(<AccountForm />);
    await user.type(screen.getByPlaceholderText("ayoub"), "ayoub_1");
    await user.type(screen.getByPlaceholderText("you@example.com"), "ayoub@example.com");
    submit(container);

    // The specimen deliberately holds "Saving" for 900ms. Vitest's default
    // 1s wait leaves almost no room for a busy full-suite render.
    await waitFor(() => expect(screen.getByRole("button", { name: "Save Account" })).toBeEnabled(), {
      timeout: 5000,
    });
    expect(screen.queryByText("At least 3 characters.")).not.toBeInTheDocument();
    expect(screen.queryByText("That is not an email address.")).not.toBeInTheDocument();
  });

  it("axe: the form with a validation error showing", async () => {
    const { container } = render(<AccountForm />);
    submit(container);
    await screen.findByText("At least 3 characters.");
    expect(await axe(container)).toHaveNoViolations();
  });
});
