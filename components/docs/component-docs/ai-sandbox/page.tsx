import { SandboxPreview, SandboxStateGrid } from "./sandbox-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-sandbox",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A finished run. Switch between Code and Output, or collapse the card from its header.",
      label: "Sandbox",
      render: <SandboxPreview />,
      source: "import {\n  Sandbox,\n  SandboxContent,\n  SandboxHeader,\n  SandboxTabContent,\n  SandboxTabs,\n  SandboxTabsBar,\n  SandboxTabsList,\n  SandboxTabsTrigger,\n} from \"@/components/ai-elements/sandbox\";\n\n<Sandbox>\n  <SandboxHeader state=\"output-available\" title=\"javascript sandbox\" />\n  <SandboxContent>\n    <SandboxTabs defaultValue=\"output\">\n      <SandboxTabsBar>\n        <SandboxTabsList>\n          <SandboxTabsTrigger value=\"code\">Code</SandboxTabsTrigger>\n          <SandboxTabsTrigger value=\"output\">Output</SandboxTabsTrigger>\n        </SandboxTabsList>\n      </SandboxTabsBar>\n      <SandboxTabContent value=\"code\">{code}</SandboxTabContent>\n      <SandboxTabContent value=\"output\">{output}</SandboxTabContent>\n    </SandboxTabs>\n  </SandboxContent>\n</Sandbox>",
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
            {"It reuses the status badge from components/ai-elements/tool.tsx for its header, and Collapsible and Tabs from components/ui."}
          </p>
        </>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "Sandbox is a Collapsible that starts open. SandboxHeader needs the state of the tool call that produced the run (a ToolUIPart state) and shows it as a badge; the title is free text. Inside SandboxContent the tab parts are thin wrappers over Tabs, so value on each trigger must match a SandboxTabContent.",
      language: "tsx",
      code: "<Sandbox>\n  <SandboxHeader state={state} title={title ?? `${language} sandbox`} />\n  <SandboxContent>\n    <SandboxTabs defaultValue=\"output\">\n      <SandboxTabsBar>\n        <SandboxTabsList>\n          <SandboxTabsTrigger value=\"code\">Code</SandboxTabsTrigger>\n          <SandboxTabsTrigger value=\"output\">Output</SandboxTabsTrigger>\n        </SandboxTabsList>\n      </SandboxTabsBar>\n      <SandboxTabContent value=\"code\"><CodeBlock code={code} language={language} /></SandboxTabContent>\n      <SandboxTabContent value=\"output\"><CodeBlock code={output} language=\"log\" /></SandboxTabContent>\n    </SandboxTabs>\n  </SandboxContent>\n</Sandbox>",
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The header badge reports the tool state. The grid shows the four states with the card collapsed; the card also opens and closes.",
      blocks: [
        {
          body: <SandboxStateGrid />,
        },
        {
          label: "Every state, classified",
          body: (
            <Meta
              items={[
                { k: "rest", v: "A rounded-md bordered card, open by default (defaultOpen is set before your props, so pass defaultOpen={false} to start collapsed), with the header trigger on top." },
                { k: "hover", v: "The header trigger and each tab trigger take their hover treatment from the Collapsible trigger and TabsTrigger styles; the chevron does not change on hover." },
                { k: "focus-visible", v: "The header trigger and every tab trigger are focusable and show the system focus ring." },
                { k: "pressed", v: "Inherited from the underlying trigger styles. The card itself has no pressed state." },
                { k: "loading", v: "The header badge shows the tool's pending and running states (input-streaming and input-available), each with its own label and icon from the shared status badge. The content area is the caller's to fill." },
                { k: "success", v: "state=\"output-available\" shows the completed badge." },
                { k: "error", v: "state=\"output-error\" shows the error badge. The card does not render the error text; the caller puts it in the Output tab." },
                { k: "disabled", v: "N/A: the card is a disclosure with no action to withhold. Collapsible and Tabs would accept disabled through props, but the workspace never uses it." },
                { k: "empty", v: "SandboxContent with no children expands to an empty region. The workspace avoids this by always giving the Output tab at least a space of text." },
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
      description: "Read from components/ai-elements/sandbox.tsx.",
      blocks: [
        {
          label: "Sandbox",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof Collapsible>", v: "Open state props (open, onOpenChange, disabled) go to the Radix root. defaultOpen is true and is applied before your props." },
                { k: "className", v: "Merged after not-prose group mb-4 w-full overflow-hidden rounded-md border." },
              ]}
            />
          ),
        },
        {
          label: "SandboxHeader",
          body: (
            <Meta
              items={[
                { k: "state", v: "ToolUIPart[\"state\"], required. One of input-streaming, input-available, output-available, output-error and the approval states the badge supports." },
                { k: "title?", v: "string. Shown in the type-nav role beside a code icon." },
                { k: "className?", v: "string. Merged onto the trigger." },
              ]}
            />
          ),
        },
        {
          label: "SandboxContent",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof CollapsibleContent>", v: "Animates its own height. The upstream fade and slide classes are not used." },
              ]}
            />
          ),
        },
        {
          label: "SandboxTabs",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof Tabs>", v: "value, defaultValue and onValueChange. Adds w-full gap-0." },
              ]}
            />
          ),
        },
        {
          label: "SandboxTabsBar",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<\"div\">", v: "A flex row with top and bottom borders holding the TabsList." },
              ]}
            />
          ),
        },
        {
          label: "SandboxTabsList",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof TabsList>", v: "Always the line variant, with the travelling underline." },
              ]}
            />
          ),
        },
        {
          label: "SandboxTabsTrigger",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof TabsTrigger>", v: "value is required by Tabs. Keeps min-h-(--size-target-min), px-4 and a square corner." },
              ]}
            />
          ),
        },
        {
          label: "SandboxTabContent",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof TabsContent>", v: "value must match a trigger. Adds mt-0." },
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
      description: "Built on Radix Collapsible and Tabs, so the roles, states and keyboard model come from them.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Disclosure", v: "The header is a button that toggles the region; Radix sets aria-expanded and aria-controls. Its name is the title plus the status badge text, so the status is read with the title." },
                { k: "Tabs", v: "SandboxTabsList is role=tablist, each trigger role=tab with aria-selected, each content role=tabpanel. Left and Right arrows move between tabs; Home and End jump to the ends." },
                { k: "Keyboard", v: "Tab reaches the header, then the active tab; Enter or Space toggles the card." },
                { k: "Target size", v: "The header and the tab triggers keep min-h-(--size-target-min), the full 44px." },
                { k: "Motion", v: "The card opens and closes by animating its height (anim-expand and anim-collapse on CollapsibleContent); the header chevron turns 180 degrees on duration-normal with ease-emphasized. The blanket prefers-reduced-motion rule collapses both." },
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
              {"Running code produces two things a reader wants separately, the source and what it printed, and a status that changes while the call runs. The AgentWorkspace draws its \"sandbox\" tool output with this card (components/agent/workspace/workspace-outputs.tsx): the header takes the tool call's state and a title that defaults to the language, the Output tab is open first, and both tabs hold a CodeBlock with a copy button that toasts."}
            </Note>
          ),
        },
        {
          label: "Vendored changes",
          body: (
            <Note tone="action">
              {"The chevron is the system's Icon and its bare transition-transform, which was silently instant, now runs on duration-normal and ease-emphasized, the same pair the navigation-menu chevron uses. The upstream tw-animate fade and slide classes on the content are dropped, because CollapsibleContent already animates its measured height and layering both would play two unrelated animations. SandboxTabsList passes variant=\"line\" to the real TabsList instead of hand-rolling a border, which also gives it the travelling underline."}
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
