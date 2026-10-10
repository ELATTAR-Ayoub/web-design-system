/**
 * Documentation metadata for `pagination`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `pagination` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "pagination",
  description:
    "Pagination — page links built from anchors rather than buttons, with previous and next controls that go properly inert, not just disabled-looking, once there is no page left in that direction.",
  dependencies: ["button", "source-foundation"],
  exports: ["Pagination", "PaginationContent", "PaginationEllipsis", "PaginationItem", "PaginationLink", "PaginationNext", "PaginationPrevious"],
  sourcePath: "components/ui/pagination.tsx",
};
