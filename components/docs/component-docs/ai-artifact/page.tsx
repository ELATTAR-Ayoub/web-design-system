import { ArtifactPreview, ArtifactStateGrid } from "./artifact-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-artifact",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A generated file in an Artifact. Hover or focus an action to see its tooltip.",
      label: "Artifact",
      render: <ArtifactPreview />,
      source: "import {\n  Artifact,\n  ArtifactAction,\n  ArtifactActions,\n  ArtifactContent,\n  ArtifactDescription,\n  ArtifactHeader,\n  ArtifactTitle,\n} from \"@/components/ai-elements/artifact\";\nimport { CopyIcon, DownloadIcon } from \"lucide-react\";\n\n<Artifact>\n  <ArtifactHeader>\n    <div>\n      <ArtifactTitle>total.ts</ArtifactTitle>\n      <ArtifactDescription>Created by the agent, 4 lines</ArtifactDescription>\n    </div>\n    <ArtifactActions>\n      <ArtifactAction icon={CopyIcon} label=\"Copy\" tooltip=\"Copy to clipboard\" />\n      <ArtifactAction icon={DownloadIcon} label=\"Download\" tooltip=\"Download file\" />\n    </ArtifactActions>\n  </ArtifactHeader>\n  <ArtifactContent>{/* the file */}</ArtifactContent>\n</Artifact>",
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
            {"It sits on Button, Icon and Tooltip from components/ui; nothing else is needed."}
          </p>
        </>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "Artifact is only a frame: it owns no state and no behaviour. Pass icon, label and tooltip to ArtifactAction so the button has an accessible name; the label (or the tooltip when there is no label) becomes its screen-reader text. Put the real content, a code block for example, inside ArtifactContent.",
      language: "tsx",
      code: "<Artifact>\n  <ArtifactHeader>\n    <div>\n      <ArtifactTitle>{title}</ArtifactTitle>\n      <ArtifactDescription>{description}</ArtifactDescription>\n    </div>\n    <ArtifactActions>\n      <ArtifactAction icon={CopyIcon} label=\"Copy\" onClick={copy} tooltip=\"Copy to clipboard\" />\n    </ArtifactActions>\n  </ArtifactHeader>\n  <ArtifactContent className=\"p-0\">\n    <CodeBlock code={content} language=\"tsx\" />\n  </ArtifactContent>\n</Artifact>",
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Artifact is a static frame. Its only interactive parts are the buttons in the header, which inherit Button's states.",
      blocks: [
        {
          body: <ArtifactStateGrid />,
        },
        {
          label: "Every state, classified",
          body: (
            <Meta
              items={[
                { k: "rest", v: "A rounded-lg bordered card with a muted header band and a content area; the shadow-e1 elevation sits on the root." },
                { k: "hover", v: "Only ArtifactAction and ArtifactClose react: they are ghost icon-sm Buttons and take Button's hover fill. The frame itself does not change." },
                { k: "focus-visible", v: "Inherited from Button on ArtifactAction and ArtifactClose. The frame is not focusable." },
                { k: "pressed", v: "Inherited from Button on the two button parts. N/A on the frame." },
                { k: "loading", v: "N/A: Artifact renders what it is given and has no pending state. A caller that is still generating shows its own placeholder in ArtifactContent." },
                { k: "success", v: "N/A: no operation of its own to confirm. The workspace toasts from the copy and download handlers it passes to ArtifactAction." },
                { k: "error", v: "N/A: nothing here can fail. Copy failures are reported by the caller that owns the handler." },
                { k: "disabled", v: "ArtifactAction and ArtifactClose forward disabled to Button, which dims them and blocks the click. The frame has no disabled state." },
                { k: "empty", v: "ArtifactContent with no children renders an empty padded area; the specimen above shows the usual choice of a one-line message inside it." },
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
      description: "Read from components/ai-elements/artifact.tsx.",
      blocks: [
        {
          label: "Artifact",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "Everything a div takes. className is merged after the base classes." },
              ]}
            />
          ),
        },
        {
          label: "ArtifactHeader",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "A flex row with justify-between, a bottom border and a muted band. Holds the title block on the left and ArtifactActions or ArtifactClose on the right." },
              ]}
            />
          ),
        },
        {
          label: "ArtifactClose",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof Button>", v: "Every Button prop, including onClick and disabled. It has no close behaviour of its own." },
                { k: "size?", v: "Button size, default \"icon-sm\"." },
                { k: "variant?", v: "Button variant, default \"ghost\"." },
                { k: "children?", v: "Replaces the default X icon. A visually hidden \"Close\" label is always added." },
              ]}
            />
          ),
        },
        {
          label: "ArtifactTitle",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLParagraphElement>", v: "A p set in the type-nav role." },
              ]}
            />
          ),
        },
        {
          label: "ArtifactDescription",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLParagraphElement>", v: "A p set in type-small, muted." },
              ]}
            />
          ),
        },
        {
          label: "ArtifactActions",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "A flex row with gap-1 for the action buttons." },
              ]}
            />
          ),
        },
        {
          label: "ArtifactAction",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof Button>", v: "Every Button prop, including onClick and disabled." },
                { k: "tooltip?", v: "string. When set, the button is wrapped in its own TooltipProvider and Tooltip showing this text. Without it there is no tooltip." },
                { k: "label?", v: "string. Visually hidden text inside the button; the accessible name. Falls back to tooltip." },
                { k: "icon?", v: "LucideIcon. Drawn through the Icon component at size md. Without it, children are rendered." },
                { k: "size?", v: "Button size, default \"icon-sm\"." },
                { k: "variant?", v: "Button variant, default \"ghost\"." },
              ]}
            />
          ),
        },
        {
          label: "ArtifactContent",
          body: (
            <Meta
              items={[
                { k: "...HTMLAttributes<HTMLDivElement>", v: "A flex-1 area that scrolls on overflow, with p-4. Pass className=\"p-0\" when the content brings its own padding." },
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
      description: "The frame is a plain div with no role; the interactive parts are real buttons that need a name.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: "ArtifactAction and ArtifactClose are native buttons with type=\"button\". The name comes from the sr-only span: label, then tooltip, then (for ArtifactClose) \"Close\". An ArtifactAction with neither label nor tooltip has no name, so always pass one." },
                { k: "Headings", v: "ArtifactTitle is a p, not a heading. When the page needs the artifact in its outline, pass your own heading element as the child of ArtifactTitle or place a heading beside it." },
                { k: "Keyboard", v: "Tab reaches each action in order; Enter or Space activates it. A tooltip opens on keyboard focus as well as on hover." },
                { k: "Target size", v: "The actions are icon-sm (32px). That is allowed only because they sit together in a header toolbar beside other small controls; a lone ArtifactClose is the same rung and should stay in the header band." },
                { k: "Motion", v: "None of its own. The tooltip uses the system's tooltip animation, which the blanket prefers-reduced-motion rule collapses." },
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
              {"Generated files, documents and code need a consistent frame that is not a message bubble: a title, a place for actions and a body that scrolls. The AgentWorkspace draws its \"artifact\" tool output with it (components/agent/workspace/workspace-outputs.tsx): ArtifactTitle and ArtifactDescription on the left, Copy and Download ArtifactActions on the right (each toasting its result), and a line-numbered CodeBlock in ArtifactContent with padding removed."}
            </Note>
          ),
        },
        {
          label: "Vendored changes",
          body: (
            <Note tone="action">
              {"ArtifactAction renames the upstream icon prop's local binding to Glyph, because the shadowed name collided with the file's own Icon import once raw Lucide glyphs were routed through the system's Icon component. Glyphs now go through Icon at size md."}
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
