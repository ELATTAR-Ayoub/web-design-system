/**
 * Documentation metadata for `calendar`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `calendar` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "calendar",
  description:
    "Calendar — a month grid for picking a single date, a range, or multiple dates, wrapping react-day-picker in the system's own button styling and keyboard focus ring.",
  dependencies: ["button", "source-foundation"],
  exports: ["Calendar", "CalendarDayButton"],
  sourcePath: "components/ui/calendar.tsx",
};
