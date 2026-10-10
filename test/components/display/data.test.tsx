import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { PackageIcon } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/ui/user-menu";
import {
  Sidebar,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Stat, StatDeltaMark } from "@/components/ui/stat";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ActiveIndicator,
  useActiveIndicator,
} from "@/components/ui/active-indicator";
import { OVERLAY_AXE_OPTIONS, expectNoFixedHeight } from "../helpers";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

/* ── Table ─────────────────────────────────────────────────────────────────── */

const ledger = (withCaption = true) => (
  <Table>
    {withCaption && <TableCaption>Recent vault movements</TableCaption>}
    <TableHeader>
      <TableRow>
        <TableHead scope="col">Card</TableHead>
        <TableHead scope="col">Grade</TableHead>
        <TableHead scope="col">Paid</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Genesis Holo</TableCell>
        <TableCell>Grade 9</TableCell>
        <TableCell>$1,240.00</TableCell>
      </TableRow>
      <TableRow data-state="selected">
        <TableCell>Second Print</TableCell>
        <TableCell>Grade 8</TableCell>
        <TableCell>$412.00</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell>Total</TableCell>
        <TableCell />
        <TableCell>$1,652.00</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
);

describe("Table", () => {
  it("is a real table with real header cells, not a grid of divs", () => {
    render(ledger());
    const table = screen.getByRole("table");
    expect(table.tagName).toBe("TABLE");
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
    expect(screen.getAllByRole("row")).toHaveLength(4);
  });

  it("takes its accessible name from its caption", () => {
    render(ledger());
    expect(
      screen.getByRole("table", { name: "Recent vault movements" }),
    ).toBeInTheDocument();
  });

  it("takes an aria-label where a visible caption would be noise", () => {
    render(
      <Table aria-label="Vault movements">
        <TableBody>
          <TableRow>
            <TableCell>Genesis Holo</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(
      screen.getByRole("table", { name: "Vault movements" }),
    ).toBeInTheDocument();
  });

  // The responsive contract: cells never wrap, so the container has to scroll
  // rather than the page. Measured in the Playwright suite at 375; asserted
  // structurally here so a refactor cannot drop the wrapper.
  it("owns a horizontal scroll container so the PAGE never scrolls sideways", () => {
    const { container } = render(ledger());
    const wrapper = container.querySelector('[data-slot="table-container"]')!;
    expect(wrapper.className).toContain("overflow-x-auto");
    expect(wrapper.querySelector("table")).not.toBeNull();
  });

  it("reports a selected row as data, not only as a fill", () => {
    const { container } = render(ledger());
    expect(
      container.querySelectorAll('[data-slot="table-row"][data-state="selected"]'),
    ).toHaveLength(1);
  });

  it("is axe clean, with and without a caption", async () => {
    const { unmount } = render(ledger());
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
    unmount();
    render(
      <Table aria-label="Vault movements">
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Card</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Genesis Holo</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Stat ──────────────────────────────────────────────────────────────────── */

describe("Stat", () => {
  it("sets the figure in a numeric role, not in body type", () => {
    const { container } = render(<Stat label="Revenue" value="$12,480" />);
    const figure = container.querySelector(".type-number-lg")!;
    expect(figure).toHaveTextContent("$12,480");
    expect(container.querySelector(".type-badge")).toHaveTextContent("Revenue");
  });

  // RULES §5 "A delta is a shape before it is a hue" — three signals before
  // colour is considered.
  it("carries the direction as a shape, a sign and a word before any colour", () => {
    const { container } = render(
      <Stat
        label="Revenue"
        value="$12,480"
        delta={{ value: "8.2%", direction: "up" }}
        hint="vs last month"
      />,
    );
    const mark = container.querySelector('[data-slot="stat-delta"]')!;
    // 1. shape
    expect(mark.querySelector("svg")).not.toBeNull();
    expect(mark).toHaveAttribute("data-direction", "up");
    // 2. sign
    expect(mark).toHaveTextContent("+8.2%");
    // 3. word
    expect(mark).toHaveTextContent("Up,");
  });

  it("writes the minus sign, not a hyphen, so a column of deltas stays aligned", () => {
    const { container } = render(
      <StatDeltaMark
        delta={{ value: "4.0%", direction: "down" }}
        betterWhen="up"
      />,
    );
    expect(container.textContent).toContain("−");
  });

  it("never renders a fall as an error — betterWhen decides the tone", () => {
    const { container, unmount } = render(
      <StatDeltaMark
        delta={{ value: "4.0%", direction: "down" }}
        betterWhen="up"
      />,
    );
    const unfavourable = container.querySelector('[data-slot="stat-delta"]')!;
    expect(unfavourable.className).toContain("text-foreground");
    expect(unfavourable.className).not.toContain("destructive");
    unmount();

    // Churn improves by falling: the same delta, favourable.
    const second = render(
      <StatDeltaMark
        delta={{ value: "4.0%", direction: "down" }}
        betterWhen="down"
      />,
    );
    expect(
      second.container.querySelector('[data-slot="stat-delta"]')!.className,
    ).toContain("text-success-ink");
  });

  it("holds its footprint while loading, with a Skeleton and not a spinner", () => {
    const { container } = render(
      <Stat
        label="Revenue"
        value="$12,480"
        delta={{ value: "8.2%", direction: "up" }}
        state="loading"
      />,
    );
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons).toHaveLength(2);
    // Inside a <p>, so it must be a span — RULES §5, and invalid HTML that
    // every guard in this repo passes otherwise.
    for (const s of skeletons) expect(s.tagName).toBe("SPAN");
    // The label is chrome you already know; it stays real text so the box
    // cannot move.
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("swaps once — anim-enter on the arriving figure, nothing on the way out", () => {
    const { container } = render(<Stat label="Revenue" value="$12,480" />);
    const swapped = container.querySelectorAll(".anim-enter");
    expect(swapped).toHaveLength(1);
    expect(swapped[0]).toHaveTextContent("$12,480");
  });

  it("says what failed, and does not print a number it does not have", () => {
    render(
      <Stat
        label="Revenue"
        value="$12,480"
        state="error"
        message="Could not reach the ledger"
      />,
    );
    expect(screen.getByText("Could not reach the ledger")).toBeInTheDocument();
    expect(screen.queryByText("$12,480")).not.toBeInTheDocument();
    expect(screen.getByText("No value")).toBeInTheDocument();
  });

  it("says why there is nothing yet when it is empty", () => {
    render(
      <Stat label="Revenue" value="—" state="empty" message="No sales yet" />,
    );
    expect(screen.getByText("No sales yet")).toBeInTheDocument();
  });

  it("announces disabled rather than only dimming", () => {
    const { container } = render(
      <Stat label="Revenue" value="$12,480" disabled />,
    );
    const root = container.querySelector('[data-slot="stat"]')!;
    expect(root).toHaveAttribute("aria-disabled", "true");
    expect(root.className).toContain("opacity-45");
  });

  it("is axe clean in every state", async () => {
    for (const state of ["ready", "loading", "error", "empty"] as const) {
      const { unmount } = render(
        <Stat
          label="Revenue"
          value="$12,480"
          delta={{ value: "8.2%", direction: "up" }}
          state={state}
          message="Could not reach the ledger"
        />,
      );
      expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
      unmount();
    }
  });
});

/* ── Item ──────────────────────────────────────────────────────────────────── */

const itemList = () => (
  <ItemGroup>
    <Item variant="outline">
      <ItemMedia variant="icon">
        <PackageIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Genesis Pack</ItemTitle>
        <ItemDescription>Twelve cards, one guaranteed holo.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">
          Open
        </Button>
      </ItemActions>
    </Item>
    <ItemSeparator />
    <Item asChild variant="outline">
      <a href="/packs/second">
        <ItemContent>
          <ItemTitle>Second Print</ItemTitle>
        </ItemContent>
      </a>
    </Item>
  </ItemGroup>
);

describe("Item", () => {
  it("is a list to assistive tech, not a stack of anonymous divs", () => {
    render(itemList());
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("becomes the control when asChild and keeps the row's own hover surface", () => {
    render(itemList());
    const link = screen.getByRole("link", { name: "Second Print" });
    expect(link).toHaveAttribute("data-slot", "item");
    // The hover surface is keyed to what the row IS — [a] and [button] — so a
    // call site never has to paste `hover:bg-muted` back in.
    expect(link.className).toContain("[a]:hover:bg-muted");
    expect(link.className).toContain("[button]:hover:bg-muted");
  });

  it("carries a focus-visible ring on the row itself", () => {
    render(itemList());
    expect(
      screen.getByRole("link", { name: "Second Print" }).className,
    ).toContain("focus-visible:ring");
  });

  // RED before the fix: `React.Children.map` runs its callback for `null`,
  // `undefined` and `false` as well as for real elements, so the wrapper this
  // batch added turned every `{condition && <Item/>}` into an EMPTY
  // `role="listitem"`. A list that reports three rows and shows one is worse
  // than the empty list the wrapper was added to fix.
  it("does not invent list items out of conditional children", () => {
    const show = false;
    const { container } = render(
      <ItemGroup>
        {show && (
          <Item>
            <ItemContent>
              <ItemTitle>Hidden</ItemTitle>
            </ItemContent>
          </Item>
        )}
        {null}
        <Item>
          <ItemContent>
            <ItemTitle>Genesis Pack</ItemTitle>
          </ItemContent>
        </Item>
        {undefined}
      </ItemGroup>,
    );
    const listitems = container.querySelectorAll('[role="listitem"]');
    expect(listitems).toHaveLength(1);
    expect(listitems[0]).toHaveTextContent("Genesis Pack");
  });

  it("is reachable from the keyboard: the row's action first, then the row", async () => {
    const user = setup();
    render(itemList());
    await user.tab();
    expect(screen.getByRole("button", { name: "Open" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Second Print" })).toHaveFocus();
  });

  it("pins no fixed height — the row grows with its description", () => {
    const { container } = render(itemList());
    for (const el of container.querySelectorAll('[data-slot="item"]')) {
      expectNoFixedHeight(el);
    }
  });

  it("is axe clean", async () => {
    render(itemList());
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Carousel ──────────────────────────────────────────────────────────────── */

const carousel = () => (
  <Carousel aria-label="Featured packs">
    <CarouselContent>
      {["Genesis", "Second Print", "Vault"].map((name) => (
        <CarouselItem key={name} aria-label={name}>
          {name}
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
);

describe("Carousel", () => {
  it("declares itself a carousel of labelled slides", () => {
    render(carousel());
    const region = screen.getByRole("region", { name: "Featured packs" });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    const slides = screen.getAllByRole("group");
    expect(slides).toHaveLength(3);
    for (const slide of slides) {
      expect(slide).toHaveAttribute("aria-roledescription", "slide");
    }
  });

  it("names both arrows in words, not in a glyph alone", () => {
    render(carousel());
    expect(
      screen.getByRole("button", { name: "Previous slide" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next slide" }),
    ).toBeInTheDocument();
  });

  it("disables the arrow that has nowhere to go", () => {
    render(carousel());
    // Embla does not lay out in jsdom, so neither direction can scroll: what
    // matters is that "cannot scroll" reaches the DOM as a real `disabled`
    // rather than as an unusable but live button.
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
  });

  it("moves with the arrow keys, and swallows the key so the page does not scroll", () => {
    const { container } = render(carousel());
    const region = container.querySelector('[data-slot="carousel"]')! as HTMLElement;
    region.focus();
    // The handler is on the region in the capture phase; assert it is bound
    // rather than asserting a slide index embla cannot compute here.
    const event = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
      cancelable: true,
    });
    region.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("is axe clean", async () => {
    render(carousel());
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── ActiveIndicator ───────────────────────────────────────────────────────── */

function Group() {
  const { containerRef, indicatorRef, arrivalRef } = useActiveIndicator();
  return (
    <div ref={containerRef} className="relative">
      <ActiveIndicator indicatorRef={indicatorRef} arrivalRef={arrivalRef} />
      <button type="button" data-state="on">
        One
      </button>
      <button type="button" data-state="off">
        Two
      </button>
    </div>
  );
}

describe("ActiveIndicator", () => {
  it("is one pill, hidden from assistive tech — the selection is on the option", () => {
    const { container } = render(<Group />);
    const pills = container.querySelectorAll(".toggle-slide");
    expect(pills).toHaveLength(1);
    expect(pills[0]).toHaveAttribute("aria-hidden");
  });

  it("lands on the selected option rather than parking at the origin", async () => {
    const { container } = render(<Group />);
    // jsdom reports every rect as 0×0, so the measurement itself cannot be
    // checked here — it is measured live in the Playwright suite. What IS
    // checkable is that the effect ran and made the pill visible, i.e. it found
    // an active option through `data-state`.
    await waitFor(() =>
      expect(
        (container.querySelector(".toggle-slide") as HTMLElement).style.opacity,
      ).toBe("1"),
    );
  });

  it("hides itself when nothing is selected", async () => {
    function Empty() {
      const { containerRef, indicatorRef, arrivalRef } = useActiveIndicator();
      return (
        <div ref={containerRef}>
          <ActiveIndicator indicatorRef={indicatorRef} arrivalRef={arrivalRef} />
          <button type="button" data-state="off">
            One
          </button>
        </div>
      );
    }
    const { container } = render(<Empty />);
    await waitFor(() =>
      expect(
        (container.querySelector(".toggle-slide") as HTMLElement).style.opacity,
      ).toBe("0"),
    );
  });
});

/* ── UserMenu ──────────────────────────────────────────────────────────────── */

const account = {
  name: "Ayoub Elattar",
  email: "ayoub@example.com",
};

function AccountRow({ onSignOut = () => {} }: { onSignOut?: () => void }) {
  /* `TooltipProvider` is not optional here, and this is where that becomes
     visible: `SidebarMenuButton tooltip` renders a Radix Tooltip, and this
     repo's `SidebarProvider` — unlike stock shadcn's — does not wrap its
     children in one. The app supplies it at the root layout instead, so
     nothing in the product notices. Recorded as a cross-batch finding for
     batch 4, which owns `sidebar.tsx`. */
  return (
    <TooltipProvider>
    <SidebarProvider>
      <Sidebar>
        <SidebarFooter>
          <UserMenu
            user={account}
            items={[
              { label: "Account", icon: <PackageIcon /> },
              { label: "Sign out", icon: <PackageIcon />, destructive: true, onSelect: onSignOut },
            ]}
          />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
    </TooltipProvider>
  );
}

describe("UserMenu", () => {
  it("shows the identity in the trigger, falling back to initials", () => {
    render(<AccountRow />);
    const trigger = screen.getByRole("button", { name: /Ayoub Elattar/ });
    expect(trigger).toBeInTheDocument();
    // No avatar image was given, so the fallback is what stands in for it.
    expect(screen.getAllByText("AE").length).toBeGreaterThan(0);
  });

  it("opens from the keyboard and repeats the identity at the top of the menu", async () => {
    const user = setup();
    render(<AccountRow />);
    const trigger = screen.getByRole("button", { name: /Ayoub Elattar/ });
    trigger.focus();
    await user.keyboard("{Enter}");
    const menu = await screen.findByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(
      screen.getAllByText("ayoub@example.com").length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("fires an item, and keeps the destructive one last", async () => {
    const user = setup();
    const onSignOut = vi.fn();
    render(<AccountRow onSignOut={onSignOut} />);
    screen.getByRole("button", { name: /Ayoub Elattar/ }).focus();
    await user.keyboard("{Enter}");
    const items = await screen.findAllByRole("menuitem");
    expect(items.at(-1)).toHaveTextContent("Sign out");
    expect(items.at(-1)).toHaveAttribute("data-variant", "destructive");
    await user.click(items.at(-1)!);
    expect(onSignOut).toHaveBeenCalled();
  });

  it("is axe clean with the account menu open", async () => {
    const user = setup();
    render(<AccountRow />);
    screen.getByRole("button", { name: /Ayoub Elattar/ }).focus();
    await user.keyboard("{Enter}");
    await screen.findByRole("menu");
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});
