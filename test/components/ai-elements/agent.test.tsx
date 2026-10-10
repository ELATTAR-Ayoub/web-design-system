/**
 * @covers ai-agent
 *
 * shiki's async highlighter cannot run in jsdom, so CodeBlock is mocked at the
 * module boundary with a plain <pre>.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ai-elements/code-block", () => ({
  CodeBlock: ({ code, language }: { code: string; language: string }) => (
    <pre data-language={language}>{code}</pre>
  ),
}));

import {
  Agent,
  AgentContent,
  AgentHeader,
  AgentInstructions,
  AgentOutput,
  AgentTool,
  AgentTools,
} from "@/components/ai-elements/agent";

const tool = {
  description: "Search the web",
  inputSchema: { type: "object", properties: { q: { type: "string" } } },
} as never;

function Example() {
  return (
    <Agent>
      <AgentHeader model="claude-sonnet" name="Researcher" />
      <AgentContent>
        <AgentInstructions>Answer with sources.</AgentInstructions>
        <AgentTools type="multiple">
          <AgentTool tool={tool} value="search" />
        </AgentTools>
        <AgentOutput schema="type Out = { answer: string }" />
      </AgentContent>
    </Agent>
  );
}

describe("Agent", () => {
  it("renders the header with name and model badge in the system's type roles", () => {
    render(<Example />);
    const name = screen.getByText("Researcher");
    expect(name.className).toContain("type-nav");
    expect(name.className).not.toMatch(/\btext-sm\b|\bfont-medium\b/);
    const badge = screen.getByText("claude-sonnet");
    expect(badge).toHaveAttribute("data-slot", "badge");
    // A model id is a code people read back; type-identifier follows type-badge
    // in typeset.css, so it wins on the shared properties.
    expect(badge.className).toContain("type-identifier");
    expect(badge.className).not.toMatch(/(?<![\w-])font-mono\b|\btext-xs\b/);
  });

  it("omits the model badge when no model is given", () => {
    render(<AgentHeader name="Solo" />);
    expect(document.querySelector('[data-slot="badge"]')).toBeNull();
  });

  it("section labels use type-nav; instructions body uses type-body", () => {
    render(<Example />);
    for (const label of ["Instructions", "Tools", "Output Schema"]) {
      expect(screen.getByText(label).className).toContain("type-nav");
    }
    expect(screen.getByText("Answer with sources.").closest("div")?.className).toContain(
      "type-body",
    );
  });

  it("the tool accordion expands to show its JSON schema, and the output schema renders", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: /Search the web/ });
    expect(trigger.className).toContain("min-h-(--size-target-min)");
    await userEvent.setup({ pointerEventsCheck: 0 }).click(trigger);
    expect(await screen.findByText(/"properties"/)).toBeInTheDocument();
    expect(document.querySelector('pre[data-language="json"]')).not.toBeNull();
    expect(screen.getByText("type Out = { answer: string }")).toBeInTheDocument();
  });

  it("a tool with no description falls back to copy", () => {
    render(
      <AgentTools type="multiple">
        <AgentTool tool={{ inputSchema: {} } as never} value="x" />
      </AgentTools>,
    );
    expect(screen.getByText("No description")).toBeInTheDocument();
  });
});
