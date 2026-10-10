"use client";

/**
 * Live specimens for the `ai-chain-of-thought` page, rendering the real parts
 * from `components/ai-elements/chain-of-thought.tsx` with fixed steps.
 */

import { useState } from "react";
import { FileTextIcon, SearchIcon } from "lucide-react";

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtImage,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

function Steps() {
  return (
    <ChainOfThoughtContent>
      <ChainOfThoughtStep label="Read the order form" status="complete" />
      <ChainOfThoughtStep
        description="Three results matched the renewal clause."
        icon={SearchIcon}
        label="Searched for “renewal terms”"
        status="complete"
      >
        <ChainOfThoughtSearchResults>
          <ChainOfThoughtSearchResult>contracts.example</ChainOfThoughtSearchResult>
          <ChainOfThoughtSearchResult>finance.example</ChainOfThoughtSearchResult>
        </ChainOfThoughtSearchResults>
      </ChainOfThoughtStep>
      <ChainOfThoughtStep icon={FileTextIcon} label="Comparing the discount dates" status="active" />
      <ChainOfThoughtStep label="Draft the summary" status="pending" />
    </ChainOfThoughtContent>
  );
}

/** The Preview: a header you can open, with steps of every status. */
export function ChainOfThoughtPreview() {
  return (
    <Panel label="ChainOfThought" note="4 steps">
      <ChainOfThought defaultOpen>
        <ChainOfThoughtHeader>Worked through 4 steps</ChainOfThoughtHeader>
        <Steps />
      </ChainOfThought>
    </Panel>
  );
}

/** Controlled, with a shimmering header while work is in flight, and an image step. */
export function ChainOfThoughtExamples() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex flex-col gap-4">
      <Panel label="Controlled, working" note={open ? "open" : "closed"}>
        <ChainOfThought onOpenChange={setOpen} open={open}>
          <ChainOfThoughtHeader>
            <Shimmer as="span">Working…</Shimmer>
          </ChainOfThoughtHeader>
          <Steps />
        </ChainOfThought>
      </Panel>
      <Panel label="With an image" note="ChainOfThoughtImage">
        <ChainOfThought defaultOpen>
          <ChainOfThoughtHeader>Checked the chart</ChainOfThoughtHeader>
          <ChainOfThoughtContent>
            <ChainOfThoughtStep label="Looked at the seat chart" status="complete">
              <ChainOfThoughtImage caption="Seats by month, from the usage export.">
                {/* A plain img: the sample is a local static file, not an optimised asset. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="A sample image" className="max-h-48 rounded-md" src="/imgs/sample-photo.jpg" />
              </ChainOfThoughtImage>
            </ChainOfThoughtStep>
          </ChainOfThoughtContent>
        </ChainOfThought>
      </Panel>
    </div>
  );
}

/** The States grid. */
export function ChainOfThoughtStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="step: complete" note="muted text">
        <ChainOfThought className="w-48">
          <ChainOfThoughtStep label="Read the form" status="complete" />
        </ChainOfThought>
      </StateCell>
      <StateCell label="step: active" note="foreground text">
        <ChainOfThought className="w-48">
          <ChainOfThoughtStep label="Comparing dates" status="active" />
        </ChainOfThought>
      </StateCell>
      <StateCell label="step: pending" note="half-strength text">
        <ChainOfThought className="w-48">
          <ChainOfThoughtStep label="Draft the summary" status="pending" />
        </ChainOfThought>
      </StateCell>
      <StateCell label="closed" note="header only">
        <ChainOfThought className="w-48">
          <ChainOfThoughtHeader />
        </ChainOfThought>
      </StateCell>
    </StateGrid>
  );
}
