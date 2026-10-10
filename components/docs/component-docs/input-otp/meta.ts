import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "input-otp",
  description:
    "InputOTP — a row of single-character slots for a one-time passcode, with a blinking caret on the active slot and an optional separator between groups of digits.",
  dependencies: ["source-foundation"],
  exports: ["InputOTP", "InputOTPGroup", "InputOTPSeparator", "InputOTPSlot"],
  sourcePath: "components/ui/input-otp.tsx",
};
