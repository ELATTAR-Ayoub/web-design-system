import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "voice",
  description:
    "The browser's speech synthesis module behind the workspace's read-aloud action, exposing no rendered surface of its own.",
  dependencies: [],
  exports: ["SpeechAdapter", "SpeechVoice", "speakableText", "useBrowserSpeech"],
  sourcePath: "components/agent/voice/speech.ts",
};
