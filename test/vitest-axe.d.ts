// vitest-axe@0.1.0's own type augmentation (imported via
// "vitest-axe/extend-expect") declares `toHaveNoViolations` against the
// pre-v3 `Vi.Assertion` global namespace, which Vitest 5's `expect` no
// longer reads — matcher types now merge onto the `vitest` module's own
// `Assertion` interface, the same surface `@testing-library/jest-dom/vitest`
// augments. Re-declare it here, matching that pattern, so the matcher
// registered at runtime in test/setup.ts (`expect.extend(matchers)`) is also
// visible to the type checker.
//
// This lives in its own ambient declaration file, rather than inside
// test/setup.ts, because tsconfig's `skipLibCheck` only exempts `.d.ts`
// files from the "all declarations of an interface must have identical type
// parameters" cross-check against `vitest`'s real internal `Assertion`
// shape — the same exemption jest-dom's own bundled `.d.ts` relies on.
import type { AxeMatchers } from "vitest-axe/matchers";

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type -- `<T = any>` must match jest-dom's own augmentation of this interface exactly (TS requires identical type parameters across all merged declarations), and the empty body is the merge itself.
  interface Assertion<T = any> extends AxeMatchers {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- the empty body is the merge itself.
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
