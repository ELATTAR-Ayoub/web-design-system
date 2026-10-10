"use client";

/**
 * Conversation history, in the Claude pattern, on our shadcn Sidebar.
 *
 * AI Elements has no history component, so this is `components/ui/sidebar.tsx`
 * composed: a "New chat" button on top, one `SidebarGroup` per age bucket
 * (Today / Yesterday / Previous 7 days / Older), rows that are the title only,
 * and a `⋯` menu per row (Archive, Delete). Delete is undoable from its toast.
 *
 * It renders the Sidebar's *content*. The host places it inside
 * `SidebarProvider` + `Sidebar` and puts the `SidebarTrigger` in its header;
 * on mobile the Sidebar's own Sheet carries it.
 */

import * as React from "react";
import { ArchiveIcon, MoreHorizontalIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import type { ConversationSummary } from "@/components/agent/core/conversations";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type WorkspaceHistoryProps = {
  items: ConversationSummary[];
  activeId?: string;
  onOpen: (id: string) => void;
  onNew?: () => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  /** Undo for Delete's toast — puts the row back. */
  onRestore?: (item: ConversationSummary) => void;
  /** "Now" for the date grouping (tests). Defaults to Date.now(). */
  now?: number;
};

export type HistoryBucket = "Today" | "Yesterday" | "Previous 7 days" | "Older";

const BUCKETS: HistoryBucket[] = ["Today", "Yesterday", "Previous 7 days", "Older"];

function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Which age bucket a timestamp falls in, by calendar day relative to `now`. */
export function historyBucket(updatedAt: string, now: number): HistoryBucket {
  const t = new Date(updatedAt).getTime();
  const today = startOfDay(now);
  const day = 24 * 60 * 60 * 1000;
  if (Number.isNaN(t) || t >= today) return "Today";
  if (t >= today - day) return "Yesterday";
  if (t >= today - 7 * day) return "Previous 7 days";
  return "Older";
}

/** Items grouped into non-empty buckets, newest first within each. */
export function groupHistory(items: ConversationSummary[], now: number) {
  const sorted = [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return BUCKETS.map((label) => ({
    label,
    items: sorted.filter((i) => historyBucket(i.updatedAt, now) === label),
  })).filter((g) => g.items.length > 0);
}

export function WorkspaceHistory({
  items,
  activeId,
  onOpen,
  onNew,
  onArchive,
  onDelete,
  onRestore,
  now,
}: WorkspaceHistoryProps) {
  // Read once per mount so server and client group identically.
  const [mountedAt] = React.useState(() => Date.now());
  const groups = groupHistory(items, now ?? mountedAt);

  const remove = (item: ConversationSummary) => {
    onDelete?.(item.id);
    toast("Conversation deleted", {
      description: item.title,
      action: onRestore ? { label: "Undo", onClick: () => onRestore(item) } : undefined,
    });
  };

  const archive = (item: ConversationSummary) => {
    onArchive?.(item.id);
    toast("Conversation archived", { description: item.title });
  };

  return (
    <>
      <SidebarHeader>
        {onNew ? (
          <Button variant="outline" className="w-full justify-start gap-2" onClick={onNew}>
            <Icon icon={PlusIcon} size="sm" tone="inherit" aria-hidden />
            New chat
          </Button>
        ) : null}
      </SidebarHeader>
      <SidebarContent>
        {groups.length === 0 ? (
          <p className="type-small px-6 py-4 text-muted-foreground">No conversations yet.</p>
        ) : (
          groups.map((group) => (
            <SidebarGroup key={group.label} aria-label={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton isActive={item.id === activeId} onClick={() => onOpen(item.id)}>
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {onArchive || onDelete ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction showOnHover aria-label={`Actions for ${item.title}`}>
                              <Icon icon={MoreHorizontalIcon} size="sm" tone="inherit" aria-hidden />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onArchive ? (
                              <DropdownMenuItem onSelect={() => archive(item)}>
                                <Icon icon={ArchiveIcon} size="sm" tone="inherit" aria-hidden />
                                Archive
                              </DropdownMenuItem>
                            ) : null}
                            {onDelete ? (
                              <DropdownMenuItem variant="destructive" onSelect={() => remove(item)}>
                                <Icon icon={Trash2Icon} size="sm" tone="inherit" aria-hidden />
                                Delete
                              </DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
    </>
  );
}
