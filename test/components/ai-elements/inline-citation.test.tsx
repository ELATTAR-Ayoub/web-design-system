import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselNext,
  InlineCitationCarouselPrev,
  InlineCitationQuote,
  InlineCitationSource,
  InlineCitationText,
} from "@/components/ai-elements/inline-citation";

describe("InlineCitation", () => {
  it("shows hostname +n on the trigger with the pill radius", () => {
    render(
      <InlineCitation>
        <InlineCitationText>claim</InlineCitationText>
        <InlineCitationCard>
          <InlineCitationCardTrigger sources={["https://a.test/x", "https://b.test"]} />
        </InlineCitationCard>
      </InlineCitation>,
    );
    const trig = screen.getByText(/a\.test/);
    expect(trig).toHaveTextContent("a.test +1");
    expect(trig).toHaveClass("rounded-pill");
    expect(trig).not.toHaveClass("rounded-full");
  });
  it("trigger falls back to unknown", () => {
    render(
      <InlineCitationCard>
        <InlineCitationCardTrigger sources={[]} />
      </InlineCitationCard>,
    );
    expect(screen.getByText("unknown")).toBeInTheDocument();
  });
  it("source and quote use type roles", () => {
    render(
      <>
        <InlineCitationSource title="T" url="https://u.test" description="D" />
        <InlineCitationQuote>q</InlineCitationQuote>
      </>,
    );
    expect(screen.getByText("T")).toHaveClass("type-nav");
    expect(screen.getByText("https://u.test")).toHaveClass("text-muted-foreground");
    expect(screen.getByText("q")).toHaveClass("type-small", "italic");
  });
  it("carousel prev/next are real Buttons with accessible names", async () => {
    render(
      <InlineCitationCard open>
        <InlineCitationCardTrigger sources={["https://a.test"]} />
        <InlineCitationCardBody>
          <InlineCitationCarousel>
            <InlineCitationCarouselHeader>
              <InlineCitationCarouselPrev />
              <InlineCitationCarouselIndex />
              <InlineCitationCarouselNext />
            </InlineCitationCarouselHeader>
            <InlineCitationCarouselContent>
              <InlineCitationCarouselItem>one</InlineCitationCarouselItem>
            </InlineCitationCarouselContent>
          </InlineCitationCarousel>
        </InlineCitationCardBody>
      </InlineCitationCard>,
    );
    const prev = screen.getByRole("button", { name: "Previous" });
    const next = screen.getByRole("button", { name: "Next" });
    expect(prev).toHaveAttribute("data-slot", "button");
    expect(prev).toHaveAttribute("data-size", "icon-sm");
    expect(prev.className).not.toContain("size-target-min");
    expect(next).toHaveAttribute("data-slot", "button");
    const user = userEvent.setup();
    await user.click(next);
    await user.click(prev);
  });
});
