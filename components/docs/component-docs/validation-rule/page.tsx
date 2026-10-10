/**
 * Documentation page for `validation-rule`.
 *
 * Authored, not generated. This is deliberately NOT a component and must
 * never become one. Flutter models validation as a registry item — a
 * `ValidationRule` object attached to a field widget. On the web, validation
 * is Zod 4 (a schema library) composed with React Hook Form's `resolver`,
 * both already dependencies of this project (`package.json`: `zod` ^4.4.3,
 * `react-hook-form` ^7.84.0, `@hookform/resolvers` ^5.7.1) and already in
 * real use in `app/design-system/components/base/forms/page.tsx`, since deleted. Wrapping
 * either in a React component to make the two catalogues the same length
 * would ship a file with no behaviour in it — exactly what
 * `lib/ds/platform-contract.ts`'s `package-native` doc comment warns against.
 *
 * See `form` (`/design-system/components/form`) for the accessible-wiring
 * layer — `FormField` / `FieldError` / `aria-describedby` — that consumes
 * whatever a schema like the one below produces.
 */

import { Code, Meta, Note } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "validation-rule",
  omitted: {
    preview: "There is no component to render — a Zod schema is data passed to useForm's resolver, not a placeable element with a visual specimen of its own.",
    api: "Zod's schema API and React Hook Form's resolver contract are documented by their own packages; this page is the mapping between Flutter's ValidationRule and that pattern, not a props table for something this system exports.",
    states: "A schema has no interaction state — hover, focus, loading and disabled all belong to the field widget in form, not to the rule that validates it.",
    accessibility: "The schema itself announces nothing; aria-invalid and aria-describedby are wired by FormField and FieldError in form, documented on that page.",
    keyboard: "A schema is never focused or reached by Tab — the field it validates carries whatever keyboard contract that field's own component has.",
    responsive: "A validation rule has no layout and nothing that reflows, zooms or mirrors — it runs the same parse regardless of viewport.",
  },
  sections: [
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
        "The real pattern this project already uses, drawn from app/design-system/components/base/forms/page.tsx — a Zod schema, wired through zodResolver into useForm, consumed by Form + FormField from components/ui/form.tsx.",
      language: "tsx",
      code: `import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const accountSchema = z.object({
  handle: z
    .string()
    .min(3, "At least 3 characters.")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers and underscores only."),
  email: z.email("That is not an email address."),
});

function AccountForm() {
  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: { handle: "", email: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="handle"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor={field.name}>Handle</FieldLabel>
            <Input id={field.name} {...field} aria-invalid={!!fieldState.error} />
            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
          </Field>
        )}
      />
    </Form>
  );
}`,
    },
    {
      kind: "disclosure",
      id: "mapping",
      title: "What maps to what",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Flutter ValidationRule",
                  v: "A rule object attached to a field widget, evaluated by the field itself.",
                },
                {
                  k: "Web equivalent",
                  v: (
                    <>
                      A <Code>z.object({"{ ... }"})</Code> schema, evaluated by React
                      Hook Form via <Code>zodResolver(schema)</Code> passed to{" "}
                      <Code>useForm</Code>&rsquo;s <Code>resolver</Code> option.
                    </>
                  ),
                },
                {
                  k: "Per-field rule",
                  v: (
                    <>
                      A chained Zod method with its own message —{" "}
                      <Code>.min(3, &quot;At least 3 characters.&quot;)</Code>,{" "}
                      <Code>.regex(/.../, &quot;...&quot;)</Code>, <Code>z.email(&quot;...&quot;)</Code>.
                    </>
                  ),
                },
                {
                  k: "Cross-field rule",
                  v: (
                    <>
                      <Code>.refine((values) =&gt; ..., {"{ message }"})</Code> on the
                      object schema, or on a specific field when the boolean-checkbox
                      case applies — see the &ldquo;refine, not literal(true)&rdquo; note in{" "}
                      <Code>base/forms/page.tsx</Code> for why a required checkbox uses{" "}
                      <Code>z.boolean().refine(...)</Code> rather than{" "}
                      <Code>z.literal(true)</Code>.
                    </>
                  ),
                },
                {
                  k: "Error surface",
                  v: (
                    <>
                      Not part of validation at all — that is <Code>form</Code>&rsquo;s
                      job. <Code>fieldState.error.message</Code> from React Hook Form
                      flows into <Code>FieldError</Code>, which RULES §7 requires
                      alongside <Code>aria-invalid</Code> and <Code>aria-describedby</Code>.
                    </>
                  ),
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why-no-component",
      title: "Why this is not a component",
      blocks: [
        {
          body: (
            <p className="type-body text-muted-foreground">
              A <Code>ValidationRule</Code> React component would have to either
              re-implement what Zod already does — parsing, coercion, composable
              rules, typed inference via <Code>z.infer&lt;typeof schema&gt;</Code> — or
              thinly wrap it for no behavioural gain, purely so the web catalogue
              has an entry shaped like Flutter&rsquo;s. Neither is a component this
              system should ship: the first duplicates a well-tested dependency
              worse, and the second is a file that forwards a schema and does
              nothing else. The honest mapping is documented here instead.
            </p>
          ),
        },
        {
          body: (
            <Note tone="action">
              See the <Code>form</Code> page for the accessible plumbing a validated
              field actually needs at render time — this page is only the rule
              layer underneath it.
            </Note>
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
