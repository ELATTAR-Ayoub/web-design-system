/**
 * Authored documentation page for `ai-schema-display`.
 *
 * Every live specimen renders the real component from `components/ai-elements/schema-display.tsx`.
 * Anything interactive lives in the companion client file
 * `schema-display-specimen.tsx` (a spec module cannot carry "use client").
 */

import { SchemaDisplayPreview, SchemaDisplayStateGrid } from "./schema-display-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-schema-display",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A PATCH endpoint with path and query parameters, a nested request body and a response. Collapse a section or expand the nested address object.",
      label: "SchemaDisplay",
      render: <SchemaDisplayPreview />,
      source: "import { SchemaDisplay } from \"@/components/ai-elements/schema-display\";\n\n<SchemaDisplay\n  description=\"Update the status or address of an order.\"\n  method=\"PATCH\"\n  parameters={[{ name: \"orderId\", type: \"string\", location: \"path\", required: true }]}\n  path=\"/orders/{orderId}\"\n  requestBody={[{ name: \"status\", type: \"string\", required: true }]}\n  responseBody={[{ name: \"id\", type: \"string\", required: true }]}\n/>",
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <>
          <p className="type-small text-muted-foreground">
            Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry.
          </p>
          <p className="type-small mt-2 text-muted-foreground">
            {"It uses Badge, Collapsible and Icon from components/ui."}
          </p>
        </>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "Pass method, path and, optionally, description, parameters, requestBody and responseBody. With no children SchemaDisplay draws the header, the description and whichever of the three sections have data. Properties nest through properties (an object) or items (an array); a property with either becomes a collapsible row. Compose children when you need a different layout, for example to add SchemaDisplayExample.",
      language: "tsx",
      code: "<SchemaDisplay\n  description={output.description}\n  method={output.method}\n  parameters={output.parameters}\n  path={output.path}\n  requestBody={output.requestBody}\n  responseBody={output.responseBody}\n/>",
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The method badge colour is the main visual state; the rest is open or closed sections.",
      blocks: [
        {
          body: <SchemaDisplayStateGrid />,
        },
        {
          label: "Every state, classified",
          body: (
            <Meta
              items={[
                { k: "rest", v: "A rounded-lg bordered card: a header with the method badge and path (path parameters in braces are tinted), an optional description, then the sections, each open by default." },
                { k: "hover", v: "The section triggers and nested property triggers take a muted hover fill. The header and static rows do not react." },
                { k: "focus-visible", v: "Each section and nested-property trigger is a button and shows the system focus ring." },
                { k: "pressed", v: "The triggers carry the press class, so they get the system press feel." },
                { k: "loading", v: "N/A: it renders data it is given; there is no pending state." },
                { k: "success", v: "The GET method uses the success Badge variant. That is the method's colour, not an outcome." },
                { k: "error", v: "DELETE uses the destructive Badge variant, again a colour for the method. A required field gets a destructive \"required\" badge. Neither is a failure state." },
                { k: "disabled", v: "N/A: the triggers are disclosures with nothing to withhold." },
                { k: "empty", v: "Sections with no data are not drawn: no parameters, request body or response means the header (and description) only. A section whose data is an empty array is skipped as well." },
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
      description: "Read from components/ai-elements/schema-display.tsx.",
      blocks: [
        {
          label: "SchemaDisplay",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "Base classes: overflow-hidden rounded-lg border bg-card." },
                { k: "method", v: "\"GET\" | \"POST\" | \"PUT\" | \"PATCH\" | \"DELETE\", required. GET success, POST info, PUT and PATCH warning, DELETE destructive." },
                { k: "path", v: "string, required. {name} segments are tinted as parameters." },
                { k: "description?", v: "string. Shown in a bordered row under the header." },
                { k: "parameters?", v: "{ name, type, required?, description?, location?: \"path\" | \"query\" | \"header\" }[]" },
                { k: "requestBody? / responseBody?", v: "{ name, type, required?, description?, properties?, items? }[]. properties nests an object, items nests an array element (shown as name[])." },
                { k: "children?", v: "ReactNode. Replaces the default layout; the context stays available to the parts." },
              ]}
            />
          ),
        },
        {
          label: "SchemaDisplayHeader",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "A flex row with a bottom border." },
              ]}
            />
          ),
        },
        {
          label: "SchemaDisplayMethod",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof Badge>", v: "Children default to the method; the Badge variant is chosen from it." },
              ]}
            />
          ),
        },
        {
          label: "SchemaDisplayPath",
          body: (
            <Meta
              items={[
                { k: "children?", v: "ReactNode. Defaults to the path with parameters tinted (text-info-ink). Children are rendered as plain nodes, not as HTML." },
              ]}
            />
          ),
        },
        {
          label: "SchemaDisplayDescription",
          body: (
            <Meta
              items={[
                { k: "children?", v: "ReactNode. Defaults to the description from context." },
              ]}
            />
          ),
        },
        {
          label: "SchemaDisplayContent / SchemaDisplayBody",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "A divide-y container for the sections." },
              ]}
            />
          ),
        },
        {
          label: "SchemaDisplayParameters",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof Collapsible>", v: "A section titled Parameters with a count badge, open by default. children replace the default parameter rows." },
              ]}
            />
          ),
        },
        {
          label: "SchemaDisplayParameter",
          body: (
            <Meta
              items={[
                { k: "name, type, required?, description?, location?", v: "One parameter row: name, a type badge, a location badge and a required badge." },
              ]}
            />
          ),
        },
        {
          label: "SchemaDisplayRequest / SchemaDisplayResponse",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof Collapsible>", v: "Sections titled Request Body and Response, open by default; children replace the default rows." },
              ]}
            />
          ),
        },
        {
          label: "SchemaDisplayProperty",
          body: (
            <Meta
              items={[
                { k: "name, type, required?, description?, properties?, items?", v: "One property. With properties or items it is a collapsible row." },
                { k: "depth?", v: "number, default 0. Indent depth; rows open by default when depth is under 2." },
              ]}
            />
          ),
        },
        {
          label: "SchemaDisplayExample",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLPreElement>", v: "A pre in the type-code role on a muted surface, for a sample payload." },
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
      description: "The sections are Radix collapsibles; the badges and indentation are visual, so meaning must also be in text.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Disclosures", v: "Each section and each nested property with children is a button; Radix sets aria-expanded and aria-controls. Enter or Space toggles it." },
                { k: "Names and meaning", v: "The method is badge text (GET, POST), the location and required flags are badge text, not colour alone. Property names are plain text in the type-identifier role." },
                { k: "Structure", v: "There are no headings, lists or tables: the sections are buttons and the rows are divs, so a screen reader reads them in order without a count of properties. The Parameters count badge is the only quantity." },
                { k: "Target size", v: "Every trigger keeps min-h-(--size-target-min), the full 44px." },
                { k: "Motion", v: "Section content animates its height through CollapsibleContent, and the chevron turns 90 degrees; both fall under the blanket prefers-reduced-motion rule." },
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
              {"An agent that designs or inspects an API needs to show an endpoint's contract in a compact, scannable form with the nesting intact. The AgentWorkspace draws its \"schema-display\" tool output with SchemaDisplay (components/agent/workspace/workspace-outputs.tsx), passing description, method, parameters, path, requestBody and responseBody straight from the tool result and letting the default layout choose the sections."}
            </Note>
          ),
        },
        {
          label: "Vendored changes",
          body: (
            <Note tone="action">
              {"The per-method palette classes are mapped onto the system's semantic Badge variants; PUT and PATCH both land on warning, because the system has one amber where upstream had two. The path-parameter highlight is text-info-ink rather than an embedded blue palette class. SchemaDisplayPath renders children as nodes instead of feeding a ReactNode into dangerouslySetInnerHTML. SchemaDisplayProperty replaces a raw per-depth pixel padding with a calc() on the spacing unit, so nesting reads in steps of the token scale."}
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
