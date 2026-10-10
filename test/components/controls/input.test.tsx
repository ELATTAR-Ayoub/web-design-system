import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { expectFocusRing, expectNoFixedHeight } from "../helpers";

describe("Input", () => {
  it("takes its accessible name from an associated Label", () => {
    render(
      <>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" />
      </>,
    );
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
  });

  it("is reachable by Tab, accepts typing, and declares a focus ring", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Email address" />);
    const input = screen.getByRole("textbox");

    await user.tab();
    expect(input).toHaveFocus();
    expectFocusRing(input);

    await user.keyboard("a@b.com");
    expect(input).toHaveValue("a@b.com");
  });

  it("does not take focus or accept typing when disabled", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Email address" disabled />);
    const input = screen.getByRole("textbox");

    await user.tab();
    expect(input).not.toHaveFocus();
    await user.type(input, "nope");
    expect(input).toHaveValue("");
  });

  it("wires the error state: aria-invalid plus a described message", async () => {
    const { container } = render(
      <>
        <Label htmlFor="pw">Password</Label>
        <Input id="pw" aria-invalid aria-describedby="pw-error" />
        <p id="pw-error">Passwords must be at least twelve characters.</p>
      </>,
    );
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(
      "Passwords must be at least twelve characters.",
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("does not pin its height, so it can grow to the target floor", () => {
    render(<Input aria-label="Email address" />);
    expectNoFixedHeight(screen.getByRole("textbox"));
  });

  it("has no axe violations at rest and disabled", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="a">Search</Label>
        <Input id="a" placeholder="Search packs" />
        <Label htmlFor="b">Locked</Label>
        <Input id="b" disabled />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Textarea", () => {
  it("is labelled, typeable and keyboard reachable", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="note">Note</Label>
        <Textarea id="note" />
      </>,
    );
    const area = screen.getByLabelText("Note");
    await user.tab();
    expect(area).toHaveFocus();
    expectFocusRing(area);
    await user.keyboard("hello");
    expect(area).toHaveValue("hello");
  });

  it("has no axe violations at rest, disabled and invalid", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="t1">Note</Label>
        <Textarea id="t1" />
        <Label htmlFor="t2">Locked note</Label>
        <Textarea id="t2" disabled />
        <Label htmlFor="t3">Broken note</Label>
        <Textarea id="t3" aria-invalid aria-describedby="t3e" />
        <p id="t3e">Say something.</p>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("InputGroup", () => {
  it("keeps the control labelled and the addon button separately reachable", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Site address" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Clear address" onClick={onClick}>
            <svg />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
    );

    await user.tab();
    expect(screen.getByLabelText("Site address")).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Clear address" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalled();
  });

  it("does not pin its height, so a textarea inside it can grow", () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Search" />
      </InputGroup>,
    );
    expectNoFixedHeight(screen.getByRole("group"));
  });

  it("has no axe violations with an input or a textarea control", async () => {
    const { container } = render(
      <div>
        <InputGroup>
          <InputGroupInput aria-label="Search" />
        </InputGroup>
        <InputGroup>
          <InputGroupTextarea aria-label="Message" />
        </InputGroup>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("InputOTP", () => {
  it("accepts typed digits into its slots and is keyboard reachable", async () => {
    const user = userEvent.setup();
    render(
      <InputOTP maxLength={4} aria-label="One-time code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>,
    );

    await user.tab();
    const field = screen.getByRole("textbox");
    expect(field).toHaveFocus();

    await user.keyboard("1234");
    expect(field).toHaveValue("1234");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <InputOTP maxLength={2} aria-label="One-time code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("InputGroup — what dims it", () => {
  it("dims only when its own control is disabled, not when a button inside it is", () => {
    const { container } = render(
      <InputGroup>
        <InputGroupInput aria-label="Message" />
        <button disabled type="button">
          Send
        </button>
      </InputGroup>,
    );
    const group = container.querySelector("[data-slot=input-group]")!;
    // A disabled Send in an empty prompt box faded the whole box (has-disabled).
    expect(group.className).not.toMatch(/(^|\s)has-disabled:opacity-50(\s|$)/);
    expect(group.className).toContain("has-[[data-slot=input-group-control]:disabled]:opacity-50");
  });
});
