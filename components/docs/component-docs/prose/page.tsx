/**
 * Documentation page for `prose`.
 *
 * Authored, not generated. Web-only — no Flutter equivalent registry entry.
 * `Prose` is deliberately thin: every heading it renders shares its
 * declaration block with the matching `.type-*` role via a second
 * `:where(.prose)` selector in `styles/typeset.css`, rather than a second,
 * independently-tuned scale. Read the doc comment on `components/ui/prose.tsx`
 * for why `@apply type-h2` inside `.prose h2` fails the build outright.
 */

import { Code, Meta, Panel } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Prose } from "@/components/ui/prose";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "prose",
  omitted: {
    keyboard: "Prose renders static text — headings, paragraphs, lists — with no interactive element and no key handler of its own. A link or button placed inside it is a real <a> or <button> and carries its own native keyboard behaviour, exactly as it would outside a Prose block.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A heading, a paragraph and a list, all reading the same type roles a page built from .type-* classes directly would use — measured identical rather than merely similar.",
      label: "Long-form content",
      render: (
        <Panel>
          <Prose>
            <h2>Refund windows</h2>
            <p>
              A pack purchase can be refunded within fourteen days of the original
              charge, provided none of its contents have been opened or traded.
            </p>
            <ul>
              <li>Unopened packs — refundable in full.</li>
              <li>Opened packs — refundable only for a payment error.</li>
            </ul>
          </Prose>
        </Panel>
      ),
      source: `<Prose>
  <h2>Refund windows</h2>
  <p>A pack purchase can be refunded within fourteen days of the original charge.</p>
  <ul>
    <li>Unopened packs — refundable in full.</li>
  </ul>
</Prose>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Prose sets no measure of its own — PageContainer width=\"prose\" owns line length, so the two responsibilities stay with one owner each.",
      language: "tsx",
      code: `import { Prose } from "@/components/ui/prose";

<Prose asChild>
  <article>
    <h1>Policy title</h1>
    <p>Body copy, straight from a CMS or MDX render.</p>
  </article>
</Prose>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Prose",
          body: (
            <Meta
              items={[
                {
                  k: "asChild",
                  v: (
                    <>
                      boolean, default <Code>false</Code>. Renders via Radix{" "}
                      <Code>Slot</Code> instead of a <Code>div</Code> — reach for it when
                      the content is semantically an <Code>&lt;article&gt;</Code>.
                    </>
                  ),
                },
                { k: "...props", v: "Every other <div> prop (className, id, ...), forwarded to the rendered element." },
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
      blocks: [
        {
          body: (
            <p className="type-body text-muted-foreground">
              <Code>Prose</Code> adds no role and no ARIA attribute of its own — the
              accessibility tree it produces is exactly the tree of the real HTML
              elements its caller writes inside it. That makes heading order the
              caller&rsquo;s responsibility: a <Code>&lt;h2&gt;</Code> followed by a{" "}
              <Code>&lt;h4&gt;</Code> inside <Code>Prose</Code> skips a level in the
              document outline the same way it would skip one outside it. The one
              structural choice <Code>Prose</Code> itself makes is <Code>asChild</Code>{" "}
              — rendering through Radix <Code>Slot</Code> onto a real{" "}
              <Code>&lt;article&gt;</Code> when the content is a self-contained piece,
              rather than always wrapping in an anonymous <Code>&lt;div&gt;</Code>.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "Prose sets no width and no fluid type of its own — reflow is entirely a function of whatever container it sits in.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              Every type role prose reuses (<Code>type-h1</Code> through{" "}
              <Code>type-small</Code>) is a fixed <Code>rem</Code> size, not a fluid
              clamp — text does not shrink at narrow widths, it wraps, the same as any
              other block text. <Code>PageContainer width=&quot;prose&quot;</Code> is what caps
              line length; <Code>Prose</Code> itself has no <Code>max-width</Code>, so
              dropped into a full-bleed container its lines run edge to edge. One real
              gap: <Code>Prose</Code> adds no <Code>overflow-x-auto</Code> around{" "}
              <Code>&lt;table&gt;</Code> or <Code>&lt;pre&gt;</Code> children, so a wide
              table or an unwrapped code block in authored content can overflow a
              narrow viewport unless the caller wraps it — the Preview specimen above
              has neither, so it does not surface the gap. Measured on this
              documentation page itself: no overflow at 375, 768, 1440 or 1920, none at
              200% text zoom, and none under RTL — headings and paragraphs are plain
              block elements that mirror with the page&rsquo;s own direction.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        { body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> },
      ],
    },
  ],
};
