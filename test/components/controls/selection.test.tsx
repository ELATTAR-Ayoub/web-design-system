import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { expectFocusRing } from "../helpers";

describe("Checkbox", () => {
  it("is labelled, keyboard reachable and toggles with Space", async () => {
    const user = userEvent.setup();
    render(
      <div className="flex gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept the terms</Label>
      </div>,
    );
    const box = screen.getByRole("checkbox", { name: "Accept the terms" });

    await user.tab();
    expect(box).toHaveFocus();
    expectFocusRing(box);

    expect(box).toHaveAttribute("aria-checked", "false");
    await user.keyboard(" ");
    expect(box).toHaveAttribute("aria-checked", "true");
    await user.keyboard(" ");
    expect(box).toHaveAttribute("aria-checked", "false");
  });

  it("reports the indeterminate state in ARIA, not only in the glyph", () => {
    render(<Checkbox checked="indeterminate" aria-label="Select all" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "mixed");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox disabled aria-label="Locked" onCheckedChange={onCheckedChange} />,
    );
    await user.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("reclaims a hit area larger than its 20px drawing", () => {
    // RULES §7: a control may be drawn small and give the target back with
    // negative inset. The measured result is asserted in the Playwright suite;
    // this only proves the reclaim exists at all.
    render(<Checkbox aria-label="Accept" />);
    expect(screen.getByRole("checkbox").className).toMatch(/after:-inset/);
  });

  it("has no axe violations at rest, checked, mixed, disabled and invalid", async () => {
    const { container } = render(
      <div>
        <Checkbox id="c1" />
        <Label htmlFor="c1">Rest</Label>
        <Checkbox id="c2" defaultChecked />
        <Label htmlFor="c2">Checked</Label>
        <Checkbox id="c3" checked="indeterminate" />
        <Label htmlFor="c3">Mixed</Label>
        <Checkbox id="c4" disabled />
        <Label htmlFor="c4">Disabled</Label>
        <Checkbox id="c5" aria-invalid aria-describedby="c5e" />
        <Label htmlFor="c5">Invalid</Label>
        <p id="c5e">You must accept the terms.</p>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("RadioGroup", () => {
  const group = (
    <RadioGroup defaultValue="card" aria-label="Payment method">
      <div>
        <RadioGroupItem value="card" id="r-card" />
        <Label htmlFor="r-card">Card</Label>
      </div>
      <div>
        <RadioGroupItem value="bank" id="r-bank" />
        <Label htmlFor="r-bank">Bank transfer</Label>
      </div>
      <div>
        <RadioGroupItem value="crypto" id="r-crypto" />
        <Label htmlFor="r-crypto">Crypto</Label>
      </div>
    </RadioGroup>
  );

  it("is one tab stop and moves the selection with the arrow keys", async () => {
    const user = userEvent.setup();
    render(group);

    await user.tab();
    expect(screen.getByRole("radio", { name: "Card" })).toHaveFocus();
    expectFocusRing(screen.getByRole("radio", { name: "Card" }));

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Bank transfer" })).toHaveFocus();

    // Selection-follows-focus is a real-event-loop behaviour of Radix's roving
    // focus group and does not reproduce under jsdom's synthetic keydown
    // ordering, so it is asserted in the Playwright suite instead. What is
    // asserted here is the keyboard contract that does not depend on it.
    await user.keyboard(" ");
    expect(screen.getByRole("radio", { name: "Bank transfer" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Card" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("has an accessible group name", () => {
    render(group);
    expect(
      screen.getByRole("radiogroup", { name: "Payment method" }),
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(group);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("associates a disabledReason via aria-describedby on a real disabled button", () => {
    render(
      <RadioGroup aria-label="Plan">
        <RadioGroupItem
          value="annual"
          disabled
          disabledReason="Only available on the annual plan."
          aria-label="Annual-only tier"
        />
      </RadioGroup>,
    );
    const radio = screen.getByRole("radio", { name: "Annual-only tier" });
    expect(radio).toBeDisabled();
    const describedBy = radio.getAttribute("aria-describedby");
    expect(describedBy, "the reason must be associated, not merely displayed").toBeTruthy();
    const reason = document.getElementById(describedBy!.split(/\s+/)[0]);
    expect(reason?.textContent).toContain("annual plan");
  });

  it("leaves an item with no disabledReason unwrapped", () => {
    render(
      <RadioGroup aria-label="Plan">
        <RadioGroupItem value="monthly" aria-label="Monthly" />
      </RadioGroup>,
    );
    const radio = screen.getByRole("radio", { name: "Monthly" });
    expect(radio.closest('[data-slot="disabled"]')).toBeNull();
  });
});

describe("Switch", () => {
  it("is a labelled switch that toggles with Space", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Switch id="notify" />
        <Label htmlFor="notify">Email me about new drops</Label>
      </div>,
    );
    const control = screen.getByRole("switch", {
      name: "Email me about new drops",
    });

    await user.tab();
    expect(control).toHaveFocus();
    expectFocusRing(control);

    expect(control).toHaveAttribute("aria-checked", "false");
    await user.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "true");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch disabled aria-label="Locked" onCheckedChange={onCheckedChange} />,
    );
    await user.click(screen.getByRole("switch"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("has no axe violations at rest, on and disabled", async () => {
    const { container } = render(
      <div>
        <Switch aria-label="Off" />
        <Switch defaultChecked aria-label="On" />
        <Switch disabled aria-label="Unavailable" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Slider", () => {
  it("exposes a slider role with a value and moves on the arrow keys", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Slider
        defaultValue={[40]}
        max={100}
        step={1}
        aria-label="Maximum price"
        onValueChange={onValueChange}
      />,
    );
    const thumb = screen.getByRole("slider", { name: "Maximum price" });

    expect(thumb).toHaveAttribute("aria-valuenow", "40");
    await user.tab();
    expect(thumb).toHaveFocus();
    expectFocusRing(thumb);

    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalled();
    expect(thumb).toHaveAttribute("aria-valuenow", "41");
  });

  it("gives a range slider one thumb per value, each separately reachable", async () => {
    const user = userEvent.setup();
    render(
      <Slider
        defaultValue={[20, 80]}
        max={100}
        aria-label="Price range"
      />,
    );
    const thumbs = screen.getAllByRole("slider");
    expect(thumbs).toHaveLength(2);

    await user.tab();
    expect(thumbs[0]).toHaveFocus();
    await user.tab();
    expect(thumbs[1]).toHaveFocus();
  });

  it("reclaims the 44px hit-target floor around a 20px knob", () => {
    render(<Slider defaultValue={[40]} aria-label="Maximum price" />);
    // 20px knob + 12px each side = 44. `-inset-2` would only reach 36.
    expect(screen.getByRole("slider").className).toMatch(/after:-inset-3/);
  });

  it("does not move when disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Slider
        defaultValue={[40]}
        disabled
        aria-label="Maximum price"
        onValueChange={onValueChange}
      />,
    );
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("has no axe violations at rest, range and disabled", async () => {
    const { container } = render(
      <div>
        <Slider defaultValue={[40]} aria-label="Maximum price" />
        <Slider defaultValue={[20, 80]} aria-label="Price range" />
        <Slider defaultValue={[40]} disabled aria-label="Locked price" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
