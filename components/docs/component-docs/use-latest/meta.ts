import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "use-latest",
  description:
    "Ref hook that always holds the latest value of a prop or callback across renders.",
  dependencies: ["source-foundation"],
  exports: ["useLatest"],
  sourcePath: "hooks/use-latest.ts",
};
