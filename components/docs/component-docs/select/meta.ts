import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "select",
  description:
    "Generic typed select with grouped options, separators, labels, keyboard-friendly menu behavior, sizes, and scroll controls.",
  dependencies: ["source-foundation"],
  exports: ["Select", "SelectContent", "SelectGroup", "SelectItem", "SelectLabel", "SelectScrollDownButton", "SelectScrollUpButton", "SelectSeparator", "SelectTrigger", "SelectValue"],
  sourcePath: "components/ui/select.tsx",
};
