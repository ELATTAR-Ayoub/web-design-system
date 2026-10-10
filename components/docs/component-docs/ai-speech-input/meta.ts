/**
 * Documentation metadata for `ai-speech-input`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-speech-input",
  description:
    "A single dictation button that records speech, through the browser recogniser or a recorder whose audio you transcribe, and reports the text.",
  dependencies: ["source-foundation"],
  exports: ["SpeechInputProps","SpeechInput"],
  sourcePath: "components/ai-elements/speech-input.tsx",
};
