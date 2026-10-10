"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PageContainer } from "@/components/docs/layout/page-container";
import { cn } from "@/lib/utils";

/**
 * A strip above the header — a release, a maintenance window, a deadline.
 *
 * **The dismissal is honest about what it can and cannot know, and that shapes
 * the whole component.** Whether a reader has dismissed this bar lives in their
 * browser, and the server has no access to it. There are two ways to handle
 * that and only one of them is defensible:
 *
 * - Render nothing until the client has read storage. Everybody — including the
 *   majority who never dismissed anything — gets a layout shift as the bar
 *   drops in after hydration.
 * - Render the bar, and hide it on hydration for the minority who dismissed it.
 *   Those readers see it flash. Nobody else sees anything move.
 *
 * **The second is chosen deliberately**, and it is why `getServerSnapshot`
 * returns "not dismissed". A flash for the few beats a shift for everyone, and
 * a shift at the top of the document pushes the whole page down while somebody
 * is reading it. `useSyncExternalStore` keeps the two renders in agreement, so
 * there is no hydration error either way.
 *
 * **Persistence is opt-in.** Without `storageKey` the dismissal lasts for the
 * page load and nothing is written to storage — which is the right default for
 * a bar that says something time-limited, and the only behaviour that has no
 * flash at all.
 *
 * **The dismiss control stays 40px.** §7 puts the floor for an icon-only
 * control at 40px and names the system's own deliberate exception to the 44px
 * target there. A negative block margin keeps it from forcing a taller bar —
 * and it is worth being exact about what that does, because the rule is easy to
 * misread: **a margin cannot enlarge a hit area.** It changes the space the
 * control takes in the layout, never the box that receives the pointer. The
 * target here is the button's own 40px.
 *
 * State model:
 * rest — present. hover · focus-visible · pressed — the dismiss `Button`'s own,
 * including `press`; no second press utility, which on a Button is a
 * double bounce. loading · success · error — N/A, dismissing is synchronous and
 * a `localStorage` write that fails (private mode, quota) is caught and
 * ignored: the bar still closes for this page load, which is what the reader
 * asked for. **disabled — N/A; a bar that cannot be dismissed simply omits
 * `dismissible`.** empty — N/A, `children` is the message and is required.
 */

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  // Another tab dismissing it should dismiss it here too.
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function AnnouncementBar({
  children,
  action,
  dismissible = true,
  storageKey,
  dismissLabel = "Dismiss announcement",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** A link or button. Composed, not configured. */
  action?: React.ReactNode;
  dismissible?: boolean;
  /** Opt in to remembering the dismissal. Read the note above first. */
  storageKey?: string;
  dismissLabel?: string;
}) {
  const [closedThisLoad, setClosedThisLoad] = React.useState(false);

  const getSnapshot = React.useCallback(() => {
    if (!storageKey) return false;
    try {
      return window.localStorage.getItem(storageKey) === "dismissed";
    } catch {
      // Private mode and blocked storage both throw on read. A bar that cannot
      // remember is better than a page that cannot render.
      return false;
    }
  }, [storageKey]);

  const storedDismissed = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => false,
  );

  const dismiss = React.useCallback(() => {
    setClosedThisLoad(true);
    if (!storageKey) return;
    try {
      window.localStorage.setItem(storageKey, "dismissed");
      notify();
    } catch {
      // Ignored on purpose — see above. The bar has already closed.
    }
  }, [storageKey]);

  if (closedThisLoad || storedDismissed) return null;

  return (
    <div
      data-slot="announcement-bar"
      className={cn("border-b border-border bg-muted", className)}
      {...props}
    >
      <PageContainer
        className={cn(
          "relative flex min-h-12 flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-center",
          // Reserved only when there is a control to reserve it for — the same
          // rule `DialogHeader` follows for its close button, and for the same
          // reason: a blanket end-pad shifts every message that never had one.
          dismissible && "pe-14",
        )}
      >
        <span className="type-small text-foreground">{children}</span>
        {action}
        {dismissible && (
          // Absolutely positioned rather than pushed with `ms-auto`, so the
          // message stays centred in the bar rather than centred in whatever
          // space is left beside the button.
          //
          // `size="icon"` is 40px — §7's floor for an icon-only control, and
          // the system's own documented exception to the 44px target. The
          // negative block margin does NOT enlarge the hit area (nothing about
          // a margin can); it stops a 40px control forcing a 56px bar. The
          // target is the button's own 40px box.
          <Button
            variant="ghost"
            size="icon"
            aria-label={dismissLabel}
            onClick={dismiss}
            className="absolute end-4 top-1/2 -my-1 -translate-y-1/2 shrink-0"
          >
            <Icon icon={X} size="md" tone="inherit" />
          </Button>
        )}
      </PageContainer>
    </div>
  );
}

export { AnnouncementBar };
