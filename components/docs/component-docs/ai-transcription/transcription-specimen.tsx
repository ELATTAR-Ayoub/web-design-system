"use client";

/**
 * Live specimens for the `ai-transcription` page. There is no audio: the
 * playback time is a number the buttons move, which is all `Transcription`
 * reads. Nothing runs on a timer.
 */

import * as React from "react";
import { RewindIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react";

import { Transcription, TranscriptionSegment } from "@/components/ai-elements/transcription";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export const SEGMENTS = [
  { text: "The", startSecond: 0, endSecond: 0.6 },
  { text: "quarterly", startSecond: 0.6, endSecond: 1.4 },
  { text: "numbers", startSecond: 1.4, endSecond: 2.1 },
  { text: "came", startSecond: 2.1, endSecond: 2.6 },
  { text: "in", startSecond: 2.6, endSecond: 2.9 },
  { text: "above", startSecond: 2.9, endSecond: 3.6 },
  { text: "forecast", startSecond: 3.6, endSecond: 4.5 },
];

const END = 4.5;

export function TranscriptionSpecimen({
  initialTime = 2.2,
  seekable = true,
}: {
  initialTime?: number;
  seekable?: boolean;
}) {
  const [time, setTime] = React.useState(initialTime);
  const step = (delta: number) => setTime((t) => Math.min(END, Math.max(0, +(t + delta).toFixed(1))));

  return (
    <div className="flex flex-col gap-4">
      <Transcription
        currentTime={time}
        onSeek={seekable ? setTime : undefined}
        segments={SEGMENTS}
      >
        {(segment, index) => <TranscriptionSegment index={index} key={`${segment.startSecond}-${index}`} segment={segment} />}
      </Transcription>
      <div className="flex items-center gap-2">
        <Button aria-label="Back to the start" onClick={() => setTime(0)} size="icon" variant="outline">
          <Icon icon={RewindIcon} size="md" />
        </Button>
        <Button aria-label="Back one second" onClick={() => step(-1)} size="icon" variant="outline">
          <Icon icon={SkipBackIcon} size="md" />
        </Button>
        <Button aria-label="Forward one second" onClick={() => step(1)} size="icon" variant="outline">
          <Icon icon={SkipForwardIcon} size="md" />
        </Button>
        <span className="type-small text-muted-foreground tabular-nums" aria-live="polite">
          {time.toFixed(1)} s
        </span>
      </div>
    </div>
  );
}
