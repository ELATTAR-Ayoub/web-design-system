/**
 * @covers agent-workspace
 */
import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { remVarToPx, useContainerInlineSize } from "@/components/agent/core/use-container-width";

describe("remVarToPx", () => {
  afterEach(() => {
    document.documentElement.style.removeProperty("--test-container-var");
    document.documentElement.style.removeProperty("font-size");
  });

  it("converts a rem custom property to px using the root font-size", () => {
    document.documentElement.style.setProperty("--test-container-var", "64rem");
    document.documentElement.style.fontSize = "16px";
    expect(remVarToPx("--test-container-var", 48)).toBe(1024);
  });

  it("falls back to the given rem figure when the variable is unset — jsdom has no stylesheet", () => {
    expect(remVarToPx("--container-5xl", 64)).toBe(64 * 16);
  });

  it("respects a non-default root font-size", () => {
    document.documentElement.style.setProperty("--test-container-var", "48rem");
    document.documentElement.style.fontSize = "20px";
    expect(remVarToPx("--test-container-var", 48)).toBe(960);
  });
});

function Host({ onWidth }: { onWidth: (width: number) => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const width = useContainerInlineSize(ref);
  onWidth(width);
  return <div ref={ref} data-testid="host" />;
}

describe("useContainerInlineSize", () => {
  const realGetBoundingClientRect = Element.prototype.getBoundingClientRect;

  afterEach(() => {
    Element.prototype.getBoundingClientRect = realGetBoundingClientRect;
  });

  it("measures the ref'd element's own width on mount", () => {
    Element.prototype.getBoundingClientRect = function stubbedRect() {
      return { width: 900, height: 600, top: 0, left: 0, right: 900, bottom: 600, x: 0, y: 0, toJSON() {} } as DOMRect;
    };

    let latest = -1;
    render(<Host onWidth={(w) => (latest = w)} />);

    expect(screen.getByTestId("host")).toBeInTheDocument();
    expect(latest).toBe(900);
  });

  it("is 0 before anything has been measured — the safe 'narrower than any threshold' default", () => {
    Element.prototype.getBoundingClientRect = function zeroRect() {
      return { width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON() {} } as DOMRect;
    };

    let latest = -1;
    render(<Host onWidth={(w) => (latest = w)} />);
    expect(latest).toBe(0);
  });
});
