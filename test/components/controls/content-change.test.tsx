import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { ContentChange } from "@/components/ui/content-change";

describe("ContentChange", () => {
  it("replaces old content with new content when contentKey changes", () => {
    const { rerender } = render(
      <ContentChange contentKey="message-1">
        <p>First message</p>
      </ContentChange>,
    );
    expect(screen.getByText("First message")).toBeInTheDocument();

    rerender(
      <ContentChange contentKey="message-2">
        <p>Second message</p>
      </ContentChange>,
    );
    expect(screen.queryByText("First message")).not.toBeInTheDocument();
    expect(screen.getByText("Second message")).toBeInTheDocument();
  });

  it("does not replay when re-rendering with the same contentKey", () => {
    const { container, rerender } = render(
      <ContentChange contentKey="message-1">
        <p>First message</p>
      </ContentChange>,
    );
    const wrapper = container.querySelector('[data-slot="content-change"]')!;
    const removeSpy = vi.spyOn(wrapper.classList, "remove");
    const addSpy = vi.spyOn(wrapper.classList, "add");

    // Same key, different children — the content can update without a new key,
    // and that alone must not trigger a replay.
    rerender(
      <ContentChange contentKey="message-1">
        <p>First message, edited</p>
      </ContentChange>,
    );

    expect(removeSpy).not.toHaveBeenCalled();
    expect(addSpy).not.toHaveBeenCalled();
  });

  it("replays the entrance — remove, reflow, re-add — on a real key change", () => {
    const { container, rerender } = render(
      <ContentChange contentKey="message-1">
        <p>First message</p>
      </ContentChange>,
    );
    const wrapper = container.querySelector('[data-slot="content-change"]')!;
    const removeSpy = vi.spyOn(wrapper.classList, "remove");
    const addSpy = vi.spyOn(wrapper.classList, "add");

    rerender(
      <ContentChange contentKey="message-2">
        <p>Second message</p>
      </ContentChange>,
    );

    expect(removeSpy).toHaveBeenCalledWith("anim-enter");
    expect(addSpy).toHaveBeenCalledWith("anim-enter");
    // The class is back on the element after the replay completes, so the
    // entrance keyframe is still armed for the next change.
    expect(wrapper.classList.contains("anim-enter")).toBe(true);
  });

  it("plays the entrance on first mount too, with no key change required", () => {
    const { container } = render(
      <ContentChange contentKey="message-1">
        <p>First message</p>
      </ContentChange>,
    );
    const wrapper = container.querySelector('[data-slot="content-change"]')!;
    expect(wrapper.classList.contains("anim-enter")).toBe(true);
  });

  it("never carries a raw animation-* value — animationClassName is one of the reduced-motion-verified names", () => {
    const invalid = (
      <ContentChange
        contentKey="x"
        // @ts-expect-error — arbitrary class names are rejected at the type level.
        animationClassName="anim-glint"
      >
        <p>x</p>
      </ContentChange>
    );
    void invalid;

    const { container } = render(
      <ContentChange contentKey="message-1" animationClassName="anim-enter">
        <p>First message</p>
      </ContentChange>,
    );
    const wrapper = container.querySelector('[data-slot="content-change"]')!;
    expect(["anim-enter", "anim-enter", "anim-enter"]).toContain(
      Array.from(wrapper.classList).find((c) => c.startsWith("anim-")),
    );
  });

  it("under reduced motion the new content is still present and readable, with the same DOM contract", () => {
    // `styles/motion.css`'s blanket `prefers-reduced-motion` rule is what
    // collapses the animation itself (see the component's doc comment) — it
    // cannot be exercised without a real stylesheet, which jsdom has none of.
    // What is checkable here, and what actually matters for "no information
    // loss": ContentChange never conditionally withholds `children`, never
    // marks them `aria-hidden`, and always ends up with the entrance class
    // present (one of the three names `motion.css` forces to
    // `opacity: 1; transform: none` under that media query) rather than
    // swapping to something unverified.
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;

    try {
      const { container, rerender } = render(
        <ContentChange contentKey="message-1">
          <p>First message</p>
        </ContentChange>,
      );
      rerender(
        <ContentChange contentKey="message-2">
          <p>Second message</p>
        </ContentChange>,
      );

      const content = screen.getByText("Second message");
      expect(content).toBeVisible();
      expect(content).not.toHaveAttribute("aria-hidden");

      const wrapper = container.querySelector('[data-slot="content-change"]')!;
      expect(wrapper).not.toHaveAttribute("aria-hidden");
      expect(wrapper.classList.contains("anim-enter")).toBe(true);
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ContentChange contentKey="message-1">
        <p>First message</p>
      </ContentChange>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
