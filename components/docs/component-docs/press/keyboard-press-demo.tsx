"use client"

import * as React from "react"

export function PressKeyboardDemo() {
  const [pressed, setPressed] = React.useState(false)

  const activateKeys = new Set([" ", "Spacebar", "Enter"])

  return (
    <button
      type="button"
      aria-label="press, keyboard-driven"
      data-pressed={pressed || undefined}
      onKeyDown={(event) => {
        if (activateKeys.has(event.key)) setPressed(true)
      }}
      onKeyUp={(event) => {
        if (activateKeys.has(event.key)) setPressed(false)
      }}
      onBlur={() => setPressed(false)}
      className="press flex size-11 items-center justify-center rounded-full border border-border bg-card outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="type-badge text-muted-foreground">key</span>
    </button>
  )
}
