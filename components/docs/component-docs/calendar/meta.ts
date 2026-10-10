import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "calendar",
  description:
    "Calendar — a month grid for picking a single date, a range, or multiple dates, wrapping react-day-picker in the system's own button styling and keyboard focus ring.",
  dependencies: ["button", "source-foundation"],
  exports: ["Calendar", "CalendarDayButton"],
  sourcePath: "components/ui/calendar.tsx",
};
