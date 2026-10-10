import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export const ICON_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
} as const;

export type IconSize = keyof typeof ICON_SIZES;

export const ICON_TONES = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  subtle: "text-muted-foreground",
  action: "text-action-ink",
  value: "text-value-ink",
  success: "text-success-ink",
  warning: "text-warning-ink",
  info: "text-info-ink",
  error: "text-destructive-ink",
  inherit: "text-current",
} as const;

export type IconTone = keyof typeof ICON_TONES;

type IconProps = {
  icon: LucideIcon;
  size?: IconSize;
  tone?: IconTone;
  label?: string;
  className?: string;
} & Omit<
  React.SVGProps<SVGSVGElement>,
  "ref" | "width" | "height" | "className"
>;

export function Icon({
  icon: Glyph,
  size = "md",
  tone = "inherit",
  label,
  className,
  ...rest
}: IconProps) {
  const px = ICON_SIZES[size];
  return (
    <Glyph
      width={px}
      height={px}
      // Stroke scales with the box so optical weight holds across sizes.
      strokeWidth={(2 * 24) / px > 2.6 ? 2.4 : (2 * 24) / px < 1.5 ? 1.6 : 2}
      className={cn("shrink-0", ICON_TONES[tone], className)}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
      // Last, so caller props override the defaults.
      {...rest}
    />
  );
}
