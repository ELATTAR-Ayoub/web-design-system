import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "agent-spark-field",
  description:
    "A canvas of rising agent-coloured sparks and a soft tint behind a prompt box, which flares on each keystroke while it is active.",
  dependencies: ["source-foundation"],
  exports: ["SparkFieldHandle","SparkField"],
  sourcePath: "components/agent/parts/spark-field.tsx",
};
