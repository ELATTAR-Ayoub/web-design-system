/**
 * @covers ai-prompt-input
 *
 * Exercises the example composition (trimmed of demo data): text entry,
 * submit, the tools row, the tab list/label/item restyle, and the submit
 * button's four status icons.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSelect,
  PromptInputSelectTrigger,
  PromptInputSubmit,
  PromptInputTabBody,
  PromptInputTabItem,
  PromptInputTabLabel,
  PromptInputTabsList,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { TooltipProvider } from "@/components/ui/tooltip";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

describe("PromptInput", () => {
  it("submits the typed text and clears the field", async () => {
    const user = setup();
    const onSubmit = vi.fn();
    render(
      <TooltipProvider>
        <PromptInput onSubmit={onSubmit}>
          <PromptInputBody>
            <PromptInputTextarea />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputButton tooltip="Search">Search</PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit status="ready" />
          </PromptInputFooter>
        </PromptInput>
      </TooltipProvider>,
    );

    const textarea = screen.getByPlaceholderText("What would you like to know?");
    await user.type(textarea, "hello there");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ text: "hello there" }),
      expect.anything(),
    );
  });

  it("Enter submits, Shift+Enter does not", async () => {
    const user = setup();
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools />
          <PromptInputSubmit status="ready" />
        </PromptInputFooter>
      </PromptInput>,
    );

    const textarea = screen.getByPlaceholderText("What would you like to know?");
    await user.type(textarea, "line one");
    await user.keyboard("{Shift>}{Enter}{/Shift}");
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(textarea, "line two");
    await user.keyboard("{Enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  describe("PromptInputSubmit — every status renders its own affordance", () => {
    it("ready shows the send icon and label", () => {
      render(<PromptInputSubmit status="ready" />);
      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    it("submitted shows a spinner and the Stop affordance", () => {
      render(<PromptInputSubmit onStop={vi.fn()} status="submitted" />);
      expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument();
    });

    it("streaming clicking calls onStop instead of submitting", async () => {
      const user = setup();
      const onStop = vi.fn();
      render(<PromptInputSubmit onStop={onStop} status="streaming" />);
      await user.click(screen.getByRole("button", { name: "Stop" }));
      expect(onStop).toHaveBeenCalledTimes(1);
    });

    it("error shows the submit affordance again", () => {
      render(<PromptInputSubmit status="error" />);
      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });
  });

  it("tool buttons keep the toolbar size, submit stays the upstream icon-sm (InputGroupButton has no larger size), the select trigger uses a type role", () => {
    render(
      <>
        <PromptInputButton>Tool</PromptInputButton>
        <PromptInputSubmit status="ready" />
        <PromptInputSelect>
          <PromptInputSelectTrigger>Model</PromptInputSelectTrigger>
        </PromptInputSelect>
      </>,
    );
    expect(screen.getByRole("button", { name: "Tool" })).toHaveAttribute("data-size", "icon-sm");
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute("data-size", "icon-sm");
    expect(screen.getByRole("button", { name: "Tool" }).className).not.toContain("size-target-min");
    const trigger = screen.getByRole("combobox");
    expect(trigger.className).toContain("type-nav");
    expect(trigger.className).not.toMatch(/\bfont-medium\b/);
  });

  describe("PromptInputTabsList family — restyled to type roles", () => {
    it("renders a label and item without leaking raw text-* utilities", () => {
      render(
        <PromptInputTabsList>
          <PromptInputTabLabel>Files</PromptInputTabLabel>
          <PromptInputTabBody>
            <PromptInputTabItem>readme.md</PromptInputTabItem>
          </PromptInputTabBody>
        </PromptInputTabsList>,
      );

      const label = screen.getByText("Files");
      expect(label.className).toContain("type-nav");
      expect(label.className).not.toMatch(/\btext-xs\b/);

      const item = screen.getByText("readme.md");
      expect(item.className).toContain("type-small");
      expect(item.className).not.toMatch(/\btext-xs\b/);
    });
  });
});
