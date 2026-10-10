import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "prose",
  description:
    "Prose — a thin, deliberately unstyled owner for long-form authored content, its headings sharing one definition with the type scale rather than repeating it under a second selector.",
  dependencies: ["source-foundation"],
  exports: ["Prose"],
  sourcePath: "components/ui/prose.tsx",
};
