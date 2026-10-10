import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel } from "@/components/ds/kit";

import { BuyerSurveySpecimen } from "./questionnaire-survey-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "questionnaire",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "One question at a time, with its own progress and keyboard shortcuts. Press A, B or C to answer, Next to advance, and Submit on the last question actually produces a recommendation below it — restart to answer differently.",
      label: "Buyer survey",
      render: <BuyerSurveySpecimen />,
      source: `"use client";

import { useState } from "react";

export function BuyerSurveySpecimen() {
  const [result, setResult] = useState<{ buys: string; budget: string } | null>(null);

  if (result) {
    return (
      <div>
        <p>Recommended for you</p>
        <p>{RECOMMENDATION[result.buys]?.[result.budget]}</p>
        <Button variant="outline" onClick={() => setResult(null)}>Retake the survey</Button>
      </div>
    );
  }

  return (
    <Questionnaire
      items={SURVEY_ITEMS}
      shortcuts="letters"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult({ buys: String(data.get("buys")), budget: String(data.get("budget")) });
      }}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="buys" required>
        <QuestionnaireTitle>What do you buy most?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="packs">Sealed packs</QuestionnaireChoice>
          <QuestionnaireChoice value="singles">Singles</QuestionnaireChoice>
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
  );
}`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "The full flow, including the one piece Preview above cannot show live: onSubmit, and the QuestionnaireSubmit button that triggers it. onSubmit gets a native SubmitEvent — read the answers off the form with FormData, the same way any uncontrolled <form> would.",
      language: "tsx",
      code: `"use client";

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
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
  { name: "buys", required: true, choices: [{ value: "packs" }, { value: "singles" }] },
] as const;

export function BuyerSurvey() {
  return (
    <Questionnaire
      items={ITEMS}
      shortcuts="letters"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log(Object.fromEntries(data));
      }}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="buys" required>
        <QuestionnaireTitle>What do you buy most?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="packs">Sealed packs</QuestionnaireChoice>
          <QuestionnaireChoice value="singles">Singles</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        'shortcuts picks the badge each choice renders: "letters" (A, B, C…) or "numbers" (1, 2, 3…). Omit the prop and no shortcut badges render at all, and the keys do nothing.',
      label: "shortcuts",
      render: (
        <div className="grid gap-6 sm:grid-cols-2">
          <Panel label='shortcuts="letters"'>
            <Questionnaire items={[{ name: "v-letters", choices: [{ value: "a" }, { value: "b" }] }]} shortcuts="letters">
              <QuestionnaireItem name="v-letters">
                <QuestionnaireTitle>Pick one</QuestionnaireTitle>
                <QuestionnaireChoices>
                  <QuestionnaireChoice value="a">Option A</QuestionnaireChoice>
                  <QuestionnaireChoice value="b">Option B</QuestionnaireChoice>
                </QuestionnaireChoices>
              </QuestionnaireItem>
            </Questionnaire>
          </Panel>
          <Panel label='shortcuts="numbers"'>
            <Questionnaire items={[{ name: "v-numbers", choices: [{ value: "a" }, { value: "b" }] }]} shortcuts="numbers">
              <QuestionnaireItem name="v-numbers">
                <QuestionnaireTitle>Pick one</QuestionnaireTitle>
                <QuestionnaireChoices>
                  <QuestionnaireChoice value="a">Option A</QuestionnaireChoice>
                  <QuestionnaireChoice value="b">Option B</QuestionnaireChoice>
                </QuestionnaireChoices>
              </QuestionnaireItem>
            </Questionnaire>
          </Panel>
        </div>
      ),
      source: `<Questionnaire items={ITEMS} shortcuts="letters">…</Questionnaire>
<Questionnaire items={ITEMS} shortcuts="numbers">…</Questionnaire>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "QuestionnaireInput for a free-text answer instead of a choice list, and a disabled choice. QuestionnaireChoice's mark is drawn from the same chassis as Checkbox and Radio — checkboxControlClassName / CheckboxMark or radioControlClassName / RadioIndicator over a real native input — so a questionnaire choice can never visually drift from the selection controls it is quoting; a real Checkbox or Radio is not nested inside the row precisely because the row itself is already the clickable label.",
      label: "Free text and a disabled choice",
      render: (
        <div className="max-w-lg space-y-6">
          <Panel label="QuestionnaireInput">
            <Questionnaire items={[{ name: "ex-handle" }]}>
              <QuestionnaireItem name="ex-handle">
                <QuestionnaireTitle>What&rsquo;s your collector handle?</QuestionnaireTitle>
                <QuestionnaireInput placeholder="ayoub" aria-label="Collector handle" />
              </QuestionnaireItem>
            </Questionnaire>
          </Panel>
          <Panel label="A disabled choice">
            <Questionnaire
              items={[{ name: "ex-tier", choices: [{ value: "free" }, { value: "vault", disabled: true }] }]}
            >
              <QuestionnaireItem name="ex-tier">
                <QuestionnaireTitle>Choose a tier</QuestionnaireTitle>
                <QuestionnaireChoices>
                  <QuestionnaireChoice value="free">Free</QuestionnaireChoice>
                  <QuestionnaireChoice
                    value="vault"
                    disabled
                    disabledReason="Invite only — request access from your account settings."
                  >
                    Vault
                    <QuestionnaireChoiceDescription>Invite only, for now.</QuestionnaireChoiceDescription>
                  </QuestionnaireChoice>
                </QuestionnaireChoices>
              </QuestionnaireItem>
            </Questionnaire>
          </Panel>
        </div>
      ),
      source: `<QuestionnaireItem name="handle">
  <QuestionnaireTitle>What's your collector handle?</QuestionnaireTitle>
  <QuestionnaireInput placeholder="ayoub" aria-label="Collector handle" />
</QuestionnaireItem>

<QuestionnaireItem name="tier">
  <QuestionnaireTitle>Choose a tier</QuestionnaireTitle>
  <QuestionnaireChoices>
    <QuestionnaireChoice value="free">Free</QuestionnaireChoice>
    <QuestionnaireChoice
      value="vault"
      disabled
      disabledReason="Invite only — request access from your account settings."
    >
      Vault
      <QuestionnaireChoiceDescription>Invite only, for now.</QuestionnaireChoiceDescription>
    </QuestionnaireChoice>
  </QuestionnaireChoices>
</QuestionnaireItem>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Questionnaire is @shadcn/react's headless Questionnaire primitive, restyled. Every prop below is forwarded straight through beyond the styled parts' className merges and the data-shortcut / data-invalid attributes this file's own QuestionnaireChoice adds (see the source comment in components/ui/questionnaire.tsx on why those needed taking over rendering to reach).",
      blocks: [
        {
          label: "Questionnaire (Root)",
          body: (
            <Meta
              items={[
                { k: "items", v: "readonly QuestionnaireItemDefinition[] — { name, required?, disabled?, choices? }[]. Drives Next's required-field gate and the progress count." },
                { k: "item / defaultItem / onItemChange", v: "Controlled / uncontrolled current question, by name." },
                { k: "shortcuts", v: '"letters" | "numbers" — omitted, no shortcut badges render and the keys do nothing.' },
                { k: "onSubmit", v: "Native form SubmitEvent handler, fired by QuestionnaireSubmit on the last question. Read answers with FormData(event.currentTarget)." },
                { k: "...props", v: 'Every other <form> attribute (noValidate, onReset, aria-*, etc.), forwarded directly.' },
              ]}
            />
          ),
        },
        {
          label: "QuestionnaireItem",
          body: (
            <Meta
              items={[
                { k: "name", v: "Required. Matches an entry in items." },
                { k: "required", v: "Blocks QuestionnaireNext / QuestionnaireSubmit while unanswered." },
                { k: "invalid", v: "Forces the invalid visual and QuestionnaireError's role — set statically for a demo, or driven by validation in a real flow." },
                { k: "multiple", v: "Renders its choices as checkboxes instead of radios." },
                { k: "onStatusChange", v: "(status: \"unanswered\" | \"answered\" | \"skipped\") => void." },
              ]}
            />
          ),
        },
        {
          label: "QuestionnaireChoice, QuestionnaireChoiceDescription, QuestionnaireChoiceShortcut",
          body: (
            <Meta
              items={[
                { k: "QuestionnaireChoice", v: "value (required), disabled, checked / defaultChecked, onChange, disabledReason. disabledReason is wired by hand in the same shape components/ui/disabled.tsx uses — an always-on aria-describedby on the real hidden <input> plus a click/tap-reachable popover — because Choice's own render prop already owns the full <label> composition, leaving no seam for the Disabled wrapper's single-child clone." },
                { k: "QuestionnaireChoiceDescription", v: "Muted secondary line inside a choice's label." },
                { k: "QuestionnaireChoiceShortcut", v: "Renders a Kbd automatically from the computed shortcut letter/number; hidden entirely when shortcuts is unset." },
              ]}
            />
          ),
        },
        {
          label: "QuestionnaireInput",
          body: (
            <Meta
              items={[
                { k: "type", v: '"text" (default) | "email" | "number" | "password" | "search" | "tel" | "url" | date/time variants.' },
                { k: "(no name prop)", v: "Bound to the enclosing QuestionnaireItem's name automatically — omitted from the public props for that reason." },
              ]}
            />
          ),
        },
        {
          label: "QuestionnaireProgress, QuestionnairePrevious, QuestionnaireSkip, QuestionnaireNext, QuestionnaireSubmit",
          body: (
            <Meta
              items={[
                { k: "QuestionnaireProgress", v: 'Renders "Question X of Y" from Root\'s own current/total state — nothing to pass.' },
                { k: "QuestionnairePrevious / Skip / Next / Submit", v: "size / variant (Button's own), forwarded to buttonVariants(). Visibility, disabled state and the Enter shortcut all come from Root's navigation state, not from props." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "current / answered / skipped / invalid are the questionnaire's own state machine, driven by Root — QuestionnaireItem's invalid prop below is set directly only to demonstrate the visual; in a real flow it comes from validation.",
      blocks: [
        {
          body: (
            <div className="grid gap-6 sm:grid-cols-2">
              <Panel label="rest">
                <Questionnaire items={[{ name: "s-rest", choices: [{ value: "a" }, { value: "b" }] }]}>
                  <QuestionnaireItem name="s-rest">
                    <QuestionnaireTitle>Pick one</QuestionnaireTitle>
                    <QuestionnaireChoices>
                      <QuestionnaireChoice value="a">Option A</QuestionnaireChoice>
                      <QuestionnaireChoice value="b">Option B</QuestionnaireChoice>
                    </QuestionnaireChoices>
                  </QuestionnaireItem>
                </Questionnaire>
              </Panel>
              <Panel label="answered">
                <Questionnaire items={[{ name: "s-answered", choices: [{ value: "a" }, { value: "b" }] }]}>
                  <QuestionnaireItem name="s-answered">
                    <QuestionnaireTitle>Pick one</QuestionnaireTitle>
                    <QuestionnaireChoices>
                      <QuestionnaireChoice value="a" defaultChecked>Option A</QuestionnaireChoice>
                      <QuestionnaireChoice value="b">Option B</QuestionnaireChoice>
                    </QuestionnaireChoices>
                  </QuestionnaireItem>
                </Questionnaire>
              </Panel>
              <Panel label="invalid" note="Blocks Next until answered">
                <Questionnaire items={[{ name: "s-invalid", required: true, choices: [{ value: "a" }, { value: "b" }] }]}>
                  <QuestionnaireItem name="s-invalid" required invalid>
                    <QuestionnaireTitle>Pick one</QuestionnaireTitle>
                    <QuestionnaireChoices>
                      <QuestionnaireChoice value="a">Option A</QuestionnaireChoice>
                      <QuestionnaireChoice value="b">Option B</QuestionnaireChoice>
                    </QuestionnaireChoices>
                    <QuestionnaireError>Pick one to continue.</QuestionnaireError>
                  </QuestionnaireItem>
                </Questionnaire>
              </Panel>
              <Panel label="disabled item">
                <Questionnaire items={[{ name: "s-disabled", disabled: true, choices: [{ value: "a" }] }]}>
                  <QuestionnaireItem name="s-disabled" disabled>
                    <QuestionnaireTitle>Pick one</QuestionnaireTitle>
                    <QuestionnaireChoices>
                      <QuestionnaireChoice value="a">Option A</QuestionnaireChoice>
                    </QuestionnaireChoices>
                  </QuestionnaireItem>
                </Questionnaire>
              </Panel>
            </div>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the omitted rows">
              <p>
                <strong>loading</strong> and <strong>success</strong> are N/A
                on Questionnaire itself: moving between questions is
                synchronous, and a real submit&rsquo;s pending/success feedback
                belongs to whatever Button the consumer&rsquo;s own layout puts
                next to QuestionnaireSubmit — the same reasoning as Form&rsquo;s
                Submit states.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "Questionnaire follows the same fieldset/legend/radiogroup pattern a plain HTML survey would use, with the progress and errors additionally announced as they change.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "QuestionnaireItem", v: 'A <fieldset>; QuestionnaireTitle is its <legend>. One accessible group per question, matching FieldSet + FieldLegend\'s own pattern on the field page.' },
                { k: "QuestionnaireChoices", v: 'role="radiogroup" for single-select, a checkbox group for multiple — native semantics, not reimplemented.' },
                { k: "QuestionnaireError", v: 'Shares FieldError\'s role="alert" contract, scoped to the current question — announced only once the item is invalid.' },
                { k: "QuestionnaireProgress", v: 'A live region carrying "Question X of Y" — a screen-reader user gets step count the same way a sighted one reads the progress label.' },
                { k: "Required gating", v: "QuestionnaireNext and QuestionnaireSubmit disable natively (not merely visually) while a required item is unanswered, so the disabled state is exposed to assistive tech the same way it is to a mouse." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Tab / Shift+Tab", v: "Moves focus through the current question's choices, then Previous / Next / Submit." },
                { k: "Arrow keys", v: "Move the radiogroup selection within QuestionnaireChoices, matching native radio-group behaviour." },
                { k: "A–C or 1–3", v: 'When shortcuts is set, jumps directly to the matching choice — the badge QuestionnaireChoiceShortcut renders is the same key.' },
                { k: "Enter", v: "Activates Next (or Submit, on the last question) from anywhere in the current question, shown on the button as its own shortcut hint." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "One question at a time, in a flex column with no fixed width — the same shape narrow or wide.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Layout",
                  v: "Questionnaire is flex w-full min-w-0 flex-col, and QuestionnaireItem the same — nothing in the family sets a width, so the whole flow simply matches whatever container it is placed in, from a narrow mobile sheet to a wide settings panel.",
                },
                {
                  k: "Progress label",
                  v: "QuestionnaireProgress reserves min-h-4 min-w-[14ch] so the \"Question X of Y\" text has a stable box before it streams in, rather than reflowing the row above it once the count is known.",
                },
                {
                  k: "200% text zoom",
                  v: "Choices, titles and descriptions are ordinary flowed text with no truncation in source, so doubled zoom wraps rather than clips; QuestionnaireChoiceShortcut's Kbd badge is a fixed small control that sits beside the wrapping label rather than inside it.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920, none at 200% text zoom, and none under RTL.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        { body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> },
      ],
    },
  ],
};
