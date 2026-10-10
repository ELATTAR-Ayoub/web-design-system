import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"
import { Icon } from "@/components/ui/icon"

function Spinner({
  className,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  ...props
}: React.ComponentProps<"span">) {
  const decorative = ariaHidden === true || ariaHidden === "true"
  const label = ariaLabel ?? "Loading"

  return (
    <span
      data-slot="spinner"
      role={decorative ? undefined : "status"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center",
        className,
      )}
      {...props}
    >
      <Icon icon={Loader2Icon} className="size-full anim-spin" />
      {!decorative && <span className="sr-only">{label}</span>}
    </span>
  )
}

export { Spinner }
