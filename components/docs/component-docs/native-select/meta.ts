import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "native-select",
  description:
    "Native select — a styled wrapper around the browser's own select element, kept for pickers that should behave like a native form control rather than opening a custom listbox.",
  dependencies: ["source-foundation"],
  exports: ["NativeSelect", "NativeSelectOptGroup", "NativeSelectOption"],
  sourcePath: "components/ui/native-select.tsx",
};
