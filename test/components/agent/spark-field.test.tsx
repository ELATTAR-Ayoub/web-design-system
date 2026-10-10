import * as React from "react";
import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  SparkField,
  SPAWN,
  TYPING,
  bumpTyping,
  decayTyping,
  drawSpark,
  spawnSpark,
  stepSpark,
  type SparkFieldHandle,
} from "@/components/agent/parts/spark-field";

const W = 300;
const H = 100;

describe("spawnSpark", () => {
  it("scatters across the box, with a head start in its life", () => {
    const s = spawnSpark(W, H, true, () => 0.5);
    expect(s.y).toBeCloseTo(H * 0.6);
    expect(s.life).toBeGreaterThan(0);
  });
  it("otherwise starts just below the bottom edge, newborn", () => {
    const s = spawnSpark(W, H, false, () => 0.5);
    expect(s.y).toBe(H + 3);
    expect(s.life).toBe(0);
  });
  it("keeps radius, rise and lifespan within their ranges", () => {
    const lo = spawnSpark(W, H, false, () => 0);
    const hi = spawnSpark(W, H, false, () => 0.999999);
    expect(lo.r).toBeCloseTo(0.9);
    expect(hi.r).toBeCloseTo(2.0, 1);
    expect(-lo.vy).toBeCloseTo(7);
    expect(-hi.vy).toBeCloseTo(16, 1);
    expect(lo.span).toBeCloseTo(2.4);
    expect(hi.span).toBeCloseTo(4.8, 1);
  });
});

describe("stepSpark", () => {
  it("rises, faster when the field is sped up", () => {
    const a = spawnSpark(W, H, false, () => 0.5);
    const b = { ...a };
    expect(stepSpark(a, 0.1, 1, W, H, Math.random)).toBe(true);
    stepSpark(b, 0.1, 3, W, H, Math.random);
    expect(a.y).toBeLessThan(H + 3);
    expect(b.y).toBeLessThan(a.y);
  });
  it("recycles at the top instead of leaving", () => {
    const s = { ...spawnSpark(W, H, false, () => 0.5), y: -3.9, life: 0 };
    expect(stepSpark(s, 0.05, 1, W, H, () => 0.5)).toBe(true);
    expect(s.y).toBe(H + 3);
    expect(s.x).toBe(W * 0.5);
  });
  it("expires once its life passes its span", () => {
    const s = { ...spawnSpark(W, H, false, () => 0.5), life: 0, span: 1 };
    expect(stepSpark(s, 0.9, 1, W, H, Math.random)).toBe(true);
    expect(stepSpark(s, 0.2, 1, W, H, Math.random)).toBe(false);
  });
});

describe("typing energy", () => {
  it("adds 0.22 per bump and caps at 1.6", () => {
    expect(bumpTyping(0)).toBeCloseTo(0.22);
    expect(bumpTyping(1.5)).toBe(1.6);
    expect(TYPING.CAP).toBe(1.6);
  });
  it("halves after the time constant times ln 2", () => {
    expect(decayTyping(1, TYPING.TIME_CONSTANT_S * Math.LN2)).toBeCloseTo(0.5);
    expect(decayTyping(1, 0)).toBe(1);
  });
  it("scatters 26 on arm and tops up to 30", () => {
    expect(SPAWN.SCATTERED).toBe(26);
    expect(SPAWN.MAX).toBe(30);
  });
});

describe("SparkField", () => {
  let raf: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
        unobserve() {}
      },
    );
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      setTransform() {},
      clearRect() {},
      beginPath() {},
      arc() {},
      fill() {},
    })) as never;
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    raf.mockRestore();
  });

  it("runs no loop while inactive and fades the tint out", () => {
    const { container } = render(<SparkField active={false} />);
    expect(raf).not.toHaveBeenCalled();
    const tint = container.querySelector("[data-slot=spark-tint]");
    expect(tint).toHaveClass("opacity-0");
    expect(tint).not.toHaveClass("opacity-100");
  });

  it("starts one loop when active and fades the tint in", () => {
    const { container } = render(<SparkField active />);
    expect(raf).toHaveBeenCalledTimes(1);
    expect(container.querySelector("[data-slot=spark-tint]")).toHaveClass("opacity-100");
    expect(container.querySelector("canvas")).toHaveAttribute("aria-hidden", "true");
  });

  it("accepts bump() through the ref", () => {
    const ref = React.createRef<SparkFieldHandle>();
    render(<SparkField active ref={ref} />);
    expect(() => act(() => ref.current?.bump())).not.toThrow();
  });
});

describe("drawSpark", () => {
  function stubCtx() {
    const arcs: number[] = [];
    const ctx = {
      globalAlpha: 1,
      beginPath() {},
      fill() {},
      arc(_x: number, _y: number, r: number) {
        arcs.push(r);
      },
    };
    return { ctx: ctx as unknown as CanvasRenderingContext2D, raw: ctx, arcs };
  }
  // phase pi/2 at now = 0 pins the twinkle wave to its crest whatever the energy,
  // so a change in radius can only come from the typing energy.
  const spark = (y: number) => ({
    x: 50,
    y,
    r: 2,
    vy: -10,
    sway: 0,
    phase: Math.PI / 2,
    life: 1,
    span: 2,
  });

  it("fades to nothing at the top and bottom edges", () => {
    const top = stubCtx();
    drawSpark(top.ctx, spark(0), 0, 0, H);
    expect(top.raw.globalAlpha).toBeCloseTo(0);
    const bottom = stubCtx();
    drawSpark(bottom.ctx, spark(H), 0, 0, H);
    expect(bottom.raw.globalAlpha).toBeCloseTo(0);
    const middle = stubCtx();
    drawSpark(middle.ctx, spark(H / 2), 0, 0, H);
    expect(middle.raw.globalAlpha).toBeGreaterThan(0.5);
  });

  it("draws larger sparks as typing energy rises", () => {
    const rest = stubCtx();
    const hot = stubCtx();
    drawSpark(rest.ctx, spark(H / 2), 0, 0, H);
    drawSpark(hot.ctx, spark(H / 2), 0, 1, H);
    expect(hot.arcs[0]).toBeGreaterThan(rest.arcs[0]);
    expect(hot.arcs[0]).toBeCloseTo(rest.arcs[0] * (1 + TYPING.SIZE_GAIN));
  });
});

describe("SparkField loop", () => {
  let frames: FrameRequestCallback[];
  let cancel: ReturnType<typeof vi.spyOn>;
  let disconnect: ReturnType<typeof vi.fn>;
  let ctx: { shadowBlur: number; arcCount: number; arcsPerFrame: number[] };

  beforeEach(() => {
    frames = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      frames.push(cb);
      return frames.length;
    });
    cancel = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect = disconnect;
        unobserve() {}
      },
    );
    vi.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: W,
      height: H,
      top: 0,
      left: 0,
      right: W,
      bottom: H,
      x: 0,
      y: 0,
      toJSON() {},
    });
    ctx = { shadowBlur: 0, arcCount: 0, arcsPerFrame: [] };
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      setTransform() {},
      clearRect() {
        ctx.arcsPerFrame.push(0);
      },
      beginPath() {},
      arc() {
        ctx.arcsPerFrame[ctx.arcsPerFrame.length - 1] += 1;
      },
      fill() {},
      set shadowBlur(v: number) {
        ctx.shadowBlur = v;
      },
      get shadowBlur() {
        return ctx.shadowBlur;
      },
    })) as never;
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  /** Run the pending frame callback at a time `ms` after the loop started. */
  const runFrame = (t: number) => {
    const cb = frames.pop();
    if (!cb) throw new Error("no frame was scheduled");
    act(() => cb(t));
  };

  it("makes the glow larger on the next frame after bump()", () => {
    const ref = React.createRef<SparkFieldHandle>();
    render(<SparkField active ref={ref} />);
    const t0 = performance.now();
    runFrame(t0 + 16);
    const before = ctx.shadowBlur;
    act(() => ref.current?.bump());
    runFrame(t0 + 32);
    expect(ctx.shadowBlur).toBeGreaterThan(before);
  });

  it("cancels the frame and disconnects the observer when it deactivates", () => {
    const { rerender } = render(<SparkField active />);
    expect(cancel).not.toHaveBeenCalled();
    rerender(<SparkField active={false} />);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("draws 26 sparks on the first frame after arming and never more than 30", () => {
    render(<SparkField active />);
    let t = performance.now();
    runFrame((t += 16));
    expect(ctx.arcsPerFrame[0]).toBe(SPAWN.SCATTERED);
    for (let i = 0; i < 300; i += 1) runFrame((t += 50));
    expect(Math.max(...ctx.arcsPerFrame)).toBeLessThanOrEqual(SPAWN.MAX);
  });
});
