import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "message",
  description:
    "Message — the anatomy of one chat turn: an avatar, a header, content and a footer, aligned to the start or end of the transcript depending on who is speaking.",
  dependencies: ["source-foundation"],
  exports: ["Message", "MessageAvatar", "MessageContent", "MessageFooter", "MessageGroup", "MessageHeader"],
  sourcePath: "components/ui/message.tsx",
};
