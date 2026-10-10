/**
 * Documentation metadata for `questionnaire`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `questionnaire` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "questionnaire",
  description:
    "Questionnaire — a single-question-at-a-time form flow: a progress label, a title and description, choice rows with keyboard shortcuts, and previous, skip, next and submit actions to move between questions.",
  dependencies: ["button", "checkbox", "kbd", "radio", "source-foundation"],
  exports: ["Questionnaire", "QuestionnaireActions", "QuestionnaireChoice", "QuestionnaireChoiceDescription", "QuestionnaireChoices", "QuestionnaireDescription", "QuestionnaireError", "QuestionnaireInput", "QuestionnaireItem", "QuestionnaireNext", "QuestionnairePrevious", "QuestionnaireProgress", "QuestionnaireSkip", "QuestionnaireSubmit", "QuestionnaireTitle"],
  sourcePath: "components/ui/questionnaire.tsx",
};
