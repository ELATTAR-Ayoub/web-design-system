"use client";

import { useState } from "react";

import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

const ITEMS = ["Summarise this", "Draft a reply", "Find the risk", "Compare with last year", "List the open questions"];

export function SuggestionPlayground() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <Panel label="Suggestions" note={picked ?? "none picked"}>
      <Suggestions>
        {ITEMS.map((s) => (
          <Suggestion key={s} onClick={setPicked} suggestion={s} />
        ))}
      </Suggestions>
    </Panel>
  );
}

export function SuggestionExamples() {
  return (
    <Panel label="Wrapped and centred" note="className on Suggestions">
      <Suggestions className="w-full flex-wrap justify-center">
        {ITEMS.slice(0, 4).map((s) => (
          <Suggestion key={s} onClick={() => {}} suggestion={s} />
        ))}
      </Suggestions>
    </Panel>
  );
}

export function SuggestionStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="rest, hover, focus, pressed" note="inherited from Button outline">
        <Suggestion onClick={() => {}} suggestion="Summarise this" />
      </StateCell>
      <StateCell label="disabled" note="disabled passes to Button">
        <Suggestion disabled onClick={() => {}} suggestion="Summarise this" />
      </StateCell>
      <StateCell label="custom children" note="label differs from the sent text">
        <Suggestion onClick={() => {}} suggestion="Summarise this">
          Summarise
        </Suggestion>
      </StateCell>
    </StateGrid>
  );
}
