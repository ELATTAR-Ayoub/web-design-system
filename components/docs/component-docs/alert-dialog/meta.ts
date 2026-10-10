/**
 * Documentation metadata for `alert-dialog`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `alert-dialog` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "alert-dialog",
  description:
    "Confirmation dialog support component for consequential actions, composed with the dialog, button, and tooltip contracts.",
  dependencies: ["button", "source-foundation", "spinner", "tooltip"],
  exports: ["AlertDialog", "AlertDialogAction", "AlertDialogCancel", "AlertDialogContent", "AlertDialogDescription", "AlertDialogFooter", "AlertDialogHeader", "AlertDialogMedia", "AlertDialogOverlay", "AlertDialogPortal", "AlertDialogTitle", "AlertDialogTrigger"],
  sourcePath: "components/ui/alert-dialog.tsx",
};
