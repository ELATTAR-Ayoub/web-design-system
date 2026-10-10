import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-sandbox",
  description:
    "A collapsible card for the result of running code: a header with the title and the tool's status, and Code and Output tabs beneath it.",
  dependencies: ["source-foundation"],
  exports: ["SandboxRootProps","Sandbox","SandboxHeaderProps","SandboxHeader","SandboxContentProps","SandboxContent","SandboxTabsProps","SandboxTabs","SandboxTabsBarProps","SandboxTabsBar","SandboxTabsListProps","SandboxTabsList","SandboxTabsTriggerProps","SandboxTabsTrigger","SandboxTabContentProps","SandboxTabContent"],
  sourcePath: "components/ai-elements/sandbox.tsx",
};
