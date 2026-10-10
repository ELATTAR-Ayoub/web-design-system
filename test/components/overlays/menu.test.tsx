import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { OVERLAY_AXE_OPTIONS, expectNoFixedHeight } from "../helpers";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

const accountMenu = (props: { onSignOut?: () => void } = {}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost">voidwing</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          Wallet
          <DropdownMenuShortcut>$1,204.80</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Favourites</DropdownMenuItem>
        <DropdownMenuItem disabled>Preferences</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onSelect={props.onSignOut}>
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

describe("DropdownMenu", () => {
  it("opens on Enter and on Space, with role menu", async () => {
    const user = setup();
    render(accountMenu());
    const trigger = screen.getByRole("button", { name: "voidwing" });

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());

    await user.keyboard(" ");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("arrow keys move focus between items and skip the disabled one", async () => {
    const user = setup();
    render(accountMenu());
    screen.getByRole("button", { name: "voidwing" }).focus();
    await user.keyboard("{Enter}");
    await screen.findByRole("menu");

    // Enter already lands on the first item — this is Radix's documented
    // "open and focus first" behaviour, not an extra ArrowDown.
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: /Wallet/ })).toHaveFocus(),
    );
    await user.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Favourites" })).toHaveFocus(),
    );
    // "Preferences" is disabled, so the next stop is the destructive item.
    await user.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Sign out" })).toHaveFocus(),
    );
  });

  it("typeahead jumps to an item by its first letters", async () => {
    const user = setup();
    render(accountMenu());
    screen.getByRole("button", { name: "voidwing" }).focus();
    await user.keyboard("{Enter}");
    await screen.findByRole("menu");

    await user.keyboard("fav");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Favourites" })).toHaveFocus(),
    );
  });

  it("a disabled item cannot be activated and says so in ARIA", async () => {
    const user = setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled onSelect={onSelect}>
            Preferences
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const item = await screen.findByRole("menuitem", { name: "Preferences" });
    expect(item).toHaveAttribute("aria-disabled", "true");
    expect(item).toHaveAttribute("data-disabled");
    await user.click(item);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("a disabled item's reason is associated via aria-describedby and cannot be activated", async () => {
    const user = setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            disabled
            disabledReason="Needs an admin role."
            onSelect={onSelect}
          >
            Preferences
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const item = await screen.findByRole("menuitem", { name: "Preferences" });
    const describedBy = item.getAttribute("aria-describedby");
    expect(describedBy, "the reason must be associated, not merely displayed").toBeTruthy();
    const reason = document.getElementById(describedBy!.split(/\s+/)[0]);
    expect(reason?.textContent).toContain("Needs an admin role");

    await user.click(item);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("an enabled item selects and closes the menu, returning focus", async () => {
    const user = setup();
    const onSignOut = vi.fn();
    render(accountMenu({ onSignOut }));
    const trigger = screen.getByRole("button", { name: "voidwing" });
    await user.click(trigger);
    await user.click(await screen.findByRole("menuitem", { name: "Sign out" }));

    expect(onSignOut).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("names the destructive ink, never the raw hue — trap 12", async () => {
    render(accountMenu());
    const cls = (await (async () => {
      const user = setup();
      await user.click(screen.getByRole("button", { name: "voidwing" }));
      return screen.findByRole("menuitem", { name: "Sign out" });
    })()).getAttribute("class") ?? "";
    expect(cls).toMatch(/text-destructive-ink/);
    expect(
      /(?:^|\s|:)text-destructive(?!-ink)/.test(cls),
      `raw text-destructive on a menu glyph: ${cls}`,
    ).toBe(false);
  });

  it("items and label carry no fixed height", async () => {
    const user = setup();
    render(accountMenu());
    await user.click(screen.getByRole("button", { name: "voidwing" }));
    const menu = await screen.findByRole("menu");
    for (const el of Array.from(
      menu.querySelectorAll('[data-slot^="dropdown-menu-"]'),
    )) {
      expectNoFixedHeight(el);
    }
  });

  it("checkbox and radio items report their state", async () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button>Columns</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>Rarity</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Condition</DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="value">
            <DropdownMenuRadioItem value="value">
              Highest value
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="rarity">Rarity floor</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(
      await screen.findByRole("menuitemcheckbox", { name: "Rarity" }),
    ).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("menuitemcheckbox", { name: "Condition" }),
    ).toHaveAttribute("aria-checked", "false");
    expect(
      screen.getByRole("menuitemradio", { name: "Highest value" }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("has no axe violations when open", async () => {
    const user = setup();
    render(accountMenu());
    await user.click(screen.getByRole("button", { name: "voidwing" }));
    await screen.findByRole("menu");
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

const cardContextMenu = () => (
  <ContextMenu>
    <ContextMenuTrigger>
      <div>Voidwing Ascendant</div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem>
        Favourite
        <ContextMenuShortcut>F</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem>Share pull</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive">Sell for $1,240.00</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
);

describe("ContextMenu", () => {
  it("opens on right-click with role menu", async () => {
    const user = setup();
    render(cardContextMenu());
    await user.pointer({
      target: screen.getByText("Voidwing Ascendant"),
      keys: "[MouseRight]",
    });
    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("arrow keys move focus and Escape closes", async () => {
    const user = setup();
    render(cardContextMenu());
    await user.pointer({
      target: screen.getByText("Voidwing Ascendant"),
      keys: "[MouseRight]",
    });
    await screen.findByRole("menu");

    await user.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: /Favourite/ })).toHaveFocus(),
    );
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  it("names the destructive ink on its item", async () => {
    const user = setup();
    render(cardContextMenu());
    await user.pointer({
      target: screen.getByText("Voidwing Ascendant"),
      keys: "[MouseRight]",
    });
    const item = await screen.findByRole("menuitem", {
      name: "Sell for $1,240.00",
    });
    expect(item.getAttribute("class")).toMatch(/text-destructive-ink/);
  });

  it("has no axe violations when open", async () => {
    const user = setup();
    render(cardContextMenu());
    await user.pointer({
      target: screen.getByText("Voidwing Ascendant"),
      keys: "[MouseRight]",
    });
    await screen.findByRole("menu");
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });

  it("a disabled item's reason is associated via aria-describedby", async () => {
    const user = setup();
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem disabled disabledReason="Not available for this card.">
            Sell
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    await user.pointer({
      target: screen.getByText("Right-click me"),
      keys: "[MouseRight]",
    });
    const item = await screen.findByRole("menuitem", { name: "Sell" });
    const describedBy = item.getAttribute("aria-describedby");
    expect(describedBy, "the reason must be associated, not merely displayed").toBeTruthy();
    const reason = document.getElementById(describedBy!.split(/\s+/)[0]);
    expect(reason?.textContent).toContain("Not available for this card");
  });
});

const adminMenubar = () => (
  <Menubar>
    <MenubarMenu>
      <MenubarTrigger>Packs</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>New pack</MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Publish queue</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>Users</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>Search users</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
);

describe("Menubar", () => {
  it("is one tab stop and arrows move between its triggers", async () => {
    const user = setup();
    render(adminMenubar());
    await user.tab();
    const packs = screen.getByRole("menuitem", { name: "Packs" });
    expect(packs).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Users" })).toHaveFocus(),
    );
  });

  it("opens a menu on Enter and closes it on Escape, keeping focus on the trigger", async () => {
    const user = setup();
    render(adminMenubar());
    await user.tab();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("menuitem", { name: "Packs" })).toHaveFocus();
  });

  it("the bar and its triggers grow rather than pinning a height", () => {
    render(adminMenubar());
    expectNoFixedHeight(document.querySelector('[data-slot="menubar"]')!);
    expectNoFixedHeight(
      document.querySelector('[data-slot="menubar-trigger"]')!,
    );
  });

  it("a disabled item is dimmed as well as inert, like every other menu", async () => {
    render(
      <Menubar defaultValue="packs">
        <MenubarMenu value="packs">
          <MenubarTrigger>Packs</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled>New pack</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    const item = await screen.findByRole("menuitem", { name: "New pack" });
    expect(item).toHaveAttribute("aria-disabled", "true");
    // The class is only half the claim; the e2e reads the COMPUTED opacity of
    // this item in the built app, because a class that never compiled looks
    // exactly like this one in jsdom (trap 13).
    expect(item.getAttribute("class")).toMatch(/data-disabled:opacity-50/);
  });

  it("a disabled item's reason is associated via aria-describedby", async () => {
    render(
      <Menubar defaultValue="packs">
        <MenubarMenu value="packs">
          <MenubarTrigger>Packs</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled disabledReason="Publishing is paused.">
              New pack
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    const item = await screen.findByRole("menuitem", { name: "New pack" });
    const describedBy = item.getAttribute("aria-describedby");
    expect(describedBy, "the reason must be associated, not merely displayed").toBeTruthy();
    const reason = document.getElementById(describedBy!.split(/\s+/)[0]);
    expect(reason?.textContent).toContain("Publishing is paused");
  });

  it("closes on the same anchored scale it opens on", async () => {
    const user = setup();
    render(adminMenubar());
    await user.tab();
    await user.keyboard("{Enter}");
    const cls = (await screen.findByRole("menu")).getAttribute("class") ?? "";
    expect(cls).toContain("data-open:anim-open");
    expect(
      cls,
      "an overlay that animates in and not out snaps away on close",
    ).toContain("data-closed:anim-close");
  });

  it("has no axe violations when open", async () => {
    const user = setup();
    render(adminMenubar());
    await user.tab();
    await user.keyboard("{Enter}");
    await screen.findByRole("menu");
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});
