/**
 * Authored documentation page for `ai-inline-citation`.
 *
 * Every live specimen renders the real parts from
 * `components/ai-elements/inline-citation.tsx` in `inline-citation-specimen.tsx`.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { InlineCitationExamples, InlineCitationPreview, InlineCitationStateGrid } from "./inline-citation-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-inline-citation",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A claim followed by a badge naming its source. Hover or focus the badge to open the card: with several sources it has previous and next buttons and an index.",
      label: "InlineCitation",
      render: <InlineCitationPreview />,
      source: `import {
  InlineCitation, InlineCitationCard, InlineCitationCardBody, InlineCitationCardTrigger,
  InlineCitationCarousel, InlineCitationCarouselContent, InlineCitationCarouselHeader,
  InlineCitationCarouselIndex, InlineCitationCarouselItem, InlineCitationCarouselNext,
  InlineCitationCarouselPrev, InlineCitationSource, InlineCitationText,
} from "@/components/ai-elements/inline-citation";

<InlineCitation>
  <InlineCitationText>The contract renews on 1 March.</InlineCitationText>
  <InlineCitationCard>
    <InlineCitationCardTrigger sources={urls} tabIndex={0} />
    <InlineCitationCardBody>
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselPrev />
          <InlineCitationCarouselNext />
          <InlineCitationCarouselIndex />
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          {sources.map((s) => (
            <InlineCitationCarouselItem key={s.url}>
              <InlineCitationSource description={s.description} title={s.title} url={s.url} />
            </InlineCitationCarouselItem>
          ))}
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    </InlineCitationCardBody>
  </InlineCitationCard>
</InlineCitation>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It is built on the system HoverCard, Badge, Carousel, Button and Icon.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "InlineCitation wraps the cited text and its badge in one span, so the hover highlight covers the claim. The trigger takes sources as an array of absolute URLs: it prints the first one's hostname and +n for the rest; a string that does not parse as a URL is shown as itself rather than throwing. The badge is focusable by default (tabIndex 0). Skip the header when there is only one source.",
      language: "tsx",
      code: `import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationSource,
  InlineCitationQuote,
  InlineCitationText,
} from "@/components/ai-elements/inline-citation";

<InlineCitation>
  <InlineCitationText>Notice is due sixty days ahead.</InlineCitationText>
  <InlineCitationCard>
    <InlineCitationCardTrigger sources={["https://contracts.example/renewal"]} tabIndex={0} />
    <InlineCitationCardBody>
      <div className="space-y-2 p-4">
        <InlineCitationSource title="Renewal terms" url="https://contracts.example/renewal" />
        <InlineCitationQuote>Renews automatically on 1 March.</InlineCitationQuote>
      </div>
    </InlineCitationCardBody>
  </InlineCitationCard>
</InlineCitation>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The badge at rest, and the card it opens.",
      blocks: [
        { body: <InlineCitationStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: a secondary Badge, ml-1, showing the first source&apos;s hostname. <strong>hover</strong>: the cited text gets
                a bg-accent highlight (<code className="type-code">group-hover:bg-accent</code> on InlineCitationText) and the card opens at once,
                with no open or close delay. <strong>focus-visible</strong>: the same card opens on focus, and the badge shows the system-wide 2px
                ring. <strong>pressed</strong>: no separate treatment; the badge is not a button. <strong>open</strong>: the card is a HoverCard
                portalled outside the text. With several sources the carousel pages between them; the index reads &quot;1/3&quot; and updates on
                select. <strong>empty</strong>: an empty sources array shows the badge text &quot;unknown&quot; and an empty card. {" "}
                <strong>loading</strong>, <strong>success</strong>, <strong>error</strong> and <strong>disabled</strong>: N/A. The citation is
                static data, there is nothing to wait for, and a source either has a URL or does not. A URL that does not parse is
                not a failure: the badge shows the string itself instead of a hostname (the workspace also falls back to the source&apos;s domain before it renders).
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
      description: "A single-source citation, and a card held open with the open prop so it can be seen without hovering.",
      label: "Single and open",
      render: <InlineCitationExamples />,
      source: `<InlineCitationCard open>
  <InlineCitationCardTrigger sources={urls} />
  <InlineCitationCardBody>…</InlineCitationCardBody>
</InlineCitationCard>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/inline-citation.tsx.",
      blocks: [
        {
          label: "InlineCitation, InlineCitationText",
          anchor: "api-inline-citation",
          body: (
            <Meta
              items={[
                { k: "InlineCitation", v: 'span props. Base class: "group inline items-center gap-1"; the group lets the text react to the badge being hovered.' },
                { k: "InlineCitationText", v: 'span props. Base class: "transition-colors group-hover:bg-accent".' },
              ]}
            />
          ),
        },
        {
          label: "InlineCitationCard and trigger",
          anchor: "api-inline-citation-card",
          body: (
            <Meta
              items={[
                { k: "InlineCitationCard", v: "HoverCard props: open, defaultOpen, onOpenChange. Open and close delays are fixed at 0 and come before your props, so you can override them." },
                { k: "InlineCitationCardTrigger.sources", v: 'string[], required. Absolute URLs. Shows the first hostname, plus "+n" when there are more; "unknown" when empty. Throws on a first entry that is not a valid URL.' },
                { k: "InlineCitationCardTrigger…", v: 'Badge props, variant "secondary", with ml-1. It is the HoverCard trigger, rendered asChild.' },
                { k: "InlineCitationCardBody", v: 'HoverCardContent props. Base class: "relative w-80 p-0".' },
              ]}
            />
          ),
        },
        {
          label: "Carousel parts",
          anchor: "api-inline-citation-carousel",
          body: (
            <Meta
              items={[
                { k: "InlineCitationCarousel", v: "Carousel props. Holds the embla API for its children. Base class: w-full." },
                { k: "InlineCitationCarouselContent", v: "CarouselContent props." },
                { k: "InlineCitationCarouselItem", v: 'CarouselItem props. Base class: "w-full space-y-2 p-4 pl-8".' },
                { k: "InlineCitationCarouselHeader", v: 'div props. A secondary bar: "flex items-center justify-between gap-2 rounded-t-md bg-secondary p-2".' },
                { k: "InlineCitationCarouselIndex", v: 'div props. type-small, muted. Reads "{current}/{count}" unless children is given.' },
                { k: "InlineCitationCarouselPrev / Next", v: 'Button props, size icon-sm, variant ghost, aria-label "Previous" / "Next". They scroll the carousel; they do not wrap, because embla\'s own loop setting decides.' },
              ]}
            />
          ),
        },
        {
          label: "Source and quote",
          anchor: "api-inline-citation-source",
          body: (
            <Meta
              items={[
                { k: "InlineCitationSource.title?", v: "string. An h4 in type-nav, truncated to one line." },
                { k: "InlineCitationSource.url?", v: "string. type-identifier, muted, truncated." },
                { k: "InlineCitationSource.description?", v: "string. type-small, muted, clamped to three lines." },
                { k: "InlineCitationSource.children?", v: "ReactNode, shown after the description." },
                { k: "InlineCitationQuote", v: 'blockquote props. type-small, italic, muted, with a border-l-2 rule.' },
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
      description: "A hover card opened from a badge. Hover alone excludes keyboard users, so the focus path matters.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Keyboard", v: "The badge is focusable by default (tabIndex 0, which a caller can override), so Tab reaches it; the card then opens on focus and closes on blur or Escape." },
                { k: "Name", v: 'The badge reads its text ("contracts.example +1"), which names the source but not the claim. A screen reader hears it straight after the cited text, which is the order a sighted reader sees.' },
                { k: "Card content", v: "The card is a popover with no role of its own beyond Radix's hover card, and its content is ordinary text and buttons. Keyboard focus can reach the Previous and Next buttons only if focus moves into the card; the card does not trap or take focus." },
                { k: "Carousel buttons", v: 'Named "Previous" and "Next", real Buttons.' },
                { k: "Target size", v: "The badge is a small pill (not a standalone target) inline in text. The two carousel buttons are icon-sm, 32px, which is allowed because they sit together in the header bar beside the index." },
                { k: "Motion", v: "The HoverCard and carousel use the system's CSS animations, which the blanket prefers-reduced-motion rule collapses; the highlight is a transition-colors." },
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
                A claim is more useful when the reader can check it where it stands. InlineCitation attaches the source to the sentence, and the card
                gives the title, the address and the passage without leaving the page. In the AgentWorkspace,{" "}
                <code className="type-code">components/agent/workspace/workspace-reply.tsx</code> rewrites markers like [1] and [2] in a reply into
                links, and the reply&apos;s markdown renders each one as an InlineCitation whose card holds an InlineCitationSource per source (the
                carousel header appears only when there is more than one). It also turns the badge into a keyboard stop with{" "}
                <code className="type-code">tabIndex={"{0}"}</code>.
              </p>
              <p className="mt-3">
                The vendored changes: the trigger drops <code className="type-code">rounded-full</code> because Badge already carries the pill
                radius; the carousel Previous and Next, which were raw buttons with no target beyond a 16px icon, are now Buttons at icon-sm; the
                Source and Quote use the type-nav, type-identifier and type-small roles; and the index syncs its state in a microtask so setState
                is not called synchronously in an effect.
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
