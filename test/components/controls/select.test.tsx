import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { expectFocusRing, expectNoFixedHeight } from "../helpers";

const sortSelect = (props: { disabled?: boolean; invalid?: boolean } = {}) => (
  <Select>
    <SelectTrigger
      aria-label="Sort order"
      disabled={props.disabled}
      aria-invalid={props.invalid}
    >
      <SelectValue placeholder="Newest first" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Order</SelectLabel>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="price">Price</SelectItem>
        <SelectItem value="popular">Popular</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

describe("Select", () => {
  it("has an accessible name and a combobox role", () => {
    render(sortSelect());
    expect(
      screen.getByRole("combobox", { name: "Sort order" }),
    ).toBeInTheDocument();
  });

  it("opens from the keyboard and closes on Escape, returning focus", async () => {
    const user = userEvent.setup();
    render(sortSelect());
    const trigger = screen.getByRole("combobox", { name: "Sort order" });

    await user.tab();
    expect(trigger).toHaveFocus();
    expectFocusRing(trigger);

    await user.keyboard("{Enter}");
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });

  it("selects an option with the keyboard and reports it in the trigger", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger aria-label="Sort order">
          <SelectValue placeholder="Newest first" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price">Price</SelectItem>
        </SelectContent>
      </Select>,
    );

    await user.tab();
    await user.keyboard("{Enter}");
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    await waitFor(() => expect(onValueChange).toHaveBeenCalled());
  });

  it("does not open when disabled and is not focusable", async () => {
    const user = userEvent.setup();
    render(sortSelect({ disabled: true }));
    const trigger = screen.getByRole("combobox", { name: "Sort order" });

    expect(trigger).toBeDisabled();
    await user.tab();
    expect(trigger).not.toHaveFocus();
    await user.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not pin the trigger height", () => {
    render(sortSelect());
    expectNoFixedHeight(screen.getByRole("combobox"));
  });

  it("has no axe violations closed, disabled and invalid", async () => {
    const { container } = render(
      <div>
        {sortSelect()}
        {sortSelect({ disabled: true })}
        {sortSelect({ invalid: true })}
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("associates a disabledReason on the trigger via aria-describedby, native mode", () => {
    render(
      <Select disabled>
        <SelectTrigger aria-label="Sort order" disabledReason="Add items to your cart to sort them.">
          <SelectValue placeholder="Newest first" />
        </SelectTrigger>
        <SelectContent />
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "Sort order" });
    expect(trigger).toBeDisabled();
    const describedBy = trigger.getAttribute("aria-describedby");
    expect(describedBy, "the reason must be associated, not merely displayed").toBeTruthy();
    const reason = document.getElementById(describedBy!.split(/\s+/)[0]);
    expect(reason?.textContent).toContain("Add items to your cart");
  });

  it("associates a disabled item's reason via aria-describedby, aria mode", async () => {
    render(
      <Select open>
        <SelectTrigger aria-label="Sort order">
          <SelectValue placeholder="Newest first" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price" disabled disabledReason="Not enough data yet.">
            Price
          </SelectItem>
        </SelectContent>
      </Select>,
    );
    const option = await screen.findByRole("option", { name: "Price" });
    const describedBy = option.getAttribute("aria-describedby");
    expect(describedBy, "the reason must be associated, not merely displayed").toBeTruthy();
    const reason = document.getElementById(describedBy!.split(/\s+/)[0]);
    expect(reason?.textContent).toContain("Not enough data yet");
  });
});

describe("NativeSelect", () => {
  it("is labelled, keyboard reachable and reports its value", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="country">Country</Label>
        <NativeSelect id="country" defaultValue="uk">
          <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
          <NativeSelectOption value="ma">Morocco</NativeSelectOption>
        </NativeSelect>
      </>,
    );
    const select = screen.getByLabelText("Country");

    await user.tab();
    expect(select).toHaveFocus();
    expectFocusRing(select);

    await user.selectOptions(select, "ma");
    expect(select).toHaveValue("ma");
  });

  it("does not take focus when disabled", async () => {
    const user = userEvent.setup();
    render(
      <NativeSelect aria-label="Country" disabled>
        <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
      </NativeSelect>,
    );
    await user.tab();
    expect(screen.getByRole("combobox")).not.toHaveFocus();
  });

  it("does not pin its height and sits on the same 40px ladder as Select", () => {
    render(
      <NativeSelect aria-label="Country">
        <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
      </NativeSelect>,
    );
    const select = screen.getByRole("combobox");
    expectNoFixedHeight(select);
    // 40 at `default`, 32 at `sm` — the ladder `SelectTrigger` uses. It was 32
    // and 28, which put a native select below its own sibling control.
    expect(select.className).toMatch(/min-h-10/);
    expect(select.className).toMatch(/data-\[size=sm\]:min-h-8/);
  });

  it("has no axe violations, including with an option group", async () =>{
    const { container } = render(
      <div>
        <Label htmlFor="n1">Country</Label>
        <NativeSelect id="n1">
          <NativeSelectOptGroup label="Europe">
            <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
        <Label htmlFor="n2">Locked</Label>
        <NativeSelect id="n2" disabled>
          <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
        </NativeSelect>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Command — the searching selector", () => {
  const palette = (
    <Command label="Command palette">
      <CommandInput placeholder="Search actions" />
      <CommandList>
        <CommandEmpty>No matching action.</CommandEmpty>
        <CommandGroup heading="Packs">
          <CommandItem value="open">Open Pack</CommandItem>
          <CommandItem value="sell">Sell Selected</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );

  it("filters as you type and reaches its empty state", async () => {
    const user = userEvent.setup();
    render(palette);

    const input = screen.getByPlaceholderText("Search actions");
    await user.click(input);
    await user.keyboard("sell");

    await waitFor(() =>
      expect(screen.queryByText("Open Pack")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Sell Selected")).toBeInTheDocument();

    await user.clear(input);
    await user.keyboard("zzzz");
    await waitFor(() =>
      expect(screen.getByText("No matching action.")).toBeInTheDocument(),
    );
  });

  it("moves the active option with the arrow keys", async () => {
    const user = userEvent.setup();
    render(palette);
    const input = screen.getByPlaceholderText("Search actions");
    await user.click(input);

    await waitFor(() =>
      expect(
        screen.getByRole("option", { name: "Open Pack" }),
      ).toHaveAttribute("data-selected", "true"),
    );

    await user.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(
        screen.getByRole("option", { name: "Sell Selected" }),
      ).toHaveAttribute("data-selected", "true"),
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(palette);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("associates a disabled item's reason via aria-describedby, always on", () => {
    render(
      <Command label="Command palette">
        <CommandInput placeholder="Search actions" />
        <CommandList>
          <CommandGroup heading="Packs">
            <CommandItem
              value="sell"
              disabled
              disabledReason="Sold out — restocks next rotation."
            >
              Sell Selected
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );
    const option = screen.getByText("Sell Selected").closest('[data-slot="command-item"]')!;
    const describedBy = option.getAttribute("aria-describedby");
    expect(describedBy, "the reason must be associated, not merely displayed").toBeTruthy();
    const reason = document.getElementById(describedBy!.split(/\s+/)[0]);
    expect(reason?.textContent).toContain("Sold out");
  });

  it("leaves an item with no disabledReason unwrapped", () => {
    render(palette);
    const option = screen.getByRole("option", { name: "Open Pack" });
    expect(option.closest('[data-slot="disabled"]')).toBeNull();
  });
});
