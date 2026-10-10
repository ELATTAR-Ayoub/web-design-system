"use client";

import type { ReactFlowProps } from "@xyflow/react";
import { Background, ReactFlow } from "@xyflow/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore, type ReactNode } from "react";

/**
 * xyflow's stylesheet colours what it draws itself — edge strokes and
 * arrowheads, the handle dot, the selection rectangle, the attribution —
 * through `--xy-*` custom properties with fixed light-theme defaults. Canvas
 * carries `xy-tokens` (styles/utilities.css), which points every one of them
 * at a role so the graph follows the theme.
 */
import "@xyflow/react/dist/style.css";

import { cn } from "@/lib/utils";

type CanvasProps = ReactFlowProps & {
  children?: ReactNode;
};

const deleteKeyCode = ["Backspace", "Delete"];

const subscribeNever = () => () => {};

export const Canvas = ({ children, className, ...props }: CanvasProps) => {
  // Vendored change: React Flow tags its root with its colour mode, and the
  // default is "light" — the same class our theme tokens key off, so the graph
  // turned light inside a dark page. Hand it our resolved theme instead —
  // "system" until next-themes has resolved, so the first frame follows the OS.
  const { resolvedTheme } = useTheme();
  // False on the server and during hydration, true after: the first client
  // render must match the prerendered HTML exactly.
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  const colorMode =
    hydrated && (resolvedTheme === "light" || resolvedTheme === "dark") ? resolvedTheme : "system";
  return (
    <ReactFlow
      // Keyed on the mode, so it remounts once hydrated with the real theme. A
      // prerendered page renders "system" on the server, where React Flow can
      // only write the class "light"; hydration never patches a class, so the
      // graph stayed light on a dark page. Hydration renders "system" too (see
      // `hydrated`), then the key changes and the graph remounts correctly.
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
