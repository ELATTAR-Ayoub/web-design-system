/**
 * Documentation metadata for `input`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `input` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "input",
  description:
    "A single-line text field with the system's pressed inner shadow at rest, a focus ring that replaces it, and an invalid state that recolours the ring rather than the text — the control every form field composes.",
  dependencies: ["source-foundation"],
  exports: ["Input"],
  sourcePath: "components/ui/input.tsx",
};
