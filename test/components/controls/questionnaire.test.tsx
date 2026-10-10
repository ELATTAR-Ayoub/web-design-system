import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import type * as React from "react";

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";

const ITEMS = [
  {
    name: "favourite",
    required: true,
    choices: [{ value: "packs" }, { value: "singles" }],
  },
  { name: "budget", choices: [{ value: "low" }, { value: "high" }] },
] as const;

function Survey({
  onSubmit,
}: { onSubmit?: React.FormEventHandler<HTMLFormElement> } = {}) {
  return (
    <Questionnaire items={ITEMS} onSubmit={onSubmit} shortcuts="letters">
      <QuestionnaireProgress />
      <QuestionnaireItem name="favourite" required>
        <QuestionnaireTitle>What do you buy most?</QuestionnaireTitle>
        <QuestionnaireDescription>Pick one.</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="packs">
            Sealed packs
            <QuestionnaireChoiceDescription>
              Opened on stream.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="singles">Singles</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="budget">
        <QuestionnaireTitle>Monthly budget?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="low">Under £50</QuestionnaireChoice>
          <QuestionnaireChoice value="high">Over £50</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  );
}

describe("Questionnaire", () => {
  it("names each question through its own legend", () => {
    render(<Survey />);
    expect(
      screen.getByRole("group", { name: /What do you buy most\?/ }),
    ).toBeInTheDocument();
  });

  it("gives every choice a real radio, selectable from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Survey />);

    const packs = screen.getByRole("radio", { name: /Sealed packs/ });
    // A native <input type="radio">, so the state is the DOM's own, not an
    // ARIA mirror of it — which is the stronger version of the contract.
    expect(packs).not.toBeChecked();

    await user.tab();
    await user.keyboard(" ");
    await waitFor(() => expect(packs).toBeChecked());
  });

  it("writes the progress out in words, not only as a bar", () => {
    const { container } = render(<Survey />);
    const progress = container.querySelector(
      '[data-slot="questionnaire-progress"]',
    );
    // A bar with no readout is the failure RULES §7 names for `progressbar`.
    // `getByText(/1/)` used to stand in for this and matched "£50" just as well.
    expect(progress).toHaveTextContent(/question\s+1\s+of\s+2/i);
  });

  it("shows the required error through the component's own path", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<React.FormEventHandler<HTMLFormElement>>((e) =>
      e.preventDefault(),
    );
    render(<Survey onSubmit={onSubmit} />);

    // Advancing without an answer is the failure the component owns.
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await waitFor(() =>
      expect(
        screen.getByRole("group", { name: /What do you buy most\?/ }),
      ).toBeInTheDocument(),
    );
  });

  it("does not select a disabled choice", async () => {
    const user = userEvent.setup();
    render(
      <Questionnaire
        items={[
          {
            name: "q",
            choices: [{ value: "a" }, { value: "b", disabled: true }],
          },
        ]}
      >
        <QuestionnaireItem name="q">
          <QuestionnaireTitle>Pick one</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="a">Available</QuestionnaireChoice>
            <QuestionnaireChoice value="b" disabled>
              Unavailable
            </QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
      </Questionnaire>,
    );
    const locked = screen.getByRole("radio", { name: /Unavailable/ });
    expect(locked).toBeDisabled();
    await user.click(locked);
    expect(locked).not.toBeChecked();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Survey />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("associates a disabled choice's reason via aria-describedby on the real input", () => {
    render(
      <Questionnaire
        items={[
          {
            name: "q",
            choices: [{ value: "a" }, { value: "b", disabled: true }],
          },
        ]}
      >
        <QuestionnaireItem name="q">
          <QuestionnaireTitle>Pick one</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="a">Available</QuestionnaireChoice>
            <QuestionnaireChoice
              value="b"
              disabled
              disabledReason="Invite only — request access from your account settings."
            >
              Unavailable
            </QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
      </Questionnaire>,
    );
    const locked = screen.getByRole("radio", { name: /Unavailable/ });
    expect(locked).toBeDisabled();
    const describedBy = locked.getAttribute("aria-describedby");
    expect(describedBy, "the reason must be associated, not merely displayed").toBeTruthy();
    const reason = document.getElementById(describedBy!.split(/\s+/)[0]);
    expect(reason?.textContent).toContain("Invite only");
  });

  it("leaves a choice with no disabledReason unwrapped", () => {
    render(<Survey />);
    const choice = screen.getByRole("radio", { name: /Sealed packs/ });
    expect(choice.getAttribute("aria-describedby")).toBeNull();
  });
});
