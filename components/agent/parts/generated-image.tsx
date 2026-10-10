"use client";

import * as React from "react";
import { AlertCircleIcon } from "lucide-react";

import { usePresence } from "@/components/agent/core/use-presence";
import type { ImageStage } from "@/components/agent/workspace/tool-output";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const LABELS: Record<ImageStage, string> = {
  queued: "Queued",
  generating: "Generating",
  refining: "Refining",
  complete: "Done",
  error: "Couldn't generate",
};

const CLARITY: Record<ImageStage, string> = {
  queued: "blur-xl saturate-50",
  generating: "blur-xl saturate-50",
  refining: "blur-sm",
  complete: "blur-none",
  error: "blur-none opacity-40",
};

export function GeneratedImage({
  stage,
  onRetry,
  children,
  className,
}: {
  stage: ImageStage;
  onRetry?: () => void;
  children?: React.ReactNode;
  className?: string;
}) {
  const label = LABELS[stage];
  const failed = stage === "error";
  const hasChild = React.Children.count(children) > 0;
  const pill = usePresence(stage !== "complete");

  return (
    <div
      role="group"
      aria-label="Generated image"
      data-slot="generated-image"
      data-stage={stage}
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-xl",
        hasChild || failed ? "bg-muted" : "anim-shimmer",
        className,
      )}
    >
      {hasChild ? (
        <div
          data-part="image"
          className={cn("size-full transition-[filter] duration-normal *:size-full *:object-cover", CLARITY[stage])}
        >
          {children}
        </div>
      ) : null}

      {pill.mounted ? (
        <span
          aria-hidden="true"
          data-part="pill"
          className={cn(
            "type-badge absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-pill bg-background/80 px-2.5 py-1",
            failed ? "text-destructive-ink" : "text-foreground",
            pill.className,
          )}
        >
          {failed ? <Icon icon={AlertCircleIcon} size="sm" tone="inherit" /> : <Spinner aria-hidden="true" className="size-3.5" />}
          {label}
        </span>
      ) : null}

      {failed && onRetry ? (
        <div className="absolute inset-0 grid place-items-center">
          <Button size="sm" variant="outline" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : null}

      <span role="status" className="sr-only">
        {label}
      </span>
    </div>
  );
}
