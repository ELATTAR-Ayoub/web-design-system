import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Prose } from "@/components/ui/prose";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { OVERLAY_AXE_OPTIONS, expectFocusRing } from "../helpers";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

/* ── Accordion ─────────────────────────────────────────────────────────────── */

const faq = (props: Record<string, unknown> = {}) => (
  <Accordion type="single" collapsible {...props}>
    <AccordionItem value="odds">
      <AccordionTrigger>How are the odds decided?</AccordionTrigger>
      <AccordionContent>One in forty packs.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="sell">
      <AccordionTrigger>Can I sell a card back?</AccordionTrigger>
      <AccordionContent>Yes, at the listed buy-back price.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="ship" disabled>
      <AccordionTrigger>How does shipping work?</AccordionTrigger>
      <AccordionContent>Tracked, three days.</AccordionContent>
    </AccordionItem>
  </Accordion>
);

describe("Accordion", () => {
  /*
   * `aria-controls` is asserted OPEN, not closed. Radix writes
   * `aria-controls: context.open ? contentId : undefined` — deliberately,
   * because a closed panel is not in the DOM and pointing at a missing id is
   * worse than pointing at nothing. That is the primitive's decision and RULES
   * §5 forbids re-implementing it; what this pins is that the association
   * really exists once there is something to associate with.
   */
  it("reports its disclosure state through aria-expanded and aria-controls", async () => {
    const user = setup();
    render(faq());
    const trigger = screen.getByRole("button", {
      name: "How are the odds decided?",
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-controls");

    await user.click(trigger);
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "true"),
    );
    const controls = trigger.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    expect(document.getElementById(controls!)).toBeTruthy();
  });

  it("Enter and Space both toggle the disclosure", async () => {
    const user = setup();
    render(faq());
    const trigger = screen.getByRole("button", {
      name: "How are the odds decided?",
    });
    await user.tab();
    expect(trigger).toHaveFocus();

    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "true"),
    );

    await user.keyboard(" ");
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "false"),
    );
  });

  it("type=single closes the open item when another opens", async () => {
    const user = setup();
    render(faq());
    const first = screen.getByRole("button", {
      name: "How are the odds decided?",
    });
    const second = screen.getByRole("button", { name: "Can I sell a card back?" });

    await user.click(first);
    await waitFor(() => expect(first).toHaveAttribute("aria-expanded", "true"));
    await user.click(second);
    await waitFor(() => expect(second).toHaveAttribute("aria-expanded", "true"));
    expect(first).toHaveAttribute("aria-expanded", "false");
  });

  it("type=multiple keeps both open", async () => {
    const user = setup();
    render(faq({ type: "multiple", collapsible: undefined }));
    const first = screen.getByRole("button", {
      name: "How are the odds decided?",
    });
    const second = screen.getByRole("button", { name: "Can I sell a card back?" });

    await user.click(first);
    await user.click(second);
    await waitFor(() => expect(second).toHaveAttribute("aria-expanded", "true"));
    expect(first).toHaveAttribute("aria-expanded", "true");
  });

  it("a disabled item is inert and says so", async () => {
    const user = setup();
    render(faq());
    const disabled = screen.getByRole("button", { name: "How does shipping work?" });
    expect(disabled).toBeDisabled();
    await user.click(disabled);
    expect(disabled).toHaveAttribute("aria-expanded", "false");
  });

  it("the trigger carries a focus-visible ring", () => {
    render(faq());
    expectFocusRing(
      screen.getByRole("button", { name: "How are the odds decided?" }),
    );
  });

  /*
   * The chevron is decoration beside a named trigger, so it must not appear in
   * the tree. Batch 3's `Icon` prop-spread fix made this file's three
   * `**:data-[slot=accordion-trigger-icon]:*` rules apply for the first time,
   * which is why the slot is asserted rather than assumed.
   */
  it("both chevrons are hidden from assistive tech and carry the styling slot", () => {
    const { container } = render(faq());
    const icons = container.querySelectorAll(
      '[data-slot="accordion-trigger-icon"]',
    );
    expect(icons).toHaveLength(6);
    for (const icon of Array.from(icons)) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    }
  });

  /*
   * `h-(--radix-accordion-content-height)` pins the inner wrapper to the height
   * Radix measured once. Content that grows after that measurement — an image
   * that loads, a font that swaps, a nested disclosure — is then CLIPPED by
   * `overflow-hidden` on the parent with no scrollbar and no way to reach it.
   * A minimum is what the layout actually wants.
   */
  it("the content wrapper does not pin itself to a measured height", () => {
    const { container } = render(faq({ defaultValue: "odds" }));
    const inner = container.querySelector(
      '[data-slot="accordion-content"] > div',
    );
    const cls = inner?.getAttribute("class") ?? "";
    expect(cls).not.toMatch(/(?:^|\s)h-\(--radix-accordion-content-height\)/);
  });

  it("axe is clean closed and open", async () => {
    const user = setup();
    const { container } = render(faq());
    expect(await axe(container, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
    await user.click(
      screen.getByRole("button", { name: "How are the odds decided?" }),
    );
    expect(await axe(container, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Collapsible ───────────────────────────────────────────────────────────── */

describe("Collapsible", () => {
  const filters = (
    <Collapsible>
      <CollapsibleTrigger>Advanced filters</CollapsibleTrigger>
      <CollapsibleContent>Rarity, set, print run.</CollapsibleContent>
    </Collapsible>
  );

  /* Same Radix rule as Accordion: the association appears with the panel. */
  it("reports state through aria-expanded and points at its own panel", async () => {
    const user = setup();
    render(filters);
    const trigger = screen.getByRole("button", { name: "Advanced filters" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "true"),
    );
    const controls = trigger.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    expect(document.getElementById(controls!)).toBeTruthy();
  });

  it("Enter opens it and the panel becomes reachable", async () => {
    const user = setup();
    render(filters);
    const trigger = screen.getByRole("button", { name: "Advanced filters" });
    await user.tab();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "true"),
    );
    expect(screen.getByText("Rarity, set, print run.")).toBeVisible();
  });

  it("animates its height through the shared unfold pair, not opacity", () => {
    const { container } = render(filters);
    const content = container.querySelector(
      '[data-slot="collapsible-content"]',
    );
    const cls = content?.getAttribute("class") ?? "";
    expect(cls).toContain("data-open:anim-expand");
    expect(cls).toContain("data-closed:anim-collapse");
    expect(cls).toContain("[--unfold-h:var(--radix-collapsible-content-height)]");
    expect(cls).toContain("overflow-hidden");
  });
});

/* ── Card ──────────────────────────────────────────────────────────────────── */

describe("Card", () => {
  const competition = (props: Record<string, unknown> = {}) => (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Weekly competition</CardTitle>
        <CardDescription>Ends Sunday at midnight.</CardDescription>
        <CardAction>
          <button type="button">Enter</button>
        </CardAction>
      </CardHeader>
      <CardContent>Twelve packs in the prize pool.</CardContent>
      <CardFooter>Entries close in two days.</CardFooter>
    </Card>
  );

  it("every part writes its slot so the composition can be styled and found", () => {
    const { container } = render(competition());
    for (const slot of [
      "card",
      "card-header",
      "card-title",
      "card-description",
      "card-action",
      "card-content",
      "card-footer",
    ]) {
      expect(container.querySelector(`[data-slot="${slot}"]`)).toBeTruthy();
    }
  });

  it("the sm size is a data attribute the parts can read, not a second component", () => {
    const { container } = render(competition({ size: "sm" }));
    expect(container.querySelector('[data-slot="card"]')).toHaveAttribute(
      "data-size",
      "sm",
    );
  });

  /*
   * A card is a surface, not a heading level. The title has to be able to BE
   * the right heading for where the card sits, and a fixed `<div>` cannot.
   * Without this a page of cards is a page with no headings at all.
   */
  it("the title can render as the heading the page needs", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle asChild>
            <h3>Your collection</h3>
          </CardTitle>
        </CardHeader>
      </Card>,
    );
    const heading = screen.getByRole("heading", {
      name: "Your collection",
      level: 3,
    });
    /* The heading must BE the title, not a child of a `<div>` wearing the
       slot — otherwise the card's own typography sits on a wrapper and the
       heading inherits nothing. */
    expect(heading).toHaveAttribute("data-slot", "card-title");
  });

  it("axe is clean", async () => {
    const { container } = render(competition());
    expect(await axe(container, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Separator ─────────────────────────────────────────────────────────────── */

describe("Separator", () => {
  it("is decorative by default, so it is not announced", () => {
    const { container } = render(<Separator />);
    const el = container.querySelector('[data-slot="separator"]')!;
    expect(el).toHaveAttribute("role", "none");
  });

  it("a semantic separator announces itself with its orientation", () => {
    render(<Separator decorative={false} orientation="vertical" />);
    const el = screen.getByRole("separator");
    expect(el).toHaveAttribute("data-orientation", "vertical");
    expect(el).toHaveAttribute("aria-orientation", "vertical");
  });

  it("horizontal is the default orientation", () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('[data-slot="separator"]')).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });
});

/* ── AspectRatio ───────────────────────────────────────────────────────────── */

describe("AspectRatio", () => {
  it("is a presentational box that passes its content through", () => {
    const { container } = render(
      <AspectRatio ratio={5 / 7}>
        <span>Voidwing Ascendant</span>
      </AspectRatio>,
    );
    expect(container.querySelector('[data-slot="aspect-ratio"]')).toBeTruthy();
    expect(screen.getByText("Voidwing Ascendant")).toBeTruthy();
  });

  it("forwards a className, so a caller can frame it", () => {
    const { container } = render(
      <AspectRatio ratio={1} className="rounded-lg" />,
    );
    expect(
      container.querySelector('[data-slot="aspect-ratio"]')?.className,
    ).toContain("rounded-lg");
  });
});

/* ── ScrollArea ────────────────────────────────────────────────────────────── */

describe("ScrollArea", () => {
  const list = (props: Record<string, unknown> = {}) => (
    <ScrollArea className="h-64" {...props}>
      <div>
        {Array.from({ length: 14 }).map((_, i) => (
          <p key={i}>Card #{i}</p>
        ))}
      </div>
    </ScrollArea>
  );

  /*
   * Radix hides the native scrollbar and draws its own. It does NOT make the
   * viewport focusable, so the content it hid is unreachable from a keyboard —
   * the exact failure `component-contracts.md` → "Native scrollbars" names:
   * never hide the only cue that more content is reachable.
   *
   * The component's own `focus-visible:ring-3` on the viewport is the tell. It
   * has been dead CSS since the file was written: nothing can focus the element
   * it is declared on.
   */
  it("the viewport is reachable from a keyboard", async () => {
    const user = setup();
    const { container } = render(list());
    const viewport = container.querySelector(
      '[data-slot="scroll-area-viewport"]',
    )!;
    expect(viewport).toHaveAttribute("tabindex", "0");
    await user.tab();
    expect(viewport).toHaveFocus();
  });

  it("a keyboard-reachable region is named, so it is not an anonymous stop", () => {
    const { container } = render(list({ "aria-label": "Possible hits" }));
    const viewport = container.querySelector(
      '[data-slot="scroll-area-viewport"]',
    )!;
    expect(viewport).toHaveAttribute("role", "group");
    expect(viewport).toHaveAttribute("aria-label", "Possible hits");
  });

  it("the viewport carries a focus-visible ring", () => {
    const { container } = render(list());
    expectFocusRing(
      container.querySelector('[data-slot="scroll-area-viewport"]')!,
    );
  });

  it("axe is clean", async () => {
    const { container } = render(list({ "aria-label": "Possible hits" }));
    expect(await axe(container, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

/* ── Resizable ─────────────────────────────────────────────────────────────── */

describe("Resizable", () => {
  const split = (props: Record<string, unknown> = {}) => (
    <ResizablePanelGroup>
      <ResizablePanel defaultSize={40} minSize={25}>
        <div>Card list</div>
      </ResizablePanel>
      <ResizableHandle withHandle {...props} />
      <ResizablePanel defaultSize={60}>
        <div>Card detail</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );

  it("the handle is a separator with a value and a tab stop", () => {
    render(split({ "aria-label": "Resize the card list" }));
    const handle = screen.getByRole("separator");
    expect(handle).toHaveAttribute("tabindex", "0");
    expect(handle).toHaveAttribute("aria-valuenow");
    expect(handle).toHaveAttribute("aria-valuemin");
    expect(handle).toHaveAttribute("aria-valuemax");
  });

  /*
   * A separator with a value is a slider-shaped control, and a control with a
   * value and no name announces as "separator, 40" with nothing to say what is
   * being resized. The library takes an `aria-label` and does not invent one.
   */
  it("the handle is named", () => {
    render(split({ "aria-label": "Resize the card list" }));
    expect(
      screen.getByRole("separator", { name: "Resize the card list" }),
    ).toBeTruthy();
  });

  it("the handle carries a focus-visible ring", () => {
    render(split({ "aria-label": "Resize the card list" }));
    expectFocusRing(screen.getByRole("separator"));
  });

  it("axe is clean", async () => {
    const { container } = render(split({ "aria-label": "Resize the card list" }));
    expect(await axe(container, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });

  /*
   * RED before the fix: the `::after` hit-area pseudo-element was `after:w-1`
   * / `after:h-1` — a 4px pointer-only zone on a 1px-drawn separator, well
   * under --size-target-min (44px). jsdom has no layout engine, so the real
   * hit area (a fingertip 20px off the drawn line still reaching the handle)
   * is measured in e2e/gaps-interaction.spec.ts; this unit test pins the
   * structural half — the class list itself must read the token, never a
   * literal Tailwind step or px value, per RULES' "nothing is hardcoded".
   */
  it("the hit area is widened via the --size-target-min token, not a hardcoded step", () => {
    render(split({ "aria-label": "Resize the card list" }));
    const handle = screen.getByRole("separator");
    expect(handle.className).toContain("after:w-(--size-target-min)");
    expect(handle.className).toContain(
      "aria-[orientation=horizontal]:after:h-(--size-target-min)",
    );
    expect(handle.className).not.toMatch(/after:w-1\b/);
    expect(handle.className).not.toMatch(/after:h-1\b/);
  });
});

/* ── Prose ─────────────────────────────────────────────────────────────────── */

describe("Prose", () => {
  it("names itself with a slot and the .prose class the stylesheet keys on", () => {
    const { container } = render(
      <Prose>
        <p>Long-form authored content.</p>
      </Prose>,
    );
    const el = container.querySelector('[data-slot="prose"]')!;
    expect(el.className).toContain("prose");
    expect(el.tagName).toBe("DIV");
  });

  it("asChild lets the content be the article it semantically is", () => {
    render(
      <Prose asChild>
        <article>
          <p>Long-form authored content.</p>
        </article>
      </Prose>,
    );
    const el = screen.getByRole("article");
    expect(el).toHaveAttribute("data-slot", "prose");
  });

  it("sets no measure of its own — PageContainer owns that", () => {
    const { container } = render(<Prose />);
    const cls =
      container.querySelector('[data-slot="prose"]')?.getAttribute("class") ??
      "";
    expect(cls).not.toMatch(/(?:^|\s)max-w-/);
  });
});
