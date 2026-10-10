"use client";

/**
 * The live Preview specimen for the `questionnaire` documentation page.
 *
 * `components/docs/component-docs/questionnaire/page.tsx` is a plain data
 * module rendered by a SERVER component — passing `onSubmit` into
 * `Questionnaire.Root` (a client component) from a server module crashes the
 * build ("Event handlers cannot be passed to Client Component props"), so
 * that page's own live specimen renders `QuestionnairePrevious` /
 * `QuestionnaireNext` only, never `QuestionnaireSubmit` (see the file header
 * comment there). This companion is the full flow with the piece that needs:
 * two questions, Submit wired to a real `onSubmit`, and a result screen once
 * both are answered — restart to answer differently and see the result
 * change.
 */

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";

const ITEMS = [
  { name: "buys", required: true, choices: [{ value: "packs" }, { value: "singles" }, { value: "both" }] },
  { name: "budget", required: true, choices: [{ value: "low" }, { value: "mid" }, { value: "high" }] },
] as const;

const RECOMMENDATION: Record<string, Record<string, string>> = {
  packs: {
    low: "Try the $5 Starter Packs — low variance, quick opens.",
    mid: "The Weekly Drop bundle fits your budget best.",
    high: "The Vault Series is built for exactly this budget.",
  },
  singles: {
    low: "Browse the Marketplace filtered under $10.",
    mid: "Set a Marketplace alert around your usual range.",
    high: "A Vault subscription surfaces high-value singles first.",
  },
  both: {
    low: "Mix a $5 pack with a Marketplace watchlist.",
    mid: "The Collector bundle blends packs and singles.",
    high: "The Vault Series plus a standing Marketplace alert.",
  },
};

export function BuyerSurveySpecimen() {
  const [result, setResult] = useState<{ buys: string; budget: string } | null>(null);

  if (result) {
    const recommendation = RECOMMENDATION[result.buys]?.[result.budget] ?? "Take a look around the Marketplace.";
    return (
      <div className="max-w-lg space-y-4 rounded-lg border border-border bg-card p-6 text-center">
        <Icon icon={CheckCircle2} size="lg" tone="success" className="mx-auto" />
        <p className="type-h4 text-foreground">Recommended for you</p>
        <p className="type-small text-muted-foreground">{recommendation}</p>
        <Button variant="outline" onClick={() => setResult(null)}>
          Retake the survey
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <Questionnaire
        items={ITEMS}
        shortcuts="letters"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setResult({
            buys: String(data.get("buys") ?? ""),
            budget: String(data.get("budget") ?? ""),
          });
        }}
      >
        <QuestionnaireProgress />
        <QuestionnaireItem name="buys" required>
          <QuestionnaireTitle>What do you buy most?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="packs">
              Sealed packs
              <QuestionnaireChoiceDescription>The opening is the point.</QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
            <QuestionnaireChoice value="singles">
              Singles
              <QuestionnaireChoiceDescription>I know exactly which card I want.</QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
            <QuestionnaireChoice value="both">Both, evenly</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="budget" required>
          <QuestionnaireTitle>Monthly budget?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="low">Under $50</QuestionnaireChoice>
            <QuestionnaireChoice value="mid">$50 – $200</QuestionnaireChoice>
            <QuestionnaireChoice value="high">Over $200</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext />
          <QuestionnaireSubmit>See my recommendation</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  );
}
