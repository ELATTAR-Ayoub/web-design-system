import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "textarea",
  description:
    "Textarea — a multi-line text field that grows to fit its content, sharing Input's pressed shadow, focus ring and invalid state rather than defining its own.",
  dependencies: ["source-foundation"],
  exports: ["Textarea"],
  sourcePath: "components/ui/textarea.tsx",
};
