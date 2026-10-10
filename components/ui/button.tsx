import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

const buttonVariants = cva(
  "group/button relative isolate inline-flex min-w-0 max-w-full shrink-0 items-center justify-center overflow-hidden rounded-pill border border-transparent bg-clip-padding font-medium whitespace-nowrap outline-none select-none press focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "sheen-action bg-primary text-primary-foreground shadow-btn-primary active:shadow-btn-down",
        premium:
          "foil-value font-semibold text-value-foreground shadow-btn-value hover:shadow-glow-value active:shadow-btn-down",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-accent aria-expanded:bg-accent",
        outline:
          "border-input bg-card text-foreground shadow-btn hover:bg-muted active:shadow-btn-down aria-expanded:bg-muted",
        ghost:
          "text-muted-foreground hover:bg-secondary hover:text-foreground active:bg-muted aria-expanded:bg-secondary aria-expanded:text-foreground",
        destructive:
          "border-destructive/25 bg-destructive/10 text-destructive-ink hover:border-destructive/40 hover:bg-destructive/20 focus-visible:border-destructive/50 focus-visible:ring-destructive/25",
        link: "text-action-ink underline-offset-4 hover:underline",
      },
      size: {
        xs: "min-h-6 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-8 gap-1.5 px-3.5 text-small [&_svg:not([class*='size-'])]:size-3.5",
        default: "min-h-10 gap-2 px-4 text-sm",
        lg: "min-h-12 gap-2.5 px-6 text-body",
        xl: "min-h-14 gap-2.5 px-8 text-base [&_svg:not([class*='size-'])]:size-5",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        icon: "size-10",
        "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-5",
      },
      emphasis: {
        none: "",
        caps: "text-number-sm font-semibold tracking-cta uppercase",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      emphasis: "none",
    },
  }
)

function ButtonLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="button-label"
      className={cn("min-w-0 truncate", className)}
      {...props}
    />
  )
}

function Button({
  className,
  variant = "default",
  size = "default",
  emphasis = "none",
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const nativeDisabled = asChild ? undefined : disabled || loading
  const content = asChild ? (
    children
  ) : (
    <>
      {loading && <Spinner aria-hidden />}
      {children}
    </>
  )

  const button = (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={nativeDisabled}
      className={cn(buttonVariants({ variant, size, emphasis, className }))}
      {...props}
    >
      {content}
    </Comp>
  )

  return button
}

export { Button, ButtonLabel, buttonVariants }
