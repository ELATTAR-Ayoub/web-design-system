"use client";

import * as React from "react";

import {
  Question,
  QuestionActions,
  QuestionDescription,
  QuestionInput,
  QuestionOption,
  QuestionOptions,
  QuestionPrompt,
  QuestionSubmit,
  type QuestionValue,
} from "@/components/ai-elements/question";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

const OWNERS = ["Dana", "Marcus", "Priya"];

function OwnerQuestion({
  disabled,
  defaultValue,
  selectionMode = "single",
  onSubmit,
}: {
  disabled?: boolean;
  defaultValue?: QuestionValue;
  selectionMode?: "single" | "multiple";
  onSubmit?: React.ComponentProps<typeof Question>["onSubmit"];
}) {
  return (
    <Question defaultValue={defaultValue} disabled={disabled} onSubmit={onSubmit} selectionMode={selectionMode}>
      <div className="space-y-1">
        <QuestionPrompt>{selectionMode === "single" ? "Who should take this over?" : "Who should be told?"}</QuestionPrompt>
        <QuestionDescription>Choose {selectionMode === "single" ? "an owner" : "everyone who applies"} and leave a note.</QuestionDescription>
      </div>
      <QuestionOptions aria-label={selectionMode === "single" ? "Owner" : "People to tell"}>
        {OWNERS.map((owner) => (
          <QuestionOption key={owner} value={owner}>
            {owner}
          </QuestionOption>
        ))}
      </QuestionOptions>
      <QuestionInput aria-label="Note" placeholder="What should they know?" />
      <QuestionActions>
        <QuestionSubmit>Hand off</QuestionSubmit>
      </QuestionActions>
    </Question>
  );
}

/** The Preview: pick an owner or type a note, submit, and see the response the form hands back. */
export function QuestionShowcase() {
  const [sent, setSent] = React.useState<string | null>(null);
  return (
    <Panel label="Question" note={sent ?? "nothing sent"}>
      <div className="mx-auto w-full max-w-md">
        <OwnerQuestion
          onSubmit={({ selectedValues, text }) => setSent(`${selectedValues.join(", ") || "no choice"}${text ? ` · "${text}"` : ""}`)}
        />
      </div>
    </Panel>
  );
}

/** The States grid. */
export function QuestionStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="rest" note="Submit is disabled until there is an answer">
        <div className="w-full">
          <OwnerQuestion />
        </div>
      </StateCell>
      <StateCell label="answered" note="a choice and a note make Submit available">
        <div className="w-full">
          <OwnerQuestion defaultValue={{ selectedValues: ["Dana"], text: "Needs the March ledger." }} />
        </div>
      </StateCell>
      <StateCell label="disabled" note="the whole form is inert">
        <div className="w-full">
          <OwnerQuestion defaultValue={{ selectedValues: ["Dana"], text: "Needs the March ledger." }} disabled />
        </div>
      </StateCell>
      <StateCell label="multiple" note='selectionMode="multiple" — checkboxes'>
        <div className="w-full">
          <OwnerQuestion defaultValue={{ selectedValues: ["Dana", "Priya"], text: "" }} selectionMode="multiple" />
        </div>
      </StateCell>
    </StateGrid>
  );
}

/** The Examples: choices only, no free text. */
export function QuestionExamples() {
  return (
    <Panel label="Choices only">
      <div className="mx-auto w-full max-w-md">
        <Question selectionMode="single">
          <QuestionPrompt>Proceed with the rounding change?</QuestionPrompt>
          <QuestionOptions aria-label="Decision">
            <QuestionOption value="yes">Yes, apply it</QuestionOption>
            <QuestionOption value="no">No, keep it as is</QuestionOption>
          </QuestionOptions>
          <QuestionActions>
            <QuestionSubmit>Answer</QuestionSubmit>
          </QuestionActions>
        </Question>
      </div>
    </Panel>
  );
}
