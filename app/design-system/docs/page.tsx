import { DsPageHeader, DsSection, IndexCard, IndexGrid } from "@/components/ds/kit";
import { DOC_SECTIONS } from "@/lib/ds/nav";

export default function DocsIndex() {
  return (
    <>
      <DsPageHeader
        eyebrow="Documentation"
        title="Sections"
        blurb="The foundations and guides for using the system, in one place."
      />
      <DsSection
        id="pages"
        title={`${DOC_SECTIONS.length} pages`}
        description="Start with the system foundations, then use the guides and component catalog."
      >
        <IndexGrid>
          {DOC_SECTIONS.map((c) => (
            <IndexCard
              key={c.href}
              href={c.href}
              title={c.title}
              blurb={c.blurb}
            />
          ))}
        </IndexGrid>
      </DsSection>
    </>
  );
}
