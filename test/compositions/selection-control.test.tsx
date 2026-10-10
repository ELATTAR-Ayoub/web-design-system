/**
 * @covers selection-control
 *
 * `selection-control`'s own documentation page
 * (`components/docs/component-docs/selection-control/page.tsx`) is authored
 * prose, not a wrapper component: its header and "why" section record that
 * this capability is deliberately Field composed with Checkbox/Radio/Switch,
 * not a fourth control the way Flutter's `SelectionControl` is one widget.
 * `spec.sections[0]` (`id: "preview"`) is exactly the two-row specimen the
 * page's Preview section renders — imported and rendered here unmodified.
 *
 * Primary behaviour asserted: the label's `htmlFor` actually reaches the
 * control (clicking label text toggles it, the way native `<label>`
 * association works, not merely a string match on two `id`s), and each row's
 * `FieldDescription` is real, visible prose beside its control.
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { spec } from "@/components/docs/component-docs/selection-control/page";

const preview = spec.sections.find((s) => s.id === "preview");
const previewNode = preview && "render" in preview ? preview.render : null;

describe("selection-control: the page's real two-row specimen", () => {
  it("the page declares a preview section to render", () => {
    expect(preview).toBeDefined();
    expect(previewNode).toBeTruthy();
  });

  it("clicking the checkbox row's label toggles the real checkbox", async () => {
    const user = setup();
    render(previewNode);
    const checkbox = screen.getByRole("checkbox", { name: "Weekly digest" });
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    await user.click(screen.getByText("Weekly digest"));
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("clicking the switch row's label toggles the real switch", async () => {
    const user = setup();
    render(previewNode);
    const toggle = screen.getByRole("switch", { name: "Beta features" });
    expect(toggle).toHaveAttribute("aria-checked", "false");

    await user.click(screen.getByText("Beta features"));
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("each row carries its own real description text", () => {
    render(previewNode);
    expect(
      screen.getByText("One email each Monday summarising the week. Nothing else."),
    ).toBeInTheDocument();
    expect(screen.getByText("Turn on work in progress. Some of it will break.")).toBeInTheDocument();
  });

  it("axe: both rows", async () => {
    const { container } = render(previewNode);
    expect(await axe(container)).toHaveNoViolations();
  });
});

function setup() {
  return userEvent.setup({ pointerEventsCheck: 0 });
}
