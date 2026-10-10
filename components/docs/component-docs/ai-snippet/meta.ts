import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-snippet",
  description:
    "A one-line command or value in a read-only field with a prefix and a copy button, built on the system's InputGroup.",
  dependencies: ["source-foundation"],
  exports: ["SnippetProps","Snippet","SnippetAddonProps","SnippetAddon","SnippetTextProps","SnippetText","SnippetInputProps","SnippetInput","SnippetCopyButtonProps","SnippetCopyButton"],
  sourcePath: "components/ai-elements/snippet.tsx",
};
