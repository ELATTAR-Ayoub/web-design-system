/**
 * "Open full screen" — the `agent-workspace` docs page's own Preview
 * section links here. See `full-screen-workspace.tsx` for the client
 * component and its own reasoning; this file only carries the route's
 * metadata, the same split `agent-workspace/why/page.tsx` uses.
 */

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
