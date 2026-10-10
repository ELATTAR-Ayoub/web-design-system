import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { SourcesExamples, SourcesPreview, SourcesStateGrid } from "./sources-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-sources",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: 'A "Used 3 sources" line that opens the list of pages a reply drew on. Each source is a link that opens in a new tab.',
      label: "Sources",
      render: <SourcesPreview />,
      source: `import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources";

<Sources>
  <SourcesTrigger count={sources.length} />
  <SourcesContent>
    {sources.map((s) => (
      <Source href={s.url} key={s.url} title={s.title} />
    ))}
  </SourcesContent>
</Sources>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It is built on the system Collapsible and Icon.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "SourcesTrigger needs count, because it prints it; Sources does not count its children. Put one Source per link inside SourcesContent. Place it under the reply it supports and pass mb-0 when the surrounding layout already spaces things, as the workspace does.",
      language: "tsx",
      code: `import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources";

<Sources className="mb-0">
  <SourcesTrigger count={sources.length} />
  <SourcesContent>
    {sources.map((s) => (
      <Source href={s.url} key={s.id} title={s.title} />
    ))}
  </SourcesContent>
</Sources>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Closed or open, and the links inside.",
      blocks: [
        { body: <SourcesStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: closed, only the trigger shows, in the action ink colour. <strong>open</strong>: the list unfolds with
                anim-expand and the chevron stays as it is; the trigger&apos;s chevron here does not rotate. <strong>hover</strong>,{" "}
                <strong>focus-visible</strong> and <strong>pressed</strong>: the trigger and each Source have no hover or pressed styling of their
                own, only the browser&apos;s link behaviour and the system-wide 2px focus ring from styles/tokens.css. <strong>empty</strong>: with
                zero sources the trigger would say &quot;Used 0 sources&quot;, so a caller should not mount Sources then; the workspace renders it
                only when the reply has sources. <strong>loading</strong>, <strong>success</strong>, <strong>error</strong> and{" "}
                <strong>disabled</strong>: N/A. The list is data the caller already has, a link either opens or the browser handles the failure,
                and there is no reason to stop the reader opening it.
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
      description: "A custom trigger label, and Source rows built from your own children.",
      label: "Custom",
      render: <SourcesExamples />,
      source: `<Sources>
  <SourcesTrigger count={2}>
    <span className="type-nav">Where this came from</span>
  </SourcesTrigger>
  <SourcesContent>
    <Source href="https://example.com/a">
      <span className="type-nav">Example A</span>
      <span className="type-small text-muted-foreground">example.com</span>
    </Source>
  </SourcesContent>
</Sources>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/sources.tsx.",
      blocks: [
        {
          label: "Sources",
          anchor: "api-sources",
          body: (
            <Meta
              items={[
                { k: "…div props", v: 'The props of the Collapsible it renders, so open, defaultOpen and onOpenChange are typed. Base class: "not-prose mb-4 type-small text-action-ink".' },
              ]}
            />
          ),
        },
        {
          label: "SourcesTrigger",
          anchor: "api-sources-trigger",
          body: (
            <Meta
              items={[
                { k: "count", v: 'number, required. Printed as "Used 1 source" / "Used {count} sources".' },
                { k: "children?", v: "ReactNode. Replaces the label and the chevron." },
                { k: "…CollapsibleTrigger props", v: "Base: a flex row with gap-2 and a 44px hit area from an after: pseudo-element." },
              ]}
            />
          ),
        },
        {
          label: "SourcesContent",
          anchor: "api-sources-content",
          body: (
            <Meta
              items={[{ k: "…CollapsibleContent props", v: 'Base class: "mt-3 flex w-fit flex-col gap-2 outline-none". Opens with anim-expand and closes with anim-collapse.' }]}
            />
          ),
        },
        {
          label: "Source",
          anchor: "api-source",
          body: (
            <Meta
              items={[
                { k: "href?", v: "string. The link target." },
                { k: "title?", v: "string. Shown in type-nav next to a book icon when there are no children." },
                { k: "children?", v: "ReactNode. Replaces the icon and title." },
                { k: "…anchor props", v: 'Spread after the defaults. Always target="_blank" rel="noreferrer" unless overridden; the row is flex items-center gap-2.' },
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
      description: "A disclosure button and a list of links.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role and state", v: "The trigger is a button with aria-expanded from Radix Collapsible. Each Source is a real anchor." },
                { k: "Names", v: 'The trigger reads "Used N sources" and each link its title. A Source with children and no title needs its own text, or the link has no name.' },
                { k: "New tab", v: "Links open in a new tab and nothing tells a screen reader so; add a visually hidden hint in children if that matters for your audience." },
                { k: "Keyboard", v: "Tab to the trigger, Enter or Space toggles; Tab then moves through the links." },
                { k: "Target size", v: "The trigger is one line of small text. An after: pseudo-element extends its hit area to 44px high without moving the layout. The links are single lines of type-nav text, about 20px tall, with gap-2 between them, so they sit below the 44px floor; a dense list of links, not standalone buttons." },
                { k: "Colour", v: "Text uses text-action-ink, the theme-aware ink, never the fill shade." },
                { k: "Motion", v: "The list opens with anim-expand, a CSS animation the blanket prefers-reduced-motion rule collapses." },
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
                A reply that used the web or the reader&apos;s files has to say where it got things. Sources is the quiet version: one line under the
                answer, opened on demand. The AgentWorkspace renders it at the end of a reply in{" "}
                <code className="type-code">components/agent/workspace/workspace-reply.tsx</code>, one Source per cited page, whenever the reply has
                any. The same sources also feed the inline citation badges inside the text (see ai-inline-citation).
              </p>
              <p className="mt-3">
                The vendored changes: the text colour was <code className="type-code">text-primary</code>, the action ramp&apos;s fill shade, which
                fails contrast in one theme, so it takes <code className="type-code">text-action-ink</code>; the trigger gets a 44px hit area; and
                the hand-rolled enter, exit, slide and fade classes on the content are gone, because the Collapsible already animates from the
                measured Radix height and the extras were a second, conflicting animation.
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
