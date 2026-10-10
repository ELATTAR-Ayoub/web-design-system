/**
 * Documentation metadata for `carousel`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `carousel` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "carousel",
  description:
    "Carousel — a horizontally or vertically scrolling set of slides built on Embla, with arrow-key and button navigation that disables itself at either end of the track.",
  dependencies: ["button", "source-foundation"],
  exports: ["Carousel", "CarouselContent", "CarouselItem", "CarouselNext", "CarouselPrevious", "useCarousel"],
  sourcePath: "components/ui/carousel.tsx",
};
