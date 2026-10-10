/**
 * A live specimen for `useLatest`: the stale closure, beside the fresh read.
 *
 * Two identical `setInterval` loops start on mount and never restart. One
 * closes over `count` directly; the other reads it through a `useLatest` ref.
 * Type in the field and the left column keeps reporting whatever the value was
 * when the interval was created — usually the empty string — while the right
 * column follows what you typed.
 *
 * **That is the whole argument for the hook, and it cannot be made in prose.**
 * A reader who has not hit this bug reads "the closure goes stale" as a
 * theoretical caution; watching one column freeze while the other moves is the
 * same sentence with evidence attached.
 *
 * The interval is deliberately NOT in the dependency array. Adding `value`
 * there would fix the staleness by tearing the loop down and rebuilding it on
 * every keystroke, which is the cost `useLatest` exists to avoid — and it would
 * also delete the specimen.
 *
 * It lives beside `page.tsx` rather than inside it because a spec module must
 * stay plain data: `scripts/validate-docs.mjs` fails any
 * `component-docs/<name>/page.tsx` carrying a `"use client"` directive, since the
 * route imports the spec on the server.
 *
 * State model:
 * rest — both readouts ticking. hover · focus-visible — the input's own.
 * pressed — N/A. loading · success · error — N/A, nothing asynchronous.
 * disabled — N/A. empty — the initial state, and the one that makes the point:
 * the stale column stays empty forever.
 */

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
    // Mounted once, with an empty dependency array, exactly as a long-lived
    // loop is written. `value` here is the one captured on mount; `latest` is
    // a ref, so reading `.current` inside the tick sees the committed value.
    const id = window.setInterval(() => {
      setStale(value);
      setFresh(latest.current);
    }, 250);
    return () => window.clearInterval(id);
    // The missing dependency IS the specimen: adding `value` restarts the
    // interval on every keystroke, which is the cost this hook exists to
    // avoid — and it would also delete the thing being demonstrated.
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
