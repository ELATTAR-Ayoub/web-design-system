import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { StackTraceExamples, StackTracePreview, StackTraceStateGrid } from "./stack-trace-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-stack-trace",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A JavaScript error trace parsed into its type, message and frames. Click a file path to see what onFilePathClick receives.",
      label: "StackTrace",
      render: <StackTracePreview />,
      source: `import {
  StackTrace, StackTraceActions, StackTraceContent, StackTraceCopyButton, StackTraceError,
  StackTraceErrorMessage, StackTraceErrorType, StackTraceExpandButton, StackTraceFrames, StackTraceHeader,
} from "@/components/ai-elements/stack-trace";

<StackTrace defaultOpen trace={error.stack} onFilePathClick={(file, line, column) => open(file, line, column)}>
  <StackTraceHeader>
    <StackTraceError>
      <StackTraceErrorType />
      <StackTraceErrorMessage />
    </StackTraceError>
    <StackTraceActions>
      <StackTraceCopyButton />
      <StackTraceExpandButton />
    </StackTraceActions>
  </StackTraceHeader>
  <StackTraceContent>
    <StackTraceFrames />
  </StackTraceContent>
</StackTrace>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It uses <code className="type-code">@radix-ui/react-use-controllable-state</code> for the open state.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Pass the raw trace text; the component parses it. The first line is read as ErrorType: message (a line that does not look like that is shown whole as the message), and lines starting with at become frames, either at fn (path:line:col) or at path:line:col. A frame inside node_modules, node: or internal/ is marked internal and dimmed. open and onOpenChange control it; defaultOpen starts it open. Without onFilePathClick the file paths are disabled buttons.",
      language: "tsx",
      code: `<StackTrace trace={trace} open={open} onOpenChange={setOpen} onFilePathClick={openInEditor}>
  <StackTraceHeader>
    <StackTraceError>
      <StackTraceErrorType />
      <StackTraceErrorMessage />
    </StackTraceError>
    <StackTraceActions>
      <StackTraceCopyButton />
      <StackTraceExpandButton />
    </StackTraceActions>
  </StackTraceHeader>
  <StackTraceContent maxHeight={320}>
    <StackTraceFrames showInternalFrames={false} />
  </StackTraceContent>
</StackTrace>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Open or closed, with or without frames, and clickable paths or not.",
      blocks: [
        { body: <StackTraceStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: the header with the error glyph, type, message, copy and chevron. <strong>hover</strong>: the header row takes a faint muted fill; a file path takes the action ink on hover. <strong>focus-visible</strong>: the copy button and the file-path buttons take the focus ring; the header itself is not focusable (see Accessibility). <strong>pressed</strong>: the copy Button inherits its press feel; the header has none. <strong>loading</strong>: N/A — a trace is complete text and nothing in it is pending. <strong>success</strong>: the copy button swaps to a check for <code className="type-code">timeout</code> ms. <strong>error</strong>: the component is itself the display of an error — the glyph, type and frames use the error ink; a failed clipboard write calls <code className="type-code">onError</code>. <strong>disabled</strong>: a file-path button is disabled when there is no <code className="type-code">onFilePathClick</code>; the rest is N/A. <strong>empty</strong>: a trace with no frames shows a No stack frames line when opened; an empty string yields no header text.
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
      description: "Library frames hidden and a shorter scroll area.",
      label: "Examples",
      render: <StackTraceExamples />,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/stack-trace.tsx.",
      blocks: [
        {
          label: "StackTrace",
          body: (
            <Meta
              items={[
                { k: "trace", v: "string, required — the raw trace, parsed once per change." },
                { k: "open?, defaultOpen?, onOpenChange?", v: "boolean, boolean (default false), (open: boolean) => void — controlled or uncontrolled." },
                { k: "onFilePathClick?", v: "(filePath: string, line?: number, column?: number) => void — called when a frame's path is clicked." },
                { k: "className?", v: "string, plus any div props." },
              ]}
            />
          ),
        },
        {
          label: "StackTraceHeader, StackTraceError, StackTraceErrorType, StackTraceErrorMessage",
          body: (
            <Meta
              items={[
                { k: "StackTraceHeader", v: "CollapsibleTrigger props; the clickable row that toggles the trace. className applies to the row." },
                { k: "StackTraceError", v: "div props; the error glyph plus its children." },
                { k: "StackTraceErrorType", v: "span props; defaults to the parsed error type (TypeError), in error ink." },
                { k: "StackTraceErrorMessage", v: "span props; defaults to the parsed message, truncated to one line." },
              ]}
            />
          ),
        },
        {
          label: "StackTraceActions, StackTraceCopyButton, StackTraceExpandButton",
          body: (
            <Meta
              items={[
                { k: "StackTraceActions", v: 'div props; role="group" and it stops clicks and Enter/Space from reaching the header, so pressing copy does not toggle the trace.' },
                { k: "StackTraceCopyButton onCopy?, onError?, timeout?", v: "() => void, (error: Error) => void, number (default 2000). Copies the raw trace." },
                { k: "StackTraceCopyButton aria-label?", v: 'string — default "Copy stack trace", "Copied" after a copy. A ghost icon Button, 40px; children replace the glyph.' },
                { k: "StackTraceExpandButton", v: "div props; a chevron that turns 180 degrees with the open state. It is an indicator, not a button — the header is the control." },
              ]}
            />
          ),
        },
        {
          label: "StackTraceContent, StackTraceFrames",
          body: (
            <Meta
              items={[
                { k: "StackTraceContent maxHeight?", v: "number, default 400 (px) — the scroll area's height cap." },
                { k: "StackTraceContent …CollapsibleContent props", v: "Opens with the shared height animation." },
                { k: "StackTraceFrames showInternalFrames?", v: "boolean, default true — false hides node_modules, node: and internal frames." },
                { k: "StackTraceFrames …div props", v: "className and the rest." },
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
      description: "Real buttons for copy and paths; the header toggle is pointer-only as vendored.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Accessible names", v: "Copy stack trace (Copied after) is an icon-only Button with an aria-label. A file path is a button named by its text, path:line:column." },
                { k: "Keyboard", v: "The header is a focusable element with the button role (it holds the copy and expand buttons, so it cannot be a <button>): Tab reaches it, Enter or Space toggles the frames, and it reports aria-expanded. Tab then reaches the copy button and, when onFilePathClick is set, each path; keys pressed on those stay theirs." },
                { k: "Target size", v: "The header row has a 44px minimum height and is the pointer target; copy is a 40px icon Button. File-path buttons are inline text links." },
                { k: "Colour", v: "Error type and glyph in the error ink, paths in the foreground, library frames dimmed. Frames are text, so the trace stays readable and selectable." },
                { k: "Motion and reduced motion", v: "The chevron rotates with a transition and the content opens with the shared height animation; the blanket prefers-reduced-motion rule collapses both." },
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
              A crash has a type, a message and a few frames that matter among many that do not. The AgentWorkspace maps a <code className="type-code">stack-trace</code> tool result to this component in <code className="type-code">ToolOutputView</code> (<code className="type-code">components/agent/workspace/workspace-outputs.tsx</code>): open by default, the copy button toasts, and a Retry button beside it when the host can retry the step; <code className="type-code">tool-output.ts</code> checks that the result carries a trace string. Because it draws the failure itself, the surrounding Tool step stays quiet instead of repeating the error. Vendored changes: the error type dropped its font weight (the type role owns weight) and keeps its error ink; the file-path hover colour became the action ink instead of a fill colour that fails contrast in one theme; the fade animation classes were removed because the content already animates its height.
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
