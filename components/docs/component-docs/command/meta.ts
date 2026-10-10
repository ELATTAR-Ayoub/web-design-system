/**
 * Documentation metadata for `command`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `command` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "command",
  description:
    "Command — a searchable, keyboard-driven list of actions, usable inline on a page or opened as a modal palette through CommandDialog.",
  dependencies: ["dialog", "input-group", "source-foundation"],
  exports: ["Command", "CommandDialog", "CommandEmpty", "CommandGroup", "CommandInput", "CommandItem", "CommandList", "CommandSeparator", "CommandShortcut"],
  sourcePath: "components/ui/command.tsx",
};
