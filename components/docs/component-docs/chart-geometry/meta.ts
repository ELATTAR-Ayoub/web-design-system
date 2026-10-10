/**
 * Documentation metadata for `chart-geometry`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `chart-geometry` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "chart-geometry",
  description:
    "The scale, nice-tick, curve-interpolation and polar-arc maths every chart is built on — delivered by recharts itself, not a component of ours, the way Flutter's chart_geometry.dart delivers it as a shared library instead.",
  dependencies: [],
  exports: [],
  sourcePath: null,
};
