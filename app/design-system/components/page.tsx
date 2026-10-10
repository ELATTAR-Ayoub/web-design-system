/**
 * The complete components index — every documented capability, in one place.
 *
 * Four sections, one per family, derived from the catalog. The version this
 * replaces iterated `DS_GROUPS` minus Foundations, which after the category
 * pages were deleted meant it listed the **Documentation** group among the
 * components: Introduction, Installation, Theming and Changelog rendered as
 * cards beside Button and Dialog. Its opening sentence still described "three
 * families" and a "Site pages" family that had been removed months earlier.
 *
 * Nothing here is authored except the four one-line family descriptions. A card
 * cannot promise a page that does not exist, because the list it maps is the
 * same one the routes are generated from.
 */

import type { Metadata } from "next";

import { DsPageHeader, DsSection, IndexCard, IndexGrid } from "@/components/ds/kit";
import { catalogEntriesIn, docRoute } from "@/lib/ds/docs/catalog";
import { plainDescription } from "@/lib/ds/docs/description";
import { FAMILY_LABEL, FAMILY_ORDER } from "@/lib/ds/families";
import type { DocFamily } from "@/lib/ds/platform-contract";

export const metadata: Metadata = {
  title: "Components — Elattar's Design System",
  description:
    "Every capability the system publishes, each at its own route: what it is, how it is delivered, its API, states, accessibility and keyboard behaviour.",
};

/** What each family is for. The only prose this page owns. */
const FAMILY_BLURB: Record<DocFamily, string> = {
  components:
    "The chassis: shadcn primitives on Radix, restyled onto this system's tokens. Generic, reusable and product-agnostic.",
  effects:
    "Capabilities delivered as CSS rather than as a component — surfaces, glows, presses and entrances, applied to a host you already have.",
  agent:
    "A complete AI console and its parts, pointed at whatever is actually answering. Written from scratch and product-agnostic by construction.",
  charts:
    "Every chart family on recharts, drawn with the five chart tokens, under one container, tooltip and legend.",
};

export default function ComponentsIndex() {
  return (
    <>
      <DsPageHeader
        eyebrow="Design System"
        title="Components"
        blurb="Every capability the system publishes, each at its own route. Four families, one catalog: the name here is the registry item, the documentation slug and the route segment, so what you install is what you read."
      />

      {FAMILY_ORDER.map((family) => {
        const entries = catalogEntriesIn(family);
        if (!entries.length) return null;
        return (
          <DsSection
            key={family}
            id={family}
            title={FAMILY_LABEL[family]}
            description={FAMILY_BLURB[family]}
          >
            <IndexGrid>
              {entries.map(({ meta, contract }) => (
                <IndexCard
                  key={meta.name}
                  href={docRoute(meta.name)}
                  title={contract.title}
                  blurb={plainDescription(meta.description)}
                />
              ))}
            </IndexGrid>
          </DsSection>
        );
      })}
    </>
  );
}
