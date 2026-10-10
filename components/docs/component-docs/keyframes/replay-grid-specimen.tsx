"use client"

/**
 * Companion client file for the `keyframes` Preview — plain data per trap 29
 * (`components/docs/component-docs/<name>/page.tsx` is a server-read spec
 * module and cannot carry `"use client"` itself), so the one piece of this
 * page that needs state lives here instead.
 *
 * Fourteen tiles, one per name in the vocabulary — the eleven system
 * keyframes `styles/motion.css` declares (each shown through its `anim-*`
 * utility) plus the three transitions (`press`, `toggle-slide`, `swap-roll`).
 * Every tile carries its own "what it replaces" count.
 *
 * A keyframe timeline plays once on mount, so its tile's own counter — bumped
 * by its own Replay button — is used as the tile's `key`: changing `key`
 * unmounts and remounts the element, which is what makes a `@keyframes`
 * animation that only plays on mount run again. A transition has no mount
 * behaviour to replay — it answers a state change — so its tile instead
 * toggles the same attribute or custom property the real component would
 * (`[data-pressed]`, a translate, `--swap-offset`) for a moment and back.
 */

import * as React from "react"

import { Button } from "@/components/ui/button"

/**
 * `replaces` is a count, not a spelled-out list — the retired names it would
 * otherwise name live only in `lib/motion-names.ts`; repeating them here would
 * be a second place for that ledger to drift out of.
 */
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
