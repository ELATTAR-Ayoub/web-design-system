import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { ConversationSummary } from "@/components/agent/core/conversations";
import { WorkspaceHistory, groupHistory, historyBucket } from "@/components/agent/workspace/workspace-history";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

const NOW = new Date("2026-09-30T15:00:00").getTime();
const DAY = 24 * 60 * 60 * 1000;
const iso = (ms: number) => new Date(ms).toISOString();

const items: ConversationSummary[] = [
  { id: "a", title: "Today chat", updatedAt: iso(NOW - 60_000) },
  { id: "b", title: "Yesterday chat", updatedAt: iso(NOW - DAY) },
  { id: "c", title: "Last week chat", updatedAt: iso(NOW - 4 * DAY) },
  { id: "d", title: "Ancient chat", updatedAt: iso(NOW - 30 * DAY) },
];

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

function renderHistory(props: Partial<React.ComponentProps<typeof WorkspaceHistory>> = {}) {
  const onOpen = vi.fn();
  render(
    <SidebarProvider>
      <Toaster />
      <Sidebar collapsible="none">
        <WorkspaceHistory items={items} now={NOW} onOpen={onOpen} {...props} />
      </Sidebar>
    </SidebarProvider>,
  );
  return { onOpen };
}

describe("history grouping", () => {
  it("buckets by calendar day", () => {
    expect(historyBucket(items[0].updatedAt, NOW)).toBe("Today");
    expect(historyBucket(items[1].updatedAt, NOW)).toBe("Yesterday");
    expect(historyBucket(items[2].updatedAt, NOW)).toBe("Previous 7 days");
    expect(historyBucket(items[3].updatedAt, NOW)).toBe("Older");
    expect(groupHistory(items, NOW).map((g) => g.label)).toEqual(["Today", "Yesterday", "Previous 7 days", "Older"]);
  });
});

describe("WorkspaceHistory", () => {
  it("renders the four groups with title-only rows and opens a row", async () => {
    const { onOpen } = renderHistory({ activeId: "b" });
    for (const g of ["Today", "Yesterday", "Previous 7 days", "Older"]) expect(screen.getByText(g)).toBeInTheDocument();
    await setup().click(screen.getByRole("button", { name: "Last week chat" }));
    expect(onOpen).toHaveBeenCalledWith("c");
    expect(screen.getByRole("button", { name: "Yesterday chat" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Today chat" })).not.toHaveAttribute("aria-current");
  });

  it("New chat calls onNew", async () => {
    const onNew = vi.fn();
    renderHistory({ onNew });
    await setup().click(screen.getByRole("button", { name: "New chat" }));
    expect(onNew).toHaveBeenCalled();
  });

  it("the menu archives", async () => {
    const onArchive = vi.fn();
    renderHistory({ onArchive });
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Actions for Today chat" }));
    await user.click(await screen.findByRole("menuitem", { name: "Archive" }));
    expect(onArchive).toHaveBeenCalledWith("a");
  });

  it("delete asks first, and cancelling keeps the row", async () => {
    const onDelete = vi.fn();
    renderHistory({ onDelete });
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Actions for Today chat" }));
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }));
    const confirm = await screen.findByRole("alertdialog", { name: "Delete this conversation?" });
    expect(onDelete).not.toHaveBeenCalled();
    await user.click(within(confirm).getByRole("button", { name: "Cancel" }));
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("confirmed delete shows a toast whose Undo restores the row", async () => {
    const onDelete = vi.fn();
    const onRestore = vi.fn();
    renderHistory({ onDelete, onRestore });
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Actions for Today chat" }));
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }));
    const confirm = await screen.findByRole("alertdialog", { name: "Delete this conversation?" });
    await user.click(within(confirm).getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledWith("a");
    await user.click(await screen.findByRole("button", { name: "Undo" }));
    expect(onRestore).toHaveBeenCalledWith(items[0]);
  });
});
