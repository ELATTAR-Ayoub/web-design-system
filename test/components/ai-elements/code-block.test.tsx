/**
 * @covers ai-code-block
 *
 * Shiki's `createHighlighter` loads a wasm grammar asynchronously — far too
 * heavy for a unit test and irrelevant to what this restyle changed. Mocked
 * at the module boundary so `CodeBlock` renders its synchronous raw-token
 * fallback, which carries the same text content the highlighted version
 * would.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ai-elements/code-block";

vi.mock("shiki", () => ({
  // lib/code-theme.ts builds the system theme at import time.
  createCssVariablesTheme: vi.fn(() => ({ name: "elattar-code" })),
  createHighlighter: vi.fn(
    () =>
      new Promise(() => {
        /* never resolves — exercises the synchronous raw-token path only */
      })
  ),
}));

const sample = "const answer = 42;";

describe("CodeBlock", () => {
  it("renders the code immediately, before any highlighter settles", () => {
    render(<CodeBlock code={sample} language="tsx" />);
    expect(screen.getByText(sample)).toBeInTheDocument();
  });

  it("composes a header with filename and a copy action, per the official example", async () => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: vi.fn().mockResolvedValue(undefined) }, configurable: true });
    const onCopy = vi.fn();

    render(
      <CodeBlock code={sample} language="tsx">
        <CodeBlockHeader>
          <CodeBlockTitle>
            <CodeBlockFilename>index.tsx</CodeBlockFilename>
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton onCopy={onCopy} />
          </CodeBlockActions>
        </CodeBlockHeader>
      </CodeBlock>
    );

    expect(screen.getByText("index.tsx")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Copy code" });
    fireEvent.click(button);

    await screen.findByRole("button", { name: "Copied" });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(sample);
    expect(onCopy).toHaveBeenCalled();
  });

  it("keeps the container on the token scale — border and radius, not an invented value", () => {
    const { container } = render(<CodeBlock code={sample} language="tsx" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("rounded-lg", "border", "bg-background");
  });
});
