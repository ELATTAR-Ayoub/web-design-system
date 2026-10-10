import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-file-tree",
  description:
    "A collapsible file and folder tree with selection, for showing which files a step touched or letting a reader pick one.",
  dependencies: ["source-foundation"],
  exports: ["FileTreeProps","FileTree","FileTreeIconProps","FileTreeIcon","FileTreeNameProps","FileTreeName","FileTreeFolderProps","FileTreeFolder","FileTreeFileProps","FileTreeFile","FileTreeActionsProps","FileTreeActions"],
  sourcePath: "components/ai-elements/file-tree.tsx",
};
