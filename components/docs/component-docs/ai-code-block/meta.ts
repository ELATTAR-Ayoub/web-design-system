import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-code-block",
  description:
    "A syntax-highlighted code block with an optional header, filename, language selector and copy button, coloured by the system's code roles through one Shiki theme.",
  dependencies: ["source-foundation"],
  exports: ["highlightCode","CodeBlockContainer","CodeBlockHeader","CodeBlockTitle","CodeBlockFilename","CodeBlockActions","CodeBlockContent","CodeBlock","CodeBlockCopyButtonProps","CodeBlockCopyButton","CodeBlockLanguageSelectorProps","CodeBlockLanguageSelector","CodeBlockLanguageSelectorTriggerProps","CodeBlockLanguageSelectorTrigger","CodeBlockLanguageSelectorValueProps","CodeBlockLanguageSelectorValue","CodeBlockLanguageSelectorContentProps","CodeBlockLanguageSelectorContent","CodeBlockLanguageSelectorItemProps","CodeBlockLanguageSelectorItem"],
  sourcePath: "components/ai-elements/code-block.tsx",
};
