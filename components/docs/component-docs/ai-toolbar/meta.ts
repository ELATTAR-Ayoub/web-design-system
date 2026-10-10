/**
 * Documentation metadata for `ai-toolbar`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-toolbar",
  description:
    "A row of actions that floats beside a graph node and shows when that node is selected.",
  dependencies: ["source-foundation"],
  exports: ["Toolbar"],
  sourcePath: "components/ai-elements/toolbar.tsx",
};
