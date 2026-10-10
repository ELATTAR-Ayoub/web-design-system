"use client"

/**
 * Companion client file for the `content-change` Preview — plain data per
 * trap 29 (`components/docs/component-docs/<name>/page.tsx` is a
 * server-read spec module and cannot carry `"use client"` itself), so the
 * one piece of this page that needs state lives here instead.
 *
 * The brief asks for a "Next message" button, not a tab switch: this is the
 * real shape of the production case `ContentChange` exists for — one
 * persistent element whose `contentKey` changes as new messages arrive,
 * never a remount. `ContentChange` itself removes, reflows and re-adds the
 * element on every key change, replaying its entrance animation each time —
 * see `components/ui/content-change.tsx` for the mechanism.
 */

import * as React from "react"

import { Button } from "@/components/ui/button"
import { ContentChange } from "@/components/ui/content-change"
import { Panel } from "@/components/ds/kit"

const MESSAGES = [
  "A new message arrived.",
  "Another one just landed.",
  "One more just came in.",
]

export function NextMessageSpecimen() {
  const [index, setIndex] = React.useState(0)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <ContentChange contentKey={index}>
        <Panel label="Message">
          <p className="type-body text-foreground">{MESSAGES[index]}</p>
        </Panel>
      </ContentChange>
      <Button
        type="button"
        onClick={() => setIndex((current) => (current + 1) % MESSAGES.length)}
      >
        Next message
      </Button>
    </div>
  )
}
