"use client";

import type { Tool } from "ai";

import {
  Agent,
  AgentContent,
  AgentHeader,
  AgentInstructions,
  AgentOutput,
  AgentTool,
  AgentTools,
} from "@/components/ai-elements/agent";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

const TOOLS = [
  {
    name: "search_ledger",
    tool: {
      description: "Search the ledger for entries by account and date range",
      inputSchema: {
        type: "object",
        properties: { account: { type: "string" }, from: { type: "string" }, to: { type: "string" } },
        required: ["account"],
      },
    },
  },
  {
    name: "export_invoices",
    tool: {
      description: "Export invoices for a month as CSV",
      inputSchema: { type: "object", properties: { month: { type: "string" } }, required: ["month"] },
    },
  },
] as unknown as { name: string; tool: Tool }[];

const OUTPUT_SCHEMA = `interface Summary {
  exported: number;
  skipped: string[];
}`;

/** The Preview: a full agent card — header, instructions, expandable tools and the output schema. */
export function AgentShowcase() {
  return (
    <Panel label="Agent">
      <div className="mx-auto w-full max-w-xl">
        <Agent>
          <AgentHeader model="claude-sonnet-4-5" name="Invoice assistant" />
          <AgentContent>
            <AgentInstructions>Export the month&apos;s invoices, flag any total that does not match the ledger, and never edit a posted entry.</AgentInstructions>
            <AgentTools type="multiple">
              {TOOLS.map((t) => (
                <AgentTool key={t.name} tool={t.tool} value={t.name} />
              ))}
            </AgentTools>
            <AgentOutput schema={OUTPUT_SCHEMA} />
          </AgentContent>
        </Agent>
      </div>
    </Panel>
  );
}

/** The States grid. */
export function AgentStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="rest" note="header only">
        <div className="w-full">
          <Agent>
            <AgentHeader model="claude-sonnet-4-5" name="Invoice assistant" />
          </Agent>
        </div>
      </StateCell>
      <StateCell label="no model" note="model is optional — no badge">
        <div className="w-full">
          <Agent>
            <AgentHeader name="Invoice assistant" />
          </Agent>
        </div>
      </StateCell>
      <StateCell label="tool open" note="the schema shows in a code block">
        <div className="w-full">
          <Agent>
            <AgentHeader name="Invoice assistant" />
            <AgentContent>
              <AgentTools defaultValue={["export_invoices"]} type="multiple">
                <AgentTool tool={TOOLS[1].tool} value="export_invoices" />
              </AgentTools>
            </AgentContent>
          </Agent>
        </div>
      </StateCell>
    </StateGrid>
  );
}

/** The Examples: a tool with no description. */
export function AgentExamples() {
  return (
    <Panel label="Tool without a description">
      <div className="mx-auto w-full max-w-xl">
        <Agent>
          <AgentHeader name="Scratch agent" />
          <AgentContent>
            <AgentTools type="multiple">
              <AgentTool tool={{ inputSchema: { type: "object" } } as unknown as Tool} value="anonymous" />
            </AgentTools>
          </AgentContent>
        </Agent>
      </div>
    </Panel>
  );
}
