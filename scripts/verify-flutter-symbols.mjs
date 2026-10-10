#!/usr/bin/env node
/**
 * Verifies every `flutter:` value in `lib/motion-names.ts` names a symbol
 * that actually exists on the Flutter side — Motion Vocabulary Parity's
 * final-review Important finding (`CheckDrawMotion` / `DotPopMotion` /
 * `SwapInMotion` were fabricated; the real classes are `CheckmarkDrawMotion`
 * / `DotSelectionMotion` / `ContentSwapMotion`). This script is the guard
 * that catches the next one of those before it ships as documented "parity".
 *
 * Three symbol shapes appear in `flutter:` values:
 *
 *   - `MotionDurations.x` / `MotionCurves.x` — checked against
 *     `static const … x` inside `foundation/motion.dart`.
 *   - A bare `Name` (a public or private class — a `*Motion` widget, some
 *     other widget/controller that really implements the utility, or
 *     occasionally a plain identifier embedded in a short descriptive
 *     phrase, e.g. "exit half of OpenMotion") — checked against
 *     `class Name` (with an optional leading underscore for a private
 *     class) anywhere under `lib/src/components/ui/`.
 *   - `—` (optionally followed by a parenthetical note) — no Flutter
 *     counterpart exists by design; skipped.
 *
 * Every `flutter:` value in `lib/motion-names.ts` is now a verified symbol
 * or `—` — there is no more disclosed "placeholder naming" block to exempt.
 * This script therefore fails on ANY symbol it cannot find, full stop.
 *
 * Run: `node scripts/verify-flutter-symbols.mjs`
 * Exit: non-zero if any asserted symbol is missing.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const FLUTTER_ROOT = process.env.FLUTTER_DS_ROOT
  ? process.env.FLUTTER_DS_ROOT
  : join(ROOT, "..", "flutter-design-system");

const MOTION_DART = join(FLUTTER_ROOT, "lib", "src", "design_system", "foundation", "motion.dart");
const COMPONENTS_UI_DIR = join(FLUTTER_ROOT, "lib", "src", "components", "ui");

function readAllDartFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...readAllDartFiles(p));
    else if (entry.name.endsWith(".dart")) out.push(p);
  }
  return out;
}

const MOTION_NAMES_PATH = join(ROOT, "lib", "motion-names.ts");

/** Every `flutter:` value declared in `lib/motion-names.ts`. */
function extractMotionNamesEntries() {
  const src = readFileSync(MOTION_NAMES_PATH, "utf8");
  const entries = [];
  const re = /flutter:\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(src))) {
    entries.push(m[1]);
  }
  return entries;
}

/** Pull every checkable symbol reference out of one `flutter:` value. */
function symbolsIn(value) {
  if (value.startsWith("—")) return { skip: true, symbols: [] };
  const symbols = [];
  for (const dm of value.matchAll(/\bMotionDurations\.(\w+)\b/g)) {
    symbols.push({ kind: "duration", name: dm[1], raw: dm[0] });
  }
  for (const cm of value.matchAll(/\bMotionCurves\.(\w+)\b/g)) {
    symbols.push({ kind: "curve", name: cm[1], raw: cm[0] });
  }
  // Bare (optionally underscore-prefixed, for a private class) PascalCase
  // identifiers not already captured above — a whole-value class name like
  // "CheckmarkDrawMotion" or "_PanelIn", or one embedded in a short
  // descriptive phrase like "exit half of OpenMotion". A plain `\b` word
  // boundary does not fire between `_` and the letter after it (both are
  // word characters), so the leading underscore is matched with a
  // lookbehind instead of being folded into the `\b` itself.
  for (const cm of value.matchAll(/(?<![A-Za-z0-9_])(_*[A-Z][A-Za-z0-9]*)\b/g)) {
    const name = cm[1];
    if (name === "MotionDurations" || name === "MotionCurves") continue;
    symbols.push({ kind: "class", name, raw: name });
  }
  return { skip: false, symbols };
}

function main() {
  if (!existsSync(FLUTTER_ROOT)) {
    console.error(
      `verify-flutter-symbols: Flutter design-system repo not found at ${FLUTTER_ROOT} (set FLUTTER_DS_ROOT to override). Skipping.`,
    );
    process.exit(0);
  }

  const motionDartSrc = readFileSync(MOTION_DART, "utf8");
  const dartFiles = readAllDartFiles(COMPONENTS_UI_DIR);
  const componentsSrc = dartFiles.map((f) => readFileSync(f, "utf8")).join("\n");

  const durationRe = (name) => new RegExp(`static const Duration ${name}\\b`);
  // Curves are declared as `Cubic` (a `Curve` subclass) or occasionally
  // `Curve` itself — match either concrete type.
  const curveRe = (name) => new RegExp(`static const (?:Cubic|Curve) ${name}\\b`);
  const classRe = (name) => new RegExp(`class ${name}\\b`);

  const entries = extractMotionNamesEntries();
  const seen = new Set();
  const missing = [];
  let checked = 0;
  let skipped = 0;

  for (const value of entries) {
    if (seen.has(value)) continue;
    seen.add(value);
    const { skip, symbols } = symbolsIn(value);
    if (skip) {
      skipped++;
      continue;
    }
    for (const sym of symbols) {
      checked++;
      let found = false;
      if (sym.kind === "duration") found = durationRe(sym.name).test(motionDartSrc);
      else if (sym.kind === "curve") found = curveRe(sym.name).test(motionDartSrc);
      else found = classRe(sym.name).test(componentsSrc);
      if (!found) missing.push({ value, ...sym });
    }
  }

  console.log(
    `verify-flutter-symbols: ${checked} symbol reference(s) checked, ${skipped} entries skipped (—).`,
  );

  if (missing.length > 0) {
    console.error(`verify-flutter-symbols: ${missing.length} missing symbol(s) that should exist:`);
    for (const m of missing) {
      console.error(`  ${m.kind} "${m.name}" (from flutter: "${m.value}") not found`);
    }
    process.exit(1);
  }

  console.log("verify-flutter-symbols: 0 missing. All asserted Flutter symbols exist.");
  process.exit(0);
}

main();
