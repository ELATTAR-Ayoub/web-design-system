import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "group/alert relative grid w-full gap-1 overflow-hidden rounded-lg border border-border bg-card px-4 py-3.5 text-left type-small text-card-foreground bloom-cosmic has-data-[slot=alert-action]:pr-20 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "*:[svg]:text-muted-foreground [--bloom-1:var(--color-action-bright)] [--bloom-2:var(--color-action)]",
        destructive:
          "*:[svg]:text-destructive-ink [--bloom-1:var(--destructive)] [--bloom-2:var(--color-destructive-lifted)]",
        success:
          "*:[svg]:text-success-ink [--bloom-1:var(--color-success)] [--bloom-2:var(--color-value)]",
        warning:
          "*:[svg]:text-warning-ink [--bloom-1:var(--color-warning)] [--bloom-2:var(--color-warning-deep)]",
        info: "*:[svg]:text-info-ink [--bloom-1:var(--color-info)] [--bloom-2:var(--color-info-deep)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const ASSERTIVE_VARIANTS = new Set(["destructive", "warning"])

function Alert({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role={ASSERTIVE_VARIANTS.has(variant ?? "default") ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <span data-slot="alert-stars" className="starfield" aria-hidden />
      {children}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "type-nav group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2 right-2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
