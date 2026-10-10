"use client";

import { RotateCcwIcon } from "lucide-react";
import * as React from "react";

import { Checkpoint, CheckpointIcon, CheckpointTrigger } from "@/components/ai-elements/checkpoint";
import { Icon } from "@/components/ui/icon";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

export function CheckpointShowcase() {
  const [restored, setRestored] = React.useState<string | null>(null);
  return (
    <TooltipProvider>
      <Panel label="Checkpoint" note={restored ? `restored: ${restored}` : "not restored"}>
        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
          <p className="type-body">Add a CSV export to the invoices page.</p>
          <Checkpoint>
            <CheckpointIcon />
            <CheckpointTrigger
              aria-label="Restore to before the export change"
              onClick={() => setRestored("before the export change")}
              tooltip="Restores the workspace and chat to this point"
            >
              Before the export change
            </CheckpointTrigger>
          </Checkpoint>
          <p className="type-body text-muted-foreground">Done — the export button is on the toolbar.</p>
        </div>
      </Panel>
    </TooltipProvider>
  );
}

export function CheckpointStateGrid() {
  return (
    <TooltipProvider>
      <StateGrid cols={3}>
        <StateCell label="rest">
          <Checkpoint className="w-full">
            <CheckpointIcon />
            <CheckpointTrigger>Restore checkpoint</CheckpointTrigger>
          </Checkpoint>
        </StateCell>
        <StateCell label="disabled">
          <Checkpoint className="w-full">
            <CheckpointIcon />
            <CheckpointTrigger disabled>Restore checkpoint</CheckpointTrigger>
          </Checkpoint>
        </StateCell>
        <StateCell label="with tooltip" note="hover or focus the label">
          <Checkpoint className="w-full">
            <CheckpointIcon />
            <CheckpointTrigger tooltip="Restores workspace and chat to this point">Restore checkpoint</CheckpointTrigger>
          </Checkpoint>
        </StateCell>
      </StateGrid>
    </TooltipProvider>
  );
}

export function CheckpointExamples() {
  return (
    <TooltipProvider>
      <Panel label="Custom icon">
        <div className="mx-auto w-full max-w-md">
          <Checkpoint>
            <CheckpointIcon>
              <Icon icon={RotateCcwIcon} size="md" tone="muted" />
            </CheckpointIcon>
            <CheckpointTrigger variant="outline">Undo to here</CheckpointTrigger>
          </Checkpoint>
        </div>
      </Panel>
    </TooltipProvider>
  );
}
