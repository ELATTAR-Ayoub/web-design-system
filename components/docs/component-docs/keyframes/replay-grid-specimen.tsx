"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

const KEYFRAME_TIMELINES = [
  { className: "anim-enter", label: "enter", replaces: 10 },
  { className: "anim-exit", label: "exit", replaces: 3 },
  { className: "anim-open", label: "open", replaces: 0 },
  { className: "anim-close", label: "close", replaces: 0 },
  { className: "anim-expand", label: "expand", replaces: 0 },
  { className: "anim-change", label: "change", replaces: 4 },
  { className: "anim-spin", label: "spin", replaces: 0 },
  { className: "anim-shimmer", label: "shimmer", replaces: 1 },
  { className: "anim-progress-indeterminate", label: "progress", replaces: 0 },
  { className: "anim-pulse", label: "pulse", replaces: 1 },
  { className: "anim-caret", label: "caret", replaces: 0 },
] as const

function ReplaceNote({ replaces }: { replaces: number }) {
  return (
    <p className="type-small text-center text-muted-foreground">
      {replaces > 0 ? `Replaces ${replaces} earlier ${replaces === 1 ? "keyframe" : "keyframes"}` : "Unchanged"}
    </p>
  )
}

function KeyframeTile({
  className,
  label,
  replaces,
}: {
  className: string
  label: string
  replaces: number
}) {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        key={run}
        className={`${className} flex h-16 w-full items-center justify-center rounded-lg border border-border bg-card`}
      >
        <span className="type-badge text-muted-foreground">{label}</span>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setRun((current) => current + 1)}
        aria-label={`Replay ${label}`}
      >
        Replay
      </Button>
      <ReplaceNote replaces={replaces} />
    </div>
  )
}

const TRANSITION_TIMELINES = [
  { className: "press", label: "press", replaces: 5 },
  { className: "toggle-slide", label: "toggle-slide", replaces: 1 },
  { className: "swap-roll", label: "swap-roll", replaces: 0 },
] as const

function TransitionTile({
  className,
  label,
  replaces,
}: {
  className: string
  label: string
  replaces: number
}) {
  const [active, setActive] = React.useState(false)

  const replay = () => {
    setActive(true)
    window.setTimeout(() => setActive(false), 500)
  }

  const style: React.CSSProperties | undefined =
    className === "toggle-slide"
      ? { transform: active ? "translateX(1.5rem)" : undefined }
      : className === "swap-roll"
        ? ({ "--swap-offset": active ? 1 : 0 } as React.CSSProperties)
        : undefined

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        data-pressed={className === "press" && active ? true : undefined}
        style={style}
        className={`${className} flex h-16 w-full items-center justify-center rounded-lg border border-border bg-card`}
      >
        <span className="type-badge text-muted-foreground">{label}</span>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={replay}
        aria-label={`Replay ${label}`}
      >
        Replay
      </Button>
      <ReplaceNote replaces={replaces} />
    </div>
  )
}

export function ReplayGridSpecimen() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {KEYFRAME_TIMELINES.map((timeline) => (
        <KeyframeTile key={timeline.className} {...timeline} />
      ))}
      {TRANSITION_TIMELINES.map((timeline) => (
        <TransitionTile key={timeline.className} {...timeline} />
      ))}
    </div>
  )
}
