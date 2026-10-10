import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-tool",
  description:
    "A collapsible card for one AI tool call: its name, a status badge for the seven tool states, its parameters and its result or error.",
  dependencies: ["source-foundation"],
  exports: ["ToolProps","Tool","ToolPart","ToolHeaderProps","getStatusBadge","ToolHeader","ToolContentProps","ToolContent","ToolInputProps","ToolInput","ToolOutputProps","ToolOutput"],
  sourcePath: "components/ai-elements/tool.tsx",
};
