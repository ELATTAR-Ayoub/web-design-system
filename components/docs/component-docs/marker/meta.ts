import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "marker",
  description:
    "A note about a list, sitting in the list — a quiet row for something that happened between the other rows, with no background and no emphasis on a matched substring.",
  dependencies: ["source-foundation"],
  exports: ["Marker", "MarkerContent", "MarkerIcon", "markerVariants"],
  sourcePath: "components/ui/marker.tsx",
};
