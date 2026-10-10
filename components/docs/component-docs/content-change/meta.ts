import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "content-change",
  description:
    "ContentChange — replays an entrance animation when keyed content changes.",
  dependencies: ["source-foundation"],
  exports: ["ContentChange", "ContentChangeProps", "useReplayOnStateChange"],
  sourcePath: "components/ui/content-change.tsx",
};
