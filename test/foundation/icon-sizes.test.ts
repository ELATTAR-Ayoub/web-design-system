/**
 * The icon size ladder.
 *
 * `components/ui/icon.tsx` is the only way an icon enters a screen, so the
 * ladder is asserted by VALUE here.
 *
 * The values are imported from the module rather than parsed out of the file:
 * `ICON_SIZES` is the public export a consumer reads, so the export is what the
 * contract is about.
 */

import { describe, expect, it } from "vitest";

import { ICON_SIZES, ICON_TONES } from "@/components/ui/icon";

/** Each rung and the px it must hold. */
const LADDER: { key: keyof typeof ICON_SIZES; px: number }[] = [
  { key: "xs", px: 12 },
  { key: "sm", px: 14 },
  { key: "md", px: 16 },
  { key: "lg", px: 20 },
  { key: "xl", px: 24 },
  { key: "2xl", px: 32 },
  { key: "3xl", px: 40 },
];

describe("the icon size ladder", () => {
  it("has exactly seven rungs", () => {
    expect(Object.keys(ICON_SIZES)).toEqual(LADDER.map((r) => r.key));
  });

  it("holds the expected pixel value on every rung", () => {
    const wrong = LADDER.filter((r) => ICON_SIZES[r.key] !== r.px).map(
      (r) => `${r.key}: ${ICON_SIZES[r.key]} (expected ${r.px})`,
    );
    expect(wrong).toEqual([]);
  });

  it("defaults to md, the 16px rung", () => {
    expect(ICON_SIZES.md).toBe(16);
  });
});

describe("every icon tone is a token, never a raw colour", () => {
  it("resolves each tone to a class in the token vocabulary", () => {
    const bad = Object.entries(ICON_TONES).filter(
      ([, cls]) => !/^text-(?:foreground|muted-foreground|current|[a-z-]+-ink)$/.test(cls),
    );
    expect(bad, "tones that are not a token class").toEqual([]);
  });

  /**
   * §1.3: only `-ink` may carry a glyph. `text-success` compiles and resolves,
   * which is exactly why this is asserted rather than assumed — the guard's
   * class-shaped rule already fails the build on it, and this states the same
   * contract at the one component that decides an icon's colour.
   */
  it("gives every state tone the -ink end of its ramp", () => {
    for (const tone of ["action", "value", "success", "warning", "info", "error"] as const) {
      expect(ICON_TONES[tone], tone).toMatch(/-ink$/);
    }
  });
});
