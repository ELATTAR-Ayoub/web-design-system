import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { TestResultsExamples, TestResultsPreview, TestResultsStateGrid } from "./test-results-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-test-results",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A test run: the counts and duration, a progress bar, and each suite as a collapsible list of tests with the failure's message and stack.",
      label: "TestResults",
      render: <TestResultsPreview />,
      source: `import {
  Test, TestError, TestErrorMessage, TestResults, TestResultsContent, TestResultsDuration,
  TestResultsHeader, TestResultsProgress, TestResultsSummary, TestSuite, TestSuiteContent, TestSuiteName,
} from "@/components/ai-elements/test-results";

<TestResults summary={{ passed: 5, failed: 1, skipped: 1, total: 7, duration: 1840 }}>
  <TestResultsHeader>
    <TestResultsSummary />
    <TestResultsDuration />
  </TestResultsHeader>
  <TestResultsContent>
    <TestResultsProgress />
    <TestSuite defaultOpen name="invoices.test.ts" status="failed">
      <TestSuiteName />
      <TestSuiteContent>
        <Test duration={12} name="adds line items" status="passed" />
      </TestSuiteContent>
    </TestSuite>
  </TestResultsContent>
</TestResults>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "TestResults takes the run's summary and shares it with the header parts. Each TestSuite takes a name and a status and shares them with TestSuiteName; each Test takes name, status and an optional duration in milliseconds. Children replace a part's default content: a Test with no children draws status, name and duration; give it children (TestStatus, TestName, TestDuration, then TestError with TestErrorMessage and TestErrorStack) to show a failure. TestResultsProgress divides by summary.total, so pass a total greater than zero.",
      language: "tsx",
      code: `<TestResults summary={run.summary}>
  <TestResultsHeader>
    <TestResultsSummary />
    <TestResultsDuration />
  </TestResultsHeader>
  <TestResultsContent>
    {run.suites.map((suite) => (
      <TestSuite defaultOpen={suite.status === "failed"} key={suite.name} name={suite.name} status={suite.status}>
        <TestSuiteName />
        <TestSuiteContent>
          {suite.tests.map((t) => (
            <Test duration={t.duration} key={t.name} name={t.name} status={t.status} />
          ))}
        </TestSuiteContent>
      </TestSuite>
    ))}
  </TestResultsContent>
</TestResults>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "A test and a suite each have four statuses; each has its own glyph, ink and text.",
      blocks: [
        { body: <TestResultsStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: the suite collapsed, the tests listed. <strong>hover</strong>: the suite header row takes a faint muted fill; test rows have none. <strong>focus-visible</strong>: the suite header is a CollapsibleTrigger button and takes the focus ring. <strong>pressed</strong>: N/A — no press feel on the suite row. <strong>loading</strong>: status <code className="type-code">running</code> draws a spinning loader glyph (<code className="type-code">anim-spin</code>) in action ink. <strong>success</strong>: <code className="type-code">passed</code>, success ink and a check circle. <strong>error</strong>: <code className="type-code">failed</code>, error ink, an X circle and, when given, a TestError block with the message and stack in error ink on a faint destructive tint. <strong>skipped</strong> is its own status in warning ink. <strong>disabled</strong>: N/A — a suite can be given <code className="type-code">disabled</code> through the Collapsible, but a result list has nothing to disable. <strong>empty</strong>: no <code className="type-code">summary</code> and no children draws an empty bordered box; duration is omitted when it is zero or missing, and the Failed and Skipped counts are omitted at zero.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description: "A fully passing run, and the default layout a summary alone produces.",
      label: "Examples",
      render: <TestResultsExamples />,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/test-results.tsx.",
      blocks: [
        {
          label: "TestResults",
          body: (
            <Meta
              items={[
                { k: "summary?", v: "{ passed, failed, skipped, total: number; duration?: number (ms) } — shared with Summary, Duration and Progress. With no children it draws the default header." },
                { k: "children?", v: "ReactNode." },
                { k: "className?", v: "string, plus any div props." },
              ]}
            />
          ),
        },
        {
          label: "TestResultsHeader, TestResultsSummary, TestResultsDuration, TestResultsProgress, TestResultsContent",
          body: (
            <Meta
              items={[
                { k: "TestResultsHeader", v: "div props; a bordered row, justify-between." },
                { k: "TestResultsSummary", v: "div props; default children are a success Badge with the passed count, plus a destructive Badge for failed and a warning Badge for skipped when above zero. Null without a summary." },
                { k: "TestResultsDuration", v: 'span props; formats ms under a second as "12ms", otherwise seconds with two decimals. Null when the duration is missing or zero.' },
                { k: "TestResultsProgress", v: "div props; a two-segment bar (passed in success ink, failed in error ink) and a passed/total caption with a percentage. Children replace it. Null without a summary." },
                { k: "TestResultsContent", v: "div props; space-y-2 p-4." },
              ]}
            />
          ),
        },
        {
          label: "TestSuite, TestSuiteName, TestSuiteStats, TestSuiteContent",
          body: (
            <Meta
              items={[
                { k: "TestSuite name", v: "string, required — the suite's title." },
                { k: "TestSuite status", v: '"passed" | "failed" | "skipped" | "running", required.' },
                { k: "TestSuite …Collapsible props", v: "open, defaultOpen, onOpenChange pass through." },
                { k: "TestSuiteName", v: "CollapsibleTrigger props; the row: chevron, status glyph and the name (children replace the name). A 44px minimum height." },
                { k: "TestSuiteStats", v: "passed?, failed?, skipped? (default 0) — counts coloured by status ink, hidden at zero; children replace them." },
                { k: "TestSuiteContent", v: "CollapsibleContent props; wraps its children in a divided list." },
              ]}
            />
          ),
        },
        {
          label: "Test, TestStatus, TestName, TestDuration",
          body: (
            <Meta
              items={[
                { k: "Test name, status", v: "string and the four statuses, required." },
                { k: "Test duration?", v: "number (ms) — shows the duration cell when defined." },
                { k: "Test children?", v: "ReactNode — replaces the default status, name and duration." },
                { k: "TestStatus", v: "span props; the status glyph in the status ink; children replace the glyph." },
                { k: "TestName", v: "span props; the test name, flex-1." },
                { k: "TestDuration", v: 'span props; "<n>ms" from context. Null when the test has no duration.' },
              ]}
            />
          ),
        },
        {
          label: "TestError, TestErrorMessage, TestErrorStack",
          body: (
            <Meta
              items={[
                { k: "TestError", v: "div props; a rounded block on a faint destructive tint." },
                { k: "TestErrorMessage", v: "p props; the message in error ink." },
                { k: "TestErrorStack", v: "pre props; the stack in the code role and error ink, scrollable." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description: "Suite rows are disclosure buttons; status is text as well as colour.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: "TestSuiteName is a Radix CollapsibleTrigger: a button with aria-expanded, named by the suite name. Test rows are plain text. The glyphs are decorative; the status is carried by colour plus the stats text (5 passed, 1 failed) and the summary badges, but an individual test row's status is carried by its glyph and ink alone." },
                { k: "Keyboard", v: "Tab to each suite header, Enter or Space opens it. Rows and errors are static text, selectable." },
                { k: "Target size", v: "The suite header has min-h-(--size-target-min), 44px. Test rows are read-only and not targets." },
                { k: "Colour", v: "Every state colour is a -ink role (success, error, warning, action), per theme." },
                { k: "Motion and reduced motion", v: "The chevron turns 90 degrees, the suite body uses the shared expand/collapse height animation, the running glyph spins and the progress segments transition width. The blanket prefers-reduced-motion rule collapses these." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why",
      title: "Why this exists",
      blocks: [
        {
          body: (
            <Note tone="action">
              When the agent runs a test suite, a wall of console text hides the one failing test. The AgentWorkspace maps a <code className="type-code">test-results</code> tool result to this component in <code className="type-code">ToolOutputView</code> (<code className="type-code">components/agent/workspace/workspace-outputs.tsx</code>): the summary and duration in the header, one TestSuite per suite opened by default when it failed, and a TestError with the message and stack under each failing test; <code className="type-code">tool-output.ts</code> checks the shape first, and a running tool fills the same shape in through tool progress. Vendored changes: raw palette hues became the -ink roles per status (with the added running status taking action ink); the pulsing running dot became a spinning loader on the motion scale; the progress segments and badges use the system tokens and Badge variants; the suite header got the 44px target floor and the nav type role.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [{ body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> }],
    },
  ],
};
