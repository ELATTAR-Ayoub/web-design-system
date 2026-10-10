import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onStoreChange)
  return () => mql.removeEventListener("change", onStoreChange)
}

/**
 * Rewritten from the shadcn original, which set state inside an effect body and
 * therefore triggered a cascading render on mount (and tripped
 * react-hooks/set-state-in-effect). useSyncExternalStore is the intended tool
 * for reading from a browser API like matchMedia: it subscribes, reads the
 * current value, and returns a defined server snapshot so SSR renders desktop
 * rather than undefined.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}
