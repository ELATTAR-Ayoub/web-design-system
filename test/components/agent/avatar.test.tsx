import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { CubeAvatar } from "@/components/agent/avatar/cube-avatar";
import { sceneFor } from "@/components/agent/avatar/scenes";
import { AGENT_STATES, AGENT_STATE_LABEL } from "@/components/agent/core/states";
import { OVERLAY_AXE_OPTIONS } from "../helpers";

describe("CubeAvatar", () => {
  it("every one of the twenty states carries a text alternative", () => {
    for (const state of AGENT_STATES) {
      const { unmount } = render(<CubeAvatar state={state} />);
      expect(screen.getByRole("img", { name: AGENT_STATE_LABEL[state] })).toBeInTheDocument();
      unmount();
    }
  });

  it("axe: idle and a working state, at two sizes", async () => {
    const { container } = render(
      <>
        <CubeAvatar state="idle" size="sm" />
        <CubeAvatar state="thinking" size="lg" />
      </>,
    );
    expect(await axe(container, OVERLAY_AXE_OPTIONS)).toHaveNoViolations();
  });
});

describe("sceneFor", () => {
  it("draws a scene for every state", () => {
    for (const s of AGENT_STATES.filter((x) => x !== "idle")) {
      expect(sceneFor(s as Exclude<typeof s, "idle">, { speed: 1 }).cubes.length).toBeGreaterThan(0);
    }
  });
});
