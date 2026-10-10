/**
 * Documentation metadata for `content-change`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `content-change` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "content-change",
  description:
    "ContentChange — replays an entrance animation when keyed content changes.",
  dependencies: ["source-foundation"],
  exports: ["ContentChange", "ContentChangeProps", "useReplayOnStateChange"],
  sourcePath: "components/ui/content-change.tsx",
};
