import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "use-reduced-motion",
  description:
    "Hook that reads the user's prefers-reduced-motion setting reactively.",
  dependencies: ["source-foundation"],
  exports: ["usePrefersReducedMotion"],
  sourcePath: "hooks/use-reduced-motion.ts",
};
