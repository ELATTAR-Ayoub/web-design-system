/**
 * Documentation metadata for `ai-context`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-context",
  description:
    "A meter that shows how much of a model's context window is used, with a hover popup of input, output and price.",
  dependencies: ["source-foundation"],
  exports: ["ContextProps","Context","ContextTriggerProps","ContextTrigger","ContextContentProps","ContextContent","ContextContentHeaderProps","ContextContentHeader","ContextContentBodyProps","ContextContentBody","ContextContentFooterProps","ContextContentFooter","ContextInputUsageProps","ContextInputUsage","ContextOutputUsageProps","ContextOutputUsage","ContextReasoningUsageProps","ContextReasoningUsage","ContextCacheUsageProps","ContextCacheUsage"],
  sourcePath: "components/ai-elements/context.tsx",
};
