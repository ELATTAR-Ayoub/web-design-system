/**
 * Documentation metadata for `safe-area`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `safe-area` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "safe-area",
  description:
    "The system-bar contract — the notch, the rounded corner and the home indicator, as seven `*-safe` padding utilities that read the device's own `env(safe-area-inset-*)` values and fall back to `0px` everywhere that reports none.",
  dependencies: [],
  exports: [],
  sourcePath: "styles/utilities.css",
};
