import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "badge",
  description:
    "A flat chip for a status, a count or a category — eleven variants over one type role, sentence case unless the call site uppercases, and no gradient or shadow.",
  dependencies: ["source-foundation"],
  exports: ["Badge", "badgeVariants"],
  sourcePath: "components/ui/badge.tsx",
};
