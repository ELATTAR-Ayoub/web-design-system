"use client";

import { useSyncExternalStore } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import {
  ActiveIndicator,
  useActiveIndicator,
} from "@/components/ui/active-indicator";
import { cn } from "@/lib/utils";

/**
 * Light · System · Dark, as a three-way segmented control.
 *
 * A two-way switch would have been smaller, but it cannot express "follow the
 * OS" — and a system that ships two themes and no way to defer to the platform
 * is making a decision on the user's behalf that is not its to make.
 *
 * The control is `role="radiogroup"` rather than three buttons, because these
 * are three values of one setting. Arrow keys move between them for free.
 *
 * **The selection travels, because §4 says it must.** This shipped for a long
 * time with each option owning `bg-card shadow-e1` when checked — one blinking
 * on as another blinked off, which is the exact pattern RULES §4 names and
 * forbids for "anything like `Tabs` and `ToggleGroup` you add later". It went
 * unnoticed because no guard can see it: every class is a token, the ARIA is
 * correct, and the control is only three icons wide. It is also on every page
 * in the system, so it was the most-seen counter-example to its own rule.
 *
 * `useActiveIndicator` watches `data-state`, which Radix writes for free and
 * this control writes by hand — the options carry `data-state="on" | "off"` for
 * no other reason. The options themselves paint no background at all; `relative
 * z-10` lifts their glyphs above the pill that slides underneath.
 *
 * Before hydration no option is checked, so the pill measures nothing and holds
 * `opacity: 0`. It then appears in place rather than flying in from the left,
 * because `useActiveIndicator` suppresses the transition on its first move.
 */

const OPTIONS = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
] as const;

/**
 * Hydration state, read as an external store rather than set from an effect.
 *
 * The server has no idea which theme this browser will resolve to, so the first
 * client render must match the server's — otherwise React reports a hydration
 * mismatch and, worse, the control flashes the wrong selection for a frame.
 *
 * The obvious spelling is `useState(false)` plus `useEffect(() => setMounted(true))`,
 * which is a render, an effect and a second render to learn something React
 * already knows. `useSyncExternalStore` asks it directly: the server snapshot is
 * false, the client snapshot is true, and there is nothing to subscribe to
 * because the answer never changes again. Same approach `useIsMobile` takes.
 */
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
              // No background of its own — the pill supplies it, and `z-10`
              // keeps the glyph above it.
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
