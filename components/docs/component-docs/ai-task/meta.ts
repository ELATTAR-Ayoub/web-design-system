/**
 * Documentation metadata for `ai-task`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-task",
  description:
    "A collapsible list of the small steps an agent took for one piece of work, each as a line of text or a file chip.",
  dependencies: ["source-foundation"],
  exports: ["TaskItemFileProps","TaskItemFile","TaskItemProps","TaskItem","TaskProps","Task","TaskTriggerProps","TaskTrigger","TaskContentProps","TaskContent"],
  sourcePath: "components/ai-elements/task.tsx",
};
