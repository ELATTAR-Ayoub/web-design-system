import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid size-7 shrink-0 place-items-center rounded-md bg-action",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none">
        <path
          d="M6 15.5 12 6l6 9.5"
          stroke="var(--primary-foreground)"
          strokeWidth="2.4"
          strokeLinecap="square"
        />
        <path d="M6 19h12" stroke="var(--color-value-bright)" strokeWidth="2.4" />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  showMark = true,
}: {
  className?: string;
  showMark?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      {showMark && <LogoMark />}
      <span className="type-nav text-foreground">
        ELATTAR<span className="text-value-ink">.DS</span>
      </span>
    </span>
  );
}
