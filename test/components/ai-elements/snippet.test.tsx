/**
 * @covers ai-snippet
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Snippet,
  SnippetAddon,
  SnippetCopyButton,
  SnippetInput,
  SnippetText,
} from "@/components/ai-elements/snippet";

const code = "npx ai-elements add snippet";

function renderSnippet() {
  return render(
    <Snippet code={code}>
      <SnippetAddon>
        <SnippetText>$</SnippetText>
      </SnippetAddon>
      <SnippetInput />
      <SnippetAddon align="inline-end">
        <SnippetCopyButton />
      </SnippetAddon>
    </Snippet>
  );
}

describe("Snippet", () => {
  it("shows the command as a read-only input, per the official example", () => {
    renderSnippet();
    const input = screen.getByDisplayValue(code) as HTMLInputElement;
    expect(input).toHaveAttribute("readOnly");
    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("copies the command and reports success through aria-label", async () => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: vi.fn().mockResolvedValue(undefined) }, configurable: true });
    const onCopy = vi.fn();
    render(
      <Snippet code={code}>
        <SnippetInput />
        <SnippetCopyButton onCopy={onCopy} />
      </Snippet>
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    await screen.findByRole("button", { name: "Copied" });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(code);
    expect(onCopy).toHaveBeenCalled();
  });

  it("reports a clipboard failure through onError rather than throwing", async () => {
    Object.defineProperty(navigator, "clipboard", { value: {
        writeText: vi.fn().mockRejectedValue(new Error("denied")),
      }, configurable: true });
    const onError = vi.fn();
    render(
      <Snippet code={code}>
        <SnippetInput />
        <SnippetCopyButton onError={onError} />
      </Snippet>
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    await vi.waitFor(() => expect(onError).toHaveBeenCalled());
  });
});
