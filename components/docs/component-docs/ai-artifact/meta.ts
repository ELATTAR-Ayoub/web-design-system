/**
 * Documentation metadata for `ai-artifact`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-artifact",
  description:
    "A bordered card for one piece of generated output: a header with a title, a description and action buttons, and a scrolling body.",
  dependencies: ["source-foundation"],
  exports: ["ArtifactProps","Artifact","ArtifactHeaderProps","ArtifactHeader","ArtifactCloseProps","ArtifactClose","ArtifactTitleProps","ArtifactTitle","ArtifactDescriptionProps","ArtifactDescription","ArtifactActionsProps","ArtifactActions","ArtifactActionProps","ArtifactAction","ArtifactContentProps","ArtifactContent"],
  sourcePath: "components/ai-elements/artifact.tsx",
};
