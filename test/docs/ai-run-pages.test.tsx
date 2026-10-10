/**
 * @covers ai-plan
 * @covers ai-task
 * @covers ai-queue
 * @covers ai-checkpoint
 * @covers ai-question
 * @covers ai-agent
 * @covers ai-context
 *
 * Smoke test for the run-group documentation pages: every specimen export and
 * every page section's render nodes mount without throwing, and each page's
 * main control has its accessible name. Shiki cannot run in jsdom, so
 * CodeBlock is mocked at the module boundary exactly as the ai-elements tests
 * do.
 */
import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ai-elements/code-block", () => ({
  CodeBlock: ({ code, language }: { code: string; language: string }) => <pre data-language={language}>{code}</pre>,
}));

import { AgentExamples, AgentShowcase, AgentStateGrid } from "@/components/docs/component-docs/ai-agent/agent-specimen";
import { spec as agentSpec } from "@/components/docs/component-docs/ai-agent/page";
import { CheckpointExamples, CheckpointShowcase, CheckpointStateGrid } from "@/components/docs/component-docs/ai-checkpoint/checkpoint-specimen";
import { spec as checkpointSpec } from "@/components/docs/component-docs/ai-checkpoint/page";
import { ContextExamples, ContextShowcase, ContextStateGrid } from "@/components/docs/component-docs/ai-context/context-specimen";
import { spec as contextSpec } from "@/components/docs/component-docs/ai-context/page";
import { spec as planSpec } from "@/components/docs/component-docs/ai-plan/page";
import { PlanExamples, PlanShowcase, PlanStateGrid } from "@/components/docs/component-docs/ai-plan/plan-specimen";
import { spec as questionSpec } from "@/components/docs/component-docs/ai-question/page";
import { QuestionExamples, QuestionShowcase, QuestionStateGrid } from "@/components/docs/component-docs/ai-question/question-specimen";
import { spec as queueSpec } from "@/components/docs/component-docs/ai-queue/page";
import { QueueExamples, QueueShowcase, QueueStateGrid } from "@/components/docs/component-docs/ai-queue/queue-specimen";
import { spec as taskSpec } from "@/components/docs/component-docs/ai-task/page";
import { TaskExamples, TaskShowcase, TaskStateGrid } from "@/components/docs/component-docs/ai-task/task-specimen";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

/** Every ReactNode a spec carries: showcase/effect renders, install notes, disclosure bodies. */
function nodesOf(spec: ComponentDocSpec): ReactNode[] {
  return spec.sections.flatMap((section) => {
    switch (section.kind) {
      case "showcase":
      case "effect":
        return [section.render];
      case "install":
        return section.notes ? [section.notes] : [];
      case "disclosure":
        return section.blocks.map((b) => b.body);
      default:
        return [];
    }
  });
}

const SECTION_IDS = ["preview", "installation", "usage", "states", "api", "accessibility", "why", "source"];

const PAGES: [string, ComponentDocSpec, (() => ReactNode)[]][] = [
  ["ai-plan", planSpec, [() => <PlanShowcase />, () => <PlanStateGrid />, () => <PlanExamples />]],
  ["ai-task", taskSpec, [() => <TaskShowcase />, () => <TaskStateGrid />, () => <TaskExamples />]],
  ["ai-queue", queueSpec, [() => <QueueShowcase />, () => <QueueStateGrid />, () => <QueueExamples />]],
  ["ai-checkpoint", checkpointSpec, [() => <CheckpointShowcase />, () => <CheckpointStateGrid />, () => <CheckpointExamples />]],
  ["ai-question", questionSpec, [() => <QuestionShowcase />, () => <QuestionStateGrid />, () => <QuestionExamples />]],
  ["ai-agent", agentSpec, [() => <AgentShowcase />, () => <AgentStateGrid />, () => <AgentExamples />]],
  ["ai-context", contextSpec, [() => <ContextShowcase />, () => <ContextStateGrid />, () => <ContextExamples />]],
];

describe.each(PAGES)("%s page", (name, spec, specimens) => {
  it("declares the required sections in order", () => {
    expect(spec.name).toBe(name);
    const ids = spec.sections.map((s) => s.id).filter((id) => SECTION_IDS.includes(id));
    expect(ids).toEqual(SECTION_IDS);
  });

  it("renders every specimen without throwing", () => {
    for (const make of specimens) {
      const { container, unmount } = render(<>{make()}</>);
      expect(container.firstChild).not.toBeNull();
      unmount();
    }
  });

  it("renders every section's render nodes without throwing", () => {
    for (const node of nodesOf(spec)) {
      const { unmount } = render(<>{node}</>);
      unmount();
    }
  });
});

describe("main controls", () => {
  it("ai-plan: the trigger is named Toggle plan", () => {
    render(<PlanShowcase />);
    expect(screen.getByRole("button", { name: "Toggle plan" })).toBeInTheDocument();
  });

  it("ai-task: the trigger is a button named by the title", () => {
    render(<TaskShowcase />);
    expect(screen.getByRole("button", { name: "Found the export code" })).toBeInTheDocument();
  });

  it("ai-queue: every action is named and the first Move up is disabled", () => {
    render(<QueueShowcase />);
    expect(screen.getAllByRole("button", { name: "Remove from queue" })).toHaveLength(3);
    expect(screen.getAllByRole("button", { name: "Move up" })[0]).toBeDisabled();
  });

  it("ai-checkpoint: the trigger is named for what it restores", () => {
    render(<CheckpointShowcase />);
    expect(screen.getByRole("button", { name: "Restore to before the export change" })).toBeInTheDocument();
  });

  it("ai-question: the options form a radiogroup and Submit starts disabled", () => {
    render(<QuestionShowcase />);
    const group = screen.getByRole("radiogroup", { name: "Owner" });
    expect(within(group).getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Hand off" })).toBeDisabled();
  });

  it("ai-agent: the model id and each tool are exposed", () => {
    render(<AgentShowcase />);
    expect(screen.getByText("claude-sonnet-4-5")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export invoices for a month as CSV" })).toBeInTheDocument();
  });

  it("ai-context: the trigger shows the used percentage and the ring is named", () => {
    render(<ContextShowcase />);
    expect(screen.getAllByRole("img", { name: "Model context usage" }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("27.2%").length).toBeGreaterThan(0);
  });
});
