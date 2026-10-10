/**
 * The twenty-six state recipes.
 *
 * Each is a function from a speed multiplier to a list of cubes. That is the
 * whole extent of what a state *is* here — geometry and timing, no component, no
 * branching, no per-state file. Editing a motion signature means editing one
 * generator, and adding a state means adding one entry.
 *
 * Transcribed from the design handoff. Grid coordinates, delays and durations
 * are its numbers exactly; the widths are its per-scene overrides.
 *
 * `idle` is the one exception and has no entry: it is a real CSS 3D cube rather
 * than an isometric projection, so it is drawn directly in `CubeAvatar`.
 */

import { anim, appear, drop, type Cube, type Timing } from "./cube";
import type { AgentState } from "../core/states";

export type Scene = { cubes: Cube[]; width: number };
type Generator = (timing: Timing) => Scene;

/** The eight perimeter cells of a 3×3, in ring order. Used by two scenes. */
const RING: [number, number][] = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, 1],
  [2, 2],
  [1, 2],
  [0, 2],
  [0, 1],
];

/** Default scene width. Overridden per scene where the geometry is wider or narrower. */
const W = 168;

const scenes: Record<Exclude<AgentState, "idle">, Generator> = {
  /** Five cubes waiting their turn, bobbing in sequence. */
  queued: (t) => ({
    width: 190,
    cubes: Array.from({ length: 5 }, (_, x) => ({
      x,
      y: 0,
      accent: x === 2,
      style: anim("bob", 2.2, t, { delay: x * 0.22 }),
    })),
  }),

  /** A staircase assembling itself — each column one step taller than the last. */
  planning: (t) => {
    const cubes: Cube[] = [];
    for (let x = 0; x < 4; x += 1) {
      for (let y = 0; y < 2; y += 1) {
        for (let z = 0; z <= x; z += 1) {
          cubes.push({ x, y, z, accent: z === x, style: appear(3.6, x * 0.35 + z * 0.12, t) });
        }
      }
    }
    return { width: 160, cubes };
  },

  /** One cube pulled up out of the middle of a stack, over and over. */
  retrieving: (t) => {
    const cubes: Cube[] = [];
    for (let x = 0; x < 3; x += 1) {
      for (let y = 0; y < 3; y += 1) {
        cubes.push(
          x === 1 && y === 1
            ? { x, y, boost: 100, accent: true, style: anim("pull", 2.6, t) }
            : { x, y },
        );
      }
    }
    return { width: W, cubes };
  },

  /** Cubes falling onto a platform, one after another. */
  ingesting: (t) => {
    const cubes: Cube[] = [];
    for (let x = 0; x < 2; x += 1) {
      for (let y = 0; y < 2; y += 1) {
        cubes.push({ x, y });
        cubes.push({ x, y, z: 1, accent: true, style: drop(2.8, (x * 2 + y) * 0.4, t) });
      }
    }
    return { width: 120, cubes };
  },

  /** A diagonal ripple across a 4×4 — deliberately no opacity change. */
  running: (t) => {
    const cubes: Cube[] = [];
    for (let x = 0; x < 4; x += 1) {
      for (let y = 0; y < 4; y += 1) {
        cubes.push({
          x,
          y,
          accent: x + y === 3,
          style: anim("settle", 1.6, t, { delay: (x + y) * 0.15 }),
        });
      }
    }
    return { width: W, cubes };
  },

  /** Two islands, and a courier gliding from one to the other. */
  delegating: (t) => {
    const cubes: Cube[] = [];
    for (const base of [0, 4]) {
      for (let x = base; x < base + 2; x += 1) {
        for (let y = 0; y < 2; y += 1) {
          cubes.push({ x, y, style: anim("settle", 3, t, { delay: base ? 1.5 : 0 }) });
        }
      }
    }
    // No bob on the courier: it travels in a straight line, which is what makes
    // it read as carrying something rather than wandering.
    cubes.push({
      x: 1,
      y: 0,
      z: 1,
      boost: 100,
      accent: true,
      outer: anim("glide", 2.2, t, { alternate: true }),
    });
    return { width: 190, cubes };
  },

  /** A slot at the near corner, blinking to be filled. */
  awaiting_approval: (t) => {
    const cubes: Cube[] = [];
    for (let x = 0; x < 3; x += 1) {
      for (let y = 0; y < 3; y += 1) {
        cubes.push(
          x === 2 && y === 2
            ? { x, y, boost: 100, dashed: true, style: anim("blinkslow", 2.2, t) }
            : { x, y },
        );
      }
    }
    return { width: W, cubes };
  },

  /** A pulse chasing the perimeter, checking each cell in turn. */
  validating: (t) => {
    const cubes: Cube[] = [{ x: 1, y: 1 }];
    RING.forEach(([x, y], i) => {
      cubes.push({ x, y, accent: true, style: anim("blinkfade", 2, t, { delay: i * 0.25 }) });
    });
    return { width: W, cubes };
  },

  /** One cube bouncing off the stack and landing again. */
  retrying: (t) => {
    const cubes: Cube[] = [];
    for (let x = 0; x < 2; x += 1) {
      for (let y = 0; y < 2; y += 1) cubes.push({ x, y });
    }
    cubes.push({ x: 0, y: 0, z: 1, boost: 100, accent: true, style: anim("bounce", 2, t) });
    return { width: 120, cubes };
  },

  /** The centre cube shaking, in red. The only scene that leaves the accent. */
  error: (t) => {
    const cubes: Cube[] = [];
    for (let x = 0; x < 3; x += 1) {
      for (let y = 0; y < 3; y += 1) {
        cubes.push(
          x === 1 && y === 1 ? { x, y, red: true, style: anim("shake", 1.4, t) } : { x, y },
        );
      }
    }
    return { width: W, cubes };
  },

  /** The perimeter assembling first, then the conclusion in the middle. */
  summarizing: (t) => {
    const cubes: Cube[] = RING.map(([x, y], i) => ({ x, y, style: appear(4, i * 0.26, t) }));
    cubes.push({ x: 1, y: 1, accent: true, style: appear(4, 2.1, t) });
    return { width: W, cubes };
  },

  /** A diagonal wave of consideration across a 3×3. */
  thinking: (t) => {
    const cubes: Cube[] = [];
    for (let x = 0; x < 3; x += 1) {
      for (let y = 0; y < 3; y += 1) {
        cubes.push({
          x,
          y,
          accent: x === 1 && y === 1,
          style: anim("bob", 1.8, t, { delay: 0.16 * (x + y) }),
        });
      }
    }
    return { width: W, cubes };
  },

  /** Scattered cells rising in sequence — work happening in several places. */
  processing: (t) => {
    const raised: Record<string, number> = {
      "0,1": 0,
      "1,3": 0.6,
      "2,0": 1.2,
      "3,2": 1.8,
      "1,1": 2.4,
    };
    const cubes: Cube[] = [];
    for (let x = 0; x < 4; x += 1) {
      for (let y = 0; y < 4; y += 1) {
        const delay = raised[`${x},${y}`];
        cubes.push({
          x,
          y,
          accent: delay !== undefined,
          ...(delay === undefined ? {} : { style: anim("rise", 3, t, { delay }) }),
        });
      }
    }
    return { width: W, cubes };
  },

  /** Two blocks, and a bridge being built between them. */
  calling_tools: (t) => {
    const cubes: Cube[] = [];
    for (const base of [0, 4]) {
      for (let x = base; x < base + 2; x += 1) {
        for (let y = 0; y < 2; y += 1) cubes.push({ x, y, style: anim("settle", 2.4, t) });
      }
    }
    (
      [
        [2, 0, 0],
        [2, 1, 0.3],
        [3, 0, 0.6],
        [3, 1, 0.9],
      ] as const
    ).forEach(([x, y, delay]) => cubes.push({ x, y, accent: true, style: appear(3, delay, t) }));
    return { width: 196, cubes };
  },

  /** A scanner hunting over a platform with holes in it. */
  searching: (t) => {
    const holes: Record<string, "dashed" | "gone"> = {
      "2,1": "dashed",
      "1,3": "gone",
      "3,0": "gone",
    };
    const cubes: Cube[] = [];
    for (let x = 0; x < 4; x += 1) {
      for (let y = 0; y < 4; y += 1) {
        const hole = holes[`${x},${y}`];
        if (hole === "gone") continue;
        cubes.push(hole === "dashed" ? { x, y, dashed: true } : { x, y });
      }
    }
    // Two motions composed: the outer glides across, the inner bobs in place.
    cubes.push({
      x: 0,
      y: 1,
      z: 1.5,
      boost: 100,
      accent: true,
      outer: anim("glide", 2.6, t, { alternate: true }),
      style: anim("bob", 1.3, t),
    });
    return { width: W, cubes };
  },

  /** Three layers lifting apart, like pages coming off a stack. */
  reading: (t) => {
    const cubes: Cube[] = [];
    for (let z = 0; z < 3; z += 1) {
      for (let x = 0; x < 3; x += 1) {
        for (let y = 0; y < 2; y += 1) {
          cubes.push({
            x,
            y,
            z,
            accent: z === 2,
            // Same duration and phase on both lifted layers, so they travel
            // together and never intersect.
            ...(z === 0 ? {} : { style: anim(z === 1 ? "lift" : "lift2", 2.2, t) }),
          });
        }
      }
    }
    return { width: 150, cubes };
  },

  /** Rows surfacing from the back — older context coming forward. */
  recalling: (t) => {
    const cubes: Cube[] = [];
    for (let row = 0; row < 3; row += 1) {
      for (let x = 0; x < 4; x += 1) {
        cubes.push({
          x,
          y: 2 - row,
          accent: row === 0,
          ...(row === 2 ? {} : { style: appear(3.2, (1 - row) * 0.5 + x * 0.12, t) }),
        });
      }
    }
    return { width: W, cubes };
  },

  /** A grid filling in cube by cube, left to right, like typing. */
  writing: (t) => {
    const cubes: Cube[] = [];
    for (let y = 0; y < 3; y += 1) {
      for (let x = 0; x < 4; x += 1) {
        cubes.push({
          x,
          y,
          accent: y === 2 && x === 3,
          style: appear(3.4, (y * 4 + x) * 0.13, t),
        });
      }
    }
    return { width: W, cubes };
  },

  /** A solid, finished block, breathing in phase. */
  done: (t) => {
    const cubes: Cube[] = [];
    for (let x = 0; x < 2; x += 1) {
      for (let y = 0; y < 2; y += 1) {
        for (let z = 0; z < 2; z += 1) {
          cubes.push({ x, y, z, accent: z === 1, style: anim("settle", 3.2, t) });
        }
      }
    }
    return { width: 110, cubes };
  },

  /** A pause glyph — two upright columns, holding still rather than working. */
  paused: (t) => {
    const cubes: Cube[] = [];
    for (const x of [0, 2]) {
      for (let z = 0; z < 3; z += 1) {
        cubes.push({ x, y: 0, z, style: anim("settle", 3.6, t) });
      }
    }
    return { width: 90, cubes };
  },

  /** A 2×2 block coming apart — each cube fades in reverse order, so the block
   *  reads as dissolving from the far corner back toward the viewer. */
  cancelling: (t) => {
    const cells: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const cubes: Cube[] = cells.map(([x, y], i) => ({
      x,
      y,
      accent: i === 0,
      style: appear(2.4, (cells.length - 1 - i) * 0.3, t),
    }));
    return { width: 90, cubes };
  },

  /** The `writing` grid, mirrored: it fills right to left, like a record being
   *  taken back rather than typed. */
  undoing: (t) => {
    const cubes: Cube[] = [];
    for (let y = 0; y < 3; y += 1) {
      for (let x = 0; x < 4; x += 1) {
        cubes.push({
          x,
          y,
          accent: y === 2 && x === 0,
          style: appear(3.4, (y * 4 + (3 - x)) * 0.13, t),
        });
      }
    }
    return { width: W, cubes };
  },

  /** A 2×2×2 block missing its far top corner, the cube beneath the gap
   *  accented — most of the work landed, one piece did not. */
  partial: (t) => {
    const cubes: Cube[] = [];
    for (let x = 0; x < 2; x += 1) {
      for (let y = 0; y < 2; y += 1) {
        for (let z = 0; z < 2; z += 1) {
          if (x === 1 && y === 1 && z === 1) continue; // the missing corner
          cubes.push({
            x,
            y,
            z,
            accent: x === 1 && y === 1 && z === 0,
            style: anim("settle", 3.2, t),
          });
        }
      }
    }
    return { width: 110, cubes };
  },

  /** Two stacks, three grid steps apart — the same distance `delegating`'s
   *  courier travels — with one cube handed from the left stack to an open
   *  slot at the right. */
  handoff: (t) => {
    const cubes: Cube[] = [
      { x: 0, y: 0, style: anim("settle", 3, t) },
      { x: 3, y: 0, dashed: true },
    ];
    cubes.push({
      x: 0,
      y: 0,
      z: 1,
      boost: 100,
      accent: true,
      outer: anim("glide", 2.4, t, { alternate: true }),
    });
    return { width: 160, cubes };
  },

  /** One cube, dimmed and alone, settling slowly — nothing to show because
   *  nothing can be heard from. */
  offline: (t) => ({
    width: 60,
    cubes: [{ x: 0, y: 0, style: { ...anim("settle", 5, t), opacity: 0.55 } }],
  }),
};

export function sceneFor(state: Exclude<AgentState, "idle">, timing: Timing): Scene {
  return scenes[state](timing);
}
