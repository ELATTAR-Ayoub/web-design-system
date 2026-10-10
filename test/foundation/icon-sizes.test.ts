/**
 * The icon size ladder.
 *
 * `components/ui/icon.tsx` is the only way an icon enters a screen on the web;
 * `lib/src/components/ui/icon.dart` is the same on Flutter, and its `IconSize`
 * enum is spelled `xl2` / `xl3` for the `2xl` / `3xl` rungs because a Dart
 * identifier cannot start with a digit. That rename is a language constraint
 * and must not become a divergence, so the ladder is asserted by VALUE here and
 * mapped by name in `docs/contracts/flutter-web-foundation-parity.md`.
 *
 * The values are imported from the module rather than parsed out of the file:
 * `ICON_SIZES` is the public export a consumer reads, so the export is what the
 * contract is about.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { ICON_SIZES, ICON_TONES } from "@/components/ui/icon";

const ROOT = process.cwd();

/** Web key → Flutter `IconSize` member, and the px both must hold. */
const LADDER: { key: keyof typeof ICON_SIZES; flutter: string; px: number }[] = [
  { key: "xs", flutter: "xs", px: 12 },
  { key: "sm", flutter: "sm", px: 14 },
  { key: "md", flutter: "md", px: 16 },
  { key: "lg", flutter: "lg", px: 20 },
  { key: "xl", flutter: "xl", px: 24 },
  { key: "2xl", flutter: "xl2", px: 32 },
  { key: "3xl", flutter: "xl3", px: 40 },
];

describe("the icon size ladder", () => {
  it("has exactly seven rungs", () => {
    expect(Object.keys(ICON_SIZES)).toEqual(LADDER.map((r) => r.key));
  });

  it("holds the same pixel value on every rung as the counterpart platform", () => {
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

describe("the parity document covers the ladder", () => {
  const DOC = "docs/contracts/flutter-web-foundation-parity.md";

  it("maps every rung to its Flutter member", () => {
    const path = join(ROOT, ...DOC.split("/"));
    expect(existsSync(path), DOC).toBe(true);
    if (!existsSync(path)) return;
    const doc = readFileSync(path, "utf8");
    const missing = LADDER.filter((r) => !doc.includes(`IconSize.${r.flutter}`)).map(
      (r) => `IconSize.${r.flutter}`,
    );
    expect(missing, "icon rungs absent from the parity doc").toEqual([]);
  });
});
