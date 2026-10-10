import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtImage,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";

describe("ChainOfThought", () => {
  it("is closed by default and opens from the header", async () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtHeader />
        <ChainOfThoughtContent>
          <ChainOfThoughtStep label="Search" description="why" status="active" />
          <ChainOfThoughtStep label="Done" status="complete" />
          <ChainOfThoughtStep label="Later" status="pending" />
          <ChainOfThoughtSearchResults>
            <ChainOfThoughtSearchResult>a.com</ChainOfThoughtSearchResult>
          </ChainOfThoughtSearchResults>
          <ChainOfThoughtImage caption="cap">
            <i />
          </ChainOfThoughtImage>
        </ChainOfThoughtContent>
      </ChainOfThought>,
    );
    expect(screen.queryByText("Search")).not.toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: /chain of thought/i }));
    expect(screen.getByText("Search").closest(".anim-enter")).toHaveClass("text-foreground");
    expect(screen.getByText("Done").closest(".anim-enter")).toHaveClass("text-muted-foreground");
    expect(screen.getByText("Later").closest(".anim-enter")).toHaveClass("text-muted-foreground/50");
    expect(screen.getByText("why")).toHaveClass("type-small");
    expect(screen.getByText("a.com")).toHaveClass("type-badge");
    expect(screen.getByText("cap")).toHaveClass("type-small");
  });
  it("respects defaultOpen", () => {
    render(
      <ChainOfThought defaultOpen>
        <ChainOfThoughtContent>
          <ChainOfThoughtStep label="Visible" />
        </ChainOfThoughtContent>
      </ChainOfThought>,
    );
    expect(screen.getByText("Visible")).toBeInTheDocument();
  });
});
