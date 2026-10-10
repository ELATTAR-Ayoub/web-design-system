import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "user-menu",
  description:
    "User menu — the account row a sidebar footer needs: identity, a dropdown of items with destructive actions set apart below a separator, opening beside the row on desktop and below it once the layout narrows.",
  dependencies: ["avatar", "dropdown-menu", "sidebar", "source-foundation"],
  exports: ["UserMenu", "UserMenuItem"],
  sourcePath: "components/ui/user-menu.tsx",
};
