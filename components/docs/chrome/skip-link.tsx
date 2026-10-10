import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * "Skip to content" — the first focusable thing on the page.
 *
 * **There was no skip link anywhere in this repository before this file.** That
 * was the plainest finding of the audit this family came out of: every page has
 * a header, and several have a navigation rail, and a keyboard or switch user
 * had to tab through all of it on every single page to reach the article. This
 * is the fix, and it costs nine lines.
 *
 * **`sr-only` until focused, and then fully visible.** Not `opacity-0`, not a
 * `-9999px` offset, not `visibility: hidden` — all three have shipped as skip
 * links somewhere and all three are broken in a different way: an
 * opacity-0 link is still hit-tested and can be clicked by accident, an
 * off-screen one is announced with no way to see where focus went, and a
 * `visibility: hidden` element is not focusable at all, so the link exists and
 * does nothing. `sr-only` plus `focus:not-sr-only` is the pair Tailwind ships
 * for exactly this, and it puts the element back in normal flow when it
 * matters.
 *
 * **`focus:`, not `focus-visible:`.** This is the one place the distinction
 * cuts the wrong way. A skip link is only ever reached by keyboard, so
 * `:focus-visible` would almost always match — but "almost" is doing real work
 * there, and a skip link that fails to appear is indistinguishable from one
 * that is not there. The plain `:focus` is unconditional.
 *
 * **The target has to be able to receive focus.** Following `#main` scrolls the
 * page but does not move the keyboard unless the target is focusable, so the
 * element this points at must carry `tabIndex={-1}` — `app/design-system/layout.tsx`
 * does that on its `<main>`; any other caller wiring this up by hand must too,
 * and the specimen says so.
 *
 * State model:
 * rest — visually hidden, present in the accessibility tree and in the tab
 * order. **focus — the only visible state, and the entire component.** hover —
 * N/A: it cannot be hovered while hidden, and it is never hidden while
 * focused. pressed · loading · success · error · disabled — N/A, it is an
 * anchor to a fragment on the same page. empty — N/A.
 */

function SkipLink({
  targetId = "main",
  children = "Skip to content",
  className,
  ...props
}: Omit<React.ComponentProps<"a">, "href"> & {
  /** The `id` of the element to jump to. It must carry `tabIndex={-1}`. */
  targetId?: string;
}) {
  return (
    <a
      data-slot="skip-link"
      href={`#${targetId}`}
      className={cn(
        "sr-only",
        // Back into normal flow, pinned over whatever it lands on.
        "focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50",
        "focus:rounded-pill focus:bg-card focus:px-4 focus:py-2 focus:shadow-e3",
        "type-nav text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export { SkipLink };
