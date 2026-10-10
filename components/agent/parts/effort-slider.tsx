"use client";

/**
 * EffortSlider — the reasoning-effort control: "Effort · level", a Faster to
 * Smarter caption, and a notched track whose thumb snaps from level to level.
 * Written for this system, on its tokens; its behaviour deliberately matches the
 * effort control it replaced. The AgentWorkspace composer uses it inside its
 * Effort popover.
 *
 * The track is a `role="slider"` over the level INDEX, with the level name as
 * `aria-valuetext`. Arrows step, Home / End jump to the ends, and a press or a
 * drag (pointer captured) snaps to the nearest notch. At the last level the
 * fill and thumb take the agent colour — the same moment the host arms its
 * sparks, which it learns from `isMaxEffort`.
 */

import * as React from "react";
import { CircleHelpIcon } from "lucide-react";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/** Half the thumb's width: the first and last notches sit this far inside the track ends. */
export const THUMB_HALF_PX = 11;
/** How far the fill runs past the current notch, so the thumb stands on filled track. */
const FILL_OVERSHOOT_PX = THUMB_HALF_PX / 1.5;

const HELP_TEXT = "Higher effort thinks longer before answering";

export type EffortSliderProps = {
  /** Levels, low to high. The last one is "max". */
  efforts: string[];
  value: string;
  onValueChange: (level: string) => void;
  /** Escape on the track: the host closes its panel and returns focus. */
  onEscape?: () => void;
  className?: string;
};

/** Whether `value` is the last of more than one level: the armed state. */
export const isMaxEffort = (efforts: string[], value: string | undefined) =>
  efforts.length > 1 && value === efforts[efforts.length - 1];

/** Nearest level index for a pointer at `x` over a track `width` wide. */
export function indexFromOffset(x: number, width: number, count: number) {
  const usable = Math.max(1, width - 2 * THUMB_HALF_PX);
  return Math.round(((x - THUMB_HALF_PX) / usable) * (count - 1));
}

/** CSS `left` of the notch at `i`, measured along the inset track. */
const notchLeft = (i: number, count: number) =>
  `calc(${THUMB_HALF_PX}px + (100% - ${THUMB_HALF_PX * 2}px) * ${i / Math.max(1, count - 1)})`;

/** CSS width of the fill for level `i`: whole track at the last level. */
const fillWidth = (i: number, count: number) =>
  i === count - 1 ? "100%" : `calc(${notchLeft(i, count)} + ${FILL_OVERSHOOT_PX}px)`;

const STEP_BY_KEY: Record<string, number> = {
  ArrowRight: 1,
  ArrowUp: 1,
  ArrowLeft: -1,
  ArrowDown: -1,
};

export function EffortSlider({ efforts, value, onValueChange, onEscape, className }: EffortSliderProps) {
  const last = efforts.length - 1;
  const index = Math.max(0, efforts.indexOf(value));
  const maxed = isMaxEffort(efforts, value);

  const select = (target: number) => {
    const next = Math.max(0, Math.min(last, target));
    if (next !== index) onValueChange(efforts[next]);
  };

  const followPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    select(indexFromOffset(event.clientX - rect.left, rect.width, efforts.length));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = STEP_BY_KEY[event.key];
    if (step) {
      event.preventDefault();
      select(index + step);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0);
    } else if (event.key === "End") {
      event.preventDefault();
      select(last);
    } else if (event.key === "Escape") {
      onEscape?.();
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // A synthetic pointer has nothing to capture.
    }
    event.currentTarget.focus({ preventScroll: true });
    followPointer(event);
  };

  return (
    <div data-slot="effort-slider" data-max={maxed ? "" : undefined} className={className}>
      <div className="type-small flex items-center gap-2">
        <span className="text-muted-foreground">Effort</span>
        <span className="text-foreground">{value}</span>
        <span className="text-muted-foreground ml-auto inline-flex" title={HELP_TEXT}>
          <Icon icon={CircleHelpIcon} size="sm" tone="inherit" label={HELP_TEXT} />
        </span>
      </div>
      <div className="type-small text-muted-foreground mt-4 flex justify-between">
        <span>Faster</span>
        <span>Smarter</span>
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Effort"
        aria-valuemin={0}
        aria-valuemax={last}
        aria-valuenow={index}
        aria-valuetext={value}
        className="bg-foreground/8 relative mt-2.5 h-5.5 cursor-pointer touch-none rounded-full outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50"
        onPointerDown={handlePointerDown}
        onPointerMove={(event) => {
          if (event.buttons & 1) followPointer(event);
        }}
        onKeyDown={handleKeyDown}
      >
        <span
          data-slot="effort-fill"
          className={cn(
            "effort-glide absolute inset-y-0 left-0 rounded-full",
            maxed ? "bg-agent/35" : "bg-foreground/18",
          )}
          style={{ width: fillWidth(index, efforts.length) }}
        />
        {efforts.map((label, i) => (
          <i
            key={label}
            data-slot="effort-notch"
            className="bg-foreground/30 absolute top-1/2 -mt-0.5 -ml-0.5 size-1 rounded-full"
            style={{ left: notchLeft(i, efforts.length) }}
          />
        ))}
        <span
          data-slot="effort-thumb"
          className={cn(
            "effort-glide shadow-btn absolute -top-0.75 -ml-1.75 h-7 w-3.5 rounded-full",
            maxed ? "bg-agent" : "bg-foreground",
          )}
          style={{ left: notchLeft(index, efforts.length) }}
        />
      </div>
    </div>
  );
}
