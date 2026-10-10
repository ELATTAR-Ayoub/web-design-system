"use client";

import * as React from "react";

import {
  VoiceSelector,
  VoiceSelectorAccent,
  VoiceSelectorAge,
  VoiceSelectorAttributes,
  VoiceSelectorBullet,
  VoiceSelectorContent,
  VoiceSelectorDescription,
  VoiceSelectorEmpty,
  VoiceSelectorGender,
  VoiceSelectorGroup,
  VoiceSelectorInput,
  VoiceSelectorItem,
  VoiceSelectorList,
  VoiceSelectorName,
  VoiceSelectorPreview,
  VoiceSelectorTrigger,
} from "@/components/ai-elements/voice-selector";
import { Button } from "@/components/ui/button";

export const VOICES = [
  { id: "ada", name: "Ada", description: "Warm and clear", accent: "british", age: "30-40", gender: "female" },
  { id: "theo", name: "Theo", description: "Calm narrator", accent: "american", age: "40-50", gender: "male" },
  { id: "noor", name: "Noor", description: "Bright and quick", accent: "arabic", age: "20-30", gender: "non-binary" },
  { id: "mika", name: "Mika", description: "Soft and even", accent: "japanese", age: "20-30", gender: "female" },
] as const;

export function VoiceSelectorSpecimen({ withPreview = true }: { withPreview?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | undefined>("ada");
  const [playing, setPlaying] = React.useState<string | null>(null);
  const selected = VOICES.find((v) => v.id === value);

  return (
    <div className="flex items-center gap-3">
      <VoiceSelector onOpenChange={setOpen} onValueChange={setValue} open={open} value={value}>
        <VoiceSelectorTrigger asChild>
          <Button aria-label={`Voice: ${selected?.name ?? "none"}`} variant="outline">
            {selected?.name ?? "Choose a voice"}
          </Button>
        </VoiceSelectorTrigger>
        <VoiceSelectorContent title="Choose a voice">
          <VoiceSelectorInput placeholder="Search voices..." />
          <VoiceSelectorList>
            <VoiceSelectorEmpty>No voices found.</VoiceSelectorEmpty>
            <VoiceSelectorGroup heading="English and more">
              {VOICES.map((voice) => (
                <VoiceSelectorItem
                  key={voice.id}
                  onSelect={() => {
                    setValue(voice.id);
                    setOpen(false);
                  }}
                  value={`${voice.name} ${voice.description} ${voice.accent}`}
                >
                  {withPreview ? (
                    <VoiceSelectorPreview
                      onPlay={() => setPlaying((p) => (p === voice.id ? null : voice.id))}
                      playing={playing === voice.id}
                    />
                  ) : null}
                  <VoiceSelectorName>{voice.name}</VoiceSelectorName>
                  <VoiceSelectorDescription>{voice.description}</VoiceSelectorDescription>
                  <VoiceSelectorAttributes>
                    <VoiceSelectorBullet />
                    <VoiceSelectorAccent value={voice.accent} />
                    <VoiceSelectorBullet />
                    <VoiceSelectorAge>{voice.age}</VoiceSelectorAge>
                    <VoiceSelectorBullet />
                    <VoiceSelectorGender value={voice.gender} />
                  </VoiceSelectorAttributes>
                </VoiceSelectorItem>
              ))}
            </VoiceSelectorGroup>
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
      <p className="type-small text-muted-foreground" aria-live="polite">
        {selected ? `Reading aloud as ${selected.name}.` : "No voice chosen."}
      </p>
    </div>
  );
}

export function VoicePreviewStates() {
  return (
    <div className="flex items-center gap-4">
      <VoiceSelectorPreview />
      <VoiceSelectorPreview playing />
      <VoiceSelectorPreview loading />
    </div>
  );
}
