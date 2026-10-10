import { useEffect, useRef, type RefObject } from "react";

// Assigned in an effect, not during render: never read this ref while rendering.
export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
