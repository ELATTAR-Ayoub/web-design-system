import { anim, appear, drop, type Cube, type Timing } from "./cube";
import type { AgentState } from "../core/states";

export type Scene = { cubes: Cube[]; width: number };
type Generator = (timing: Timing) => Scene;

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

const W = 168;

const scenes: Record<Exclude<AgentState, "idle">, Generator> = {
  queued: (t) => ({
    width: 190,
    cubes: Array.from({ length: 5 }, (_, x) => ({
      x,
      y: 0,
      accent: x === 2,
      style: anim("bob", 2.2, t, { delay: x * 0.22 }),
    })),
  }),

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

  delegating: (t) => {
    const cubes: Cube[] = [];
    for (const base of [0, 4]) {
      for (let x = base; x < base + 2; x += 1) {
        for (let y = 0; y < 2; y += 1) {
          cubes.push({ x, y, style: anim("settle", 3, t, { delay: base ? 1.5 : 0 }) });
        }
      }
    }
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

  validating: (t) => {
    const cubes: Cube[] = [{ x: 1, y: 1 }];
    RING.forEach(([x, y], i) => {
      cubes.push({ x, y, accent: true, style: anim("blinkfade", 2, t, { delay: i * 0.25 }) });
    });
    return { width: W, cubes };
  },

  retrying: (t) => {
    const cubes: Cube[] = [];
    for (let x = 0; x < 2; x += 1) {
      for (let y = 0; y < 2; y += 1) cubes.push({ x, y });
    }
    cubes.push({ x: 0, y: 0, z: 1, boost: 100, accent: true, style: anim("bounce", 2, t) });
    return { width: 120, cubes };
  },

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

  summarizing: (t) => {
    const cubes: Cube[] = RING.map(([x, y], i) => ({ x, y, style: appear(4, i * 0.26, t) }));
    cubes.push({ x: 1, y: 1, accent: true, style: appear(4, 2.1, t) });
    return { width: W, cubes };
  },

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
            // Same duration and phase on both lifted layers, so they never intersect.
            ...(z === 0 ? {} : { style: anim(z === 1 ? "lift" : "lift2", 2.2, t) }),
          });
        }
      }
    }
    return { width: 150, cubes };
  },

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

  paused: (t) => {
    const cubes: Cube[] = [];
    for (const x of [0, 2]) {
      for (let z = 0; z < 3; z += 1) {
        cubes.push({ x, y: 0, z, style: anim("settle", 3.6, t) });
      }
    }
    return { width: 90, cubes };
  },

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

  partial: (t) => {
    const cubes: Cube[] = [];
    for (let x = 0; x < 2; x += 1) {
      for (let y = 0; y < 2; y += 1) {
        for (let z = 0; z < 2; z += 1) {
          if (x === 1 && y === 1 && z === 1) continue;
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

  offline: (t) => ({
    width: 60,
    cubes: [{ x: 0, y: 0, style: { ...anim("settle", 5, t), opacity: 0.55 } }],
  }),
};

export function sceneFor(state: Exclude<AgentState, "idle">, timing: Timing): Scene {
  return scenes[state](timing);
}
