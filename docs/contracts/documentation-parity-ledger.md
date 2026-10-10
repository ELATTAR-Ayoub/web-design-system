# Documentation parity ledger

**Flutter authority:** `0.0.3` / `7c17ecdd9eb1db1025aa47de224b67d81844b32c`
**Evidence collected:** 2026-10-10T14:54:43.977Z
**Regenerate:** `node scripts/build-docs-ledger.mjs`

A different question from `component-convergence-ledger.md`. That one asks
whether the web COMPONENT matches Flutter 0.0.3. This one asks whether the web
PAGE does: the shell it renders in, where it sits in the rail, what its outline
says, whether the opening specimen is real, whether every showcase offers its
source, whether the installation instruction is true, and whether a person has
actually looked at it.

**No row is complete from route existence alone.** That is the failure this
table is built against: a hundred generated shells, every route resolving,
`docs:validate` green, and not one page a reader would call documented.

## Where each column comes from

Columns 3, 4, 5, 7, 8, 9 and 14 are **measured in a browser** by
`e2e/ledger-evidence.spec.ts`, which opens every route and records the shell as
it actually rendered — the header's four destinations, the appearance control's
three options, the breadcrumb, the derived eyebrow, the rail's six groups and
which row is selected, how many live specimens the page has and how many offer a
Code view, the first stage's height and contents, and which of the three
responsive shapes appear at 375, 768, 1100, 1440 and 1920.

Columns 6, 10, 11, 12, 13 and 15 are read from the page's own spec. Column 1 is
whether a per-capability audit file exists for it.

Column 16, **visual review, is not derived and cannot be.** "Does this page look
right in light mode at 1440" is not a measurement. It is recorded in
`docs/contracts/docs-visual-review.json`, one entry per route naming what was
looked at. A route with no entry reads `—`.

## Status

- **149** documented capabilities.
- **148** render all three responsive shapes correctly — article alone below `lg`, left rail plus anchor strip from `lg` to `xl`, both rails above `xl`.
- **96** carry a recorded visual review.
- **0** rows are ✅ on every column.

| | |
|---|---|
| ✅ | Measured, or declared and present. |
| ◐ | Partly — the page has the thing but not in the shape the contract asks for. |
| — | Absent, or never looked at. |

## Columns

1. Flutter route reviewed
2. Web route
3. Shell / header
4. Left-rail placement
5. Right-rail / TOC
6. Section map
7. First preview
8. All Preview/Code controls
9. Installation modes
10. API coverage
11. States
12. Accessibility
13. Keyboard
14. Responsive / RTL / theme / motion
15. Source and tests
16. Visual review

| Item | Family | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
| --- | --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `accordion` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `action-feedback` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | ✅ | ✅ | N/A | ✅ | ✅ | ✅ |
| `active-indicator` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `agent-avatar` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | ✅ | ✅ | ✅ |
| `agent-core` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | ✅ | ✅ | ✅ |
| `agent-effort-slider` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `agent-generated-image` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `agent-spark-field` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `agent-voice-orb` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `agent-workspace` | agent | ✅ | ✅ | ✅ | ◐ | ◐ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-agent` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-artifact` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-attachments` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-audio-player` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-canvas` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-chain-of-thought` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-checkpoint` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-code-block` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-commit` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-confirmation` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-connection` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-context` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-controls` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-conversation` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-edge` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-environment-variables` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-file-tree` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-image` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-inline-citation` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-jsx-preview` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-message` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-mic-selector` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-model-selector` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-node` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-open-in-chat` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-package-info` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-panel` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-plan` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-prompt-input` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-question` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-queue` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-reasoning` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-sandbox` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-schema-display` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-shimmer` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-snippet` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-sources` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-speech-input` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-stack-trace` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-suggestion` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-task` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-terminal` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-test-results` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-tool` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-toolbar` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-transcription` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-voice-selector` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `ai-web-preview` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `alert` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `alert-dialog` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `ambient-pattern` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
| `aspect-ratio` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `attachment` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `avatar` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `background-effect` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
| `badge` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `breadcrumb` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `bubble` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `button` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `button-group` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `calendar` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `card` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `carousel` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `chart` | charts | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `chart-cartesian` | charts | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `chart-geometry` | charts | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `chart-polar` | charts | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `checkbox` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `collapsible` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `combobox` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `command` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `content-change` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | N/A | ✅ | ✅ | ✅ |
| `context-menu` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `dialog` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `direction` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
| `disabled` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `drawer` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `dropdown-menu` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `empty` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | ✅ | ✅ | ✅ |
| `feedback-surface` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
| `field` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `form` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `glass` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
| `hover-builder` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
| `hover-card` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `icon` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `icon-swap` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `input` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `input-group` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `input-otp` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `item` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `kbd` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
| `keyframes` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
| `label` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `marker` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `media-scrim` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
| `menu` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | ✅ | ✅ | ✅ | ✅ |
| `menubar` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `message` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
| `message-scroller` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `native-select` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `navigation-menu` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `pagination` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `popover` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `premium-surface` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | N/A | — | ✅ | N/A | ✅ | ✅ | ✅ |
| `press` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `progress` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | ✅ | ✅ | ✅ |
| `prose` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | N/A | ✅ | ✅ | ✅ |
| `questionnaire` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `radio` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `resizable` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `reveal-bloom` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
| `safe-area` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
| `scroll-area` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `select` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `selection-control` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
| `separator` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `sheet` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `sidebar` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `skeleton` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | ✅ | ✅ | ✅ |
| `slider` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `source-foundation` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | N/A | N/A | ✅ | N/A | N/A | N/A | N/A | ✅ | ✅ | ✅ |
| `spinner` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | ✅ | ✅ | ✅ |
| `stat` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `surface` | effects | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
| `switch` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `table` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `tabs` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `textarea` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `toaster` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `toggle` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `toggle-group` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `tooltip` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `use-latest` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | ✅ | ✅ | ✅ |
| `use-mobile` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | ✅ | ✅ | ✅ |
| `use-reduced-motion` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | ✅ | ✅ | ✅ |
| `user-menu` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| `validation-rule` | components | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | N/A | N/A | ✅ | N/A | N/A | N/A | N/A | ✅ | ✅ | ✅ |
| `voice` | agent | ✅ | ✅ | ✅ | ◐ | ✅ | ✅ | N/A | ✅ | ✅ | ✅ | N/A | ✅ | N/A | ✅ | ✅ | ✅ |
