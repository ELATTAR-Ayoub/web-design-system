/**
 * Documentation metadata for `card`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `card` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "card",
  description:
    "A neutral content surface with structured header, title, description, content, and footer regions.",
  dependencies: ["source-foundation"],
  exports: ["Card", "CardAction", "CardContent", "CardDescription", "CardFooter", "CardHeader", "CardTitle"],
  sourcePath: "components/ui/card.tsx",
};
