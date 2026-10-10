"use client";

import { useEffect, useRef, useState } from "react";

import { AGENT_STATE_LABEL, type AgentState } from "../core/states";
import { anim } from "./cube";
import { CubeScene } from "./cube";
import { sceneFor } from "./scenes";
import type { AvatarRendererProps, AvatarSize } from "./types";
import { cn } from "@/lib/utils";

import "./avatar.css";

/**
 * The default face: twenty-six isometric cube scenes.
 *
 * This is one implementation of `AvatarRenderer`, not a fixture. The console
 * takes the renderer as a prop and defaults to this one; swapping in different
 * artwork is a prop, not a fork. Everything specific to *these* cubes — the
 * geometry, the recipes, the keyframes — is confined to this folder.
 *
 * Two things are handled here rather than in the scenes:
 *
 *   The cross-fade. Changing state replaces the entire SVG, and a hard swap
 *   between two busy scenes reads as a glitch. The outgoing scene is held for
 *   the length of one fade while the incoming one fades over it.
 *
 *   Idle. It is the only state that is not an isometric projection: the handoff
 *   specifies a real CSS 3D cube on a perspective, rotating on all three axes.
 *   It gets its own branch because it genuinely is a different object.
 */

/** Rendered width of the scene box. Scenes size themselves within it. */
const SIZE: Record<AvatarSize, { box: string; scale: number }> = {
  sm: { box: "size-8", scale: 0.19 },
  md: { box: "size-12", scale: 0.29 },
  lg: { box: "size-20", scale: 0.48 },
  xl: { box: "size-32", scale: 0.78 },
};

/** Matches --duration-fast. The handoff asks for 150–200ms between states. */
const CROSSFADE_MS = 150;

/**
 * The incoming scene's fade.
 *
 * Hoisted out of the JSX so it is one object rather than a new one per render,
 * and so the reason below sits on the line it explains.
 *
 * allow-dynamic-motion: CROSSFADE_MS is also read in JavaScript, to schedule
 * when the outgoing scene unmounts, so the same number has to exist as a JS
 * value — it cannot live only as a class. It tracks --duration-fast.
 */
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
      // The single knob. Every accent face in the set is mixed from this, so a
      // caller passing `accent` recolours twenty-six scenes at once — and the
      // default routes it at the product's own agent token, which is what makes
      // the avatar follow a retheme instead of pinning the handoff's yellow.
      style={{ "--agent-cube-accent": accent } as React.CSSProperties}
    >
      {/* The outgoing scene sits underneath at full opacity and is simply
          dropped when the fade ends. Only the incoming one animates — it mounts
          fresh, and a CSS transition on a freshly-mounted element has no prior
          value to travel from, so this has to be a keyframe rather than a
          transition or the "fade" is an instant swap. */}
      {previous && previous !== state ? (
        <Scene key={previous} state={previous} scale={box.scale} speed={speed} />
      ) : null}
      <Scene key={state} state={state} scale={box.scale} speed={speed} entering />
    </span>
  );
}

/**
 * Holds the outgoing state for one fade.
 *
 * Returns the state being faded out, or null when nothing is transitioning.
 */
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

/**
 * Idle — a real cube, not a projection.
 *
 * Six faces on a `preserve-3d` parent, rotating on X, Y and Z at once. Linear,
 * and slow: this is the resting state, and anything faster reads as activity.
 * The face size scales with the avatar, so `translateZ` is half of it.
 */
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
