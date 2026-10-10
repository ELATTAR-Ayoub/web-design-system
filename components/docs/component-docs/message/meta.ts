/**
 * Documentation metadata for `message`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `message` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "message",
  description:
    "Message — the anatomy of one chat turn: an avatar, a header, content and a footer, aligned to the start or end of the transcript depending on who is speaking.",
  dependencies: ["source-foundation"],
  exports: ["Message", "MessageAvatar", "MessageContent", "MessageFooter", "MessageGroup", "MessageHeader"],
  sourcePath: "components/ui/message.tsx",
};
