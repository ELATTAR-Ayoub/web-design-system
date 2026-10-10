"use client";

import { useId, useState } from "react";

import { CodeBlock } from "@/components/ds/code-block";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type View = "preview" | "code";

export function PreviewCode({
  label,
  note,
  children,
  source,
  language = "tsx",
  flush = false,
  className,
  stageClassName,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
  source?: string;
  language?: string;
  flush?: boolean;
  className?: string;
  stageClassName?: string;
}) {
  const [view, setView] = useState<View>("preview");
  const headingId = useId();

  const hasCode = Boolean(source);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted px-5 py-3">
        <span id={headingId} className="type-badge text-muted-foreground">
          {label}
        </span>

        <div className="flex items-center gap-4">
          {note && <span className="type-number-sm text-muted-foreground">{note}</span>}
          {hasCode && (
            <ToggleGroup
              data-slot="preview-code-toggle"
              type="single"
              size="sm"
              value={view}
              // An empty `next` is the deselect gesture; ignoring it keeps one option selected.
              onValueChange={(next) => {
                if (next === "preview" || next === "code") setView(next);
              }}
              aria-label={`${label} — preview or code`}
            >
              <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
              <ToggleGroupItem value="code">Code</ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>
      </div>

      {/* One stage. `hidden` rather than a conditional render, so a specimen
          that holds state — an open disclosure, a typed value, a running
          animation — is not torn down and rebuilt every time the reader looks
          at the source and comes back. `[hidden]` is display:none, so nothing
          inside is focusable while it is the unselected view. */}
      <div
        data-slot="preview-stage"
        hidden={view !== "preview"}
        className={cn("bg-background", flush ? "" : "p-6", stageClassName)}
      >
        {children}
      </div>

      {hasCode && (
        <div hidden={view !== "code"} className="bg-background">
          <CodeBlock
            code={source!}
            language={language}
            className="max-h-(--height-doc-code) overflow-auto rounded-none border-0 scrollbar-thin"
          />
        </div>
      )}
    </div>
  );
}
