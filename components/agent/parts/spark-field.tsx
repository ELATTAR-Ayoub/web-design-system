"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type SparkFieldHandle = { bump: () => void };

export type Spark = {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  life: number;
  span: number;
};

export const SPAWN = {
  SCATTERED: 26,
  MAX: 30,
  INTERVAL_S: 0.14,
  SCATTER_TOP: 0.2,
  HEAD_START_S: 1.2,
  MARGIN_PX: 3,
  RECYCLE_ABOVE_PX: 4,
} as const;

export const SPARK = {
  RADIUS_MIN_PX: 0.9,
  RADIUS_SPREAD_PX: 1.1,
  RISE_MIN_PX_S: 7,
  RISE_SPREAD_PX_S: 9,
  SWAY_RANGE_PX: 10,
  LIFE_MIN_S: 2.4,
  LIFE_SPREAD_S: 2.4,
  EDGE_FADE_PX: 14,
  SWAY_MS: 900,
  TWINKLE_MS: 160,
  TWINKLE_FLOOR: 0.7,
  TWINKLE_DEPTH: 0.3,
} as const;

export const TYPING = {
  PER_KEY: 0.22,
  CAP: 1.6,
  TIME_CONSTANT_S: 0.8,
  FLARE_TIME_CONSTANT_S: 0.16,
  SPEED_GAIN: 6,
  SPEED_EASE_S: 0.15,
  ALPHA_GAIN: 0.25,
  SIZE_GAIN: 0.35,
  SWAY_GAIN: 0.8,
} as const;

export const GLOW = { BASE_PX: 6, PER_ENERGY_PX: 10, PER_FLARE_PX: 6 } as const;

const MAX_FRAME_S = 0.05;
const MAX_DPR = 2;

type Random = () => number;

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

export const bumpTyping = (energy: number) => Math.min(TYPING.CAP, energy + TYPING.PER_KEY);

export const decayTyping = (value: number, dt: number, timeConstantS: number = TYPING.TIME_CONSTANT_S) =>
  value * Math.exp(-dt / timeConstantS);

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
