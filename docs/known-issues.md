# Known issues

Things that are known, were looked at, and are deliberately left as they are.
Each entry says what it is, what the exposure is and why it was accepted.

## Dependency advisories (`npm audit --omit=dev`)

Accepted by the owner on 2026-10-10. `npm audit --omit=dev` reports 9
vulnerabilities: 2 high and 7 low.

### High: linkify-it (2)

- Advisories: GHSA-22p9-wv53-3rq4 and GHSA-v245-v573-v5vm, both regular-expression
  denial of service in `linkify-it` (quadratic scan loop).
- Reached through `ansi-to-react@6.2.6`, which the AI Terminal output component
  uses to colour ANSI escape sequences.
- It runs client-side only. There is no server path that processes this text.
- There is no patched release of `ansi-to-react`: 6.2.6 is the latest. `npm audit fix --force`
  would move to the older 6.1.6, which does not depend on `linkify-it`; that
  downgrade and replacing the package are not being done.
- Exposure: very large or crafted terminal output makes the viewer's own browser
  tab slow or unresponsive. It does not leak data or run code.

### Low: katex, mermaid and remark-math (7)

- The cluster is `katex`, `rehype-katex`, `remark-math`, `micromark-extension-math`,
  `mermaid`, `@streamdown/math` and `@streamdown/mermaid`.
- It comes in through the Streamdown markdown renderer used for assistant replies.
- `npm audit` reports no fix available.
