/**
 * @covers message
 *
 * `MessageResponse` with the REAL Streamdown (message.test.tsx mocks it): the
 * reply's markdown lands on the system's `.prose` type, not Streamdown's own
 * Tailwind classes, and its code uses the system's code theme.
 */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { MessageResponse } from "@/components/ai-elements/message";

describe("MessageResponse — on the system's type", () => {
  it("is long-form prose, and its plain text elements carry no Streamdown type classes", async () => {
    const { container } = render(
      <MessageResponse>{"## Pricing\n\nPer **seat**, with `overage` billed.\n\n- one\n- two"}</MessageResponse>,
    );
    const heading = await screen.findByRole("heading", { name: "Pricing" });
    expect(heading.closest(".prose")).toHaveClass("streamdown-chrome");
    // `.prose h2` sets the h2 role; a Streamdown `text-2xl font-semibold` would beat it.
    expect(heading.getAttribute("class")).toBeNull();
    for (const el of container.querySelectorAll(".prose p, .prose li, .prose ul, .prose strong, .prose code")) {
      expect(el.getAttribute("class"), el.tagName).toBeNull();
    }
    expect(container.querySelectorAll(".prose li")).toHaveLength(2);
  });
});
