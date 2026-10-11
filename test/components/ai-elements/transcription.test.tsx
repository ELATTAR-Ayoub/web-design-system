/**
 * @covers ai-transcription
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Transcription, TranscriptionSegment } from "@/components/ai-elements/transcription";

const segments = [
  { text: "Hello", startSecond: 0, endSecond: 1 },
  { text: "   ", startSecond: 1, endSecond: 2 },
  { text: "brave", startSecond: 2, endSecond: 3 },
  { text: "world", startSecond: 3, endSecond: 4 },
];

function Example({ currentTime, onSeek }: { currentTime: number; onSeek?: (t: number) => void }) {
  return (
    <Transcription currentTime={currentTime} onSeek={onSeek} segments={segments}>
      {(segment, index) => (
        <TranscriptionSegment index={index} key={index} segment={segment} />
      )}
    </Transcription>
  );
}

describe("Transcription", () => {
  it("skips blank segments and uses the body type role", () => {
    render(<Example currentTime={0} />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
    const root = document.querySelector('[data-slot="transcription"]');
    expect(root?.className).toContain("type-body");
    expect(root?.className).not.toMatch(/leading-relaxed|text-sm/);
  });

  it("marks active, past and upcoming segments with their own colour", () => {
    render(<Example currentTime={2.5} />);
    const hello = screen.getByRole("button", { name: "Hello" });
    const brave = screen.getByRole("button", { name: "brave" });
    const world = screen.getByRole("button", { name: "world" });
    expect(hello.className).toContain("text-muted-foreground");
    expect(hello).toHaveAttribute("data-active", "false");
    expect(brave).toHaveAttribute("data-active", "true");
    expect(brave.className).toContain("text-action-ink");
    expect(brave.className).not.toMatch(/\btext-primary\b/);
    expect(world.className).toContain("text-muted-foreground/60");
  });

  it("clicking a segment seeks to its start", async () => {
    const onSeek = vi.fn();
    render(<Example currentTime={0} onSeek={onSeek} />);
    await userEvent.setup().click(screen.getByText("world"));
    expect(onSeek).toHaveBeenCalledWith(3);
  });
});
