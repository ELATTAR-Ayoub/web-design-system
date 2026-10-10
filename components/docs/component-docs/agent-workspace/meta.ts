/**
 * Documentation metadata for `agent-workspace`.
 *
 * Paired with `page.tsx` in this directory. Family, ownership and delivery
 * are NOT repeated here — they come from `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "agent-workspace",
  description:
    "The one complete agent surface, built from Vercel AI Elements — history sidebar, thin header, the reply thread with its run inline, and the prompt composer — pointed at a single AgentTransport.",
  dependencies: ["source-foundation"],
  exports: ["AgentWorkspace", "AgentWorkspaceProps"],
  sourcePath: "components/agent/agent-workspace.tsx",
};
