"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IconSwap } from "@/components/ui/icon-swap";
import { cn } from "@/lib/utils";
import Ansi from "ansi-to-react";
import { CheckIcon, CopyIcon, TerminalIcon, Trash2Icon } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface TerminalContextType {
  output: string;
  isStreaming: boolean;
  autoScroll: boolean;
  onClear?: () => void;
}

const TerminalContext = createContext<TerminalContextType>({
  autoScroll: true,
  isStreaming: false,
  output: "",
});

export type TerminalHeaderProps = HTMLAttributes<HTMLDivElement>;

export const TerminalHeader = ({
  className,
  children,
  ...props
}: TerminalHeaderProps) => (
  <div
    className={cn("flex items-center justify-between border-b px-4 py-2", className)}
    {...props}
  >
    {children}
  </div>
);

export type TerminalTitleProps = HTMLAttributes<HTMLDivElement>;

export const TerminalTitle = ({
  className,
  children,
  ...props
}: TerminalTitleProps) => (
  <div
    className={cn("type-small flex items-center gap-2 text-muted-foreground", className)}
    {...props}
  >
    <Icon icon={TerminalIcon} size="sm" tone="inherit" />
    {children ?? "Terminal"}
  </div>
);

export type TerminalStatusProps = HTMLAttributes<HTMLDivElement>;

export const TerminalStatus = ({
  className,
  children,
  ...props
}: TerminalStatusProps) => {
  const { isStreaming } = useContext(TerminalContext);

  if (!isStreaming) {
    return null;
  }

  return (
    <div
      className={cn("type-small flex items-center gap-2 text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export type TerminalActionsProps = HTMLAttributes<HTMLDivElement>;

export const TerminalActions = ({
  className,
  children,
  ...props
}: TerminalActionsProps) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>
    {children}
  </div>
);

export type TerminalCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const TerminalCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  "aria-label": ariaLabel,
  ...props
}: TerminalCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number>(0);
  const { output } = useContext(TerminalContext);

  const copyToClipboard = useCallback(async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      onError?.(new Error("Clipboard API not available"));
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      onCopy?.();
      timeoutRef.current = window.setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [output, onCopy, onError, timeout]);

  useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current);
    },
    []
  );

  return (
    <Button
      aria-label={ariaLabel ?? (isCopied ? "Copied" : "Copy output")}
      className={cn("shrink-0", className)}
      onClick={copyToClipboard}
      size="icon-sm"
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
};

export type TerminalClearButtonProps = ComponentProps<typeof Button>;

export const TerminalClearButton = ({
  children,
  className,
  "aria-label": ariaLabel,
  ...props
}: TerminalClearButtonProps) => {
  const { onClear } = useContext(TerminalContext);

  if (!onClear) {
    return null;
  }

  return (
    <Button
      aria-label={ariaLabel ?? "Clear terminal"}
      className={cn("shrink-0", className)}
      onClick={onClear}
      size="icon-sm"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon icon={Trash2Icon} size="sm" tone="inherit" />}
    </Button>
  );
};

export type TerminalContentProps = HTMLAttributes<HTMLDivElement>;

export const TerminalContent = ({
  className,
  children,
  ...props
}: TerminalContentProps) => {
  const { output, isStreaming, autoScroll } = useContext(TerminalContext);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output, autoScroll]);

  return (
    <div
      className={cn("terminal-ansi max-h-96 overflow-auto p-4", className)}
      ref={containerRef}
      {...props}
    >
      {children ?? (
        <pre className="type-code whitespace-pre-wrap break-words">
          {/* Vendored change: `useClasses` makes ansi-to-react emit
              `ansi-<colour>-fg|-bg` / `ansi-<decoration>` classes instead of
              inline rgb() styles, which ignore the theme (white output
              vanished in light mode). The token-based rules for those classes
              belong in styles/utilities.css. */}
          <Ansi useClasses>{output}</Ansi>
          {isStreaming && (
            /* The streaming cursor is the same idea as the OTP caret — a mark
               that says "input lands here" — so it plays the same named
               blink (`anim-caret`) rather than the vendored pulse utility,
               which both bypasses the motion scale (RULES §6's
               foreign-animation guard) and reads as a loading dim rather
               than a text-insertion caret. */
            <span className="anim-caret ml-0.5 inline-block h-4 w-2 bg-foreground" />
          )}
        </pre>
      )}
    </div>
  );
};

export type TerminalProps = HTMLAttributes<HTMLDivElement> & {
  output: string;
  isStreaming?: boolean;
  autoScroll?: boolean;
  onClear?: () => void;
};

export const Terminal = ({
  output,
  isStreaming = false,
  autoScroll = true,
  onClear,
  className,
  children,
  ...props
}: TerminalProps) => {
  const contextValue = useMemo(
    () => ({ autoScroll, isStreaming, onClear, output }),
    [autoScroll, isStreaming, onClear, output]
  );

  return (
    <TerminalContext.Provider value={contextValue}>
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-lg border bg-background text-foreground",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <TerminalHeader>
              <TerminalTitle />
              <div className="flex items-center gap-1">
                <TerminalStatus />
                <TerminalActions>
                  <TerminalCopyButton />
                  {onClear && <TerminalClearButton />}
                </TerminalActions>
              </div>
            </TerminalHeader>
            <TerminalContent />
          </>
        )}
      </div>
    </TerminalContext.Provider>
  );
};
