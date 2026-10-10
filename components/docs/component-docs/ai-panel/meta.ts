/**
 * Documentation metadata for `ai-panel`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-panel",
  description:
    "A card pinned to a corner of the graph that stays in place while the graph scrolls underneath.",
  dependencies: ["source-foundation"],
  exports: ["Panel"],
  sourcePath: "components/ai-elements/panel.tsx",
};
