import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Task, TaskContent, TaskItem, TaskItemFile, TaskTrigger } from "@/components/ai-elements/task";

describe("Task", () => {
  it("is open by default and collapses from its trigger", async () => {
    render(
      <Task>
        <TaskTrigger title="Searching" />
        <TaskContent>
          <TaskItem>
            Reading <TaskItemFile>a.ts</TaskItemFile>
          </TaskItem>
        </TaskContent>
      </Task>,
    );
    expect(screen.getByText("a.ts")).toBeVisible();
    expect(screen.getByText("Searching")).toHaveClass("type-small");
    const trigger = screen.getByText("Searching").parentElement as HTMLElement;
    expect(trigger).toHaveAttribute("data-state", "open");
    await userEvent.setup().click(trigger);
    expect(trigger).toHaveAttribute("data-state", "closed");
  });
});
