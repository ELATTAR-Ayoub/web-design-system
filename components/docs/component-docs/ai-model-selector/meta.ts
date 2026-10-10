/**
 * Documentation metadata for `ai-model-selector`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-model-selector",
  description:
    "A search dialog for choosing a model from grouped, filterable rows, opened from any trigger and closed by Escape or a press outside.",
  dependencies: ["source-foundation"],
  exports: ["ModelSelectorProps","ModelSelector","ModelSelectorTriggerProps","ModelSelectorTrigger","ModelSelectorContentProps","ModelSelectorContent","ModelSelectorDialogProps","ModelSelectorDialog","ModelSelectorInputProps","ModelSelectorInput","ModelSelectorListProps","ModelSelectorList","ModelSelectorEmptyProps","ModelSelectorEmpty","ModelSelectorGroupProps","ModelSelectorGroup","ModelSelectorItemProps","ModelSelectorItem","ModelSelectorShortcutProps","ModelSelectorShortcut","ModelSelectorSeparatorProps","ModelSelectorSeparator","ModelSelectorLogoProps","ModelSelectorLogo","ModelSelectorLogoGroupProps","ModelSelectorLogoGroup","ModelSelectorNameProps","ModelSelectorName"],
  sourcePath: "components/ai-elements/model-selector.tsx",
};
