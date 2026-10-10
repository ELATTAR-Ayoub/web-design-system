/**
 * Documentation metadata for `ai-suggestion`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-suggestion",
  description:
    "Shows a row of prompt chips that scrolls sideways and hands the chosen text to the caller.",
  dependencies: ["source-foundation"],
  exports: ["SuggestionsProps","Suggestions","SuggestionProps","Suggestion"],
  sourcePath: "components/ai-elements/suggestion.tsx",
};
