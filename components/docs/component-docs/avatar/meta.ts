/**
 * Documentation metadata for `avatar`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `avatar` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "avatar",
  description:
    "Avatar — a circular identity image with an initials fallback for when it fails to load, a status badge pinned to its corner, and a stacking Group with an overflow count, all keyed to one of three sizes.",
  dependencies: ["source-foundation"],
  exports: ["Avatar", "AvatarBadge", "AvatarFallback", "AvatarGroup", "AvatarGroupCount", "AvatarImage"],
  sourcePath: "components/ui/avatar.tsx",
};
