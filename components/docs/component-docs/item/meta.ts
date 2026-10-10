import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "item",
  description:
    "Item — a generic row for a list: media, title, description, and actions in one flex layout, meant to sit inside an ItemGroup, which gives the list and each row their proper ARIA roles.",
  dependencies: ["separator", "source-foundation"],
  exports: ["Item", "ItemActions", "ItemContent", "ItemDescription", "ItemFooter", "ItemGroup", "ItemHeader", "ItemMedia", "ItemSeparator", "ItemTitle"],
  sourcePath: "components/ui/item.tsx",
};
