import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "avatar",
  description:
    "Avatar — a circular identity image with an initials fallback for when it fails to load, a status badge pinned to its corner, and a stacking Group with an overflow count, all keyed to one of three sizes.",
  dependencies: ["source-foundation"],
  exports: ["Avatar", "AvatarBadge", "AvatarFallback", "AvatarGroup", "AvatarGroupCount", "AvatarImage"],
  sourcePath: "components/ui/avatar.tsx",
};
