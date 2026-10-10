"use client";

import * as React from "react";
import { Heart, RotateCcw, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IconSwap } from "@/components/ui/icon-swap";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border bg-card">
      {children}
    </div>
  );
}

function Dialog({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute top-1/2 left-1/2 w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-popover p-3 shadow-e3",
        className,
      )}
    >
      <div className="mb-2 h-2 w-1/2 rounded-pill bg-action/25" />
      <div className="mb-3 h-2 rounded-pill bg-muted" />
      <div className="h-5 w-2/5 rounded-pill bg-primary" />
    </div>
  );
}

function Rows({ leaving, still }: { leaving?: number; still?: boolean }) {
  return (
    <div className="grid w-full gap-1.5">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "flex h-6 items-center overflow-hidden rounded-md border border-border bg-card px-2",
            leaving === i ? "anim-exit" : still ? undefined : "anim-enter",
          )}
          style={{ "--enter-stage": i } as React.CSSProperties}
        >
          <div className="h-1.5 flex-1 rounded-pill bg-muted" />
        </div>
      ))}
    </div>
  );
}

type Card = {
  name: string;
  what: string;
  stage: (run: number, on: boolean) => React.ReactNode;
  transition?: boolean;
};

const CARDS: Card[] = [
  {
    name: "anim-enter",
    what: "Anything appearing. Rows stagger with --enter-stage.",
    stage: (run) => (
      <div key={run} className="w-full">
        <Rows />
      </div>
    ),
  },
  {
    name: "anim-exit",
    what: "Anything leaving. Quicker than arriving.",
    transition: true,
    stage: (_run, on) => (
      <div className="w-full">
        <Rows leaving={on ? 1 : undefined} still />
      </div>
    ),
  },
  {
    name: "anim-open",
    what: "Dialogs, popovers, menus, tooltips opening.",
    stage: (run) => (
      <Frame key={run}>
        <div className="anim-enter absolute inset-0 bg-background/60 [--enter-y:0px] [--enter-scale:1]" />
        <Dialog className="anim-open" />
      </Frame>
    ),
  },
  {
    name: "anim-close",
    what: "The same overlay leaving.",
    transition: true,
    stage: (_run, on) => (
      <Frame>
        <div
          className={cn("absolute inset-0 bg-background/60 [--enter-y:0px] [--enter-scale:1]", on && "anim-exit")}
        />
        <Dialog className={on ? "anim-close" : undefined} />
      </Frame>
    ),
  },
  {
    name: "anim-expand",
    what: "Accordions and collapsibles. anim-collapse closes them.",
    stage: (run) => (
      <div key={run} className="w-4/5">
        <div className="rounded-md border border-border bg-card px-3 py-1.5 type-small">Section ▾</div>
        <div className="anim-expand mx-1.5 overflow-hidden rounded-b-md border border-t-0 border-border bg-card px-3 [--unfold-h:3.5rem]">
          <div className="my-2.5 h-1.5 rounded-pill bg-muted" />
          <div className="my-2.5 h-1.5 w-3/5 rounded-pill bg-muted" />
        </div>
      </div>
    ),
  },
  {
    name: "anim-change",
    what: "A value that just changed. Also the checkbox tick and radio dot.",
    stage: (run) => (
      <div
        key={run}
        className="anim-change rounded-lg border border-value/40 bg-value/12 px-6 py-3 type-number-md text-value-ink"
      >
        {run % 2 === 0 ? "$1,240" : "$2,480"}
      </div>
    ),
  },
  {
    name: "anim-spin",
    what: "The spinner.",
    stage: () => <Spinner className="size-8" />,
  },
  {
    name: "anim-shimmer",
    what: "Skeleton loading. anim-shimmer-text is the same sweep through text.",
    stage: () => (
      <div className="grid w-4/5 gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ),
  },
  {
    name: "anim-progress-indeterminate",
    what: "A progress bar that doesn't know how long.",
    stage: () => (
      <div className="w-4/5">
        <Progress />
      </div>
    ),
  },
  {
    name: "anim-pulse",
    what: "The live dot.",
    stage: () => (
      <span className="flex items-center gap-2.5 rounded-pill border border-success/30 bg-success/10 px-3 py-1.5">
        <span className="anim-pulse size-2 rounded-full bg-success" />
        <span className="type-small text-success-ink">Live</span>
      </span>
    ),
  },
  {
    name: "anim-caret",
    what: "The cursor in a one-time-code input.",
    stage: () => (
      <div className="flex gap-1.5">
        {["4", "8", "", ""].map((d, i) => (
          <span
            key={i}
            className="grid h-9 w-7 place-items-center rounded-md border border-input bg-card type-number-sm"
          >
            {i === 2 ? <span className="anim-caret h-4 w-px bg-foreground" /> : d}
          </span>
        ))}
      </div>
    ),
  },
  {
    name: "press",
    what: "Anything clickable: shrinks to 90% while held, springs back.",
    transition: true,
    stage: (_run, on) => (
      <Button data-pressed={on || undefined} className="pointer-events-none">
        Continue
      </Button>
    ),
  },
  {
    name: "toggle-slide",
    what: "The selected-item pill moving to the new item.",
    transition: true,
    stage: (_run, on) => (
      <div className="relative flex gap-1 rounded-pill border border-border bg-card p-1">
        <span
          className="toggle-slide absolute top-1 left-1 h-7 w-16 rounded-pill bg-accent"
          style={{ transform: on ? "translateX(4.25rem)" : "none" }}
        />
        <span className="relative z-10 px-4 py-1 type-small">Inbox</span>
        <span className="relative z-10 px-4 py-1 type-small">Sent</span>
      </div>
    ),
  },
  {
    name: "swap-roll",
    what: "One icon rolling into another, like a wheel.",
    transition: true,
    stage: (_run, on) => (
      <div className="grid size-10 place-items-center rounded-lg border border-border bg-card">
        <IconSwap
          active={on ? "star" : "heart"}
          icons={{
            heart: <Icon icon={Heart} tone="action" />,
            star: <Icon icon={Star} tone="value" />,
          }}
        />
      </div>
    ),
  },
];

function useBeat(): [boolean, () => void] {
  const [on, setOn] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  const beat = React.useCallback(() => {
    window.clearTimeout(timer.current);
    setOn(true);
    timer.current = window.setTimeout(() => setOn(false), 700);
  }, []);
  return [on, beat];
}

function MotionCard({ card, all, allOn }: { card: Card; all: number; allOn: boolean }) {
  const [run, setRun] = React.useState(0);
  const [on, beat] = useBeat();

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <code className="type-code text-action-ink">.{card.name}</code>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Replay ${card.name}`}
          onClick={() => (card.transition ? beat() : setRun((n) => n + 1))}
        >
          <Icon icon={RotateCcw} size="sm" tone="inherit" />
        </Button>
      </div>
      <div className="grid h-36 place-items-center bg-muted/40 p-3">
        {card.stage(run + all, on || allOn)}
      </div>
      <p className="type-small border-t border-border px-3 py-2 text-muted-foreground">{card.what}</p>
    </div>
  );
}

export function FourteenMotions() {
  const [all, setAll] = React.useState(0);
  const [allOn, beatAll] = useBeat();
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setAll((n) => n + 1);
            beatAll();
          }}
        >
          <Icon icon={RotateCcw} size="sm" tone="inherit" />
          Replay all
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <MotionCard key={card.name} card={card} all={all} allOn={allOn} />
        ))}
      </div>
    </div>
  );
}
