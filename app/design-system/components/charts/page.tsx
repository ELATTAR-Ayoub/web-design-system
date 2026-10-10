import type { Metadata } from "next";
import Link from "next/link";

import { spec as cartesian } from "@/components/docs/component-docs/chart-cartesian/page";
import { spec as polar } from "@/components/docs/component-docs/chart-polar/page";
import { spec as chart } from "@/components/docs/component-docs/chart/page";
import { PreviewCode } from "@/components/docs/component-page/preview-code";
import type { ShowcaseSection } from "@/components/docs/component-page/types";
import { ChartFamilyTabs } from "@/components/docs/charts-gallery/chart-family-tabs";
import { DsPageHeader, DsSection, IndexCard, IndexGrid } from "@/components/ds/kit";
import { Button } from "@/components/ui/button";
import { catalogEntriesIn, docRoute } from "@/lib/ds/docs/catalog";
import { plainDescription } from "@/lib/ds/docs/description";

export const metadata: Metadata = {
  title: "Charts — Elattar's Design System",
  description:
    "Seventy live charts across seven families, each with real data states and source.",
};

const FAMILIES = [
  { id: "area", title: "Area", spec: cartesian, doc: "chart-cartesian" },
  { id: "bar", title: "Bar", spec: cartesian, doc: "chart-cartesian" },
  { id: "line", title: "Line", spec: cartesian, doc: "chart-cartesian" },
  { id: "pie", title: "Pie", spec: polar, doc: "chart-polar" },
  { id: "radar", title: "Radar", spec: polar, doc: "chart-polar" },
  { id: "radial", title: "Radial", spec: polar, doc: "chart-polar" },
  { id: "tooltips", title: "Tooltips", spec: chart, doc: "chart" },
] as const;

function familySection(family: (typeof FAMILIES)[number]): ShowcaseSection {
  const section = family.spec.sections.find((candidate) => candidate.id === family.id);
  if (!section || section.kind !== "showcase") {
    throw new Error(`Charts gallery is missing the ${family.id} showcase`);
  }
  return section;
}

export default async function ChartsLanding({
  searchParams,
}: {
  searchParams: Promise<{ family?: string | string[] }>;
}) {
  const requested = (await searchParams).family;
  const selected = FAMILIES.find((family) => family.id === requested) ?? FAMILIES[0];
  const showcase = familySection(selected);
  const entries = catalogEntriesIn("charts");

  return (
    <>
      <DsPageHeader
        eyebrow="Components"
        title="Charts"
        blurb="Seventy charts across seven families, each drawn by the real component. Explore a live state, inspect its source, or open the component reference to understand the chart engine."
      />

      <div className="-mt-8 mb-16 flex flex-wrap gap-3">
        <Button asChild><a href="#browse-charts">Browse Charts</a></Button>
        <Button asChild variant="secondary"><Link href={docRoute("chart")}>Documentation</Link></Button>
      </div>

      <DsSection
        id="browse-charts"
        title="Browse charts"
        description="Choose a family, then switch any specimen between its actual ready, empty, loading, and error states. The code view comes from the same authored reference as the component pages."
      >
        <ChartFamilyTabs
          selected={selected.id}
          families={FAMILIES.map(({ id, title }) => ({ id, title }))}
        />
        <div className="mt-6">
          <PreviewCode label={`${selected.title} charts`} source={showcase.source} flush>
            <div className="p-4 sm:p-6">{showcase.render}</div>
          </PreviewCode>
        </div>
        <p className="type-small mt-4 text-muted-foreground">
          Need API details? Read the {selected.title.toLowerCase()} section in{" "}
          <Link className="text-action-ink underline underline-offset-4" href={`${docRoute(selected.doc)}#${selected.id}`}>
            the component reference
          </Link>.
        </p>
      </DsSection>

      <DsSection
        id="component-reference"
        title="Component reference"
        description="The gallery answers which chart to use. These pages explain the primitives, geometry, interactions, and API underneath."
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
    </>
  );
}
