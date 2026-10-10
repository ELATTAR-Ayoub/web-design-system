/**
 * Documentation metadata for `ai-attachments`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-attachments",
  description:
    "A set of file and source chips shown in grid, inline or list form, each with a preview, a name and an optional remove button.",
  dependencies: ["source-foundation"],
  exports: ["AttachmentData","AttachmentMediaCategory","AttachmentVariant","getMediaCategory","getAttachmentLabel","useAttachmentsContext","useAttachmentContext","AttachmentsProps","Attachments","AttachmentProps","Attachment","AttachmentPreviewProps","AttachmentPreview","AttachmentInfoProps","AttachmentInfo","AttachmentRemoveProps","AttachmentRemove","AttachmentHoverCardProps","AttachmentHoverCard","AttachmentHoverCardTriggerProps","AttachmentHoverCardTrigger","AttachmentHoverCardContentProps","AttachmentHoverCardContent","AttachmentEmptyProps","AttachmentEmpty"],
  sourcePath: "components/ai-elements/attachments.tsx",
};
