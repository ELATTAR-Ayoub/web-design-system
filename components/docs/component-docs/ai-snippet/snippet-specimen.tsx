"use client";

import * as React from "react";

import { Snippet, SnippetAddon, SnippetCopyButton, SnippetInput, SnippetText } from "@/components/ai-elements/snippet";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

const COMMAND = "npm run check:tokens";

export function SnippetPreview() {
  const [note, setNote] = React.useState("press copy");
  return (
    <Panel label="Snippet" note={note}>
      <Snippet code={COMMAND}>
        <SnippetAddon>
          <SnippetText>$</SnippetText>
        </SnippetAddon>
        <SnippetInput aria-label="Command" />
        <SnippetAddon align="inline-end">
          <SnippetCopyButton onCopy={() => setNote("copied")} />
        </SnippetAddon>
      </Snippet>
    </Panel>
  );
}

export function SnippetStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="rest" note="read-only input, copy button">
        <Snippet className="w-full max-w-xs" code={COMMAND}>
          <SnippetAddon>
            <SnippetText>$</SnippetText>
          </SnippetAddon>
          <SnippetInput aria-label="Command" />
          <SnippetAddon align="inline-end">
            <SnippetCopyButton />
          </SnippetAddon>
        </Snippet>
      </StateCell>
      <StateCell label="no prefix" note="just the value and copy">
        <Snippet className="w-full max-w-xs" code="v2.4.1">
          <SnippetInput aria-label="Version" />
          <SnippetAddon align="inline-end">
            <SnippetCopyButton />
          </SnippetAddon>
        </Snippet>
      </StateCell>
      <StateCell label="disabled" note="the group dims; the input and button are disabled">
        <Snippet className="w-full max-w-xs" code={COMMAND}>
          <SnippetAddon>
            <SnippetText>$</SnippetText>
          </SnippetAddon>
          <SnippetInput aria-label="Command" disabled />
          <SnippetAddon align="inline-end">
            <SnippetCopyButton disabled />
          </SnippetAddon>
        </Snippet>
      </StateCell>
      <StateCell label="empty" note="code is an empty string">
        <Snippet className="w-full max-w-xs" code="">
          <SnippetInput aria-label="Empty snippet" />
          <SnippetAddon align="inline-end">
            <SnippetCopyButton />
          </SnippetAddon>
        </Snippet>
      </StateCell>
    </StateGrid>
  );
}

export function SnippetExamples() {
  return (
    <Panel label="Custom label" note="aria-label names the copy button">
      <Snippet code="sk_test_example_key">
        <SnippetInput aria-label="Test key" />
        <SnippetAddon align="inline-end">
          <SnippetCopyButton aria-label="Copy test key" />
        </SnippetAddon>
      </Snippet>
    </Panel>
  );
}
