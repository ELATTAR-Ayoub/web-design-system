import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { ToolExamples, ToolPreview, ToolStateGrid } from "./tool-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-tool",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "One tool call as a collapsible card: name, status badge, the parameters it was called with and what came back.",
      label: "Tool",
      render: <ToolPreview />,
      source: `import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool";

<Tool defaultOpen>
  <ToolHeader state="output-available" title="Search invoices" toolName="search_invoices" type="dynamic-tool" />
  <ToolContent>
    <ToolInput input={{ query: "overdue invoices", limit: 3 }} />
    <ToolOutput errorText={undefined} output={{ rows: 3, total: "EUR 4,210.00" }} />
  </ToolContent>
</Tool>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It imports the AI SDK&apos;s <code className="type-code">ToolUIPart</code> and <code className="type-code">DynamicToolUIPart</code> types from <code className="type-code">ai</code>, and renders its parameters and result through <code className="type-code">ai-code-block</code>.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Tool is a Collapsible, so open, defaultOpen and onOpenChange work as they do there. ToolHeader needs the pair type + state; for a dynamic tool type is \"dynamic-tool\" and toolName is required, for a static one the name is read off type (\"tool-database_query\" shows database_query). title overrides the visible name. ToolOutput renders nothing when it has neither output nor errorText.",
      language: "tsx",
      code: `import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool";

<Tool open={open} onOpenChange={setOpen}>
  <ToolHeader state={state} toolName={name} type="dynamic-tool" />
  <ToolContent>
    <ToolInput input={params} />
    <ToolOutput errorText={error} output={result} />
  </ToolContent>
</Tool>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The seven AI SDK tool states each have their own label and glyph in the header badge.",
      blocks: [
        { body: <ToolStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: closed card, wrench, name, badge, chevron. <strong>hover</strong> and <strong>pressed</strong>: N/A on the card itself — the header trigger adds no hover fill or press feel of its own, so the chevron and the cursor are the only cues. <strong>focus-visible</strong>: the header is a real button and takes the browser focus ring. <strong>loading</strong>: <code className="type-code">input-streaming</code> (Pending) and <code className="type-code">input-available</code> (Running); the Running clock is static, there is no spinner. <strong>success</strong>: <code className="type-code">output-available</code> (Completed, success ink). <strong>error</strong>: <code className="type-code">output-error</code> (error ink) and the result block switches to a destructive tint with <code className="type-code">errorText</code>. <strong>disabled</strong>: N/A as a state of its own — Tool forwards <code className="type-code">disabled</code> to the Radix Collapsible, but the workspace never sets it. <strong>empty</strong>: ToolOutput returns <code className="type-code">null</code> with no output and no errorText, and the workspace leaves ToolInput out when a call has no parameters. Approval states (<code className="type-code">approval-requested</code>, <code className="type-code">approval-responded</code>, <code className="type-code">output-denied</code>) use warning, info and warning ink — never red, because a refusal is a decision, not a fault.
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
      description: "A failed call, and a static tool part whose name is derived from its type.",
      label: "Examples",
      render: <ToolExamples />,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/tool.tsx.",
      blocks: [
        {
          label: "Tool",
          body: (
            <Meta
              items={[
                { k: "…Collapsible props", v: "open, defaultOpen, onOpenChange, disabled — all Radix Collapsible props pass through." },
                { k: "className?", v: 'string — merged after "group not-prose mb-4 w-full rounded-md border".' },
              ]}
            />
          ),
        },
        {
          label: "ToolHeader",
          body: (
            <Meta
              items={[
                { k: "type", v: 'ToolUIPart["type"] ("tool-<name>") or "dynamic-tool", required.' },
                { k: "state", v: 'ToolPart["state"], required — one of input-streaming, input-available, approval-requested, approval-responded, output-available, output-denied, output-error.' },
                { k: "toolName", v: 'string, required when type is "dynamic-tool", forbidden otherwise.' },
                { k: "title?", v: "string — replaces the derived name; when set it is drawn in the nav role instead of the identifier role." },
                { k: "className?", v: "string — on the CollapsibleTrigger. Other trigger props pass through." },
              ]}
            />
          ),
        },
        {
          label: "ToolContent",
          body: <Meta items={[{ k: "…CollapsibleContent props", v: "Plus className; adds space-y-4 p-4. Height animates with the shared expand/collapse motion." }]} />,
        },
        {
          label: "ToolInput",
          body: (
            <Meta
              items={[
                { k: "input", v: 'ToolPart["input"], required — printed as indented JSON in a json code block under a Parameters label.' },
                { k: "className?", v: "string, plus any div props." },
              ]}
            />
          ),
        },
        {
          label: "ToolOutput",
          body: (
            <Meta
              items={[
                { k: "output", v: 'ToolPart["output"], required — a React element is rendered as is, an object is printed as JSON, a string goes in a json code block, anything else is wrapped in a div.' },
                { k: "errorText", v: 'ToolPart["errorText"], required — when present the label reads Error and the block takes the destructive tint.' },
                { k: "className?", v: "string, plus any div props." },
              ]}
            />
          ),
        },
        {
          label: "getStatusBadge and types",
          body: (
            <Meta
              items={[
                { k: 'getStatusBadge(status: ToolPart["state"])', v: "Returns the secondary Badge with the state glyph and label that ToolHeader uses; usable on its own." },
                { k: "ToolPart", v: "The exported union of ToolUIPart and DynamicToolUIPart. ToolProps, ToolHeaderProps, ToolContentProps, ToolInputProps and ToolOutputProps are the matching prop types." },
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
      description: "A disclosure button with a visible name and a text status.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role and name", v: "ToolHeader is a Radix CollapsibleTrigger: a button with aria-expanded and aria-controls. Its accessible name is its content — the tool name followed by the status label, so the state is announced as text, not only as a glyph." },
                { k: "Keyboard", v: "Tab to the header, Enter or Space toggles. Content stays in the tab order only while open." },
                { k: "Target size", v: "The whole header row is the hit area (p-3 around the content, full width), well over the 40px floor; it is one large control, not an icon-only button." },
                { k: "Colour", v: "State glyphs use the -ink tones through Icon, never a raw hue; the label beside each glyph carries the meaning." },
                { k: "Motion", v: "The chevron rotates 180 degrees with a transition and the body uses the shared expand/collapse height animation; the blanket prefers-reduced-motion rule collapses both to a single frame." },
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
              Every tool the agent calls needs one honest record: what was asked, what state it is in, what came back. The AgentWorkspace draws that record with this component in <code className="type-code">components/agent/workspace/workspace-reply.tsx</code> (ToolStepCard) — a dynamic-tool header with the turn&apos;s name, an attempt suffix as the title on a retry, ToolInput for the params and ToolOutput for a result the thread has no specialised view for. Results with a known shape are drawn by their own component instead (terminal, test results, stack trace, file tree, commit; see <code className="type-code">workspace-outputs.tsx</code> and <code className="type-code">tool-output.ts</code>). Vendored changes: the stock status colours became the four state -ink roles, with Responded as info rather than success; the redundant pill radius and text size were dropped because Badge already has them; the hand-rolled enter/exit classes went because CollapsibleContent animates its measured height; the identifier and nav type roles replaced raw sizes.
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
