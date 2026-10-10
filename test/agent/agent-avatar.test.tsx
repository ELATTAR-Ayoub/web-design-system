/**
 * @covers agent-avatar
 *
 * `CubeAvatar` (`components/agent/avatar/cube-avatar.tsx`), the default
 * `AvatarRenderer` — twenty isometric cube scenes plus a real CSS 3D cube for
 * `idle`. Its one hard contract, stated in `core/states.ts`'s closed-list
 * comment, is that every state the resolver can name has artwork and a text
 * alternative: this renders all twenty `AGENT_STATES` and asserts each
 * carries `role="img"` with the exact `AGENT_STATE_LABEL`, which is what
 * keeps the avatar from going mute the day a twenty-first state is added to
 * one file and not the other.
 *
 * Sizes are checked structurally (four `AvatarSize`s render without
 * throwing) rather than pixel-measured — jsdom lays nothing out, and the
 * `--agent-cube-*` recolouring this component drives is `style` on an
 * element, not something axe or RTL can see either; that half of the
 * contract is `check:tokens` plus the e2e evidence in
 * `docs/agent-workspace.md`'s "Known outstanding work" list.
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { CubeAvatar } from "@/components/agent/avatar/cube-avatar";
import { AGENT_STATES, AGENT_STATE_LABEL } from "@/components/agent/core/states";

describe("CubeAvatar", () => {
  it("every one of the twenty states carries a text alternative that matches its label", () => {
    for (const state of AGENT_STATES) {
      const { unmount } = render(<CubeAvatar state={state} />);
      expect(screen.getByRole("img", { name: AGENT_STATE_LABEL[state] })).toBeInTheDocument();
      unmount();
    }
  });

  it("idle renders the CSS cube; a working state renders an isometric scene — both carry data-agent-avatar", () => {
    const { container: idle } = render(<CubeAvatar state="idle" />);
    expect(idle.querySelector('[data-agent-avatar="idle"]')).toBeInTheDocument();

    const { container: working } = render(<CubeAvatar state="thinking" />);
    expect(working.querySelector('[data-agent-avatar="thinking"]')).toBeInTheDocument();
    // The isometric branch renders an svg scene; the idle branch does not.
    expect(working.querySelector("svg")).toBeInTheDocument();
  });

  it("every size renders without throwing", () => {
    for (const size of ["sm", "md", "lg", "xl"] as const) {
      const { unmount } = render(<CubeAvatar state="searching" size={size} />);
      expect(screen.getByRole("img", { name: AGENT_STATE_LABEL.searching })).toBeInTheDocument();
      unmount();
    }
  });

  it("axe: idle and a working state, at two sizes, side by side", async () => {
    const { container } = render(
      <>
        <CubeAvatar state="idle" size="sm" />
        <CubeAvatar state="thinking" size="lg" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
