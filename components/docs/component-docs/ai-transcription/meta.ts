/**
 * Documentation metadata for `ai-transcription`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-transcription",
  description:
    "A transcript rendered as clickable word segments that mark what has been said, what is being said and what is still to come against a playback time.",
  dependencies: ["source-foundation"],
  exports: ["TranscriptionProps","Transcription","TranscriptionSegmentProps","TranscriptionSegment"],
  sourcePath: "components/ai-elements/transcription.tsx",
};
