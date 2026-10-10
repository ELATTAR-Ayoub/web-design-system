import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "agent-voice-orb",
  description: "The agent's face while voice is active: a dark glass orb that breathes, listens, thinks, speaks and sleeps.",
  dependencies: ["source-foundation"],
  exports: ["VoiceOrbState", "VoiceOrb"],
  sourcePath: "components/agent/parts/voice-orb.tsx",
};
