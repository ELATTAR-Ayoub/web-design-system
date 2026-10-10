/**
 * Documentation metadata for `voice`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `voice` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "voice",
  description:
    "The browser's speech synthesis module behind the workspace's read-aloud action, exposing no rendered surface of its own.",
  dependencies: [],
  exports: ["SpeechAdapter", "SpeechVoice", "speakableText", "useBrowserSpeech"],
  sourcePath: "components/agent/voice/speech.ts",
};
