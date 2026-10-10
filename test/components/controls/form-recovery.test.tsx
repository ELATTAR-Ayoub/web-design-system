import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormError,
  FormField,
  FormLabel,
  useFormRecovery,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

/**
 * The schema declares `email` before `name`, so a resolver populates
 * `formState.errors` in that order (Zod key order). The form renders `name`
 * first. Any implementation that reveals "the first error" by reading
 * `errors` or the schema would land on email; DOM order says name.
 */
const schema = z.object({
  email: z.string().min(1, "Enter an email address."),
  name: z.string().min(1, "Enter your name."),
});

type Values = z.infer<typeof schema>;

function OrderMismatchForm({
  onSubmit,
}: {
  onSubmit: (values: Values) => void;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
    shouldFocusError: false,
  });
  const { formRef, handleSubmit } = useFormRecovery(form);

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <Field>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormError />
            </Field>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <Field>
              <FormLabel>Email address</FormLabel>
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
}

const nestedSchema = z.object({
  address: z.object({
    city: z.string().min(1, "Enter a city."),
  }),
});

function NestedFieldForm({
  onSubmit,
}: {
  onSubmit: (values: z.infer<typeof nestedSchema>) => void;
}) {
  const form = useForm<z.infer<typeof nestedSchema>>({
    resolver: zodResolver(nestedSchema),
    defaultValues: { address: { city: "" } },
    shouldFocusError: false,
  });
  const { formRef, handleSubmit } = useFormRecovery(form);

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="address.city"
          render={({ field }) => (
            <Field>
              <FormLabel>City</FormLabel>
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
}

const planSchema = z.object({
  plan: z.string().min(1, "Choose a plan."),
});

/**
 * A compound control: `FormControl` stamps `aria-invalid` onto
 * `RadioGroup`'s root — a `role="radiogroup"` `<div>`, never focusable —
 * so the real target has to be found among its descendants.
 */
function CompoundControlForm({
  onSubmit,
}: {
  onSubmit: (values: z.infer<typeof planSchema>) => void;
}) {
  const form = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: { plan: "" },
    shouldFocusError: false,
  });
  const { formRef, handleSubmit } = useFormRecovery(form);

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <Field>
              <FormLabel>Plan</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  name={field.name}
                >
                  <Field orientation="horizontal">
                    <RadioGroupItem value="starter" id="plan-starter" />
                    <FieldLabel htmlFor="plan-starter">Starter</FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem value="pro" id="plan-pro" />
                    <FieldLabel htmlFor="plan-pro">Pro</FieldLabel>
                  </Field>
                </RadioGroup>
              </FormControl>
              <FormError />
            </Field>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}

const setSchema = z.object({
  set: z.string().min(1, "Choose a set."),
});

/**
 * `ComboboxInput` returns the `InputGroup` chassis, not the `<input>`
 * inside it — the second shape of compound control, where the invalid
 * element is a plain, non-focusable wrapper `<div>` rather than a
 * `role="group"` container.
 */
function ComboboxCompoundForm({
  onSubmit,
}: {
  onSubmit: (values: z.infer<typeof setSchema>) => void;
}) {
  const form = useForm<z.infer<typeof setSchema>>({
    resolver: zodResolver(setSchema),
    defaultValues: { set: "" },
    shouldFocusError: false,
  });
  const { formRef, handleSubmit } = useFormRecovery(form);

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="set"
          render={({ field }) => (
            <Field>
              <FormLabel>Set</FormLabel>
              <Combobox
                items={["Eclipse Vault", "Golden Rift"]}
                value={field.value || null}
                onValueChange={(value: string | null) =>
                  field.onChange(value ?? "")
                }
              >
                {/* `Combobox` (the Root) renders no DOM element of its own —
                    it is a context provider — so `FormControl` has to wrap
                    `ComboboxInput`, the piece that actually renders the
                    chassis `aria-invalid` lands on. */}
                <FormControl>
                  <ComboboxInput aria-label="Set" />
                </FormControl>
                <ComboboxContent>
                  <ComboboxList>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FormError />
            </Field>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}

describe("useFormRecovery", () => {
  // A spy left mocked by an assertion that throws mid-test (`scrollIntoView`
  // or `focus` in particular) would otherwise leak into the next test and
  // silently break `userEvent`'s own focus-dependent typing — restore
  // unconditionally rather than relying on each test's own cleanup running.
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reveals the failure messages on a failed submit", async () => {
    const user = userEvent.setup();
    render(<OrderMismatchForm onSubmit={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Enter your name.")).toBeInTheDocument();
    expect(
      await screen.findByText("Enter an email address."),
    ).toBeInTheDocument();
  });

  it("focuses the first invalid field in DOM order, not schema or errors order", async () => {
    const user = userEvent.setup();
    render(<OrderMismatchForm onSubmit={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    // Sanity check on the premise: the resolver's `errors` really does come
    // back in schema order (email, then name) — the opposite of the DOM.
    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email address");
    await waitFor(() => {
      expect(nameInput).toHaveAttribute("aria-invalid", "true");
      expect(emailInput).toHaveAttribute("aria-invalid", "true");
    });

    await waitFor(() => expect(nameInput).toHaveFocus());
    expect(emailInput).not.toHaveFocus();
  });

  it("scrolls before it focuses, and focuses only after the reveal has painted", async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    const scrollSpy = vi
      .spyOn(Element.prototype, "scrollIntoView")
      .mockImplementation(function (this: Element) {
        // The message is already in the DOM by the time the scroll fires.
        order.push(
          screen.queryByText("Enter your name.")
            ? "scroll-after-reveal"
            : "scroll-before-reveal",
        );
      });
    const focusSpy = vi
      .spyOn(HTMLElement.prototype, "focus")
      .mockImplementation(function (this: HTMLElement) {
        // The click itself moves native focus onto the submit button before
        // any of this runs — real browser behaviour, and not what this test
        // is about. Only the recovered field's own focus belongs in `order`.
        if (this.tagName.toLowerCase() === "input") {
          order.push(`focus:${this.tagName.toLowerCase()}`);
        }
      });

    render(<OrderMismatchForm onSubmit={() => {}} />);
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(order).toContain("focus:input"));

    expect(order[0]).toBe("scroll-after-reveal");
    expect(order[order.length - 1]).toBe("focus:input");

    scrollSpy.mockRestore();
    focusSpy.mockRestore();
  });

  it("scrolls smoothly by default", async () => {
    const user = userEvent.setup();
    const scrollSpy = vi
      .spyOn(Element.prototype, "scrollIntoView")
      .mockImplementation(() => {});

    render(<OrderMismatchForm onSubmit={() => {}} />);
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(scrollSpy).toHaveBeenCalled());
    expect(scrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth", block: "center" }),
    );

    scrollSpy.mockRestore();
  });

  it("scrolls instantly under prefers-reduced-motion instead of smoothly", async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (query: string): MediaQueryList =>
      ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList;

    const user = userEvent.setup();
    const scrollSpy = vi
      .spyOn(Element.prototype, "scrollIntoView")
      .mockImplementation(() => {});

    render(<OrderMismatchForm onSubmit={() => {}} />);
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(scrollSpy).toHaveBeenCalled());
    expect(scrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "auto", block: "center" }),
    );

    scrollSpy.mockRestore();
    window.matchMedia = originalMatchMedia;
  });

  it("reaches a nested field (address.city)", async () => {
    const user = userEvent.setup();
    render(<NestedFieldForm onSubmit={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    const cityInput = await screen.findByLabelText("City");
    await waitFor(() => expect(cityInput).toHaveAttribute("aria-invalid", "true"));
    await waitFor(() => expect(cityInput).toHaveFocus());
  });

  it("focuses a compound control's real focusable element (RadioGroup)", async () => {
    const user = userEvent.setup();
    render(<CompoundControlForm onSubmit={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByText("Choose a plan.");
    const starter = screen.getByRole("radio", { name: "Starter" });
    // The invalid attribute lands on the group, not the radio itself — the
    // radiogroup wrapper is what carries it and what is not focusable.
    const group = screen.getByRole("radiogroup");
    await waitFor(() => expect(group).toHaveAttribute("aria-invalid", "true"));
    await waitFor(() => expect(starter).toHaveFocus());
  });

  it("focuses a compound control's real focusable element (Combobox)", async () => {
    const user = userEvent.setup();
    render(<ComboboxCompoundForm onSubmit={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByText("Choose a set.");
    const input = screen.getByRole("combobox", { name: "Set" });
    await waitFor(() => expect(input).toHaveFocus());
  });

  it("carries the message on the announcement region", async () => {
    const user = userEvent.setup();
    render(<OrderMismatchForm onSubmit={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    const alerts = await screen.findAllByRole("alert");
    const texts = alerts.map((el) => el.textContent);
    expect(texts).toContain("Enter your name.");
    expect(texts).toContain("Enter an email address.");
  });

  it("does not run the recovery flow on a successful submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const scrollSpy = vi
      .spyOn(Element.prototype, "scrollIntoView")
      .mockImplementation(() => {});

    render(<NestedFieldForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("City"), "Cairo");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        { address: { city: "Cairo" } },
        expect.anything(),
      ),
    );
    expect(scrollSpy).not.toHaveBeenCalled();

    scrollSpy.mockRestore();
  });
});
