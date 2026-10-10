"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormDescription,
  FormError,
  FormField,
  FormLabel,
} from "@/components/ui/form";
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
    toast.success(`Saved as @${values.handle}`);
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
}
