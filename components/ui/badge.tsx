import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge type-badge inline-flex min-h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-pill border border-transparent px-2 py-0.5 whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-accent",
        destructive:
          "bg-destructive/12 text-destructive-ink focus-visible:ring-destructive/20 [a]:hover:bg-destructive/20",
        outline:
          "border-input text-muted-foreground [a]:hover:bg-accent [a]:hover:text-foreground",
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
        link: "text-action-ink underline-offset-4 hover:underline",
        action: "bg-action/12 text-action-ink",
        premium: "bg-value/12 text-value-ink",
        success: "bg-success/12 text-success-ink",
        warning: "bg-warning/12 text-warning-ink",
        info: "bg-info/12 text-info-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
