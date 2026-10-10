import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Checkpoint,
  CheckpointIcon,
  CheckpointTrigger,
} from "@/components/ai-elements/checkpoint";

describe("Checkpoint", () => {
  it("renders icon, trigger and fires the click", async () => {
    const onClick = vi.fn();
    const { container } = render(
      <Checkpoint>
        <CheckpointIcon />
        <CheckpointTrigger onClick={onClick}>Restore</CheckpointTrigger>
      </Checkpoint>,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("text-muted-foreground");
    await userEvent.setup().click(screen.getByRole("button", { name: "Restore" }));
    expect(onClick).toHaveBeenCalled();
  });
  it("trigger is Button sm with no hit-area override; icon forwards SVG props", () => {
    const { container } = render(
      <Checkpoint>
        <CheckpointIcon strokeWidth={3} />
        <CheckpointTrigger>Go</CheckpointTrigger>
      </Checkpoint>,
    );
    const b = screen.getByRole("button", { name: "Go" });
    expect(b).toHaveAttribute("data-size", "sm");
    expect(b.className).not.toContain("size-target-min");
    expect(container.querySelector("svg")).toHaveAttribute("stroke-width", "3");
  });
  it("accepts custom children for the icon", () => {
    render(
      <CheckpointIcon>
        <span>custom</span>
      </CheckpointIcon>,
    );
    expect(screen.getByText("custom")).toBeInTheDocument();
  });
});
