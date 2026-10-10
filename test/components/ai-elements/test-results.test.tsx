/**
 * @covers ai-test-results
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  Test,
  TestDuration,
  TestError,
  TestErrorMessage,
  TestErrorStack,
  TestName,
  TestResults,
  TestResultsContent,
  TestResultsDuration,
  TestResultsHeader,
  TestResultsProgress,
  TestResultsSummary,
  TestStatus,
  TestSuite,
  TestSuiteContent,
  TestSuiteName,
  TestSuiteStats,
} from "@/components/ai-elements/test-results";

describe("TestResults: basic (header only)", () => {
  it("renders passed/failed/skipped badges on the recognised state-tone variants", () => {
    render(
      <TestResults summary={{ duration: 3500, failed: 2, passed: 10, skipped: 1, total: 13 }}>
        <TestResultsHeader>
          <TestResultsSummary />
          <TestResultsDuration />
        </TestResultsHeader>
      </TestResults>
    );

    const passed = screen.getByText(/10 passed/).closest('[data-slot="badge"]');
    const failed = screen.getByText(/2 failed/).closest('[data-slot="badge"]');
    const skipped = screen.getByText(/1 skipped/).closest('[data-slot="badge"]');
    expect(passed).toHaveAttribute("data-variant", "success");
    expect(failed).toHaveAttribute("data-variant", "destructive");
    expect(skipped).toHaveAttribute("data-variant", "warning");
    expect(screen.getByText("3.50s")).toHaveClass("type-small", "text-muted-foreground");
  });

  it("omits failed/skipped badges entirely when their counts are zero", () => {
    render(
      <TestResults summary={{ duration: 150, failed: 0, passed: 3, skipped: 0, total: 3 }}>
        <TestResultsHeader>
          <TestResultsSummary />
        </TestResultsHeader>
      </TestResults>
    );
    expect(screen.queryByText(/failed/)).not.toBeInTheDocument();
    expect(screen.queryByText(/skipped/)).not.toBeInTheDocument();
  });
});

describe("TestResults: progress", () => {
  it("fills the two segments with -ink tokens, never the raw state hue", () => {
    const { container } = render(
      <TestResults summary={{ duration: 100, failed: 1, passed: 3, skipped: 0, total: 4 }}>
        <TestResultsProgress />
      </TestResults>
    );
    const track = container.querySelector(".bg-muted") as HTMLElement;
    const [passedFill, failedFill] = Array.from(track.children) as HTMLElement[];
    expect(passedFill).toHaveClass("bg-success-ink");
    expect(passedFill).toHaveStyle({ width: "75%" });
    expect(failedFill).toHaveClass("bg-destructive-ink");
    expect(failedFill).toHaveStyle({ width: "25%" });
  });
});

describe("TestResults: suites", () => {
  it("collapses/expands a suite and shows its tests", async () => {
    const user = userEvent.setup();
    render(
      <TestResults summary={{ duration: 150, failed: 0, passed: 3, skipped: 0, total: 3 }}>
        <TestResultsHeader>
          <TestResultsSummary />
        </TestResultsHeader>
        <TestResultsContent>
          <TestSuite name="Auth" status="passed">
            <TestSuiteName />
            <TestSuiteContent>
              <Test duration={45} name="should login" status="passed" />
              <Test duration={32} name="should logout" status="passed" />
            </TestSuiteContent>
          </TestSuite>
        </TestResultsContent>
      </TestResults>
    );

    const trigger = screen.getByText("Auth").closest('[data-slot="collapsible-trigger"]');
    expect(trigger).toHaveAttribute("data-state", "closed");
    await user.click(screen.getByText("Auth"));
    expect(trigger).toHaveAttribute("data-state", "open");
    expect(screen.getByText("should login")).toBeInTheDocument();
    expect(screen.getByText("45ms")).toBeInTheDocument();
  });

  it("the suite name reads through the nav role, not a bolted-on weight", () => {
    render(
      <TestSuite name="Auth" status="passed">
        <TestSuiteName />
      </TestSuite>
    );
    expect(screen.getByText("Auth")).toHaveClass("type-nav");
  });

  it("a running status spins its icon; other statuses do not", () => {
    const { container, rerender } = render(
      <TestSuite name="Auth" status="running">
        <TestSuiteName />
      </TestSuite>
    );
    expect(container.querySelector(".anim-spin")).toBeInTheDocument();

    rerender(
      <TestSuite name="Auth" status="passed">
        <TestSuiteName />
      </TestSuite>
    );
    expect(container.querySelector(".anim-spin")).not.toBeInTheDocument();
  });

  it("suite stats colour each count with its state -ink role", () => {
    render(<TestSuiteStats failed={1} passed={2} skipped={1} />);
    expect(screen.getByText("2 passed")).toHaveClass("text-success-ink");
    expect(screen.getByText("1 failed")).toHaveClass("text-destructive-ink");
    expect(screen.getByText("1 skipped")).toHaveClass("text-warning-ink");
  });
});

describe("TestResults: errors", () => {
  it("renders a failing test's message and stack as a destructive-tinted, token-coloured block", () => {
    render(
      <Test duration={85} name="should update" status="failed">
        <TestName />
        <TestDuration />
        <TestStatus />
        <TestError>
          <TestErrorMessage>Expected 200, got 500</TestErrorMessage>
          <TestErrorStack>{"at update (/app/api.ts:12:4)"}</TestErrorStack>
        </TestError>
      </Test>
    );

    expect(screen.getByText("Expected 200, got 500")).toHaveClass(
      "type-small",
      "text-destructive-ink"
    );
    const stack = screen.getByText(/api\.ts:12:4/);
    expect(stack).toHaveClass("type-code", "text-destructive-ink");
    expect(stack.closest("div")).toHaveClass("bg-destructive/10");
  });

  it("custom TestStatus children keep the status tone on the wrapper", () => {
    render(
      <Test name="x" status="failed">
        <TestStatus>
          <b>custom</b>
        </TestStatus>
      </Test>
    );
    expect(screen.getByText("custom").parentElement).toHaveClass("text-destructive-ink");
  });
});
