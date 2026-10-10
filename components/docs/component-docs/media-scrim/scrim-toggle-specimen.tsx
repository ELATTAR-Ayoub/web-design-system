"use client"

/**
 * Companion client file for the `media-scrim` Preview — plain data per trap 29
 * (`components/docs/component-docs/<name>/page.tsx` is a server-read spec
 * module and cannot carry `"use client"` itself), so the one piece of this
 * page that needs state — the reader toggling the scrim off and on over the
 * same photograph — lives here instead.
 *
 * Same figure, same image, same title: only the `media-scrim` class and the
 * caption's own colour (it carries no colour without the class) are added or
 * removed on toggle, which is the whole point — the scrim is the only thing
 * making the white title readable against a bright upper-left photograph.
 */

import * as React from "react"

import { Switch } from "@/components/ui/switch"

export function ScrimToggleSpecimen() {
  const [scrim, setScrim] = React.useState(true)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <figure className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element -- a documentation
            specimen of a CSS utility; next/image would add a wrapper that
            changes the thing being demonstrated. */}
        <img
          src="/imgs/sample-photo.jpg"
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <figcaption
          className={
            scrim
              ? "media-scrim absolute inset-0 flex flex-col justify-end p-6"
              : "absolute inset-0 flex flex-col justify-end p-6 text-(--media-foreground)"
          }
        >
          <p className="type-h3">Eclipse Vault</p>
          <p className="type-small opacity-90">12 cards · opens in 2 days</p>
        </figcaption>
      </figure>
      <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <span className="type-small text-foreground">Scrim</span>
        <Switch
          checked={scrim}
          onCheckedChange={setScrim}
          aria-label="Toggle the media scrim over the photo"
        />
      </label>
    </div>
  )
}
