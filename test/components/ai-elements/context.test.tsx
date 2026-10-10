/**
 * @covers ai-context
 *
 * The usage percentage trigger and the hover-card breakdown: input/output/
 * reasoning/cache rows only render once their token count is non-zero, and
 * the restyled rows carry `type-small`/`type-number-sm` rather than raw
 * `text-xs`/`font-mono`.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { LanguageModelUsage } from "ai";
import { describe, expect, it } from "vitest";

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

import {
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
} from "@/components/ai-elements/context";

function Example(props: {
  usedTokens: number;
  maxTokens: number;
  usage?: Partial<LanguageModelUsage>;
}) {
  return (
    <Context maxTokens={props.maxTokens} modelId="gpt-4o" usage={props.usage as LanguageModelUsage | undefined} usedTokens={props.usedTokens}>
      <ContextTrigger />
      <ContextContent>
        <ContextContentHeader />
        <ContextContentBody>
          <ContextInputUsage />
          <ContextOutputUsage />
          <ContextReasoningUsage />
          <ContextCacheUsage />
        </ContextContentBody>
        <ContextContentFooter />
      </ContextContent>
    </Context>
  );
}

describe("Context", () => {
  it("renders the used-percentage trigger with the restyled type-nav label", () => {
    render(<Example maxTokens={1000} usedTokens={250} />);
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveTextContent("25%");
    const percentLabel = trigger.querySelector("span");
    expect(percentLabel?.className).toContain("type-nav");
    expect(percentLabel?.className).not.toMatch(/\bfont-medium\b/);
  });

  it("input/output usage rows only render when their token count is non-zero", async () => {
    const user = setup();
    render(
      <Example
        maxTokens={1000}
        usage={{ inputTokens: 120, outputTokens: 0 }}
        usedTokens={120}
      />,
    );
    await user.hover(screen.getByRole("button"));
    expect(await screen.findByText("Input")).toBeInTheDocument();
    expect(screen.queryByText("Output")).not.toBeInTheDocument();
    expect(screen.queryByText("Reasoning")).not.toBeInTheDocument();
    expect(screen.queryByText("Cache")).not.toBeInTheDocument();
  });

  it("a populated usage row carries type-small, not raw text-xs", async () => {
    const user = setup();
    render(
      <Example maxTokens={1000} usage={{ inputTokens: 120, outputTokens: 40 }} usedTokens={160} />,
    );
    await user.hover(screen.getByRole("button"));
    const inputRow = (await screen.findByText("Input")).closest("div");
    expect(inputRow?.className).toContain("type-small");
    expect(inputRow?.className).not.toMatch(/\btext-xs\b/);
  });

  it("the footer's token count uses type-number-sm instead of raw font-mono", async () => {
    const user = setup();
    render(<Example maxTokens={1000} usedTokens={500} />);
    await user.hover(screen.getByRole("button"));
    const used = await screen.findByText(/500\s*\/\s*1K/i);
    expect(used.className).toContain("type-number-sm");
    expect(used.className).not.toMatch(/(?<![\w-])font-mono\b/);
  });
});
