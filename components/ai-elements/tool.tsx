"use client";

import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { DynamicToolUIPart, ToolUIPart } from "ai";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  WrenchIcon,
  XCircleIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { isValidElement } from "react";

import { CodeBlock } from "./code-block";

export type ToolProps = ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible
    className={cn("group not-prose mb-4 w-full rounded-md border", className)}
    {...props}
  />
);

export type ToolPart = ToolUIPart | DynamicToolUIPart;

export type ToolHeaderProps = {
  title?: string;
  className?: string;
} & (
  | { type: ToolUIPart["type"]; state: ToolUIPart["state"]; toolName?: never }
  | {
      type: DynamicToolUIPart["type"];
      state: DynamicToolUIPart["state"];
      toolName: string;
    }
);

const statusLabels: Record<ToolPart["state"], string> = {
  "approval-requested": "Awaiting Approval",
  "approval-responded": "Responded",
  "input-available": "Running",
  "input-streaming": "Pending",
  "output-available": "Completed",
  "output-denied": "Denied",
  "output-error": "Error",
};

// Vendored change: stock palette (`yellow-600`, `blue-600`, `green-600`, `orange-600`, `red-600`) replaced with the four state-colour `-ink` roles.
const statusIcons: Record<ToolPart["state"], ReactNode> = {
  "approval-requested": <Icon icon={ClockIcon} tone="warning" />,
  "approval-responded": <Icon icon={CheckCircleIcon} tone="info" />,
  "input-available": <Icon icon={ClockIcon} tone="inherit" />,
  "input-streaming": <Icon icon={CircleIcon} tone="inherit" />,
  "output-available": <Icon icon={CheckCircleIcon} tone="success" />,
  "output-denied": <Icon icon={XCircleIcon} tone="warning" />,
  "output-error": <Icon icon={XCircleIcon} tone="error" />,
};

// Vendored change: dropped `rounded-full`/`text-xs` — Badge already ships `rounded-pill` and `type-badge`, so both were redundant, off-scale overrides.
export const getStatusBadge = (status: ToolPart["state"]) => (
  <Badge className="gap-1.5" variant="secondary">
    {statusIcons[status]}
    {statusLabels[status]}
  </Badge>
);

export const ToolHeader = ({
  className,
  title,
  type,
  state,
  toolName,
  ...props
}: ToolHeaderProps) => {
  const derivedName =
    type === "dynamic-tool" ? toolName : type.split("-").slice(1).join("-");

  return (
    <CollapsibleTrigger
      className={cn(
        "flex w-full items-center justify-between gap-4 p-3",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Icon icon={WrenchIcon} tone="muted" />
        <span className={title ? "type-nav" : "type-identifier"}>{title ?? derivedName}</span>
        {getStatusBadge(state)}
      </div>
      <Icon
        className="transition-transform group-data-[state=open]:rotate-180"
        icon={ChevronDownIcon}
        tone="muted"
      />
    </CollapsibleTrigger>
  );
};

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

// Vendored change: dropped the hand-rolled tw-animate enter/exit classes — `CollapsibleContent` already plays `anim-expand`/`anim-collapse` off the measured Radix height.
export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent
    className={cn(
      "space-y-4 p-4 text-popover-foreground outline-none",
      className
    )}
    {...props}
  />
);

export type ToolInputProps = ComponentProps<"div"> & {
  input: ToolPart["input"];
};

export const ToolInput = ({ className, input, ...props }: ToolInputProps) => (
  <div className={cn("space-y-2 overflow-hidden", className)} {...props}>
    <h4 className="type-small text-muted-foreground">Parameters</h4>
    <div className="rounded-md bg-muted/50">
      <CodeBlock code={JSON.stringify(input, null, 2)} language="json" />
    </div>
  </div>
);

export type ToolOutputProps = ComponentProps<"div"> & {
  output: ToolPart["output"];
  errorText: ToolPart["errorText"];
};

export const ToolOutput = ({
  className,
  output,
  errorText,
  ...props
}: ToolOutputProps) => {
  if (!(output || errorText)) {
    return null;
  }

  let Output = <div>{output as ReactNode}</div>;

  if (typeof output === "object" && !isValidElement(output)) {
    Output = (
      <CodeBlock code={JSON.stringify(output, null, 2)} language="json" />
    );
  } else if (typeof output === "string") {
    Output = <CodeBlock code={output} language="json" />;
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <h4 className="type-small text-muted-foreground">
        {errorText ? "Error" : "Result"}
      </h4>
      <div
        className={cn(
          "overflow-x-auto rounded-md type-small [&_table]:w-full",
          errorText
            ? "bg-destructive/10 text-destructive-ink"
            : "bg-muted/50 text-foreground"
        )}
      >
        {errorText && <div>{errorText}</div>}
        {Output}
      </div>
    </div>
  );
};
