/**
 * Documentation metadata for `ai-image`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-image",
  description:
    "Shows an image the AI SDK generated, given as base64 bytes and a media type, as a responsive rounded picture.",
  dependencies: ["source-foundation"],
  exports: ["ImageProps","Image"],
  sourcePath: "components/ai-elements/image.tsx",
};
