import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OVERLAY_AXE_OPTIONS } from "../helpers";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

const oddsPopover = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">How odds work</Button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>Per-card odds</PopoverTitle>
        <PopoverDescription>
          Every card in a pack is rolled independently.
        </PopoverDescription>
      </PopoverHeader>
      <Button variant="ghost">Read the full odds</Button>
    </PopoverContent>
  </Popover>
);

describe("Popover", () => {
  it("opens on click and on Enter, and reports aria-expanded", async () => {
    const user = setup();
    render(oddsPopover());
    const trigger = screen.getByRole("button", { name: "How odds work" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("moves focus into the panel and returns it to the trigger on Escape", async () => {
    const user = setup();
    render(oddsPopover());
    const trigger = screen.getByRole("button", { name: "How odds work" });
    await user.click(trigger);
    const panel = await screen.findByRole("dialog");
    await waitFor(() => expect(panel.contains(document.activeElement)).toBe(true));

    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("is a named dialog: PopoverTitle labels it, PopoverDescription describes it", async () => {
    const user = setup();
    render(oddsPopover());
    await user.click(screen.getByRole("button", { name: "How odds work" }));

    /*
     * Radix gives PopoverContent `role="dialog"` and no Title/Description
     * primitive to name it with, so every popover here was an anonymous dialog
     * until popover.tsx grew the wiring. axe called it `aria-dialog-name`.
     */
    const panel = await screen.findByRole("dialog", { name: "Per-card odds" });
    expect(
      document.getElementById(panel.getAttribute("aria-labelledby")!),
    ).toHaveAttribute("data-slot", "popover-title");
    expect(
      document.getElementById(panel.getAttribute("aria-describedby")!),
    ).toHaveAttribute("data-slot", "popover-description");
  });

  it("a title-less popover names itself with aria-label and points at nothing dangling", async () => {
    const user = setup();
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost">Quick sort</Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Quick sort options">
          <Button variant="ghost">Newest</Button>
        </PopoverContent>
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Quick sort" }));
    const panel = await screen.findByRole("dialog", {
      name: "Quick sort options",
    });
    // A stale aria-labelledby names nothing and fails the same axe rule the
    // wiring was added to fix, so it must not be emitted at all.
    expect(panel).not.toHaveAttribute("aria-labelledby");
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });

  it("runs on the anchored scale, not the modal one", async () => {
    const user = setup();
    render(oddsPopover());
    await user.click(screen.getByRole("button", { name: "How odds work" }));
    const cls = (await screen.findByRole("dialog")).getAttribute("class") ?? "";
    // RULES §4: anchored overlays spring open on the system's own
    // anim-open/anim-close (the fourteen-vocabulary entrance every overlay
    // now shares) — never anim-change, and never a pinned duration-* of
    // their own.
    expect(cls).toContain("data-open:anim-open");
    expect(cls).toContain("data-closed:anim-close");
    expect(cls).not.toMatch(/anim-change/);
    expect(cls, "an overlay must not pin its own duration").not.toMatch(
      /(?:^|\s)duration-\d/,
    );
  });

  it("has no axe violations when open", async () => {
    const user = setup();
    render(oddsPopover());
    await user.click(screen.getByRole("button", { name: "How odds work" }));
    await screen.findByRole("dialog");
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

const iconTooltip = () => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Filters">
          <span aria-hidden>≡</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Filter and sort</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

describe("Tooltip", () => {
  it("shows on hover", async () => {
    const user = setup();
    render(iconTooltip());
    await user.hover(screen.getByRole("button", { name: "Filters" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Filter and sort",
    );
  });

  it("shows on keyboard focus, not only on hover — WCAG 1.4.13", async () => {
    const user = setup();
    render(iconTooltip());
    await user.tab();
    expect(screen.getByRole("button", { name: "Filters" })).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  });

  it("is dismissible with Escape while the trigger keeps focus — WCAG 1.4.13", async () => {
    const user = setup();
    render(iconTooltip());
    const trigger = screen.getByRole("button", { name: "Filters" });
    await user.tab();
    await screen.findByRole("tooltip");

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });

  it("is a label, not content: it never traps focus", async () => {
    const user = setup();
    render(iconTooltip());
    await user.tab();
    await screen.findByRole("tooltip");
    // Focus stays on the trigger; a tooltip that stole focus would be a popover.
    expect(screen.getByRole("button", { name: "Filters" })).toHaveFocus();
  });

  it("has no axe violations while shown", async () => {
    const user = setup();
    render(iconTooltip());
    await user.tab();
    await screen.findByRole("tooltip");
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });

  /*
   * RED before the fix: Radix's TooltipPrimitive is pointer/hover-driven
   * only — a touch tap has no hover-intent dwell, so a phone user could never
   * open an icon-only trigger's tooltip at all (see the tooltip audit's
   * `interaction` gap). TooltipTrigger now toggles a controlled open state on
   * a touch-originated pointerdown/pointerup pair, via TooltipOpenContext.
   * jsdom can see the resulting DOM (the tooltip mounting/unmounting); the
   * real device behaviour (dwell timing, layout) is out of scope here and
   * covered live in e2e/gaps-interaction.spec.ts.
   */
  it("opens on a touch tap, with no hover involved", async () => {
    render(iconTooltip());
    const trigger = screen.getByRole("button", { name: "Filters" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    fireEvent.pointerDown(trigger, { pointerType: "touch", pointerId: 1 });
    fireEvent.pointerUp(trigger, { pointerType: "touch", pointerId: 1 });

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Filter and sort",
    );
  });

  it("a second touch tap on the trigger closes it again", async () => {
    render(iconTooltip());
    const trigger = screen.getByRole("button", { name: "Filters" });

    fireEvent.pointerDown(trigger, { pointerType: "touch", pointerId: 2 });
    fireEvent.pointerUp(trigger, { pointerType: "touch", pointerId: 2 });
    await screen.findByRole("tooltip");

    fireEvent.pointerDown(trigger, { pointerType: "touch", pointerId: 2 });
    fireEvent.pointerUp(trigger, { pointerType: "touch", pointerId: 2 });
    await waitFor(() =>
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument(),
    );
  });

  it("a touch tap outside the trigger closes an open tooltip", async () => {
    render(
      <>
        {iconTooltip()}
        <button type="button">elsewhere</button>
      </>,
    );
    const trigger = screen.getByRole("button", { name: "Filters" });
    fireEvent.pointerDown(trigger, { pointerType: "touch", pointerId: 3 });
    fireEvent.pointerUp(trigger, { pointerType: "touch", pointerId: 3 });
    await screen.findByRole("tooltip");

    fireEvent.pointerDown(screen.getByRole("button", { name: "elsewhere" }), {
      pointerType: "touch",
      pointerId: 3,
    });
    await waitFor(() =>
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument(),
    );
  });

  it("mouse hover and keyboard focus are untouched by the touch path", async () => {
    const user = setup();
    render(iconTooltip());
    await user.hover(screen.getByRole("button", { name: "Filters" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Filter and sort",
    );
  });
});

const cardHoverCard = () => (
  <HoverCard openDelay={0} closeDelay={0}>
    <HoverCardTrigger asChild>
      <Button variant="link">Voidwing Ascendant</Button>
    </HoverCardTrigger>
    <HoverCardContent>
      <p>Eclipse Vault · #044 of 250</p>
    </HoverCardContent>
  </HoverCard>
);

describe("HoverCard", () => {
  it("opens on hover", async () => {
    const user = setup();
    render(cardHoverCard());
    await user.hover(screen.getByRole("button", { name: "Voidwing Ascendant" }));
    expect(await screen.findByText("Eclipse Vault · #044 of 250")).toBeVisible();
  });

  it("hover is not the only route: keyboard focus opens it too", async () => {
    const user = setup();
    render(cardHoverCard());
    /*
     * RULES: "Don't make hover the only way to reach information — touch users
     * have no hover." Radix opens a hover card on trigger focus, which is the
     * keyboard half of that guarantee. The other half — that the same content
     * is reachable elsewhere in the product — is a composition rule the
     * specimen states, and cannot be asserted from the primitive.
     */
    await user.tab();
    expect(
      screen.getByRole("button", { name: "Voidwing Ascendant" }),
    ).toHaveFocus();
    expect(await screen.findByText("Eclipse Vault · #044 of 250")).toBeVisible();
  });

  it("has no axe violations when open", async () => {
    const user = setup();
    render(cardHoverCard());
    await user.tab();
    await screen.findByText("Eclipse Vault · #044 of 250");
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});
