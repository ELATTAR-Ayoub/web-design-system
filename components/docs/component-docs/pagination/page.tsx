import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note, Panel, Row } from "@/components/ds/kit";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { PaginationShowcase } from "./pagination-showcase";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "pagination",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "The pack grid actually pages — click a number, or Previous/Next, and both the rows and \"Showing X–Y of 184\" change. Load-more is used for the live feed instead, because that list grows from the top.",
      render: (
        <Panel label="Pack grid pagination">
          <PaginationShowcase />
        </Panel>
      ),
      source: `"use client";
const [page, setPage] = useState(2);
const rows = packsForPage(page); // 8 names, sliced from an in-memory list of 184

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        href="#preview"
        disabled={page === 1}
        onClick={(e) => { e.preventDefault(); setPage((p) => p - 1); }}
      />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink
        href="#preview"
        isActive={page === 1}
        onClick={(e) => { e.preventDefault(); setPage(1); }}
      >
        1
      </PaginationLink>
    </PaginationItem>
    <PaginationItem><PaginationEllipsis /></PaginationItem>
    <PaginationItem>
      <PaginationNext
        href="#preview"
        disabled={page === totalPages}
        onClick={(e) => { e.preventDefault(); setPage((p) => p + 1); }}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
<p>Showing {start}–{end} of 184 packs</p>`,
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
      description: "The minimal import and call.",
      language: "tsx",
      code: `import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function PackGridPagination({ page }: { page: number }) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={\`?page=\${page - 1}\`} disabled={page === 1} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={\`?page=\${page}\`} isActive>
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href={\`?page=\${page + 1}\`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "On the first page, Previous cannot act — and now it can say so. Load-more is the right pattern for a feed that grows from the top instead of a fixed grid.",
      label: "A pager end with nowhere to go, and load-more",
      render: (
        <div className="space-y-6">
          <Panel label="On the first page — the end that cannot act says so">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#examples" disabled />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#examples" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#examples">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#examples" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <Note tone="error" className="mt-5">
              Before this audit there was no way to express it. An <Code>&lt;a&gt;</Code> has
              no <Code>disabled</Code> attribute, so &ldquo;Previous&rdquo; on page one shipped
              as a live, focusable, clickable link that navigated nowhere.{" "}
              <Code>PaginationPrevious disabled</Code> drops the <Code>href</Code> (which is
              what removes it from the tab order), keeps <Code>role=&quot;link&quot;</Code> so
              it is still announced as the pager end rather than disappearing from the tree,
              and adds <Code>aria-disabled</Code>. It stays on the page rather than being
              removed: a pager that changes length as you move through it is harder to use
              than one whose ends are present and inert.
            </Note>
          </Panel>

          <Panel label="Load more — for feeds">
            <Row align="center" className="flex-col">
              <Button variant="outline">Load 25 more pulls</Button>
              <span className="type-number-sm text-muted-foreground">48 of 12,480 shown</span>
            </Row>
          </Panel>
        </div>
      ),
      source: `<PaginationPrevious href="?page=0" disabled />

<Button variant="outline">Load 25 more pulls</Button>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Pagination / PaginationContent / PaginationItem",
          body: (
            <p className="type-small text-muted-foreground">
              Plain elements (<Code>nav</Code> / <Code>ul</Code> / <Code>li</Code>) with
              system classes — the interactive surface lives entirely on{" "}
              <Code>PaginationLink</Code> and its named variants below.
            </p>
          ),
        },
        {
          label: "PaginationLink",
          body: (
            <Meta
              items={[
                { k: "isActive", v: "boolean. Marks the current page — sets aria-current internally, and switches the Button variant it renders through from ghost to outline." },
                {
                  k: "disabled",
                  v: "boolean. There is no page in that direction. Drops href (removing the control from the tab order), keeps role=\"link\" so it stays announced as the pager end, and adds aria-disabled plus tabIndex={-1}. Prefer it to removing the control.",
                },
                { k: "size", v: "Pick<ButtonProps, \"size\">. Default: \"icon\" — a square numbered tile; PaginationPrevious/Next override it to \"default\" for their wider text+icon shape." },
                { k: "...props", v: "Every native <a> attribute (href, onClick, etc.), forwarded directly — except onClick is swallowed when disabled." },
              ]}
            />
          ),
        },
        {
          label: "PaginationPrevious / PaginationNext",
          body: (
            <Meta
              items={[
                { k: "text", v: 'string. Default: "Previous" / "Next". The visible label; hidden below sm, where only the chevron icon shows.' },
                { k: "...props", v: "Every PaginationLink prop, forwarded directly (isActive, disabled, href, ...)." },
              ]}
            />
          ),
        },
        {
          label: "PaginationEllipsis",
          body: (
            <p className="type-small text-muted-foreground">
              A decorative stand-in for a run of skipped pages, with a visually-hidden
              &ldquo;More pages&rdquo; label. Not interactive — a real implementation would
              pair it with a jump-to-page control, which this page does not invent.
            </p>
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
                { k: "Root", v: 'role="navigation" aria-label="pagination".' },
                { k: "Active page", v: 'PaginationLink isActive sets aria-current="page".' },
                {
                  k: "Disabled pager end",
                  v: 'PaginationPrevious / PaginationNext disabled drops href (removing the control from the tab order), keeps role="link" so it stays announced as the pager end, and adds aria-disabled plus tabIndex={-1}.',
                },
                { k: "Accessible name", v: 'PaginationPrevious / PaginationNext carry an explicit aria-label ("Go to previous/next page") independent of the visible text, which hides below sm.' },
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
        "Pagination has no roving-tabindex or arrow-key model — each PaginationLink is a plain link (rendered through Button asChild) in normal document tab order.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Tab / Shift+Tab", v: "Moves focus between links in document order." },
                { k: "Enter", v: "Activates the focused link (native <a> behaviour)." },
                { k: "During disabled", v: "The control is removed from the tab order (tabIndex={-1}, no href), so it is skipped entirely by Tab, and a click that reaches it anyway is swallowed by an inline preventDefault." },
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
        "The one real breakpoint in this component: Previous and Next drop their label text below sm and keep only the icon and the accessible name.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              <Code>PaginationPrevious</Code> and <Code>PaginationNext</Code> wrap their
              text in <Code>{"<span className=\"hidden sm:block\">"}</Code> — below the{" "}
              <Code>sm</Code> breakpoint the row shows the chevron icon alone, at the same{" "}
              <Code>icon</Code>-sized <Code>Button</Code> target, so a narrow pager does
              not wrap or truncate its own label. The <Code>aria-label</Code> (&ldquo;Go
              to previous page&rdquo; / &ldquo;Go to next page&rdquo;) is unconditional, so
              the control keeps its accessible name whether or not the visible text is
              showing. Numbered <Code>PaginationLink</Code>s carry no responsive
              behaviour of their own — the caller decides how many page numbers to render
              at a given width, typically by swapping some for a{" "}
              <Code>PaginationEllipsis</Code>. Measured with no overflow at 375, 768,
              1440 or 1920, and none at 200% text zoom or under RTL — the row itself is
              a plain flex layout, so it mirrors direction the same way any row does.
              The Previous/Next chevrons themselves are not swapped for RTL: each carries
              a fixed <Code>data-icon=&quot;inline-start&quot;</Code> /{" "}
              <Code>&quot;inline-end&quot;</Code> marker in source, but no rule in{" "}
              <Code>styles/utilities.css</Code> currently reads it to flip the glyph, so
              the arrow points the same screen direction in both writing modes — a real
              gap, not a claim that it already mirrors.
            </p>
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
