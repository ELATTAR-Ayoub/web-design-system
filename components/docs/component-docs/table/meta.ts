import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "table",
  description:
    "Table — a semantic HTML table wrapped in its own horizontally scrolling container, with header, body, footer, row, cell and caption pieces styled to match the rest of the system.",
  dependencies: ["source-foundation"],
  exports: ["Table", "TableBody", "TableCaption", "TableCell", "TableFooter", "TableHead", "TableHeader", "TableRow"],
  sourcePath: "components/ui/table.tsx",
};
