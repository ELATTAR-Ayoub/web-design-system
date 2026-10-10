import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "agent-avatar",
  description:
    "The assistant's default face: twenty isometric cube scenes that cross-fade between agent states and rotate on three axes while idle.",
  dependencies: [],
  exports: ["CubeAvatar"],
  sourcePath: "components/agent/avatar/cube-avatar.tsx",
};
