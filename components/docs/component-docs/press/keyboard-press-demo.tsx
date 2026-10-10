"use client"

/**
 * Companion client file for the `press` specimen — plain data per trap 29
 * (`components/docs/component-docs/<name>/page.tsx` is a server-read spec
 * module and cannot carry `"use client"` itself), so the one piece of this
 * page that needs state lives here instead.
 *
 * Measured twice on a focused `<button class="press">` with Space held: a
 * trusted key event (Playwright over CDP) read `scale(0.9)` — Chromium does
 * apply `:active` for a real keyboard press on a real button — while a
 * synthetic key event from an automation pane read `none`. A host that is
 * not a `<button>` gets no keyboard `:active` from any browser. So the feel
 * cannot depend on `:active` alone.
 *
 * `press` now answers `[data-pressed]` beside `:active` (styles/motion.css),
 * so the class supplies the keyboard press feel too — the same 0.9 over the
 * same tokens. What CSS cannot do is know when a key is down: this demo
 * supplies that one thing, setting `data-pressed` on keydown of Space or
 * Enter and clearing it on keyup and blur. A consumer wanting keyboard parity
 * adds those three handlers and nothing else.
 */

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
      /* `press` itself answers `[data-pressed]` now — the class, not an
         inline style, supplies the transform. This demo's only job is the
         script: setting the attribute on keydown and clearing it on keyup,
         which is the part CSS cannot do for a keyboard press. */
      className="press flex size-11 items-center justify-center rounded-full border border-border bg-card outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="type-badge text-muted-foreground">key</span>
    </button>
  )
}
