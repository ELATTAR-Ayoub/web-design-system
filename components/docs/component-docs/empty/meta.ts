import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "empty",
  description:
    "Empty — a dashed-border placeholder for a list, page, or panel with nothing in it yet, pairing an icon or illustration with a title, description, and an optional action.",
  dependencies: ["source-foundation"],
  exports: ["Empty", "EmptyContent", "EmptyDescription", "EmptyHeader", "EmptyMedia", "EmptyTitle"],
  sourcePath: "components/ui/empty.tsx",
};
