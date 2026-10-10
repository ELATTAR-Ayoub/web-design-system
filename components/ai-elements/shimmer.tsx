import { cn } from "@/lib/utils";
import type { ElementType } from "react";
import { createElement, memo } from "react";

export interface TextShimmerProps {
  children: string;
  as?: ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

// Vendored change: the upstream component drove a framer-motion background-position tween sized by `children.length * spread` and an arbitrary `duration` (seconds) prop.
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
