"use client";

import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

export const SAMPLE_SOURCES = [
  { href: "https://example.com/contracts/renewal", title: "Renewal terms" },
  { href: "https://example.com/finance/discounts", title: "Discount schedule" },
  { href: "https://example.com/legal/order-form", title: "Order form, 2026" },
];

function List({ open }: { open?: boolean }) {
  return (
    <Sources defaultOpen={open}>
      <SourcesTrigger count={SAMPLE_SOURCES.length} />
      <SourcesContent>
        {SAMPLE_SOURCES.map((s) => (
          <Source href={s.href} key={s.href} title={s.title} />
        ))}
      </SourcesContent>
    </Sources>
  );
}

export function SourcesPreview() {
  return (
    <Panel label="Sources" note="3 sources">
      <List />
    </Panel>
  );
}

export function SourcesExamples() {
  return (
    <Panel label="Custom trigger and rows">
      <Sources defaultOpen>
        <SourcesTrigger count={2}>
          <span className="type-nav">Where this came from</span>
        </SourcesTrigger>
        <SourcesContent>
          <Source href="https://example.com/a">
            <span className="type-nav">Example A</span>
            <span className="type-small text-muted-foreground">example.com</span>
          </Source>
          <Source href="https://example.com/b" title="Example B" />
        </SourcesContent>
      </Sources>
    </Panel>
  );
}

export function SourcesStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="closed" note="the default">
        <List />
      </StateCell>
      <StateCell label="open" note="defaultOpen">
        <List open />
      </StateCell>
    </StateGrid>
  );
}
