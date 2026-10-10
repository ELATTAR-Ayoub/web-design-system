/**
 * Authored documentation page for `ai-jsx-preview`.
 *
 * Every live specimen renders the real component from `components/ai-elements/jsx-preview.tsx`.
 * Anything interactive lives in the companion client file
 * `jsx-preview-specimen.tsx` (a spec module cannot carry "use client").
 */

import { JsxPreviewPlayground, JsxPreviewStateGrid } from "./jsx-preview-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-jsx-preview",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "Press Reveal more to feed the string in 40 characters at a time. While it is incomplete the open tags are closed for you, so the card grows instead of failing.",
      label: "JSXPreview",
      render: <JsxPreviewPlayground />,
      source: "import {\n  JSXPreview,\n  JSXPreviewContent,\n  JSXPreviewError,\n} from \"@/components/ai-elements/jsx-preview\";\n\n<JSXPreview isStreaming={streaming} jsx={partialJsx}>\n  <JSXPreviewContent />\n  <JSXPreviewError className=\"mt-2\" />\n</JSXPreview>",
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
            {"It depends on the react-jsx-parser package, which parses the string into React elements. Only HTML elements and the components you pass in components are available to the markup."}
          </p>
        </>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "JSXPreview holds the jsx string and the streaming flag; JSXPreviewContent renders it and JSXPreviewError shows the failure. Set isStreaming while the string is still arriving: incomplete trailing tags are removed and open tags are closed, and parse errors are swallowed in favour of the last version that rendered. Pass components to make your own elements available to the markup, and bindings for values it may reference.",
      language: "tsx",
      code: "<JSXPreview\n  className=\"rounded-lg border bg-card p-4\"\n  components={{ Badge }}\n  isStreaming={running}\n  jsx={output.jsx}\n  onError={(error) => report(error)}\n>\n  <JSXPreviewContent />\n  <JSXPreviewError className=\"mt-2\" />\n</JSXPreview>",
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The container has no frame of its own. What changes is what JSXPreviewContent shows and whether JSXPreviewError appears.",
      blocks: [
        {
          body: <JsxPreviewStateGrid />,
        },
        {
          label: "Every state, classified",
          body: (
            <Meta
              items={[
                { k: "rest", v: "The parsed elements, rendered in a div with the class jsx-preview-content and no wrapper of their own. JSXPreview is a relative div with no border or padding unless you add them." },
                { k: "hover", v: "N/A: no interactive parts. Anything interactive in the rendered markup is whatever the string contains." },
                { k: "focus-visible", v: "N/A for the same reason: the component adds nothing focusable." },
                { k: "pressed", v: "N/A: no controls." },
                { k: "loading", v: "isStreaming repairs the string (closes open tags, drops a trailing half tag). If a streamed step does not parse, the last version that did parse stays on screen and no error is reported or shown." },
                { k: "success", v: "N/A: a successful parse simply renders; there is no confirmation." },
                { k: "error", v: "When not streaming and the JSX fails to parse, JSXPreviewError renders a destructive-bordered block with an alert icon and the error message, and onError is called once for that string. A new jsx value clears it." },
                { k: "disabled", v: "N/A: the component takes no input, so there is nothing to disable." },
                { k: "empty", v: "An empty or whitespace string renders nothing in JSXPreviewContent and no error." },
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
      description: "Read from components/ai-elements/jsx-preview.tsx.",
      blocks: [
        {
          label: "JSXPreview",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<\"div\">", v: "Everything a div takes. Memoised. The base class is relative." },
                { k: "jsx", v: "string, required. The markup to render." },
                { k: "isStreaming?", v: "boolean, default false. Repairs incomplete markup and suppresses errors, falling back to the last version that rendered." },
                { k: "components?", v: "JsxParserProps[\"components\"]. React components the markup may use by tag name." },
                { k: "bindings?", v: "JsxParserProps[\"bindings\"]. Values the markup may reference." },
                { k: "onError?", v: "(error: Error) => void. Called once per failing string, and never while streaming." },
              ]}
            />
          ),
        },
        {
          label: "JSXPreviewContent",
          body: (
            <Meta
              items={[
                { k: "...Omit<ComponentProps<\"div\">, \"children\">", v: "Reads everything else from JSXPreview. Rendered as a div with the class jsx-preview-content; the parser renders its output with renderInWrapper off." },
              ]}
            />
          ),
        },
        {
          label: "JSXPreviewError",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<\"div\">", v: "Returns null when there is no error." },
                { k: "children?", v: "ReactNode | ((error: Error) => ReactNode). Replaces the default icon and message; a function receives the error." },
              ]}
            />
          ),
        },
        {
          label: "useJSXPreview",
          body: (
            <Meta
              items={[
                { k: "() => context", v: "Exported hook returning jsx, processedJsx, isStreaming, error and the setters. Throws outside JSXPreview." },
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
      description: "The component adds no semantics; the accessibility of the preview is the accessibility of the markup it is given.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: "None added. The rendered tree is exactly the elements in the string, so a string with an img needs its own alt and a button its own name." },
                { k: "Error block", v: "JSXPreviewError is not a live region, so a screen reader is not told when an error appears. The error colour is text-destructive-ink on a tinted destructive surface, and the alert icon is decorative beside the message text. Pass role=\"alert\" through props if the error should be announced." },
                { k: "Keyboard", v: "No handlers of its own. Whatever focusable elements the markup contains take part in the normal tab order." },
                { k: "Target size", v: "N/A: there are no controls of its own. Controls in the rendered markup follow the same rules as any other control." },
                { k: "Motion", v: "None. Streaming re-renders the content without an animation." },
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
              {"A model can answer with a small interface instead of prose, and that interface arrives token by token. The AgentWorkspace renders its \"jsx-preview\" tool output with JSXPreview, JSXPreviewContent and a JSXPreviewError with mt-2 (components/agent/workspace/workspace-outputs.tsx), passing isStreaming while the tool call is still running so the card fills in instead of flashing an error on every partial chunk."}
            </Note>
          ),
        },
        {
          label: "Vendored changes",
          body: (
            <Note tone="action">
              {"JSXPreviewContent replaces a hadError boolean that was reset inside an effect, and a render-time read of a ref, with a single state value keyed to the jsx that errored. It goes stale, and is ignored, as soon as the processed JSX changes, which is what the reset effect did, without tripping the react-hooks rules about setting state in effects and reading refs in render."}
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
