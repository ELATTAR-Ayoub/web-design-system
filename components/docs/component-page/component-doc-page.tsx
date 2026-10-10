/**
 * The shell every component documentation page renders through.
 *
 * A page supplies a `ComponentDocSpec` — a name and a list of sections — and
 * nothing else. The breadcrumb, the eyebrow, the title, the hero sentence and
 * the outline are all DERIVED: the breadcrumb and eyebrow from the contract's
 * family, the title from the contract, the description from the item's
 * `meta.ts`, the outline from the declared sections. That is the whole point of
 * the pair. Ninety-nine pages used to type their own eyebrow, and between them
 * they claimed eight different taxonomies for four actual families; a reader
 * who reached Chart from the Charts group was told the page was
 * "COMPONENTS / BASE".
 *
 * **The order is fixed: breadcrumb, eyebrow, title, description.** A page
 * cannot reorder it, omit a piece or add one, because none of the four is
 * passed in. The breadcrumb is the shell's — `app/design-system/layout.tsx`
 * renders it above this component for every route, from the same nav data.
 *
 * **The right rail is a layout column, not something the article contains.** At
 * `xl` the grid gives it its own track so it can be sticky against the
 * viewport; below `xl` that track collapses and `AnchorStrip` takes over above
 * the article. Both are always in the tree — CSS chooses, not JavaScript, so
 * the server and the client cannot draw different trees.
 */

import { notFound } from "next/navigation";

import { DsSection } from "@/components/ds/kit";
import { docMeta } from "@/lib/ds/docs/catalog";
import { descriptionParts } from "@/lib/ds/docs/description";
import { FAMILY_EYEBROW } from "@/lib/ds/families";
import { contractEntry } from "@/lib/ds/platform-contract";

import { orderSections } from "@/lib/ds/docs/section-order";

import { CollapsibleDocSection } from "./doc-section";
import { DocSectionBody } from "./sections";
import { AnchorStrip, TableOfContents } from "./table-of-contents";
import type { ComponentDocSpec } from "./types";

export function ComponentDocPage({ spec }: { spec: ComponentDocSpec }) {
  const meta = docMeta(spec.name);
  const contract = contractEntry(spec.name);

  // A spec whose name is in neither the catalog nor the contract is a route
  // with nothing behind it. `test/docs/catalog-wiring.test.ts` fails on that
  // before it can ship; this is the runtime half of the same claim.
  if (!meta || !contract) notFound();

  return (
    <div
      className={
        spec.wide ? undefined : "xl:grid xl:grid-cols-[minmax(0,1fr)_var(--width-rail)] xl:gap-12"
      }
    >
      <article className="min-w-0">
        {/* No breadcrumb here. `app/design-system/layout.tsx` renders one for
            every route in the shell, derived from the same nav data, and a
            second one inside the article would print the trail twice on
            exactly the pages that already have it. The required order —
            breadcrumb, eyebrow, title, description — still holds, because the
            layout's sits directly above this header. */}
        <header className="mb-10 border-b border-border pb-10">
          <p className="type-badge text-action-ink">{FAMILY_EYEBROW[contract.family]}</p>
          <h1 className="type-h1 mt-4 text-foreground">{contract.title}</h1>
          {meta.description && (
            <p className="type-lead mt-4 max-w-2xl text-muted-foreground">
              {/* Code spans rendered, not printed. Seven descriptions name an
                  identifier in backticks, and this used to show them raw — at
                  32px, on the chart pages. The rail, the search palette and the
                  `<meta>` tag all read the same sentence through
                  `plainDescription`, because none of them can render markup. */}
              {descriptionParts(meta.description).map((part, index) =>
                part.code ? (
                  <code key={index} className="type-code text-foreground">
                    {part.text}
                  </code>
                ) : (
                  <span key={index}>{part.text}</span>
                ),
              )}
            </p>
          )}
        </header>

        <AnchorStrip spec={spec} persistent={spec.wide} />

        {/* Sorted into the canonical order (`lib/ds/docs/section-order.ts`),
            whatever order the page declared. The Preview is a plain section;
            every other section is a `<details>` — open by default for the
            chapters a reader wants first, closed for the reference material.
            See `doc-section.tsx` for why it is native. */}
        {orderSections(spec.sections).map((section) =>
          section.id === "preview" ? (
            <DsSection
              key={section.id}
              id={section.id}
              title={section.title}
              description={section.description}
            >
              <DocSectionBody section={section} name={spec.name} />
            </DsSection>
          ) : (
            <CollapsibleDocSection
              key={section.id}
              id={section.id}
              title={section.title}
              description={section.description}
            >
              <DocSectionBody section={section} name={spec.name} />
            </CollapsibleDocSection>
          ),
        )}
      </article>

      {spec.wide ? null : <TableOfContents spec={spec} />}
    </div>
  );
}
