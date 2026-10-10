"use client";

/**
 * The live Preview specimen for the `switch` documentation page.
 *
 * `components/docs/component-docs/switch/page.tsx` is a plain data module
 * rendered by a SERVER component — it cannot hold the `useState` a real
 * setting needs (trap 29). This companion is that scene: flipping Beta
 * features on reveals a real chunk of UI beneath it, and flipping it off
 * hides it again — the setting takes effect the instant it is toggled, with
 * no Save button anywhere in sight, which is the whole reason Switch (and
 * not Checkbox) is the right control here.
 */

import { useState } from "react";
import { FlaskConical } from "lucide-react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";

export function BetaFeaturesSpecimen() {
  const [beta, setBeta] = useState(false);

  return (
    <div className="w-full max-w-sm space-y-4">
      <Field orientation="horizontal" className="rounded-lg border border-border bg-card p-4">
        <span className="min-w-0 flex-1">
          <FieldLabel htmlFor="beta-live">Beta features</FieldLabel>
          <FieldDescription>Turn on work in progress. Some of it will break.</FieldDescription>
        </span>
        <Switch id="beta-live" checked={beta} onCheckedChange={setBeta} />
      </Field>

      {beta && (
        <div className="flex items-center gap-3 rounded-lg border border-action/30 bg-action/[0.08] p-4">
          <Icon icon={FlaskConical} size="sm" tone="action" />
          <p className="type-small text-action-ink">
            Live pull odds preview is now visible on every pack page.
          </p>
        </div>
      )}
    </div>
  );
}
