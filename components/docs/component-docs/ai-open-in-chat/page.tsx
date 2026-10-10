/**
 * Authored documentation page for `ai-open-in-chat`.
 *
 * Every live specimen renders the real menu from
 * `components/ai-elements/open-in-chat.tsx` in `open-in-chat-specimen.tsx`.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { OpenInExamples, OpenInPreview, OpenInStateGrid } from "./open-in-chat-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-open-in-chat",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A menu that continues a prompt in a chat service you supply. Each item is a link that opens that service in a new tab with the text already filled in. Nothing is sent from this page, and no service is built in.",
      label: "OpenIn",
      render: <OpenInPreview />,
      source: `import {
  OpenIn, OpenInContent, OpenInLabel, OpenInLink, OpenInSeparator, OpenInTrigger,
  type OpenInTarget,
} from "@/components/ai-elements/open-in-chat";

const exampleChat: OpenInTarget = {
  id: "example",
  title: "Open in Example Chat",
  createUrl: (query) => \`https://example.com/chat?\${new URLSearchParams({ q: query })}\`,
};

<OpenIn query={prompt}>
  <OpenInTrigger />
  <OpenInContent>
    <OpenInLabel>Open in</OpenInLabel>
    <OpenInSeparator />
    <OpenInLink target={exampleChat} />
  </OpenInContent>
</OpenIn>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It is built on the system DropdownMenu, Button and Icon. It ships no chat service and no brand logo: you pass each target.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "OpenIn holds the query; every OpenInLink reads it from context, so the links must be inside OpenIn. An OpenInTarget is { id, title, icon?, createUrl(query) }: you decide which services appear and how the query is put in each address. The query leaves the page when a link is followed and reaches that service: send only text the reader would be comfortable pasting there.",
      language: "tsx",
      code: `import {
  OpenIn,
  OpenInContent,
  OpenInLabel,
  OpenInLink,
  OpenInTrigger,
  type OpenInTarget,
} from "@/components/ai-elements/open-in-chat";

const targets: OpenInTarget[] = [
  { id: "intranet", title: "Open in Intranet Chat", createUrl: (q) => \`/chat?q=\${encodeURIComponent(q)}\` },
];

<OpenIn query={userMessage.text}>
  <OpenInTrigger>
    <MessageAction label="Open in…" tooltip="Open in…">
      <Icon icon={ExternalLinkIcon} size="sm" tone="inherit" />
    </MessageAction>
  </OpenInTrigger>
  <OpenInContent>
    <OpenInLabel>Open in</OpenInLabel>
    {targets.map((t) => (
      <OpenInLink key={t.id} target={t} />
    ))}
  </OpenInContent>
</OpenIn>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The trigger is a Button; the items are DropdownMenu items rendered as links.",
      blocks: [
        { body: <OpenInStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: the default trigger is a Button, variant outline, reading &quot;Open in chat&quot; with a chevron.{" "}
                <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong>: inherited from Button on the trigger and from
                DropdownMenuItem on the rows (the highlighted row is the one the arrow keys or pointer are on). <strong>open</strong>: the menu is
                a DropdownMenuContent aligned to the start, 15rem wide; each row has the target icon (a chat bubble when it has none), its name and an external-link icon.{" "}
                <strong>disabled</strong>: put disabled on the Button you pass to OpenInTrigger, or on an item (items take DropdownMenuItem props);
                the default trigger has no disabled prop of its own beyond what OpenInTrigger forwards. <strong>empty</strong>: an empty query
                still builds a link to the service with an empty prompt; the caller should not offer the menu with nothing to send.{" "}
                <strong>loading</strong>, <strong>success</strong> and <strong>error</strong>: N/A. A row is a plain link, and the page cannot know
                whether the other service loaded; the browser handles that in the new tab.
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
      description: "A custom trigger and two targets.",
      label: "Custom",
      render: <OpenInExamples />,
      source: `<OpenIn query={prompt}>
  <OpenInTrigger>
    <Button size="sm" type="button" variant="ghost">Continue elsewhere</Button>
  </OpenInTrigger>
  <OpenInContent>
    <OpenInLink target={intranetChat} />
    <OpenInLink target={notes} />
  </OpenInContent>
</OpenIn>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/open-in-chat.tsx.",
      blocks: [
        {
          label: "OpenIn",
          anchor: "api-open-in",
          body: (
            <Meta
              items={[
                { k: "query", v: "string, required. The prompt passed to each target's createUrl." },
                { k: "…DropdownMenu props", v: "open, defaultOpen, onOpenChange, modal and the rest." },
              ]}
            />
          ),
        },
        {
          label: "OpenInTrigger, OpenInContent",
          anchor: "api-open-in-trigger",
          body: (
            <Meta
              items={[
                { k: "OpenInTrigger.children?", v: 'ReactNode, rendered asChild. Default: a Button variant outline reading "Open in chat" with a chevron.' },
                { k: "OpenInTrigger…", v: "DropdownMenuTrigger props." },
                { k: "OpenInContent", v: 'DropdownMenuContent props. align="start", base class "w-60".' },
              ]}
            />
          ),
        },
        {
          label: "OpenInItem, OpenInLabel, OpenInSeparator",
          anchor: "api-open-in-item",
          body: (
            <Meta
              items={[
                { k: "OpenInItem", v: "DropdownMenuItem props, for an entry of your own." },
                { k: "OpenInLabel", v: "DropdownMenuLabel props. Names the group; it is not interactive." },
                { k: "OpenInSeparator", v: "DropdownMenuSeparator props." },
              ]}
            />
          ),
        },
        {
          label: "OpenInLink, OpenInTarget",
          anchor: "api-open-in-link",
          body: (
            <Meta
              items={[
                { k: "OpenInLink.target", v: "OpenInTarget, required. The service this row opens." },
                { k: "OpenInLink…", v: "DropdownMenuItem props except children." },
                { k: "OpenInTarget.id", v: "string. Stable key for the row." },
                { k: "OpenInTarget.title", v: 'string. The row text, such as "Open in Intranet Chat".' },
                { k: "OpenInTarget.icon?", v: "ReactNode. Your own logo or glyph. Default: a chat-bubble Icon." },
                { k: "OpenInTarget.createUrl", v: "(query: string) => string. Builds the address the row links to; encode the query yourself." },
                { k: "Rendering", v: 'An anchor (asChild) with target="_blank" and rel="noopener noreferrer", a flex row of icon, title and an external-link icon.' },
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
      description: "A Radix dropdown menu whose items are links.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles", v: 'The trigger is a button with aria-haspopup="menu" and aria-expanded. The content has role menu, and each target is a menuitem wrapping an anchor.' },
                { k: "Names", v: 'The default trigger reads "Open in chat". An icon-only custom trigger needs an aria-label. Each item reads its target title, such as "Open in Intranet Chat". Give a custom icon its own accessible name only if it carries meaning the title does not.' },
                { k: "Keyboard", v: "Enter, Space or the Down arrow on the trigger opens the menu; Up and Down move, Enter follows the link, Escape closes and returns focus to the trigger. Typing a letter jumps to a matching item." },
                { k: "New tab", v: "Each row opens a new tab. The external-link icon marks it visually; there is no text for a screen reader beyond the name." },
                { k: "Target size", v: "The default trigger is a regular Button. Menu rows are DropdownMenuItem rows, the system's menu density, not standalone targets." },
                { k: "Motion", v: "The menu enters and leaves with the DropdownMenu's own animation, a CSS animation that the blanket prefers-reduced-motion rule collapses." },
                { k: "Privacy", v: "Following a row sends the query to the service you configured. The menu says nothing about that, so decide what you pass as the query accordingly." },
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
              <p>
                Sometimes the right next step is another tool. Open in Chat hands a prompt over without copying and pasting. The AgentWorkspace puts
                it in the action row under a reply in{" "}
                <code className="type-code">components/agent/workspace/workspace-reply.tsx</code>, with the text of the user message the reply answers as the query, and
                only when you pass <code className="type-code">openIn</code> targets.
              </p>
              <p className="mt-3">
                The file differs from upstream in one way, marked with a &quot;Vendored change:&quot; comment: the built-in providers and their brand icons are removed and
                callers pass OpenInTarget. It uses the system DropdownMenu, Button and Icon, so it picks up the system&apos;s tokens through them.
              </p>
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
