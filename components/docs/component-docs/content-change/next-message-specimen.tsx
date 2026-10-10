"use client"

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
