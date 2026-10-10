"use client"

import * as React from "react"

export function useActiveIndicator<T extends HTMLElement = HTMLDivElement>(
  activeSelector = '[data-state="on"],[data-state="active"]',
  arrivalAnimation = "anim-change",
  attributeName = "data-state",
) {
  const containerRef = React.useRef<T | null>(null)
  const indicatorRef = React.useRef<HTMLSpanElement | null>(null)
  const arrivalRef = React.useRef<HTMLSpanElement | null>(null)
  const isFirstMove = React.useRef(true)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const move = () => {
      const active = container.querySelector<HTMLElement>(activeSelector)
      const indicator = indicatorRef.current
      if (!indicator) return

      if (!active) {
        indicator.style.opacity = "0"
        return
      }

      // Rects, not offsetLeft/Top: rows sit in positioned wrappers.
      const cRect = container.getBoundingClientRect()
      const rect = active.getBoundingClientRect()
      const cs = getComputedStyle(container)
      const borderLeft = parseFloat(cs.borderLeftWidth) || 0
      const borderTop = parseFloat(cs.borderTopWidth) || 0

      indicator.style.width = `${rect.width}px`
      indicator.style.height = `${rect.height}px`
      indicator.style.transform = `translate(${
        rect.left - cRect.left - borderLeft + container.scrollLeft
      }px, ${rect.top - cRect.top - borderTop + container.scrollTop}px)`
      indicator.style.opacity = "1"

      if (isFirstMove.current) {
        indicator.style.transition = "none"
        requestAnimationFrame(() => {
          indicator.style.transition = ""
        })
        isFirstMove.current = false
        return
      }

      const arrival = arrivalRef.current
      if (arrival) {
        arrival.classList.remove(arrivalAnimation)
        void arrival.offsetWidth
        arrival.classList.add(arrivalAnimation)
      }
    }

    move()
    const mo = new MutationObserver(move)
    mo.observe(container, {
      attributes: true,
      subtree: true,
      attributeFilter: [attributeName],
    })
    const ro = new ResizeObserver(move)
    ro.observe(container)
    return () => {
      mo.disconnect()
      ro.disconnect()
    }
  }, [activeSelector, arrivalAnimation, attributeName])

  return { containerRef, indicatorRef, arrivalRef }
}

export function ActiveIndicator({
  indicatorRef,
  arrivalRef,
  className,
  children,
}: {
  indicatorRef: React.RefObject<HTMLSpanElement | null>
  arrivalRef: React.RefObject<HTMLSpanElement | null>
  className?: string
  children?: React.ReactNode
}) {
  return (
    <span
      ref={indicatorRef}
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 w-0 opacity-0 toggle-slide"
    >
      <span
        ref={arrivalRef}
        className={
          className ?? "block size-full rounded-pill bg-primary shadow-chip"
        }
      >
        {children}
      </span>
    </span>
  )
}
