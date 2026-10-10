"use client";

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
  onEditStep?: (stepId: string, title: string) => void;
};

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
