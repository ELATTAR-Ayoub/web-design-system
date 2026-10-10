/**
 * Authored documentation page for `ai-code-block`.
 *
 * Specimens live in `code-block-specimen.tsx` (a spec module cannot carry
 * `"use client"`, and the examples hold state).
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { CodeBlockExamples, CodeBlockPreview, CodeBlockStateGrid } from "./code-block-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-code-block",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A syntax-highlighted block with a filename and a copy button. Switch the theme and the colours follow.",
      label: "CodeBlock",
      render: <CodeBlockPreview />,
      source: `import {
  CodeBlock, CodeBlockActions, CodeBlockCopyButton, CodeBlockFilename, CodeBlockHeader, CodeBlockTitle,
} from "@/components/ai-elements/code-block";

<CodeBlock code={source} language="typescript">
  <CodeBlockHeader>
    <CodeBlockTitle>
      <CodeBlockFilename>price.ts</CodeBlockFilename>
    </CodeBlockTitle>
    <CodeBlockActions>
      <CodeBlockCopyButton />
    </CodeBlockActions>
  </CodeBlockHeader>
</CodeBlock>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It highlights with <code className="type-code">shiki</code> through <code className="type-code">lib/code-theme.ts</code>, and its colour aliases are declared in <code className="type-code">styles/tokens.css</code>.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "CodeBlock takes the code and a Shiki language name. Children (header, title, actions) render above the code, and CodeBlockCopyButton copies the same code string through context. showLineNumbers adds a CSS-counter gutter that is not selectable. Highlighting runs after the first paint: the block shows the code uncoloured immediately, then recolours when Shiki has loaded the grammar, and a result already cached for the same code and language is applied straight away.",
      language: "tsx",
      code: `import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block";

<CodeBlock className="border-0" code={output.code} language="tsx" showLineNumbers>
  <CodeBlockCopyButton className="absolute top-2 right-2" size="icon-sm" onCopy={() => toast.success("Copied")} />
</CodeBlock>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The block itself is static; its states are the highlighting phase and the copy button.",
      blocks: [
        { body: <CodeBlockStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: highlighted code in a bordered, rounded block. <strong>hover</strong>, <strong>focus-visible</strong>, <strong>pressed</strong> and <strong>disabled</strong>: inherited from the ghost icon Button of the copy action and from Select for the language trigger; the code area has none. <strong>loading</strong>: the first paint is the raw, uncoloured code (foreground colour, same text), and it recolours when Shiki settles; the block is never blank while waiting. <strong>success</strong>: the copy button swaps to a check for <code className="type-code">timeout</code> ms. <strong>error</strong>: if the clipboard is unavailable or refuses, <code className="type-code">onError</code> is called; if Shiki fails to load a grammar the failure is logged and the block stays on the uncoloured text. An unknown language falls back to plain text. <strong>empty</strong>: an empty string renders one blank line.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description: "A language selector in the header drives the code and the grammar together.",
      label: "Examples",
      render: <CodeBlockExamples />,
    },
    {
      kind: "disclosure",
      id: "theme",
      title: "Highlighting and the code roles",
      description: "One Shiki theme, on the system's eight --code-* roles.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "One theme", v: 'lib/code-theme.ts builds a single Shiki CSS-variables theme, "elattar-code", with the prefix --shiki-. A token\'s colour is the string var(--shiki-token-keyword) rather than a baked-in hex, so one theme serves light and dark and there is no theme-pair switching.' },
                { k: "Aliases", v: "styles/tokens.css declares the --shiki-* variables on :root, each pointing at a --code-* role: keyword is --code-keyword, string and link --code-string, comment --code-comment, function --code-function, constant --code-number, punctuation --code-punctuation, parameter --code-variable. Inserted, deleted and changed lines use the success, error and warning inks; the ANSI names match the terminal's mapping." },
                { k: "The roles", v: "Each --code-* role is an -ink colour (keyword action, string success, function info, number value, type warning, variable error, comment muted, punctuation foreground), so code stays readable in both themes and reads the same as the Prism-highlighted code block in the agent family." },
                { k: "Cached results", v: "highlightCode now calls the callback even when the result was already cached. Highlighting settles in a microtask, so it is usually done before the component's effect subscribes; the earlier behaviour returned the cache without calling back, and the block stayed on its uncoloured first paint for good." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/code-block.tsx.",
      blocks: [
        {
          label: "CodeBlock",
          body: (
            <Meta
              items={[
                { k: "code", v: "string, required." },
                { k: "language", v: "Shiki BundledLanguage, required — also written to data-language on the container." },
                { k: "showLineNumbers?", v: "boolean, default false." },
                { k: "children?", v: "ReactNode — rendered above the code (header, floating copy button)." },
                { k: "className?", v: "string, plus any div props; merged onto the container." },
              ]}
            />
          ),
        },
        {
          label: "CodeBlockContainer, CodeBlockContent",
          body: (
            <Meta
              items={[
                { k: "CodeBlockContainer language", v: "string, required, plus div props. The bordered rounded shell; content-visibility auto, so off-screen blocks skip layout." },
                { k: "CodeBlockContent code, language, showLineNumbers?", v: "The scrollable highlighted body, for composing without CodeBlock." },
              ]}
            />
          ),
        },
        {
          label: "CodeBlockHeader, CodeBlockTitle, CodeBlockFilename, CodeBlockActions",
          body: (
            <Meta
              items={[
                { k: "CodeBlockHeader", v: "div props; a bordered, muted row, justify-between." },
                { k: "CodeBlockTitle", v: "div props; groups the filename or the language selector." },
                { k: "CodeBlockFilename", v: "span props; the identifier type role." },
                { k: "CodeBlockActions", v: "div props; groups the buttons with a negative margin so the 40px buttons fit the compact row." },
              ]}
            />
          ),
        },
        {
          label: "CodeBlockCopyButton",
          body: (
            <Meta
              items={[
                { k: "onCopy?", v: "() => void." },
                { k: "onError?", v: "(error: Error) => void — no Clipboard API or the write failed." },
                { k: "timeout?", v: "number, default 2000." },
                { k: "aria-label?", v: 'string — default "Copy code", "Copied" after a copy.' },
                { k: "…Button props", v: 'A ghost icon Button (40px); children replace the glyph. Copies the code passed to the enclosing CodeBlock.' },
              ]}
            />
          ),
        },
        {
          label: "CodeBlockLanguageSelector parts",
          body: (
            <Meta
              items={[
                { k: "CodeBlockLanguageSelector", v: "Select props (value, onValueChange, …)." },
                { k: "…Trigger", v: "SelectTrigger props; small, borderless and transparent so it sits in the header." },
                { k: "…Value, …Content, …Item", v: "SelectValue, SelectContent (align defaults to end) and SelectItem props." },
              ]}
            />
          ),
        },
        {
          label: "highlightCode",
          body: (
            <Meta
              items={[
                { k: "highlightCode(code, language, callback?)", v: "Returns the cached tokens or null. When a callback is given it is called with the result as soon as it exists — immediately if cached, otherwise when Shiki settles. Exported for tests and for hosts that pre-warm a block." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description: "Real text in a pre, with a named copy button.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Structure", v: "The code is real text in pre and code, so it is selectable, searchable and read in order. Highlight colours are decoration; nothing depends on them." },
                { k: "Accessible names", v: 'The copy button is icon-only with an aria-label ("Copy code", then "Copied") and a matching title. The language selector trigger has no visible label of its own — give it an aria-label.' },
                { k: "Keyboard", v: "Tab reaches the copy button and the selector; Enter or Space activates, and the selector follows Radix Select. A long line scrolls inside the block, which is reachable by pointer; there is no tabindex on the scroll area." },
                { k: "Target size", v: "The copy button is the 40px icon size. The workspace passes icon-sm (32px) for a copy button floating in a block's corner, which RULES allows only beside other small controls." },
                { k: "Contrast", v: "Token colours are -ink roles, tuned per theme for text contrast on the background." },
                { k: "Motion and reduced motion", v: "The only motion is the copy glyph swap, which the blanket prefers-reduced-motion rule collapses." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why",
      title: "Why this exists",
      blocks: [
        {
          body: (
            <Note tone="action">
              Anything an agent shows as code needs highlighting that follows the theme and a way to copy it. The AgentWorkspace uses this component for sandbox code and output tabs, and for file content with line numbers (<code className="type-code">components/agent/workspace/workspace-outputs.tsx</code>, with a corner copy button that toasts), and Tool uses it to print parameters and results as JSON (<code className="type-code">ai-tool</code>). Vendored changes: upstream&apos;s GitHub light and dark theme pair became the one CSS-variables theme described above, so there is no dark-mode override class; the cached-result callback fix; the line-number gutter and the type roles use the system&apos;s code role; the copy glyph swap uses IconSwap with the success tone; and a ref read during render became the sanctioned state-reset pattern.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [{ body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> }],
    },
  ],
};
