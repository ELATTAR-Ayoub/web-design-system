"use client";

/**
 * The full-viewport live workspace — "Open full screen" from the
 * `agent-workspace` docs page's own Preview section.
 *
 * Renders ONLY the conversation picker and `AgentWorkspace` itself (plus a
 * minimal Back link — not part of the docs chrome, just wayfinding), at the
 * full viewport height and width, so every one of `AgentWorkspace`'s own
 * container-query layouts (thread-only, +activity, three-column) can
 * actually be tried at real desktop width — something even the docs page's
 * own `wide` preview stage cannot fully give it once the shell's rails and
 * `--width-content` cap are accounted for.
 *
 * `app/design-system/layout.tsx` still wraps every route under
 * `app/design-system/**` in its header/rail/`max-w-(--width-content)`
 * shell — this route does not get its own layout. Rather than forking that
 * shared shell (used by every other documentation page), this component
 * breaks out of it visually with `fixed inset-0`, the same technique
 * `components/ui/dialog.tsx`/`sheet.tsx` already use for their own overlays
 * (`z-50`), so it covers the full viewport regardless of the ancestor
 * layout's own width and padding.
 *
 * Reuses `useConversationPicker`/`ConversationPickerRow`/`LiveWorkspace` from the
 * docs page's own specimen file rather than a second implementation of any
 * of them — the only thing this file adds is the full-viewport frame around
 * them.
 */

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { docRoute } from "@/lib/ds/docs/catalog";
import {
  LiveWorkspace,
  ConversationPickerRow,
  clampSpeed,
  useConversationPicker,
} from "@/components/docs/component-docs/agent-workspace/workspace-live-specimen";

function FullScreenInner() {
  const searchParams = useSearchParams();
  const speedParam = searchParams.get("speed");
  const speed = speedParam ? clampSpeed(Number(speedParam) || 1) : 0.5;

  const picker = useConversationPicker();

  return (
    <div className="flex h-full w-full flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href={docRoute("agent-workspace")}>
            <Icon icon={ArrowLeftIcon} size="sm" tone="inherit" aria-hidden />
            Back to the docs
          </Link>
        </Button>
      </div>

      <ConversationPickerRow conversation={picker.conversation} onSelect={picker.select} onReplay={picker.replay} />

      <div className="min-h-0 w-full flex-1 overflow-hidden rounded-xl border border-border">
        <LiveWorkspace
          key={`${picker.conversation}-${picker.replayCount}`}
          conversation={picker.conversation}
          speed={speed}
          items={picker.items}
          activeId={picker.activeId}
          onOpenConversation={picker.openConversation}
          onNewConversation={picker.newConversation}
          onArchiveConversation={picker.archiveConversation}
          onDeleteConversation={picker.deleteConversation}
          onRestoreConversation={picker.restoreConversation}
        />
      </div>
    </div>
  );
}

export function FullScreenWorkspace() {
  return (
    <div data-slot="agent-workspace-live" className="bg-background fixed inset-0 z-50">
      <React.Suspense fallback={<div className="h-full w-full" aria-hidden />}>
        <FullScreenInner />
      </React.Suspense>
    </div>
  );
}
