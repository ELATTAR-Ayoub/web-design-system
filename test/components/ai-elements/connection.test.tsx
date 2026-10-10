import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Connection } from "@/components/ai-elements/connection";

// React Flow supplies the full ConnectionLineComponentProps during a drag; the
// component only reads the four coordinates.
const props = (p: { fromX: number; fromY: number; toX: number; toY: number }) =>
  p as unknown as React.ComponentProps<typeof Connection>;

describe("Connection", () => {
  it("draws a bezier path from the drag origin to the pointer on the ring token", () => {
    const { container } = render(
      <svg>
        <Connection {...props({ fromX: 10, fromY: 20, toX: 110, toY: 220 })} />
      </svg>
    );

    const path = container.querySelector("path");
    expect(path).toBeInTheDocument();
    expect(path?.getAttribute("stroke")).toBe("var(--color-ring)");
    expect(path?.getAttribute("d")).toContain("M10,20");
    expect(path?.getAttribute("d")).toContain("110,220");
  });

  it("marks the pointer endpoint with a dot that carries no hardcoded colour", () => {
    const { container } = render(
      <svg>
        <Connection {...props({ fromX: 0, fromY: 0, toX: 50, toY: 50 })} />
      </svg>
    );

    const dot = container.querySelector("circle");
    expect(dot).toBeInTheDocument();
    // Vendored change: was a hardcoded `#fff`. Asserting the fill is a real
    // token (`var(--color-action-ink)`) rather than any literal hex value.
    expect(dot?.getAttribute("fill")).toBe("var(--color-action-ink)");
    expect(dot?.getAttribute("fill")).not.toMatch(/^#/);
    expect(dot?.getAttribute("stroke")).toBe("var(--color-ring)");
  });
});
