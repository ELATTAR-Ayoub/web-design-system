"use client";

/**
 * "View as workflow" — the run's plan drawn as a graph.
 *
 * Built from the AI Elements workflow parts the way their `workflow.tsx` /
 * `demo-workflow.tsx` examples use them: a `Canvas`, one `Node` per step
 * (`NodeHeader` title, `NodeContent` detail, `NodeFooter` status), an `Edge`
 * between consecutive steps, the `Connection` line, `Controls`, a `Panel`
 * naming the goal and version, and a `Toolbar` on each node.
 *
 * Read-only. A plan is a line of steps, not a graph the person wires up, so
 * `nodesConnectable` is off, nothing can be dragged or deleted, and the xyflow
 * handles are decoration. The one edit is the step's title, through the
 * toolbar, handed back to the caller (`onEditStep`) so it is the same local
 * edit the Plan card makes.
 */

import { useRef, useState } from "react";
import type { Edge as FlowEdge, Node as FlowNode, NodeProps as FlowNodeProps } from "@xyflow/react";
import { PencilIcon } from "lucide-react";

import { remVarToPx, useContainerInlineSize } from "@/components/agent/core/use-container-width";
import type { PlanStep, Run } from "@/components/agent/core/run";
import { formatDuration, STEP_STATUS_LABEL, StepStatusMark } from "@/components/agent/workspace/step-status";
import { Canvas } from "@/components/ai-elements/canvas";
import { Connection } from "@/components/ai-elements/connection";
import { Controls } from "@/components/ai-elements/controls";
import { Edge } from "@/components/ai-elements/edge";
import { Node, NodeContent, NodeDescription, NodeFooter, NodeHeader, NodeTitle } from "@/components/ai-elements/node";
import { Panel } from "@/components/ai-elements/panel";
import { Toolbar } from "@/components/ai-elements/toolbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";

export type WorkflowDialogProps = {
  run: Run;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present when the plan may still be edited; the node toolbar offers "Edit step". */
  onEditStep?: (stepId: string, title: string) => void;
};

/**
 * Distance between node origins, in React Flow's own coordinate space (plain
 * px at zoom 1 - not a CSS length, so no token applies). It is coupled to the
 * node's width: a step node is `w-60` (15rem = 240px), so COLUMN_STEP = 240 plus
 * a 60px run for the edge, and ROW_STEP clears a node's ~112px height plus
 * its toolbar. Kept small so fit-to-view keeps a four-step plan near zoom 1 —
 * at 384px nodes the graph zoomed out until the text was unreadable. Change
 * the node size and these move with it.
 */
const COLUMN_STEP = 300;
const ROW_STEP = 180;

type StepNodeData = {
  step: PlanStep;
  index: number;
  total: number;
  editable: boolean;
  onEditStep?: (stepId: string, title: string) => void;
  [key: string]: unknown;
};

type StepFlowNode = FlowNode<StepNodeData, "step">;

/**
 * The plan as a graph: one node per step in a line, an edge between each
 * consecutive pair. The edge into the running step travels; the edge into a
 * skipped step is the dashed alternate path.
 */
export function buildWorkflowGraph(
  run: Run,
  options: { vertical?: boolean; editable?: boolean; onEditStep?: WorkflowDialogProps["onEditStep"] } = {},
): { nodes: StepFlowNode[]; edges: FlowEdge[] } {
  const { vertical = false, editable = false, onEditStep } = options;
  const nodes: StepFlowNode[] = run.plan.map((step, index) => ({
    id: step.id,
    type: "step",
    position: vertical ? { x: 0, y: index * ROW_STEP } : { x: index * COLUMN_STEP, y: 0 },
    data: { step, index, total: run.plan.length, editable, onEditStep },
    draggable: false,
    connectable: false,
    deletable: false,
  }));
  const edges: FlowEdge[] = run.plan.slice(1).map((step, i) => ({
    id: `${run.plan[i].id}->${step.id}`,
    source: run.plan[i].id,
    target: step.id,
    type: step.status === "running" ? "animated" : step.status === "skipped" ? "temporary" : "default",
    deletable: false,
    reconnectable: false,
  }));
  return { nodes, edges };
}

function StepNode({ data }: FlowNodeProps<StepFlowNode>) {
  const { step, index, total, editable, onEditStep } = data;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(step.title);

  const save = () => {
    const title = draft.trim();
    if (title && title !== step.title) onEditStep?.(step.id, title);
    setEditing(false);
  };

  return (
    <Node className="w-60" handles={{ target: index > 0, source: index < total - 1 }}>
      <NodeHeader>
        <NodeTitle>{step.title}</NodeTitle>
        <NodeDescription>{`Step ${index + 1} of ${total}`}</NodeDescription>
      </NodeHeader>
      <NodeContent>
        {editing ? (
          <form
            className="nodrag nopan flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <Input aria-label={`Title of step ${index + 1}`} autoFocus onChange={(e) => setDraft(e.target.value)} value={draft} />
            <Button size="sm" type="submit">
              Save
            </Button>
            <Button
              onClick={() => {
                setDraft(step.title);
                setEditing(false);
              }}
              size="sm"
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
          </form>
        ) : (
          <p className="type-small text-muted-foreground">{step.detail ?? "No further detail."}</p>
        )}
      </NodeContent>
      <NodeFooter className="justify-between gap-2">
        <span className="inline-flex items-center gap-2 type-small">
          <StepStatusMark decorative status={step.status} />
          {STEP_STATUS_LABEL[step.status]}
        </span>
        {step.ms !== undefined && <span className="type-small text-muted-foreground">{formatDuration(step.ms)}</span>}
      </NodeFooter>
      {/* Shown for the selected node only — React Flow's default — not under every node at once. */}
      {editable && (
        <Toolbar>
          <Button
            onClick={() => {
              setDraft(step.title);
              setEditing(true);
            }}
            size="sm"
            variant="ghost"
          >
            <Icon icon={PencilIcon} size="sm" tone="inherit" />
            Edit step
          </Button>
        </Toolbar>
      )}
    </Node>
  );
}

const nodeTypes = { step: StepNode };
const edgeTypes = { animated: Edge.Animated, temporary: Edge.Temporary };

function WorkflowGraph({ run, onEditStep }: Pick<WorkflowDialogProps, "run" | "onEditStep">) {
  const ref = useRef<HTMLDivElement>(null);
  const width = useContainerInlineSize(ref);
  // 0 until measured: draw the wide layout rather than flash a column.
  const vertical = width > 0 && width < remVarToPx("--container-3xl", 48);
  const editable = Boolean(onEditStep) && run.status === "proposed";
  const { nodes, edges } = buildWorkflowGraph(run, { vertical, editable, onEditStep });

  return (
    <div className="h-full min-h-0 w-full" data-testid="workflow-canvas" ref={ref}>
      <Canvas
        connectionLineComponent={Connection}
        deleteKeyCode={null}
        edges={edges}
        edgeTypes={edgeTypes}
        edgesReconnectable={false}
        // Re-fit when the layout flips between a row and a column.
        key={vertical ? "column" : "row"}
        nodes={nodes}
        nodesConnectable={false}
        nodesDraggable={false}
        nodeTypes={nodeTypes}
      >
        <Controls showInteractive={false} />
        <Panel position="top-left">
          <p className="px-2 py-1 type-small">
            <span className="text-foreground">{run.goal}</span>
            <span className="text-muted-foreground">{` · Plan v${run.version}`}</span>
          </p>
        </Panel>
      </Canvas>
    </div>
  );
}

export function WorkflowDialog({ run, open, onOpenChange, onEditStep }: WorkflowDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      {/* h-3/4: the dialog is fixed to the viewport, so 3/4 is three quarters of it. */}
      <DialogContent className="flex h-3/4 flex-col sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Workflow</DialogTitle>
          <DialogDescription>
            {`${run.plan.length} ${run.plan.length === 1 ? "step" : "steps"}, in the order they run.`}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-hidden rounded-md border">
          <WorkflowGraph onEditStep={onEditStep} run={run} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
