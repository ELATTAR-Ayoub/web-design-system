/**
 * Documentation metadata for `ai-mic-selector`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-mic-selector",
  description:
    "A searchable popover for choosing a microphone from the audio input devices the browser reports.",
  dependencies: ["source-foundation"],
  exports: ["useAudioDevices","MicSelectorProps","MicSelector","MicSelectorTriggerProps","MicSelectorTrigger","MicSelectorContentProps","MicSelectorContent","MicSelectorInputProps","MicSelectorInput","MicSelectorListProps","MicSelectorList","MicSelectorEmptyProps","MicSelectorEmpty","MicSelectorItemProps","MicSelectorItem","MicSelectorLabelProps","MicSelectorLabel","MicSelectorValueProps","MicSelectorValue"],
  sourcePath: "components/ai-elements/mic-selector.tsx",
};
