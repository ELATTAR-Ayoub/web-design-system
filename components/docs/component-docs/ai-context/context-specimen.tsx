"use client";

import type { LanguageModelUsage } from "ai";

import {
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
} from "@/components/ai-elements/context";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

const USAGE = {
  inputTokens: 48_200,
  outputTokens: 6_100,
  reasoningTokens: 2_400,
  cachedInputTokens: 12_000,
  totalTokens: 54_300,
  inputTokenDetails: { noCacheTokens: undefined, cacheReadTokens: 12_000, cacheWriteTokens: undefined },
  outputTokenDetails: { textTokens: undefined, reasoningTokens: 2_400 },
} as LanguageModelUsage;

/** The popup's contents laid out in place, so the figures can be read without hovering. */
function PopupBody() {
  return (
    <div className="w-60 divide-y overflow-hidden rounded-md border bg-popover">
      <ContextContentHeader />
      <ContextContentBody className="space-y-1.5">
        <ContextInputUsage />
        <ContextOutputUsage />
        <ContextReasoningUsage />
        <ContextCacheUsage />
      </ContextContentBody>
      <ContextContentFooter />
    </div>
  );
}

/** The Preview: the meter as the composer wears it. Hover or focus the trigger for the real popup. */
export function ContextShowcase() {
  return (
    <Panel label="Context" note="hover or focus the trigger">
      <div className="flex flex-wrap items-start justify-center gap-8">
        <Context maxTokens={200_000} modelId="gpt-4o" usage={USAGE} usedTokens={54_300}>
          <ContextTrigger size="sm" />
          <ContextContent>
            <ContextContentHeader />
            <ContextContentBody className="space-y-1.5">
              <ContextInputUsage />
              <ContextOutputUsage />
              <ContextReasoningUsage />
              <ContextCacheUsage />
            </ContextContentBody>
            <ContextContentFooter />
          </ContextContent>
        </Context>
        <Context maxTokens={200_000} modelId="gpt-4o" usage={USAGE} usedTokens={54_300}>
          <PopupBody />
        </Context>
      </div>
    </Panel>
  );
}

/** The States grid. */
export function ContextStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="low" note="a quarter used">
        <Context maxTokens={200_000} modelId="gpt-4o" usedTokens={50_000}>
          <ContextTrigger size="sm" />
        </Context>
      </StateCell>
      <StateCell label="high" note="nearly full">
        <Context maxTokens={200_000} modelId="gpt-4o" usedTokens={188_000}>
          <ContextTrigger size="sm" />
        </Context>
      </StateCell>
      <StateCell label="empty" note="nothing used yet">
        <Context maxTokens={200_000} modelId="gpt-4o" usedTokens={0}>
          <ContextTrigger size="sm" />
        </Context>
      </StateCell>
      <StateCell label="no breakdown" note="only used and max: no rows, cost $0.00">
        <Context maxTokens={200_000} usedTokens={54_300}>
          <PopupBody />
        </Context>
      </StateCell>
      <StateCell label="with breakdown" note="rows appear when their count is above zero">
        <Context maxTokens={200_000} modelId="gpt-4o" usage={USAGE} usedTokens={54_300}>
          <PopupBody />
        </Context>
      </StateCell>
    </StateGrid>
  );
}

/** The Examples: a custom body replacing the default rows. */
export function ContextExamples() {
  return (
    <Panel label="Custom rows">
      <div className="flex justify-center">
        <Context maxTokens={200_000} modelId="gpt-4o" usage={USAGE} usedTokens={54_300}>
          <div className="w-60 divide-y overflow-hidden rounded-md border bg-popover">
            <ContextContentHeader />
            <ContextContentBody>
              <ContextInputUsage>
                <p className="type-small text-muted-foreground">Prompt tokens are billed at the input rate.</p>
              </ContextInputUsage>
            </ContextContentBody>
          </div>
        </Context>
      </div>
    </Panel>
  );
}
