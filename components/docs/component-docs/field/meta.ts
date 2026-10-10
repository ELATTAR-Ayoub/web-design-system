import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "field",
  description:
    "Accessible field composition with labels, descriptions, errors, orientation, grouping, and validation wiring.",
  dependencies: ["label", "separator", "source-foundation"],
  exports: ["Field", "FieldContent", "FieldDescription", "FieldError", "FieldGroup", "FieldLabel", "FieldLegend", "FieldSeparator", "FieldSet", "FieldTitle"],
  sourcePath: "components/ui/field.tsx",
};
