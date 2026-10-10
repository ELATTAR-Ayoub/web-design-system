import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Calendar } from "@/components/ui/calendar";
import { expectFocusRing } from "../helpers";

const SETS = ["Eclipse Vault", "Golden Rift", "Neon Drift"];

function SetCombobox({ disabled = false }: { disabled?: boolean }) {
  return (
    <Combobox items={SETS}>
      <ComboboxInput
        placeholder="Search card sets"
        aria-label="Card set"
        disabled={disabled}
      />
      <ComboboxContent>
        <ComboboxEmpty>No matching set.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

describe("Combobox", () => {
  it("is a named, keyboard-reachable combobox", async () => {
    const user = userEvent.setup();
    render(<SetCombobox />);
    const input = screen.getByRole("combobox", { name: "Card set" });

    await user.tab();
    expect(input).toHaveFocus();
    expectFocusRing(input);
  });

  it("filters as you type and reaches its empty state", async () => {
    const user = userEvent.setup();
    render(<SetCombobox />);

    await user.click(screen.getByRole("combobox", { name: "Card set" }));
    await user.keyboard("Golden");
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Golden Rift" })).toBeInTheDocument(),
    );
    expect(screen.queryByRole("option", { name: "Neon Drift" })).not.toBeInTheDocument();

    await user.clear(screen.getByRole("combobox", { name: "Card set" }));
    await user.keyboard("zzzz");
    await waitFor(() =>
      expect(screen.getByText("No matching set.")).toBeInTheDocument(),
    );
  });

  it("does not take focus when disabled", async () => {
    const user = userEvent.setup();
    render(<SetCombobox disabled />);
    await user.tab();
    expect(screen.getByRole("combobox", { name: "Card set" })).not.toHaveFocus();
  });

  it("has no axe violations closed or disabled", async () => {
    const { container } = render(
      <div>
        <SetCombobox />
        <SetCombobox disabled />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("associates a disabled item's reason via aria-describedby, always on", async () => {
    render(
      <Combobox items={SETS} open>
        <ComboboxInput aria-label="Card set" />
        <ComboboxContent>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem
                key={item}
                value={item}
                disabled={item === "Golden Rift"}
                disabledReason={
                  item === "Golden Rift" ? "Retired — not printed since the last rotation." : undefined
                }
              >
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );

    const option = await screen.findByRole("option", { name: "Golden Rift" });
    const describedBy = option.getAttribute("aria-describedby");
    expect(describedBy, "the reason must be associated, not merely displayed").toBeTruthy();
    const reason = document.getElementById(describedBy!.split(/\s+/)[0]);
    expect(reason?.textContent).toContain("Retired");

    // An enabled sibling row carries no reason wrapper at all.
    const enabledOption = screen.getByRole("option", { name: "Eclipse Vault" });
    expect(enabledOption.closest('[data-slot="disabled"]')).toBeNull();
  });
});

describe("Calendar", () => {
  it("exposes a grid of day buttons with accessible names", () => {
    render(
      <Calendar
        mode="single"
        month={new Date(2026, 8, 1)}
        selected={new Date(2026, 8, 4)}
      />,
    );
    expect(screen.getByRole("grid")).toBeInTheDocument();
    // A day cell is a real button, so a keyboard and a screen reader can use it.
    expect(screen.getAllByRole("button").length).toBeGreaterThan(20);
  });

  it("moves between days with the arrow keys and selects with Enter", async () => {
    const user = userEvent.setup();
    let picked: Date | undefined;
    render(
      <Calendar
        mode="single"
        month={new Date(2026, 8, 1)}
        selected={new Date(2026, 8, 4)}
        onSelect={(d) => {
          picked = d;
        }}
      />,
    );

    const day4 = screen.getByRole("button", {
      name: /Friday, September 4th, 2026/,
    });
    day4.focus();
    await user.keyboard("{ArrowRight}");
    await user.keyboard("{Enter}");

    await waitFor(() => expect(picked).toBeInstanceOf(Date));
  });

  it("marks the selected day in ARIA and in its name, not only with a fill", () => {
    const { container } = render(
      <Calendar
        mode="single"
        month={new Date(2026, 8, 1)}
        selected={new Date(2026, 8, 4)}
      />,
    );
    // Trap 11: a fill is one signal. The gridcell carries `aria-selected` and
    // the day button's own accessible name ends in "selected".
    expect(container.querySelectorAll('[role="gridcell"][aria-selected="true"]'))
      .toHaveLength(1);
    expect(
      screen.getByRole("button", { name: /September 4th, 2026, selected/ }),
    ).toBeInTheDocument();
  });

  it("does not select a disabled day", async () => {
    const user = userEvent.setup();
    let picked: Date | undefined;
    render(
      <Calendar
        mode="single"
        month={new Date(2026, 8, 1)}
        disabled={{ before: new Date(2026, 8, 10) }}
        onSelect={(d) => {
          picked = d;
        }}
      />,
    );
    const day4 = screen.getByRole("button", {
      name: /Friday, September 4th, 2026/,
    });
    await user.click(day4);
    expect(picked).toBeUndefined();
  });

  it("groups its month stepper without publishing a duplicate landmark", () => {
    const { container } = render(
      <div>
        <Calendar mode="single" month={new Date(2026, 8, 1)} />
        <Calendar mode="single" month={new Date(2026, 9, 1)} />
      </div>,
    );
    // The element stays a `<nav>`; what it stops being is a landmark.
    expect(container.querySelectorAll('nav[role="none"]')).toHaveLength(2);
    expect(container.querySelectorAll("nav[aria-label]")).toHaveLength(0);
    // The controls inside keep their own names.
    expect(
      screen.getAllByRole("button", { name: /Previous Month/i }),
    ).toHaveLength(2);
  });

  it("has no axe violations in single and range mode", async () => {
    const { container } = render(
      <div>
        <Calendar mode="single" month={new Date(2026, 8, 1)} />
        <Calendar
          mode="range"
          month={new Date(2026, 8, 1)}
          selected={{ from: new Date(2026, 8, 4), to: new Date(2026, 8, 9) }}
        />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
