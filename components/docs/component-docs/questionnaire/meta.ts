import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "questionnaire",
  description:
    "Questionnaire — a single-question-at-a-time form flow: a progress label, a title and description, choice rows with keyboard shortcuts, and previous, skip, next and submit actions to move between questions.",
  dependencies: ["button", "checkbox", "kbd", "radio", "source-foundation"],
  exports: ["Questionnaire", "QuestionnaireActions", "QuestionnaireChoice", "QuestionnaireChoiceDescription", "QuestionnaireChoices", "QuestionnaireDescription", "QuestionnaireError", "QuestionnaireInput", "QuestionnaireItem", "QuestionnaireNext", "QuestionnairePrevious", "QuestionnaireProgress", "QuestionnaireSkip", "QuestionnaireSubmit", "QuestionnaireTitle"],
  sourcePath: "components/ui/questionnaire.tsx",
};
