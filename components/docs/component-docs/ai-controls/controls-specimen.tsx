"use client";

import type { ReactNode } from "react";

import { Canvas } from "@/components/ai-elements/canvas";
import { Controls } from "@/components/ai-elements/controls";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { edgeTypes, FlowFrame, miniNodeTypes, pairEdges, pairNodes, planEdges, planNodes, stepNodeTypes } from "../ai-canvas/flow-fixture";

/** The Preview: zoom in, zoom out and fit view, in the workspace's configuration (no lock button). */
export function ControlsPreview() {
  return (
    <Panel label="Controls" note="the workflow dialog's configuration: showInteractive={false}">
      <FlowFrame label="Graph with zoom controls">
        <Canvas edges={planEdges} edgeTypes={edgeTypes} nodes={planNodes()} nodeTypes={stepNodeTypes} nodesConnectable={false} nodesDraggable={false}>
          <Controls showInteractive={false} />
        </Canvas>
      </FlowFrame>
    </Panel>
  );
}

function Cell({ label, note, controls }: { label: string; note: string; controls: ReactNode }) {
  return (
    <StateCell label={label} note={note}>
      <FlowFrame className="h-48" label={label}>
        <Canvas edges={pairEdges("default")} edgeTypes={edgeTypes} nodes={pairNodes()} nodeTypes={miniNodeTypes}>
          {controls}
        </Canvas>
      </FlowFrame>
    </StateCell>
  );
}

/** The configurations the props allow. */
export function ControlsStateGrid() {
  return (
    <StateGrid cols={3}>
      <Cell controls={<Controls />} label="rest" note="all four buttons, including the lock" />
      <Cell controls={<Controls orientation="horizontal" showInteractive={false} />} label="horizontal" note="orientation=horizontal" />
      <Cell controls={<Controls showFitView={false} showInteractive={false} />} label="zoom only" note="showFitView=false" />
    </StateGrid>
  );
}
