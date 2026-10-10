import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "pagination",
  description:
    "Pagination — page links built from anchors rather than buttons, with previous and next controls that go properly inert, not just disabled-looking, once there is no page left in that direction.",
  dependencies: ["button", "source-foundation"],
  exports: ["Pagination", "PaginationContent", "PaginationEllipsis", "PaginationItem", "PaginationLink", "PaginationNext", "PaginationPrevious"],
  sourcePath: "components/ui/pagination.tsx",
};
