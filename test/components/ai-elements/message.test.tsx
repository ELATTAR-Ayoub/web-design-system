import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Streamdown renders markdown through async plugins (shiki, mermaid, katex).
vi.mock("streamdown", () => ({
  Streamdown: ({ children }: { children?: ReactNode }) => <div data-testid="md">{children}</div>,
}));
vi.mock("@streamdown/cjk", () => ({ cjk: {} }));
vi.mock("@streamdown/code", () => ({ code: {} }));
vi.mock("@streamdown/math", () => ({ math: {} }));
vi.mock("@streamdown/mermaid", () => ({ mermaid: {} }));

import {
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from "@/components/ai-elements/message";

describe("Message", () => {
  it("user vs assistant roles and body type role", () => {
    const { container } = render(
      <>
        <Message from="user">
          <MessageContent>u</MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent>a</MessageContent>
        </Message>
      </>,
    );
    expect(container.children[0]).toHaveClass("is-user");
    expect(container.children[1]).toHaveClass("is-assistant");
    expect(screen.getByText("u")).toHaveClass("type-body");
    expect(screen.getByText("u").className).not.toContain("is-user:dark");
  });
  it("response and toolbar/actions render with an accessible action name", () => {
    render(
      <MessageToolbar>
        <MessageActions>
          <MessageAction label="Copy" />
        </MessageActions>
        <MessageResponse>**hi**</MessageResponse>
      </MessageToolbar>,
    );
    const copy = screen.getByRole("button", { name: "Copy" });
    expect(copy).toHaveAttribute("data-size", "icon-sm");
    expect(copy.className).not.toContain("size-target-min");
    expect(screen.getByTestId("md")).toHaveTextContent("**hi**");
  });
  it("branches: page counter and next/previous wrap", async () => {
    const user = userEvent.setup();
    const onBranchChange = vi.fn();
    render(
      <MessageBranch onBranchChange={onBranchChange}>
        <MessageBranchContent>
          <div key="1">first</div>
          <div key="2">second</div>
        </MessageBranchContent>
        <MessageBranchSelector>
          <MessageBranchPrevious />
          <MessageBranchPage />
          <MessageBranchNext />
        </MessageBranchSelector>
      </MessageBranch>,
    );
    expect(await screen.findByText("1 of 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next branch" })).toHaveAttribute("data-size", "icon-sm");
    await user.click(screen.getByRole("button", { name: "Next branch" }));
    expect(screen.getByText("2 of 2")).toBeInTheDocument();
    expect(onBranchChange).toHaveBeenLastCalledWith(1);
    await user.click(screen.getByRole("button", { name: "Next branch" }));
    expect(onBranchChange).toHaveBeenLastCalledWith(0);
    await user.click(screen.getByRole("button", { name: "Previous branch" }));
    expect(onBranchChange).toHaveBeenLastCalledWith(1);
  });
  it("selector hides with a single branch", () => {
    render(
      <MessageBranch>
        <MessageBranchContent>
          <div key="1">only</div>
        </MessageBranchContent>
        <MessageBranchSelector>
          <MessageBranchNext />
        </MessageBranchSelector>
      </MessageBranch>,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
