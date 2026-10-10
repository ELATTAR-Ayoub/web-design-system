"use client";

import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

/**
 * Live specimens for the `ai-tool` page. They render the real `Tool` with
 * fixed data and no transport — the same shapes the AgentWorkspace feeds it
 * from a tool turn (components/agent/workspace/workspace-reply.tsx).
 */

const params = { query: "overdue invoices", limit: 3 };
const result = { rows: 3, total: "EUR 4,210.00", currency: "EUR" };

export function ToolPreview() {
  return (
    <Panel label="Tool" note="open it, then close it">
      <Tool defaultOpen>
        <ToolHeader state="output-available" title="Search invoices" toolName="search_invoices" type="dynamic-tool" />
        <ToolContent>
          <ToolInput input={params} />
          <ToolOutput errorText={undefined} output={result} />
        </ToolContent>
      </Tool>
    </Panel>
  );
}

const STATES = [
  ["input-streaming", "Pending"],
  ["input-available", "Running"],
  ["approval-requested", "Awaiting Approval"],
  ["approval-responded", "Responded"],
  ["output-available", "Completed"],
  ["output-denied", "Denied"],
  ["output-error", "Error"],
] as const;

export function ToolStateGrid() {
  return (
    <StateGrid cols={2}>
      {STATES.map(([state, note]) => (
        <StateCell key={state} label={state} note={note}>
          <Tool className="mb-0 w-full max-w-xs">
            <ToolHeader state={state} toolName="search_invoices" type="dynamic-tool" />
          </Tool>
        </StateCell>
      ))}
    </StateGrid>
  );
}

export function ToolExamples() {
  return (
    <div className="flex flex-col gap-4">
      <Panel label="Failed call" note="errorText replaces the result">
        <Tool defaultOpen>
          <ToolHeader state="output-error" toolName="send_reminder" type="dynamic-tool" />
          <ToolContent>
            <ToolInput input={{ invoice: "INV-2041" }} />
            <ToolOutput errorText="Mail provider refused the recipient address." output={undefined} />
          </ToolContent>
        </Tool>
      </Panel>
      <Panel label="Static tool part" note='type="tool-<name>" derives the name'>
        <Tool defaultOpen>
          <ToolHeader state="input-available" type="tool-database_query" />
          <ToolContent>
            <ToolInput input={{ table: "customers" }} />
          </ToolContent>
        </Tool>
      </Panel>
    </div>
  );
}
