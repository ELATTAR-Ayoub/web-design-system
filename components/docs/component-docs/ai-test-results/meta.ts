import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-test-results",
  description:
    "A test-run report: pass, fail and skip counts with a duration and progress bar, and collapsible suites listing each test with its error and stack.",
  dependencies: ["source-foundation"],
  exports: ["TestResultsHeaderProps","TestResultsHeader","TestResultsDurationProps","TestResultsDuration","TestResultsSummaryProps","TestResultsSummary","TestResultsProps","TestResults","TestResultsProgressProps","TestResultsProgress","TestResultsContentProps","TestResultsContent","TestSuiteProps","TestSuite","TestSuiteNameProps","TestSuiteName","TestSuiteStatsProps","TestSuiteStats","TestSuiteContentProps","TestSuiteContent","TestNameProps","TestName","TestDurationProps","TestDuration","TestStatusProps","TestStatus","TestProps","Test","TestErrorProps","TestError","TestErrorMessageProps","TestErrorMessage","TestErrorStackProps","TestErrorStack"],
  sourcePath: "components/ai-elements/test-results.tsx",
};
