"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

export function PressKeyboardDemo() {
  const [pressed, setPressed] = React.useState(false)

  const activateKeys = new Set([" ", "Spacebar", "Enter"])

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="press, keyboard-driven"
      data-pressed={pressed || undefined}
      onKeyDown={(event) => {
        if (activateKeys.has(event.key)) setPressed(true)
      }}
      onKeyUp={(event) => {
        if (activateKeys.has(event.key)) setPressed(false)
      }}
      onBlur={() => setPressed(false)}
      className="size-11"
    >
      <span className="type-badge text-muted-foreground">key</span>
    </Button>
  )
}
