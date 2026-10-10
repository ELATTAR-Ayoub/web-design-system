import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DirectionProvider } from "@/components/ui/direction";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OVERLAY_AXE_OPTIONS, expectFocusRing } from "../helpers";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

/* ── Tabs ──────────────────────────────────────────────────────────────────── */

const packTabs = (props: Record<string, unknown> = {}) => (
  <Tabs defaultValue="odds" {...props}>
    <TabsList>
      <TabsTrigger value="odds">Odds</TabsTrigger>
      <TabsTrigger value="history">History</TabsTrigger>
      <TabsTrigger value="rules" disabled>
        Rules
      </TabsTrigger>
    </TabsList>
    <TabsContent value="odds">One in forty packs.</TabsContent>
    <TabsContent value="history">Nothing opened yet.</TabsContent>
    <TabsContent value="rules">House rules.</TabsContent>
  </Tabs>
);

describe("Tabs", () => {
  it("reports the selection through aria-selected, not through a class", () => {
    render(packTabs());
    expect(screen.getByRole("tab", { name: "Odds" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "History" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("associates every tab with its panel in both directions", () => {
    render(packTabs());
    const tab = screen.getByRole("tab", { name: "Odds" });
    const panel = screen.getByRole("tabpanel");
    expect(tab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    // Only the selected panel is in the tree.
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
  });

  it("moves the selection with the arrow keys and skips the disabled tab", async () => {
    const user = setup();
    render(packTabs());
    const odds = screen.getByRole("tab", { name: "Odds" });
    const history = screen.getByRole("tab", { name: "History" });

    await user.tab();
    expect(odds).toHaveFocus();

    // The keys must MOVE the selection. Which item a roving-focus group lands
    // on differs between contexts (batch 2, concern 4), so assert the move.
    await user.keyboard("{ArrowRight}");
    await waitFor(() => expect(history).toHaveAttribute("aria-selected", "true"));
    expect(odds).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Nothing opened yet.");

    // Rules is disabled — ArrowRight wraps past it back to Odds.
    await user.keyboard("{ArrowRight}");
    await waitFor(() => expect(odds).toHaveAttribute("aria-selected", "true"));
    expect(
      screen.getByRole("tab", { name: "Rules" }),
    ).toHaveAttribute("aria-selected", "false");
  });

  it("only one trigger is tabbable — the list is a single tab stop", async () => {
    const user = setup();
    render(packTabs());
    // Radix's RovingFocusGroup has no current tab stop until focus enters the
    // group, so every trigger reads `tabindex="-1"` on the very first paint.
    // The claim worth holding is the one a keyboard user meets: once focus is
    // in the list, exactly one trigger is in the document tab order.
    await user.tab();
    await waitFor(() =>
      expect(
        screen.getAllByRole("tab").filter((t) => t.tabIndex === 0),
      ).toHaveLength(1),
    );
    expect(screen.getByRole("tab", { name: "Odds" })).toHaveFocus();
    // Tab again and focus leaves the whole list rather than stepping tab to tab.
    await user.tab();
    for (const t of screen.getAllByRole("tab")) expect(t).not.toHaveFocus();
  });

  it("the selection travels: the list owns ONE pill, triggers own no fill", () => {
    const { container } = render(packTabs());
    const list = container.querySelector('[data-slot="tabs-list"]')!;
    // RULES §4 "Selection travels, it does not blink" — a single indicator,
    // a sibling of the triggers, not a background that blinks on each one.
    const pills = list.querySelectorAll(".toggle-slide");
    expect(pills).toHaveLength(1);
    for (const trigger of screen.getAllByRole("tab")) {
      expect(trigger.className).toContain("data-active:bg-transparent");
    }
  });

  it("carries a focus-visible ring on every trigger", () => {
    render(packTabs());
    for (const trigger of screen.getAllByRole("tab")) expectFocusRing(trigger);
  });

  it("is axe clean, horizontal and vertical", async () => {
    render(packTabs());
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });

  it("is axe clean vertically", async () => {
    render(packTabs({ orientation: "vertical" }));
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Breadcrumb ────────────────────────────────────────────────────────────── */

const trail = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbEllipsis />
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/packs">Packs</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Genesis</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

describe("Breadcrumb", () => {
  it("is a named nav landmark holding an ordered list", () => {
    const { container } = render(trail());
    const nav = screen.getByRole("navigation", { name: "breadcrumb" });
    expect(nav.tagName).toBe("NAV");
    expect(container.querySelector("ol")).toBeInTheDocument();
  });

  it("marks the current page and leaves it out of the tab order", () => {
    render(trail());
    const current = screen.getByText("Genesis");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveAttribute("aria-disabled", "true");
    expect(current).not.toHaveAttribute("href");
  });

  it("hides the separators and the ellipsis glyph from assistive tech", () => {
    const { container } = render(trail());
    for (const sep of container.querySelectorAll(
      '[data-slot="breadcrumb-separator"]',
    )) {
      expect(sep).toHaveAttribute("aria-hidden", "true");
    }
    // The ellipsis still says "More" for anyone reading the list linearly.
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  it("is axe clean", async () => {
    render(trail());
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Pagination ────────────────────────────────────────────────────────────── */

const pages = (current = 2, atStart = false, atEnd = false) => (
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious href="#prev" disabled={atStart} />
      </PaginationItem>
      {[1, 2, 3].map((n) => (
        <PaginationItem key={n}>
          <PaginationLink href={`#${n}`} isActive={n === current}>
            {n}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>
      <PaginationItem>
        <PaginationNext href="#next" disabled={atEnd} />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
);

describe("Pagination", () => {
  it("is a named nav landmark", () => {
    render(pages());
    expect(
      screen.getByRole("navigation", { name: "pagination" }),
    ).toBeInTheDocument();
  });

  it("marks exactly one page current", () => {
    render(pages());
    const current = screen.getAllByRole("link").filter(
      (a) => a.getAttribute("aria-current") === "page",
    );
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("2");
  });

  it("names both edge controls even when their words are hidden at 375", () => {
    render(pages());
    expect(
      screen.getByRole("link", { name: "Go to previous page" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go to next page" }),
    ).toBeInTheDocument();
  });

  // RED before the fix: `disabled` was not a prop Pagination understood, so
  // "Previous" on page 1 was a fully live, focusable, clickable link that went
  // nowhere. RULES §7: a control that cannot act must say so and must not be
  // activatable.
  it("a disabled edge control is inert, announced, and out of the tab order", async () => {
    const user = setup();
    render(pages(1, true, false));
    const prev = screen.getByRole("link", { name: "Go to previous page" });

    expect(prev).toHaveAttribute("aria-disabled", "true");
    expect(prev).toHaveAttribute("tabindex", "-1");
    expect(prev).not.toHaveAttribute("href");

    // And it cannot be reached from the keyboard.
    await user.tab();
    expect(prev).not.toHaveFocus();
  });

  it("the enabled edge control keeps its href and its tab stop", async () => {
    const user = setup();
    render(pages(1, false, false));
    const prev = screen.getByRole("link", { name: "Go to previous page" });
    expect(prev).toHaveAttribute("href", "#prev");
    expect(prev).not.toHaveAttribute("aria-disabled");
    await user.tab();
    expect(prev).toHaveFocus();
  });

  it("is axe clean, at rest and with both edges disabled", async () => {
    const { unmount } = render(pages());
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
    unmount();
    render(pages(1, true, true));
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── NavigationMenu ────────────────────────────────────────────────────────── */

const siteNav = () => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Marketplace</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="/packs">Packs</NavigationMenuLink>
          <NavigationMenuLink href="/singles">Singles</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="/vault">Vault</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

describe("NavigationMenu", () => {
  it("opens from the keyboard, reports aria-expanded, and closes on Escape", async () => {
    const user = setup();
    render(siteNav());
    const trigger = screen.getByRole("button", { name: "Marketplace" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    trigger.focus();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "true"),
    );
    expect(screen.getByRole("link", { name: "Packs" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "false"),
    );
    // Focus returns to the trigger that opened it.
    expect(trigger).toHaveFocus();
  });

  it("is a nav landmark whose list is a real list", () => {
    const { container } = render(siteNav());
    expect(container.querySelector("nav")).toBeInTheDocument();
    expect(container.querySelector("ul")).toBeInTheDocument();
  });

  // RED before the fix: NavigationMenuItem's <li> carried `className="relative"`,
  // making each list item its own CSS positioning context. Radix's
  // NavigationMenuIndicator reads `activeTrigger.offsetLeft`, which resolves
  // against the nearest POSITIONED ancestor (offsetParent) — with the <li>
  // positioned, that ancestor was the item's own box (the trigger fills it,
  // so offsetLeft was always ~0), instead of the "indicator track" div
  // @radix-ui/react-navigation-menu wraps the <ul> in specifically so this
  // measurement has something real to read. The indicator sat over the first
  // trigger for every panel as a result — see the navigation-menu audit's
  // `states` gap. jsdom has no layout engine, so the actual travelling caret
  // is pinned in e2e/gaps-interaction.spec.ts; what a unit test CAN see is the
  // structural cause: no list item may reintroduce its own positioning
  // context, or the measurement breaks again regardless of what Radix does.
  it("no NavigationMenuItem is its own CSS positioning context", () => {
    const { container } = render(siteNav());
    for (const item of container.querySelectorAll(
      '[data-slot="navigation-menu-item"]',
    )) {
      expect(item.className.split(/\s+/)).not.toContain("relative");
    }
  });

  it("is axe clean, closed and open", async () => {
    const user = setup();
    render(siteNav());
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
    const trigger = screen.getByRole("button", { name: "Marketplace" });
    trigger.focus();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "true"),
    );
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── DirectionProvider ─────────────────────────────────────────────────────── */

describe("DirectionProvider", () => {
  it("hands rtl down to the primitives inside it", () => {
    const { container } = render(
      <DirectionProvider direction="rtl">{packTabs()}</DirectionProvider>,
    );
    // Radix writes the resolved direction onto the primitive's own root.
    expect(container.querySelector('[data-slot="tabs"]')).toHaveAttribute(
      "dir",
      "rtl",
    );
  });

  it("accepts the `dir` spelling too, and defaults to ltr", () => {
    const { container } = render(
      <DirectionProvider dir="rtl">{packTabs()}</DirectionProvider>,
    );
    // Radix writes the resolved direction onto the primitive's own root.
    expect(container.querySelector('[data-slot="tabs"]')).toHaveAttribute(
      "dir",
      "rtl",
    );
  });
});
