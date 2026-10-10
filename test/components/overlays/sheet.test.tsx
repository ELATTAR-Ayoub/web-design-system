import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { OVERLAY_AXE_OPTIONS, expectNoFixedHeight } from "../helpers";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

const filterSheet = (side: "left" | "right" | "top" | "bottom" = "right") => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline">Filters</Button>
    </SheetTrigger>
    <SheetContent side={side}>
      <SheetHeader>
        <SheetTitle>Filter packs</SheetTitle>
        <SheetDescription>184 packs match your filters.</SheetDescription>
      </SheetHeader>
      <SheetBody>
        <label htmlFor="rarity">Rarity floor</label>
        <input id="rarity" />
      </SheetBody>
      <SheetFooter>
        <Button>Apply filters</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

describe("Sheet", () => {
  it("opens on click and on Enter, and carries role dialog with a name", async () => {
    const user = setup();
    render(filterSheet());
    const trigger = screen.getByRole("button", { name: "Filters" });

    await user.click(trigger);
    expect(
      await screen.findByRole("dialog", { name: "Filter packs" }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("is described by SheetDescription", async () => {
    const user = setup();
    render(filterSheet());
    await user.click(screen.getByRole("button", { name: "Filters" }));
    const sheet = await screen.findByRole("dialog");
    const id = sheet.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)).toHaveAttribute(
      "data-slot",
      "sheet-description",
    );
  });

  it("moves focus in and returns it to the trigger on Escape", async () => {
    const user = setup();
    render(filterSheet());
    const trigger = screen.getByRole("button", { name: "Filters" });
    await user.click(trigger);
    const sheet = await screen.findByRole("dialog");
    await waitFor(() => expect(sheet.contains(document.activeElement)).toBe(true));

    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("stays open when a toast's action is pressed, and still closes on any other outside press", async () => {
    const user = setup();
    render(
      <>
        {filterSheet()}
        <ol data-sonner-toaster="">
          <li>
            <button type="button">Undo</button>
          </li>
        </ol>
        <button type="button">Elsewhere</button>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Filters" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByText("Undo"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByText("Elsewhere"));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("exposes the three zones and a close button", async () => {
    const user = setup();
    render(filterSheet());
    await user.click(screen.getByRole("button", { name: "Filters" }));
    const sheet = await screen.findByRole("dialog");

    for (const slot of ["sheet-header", "sheet-footer", "sheet-close"]) {
      expect(
        sheet.querySelector(`[data-slot="${slot}"]`),
        `Sheet should publish a ${slot} part`,
      ).not.toBeNull();
    }
    expect(
      screen.getByRole("button", { name: "Close" }),
    ).toBeInTheDocument();
    expectNoFixedHeight(sheet.querySelector('[data-slot="sheet-header"]')!);
  });

  it("scrolls its own body rather than letting content escape the panel", async () => {
    const user = setup();
    render(filterSheet());
    await user.click(screen.getByRole("button", { name: "Filters" }));
    const sheet = await screen.findByRole("dialog");

    /*
     * A sheet is full-height with a pinned header and an `mt-auto` footer. If
     * nothing in between is allowed to scroll, a taller-than-viewport body
     * pushes the footer — the Apply button — off screen with no way to reach
     * it. The panel therefore has to declare a scrolling region; the rendered
     * proof that it works is in the e2e at 375x812.
     */
    const body = sheet.querySelector('[data-slot="sheet-body"]');
    expect(body, "Sheet has no scrolling middle zone").not.toBeNull();
    const cls = body!.getAttribute("class") ?? "";
    expect(cls).toMatch(/overflow-y-auto/);
    // `min-h-0` is what lets a flex child shrink below its content; without it
    // `flex-1 overflow-y-auto` grows the column and the footer still leaves.
    expect(cls).toMatch(/min-h-0/);
    expect(
      sheet.querySelector('[data-slot="sheet-footer"]')!.getAttribute("class"),
    ).toMatch(/shrink-0/);
  });

  it("has no axe violations when open, on every side", async () => {
    for (const side of ["left", "right", "top", "bottom"] as const) {
      const user = setup();
      const { unmount } = render(filterSheet(side));
      await user.click(screen.getByRole("button", { name: "Filters" }));
      await screen.findByRole("dialog");
      expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
      unmount();
    }
  });
});

const cardDrawer = () => (
  <Drawer>
    <DrawerTrigger asChild>
      <Button variant="secondary">Card actions</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Voidwing Ascendant</DrawerTitle>
        <DrawerDescription>Eclipse Vault · #044 · Legendary</DrawerDescription>
      </DrawerHeader>
      <DrawerBody>
        <Button variant="premium">Sell for $1,240.00</Button>
      </DrawerBody>
      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="ghost">Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);

describe("Drawer", () => {
  it("opens from the keyboard and is named by DrawerTitle", async () => {
    const user = setup();
    render(cardDrawer());
    screen.getByRole("button", { name: "Card actions" }).focus();
    await user.keyboard("{Enter}");

    expect(
      await screen.findByRole("dialog", { name: /Voidwing Ascendant/ }),
    ).toBeInTheDocument();
  });

  it("is described by DrawerDescription", async () => {
    const user = setup();
    render(cardDrawer());
    await user.click(screen.getByRole("button", { name: "Card actions" }));
    const drawer = await screen.findByRole("dialog");
    const id = drawer.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)).toHaveAttribute(
      "data-slot",
      "drawer-description",
    );
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = setup();
    render(cardDrawer());
    const trigger = screen.getByRole("button", { name: "Card actions" });
    await user.click(trigger);
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("exposes header, body and footer parts", async () => {
    const user = setup();
    render(cardDrawer());
    await user.click(screen.getByRole("button", { name: "Card actions" }));
    const drawer = await screen.findByRole("dialog");
    for (const slot of ["drawer-header", "drawer-body", "drawer-footer"]) {
      expect(
        drawer.querySelector(`[data-slot="${slot}"]`),
        `Drawer should publish a ${slot} part`,
      ).not.toBeNull();
    }
    expectNoFixedHeight(drawer.querySelector('[data-slot="drawer-header"]')!);
  });

  it("has a keyboard route out — the drag handle is not the only dismissal", async () => {
    const user = setup();
    render(cardDrawer());
    await user.click(screen.getByRole("button", { name: "Card actions" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("has no axe violations when open", async () => {
    const user = setup();
    render(cardDrawer());
    await user.click(screen.getByRole("button", { name: "Card actions" }));
    await screen.findByRole("dialog");
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});
