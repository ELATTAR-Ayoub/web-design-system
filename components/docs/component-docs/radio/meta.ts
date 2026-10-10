import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "radio",
  description:
    "Radio — 20px to match Checkbox, squashes on selection, and the dot pops in on the spring curve rather than appearing. Radix only mounts the indicator when the item becomes checked, so the pop fires on every real selection.",
  dependencies: ["content-change", "source-foundation"],
  exports: ["RadioGroup", "RadioGroupItem", "RadioIndicator", "radioControlClassName"],
  sourcePath: "components/ui/radio.tsx",
};
