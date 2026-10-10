/**
 * Documentation metadata for `empty`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `empty` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "empty",
  description:
    "Empty — a dashed-border placeholder for a list, page, or panel with nothing in it yet, pairing an icon or illustration with a title, description, and an optional action.",
  dependencies: ["source-foundation"],
  exports: ["Empty", "EmptyContent", "EmptyDescription", "EmptyHeader", "EmptyMedia", "EmptyTitle"],
  sourcePath: "components/ui/empty.tsx",
};
