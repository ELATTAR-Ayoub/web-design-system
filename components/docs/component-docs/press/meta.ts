/**
 * Documentation metadata for `press`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `press` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "press",
  description:
    "The press squish, and only the squish — `@utility press` in `styles/motion.css` transitions `transform` and scales to 0.9 on `:active`. Keyboard operation, the focus ring, role and the 44px target are the host element's job here, unlike Flutter's `Press` widget, which owns all four.",
  dependencies: [],
  exports: [],
  sourcePath: null,
};
