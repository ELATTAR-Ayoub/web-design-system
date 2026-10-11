/**
 * `Disabled` is a wrapper callers compose — no control self-wraps.
 *
 * This file started life asserting a `disabledReason` prop on `Button` and
 * `SelectTrigger`, each of which routed itself through `Disabled` when the prop
 * was set. That convenience is gone, and the reason is worth recording because
 * it is not a matter of taste:
 *
 * **It made the registry uninstallable.** `Button` importing `Disabled`, while
 * `Disabled` imports `Button` for its own reason trigger, is a cycle. JavaScript
 * tolerates it — the mutual reference only resolves at render time — so nothing
 * failed at runtime, in a typecheck, or in a unit test. `scripts/build-registry.mjs`
 * is what caught it, and it is right to: a registry cannot express
 * `alert-dialog -> button -> disabled -> button`. A consumer installing `button`
 * would need `disabled`, which needs `button`.
 *
 * The layering rule that falls out of it — NARROWED on 2026-09-11, and the
 * narrowing matters: the thing that must never happen is the CYCLE. `Disabled`
 * imports `Button`, `Icon` and `Popover` for its own reason trigger, so those
 * three can never route themselves through it. Every other control can, and
 * the item-shaped ones do: `ComboboxItem`,
 * `CommandItem`, the three menus' items, `RadioGroupItem`, `SelectItem`,
 * `SelectTrigger` and the questionnaire choice all take `disabledReason`,
 * because that is the shared vocabulary for an item's disabled reason, and a caller cannot wrap a Radix menu row from outside without
 * breaking the row's own keyboard semantics. `scripts/build-registry.mjs`
 * still stands guard: a cycle fails the build, and none of those eight is
 * imported by `disabled.tsx`.
 *
 * `SelectTrigger`'s earlier removal was collateral — it was never part of the
 * cycle — and it is back. `Button` stays out, because it IS the cycle.
 *
 * So what is asserted here is the composition contract for `Button`, and —
 * just as importantly — that a disabled control nobody wrapped and nobody gave
 * a reason is completely untouched.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Disabled } from "@/components/ui/disabled";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

describe("a disabled control nobody wrapped is untouched", () => {
  it("renders the plain button, with no wrapper and no extra element", () => {
    const plain = render(<Button disabled>Save</Button>);
    const html = plain.container.innerHTML;
    plain.unmount();

    const again = render(<Button disabled>Save</Button>);
    expect(again.container.innerHTML).toBe(html);
    expect(again.container.querySelectorAll("button")).toHaveLength(1);
    expect(again.container.querySelector('[data-slot="disabled"]')).toBeNull();
  });

  it("keeps the real disabled attribute rather than aria-disabled", () => {
    render(<Button disabled>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button).not.toHaveAttribute("aria-disabled");
  });

  it("adds no extra tab stop", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Button disabled>Save</Button>
        <Button>After</Button>
      </>,
    );
    await user.tab();
    // The disabled button cannot be focused, so the first stop is the one after
    // it. If a wrapper had introduced a focusable reason trigger, this would
    // land there instead.
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });
});

describe("composing Disabled around a control", () => {
  it("keeps the control natively disabled and associates the reason", () => {
    render(
      <Disabled disabled reason="Add a payment method to enable this">
        <Button disabled>Buy</Button>
      </Disabled>,
    );
    const button = screen.getByRole("button", { name: "Buy" });
    expect(button).toBeDisabled();

    const describedBy = button.getAttribute("aria-describedby");
    expect(describedBy, "the reason must be associated, not merely displayed").toBeTruthy();
    const reason = document.getElementById(describedBy!.split(/\s+/)[0]);
    expect(reason?.textContent).toContain("Add a payment method");
  });

  it("does not fire the underlying action", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Disabled disabled reason="Not yet">
        <Button disabled onClick={onClick}>
          Buy
        </Button>
      </Disabled>,
    );
    await user.click(screen.getByRole("button", { name: "Buy" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("wrappers do not break a group's chrome", () => {
  it("ButtonGroup's direct children are still the buttons themselves", () => {
    const { container } = render(
      <ButtonGroup>
        <Button disabled>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    const group = container.querySelector('[data-slot="button-group"]');
    expect(group).not.toBeNull();
    // The joined-border CSS targets direct children. Anything between the group
    // and its buttons silently unjoins them.
    const children = [...group!.children];
    expect(children).toHaveLength(2);
    for (const child of children) expect(child.tagName).toBe("BUTTON");
  });

  it("InputGroup's control is its own direct, unwrapped child", () => {
    const { container } = render(
      <InputGroup>
        <InputGroupInput disabled aria-label="Coupon" />
      </InputGroup>,
    );
    const control = container.querySelector('[data-slot="input-group-control"]');
    expect(control).not.toBeNull();
    expect(control!.tagName).toBe("INPUT");
    expect(control!.closest('[data-slot="disabled"]')).toBeNull();
  });
});

describe("no control imports the Disabled orchestrator", () => {
  // The registry build is the real guard — it fails on a dependency cycle — but
  // that runs outside the unit suite. This is the fast version of the same
  // claim, so the layering breaks here first rather than at release time.
  it("Button exposes no self-wrapping reason prop", () => {
    render(
      // @ts-expect-error — `disabledReason` is deliberately not a Button prop.
      <Button disabled disabledReason="nope">
        Save
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(document.querySelector('[data-slot="disabled"]')).toBeNull();
  });
});
