"use client";

/**
 * Live companion for the `marker` Preview — see traps.md #29. "Pause" stops
 * the activity list and a real `Marker` appears between the rows to say so;
 * "Resume" removes it and appends a fresh row, the same shape the agent
 * console's stopped-stream example (in Examples, below) documents statically.
 */

import { useState } from "react";
import { PauseIcon, PlayIcon, SquareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";

const INITIAL_LOG = [
  { id: 1, text: "Opened Eclipse Vault — 3 rare cards", time: "09:41" },
];

export function ActivityLogShowcase() {
  const [log, setLog] = useState(INITIAL_LOG);
  const [paused, setPaused] = useState(false);

  function toggle() {
    if (!paused) {
      setPaused(true);
    } else {
      setPaused(false);
      setLog((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Resumed — sold 2 duplicates",
          time: "09:52",
        },
      ]);
    }
  }

  return (
    <div className="w-full max-w-md space-y-3">
      {log.map((entry) => (
        <div key={entry.id} className="rounded-lg border border-border bg-card px-4 py-3">
          <p className="type-body text-foreground">{entry.text}</p>
          <p className="type-small text-muted-foreground">{entry.time}</p>
        </div>
      ))}
      {paused && (
        <Marker variant="separator" className="anim-enter">
          <MarkerIcon>
            <Icon icon={SquareIcon} size="sm" tone="muted" />
          </MarkerIcon>
          <MarkerContent>Stopped by you</MarkerContent>
        </Marker>
      )}
      <Button variant="outline" onClick={toggle}>
        <Icon icon={paused ? PlayIcon : PauseIcon} size="sm" tone="inherit" />
        {paused ? "Resume" : "Pause"}
      </Button>
    </div>
  );
}
