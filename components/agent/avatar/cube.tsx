import type { CSSProperties } from "react";

const HW = 13;
const HH = 6.5;
const CH = 13;

export function iso(x: number, y: number, z = 0): [number, number] {
  return [(x - y) * HW, (x + y) * HH - z * CH];
}

const FACE = {
  top: "0,0 13,6.5 0,13 -13,6.5",
  left: "-13,6.5 0,13 0,26 -13,19.5",
  right: "13,6.5 0,13 0,26 13,19.5",
} as const;

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

const GHOST = {
  top: `color-mix(in srgb, ${ACCENT_TOP} 45%, transparent)`,
  left: "color-mix(in srgb, var(--agent-cube-accent) 45%, transparent)",
  right: `color-mix(in srgb, ${ACCENT_RIGHT} 45%, transparent)`,
  stroke: "color-mix(in oklab, var(--agent-cube-accent) 70%, var(--agent-cube-ghost-ink))",
} as const;

const DASH = "3 2.5";

export type Cube = {
  x: number;
  y: number;
  z?: number;
  accent?: boolean;
  red?: boolean;
  dashed?: boolean;
  boost?: number;
  style?: CSSProperties;
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

  // Top face last, or the side faces overdraw its lower edges.
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

function sortCubes(cubes: Cube[]): Cube[] {
  return cubes.slice().sort((a, b) => {
    const depth = a.x + a.y + (a.boost ?? 0) - (b.x + b.y + (b.boost ?? 0));
    return depth || (a.z ?? 0) - (b.z ?? 0);
  });
}

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

export type Timing = { speed: number };

export function anim(
  name: string,
  seconds: number,
  { speed }: Timing,
  options: { delay?: number; alternate?: boolean; linear?: boolean } = {},
): CSSProperties {
  const duration = (seconds / speed).toFixed(2);
  const easing = options.linear ? "linear" : "var(--ease-move)";
  return {
    // allow-dynamic-motion: every cube needs its own keyframe name, duration and delay.
    animation: `agent-cube-${name} ${duration}s ${easing} infinite${
      options.alternate ? " alternate" : ""
    }`,
    ...(options.delay ? { animationDelay: `${(options.delay / speed).toFixed(2)}s` } : {}),
  };
}

export function appear(seconds: number, delay: number, timing: Timing): CSSProperties {
  return { opacity: 0, ...anim("appear", seconds, timing, { delay }) };
}

export function drop(seconds: number, delay: number, timing: Timing): CSSProperties {
  return { opacity: 0, ...anim("drop", seconds, timing, { delay }) };
}
