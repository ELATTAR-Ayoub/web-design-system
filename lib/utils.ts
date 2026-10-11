import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Teaches tailwind-merge our text-* scale so sizes are not mistaken for colours.
const FONT_SIZES = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "lead",
  "body",
  "small",
  "nav",
  "badge",
  "cta",
  "code",
  "identifier",
  "number-sm",
  "number-base",
  "number-md",
  "number-lg",
  "number-xl",
] as const

// Same for shadow-*: custom elevation names must not be read as colours.
const SHADOWS = [
  "e1",
  "e2",
  "e3",
  "e4",
  "key",
  "key-down",
  "pressed",
  "btn",
  "btn-primary",
  "btn-value",
  "btn-down",
  "chip",
  "glow-action",
  "glow-value",
] as const

// Custom radius names get their own group so they merge with rounded-*.
const RADII = ["pill"] as const

export const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...FONT_SIZES] }],
      shadow: [{ shadow: [...SHADOWS] }],
      rounded: [{ rounded: [...RADII] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
