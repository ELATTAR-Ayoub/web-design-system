import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-queue",
  description:
    "A frame for messages waiting to be sent, with collapsible sections, rows, per-row actions and attachment chips.",
  dependencies: ["source-foundation"],
  exports: ["QueueMessagePart","QueueMessage","QueueTodo","QueueItemProps","QueueItem","QueueItemIndicatorProps","QueueItemIndicator","QueueItemContentProps","QueueItemContent","QueueItemDescriptionProps","QueueItemDescription","QueueItemActionsProps","QueueItemActions","QueueItemActionProps","QueueItemAction","QueueItemAttachmentProps","QueueItemAttachment","QueueItemImageProps","QueueItemImage","QueueItemFileProps","QueueItemFile","QueueListProps","QueueList","QueueSectionProps","QueueSection","QueueSectionTriggerProps","QueueSectionTrigger","QueueSectionLabelProps","QueueSectionLabel","QueueSectionContentProps","QueueSectionContent","QueueProps","Queue"],
  sourcePath: "components/ai-elements/queue.tsx",
};
