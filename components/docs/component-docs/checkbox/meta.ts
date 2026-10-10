import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "checkbox",
  description:
    "Checkbox — 20px, and the tick draws itself.",
  dependencies: ["content-change", "source-foundation"],
  exports: ["Checkbox", "CheckboxMark", "checkboxControlClassName"],
  sourcePath: "components/ui/checkbox.tsx",
};
