/**
 * Documentation metadata for `combobox`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `combobox` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "combobox",
  description:
    "Combobox — a searchable, filterable select with an optional multi-select chips mode, whose icon-only trigger carries an accessible name by default so no call site can ship it silent.",
  dependencies: ["button", "input-group", "source-foundation"],
  exports: ["Combobox", "ComboboxChip", "ComboboxChips", "ComboboxChipsInput", "ComboboxCollection", "ComboboxContent", "ComboboxEmpty", "ComboboxGroup", "ComboboxInput", "ComboboxItem", "ComboboxLabel", "ComboboxList", "ComboboxSeparator", "ComboboxTrigger", "ComboboxValue", "useComboboxAnchor"],
  sourcePath: "components/ui/combobox.tsx",
};
