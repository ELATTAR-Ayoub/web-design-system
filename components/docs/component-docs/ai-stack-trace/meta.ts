import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-stack-trace",
  description:
    "A parsed error stack trace with the error type and message in a header, a copy action and collapsible frames whose file paths can be opened.",
  dependencies: ["source-foundation"],
  exports: ["StackTraceProps","StackTrace","StackTraceHeaderProps","StackTraceHeader","StackTraceErrorProps","StackTraceError","StackTraceErrorTypeProps","StackTraceErrorType","StackTraceErrorMessageProps","StackTraceErrorMessage","StackTraceActionsProps","StackTraceActions","StackTraceCopyButtonProps","StackTraceCopyButton","StackTraceExpandButtonProps","StackTraceExpandButton","StackTraceContentProps","StackTraceContent","StackTraceFramesProps","StackTraceFrames"],
  sourcePath: "components/ai-elements/stack-trace.tsx",
};
