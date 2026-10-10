"use client";

import { Shimmer } from "@/components/ai-elements/shimmer";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

export function ShimmerPreview() {
  return (
    <Panel label="Shimmer" note="as p, the default">
      <Shimmer className="type-small">Thinking…</Shimmer>
    </Panel>
  );
}

export function ShimmerExamples() {
  return (
    <div className="flex flex-col gap-4">
      <Panel label="As a span, in a sentence" note="as=&quot;span&quot;">
        <p className="type-body">
          The agent is <Shimmer as="span">reading the order form</Shimmer> now.
        </p>
      </Panel>
      <Panel label="As a heading" note="as=&quot;h3&quot;">
        <Shimmer as="h3" className="type-h4">
          Preparing your summary
        </Shimmer>
      </Panel>
    </div>
  );
}

export function ShimmerStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="loading" note="the only state: the sweep runs">
        <Shimmer className="type-small">Working…</Shimmer>
      </StateCell>
      <StateCell label="empty" note="empty string renders an empty element">
        <Shimmer className="type-small">{""}</Shimmer>
        <span className="type-small text-muted-foreground">(nothing visible)</span>
      </StateCell>
    </StateGrid>
  );
}
