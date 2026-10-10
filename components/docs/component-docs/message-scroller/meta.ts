import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "message-scroller",
  description:
    "Message scroller — a scrolling region for a growing list of messages that follows new content until the user scrolls away, at which point a button appears to jump back to the live edge.",
  dependencies: ["button", "source-foundation"],
  exports: ["MessageScroller", "MessageScrollerButton", "MessageScrollerContent", "MessageScrollerItem", "MessageScrollerProvider", "MessageScrollerViewport", "useMessageScroller", "useMessageScrollerScrollable", "useMessageScrollerVisibility"],
  sourcePath: "components/ui/message-scroller.tsx",
};
