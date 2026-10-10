"use client";

import * as React from "react";

import {
  Terminal,
  TerminalActions,
  TerminalClearButton,
  TerminalContent,
  TerminalCopyButton,
  TerminalHeader,
  TerminalStatus,
  TerminalTitle,
} from "@/components/ai-elements/terminal";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

/**
 * Live specimens for the `ai-terminal` page. Output is a fixed string with
 * ANSI escapes — the same shape the AgentWorkspace builds from a command
 * result (workspace-outputs.tsx). Nothing here streams on a timer.
 */

const ESC = "\u001b";
const OUTPUT = [
  `${ESC}[36m$${ESC}[0m npm run build`,
  `${ESC}[32m✓${ESC}[0m compiled 148 modules`,
  `${ESC}[33mwarn${ESC}[0m  3 images are larger than 200 kB`,
  `${ESC}[1m${ESC}[32mDone${ESC}[0m in 4.2s`,
].join("\n");
const FAILED = `${ESC}[36m$${ESC}[0m npm test\n${ESC}[31m✗ 2 failed${ESC}[0m\n${ESC}[31mexit 1${ESC}[0m`;

export function TerminalPreview() {
  const [output, setOutput] = React.useState(OUTPUT);
  return (
    <Panel label="Terminal" note={output ? "clear it to see the empty state" : "cleared"}>
      <Terminal onClear={() => setOutput("")} output={output} />
    </Panel>
  );
}

export function TerminalStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="rest" note="header, output, copy">
        <Terminal className="w-full max-w-sm" output={OUTPUT} />
      </StateCell>
      <StateCell label="streaming" note="isStreaming adds the caret and TerminalStatus">
        <Terminal className="w-full max-w-sm" isStreaming output={`${ESC}[36m$${ESC}[0m npm run build\ncompiling…`}>
          <TerminalHeader>
            <TerminalTitle />
            <div className="flex items-center gap-1">
              <TerminalStatus>Running</TerminalStatus>
              <TerminalActions>
                <TerminalCopyButton />
              </TerminalActions>
            </div>
          </TerminalHeader>
          <TerminalContent />
        </Terminal>
      </StateCell>
      <StateCell label="error" note="a failed command is red ANSI in the output">
        <Terminal className="w-full max-w-sm" output={FAILED} />
      </StateCell>
      <StateCell label="empty" note="no output yet">
        <Terminal className="w-full max-w-sm" output="" />
      </StateCell>
    </StateGrid>
  );
}

export function TerminalExamples() {
  return (
    <div className="flex flex-col gap-4">
      <Panel label="Custom header" note="compose the parts yourself">
        <Terminal output={OUTPUT}>
          <TerminalHeader>
            <TerminalTitle>build.sh</TerminalTitle>
            <TerminalActions>
              <TerminalCopyButton />
              <TerminalClearButton />
            </TerminalActions>
          </TerminalHeader>
          <TerminalContent />
        </Terminal>
      </Panel>
    </div>
  );
}
