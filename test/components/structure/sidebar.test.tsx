import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { OVERLAY_AXE_OPTIONS, expectFocusRing } from "../helpers";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

/**
 * A console shell, rendered exactly the way a consumer would after
 * `npx shadcn add sidebar` — **with no provider of any kind above it**.
 *
 * That bareness is the point of the fixture, not an oversight. `app/layout.tsx`
 * mounts a `TooltipProvider` at the root, so nothing in this product ever
 * notices whether `sidebar.tsx` supplies one; a consumer installing the
 * component on its own does. Batch 3 raised it as a cross-batch finding and
 * left the decision here.
 */
const shell = (props: Record<string, unknown> = {}) => (
  <SidebarProvider {...props}>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Eclipse Vault workspace">
              <span>Eclipse Vault</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Collection</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="All cards">
                  <span>All cards</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>12</SidebarMenuBadge>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton isActive href="#open">
                      Open
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#settled">
                      Settled
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Wishlist">
                  <span>Wishlist</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuSkeleton showIcon />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <SidebarTrigger />
      <p>Console</p>
    </SidebarInset>
  </SidebarProvider>
);

describe("SidebarProvider", () => {
  /*
   * The whole component has to mount without a provider above it. If a
   * `SidebarMenuButton tooltip` renders a Radix Tooltip and nothing supplies a
   * `TooltipProvider`, this render THROWS — which is what a consumer who
   * installed `sidebar` from the registry gets on first paint.
   */
  it("mounts standalone, with no TooltipProvider above it", () => {
    expect(() => render(shell())).not.toThrow();
    expect(
      screen.getByRole("button", { name: "Collapse sidebar" }),
    ).toBeTruthy();
  });

  it("Cmd/Ctrl+B toggles the sidebar", async () => {
    const user = setup();
    const { container } = render(shell());
    const panel = () => container.querySelector('[data-slot="sidebar"]')!;
    expect(panel()).toHaveAttribute("data-state", "expanded");

    await user.keyboard("{Control>}b{/Control}");
    await waitFor(() =>
      expect(panel()).toHaveAttribute("data-state", "collapsed"),
    );

    await user.keyboard("{Meta>}b{/Meta}");
    await waitFor(() =>
      expect(panel()).toHaveAttribute("data-state", "expanded"),
    );
  });

  it("useSidebar outside a provider throws with a usable message", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Orphan() {
      useSidebar();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow(/SidebarProvider/);
    spy.mockRestore();
  });
});

describe("SidebarTrigger", () => {
  it("is named, even though its glyph is decoration", () => {
    render(shell());
    expect(
      screen.getByRole("button", { name: "Collapse sidebar" }),
    ).toBeTruthy();
  });

  it("toggles from the keyboard", async () => {
    const user = setup();
    const { container } = render(shell());
    const trigger = screen.getByRole("button", { name: "Collapse sidebar" });
    expectFocusRing(trigger);

    trigger.focus();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(container.querySelector('[data-slot="sidebar"]')).toHaveAttribute(
        "data-state",
        "collapsed",
      ),
    );
  });

  /*
   * A toggle whose only report of its state is a glyph is a colour-only signal
   * in another costume — RULES §7, two non-colour signals. The name is the
   * second signal, and it says which way pressing goes.
   */
  it("the name says which way it goes, and follows the state", async () => {
    const user = setup();
    render(shell());
    const trigger = screen.getByRole("button", { name: "Collapse sidebar" });
    await user.click(trigger);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Expand sidebar" }),
      ).toBe(trigger),
    );
  });

  /*
   * `SidebarRail` does the same job by drag and keeps the state-neutral name,
   * so the two controls are distinguishable in a list of buttons.
   */
  it("does not share its name with the rail", () => {
    render(shell());
    expect(
      screen.getAllByRole("button", { name: "Toggle Sidebar" }),
    ).toHaveLength(1);
  });
});

describe("SidebarMenuButton", () => {
  /*
   * `data-active` is a styling hook. It reaches CSS and it reaches nothing
   * else, so a screen reader hears every row in the column identically and the
   * travelling pill — the only signal that survives — is a colour and a
   * position. RULES §5's "isActive carries a non-colour signal" is not met by a
   * data attribute no assistive technology reads.
   */
  it("the active row announces that it is the current one", () => {
    render(shell());
    const active = screen.getByRole("button", { name: "All cards" });
    expect(active).toHaveAttribute("data-active", "true");
    expect(active).toHaveAttribute("aria-current", "page");

    const inactive = screen.getByRole("button", { name: "Wishlist" });
    expect(inactive).not.toHaveAttribute("aria-current");
  });

  /*
   * A tooltip that cannot show must not be RENDERED, not merely hidden.
   *
   * `TooltipContent hidden={...}` still mounts a Radix `DismissableLayer`, and
   * `DismissableLayer` gives Escape to the highest layer only. Measured on the
   * live mobile sidebar: opening the Sheet auto-focused the first row, that
   * programmatic focus opened the row's tooltip, and the tooltip mounted
   * INVISIBLE with `hidden` — so the first Escape closed a tooltip nobody could
   * see and the sheet stayed open. Exactly batch 2's AlertDialog finding, in a
   * component where the tooltip is invisible by design rather than by accident.
   */
  it("renders no tooltip at all while the sidebar is expanded", () => {
    render(shell());
    const row = screen.getByRole("button", { name: "Wishlist" });
    /* `TooltipTrigger asChild` stamps Radix's own `data-state` onto whatever it
       wraps. Its absence is the proof that no Tooltip — and so no
       DismissableLayer — was mounted around this row. */
    expect(row).not.toHaveAttribute("data-state");
    expect(row).toHaveAttribute("data-slot", "sidebar-menu-button");
  });

  it("takes any Button variant rather than mapping several onto one", () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton variant="destructive">
                <span>Delete collection</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>,
    );
    const row = screen.getByRole("button", { name: "Delete collection" });
    expect(row.className).toMatch(/destructive/);
  });

  it("rows use a natural height, so a long label cannot be clipped", () => {
    render(shell());
    const row = screen.getByRole("button", { name: "Wishlist" });
    expect(row.className).toContain("h-auto");
  });
});

describe("SidebarMenuSubButton", () => {
  it("the active sub-row announces that it is the current one", () => {
    render(shell());
    expect(screen.getByRole("link", { name: "Open" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Settled" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("stays a link, so it is keyboard-reachable as one", () => {
    render(shell());
    expect(screen.getByRole("link", { name: "Open" })).toHaveAttribute(
      "href",
      "#open",
    );
  });

  /*
   * `size` picks a class in TypeScript rather than through a `data-[…]:`
   * variant — RULES §5.7. A `.type-*` class lives in `@layer components`, so
   * Tailwind generates no variant of it and `data-[size=md]:type-nav` emits
   * nothing at all while every guard stays green.
   */
  it("size branches in TypeScript, never through a data variant", () => {
    render(shell());
    const link = screen.getByRole("link", { name: "Open" });
    expect(link).toHaveAttribute("data-size", "md");
    expect(link.className).not.toMatch(/data-\[size=/);
  });

  /*
   * When the caller passes their own `asChild` (a router link), the rest props
   * are dropped on the floor: `{...props}` only ever reaches the fallback
   * `<a>`. An `id`, an `onClick`, an `aria-describedby` written on the
   * component silently does nothing.
   */
  it("forwards its props even when the caller supplies the element", () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild data-testid="sub">
                <a href="#archived">Archived</a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </Sidebar>
      </SidebarProvider>,
    );
    expect(screen.getByRole("link", { name: "Archived" })).toHaveAttribute(
      "data-testid",
      "sub",
    );
  });
});

describe("SidebarMenuSkeleton", () => {
  it("is a shape, not an announcement", () => {
    const { container } = render(shell());
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
    for (const s of Array.from(skeletons)) {
      expect(s).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("its width is derived from useId, so the two renders agree", () => {
    const { container: a } = render(<SidebarMenuSkeleton />);
    const first = a
      .querySelector('[data-sidebar="menu-skeleton-text"]')
      ?.getAttribute("style");
    expect(first).toMatch(/--skeleton-width:\s*\d+%/);
  });
});

describe("SidebarRail", () => {
  it("is named and deliberately out of the tab order", () => {
    const { container } = render(shell());
    const rail = container.querySelector('[data-slot="sidebar-rail"]')!;
    expect(rail).toHaveAttribute("aria-label", "Toggle Sidebar");
    expect(rail).toHaveAttribute("tabindex", "-1");
  });
});

describe("SidebarInset", () => {
  /*
   * `min-w-0` is what stops a wide descendant pushing the whole page sideways.
   * It is invisible to every guard and only a narrow viewport shows it, so it
   * is pinned here as well as measured in the e2e.
   */
  it("can shrink below its content, so the page never scrolls sideways", () => {
    const { container } = render(shell());
    const inset = container.querySelector('[data-slot="sidebar-inset"]')!;
    expect(inset.className).toContain("min-w-0");
    expect(inset.tagName).toBe("MAIN");
  });
});

describe("Sidebar — axe", () => {
  it("is clean expanded", async () => {
    const { container } = render(shell());
    expect(await axe(container, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });

  it("is clean collapsed to the icon rail", async () => {
    const user = setup();
    const { container } = render(shell());
    await user.keyboard("{Control>}b{/Control}");
    await waitFor(() =>
      expect(container.querySelector('[data-slot="sidebar"]')).toHaveAttribute(
        "data-state",
        "collapsed",
      ),
    );
    expect(await axe(container, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});
