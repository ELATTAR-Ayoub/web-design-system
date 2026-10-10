/**
 * Documentation metadata for `agent-voice-orb`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "agent-voice-orb",
  description: "The agent's face while voice is active: listening fades a solid disc, thinking turns an arc, speaking blinks three bars.",
  dependencies: ["source-foundation"],
  exports: ["VoiceOrbState", "VoiceOrb"],
  sourcePath: "components/agent/parts/voice-orb.tsx",
};
