/**
 * Documentation metadata for `ai-audio-player`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-audio-player",
  description:
    "An audio player assembled from media-chrome controls, restyled as small system buttons and ranges, for playing back a clip such as a read-aloud reply.",
  dependencies: ["source-foundation"],
  exports: ["AudioPlayerProps","AudioPlayer","AudioPlayerElementProps","AudioPlayerElement","AudioPlayerControlBarProps","AudioPlayerControlBar","AudioPlayerPlayButtonProps","AudioPlayerPlayButton","AudioPlayerSeekBackwardButtonProps","AudioPlayerSeekBackwardButton","AudioPlayerSeekForwardButtonProps","AudioPlayerSeekForwardButton","AudioPlayerTimeDisplayProps","AudioPlayerTimeDisplay","AudioPlayerTimeRangeProps","AudioPlayerTimeRange","AudioPlayerDurationDisplayProps","AudioPlayerDurationDisplay","AudioPlayerMuteButtonProps","AudioPlayerMuteButton","AudioPlayerVolumeRangeProps","AudioPlayerVolumeRange"],
  sourcePath: "components/ai-elements/audio-player.tsx",
};
