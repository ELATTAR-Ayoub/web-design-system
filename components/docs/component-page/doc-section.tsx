"use client";

/**
 * A documentation section that is closed until the reader opens it.
 *
 * The owner's call, and the reason is the reading experience: a component
 * page carried up to eleven sections in a column, and the reader who came for
 * the Preview scrolled through API tables, keyboard maps and responsive notes
 * to reach the next page. Now the Preview stands open and everything after it
 * is a heading the reader can open — the way a reference is read, not the way
 * a scroll of paper is.
 *
 * NATIVE `<details>`, not a React collapsible, for three reasons that all
 * matter on a documentation site:
 *
 * 1. The content is IN THE DOM while closed. Find-in-page reaches it and
 *    Chromium opens the section around a match; a fragment link to an id
 *    inside a closed section (`#api-props`) opens it too. A React collapsible
 *    that unmounts its content loses both, and one that keeps it mounted but
 *    `display: none` loses find-in-page.
 * 2. Keyboard and screen-reader behaviour come from the platform: the summary
 *    is a button with `aria-expanded`, Space and Enter toggle it, and nothing
 *    here has to be maintained.
 * 3. It renders correctly with JavaScript off, closed, which is the honest
 *    resting state.
 *
 * The section's own hash opens it: navigating to `#api` from the rail, the
 * anchor strip or a shared link should land on the content, not on a closed
 * heading the reader then has to click. `hashchange` and the initial hash are
 * both watched.
 *
 * Which sections stand open is `OPEN_BY_DEFAULT` in
 * `lib/ds/docs/section-order.ts` — installation, variants, sizes, examples,
 * usage — the chapters a reader wants first; the reference sections close.
 *
 * `Expand all` is a preference, stored per browser, read on mount. It exists
 * for the reader who wants the old single-scroll page — and for the browser
 * test suite, which sets it through an init script so nine spec files can
 * keep reaching into States and Examples without each opening the section
 * first. Both are the same DOM; the preference only changes the first frame.
 */

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { Icon } from "@/components/ui/icon";
import { OPEN_BY_DEFAULT } from "@/lib/ds/docs/section-order";
import { cn } from "@/lib/utils";

/** `localStorage` key for the reader's expand-all preference. */
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
    // A private window or blocked storage: the page still works, it just
    // will not remember.
  }
  window.dispatchEvent(new CustomEvent(SECTIONS_PREFERENCE_KEY, { detail: value }));
}

/**
 * What the page wants a section to be, from outside the section: the reader's
 * preference, or the URL naming this section. Read through
 * `useSyncExternalStore` so the first client render agrees with the server
 * (closed) and the real answer arrives without a setState-in-effect.
 */
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
  // The server answer is the default, so an open-by-default section is open
  // in the HTML itself and never flashes closed.
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
  // The reader's own click on the summary overrides the external answer —
  // until the external answer changes (a new hash, Expand/Collapse all), at
  // which point the override is stale and the section follows the page again.
  const [override, setOverride] = React.useState<{ external: boolean; open: boolean } | null>(null);
  const open = override && override.external === external ? override.open : external;

  return (
    /* `id` on the section, as every anchor in the rail and the strip expects.
       `scroll-padding-block-start` on `html` handles the header offset. */
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

/**
 * The strip's own control: one button that flips every section and remembers
 * the choice.
 */
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
