"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PageContainer } from "@/components/docs/layout/page-container";
import { cn } from "@/lib/utils";

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
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
  action?: React.ReactNode;
  dismissible?: boolean;
  storageKey?: string;
  dismissLabel?: string;
}) {
  const [closedThisLoad, setClosedThisLoad] = React.useState(false);

  const getSnapshot = React.useCallback(() => {
    if (!storageKey) return false;
    try {
      return window.localStorage.getItem(storageKey) === "dismissed";
    } catch {
      // Private mode and blocked storage both throw on read.
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
      // Storage is unavailable; the bar has already closed.
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
          dismissible && "pe-14",
        )}
      >
        <span className="type-small text-foreground">{children}</span>
        {action}
        {dismissible && (
          // The negative block margin stops the 40px control forcing a taller bar.
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
