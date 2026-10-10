/** @covers agent-generated-image */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { GeneratedImage } from "@/components/agent/parts/generated-image";

// eslint-disable-next-line @next/next/no-img-element
const img = <img alt="A lighthouse" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" />;

describe("GeneratedImage", () => {
  it.each([
    ["queued", "Queued"],
    ["generating", "Generating"],
    ["refining", "Refining"],
    ["complete", "Done"],
    ["error", "Couldn't generate"],
  ] as const)("announces %s as %s", (stage, label) => {
    render(<GeneratedImage stage={stage}>{img}</GeneratedImage>);
    expect(screen.getByRole("status")).toHaveTextContent(label);
    expect(screen.getByRole("group", { name: "Generated image" }).dataset.stage).toBe(stage);
  });

  it("offers Retry only on error with a handler", async () => {
    const onRetry = vi.fn();
    const { rerender } = render(<GeneratedImage stage="generating" onRetry={onRetry}>{img}</GeneratedImage>);
    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
    rerender(<GeneratedImage stage="error" onRetry={onRetry}>{img}</GeneratedImage>);
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("shimmers while there is no image yet", () => {
    const { container } = render(<GeneratedImage stage="queued" />);
    expect(container.querySelector(".anim-shimmer")).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(<GeneratedImage stage="refining">{img}</GeneratedImage>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
