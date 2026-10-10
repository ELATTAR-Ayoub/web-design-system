"use client";

import { RefreshCcwIcon } from "lucide-react";

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";
import { Icon } from "@/components/ui/icon";

const SRC_DOC =
  "<!doctype html><html><body><h1>Preview</h1><p>This frame is an inline document, not a remote page.</p></body></html>";

const LOGS = [
  { level: "log" as const, message: "Server ready", timestamp: new Date(1_700_000_000_000) },
  { level: "warn" as const, message: "Image has no alt text", timestamp: new Date(1_700_000_001_000) },
  { level: "error" as const, message: "Failed to load /api/missing", timestamp: new Date(1_700_000_002_000) },
];

export function WebPreviewPreview() {
  return (
    <Panel label="WebPreview" note="inline document, read-only address">
      <WebPreview className="h-80" defaultUrl="about:blank">
        <WebPreviewNavigation>
          <WebPreviewNavigationButton tooltip="Reload">
            <Icon icon={RefreshCcwIcon} size="md" tone="inherit" />
            <span className="sr-only">Reload</span>
          </WebPreviewNavigationButton>
          <WebPreviewUrl aria-label="Address" readOnly />
        </WebPreviewNavigation>
        <WebPreviewBody srcDoc={SRC_DOC} />
        <WebPreviewConsole logs={LOGS} />
      </WebPreview>
    </Panel>
  );
}

export function WebPreviewStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="rest" note="frame with srcDoc">
        <WebPreview className="h-40 w-full" defaultUrl="about:blank">
          <WebPreviewNavigation>
            <WebPreviewUrl aria-label="Address" readOnly />
          </WebPreviewNavigation>
          <WebPreviewBody srcDoc={SRC_DOC} />
        </WebPreview>
      </StateCell>
      <StateCell label="empty" note="no URL: the frame has no src">
        <WebPreview className="h-40 w-full">
          <WebPreviewNavigation>
            <WebPreviewUrl aria-label="Address" readOnly />
          </WebPreviewNavigation>
          <WebPreviewBody />
        </WebPreview>
      </StateCell>
    </StateGrid>
  );
}
