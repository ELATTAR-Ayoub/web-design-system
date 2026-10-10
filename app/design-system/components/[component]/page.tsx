import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComponentDocPage } from "@/components/docs/component-page/component-doc-page";
import { docMeta } from "@/lib/ds/docs/catalog";
import { plainDescription } from "@/lib/ds/docs/description";
import { loadSpec, specNames } from "@/lib/ds/docs/specs";
import { contractEntry } from "@/lib/ds/platform-contract";

type Params = { component: string };

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
