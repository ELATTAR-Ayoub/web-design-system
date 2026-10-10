"use client";

/**
 * GeneratedImage — the frame a tool-generated image appears in.
 *
 * It holds the image's place in the reply at a square, then shows progress as
 * clarity: the child (the `<img>`, once there is one) is heavily blurred and a
 * little desaturated while the tool is `queued` or `generating`, lightly
 * blurred while `refining`, and sharp at `complete`. The change between levels
 * is a `filter` transition on the system's normal duration and easing, so
 * reduced motion is handled by the global rule and no keyframe is added.
 * Until a child exists the surface is `anim-shimmer`, so it reads as loading.
 *
 * A small pill in the bottom-left names the stage. It is hidden from assistive
 * tech; a visually hidden `role="status"` carries the same label so a change
 * is announced once. At `complete` the pill leaves through `usePresence`
 * (`anim-exit`). At `error` the child dims, the pill turns to the alert icon
 * and `text-destructive-ink`, and `onRetry` adds a Retry button.
 */

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

/** How clear the child is at each stage. The blur is the progress. */
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
