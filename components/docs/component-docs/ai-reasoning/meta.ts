/**
 * Documentation metadata for `ai-reasoning`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-reasoning",
  description:
    "Shows a model's thinking as a collapsible block that opens while it streams, reports how long it took and closes itself afterwards.",
  dependencies: ["source-foundation"],
  exports: ["useReasoning","ReasoningProps","Reasoning","ReasoningTriggerProps","ReasoningTrigger","ReasoningContentProps","ReasoningContent"],
  sourcePath: "components/ai-elements/reasoning.tsx",
};
