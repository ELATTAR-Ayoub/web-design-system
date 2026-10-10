/**
 * Documentation metadata for `tabs`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `tabs` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "tabs",
  description:
    "Tabs — switchable content panels whose selected trigger is marked by one indicator that physically slides to it, a filled pill or a thin underline, rather than each trigger painting its own selected state.",
  dependencies: ["active-indicator", "source-foundation"],
  exports: ["Tabs", "TabsContent", "TabsList", "TabsTrigger", "tabsListVariants"],
  sourcePath: "components/ui/tabs.tsx",
};
