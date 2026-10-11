"use client";

import { useSyncExternalStore } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  ActiveIndicator,
  useActiveIndicator,
} from "@/components/ui/active-indicator";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", glyph: SunIcon },
  { value: "system", label: "System", glyph: MonitorIcon },
  { value: "dark", label: "Dark", glyph: MoonIcon },
] as const;

const NEVER_CHANGES = () => () => {};
const ON_CLIENT = () => true;
const ON_SERVER = () => false;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(NEVER_CHANGES, ON_CLIENT, ON_SERVER);
  const { containerRef, indicatorRef, arrivalRef } = useActiveIndicator();

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Colour theme"
      className={cn(
        "relative inline-flex items-center gap-px rounded-pill border border-border bg-muted p-0.5",
        className,
      )}
    >
      <ActiveIndicator
        indicatorRef={indicatorRef}
        arrivalRef={arrivalRef}
        className="block size-full rounded-pill bg-card shadow-e1"
      />
      {OPTIONS.map(({ value, label, glyph }) => {
        const active = mounted && theme === value;
        return (
          <Button
            key={value}
            type="button"
            variant="ghost"
            size="icon-xs"
            role="radio"
            data-state={active ? "on" : "off"}
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "relative z-10 size-7 bg-transparent transition-colors duration-fast ease-enter hover:bg-transparent active:bg-transparent",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon icon={glyph} size="sm" tone="inherit" />
          </Button>
        );
      })}
    </div>
  );
}
