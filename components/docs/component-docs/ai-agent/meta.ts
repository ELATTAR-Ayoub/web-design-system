import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-agent",
  description:
    "A read-only card that describes an agent: its name and model, its instructions, its tools with their input schemas, and its output schema.",
  dependencies: ["source-foundation"],
  exports: ["AgentProps","Agent","AgentHeaderProps","AgentHeader","AgentContentProps","AgentContent","AgentInstructionsProps","AgentInstructions","AgentToolsProps","AgentTools","AgentToolProps","AgentTool","AgentOutputProps","AgentOutput"],
  sourcePath: "components/ai-elements/agent.tsx",
};
