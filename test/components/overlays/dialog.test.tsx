import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OVERLAY_AXE_OPTIONS, expectNoFixedHeight } from "../helpers";

/*
 * Radix puts `pointer-events: none` on `document.body` while a modal is open,
 * which user-event refuses to click through by default. That is a real browser
 * behaviour and not something to mock away, so the checks are disabled instead.
 */
const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

const purchaseDialog = (props: { describe?: boolean } = { describe: true }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button>Open Pack</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm your purchase</DialogTitle>
        {props.describe !== false && (
          <DialogDescription>
            Opening 3 packs cannot be reversed.
          </DialogDescription>
        )}
      </DialogHeader>
      <p>Total $124.00</p>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button variant="premium">Confirm &amp; Open</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

describe("Dialog", () => {
  it("opens from the trigger on click and on Enter", async () => {
    const user = setup();
    render(purchaseDialog());
    const trigger = screen.getByRole("button", { name: "Open Pack" });

    await user.click(trigger);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("opens on Space as well — a button's second activation key", async () => {
    const user = setup();
    render(purchaseDialog());
    screen.getByRole("button", { name: "Open Pack" }).focus();
    await user.keyboard(" ");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("takes its accessible name from DialogTitle via aria-labelledby", async () => {
    const user = setup();
    render(purchaseDialog());
    await user.click(screen.getByRole("button", { name: "Open Pack" }));

    const dialog = await screen.findByRole("dialog", {
      name: "Confirm your purchase",
    });
    const labelledBy = dialog.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy!)).toHaveAttribute(
      "data-slot",
      "dialog-title",
    );
  });

  it("wires aria-describedby to the description, and drops it silently when there is none", async () => {
    const user = setup();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const { unmount } = render(purchaseDialog());
    await user.click(screen.getByRole("button", { name: "Open Pack" }));
    const described = await screen.findByRole("dialog");
    const describedBy = described.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveAttribute(
      "data-slot",
      "dialog-description",
    );
    unmount();
    warn.mockClear();
    error.mockClear();

    /*
     * The description-less render, and what the system ACTUALLY does about it.
     *
     * Older Radix shipped a `DescriptionWarning` that logged
     * "Missing `Description` or `aria-describedby`". radix-ui 1.6.7 does not:
     * `@radix-ui/react-dialog` tracks a `descriptionPresent` context and simply
     * omits the attribute (dist/index.mjs:232,
     * `"aria-describedby": context.descriptionPresent ? context.descriptionId : void 0`).
     *
     * So a dialog shipped with no description is SILENT — no throw, no warning,
     * nothing in the console. Nothing in the toolchain will tell anyone. That
     * is why the specimen rule "give every overlay a title and a description"
     * is enforced by review and by this test, and why the e2e's zero-console
     * assertion must not be read as covering it.
     */
    render(purchaseDialog({ describe: false }));
    await user.click(screen.getByRole("button", { name: "Open Pack" }));
    const bare = await screen.findByRole("dialog");
    expect(bare).not.toHaveAttribute("aria-describedby");
    expect(warn.mock.calls.flat().join(" ")).not.toMatch(/describedby/i);
    expect(error.mock.calls.flat().join(" ")).not.toMatch(/describedby/i);

    // The title, by contrast, is never optional here: the name still resolves.
    expect(bare).toHaveAccessibleName("Confirm your purchase");

    warn.mockRestore();
    error.mockRestore();
  });

  it("moves focus into the dialog and returns it to the trigger on close", async () => {
    const user = setup();
    render(purchaseDialog());
    const trigger = screen.getByRole("button", { name: "Open Pack" });

    await user.click(trigger);
    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("closes on Escape and from DialogClose", async () => {
    const user = setup();
    render(purchaseDialog());
    await user.click(screen.getByRole("button", { name: "Open Pack" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("stays open when a toast's action is pressed, and still closes on any other outside press", async () => {
    const user = setup();
    render(
      <>
        {purchaseDialog()}
        <ol data-sonner-toaster="">
          <li>
            <button type="button">Undo</button>
          </li>
        </ol>
        <button type="button">Elsewhere</button>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Open Pack" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByText("Undo"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByText("Elsewhere"));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("exposes the three zones as real parts", async () => {
    const user = setup();
    render(purchaseDialog());
    await user.click(screen.getByRole("button", { name: "Open Pack" }));
    const dialog = await screen.findByRole("dialog");

    for (const slot of ["dialog-header", "dialog-footer", "dialog-close"]) {
      expect(
        dialog.querySelector(`[data-slot="${slot}"]`),
        `Dialog should publish a ${slot} part`,
      ).not.toBeNull();
    }
    // The lit body is whatever sits between the two bands, so what is checkable
    // is that the bands are siblings with content between them.
    const header = dialog.querySelector('[data-slot="dialog-header"]')!;
    const footer = dialog.querySelector('[data-slot="dialog-footer"]')!;
    expect(header.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("declares the open enter and exit variants on the content", async () => {
    const user = setup();
    render(purchaseDialog());
    await user.click(screen.getByRole("button", { name: "Open Pack" }));
    const dialog = await screen.findByRole("dialog");
    // A class string, not a rendered animation: jsdom has no stylesheet, so
    // this cannot tell a live variant from a dead one. The e2e reads the
    // computed `animationName` off the open panel in the built app (trap 13).
    const cls = dialog.getAttribute("class") ?? "";
    expect(cls).toContain("data-open:anim-open");
    expect(cls).toContain("data-closed:anim-close");
  });

  it("neither chrome band pins a fixed height", async () => {
    const user = setup();
    render(purchaseDialog());
    await user.click(screen.getByRole("button", { name: "Open Pack" }));
    const dialog = await screen.findByRole("dialog");
    expectNoFixedHeight(dialog.querySelector('[data-slot="dialog-header"]')!);
    expectNoFixedHeight(dialog.querySelector('[data-slot="dialog-footer"]')!);
  });

  it("has no axe violations when open", async () => {
    const user = setup();
    render(purchaseDialog());
    await user.click(screen.getByRole("button", { name: "Open Pack" }));
    await screen.findByRole("dialog");
    // The content is portalled to document.body, so the container alone would
    // test an empty div.
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

const sellAll = (props: { loading?: boolean } = {}) => (
  <TooltipProvider>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Sell All Cards</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sell all 12 cards for $2,481.00?</AlertDialogTitle>
          <AlertDialogDescription>
            Every card is sold back at its listed value. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep my cards</AlertDialogCancel>
          <AlertDialogAction loading={props.loading}>
            Sell all for $2,481.00
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </TooltipProvider>
);

describe("AlertDialog", () => {
  it("opens from the keyboard with role alertdialog and a name", async () => {
    const user = setup();
    render(sellAll());
    screen.getByRole("button", { name: "Sell All Cards" }).focus();
    await user.keyboard("{Enter}");

    expect(
      await screen.findByRole("alertdialog", {
        name: "Sell all 12 cards for $2,481.00?",
      }),
    ).toBeInTheDocument();
  });

  it("is answered, not dismissed: no close button and no overlay-click exit", async () => {
    const user = setup();
    render(sellAll());
    await user.click(screen.getByRole("button", { name: "Sell All Cards" }));
    const dialog = await screen.findByRole("alertdialog");

    // RULES §5: "An alert dialog has no close button at all: it must be
    // answered, not dismissed."
    expect(dialog.querySelector('[data-slot="alert-dialog-close"]')).toBeNull();
    expect(
      Array.from(dialog.querySelectorAll("button")).map((b) => b.textContent),
    ).not.toContain("Close");

    const overlay = document.querySelector(
      '[data-slot="alert-dialog-overlay"]',
    )!;
    await user.click(overlay);
    expect(screen.queryByRole("alertdialog")).toBeInTheDocument();
  });

  it("closes on the FIRST Escape: no unrequested tooltip takes the key", async () => {
    const user = setup();
    render(sellAll());
    const trigger = screen.getByRole("button", { name: "Sell All Cards" });
    await user.click(trigger);
    await screen.findByRole("alertdialog");

    /*
     * This test was RED, and the mechanism is worth keeping written down.
     *
     * `AlertDialogCancel` attached a Tooltip whenever `children` was a string —
     * which RULES §8 makes true of every cancel label we write. Radix focuses
     * that cancel button automatically on open (@radix-ui/react-alert-dialog
     * dist/index.mjs:58, `onOpenAutoFocus` → `cancelRef.current?.focus()`), a
     * programmatic focus opens a Radix tooltip, and `DismissableLayer` runs
     * Escape on the HIGHEST layer only with `preventDefault`
     * (@radix-ui/react-dismissable-layer dist/index.mjs:91-99). So an
     * unrequested tooltip repeating the button's own words was showing before
     * the user did anything, and it ate the first Escape.
     *
     * The fix keeps both guarantees: the tooltip is now gated on the label
     * being ACTUALLY truncated, which is the only case RULES §5 asks it to
     * cover. Nothing about the primitive was re-implemented.
     */
    const cancel = screen.getByRole("button", { name: "Keep my cards" });
    await waitFor(() => expect(cancel).toHaveFocus());
    expect(
      cancel.getAttribute("data-state"),
      "a tooltip opened with no user gesture at all",
    ).toBe("closed");

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("wraps its buttons in a tooltip trigger, and keeps it closed on open", async () => {
    /*
     * What jsdom can actually establish, and no more.
     *
     * jsdom lays nothing out: `scrollWidth` and `clientWidth` are both 0, so
     * `useLabelIsTruncated` always reports false here and the overflow branch
     * cannot fire. An earlier version of this test claimed the branch was
     * "proven in the Playwright suite" when no such test existed. It exists
     * now — `AlertDialog: an explicitly clipped label still reaches its tooltip`
     * in the `overlays` e2e block — and this test is scoped back to the two
     * things a layout-less DOM can see:
     *
     *   1. the buttons ARE wrapped in a TooltipTrigger, so there is a branch to
     *      measure at all (a TooltipTrigger publishes `data-state`; a bare
     *      button does not);
     *   2. nothing is open at the moment the dialog opens, which is the whole
     *      point of the gate.
     */
    const user = setup();
    render(sellAll());
    await user.click(screen.getByRole("button", { name: "Sell All Cards" }));
    await screen.findByRole("alertdialog");

    const action = screen.getByRole("button", {
      name: /Sell all for \$2,481\.00/,
    });
    const cancel = screen.getByRole("button", { name: "Keep my cards" });

    expect(action).toHaveAttribute("data-state");
    expect(cancel).toHaveAttribute("data-state");
    expect(action).toHaveAttribute("data-state", "closed");
    await waitFor(() => expect(cancel).toHaveFocus());
    expect(cancel).toHaveAttribute("data-state", "closed");
  });

  it("an explicit `tooltip` prop always opens, clipped or not", async () => {
    const user = setup();
    /*
     * RED before the gate learned to tell the two cases apart.
     *
     * Round 1 gated EVERY tooltip on truncation, including one a caller had
     * explicitly asked for — so `tooltip="…"` on a short label silently did
     * nothing, which is worse than the noise it was added to remove. The
     * automatic label-as-tooltip repeats what the button already says and is
     * only useful when the words are clipped; an explicit prop says something
     * the button does NOT say, so it is never gated.
     */
    render(
      <TooltipProvider delayDuration={0}>
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Close your account?</AlertDialogTitle>
              <AlertDialogDescription>
                Your balance is returned to your payment method.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction tooltip="Closes the account ending 4417 and returns $1,204.80">
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TooltipProvider>,
    );

    const action = await screen.findByRole("button", { name: /^Close/ });
    await user.hover(action);
    expect(
      await screen.findByRole("tooltip"),
      "an explicitly requested tooltip must not be gated on truncation",
    ).toHaveTextContent("Closes the account ending 4417 and returns $1,204.80");

    // And the automatic one beside it stays gated: "Keep it" is not clipped in
    // any layout, so it must never produce a second tooltip.
    const cancel = screen.getByRole("button", { name: "Keep it" });
    await user.hover(cancel);
    expect(screen.getAllByRole("tooltip")).toHaveLength(1);
  });

  it("bands only the footer — two zones, not three", async () => {
    const user = setup();
    render(sellAll());
    await user.click(screen.getByRole("button", { name: "Sell All Cards" }));
    const dialog = await screen.findByRole("alertdialog");

    const header = dialog.querySelector('[data-slot="alert-dialog-header"]')!;
    const footer = dialog.querySelector('[data-slot="alert-dialog-footer"]')!;
    expect(header.getAttribute("class")).not.toMatch(/bg-muted|border-b/);
    expect(footer.getAttribute("class")).toMatch(/bg-muted/);
    expect(footer.getAttribute("class")).toMatch(/border-t/);
  });

  it("the confirming action is destructive by default and blocks a second press while loading", async () => {
    const user = setup();
    const { rerender } = render(sellAll());
    await user.click(screen.getByRole("button", { name: "Sell All Cards" }));
    const action = await screen.findByRole("button", {
      name: /Sell all for \$2,481\.00/,
    });
    expect(action.getAttribute("class")).toMatch(/destructive/);
    expect(action).not.toHaveAttribute("aria-busy");
    expect(action).not.toBeDisabled();

    rerender(sellAll({ loading: true }));
    const busy = await screen.findByRole("button", {
      name: /Sell all for \$2,481\.00/,
    });
    expect(busy).toHaveAttribute("aria-busy", "true");
    expect(busy).toBeDisabled();
  });

  it("has no axe violations when open", async () => {
    const user = setup();
    render(sellAll());
    await user.click(screen.getByRole("button", { name: "Sell All Cards" }));
    await screen.findByRole("alertdialog");
    expect(await axe(document.body, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});
