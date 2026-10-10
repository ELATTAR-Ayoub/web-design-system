import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "disabled",
  description:
    "Disabled — the reason-and-recovery contract around an inert control.",
  dependencies: ["button", "popover", "source-foundation"],
  exports: ["Disabled", "DisabledMode", "DisabledProps"],
  sourcePath: "components/ui/disabled.tsx",
};
