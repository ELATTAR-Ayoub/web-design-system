import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources";

describe("Sources", () => {
  it("opens to reveal links; trigger uses the action ink", async () => {
    render(
      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source href="https://a.test" title="Alpha" />
        </SourcesContent>
      </Sources>,
    );
    expect(screen.getByText("Used 2 sources")).toHaveClass("type-nav");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button"));
    const link = screen.getByRole("link", { name: "Alpha" });
    expect(link).toHaveAttribute("href", "https://a.test");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.closest("[data-slot=collapsible]")).toHaveClass("text-action-ink");
  });
});
