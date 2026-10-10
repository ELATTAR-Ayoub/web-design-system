import { CheckIcon, CircleIcon, MinusIcon, XIcon } from "lucide-react";

import type { StepStatus } from "@/components/agent/core/run";
import { Icon } from "@/components/ui/icon";

export const STEP_STATUS_LABEL: Record<StepStatus, string> = {
  pending: "Waiting",
  running: "Running",
  done: "Done",
  failed: "Failed",
  skipped: "Skipped",
};

export function formatDuration(ms: number): string {
  return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`;
}

export function StepStatusMark({ status, decorative = false }: { status: StepStatus; decorative?: boolean }) {
  const label = decorative ? undefined : STEP_STATUS_LABEL[status];
  switch (status) {
    case "done":
      return <Icon icon={CheckIcon} label={label} size="sm" tone="success" />;
    case "failed":
      return <Icon icon={XIcon} label={label} size="sm" tone="error" />;
    case "skipped":
      return <Icon icon={MinusIcon} label={label} size="sm" tone="muted" />;
    case "running":
      return decorative ? (
        <span aria-hidden className="size-2 rounded-pill bg-action-ink anim-pulse" />
      ) : (
        <span aria-label={label} className="size-2 rounded-pill bg-action-ink anim-pulse" role="img" />
      );
    default:
      return <Icon icon={CircleIcon} label={label} size="xs" tone="muted" />;
  }
}

export const RECORD_CONFIRMATION = "before:hidden after:hidden [&>[data-slot=alert-stars]]:hidden";
