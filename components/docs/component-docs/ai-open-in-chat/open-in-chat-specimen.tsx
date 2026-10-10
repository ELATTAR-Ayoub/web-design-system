"use client";

/**
 * Live specimens for the `ai-open-in-chat` page, rendering the real menu from
 * `components/ai-elements/open-in-chat.tsx`. The items are plain links; the
 * page never opens one.
 */

import {
  OpenIn,
  OpenInContent,
  OpenInLabel,
  OpenInLink,
  OpenInSeparator,
  OpenInTrigger,
  type OpenInTarget,
} from "@/components/ai-elements/open-in-chat";
import { Button } from "@/components/ui/button";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

export const QUERY = "Summarise the renewal and tell me what to decide.";

/** An example target: your own chat service, given the prompt in `q`. */
export const EXAMPLE_TARGET: OpenInTarget = {
  id: "example",
  title: "Open in Example Chat",
  createUrl: (query) => `https://example.com/chat?${new URLSearchParams({ q: query })}`,
};

/** The Preview: the trigger opens the list of targets, each a link carrying the query. */
export function OpenInPreview() {
  return (
    <Panel label="OpenIn" note="query travels in the link">
      <OpenIn query={QUERY}>
        <OpenInTrigger />
        <OpenInContent>
          <OpenInLabel>Open in</OpenInLabel>
          <OpenInSeparator />
          <OpenInLink target={EXAMPLE_TARGET} />
        </OpenInContent>
      </OpenIn>
    </Panel>
  );
}

/** Other configurations: a custom trigger and a second target. */
export function OpenInExamples() {
  return (
    <Panel label="Custom trigger, two targets">
      <OpenIn query={QUERY}>
        <OpenInTrigger>
          <Button size="sm" type="button" variant="ghost">
            Continue elsewhere
          </Button>
        </OpenInTrigger>
        <OpenInContent>
          <OpenInLink target={EXAMPLE_TARGET} />
          <OpenInLink target={{ ...EXAMPLE_TARGET, id: "example-2", title: "Open in Example Notes" }} />
        </OpenInContent>
      </OpenIn>
    </Panel>
  );
}

/** The States grid: the trigger and an open menu. */
export function OpenInStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="rest, hover, focus, pressed" note="trigger is Button outline">
        <OpenIn query={QUERY}>
          <OpenInTrigger />
          <OpenInContent>
            <OpenInLink target={EXAMPLE_TARGET} />
          </OpenInContent>
        </OpenIn>
      </StateCell>
      <StateCell label="disabled" note="a custom trigger carries disabled">
        <OpenIn query={QUERY}>
          <OpenInTrigger>
            <Button disabled type="button" variant="outline">
              Open in chat
            </Button>
          </OpenInTrigger>
          <OpenInContent>
            <OpenInLink target={EXAMPLE_TARGET} />
          </OpenInContent>
        </OpenIn>
      </StateCell>
    </StateGrid>
  );
}
