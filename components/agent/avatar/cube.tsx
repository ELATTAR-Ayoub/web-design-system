/**
 * The isometric cube renderer.
 *
 * One projection, three polygons per cube, one sort. Every one of the
 * twenty-six SVG scenes is this file plus a list of coordinates — which is the
 * reason the scenes can be data rather than twenty-six hand-drawn components.
 *
 * Geometry is the design handoff's, unchanged:
 *   screenX = (x − y) · 13
 *   screenY = (x + y) · 6.5 − z · 13
 *
 * Colours are not the handoff's literals but the tokens they were transcribed
 * into (`--agent-cube-*` in globals.css), so the set re-themes with the product
 * and survives `check:tokens`. The accent's three faces are mixed from a single
 * `--agent-cube-accent`, so overriding that one variable recolours everything.
 */

import type { CSSProperties } from "react";

/** Half-width, half-height, cube height. The isometric unit. */
const HW = 13;
const HH = 6.5;
const CH = 13;

export function iso(x: number, y: number, z = 0): [number, number] {
  return [(x - y) * HW, (x + y) * HH - z * CH];
}

/** Face polygons, relative to the cube's origin. */
const FACE = {
  top: "0,0 13,6.5 0,13 -13,6.5",
  left: "-13,6.5 0,13 0,26 -13,19.5",
  right: "13,6.5 0,13 0,26 13,19.5",
} as const;

/* ── Face colours ────────────────────────────────────────────────────────────
 *
 * The accent's top and right faces are derived rather than declared, exactly as
 * the handoff specifies, so that a caller setting `--agent-cube-accent` to any
 * hue gets a correctly lit cube instead of three unrelated colours. `oklab` for
 * the lighting mixes because it keeps perceived lightness linear; `srgb` for the
 * transparency mix because that one is compositing, not shading.
 */
const NEUTRAL = {
  top: "var(--agent-cube-top)",
  left: "var(--agent-cube-left)",
  right: "var(--agent-cube-right)",
  stroke: "var(--agent-cube-stroke)",
} as const;

const ACCENT_TOP = "color-mix(in oklab, var(--agent-cube-accent) 55%, var(--agent-cube-top))";
const ACCENT_RIGHT =
  "color-mix(in oklab, var(--agent-cube-accent) 80%, var(--agent-cube-accent-shade))";
const ACCENT_STROKE =
  "color-mix(in oklab, var(--agent-cube-accent) 45%, var(--agent-cube-stroke))";

const ACCENT = {
  top: ACCENT_TOP,
  left: "var(--agent-cube-accent)",
  right: ACCENT_RIGHT,
  stroke: ACCENT_STROKE,
} as const;

const ERROR = {
  top: "var(--agent-cube-error-top)",
  left: "var(--agent-cube-error-left)",
  right: "var(--agent-cube-error-right)",
  stroke: "var(--agent-cube-error-stroke)",
} as const;

/** The "missing box" — an accent cube at 45%, dashed. Reads as a slot to fill. */
const GHOST = {
  top: `color-mix(in srgb, ${ACCENT_TOP} 45%, transparent)`,
  left: "color-mix(in srgb, var(--agent-cube-accent) 45%, transparent)",
  right: `color-mix(in srgb, ${ACCENT_RIGHT} 45%, transparent)`,
  stroke: "color-mix(in oklab, var(--agent-cube-accent) 70%, var(--agent-cube-ghost-ink))",
} as const;

const DASH = "3 2.5";

/* ── The cube ────────────────────────────────────────────────────────────── */

export type Cube = {
  x: number;
  y: number;
  z?: number;
  accent?: boolean;
  red?: boolean;
  dashed?: boolean;
  /**
   * Forces this cube to the front of the painter's sort. Anything that floats
   * above or moves across the scene needs it, or it disappears behind the
   * geometry it is supposed to be travelling over.
   */
  boost?: number;
  /** Animation applied to the cube itself. */
  style?: CSSProperties;
  /** A second wrapper, for scenes that compose two motions (glide + bob). */
  outer?: CSSProperties;
};

function faces(cube: Cube) {
  if (cube.red) return { palette: ERROR, dash: undefined };
  if (cube.dashed) return { palette: GHOST, dash: DASH };
  if (cube.accent) return { palette: ACCENT, dash: undefined };
  return { palette: NEUTRAL, dash: undefined };
}

function CubeShape({ cube, index }: { cube: Cube; index: number }) {
  const [sx, sy] = iso(cube.x, cube.y, cube.z ?? 0);
  const { palette, dash } = faces(cube);

  const polygon = (points: string, fill: string) => (
    <polygon
      points={points}
      fill={fill}
      stroke={palette.stroke}
      strokeWidth={0.8}
      strokeLinejoin="round"
      {...(dash ? { strokeDasharray: dash } : {})}
    />
  );

  // Draw order within a cube is fixed: left, right, then top. The top face has
  // to land last or the two side faces overdraw its lower edges.
  const body = (
    <g className="agent-cube-anim" style={cube.style}>
      {polygon(FACE.left, palette.left)}
      {polygon(FACE.right, palette.right)}
      {polygon(FACE.top, palette.top)}
    </g>
  );

  return (
    <g key={index} transform={`translate(${sx},${sy})`}>
      {cube.outer ? (
        <g className="agent-cube-anim" style={cube.outer}>
          {body}
        </g>
      ) : (
        body
      )}
    </g>
  );
}

/* ── The scene ───────────────────────────────────────────────────────────── */

/**
 * Painter's sort: back to front by depth, then by height.
 *
 * `x + y` is distance from the viewer in the isometric grid, so sorting on it
 * puts nearer cubes later in document order and therefore on top. `boost` lifts
 * a cube out of that ordering entirely, and `z` breaks ties within one grid cell
 * so a stack draws bottom-up.
 */
function sortCubes(cubes: Cube[]): Cube[] {
  return cubes.slice().sort((a, b) => {
    const depth = a.x + a.y + (a.boost ?? 0) - (b.x + b.y + (b.boost ?? 0));
    return depth || (a.z ?? 0) - (b.z ?? 0);
  });
}

/**
 * The viewBox is measured from the cubes rather than declared.
 *
 * A scene's extent depends on its own geometry, and hand-tuning twenty-six viewBoxes
 * is how a scene silently clips the first time someone edits a recipe. `overflow:
 * visible` on the SVG covers the rest: a lifted or bouncing cube travels outside
 * the static bounds by design.
 */
const PAD = 10;

export function CubeScene({
  cubes,
  width,
  className,
}: {
  cubes: Cube[];
  width: number;
  className?: string;
}) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const cube of cubes) {
    const [sx, sy] = iso(cube.x, cube.y, cube.z ?? 0);
    minX = Math.min(minX, sx - HW);
    maxX = Math.max(maxX, sx + HW);
    minY = Math.min(minY, sy);
    maxY = Math.max(maxY, sy + HH * 2 + CH);
  }

  const viewBox = [
    minX - PAD,
    minY - PAD,
    maxX - minX + PAD * 2,
    maxY - minY + PAD * 2,
  ].join(" ");

  return (
    <svg
      viewBox={viewBox}
      width={width}
      className={className}
      style={{ display: "block", overflow: "visible" }}
      aria-hidden
    >
      {sortCubes(cubes).map((cube, index) => (
        <CubeShape key={`${cube.x}-${cube.y}-${cube.z ?? 0}-${index}`} cube={cube} index={index} />
      ))}
    </svg>
  );
}

/* ── Animation helpers ───────────────────────────────────────────────────────
 *
 * Scenes declare motion through these rather than writing the shorthand, so the
 * speed multiplier is applied in exactly one place and every scene stays on
 * var(--ease-in-out).
 */

export type Timing = { speed: number };

/** `animation` shorthand for one of the cube keyframes. */
export function anim(
  name: string,
  seconds: number,
  { speed }: Timing,
  options: { delay?: number; alternate?: boolean; linear?: boolean } = {},
): CSSProperties {
  const duration = (seconds / speed).toFixed(2);
  const easing = options.linear ? "linear" : "var(--ease-move)";
  return {
    // allow-dynamic-motion: the one place in this system where the shorthand
    // genuinely cannot be a utility class. Twenty-six scenes hold up to twenty
    // cubes each, and every cube needs its own keyframe name, its own duration
    // divided by the avatar's `speed` prop, and its own stagger delay. That is
    // several hundred combinations. Only the keyframes live in ./avatar.css;
    // `easing` above is always `linear` or `var(--ease-in-out)`, never a
    // literal curve.
    animation: `agent-cube-${name} ${duration}s ${easing} infinite${
      options.alternate ? " alternate" : ""
    }`,
    ...(options.delay ? { animationDelay: `${(options.delay / speed).toFixed(2)}s` } : {}),
  };
}

/**
 * The `appear` family, which starts invisible.
 *
 * Split out because the initial `opacity: 0` is load-bearing: without it every
 * cube in the scene flashes at full opacity on the first frame before the
 * animation takes over, and the whole Game Boy-logo effect is lost.
 */
export function appear(seconds: number, delay: number, timing: Timing): CSSProperties {
  return { opacity: 0, ...anim("appear", seconds, timing, { delay }) };
}

export function drop(seconds: number, delay: number, timing: Timing): CSSProperties {
  return { opacity: 0, ...anim("drop", seconds, timing, { delay }) };
}
