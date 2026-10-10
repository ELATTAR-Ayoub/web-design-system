"use client";

import type { ReactFlowProps } from "@xyflow/react";
import { Background, ReactFlow } from "@xyflow/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore, type ReactNode } from "react";

import "@xyflow/react/dist/style.css";

import { cn } from "@/lib/utils";

type CanvasProps = ReactFlowProps & {
  children?: ReactNode;
};

const deleteKeyCode = ["Backspace", "Delete"];

const subscribeNever = () => () => {};

export const Canvas = ({ children, className, ...props }: CanvasProps) => {
  // Vendored change: React Flow tags its root with its colour mode, and the default is "light" — the same class our theme tokens key off, so the graph turned light inside a dark page.
  const { resolvedTheme } = useTheme();
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  const colorMode =
    hydrated && (resolvedTheme === "light" || resolvedTheme === "dark") ? resolvedTheme : "system";
  return (
    <ReactFlow
      // Keyed so the graph remounts once hydrated with the real theme.
      key={colorMode}
      colorMode={colorMode}
      // Vendored change: `xy-tokens` puts xyflow's own colours on our roles.
      className={cn("xy-tokens", className)}
      deleteKeyCode={deleteKeyCode}
      fitView
      panOnDrag={false}
      panOnScroll
      selectionOnDrag={true}
      zoomOnDoubleClick={false}
      {...props}
    >
      <Background bgColor="var(--sidebar)" />
      {children}
    </ReactFlow>
  );
};
