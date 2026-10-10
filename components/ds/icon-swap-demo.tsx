"use client";

import { useState } from "react";
import { Heart, LayoutGrid, Pause, Play, Rows3, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IconSwap } from "@/components/ui/icon-swap";

export function ViewSwitchDemo() {
  const [view, setView] = useState<"grid" | "list">("grid");
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        aria-label={view === "grid" ? "Switch to list view" : "Switch to grid view"}
        aria-pressed={view === "list"}
        onClick={() => setView((v) => (v === "grid" ? "list" : "grid"))}
      >
        <IconSwap
          active={view}
          icons={{
            grid: <Icon icon={LayoutGrid} size="md" tone="inherit" />,
            list: <Icon icon={Rows3} size="md" tone="inherit" />,
          }}
          className="size-5"
        />
      </Button>
      <span className="type-small text-muted-foreground">View · {view}</span>
    </div>
  );
}

export function PlayPauseDemo() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        size="icon-lg"
        aria-label={playing ? "Pause" : "Play"}
        onClick={() => setPlaying((p) => !p)}
      >
        <IconSwap
          active={playing ? "pause" : "play"}
          icons={{
            play: <Icon icon={Play} size="lg" tone="inherit" />,
            pause: <Icon icon={Pause} size="lg" tone="inherit" />,
          }}
          className="size-6"
        />
      </Button>
      <span className="type-small text-muted-foreground">{playing ? "Playing" : "Paused"}</span>
    </div>
  );
}

export function FavouriteDemo() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant="secondary"
        size="icon"
        aria-label={on ? "Remove from favourites" : "Add to favourites"}
        aria-pressed={on}
        onClick={() => setOn((v) => !v)}
      >
        <IconSwap
          active={on ? "on" : "off"}
          icons={{
            off: <Icon icon={Heart} size="md" tone="subtle" />,
            on: <Icon icon={Heart} size="md" tone="value" className="fill-value-ink" />,
          }}
          className="size-5"
        />
      </Button>
      <span className="type-small text-muted-foreground">{on ? "Favourited" : "Not favourited"}</span>
    </div>
  );
}

export function MuteDemo() {
  const [muted, setMuted] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        aria-label={muted ? "Unmute" : "Mute"}
        aria-pressed={muted}
        onClick={() => setMuted((m) => !m)}
      >
        <IconSwap
          active={muted ? "muted" : "on"}
          icons={{
            on: <Icon icon={Volume2} size="md" tone="inherit" />,
            muted: <Icon icon={VolumeX} size="md" tone="inherit" />,
          }}
          className="size-5"
        />
      </Button>
      <span className="type-small text-muted-foreground">{muted ? "Muted" : "Sound on"}</span>
    </div>
  );
}
