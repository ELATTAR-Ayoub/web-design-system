"use client";

import * as React from "react";

import { GeneratedImage } from "@/components/agent/parts/generated-image";
import type { ImageStage } from "@/components/agent/workspace/tool-output";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { heroImageUrl } from "@/lib/agent/mock-transport";

export const GENERATED_IMAGE_STAGES: ImageStage[] = ["queued", "generating", "refining", "complete", "error"];
const STAGE_NAMES: Record<ImageStage, string> = {
  queued: "Queued",
  generating: "Generating",
  refining: "Refining",
  complete: "Done",
  error: "Error",
};

function Picture() {
  const src = React.useMemo(() => heroImageUrl(), []);
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="A dusk landscape with three ranges of hills" />;
}

export function GeneratedImageStill({ stage, withImage = true }: { stage: ImageStage; withImage?: boolean }) {
  return (
    <div className="mx-auto w-full max-w-64">
      <GeneratedImage stage={stage} onRetry={stage === "error" ? () => {} : undefined}>
        {withImage ? <Picture /> : null}
      </GeneratedImage>
    </div>
  );
}

export function GeneratedImageSpecimen({ initialStage = "generating" }: { initialStage?: ImageStage }) {
  const [stage, setStage] = React.useState<ImageStage>(initialStage);
  const [retries, setRetries] = React.useState(0);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="w-full max-w-72">
        <GeneratedImage
          stage={stage}
          onRetry={() => {
            setRetries((n) => n + 1);
            setStage("generating");
          }}
        >
          <Picture />
        </GeneratedImage>
      </div>
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={stage}
        onValueChange={(v) => {
          if (v) setStage(v as ImageStage);
        }}
        aria-label="Image stage"
        className="flex-wrap"
      >
        {GENERATED_IMAGE_STAGES.map((s) => (
          <ToggleGroupItem key={s} value={s}>
            {STAGE_NAMES[s]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <p className="type-small text-muted-foreground" aria-live="polite">
        {retries === 0 ? "Retry restarts the stage at Generating." : `Retried ${retries} ${retries === 1 ? "time" : "times"}.`}
      </p>
    </div>
  );
}
