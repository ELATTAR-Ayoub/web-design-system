/**
 * Smoke test for the documentation pages of the ai-* tool components. Each
 * page's specimens and every render node of its spec must render without
 * throwing, and one thing about each component must hold.
 *
 * @covers ai-tool
 * @covers ai-confirmation
 * @covers ai-terminal
 * @covers ai-test-results
 * @covers ai-stack-trace
 * @covers ai-code-block
 * @covers ai-snippet
 * @covers ai-file-tree
 * @covers ai-commit
 *
 * Shiki is stubbed the way test/components/ai-elements/code-block.test.tsx
 * stubs it: its wasm grammar load is far too heavy for a unit test, and the
 * block's synchronous raw-token fallback carries the same text.
 */
import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { spec as codeBlockSpec } from "@/components/docs/component-docs/ai-code-block/page";
import {
  CodeBlockExamples,
  CodeBlockPreview,
  CodeBlockStateGrid,
} from "@/components/docs/component-docs/ai-code-block/code-block-specimen";
import { spec as commitSpec } from "@/components/docs/component-docs/ai-commit/page";
import {
  CommitExamples,
  CommitPreview,
  CommitStateGrid,
} from "@/components/docs/component-docs/ai-commit/commit-specimen";
import { spec as confirmationSpec } from "@/components/docs/component-docs/ai-confirmation/page";
import {
  ConfirmationExamples,
  ConfirmationPreview,
  ConfirmationStateGrid,
} from "@/components/docs/component-docs/ai-confirmation/confirmation-specimen";
import { spec as fileTreeSpec } from "@/components/docs/component-docs/ai-file-tree/page";
import {
  FileTreeExamples,
  FileTreePreview,
  FileTreeStateGrid,
} from "@/components/docs/component-docs/ai-file-tree/file-tree-specimen";
import { spec as snippetSpec } from "@/components/docs/component-docs/ai-snippet/page";
import {
  SnippetExamples,
  SnippetPreview,
  SnippetStateGrid,
} from "@/components/docs/component-docs/ai-snippet/snippet-specimen";
import { spec as stackTraceSpec } from "@/components/docs/component-docs/ai-stack-trace/page";
import {
  StackTraceExamples,
  StackTracePreview,
  StackTraceStateGrid,
} from "@/components/docs/component-docs/ai-stack-trace/stack-trace-specimen";
import { spec as terminalSpec } from "@/components/docs/component-docs/ai-terminal/page";
import {
  TerminalExamples,
  TerminalPreview,
  TerminalStateGrid,
} from "@/components/docs/component-docs/ai-terminal/terminal-specimen";
import { spec as testResultsSpec } from "@/components/docs/component-docs/ai-test-results/page";
import {
  TestResultsExamples,
  TestResultsPreview,
  TestResultsStateGrid,
} from "@/components/docs/component-docs/ai-test-results/test-results-specimen";
import { spec as toolSpec } from "@/components/docs/component-docs/ai-tool/page";
import {
  ToolExamples,
  ToolPreview,
  ToolStateGrid,
} from "@/components/docs/component-docs/ai-tool/tool-specimen";

vi.mock("shiki", () => ({
  createCssVariablesTheme: vi.fn(() => ({ name: "elattar-code" })),
  createHighlighter: vi.fn(
    () =>
      new Promise(() => {
        /* never resolves — only the synchronous raw-token path is exercised */
      })
  ),
}));

/** Every ReactNode a spec carries, in page order. */
function nodesOf(spec: ComponentDocSpec): ReactNode[] {
  return spec.sections.flatMap((section): ReactNode[] => {
    switch (section.kind) {
      case "showcase":
      case "effect":
        return [section.render];
      case "install":
        return section.notes ? [section.notes] : [];
      case "disclosure":
        return section.blocks.map((block) => block.body);
      default:
        return [];
    }
  });
}

function renderSpec(spec: ComponentDocSpec) {
  const nodes = nodesOf(spec);
  expect(nodes.length).toBeGreaterThan(0);
  return nodes.map((node) => render(<div>{node}</div>));
}

const CASES: [string, ComponentDocSpec, ReactNode[]][] = [
  ["ai-tool", toolSpec, [<ToolPreview key="p" />, <ToolStateGrid key="s" />, <ToolExamples key="e" />]],
  [
    "ai-confirmation",
    confirmationSpec,
    [<ConfirmationPreview key="p" />, <ConfirmationStateGrid key="s" />, <ConfirmationExamples key="e" />],
  ],
  ["ai-terminal", terminalSpec, [<TerminalPreview key="p" />, <TerminalStateGrid key="s" />, <TerminalExamples key="e" />]],
  [
    "ai-test-results",
    testResultsSpec,
    [<TestResultsPreview key="p" />, <TestResultsStateGrid key="s" />, <TestResultsExamples key="e" />],
  ],
  [
    "ai-stack-trace",
    stackTraceSpec,
    [<StackTracePreview key="p" />, <StackTraceStateGrid key="s" />, <StackTraceExamples key="e" />],
  ],
  ["ai-code-block", codeBlockSpec, [<CodeBlockPreview key="p" />, <CodeBlockStateGrid key="s" />, <CodeBlockExamples key="e" />]],
  ["ai-snippet", snippetSpec, [<SnippetPreview key="p" />, <SnippetStateGrid key="s" />, <SnippetExamples key="e" />]],
  ["ai-file-tree", fileTreeSpec, [<FileTreePreview key="p" />, <FileTreeStateGrid key="s" />, <FileTreeExamples key="e" />]],
  ["ai-commit", commitSpec, [<CommitPreview key="p" />, <CommitStateGrid key="s" />, <CommitExamples key="e" />]],
];

describe("ai tool component pages", () => {
  it.each(CASES)("%s: specimens and every spec node render", (name, spec, specimens) => {
    expect(spec.name).toBe(name);
    for (const specimen of specimens) {
      const { unmount } = render(<div>{specimen}</div>);
      unmount();
    }
    for (const view of renderSpec(spec)) view.unmount();
  });

  it.each(CASES)("%s: carries the sections in the brief, in order", (_name, spec) => {
    const ids = spec.sections.map((s) => s.id);
    for (const id of ["preview", "installation", "usage", "states", "api", "accessibility", "why", "source"]) {
      expect(ids).toContain(id);
    }
    expect(ids.indexOf("preview")).toBeLessThan(ids.indexOf("installation"));
  });

  it("ai-tool: the header is a button named by the tool and its status", () => {
    render(<ToolPreview />);
    expect(screen.getByRole("button", { name: /Search invoices.*Completed/ })).toBeInTheDocument();
  });

  it("ai-confirmation: the request offers Approve and Decline, and an answer replaces them", () => {
    render(<ConfirmationPreview />);
    const approve = screen.getByRole("button", { name: "Approve" });
    expect(screen.getByRole("button", { name: "Decline" })).toBeInTheDocument();
    fireEvent.click(approve);
    expect(screen.queryByRole("button", { name: "Approve" })).not.toBeInTheDocument();
  });

  it("ai-terminal: copy and clear are named buttons and the output has no escape codes", () => {
    render(<TerminalPreview />);
    expect(screen.getByRole("button", { name: "Copy output" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear terminal" })).toBeInTheDocument();
    expect(screen.getByText(/compiled 148 modules/).textContent).not.toContain("\u001b");
  });

  it("ai-test-results: the summary reports passed and failed counts", () => {
    render(<TestResultsPreview />);
    expect(screen.getAllByText("5 passed").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1 failed").length).toBeGreaterThan(0);
  });

  it("ai-stack-trace: the copy button is named and the error type is parsed", () => {
    render(<StackTracePreview />);
    expect(screen.getByRole("button", { name: "Copy stack trace" })).toBeInTheDocument();
    expect(screen.getByText("TypeError")).toBeInTheDocument();
  });

  it("ai-code-block: the copy button is named and the code is shown before highlighting", () => {
    const { container } = render(<CodeBlockPreview />);
    expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
    expect(container.querySelector("pre")?.textContent).toContain("export function price");
  });

  it("ai-snippet: the field is read-only and holds the command", () => {
    render(<SnippetPreview />);
    const field = screen.getByRole("textbox", { name: "Command" });
    expect(field).toHaveValue("npm run check:tokens");
    expect(field).toHaveAttribute("readonly");
  });

  it("ai-file-tree: the tree marks the selected row", () => {
    render(<FileTreePreview />);
    const tree = screen.getByRole("tree");
    const selected = within(tree)
      .getAllByRole("treeitem")
      .filter((el) => el.getAttribute("aria-selected") === "true");
    expect(selected.some((el) => el.textContent?.includes("index.ts"))).toBe(true);
  });

  it("ai-commit: the commit shows a short hash and a named copy action", () => {
    render(<CommitPreview />);
    expect(screen.getByText("9fceb02")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy commit hash" })).toBeInTheDocument();
  });
});
