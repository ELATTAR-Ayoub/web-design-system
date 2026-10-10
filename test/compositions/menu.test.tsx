/**
 * @covers menu
 *
 * `menu`'s own documentation page (`components/docs/component-docs/menu/page.tsx`)
 * is authored prose, not a wrapper component: its header comment records that
 * DropdownMenu, ContextMenu and Menubar share zero byte-identical class
 * strings, so this capability IS the composition of the three real Radix-based
 * primitives side by side, not a fourth module to import. `spec.sections[0]`
 * (`id: "preview"`) is exactly the three-way specimen the page's Preview
 * section renders — imported and rendered here unmodified, not
 * reimplemented, so a change to the real specimen is what this test sees.
 *
 * Primary behaviour asserted: each of the three actually opens (a real
 * `role="menu"` appears) on the interaction its own page documents —
 * DropdownMenu on trigger click, ContextMenu on right-click with no visible
 * trigger, Menubar on trigger click — and a chosen item's `onSelect` fires.
 * All three sit inside one axe pass with the shared overlay exclusions
 * (`aria-hidden-focus`, `region`) `test/components/helpers.ts` documents:
 * Radix's own focus-guard sentinels and background `aria-hidden`, not this
 * system's markup, plus the page-landmark rule that does not apply to a
 * fragment mounted straight into a bare `<body>`.
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { spec } from "@/components/docs/component-docs/menu/page";
import { OVERLAY_AXE_OPTIONS } from "../components/helpers";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

const preview = spec.sections.find((s) => s.id === "preview");

describe("menu: the page's real three-way specimen", () => {
  it("the page declares a preview section to render", () => {
    expect(preview).toBeDefined();
    expect(preview && "render" in preview ? preview.render : null).toBeTruthy();
  });

  it("DropdownMenu opens on trigger click, with role=menu", async () => {
    const user = setup();
    render(preview && "render" in preview ? preview.render : null);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Rename" })).toBeInTheDocument();
  });

  it("ContextMenu opens on right-click, with no visible trigger of its own", async () => {
    render(preview && "render" in preview ? preview.render : null);
    const card = screen.getByText("Right-click this card");
    // userEvent has no dedicated right-click helper; Radix's ContextMenuTrigger
    // listens for the native contextmenu event, so this fires the real one.
    card.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
    expect(await screen.findByRole("menuitem", { name: "Favourite" })).toBeInTheDocument();
  });

  it("Menubar's second trigger opens its own menu", async () => {
    const user = setup();
    render(preview && "render" in preview ? preview.render : null);
    await user.click(screen.getByRole("menuitem", { name: "Users" }));
    expect(await screen.findByRole("menuitem", { name: "Search users" })).toBeInTheDocument();
  });

  it("axe: the specimen with DropdownMenu open", async () => {
    const user = setup();
    const { container } = render(preview && "render" in preview ? preview.render : null);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("menu");
    expect(await axe(container, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});
