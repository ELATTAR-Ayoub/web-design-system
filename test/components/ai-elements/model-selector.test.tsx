/**
 * @covers ai-model-selector
 *
 * The example's search dialog: opens from a trigger, filters by name via
 * Command, and selecting an item fires the caller's callback. Also proves the
 * provider logo is a local monogram by default (no network request) and an
 * `<img>` only when the caller supplies `src`.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

const models = [
  { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
  { id: "claude-sonnet", name: "Claude Sonnet", provider: "anthropic" },
];

function Example({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <ModelSelector>
      <ModelSelectorTrigger>Choose a model</ModelSelectorTrigger>
      <ModelSelectorContent>
        <ModelSelectorInput placeholder="Search models..." />
        <ModelSelectorList>
          <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
          <ModelSelectorGroup heading="Models">
            {models.map((m) => (
              <ModelSelectorItem key={m.id} onSelect={() => onSelect(m.id)} value={m.id}>
                <ModelSelectorLogoGroup>
                  <ModelSelectorLogo provider={m.provider} />
                </ModelSelectorLogoGroup>
                <ModelSelectorName>{m.name}</ModelSelectorName>
              </ModelSelectorItem>
            ))}
          </ModelSelectorGroup>
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  );
}

describe("ModelSelector", () => {
  it("opens the search dialog from its trigger and lists every model", async () => {
    const user = setup();
    render(<Example onSelect={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Choose a model" }));

    await waitFor(() => {
      expect(screen.getByText("GPT-4o")).toBeInTheDocument();
    });
    expect(screen.getByText("Claude Sonnet")).toBeInTheDocument();
    // No corner ✕ over the search field; Escape closes it.
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("GPT-4o")).toBeNull());
  });

  it("filtering by name narrows the list via Command", async () => {
    const user = setup();
    render(<Example onSelect={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Choose a model" }));
    const input = await screen.findByPlaceholderText("Search models...");
    await user.type(input, "claude");

    await waitFor(() => {
      expect(screen.queryByText("GPT-4o")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Claude Sonnet")).toBeInTheDocument();
  });

  it("selecting an item calls the caller's onSelect with the model id", async () => {
    const user = setup();
    const onSelect = vi.fn();
    render(<Example onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Choose a model" }));
    const option = await screen.findByText("GPT-4o");
    await user.click(option);

    expect(onSelect).toHaveBeenCalledWith("gpt-4o");
  });

  it("renders a local monogram and makes no network request by default", () => {
    render(<ModelSelectorLogo provider="anthropic" />);
    const logo = document.querySelector('[data-slot="model-selector-logo"]')!;
    expect(logo.tagName).toBe("SPAN");
    expect(logo.textContent).toBe("A");
    expect(document.querySelector("img")).toBeNull();
  });

  it("styles the monogram from the system's tokens: badge type, foreground on secondary, a border ring", () => {
    render(<ModelSelectorLogo provider="openai" />);
    const logo = document.querySelector('[data-slot="model-selector-logo"]')!;
    expect(logo).toHaveClass("type-badge", "bg-secondary", "text-foreground", "inset-ring-border", "size-5", "rounded-full");
  });

  it("a logo group separates each logo with a background outline, with no dark-mode fill", () => {
    const { container } = render(
      <ModelSelectorLogoGroup>
        <ModelSelectorLogo provider="anthropic" />
        <ModelSelectorLogo provider="openai" />
        <ModelSelectorLogo provider="google" />
      </ModelSelectorLogoGroup>
    );
    const group = container.firstElementChild!;
    expect(group.querySelectorAll('[data-slot="model-selector-logo"]')).toHaveLength(3);
    expect(group.className).toContain("outline-background");
    expect(group.className).not.toContain("dark:");
  });

  it("uses a caller-supplied logo when given one", () => {
    render(<ModelSelectorLogo provider="anthropic" src="/logos/anthropic.svg" />);
    expect(document.querySelector("img")?.getAttribute("src")).toBe("/logos/anthropic.svg");
  });
});
