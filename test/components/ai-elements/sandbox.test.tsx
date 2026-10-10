import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ToolUIPart } from "ai";

// `sandbox.tsx` imports `getStatusBadge` from the sibling `tool.tsx`, which is
// harmless, but `tool.tsx` also imports `./code-block`, which imports the
// `shiki` package for its async syntax highlighter — a real dependency this
// worktree does not have installed (`shiki`/`react-jsx-parser` are declared
// in package.json but missing from node_modules in this checkout). Sandbox
// itself never renders a `CodeBlock`, so the highlighter's real behaviour is
// irrelevant here; mocked at the module boundary purely so the import graph
// resolves.
vi.mock("@/components/ai-elements/code-block", () => ({
  CodeBlock: () => null,
  CodeBlockCopyButton: () => null,
}));

import {
  Sandbox,
  SandboxContent,
  SandboxHeader,
  SandboxTabContent,
  SandboxTabs,
  SandboxTabsBar,
  SandboxTabsList,
  SandboxTabsTrigger,
} from "@/components/ai-elements/sandbox";

const renderSandbox = (state: ToolUIPart["state"]) =>
  render(
    <Sandbox>
      <SandboxHeader state={state} title="primes.py" />
      <SandboxContent>
        <SandboxTabs defaultValue="code">
          <SandboxTabsBar>
            <SandboxTabsList>
              <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
              <SandboxTabsTrigger value="output">Output</SandboxTabsTrigger>
            </SandboxTabsList>
          </SandboxTabsBar>
          <SandboxTabContent value="code">code body</SandboxTabContent>
          <SandboxTabContent value="output">output body</SandboxTabContent>
        </SandboxTabs>
      </SandboxContent>
    </Sandbox>
  );

describe("Sandbox", () => {
  it("renders the title, status badge and code tab by default", () => {
    renderSandbox("output-available");
    expect(screen.getByText("primes.py")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("code body")).toBeInTheDocument();
  });

  it.each<[ToolUIPart["state"], string]>([
    ["input-streaming", "Pending"],
    ["input-available", "Running"],
    ["approval-requested", "Awaiting Approval"],
    ["approval-responded", "Responded"],
    ["output-available", "Completed"],
    ["output-denied", "Denied"],
    ["output-error", "Error"],
  ])("renders the %s state's status label (%s)", (state, label) => {
    renderSandbox(state);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("switches to the output tab on trigger click", async () => {
    const user = userEvent.setup();
    renderSandbox("output-available");
    await user.click(screen.getByRole("tab", { name: "Output" }));
    expect(screen.getByText("output body")).toBeVisible();
  });

  it("the header collapses/expands the content on click (Collapsible, defaultOpen)", () => {
    renderSandbox("output-available");
    const trigger = screen.getByText("primes.py").closest("button") as HTMLButtonElement;
    expect(trigger).toHaveAttribute("data-state", "open");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "closed");
  });

  it("header trigger and tab triggers meet the 44px target floor", () => {
    renderSandbox("output-available");
    const header = screen.getByText("primes.py").closest("button") as HTMLButtonElement;
    expect(header.className).toContain("min-h-(--size-target-min)");
    expect(screen.getByRole("tab", { name: "Code" }).className).toContain("min-h-(--size-target-min)");
  });

  it("the tab list travels on the line variant instead of a manually-drawn border-b-2", () => {
    renderSandbox("output-available");
    const codeTab = screen.getByRole("tab", { name: "Code" });
    // The old vendored trigger hand-drew its own active border; the restyle
    // routes the active-state through `Tabs`' own `line`-variant sliding
    // indicator instead, so the trigger itself carries no per-instance
    // active-border classes.
    expect(codeTab.className).not.toContain("data-[state=active]:border-primary");
  });
});
