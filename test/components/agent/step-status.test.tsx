/** @covers agent-core */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { formatDuration, STEP_STATUS_LABEL, StepStatusMark } from "@/components/agent/workspace/step-status";

describe("StepStatusMark", () => {
  it.each(Object.entries(STEP_STATUS_LABEL))("names the %s status as %s", (status, label) => {
    render(<StepStatusMark status={status as keyof typeof STEP_STATUS_LABEL} />);
    expect(screen.getByRole("img", { name: label })).toBeInTheDocument();
  });

  it("is silent when decorative", () => {
    const { container } = render(<StepStatusMark decorative status="done" />);
    expect(screen.queryByRole("img", { name: "Done" })).toBeNull();
    expect(container.firstElementChild).not.toBeNull();
  });

  it("pulses only while running", () => {
    const { container, rerender } = render(<StepStatusMark status="running" />);
    expect(container.querySelector(".anim-pulse")).not.toBeNull();
    rerender(<StepStatusMark status="done" />);
    expect(container.querySelector(".anim-pulse")).toBeNull();
  });
});

describe("formatDuration", () => {
  it("shows milliseconds under a second and seconds above", () => {
    expect(formatDuration(950)).toBe("950 ms");
    expect(formatDuration(1500)).toBe("1.5 s");
    expect(formatDuration(1000)).toBe("1.0 s");
  });
});
