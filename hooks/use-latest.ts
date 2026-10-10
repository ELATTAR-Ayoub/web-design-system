import { useEffect, useRef, type RefObject } from "react";

/**
 * The latest value, readable from a callback that outlives the render that
 * made it.
 *
 * Animation loops are the case this exists for. A `requestAnimationFrame` loop
 * is started once in an effect and then runs for the life of the component; if
 * it closed over `analyser` directly it would keep reading whichever analyser
 * existed when the effect ran, and re-subscribing on every change would tear the
 * loop down and restart it sixty times a second. Reading through a ref lets the
 * loop stay up and still see current values.
 *
 * **The assignment belongs in an effect, not in the render body.** Writing
 * `ref.current = value` during render is the older form of this idiom and it is
 * now a lint error: it mutates during render, which breaks under concurrent
 * rendering, where a render can be started and thrown away. Effects run after
 * commit, so a value written there is one React has actually committed to.
 *
 * The consequence is that this ref is one commit behind *during* a render — so
 * never read it while rendering. Read it from a frame callback, an event
 * handler or a timer, all of which run after the commit that set it.
 */
export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
