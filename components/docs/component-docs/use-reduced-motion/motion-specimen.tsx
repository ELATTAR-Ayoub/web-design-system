/**
 * A live specimen for `usePrefersReducedMotion`.
 *
 * **The case CSS cannot reach.** A `@media (prefers-reduced-motion)` block
 * handles anything declared as a CSS animation, and `styles/motion.css` already
 * does that for every `anim-*` utility. This hook exists for the motion CSS
 * never sees: a `requestAnimationFrame` loop, a canvas, a physics tween — motion
 * a JavaScript library owns. So the specimen has to be a real rAF loop, or it
 * is demonstrating the thing that did not need a hook.
 *
 * The loop runs either way. What the preference changes is what it does with
 * each frame: a moving marker when motion is welcome, a still one with the same
 * value printed beside it when it is not. **The reduced path loses no
 * information** — that is RULES §4's requirement, and it is the part a specimen
 * that simply stops animating would get wrong.
 *
 * To see the other branch, change the system setting (macOS: Accessibility →
 * Display → Reduce motion; Windows: Settings → Accessibility → Visual effects →
 * Animation effects) — the readout flips without a reload, because the hook
 * subscribes to `matchMedia` rather than reading it once.
 *
 * It lives beside `page.tsx` rather than inside it because a spec module must
 * stay plain data: `scripts/validate-docs.mjs` fails any
 * `component-docs/<name>/page.tsx` carrying a `"use client"` directive.
 *
 * State model:
 * rest — the loop running, in one of its two branches. hover · focus-visible ·
 * pressed — N/A, nothing here is interactive. loading · success · error — N/A.
 * disabled — N/A. empty — N/A; before hydration the hook returns its server
 * snapshot (`false`, matching the CSS default) and the readout says so.
 */

"use client";

import { useEffect, useRef, useState } from "react";

import { Panel } from "@/components/ds/kit";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

export function ReducedMotionSpecimen() {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    const started = performance.now();
    const tick = (now: number) => {
      // A four-second cycle, expressed as a fraction so the reduced branch can
      // print the same number the moving branch draws.
      setProgress(((now - started) / 4000) % 1);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, []);

  const percent = Math.round(progress * 100);

  return (
    <Panel
      label="usePrefersReducedMotion()"
      note={String(reduced)}
    >
      <div className="flex flex-col gap-4">
        <div className="relative h-2 w-full rounded-pill bg-muted">
          <span
            className="absolute top-0 h-2 rounded-pill bg-action"
            // The one inline style on this page, and it has to be: the value
            // changes sixty times a second, so it cannot be a class. It is a
            // percentage of the track rather than a length, so no token is
            // being bypassed — there is no spacing step that means "wherever
            // this frame's progress is".
            style={reduced ? { left: 0, width: "100%" } : { left: `${percent}%`, width: "8%" }}
          />
        </div>

        <p className="type-body text-foreground">
          {reduced
            ? `Reduced motion: the marker holds still and the frame value is printed instead — ${percent}%.`
            : `Motion welcome: the marker travels. Frame value ${percent}%.`}
        </p>
        <p className="type-small text-muted-foreground">
          The <code className="type-code">requestAnimationFrame</code> loop runs
          in both branches. What the preference changes is what the frame is used
          for — never whether the information arrives.
        </p>
      </div>
    </Panel>
  );
}
