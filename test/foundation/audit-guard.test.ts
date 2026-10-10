/**
 * The per-capability audit guard, tested on itself.
 *
 * `docs/contracts/audit/` is the only source for ledger columns 2 to 7 — the
 * six dimensions no assertion in this repository can measure, because they are
 * a comparison against a Dart file in another checkout. That makes the audit
 * the one place where "done" is a claim rather than a measurement, and a claim
 * is only as good as what refuses to accept it.
 *
 * So this file does to `scripts/check-audit.mjs` what
 * `test/foundation/token-guard.test.ts` does to the token scanner, and for the
 * same reason: a guard nobody exercises is a guard nobody knows the state of.
 *
 *   1. every audit file on disk is currently valid;
 *   2. every way of faking one is REJECTED — a missing dimension, an invented
 *      verdict, evidence too thin to have come from reading the file, a
 *      placeholder word, a non-match with no explanation, a snapshot other
 *      than the pinned one;
 *   3. a genuine audit is ACCEPTED, including the three shapes that look wrong
 *      but are not — a web-only capability with no Flutter source, a deliberate
 *      platform difference, and a divergence that runs the other way with
 *      Flutter behind.
 *
 * Point 3 is the one that matters. A validator that rejects honest evidence is
 * a validator the next person routes around, and routing around it is
 * invisible until the ledger is lying again.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { DIMENSIONS, validateAudit } from "@/scripts/check-audit.mjs";

const SNAPSHOT = "7c17ecdd9eb1db1025aa47de224b67d81844b32c";
const AUDIT_DIR = join(process.cwd(), "docs/contracts/audit");

/** Long enough to clear the evidence floor, specific enough to be real. */
const FLUTTER_EVIDENCE =
  "AccordionItem takes `value`, `title`, `content`; AccordionController owns expansion.";
const WEB_EVIDENCE =
  "AccordionItem / AccordionTrigger / AccordionContent over Radix, `type=\"single\" | \"multiple\"`.";

function dimension(over: Record<string, unknown> = {}) {
  return { verdict: "match", flutter: FLUTTER_EVIDENCE, web: WEB_EVIDENCE, ...over };
}

function audit(over: Record<string, unknown> = {}) {
  return {
    name: "accordion",
    flutterSnapshot: SNAPSHOT,
    flutterSources: ["lib/src/components/ui/accordion.dart"],
    webSources: ["components/ui/accordion.tsx"],
    auditedAt: "2026-09-11",
    dimensions: Object.fromEntries(DIMENSIONS.map((d: string) => [d, dimension()])),
    ...over,
  };
}

const shared = { origin: "shared" };
const problemsFor = (a: unknown, row = shared) => validateAudit("accordion", a, row);

describe("the audit files on disk", () => {
  it("are all valid", () => {
    const files = readdirSync(AUDIT_DIR).filter((f) => f.endsWith(".json"));
    expect(files.length, "no audit files — wrong cwd?").toBeGreaterThan(0);
    const problems: string[] = [];
    for (const file of files) {
      const name = file.replace(/\.json$/, "");
      const raw = JSON.parse(readFileSync(join(AUDIT_DIR, file), "utf8"));
      // `origin` is derived from the file's own claim here rather than from the
      // contract: `scripts/check-audit.mjs` cross-checks the two, and this test
      // is about the validator's rules, not about the join.
      const row = { origin: raw.flutterSources?.length ? "shared" : "web-only" };
      problems.push(...validateAudit(name, raw, row));
    }
    expect(problems).toEqual([]);
  });
});

describe("a genuine audit is accepted", () => {
  it("passes a clean shared capability", () => {
    expect(problemsFor(audit())).toEqual([]);
  });

  it("passes a web-only capability with no Flutter source", () => {
    const a = audit({
      flutterSources: [],
      dimensions: Object.fromEntries(
        DIMENSIONS.map((d: string) => [
          d,
          dimension({
            verdict: "n/a",
            flutter:
              "Flutter has no counterpart: text direction is resolved by the framework's Directionality widget.",
            note: "A web platform concern with no Flutter item — `origin: \"web-only\"` in the contract.",
          }),
        ]),
      ),
    });
    expect(problemsFor(a, { origin: "web-only" })).toEqual([]);
  });

  it("passes a divergence that runs the other way, with Flutter behind", () => {
    const a = audit({
      dimensions: {
        ...audit().dimensions,
        api: dimension({
          verdict: "flutter-behind",
          note: "`type=\"multiple\"` has no counterpart: Flutter's Accordion opens one panel by index.",
        }),
      },
    });
    expect(problemsFor(a)).toEqual([]);
  });

  it("passes a deliberate platform difference that explains itself", () => {
    const a = audit({
      dimensions: {
        ...audit().dimensions,
        interaction: dimension({
          verdict: "platform-difference",
          note: "Radix owns roving focus and Escape dismissal; Flutter drives the same states through FocusNode.",
        }),
      },
    });
    expect(problemsFor(a)).toEqual([]);
  });
});

describe("the guard itself", () => {
  it("rejects a missing dimension", () => {
    const dims = audit().dimensions;
    delete (dims as Record<string, unknown>).semantics;
    expect(problemsFor(audit({ dimensions: dims })).join(" ")).toContain('missing dimension "semantics"');
  });

  it("rejects an invented verdict", () => {
    const a = audit({
      dimensions: { ...audit().dimensions, api: dimension({ verdict: "probably-fine", note: FLUTTER_EVIDENCE }) },
    });
    expect(problemsFor(a).join(" ")).toContain('verdict "probably-fine"');
  });

  it("rejects evidence too thin to have come from reading the source", () => {
    const a = audit({
      dimensions: { ...audit().dimensions, anatomy: dimension({ flutter: "same parts" }) },
    });
    expect(problemsFor(a).join(" ")).toContain("no flutter evidence");
  });

  // The failure mode this whole file exists for: a row that LOOKS filled in.
  it.each(["verified", "checked", "matches", "N/A", "TBD", "ok"])(
    "rejects the placeholder %s",
    (word) => {
      const a = audit({
        dimensions: {
          ...audit().dimensions,
          states: dimension({ web: `${word}                                            ` }),
        },
      });
      expect(problemsFor(a).join(" ")).toMatch(/placeholder web evidence|no web evidence/);
    },
  );

  it("rejects a non-match with no explanation", () => {
    const a = audit({
      dimensions: { ...audit().dimensions, disabled: dimension({ verdict: "gap" }) },
    });
    expect(problemsFor(a).join(" ")).toContain('is "gap" without a note');
  });

  it("rejects an audit taken against a different Flutter snapshot", () => {
    expect(problemsFor(audit({ flutterSnapshot: "0".repeat(40) })).join(" ")).toContain(
      "not the pinned",
    );
  });

  it("rejects a shared capability that names no Flutter source", () => {
    expect(problemsFor(audit({ flutterSources: [] })).join(" ")).toContain(
      "names no Flutter source",
    );
  });

  it("rejects a web-only capability that claims one", () => {
    expect(problemsFor(audit(), { origin: "web-only" }).join(" ")).toContain(
      "web-only but names a Flutter source",
    );
  });

  it("rejects an audit that names no web source", () => {
    expect(problemsFor(audit({ webSources: [] })).join(" ")).toContain("names no web source");
  });

  it("rejects a file whose name disagrees with its contents", () => {
    expect(problemsFor(audit({ name: "button" })).join(" ")).toContain('declares name "button"');
  });
});
