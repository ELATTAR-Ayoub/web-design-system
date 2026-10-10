/**
 * Authored documentation page for `ai-question`.
 *
 * Live specimens render the real `Question` from
 * `components/ai-elements/question.tsx`; they live in `question-specimen.tsx`
 * because a spec module cannot carry `"use client"`.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { QuestionExamples, QuestionShowcase, QuestionStateGrid } from "./question-specimen";

const SRC = "components/ai-elements/question.tsx";

export const spec: ComponentDocSpec = {
  name: "ai-question",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A form the agent uses to ask the person something: choices, free text, or both. Pick an owner or write a note and submit.",
      label: "Question",
      render: <QuestionShowcase />,
      source: `import {
  Question, QuestionActions, QuestionDescription, QuestionInput,
  QuestionOption, QuestionOptions, QuestionPrompt, QuestionSubmit,
} from "@/components/ai-elements/question";

<Question selectionMode="single" onSubmit={({ selectedValues, text }) => handOff(selectedValues[0], text)}>
  <div className="space-y-1">
    <QuestionPrompt>Who should take this over?</QuestionPrompt>
    <QuestionDescription>Choose an owner and leave a note.</QuestionDescription>
  </div>
  <QuestionOptions aria-label="Owner">
    {owners.map((o) => <QuestionOption key={o} value={o}>{o}</QuestionOption>)}
  </QuestionOptions>
  <QuestionInput aria-label="Note" placeholder="What should they know?" />
  <QuestionActions>
    <QuestionSubmit>Hand off</QuestionSubmit>
  </QuestionActions>
</Question>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It composes the system&apos;s own Button and Textarea.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Question is a form that owns the answer: the chosen option values and the free text. It is uncontrolled by default (defaultValue); pass value and onValueChange to control it. onSubmit receives { selectedValues, text } with the text trimmed and omitted when blank, and is not called at all when nothing is answered or the form is disabled. Set selectionMode to \"multiple\" for checkboxes; the default is \"single\" radios. QuestionOptions, QuestionOption, QuestionInput and QuestionSubmit must be inside Question.",
      language: "tsx",
      code: `import {
  Question, QuestionActions, QuestionInput, QuestionOption, QuestionOptions, QuestionPrompt, QuestionSubmit,
} from "@/components/ai-elements/question";

<Question
  selectionMode="multiple"
  onSubmit={async ({ selectedValues, text }) => {
    await sendAnswer(selectedValues, text);
  }}
>
  <QuestionPrompt>Which environments should I deploy to?</QuestionPrompt>
  <QuestionOptions aria-label="Environments">
    <QuestionOption value="staging" />
    <QuestionOption value="production">Production</QuestionOption>
  </QuestionOptions>
  <QuestionInput aria-label="Anything else?" />
  <QuestionActions>
    <QuestionSubmit>Send</QuestionSubmit>
  </QuestionActions>
</Question>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The form's states are its answer and its disabled flag; the controls underneath inherit Button and Textarea states.",
      blocks: [
        { body: <QuestionStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: nothing chosen, the textarea empty, and Submit disabled until there is a choice or non-blank text.{" "}
                <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong>: inherited from Button on options and
                Submit, and from Textarea on the input. A chosen option switches from the outline to the default variant and carries{" "}
                <code className="type-code">aria-checked</code>. <strong>disabled</strong>: <code className="type-code">disabled</code> on
                Question disables every option, the input and Submit, and the submit handler returns early. <strong>loading</strong>:
                N/A — Question has no pending state of its own; onSubmit may be async but the form does not show it, so the caller swaps in
                its own sent state (the workspace replaces the form with a summary). <strong>success</strong> and <strong>error</strong>:
                N/A — the form reports an answer, not an outcome. <strong>empty</strong>: an unanswered form is the rest state; a form
                with no options is just a text question.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description: "Choices with no free-text field.",
      label: "Choices only",
      render: <QuestionExamples />,
      source: `<Question selectionMode="single">
  <QuestionPrompt>Proceed with the rounding change?</QuestionPrompt>
  <QuestionOptions aria-label="Decision">
    <QuestionOption value="yes">Yes, apply it</QuestionOption>
    <QuestionOption value="no">No, keep it as is</QuestionOption>
  </QuestionOptions>
  <QuestionActions>
    <QuestionSubmit>Answer</QuestionSubmit>
  </QuestionActions>
</Question>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: `Read from ${SRC}.`,
      blocks: [
        {
          label: "Types",
          body: (
            <Meta
              items={[
                { k: "QuestionValue", v: "{ selectedValues: readonly string[]; text: string }." },
                { k: "QuestionResponse", v: "{ selectedValues: readonly string[]; text?: string } — what onSubmit receives; text is trimmed and absent when blank." },
              ]}
            />
          ),
        },
        {
          label: "Question",
          body: (
            <Meta
              items={[
                { k: "selectionMode?", v: '"single" | "multiple", default "single".' },
                { k: "defaultValue?", v: "QuestionValue, default empty — the initial answer when uncontrolled." },
                { k: "value?", v: "QuestionValue — controlled answer." },
                { k: "onValueChange?", v: "(value: QuestionValue) => void — called on every choice and keystroke, controlled or not." },
                { k: "onSubmit?", v: "(response: QuestionResponse, event) => void | Promise<void> — not called when disabled or unanswered." },
                { k: "disabled?", v: "boolean, default false — disables the whole form." },
                { k: "className?", v: "string" },
                { k: "...props", v: "form props except defaultValue, onSubmit and value." },
              ]}
            />
          ),
        },
        { label: "QuestionPrompt", body: <Meta items={[{ k: "...props", v: "p props. type-nav." }]} /> },
        { label: "QuestionDescription", body: <Meta items={[{ k: "...props", v: "p props. type-small, muted." }]} /> },
        { label: "QuestionOptions", body: <Meta items={[{ k: "...props", v: 'div props. role is "radiogroup" in single mode and "group" in multiple; pass aria-label to name it.' }]} /> },
        {
          label: "QuestionOption",
          body: (
            <Meta
              items={[
                { k: "value", v: "string, required — the identity returned in selectedValues, and the label when there are no children." },
                { k: "children?", v: "ReactNode — the visible label." },
                { k: "variant?", v: 'Button variant — defaults to "default" when chosen and "outline" otherwise.' },
                { k: "disabled?", v: "boolean — in addition to the form's own disabled." },
                { k: "...props", v: 'Button props except value. role is "radio" or "checkbox"; type is "button".' },
              ]}
            />
          ),
        },
        { label: "QuestionInput", body: <Meta items={[{ k: "...props", v: "Textarea props except value and defaultValue (the value is the form's text). min-h-20; disabled follows the form." }]} /> },
        { label: "QuestionActions", body: <Meta items={[{ k: "...props", v: "div props. Right-aligned row." }]} /> },
        { label: "QuestionSubmit", body: <Meta items={[{ k: "children?", v: 'ReactNode, default "Submit".' }, { k: "...props", v: "Button props. type=\"submit\"; disabled while the form is disabled or has no choice and no non-blank text." }]} /> },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: "A form element. Options are buttons with role radio (single) or checkbox (multiple) and aria-checked; their name is their label text. QuestionOptions is a radiogroup or group and should be given an aria-label. The textarea has no label of its own, so pass aria-label or associate one." },
                { k: "Keyboard", v: "Tab moves through every option (they are separate tab stops, not a roving radio group), then the input and Submit. Space or Enter on an option toggles it; Enter in the textarea inserts a newline, and Submit is a real submit button. Choosing the selected option in single mode clears it." },
                { k: "Target size", v: "Options are Button default size with h-auto and wrapping text, 40px minimum, so long labels grow rather than clip. Submit is a default Button." },
                { k: "Motion", v: "None of its own; buttons use their press feel, which the reduced-motion rule neutralises." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why",
      title: "Why this exists",
      blocks: [
        {
          body: (
            <Note tone="action">
              The AgentWorkspace uses Question for the run&apos;s handoff in{" "}
              <code className="type-code">components/agent/workspace/run-inline.tsx</code>: &quot;Who should take this over?&quot; with the
              owners as single-choice options, a note field and a &quot;Hand off&quot; submit; once sent, a summary replaces the form. The
              vendored copy has no &quot;Vendored change:&quot; comments in its source: it differs from upstream only in being built on the
              system&apos;s Button and Textarea, so it takes their tokens, sizes and states.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [{ body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> }],
    },
  ],
};
