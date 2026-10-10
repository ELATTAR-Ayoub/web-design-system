/**
 * Documentation metadata for `ai-commit`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-commit",
  description:
    "A git commit card with author, message, short hash, relative age, a copy-hash action and a collapsible list of changed files with status and line counts.",
  dependencies: ["source-foundation"],
  exports: ["CommitProps","Commit","CommitHeaderProps","CommitHeader","CommitHashProps","CommitHash","CommitMessageProps","CommitMessage","CommitMetadataProps","CommitMetadata","CommitSeparatorProps","CommitSeparator","CommitInfoProps","CommitInfo","CommitAuthorProps","CommitAuthor","CommitAuthorAvatarProps","CommitAuthorAvatar","CommitTimestampProps","CommitTimestamp","CommitActionsProps","CommitActions","CommitCopyButtonProps","CommitCopyButton","CommitContentProps","CommitContent","CommitFilesProps","CommitFiles","CommitFileProps","CommitFile","CommitFileInfoProps","CommitFileInfo","CommitFileStatusProps","CommitFileStatus","CommitFileIconProps","CommitFileIcon","CommitFilePathProps","CommitFilePath","CommitFileChangesProps","CommitFileChanges","CommitFileAdditionsProps","CommitFileAdditions","CommitFileDeletionsProps","CommitFileDeletions"],
  sourcePath: "components/ai-elements/commit.tsx",
};
