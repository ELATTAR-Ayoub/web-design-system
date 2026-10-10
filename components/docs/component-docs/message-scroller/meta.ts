/**
 * Documentation metadata for `message-scroller`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `message-scroller` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "message-scroller",
  description:
    "Message scroller — a scrolling region for a growing list of messages that follows new content until the user scrolls away, at which point a button appears to jump back to the live edge.",
  dependencies: ["button", "source-foundation"],
  exports: ["MessageScroller", "MessageScrollerButton", "MessageScrollerContent", "MessageScrollerItem", "MessageScrollerProvider", "MessageScrollerViewport", "useMessageScroller", "useMessageScrollerScrollable", "useMessageScrollerVisibility"],
  sourcePath: "components/ui/message-scroller.tsx",
};
