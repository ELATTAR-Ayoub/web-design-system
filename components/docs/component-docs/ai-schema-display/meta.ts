import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-schema-display",
  description:
    "Documents one HTTP endpoint: the method badge and path, a description, and collapsible Parameters, Request Body and Response sections with nested properties.",
  dependencies: ["source-foundation"],
  exports: ["SchemaDisplayHeaderProps","SchemaDisplayHeader","SchemaDisplayMethodProps","SchemaDisplayMethod","SchemaDisplayPathProps","SchemaDisplayPath","SchemaDisplayDescriptionProps","SchemaDisplayDescription","SchemaDisplayContentProps","SchemaDisplayContent","SchemaDisplayParameterProps","SchemaDisplayParameter","SchemaDisplayParametersProps","SchemaDisplayParameters","SchemaDisplayPropertyProps","SchemaDisplayProperty","SchemaDisplayRequestProps","SchemaDisplayRequest","SchemaDisplayResponseProps","SchemaDisplayResponse","SchemaDisplayProps","SchemaDisplay","SchemaDisplayBodyProps","SchemaDisplayBody","SchemaDisplayExampleProps","SchemaDisplayExample"],
  sourcePath: "components/ai-elements/schema-display.tsx",
};
