"use client";

import { useEffect, useState } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ds/kit";
import { useLatest } from "@/hooks/use-latest";

export function StaleClosureSpecimen() {
  const [value, setValue] = useState("");
  const [stale, setStale] = useState("");
  const [fresh, setFresh] = useState("");
  const latest = useLatest(value);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStale(value);
      setFresh(latest.current);
    }, 250);
    return () => window.clearInterval(id);
    // Omits `value` on purpose: restarting the interval would hide the stale capture.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="use-latest-input">Type something</FieldLabel>
        <Input
          id="use-latest-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Both loops read this"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel label="Closed over directly" note="stale">
          <p className="type-identifier min-h-6 text-muted-foreground">
            {stale || "—"}
          </p>
          <p className="type-small mt-2 text-muted-foreground">
            Frozen at whatever the value was when the interval was created.
          </p>
        </Panel>
        <Panel label="Read through useLatest" note="current">
          <p className="type-identifier min-h-6 text-value-ink">{fresh || "—"}</p>
          <p className="type-small mt-2 text-muted-foreground">
            The same loop, never rebuilt, seeing the committed value.
          </p>
        </Panel>
      </div>
    </div>
  );
}
