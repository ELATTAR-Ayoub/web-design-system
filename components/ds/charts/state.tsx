"use client";

import { useState } from "react";
import { ChartLineIcon, TriangleAlertIcon } from "lucide-react";

import { Panel } from "@/components/ds/kit";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

import { PLOT } from "./data";
import { ChartSkeleton, type ChartSkeletonKind } from "./skeletons";

export type ChartState = "empty" | "error" | "loading" | "ready";

const STATES: { value: ChartState; label: string }[] = [
  { value: "empty", label: "Empty" },
  { value: "loading", label: "Loading" },
  { value: "error", label: "Error" },
  { value: "ready", label: "Ready" },
];

export function ChartStates({
  title,
  note,
  skeleton,
  controls: Controls,
  children,
  className,
}: {
  title: string;
  note?: string;
  skeleton: ChartSkeletonKind;
  controls?: React.ComponentType<{ children: React.ReactNode }>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, setState] = useState<ChartState>("ready");

  const slot = (
    <div key={state} data-slot="chart-state-slot" className="anim-enter">
      {state === "loading" ? (
        <ChartSkeleton kind={skeleton} />
      ) : state === "error" ? (
        <div className={cn(PLOT, "grid place-items-center")}>
          <Alert variant="destructive" className="max-w-100">
            <Icon icon={TriangleAlertIcon} tone="inherit" />
            <AlertTitle>This series did not load</AlertTitle>
            <AlertDescription>
              {/* The retry is its own block. Read as a direct child of
                  AlertDescription it flows INLINE after the full stop — caught
                  by opening the screenshot, not by any assertion: the words
                  read "...no partial reading is shown. [Try again]" on one
                  line, which makes the button look like part of the sentence. */}
              <p>
                The request for this range failed. Nothing was drawn, and no
                partial reading is shown.
              </p>
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setState("ready")}
                >
                  Try again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      ) : state === "empty" ? (
        <Empty className={cn(PLOT, "border border-dashed")}>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icon icon={ChartLineIcon} size="md" tone="inherit" />
            </EmptyMedia>
            <EmptyTitle>No data in this range</EmptyTitle>
            <EmptyDescription>
              Nothing came back for the period selected. Load the sample series
              to see the shape this chart draws.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm" onClick={() => setState("ready")}>
              Load sample data
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        children
      )}
    </div>
  );

  return (
    <Panel label={title} note={note} className={className}>
      <ToggleGroup
        type="single"
        size="sm"
        value={state}
        onValueChange={(next) => {
          // Radix clears the value when the active item is pressed again; keep one state selected.
          if (next) setState(next as ChartState);
        }}
        aria-label={`${title} — chart state`}
      >
        {STATES.map((s) => (
          <ToggleGroupItem key={s.value} value={s.value}>
            {s.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* The 20px below the toggle group belongs to the panel, not to the
          slot, so a control strip lands in it and the slot keeps its own
          footprint clean. Without `controls` this is the identical box the
          slot used to carry `mt-5` for. */}
      <div className="mt-5">{Controls ? <Controls>{slot}</Controls> : slot}</div>
    </Panel>
  );
}
