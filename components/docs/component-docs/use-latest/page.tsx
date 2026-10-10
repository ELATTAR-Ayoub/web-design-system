/**
 * Documentation page for `use-latest`.
 *
 * Authored, not generated. A hook, not a component — no States,
 * Accessibility or Keyboard section applies, because a ref is never drawn on
 * screen.
 *
 * NOT ATTEMPTED: a live specimen contrasting a closure that goes stale
 * against one read through `useLatest`, the way the brief for this sweep
 * asks for. That contrast needs component state (two ticking intervals and
 * two logs), which needs a client component — and
 * `scripts/validate-docs.mjs` hard-fails any `component-docs/<name>/page.tsx`
 * carrying a `"use client"` directive; a spec module must stay plain data.
 * The sanctioned fix is a companion file beside this one (the pattern
 * `form/account-form-specimen.tsx` already uses), which this task is scoped
 * not to create — the brief restricts this page to editing `page.tsx` only.
 * The Usage section below is the accurate way to show the hook without a
 * working component: the exact requestAnimationFrame-loop shape its own doc
 * comment gives as the motivating case.
 */

import { Code, Meta, Note } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { StaleClosureSpecimen } from "./stale-closure-specimen";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "use-latest",
  omitted: {
    states: "useLatest returns a RefObject, not a rendered element — there is no hover, focus, loading or disabled state for a ref that is never drawn on screen.",
    accessibility: "A ref update never reaches the accessibility tree by itself; useLatest has no name, role or announcement because it renders nothing.",
    keyboard: "Nothing here is focusable or reachable by Tab — the hook produces a value read from a callback, not an interactive target.",
    responsive: "useLatest tracks a value across renders, not a viewport; it behaves identically at every width, zoom level and text-spacing setting because it reads none of them.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Two identical intervals, both started once on mount and never rebuilt. The left closes over the value directly and freezes at whatever it was; the right reads it through useLatest and follows what you type.",
      render: <StaleClosureSpecimen />,
      source: `"use client";

import { useEffect, useRef, useState } from "react";

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
    // The missing dependency IS the point: adding \`value\` restarts the
    // interval on every keystroke, which is the cost this hook avoids.
  }, []);

  return (
    <>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <p>Closed over directly: {stale || "—"}</p>
      <p>Read through useLatest: {fresh || "—"}</p>
    </>
  );
}`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "The case this exists for: a requestAnimationFrame loop started once in an effect, which must keep reading the current value of something that changes on every render without re-subscribing sixty times a second.",
      language: "tsx",
      code: `import { useLatest } from "@/hooks/use-latest";

function useAnalyserLoop(analyser: AnalyserNode | null) {
  const analyserRef = useLatest(analyser);

  useEffect(() => {
    let frame: number;
    const tick = () => {
      const current = analyserRef.current; // always the latest, never stale
      // ...read current, draw a frame...
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [analyserRef]); // the loop's own effect never needs to re-run
}`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "useLatest<T>(value: T): RefObject<T>",
          body: (
            <Meta
              items={[
                { k: "value", v: "T — the value to always be able to read the latest of, typically a prop or a callback." },
                {
                  k: "returns",
                  v: "RefObject<T>. ref.current is updated to value inside a useEffect after every render, never during render — so it is one commit behind while a render is in progress.",
                },
                {
                  k: "when to read it",
                  v: "From a frame callback, an event handler, or a timer — anything that runs after the commit that set it. Never read ref.current while rendering.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why",
      title: "Why this exists",
      blocks: [
        {
          body: (
            <Note tone="action">
              Writing <Code>ref.current = value</Code> directly in the render body is
              the older form of this idiom, and it is now a lint error: it mutates
              during render, which breaks under concurrent rendering, where a render
              can be started and thrown away. Assigning inside{" "}
              <Code>useEffect</Code> instead means a value read through the ref is one
              React has actually committed to.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        { body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> },
      ],
    },
  ],
};
