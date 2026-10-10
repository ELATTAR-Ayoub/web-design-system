/**
 * A live specimen for `useIsMobile`.
 *
 * **It calls the hook.** An earlier version of this page reported the viewport
 * with a CSS `md:` variant instead — the right threshold, the right words, and
 * a specimen that would keep reading "Desktop viewport" if `useIsMobile` were
 * deleted. A documentation page for a hook has to prove the hook works, not
 * that Tailwind's breakpoints do.
 *
 * It lives beside `page.tsx` rather than inside it because a spec module must
 * stay plain data — `scripts/validate-docs.mjs` fails any
 * `component-docs/<name>/page.tsx` carrying a `"use client"` directive, since the
 * route imports the spec on the server. `form/account-form-specimen.tsx` set
 * the pattern.
 *
 * State model:
 * rest — the only state. The hook subscribes to `matchMedia` and re-renders on
 * change, so resizing the window past 768px flips the readout live.
 * hover · focus-visible · pressed · loading · success · error · disabled —
 * N/A, nothing here is interactive. empty — N/A; the hook always answers.
 */

"use client";

import { useSyncExternalStore } from "react";

import { Panel } from "@/components/ds/kit";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * Hydration state, read as an external store rather than set from an effect.
 *
 * The server has no viewport, so `useIsMobile` returns its server snapshot
 * (`false`) on the first render and the truth on the second. Printing the
 * measured width beside the verdict before hydration would be a number the
 * server invented. Same approach `ThemeToggle` takes.
 */
const NEVER_CHANGES = () => () => {};
const ON_CLIENT = () => true;
const ON_SERVER = () => false;

export function ViewportReport() {
  const isMobile = useIsMobile();
  const mounted = useSyncExternalStore(NEVER_CHANGES, ON_CLIENT, ON_SERVER);

  return (
    <Panel label="useIsMobile()" note={mounted ? String(isMobile) : "—"}>
      <div className="flex flex-col gap-3">
        <p
          className={cn(
            "type-h4",
            mounted && isMobile ? "text-action-ink" : "text-foreground",
          )}
        >
          {!mounted
            ? "Reading the viewport…"
            : isMobile
              ? "Mobile viewport"
              : "Desktop viewport"}
        </p>
        <p className="type-small text-muted-foreground">
          Narrow the window past 768px and this flips without a reload — the hook
          subscribes to <code className="type-code">matchMedia</code> rather than
          measuring once. Before hydration it reads its server snapshot, which is
          always desktop, so a phone sees one frame of the wrong answer and then
          the right one. That is the trade for not guessing a width on the
          server.
        </p>
      </div>
    </Panel>
  );
}
