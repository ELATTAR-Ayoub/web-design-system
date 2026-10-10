/**
 * No control bytes in source. A byte you cannot see is a bug you cannot read.
 *
 * This has shipped twice, both times from a tool writing a file rather than
 * from anyone typing one:
 *
 *   1. A literal backspace (0x08) landed in `test/docs/component-pages.test.tsx`
 *      and survived several rewrites, because every editor and every diff
 *      rendered the line as if it were correct.
 *   2. A NUL (0x00) replaced the space in `ids.join(" ")` in the documentation
 *      outline. `tsc` passed — a NUL is a legal character inside a string
 *      literal — and the only symptom was `grep` reporting the file as binary,
 *      which is not something anyone is watching for.
 *
 * Both were found by accident. The failure mode is the same in each case: the
 * compiler is happy, the tests are happy, the reviewer sees normal code, and
 * the behaviour is subtly wrong — a scroll-spy keyed on a string that can never
 * match, a test file that cannot be edited by string replacement.
 *
 * TAB, NEWLINE AND CARRIAGE RETURN ARE THE ONLY CONTROL BYTES THAT BELONG IN
 * SOURCE. Everything else in the C0 range is rejected here, with the file, the
 * line and the byte named, because "there is a bad character somewhere" is not
 * actionable.
 *
 * Carriage return is allowed because a checkout on Windows carries CRLF, and
 * rejecting it would fail this test for everyone on this machine for a reason
 * that has nothing to do with what it is looking for.
 *
 * THIS FILE WRITES NO CONTROL BYTE OF ITS OWN. The pattern is spelled with
 * `\x` escapes and the probes below build their bad characters with
 * `String.fromCharCode`, so the guard does not trip on itself — which the first
 * draft of it did.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

/** Directories with no authored source in them. */
const SKIP = new Set([
  "node_modules",
  ".next",
  ".git",
  ".tmp",
  "build",
  "out",
  "coverage",
  "test-results",
  "playwright-report",
  "reference",
  "downloaded_assets",
]);

const EXTENSIONS = [".ts", ".tsx", ".mjs", ".js", ".css", ".json", ".md"];

const FORBIDDEN = /[\x00-\x08\x0b\x0c\x0e-\x1f]/;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".claude") continue;
    if (SKIP.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXTENSIONS.some((ext) => entry.name.endsWith(ext))) out.push(full);
  }
  return out;
}

describe("source bytes", () => {
  it("contains no control characters outside tab, newline and carriage return", () => {
    const files = walk(ROOT);
    expect(files.length, "scanned nothing — wrong cwd?").toBeGreaterThan(100);

    const findings: string[] = [];
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      if (!FORBIDDEN.test(source)) continue;
      source.split("\n").forEach((line, index) => {
        const at = line.search(FORBIDDEN);
        if (at === -1) return;
        const byte = line.charCodeAt(at).toString(16).padStart(2, "0");
        findings.push(`${relative(ROOT, file)}:${index + 1}:${at + 1} — 0x${byte}`);
      });
    }

    expect(findings).toEqual([]);
  });

  it("rejects a line carrying one", () => {
    // The guard, exercised. A rule nobody has seen fail is a rule nobody knows
    // the state of. These are the two bytes that actually shipped.
    const NUL = String.fromCharCode(0x00);
    const BACKSPACE = String.fromCharCode(0x08);
    expect(FORBIDDEN.test(`ids.join("${NUL}")`)).toBe(true);
    expect(FORBIDDEN.test(`const a = 1;${BACKSPACE}`)).toBe(true);
  });

  it("accepts ordinary source, including tabs and CRLF", () => {
    expect(FORBIDDEN.test('const key = ids.join(",");\r\n\tconst a = 1;\n')).toBe(false);
  });
});
