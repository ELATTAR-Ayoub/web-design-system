/**
 * Documentation metadata for `ai-connection`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-connection",
  description:
    "The line drawn while a connection is dragged between two handles, on the system's colours.",
  dependencies: ["source-foundation"],
  exports: ["Connection"],
  sourcePath: "components/ai-elements/connection.tsx",
};
