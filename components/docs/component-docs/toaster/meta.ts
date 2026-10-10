/**
 * Documentation metadata for `toaster`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `toaster` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "toaster",
  description:
    "Toaster — this system's capability for transient, self-dismissing status notifications, themed to the current light or dark mode and iconed by type rather than left to its underlying library's defaults.",
  dependencies: ["source-foundation"],
  exports: ["TOAST_ICONS", "ToastType", "Toaster"],
  sourcePath: "components/ui/toaster.tsx",
};
