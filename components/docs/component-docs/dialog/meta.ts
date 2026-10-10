/**
 * Documentation metadata for `dialog`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `dialog` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "dialog",
  description:
    "Accessible modal composition with portal, overlay, jelly transition, compact sizing, media content, header, description, and footer regions.",
  dependencies: ["button", "source-foundation"],
  exports: ["Dialog", "DialogClose", "DialogContent", "DialogDescription", "DialogFooter", "DialogHeader", "DialogMedia", "DialogOverlay", "DialogPortal", "DialogTitle", "DialogTrigger"],
  sourcePath: "components/ui/dialog.tsx",
};
