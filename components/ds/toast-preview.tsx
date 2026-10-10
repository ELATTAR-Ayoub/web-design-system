import { TOAST_ICONS, type ToastType } from "@/components/ui/toaster"

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

export function ToastPreviewStack({ children }: { children: React.ReactNode }) {
  return <ul className="flex list-none flex-col gap-4">{children}</ul>
}
