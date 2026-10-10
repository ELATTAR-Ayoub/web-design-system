import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { Button, ButtonLabel } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";
import { expectFocusRing, expectNoFixedHeight } from "../helpers";

describe("Button", () => {
  it("has an accessible name from its children", () => {
    render(<Button>Open Pack</Button>);
    expect(screen.getByRole("button", { name: "Open Pack" })).toBeInTheDocument();
  });

  it("takes its accessible name from aria-label when icon-only", () => {
    render(
      <Button size="icon" aria-label="Search packs">
        <svg />
      </Button>,
    );
    expect(
      screen.getByRole("button", { name: "Search packs" }),
    ).toBeInTheDocument();
  });

  it("is reachable by Tab and declares a focus-visible ring", async () => {
    const user = userEvent.setup();
    render(<Button>Open Pack</Button>);
    const button = screen.getByRole("button");

    await user.tab();

    expect(button).toHaveFocus();
    expectFocusRing(button);
  });

  it("activates with Enter and with Space", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Open Pack</Button>);

    await user.tab();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("is not focusable and does not activate when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Open Pack
      </Button>,
    );
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    await user.tab();
    expect(button).not.toHaveFocus();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  describe("loading — the component owns the async affordance", () => {
    it("announces busy, disables itself and keeps the label", () => {
      render(<Button loading>Open Pack</Button>);
      const button = screen.getByRole("button", { name: /Open Pack/ });

      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent("Open Pack");
    });

    it("renders a spinner glyph beside the label", () => {
      // The glyph is decoration: `aria-busy` on the button is what a screen
      // reader reads, so the spinner must stay out of the tree. It used to be
      // silent by accident — `Icon` swallowed every prop `Spinner` wrote — and
      // is silent on purpose now: batch 3 made `Icon` forward its props and
      // `Button` passes `aria-hidden` explicitly.
      // The glyph is hosted on the spinner's own `span` now, because a live
      // region has to have content to announce — see `components/ui/spinner.tsx`.
      const { container } = render(<Button loading>Open Pack</Button>);
      const spinner = container.querySelector('button > [data-slot="spinner"]');
      expect(spinner).not.toBeNull();
      expect(spinner).toHaveAttribute("aria-hidden", "true");
      expect(spinner!.querySelector("svg")).not.toBeNull();
      // Silent: no live region, and no words for a screen reader to read.
      expect(spinner!.querySelector(".sr-only")).toBeNull();
      expect(spinner).not.toHaveAttribute("role");
    });

    it("does not fire onClick while loading", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Open Pack
        </Button>,
      );
      await user.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  it("marks itself invalid when aria-invalid is set", () => {
    render(<Button aria-invalid>Open Pack</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-invalid", "true");
  });

  it.each(["sm", "default", "lg", "xl"] as const)(
    "does not pin its height at size=%s",
    (size) => {
      render(<Button size={size}>Open Pack</Button>);
      expectNoFixedHeight(screen.getByRole("button"));
    },
  );

  it("applies no case transformation unless a variant asks for one", () => {
    // Uppercase was removed from every typography ROLE. It survives in exactly
    // one place — `emphasis="caps"` — because case is a decision a component
    // makes about one control, which is what `--tracking-cta` in tokens.css is
    // documented as existing for. This asserts the default has not drifted
    // back into carrying it.
    const { container } = render(<Button variant="premium">Claim Reward</Button>);
    const button = container.querySelector("button")!;
    expect(button.className).not.toMatch(/(?<![\w-])uppercase(?![\w-])/);
  });

  it("truncates a long label through ButtonLabel without widening", () => {
    render(
      <Button>
        <ButtonLabel>Request a withdrawal of the whole balance</ButtonLabel>
      </Button>,
    );
    const label = screen.getByText(/Request a withdrawal/);
    expect(label.className).toMatch(/truncate/);
    expect(label.className).toMatch(/min-w-0/);
  });

  it("has no axe violations at rest, disabled or invalid", async () => {
    const { container } = render(
      <div>
        <Button>Open Pack</Button>
        <Button disabled>Sell All</Button>
        <Button aria-invalid aria-label="Broken action">
          <svg />
        </Button>
        <Button loading>Saving</Button>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ButtonGroup", () => {
  it("exposes itself as a group and keeps every member tabbable", async () => {
    const user = userEvent.setup();
    render(
      <ButtonGroup>
        <Button variant="outline">Newest</Button>
        <Button variant="outline">Price</Button>
        <Button variant="outline">Popularity</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("group")).toBeInTheDocument();

    await user.tab();
    expect(screen.getByRole("button", { name: "Newest" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Price" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Popularity" })).toHaveFocus();
  });

  it("has no axe violations with text and separator members", async () => {
    const { container } = render(
      <ButtonGroup>
        <ButtonGroupText>Quantity</ButtonGroupText>
        <ButtonGroupSeparator />
        <Button variant="outline" size="icon" aria-label="Decrease quantity">
          <svg />
        </Button>
        <Button variant="outline" size="icon" aria-label="Increase quantity">
          <svg />
        </Button>
      </ButtonGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
