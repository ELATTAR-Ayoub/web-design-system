"use client";

import { Canvas } from "@/components/ai-elements/canvas";
import { Panel as FlowPanel } from "@/components/ai-elements/panel";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { edgeTypes, FlowFrame, miniNodeTypes, pairEdges, pairNodes, planEdges, planNodes, stepNodeTypes } from "../ai-canvas/flow-fixture";

/** The Preview: the goal and plan version in the top-left corner, as the workflow dialog shows them. */
export function PanelPreview() {
  return (
    <Panel label="Panel" note="stays put while the graph scrolls underneath">
      <FlowFrame label="Graph with a corner panel">
        <Canvas edges={planEdges} edgeTypes={edgeTypes} nodes={planNodes()} nodeTypes={stepNodeTypes} nodesConnectable={false} nodesDraggable={false}>
          <FlowPanel position="top-left">
            <p className="px-2 py-1 type-small">
              <span className="text-foreground">Weekly report</span>
              <span className="text-muted-foreground"> · Plan v3</span>
            </p>
          </FlowPanel>
        </Canvas>
      </FlowFrame>
    </Panel>
  );
}

function Cell({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  return (
    <StateCell label={position} note={`position="${position}"`}>
      <FlowFrame className="h-40" label={position}>
        <Canvas edges={pairEdges("default")} edgeTypes={edgeTypes} nodes={pairNodes()} nodeTypes={miniNodeTypes}>
          <FlowPanel position={position}>
            <p className="px-2 py-1 type-small">Panel</p>
          </FlowPanel>
        </Canvas>
      </FlowFrame>
    </StateCell>
  );
}

/** Where the panel can sit. */
export function PanelStateGrid() {
  return (
    <StateGrid cols={2}>
      <Cell position="top-left" />
      <Cell position="top-right" />
      <Cell position="bottom-left" />
      <Cell position="bottom-right" />
    </StateGrid>
  );
}
