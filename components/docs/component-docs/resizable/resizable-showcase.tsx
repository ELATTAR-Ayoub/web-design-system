"use client";

/**
 * Live companion for the `resizable` Preview — see traps.md #29. Drag the
 * handle (or tab to it and use the arrow keys) and each pane prints its own
 * live width, read from react-resizable-panels' own `onLayoutChanged`
 * callback rather than measured after the fact.
 */

import { useState } from "react";
import type { Layout } from "react-resizable-panels";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export function AdminSplitShowcase() {
  const [layout, setLayout] = useState<Layout>({ list: 40, detail: 60 });

  return (
    <ResizablePanelGroup
      className="min-h-56 rounded-lg border border-border"
      onLayoutChanged={(next) => setLayout(next)}
    >
      <ResizablePanel id="list" defaultSize={40} minSize={25}>
        <div className="h-full bg-background p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <p className="type-small text-muted-foreground">Card list</p>
            <p className="type-number-sm text-muted-foreground">
              {Math.round(layout.list ?? 40)}%
            </p>
          </div>
          <p className="type-small text-muted-foreground">
            Drag the handle, or tab to it and use the left and right arrow
            keys. Panel sizes persist while the session lasts.
          </p>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Resize the card list" />
      <ResizablePanel id="detail" defaultSize={60}>
        <div className="h-full bg-card p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <p className="type-small text-muted-foreground">Card detail</p>
            <p className="type-number-sm text-muted-foreground">
              {Math.round(layout.detail ?? 60)}%
            </p>
          </div>
          <p className="type-small text-muted-foreground">
            Editing a card&rsquo;s rarity, value and print run.
          </p>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
