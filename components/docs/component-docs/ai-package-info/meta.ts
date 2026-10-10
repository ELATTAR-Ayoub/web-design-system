/**
 * Documentation metadata for `ai-package-info`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-package-info",
  description:
    "A card for one package and its change: the name, a badge for the kind of change, the version it moves from and to, a description and a dependency list.",
  dependencies: ["source-foundation"],
  exports: ["PackageInfoHeaderProps","PackageInfoHeader","PackageInfoNameProps","PackageInfoName","PackageInfoChangeTypeProps","PackageInfoChangeType","PackageInfoVersionProps","PackageInfoVersion","PackageInfoProps","PackageInfo","PackageInfoDescriptionProps","PackageInfoDescription","PackageInfoContentProps","PackageInfoContent","PackageInfoDependenciesProps","PackageInfoDependencies","PackageInfoDependencyProps","PackageInfoDependency"],
  sourcePath: "components/ai-elements/package-info.tsx",
};
