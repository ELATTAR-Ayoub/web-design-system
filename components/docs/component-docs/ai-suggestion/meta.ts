import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-suggestion",
  description:
    "Shows a row of prompt chips that scrolls sideways and hands the chosen text to the caller.",
  dependencies: ["source-foundation"],
  exports: ["SuggestionsProps","Suggestions","SuggestionProps","Suggestion"],
  sourcePath: "components/ai-elements/suggestion.tsx",
};
