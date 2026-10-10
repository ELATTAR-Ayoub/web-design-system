/**
 * Documentation metadata for `ai-controls`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-controls",
  description:
    "The zoom in, zoom out, fit view and lock buttons for a graph, as a bordered card with 44px targets.",
  dependencies: ["source-foundation"],
  exports: ["ControlsProps","Controls"],
  sourcePath: "components/ai-elements/controls.tsx",
};
