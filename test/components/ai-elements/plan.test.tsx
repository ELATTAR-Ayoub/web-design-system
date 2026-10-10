import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Plan,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "@/components/ai-elements/plan";

const tree = (streaming: boolean) => (
  <Plan isStreaming={streaming} defaultOpen>
    <PlanHeader>
      <PlanTitle>Build it</PlanTitle>
      <PlanDescription>Three steps</PlanDescription>
      <PlanTrigger />
    </PlanHeader>
    <PlanContent>Step list</PlanContent>
  </Plan>
);

describe("Plan", () => {
  it("renders plain text when idle", () => {
    render(tree(false));
    expect(screen.getByText("Build it")).not.toHaveClass("anim-shimmer-text");
  });
  it("shimmers title and description while streaming", () => {
    render(tree(true));
    expect(screen.getByText("Build it")).toHaveClass("anim-shimmer-text");
    expect(screen.getByText("Three steps")).toHaveClass("anim-shimmer-text");
  });
  it("toggles content from the trigger", async () => {
    render(tree(false));
    const t = screen.getByRole("button", { name: "Toggle plan" });
    expect(t).toHaveAttribute("data-state", "open");
    expect(t).toHaveAttribute("data-size", "icon"); // 40px, no size-8 override
    await userEvent.setup().click(t);
    expect(t).toHaveAttribute("data-state", "closed");
  });
});
