import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "command",
  description:
    "Command — a searchable, keyboard-driven list of actions, usable inline on a page or opened as a modal palette through CommandDialog.",
  dependencies: ["dialog", "input-group", "source-foundation"],
  exports: ["Command", "CommandDialog", "CommandEmpty", "CommandGroup", "CommandInput", "CommandItem", "CommandList", "CommandSeparator", "CommandShortcut"],
  sourcePath: "components/ui/command.tsx",
};
