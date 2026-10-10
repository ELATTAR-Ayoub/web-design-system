import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "accordion",
  description:
    "Accordion — a vertical stack of disclosures, each header opening its own panel below it to reveal detail without leaving the page, its expand and collapse animated off the panel's measured height rather than a canned keyframe.",
  dependencies: ["source-foundation"],
  exports: ["Accordion", "AccordionContent", "AccordionItem", "AccordionTrigger"],
  sourcePath: "components/ui/accordion.tsx",
};
