import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool";

vi.mock("@/components/ai-elements/code-block", () => ({
  CodeBlock: ({ code }: { code: string }) => <pre data-testid="code">{code}</pre>,
}));

const cases = [
  ["input-streaming", "Pending", null],
  ["input-available", "Running", null],
  ["approval-requested", "Awaiting Approval", "text-warning-ink"],
  ["approval-responded", "Responded", "text-info-ink"],
  ["output-available", "Completed", "text-success-ink"],
  ["output-denied", "Denied", "text-warning-ink"],
  ["output-error", "Error", "text-destructive-ink"],
] as const;

describe("Tool", () => {
  it.each(cases)("%s renders label %s with its icon tone", (state, label, cls) => {
    const { container } = render(
      <Tool>
        <ToolHeader type="tool-search" state={state} />
        <ToolContent />
      </Tool>,
    );
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText("search")).toHaveClass("type-identifier");
    if (cls) {
      const icons = [...container.querySelectorAll("svg")];
      expect(icons.some((i) => i.classList.contains(cls))).toBe(true);
    }
  });
  it("an explicit title takes the type-nav emphasis role", () => {
    render(
      <Tool>
        <ToolHeader type="tool-search" state="output-available" title="Web search" />
      </Tool>,
    );
    expect(screen.getByText("Web search")).toHaveClass("type-nav");
  });
  it("dynamic tool uses its name", () => {
    render(
      <Tool>
        <ToolHeader type="dynamic-tool" toolName="lookup" state="output-available" />
      </Tool>,
    );
    expect(screen.getByText("lookup")).toBeInTheDocument();
  });
  it("input and output render JSON; error uses destructive ink", () => {
    const { rerender } = render(
      <>
        <ToolInput input={{ q: 1 }} />
        <ToolOutput output={{ ok: true }} errorText={undefined} />
      </>,
    );
    expect(screen.getByText("Parameters")).toBeInTheDocument();
    expect(screen.getByText("Result")).toBeInTheDocument();
    expect(screen.getAllByTestId("code")[1]).toHaveTextContent('"ok": true');
    rerender(<ToolOutput output={undefined} errorText="boom" />);
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("boom").parentElement).toHaveClass("text-destructive-ink");
  });
  it("output renders nothing when empty", () => {
    const { container } = render(<ToolOutput output={undefined} errorText={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });
});
