/**
 * Documentation metadata for `ai-voice-selector`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file. Family, ownership and delivery come from
 * `lib/ds/platform-contract.ts`.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-voice-selector",
  description:
    "A search dialog for choosing a text-to-speech voice, with rows that show name, gender, accent and age and a preview button for each.",
  dependencies: ["source-foundation"],
  exports: ["useVoiceSelector","VoiceSelectorProps","VoiceSelector","VoiceSelectorTriggerProps","VoiceSelectorTrigger","VoiceSelectorContentProps","VoiceSelectorContent","VoiceSelectorDialogProps","VoiceSelectorDialog","VoiceSelectorInputProps","VoiceSelectorInput","VoiceSelectorListProps","VoiceSelectorList","VoiceSelectorEmptyProps","VoiceSelectorEmpty","VoiceSelectorGroupProps","VoiceSelectorGroup","VoiceSelectorItemProps","VoiceSelectorItem","VoiceSelectorShortcutProps","VoiceSelectorShortcut","VoiceSelectorSeparatorProps","VoiceSelectorSeparator","VoiceSelectorGenderProps","VoiceSelectorGender","VoiceSelectorAccentProps","VoiceSelectorAccent","VoiceSelectorAgeProps","VoiceSelectorAge","VoiceSelectorNameProps","VoiceSelectorName","VoiceSelectorDescriptionProps","VoiceSelectorDescription","VoiceSelectorAttributesProps","VoiceSelectorAttributes","VoiceSelectorBulletProps","VoiceSelectorBullet","VoiceSelectorPreviewProps","VoiceSelectorPreview"],
  sourcePath: "components/ai-elements/voice-selector.tsx",
};
