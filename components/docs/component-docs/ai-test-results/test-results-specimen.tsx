"use client";

import {
  Test,
  TestError,
  TestErrorMessage,
  TestErrorStack,
  TestDuration,
  TestName,
  TestStatus,
  TestResults,
  TestResultsContent,
  TestResultsDuration,
  TestResultsHeader,
  TestResultsProgress,
  TestResultsSummary,
  TestSuite,
  TestSuiteContent,
  TestSuiteName,
  TestSuiteStats,
} from "@/components/ai-elements/test-results";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

const SUMMARY = { passed: 5, failed: 1, skipped: 1, total: 7, duration: 1840 };

function FailedRow() {
  return (
    <Test className="flex-wrap" duration={31} name="applies the tax rate" status="failed">
      <TestStatus />
      <TestName />
      <TestDuration />
      <TestError className="w-full basis-full">
        <TestErrorMessage>expected 21.00 to equal 20.00</TestErrorMessage>
        <TestErrorStack>{"at taxFor (src/invoices.ts:42:11)\nat invoices.test.ts:18:5"}</TestErrorStack>
      </TestError>
    </Test>
  );
}

export function TestResultsPreview() {
  return (
    <Panel label="TestResults" note="open and close the suite">
      <TestResults summary={SUMMARY}>
        <TestResultsHeader>
          <TestResultsSummary />
          <TestResultsDuration />
        </TestResultsHeader>
        <TestResultsContent>
          <TestResultsProgress />
          <TestSuite defaultOpen name="invoices.test.ts" status="failed">
            <TestSuiteName />
            <TestSuiteStats failed={1} passed={2} skipped={1} />
            <TestSuiteContent>
              <Test duration={12} name="adds line items" status="passed" />
              <Test duration={9} name="rounds to cents" status="passed" />
              <FailedRow />
              <Test name="exports a PDF" status="skipped" />
            </TestSuiteContent>
          </TestSuite>
        </TestResultsContent>
      </TestResults>
    </Panel>
  );
}

export function TestResultsStateGrid() {
  const statuses = ["passed", "failed", "skipped", "running"] as const;
  return (
    <StateGrid cols={4}>
      {statuses.map((status) => (
        <StateCell key={status} label={status} note="Test row">
          <div className="w-full">
            <Test duration={status === "running" ? undefined : 14} name="adds line items" status={status} />
          </div>
        </StateCell>
      ))}
      <StateCell label="suite, collapsed" note="chevron points right">
        <div className="w-full">
          <TestSuite name="billing.test.ts" status="passed">
            <TestSuiteName />
          </TestSuite>
        </div>
      </StateCell>
      <StateCell label="empty" note="TestResults with no summary draws no header">
        <TestResults className="w-full" />
      </StateCell>
    </StateGrid>
  );
}

export function TestResultsExamples() {
  return (
    <div className="flex flex-col gap-4">
      <Panel label="All passing" note="the failed segment disappears">
        <TestResults summary={{ passed: 12, failed: 0, skipped: 0, total: 12, duration: 640 }}>
          <TestResultsHeader>
            <TestResultsSummary />
            <TestResultsDuration />
          </TestResultsHeader>
          <TestResultsContent>
            <TestResultsProgress />
          </TestResultsContent>
        </TestResults>
      </Panel>
      <Panel label="Default layout" note="children omitted, summary given">
        <TestResults summary={SUMMARY} />
      </Panel>
    </div>
  );
}
