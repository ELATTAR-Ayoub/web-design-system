import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-checkpoint",
  description:
    "A bookmark, a label and a rule between two turns of a conversation, with one control to restore to that point.",
  dependencies: ["source-foundation"],
  exports: ["CheckpointProps","Checkpoint","CheckpointIconProps","CheckpointIcon","CheckpointTriggerProps","CheckpointTrigger"],
  sourcePath: "components/ai-elements/checkpoint.tsx",
};
