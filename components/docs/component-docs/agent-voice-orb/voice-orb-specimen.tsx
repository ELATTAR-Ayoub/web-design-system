"use client";

import * as React from "react";

import { VoiceOrb, type VoiceOrbState } from "@/components/agent/parts/voice-orb";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const VOICE_ORB_STATES: VoiceOrbState[] = ["idle", "listening", "thinking", "speaking", "asleep"];
const STATE_NAMES: Record<VoiceOrbState, string> = {
  idle: "Idle",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
  asleep: "Asleep",
};

export function VoiceOrbSpecimen({ initialState = "listening" }: { initialState?: VoiceOrbState }) {
  const [state, setState] = React.useState<VoiceOrbState>(initialState);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <VoiceOrb className="size-24" state={state} />
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={state}
        onValueChange={(v) => {
          if (v) setState(v as VoiceOrbState);
        }}
        aria-label="Voice state"
        className="flex-wrap"
      >
        {VOICE_ORB_STATES.map((s) => (
          <ToggleGroupItem key={s} value={s}>
            {STATE_NAMES[s]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
