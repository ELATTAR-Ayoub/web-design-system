import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";

vi.mock("streamdown", () => ({
  Streamdown: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@streamdown/cjk", () => ({ cjk: {} }));
vi.mock("@streamdown/code", () => ({ code: {} }));
vi.mock("@streamdown/math", () => ({ math: {} }));
vi.mock("@streamdown/mermaid", () => ({ mermaid: {} }));

import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";

const tree = (streaming: boolean, extra: { duration?: number } = {}) => (
  <Reasoning isStreaming={streaming} {...extra}>
    <ReasoningTrigger />
    <ReasoningContent>because reasons</ReasoningContent>
  </Reasoning>
);

describe("Reasoning", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("opens while streaming with a shimmering label", () => {
    render(tree(true));
    expect(screen.getByText("because reasons")).toBeInTheDocument();
    expect(screen.getByText("Thinking...")).toHaveClass("anim-shimmer-text");
  });
  it("auto-closes after streaming ends and reports the duration", () => {
    const { rerender } = render(tree(true));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    rerender(tree(false));
    expect(screen.getByText(/Thought for \d+ seconds/)).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.queryByText("because reasons")).not.toBeInTheDocument();
  });
  it("stays closed when idle; static duration prop", () => {
    render(tree(false, { duration: 7 }));
    expect(screen.queryByText("because reasons")).not.toBeInTheDocument();
    expect(screen.getByText("Thought for 7 seconds")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveClass("type-small");
  });
});
