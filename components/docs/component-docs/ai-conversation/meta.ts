/**
 * Documentation metadata for `ai-conversation`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-conversation",
  description:
    "Wraps a chat thread in a scrolling log that follows new messages, with an empty state, a scroll-to-latest button and a Markdown download.",
  dependencies: ["source-foundation"],
  exports: ["ConversationProps","Conversation","ConversationContentProps","ConversationContent","ConversationEmptyStateProps","ConversationEmptyState","ConversationScrollButtonProps","ConversationScrollButton","ConversationDownloadProps","messagesToMarkdown","ConversationDownload"],
  sourcePath: "components/ai-elements/conversation.tsx",
};
