import { Button } from "@/components/ui/button";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { DoDont, Meta, Note, StateCell, StateGrid } from "@/components/ds/kit";

import { AccountForm } from "./account-form-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "form",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A real Form: react-hook-form's state plus a Zod schema, bound onto Field through the actual components/ui/form.tsx exports. Submit empty, or with a malformed email, to see FormError; submit a valid handle to see the loading-then-toast round trip. Form itself has no visual shape of its own — everything you see below is Field's presentation, wired by FormControl/FormLabel/FormDescription/FormError.",
      label: "Account form",
      render: <AccountForm />,
      source: `"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Form, FormControl, FormDescription, FormError, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const accountSchema = z.object({
  handle: z
    .string()
    .min(3, "At least 3 characters.")
    .max(20, "No more than 20 characters.")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers and underscores only."),
  email: z.email("That is not an email address."),
});

export function AccountForm() {
  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: { handle: "", email: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof accountSchema>) {
    await new Promise((r) => setTimeout(r, 900));
    toast.success(\`Saved as @\${values.handle}\`);
    form.reset(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md">
        <FieldGroup>
          <FormField
            control={form.control}
            name="handle"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FormLabel>Handle</FormLabel>
                <FormControl>
                  <Input placeholder="ayoub" autoComplete="username" {...field} />
                </FormControl>
                <FormDescription>This is how you appear on leaderboards.</FormDescription>
                <FormError />
              </Field>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                </FormControl>
                <FormDescription>Receipts and nothing else.</FormDescription>
                <FormError />
              </Field>
            )}
          />
          <Button type="submit" loading={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving" : "Save Account"}
          </Button>
        </FieldGroup>
      </form>
    </Form>
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
        "The smallest correct unit: one field, wired through FormField, FormControl and FormError. Form contributes no styling — Field owns everything you can see.",
      language: "tsx",
      code: `import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormLabel, FormError } from "@/components/ui/form";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({ handle: z.string().min(3, "At least 3 characters.") });

export function HandleForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { handle: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => console.log(values))}>
        <FormField
          control={form.control}
          name="handle"
          render={({ field }) => (
            <Field>
              <FormLabel>Handle</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormError />
            </Field>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}`,
    },
    {
      kind: "disclosure",
      id: "validation",
      title: "Validation",
      description:
        "The schema is the source of truth. Zod owns what valid means; react-hook-form owns when the question gets asked. The Preview form above uses the pairing this section explains: mode: \"onSubmit\", reValidateMode: \"onChange\".",
      blocks: [
        {
          body: (
            <Note tone="action" title="Validate late, re-validate early">
              <p>
                The account form in Preview asks nothing until you submit, then
                re-checks on every keystroke. Validating on the first
                keystroke tells someone their email is invalid while they are
                still typing the third character, which is true and useless.
                Once they have submitted, they have asked to be told — so from
                that point the feedback is immediate.
              </p>
            </Note>
          ),
        },
        {
          label: "Config",
          body: (
            <Meta
              items={[
                { k: "mode", v: '"onSubmit" — the default, and the right one.' },
                {
                  k: "reValidateMode",
                  v: '"onChange" — after the first failed submit only.',
                },
                {
                  k: "resolver",
                  v: "zodResolver(schema). The schema also types the form: z.infer<typeof schema>.",
                },
                {
                  k: "criteriaMode",
                  v: '"all" collects every failing rule into error.types instead of only the first — see Field errors below.',
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "field-errors",
      title: "Field errors",
      description:
        "One rule fails, you get a sentence. Several fail, you get a list — the same FormError component, deciding on its own from error.types.",
      blocks: [
        {
          body: (
            <Note tone="action" title="What the wiring actually guarantees">
              <p>
                Every field wired through FormField ships the three things
                RULES §7 demands, and none of them were typed at the call
                site. The control carries <code>aria-invalid</code> and an{" "}
                <code>aria-describedby</code> that points at the description
                while valid and at description + error once it is not. The
                error itself is a FieldError with{" "}
                <code>role=&quot;alert&quot;</code>, and it renders nothing at
                all when the field is valid rather than leaving an empty live
                region behind.
              </p>
            </Note>
          ),
        },
        {
          body: (
            <DoDont
              dos={[
                "Let FormControl stamp the aria wiring — it works on a Select trigger and a Switch, not only an input.",
                "Write what to do next: “At least 10 characters.” not “Invalid.”",
                "Keep FormDescription present while the field is valid; it is the only guidance there.",
              ]}
              donts={[
                "Hand-type id / htmlFor / aria-describedby. It satisfies the rule exactly as often as someone remembers.",
                "Render an error container that is always mounted and merely empty — a screen reader announces the region.",
                "Paint error text with the raw destructive colour class. Only the -ink variant carries text, and it is a different red per theme.",
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "snippet",
      id: "field-errors-example",
      title: "Multiple errors on one field",
      description:
        "criteriaMode: \"all\" plus mode: \"onChange\" — type a weak password and every unmet rule is listed at once, not just the first.",
      language: "tsx",
      code: `const passwordSchema = z.object({
  password: z
    .string()
    .min(10, "At least 10 characters.")
    .regex(/[A-Z]/, "One capital letter.")
    .regex(/[0-9]/, "One number.")
    .regex(/[^A-Za-z0-9]/, "One symbol."),
});

function PasswordForm() {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    // Collects EVERY failing rule into error.types, not just the first.
    criteriaMode: "all",
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => toast.success("Password accepted"))}>
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormDescription>
                Type a weak one — every unmet rule is listed at once.
              </FormDescription>
              <FormError />
            </Field>
          )}
        />
        <Button type="submit" variant="outline">Set Password</Button>
      </form>
    </Form>
  );
}`,
    },
    {
      kind: "showcase",
      id: "submit-states",
      title: "Submit states",
      description:
        "Every action needs two signals: the control confirms it heard you, the outcome confirms it worked. loading on Button is the first signal — it swaps in a spinner, sets aria-busy and disables the control, so a slow save cannot be double-submitted. A toast (not shown here, since it fires from an onClick this spec module cannot hold) is the second — see the Preview and Field errors snippets above for toast.success in context. This grid renders the real Button with static props only, which is why it can stay live where the rest of this page cannot.",
      label: "Button, at rest and mid-submit",
      render: (
        <StateGrid cols={4}>
          <StateCell label="Idle" note="Nothing pending">
            <Button>Save Account</Button>
          </StateCell>
          <StateCell label="Pending" note="isSubmitting">
            <Button loading>Saving</Button>
          </StateCell>
          <StateCell label="Success" note="Outcome confirmed">
            <Button variant="secondary">Saved</Button>
          </StateCell>
          <StateCell label="Disabled" note="Nothing has changed">
            <Button disabled>Save Account</Button>
          </StateCell>
        </StateGrid>
      ),
      source: `<Button>Save Account</Button>
<Button loading>Saving</Button>
<Button variant="secondary">Saved</Button>
<Button disabled>Save Account</Button>`,
    },
    {
      kind: "snippet",
      id: "server-errors",
      title: "Server errors",
      description:
        "The field is valid and the submit still failed. This is the state most forms never draw, and the only one your users will actually hit. setError(\"root.serverError\") holds what went wrong with the submission and renders as an Alert — a persistent condition worth explaining, which is exactly what RULES §5 reserves Alert for. setError(\"handle\") holds what is wrong with the field, so the error sits next to the thing you have to change. A form that only does the first makes you hunt; one that only does the second cannot explain a failure that belongs to no field. clearErrors is called first on every submit, or the last failure outlives the attempt that caused it.",
      language: "tsx",
      code: `const serverSchema = z.object({ handle: z.string().min(3, "At least 3 characters.") });

function ServerErrorForm() {
  const form = useForm<z.infer<typeof serverSchema>>({
    resolver: zodResolver(serverSchema),
    defaultValues: { handle: "taken" },
  });

  const rootError = form.formState.errors.root?.serverError;

  async function onSubmit(values: z.infer<typeof serverSchema>) {
    form.clearErrors("root.serverError");
    await new Promise((r) => setTimeout(r, 800));

    if (values.handle === "taken") {
      form.setError("root.serverError", { message: "That handle belongs to someone else." });
      form.setError("handle", { message: "Already registered." });
      toast.error("Could not claim that handle");
      return;
    }
    toast.success(\`Claimed @\${values.handle}\`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {rootError?.message && (
          <Alert variant="destructive">
            <Icon icon={XCircle} size="md" tone="inherit" />
            <AlertTitle>Could not save</AlertTitle>
            <AlertDescription>{rootError.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="handle"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FormLabel>Claim a handle</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>&ldquo;taken&rdquo; fails on the server. Anything else succeeds.</FormDescription>
              <FormError />
            </Field>
          )}
        />
        <Button type="submit" loading={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Claiming" : "Claim Handle"}
        </Button>
      </form>
    </Form>
  );
}`,
    },
    {
      kind: "disclosure",
      id: "form-recovery",
      title: "useFormRecovery",
      description:
        "Moves the reader to the first invalid field, using what the browser already has: a definitive order for “what comes first” (DOM order) and a built-in way to get a reader there (scrollIntoView + .focus()).",
      blocks: [
        {
          label: "What it does",
          body: (
            <p className="type-small text-muted-foreground">
              On a failed submit it finds the first field carrying{" "}
              <code>aria-invalid=&quot;true&quot;</code> inside the form,
              resolves that to something focusable (the field itself, or —
              for a compound control whose invalid element is not focusable,
              such as a RadioGroup&apos;s <code>role=&quot;radiogroup&quot;</code>{" "}
              div or a checkbox group&apos;s shared wrapper — the first
              focusable descendant), scrolls it into view (centred), and
              focuses it. Reveal itself is not this hook&apos;s job:
              react-hook-form already validates on submit and publishes the
              result to every FormError in the tree via useFormState. By the
              time a consumer&apos;s invalid handler runs, the messages are
              already the thing about to be revealed; this hook only has to
              get the reader to the first one, after the reveal has actually
              painted.
            </p>
          ),
        },
        {
          label: "Why DOM order, not schema order",
          body: (
            <p className="type-small text-muted-foreground">
              A schema lists fields in whatever order made sense to write
              them in, and react-hook-form&apos;s <code>errors</code> object
              is keyed in its resolver&apos;s order (a Zod schema&apos;s key
              order, if a resolver is in use) — neither necessarily matches
              the order a reader&apos;s eye travels the page in, and a
              two-column layout is the common case where they diverge
              outright. The one order that always matches what the user sees
              is the rendered DOM, so the first invalid field is found with{" "}
              <code>querySelector(&apos;[aria-invalid=&quot;true&quot;]&apos;)</code>{" "}
              inside the form — which <code>querySelector</code> always
              returns in document order — rather than by reading{" "}
              <code>formState.errors</code>.
            </p>
          ),
        },
        {
          label: "The shouldFocusError: false requirement",
          body: (
            <Note tone="error" title="Required, not optional">
              <p>
                React Hook Form ships its own built-in &quot;focus the first
                error&quot; behaviour, on by default, and it runs
                synchronously — before <code>formState.errors</code> is even
                published to <code>useFormState</code>&apos;s subscribers,
                let alone before React has committed{" "}
                <code>aria-invalid</code>. Left enabled it fires first and
                picks by field <em>registration</em> order, which
                useFormRecovery deliberately does not use. The two would
                silently race, and registration order would win more often
                than not simply by going first.{" "}
                <code>shouldFocusError: false</code> is a public, documented
                react-hook-form option — not a workaround — and this hook
                only replaces the one behaviour it turns off. Pass it to{" "}
                <code>useForm()</code> whenever a form also calls
                useFormRecovery, or the two focus behaviours compete.
              </p>
            </Note>
          ),
        },
        {
          label: "Reduced motion",
          body: (
            <p className="type-small text-muted-foreground">
              The scroll comes from <code>usePrefersReducedMotion</code>{" "}
              rather than a second read of the media query, per that hook&apos;s
              own contract — this is exactly the JavaScript-driven case (
              <code>scrollIntoView</code>&apos;s <code>behavior</code> option)
              that <code>globals.css</code>&apos;s blanket reduced-motion rule
              cannot reach, because a CSS transition or keyframe is not what
              moves the page here. Under{" "}
              <code>prefers-reduced-motion: reduce</code> the scroll is{" "}
              <code>behavior: &quot;auto&quot;</code> (instant); otherwise{" "}
              <code>&quot;smooth&quot;</code>. Focus is requested with{" "}
              <code>preventScroll: true</code> and always happens after the
              scroll call, in both cases, so the browser&apos;s own
              focus-driven scroll cannot race the one just requested.
            </p>
          ),
        },
        {
          label: "API",
          body: (
            <Meta
              items={[
                {
                  k: "useFormRecovery(form)",
                  v: "Takes the return of useForm(). Returns { formRef, handleSubmit }.",
                },
                {
                  k: "formRef",
                  v: "Attach to the <form> element — this is how revealFirstError finds the form's own [aria-invalid=\"true\"] descendant rather than searching the whole document.",
                },
                {
                  k: "handleSubmit(onValid, onInvalid?)",
                  v: "Drop-in replacement for form.handleSubmit. Calls the supplied onInvalid (if any), then schedules revealFirstError with setTimeout(fn, 0) — the query has to wait because FormControl only stamps aria-invalid once formState.errors carries the failure, and react-hook-form calls the invalid handler before it publishes that update to formState's subscribers. A bare timer waits it out without waiting an extra paint the way requestAnimationFrame would.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "snippet",
      id: "form-recovery-usage",
      title: "Wiring it in",
      description:
        "Everything useFormRecovery needs beyond a normal useForm() call: shouldFocusError: false on the form, formRef on the <form> element, and its own handleSubmit in place of form.handleSubmit.",
      language: "tsx",
      code: `import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormLabel, FormError, useFormRecovery } from "@/components/ui/form";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  handle: z.string().min(3, "At least 3 characters."),
  email: z.email("That is not an email address."),
});

export function RecoveringForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { handle: "", email: "" },
    // React Hook Form's own focus-first-error runs first and by registration
    // order otherwise — see the "shouldFocusError: false requirement" note.
    shouldFocusError: false,
  });
  const { formRef, handleSubmit } = useFormRecovery(form);

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={handleSubmit((values) => console.log(values))}>
        <FieldGroup>
          <FormField
            control={form.control}
            name="handle"
            render={({ field }) => (
              <Field>
                <FormLabel>Handle</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormError />
              </Field>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <Field>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" {...field} /></FormControl>
                <FormError />
              </Field>
            )}
          />
          <Button type="submit">Save</Button>
        </FieldGroup>
      </form>
    </Form>
  );
}`,
    },
    {
      kind: "snippet",
      id: "composed-fields",
      title: "Composed fields",
      description:
        "Select, RadioGroup, Textarea, Switch and Checkbox — none of them an <input>, all of them wired the same way. FormControl is a Radix Slot rather than a wrapper element, which is what lets one component carry the wiring for five controls that share no DOM shape. Note where it sits on the Select: around the SelectTrigger, not the Select — the trigger is the focusable thing, so it is the thing that needs the id. A group of radios is a fieldset with a legend, not a label with an htmlFor: <label for> may only point at a labelable element, and a RadioGroup container is a div, so FieldSet + FieldLegend replaces Field + FormLabel there. Controls that are not <input> take onValueChange or onCheckedChange, so they are wired by hand from field rather than spread.",
      language: "tsx",
      code: `const composedSchema = z.object({
  plan: z.string().min(1, "Pick a plan."),
  payout: z.enum(["daily", "weekly"], { message: "Pick a payout rhythm." }),
  bio: z.string().max(160, "160 characters is the ceiling."),
  alerts: z.boolean(),
  // refine, not z.literal(true): a literal types the field as true, so an
  // unchecked default of false will not assign.
  terms: z.boolean().refine((v) => v, { message: "You have to accept the terms." }),
});

function ComposedForm() {
  const form = useForm<z.infer<typeof composedSchema>>({
    resolver: zodResolver(composedSchema),
    defaultValues: { plan: "", payout: undefined, bio: "", alerts: true, terms: false },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => toast.success("Preferences saved"))}>
        <FieldGroup>
          <FormField
            control={form.control}
            name="plan"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FormLabel>Plan</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Choose a plan" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
                <FormError />
              </Field>
            )}
          />

          <FormField
            control={form.control}
            name="payout"
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend variant="label">Payout rhythm</FieldLegend>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <Field orientation="horizontal">
                      <RadioGroupItem value="daily" id="payout-daily" />
                      <FieldLabel htmlFor="payout-daily">Daily</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <RadioGroupItem value="weekly" id="payout-weekly" />
                      <FieldLabel htmlFor="payout-weekly">Weekly</FieldLabel>
                    </Field>
                  </RadioGroup>
                </FormControl>
                <FormError />
              </FieldSet>
            )}
          />

          <FormField
            control={form.control}
            name="alerts"
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Price alerts</FormLabel>
              </Field>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Field orientation="horizontal">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>I accept the terms</FormLabel>
                </Field>
                <FormError />
              </Field>
            )}
          />

          <Button type="submit">Save Preferences</Button>
        </FieldGroup>
      </form>
    </Form>
  );
}`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "Form itself has no visual state — every state a form goes through is spread across the sections above, keyed on where in the submit lifecycle it happens rather than gathered in one grid, because a field's own validity, the submit button's pending/idle state and a submission that failed on the server are three independent axes that can all be true at once.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Untouched",
                  v: "No aria-invalid, no FormError rendered — the Preview and Composed fields specimens above start here.",
                },
                {
                  k: "Client-invalid",
                  v: "Zod rejects the value; FormControl sets aria-invalid and FormError renders the message next to the field. See Validation and Field errors above.",
                },
                {
                  k: "Submitting",
                  v: "isSubmitting drives Button's loading prop — spinner, aria-busy, and the control disabled against a double submit. See Submit states above for the full Idle / Pending / Success / Disabled grid.",
                },
                {
                  k: "Server-rejected",
                  v: "The field was valid and the submission still failed — setError(\"root.serverError\") renders an Alert, and setError(\"<field>\") can additionally point at the field that needs to change. See Server errors above.",
                },
                {
                  k: "Recovering",
                  v: "On any failed submit, useFormRecovery moves scroll and focus to the first invalid field in DOM order — see useFormRecovery above, which is the one state-adjacent behaviour Form adds beyond react-hook-form's own.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Form contributes no presentation at all. Every export below renders a Field component (documented on its own page) and adds only ids and aria attributes.",
      blocks: [
        {
          label: "Form",
          body: (
            <Meta
              items={[
                { k: "Form", v: "FormProvider. Spread the useForm() return into it." },
                {
                  k: "FormField",
                  v: "A react-hook-form Controller, plus a useId() so two forms on one page cannot collide on ids. Requires control and name.",
                },
                {
                  k: "FormControl",
                  v: "A Radix Slot. Stamps id, aria-invalid and aria-describedby onto whatever control it wraps — Input, Select trigger, Switch or Checkbox alike.",
                },
                {
                  k: "FormLabel",
                  v: "FieldLabel bound to the current field's id via htmlFor. Zero added styling.",
                },
                {
                  k: "FormDescription",
                  v: "FieldDescription carrying the id aria-describedby points at.",
                },
                {
                  k: "FormError",
                  v: "FieldError fed this field's error. error.types is spread rather than error alone, so FieldError's multi-error <ul> is reachable when criteriaMode is \"all\".",
                },
                {
                  k: "useFormField()",
                  v: "Returns the generated ids plus fieldState for anything the components above do not cover. Throws when called outside a FormField.",
                },
                {
                  k: "useFormRecovery(form)",
                  v: "See the useFormRecovery section above — this is the hook the rest of this page exists to document.",
                },
              ]}
            />
          ),
        },
        {
          label: "Why there is no FormItem",
          body: (
            <p className="type-small text-muted-foreground">
              Stock shadcn ships a second generation of these primitives —
              FormItem, FormLabel, FormDescription, FormMessage — each
              carrying its own presentation. This system already has that
              presentation in field.tsx, whose FieldError takes react-hook-form&apos;s
              error shape verbatim. So FormLabel here renders FieldLabel and
              adds one attribute: htmlFor. Two vocabularies for one idea is
              what RULES §1.1 forbids; a binding layer over one vocabulary is
              not that. Hoisting FormField&apos;s useId() into the field
              context also removes stock shadcn&apos;s requirement for a
              FormItem wrapper, and makes the ids unique per field{" "}
              <em>instance</em> rather than per field name — several
              independent forms can render on one route without their ids
              colliding.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "The aria wiring is generated once by FormControl rather than typed at each call site, so it cannot be forgotten on any one field.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "aria-invalid + aria-describedby",
                  v: "FormControl sets both automatically from the field's validation state — aria-describedby points at the description while valid, and at description plus error once it is not.",
                },
                {
                  k: "FormError → FieldError",
                  v: "Renders with role=\"alert\" and only when an error exists, so nothing is announced for a field that has never been touched.",
                },
                {
                  k: "Non-<input> controls",
                  v: "Select, Switch, Checkbox and RadioGroup are wired the same way through FormControl's Slot — the id lands on the actually-focusable element (e.g. the Select trigger, not the wrapper).",
                },
                {
                  k: "RadioGroup grouping",
                  v: "Uses FieldSet + FieldLegend rather than FieldLabel's htmlFor, because a RadioGroup container is a div with no single labelable target — a fieldset/legend pair is the correct native grouping.",
                },
                {
                  k: "Focus recovery on a failed submit",
                  v: "useFormRecovery moves both scroll position and keyboard focus to the first invalid field, in DOM order, after the errors have painted — see the useFormRecovery section above. Without it, a long form's first error can be scrolled entirely out of view after submit with no signal beyond a change in text a reader may not be looking at.",
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
        "Form itself intercepts no keys — every field's native behaviour (typing, Space, arrow keys) is untouched. The one keyboard-relevant behaviour Form adds is where focus goes after a failed submit.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Tab / Shift+Tab",
                  v: "Ordinary document-order focus movement between fields, unaffected by Form.",
                },
                {
                  k: "Enter",
                  v: "Native form submission, triggered from any single-line text field inside the <form>.",
                },
                {
                  k: "On a failed submit, with useFormRecovery",
                  v: "Focus moves to the first invalid field in DOM order automatically — see useFormRecovery above. Without useFormRecovery, react-hook-form's own default focus behaviour applies instead, which picks by field registration order rather than DOM order.",
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
        "Form contributes no layout of its own — it renders a plain <form>, and every field inside it is Field's presentation (documented on Field's own Responsive section, including orientation=\"responsive\"'s container-query switch). What Form specifically adds is useFormRecovery's scroll, and that has to work everywhere a form can appear.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "scrollIntoView on a failed submit",
                  v: "useFormRecovery calls the browser's native scrollIntoView on the first invalid field, which works inside any scrollable ancestor — a full-page form, a Dialog's scrollable body, a Sheet — without Form needing to know which container is scrolling.",
                },
                {
                  k: "200% zoom",
                  v: "Nothing in Form fixes a height or clips content; a zoomed field still gets found and focused by aria-invalid, independent of how much taller the form has become.",
                },
                {
                  k: "RTL",
                  v: "Form sets no direction-sensitive layout itself; the fields it wires (Input, Select, Checkbox, ...) each carry their own RTL behaviour, documented on their own pages.",
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
