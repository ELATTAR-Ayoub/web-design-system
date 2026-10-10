"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";
import { IconSwap } from "@/components/ui/icon-swap";
import { cn } from "@/lib/utils";
import {
  AlertTriangleIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
} from "lucide-react";
import type { ComponentProps } from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Regex patterns for parsing stack traces
const STACK_FRAME_WITH_PARENS_REGEX = /^at\s+(.+?)\s+\((.+):(\d+):(\d+)\)$/;
const STACK_FRAME_WITHOUT_FN_REGEX = /^at\s+(.+):(\d+):(\d+)$/;
const ERROR_TYPE_REGEX = /^(\w+Error|Error):\s*(.*)$/;
const AT_PREFIX_REGEX = /^at\s+/;

interface StackFrame {
  raw: string;
  functionName: string | null;
  filePath: string | null;
  lineNumber: number | null;
  columnNumber: number | null;
  isInternal: boolean;
}

interface ParsedStackTrace {
  errorType: string | null;
  errorMessage: string;
  frames: StackFrame[];
  raw: string;
}

interface StackTraceContextValue {
  trace: ParsedStackTrace;
  raw: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onFilePathClick?: (filePath: string, line?: number, column?: number) => void;
}

const StackTraceContext = createContext<StackTraceContextValue | null>(null);

const useStackTrace = () => {
  const context = useContext(StackTraceContext);
  if (!context) {
    throw new Error("StackTrace components must be used within StackTrace");
  }
  return context;
};

const parseStackFrame = (line: string): StackFrame => {
  const trimmed = line.trim();

  // Pattern: at functionName (filePath:line:column)
  const withParensMatch = trimmed.match(STACK_FRAME_WITH_PARENS_REGEX);
  if (withParensMatch) {
    const [, functionName, filePath, lineNum, colNum] = withParensMatch;
    const isInternal =
      filePath.includes("node_modules") ||
      filePath.startsWith("node:") ||
      filePath.includes("internal/");
    return {
      columnNumber: colNum ? Number.parseInt(colNum, 10) : null,
      filePath: filePath ?? null,
      functionName: functionName ?? null,
      isInternal,
      lineNumber: lineNum ? Number.parseInt(lineNum, 10) : null,
      raw: trimmed,
    };
  }

  // Pattern: at filePath:line:column (no function name)
  const withoutFnMatch = trimmed.match(STACK_FRAME_WITHOUT_FN_REGEX);
  if (withoutFnMatch) {
    const [, filePath, lineNum, colNum] = withoutFnMatch;
    const isInternal =
      (filePath?.includes("node_modules") ?? false) ||
      (filePath?.startsWith("node:") ?? false) ||
      (filePath?.includes("internal/") ?? false);
    return {
      columnNumber: colNum ? Number.parseInt(colNum, 10) : null,
      filePath: filePath ?? null,
      functionName: null,
      isInternal,
      lineNumber: lineNum ? Number.parseInt(lineNum, 10) : null,
      raw: trimmed,
    };
  }

  // Fallback: unparseable line
  return {
    columnNumber: null,
    filePath: null,
    functionName: null,
    isInternal: trimmed.includes("node_modules") || trimmed.includes("node:"),
    lineNumber: null,
    raw: trimmed,
  };
};

const parseStackTrace = (trace: string): ParsedStackTrace => {
  const lines = trace.split("\n").filter((line) => line.trim());

  if (lines.length === 0) {
    return {
      errorMessage: trace,
      errorType: null,
      frames: [],
      raw: trace,
    };
  }

  const firstLine = lines[0].trim();
  let errorType: string | null = null;
  let errorMessage = firstLine;

  // Try to extract error type from "ErrorType: message" format
  const errorMatch = firstLine.match(ERROR_TYPE_REGEX);
  if (errorMatch) {
    const [, type, msg] = errorMatch;
    errorType = type;
    errorMessage = msg || "";
  }

  // Parse stack frames (lines starting with "at")
  const frames = lines
    .slice(1)
    .filter((line) => line.trim().startsWith("at "))
    .map(parseStackFrame);

  return {
    errorMessage,
    errorType,
    frames,
    raw: trace,
  };
};

export type StackTraceProps = ComponentProps<"div"> & {
  trace: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onFilePathClick?: (filePath: string, line?: number, column?: number) => void;
};

export const StackTrace = memo(
  ({
    trace,
    className,
    open,
    defaultOpen = false,
    onOpenChange,
    onFilePathClick,
    children,
    ...props
  }: StackTraceProps) => {
    const [isOpen, setIsOpen] = useControllableState({
      defaultProp: defaultOpen,
      onChange: onOpenChange,
      prop: open,
    });

    const parsedTrace = useMemo(() => parseStackTrace(trace), [trace]);

    const contextValue = useMemo(
      () => ({
        isOpen,
        onFilePathClick,
        raw: trace,
        setIsOpen,
        trace: parsedTrace,
      }),
      [parsedTrace, trace, isOpen, setIsOpen, onFilePathClick]
    );

    return (
      <StackTraceContext.Provider value={contextValue}>
        <div
          className={cn(
            "type-code not-prose w-full overflow-hidden rounded-lg border bg-background",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </StackTraceContext.Provider>
    );
  }
);

export type StackTraceHeaderProps = ComponentProps<typeof CollapsibleTrigger>;

export const StackTraceHeader = memo(
  ({ className, children, ...props }: StackTraceHeaderProps) => {
    const { isOpen, setIsOpen } = useStackTrace();

    return (
      <Collapsible onOpenChange={setIsOpen} open={isOpen}>
        <CollapsibleTrigger asChild {...props}>
          {/* Vendored change: the header holds its own buttons (copy), so it cannot
              be a <button>; upstream left a bare div that the keyboard could not
              reach. It is a focusable role="button" that toggles on Enter/Space —
              keys from the buttons inside it are theirs, not the header's. */}
          <div
            className={cn(
              "flex min-h-(--size-target-min) w-full cursor-pointer items-center gap-3 p-3 text-left transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50",
              className
            )}
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.currentTarget.click();
              }
            }}
            role="button"
            tabIndex={0}
          >
            {children}
          </div>
        </CollapsibleTrigger>
      </Collapsible>
    );
  }
);

export type StackTraceErrorProps = ComponentProps<"div">;

export const StackTraceError = memo(
  ({ className, children, ...props }: StackTraceErrorProps) => (
    <div
      className={cn(
        "flex flex-1 items-center gap-2 overflow-hidden",
        className
      )}
      {...props}
    >
      <Icon icon={AlertTriangleIcon} size="md" tone="error" />
      {children}
    </div>
  )
);

export type StackTraceErrorTypeProps = ComponentProps<"span">;

export const StackTraceErrorType = memo(
  ({ className, children, ...props }: StackTraceErrorTypeProps) => {
    const { trace } = useStackTrace();

    return (
      // Vendored change: dropped `font-semibold` — the root already carries
      // `type-code`, and a role's weight is not a call site's to override
      // (RULES §2 rule 1). `text-destructive-ink` alone still separates the
      // error type from the message beside it.
      <span
        className={cn("shrink-0 text-destructive-ink", className)}
        {...props}
      >
        {children ?? trace.errorType}
      </span>
    );
  }
);

export type StackTraceErrorMessageProps = ComponentProps<"span">;

export const StackTraceErrorMessage = memo(
  ({ className, children, ...props }: StackTraceErrorMessageProps) => {
    const { trace } = useStackTrace();

    return (
      <span className={cn("truncate text-foreground", className)} {...props}>
        {children ?? trace.errorMessage}
      </span>
    );
  }
);

export type StackTraceActionsProps = ComponentProps<"div">;

const handleActionsClick = (e: React.MouseEvent) => e.stopPropagation();
const handleActionsKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.stopPropagation();
  }
};

export const StackTraceActions = memo(
  ({ className, children, ...props }: StackTraceActionsProps) => (
    <div
      className={cn("flex shrink-0 items-center gap-1", className)}
      onClick={handleActionsClick}
      onKeyDown={handleActionsKeyDown}
      role="group"
      {...props}
    >
      {children}
    </div>
  )
);

export type StackTraceCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const StackTraceCopyButton = memo(
  ({
    onCopy,
    onError,
    timeout = 2000,
    className,
    children,
    "aria-label": ariaLabel,
    ...props
  }: StackTraceCopyButtonProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<number>(0);
    const { raw } = useStackTrace();

    const copyToClipboard = useCallback(async () => {
      if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
        onError?.(new Error("Clipboard API not available"));
        return;
      }

      try {
        await navigator.clipboard.writeText(raw);
        setIsCopied(true);
        onCopy?.();
        timeoutRef.current = window.setTimeout(
          () => setIsCopied(false),
          timeout
        );
      } catch (error) {
        onError?.(error as Error);
      }
    }, [raw, onCopy, onError, timeout]);

    useEffect(
      () => () => {
        window.clearTimeout(timeoutRef.current);
      },
      []
    );

    return (
      <Button
        aria-label={ariaLabel ?? (isCopied ? "Copied" : "Copy stack trace")}
        className={className}
        onClick={copyToClipboard}
        size="icon"
        variant="ghost"
        {...props}
      >
        {children ?? (
          <IconSwap
            active={isCopied ? "check" : "copy"}
            icons={{
              copy: <Icon icon={CopyIcon} size="sm" tone="inherit" />,
              check: <Icon icon={CheckIcon} size="sm" tone="success" />,
            }}
          />
        )}
      </Button>
    );
  }
);

export type StackTraceExpandButtonProps = ComponentProps<"div">;

export const StackTraceExpandButton = memo(
  ({ className, ...props }: StackTraceExpandButtonProps) => {
    const { isOpen } = useStackTrace();

    return (
      <div
        className={cn("flex size-7 items-center justify-center", className)}
        {...props}
      >
        <Icon
          className={cn("transition-transform", isOpen ? "rotate-180" : "rotate-0")}
          icon={ChevronDownIcon}
          size="md"
          tone="muted"
        />
      </div>
    );
  }
);

export type StackTraceContentProps = ComponentProps<
  typeof CollapsibleContent
> & {
  maxHeight?: number;
};

export const StackTraceContent = memo(
  ({
    className,
    maxHeight = 400,
    children,
    ...props
  }: StackTraceContentProps) => {
    const { isOpen } = useStackTrace();

    return (
      <Collapsible open={isOpen}>
        {/* Vendored change: dropped the vendored fade-on-open/fade-on-close
            utility pair from the third-party enter/exit animation library —
            those bypass the motion scale (the foreign-animation guard) and
            fade the panel in place, while `ui/collapsible.tsx`'s own
            CollapsibleContent already animates this exact panel on height
            via the expand/collapse utilities (RULES §4, "Disclosure
            animates its height"), so the disclosure plays correctly with no
            extra classes here. */}
        <CollapsibleContent
          className={cn("overflow-auto border-t bg-muted/30", className)}
          style={{ maxHeight }}
          {...props}
        >
          {children}
        </CollapsibleContent>
      </Collapsible>
    );
  }
);

export type StackTraceFramesProps = ComponentProps<"div"> & {
  showInternalFrames?: boolean;
};

interface FilePathButtonProps {
  frame: StackFrame;
  onFilePathClick?: (
    filePath: string,
    lineNumber?: number,
    columnNumber?: number
  ) => void;
}

const FilePathButton = memo(
  ({ frame, onFilePathClick }: FilePathButtonProps) => {
    const handleClick = useCallback(() => {
      if (frame.filePath) {
        onFilePathClick?.(
          frame.filePath,
          frame.lineNumber ?? undefined,
          frame.columnNumber ?? undefined
        );
      }
    }, [frame, onFilePathClick]);

    return (
      <button
        className={cn(
          /* Vendored change: `--color-action` (`--primary`) is a fill, not a
             text-safe shade (RULES §1 rule 3 / trap 2) — legible on one theme,
             not the other. `text-action-ink` is the role built for exactly
             this: a link-like hover colour that resolves correctly in both
             themes. */
          "underline decoration-dotted hover:text-action-ink",
          onFilePathClick && "cursor-pointer"
        )}
        disabled={!onFilePathClick}
        onClick={handleClick}
        type="button"
      >
        {frame.filePath}
        {frame.lineNumber !== null && `:${frame.lineNumber}`}
        {frame.columnNumber !== null && `:${frame.columnNumber}`}
      </button>
    );
  }
);

FilePathButton.displayName = "FilePathButton";

export const StackTraceFrames = memo(
  ({
    className,
    showInternalFrames = true,
    ...props
  }: StackTraceFramesProps) => {
    const { trace, onFilePathClick } = useStackTrace();

    const framesToShow = showInternalFrames
      ? trace.frames
      : trace.frames.filter((f) => !f.isInternal);

    return (
      <div className={cn("space-y-1 p-3", className)} {...props}>
        {framesToShow.map((frame) => (
          <div
            className={cn(
              "type-identifier",
              frame.isInternal
                ? "text-muted-foreground/50"
                : "text-foreground/90"
            )}
            key={frame.raw}
          >
            <span className="text-muted-foreground">at </span>
            {frame.functionName && (
              <span className={frame.isInternal ? "" : "text-foreground"}>
                {frame.functionName}{" "}
              </span>
            )}
            {frame.filePath && (
              <>
                <span className="text-muted-foreground">(</span>
                <FilePathButton
                  frame={frame}
                  onFilePathClick={onFilePathClick}
                />
                <span className="text-muted-foreground">)</span>
              </>
            )}
            {!(frame.filePath || frame.functionName) && (
              <span>{frame.raw.replace(AT_PREFIX_REGEX, "")}</span>
            )}
          </div>
        ))}
        {framesToShow.length === 0 && (
          <div className="type-small text-muted-foreground">No stack frames</div>
        )}
      </div>
    );
  }
);

StackTrace.displayName = "StackTrace";
StackTraceHeader.displayName = "StackTraceHeader";
StackTraceError.displayName = "StackTraceError";
StackTraceErrorType.displayName = "StackTraceErrorType";
StackTraceErrorMessage.displayName = "StackTraceErrorMessage";
StackTraceActions.displayName = "StackTraceActions";
StackTraceCopyButton.displayName = "StackTraceCopyButton";
StackTraceExpandButton.displayName = "StackTraceExpandButton";
StackTraceContent.displayName = "StackTraceContent";
StackTraceFrames.displayName = "StackTraceFrames";
