/**
 * Authored documentation page for `ai-terminal`.
 *
 * Specimens live in `terminal-specimen.tsx` (a spec module cannot carry
 * `"use client"`, and the preview holds state).
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { TerminalExamples, TerminalPreview, TerminalStateGrid } from "./terminal-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-terminal",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A command's output with its ANSI colours. Copy it, or clear it with the trash button.",
      label: "Terminal",
      render: <TerminalPreview />,
      source: `import { Terminal } from "@/components/ai-elements/terminal";

<Terminal
  output={"\\u001b[36m$\\u001b[0m npm run build\\n\\u001b[32m✓\\u001b[0m compiled 148 modules"}
  onClear={() => setOutput("")}
/>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It renders ANSI with the system&apos;s own <code className="type-code">TerminalText</code> (<code className="type-code">lib/terminal-text.tsx</code>), and its colours come from the <code className="type-code">terminal-colors</code> utility in <code className="type-code">styles/utilities.css</code>, which ships with the stylesheet.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Terminal takes the whole output as one string and draws a default layout (title, status, copy, and clear when onClear is given) with no children. Pass children to compose your own header and content from TerminalHeader, TerminalTitle, TerminalStatus, TerminalActions, TerminalCopyButton, TerminalClearButton and TerminalContent; they read output, isStreaming and onClear from the root's context. For a command still running, grow the output string and set isStreaming. autoScroll (default true) keeps the newest line in view.",
      language: "tsx",
      code: `import {
  Terminal, TerminalActions, TerminalContent, TerminalCopyButton, TerminalHeader, TerminalTitle,
} from "@/components/ai-elements/terminal";

<Terminal output={output} isStreaming={running} autoScroll>
  <TerminalHeader>
    <TerminalTitle>build.sh</TerminalTitle>
    <TerminalActions>
      <TerminalCopyButton />
    </TerminalActions>
  </TerminalHeader>
  <TerminalContent />
</Terminal>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "ANSI colour is not a state of the component but of the output; the component's own states are streaming, empty and the buttons.",
      blocks: [
        { body: <TerminalStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: header, output, copy. <strong>hover</strong>, <strong>focus-visible</strong>, <strong>pressed</strong> and <strong>disabled</strong>: inherited from the ghost icon Buttons (copy and clear); the output area itself has no hover or press. <strong>loading</strong>: <code className="type-code">isStreaming</code> adds a blinking caret after the last line (<code className="type-code">anim-caret</code>, the same blink as the OTP caret) and lets TerminalStatus render; without it TerminalStatus returns null. <strong>success</strong>: the copy button swaps to a check for <code className="type-code">timeout</code> ms (default 2000). <strong>error</strong>: a failed command is not a component state — the exit code and error text arrive as red ANSI in the output, which <code className="type-code">terminal-colors</code> maps to the error ink; a failed clipboard write calls <code className="type-code">onError</code>. <strong>empty</strong>: an empty output string draws the header and a blank content area; the clear button only exists while <code className="type-code">onClear</code> is set.
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
      description: "A composed header with a custom title and both actions.",
      label: "Examples",
      render: <TerminalExamples />,
    },
    {
      kind: "disclosure",
      id: "ansi",
      title: "ANSI colours",
      description: "How escape codes become colours that follow the theme.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "TerminalText", v: "The output goes through TerminalText, so a coloured span carries a class such as term-fg-red or term-bold and no inline colour — an inline colour ignores the theme. It also applies carriage returns, backspaces and erase-line, so a progress bar redraws in place, and strips every other control sequence." },
                { k: "terminal-colors", v: "The utility on the content area resolves those classes. Foregrounds are -ink roles: red is destructive, green success, yellow warning, blue action, magenta value, cyan info, white the foreground, black the muted foreground. Bright variants share their base role." },
                { k: "Backgrounds", v: "The same hues as a 20 percent tint (black is the muted surface, white the secondary)." },
                { k: "Decorations", v: "bold, dim, italic, underline, strikethrough and hidden map to weight 600, the muted foreground, italic, underline, line-through and visibility." },
                { k: "256-colour and truecolor", v: "These carry a class but no colour and fall back to the terminal's own foreground." },
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
      description: "Read from components/ai-elements/terminal.tsx.",
      blocks: [
        {
          label: "Terminal",
          body: (
            <Meta
              items={[
                { k: "output", v: "string, required — the full text, ANSI escapes included." },
                { k: "isStreaming?", v: "boolean, default false — shows the caret and TerminalStatus." },
                { k: "autoScroll?", v: "boolean, default true — scrolls the content to the bottom whenever output changes." },
                { k: "onClear?", v: "() => void — when set, the default layout shows the clear button and TerminalClearButton renders." },
                { k: "children?", v: "ReactNode — replaces the default layout." },
                { k: "className?", v: "string, plus any div props." },
              ]}
            />
          ),
        },
        {
          label: "TerminalHeader, TerminalTitle, TerminalStatus, TerminalActions",
          body: (
            <Meta
              items={[
                { k: "TerminalHeader", v: "div props; a bordered row, justify-between." },
                { k: "TerminalTitle", v: 'div props; a terminal glyph and children, default "Terminal".' },
                { k: "TerminalStatus", v: "div props; renders its children only while isStreaming, otherwise null." },
                { k: "TerminalActions", v: "div props; a row with a small gap for the buttons." },
              ]}
            />
          ),
        },
        {
          label: "TerminalCopyButton",
          body: (
            <Meta
              items={[
                { k: "onCopy?", v: "() => void — after the output is on the clipboard." },
                { k: "onError?", v: "(error: Error) => void — no Clipboard API, or the write was refused." },
                { k: "timeout?", v: "number, default 2000 — how long the check stays." },
                { k: "aria-label?", v: 'string — default "Copy output", "Copied" after a copy.' },
                { k: "…Button props", v: 'Rendered as a ghost icon-sm Button; children replace the glyph.' },
              ]}
            />
          ),
        },
        {
          label: "TerminalClearButton",
          body: (
            <Meta
              items={[
                { k: "aria-label?", v: 'string — default "Clear terminal".' },
                { k: "…Button props", v: "A ghost icon-sm Button. Returns null unless Terminal has an onClear; its click is that onClear." },
              ]}
            />
          ),
        },
        {
          label: "TerminalContent",
          body: (
            <Meta
              items={[
                { k: "children?", v: "ReactNode — replaces the default pre with the TerminalText output and caret." },
                { k: "className?", v: 'string — merged after "terminal-colors max-h-96 overflow-auto p-4"; div props pass through.' },
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
      description: "Text in a pre, with named icon buttons.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Structure", v: "The output is real text in a pre with the code role, so it is selectable, searchable and read in order. There is no live region: a streaming command is not announced line by line." },
                { k: "Accessible names", v: 'Copy output (Copied after a copy) and Clear terminal are icon-only Buttons with an aria-label each; override them with aria-label when the terminal has a specific name.' },
                { k: "Colour", v: "Colour is never the only carrier: a failure also prints its exit code and text. Foregrounds are -ink roles, readable in both themes." },
                { k: "Keyboard", v: "The content area scrolls (max-h-96) and the buttons are reachable by Tab; Enter or Space activates them." },
                { k: "Target size", v: "Both buttons are icon-sm, 32px. RULES allows 32px only in a toolbar beside other small controls, which is what the header is; a Terminal with a single lone button should pass size=\"icon\" for 40px." },
                { k: "Motion and reduced motion", v: "The only motion is the caret blink. Under prefers-reduced-motion it stops and stays visible, so the cursor does not vanish on its off frame." },
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
              Commands print ANSI, and rendering it as text shows escape garbage while rendering it with inline colours breaks one theme. The AgentWorkspace draws a command tool&apos;s result with this component: <code className="type-code">ToolOutputView</code> in <code className="type-code">components/agent/workspace/workspace-outputs.tsx</code> builds the string from the command (a cyan prompt line), the output and a red exit code, and sets <code className="type-code">isStreaming</code> while the tool runs; <code className="type-code">tool-output.ts</code> validates the <code className="type-code">terminal</code> shape first. Vendored changes: output renders through the system&apos;s own <code className="type-code">TerminalText</code>, whose classes <code className="type-code">terminal-colors</code> maps onto the -ink roles; the streaming cursor plays the system&apos;s caret blink instead of a vendored pulse that bypassed the motion scale; the icon buttons are system Buttons with the check swap; the type roles replaced raw sizes.
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
