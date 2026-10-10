"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export function useReplayOnStateChange<T extends HTMLElement>(
  className = "anim-change"
) {
  const ref = React.useRef<T | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    let last = el.getAttribute("data-state")
    const observer = new MutationObserver(() => {
      const next = el.getAttribute("data-state")
      if (next === last) return
      last = next
      el.classList.remove(className)
      void el.offsetWidth
      el.classList.add(className)
    })

    observer.observe(el, { attributes: true, attributeFilter: ["data-state"] })
    return () => observer.disconnect()
  }, [className])

  return ref
}

// Only this animation is verified under reduced motion.
type ReplayAnimation = "anim-enter"

function useContentChangeReplay<T extends HTMLElement>(
  contentKey: React.Key,
  animationClassName: ReplayAnimation
) {
  const ref = React.useRef<T | null>(null)
  const lastKey = React.useRef(contentKey)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (lastKey.current === contentKey) return
    lastKey.current = contentKey

    el.classList.remove(animationClassName)
    // Force reflow so the animation restarts.
    void el.offsetWidth
    el.classList.add(animationClassName)
  }, [contentKey, animationClassName])

  return ref
}

export interface ContentChangeProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  contentKey: React.Key
  animationClassName?: ReplayAnimation
  children: React.ReactNode
}

function ContentChange({
  contentKey,
  animationClassName = "anim-enter",
  className,
  children,
  ...props
}: ContentChangeProps) {
  const ref = useContentChangeReplay<HTMLDivElement>(
    contentKey,
    animationClassName
  )

  return (
    <div
      ref={ref}
      data-slot="content-change"
      className={cn(animationClassName, className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { ContentChange }
