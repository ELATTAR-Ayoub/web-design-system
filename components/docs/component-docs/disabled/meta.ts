/**
 * Documentation metadata for `disabled`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `disabled` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "disabled",
  description:
    "Disabled — the reason-and-recovery contract around an inert control.",
  dependencies: ["button", "popover", "source-foundation"],
  exports: ["Disabled", "DisabledMode", "DisabledProps"],
  sourcePath: "components/ui/disabled.tsx",
};
