import { DsPageHeader, DsSection, IndexCard, IndexGrid } from "@/components/ds/kit";
import { catalogEntriesIn, docRoute } from "@/lib/ds/docs/catalog";
import { plainDescription } from "@/lib/ds/docs/description";
import { FAMILY_LABEL } from "@/lib/ds/families";
import type { DocFamily } from "@/lib/ds/platform-contract";

export type FamilyGroup = { id: string; title: string; description: string; prefix: string };

export function FamilyLanding({
  family,
  blurb,
  groups,
  children,
}: {
  family: DocFamily;
  blurb: string;
  groups?: FamilyGroup[];
  children?: React.ReactNode;
}) {
  const entries = catalogEntriesIn(family);
  const card = ({ meta, contract }: (typeof entries)[number]) => (
    <IndexCard
      key={meta.name}
      href={docRoute(meta.name)}
      title={contract.title}
      blurb={plainDescription(meta.description)}
    />
  );
  const claimed = (name: string) => groups?.some((g) => name.startsWith(g.prefix)) ?? false;
  const rest = entries.filter(({ meta }) => !claimed(meta.name));

  return (
    <>
      <DsPageHeader
        eyebrow="Components"
        title={FAMILY_LABEL[family]}
        blurb={blurb}
      />

      {children}

      {groups?.map((group) => (
        <DsSection key={group.id} id={group.id} title={group.title} description={group.description}>
          <IndexGrid>{entries.filter(({ meta }) => meta.name.startsWith(group.prefix)).map(card)}</IndexGrid>
        </DsSection>
      ))}

      {rest.length ? <IndexGrid>{rest.map(card)}</IndexGrid> : null}
    </>
  );
}
