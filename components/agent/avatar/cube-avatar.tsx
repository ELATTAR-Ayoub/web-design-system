"use client";

import { useEffect, useRef, useState } from "react";

import { AGENT_STATE_LABEL, type AgentState } from "../core/states";
import { anim } from "./cube";
import { CubeScene } from "./cube";
import { sceneFor } from "./scenes";
import type { AvatarRendererProps, AvatarSize } from "./types";
import { cn } from "@/lib/utils";

import "./avatar.css";

const SIZE: Record<AvatarSize, { box: string; scale: number }> = {
  sm: { box: "size-8", scale: 0.19 },
  md: { box: "size-12", scale: 0.29 },
  lg: { box: "size-20", scale: 0.48 },
  xl: { box: "size-32", scale: 0.78 },
};

const CROSSFADE_MS = 150;

/* allow-dynamic-motion: CROSSFADE_MS is also read in JavaScript, so it cannot live only as a class. */
const SCENE_IN = { animation: `agent-cube-scene-in ${CROSSFADE_MS}ms var(--ease-enter) both` };

export function CubeAvatar({
  state = "idle",
  size = "md",
  accent = "var(--agent)",
  speed = 1,
  className,
}: AvatarRendererProps) {
  const box = SIZE[size];
  const previous = useCrossfade(state);

  return (
    <span
      data-agent-avatar={state}
      role="img"
      aria-label={AGENT_STATE_LABEL[state]}
      className={cn("agent-cube-scene relative grid shrink-0 place-items-center", box.box, className)}
      style={{ "--agent-cube-accent": accent } as React.CSSProperties}
    >
      {/* A keyframe, not a transition: a freshly mounted element has no prior value to transition from. */}
      {previous && previous !== state ? (
        <Scene key={previous} state={previous} scale={box.scale} speed={speed} />
      ) : null}
      <Scene key={state} state={state} scale={box.scale} speed={speed} entering />
    </span>
  );
}

function useCrossfade(state: AgentState): AgentState | null {
  const [outgoing, setOutgoing] = useState<AgentState | null>(null);
  const current = useRef(state);

  useEffect(() => {
    if (current.current === state) return;
    const leaving = current.current;
    current.current = state;
    setOutgoing(leaving);
    const timer = window.setTimeout(() => setOutgoing(null), CROSSFADE_MS);
    return () => window.clearTimeout(timer);
  }, [state]);

  return outgoing;
}

function Scene({
  state,
  scale,
  speed,
  entering,
}: {
  state: AgentState;
  scale: number;
  speed: number;
  entering?: boolean;
}) {
  return (
    <span
      className="pointer-events-none absolute inset-0 grid place-items-center"
      style={entering ? SCENE_IN : undefined}
    >
      {state === "idle" ? (
        <IdleCube scale={scale} speed={speed} />
      ) : (
        <IsoScene state={state} scale={scale} speed={speed} />
      )}
    </span>
  );
}

function IsoScene({
  state,
  scale,
  speed,
}: {
  state: Exclude<AgentState, "idle">;
  scale: number;
  speed: number;
}) {
  const scene = sceneFor(state, { speed });
  return <CubeScene cubes={scene.cubes} width={scene.width * scale} />;
}

function IdleCube({ scale, speed }: { scale: number; speed: number }) {
  const face = 44 * scale * 1.35;
  const half = face / 2;

  const faces: { background: string; transform: string }[] = [
    { background: "color-mix(in oklab, var(--agent-cube-accent) 55%, var(--agent-cube-top))", transform: `rotateX(90deg) translateZ(${half}px)` },
    { background: "var(--agent-cube-back)", transform: `rotateX(-90deg) translateZ(${half}px)` },
    { background: "var(--agent-cube-accent)", transform: `translateZ(${half}px)` },
    { background: "var(--agent-cube-left)", transform: `rotateY(180deg) translateZ(${half}px)` },
    {
      background: "color-mix(in oklab, var(--agent-cube-accent) 80%, var(--agent-cube-accent-shade))",
      transform: `rotateY(90deg) translateZ(${half}px)`,
    },
    { background: "var(--agent-cube-right)", transform: `rotateY(-90deg) translateZ(${half}px)` },
  ];

  return (
    <span
      className="grid place-items-center"
      style={{ perspective: `${360 * scale}px`, width: face, height: face }}
    >
      <span
        className="agent-cube-anim relative block"
        style={{
          width: face,
          height: face,
          transformStyle: "preserve-3d",
          ...anim("spin3d", 9, { speed }, { linear: true }),
        }}
      >
        {faces.map((f) => (
          <span
            key={f.transform}
            className="absolute block border"
            style={{
              width: face,
              height: face,
              background: f.background,
              transform: f.transform,
              borderColor: "var(--agent-cube-stroke)",
              boxSizing: "border-box",
            }}
          />
        ))}
      </span>
    </span>
  );
}
