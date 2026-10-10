import { describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import * as React from "react";
import { useForm } from "react-hook-form";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormError,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

describe("Field", () => {
  it("labels its control and reads out its description", () => {
    render(
      <Field>
        <FieldLabel htmlFor="handle">Display name</FieldLabel>
        <Input id="handle" aria-describedby="handle-desc" />
        <FieldDescription id="handle-desc">
          Shown on every pull you share.
        </FieldDescription>
      </Field>,
    );
    const input = screen.getByLabelText("Display name");
    expect(input).toHaveAccessibleDescription("Shown on every pull you share.");
  });

  it("announces an error through a live region", () => {
    render(<FieldError>Choose a display name.</FieldError>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Choose a display name.");
  });

  it("renders nothing rather than an empty live region when valid", () => {
    render(<FieldError errors={[]} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("lists more than one error rather than showing only the first", () => {
    render(
      <FieldError
        errors={[
          { message: "Too short." },
          { message: "Must contain a digit." },
          { message: "Too short." },
        ]}
      />,
    );
    // Deduped by message: three in, two out.
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("groups a fieldset under a legend", () => {
    render(
      <FieldSet>
        <FieldLegend>Notifications</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Email</FieldTitle>
              <FieldDescription>Weekly digest.</FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>,
    );
    expect(screen.getByRole("group", { name: /Notifications/ })).toBeInTheDocument();
  });

  it("has no axe violations across rest, described, separated and error", async () => {
    const { container } = render(
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="f1">Display name</FieldLabel>
          <Input id="f1" aria-describedby="f1d" />
          <FieldDescription id="f1d">Shown on every pull.</FieldDescription>
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field data-invalid="true">
          <FieldLabel htmlFor="f2">Email</FieldLabel>
          <Input id="f2" aria-invalid aria-describedby="f2e" />
          <FieldError id="f2e">That address is already registered.</FieldError>
        </Field>
      </FieldGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

/**
 * The real react-hook-form binding, driven through the public API.
 *
 * `onSubmit` is the injectable seam: the same component is handed a resolving
 * promise, a rejecting one and a slow one, so the success, error and loading
 * states are reached by the component's own code path rather than staged.
 */
function ProfileForm({
  onSubmit,
}: {
  onSubmit: (values: { email: string }) => Promise<void>;
}) {
  const form = useForm<{ email: string }>({
    defaultValues: { email: "" },
    criteriaMode: "all",
  });
  const [status, setStatus] = React.useState<"idle" | "saved">("idle");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          setStatus("idle");
          try {
            await onSubmit(values);
            setStatus("saved");
          } catch (error) {
            form.setError("email", {
              type: "server",
              message: (error as Error).message,
            });
          }
        })}
      >
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Enter an email address." }}
          render={({ field }) => (
            <Field>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>We only use it for receipts.</FormDescription>
              <FormError />
            </Field>
          )}
        />
        <Button type="submit" loading={form.formState.isSubmitting}>
          Save Profile
        </Button>
        {status === "saved" && <p role="status">Profile saved.</p>}
      </form>
    </Form>
  );
}

describe("Form — the accessible wiring layer", () => {
  it("binds label, description and control without the call site typing ids", () => {
    render(<ProfileForm onSubmit={async () => {}} />);
    const input = screen.getByLabelText("Email address");
    expect(input).toHaveAccessibleDescription("We only use it for receipts.");
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("marks the control invalid and describes it by the message on a failed validation", async () => {
    const user = userEvent.setup();
    render(<ProfileForm onSubmit={async () => {}} />);

    await user.click(screen.getByRole("button", { name: /Save Profile/ }));

    const input = await screen.findByLabelText("Email address");
    await waitFor(() =>
      expect(input).toHaveAttribute("aria-invalid", "true"),
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter an email address.",
    );
    expect(input).toHaveAccessibleDescription(/Enter an email address\./);
  });

  it("reports a server failure through the same error path", async () => {
    const user = userEvent.setup();
    render(
      <ProfileForm
        onSubmit={async () => {
          throw new Error("That address is already registered.");
        }}
      />,
    );

    await user.type(screen.getByLabelText("Email address"), "a@b.com");
    await user.click(screen.getByRole("button", { name: /Save Profile/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "That address is already registered.",
    );
  });

  it("shows an in-flight affordance while the submit is still running", async () => {
    const user = userEvent.setup();
    // The third arm of the injectable seam: a promise that has not settled, so
    // the assertion happens *during* the submit rather than after it.
    let release!: () => void;
    const slow = new Promise<void>((resolve) => {
      release = resolve;
    });
    render(<ProfileForm onSubmit={() => slow} />);

    await user.type(screen.getByLabelText("Email address"), "a@b.com");
    const submit = screen.getByRole("button", { name: /Save Profile/ });
    await user.click(submit);

    // Two signals, per RULES §5: the control says it heard you (aria-busy, and
    // it refuses a second press), and the outcome arrives separately.
    await waitFor(() => expect(submit).toHaveAttribute("aria-busy", "true"));
    expect(submit).toBeDisabled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    await act(async () => {
      release();
      await slow;
    });

    expect(await screen.findByRole("status")).toHaveTextContent("Profile saved.");
    await waitFor(() => expect(submit).not.toHaveAttribute("aria-busy"));
    expect(submit).toBeEnabled();
  });

  it("confirms the outcome, not only the click, on success", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => {});
    render(<ProfileForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Email address"), "a@b.com");
    await user.click(screen.getByRole("button", { name: /Save Profile/ }));

    expect(await screen.findByRole("status")).toHaveTextContent("Profile saved.");
    expect(onSubmit).toHaveBeenCalledWith({ email: "a@b.com" });
  });

  it("has no axe violations at rest and in the error state", async () => {
    const user = userEvent.setup();
    const { container } = render(<ProfileForm onSubmit={async () => {}} />);
    expect(await axe(container)).toHaveNoViolations();

    await user.click(screen.getByRole("button", { name: /Save Profile/ }));
    await screen.findByRole("alert");
    expect(await axe(container)).toHaveNoViolations();
  });
});
