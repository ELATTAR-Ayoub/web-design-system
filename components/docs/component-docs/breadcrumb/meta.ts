/**
 * Documentation metadata for `breadcrumb`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `breadcrumb` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "breadcrumb",
  description:
    "Breadcrumb — a wayfinding trail of links ending in the current, non-clickable page, with a separator between steps and an ellipsis for a path too long to show in full.",
  dependencies: ["source-foundation"],
  exports: ["Breadcrumb", "BreadcrumbEllipsis", "BreadcrumbItem", "BreadcrumbLink", "BreadcrumbList", "BreadcrumbPage", "BreadcrumbSeparator"],
  sourcePath: "components/ui/breadcrumb.tsx",
};
