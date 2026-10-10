import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Question,
  QuestionActions,
  QuestionDescription,
  QuestionInput,
  QuestionOption,
  QuestionOptions,
  QuestionPrompt,
  QuestionSubmit,
} from "@/components/ai-elements/question";

const tree = (props: Partial<ComponentProps<typeof Question>> = {}) => (
  <Question {...props}>
    <QuestionPrompt>Pick</QuestionPrompt>
    <QuestionDescription>help</QuestionDescription>
    <QuestionOptions>
      <QuestionOption value="a">A</QuestionOption>
      <QuestionOption value="b">B</QuestionOption>
    </QuestionOptions>
    <QuestionInput placeholder="other" />
    <QuestionActions>
      <QuestionSubmit />
    </QuestionActions>
  </Question>
);

describe("Question", () => {
  it("single: selects one, submits the response", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(tree({ onSubmit }));
    expect(screen.getByText("Pick")).toHaveClass("type-nav");
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
    await user.click(screen.getByRole("radio", { name: "A" }));
    await user.click(screen.getByRole("radio", { name: "B" }));
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute("aria-checked", "true");
    await user.type(screen.getByPlaceholderText("other"), " note ");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit.mock.calls[0][0]).toEqual({ selectedValues: ["b"], text: "note" });
  });
  it("multiple: toggles several", async () => {
    const user = userEvent.setup();
    render(tree({ selectionMode: "multiple" }));
    await user.click(screen.getByRole("checkbox", { name: "A" }));
    await user.click(screen.getByRole("checkbox", { name: "B" }));
    expect(screen.getByRole("checkbox", { name: "A" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("checkbox", { name: "B" })).toHaveAttribute("aria-checked", "true");
  });
  it("disabled blocks everything", () => {
    render(tree({ disabled: true, defaultValue: { selectedValues: ["a"], text: "" } }));
    expect(screen.getByRole("radio", { name: "A" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });
});
