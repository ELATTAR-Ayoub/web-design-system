import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// use-stick-to-bottom measures scroll geometry jsdom does not have: mock the
// module boundary, not the component under test.
const stick = vi.hoisted(() => ({ atBottom: false, scrollToBottom: vi.fn() }));
vi.mock("use-stick-to-bottom", () => {
  type P = { children?: ReactNode; className?: string };
  function StickToBottom({ children, className }: P) {
    return (
    <div role="log" className={className}>
      {children}
    </div>
    );
  }
  const Content = ({ children, className }: P) => <div className={className}>{children}</div>;
  StickToBottom.Content = Content;
  return {
    StickToBottom,
    useStickToBottomContext: () => ({ isAtBottom: stick.atBottom, scrollToBottom: stick.scrollToBottom }),
  };
});

import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
  messagesToMarkdown,
} from "@/components/ai-elements/conversation";

const msgs = [
  { id: "1", role: "user", parts: [{ type: "text", text: "hi" }] },
  { id: "2", role: "assistant", parts: [{ type: "text", text: "yo" }] },
] as never;

describe("Conversation", () => {
  it("empty state uses type roles", () => {
    render(
      <Conversation>
        <ConversationContent>
          <ConversationEmptyState />
        </ConversationContent>
      </Conversation>,
    );
    expect(screen.getByText("No messages yet")).toHaveClass("type-nav");
    expect(screen.getByText(/Start a conversation/)).toHaveClass("text-muted-foreground");
  });
  it("scroll button shows off-bottom and scrolls", async () => {
    stick.atBottom = false;
    const { rerender } = render(<ConversationScrollButton aria-label="down" />);
    const b = screen.getByRole("button", { name: "down" });
    expect(b).toHaveClass("left-1/2", "-translate-x-1/2", "size-10");
    await userEvent.setup().click(b);
    expect(stick.scrollToBottom).toHaveBeenCalled();
    stick.atBottom = true;
    rerender(<ConversationScrollButton aria-label="down" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
  it("markdown export + download button", async () => {
    expect(messagesToMarkdown(msgs)).toBe("**User:** hi\n\n**Assistant:** yo");
    URL.createObjectURL = vi.fn(() => "blob:x");
    URL.revokeObjectURL = vi.fn();
    render(<ConversationDownload messages={msgs} aria-label="dl" />);
    await userEvent.setup().click(screen.getByRole("button", { name: "dl" }));
    expect(URL.createObjectURL).toHaveBeenCalled();
  });
});
