/**
 * @covers ai-code-block
 *
 * `CodeBlock` with the REAL Shiki (code-block.test.tsx mocks it): the block
 * ends up coloured, on the system's code roles. It used to stay on its raw,
 * uncoloured first paint whenever highlighting finished before the
 * component's effect subscribed — which, in a browser, was every time.
 */
import { describe, expect, it } from "vitest";
import { render, waitFor } from "@testing-library/react";

import { CodeBlock, highlightCode } from "@/components/ai-elements/code-block";

describe("CodeBlock — highlighting lands", () => {
  it("colours tokens with the system theme's variables", async () => {
    const { container } = render(<CodeBlock code="type Plan = { seats: number };" language="ts" />);
    await waitFor(
      () => {
        const colours = [...container.querySelectorAll("pre span[style]")].map((s) => (s as HTMLElement).style.color);
        expect(colours).toContain("var(--shiki-token-keyword)");
      },
      { timeout: 15_000 },
    );
  });

  it("calls back with a result that is already cached", async () => {
    const code = "const cached = 1;";
    await new Promise<void>((resolve) => highlightCode(code, "ts", () => resolve()));
    let calledBack = false;
    const sync = highlightCode(code, "ts", () => {
      calledBack = true;
    });
    expect(sync).not.toBeNull();
    expect(calledBack).toBe(true);
  });
});
