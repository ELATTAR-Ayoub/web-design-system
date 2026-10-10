import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Design handoff — HTML/JS prototypes and their tooling, kept as reference
    // for the shader system. Not application source, so not linted.
    "Shader system for PULLS.XYZ/**",
    // Clone scratch: captured HTML and third-party minified bundles pulled down
    // while reverse-engineering a reference design. Linting a 460KB minified
    // vendor bundle produces a thousand warnings about someone else's code and
    // buries the ones about ours. Also git-ignored — none of it ships.
    "reference/**",
    "downloaded_assets/**",
    // `.tmp/` is a working scratchpad — throwaway helpers and screenshots.
    // It is not source and does not ship.
    //
    // `.tmp-site-backup/` used to be listed here too: a safety copy of the
    // deleted `site` family, kept in-repo because those files were untracked
    // and unrecoverable. It has been moved OUT of the repository, because a
    // directory full of old source that no guard scans is an exemption however
    // it is spelled — and this system's claim is that it has none.
    ".tmp/**",
    // Agent worktrees and agent scratch: other checkouts, not this one's source.
    ".claude/**",
    ".superpowers/**",
  ]),
]);

export default eslintConfig;
