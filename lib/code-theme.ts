/**
 * The one Shiki theme every highlighted code block uses — AI Elements'
 * `CodeBlock` and the code fences Streamdown renders inside a reply.
 *
 * It is Shiki's CSS-variables theme: instead of baking a palette into each
 * token, a token's colour is `var(--shiki-token-keyword)` and so on. Those
 * variables are declared once in styles/utilities.css ("Code highlighting")
 * and point at the system's eight `--code-*` roles, which differ per theme —
 * so one theme object serves light and dark, and code reads the same as the
 * Prism-highlighted `CodeBlock` in components/agent/parts.
 */

import { createCssVariablesTheme } from "shiki";

export const SYSTEM_CODE_THEME = createCssVariablesTheme({
  name: "elattar-code",
  variablePrefix: "--shiki-",
  fontStyle: true,
});
