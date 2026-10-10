"use client";

import * as React from "react";

import {
  StackTrace,
  StackTraceActions,
  StackTraceContent,
  StackTraceCopyButton,
  StackTraceError,
  StackTraceErrorMessage,
  StackTraceErrorType,
  StackTraceExpandButton,
  StackTraceFrames,
  StackTraceHeader,
} from "@/components/ai-elements/stack-trace";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

/**
 * Live specimens for the `ai-stack-trace` page — a fixed trace string, the
 * same composition the AgentWorkspace draws for a crashed step.
 */

const TRACE = `TypeError: Cannot read properties of undefined (reading 'total')
    at taxFor (/app/src/invoices.ts:42:11)
    at buildInvoice (/app/src/invoices.ts:17:9)
    at node_modules/react-dom/cjs/react-dom.development.js:14985:18
    at node:internal/process/task_queues:95:5`;

function Composed({
  trace = TRACE,
  onFilePathClick,
  ...props
}: Omit<React.ComponentProps<typeof StackTrace>, "trace"> & { trace?: string }) {
  return (
    <StackTrace onFilePathClick={onFilePathClick} trace={trace} {...props}>
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
    </StackTrace>
  );
}

export function StackTracePreview() {
  const [opened, setOpened] = React.useState<string | null>(null);
  return (
    <Panel label="StackTrace" note={opened ?? "click a file path"}>
      <Composed
        defaultOpen
        onFilePathClick={(file, line, column) => setOpened(`${file}:${line}:${column}`)}
      />
    </Panel>
  );
}

export function StackTraceStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="collapsed" note="header only; chevron points down">
        <div className="w-full">
          <Composed />
        </div>
      </StateCell>
      <StateCell label="open" note="frames, library frames dimmed">
        <div className="w-full">
          <Composed defaultOpen />
        </div>
      </StateCell>
      <StateCell label="no stack frames" note="a bare message">
        <div className="w-full">
          <Composed defaultOpen trace="Error: connection refused" />
        </div>
      </StateCell>
      <StateCell label="path not clickable" note="no onFilePathClick: the path button is disabled">
        <div className="w-full">
          <Composed defaultOpen trace={"RangeError: bad index\n    at pick (/app/src/list.ts:3:7)"} />
        </div>
      </StateCell>
    </StateGrid>
  );
}

export function StackTraceExamples() {
  return (
    <Panel label="Hide library frames" note="showInternalFrames={false}">
      <StackTrace defaultOpen trace={TRACE}>
        <StackTraceHeader>
          <StackTraceError>
            <StackTraceErrorType />
            <StackTraceErrorMessage />
          </StackTraceError>
          <StackTraceActions>
            <StackTraceExpandButton />
          </StackTraceActions>
        </StackTraceHeader>
        <StackTraceContent maxHeight={160}>
          <StackTraceFrames showInternalFrames={false} />
        </StackTraceContent>
      </StackTrace>
    </Panel>
  );
}
