/**
 * Documentation metadata for `agent-spark-field`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "agent-spark-field",
  description:
    "A canvas of rising agent-coloured sparks and a soft tint behind a prompt box, which flares on each keystroke while it is active.",
  dependencies: ["source-foundation"],
  exports: ["SparkFieldHandle","SparkField"],
  sourcePath: "components/agent/parts/spark-field.tsx",
};
