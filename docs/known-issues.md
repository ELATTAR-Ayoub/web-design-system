# Known issues

Things that are known, were looked at, and are deliberately left as they are.
Each entry says what it is, what the exposure is and why it was accepted.

## Dependency advisories (`npm audit --omit=dev`)

Accepted by the owner on 2026-10-10. `npm audit --omit=dev` reports 7
vulnerabilities, all low.

The two high `linkify-it` advisories reported earlier are gone: the AI Terminal
now renders its output with the system's own `TerminalText`
(`lib/terminal-text.tsx`), and `ansi-to-react`, `anser`, `escape-carriage` and
`linkify-it` are no longer dependencies. Its link finder scans forward once
and never backtracks, and a test runs it on hostile input.

### Low: katex, mermaid and remark-math (7)

- The cluster is `katex`, `rehype-katex`, `remark-math`, `micromark-extension-math`,
  `mermaid`, `@streamdown/math` and `@streamdown/mermaid`.
- It comes in through the Streamdown markdown renderer used for assistant replies.
- `npm audit` reports no fix available.
