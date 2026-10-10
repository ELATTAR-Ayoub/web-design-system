"use client";

import { useSyncExternalStore } from "react";

import { Panel } from "@/components/ds/kit";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const NEVER_CHANGES = () => () => {};
const ON_CLIENT = () => true;
const ON_SERVER = () => false;

export function ViewportReport() {
  const isMobile = useIsMobile();
  const mounted = useSyncExternalStore(NEVER_CHANGES, ON_CLIENT, ON_SERVER);

  return (
    <Panel label="useIsMobile()" note={mounted ? String(isMobile) : "—"}>
      <div className="flex flex-col gap-3">
        <p
          className={cn(
            "type-h4",
            mounted && isMobile ? "text-action-ink" : "text-foreground",
          )}
        >
          {!mounted
            ? "Reading the viewport…"
            : isMobile
              ? "Mobile viewport"
              : "Desktop viewport"}
        </p>
        <p className="type-small text-muted-foreground">
          Narrow the window past 768px and this flips without a reload — the hook
          subscribes to <code className="type-code">matchMedia</code> rather than
          measuring once. Before hydration it reads its server snapshot, which is
          always desktop, so a phone sees one frame of the wrong answer and then
          the right one. That is the trade for not guessing a width on the
          server.
        </p>
      </div>
    </Panel>
  );
}
