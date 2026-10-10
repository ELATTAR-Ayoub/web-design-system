/**
 * The zero-hardcoding guard, tested on itself.
 *
 * This is the web counterpart of Flutter's `test/token_guard_test.dart`, and it
 * exists for the same reason that file gives: **a guard nobody exercises is a
 * guard nobody knows the state of.** `npm run check:tokens` passing tells you
 * the repository is clean. It does not tell you the guard would still catch
 * anything — a rule whose regex was broken by an innocent edit reports a clean
 * scan forever, and the first symptom is a hex colour shipping.
 *
 * So the shape is Flutter's:
 *
 *   1. the repository is clean;
 *   2. every declared rule FIRES on a sample that breaks it;
 *   3. the sanctioned spelling of the same thing does NOT fire.
 *
 * Point 3 matters more than point 2. A rule that cries wolf is a rule the next
 * person deletes, and deleting it is invisible until something ships. Flutter's
 * own file makes the same argument about `MotionCurves` versus `Curves.` — the
 * rule has to catch the stock spelling without catching the token that replaces
 * it.
 *
 * ONE DIFFERENCE FROM FLUTTER, DELIBERATE. Flutter's guard keeps an
 * `_exemptDirs` list and argues each entry. The web guard's equivalent is the
 * four `styles/*.css` files, and it has NO per-line escape hatch at all: the
 * `allow-hardcoded` marker was removed along with all four of its uses, each of
 * which turned out to be fixable. The last test here is what stops it coming
 * back.
 */

import { describe, expect, it } from "vitest";

import { RULE_IDS, scanRepository, scanSource } from "@/scripts/check-tokens.mjs";

/** A path that is neither vendored nor a definition file, so every rule applies. */
const PROBE = "components/ui/probe.tsx";

const ruleIdsFor = (source: string): string[] =>
  scanSource(PROBE, source).map((f: { rule: string }) => f.rule);

describe("the repository is clean", () => {
  it("finds no hardcoded value anywhere it scans", () => {
    const { findings, scanned } = scanRepository();
    expect(scanned, "guard scanned nothing — wrong cwd?").toBeGreaterThan(0);
    expect(
      findings.map((f: { file: string; line: number; rule: string }) =>
        `${f.file}:${f.line} [${f.rule}]`,
      ),
    ).toEqual([]);
  });
});

describe("the guard itself", () => {
  /**
   * One sample per rule that MUST trip it.
   *
   * Every id in `RULE_IDS` needs an entry, and the exhaustiveness test below
   * fails if a rule is added without one — which is the point: a new rule with
   * no proof it fires is the same as no rule.
   */
  const SAMPLES: Record<string, string> = {
    "hex-colour": 'const c = "#92C2FC";',
    "rgb-colour": "const c = `rgba(12, 34, 56, 0.4)`;",
    "arbitrary-font-size": '<p className="text-[13px]" />',
    "raw-mono-utility": '<code className="font-mono" />',
    "arbitrary-tracking": '<h1 className="tracking-[0.1em]" />',
    "composed-typography": '<p className="type-small font-semibold" />',
    "arbitrary-duration": '<div className="duration-[220ms]" />',
    "arbitrary-radius": '<div className="rounded-[14px]" />',
    "stock-palette": '<div className="bg-slate-500" />',
    "literal-bw": '<div className="bg-white" />',
    "state-colour-as-text": "color: var(--destructive)",
    "stock-duration": '<div className="duration-300" />',
    "arbitrary-easing": '<div className="ease-[cubic-bezier(0.1,0.2,0.3,0.4)]" />',
    "arbitrary-ring": '<div className="ring-[3px]" />',
    "arbitrary-spacing": '<div className="p-[17px]" />',
    "sub-pixel-spacing": '<div className="translate-y-[--spacing(0.45)]" />',
    "arbitrary-shadow": '<div className="shadow-[0_1px_2px_rgba(0,0,0,.2)]" />',
    // `animate-in` / `animate-out` are tw-animate-css and deliberately allowed;
    // a stock Tailwind animation is not.
    "foreign-animation": '<div className="animate-bounce" />',
  };

  it("declares a sample for every rule it ships", () => {
    // Fails in both directions on purpose: a rule with no sample, and a sample
    // for a rule that no longer exists.
    expect([...RULE_IDS].sort()).toEqual(Object.keys(SAMPLES).sort());
  });

  it.each(Object.entries(SAMPLES))("rule %s fires", (id, sample) => {
    expect(ruleIdsFor(sample), `rule "${id}" did not fire on: ${sample}`).toContain(id);
  });
});

describe("the sanctioned spelling is not a violation", () => {
  // The other half, and the half that keeps the guard alive: each of these is
  // the thing the rule above exists to push callers TOWARDS. If one of them
  // trips, the rule is unusable and somebody will delete it.
  it.each([
    ["a colour token", '<div className="bg-action text-action-ink" />'],
    ["a type role", '<p className="type-body" />'],
    ["a token font size", '<p className="text-small" />'],
    ["a numeric role instead of font-mono", '<span className="type-number-base" />'],
    ["a tracking token", '<h1 className="tracking-tight" />'],
    ["a duration token", '<div className="duration-fast" />'],
    ["an easing token", '<div className="ease-standard" />'],
    ["a radius token", '<div className="rounded-pill" />'],
    ["a spacing step", '<div className="p-4" />'],
    ["a shadow token", '<div className="shadow-pressed" />'],
    ["a system animation utility", '<div className="anim-enter" />'],
    ["animation switched off", '<div className="animate-none" />'],
    ["a derived spacing helper", '<div className="p-[--spacing(4)]" />'],
    ["an ink foreground on text", "color: var(--color-destructive-ink)"],
    ["a var() in a CSS declaration", "border-radius: var(--radius-lg);"],
  ])("%s passes", (_label, sample) => {
    expect(ruleIdsFor(sample)).toEqual([]);
  });

  it("does not read prose as a use", () => {
    // A comment naming a forbidden value is documentation, not a violation —
    // otherwise no file could explain its own rule.
    expect(ruleIdsFor('// never write text-[13px] or #ffffff by hand')).toEqual([]);
  });

  it("allows a derived arbitrary value", () => {
    // `calc()` off a token moves with the scale, so it is not a value invented
    // at the call site.
    expect(ruleIdsFor('<div className="rounded-[calc(var(--radius)-3px)]" />')).toEqual([]);
  });
});

describe("there is no escape hatch", () => {
  /**
   * The marker used to suppress a finding on the line it appeared on. It was
   * removed because all four of its uses turned out to be fixable — it was not
   * protecting genuine exceptions, it was where the unfixed ones went to stop
   * being visible.
   */
  it("ignores the marker that used to suppress a finding", () => {
    const suppressed = 'const c = "#92C2FC"; // allow-hardcoded: a very good reason';
    expect(
      ruleIdsFor(suppressed),
      "a suppression marker must not save a real violation",
    ).toContain("hex-colour");
  });

  it("ignores the marker in the comment block above a finding", () => {
    const source = [
      "// allow-hardcoded: this reason spans a block, as the old marker allowed",
      'const c = "#92C2FC";',
    ].join("\n");
    expect(ruleIdsFor(source)).toContain("hex-colour");
  });

  it("exempts the four definition stylesheets, and nothing else", () => {
    const literal = "color: #92C2FC;";
    // A definition file is where the value lives.
    expect(scanSource("styles\\tokens.css", literal)).toEqual([]);
    expect(scanSource("styles\\typeset.css", literal)).toEqual([]);
    expect(scanSource("styles\\motion.css", literal)).toEqual([]);
    expect(scanSource("styles\\utilities.css", literal)).toEqual([]);
    // Anything else consuming one is not.
    expect(ruleIdsFor(literal)).toContain("hex-colour");
    expect(scanSource("app\\design-system\\page.tsx", literal).length).toBeGreaterThan(0);
  });
});
