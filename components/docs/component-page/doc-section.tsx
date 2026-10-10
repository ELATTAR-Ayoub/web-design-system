"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { Icon } from "@/components/ui/icon";
import { OPEN_BY_DEFAULT } from "@/lib/ds/docs/section-order";
import { cn } from "@/lib/utils";

export const SECTIONS_PREFERENCE_KEY = "ds:doc-sections";

export function readSectionsPreference(): "open" | "closed" {
  try {
    return window.localStorage.getItem(SECTIONS_PREFERENCE_KEY) === "open" ? "open" : "closed";
  } catch {
    return "closed";
  }
}

export function writeSectionsPreference(value: "open" | "closed") {
  try {
    window.localStorage.setItem(SECTIONS_PREFERENCE_KEY, value);
  } catch {
    // Storage can be blocked; the page still works without it.
  }
  window.dispatchEvent(new CustomEvent(SECTIONS_PREFERENCE_KEY, { detail: value }));
}

function useExternalOpen(id: string) {
  const subscribe = React.useCallback((onChange: () => void) => {
    window.addEventListener("hashchange", onChange);
    window.addEventListener(SECTIONS_PREFERENCE_KEY, onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
      window.removeEventListener(SECTIONS_PREFERENCE_KEY, onChange);
    };
  }, []);
  const byDefault = OPEN_BY_DEFAULT.has(id);
  const getSnapshot = React.useCallback(
    () => byDefault || readSectionsPreference() === "open" || window.location.hash === `#${id}`,
    [id, byDefault],
  );
  return React.useSyncExternalStore(subscribe, getSnapshot, () => byDefault);
}

export function CollapsibleDocSection({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const external = useExternalOpen(id);
  const [override, setOverride] = React.useState<{ external: boolean; open: boolean } | null>(null);
  const open = override && override.external === external ? override.open : external;

  return (
    <section id={id} className={cn("mb-10", className)}>
      <details
        open={open}
        onToggle={(event) =>
          setOverride({ external, open: (event.currentTarget as HTMLDetailsElement).open })
        }
        className="group/section"
        data-slot="doc-section"
      >
        <summary
          className={cn(
            "flex cursor-pointer list-none items-start gap-3 rounded-lg py-2 outline-none select-none",
            "[&::-webkit-details-marker]:hidden",
            "focus-visible:ring-3 focus-visible:ring-ring/50",
          )}
        >
          <Icon
            icon={ChevronRight}
            size="sm"
            tone="muted"
            className="mt-1.5 shrink-0 transition-transform duration-fast ease-standard group-open/section:rotate-90"
          />
          <span className="min-w-0">
            <h2 className="type-h3 text-foreground">{title}</h2>
            {description && (
              <p className="type-small mt-2 max-w-2xl text-muted-foreground">{description}</p>
            )}
          </span>
        </summary>
        <div className="mt-4 pl-7">{children}</div>
      </details>
    </section>
  );
}

export function ExpandAllToggle() {
  const value = React.useSyncExternalStore(
    (onChange) => {
      window.addEventListener(SECTIONS_PREFERENCE_KEY, onChange);
      return () => window.removeEventListener(SECTIONS_PREFERENCE_KEY, onChange);
    },
    readSectionsPreference,
    () => "closed" as const,
  );
  const next = value === "open" ? "closed" : "open";
  return (
    <button
      type="button"
      onClick={() => writeSectionsPreference(next)}
      aria-pressed={value === "open"}
      className="type-nav rounded-pill border border-border px-3 py-1.5 whitespace-nowrap text-muted-foreground transition-colors duration-fast ease-standard hover:border-input hover:text-foreground"
    >
      {value === "open" ? "Collapse all" : "Expand all"}
    </button>
  );
}
