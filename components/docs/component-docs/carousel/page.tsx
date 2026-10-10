import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel } from "@/components/ds/kit";

import { meta } from "./meta";

const PACKS: [string, string][] = [
  ["Eclipse Vault", "$48.00"],
  ["Golden Rift", "$120.00"],
  ["Mystic Surge", "$32.00"],
  ["Shadow Core", "$76.00"],
  ["Celestial Strike", "$210.00"],
  ["Origin Pulse", "$18.00"],
];

export const spec: ComponentDocSpec = {
  name: "carousel",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "The featured pack carousel on the landing page. Arrows are always visible and it is fully keyboard navigable — a carousel you can only swipe is inaccessible.",
      render: (
        <Panel label="Featured packs">
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {PACKS.map(([name, price]) => (
                <CarouselItem key={name} className="basis-1/2 lg:basis-1/3">
                  <div className="press rounded-lg border border-border bg-card p-4">
                    <AspectRatio
                      ratio={3 / 4}
                      className="mb-4 rounded-md border border-border bg-action/12"
                    />
                    <p className="type-small text-muted-foreground">Eclipse series</p>
                    <p className="type-h4 mt-1.5 text-foreground">{name}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="type-number-md text-value-ink">{price}</span>
                      <Badge variant="secondary">6 Cards</Badge>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </Panel>
      ),
      source: `<Carousel opts={{ align: "start" }} className="w-full">
  <CarouselContent>
    {packs.map((pack) => (
      <CarouselItem key={pack.name} className="basis-1/2 lg:basis-1/3">
        {/* card */}
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "CarouselPrevious and CarouselNext disable themselves automatically at either end of the track.",
      language: "tsx",
      code: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function FeaturedPacks({ packs }: { packs: Pack[] }) {
  return (
    <Carousel opts={{ align: "start" }} className="w-full">
      <CarouselContent>
        {packs.map((pack) => (
          <CarouselItem key={pack.id} className="basis-1/2 lg:basis-1/3">
            <PackCard pack={pack} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "orientation switches the scroll axis and moves the arrow pair to sit above/below instead of left/right; horizontal is the default.",
      label: "Vertical orientation",
      render: (
        <Panel label="Vertical" className="max-w-xs">
          <Carousel orientation="vertical" opts={{ align: "start" }} className="w-full">
            <CarouselContent className="h-64">
              {PACKS.slice(0, 4).map(([name, price]) => (
                <CarouselItem key={name} className="basis-1/2">
                  <div className="flex h-full items-center justify-between rounded-lg border border-border bg-card px-4">
                    <span className="type-small text-foreground">{name}</span>
                    <span className="type-number-sm text-value-ink">{price}</span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </Panel>
      ),
      source: `<Carousel orientation="vertical" opts={{ align: "start" }} className="w-full">
  <CarouselContent className="h-64">
    {items.map((item) => (
      <CarouselItem key={item.id} className="basis-1/2">
        {/* row */}
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Carousel, its parts, and the useCarousel hook they share context through.",
      blocks: [
        {
          label: "Carousel",
          body: (
            <Meta
              items={[
                {
                  k: "opts",
                  v: "Embla's own EmblaOptionsType (align, loop, skipSnaps, etc.), passed straight through to useEmblaCarousel.",
                },
                { k: "plugins", v: "Embla plugin array, passed straight through to useEmblaCarousel." },
                {
                  k: "orientation",
                  v: "\"horizontal\" | \"vertical\". Default: \"horizontal\". Sets Embla's scroll axis and CarouselContent's flex direction and gap side.",
                },
                { k: "setApi", v: "(api: CarouselApi) => void. Escape hatch to read Embla's own API — scrollTo, selectedScrollSnap, etc." },
              ]}
            />
          ),
        },
        {
          label: "CarouselContent / CarouselItem",
          body: (
            <Meta
              items={[
                {
                  k: "CarouselContent",
                  v: "Wraps Embla's scroll container ref. Renders role handled by the parent Carousel; className merges onto the inner flex row/column.",
                },
                {
                  k: "CarouselItem",
                  v: "role=\"group\" aria-roledescription=\"slide\". Sizing is entirely className-driven — control item width with basis-* (e.g. basis-1/2 lg:basis-1/3).",
                },
              ]}
            />
          ),
        },
        {
          label: "CarouselPrevious / CarouselNext",
          body: (
            <Meta
              items={[
                {
                  k: "(shared)",
                  v: "React.ComponentProps<typeof Button> — both render a real Button (variant \"outline\", size \"icon-sm\" by default) positioned absolutely, disabled automatically at the corresponding end of the track. Each carries a visually-hidden \"Previous slide\" / \"Next slide\" label.",
                },
              ]}
            />
          ),
        },
        {
          label: "useCarousel",
          body: (
            <p className="type-small text-muted-foreground">
              The context hook CarouselPrevious/Next are built on — carouselRef,
              api, orientation, scrollPrev, scrollNext, canScrollPrev,
              canScrollNext. Exported for a custom control that needs the same
              state without hand-rolling a second Embla instance. Throws if used
              outside a Carousel.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Root", v: "role=\"region\" aria-roledescription=\"carousel\"." },
                { k: "CarouselItem", v: "role=\"group\" aria-roledescription=\"slide\" on every slide." },
                {
                  k: "Arrow buttons",
                  v: "Real disabled <button> elements at either end of the track — removed from interaction and, by platform convention, from the tab sequence's active set, without extra ARIA.",
                },
                {
                  k: "Accessible name",
                  v: "CarouselPrevious and CarouselNext each carry a built-in sr-only label (\"Previous slide\" / \"Next slide\"); no extra aria-label is required unless the default text is misleading in context.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      description: "ArrowLeft/ArrowRight are captured on the root via onKeyDownCapture, so they work with focus anywhere inside the carousel, not only on the arrow buttons.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Tab / Shift+Tab", v: "Moves focus through the carousel's focusable content in document order, including the two arrow buttons." },
                { k: "ArrowLeft", v: "Scrolls to the previous slide. Bound unconditionally by this component — it fires regardless of orientation, so a vertical carousel is still driven by Left/Right rather than Up/Down." },
                { k: "ArrowRight", v: "Scrolls to the next slide. Same unconditional binding as ArrowLeft." },
                { k: "Enter / Space on an arrow button", v: "Activates that button (native <button> behaviour)." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description: "Item width is entirely className-driven with basis-*, so the same track can show a different number of slides per breakpoint.",
      blocks: [
        {
          body: (
            <Note tone="action" title="Two slides on mobile, three from lg">
              <p>
                The preview above uses <code className="type-code">basis-1/2 lg:basis-1/3</code> on
                each CarouselItem: two cards fit the narrow viewport, three fit
                from the lg breakpoint (1024px) up. There is no separate
                responsive prop — this is a plain Tailwind width class, so any
                breakpoint the system defines (768px, 1024px) can drive it.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        { body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> },
      ],
    },
  ],
};
