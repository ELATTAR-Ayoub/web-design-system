import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "carousel",
  description:
    "Carousel — a horizontally or vertically scrolling set of slides built on Embla, with arrow-key and button navigation that disables itself at either end of the track.",
  dependencies: ["button", "source-foundation"],
  exports: ["Carousel", "CarouselContent", "CarouselItem", "CarouselNext", "CarouselPrevious", "useCarousel"],
  sourcePath: "components/ui/carousel.tsx",
};
