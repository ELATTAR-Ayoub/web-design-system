import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EffortSlider, THUMB_HALF_PX, indexFromOffset, isMaxEffort } from "@/components/agent/parts/effort-slider";

const LEVELS = ["Low", "Medium", "High", "Max"];

function setup(value = "Low") {
  const onValueChange = vi.fn();
  const onEscape = vi.fn();
  const view = render(<EffortSlider efforts={LEVELS} value={value} onValueChange={onValueChange} onEscape={onEscape} />);
  return { onValueChange, onEscape, slider: screen.getByRole("slider", { name: "Effort" }), view };
}

describe("EffortSlider", () => {
  it.each(LEVELS.map((level, i) => [level, i] as const))("exposes %s as index %i", (level, i) => {
    const { slider } = setup(level);
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "3");
    expect(slider).toHaveAttribute("aria-valuenow", String(i));
    expect(slider).toHaveAttribute("aria-valuetext", level);
  });

  it("steps with arrows, jumps with Home and End, and clamps at the ends", () => {
    const { slider, onValueChange } = setup("Medium");
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenLastCalledWith("High");
    fireEvent.keyDown(slider, { key: "ArrowUp" });
    expect(onValueChange).toHaveBeenLastCalledWith("High");
    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(onValueChange).toHaveBeenLastCalledWith("Low");
    fireEvent.keyDown(slider, { key: "ArrowDown" });
    expect(onValueChange).toHaveBeenLastCalledWith("Low");
    fireEvent.keyDown(slider, { key: "Home" });
    expect(onValueChange).toHaveBeenLastCalledWith("Low");
    fireEvent.keyDown(slider, { key: "End" });
    expect(onValueChange).toHaveBeenLastCalledWith("Max");
  });

  it("does not report a change when already at the end", () => {
    const { slider, onValueChange } = setup("Max");
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    fireEvent.keyDown(slider, { key: "End" });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("calls onEscape on Escape", () => {
    const { slider, onEscape } = setup();
    fireEvent.keyDown(slider, { key: "Escape" });
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("snaps a press at the far right to the last level and the far left to the first", () => {
    const { slider, onValueChange } = setup("Medium");
    slider.getBoundingClientRect = () => ({ left: 0, width: 200 }) as DOMRect;
    fireEvent.pointerDown(slider, { clientX: 200, button: 0, pointerId: 1 });
    expect(onValueChange).toHaveBeenLastCalledWith("Max");
    fireEvent.pointerDown(slider, { clientX: 0, button: 0, pointerId: 1 });
    expect(onValueChange).toHaveBeenLastCalledWith("Low");
  });

  it("follows a drag only while the primary button is held", () => {
    const { slider, onValueChange } = setup("Low");
    slider.getBoundingClientRect = () => ({ left: 0, width: 200 }) as DOMRect;
    fireEvent.pointerMove(slider, { clientX: 200, buttons: 0 });
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.pointerMove(slider, { clientX: 200, buttons: 1 });
    expect(onValueChange).toHaveBeenLastCalledWith("Max");
  });

  it("marks data-max only at the last level", () => {
    const { view } = setup("High");
    const root = () => view.container.querySelector("[data-slot=effort-slider]")!;
    expect(root()).not.toHaveAttribute("data-max");
    view.rerender(<EffortSlider efforts={LEVELS} value="Max" onValueChange={() => {}} />);
    expect(root()).toHaveAttribute("data-max");
  });

  it("fills the whole track at the last level", () => {
    const { view } = setup("Max");
    expect((view.container.querySelector("[data-slot=effort-fill]") as HTMLElement).style.width).toBe("100%");
  });
});

describe("indexFromOffset / isMaxEffort", () => {
  it("maps the inset track onto level indexes", () => {
    expect(indexFromOffset(THUMB_HALF_PX, 200, 4)).toBe(0);
    expect(indexFromOffset(200 - THUMB_HALF_PX, 200, 4)).toBe(3);
    expect(indexFromOffset(100, 200, 4)).toBe(2);
  });
  it("is armed only on the last of several levels", () => {
    expect(isMaxEffort(LEVELS, "Max")).toBe(true);
    expect(isMaxEffort(LEVELS, "High")).toBe(false);
    expect(isMaxEffort(["Only"], "Only")).toBe(false);
    expect(isMaxEffort(LEVELS, undefined)).toBe(false);
  });
});
