/**
 * Authored documentation page for `breadcrumb`.
 *
 * Replaces the generated baseline. Migrated from the old `base/navigation`
 * category page (`app/design-system/components/base/navigation/page.tsx`, since deleted).
 * Every specimen renders the real `Breadcrumb` composition from
 * `components/ui/breadcrumb.tsx` — nothing here is a styled div.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note, Panel, Row, StateCell, StateGrid } from "@/components/ds/kit";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DirectionProvider } from "@/components/ui/direction";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "breadcrumb",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Used on pack detail pages, where the user arrived from a filtered marketplace and needs a way back to it.",
      render: (
        <Row>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#preview">Packs</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#preview">Eclipse Vault</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Origin Pulse — Series I</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Row>
      ),
      source: `<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/packs">Packs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/packs/eclipse-vault">Eclipse Vault</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Origin Pulse — Series I</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
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
        "The current page is a BreadcrumbPage, not a link — it carries aria-current and is not clickable.",
      language: "tsx",
      code: `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function PackTrail() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/packs">Packs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Eclipse Vault</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "A trail too long to show in full collapses behind an ellipsis, and direction is context rather than a second set of controls — the same composition reads right-to-left when its provider changes.",
      label: "Ellipsis, and reading direction",
      render: (
        <div className="space-y-6">
          <Panel label="Collapsed trail">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#examples">Packs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#examples">Origin Pulse</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Series I</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Panel>

          <Panel label="RTL context" note="direction=rtl">
            <DirectionProvider direction="rtl">
              <div dir="rtl">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#examples">الحزم</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>نبض الأصل</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </DirectionProvider>
          </Panel>
        </div>
      ),
      source: `<BreadcrumbItem>
  <BreadcrumbEllipsis />
</BreadcrumbItem>

<DirectionProvider direction="rtl">
  <div dir="rtl">
    <Breadcrumb>{/* … */}</Breadcrumb>
  </div>
</DirectionProvider>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Breadcrumb / BreadcrumbList / BreadcrumbItem",
          body: (
            <p className="type-small text-muted-foreground">
              Plain elements (<Code>nav</Code> / <Code>ol</Code> / <Code>li</Code>) with
              system classes, not Radix primitives — a breadcrumb is a structural list, not an
              interactive widget, so there is no keyboard model to delegate.
            </p>
          ),
        },
        {
          label: "BreadcrumbLink",
          body: (
            <Meta
              items={[
                { k: "asChild", v: "boolean. Renders the single child via Radix Slot instead of an <a> — for a Link from next/link, for instance." },
                { k: "...props", v: "Every native <a> attribute (href, target, etc.), forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "BreadcrumbPage",
          body: (
            <p className="type-small text-muted-foreground">
              A <Code>span</Code>, not a link — use it for the current page so it gets{" "}
              <Code>aria-current=&quot;page&quot;</Code> and is not clickable.
            </p>
          ),
        },
        {
          label: "BreadcrumbSeparator",
          body: (
            <p className="type-small text-muted-foreground">
              Renders a chevron by default; pass <Code>children</Code> to use a different
              glyph. Always <Code>role=&quot;presentation&quot; aria-hidden</Code>, so it is
              never announced.
            </p>
          ),
        },
        {
          label: "BreadcrumbEllipsis",
          body: (
            <p className="type-small text-muted-foreground">
              A decorative stand-in for a collapsed middle section, with a visually-hidden
              &ldquo;More&rdquo; label. It does not expand on its own — a real implementation
              would pair it with a menu of the hidden steps, which this page does not invent.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "Breadcrumb's own states are structural rather than interactive — the interactive state belongs to BreadcrumbLink, which is a plain link.",
      blocks: [
        {
          body: (
            <StateGrid cols={3}>
              <StateCell label="link (rest)">
                <BreadcrumbLink href="#states">Packs</BreadcrumbLink>
              </StateCell>
              <StateCell label="link (hover)" note="Hover it">
                <BreadcrumbLink href="#states">Packs</BreadcrumbLink>
              </StateCell>
              <StateCell label="current page" note="aria-current, not just a colour">
                <BreadcrumbPage>Genesis</BreadcrumbPage>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A states">
              <p>
                <strong>focus-visible</strong> and <strong>pressed</strong> belong to{" "}
                <Code>BreadcrumbLink</Code>, not to <Code>Breadcrumb</Code> itself — it is a
                real <Code>&lt;a&gt;</Code> and inherits the platform&rsquo;s own focus ring and
                press behaviour. <strong>loading</strong>, <strong>success</strong>,{" "}
                <strong>error</strong> and <strong>empty</strong> are N/A: a breadcrumb moves
                you somewhere, and the outcome belongs to the destination, not to the trail
                you left.
              </p>
            </Note>
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
            <Meta
              items={[
                { k: "Root", v: 'The nav carries aria-label="breadcrumb", so it is announced as a named landmark distinct from the page\'s primary navigation.' },
                { k: "Current page", v: 'BreadcrumbPage carries aria-current="page" and aria-disabled and is not a link — the current step must not be the only breadcrumb-labelled control on the page that is also clickable to itself.' },
                { k: "Separator", v: 'role="presentation" aria-hidden, so a screen reader does not announce the glyph between items.' },
                { k: "Ellipsis", v: 'role="presentation" aria-hidden on the glyph, with a visually-hidden "More pages" label for the wrapper.' },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      description:
        "Breadcrumb has no roving-tabindex or arrow-key model of its own — each BreadcrumbLink is a plain link in normal document tab order.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Tab / Shift+Tab", v: "Moves focus between links in document order, skipping the current, non-interactive BreadcrumbPage." },
                { k: "Enter", v: "Activates the focused link (native <a> behaviour)." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "BreadcrumbList wraps rather than scrolling or clipping, so a trail too long for a narrow viewport moves to a second line instead of running off the edge — the BreadcrumbEllipsis composition above is how a caller opts out of that and collapses the middle instead.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Wrapping",
                  v: "flex flex-wrap items-center gap-1.5 with wrap-break-word on the list — a long trail at 375px drops items onto a second row rather than overflowing horizontally or forcing the page to scroll sideways.",
                },
                {
                  k: "Long segment names",
                  v: "wrap-break-word means even a single unbroken segment name (no spaces) breaks mid-word rather than pushing the row wider than its container.",
                },
                {
                  k: "RTL",
                  v: "Shown live under Examples above — the same composition, unmirrored markup, reads correctly right-to-left because the chevron separator and layout are driven by logical properties rather than a hand-authored LTR assumption.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920px, no overflow under 200% text zoom, and no overflow under RTL.",
                },
              ]}
            />
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
