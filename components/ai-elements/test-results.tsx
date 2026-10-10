"use client";

import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Icon, type IconTone } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2Icon,
  ChevronRightIcon,
  LoaderCircleIcon,
  CircleIcon,
  XCircleIcon,
} from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import { createContext, useContext, useMemo } from "react";

type TestStatus = "passed" | "failed" | "skipped" | "running";

interface TestResultsSummary {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  duration?: number;
}

interface TestResultsContextType {
  summary?: TestResultsSummary;
}

const TestResultsContext = createContext<TestResultsContextType>({});

const formatDuration = (ms: number) => {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
};

export type TestResultsHeaderProps = HTMLAttributes<HTMLDivElement>;

export const TestResultsHeader = ({
  className,
  children,
  ...props
}: TestResultsHeaderProps) => (
  <div
    className={cn(
      "flex items-center justify-between border-b px-4 py-3",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export type TestResultsDurationProps = HTMLAttributes<HTMLSpanElement>;

export const TestResultsDuration = ({
  className,
  children,
  ...props
}: TestResultsDurationProps) => {
  const { summary } = useContext(TestResultsContext);

  if (!summary?.duration) {
    return null;
  }

  return (
    <span className={cn("type-small text-muted-foreground", className)} {...props}>
      {children ?? formatDuration(summary.duration)}
    </span>
  );
};

export type TestResultsSummaryProps = HTMLAttributes<HTMLDivElement>;

export const TestResultsSummary = ({
  className,
  children,
  ...props
}: TestResultsSummaryProps) => {
  const { summary } = useContext(TestResultsContext);

  if (!summary) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      {children ?? (
        <>
          <Badge className="gap-1" variant="success">
            <Icon icon={CheckCircle2Icon} size="xs" tone="inherit" />
            {summary.passed} passed
          </Badge>
          {summary.failed > 0 && (
            <Badge className="gap-1" variant="destructive">
              <Icon icon={XCircleIcon} size="xs" tone="inherit" />
              {summary.failed} failed
            </Badge>
          )}
          {summary.skipped > 0 && (
            <Badge className="gap-1" variant="warning">
              <Icon icon={CircleIcon} size="xs" tone="inherit" />
              {summary.skipped} skipped
            </Badge>
          )}
        </>
      )}
    </div>
  );
};

export type TestResultsProps = HTMLAttributes<HTMLDivElement> & {
  summary?: TestResultsSummary;
};

export const TestResults = ({
  summary,
  className,
  children,
  ...props
}: TestResultsProps) => {
  const contextValue = useMemo(() => ({ summary }), [summary]);

  return (
    <TestResultsContext.Provider value={contextValue}>
      <div
        className={cn("rounded-lg border bg-background", className)}
        {...props}
      >
        {children ??
          (summary && (
            <TestResultsHeader>
              <TestResultsSummary />
              <TestResultsDuration />
            </TestResultsHeader>
          ))}
      </div>
    </TestResultsContext.Provider>
  );
};

export type TestResultsProgressProps = HTMLAttributes<HTMLDivElement>;

export const TestResultsProgress = ({
  className,
  children,
  ...props
}: TestResultsProgressProps) => {
  const { summary } = useContext(TestResultsContext);

  if (!summary) {
    return null;
  }

  const passedPercent = (summary.passed / summary.total) * 100;
  const failedPercent = (summary.failed / summary.total) * 100;

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {children ?? (
        <>
          <div className="flex h-2 overflow-hidden rounded-pill bg-muted">
            <div
              className="bg-success-ink transition-[width]"
              style={{ width: `${passedPercent}%` }}
            />
            <div
              className="bg-destructive-ink transition-[width]"
              style={{ width: `${failedPercent}%` }}
            />
          </div>
          <div className="type-small flex justify-between text-muted-foreground">
            <span>
              {summary.passed}/{summary.total} tests passed
            </span>
            <span>{passedPercent.toFixed(0)}%</span>
          </div>
        </>
      )}
    </div>
  );
};

export type TestResultsContentProps = HTMLAttributes<HTMLDivElement>;

export const TestResultsContent = ({
  className,
  children,
  ...props
}: TestResultsContentProps) => (
  <div className={cn("space-y-2 p-4", className)} {...props}>
    {children}
  </div>
);

interface TestSuiteContextType {
  name: string;
  status: TestStatus;
}

const TestSuiteContext = createContext<TestSuiteContextType>({
  name: "",
  status: "passed",
});

const STATUS_TONE: Record<TestStatus, IconTone> = {
  failed: "error",
  passed: "success",
  running: "action",
  skipped: "warning",
};

// Vendored change: `running` swaps the vendor's pulsing `CircleDotIcon` (`animate-pulse`) for `LoaderCircleIcon` + `anim-spin`.
const STATUS_ICON: Record<TestStatus, LucideIcon> = {
  failed: XCircleIcon,
  passed: CheckCircle2Icon,
  running: LoaderCircleIcon,
  skipped: CircleIcon,
};

const STATUS_TEXT_CLASS: Record<TestStatus, string> = {
  failed: "text-destructive-ink",
  passed: "text-success-ink",
  running: "text-action-ink",
  skipped: "text-warning-ink",
};

const StatusIcon = ({
  status,
  className,
}: {
  status: TestStatus;
  className?: string;
}) => (
  <Icon
    className={cn(status === "running" && "anim-spin", className)}
    icon={STATUS_ICON[status]}
    size="md"
    tone={STATUS_TONE[status]}
  />
);

export type TestSuiteProps = ComponentProps<typeof Collapsible> & {
  name: string;
  status: TestStatus;
};

export const TestSuite = ({
  name,
  status,
  className,
  children,
  ...props
}: TestSuiteProps) => {
  const contextValue = useMemo(() => ({ name, status }), [name, status]);

  return (
    <TestSuiteContext.Provider value={contextValue}>
      <Collapsible className={cn("rounded-lg border", className)} {...props}>
        {children}
      </Collapsible>
    </TestSuiteContext.Provider>
  );
};

export type TestSuiteNameProps = ComponentProps<typeof CollapsibleTrigger>;

export const TestSuiteName = ({
  className,
  children,
  ...props
}: TestSuiteNameProps) => {
  const { name, status } = useContext(TestSuiteContext);

  return (
    <CollapsibleTrigger
      className={cn(
        "group flex min-h-(--size-target-min) w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-muted/50",
        className
      )}
      {...props}
    >
      <Icon
        className="shrink-0 transition-transform group-data-[state=open]:rotate-90"
        icon={ChevronRightIcon}
        size="md"
        tone="muted"
      />
      <StatusIcon status={status} />
      <span className="type-nav">{children ?? name}</span>
    </CollapsibleTrigger>
  );
};

export type TestSuiteStatsProps = HTMLAttributes<HTMLDivElement> & {
  passed?: number;
  failed?: number;
  skipped?: number;
};

export const TestSuiteStats = ({
  passed = 0,
  failed = 0,
  skipped = 0,
  className,
  children,
  ...props
}: TestSuiteStatsProps) => (
  <div
    className={cn("type-small ml-auto flex items-center gap-2", className)}
    {...props}
  >
    {children ?? (
      <>
        {passed > 0 && (
          <span className={STATUS_TEXT_CLASS.passed}>{passed} passed</span>
        )}
        {failed > 0 && (
          <span className={STATUS_TEXT_CLASS.failed}>{failed} failed</span>
        )}
        {skipped > 0 && (
          <span className={STATUS_TEXT_CLASS.skipped}>{skipped} skipped</span>
        )}
      </>
    )}
  </div>
);

export type TestSuiteContentProps = ComponentProps<typeof CollapsibleContent>;

export const TestSuiteContent = ({
  className,
  children,
  ...props
}: TestSuiteContentProps) => (
  <CollapsibleContent className={cn("border-t", className)} {...props}>
    <div className="divide-y">{children}</div>
  </CollapsibleContent>
);

interface TestContextType {
  name: string;
  status: TestStatus;
  duration?: number;
}

const TestContext = createContext<TestContextType>({
  name: "",
  status: "passed",
});

export type TestNameProps = HTMLAttributes<HTMLSpanElement>;

export const TestName = ({ className, children, ...props }: TestNameProps) => {
  const { name } = useContext(TestContext);

  return (
    <span className={cn("flex-1", className)} {...props}>
      {children ?? name}
    </span>
  );
};

export type TestDurationProps = HTMLAttributes<HTMLSpanElement>;

export const TestDuration = ({
  className,
  children,
  ...props
}: TestDurationProps) => {
  const { duration } = useContext(TestContext);

  if (duration === undefined) {
    return null;
  }

  return (
    <span
      className={cn("type-small ml-auto text-muted-foreground", className)}
      {...props}
    >
      {children ?? `${duration}ms`}
    </span>
  );
};

export type TestStatusProps = HTMLAttributes<HTMLSpanElement>;

export const TestStatus = ({
  className,
  children,
  ...props
}: TestStatusProps) => {
  const { status } = useContext(TestContext);

  return (
    <span
      className={cn("shrink-0", STATUS_TEXT_CLASS[status], className)}
      {...props}
    >
      {children ?? <StatusIcon status={status} />}
    </span>
  );
};

export type TestProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  status: TestStatus;
  duration?: number;
};

export const Test = ({
  name,
  status,
  duration,
  className,
  children,
  ...props
}: TestProps) => {
  const contextValue = useMemo(
    () => ({ duration, name, status }),
    [duration, name, status]
  );

  return (
    <TestContext.Provider value={contextValue}>
      <div className={cn("type-small flex items-center gap-2 px-4 py-2", className)} {...props}>
        {children ?? (
          <>
            <TestStatus />
            <TestName />
            {duration !== undefined && <TestDuration />}
          </>
        )}
      </div>
    </TestContext.Provider>
  );
};

export type TestErrorProps = HTMLAttributes<HTMLDivElement>;

export const TestError = ({
  className,
  children,
  ...props
}: TestErrorProps) => (
  <div className={cn("mt-2 rounded-md bg-destructive/10 p-3", className)} {...props}>
    {children}
  </div>
);

export type TestErrorMessageProps = HTMLAttributes<HTMLParagraphElement>;

export const TestErrorMessage = ({
  className,
  children,
  ...props
}: TestErrorMessageProps) => (
  <p className={cn("type-small text-destructive-ink", className)} {...props}>
    {children}
  </p>
);

export type TestErrorStackProps = HTMLAttributes<HTMLPreElement>;

export const TestErrorStack = ({
  className,
  children,
  ...props
}: TestErrorStackProps) => (
  <pre className={cn("mt-2 overflow-auto type-code text-destructive-ink", className)} {...props}>
    {children}
  </pre>
);
