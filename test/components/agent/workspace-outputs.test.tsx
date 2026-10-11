/** @covers agent-workspace */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { codeLanguage, ProducedFiles, ToolOutputView } from "@/components/agent/workspace/workspace-outputs";

describe("ToolOutputView", () => {
  it("renders a terminal result with the command and a red exit code", () => {
    render(<ToolOutputView output={{ kind: "terminal", command: "npm test", output: "1 failed", exitCode: 1 }} running={false} state="output-available" />);
    expect(screen.getByText("npm test", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("exit 1")).toHaveClass("term-fg-red");
  });

  it("renders a file tree with every changed path", () => {
    render(
      <ToolOutputView
        output={{ kind: "file-tree", files: [{ path: "src/app.ts", change: "modified" }, { path: "src/new.ts", change: "added" }] }}
        running={false}
        state="output-available"
      />
    );
    expect(screen.getByText("app.ts")).toBeInTheDocument();
    expect(screen.getByText("new.ts")).toBeInTheDocument();
  });

  it("draws nothing for outputs the reply shows elsewhere", () => {
    const { container } = render(
      <ToolOutputView output={{ kind: "search", query: "x", results: [] }} running={false} state="output-available" />
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("ProducedFiles", () => {
  it("lists produced documents by name", () => {
    render(<ProducedFiles attachments={[{ id: "a", name: "report.pdf", mime: "application/pdf", kind: "document", size: 9, url: "blob:x" }]} />);
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
  });
});

describe("codeLanguage", () => {
  it("keeps a known language and falls back to text", () => {
    expect(codeLanguage("TypeScript")).toBe("typescript");
    expect(codeLanguage("not-a-language")).toBe("text");
    expect(codeLanguage(undefined)).toBe("text");
  });
});
