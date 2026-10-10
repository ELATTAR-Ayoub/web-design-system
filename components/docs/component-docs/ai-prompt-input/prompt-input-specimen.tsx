"use client";

import * as React from "react";
import { GlobeIcon } from "lucide-react";

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputProvider,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import { Icon } from "@/components/ui/icon";
import { TooltipProvider } from "@/components/ui/tooltip";

type Status = "ready" | "submitted" | "streaming" | "error";

function StagedFiles() {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) return null;
  return (
    <PromptInputHeader>
      <Attachments variant="inline">
        {attachments.files.map((file) => (
          <Attachment data={file} key={file.id} onRemove={() => attachments.remove(file.id)}>
            <AttachmentPreview />
            <AttachmentInfo />
            <AttachmentRemove />
          </Attachment>
        ))}
      </Attachments>
    </PromptInputHeader>
  );
}

export function PromptInputSpecimen({
  status = "ready",
  disabled = false,
  initialInput,
  withSelect = true,
}: {
  status?: Status;
  disabled?: boolean;
  initialInput?: string;
  withSelect?: boolean;
}) {
  const [sent, setSent] = React.useState<PromptInputMessage | null>(null);
  const [model, setModel] = React.useState("fast");
  const [search, setSearch] = React.useState(false);

  return (
    <TooltipProvider>
      <div className="flex w-full max-w-xl flex-col gap-3">
        <PromptInputProvider initialInput={initialInput}>
          <PromptInput onSubmit={(message) => setSent(message)} maxFiles={4}>
            <StagedFiles />
            <PromptInputBody>
              <PromptInputTextarea disabled={disabled} aria-label="Message" placeholder="Ask the agent anything" />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger aria-label="Add" disabled={disabled} />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <PromptInputButton
                  aria-label="Search the web"
                  aria-pressed={search}
                  disabled={disabled}
                  onClick={() => setSearch((v) => !v)}
                  tooltip="Search the web for this message"
                  variant={search ? "default" : "ghost"}
                >
                  <Icon icon={GlobeIcon} size="md" />
                </PromptInputButton>
                {withSelect ? (
                  <PromptInputSelect disabled={disabled} onValueChange={setModel} value={model}>
                    <PromptInputSelectTrigger aria-label="Model">
                      <PromptInputSelectValue />
                    </PromptInputSelectTrigger>
                    <PromptInputSelectContent>
                      <PromptInputSelectItem value="fast">Fast</PromptInputSelectItem>
                      <PromptInputSelectItem value="deep">Deep</PromptInputSelectItem>
                    </PromptInputSelectContent>
                  </PromptInputSelect>
                ) : null}
              </PromptInputTools>
              <PromptInputSubmit disabled={disabled} onStop={() => undefined} status={status} />
            </PromptInputFooter>
          </PromptInput>
        </PromptInputProvider>
        <p className="type-small text-muted-foreground" aria-live="polite">
          {sent ? `Sent “${sent.text}” with ${sent.files.length} file${sent.files.length === 1 ? "" : "s"}.` : "Nothing sent yet."}
        </p>
      </div>
    </TooltipProvider>
  );
}

export function SubmitStatuses() {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        {(["ready", "submitted", "streaming", "error"] as const).map((status) => (
          <PromptInput key={status} className="w-auto" onSubmit={() => undefined}>
            <PromptInputFooter>
              <PromptInputSubmit status={status} onStop={() => undefined} />
            </PromptInputFooter>
          </PromptInput>
        ))}
      </div>
    </TooltipProvider>
  );
}
