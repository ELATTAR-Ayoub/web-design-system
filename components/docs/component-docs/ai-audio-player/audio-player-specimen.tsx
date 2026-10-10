"use client";

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
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { SAMPLE_AUDIO_SRC } from "./audio-sample";

/**
 * Live specimens for the `ai-audio-player` documentation page. The source is a
 * one-second inline WAV, so nothing is fetched and nothing autoplays.
 */

/** The Preview: every control the part set offers. */
export function AudioPlayerPreview() {
  return (
    <Panel label="AudioPlayer" note="inline one-second tone">
      <div className="rounded-lg border bg-card p-2">
        <AudioPlayer>
          <AudioPlayerElement preload="metadata" src={SAMPLE_AUDIO_SRC} />
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
      </div>
    </Panel>
  );
}

/** The States grid: the compact composition the workspace uses for read-aloud. */
export function AudioPlayerStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="rest" note="paused at 0:00">
        <div className="w-full rounded-lg border bg-card p-2">
          <AudioPlayer>
            <AudioPlayerElement preload="metadata" src={SAMPLE_AUDIO_SRC} />
            <AudioPlayerControlBar>
              <AudioPlayerPlayButton />
              <AudioPlayerTimeDisplay />
              <AudioPlayerTimeRange />
              <AudioPlayerDurationDisplay />
              <AudioPlayerMuteButton />
            </AudioPlayerControlBar>
          </AudioPlayer>
        </div>
      </StateCell>
      <StateCell label="minimal" note="play and scrub only">
        <div className="w-full rounded-lg border bg-card p-2">
          <AudioPlayer>
            <AudioPlayerElement preload="metadata" src={SAMPLE_AUDIO_SRC} />
            <AudioPlayerControlBar>
              <AudioPlayerPlayButton />
              <AudioPlayerTimeRange />
            </AudioPlayerControlBar>
          </AudioPlayer>
        </div>
      </StateCell>
    </StateGrid>
  );
}
