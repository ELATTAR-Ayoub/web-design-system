"use client";

import * as React from "react";

import {
  JSXPreview,
  JSXPreviewContent,
  JSXPreviewError,
} from "@/components/ai-elements/jsx-preview";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";
import { Button } from "@/components/ui/button";

const FULL =
  '<div className="flex flex-col gap-2 rounded-lg border bg-card p-4"><p className="type-nav text-foreground">Order shipped</p><p className="type-small text-muted-foreground">Arrives Thursday</p></div>';

export function JsxPreviewPlayground() {
  const [length, setLength] = React.useState(FULL.length);
  const done = length >= FULL.length;

  return (
    <Panel label="JSXPreview" note={done ? "complete" : `streaming, ${length} of ${FULL.length} characters`}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button
            onClick={() => setLength((n) => (n >= FULL.length ? 40 : Math.min(n + 40, FULL.length)))}
            size="sm"
            variant="outline"
          >
            {done ? "Restart stream" : "Reveal more"}
          </Button>
        </div>
        <JSXPreview isStreaming={!done} jsx={FULL.slice(0, length)}>
          <JSXPreviewContent />
          <JSXPreviewError className="mt-2" />
        </JSXPreview>
      </div>
    </Panel>
  );
}

export function JsxPreviewStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="rest" note="complete JSX">
        <JSXPreview jsx={FULL}>
          <JSXPreviewContent />
          <JSXPreviewError />
        </JSXPreview>
      </StateCell>
      <StateCell label="loading" note="isStreaming: open tags are closed for you">
        <JSXPreview
          isStreaming
          jsx='<div className="rounded-lg border bg-card p-4"><p className="type-nav text-foreground">Order shipp'
        >
          <JSXPreviewContent />
          <JSXPreviewError />
        </JSXPreview>
      </StateCell>
      <StateCell label="error" note="malformed JSX, not streaming">
        <JSXPreview jsx="<div>{</div>">
          <JSXPreviewContent />
          <JSXPreviewError />
        </JSXPreview>
      </StateCell>
      <StateCell label="empty" note="jsx is an empty string">
        <JSXPreview jsx="">
          <JSXPreviewContent />
          <JSXPreviewError />
        </JSXPreview>
        <span className="type-small text-muted-foreground">(nothing rendered)</span>
      </StateCell>
    </StateGrid>
  );
}
