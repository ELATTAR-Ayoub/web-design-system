/**
 * Documentation metadata for `attachment`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `attachment` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "attachment",
  description:
    "A file card with an idle, uploading, processing, error or done state, a media well and an actions row, used to represent a picked or produced file rather than redrawing one from scratch.",
  dependencies: ["button", "dialog", "source-foundation"],
  exports: ["Attachment", "AttachmentAction", "AttachmentActions", "AttachmentContent", "AttachmentDescription", "AttachmentGroup", "AttachmentMedia", "AttachmentTitle", "AttachmentTrigger"],
  sourcePath: "components/ui/attachment.tsx",
};
