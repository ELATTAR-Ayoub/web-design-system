"use client";

import { SquareIcon, Volume2Icon } from "lucide-react";

import { speakableText, useBrowserSpeech } from "@/components/agent";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SAMPLE = "**Three sealed boxes** match. Want me to put the strongest one on hold?";

export function SpeechSpecimen() {
  const speech = useBrowserSpeech();

  if (!speech.isSupported) {
    return <p className="type-small text-muted-foreground">This browser cannot speak, so there is nothing to try here.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="type-body text-foreground">{speakableText(SAMPLE)}</p>
      <div className="flex flex-wrap items-center gap-3">
        {speech.voices.length > 0 ? (
          <Select value={speech.voiceId ?? undefined} onValueChange={speech.setVoiceId}>
            <SelectTrigger aria-label="Voice" className="min-w-0 flex-1 basis-60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {speech.voices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.label} ({voice.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        {speech.isSpeaking ? (
          <Button variant="outline" className="gap-2" onClick={speech.stop}>
            <Icon icon={SquareIcon} size="sm" tone="inherit" aria-hidden />
            Stop
          </Button>
        ) : (
          <Button className="gap-2" onClick={() => speech.speak(speakableText(SAMPLE))}>
            <Icon icon={Volume2Icon} size="sm" tone="inherit" aria-hidden />
            Speak
          </Button>
        )}
      </div>
    </div>
  );
}
