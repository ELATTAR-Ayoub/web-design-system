/**
 * Documentation metadata for `ai-sources`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-sources",
  description:
    "Lists the pages a reply drew on, behind a 'Used N sources' line that opens and closes.",
  dependencies: ["source-foundation"],
  exports: ["SourcesProps","Sources","SourcesTriggerProps","SourcesTrigger","SourcesContentProps","SourcesContent","SourceProps","Source"],
  sourcePath: "components/ai-elements/sources.tsx",
};
