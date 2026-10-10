import * as React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
}

/**
 * Whether the reader has asked for reduced motion.
 *
 * **Most components in this system never need this**, and reaching for it when
 * the blanket CSS rule already applies is how a second, divergent motion policy
 * starts. `globals.css` collapses every animation and transition to a single
 * frame under `prefers-reduced-motion: reduce`, so anything whose movement is a
 * keyframe or a transition is already handled and should not ask.
 *
 * It exists for the one case CSS cannot reach: **motion driven from
 * JavaScript** — a value written to `style` on every pointer move, a canvas, a
 * physics loop. `globals.css` has no opinion about a `requestAnimationFrame`
 * that keeps setting `font-weight`, so the component has to decline to start
 * one. `TextPressure` is the case this was written for; `components/ds/chart-motion.ts`
 * has its own copy of the same store for recharts, which takes the answer as a
 * prop rather than as a class.
 *
 * `useSyncExternalStore` for the same reason as `hooks/use-mobile.ts`: it is a
 * browser subscription, and the React Compiler lint rejects synchronising
 * mounted state in an effect body. The server snapshot is `false`, matching the
 * CSS default, so nothing can hydrate differently.
 */
export function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
