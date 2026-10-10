"use client";

import { useSyncExternalStore } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import {
  ActiveIndicator,
  useActiveIndicator,
} from "@/components/ui/active-indicator";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
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
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            data-state={active ? "on" : "off"}
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "press relative z-10 grid size-7 place-items-center rounded-pill transition-colors duration-fast ease-out",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
