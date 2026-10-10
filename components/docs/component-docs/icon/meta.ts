/**
 * Documentation metadata for `icon`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `icon` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "icon",
  description:
    "Curated, token-sized icon renderer and generated path catalog used by interactive components.",
  dependencies: [],
  exports: ["ICON_SIZES", "ICON_TONES", "Icon", "IconSize", "IconTone"],
  sourcePath: "components/ui/icon.tsx",
};
