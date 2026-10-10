import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-jsx-preview",
  description:
    "Renders a string of JSX as live elements, repairing half-streamed markup while it arrives and showing an error block when the JSX is malformed.",
  dependencies: ["source-foundation"],
  exports: ["useJSXPreview","JSXPreviewProps","JSXPreview","JSXPreviewContentProps","JSXPreviewContent","JSXPreviewErrorProps","JSXPreviewError"],
  sourcePath: "components/ai-elements/jsx-preview.tsx",
};
