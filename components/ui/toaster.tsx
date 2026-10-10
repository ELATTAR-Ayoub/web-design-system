"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

export const TOAST_ICONS = {
  success: CircleCheckIcon,
  info: InfoIcon,
  warning: TriangleAlertIcon,
  error: OctagonXIcon,
  loading: Loader2Icon,
} as const

export type ToastType = keyof typeof TOAST_ICONS | "default"

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      // resolvedTheme: follow the theme the document actually wears.
      theme={resolvedTheme === "light" ? "light" : "dark"}
      className="toaster group"
      icons={Object.fromEntries(
        Object.entries(TOAST_ICONS).map(([k, Icon]) => [
          k,
          <Icon key={k} className="size-4" />,
        ]),
      )}
      toastOptions={{
        // pointer-events-auto: an open modal sets pointer-events:none on body; keep toast actions pressable.
        classNames: { toast: "cn-toast bloom-cosmic pointer-events-auto" },
      }}
      {...props}
    />
  )
}

export { Toaster }
