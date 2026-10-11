/**
 * Focused test for the `keyframes` capability.
 *
 * `styles/motion.css` is the catalogue of every `@keyframes` timeline in the
 * system, and `components/docs/component-docs/keyframes/page.tsx` documents
 * the rule that keeps it usable: a `@keyframes` block is never applied to an
 * element directly, only ever reached through the `anim-*` (or
 * component-specific) `@utility` that spends it. That indirection is exactly
 * what could silently break — an `@utility` renamed or dropped while the
 * `@keyframes` block underneath it survives leaves every host still wearing
 * the class with no animation at all, on a green build, because neither
 * `check:tokens` nor `check:refs` reads CSS-to-CSS references. This test
 * protects against that: it renders the page's own entrance specimen (the
 * single `anim-enter` tile — the four distinct entrances it used to show
 * merged into this one parameterised timeline when the vocabulary was cut to
 * fourteen), replayed through the same real `Tabs` component the page uses,
 * and asserts both that the `anim-*` utility class in it is still defined in
 * `styles/motion.css` AND that the `@keyframes` timeline it names still
 * exists there too — so a break on either side of the indirection fails here.
 *
 * The page does not export its `KeyframesSpecimen`/`KeyframesGrid` functions
 * (only `spec` is exported from `component-docs/keyframes/page.tsx`), so this
 * test rebuilds the minimal host from the page's own `source` string field,
 * reusing the real `Tabs` primitive it names.
 *
 * NOT COVERED HERE: jsdom does not run a compositor, so no keyframe timeline
 * actually plays here — `animation-name` resolving and a frame of motion
 * being painted is Playwright/visual territory, not this file's. The
 * `prefers-reduced-motion` collapse and the "vanishing-keyframe ledger" the
 * page's Reduced Motion section describes are asserted by
 * `motion-contract.test.ts` elsewhere in this repository, not here. No e2e
 * spec currently exercises `keyframes` by name (checked
 * `e2e/batch4.spec.ts`; it does not reference it), so real playback is unverified beyond this definition-presence check
 * until one is written.
 *
 * @covers keyframes
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * The real specimen from `components/docs/component-docs/keyframes/page.tsx`'s
 * `source` field, reproduced verbatim (those functions are not exported from
 * the page module), reusing the real `Tabs` primitive it names.
 */
function KeyframesGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="anim-enter flex h-16 items-center justify-center rounded-lg border border-border bg-card">
        <span className="type-badge text-muted-foreground">enter</span>
      </div>
    </div>
  );
}

function KeyframesSpecimen() {
  return (
    <Tabs defaultValue="a" className="w-full">
      <TabsList aria-label="Replay the entrance">
        <TabsTrigger value="a">Run 1</TabsTrigger>
        <TabsTrigger value="b">Run 2</TabsTrigger>
      </TabsList>
      <TabsContent value="a">
        <KeyframesGrid />
      </TabsContent>
      <TabsContent value="b">
        <KeyframesGrid />
      </TabsContent>
    </Tabs>
  );
}

const MOTION_CSS = readFileSync(join(process.cwd(), "styles/motion.css"), "utf8");

/** Utility class -> the @keyframes name it spends, per the page's own Classes table. */
const TIMELINES: Record<string, string> = {
  "anim-enter": "ds-enter",
};

describe("keyframes: the utility and the timeline underneath it are both real", () => {
  it.each(Object.entries(TIMELINES))(
    "%s is an @utility that names its @keyframes timeline %s",
    (utility, keyframeName) => {
      const utilityMatch = MOTION_CSS.match(
        new RegExp(`@utility ${utility}\\s*\\{([^}]*)\\}`),
      );
      expect(utilityMatch, `@utility ${utility} not found in styles/motion.css`).not.toBeNull();
      expect(utilityMatch?.[1]).toContain(keyframeName);

      expect(MOTION_CSS).toMatch(new RegExp(`@keyframes ${keyframeName}\\b`));
    },
  );
});

describe("keyframes: the documented specimen wears its utility", () => {
  it("the active tab panel renders a host for the timeline", () => {
    const { container } = render(<KeyframesSpecimen />);
    for (const utility of Object.keys(TIMELINES)) {
      expect(container.querySelector(`.${utility}`)).toBeInTheDocument();
    }
  });

  it("axe: the tabbed specimen", async () => {
    const { container } = render(<KeyframesSpecimen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
