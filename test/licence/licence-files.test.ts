import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

describe("licence files", () => {
  it("LICENSE is MIT, held by Ayoub Elattar", () => {
    const text = read("LICENSE");
    expect(text).toMatch(/^MIT License/);
    expect(text).toContain("Copyright (c) 2026 Ayoub Elattar");
  });

  it("package.json declares MIT", () => {
    expect(JSON.parse(read("package.json")).license).toBe("MIT");
  });

  it("THIRD_PARTY_NOTICES credits every vendored source", () => {
    const text = read("THIRD_PARTY_NOTICES.md");
    for (const credit of ["Copyright (c) 2023 shadcn", "Copyright 2023 Vercel, Inc.", "The Inter Project Authors", "basement.studio"]) {
      expect(text).toContain(credit);
    }
  });

  it("the self-hosted Inter ships with its OFL", () => {
    expect(existsSync(join(process.cwd(), "public/fonts/OFL.txt"))).toBe(true);
    expect(read("public/fonts/OFL.txt")).toContain("SIL OPEN FONT LICENSE Version 1.1");
  });

  it("AI Elements ships the full Apache-2.0 text beside its NOTICE", () => {
    expect(existsSync(join(process.cwd(), "components/ai-elements/LICENSE"))).toBe(true);
    expect(read("components/ai-elements/LICENSE")).toContain("TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION");
  });

  it("README no longer says no licence is granted", () => {
    expect(read("README.md")).not.toContain("no open-source license is granted");
  });
});
