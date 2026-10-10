import { cn } from "@/lib/utils"

function Skeleton({
  className,
  as: Tag = "div",
  ...props
}: React.ComponentProps<"div"> & { as?: "div" | "span" }) {
  return (
    <Tag
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "anim-shimmer rounded-md",
        Tag === "span" && "inline-block",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
