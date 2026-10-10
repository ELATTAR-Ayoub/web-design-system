import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-open-in-chat",
  description:
    "Offers a menu of chat services you supply, each opening in a new tab with a prompt already filled in.",
  dependencies: ["source-foundation"],
  exports: ["OpenInProps","OpenIn","OpenInContentProps","OpenInContent","OpenInItemProps","OpenInItem","OpenInLabelProps","OpenInLabel","OpenInSeparatorProps","OpenInSeparator","OpenInTriggerProps","OpenInTrigger","OpenInTarget","OpenInLinkProps","OpenInLink"],
  sourcePath: "components/ai-elements/open-in-chat.tsx",
};
