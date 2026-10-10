import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "use-mobile",
  description:
    "Media-query hook that reports whether the viewport is at the mobile breakpoint.",
  dependencies: ["source-foundation"],
  exports: ["useIsMobile"],
  sourcePath: "hooks/use-mobile.ts",
};
