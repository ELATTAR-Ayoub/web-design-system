import { cn } from "@/lib/utils";
import type { ElementType } from "react";
import { createElement, memo } from "react";

export interface TextShimmerProps {
  children: string;
  as?: ElementType;
  className?: string;
  /**
   * @deprecated No longer configurable. Timing comes from the system's
   * `--duration-shimmer-text` token (RULES §4, "Timing must be declared in
   * one utility") instead of a per-instance value. Kept for signature
   * compatibility with the vendored component.
   */
  duration?: number;
  /** @deprecated No longer configurable — see `duration`. */
  spread?: number;
}

// Vendored change: the upstream component drove a framer-motion
// background-position tween sized by `children.length * spread` and an
// arbitrary `duration` (seconds) prop — both invisible to `check:tokens` and
// exempt from `prefers-reduced-motion`. The system already ships this exact
// effect as the `anim-shimmer-text` CSS utility (styles/motion.css), which
// reads `--duration-shimmer-text`/`--ease-move` off the token scale and is
// covered by the global reduced-motion rule. `duration`/`spread` are kept as
// accepted-but-unused props so existing call sites still type-check.
// `createElement` rather than `<Component>` — a bare `ElementType` used
// directly as a JSX tag cannot be resolved to a props shape that accepts
// `children`, and TypeScript narrows it to `never`.
const ShimmerComponent = ({
  children,
  as: Component = "p",
  className,
}: TextShimmerProps) =>
  createElement(
    Component,
    { className: cn("anim-shimmer-text inline-block", className) },
    children
  );

export const Shimmer = memo(ShimmerComponent);
