"use client";

import { cn } from "@/lib/utils";

export function IconSwap({
  active,
  icons,
  className,
}: {
  active: string;
  icons: Record<string, React.ReactNode>;
  className?: string;
}) {
  const keys = Object.keys(icons);
  const activeIdx = Math.max(0, keys.indexOf(active));

  return (
    <span
      className={cn(
        "relative inline-grid place-items-center overflow-hidden",
        className,
      )}
    >
      {keys.map((key, i) => {
        const offset = i - activeIdx;
        const isActive = offset === 0;
        return (
          <span
            key={key}
            aria-hidden={!isActive}
            className={cn(
              "col-start-1 row-start-1 inline-flex items-center justify-center swap-roll",
              isActive ? "opacity-100" : "opacity-0",
            )}
            style={{ "--swap-offset": offset } as React.CSSProperties}
          >
            <span
              key={isActive ? `landed-${activeIdx}` : "waiting"}
              className={cn("inline-flex", isActive && "anim-change")}
              style={isActive ? { animationDelay: "var(--duration-fast)" } : undefined}
            >
              {icons[key]}
            </span>
          </span>
        );
      })}
    </span>
  );
}

