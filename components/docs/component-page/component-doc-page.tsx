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

  if (!meta || !contract) notFound();

  return (
    <div
      className={
        spec.wide ? undefined : "xl:grid xl:grid-cols-[minmax(0,1fr)_var(--width-rail)] xl:gap-12"
      }
    >
      <article className="min-w-0">
        {/* No breadcrumb here. `components/docs/chrome/docs-shell.tsx` renders one for
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
