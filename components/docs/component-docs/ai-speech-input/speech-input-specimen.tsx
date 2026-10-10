"use client";

import * as React from "react";

import { SpeechInput } from "@/components/ai-elements/speech-input";

const FIXED_TRANSCRIPT = "Remind me to send the invoice on Friday.";

export function SpeechInputSpecimen({
  disabled = false,
  compact = false,
  preferMediaRecorder = false,
}: {
  disabled?: boolean;
  compact?: boolean;
  preferMediaRecorder?: boolean;
}) {
  const [text, setText] = React.useState("");
  const [listening, setListening] = React.useState(false);

  return (
    <div className="flex flex-col items-start gap-3">
      <SpeechInput
        disabled={disabled}
        onAudioRecorded={async () => FIXED_TRANSCRIPT}
        onListeningChange={setListening}
        onTranscriptionChange={(next) => setText((prev) => (prev ? `${prev} ${next}` : next))}
        preferMediaRecorder={preferMediaRecorder}
        {...(compact ? { size: "icon-sm" as const } : {})}
      />
      <p className="type-small text-muted-foreground" aria-live="polite">
        {listening ? "Listening." : "Not listening."} {text ? `Heard: ${text}` : "Nothing heard yet."}
      </p>
    </div>
  );
}
