/**
 * Documentation metadata for `agent-avatar`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `agent-avatar` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "agent-avatar",
  description:
    "The assistant's default face: twenty isometric cube scenes that cross-fade between agent states and rotate on three axes while idle.",
  dependencies: [],
  exports: ["CubeAvatar"],
  sourcePath: "components/agent/avatar/cube-avatar.tsx",
};
