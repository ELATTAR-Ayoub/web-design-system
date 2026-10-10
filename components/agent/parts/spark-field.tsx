"use client";

/**
 * SparkField — the max-effort atmosphere: a soft agent-coloured tint over the
 * prompt box and a canvas of rising sparks that speed up and flare while the
 * user types. Written for this system, on its tokens; its behaviour deliberately
 * matches the max-effort sparks it replaced. The AgentWorkspace composer arms it
 * on one condition: max effort, the prompt focused and no reduced-motion
 * preference.
 *
 * Place it as the first child of the prompt box. It fills the box behind the
 * content (`-z-10`), so the box itself must be `relative isolate`. The host
 * keeps a ref and calls `ref.current?.bump()` on every keystroke.
 *
 * The physics are small pure functions (`spawnSpark`, `stepSpark`,
 * `bumpTyping`, `decayTyping`, `drawSpark`) so they can be tested without a
 * canvas; the component only owns the loop. Colour is read once from the
 * canvas' own `text-agent`, so the sparks follow the theme token.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/** What a host can do to a running field: feed it one keystroke. */
export type SparkFieldHandle = { bump: () => void };

/** One spark. Positions are CSS pixels inside the box; times are seconds. */
export type Spark = {
  x: number;
  y: number;
  /** Radius at rest. */
  r: number;
  /** Vertical velocity at rest speed; negative is up. */
  vy: number;
  /** Amplitude of the sideways drift. */
  sway: number;
  /** Offset into the drift and twinkle waves, so sparks do not pulse together. */
  phase: number;
  /** Age. */
  life: number;
  /** Lifespan: the spark fades in, then out, over this long. */
  span: number;
};

/** How sparks are born. */
export const SPAWN = {
  /** Sparks scattered through the box the moment the field arms. */
  SCATTERED: 26,
  /** Population ceiling while running. */
  MAX: 30,
  /** One new spark from the bottom edge this often, until the ceiling. */
  INTERVAL_S: 0.14,
  /** Fraction of the box's height, from the top, where scattered sparks may start. */
  SCATTER_TOP: 0.2,
  /** Head start on its age that a scattered spark may be given (random up to this). */
  HEAD_START_S: 1.2,
  /** How far below the bottom edge a rising spark starts, and the top edge it recycles past. */
  MARGIN_PX: 3,
  RECYCLE_ABOVE_PX: 4,
} as const;

/** How sparks look and move at rest. */
export const SPARK = {
  RADIUS_MIN_PX: 0.9,
  RADIUS_SPREAD_PX: 1.1,
  RISE_MIN_PX_S: 7,
  RISE_SPREAD_PX_S: 9,
  /** Total sideways range, so a spark drifts +/- half of it. */
  SWAY_RANGE_PX: 10,
  LIFE_MIN_S: 2.4,
  LIFE_SPREAD_S: 2.4,
  /** Sparks fade out within this distance of the top and bottom edges. */
  EDGE_FADE_PX: 14,
  /** Drift wave: period 2*pi*this ms at rest, quickened by typing. */
  SWAY_MS: 900,
  /** Twinkle wave: likewise. */
  TWINKLE_MS: 160,
  TWINKLE_FLOOR: 0.7,
  TWINKLE_DEPTH: 0.3,
} as const;

/** What typing does to the field. */
export const TYPING = {
  /** Energy one keystroke adds, and the most it can hold. */
  PER_KEY: 0.22,
  CAP: 1.6,
  /** Energy decays exponentially with this time constant. */
  TIME_CONSTANT_S: 0.8,
  /** A keystroke also flares the glow; the flare decays much faster. */
  FLARE_TIME_CONSTANT_S: 0.16,
  /** Rise speed multiplier is 1 + energy * this (about x7 at the cap). */
  SPEED_GAIN: 6,
  /** The rise speed eases toward its target over this long. */
  SPEED_EASE_S: 0.15,
  /** Brightness, size and drift quickening per unit of energy. */
  ALPHA_GAIN: 0.25,
  SIZE_GAIN: 0.35,
  SWAY_GAIN: 0.8,
} as const;

/** Glow blur radius at rest, and what energy and the flare add to it. */
export const GLOW = { BASE_PX: 6, PER_ENERGY_PX: 10, PER_FLARE_PX: 6 } as const;

/** The largest step the loop takes, so a background tab does not teleport the sparks. */
const MAX_FRAME_S = 0.05;
/** Backing-store pixel ratio ceiling. */
const MAX_DPR = 2;

type Random = () => number;

/** A new spark: scattered through the box on arm, otherwise rising from below the bottom edge. */
export function spawnSpark(width: number, height: number, scattered: boolean, random: Random = Math.random): Spark {
  return {
    x: random() * width,
    y: scattered ? height * (SPAWN.SCATTER_TOP + random() * (1 - SPAWN.SCATTER_TOP)) : height + SPAWN.MARGIN_PX,
    r: SPARK.RADIUS_MIN_PX + random() * SPARK.RADIUS_SPREAD_PX,
    vy: -(SPARK.RISE_MIN_PX_S + random() * SPARK.RISE_SPREAD_PX_S),
    sway: (random() - 0.5) * SPARK.SWAY_RANGE_PX,
    phase: random() * Math.PI * 2,
    life: scattered ? random() * SPAWN.HEAD_START_S : 0,
    span: SPARK.LIFE_MIN_S + random() * SPARK.LIFE_SPREAD_S,
  };
}

/**
 * Age and move one spark by `dt` seconds at rise multiplier `speed`. A spark that
 * floats past the top is recycled to the bottom at a new x; returns false once
 * its life is spent and it should be dropped.
 */
export function stepSpark(
  spark: Spark,
  dt: number,
  speed: number,
  width: number,
  height: number,
  random: Random = Math.random,
): boolean {
  spark.life += dt;
  if (spark.life > spark.span) return false;
  spark.y += spark.vy * dt * speed;
  if (spark.y < -SPAWN.RECYCLE_ABOVE_PX) {
    spark.y = height + SPAWN.MARGIN_PX;
    spark.x = random() * width;
  }
  return true;
}

/** Typing energy after one more keystroke. */
export const bumpTyping = (energy: number) => Math.min(TYPING.CAP, energy + TYPING.PER_KEY);

/** Exponential decay over `dt` seconds toward zero. */
export const decayTyping = (value: number, dt: number, timeConstantS: number = TYPING.TIME_CONSTANT_S) =>
  value * Math.exp(-dt / timeConstantS);

/** Paint one spark. The caller sets the fill colour and the glow once per frame. */
export function drawSpark(
  ctx: CanvasRenderingContext2D,
  spark: Spark,
  nowMs: number,
  energy: number,
  height: number,
) {
  const age = spark.life / spark.span;
  const twinkle =
    SPARK.TWINKLE_FLOOR +
    SPARK.TWINKLE_DEPTH * Math.sin((nowMs / SPARK.TWINKLE_MS) * (1 + energy) + spark.phase);
  const edge = Math.min(
    1,
    Math.max(0, spark.y / SPARK.EDGE_FADE_PX),
    Math.max(0, (height - spark.y) / SPARK.EDGE_FADE_PX),
  );
  const fade = Math.sin(age * Math.PI) * (0.9 + energy * TYPING.ALPHA_GAIN) * twinkle;
  const drift =
    Math.sin((nowMs / SPARK.SWAY_MS) * (1 + energy * TYPING.SWAY_GAIN) + spark.phase) * spark.sway;
  ctx.globalAlpha = Math.min(1, fade) * edge;
  ctx.beginPath();
  ctx.arc(spark.x + drift, spark.y, spark.r * twinkle * (1 + energy * TYPING.SIZE_GAIN), 0, Math.PI * 2);
  ctx.fill();
}

export function SparkField({
  active,
  ref,
  className,
}: {
  active: boolean;
  ref?: React.Ref<SparkFieldHandle>;
  className?: string;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  // Shared with the loop: how worked-up the typist is, and whether a flare is owed.
  const typing = React.useRef({ energy: 0, flarePending: false });

  React.useImperativeHandle(ref, () => ({
    bump: () => {
      typing.current.energy = bumpTyping(typing.current.energy);
      typing.current.flarePending = true;
    },
  }));

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!active || !canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const color = getComputedStyle(canvas).color;
    typing.current.flarePending = false;

    const sparks: Spark[] = [];
    let frame = 0;
    let previous = performance.now();
    let width = 0;
    let height = 0;
    let sinceSpawn = 0;
    let speed = 1;
    let flare = 0;

    const fit = () => {
      const box = canvas.getBoundingClientRect();
      const ratio = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const loop = (now: number) => {
      const dt = Math.min(MAX_FRAME_S, (now - previous) / 1000);
      previous = now;

      const state = typing.current;
      state.energy = decayTyping(state.energy, dt);
      flare = decayTyping(flare, dt, TYPING.FLARE_TIME_CONSTANT_S);
      if (state.flarePending) {
        state.flarePending = false;
        flare = 1;
      }
      const energy = state.energy;

      const targetSpeed = 1 + energy * TYPING.SPEED_GAIN;
      speed += (targetSpeed - speed) * (1 - Math.exp(-dt / TYPING.SPEED_EASE_S));

      sinceSpawn += dt;
      while (sinceSpawn > SPAWN.INTERVAL_S) {
        sinceSpawn -= SPAWN.INTERVAL_S;
        if (sparks.length < SPAWN.MAX) sparks.push(spawnSpark(width, height, false));
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = GLOW.BASE_PX + energy * GLOW.PER_ENERGY_PX + flare * GLOW.PER_FLARE_PX;
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        if (stepSpark(sparks[i], dt, speed, width, height)) drawSpark(ctx, sparks[i], now, energy, height);
        else sparks.splice(i, 1);
      }
      frame = requestAnimationFrame(loop);
    };

    fit();
    for (let i = 0; i < SPAWN.SCATTERED; i += 1) sparks.push(spawnSpark(width, height, true));
    const observer = new ResizeObserver(fit);
    observer.observe(canvas);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      ctx.clearRect(0, 0, width, height);
    };
  }, [active]);

  return (
    <>
      <span
        aria-hidden
        data-slot="spark-tint"
        className={cn(
          "bg-agent/15 pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-slow",
          active && "opacity-100",
          className,
        )}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        data-slot="spark-field"
        data-active={active ? "" : undefined}
        className="text-agent pointer-events-none absolute inset-0 -z-10 size-full rounded-[inherit]"
      />
    </>
  );
}
