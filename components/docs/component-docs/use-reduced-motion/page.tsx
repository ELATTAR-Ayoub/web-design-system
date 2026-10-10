import { Code, Meta, Note } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { ReducedMotionSpecimen } from "./motion-specimen";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "use-reduced-motion",
  omitted: {
    states: "usePrefersReducedMotion returns a boolean, not a rendered element — there is no hover, focus, loading or disabled state for a value with no markup of its own.",
    accessibility: "The hook renders nothing itself, so it has no name, role or announcement; the motion it gates belongs to whatever component reads its return value.",
    keyboard: "Nothing here is focusable — the hook is a subscription to a media query, not an interactive target reachable by Tab.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A real requestAnimationFrame loop, which is the case CSS cannot reach. The loop runs either way; the preference decides whether the frame moves a marker or prints its value beside a still one.",
      render: <ReducedMotionSpecimen />,
      source: `"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

export function ReducedMotionSpecimen() {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    const started = performance.now();
    const tick = (now: number) => {
      setProgress(((now - started) / 4000) % 1);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, []);

  const percent = Math.round(progress * 100);

  return reduced ? (
    <p>Reduced motion: {percent}%</p>
  ) : (
    <span style={{ left: \`\${percent}%\` }} />
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
        "The one case CSS cannot reach: motion driven directly from JavaScript — a value written to style on every pointer move, a canvas, a physics loop.",
      language: "tsx",
      code: `import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

function TextPressure() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return; // decline to start the rAF loop at all
    let frame: number;
    const tick = () => {
      element.style.fontWeight = String(computeWeight());
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);
}`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "usePrefersReducedMotion(): boolean",
          body: (
            <Meta
              items={[
                { k: "returns", v: <><Code>true</Code> when the reader has set{" "}<Code>prefers-reduced-motion: reduce</Code> at the OS level.</> },
                { k: "server snapshot", v: "false, matching the CSS default, so nothing can hydrate differently between server and client." },
                { k: "reactivity", v: "Subscribes to the media query's change event via useSyncExternalStore, updating live if the setting changes while the page is open." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "when-not-to-use-it",
      title: "When not to use it",
      blocks: [
        {
          body: (
            <Note tone="action">
              Anything whose movement is a keyframe or a CSS transition is already
              handled by the blanket rule in <Code>styles/motion.css</Code> and should
              not ask this hook at all — reaching for it there is how a second,
              divergent motion policy starts. It exists only for motion a{" "}
              <Code>requestAnimationFrame</Code> loop or similar drives directly, which
              CSS has no opinion about.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "This hook's \"responsive\" axis is not viewport width — it's an environmental preference, read the same way at every size.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "375 / 768 / 1440 / 1920px",
                  v: (
                    <>
                      <Code>usePrefersReducedMotion()</Code> reads{" "}
                      <Code>prefers-reduced-motion</Code>, an OS-level setting with no
                      relationship to viewport width — the value it returns does not
                      change as the window resizes. Measured on this page itself: no
                      overflow at 375, 768, 1440 or 1920px.
                    </>
                  ),
                },
                {
                  k: "200% text zoom",
                  v: "No overflow measured under 200% text-only zoom. The preference the hook reports is unaffected by zoom level, which is a separate OS/browser setting.",
                },
                {
                  k: "RTL",
                  v: "No RTL overflow measured. The hook has no directional behaviour — a reduced-motion preference reads identically in either writing direction.",
                },
                {
                  k: "live, not one-shot",
                  v: "The subscription is the media query's change event via useSyncExternalStore, so a reader who toggles the OS setting while the page is open sees the value flip immediately — a component driving a requestAnimationFrame loop from it can stop mid-animation rather than only respecting the setting at mount.",
                },
              ]}
            />
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
