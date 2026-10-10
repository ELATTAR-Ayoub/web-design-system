/**
 * @covers ai-open-in-chat
 */
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  OpenIn,
  OpenInContent,
  OpenInLabel,
  OpenInLink,
  OpenInSeparator,
  OpenInTrigger,
  type OpenInTarget,
} from "@/components/ai-elements/open-in-chat";

const target: OpenInTarget = {
  id: "intranet",
  title: "Open in Intranet Chat",
  createUrl: (q: string) => `/chat?q=${encodeURIComponent(q)}`,
};

async function open(query = "hello world") {
  render(
    <OpenIn query={query}>
      <OpenInTrigger />
      <OpenInContent>
        <OpenInLabel>Open in</OpenInLabel>
        <OpenInSeparator />
        <OpenInLink target={target} />
      </OpenInContent>
    </OpenIn>,
  );
  await userEvent.setup({ pointerEventsCheck: 0 }).click(
    screen.getByRole("button", { name: /Open in chat/ }),
  );
}

describe("OpenIn", () => {
  it("links to a caller-supplied target with the query", async () => {
    await open("hello world");
    const link = await screen.findByRole("menuitem", { name: /Open in Intranet Chat/ });
    expect(link.getAttribute("href")).toBe("/chat?q=hello%20world");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("ships no built-in providers: nothing but the caller's target is listed", async () => {
    await open();
    await screen.findByText("Open in Intranet Chat");
    expect(within(screen.getByRole("menu")).getAllByRole("menuitem")).toHaveLength(1);
  });

  it("uses the 15rem width token class, not an arbitrary pixel value", async () => {
    await open();
    await screen.findByText("Open in Intranet Chat");
    const menu = document.querySelector('[data-slot="dropdown-menu-content"]');
    expect(menu?.className).toContain("w-60");
    expect(menu?.className).not.toMatch(/w-\[240px\]/);
  });

  it("the trigger's chevron and each external-link glyph are decorative icons", async () => {
    await open();
    const link = (await screen.findByText("Open in Intranet Chat")).closest("a")!;
    expect(link.querySelector("svg.lucide-external-link")).toHaveAttribute("aria-hidden", "true");
    expect(
      screen.getByRole("button", { name: /Open in chat/, hidden: true }).querySelector("svg.lucide-chevron-down"),
    ).toHaveAttribute("aria-hidden", "true");
  });
});
