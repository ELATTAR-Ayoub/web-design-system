/**
 * Documentation metadata for `agent-generated-image`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "agent-generated-image",
  description: "The frame a tool-generated image appears in: it holds the place, shows progress as clarity from blurred to sharp, and offers Retry on a failure.",
  dependencies: ["source-foundation", "button", "spinner"],
  exports: ["GeneratedImage"],
  sourcePath: "components/agent/parts/generated-image.tsx",
};
