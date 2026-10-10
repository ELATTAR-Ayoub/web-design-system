/**
 * The one route every catalog item is documented at.
 *
 * `/design-system/components/<canonical-kebab-name>` — the same name the
 * registry item, the metadata file and the contract entry use, so a reader who
 * knows what to install knows where it is documented.
 *
 * ONE ROUTE, NOT NINETY-NINE. The previous documentation grouped components
 * onto broad category pages — `base/buttons`, `base/forms` — which meant a
 * component had no address of its own, could not be linked to, and inherited
 * whatever eyebrow its neighbours had. The static category routes still exist
 * beside this one as indexes and galleries; Next resolves a literal segment
 * before a dynamic one, so `/components/base` reaches the index and
 * `/components/button` reaches this.
 *
 * `params` is a Promise in this version of Next and must be awaited — see
 * `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComponentDocPage } from "@/components/docs/component-page/component-doc-page";
import { docMeta } from "@/lib/ds/docs/catalog";
import { plainDescription } from "@/lib/ds/docs/description";
import { loadSpec, specNames } from "@/lib/ds/docs/specs";
import { contractEntry } from "@/lib/ds/platform-contract";

type Params = { component: string };

/**
 * Every documented item, pre-rendered.
 *
 * Read from the loader map, which is generated from the catalog — so this can
 * never list a name with no page behind it, and can never miss one that has a
 * page.
 */
export function generateStaticParams(): Params[] {
  return specNames().map((component) => ({ component }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { component } = await params;
  const contract = contractEntry(component);
  const meta = docMeta(component);
  if (!contract || !meta) return {};
  return {
    title: `${contract.title} — Elattar's Design System`,
    // The item's one description, read once. The hero paragraph, the navigation
    // blurb, the search result and this tag are all the same sentence — but a
    // meta tag is plain text, so the code fences come out. A search result
    // reading "`AreaChart`" is punctuation, not emphasis.
    description: meta.description ? plainDescription(meta.description) : undefined,
  };
}

export default async function ComponentRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { component } = await params;
  const spec = await loadSpec(component);
  if (!spec) notFound();
  return <ComponentDocPage spec={spec} />;
}
