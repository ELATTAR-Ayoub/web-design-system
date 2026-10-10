import { TOAST_ICONS, type ToastType } from "@/components/ui/toaster"

/**
 * A toast, rendered where you can look at it.
 *
 * A live toast is on screen for four seconds in the corner of the viewport,
 * which is a terrible way to judge one. This renders the *same* markup sonner
 * produces — `[data-icon]`, `[data-content]`, `[data-title]`,
 * `[data-description]`, `[data-button]` inside `.cn-toast` — minus the
 * `data-sonner-toast` attribute that carries sonner's fixed positioning and
 * enter animation.
 *
 * Because every visual rule lives in the `.cn-toast` block in `globals.css` and
 * nothing lives in sonner's stylesheet, the preview and the real toast are the
 * same object. Change a value there and both move; there is nothing here to keep
 * in sync.
 */
export function ToastPreview({
  type = "default",
  title,
  description,
  action,
}: {
  type?: ToastType
  title: string
  description?: string
  action?: string
}) {
  const Icon = type === "default" ? null : TOAST_ICONS[type]

  return (
    <li className="cn-toast bloom-cosmic" data-type={type}>
      {Icon && (
        <div data-icon="">
          <Icon className={type === "loading" ? "size-4 anim-spin" : "size-4"} />
        </div>
      )}
      <div data-content="">
        <div data-title="">{title}</div>
        {description && <div data-description="">{description}</div>}
      </div>
      {action && (
        <button type="button" data-button="">
          {action}
        </button>
      )}
    </li>
  )
}

/** The stack the previews sit in. A `<li>` needs a list to be valid. */
export function ToastPreviewStack({ children }: { children: React.ReactNode }) {
  return <ul className="flex list-none flex-col gap-4">{children}</ul>
}
