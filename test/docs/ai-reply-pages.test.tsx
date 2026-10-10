/**
 * Smoke test for the nine `ai-reply` documentation pages. Every specimen
 * export and every section's render nodes must mount without throwing, and
 * each page gets one assertion about its main control.
 *
 * @covers ai-message
 * @covers ai-conversation
 * @covers ai-reasoning
 * @covers ai-chain-of-thought
 * @covers ai-sources
 * @covers ai-inline-citation
 * @covers ai-suggestion
 * @covers ai-shimmer
 * @covers ai-open-in-chat
 */
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// use-stick-to-bottom measures scroll geometry jsdom does not have: stub the
// module boundary, as test/components/ai-elements/conversation.test.tsx does.
vi.mock("use-stick-to-bottom", () => {
  type P = { children?: ReactNode; className?: string; role?: string; "aria-label"?: string };
  function StickToBottom({ children, className, role, "aria-label": label }: P) {
    return (
      <div aria-label={label} className={className} role={role}>
        {children}
      </div>
    );
  }
  function Content({ children, className }: P) {
    return <div className={className}>{children}</div>;
  }
  StickToBottom.Content = Content;
  return {
    StickToBottom,
    useStickToBottomContext: () => ({ isAtBottom: false, scrollToBottom: () => {} }),
  };
});

import type { ComponentDocSpec, DocSection } from "@/components/docs/component-page/types";
import { spec as aiMessage } from "@/components/docs/component-docs/ai-message/page";
import { spec as aiConversation } from "@/components/docs/component-docs/ai-conversation/page";
import { spec as aiReasoning } from "@/components/docs/component-docs/ai-reasoning/page";
import { spec as aiChain } from "@/components/docs/component-docs/ai-chain-of-thought/page";
import { spec as aiSources } from "@/components/docs/component-docs/ai-sources/page";
import { spec as aiCitation } from "@/components/docs/component-docs/ai-inline-citation/page";
import { spec as aiSuggestion } from "@/components/docs/component-docs/ai-suggestion/page";
import { spec as aiShimmer } from "@/components/docs/component-docs/ai-shimmer/page";
import { spec as aiOpenIn } from "@/components/docs/component-docs/ai-open-in-chat/page";

import * as message from "@/components/docs/component-docs/ai-message/message-specimen";
import * as conversation from "@/components/docs/component-docs/ai-conversation/conversation-specimen";
import * as reasoning from "@/components/docs/component-docs/ai-reasoning/reasoning-specimen";
import * as chain from "@/components/docs/component-docs/ai-chain-of-thought/chain-of-thought-specimen";
import * as sources from "@/components/docs/component-docs/ai-sources/sources-specimen";
import * as citation from "@/components/docs/component-docs/ai-inline-citation/inline-citation-specimen";
import * as suggestion from "@/components/docs/component-docs/ai-suggestion/suggestion-specimen";
import * as shimmer from "@/components/docs/component-docs/ai-shimmer/shimmer-specimen";
import * as openIn from "@/components/docs/component-docs/ai-open-in-chat/open-in-chat-specimen";

const SPECS: ComponentDocSpec[] = [
  aiMessage,
  aiConversation,
  aiReasoning,
  aiChain,
  aiSources,
  aiCitation,
  aiSuggestion,
  aiShimmer,
  aiOpenIn,
];

const SECTION_ORDER = ["preview", "installation", "usage", "states", "examples", "api", "accessibility", "why", "source"];

/** The nodes a section renders: a showcase's specimen, install notes, disclosure bodies. */
function nodesOf(section: DocSection): ReactNode[] {
  switch (section.kind) {
    case "showcase":
    case "effect":
      return [section.render];
    case "install":
      return section.notes ? [section.notes] : [];
    case "disclosure":
      return section.blocks.map((b) => b.body);
    default:
      return [];
  }
}

describe("ai-reply pages", () => {
  it.each(SPECS.map((s) => [s.name, s] as const))("%s: sections are in order and every render node mounts", (_name, spec) => {
    const ids = spec.sections.map((s) => s.id);
    const ranked = ids.map((id) => SECTION_ORDER.indexOf(id));
    expect(ranked).not.toContain(-1);
    expect([...ranked].sort((a, b) => a - b)).toEqual(ranked);
    for (const id of ["preview", "installation", "usage", "states", "api", "accessibility", "why", "source"]) {
      expect(ids, `${spec.name} has ${id}`).toContain(id);
    }
    for (const section of spec.sections) {
      for (const node of nodesOf(section)) {
        const { unmount } = render(<>{node}</>);
        unmount();
      }
    }
  });

  it("renders every specimen export", () => {
    const all = [message, conversation, reasoning, chain, sources, citation, suggestion, shimmer, openIn];
    for (const mod of all) {
      for (const [name, value] of Object.entries(mod)) {
        if (typeof value !== "function" || !/^[A-Z]/.test(name)) continue;
        const Specimen = value as () => ReactNode;
        const { unmount } = render(<Specimen />);
        unmount();
      }
    }
  });

  it("ai-message: the action buttons have accessible names and the reply is prose", async () => {
    const { container } = render(<message.MessagePreview />);
    expect(screen.getByRole("button", { name: "Copy reply" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Regenerate reply" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Renewal summary" })).toBeInTheDocument();
    expect(container.querySelector(".prose.streamdown-chrome")).not.toBeNull();
  });

  it("ai-message: the branch selector pages through versions", () => {
    render(<message.MessageBranchSpecimen />);
    expect(screen.getByText("1 of 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next branch" })).toBeEnabled();
  });

  it("ai-conversation: the log is named and its buttons have names", () => {
    render(<conversation.ConversationPreview />);
    expect(screen.getByRole("log", { name: "Renewal thread" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download conversation" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Scroll to latest message" })).toBeInTheDocument();
  });

  it("ai-reasoning: the trigger is a collapsed button named by its label", () => {
    render(<reasoning.ReasoningPlayground />);
    expect(screen.getByRole("button", { name: /Thought for a few seconds/ })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Start thinking" })).toBeInTheDocument();
  });

  it("ai-chain-of-thought: the header toggles a list that shows the step labels", () => {
    render(<chain.ChainOfThoughtPreview />);
    expect(screen.getByRole("button", { name: "Worked through 4 steps" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Read the order form")).toBeInTheDocument();
  });

  it("ai-sources: the trigger counts the sources and links open in a new tab", () => {
    render(<sources.SourcesStateGrid />);
    expect(screen.getAllByRole("button", { name: /Used 3 sources/ })).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Renewal terms" })).toHaveAttribute("target", "_blank");
  });

  it("ai-inline-citation: the badge shows the hostname and the count of further sources", () => {
    render(<citation.InlineCitationPreview />);
    expect(screen.getByText(/contracts\.example/)).toHaveTextContent("contracts.example +1");
  });

  it("ai-suggestion: each chip is a button named by its text", () => {
    render(<suggestion.SuggestionPlayground />);
    expect(screen.getByRole("button", { name: "Summarise this" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(5);
  });

  it("ai-shimmer: the label is real text wearing the shimmer utility", () => {
    render(<shimmer.ShimmerPreview />);
    expect(screen.getByText("Thinking…")).toHaveClass("anim-shimmer-text");
  });

  it("ai-open-in-chat: the trigger is a button named Open in chat", () => {
    render(<openIn.OpenInPreview />);
    expect(screen.getByRole("button", { name: /Open in chat/ })).toHaveAttribute("aria-haspopup", "menu");
  });

  it("ai-open-in-chat: the specimen offers one example target, not a third-party service", async () => {
    render(<openIn.OpenInPreview />);
    await userEvent.click(screen.getByRole("button", { name: /Open in chat/ }));
    const items = await screen.findAllByRole("menuitem");
    expect(items).toHaveLength(1);
    expect(items[0].getAttribute("href")).toMatch(/^https:\/\/example\.com\/chat\?q=/);
  });
});
