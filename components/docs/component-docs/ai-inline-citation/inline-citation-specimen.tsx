"use client";

/**
 * Live specimens for the `ai-inline-citation` page, rendering the real parts
 * from `components/ai-elements/inline-citation.tsx`. The card opens on hover or
 * focus; the specimens that need it open set `open` so the page can show it
 * without a pointer.
 */

import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselNext,
  InlineCitationCarouselPrev,
  InlineCitationQuote,
  InlineCitationSource,
  InlineCitationText,
} from "@/components/ai-elements/inline-citation";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

const SOURCES = [
  {
    title: "Renewal terms",
    url: "https://contracts.example/renewal",
    description: "The agreement renews for twelve months unless either party gives notice sixty days ahead.",
    quote: "Renews automatically on 1 March.",
  },
  {
    title: "Discount schedule",
    url: "https://finance.example/discounts",
    description: "The launch discount applies to orders signed before the end of the quarter.",
    quote: "The discount lapses on 31 March.",
  },
];

function Card({ urls, open }: { urls: string[]; open?: boolean }) {
  const picked = SOURCES.filter((s) => urls.includes(s.url));
  return (
    <InlineCitationCard open={open}>
      <InlineCitationCardTrigger sources={urls} tabIndex={0} />
      <InlineCitationCardBody>
        <InlineCitationCarousel>
          {picked.length > 1 ? (
            <InlineCitationCarouselHeader>
              <InlineCitationCarouselPrev />
              <InlineCitationCarouselNext />
              <InlineCitationCarouselIndex />
            </InlineCitationCarouselHeader>
          ) : null}
          <InlineCitationCarouselContent>
            {picked.map((s) => (
              <InlineCitationCarouselItem key={s.url}>
                <InlineCitationSource description={s.description} title={s.title} url={s.url} />
                <InlineCitationQuote>{s.quote}</InlineCitationQuote>
              </InlineCitationCarouselItem>
            ))}
          </InlineCitationCarouselContent>
        </InlineCitationCarousel>
      </InlineCitationCardBody>
    </InlineCitationCard>
  );
}

/** The Preview: a claim with a citation badge; hover or focus the badge for the card. */
export function InlineCitationPreview() {
  return (
    <Panel label="InlineCitation" note="hover or focus the badge">
      <p className="type-body">
        <InlineCitation>
          <InlineCitationText>The contract renews on 1 March and the discount lapses a month later.</InlineCitationText>
          <Card urls={SOURCES.map((s) => s.url)} />
        </InlineCitation>
      </p>
    </Panel>
  );
}

/** Other configurations: one source, and a card held open. */
export function InlineCitationExamples() {
  return (
    <div className="flex flex-col gap-4">
      <Panel label="One source" note="no carousel header">
        <p className="type-body">
          <InlineCitation>
            <InlineCitationText>Notice is due sixty days ahead.</InlineCitationText>
            <Card urls={[SOURCES[0].url]} />
          </InlineCitation>
        </p>
      </Panel>
      <Panel bodyClassName="min-h-64" label="Card open" note="open={true}">
        <p className="type-body">
          <InlineCitation>
            <InlineCitationText>Two sources back this claim.</InlineCitationText>
            <Card open urls={SOURCES.map((s) => s.url)} />
          </InlineCitation>
        </p>
      </Panel>
    </div>
  );
}

/** The States grid. */
export function InlineCitationStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="rest" note="hostname badge">
        <InlineCitationCard>
          <InlineCitationCardTrigger sources={[SOURCES[0].url]} />
        </InlineCitationCard>
      </StateCell>
      <StateCell label="several sources" note="hostname +n">
        <InlineCitationCard>
          <InlineCitationCardTrigger sources={SOURCES.map((s) => s.url)} />
        </InlineCitationCard>
      </StateCell>
      <StateCell label="empty" note="no sources: unknown">
        <InlineCitationCard>
          <InlineCitationCardTrigger sources={[]} />
        </InlineCitationCard>
      </StateCell>
    </StateGrid>
  );
}
