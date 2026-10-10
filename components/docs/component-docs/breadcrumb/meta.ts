import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "breadcrumb",
  description:
    "Breadcrumb — a wayfinding trail of links ending in the current, non-clickable page, with a separator between steps and an ellipsis for a path too long to show in full.",
  dependencies: ["source-foundation"],
  exports: ["Breadcrumb", "BreadcrumbEllipsis", "BreadcrumbItem", "BreadcrumbLink", "BreadcrumbList", "BreadcrumbPage", "BreadcrumbSeparator"],
  sourcePath: "components/ui/breadcrumb.tsx",
};
