"use client";

import { Plan, PlanAction, PlanContent, PlanDescription, PlanFooter, PlanHeader, PlanTitle, PlanTrigger } from "@/components/ai-elements/plan";
import { Button } from "@/components/ui/button";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

const STEPS = ["Read the failing invoice export", "Reproduce it against the staging ledger", "Patch the rounding rule", "Re-run the export and compare totals"];

function Steps() {
  return (
    <ol className="flex flex-col gap-2">
      {STEPS.map((step, i) => (
        <li className="flex items-start gap-3" key={step}>
          <span className="w-5 shrink-0 text-right type-number-sm text-muted-foreground">{i + 1}</span>
          <span className="type-body">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function SamplePlan({ streaming = false, defaultOpen = true }: { streaming?: boolean; defaultOpen?: boolean }) {
  return (
    <Plan defaultOpen={defaultOpen} isStreaming={streaming}>
      <PlanHeader>
        <div className="flex min-w-0 flex-col gap-1">
          <PlanTitle>Fix the invoice export</PlanTitle>
          <PlanDescription>{streaming ? "Drafting the plan…" : "4 steps"}</PlanDescription>
        </div>
        <PlanAction>
          <PlanTrigger />
        </PlanAction>
      </PlanHeader>
      <PlanContent>
        <Steps />
      </PlanContent>
    </Plan>
  );
}

export function PlanShowcase() {
  return (
    <Panel label="Plan">
      <div className="mx-auto w-full max-w-xl">
        <Plan defaultOpen>
          <PlanHeader>
            <div className="flex min-w-0 flex-col gap-1">
              <PlanTitle>Fix the invoice export</PlanTitle>
              <PlanDescription>4 steps</PlanDescription>
            </div>
            <PlanAction>
              <PlanTrigger />
            </PlanAction>
          </PlanHeader>
          <PlanContent>
            <Steps />
          </PlanContent>
          <PlanFooter>
            <Button size="sm">Run the plan</Button>
          </PlanFooter>
        </Plan>
      </div>
    </Panel>
  );
}

export function PlanStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="rest (open)">
        <div className="w-full">
          <SamplePlan />
        </div>
      </StateCell>
      <StateCell label="collapsed" note="defaultOpen={false}">
        <div className="w-full">
          <SamplePlan defaultOpen={false} />
        </div>
      </StateCell>
      <StateCell label="loading" note="isStreaming shimmers title and description">
        <div className="w-full">
          <SamplePlan streaming />
        </div>
      </StateCell>
    </StateGrid>
  );
}

export function PlanExamples() {
  return (
    <Panel label="Collapsed, no footer">
      <div className="mx-auto w-full max-w-xl">
        <SamplePlan defaultOpen={false} />
      </div>
    </Panel>
  );
}
