/**
 * Documentation metadata for `resizable`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `resizable` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "resizable",
  description:
    "Resizable — a panel group split by a draggable handle, for panes the user resizes themselves rather than a layout fixed by the page, in either horizontal or vertical orientation.",
  dependencies: ["source-foundation"],
  exports: ["ResizableHandle", "ResizablePanel", "ResizablePanelGroup"],
  sourcePath: "components/ui/resizable.tsx",
};
