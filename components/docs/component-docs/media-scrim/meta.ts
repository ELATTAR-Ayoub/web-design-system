/**
 * Documentation metadata for `media-scrim`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `media-scrim` is.
 *
 * This was the last capability in the contract with no web implementation.
 * `docs/architecture/platform-parity.md` recorded the gap honestly — "the same
 * word for a different capability", because `bg-scrim` is a flat panel dim —
 * and the per-capability audit kept it open until the utility existed.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "media-scrim",
  description:
    "A bottom-up readability ramp over a photograph or a video — transparent through the upper half, rising to a readable edge — so a title composed directly on media stays legible without an opaque card under it. Theme-independent, because the media is.",
  dependencies: [],
  exports: [],
  sourcePath: "styles/utilities.css",
};
