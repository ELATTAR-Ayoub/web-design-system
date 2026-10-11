"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type PopoverNaming = {
  titleId: string
  descriptionId: string
  hasTitle: boolean
  hasDescription: boolean
  setHasTitle: (v: boolean) => void
  setHasDescription: (v: boolean) => void
}

const PopoverNamingContext = React.createContext<PopoverNaming | null>(null)

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const id = React.useId()
  const [hasTitle, setHasTitle] = React.useState(false)
  const [hasDescription, setHasDescription] = React.useState(false)
  const naming = React.useMemo<PopoverNaming>(
    () => ({
      titleId: `${id}-title`,
      descriptionId: `${id}-description`,
      hasTitle,
      hasDescription,
      setHasTitle,
      setHasDescription,
    }),
    [id, hasTitle, hasDescription]
  )

  return (
    <PopoverNamingContext.Provider value={naming}>
      <PopoverPrimitive.Root data-slot="popover" {...props} />
    </PopoverNamingContext.Provider>
  )
}

function useRegisterPopoverPart(part: "title" | "description") {
  const naming = React.useContext(PopoverNamingContext)
  const setter = naming?.[part === "title" ? "setHasTitle" : "setHasDescription"]
  React.useEffect(() => {
    if (!setter) return
    setter(true)
    return () => setter(false)
  }, [setter])
  return naming?.[part === "title" ? "titleId" : "descriptionId"]
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const naming = React.useContext(PopoverNamingContext)
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        aria-labelledby={
          naming?.hasTitle && !props["aria-label"] ? naming.titleId : undefined
        }
        aria-describedby={
          naming?.hasDescription ? naming.descriptionId : undefined
        }
        className={cn(
          "z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 type-small text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden data-open:anim-open data-closed:anim-close",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-0.5 type-small", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, id, ...props }: React.ComponentProps<"h2">) {
  const titleId = useRegisterPopoverPart("title")
  return (
    <div
      data-slot="popover-title"
      id={id ?? titleId}
      className={cn("type-nav", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  id,
  ...props
}: React.ComponentProps<"p">) {
  const descriptionId = useRegisterPopoverPart("description")
  return (
    <p
      data-slot="popover-description"
      id={id ?? descriptionId}
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
