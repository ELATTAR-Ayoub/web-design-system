import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Queue,
  QueueItem,
  QueueItemAction,
  QueueItemActions,
  QueueItemContent,
  QueueItemDescription,
  QueueItemFile,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from "@/components/ai-elements/queue";

describe("Queue", () => {
  it("renders items, completed styling and a working action", async () => {
    const onRemove = vi.fn();
    const { container } = render(
      <Queue>
        <QueueSection>
          <QueueSectionTrigger>
            <QueueSectionLabel count={2} label="Todos" />
          </QueueSectionTrigger>
          <QueueSectionContent>
            <QueueList>
              <QueueItem>
                <div>
                  <QueueItemIndicator />
                  <QueueItemContent>Open item</QueueItemContent>
                  <QueueItemActions>
                    <QueueItemAction aria-label="Remove" onClick={onRemove} />
                  </QueueItemActions>
                </div>
                <QueueItemDescription>desc</QueueItemDescription>
                <QueueItemFile>file.txt</QueueItemFile>
              </QueueItem>
              <QueueItem>
                <QueueItemIndicator completed />
                <QueueItemContent completed>Done item</QueueItemContent>
                <QueueItemDescription completed>old</QueueItemDescription>
              </QueueItem>
            </QueueList>
          </QueueSectionContent>
        </QueueSection>
      </Queue>,
    );
    expect(container.firstChild).toHaveClass("shadow-e1");
    expect(screen.getByText("2 Todos")).toBeInTheDocument();
    expect(screen.getByText("Open item")).toHaveClass("text-muted-foreground");
    expect(screen.getByText("Done item")).toHaveClass("line-through");
    expect(screen.getByText("desc")).toHaveClass("type-small");
    expect(screen.getByText("file.txt")).toHaveClass("max-w-20");
    const action = screen.getByLabelText("Remove");
    // nested control: 40px icon target pulled back with negative margin, row does not grow
    expect(action).toHaveClass("size-10", "-m-2");
    expect(action.className).not.toContain("size-target-min");
    await userEvent.setup().click(action);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
  it("section collapses from its trigger", async () => {
    render(
      <QueueSection>
        <QueueSectionTrigger>Toggle</QueueSectionTrigger>
        <QueueSectionContent>body</QueueSectionContent>
      </QueueSection>,
    );
    const t = screen.getByRole("button", { name: "Toggle" });
    expect(t).toHaveClass("type-nav");
    expect(t).toHaveAttribute("data-state", "open");
    await userEvent.setup().click(t);
    expect(t).toHaveAttribute("data-state", "closed");
  });
});
