"use client";

import type { ConnectionLineComponentProps } from "@xyflow/react";

import { Canvas } from "@/components/ai-elements/canvas";
import { Connection } from "@/components/ai-elements/connection";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { edgeTypes, FlowFrame, miniNodeTypes, pairNodes } from "../ai-canvas/flow-fixture";

function linePoints(fromX: number, fromY: number, toX: number, toY: number) {
  return { fromX, fromY, toX, toY } as unknown as ConnectionLineComponentProps;
}

export function ConnectionFrozen({ toX = 220, toY = 70 }: { toX?: number; toY?: number }) {
  return (
    <svg aria-label="A connection line mid-drag" className="h-24 w-full" role="img" viewBox="0 0 260 100">
      <Connection {...linePoints(20, 30, toX, toY)} />
    </svg>
  );
}

export function ConnectionPreview() {
  return (
    <div className="flex flex-col gap-4">
      <Panel label="Connection" note="frozen mid-drag: a bezier in the ring colour ending in a dot">
        <ConnectionFrozen />
      </Panel>
      <Panel label="Live" note="drag from the right-hand handle of From">
        <FlowFrame className="h-48" label="Draw a connection">
          <Canvas connectionLineComponent={Connection} edges={[]} edgeTypes={edgeTypes} nodes={pairNodes().map((n) => ({ ...n, connectable: true }))} nodeTypes={miniNodeTypes} nodesDraggable={false} />
        </FlowFrame>
      </Panel>
    </div>
  );
}

export function ConnectionStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="rest" note="nothing drawn when no drag is live">
        <span className="type-small text-muted-foreground">Rendered only while a connection is being dragged.</span>
      </StateCell>
      <StateCell label="forward" note="target right of the source">
        <ConnectionFrozen />
      </StateCell>
      <StateCell label="backward" note="target left of the source">
        <ConnectionFrozen toX={10} toY={80} />
      </StateCell>
    </StateGrid>
  );
}
