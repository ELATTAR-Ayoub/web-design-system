import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlayIcon } from "lucide-react";

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/ai-elements/artifact";

describe("Artifact", () => {
  it("renders the official composition: title/description on the left, actions on the right", () => {
    const handleRun = vi.fn();
    render(
      <Artifact>
        <ArtifactHeader>
          <div>
            <ArtifactTitle>Dijkstra&apos;s Algorithm Implementation</ArtifactTitle>
            <ArtifactDescription>Updated 1 minute ago</ArtifactDescription>
          </div>
          <ArtifactActions>
            <ArtifactAction icon={PlayIcon} label="Run" onClick={handleRun} tooltip="Run code" />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactContent>body</ArtifactContent>
      </Artifact>
    );

    expect(screen.getByText("Dijkstra's Algorithm Implementation")).toBeInTheDocument();
    expect(screen.getByText("Updated 1 minute ago")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("ArtifactAction fires its callback and exposes an accessible name via label", async () => {
    const handleRun = vi.fn();
    render(
      <ArtifactAction icon={PlayIcon} label="Run" onClick={handleRun} />
    );

    const button = screen.getByRole("button", { name: "Run" });
    button.click();
    expect(handleRun).toHaveBeenCalledTimes(1);
  });

  it("ArtifactAction is a 32px icon-sm toolbar button, with no 44px minimum", () => {
    render(<ArtifactAction icon={PlayIcon} label="Run" />);
    const button = screen.getByRole("button", { name: "Run" });
    expect(button).toHaveAttribute("data-size", "icon-sm");
    expect(button.className).not.toContain("size-target-min");
  });

  it("ArtifactClose renders a default close affordance with an accessible name", () => {
    const handleClose = vi.fn();
    render(<ArtifactClose onClick={handleClose} />);
    const button = screen.getByRole("button", { name: "Close" });
    expect(button).toHaveAttribute("data-size", "icon-sm");
    expect(button.className).not.toContain("size-target-min");
    button.click();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("ArtifactTitle and ArtifactDescription carry the small type role, not a raw text-sm", () => {
    render(
      <div>
        <ArtifactTitle>Title</ArtifactTitle>
        <ArtifactDescription>Description</ArtifactDescription>
      </div>
    );
    expect(screen.getByText("Title").className).toContain("type-nav");
    expect(screen.getByText("Description").className).toContain("type-small");
  });
});
