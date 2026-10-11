/** @covers agent-avatar */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { anim, appear, CubeScene, drop, iso } from "@/components/agent/avatar/cube";

describe("iso", () => {
  it("projects grid coordinates onto the isometric plane", () => {
    expect(iso(0, 0)).toEqual([0, 0]);
    expect(iso(1, 0)).toEqual([13, 6.5]);
    expect(iso(0, 1)).toEqual([-13, 6.5]);
    expect(iso(0, 0, 1)).toEqual([0, -13]);
  });
});

describe("CubeScene", () => {
  it("draws a hidden svg sized to the cubes it holds", () => {
    const { container } = render(<CubeScene cubes={[{ x: 0, y: 0 }, { x: 1, y: 0, accent: true }]} width={64} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden");
    expect(svg).toHaveAttribute("width", "64");
    expect(svg.getAttribute("viewBox")?.split(" ")).toHaveLength(4);
  });

  it("colours every face from the cube tokens, never a literal", () => {
    const { container } = render(<CubeScene cubes={[{ x: 0, y: 0 }, { x: 1, y: 1, red: true }]} width={64} />);
    const fills = [...container.querySelectorAll("polygon, path")].map((el) => el.getAttribute("fill") ?? "");
    expect(fills.length).toBeGreaterThan(0);
    for (const fill of fills.filter(Boolean)) expect(fill).toMatch(/var\(--agent-cube-|color-mix\(|none|transparent/);
  });
});

describe("cube timing", () => {
  it("scales duration and delay by speed and eases on the system curve", () => {
    const style = anim("appear", 2, { speed: 2 }, { delay: 1 });
    expect(style.animation).toBe("agent-cube-appear 1.00s var(--ease-move) infinite");
    expect(style.animationDelay).toBe("0.50s");
  });

  it("appear and drop start hidden", () => {
    expect(appear(1, 0, { speed: 1 }).opacity).toBe(0);
    expect(drop(1, 0, { speed: 1 }).opacity).toBe(0);
  });
});
