import type { Metadata } from "next";

import { FullScreenWorkspace } from "./full-screen-workspace";

export const metadata: Metadata = {
  title: "AgentWorkspace — full screen — Elattar's Design System",
  description:
    "The live AgentWorkspace conversation picker and workspace, at the full viewport, with no docs chrome — for trying every container-query layout at real desktop width.",
};

export default function AgentWorkspaceLivePage() {
  return <FullScreenWorkspace />;
}
