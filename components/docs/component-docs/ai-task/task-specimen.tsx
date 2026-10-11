"use client";

import { Task, TaskContent, TaskItem, TaskItemFile, TaskTrigger } from "@/components/ai-elements/task";
import { Button } from "@/components/ui/button";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

function SampleTask({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <Task defaultOpen={defaultOpen}>
      <TaskTrigger title="Found the export code" />
      <TaskContent>
        <TaskItem>Searching for &quot;invoice export&quot;</TaskItem>
        <TaskItem>
          <span className="inline-flex flex-wrap items-center gap-1">
            Read
            <TaskItemFile>export.ts</TaskItemFile>
          </span>
        </TaskItem>
        <TaskItem>Scanning 12 files</TaskItem>
      </TaskContent>
    </Task>
  );
}

export function TaskShowcase() {
  return (
    <Panel label="Task">
      <div className="mx-auto w-full max-w-md">
        <SampleTask />
      </div>
    </Panel>
  );
}

export function TaskStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="rest (open)" note="defaultOpen is true">
        <div className="w-full">
          <SampleTask />
        </div>
      </StateCell>
      <StateCell label="collapsed" note="defaultOpen={false}">
        <div className="w-full">
          <SampleTask defaultOpen={false} />
        </div>
      </StateCell>
    </StateGrid>
  );
}

export function TaskExamples() {
  return (
    <Panel label="Custom trigger">
      <div className="mx-auto w-full max-w-md">
        <Task>
          <TaskTrigger title="Checked the ledger">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto w-full justify-start px-0"
              type="button"
            >
              Checked the ledger · 2 of 3 steps
            </Button>
          </TaskTrigger>
          <TaskContent>
            <TaskItem>Compared 3 totals</TaskItem>
            <TaskItem>One total differs by 0.01</TaskItem>
          </TaskContent>
        </Task>
      </div>
    </Panel>
  );
}
