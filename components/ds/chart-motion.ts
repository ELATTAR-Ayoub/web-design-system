"use client";

import { useSyncExternalStore } from "react";

/**
 * Recharts' animation props, read out of the live stylesheet.
 *
 * Recharts takes `animationDuration` as a raw number of milliseconds and
 * `animationEasing` as a string. Neither can be a class, so neither is visible
 * to `check:tokens` — which makes this the one place in the system where §0 is
 * upheld by reading rather than by writing. Hardcoding `800` here would pass
 * every guard in this repository and still be wrong.
 *
 * `--duration-slow` is the choice for chart entrance: `normal` is a control
 * duration and reads as a flicker across a 400px plot, `open` and `reward`
 * belong to celebration rather than to data, and `bloom` belongs to light.
 * Easing is `--ease-out`, not `--ease-emphasized`: a bar that overshoots its
 * own value is a chart that lies for 90ms.
 *
 * `prefers-reduced-motion` is resolved here rather than left to the library,
 * and the reason is narrower than it first looks. CHECKED, because the plan
 * this file was written from claimed otherwise: recharts 3.8 defaults every
 * series to `isAnimationActive: 'auto'`, and `animation/JavascriptAnimate.js`
 * resolves `'auto'` through its own `util/usePrefersReducedMotion.js`. So left
 * completely alone, recharts 3.8 does honour the preference.
 *
 * It stops the moment you pass a boolean — which every shadcn chart example
 * does — and `'auto'` is a 3.x default that did not exist before it. The hook
 * has to know the preference anyway, because it is also the thing that decides
 * whether a duration is worth reading. Deciding it once, here, in code this
 * repo can test, beats depending on a vendored default that has already moved
 * once.
 *
 * What is NOT negotiable is the reason it matters. Recharts animates by
 * interpolating the geometry it draws, so under §4.3 — no information may exist
 * only inside an animation — a bar that only reaches its value by animating
 * fails outright. Measured on the charts page in a tab where
 * `requestAnimationFrame` never fires: with animation on, 0 of 84 bar
 * rectangles had a path and every pie was empty; with `isAnimationActive:
 * false`, all 84 were present at their full data ratios on the first frame.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`: this repo lints
 * under the React Compiler rules and `react-hooks/set-state-in-effect` rejects
 * the mount-flag pattern. `hooks/use-mobile.ts` and
 * `components/ds/token-swatch.tsx` are the models — the second one is where the
 * live-token read and the theme-change observer come from.
 */

/**
 * THE EASING CURVE CANNOT BE THREADED THROUGH. THIS IS THE ONE HALF THAT FAILED.
 *
 * `--ease-out`'s value is a `cubic-bezier()`, and recharts' types will not take
 * it:
 *
 *   node_modules/recharts/types/util/types.d.ts
 *     export type AnimationTiming =
 *       'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
 *
 * `Area`, `Line`, `Pie`, `Radar`, `RadialBar`, `Scatter`, `Funnel`, `Treemap`
 * and `Tooltip` all type `animationEasing?: AnimationTiming` — keywords only.
 * `Bar` alone is wider (`EasingInput`, in `types/animation/easing.d.ts`), and
 * even there the only string form is the template literal
 * `` `cubic-bezier(${number},${number},${number},${number})` `` — no spaces,
 * and a `string` read back from `getComputedStyle` is not assignable to a
 * template literal type anyway.
 *
 * So the DURATION is read from the system and the CURVE is not. What is passed
 * is the keyword `ease-out`, which names the token rather than copying its
 * value — the closest honest thing to `--ease-out` that the types accept. The
 * two are not the same curve: the token is a deep late-decelerating ease and
 * the keyword is the CSS default. That difference is real and is documented on
 * `/design-system/components/chart#animation` rather than hidden.
 *
 * The alternatives were both worse. Casting the token's value through `as` puts
 * a string recharts' own parser may not read into a typed slot and calls it
 * safe. Writing the four control points out by hand duplicates a token as a
 * literal, which is the exact drift `check:tokens` exists to catch.
 */
export type ChartEasing =
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "linear";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Server-render fallbacks, and the reason they duplicate token values.
 *
 * §0 forbids restating a token by hand, and these two restate one. They are
 * kept deliberately: `getComputedStyle` does not exist on the server, and
 * without them a chart renders nothing at all until hydration — a worse failure
 * than a duplicated constant. They are unreachable in a browser, because the
 * store getters below always win once there is a `document`. If a token moves
 * and one of these does not, the only visible consequence is one frame of
 * server-rendered markup at the old timing.
 */
const SSR_DURATION_MS = 400;
const EASING: ChartEasing = "ease-out";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
/* Server render: assume motion is allowed, matching the CSS default. */
const getReducedMotionOnServer = () => false;

/**
 * The stylesheet is the external store for the duration.
 *
 * One observer for the whole page, started with the first subscriber and
 * stopped with the last — `token-swatch.tsx` again. It watches `class` because
 * next-themes flips the theme by rewriting it, and `style` because that is
 * where a runtime override of a custom property lands. Both are ways
 * `--duration-slow` can change under a mounted chart, and a hook that has
 * genuinely read the token has to follow it.
 */
const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;

function subscribeStylesheet(onChange: () => void) {
  listeners.add(onChange);

  if (!observer) {
    observer = new MutationObserver(() => {
      for (const l of listeners) l();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  }

  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      observer?.disconnect();
      observer = null;
    }
  };
}

/** Read a `--duration-*` token and return it as a number of milliseconds. */
function readMs(token: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  const scale = raw.endsWith("ms") ? 1 : raw.endsWith("s") ? 1000 : 0;
  if (scale === 0) return fallback;
  const n = Number.parseFloat(raw) * scale;
  return Number.isFinite(n) ? n : fallback;
}

const getChartDuration = () => readMs("--duration-slow", SSR_DURATION_MS);
const getChartDurationOnServer = () => SSR_DURATION_MS;

/**
 * Spread the whole result onto every animated recharts element:
 *
 *   const motion = useChartMotion();
 *   <Bar dataKey="sealed" {...motion} />
 *
 * Spreading rather than picking is deliberate — a series that takes only two of
 * the three is a series that quietly opts out of one of them.
 */
export function useChartMotion(): {
  isAnimationActive: boolean;
  animationDuration: number;
  animationEasing: ChartEasing;
} {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  );
  const animationDuration = useSyncExternalStore(
    subscribeStylesheet,
    getChartDuration,
    getChartDurationOnServer,
  );

  return {
    isAnimationActive: !reduced,
    animationDuration,
    animationEasing: EASING,
  };
}
