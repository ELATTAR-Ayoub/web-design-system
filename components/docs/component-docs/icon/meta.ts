import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "icon",
  description:
    "Curated, token-sized icon renderer and generated path catalog used by interactive components.",
  dependencies: [],
  exports: ["ICON_SIZES", "ICON_TONES", "Icon", "IconSize", "IconTone"],
  sourcePath: "components/ui/icon.tsx",
};
