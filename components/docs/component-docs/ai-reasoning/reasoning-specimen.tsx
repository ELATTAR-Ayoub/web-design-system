"use client";

import { useState } from "react";

import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { Button } from "@/components/ui/button";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

export const THOUGHT =
  "The user asked for the renewal date. The contract says 1 March, and the order form agrees.\n\nNo conflicting clause turned up.";

export function ReasoningPlayground() {
  const [streaming, setStreaming] = useState(false);
  return (
    <Panel label="Reasoning" note={streaming ? "streaming" : "idle"}>
      <div className="flex flex-col gap-4">
        <Reasoning isStreaming={streaming}>
          <ReasoningTrigger />
          <ReasoningContent>{THOUGHT}</ReasoningContent>
        </Reasoning>
        <Button onClick={() => setStreaming((s) => !s)} size="sm" type="button" variant="outline">
          {streaming ? "Finish thinking" : "Start thinking"}
        </Button>
      </div>
    </Panel>
  );
}

export function ReasoningStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="rest, closed" note="duration unknown">
        <Reasoning defaultOpen={false}>
          <ReasoningTrigger />
          <ReasoningContent>{THOUGHT}</ReasoningContent>
        </Reasoning>
      </StateCell>
      <StateCell label="rest, closed, timed" note="duration=4">
        <Reasoning defaultOpen={false} duration={4}>
          <ReasoningTrigger />
          <ReasoningContent>{THOUGHT}</ReasoningContent>
        </Reasoning>
      </StateCell>
      <StateCell label="loading" note="isStreaming: opens, label shimmers">
        <Reasoning isStreaming>
          <ReasoningTrigger />
          <ReasoningContent>{"Reading the order form…"}</ReasoningContent>
        </Reasoning>
      </StateCell>
      <StateCell label="open" note="defaultOpen">
        <Reasoning defaultOpen duration={1}>
          <ReasoningTrigger />
          <ReasoningContent>{"One check, no conflicts."}</ReasoningContent>
        </Reasoning>
      </StateCell>
    </StateGrid>
  );
}
