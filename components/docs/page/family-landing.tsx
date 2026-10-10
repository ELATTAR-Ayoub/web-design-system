/**
 * A family landing: every capability in one of the four families, as cards.
 *
 * **It is derived, and that is the point.** The cards come from
 * `catalogEntriesIn(family)` — the same list the rail, the search palette, the
 * routes and the parity check read. The pages this replaces were fourteen
 * hand-authored galleries under the since-deleted `components/base/**` and six under
 * `components/agent/**`, each with its own copy of every blurb it linked to.
 * Between them they had drifted: a card promising a "Chart" section that did
 * not exist, a "Date Range" entry with nothing behind it, and blurbs that
 * disagreed with the page they pointed at because both had been edited and only
 * one had been read.
 *
 * A landing cannot carry a description a component page does not have, because
 * it does not have one to give — `meta.description` is the only sentence, and it
 * is read here and on the page itself.
 *
 * **A landing is not a component reference.** It can introduce a family with
 * a live specimen, but installation, API and state contracts belong at the
 * item's own route. The family specimen must reuse the authored component,
 * not become a second implementation.
 */

import { DsPageHeader, DsSection, IndexCard, IndexGrid } from "@/components/ds/kit";
import { catalogEntriesIn, docRoute } from "@/lib/ds/docs/catalog";
import { plainDescription } from "@/lib/ds/docs/description";
import { FAMILY_LABEL } from "@/lib/ds/families";
import type { DocFamily } from "@/lib/ds/platform-contract";

/**
 * A titled slice of a family's grid. Entries still come from the catalog —
 * a group only says which ones sit together (by name prefix), so a group can
 * never list a page that does not exist. Entries no group claims fall into a
 * final untitled grid, so nothing is ever hidden by a missing prefix.
 */
export type FamilyGroup = { id: string; title: string; description: string; prefix: string };

export function FamilyLanding({
  family,
  blurb,
  groups,
  children,
}: {
  family: DocFamily;
  /** What this family is for. The one piece of prose a landing owns. */
  blurb: string;
  /** Optional: split the derived grid into titled groups by name prefix. */
  groups?: FamilyGroup[];
  /** Optional family introduction or live demo above the derived grid. */
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
