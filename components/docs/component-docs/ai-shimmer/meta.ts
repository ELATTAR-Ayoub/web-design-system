/**
 * Documentation metadata for `ai-shimmer`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-shimmer",
  description:
    "Paints a label with a light sweeping across it to show that work is in progress.",
  dependencies: ["source-foundation"],
  exports: ["TextShimmerProps","Shimmer"],
  sourcePath: "components/ai-elements/shimmer.tsx",
};
