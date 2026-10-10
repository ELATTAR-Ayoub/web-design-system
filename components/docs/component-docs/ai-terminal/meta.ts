/**
 * Documentation metadata for `ai-terminal`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-terminal",
  description:
    "A terminal output panel that renders a command's ANSI colours on the system's ink roles, with copy, clear and a streaming caret.",
  dependencies: ["source-foundation"],
  exports: ["TerminalHeaderProps","TerminalHeader","TerminalTitleProps","TerminalTitle","TerminalStatusProps","TerminalStatus","TerminalActionsProps","TerminalActions","TerminalCopyButtonProps","TerminalCopyButton","TerminalClearButtonProps","TerminalClearButton","TerminalContentProps","TerminalContent","TerminalProps","Terminal"],
  sourcePath: "components/ai-elements/terminal.tsx",
};
