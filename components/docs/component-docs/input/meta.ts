import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "input",
  description:
    "A single-line text field with the system's pressed inner shadow at rest, a focus ring that replaces it, and an invalid state that recolours the ring rather than the text — the control every form field composes.",
  dependencies: ["source-foundation"],
  exports: ["Input"],
  sourcePath: "components/ui/input.tsx",
};
