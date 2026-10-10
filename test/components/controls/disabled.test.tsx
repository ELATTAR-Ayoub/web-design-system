import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { Button } from "@/components/ui/button";
import { Disabled } from "@/components/ui/disabled";

describe("Disabled — native mode (default)", () => {
  it("keeps the child's real disabled attribute", () => {
    render(
      <Disabled disabled reason="Add a payment method to enable this">
        <Button disabled>Withdraw</Button>
      </Disabled>,
    );
    expect(screen.getByRole("button", { name: "Withdraw" })).toBeDisabled();
  });

  it("does not add disabled when the child is not disabled", () => {
    render(
      <Disabled disabled={false}>
        <Button>Withdraw</Button>
      </Disabled>,
    );
    expect(screen.getByRole("button", { name: "Withdraw" })).not.toBeDisabled();
  });

  it("does not fire the underlying action when activation is attempted", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClick = vi.fn();
    render(
      <Disabled disabled reason="Add a payment method to enable this">
        <Button disabled onClick={onClick}>
          Withdraw
        </Button>
      </Disabled>,
    );
    const button = screen.getByRole("button", { name: "Withdraw" });
    await user.tab();
    expect(button).not.toHaveFocus();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("makes the reason reachable by keyboard, beside the dead control", async () => {
    const user = userEvent.setup();
    render(
      <Disabled disabled reason="Add a payment method to enable this">
        <Button disabled>Withdraw</Button>
      </Disabled>,
    );
    // The control itself cannot take focus — it is really disabled.
    const control = screen.getByRole("button", { name: "Withdraw" });
    expect(control).toBeDisabled();

    // The reason trigger is its own, separate focusable element.
    const trigger = screen.getByRole("button", { name: "Why is this disabled" });
    await user.tab();
    expect(trigger).toHaveFocus();

    await user.keyboard("{Enter}");
    const dialog = await screen.findByRole("dialog", {
      name: "Why this is disabled",
    });
    expect(dialog).toHaveTextContent("Add a payment method to enable this");
  });

  it("hides the reason trigger from focus and the accessibility tree when enabled", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Disabled disabled={false} reason="Add a payment method to enable this">
        <Button>Withdraw</Button>
      </Disabled>,
    );
    // aria-hidden removes it from the accessibility tree, so it must be
    // located directly rather than through an accessible-role query.
    const trigger = container.querySelector('[data-slot="popover-trigger"]')!;
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute("aria-hidden", "true");

    await user.tab();
    expect(screen.getByRole("button", { name: "Withdraw" })).toHaveFocus();
  });

  it("associates the reason with the control via aria-describedby", () => {
    render(
      <Disabled disabled reason="Add a payment method to enable this">
        <Button disabled>Withdraw</Button>
      </Disabled>,
    );
    const control = screen.getByRole("button", { name: "Withdraw" });
    const describedBy = control.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const description = document.getElementById(describedBy!);
    expect(description).toHaveTextContent("Add a payment method to enable this");
  });

  it("merges with a pre-existing aria-describedby rather than replacing it", () => {
    render(
      <>
        <span id="existing-hint">Existing hint</span>
        <Disabled disabled reason="Add a payment method to enable this">
          <Button disabled aria-describedby="existing-hint">
            Withdraw
          </Button>
        </Disabled>
      </>,
    );
    const control = screen.getByRole("button", { name: "Withdraw" });
    const describedBy = control.getAttribute("aria-describedby")!;
    expect(describedBy).toContain("existing-hint");
    const ids = describedBy.split(" ");
    expect(ids.length).toBe(2);
  });

  it("keeps the same elements in the same order across the enabled/disabled transition", () => {
    const { container, rerender } = render(
      <Disabled disabled reason="Add a payment method to enable this">
        <Button disabled>Withdraw</Button>
      </Disabled>,
    );
    const before = Array.from(container.querySelectorAll("*")).map((el) =>
      el.tagName.toLowerCase(),
    );

    rerender(
      <Disabled disabled={false} reason="Add a payment method to enable this">
        <Button>Withdraw</Button>
      </Disabled>,
    );
    const after = Array.from(container.querySelectorAll("*")).map((el) =>
      el.tagName.toLowerCase(),
    );

    expect(after).toEqual(before);
  });

  it("has no axe violations disabled with a reason, or enabled", async () => {
    const { container } = render(
      <div>
        <Disabled disabled reason="Add a payment method to enable this">
          <Button disabled>Withdraw</Button>
        </Disabled>
        <Disabled disabled={false} reason="Add a payment method to enable this">
          <Button>Withdraw</Button>
        </Disabled>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Disabled — aria mode (compound widgets)", () => {
  function CompoundOption({
    onClick,
    onKeyDown,
    "aria-describedby": describedBy,
    "aria-disabled": ariaDisabled,
  }: {
    onClick?: React.MouseEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
    "aria-describedby"?: string;
    "aria-disabled"?: boolean;
  }) {
    return (
      <div
        role="option"
        aria-selected={false}
        aria-disabled={ariaDisabled}
        aria-describedby={describedBy}
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        Gold Tier
      </div>
    );
  }

  it("stays focusable and in the tab order — unlike native disabled", async () => {
    const user = userEvent.setup();
    render(
      <Disabled disabled mode="aria" reason="Reach Silver tier first">
        <CompoundOption />
      </Disabled>,
    );
    const option = screen.getByRole("option", { name: "Gold Tier" });
    expect(option).toHaveAttribute("aria-disabled", "true");
    await user.tab();
    expect(option).toHaveFocus();
  });

  it("blocks the click handler and calls onDisabledAttempt instead", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onDisabledAttempt = vi.fn();
    render(
      <Disabled
        disabled
        mode="aria"
        reason="Reach Silver tier first"
        onDisabledAttempt={onDisabledAttempt}
      >
        <CompoundOption onClick={onClick} />
      </Disabled>,
    );
    await user.click(screen.getByRole("option", { name: "Gold Tier" }));
    expect(onClick).not.toHaveBeenCalled();
    expect(onDisabledAttempt).toHaveBeenCalledTimes(1);
  });

  it("blocks Enter and Space activation the same way", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    const onDisabledAttempt = vi.fn();
    render(
      <Disabled
        disabled
        mode="aria"
        reason="Reach Silver tier first"
        onDisabledAttempt={onDisabledAttempt}
      >
        <CompoundOption onKeyDown={onKeyDown} />
      </Disabled>,
    );
    const option = screen.getByRole("option", { name: "Gold Tier" });
    option.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onKeyDown).not.toHaveBeenCalled();
    expect(onDisabledAttempt).toHaveBeenCalledTimes(2);
  });

  it("does not block activation once no longer disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Disabled disabled={false} mode="aria" reason="Reach Silver tier first">
        <CompoundOption onClick={onClick} />
      </Disabled>,
    );
    await user.click(screen.getByRole("option", { name: "Gold Tier" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
