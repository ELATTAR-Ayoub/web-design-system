/**
 * Documentation metadata for `ai-environment-variables`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-environment-variables",
  description:
    "A bordered list of environment variables whose values stay masked until a switch reveals them, with a copy button per row.",
  dependencies: ["source-foundation"],
  exports: ["EnvironmentVariablesProps","EnvironmentVariables","EnvironmentVariablesHeaderProps","EnvironmentVariablesHeader","EnvironmentVariablesTitleProps","EnvironmentVariablesTitle","EnvironmentVariablesToggleProps","EnvironmentVariablesToggle","EnvironmentVariablesContentProps","EnvironmentVariablesContent","EnvironmentVariableGroupProps","EnvironmentVariableGroup","EnvironmentVariableNameProps","EnvironmentVariableName","EnvironmentVariableValueProps","EnvironmentVariableValue","EnvironmentVariableProps","EnvironmentVariable","EnvironmentVariableCopyButtonProps","EnvironmentVariableCopyButton","EnvironmentVariableRequiredProps","EnvironmentVariableRequired"],
  sourcePath: "components/ai-elements/environment-variables.tsx",
};
