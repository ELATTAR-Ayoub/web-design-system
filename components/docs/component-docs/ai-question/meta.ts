/**
 * Documentation metadata for `ai-question`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-question",
  description:
    "A form with which an agent asks a person to choose among options, write free text, or both, and returns the answer on submit.",
  dependencies: ["source-foundation"],
  exports: ["QuestionValue","QuestionResponse","QuestionProps","Question","QuestionPromptProps","QuestionPrompt","QuestionDescriptionProps","QuestionDescription","QuestionOptionsProps","QuestionOptions","QuestionOptionProps","QuestionOption","QuestionInputProps","QuestionInput","QuestionActionsProps","QuestionActions","QuestionSubmitProps","QuestionSubmit"],
  sourcePath: "components/ai-elements/question.tsx",
};
