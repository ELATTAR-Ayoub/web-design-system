import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { expectFocusRing, expectNoFixedHeight } from "../helpers";

describe("Toggle", () => {
  it("exposes pressed state, not just a colour", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Favourite" />);
    const toggle = screen.getByRole("button", { name: "Favourite" });

    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles with Space and with Enter from the keyboard", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle aria-label="Favourite" onPressedChange={onPressedChange} />);

    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    expectFocusRing(screen.getByRole("button"));

    await user.keyboard(" ");
    await user.keyboard("{Enter}");
    expect(onPressedChange).toHaveBeenCalledTimes(2);
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle disabled aria-label="Favourite" onPressedChange={onPressedChange} />,
    );
    await user.click(screen.getByRole("button"));
    expect(onPressedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it.each(["sm", "default", "lg"] as const)(
    "does not pin its height at size=%s",
    (size) => {
      render(<Toggle size={size} aria-label="Favourite" />);
      expectNoFixedHeight(screen.getByRole("button"));
    },
  );

  it("offers a size that meets the 40px floor for a standalone icon control", () => {
    // RULES §7: an icon-only control never goes below 40px. `default` is 32 and
    // belongs in a toolbar; `lg` is the one a lone toggle should use.
    render(<Toggle size="lg" aria-label="Favourite" />);
    expect(screen.getByRole("button").className).toMatch(/min-h-10/);
    expect(screen.getByRole("button").className).toMatch(/min-w-10/);
  });

  it("has no axe violations across off, on and disabled", async () => {
    const { container } = render(
      <div>
        <Toggle aria-label="Favourite" />
        <Toggle defaultPressed aria-label="Favourite, on" />
        <Toggle disabled aria-label="Favourite, unavailable" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ToggleGroup", () => {
  const group = (
    <ToggleGroup type="single" defaultValue="newest" aria-label="Sort order">
      <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
      <ToggleGroupItem value="price">Price</ToggleGroupItem>
      <ToggleGroupItem value="popular">Popular</ToggleGroupItem>
    </ToggleGroup>
  );

  it("is a single tab stop and moves between options with the arrow keys", async () => {
    const user = userEvent.setup();
    render(group);

    await user.tab();
    expect(screen.getByRole("radio", { name: "Newest" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Price" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Popular" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("radio", { name: "Popular" })).not.toHaveFocus();
  });

  it("carries the selection in ARIA, so it is not colour-only", () => {
    render(group);
    expect(screen.getByRole("radio", { name: "Newest" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Price" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("has an accessible group name", () => {
    render(group);
    expect(screen.getByRole("radiogroup", { name: "Sort order" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(group);
    expect(await axe(container)).toHaveNoViolations();
  });
});
