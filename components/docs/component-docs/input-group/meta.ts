import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "input-group",
  description:
    "InputGroup — a bordered control that wraps an input or textarea with addons, buttons, and text at either edge, sharing one focus ring across the whole group instead of each part carrying its own.",
  dependencies: ["button", "input", "source-foundation", "textarea"],
  exports: ["InputGroup", "InputGroupAddon", "InputGroupButton", "InputGroupInput", "InputGroupText", "InputGroupTextarea"],
  sourcePath: "components/ui/input-group.tsx",
};
