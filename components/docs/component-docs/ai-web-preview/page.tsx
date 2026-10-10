import { WebPreviewPreview, WebPreviewStateGrid } from "./web-preview-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-web-preview",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A frame showing an inline document. The address field is read-only here so the docs never load a remote site; open the console to see the log lines.",
      label: "WebPreview",
      render: <WebPreviewPreview />,
      source: "import {\n  WebPreview,\n  WebPreviewBody,\n  WebPreviewConsole,\n  WebPreviewNavigation,\n  WebPreviewNavigationButton,\n  WebPreviewUrl,\n} from \"@/components/ai-elements/web-preview\";\n\n<WebPreview className=\"h-80\" defaultUrl=\"https://example.com\">\n  <WebPreviewNavigation>\n    <WebPreviewNavigationButton tooltip=\"Reload\">\n      <Icon icon={RefreshCcwIcon} size=\"md\" tone=\"inherit\" />\n    </WebPreviewNavigationButton>\n    <WebPreviewUrl />\n  </WebPreviewNavigation>\n  <WebPreviewBody />\n  <WebPreviewConsole logs={logs} />\n</WebPreview>",
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
            {"Only hand it an http or https address. The workspace checks with isWebUrl (components/agent/workspace/tool-output.ts) before mounting it; the frame itself does not validate, so a javascript: or data: URL would be loaded as given. The specimens on this page use about:blank with an inline srcDoc and a read-only address field so they never load a remote site."}
          </p>
        </>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "WebPreview is the root and holds the shared url and console-open state (seed the console open with defaultConsoleOpen); WebPreviewUrl, WebPreviewBody and WebPreviewConsole read it and throw outside it. The address field commits on Enter, which updates the frame. Give the root a height: it is size-full, so it fills its parent.",
      language: "tsx",
      code: "<WebPreview className=\"h-96\" defaultUrl={url} onUrlChange={setUrl}>\n  <WebPreviewNavigation>\n    <WebPreviewUrl />\n    <WebPreviewNavigationButton onClick={openInNewTab} tooltip=\"Open in new tab\">\n      <Icon icon={ExternalLinkIcon} size=\"md\" tone=\"inherit\" />\n    </WebPreviewNavigationButton>\n  </WebPreviewNavigation>\n  <WebPreviewBody />\n  <WebPreviewConsole logs={logs} />\n</WebPreview>",
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The frame has a few visible conditions of its own; the buttons and the address field inherit Button and Input states.",
      blocks: [
        {
          body: <WebPreviewStateGrid />,
        },
        {
          label: "Every state, classified",
          body: (
            <Meta
              items={[
                { k: "rest", v: "A rounded-lg bordered card: a toolbar row, the iframe filling the rest, and a Console bar at the bottom when WebPreviewConsole is present." },
                { k: "hover", v: "WebPreviewNavigationButton takes Button's ghost hover plus a foreground text colour, and opens its tooltip. The Console trigger takes a muted hover fill." },
                { k: "focus-visible", v: "Inherited: Button's ring on the toolbar buttons and the Console trigger, Input's ring on the address field. The iframe is focusable as a document." },
                { k: "pressed", v: "Inherited from Button on the toolbar buttons and the Console trigger. N/A on the frame." },
                { k: "loading", v: "WebPreviewBody renders its loading prop as a sibling after the iframe, when you pass one; the component never decides when to show it and does not position it over the frame. It is typed as ReactNode — the iframe's own loading attribute is omitted from the props — so a JSX element (a Spinner, a skeleton) type-checks." },
                { k: "success", v: "N/A: loading a page has no completion state the component can observe. The workspace toasts nothing here." },
                { k: "error", v: "N/A for the frame: it cannot see why a page failed to load. Page errors are reported by the caller through the logs of WebPreviewConsole, shown in the destructive ink colour." },
                { k: "disabled", v: "WebPreviewNavigationButton forwards disabled to Button and keeps its tooltip. The address field accepts disabled and readOnly through Input. There is no whole-frame disabled state." },
                { k: "empty", v: "With no URL the iframe has no src and shows blank. With no logs the opened console reads \"No console output\"." },
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
      description: "Read from components/ai-elements/web-preview.tsx.",
      blocks: [
        {
          label: "WebPreview",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<\"div\">", v: "Everything a div takes. Base classes are flex size-full flex-col rounded-lg border bg-card." },
                { k: "defaultUrl?", v: "string, default \"\". The initial address. Uncontrolled: there is no url prop." },
                { k: "onUrlChange?", v: "(url: string) => void. Called whenever the url is set, which happens when the user presses Enter in WebPreviewUrl." },
                { k: "defaultConsoleOpen?", v: "boolean, default false. Starts with the console open — its open state lives in the root, so this is the way to show it open without a press." },
              ]}
            />
          ),
        },
        {
          label: "WebPreviewNavigation",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<\"div\">", v: "The toolbar row: flex, gap-1, p-2, bottom border." },
              ]}
            />
          ),
        },
        {
          label: "WebPreviewNavigationButton",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof Button>", v: "Rendered as a ghost icon-sm Button (32px); size and variant are fixed. onClick and disabled are forwarded." },
                { k: "tooltip?", v: "string. The tooltip text. A tooltip is always mounted, so an omitted value shows an empty one." },
              ]}
            />
          ),
        },
        {
          label: "WebPreviewUrl",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<typeof Input>", v: "Every Input prop. The placeholder defaults to \"Enter URL...\"." },
                { k: "value?", v: "string. Overrides the typed text. When omitted the field keeps its own text and re-syncs when the shared url changes." },
                { k: "onChange? / onKeyDown?", v: "Handlers called alongside the built-in ones. Passing onChange replaces the built-in typing handler, so also pass value." },
              ]}
            />
          ),
        },
        {
          label: "WebPreviewBody",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<\"iframe\">", v: "Every iframe prop except that title is \"Preview\" and sandbox is fixed to allow-scripts allow-same-origin allow-forms allow-popups allow-presentation. Both are applied before your props, so title can be overridden; sandbox can be too, which you should not do." },
                { k: "src?", v: "string. Overrides the shared url when set." },
                { k: "loading?", v: "Rendered after the iframe, inside the same wrapper. ReactNode. The iframe's own loading attribute is omitted from the props, so a JSX element type-checks." },
              ]}
            />
          ),
        },
        {
          label: "WebPreviewConsole",
          body: (
            <Meta
              items={[
                { k: "...ComponentProps<\"div\">", v: "Passed to the Collapsible root." },
                { k: "logs?", v: "{ level: \"log\" | \"warn\" | \"error\"; message: string; timestamp: Date }[], default []. Colours: error uses text-destructive-ink, warn text-warning-ink, log text-foreground." },
                { k: "children?", v: "ReactNode. Rendered after the log lines, inside the scrolling area." },
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
      description: "The frame is a set of native controls around an iframe; the iframe and the icon-only buttons need their names supplied.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Iframe", v: "The frame has title=\"Preview\" by default. Override title when more than one preview is on a page so each is distinguishable. The sandbox attribute limits what the loaded page can do but still allows scripts and same-origin access, so only load addresses you trust." },
                { k: "Address field", v: "WebPreviewUrl is an Input with a placeholder but no label. Pass aria-label (the specimens use \"Address\"). Enter commits the address; typing alone does not navigate." },
                { k: "Icon-only buttons", v: "WebPreviewNavigationButton wraps its child in a Button and a Tooltip, but the tooltip is not the button's accessible name. Put sr-only text inside the button, as the specimen does with \"Reload\"." },
                { k: "Console", v: "The Console trigger is a Button with the visible text \"Console\", and Radix wires aria-expanded and aria-controls to the panel. Log lines are plain text; their level is shown by colour and is not announced, so the message text should say what it is." },
                { k: "Target size", v: "The toolbar buttons are icon-sm (32px), allowed because they sit in a toolbar beside the address field. The Console trigger keeps min-h-(--size-target-min), the full 44px." },
                { k: "Motion", v: "The Console chevron rotates on duration-normal with ease-emphasized, and the panel animates its height; the blanket prefers-reduced-motion rule collapses both." },
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
              {"An agent that builds or opens a page needs to show it without leaving the conversation, with an address it can read and a console for what the page logged. The AgentWorkspace uses it for the \"web-preview\" tool output (components/agent/workspace/workspace-outputs.tsx): a read-write WebPreviewUrl, an Open in new tab navigation button that calls window.open with noopener and noreferrer only when isWebUrl passes, a WebPreviewBody, and a WebPreviewConsole fed from the tool result's logs. The output is only accepted at all when its url passes isWebUrl (tool-output.ts)."}
            </Note>
          ),
        },
        {
          label: "Vendored changes",
          body: (
            <Note tone="action">
              {"WebPreviewNavigationButton routes the upstream h-8 w-8 p-0 override onto the real icon-sm size (32px), because these buttons sit in a toolbar beside other small controls where RULES section 7 allows 32px. The Console trigger moves its type role onto an inner span, because Button's own text-sm in the utilities layer beats type-nav in the components layer when both are on the button. Its chevron is now the system's Icon on duration-normal and ease-emphasized instead of a raw glyph with an untokenised numeric duration."}
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
