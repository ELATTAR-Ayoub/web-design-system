import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-web-preview",
  description:
    "A browser-style frame with an address field, toolbar buttons, a sandboxed iframe and a collapsible console, for showing a web page an agent built or opened.",
  dependencies: ["source-foundation"],
  exports: ["WebPreviewContextValue","WebPreviewProps","WebPreview","WebPreviewNavigationProps","WebPreviewNavigation","WebPreviewNavigationButtonProps","WebPreviewNavigationButton","WebPreviewUrlProps","WebPreviewUrl","WebPreviewBodyProps","WebPreviewBody","WebPreviewConsoleProps","WebPreviewConsole"],
  sourcePath: "components/ai-elements/web-preview.tsx",
};
