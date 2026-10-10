import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-message",
  description:
    "Shows one chat message, a user's bubble or an assistant's markdown reply, with an action row and a selector for regenerated versions.",
  dependencies: ["source-foundation"],
  exports: ["MessageProps","Message","MessageContentProps","MessageContent","MessageActionsProps","MessageActions","MessageActionProps","MessageAction","MessageBranchProps","MessageBranch","MessageBranchContentProps","MessageBranchContent","MessageBranchSelectorProps","MessageBranchSelector","MessageBranchPreviousProps","MessageBranchPrevious","MessageBranchNextProps","MessageBranchNext","MessageBranchPageProps","MessageBranchPage","MessageResponseProps","MessageResponse","MessageToolbarProps","MessageToolbar"],
  sourcePath: "components/ai-elements/message.tsx",
};
