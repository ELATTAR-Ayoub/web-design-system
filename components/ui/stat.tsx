import { ArrowDown, ArrowUp, Minus, TriangleAlert } from "lucide-react";

import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

export type StatDirection = "up" | "down" | "flat";

export type StatDelta = {
  value: string;
  direction: StatDirection;
};

export type StatState = "ready" | "loading" | "error" | "empty";

const DIRECTIONS = {
  up: { icon: ArrowUp, sign: "+", word: "Up" },
  down: { icon: ArrowDown, sign: "−", word: "Down" },
  flat: { icon: Minus, sign: "", word: "No change" },
} as const;

export function StatDeltaMark({
  delta,
  betterWhen,
}: {
  delta: StatDelta;
  betterWhen: "up" | "down";
}) {
  const { icon, sign, word } = DIRECTIONS[delta.direction];
  const favourable = delta.direction === betterWhen;

  return (
    <span
      data-slot="stat-delta"
      data-direction={delta.direction}
      className={cn(
        "type-number-sm inline-flex items-center gap-1",
        delta.direction === "flat"
          ? "text-muted-foreground"
          : favourable
            ? "text-success-ink"
            : "text-foreground",
      )}
    >
      <Icon icon={icon} size="xs" tone="inherit" />
      <span className="sr-only">{word},</span>
      <span>
        {sign}
        {delta.value}
      </span>
    </span>
  );
}

export function Stat({
  label,
  value,
  delta,
  betterWhen = "up",
  hint,
  state = "ready",
  message,
  disabled = false,
  className,
}: {
  label: string;
  value: React.ReactNode;
  delta?: StatDelta;
  betterWhen?: "up" | "down";
  hint?: string;
  state?: StatState;
  message?: string;
  disabled?: boolean;
  className?: string;
}) {
  const loading = state === "loading";
  const blank = state === "error" || state === "empty";

  return (
    <div
      data-slot="stat"
      data-state={state}
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      className={cn("min-w-0", disabled && "opacity-45", className)}
    >
      <p className="type-badge text-muted-foreground">{label}</p>

      <p className="type-number-lg mt-2 text-foreground">
        {loading ? (
          <Skeleton as="span" className="h-5 w-28" />
        ) : blank ? (
          <span className="text-muted-foreground" aria-hidden="true">
            &mdash;
          </span>
        ) : (
          <span key={state} className="anim-enter inline-block">
            {value}
          </span>
        )}
        {blank && <span className="sr-only">No value</span>}
      </p>

      {(delta || hint || (blank && message)) && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {delta &&
            (loading ? (
              <span className="type-number-sm inline-flex items-center">
                <Skeleton as="span" className="h-2.5 w-14" />
              </span>
            ) : blank ? null : (
              <StatDeltaMark delta={delta} betterWhen={betterWhen} />
            ))}

          {state === "error" && message ? (
            <span className="type-small inline-flex items-center gap-1.5 text-destructive-ink">
              <Icon icon={TriangleAlert} size="xs" tone="inherit" />
              {message}
            </span>
          ) : state === "empty" && message ? (
            <span className="type-small text-muted-foreground">{message}</span>
          ) : (
            hint && <span className="type-small text-muted-foreground">{hint}</span>
          )}
        </div>
      )}
    </div>
  );
}
