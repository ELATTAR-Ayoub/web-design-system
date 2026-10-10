/**
 * Documentation metadata for `input-group`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `input-group` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "input-group",
  description:
    "InputGroup — a bordered control that wraps an input or textarea with addons, buttons, and text at either edge, sharing one focus ring across the whole group instead of each part carrying its own.",
  dependencies: ["button", "input", "source-foundation", "textarea"],
  exports: ["InputGroup", "InputGroupAddon", "InputGroupButton", "InputGroupInput", "InputGroupText", "InputGroupTextarea"],
  sourcePath: "components/ui/input-group.tsx",
};
