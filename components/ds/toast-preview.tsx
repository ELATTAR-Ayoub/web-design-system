import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
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
  const glyph = type === "default" ? null : TOAST_ICONS[type]

  return (
    <li className="cn-toast bloom-cosmic" data-type={type}>
      {glyph && (
        <div data-icon="">
          <Icon icon={glyph} size="md" tone="inherit" className={type === "loading" ? "anim-spin" : undefined} />
        </div>
      )}
      <div data-content="">
        <div data-title="">{title}</div>
        {description && <div data-description="">{description}</div>}
      </div>
      {action && (
        <Button type="button" variant="secondary" size="sm" data-button="">
          {action}
        </Button>
      )}
    </li>
  )
}

export function ToastPreviewStack({ children }: { children: React.ReactNode }) {
  return <ul className="flex list-none flex-col gap-4">{children}</ul>
}
