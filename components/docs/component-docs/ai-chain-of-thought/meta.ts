import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-chain-of-thought",
  description:
    "Shows an agent's steps, with search results and images, as a collapsible list under a one-line header.",
  dependencies: ["source-foundation"],
  exports: ["ChainOfThoughtProps","ChainOfThought","ChainOfThoughtHeaderProps","ChainOfThoughtHeader","ChainOfThoughtStepProps","ChainOfThoughtStep","ChainOfThoughtSearchResultsProps","ChainOfThoughtSearchResults","ChainOfThoughtSearchResultProps","ChainOfThoughtSearchResult","ChainOfThoughtContentProps","ChainOfThoughtContent","ChainOfThoughtImageProps","ChainOfThoughtImage"],
  sourcePath: "components/ai-elements/chain-of-thought.tsx",
};
