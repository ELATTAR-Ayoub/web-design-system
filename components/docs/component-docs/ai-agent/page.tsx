import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { AgentExamples, AgentShowcase, AgentStateGrid } from "./agent-specimen";
import { meta } from "./meta";

const SRC = "components/ai-elements/agent.tsx";

export const spec: ComponentDocSpec = {
  name: "ai-agent",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A read-only card describing an agent: its name and model, its instructions, the tools it can call and the shape it answers in. Open a tool to see its input schema.",
      label: "Agent",
      render: <AgentShowcase />,
      source: `import {
  Agent, AgentContent, AgentHeader, AgentInstructions, AgentOutput, AgentTool, AgentTools,
} from "@/components/ai-elements/agent";

<Agent>
  <AgentHeader model="claude-sonnet-4-5" name="Invoice assistant" />
  <AgentContent>
    <AgentInstructions>Export the month's invoices and flag any total that does not match.</AgentInstructions>
    <AgentTools type="multiple">
      <AgentTool tool={searchLedger} value="search_ledger" />
    </AgentTools>
    <AgentOutput schema={\`interface Summary { exported: number }\`} />
  </AgentContent>
</Agent>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It composes the system&apos;s own Accordion, Badge and Icon, and the CodeBlock sibling (Shiki) for schemas; the <code className="type-code">Tool</code> type comes from the <code className="type-code">ai</code> package.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Agent is the frame. AgentHeader takes the name and an optional model id; AgentContent holds the rest. AgentTools is an Accordion, so give it type (single or multiple) and each AgentTool a unique value and a tool object; the tool's description is the row title and its input schema (jsonSchema, else inputSchema) is printed as JSON. AgentInstructions takes a string, and AgentOutput a schema string rendered as TypeScript.",
      language: "tsx",
      code: `import type { Tool } from "ai";
import { Agent, AgentContent, AgentHeader, AgentInstructions, AgentOutput, AgentTool, AgentTools } from "@/components/ai-elements/agent";

<Agent>
  <AgentHeader name={agent.name} model={agent.model} />
  <AgentContent>
    {agent.instructions ? <AgentInstructions>{agent.instructions}</AgentInstructions> : null}
    {agent.tools?.length ? (
      <AgentTools type="multiple">
        {agent.tools.map((t) => (
          <AgentTool
            key={t.name}
            value={t.name}
            tool={{ description: t.description, inputSchema: t.schema ?? {} } as unknown as Tool}
          />
        ))}
      </AgentTools>
    ) : null}
    {agent.outputSchema ? <AgentOutput schema={agent.outputSchema} /> : null}
  </AgentContent>
</Agent>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Agent is a display; its only live state is which tool rows are open.",
      blocks: [
        { body: <AgentStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: bordered card, name in type-nav, the model as a secondary Badge in type-identifier.{" "}
                <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong>: on a tool row only, inherited from the
                Accordion trigger (hover:no-underline here); the card itself is not interactive. A tool row opens on{" "}
                <code className="type-code">anim-expand</code> to show its schema. <strong>loading</strong>, <strong>success</strong> and{" "}
                <strong>error</strong>: N/A — Agent describes a configuration; it fetches and runs nothing. <strong>disabled</strong>: N/A —
                there is no action to withhold. <strong>empty</strong>: the parts are optional and independent: no model means no badge,
                and a caller that has no instructions, tools or output simply omits AgentContent (the workspace does). A tool with no
                description reads &quot;No description&quot;.
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
      description: "A tool without a description falls back to a plain label.",
      label: "No description",
      render: <AgentExamples />,
      source: `<Agent>
  <AgentHeader name="Scratch agent" />
  <AgentContent>
    <AgentTools type="multiple">
      <AgentTool tool={{ inputSchema: { type: "object" } } as unknown as Tool} value="anonymous" />
    </AgentTools>
  </AgentContent>
</Agent>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: `Read from ${SRC}.`,
      blocks: [
        { label: "Agent", body: <Meta items={[{ k: "...props", v: "div props. Memoised; full width, rounded-md, bordered, not-prose." }]} /> },
        {
          label: "AgentHeader",
          body: (
            <Meta
              items={[
                { k: "name", v: "string, required — type-nav, beside a bot glyph." },
                { k: "model?", v: "string — a model id, shown as a secondary Badge in type-identifier." },
                { k: "...props", v: "div props." },
              ]}
            />
          ),
        },
        { label: "AgentContent", body: <Meta items={[{ k: "...props", v: "div props. Vertical spacing, padding without a top edge so it continues from the header." }]} /> },
        { label: "AgentInstructions", body: <Meta items={[{ k: "children", v: 'string, required — printed in a muted panel under an "Instructions" label.' }, { k: "...props", v: "div props." }]} /> },
        { label: "AgentTools", body: <Meta items={[{ k: "...props", v: 'Accordion props (type, value, defaultValue, onValueChange, collapsible…). Adds a "Tools" label and a bordered frame.' }]} /> },
        {
          label: "AgentTool",
          body: (
            <Meta
              items={[
                { k: "tool", v: "Tool (from ai), required — description is the row title; jsonSchema, else inputSchema, is the body." },
                { k: "value", v: "string, required — the AccordionItem value." },
                { k: "...props", v: "AccordionItem props." },
              ]}
            />
          ),
        },
        { label: "AgentOutput", body: <Meta items={[{ k: "schema", v: 'string, required — shown as TypeScript in a CodeBlock under an "Output Schema" label.' }, { k: "...props", v: "div props." }]} /> },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: "Each tool row is an Accordion trigger button named by the tool description, with aria-expanded and aria-controls. The three small headings (Instructions, Tools, Output Schema) are spans, not heading elements, so they do not enter the page outline; the bot glyph is decorative." },
                { k: "Keyboard", v: "Tab reaches each tool trigger; Enter or Space opens it, and the Accordion's arrow keys move between triggers. The schema code is selectable text." },
                { k: "Target size", v: "Tool triggers carry min-h-(--size-target-min), 44px, so a short description is still a full target." },
                { k: "Motion", v: "Rows open on anim-expand/anim-collapse; reduced motion collapses it." },
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
              The AgentWorkspace shows the connected agent in its settings panel in{" "}
              <code className="type-code">components/agent/workspace/workspace-settings.tsx</code>: the header with name and model, then
              instructions, an AgentTools accordion built from the transport&apos;s tool list, and the output schema, each only when the
              agent has one. Vendored changes: the model id Badge uses type-identifier (declared after type-badge in typeset.css, so it
              wins on the shared properties) because a model id is code people read back; and the tool trigger carries the 44px target
              minimum.
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
