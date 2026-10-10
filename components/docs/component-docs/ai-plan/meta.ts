import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-plan",
  description:
    "A collapsible card that lists the steps an agent intends to take, with a title, a description, a toggle and an optional footer.",
  dependencies: ["source-foundation"],
  exports: ["PlanProps","Plan","PlanHeaderProps","PlanHeader","PlanTitleProps","PlanTitle","PlanDescriptionProps","PlanDescription","PlanActionProps","PlanAction","PlanContentProps","PlanContent","PlanFooterProps","PlanFooter","PlanTriggerProps","PlanTrigger"],
  sourcePath: "components/ai-elements/plan.tsx",
};
