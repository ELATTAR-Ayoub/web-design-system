/**
 * @covers ai-audio-player
 *
 * media-chrome is mocked (see below); this
 * proves the composition mounts, wires its slots, and takes its colours from
 * system tokens.
 */
import { render } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

// media-chrome's store attaches to a real HTMLMediaElement, which jsdom lacks.
// Mock the custom elements at the module boundary with plain elements that
// keep the props/children the wrappers pass through.
vi.mock("media-chrome/react", () => {
  const el = (tag: string) => {
    const Comp = ({ children, ...rest }: Record<string, unknown>) => {
      delete rest.seekOffset;
      delete rest.audio;
      return createElement(tag, rest, children as never);
    };
    return Comp;
  };
  return {
    MediaController: el("div"),
    MediaControlBar: el("div"),
    MediaPlayButton: el("button"),
    MediaSeekBackwardButton: el("button"),
    MediaSeekForwardButton: el("button"),
    MediaMuteButton: el("button"),
    MediaTimeDisplay: el("span"),
    MediaDurationDisplay: el("span"),
    MediaTimeRange: el("div"),
    MediaVolumeRange: el("div"),
  };
});

import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerDurationDisplay,
  AudioPlayerElement,
  AudioPlayerMuteButton,
  AudioPlayerPlayButton,
  AudioPlayerSeekBackwardButton,
  AudioPlayerSeekForwardButton,
  AudioPlayerTimeDisplay,
  AudioPlayerTimeRange,
  AudioPlayerVolumeRange,
} from "@/components/ai-elements/audio-player";

function Example({ remote = true }: { remote?: boolean }) {
  return (
    <AudioPlayer>
      {remote ? (
        <AudioPlayerElement src="https://example.com/a.mp3" />
      ) : (
        <AudioPlayerElement data={{ base64: "AAAA", mediaType: "audio/mpeg" } as never} />
      )}
      <AudioPlayerControlBar>
        <AudioPlayerPlayButton />
        <AudioPlayerSeekBackwardButton />
        <AudioPlayerSeekForwardButton />
        <AudioPlayerTimeDisplay />
        <AudioPlayerTimeRange />
        <AudioPlayerDurationDisplay />
        <AudioPlayerMuteButton />
        <AudioPlayerVolumeRange />
      </AudioPlayerControlBar>
    </AudioPlayer>
  );
}

describe("AudioPlayer", () => {
  it("mounts every control in its own slot", () => {
    render(<Example />);
    for (const slot of [
      "audio-player",
      "audio-player-element",
      "audio-player-control-bar",
      "audio-player-play-button",
      "audio-player-seek-backward-button",
      "audio-player-seek-forward-button",
      "audio-player-time-display",
      "audio-player-time-range",
      "audio-player-duration-display",
      "audio-player-mute-button",
      "audio-player-volume-range",
    ]) {
      expect(document.querySelector(`[data-slot="${slot}"]`), slot).not.toBeNull();
    }
  });

  it("plays a remote src, and builds a data URL from inline audio", () => {
    const remote = render(<Example />);
    expect(document.querySelector("audio")).toHaveAttribute("src", "https://example.com/a.mp3");
    remote.unmount();
    render(<Example remote={false} />);
    expect(document.querySelector("audio")).toHaveAttribute("src", "data:audio/mpeg;base64,AAAA");
  });

  it("toolbar buttons stay small; the ranges keep a usable hit height", () => {
    render(<Example />);
    for (const slot of [
      "audio-player-play-button",
      "audio-player-seek-backward-button",
      "audio-player-seek-forward-button",
      "audio-player-mute-button",
    ]) {
      const el = document.querySelector(`[data-slot="${slot}"]`);
      expect(el?.className, slot).not.toContain("size-target-min");
    }
    for (const slot of ["audio-player-time-range", "audio-player-volume-range"]) {
      expect(document.querySelector(`[data-slot="${slot}"]`)?.className, slot).toContain(
        "min-h-(--size-target-min)",
      );
    }
  });

  it("themes media-chrome from tokens and the type scale, never a pixel size", () => {
    render(<Example />);
    const style = (document.querySelector('[data-slot="audio-player"]') as HTMLElement).getAttribute("style") ?? "";
    expect(style).toContain("--media-primary-color");
    expect(style).toContain("var(--color-primary)");
    expect(style).toContain("var(--text-small)");
    expect(style).not.toMatch(/\d+px/);
  });
});
