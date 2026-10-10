"use client";

import * as React from "react";
import {
  AlertCircleIcon,
  CheckIcon,
  ExternalLinkIcon,
  PencilIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerDurationDisplay,
  AudioPlayerElement,
  AudioPlayerMuteButton,
  AudioPlayerPlayButton,
  AudioPlayerTimeDisplay,
  AudioPlayerTimeRange,
} from "@/components/ai-elements/audio-player";
import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  Attachments,
  type AttachmentData,
} from "@/components/ai-elements/attachments";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ai-elements/code-block";
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@/components/ai-elements/confirmation";
import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselNext,
  InlineCitationCarouselPrev,
  InlineCitationSource,
} from "@/components/ai-elements/inline-citation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from "@/components/ai-elements/message";
import {
  OpenIn,
  OpenInContent,
  OpenInLabel,
  OpenInLink,
  OpenInTrigger,
  type OpenInTarget,
} from "@/components/ai-elements/open-in-chat";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { Shimmer } from "@/components/ai-elements/shimmer";
import {
  Snippet,
  SnippetAddon,
  SnippetCopyButton,
  SnippetInput,
  SnippetText,
} from "@/components/ai-elements/snippet";
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput as ToolResult,
} from "@/components/ai-elements/tool";

import { usePresence } from "@/components/agent/core/use-presence";
import { GeneratedImage } from "@/components/agent/parts/generated-image";
import type { Run } from "@/components/agent/core/run";
import type {
  ActionTurn,
  AgentTransport,
  Attachment as AgentAttachment,
  Source as AgentSource,
  TextTurn,
  ToolTurn,
  UserTurn,
} from "@/components/agent/core/types";

import { RUN_IN_FLIGHT, toolApproval, toolState, stepChainStatus, type Reply } from "./reply-model";
import { toolOutput, type ImageStage, type ToolOutput as OutputData } from "./tool-output";
import { RunInline } from "./run-inline";
import { RECORD_CONFIRMATION } from "./step-status";
import {
  CopyGlyph,
  ProducedFiles,
  ReadAloudGlyph,
  ToolOutputView,
  codeLanguage,
  copyFailed,
  useCopy,
  useReadAloud,
} from "./workspace-outputs";

function useDisclosure(auto: boolean) {
  const [chosen, setChosen] = React.useState<boolean | null>(null);
  const [latched, setLatched] = React.useState(auto);
  if (auto && !latched) setLatched(true);
  return [chosen ?? latched, setChosen] as const;
}

const ACTION_ROW =
  "md:opacity-60 md:transition-opacity md:duration-fast md:group-hover:opacity-100 md:group-focus-within:opacity-100";

const humanise = (id: string) => id.replace(/[_-]+/g, " ").trim();

const toData = (a: AgentAttachment): AttachmentData => ({
  id: a.id,
  type: "file",
  url: a.url ?? "",
  mediaType: a.mime,
  filename: a.name,
});

const SourcesContext = React.createContext<AgentSource[]>([]);

const CITE = "#cite-";

export function linkCitations(text: string, sources: AgentSource[]): string {
  if (!sources.length || !text.includes("[")) return text;
  const known = new Set(sources.map((s) => s.n));
  return text
    .split(/(```[\s\S]*?(?:```|$)|`[^`\n]*`)/)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part.replace(/((?:\[\d{1,3}\])+)(?!\()/g, (run) => {
            const ns = [...run.matchAll(/\[(\d+)\]/g)].map((m) => Number(m[1])).filter((n) => known.has(n));
            return ns.length ? `[cite](${CITE}${ns.join("-")})` : run;
          }),
    )
    .join("");
}

function sourceUrl(s: AgentSource): string {
  try {
    return new URL(s.url).href;
  } catch {
    return `https://${s.domain}`;
  }
}

function Citation({ ns }: { ns: number[] }) {
  const sources = React.useContext(SourcesContext);
  const picked = ns.map((n) => sources.find((s) => s.n === n)).filter((s): s is AgentSource => Boolean(s));
  if (!picked.length) return null;
  return (
    <InlineCitation>
      <InlineCitationCard>
        <InlineCitationCardTrigger sources={picked.map(sourceUrl)} tabIndex={0} />
        <InlineCitationCardBody>
          <InlineCitationCarousel>
            {picked.length > 1 ? (
              <InlineCitationCarouselHeader>
                <InlineCitationCarouselPrev />
                <InlineCitationCarouselNext />
                <InlineCitationCarouselIndex />
              </InlineCitationCarouselHeader>
            ) : null}
            <InlineCitationCarouselContent>
              {picked.map((s) => (
                <InlineCitationCarouselItem key={s.id}>
                  <InlineCitationSource description={s.snippet} title={s.title} url={sourceUrl(s)} />
                </InlineCitationCarouselItem>
              ))}
            </InlineCitationCarouselContent>
          </InlineCitationCarousel>
        </InlineCitationCardBody>
      </InlineCitationCard>
    </InlineCitation>
  );
}

function MarkdownLink({ href, children }: React.ComponentProps<"a">) {
  if (href?.startsWith(CITE)) {
    const ns = href.slice(CITE.length).split("-").map(Number).filter(Number.isFinite);
    return <Citation ns={ns} />;
  }
  return (
    <a className="text-action-ink underline underline-offset-4" href={href} rel="noreferrer noopener" target="_blank">
      {children}
    </a>
  );
}

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

const SHELL = new Set(["sh", "bash", "shell", "zsh", "console", "terminal", "shellscript", "powershell", "cmd", "bat"]);

function MarkdownBlockCode({ className, children }: React.ComponentProps<"code">) {
  const language = /language-([\w+-]+)/.exec(className ?? "")?.[1] ?? "";
  const code = textOf(children).replace(/\n$/, "");
  const onCopy = () => toast.success("Copied to clipboard");

  if (SHELL.has(language.toLowerCase()) && !code.includes("\n") && code.length <= 160) {
    const command = code.replace(/^\$\s+/, "");
    return (
      <Snippet className="my-4 max-w-full" code={command}>
        <SnippetAddon className="pl-1">
          <SnippetText>$</SnippetText>
        </SnippetAddon>
        <SnippetInput aria-label="Command" />
        <SnippetAddon align="inline-end" className="pr-2">
          <SnippetCopyButton onCopy={onCopy} onError={copyFailed} />
        </SnippetAddon>
      </Snippet>
    );
  }

  return (
    <CodeBlock className="my-4" code={code} language={codeLanguage(language)}>
      <CodeBlockHeader>
        <CodeBlockTitle>
          <CodeBlockFilename>{language || "text"}</CodeBlockFilename>
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton onCopy={onCopy} onError={copyFailed} />
        </CodeBlockActions>
      </CodeBlockHeader>
    </CodeBlock>
  );
}

function MarkdownInlineCode({ className, children }: React.ComponentProps<"code">) {
  return <code className={cn("rounded-sm bg-muted px-1.5 py-0.5 type-code", className)}>{children}</code>;
}

const MARKDOWN_COMPONENTS = {
  a: MarkdownLink,
  code: MarkdownBlockCode,
  inlineCode: MarkdownInlineCode,
};

function Response({ turn, text, sources }: { turn: TextTurn; text: string; sources: AgentSource[] }) {
  return (
    <SourcesContext.Provider value={sources}>
      <MessageContent>
        <MessageResponse components={MARKDOWN_COMPONENTS} isAnimating={Boolean(turn.streaming)}>
          {linkCitations(text, sources)}
        </MessageResponse>
      </MessageContent>
    </SourcesContext.Provider>
  );
}

export type WorkspaceUserMessageProps = {
  turn: UserTurn;
  transport: AgentTransport;
  className?: string;
};

export function WorkspaceUserMessage({ turn, transport, className }: WorkspaceUserMessageProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(turn.text);
  const [saving, setSaving] = React.useState(false);
  const { copied, copy } = useCopy(turn.text);

  const branching = Boolean(transport.capabilities.branching);
  const canNavigate = branching && Boolean(transport.selectBranch);
  const canEdit = branching && Boolean(transport.editMessage);

  const all = turn.versions?.length ? turn.versions : [{ id: `${turn.id}-v1`, text: turn.text }];
  const active = Math.min(turn.activeVersion ?? all.length - 1, all.length - 1);
  const versions = canNavigate ? all : [{ ...all[active], text: turn.text }];
  const images = (turn.attachments ?? []).filter((a) => a.kind === "image");
  const files = (turn.attachments ?? []).filter((a) => a.kind !== "image");

  const save = async () => {
    const next = draft.trim();
    if (!next || next === turn.text || !transport.editMessage) return;
    setSaving(true);
    try {
      await transport.editMessage(turn.id, next);
      setEditing(false);
    } catch {
      toast.error("Couldn't save your edit. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = () => {
    setDraft(turn.text);
    setEditing(true);
  };

  if (editing) {
    return (
      <Message className={className} from="user">
        <form
          className="flex w-full flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <Textarea
            aria-label="Edit your message"
            autoFocus
            disabled={saving}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setEditing(false);
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                void save();
              }
            }}
            value={draft}
          />
          <div className="flex justify-end gap-2">
            <Button disabled={saving} onClick={() => setEditing(false)} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={!draft.trim() || draft.trim() === turn.text} loading={saving} type="submit">
              Save and resend
            </Button>
          </div>
        </form>
      </Message>
    );
  }

  return (
    <Message className={className} from="user">
      {images.length ? (
        <Attachments variant="grid">
          {images.map((a) => (
            <Attachment data={toData(a)} key={a.id}>
              <AttachmentPreview />
            </Attachment>
          ))}
        </Attachments>
      ) : null}
      {files.length ? (
        <Attachments className="ml-auto w-fit justify-end" variant="inline">
          {files.map((a) => (
            <Attachment className="cursor-default" data={toData(a)} key={a.id}>
              <AttachmentPreview />
              <AttachmentInfo />
            </Attachment>
          ))}
        </Attachments>
      ) : null}
      <MessageBranch
        defaultBranch={active}
        key={`${turn.id}:${versions.length}`}
        onBranchChange={(i) => transport.selectBranch?.(turn.id, i)}
      >
        <MessageBranchContent>
          {versions.map((v, i) => (
            <MessageContent key={v.id}>{i === active || !canNavigate ? turn.text : v.text}</MessageContent>
          ))}
        </MessageBranchContent>
        <MessageToolbar className={cn("mt-0 justify-end", ACTION_ROW)}>
          {canNavigate ? (
            <MessageBranchSelector>
              <MessageBranchPrevious />
              <MessageBranchPage />
              <MessageBranchNext />
            </MessageBranchSelector>
          ) : (
            <span />
          )}
          <MessageActions>
            <MessageAction label="Copy message" onClick={() => void copy()} tooltip="Copy">
              <CopyGlyph copied={copied} />
            </MessageAction>
            {canEdit ? (
              <MessageAction label="Edit message" onClick={startEditing} tooltip="Edit">
                <Icon icon={PencilIcon} size="sm" tone="inherit" aria-hidden />
              </MessageAction>
            ) : null}
          </MessageActions>
        </MessageToolbar>
      </MessageBranch>
    </Message>
  );
}

function ApprovalCode({
  turn,
  transport,
}: {
  turn: ActionTurn;
  transport: AgentTransport;
}) {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [checking, setChecking] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);
  const entry = transport.pendingApprovals.find((p) => p.turnId === turn.id);
  const errorId = `${turn.id}-code-error`;

  const submit = async () => {
    if (!code.trim() || !transport.approveWithCode) return;
    setChecking(true);
    try {
      const result = await transport.approveWithCode(code.trim());
      if (result === false) {
        setError("That code isn't right. Check it and try again.");
        setCode("");
        input.current?.focus();
      } else {
        setError(null);
      }
    } catch {
      setError("Couldn't check the code. Try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <ConfirmationActions className="w-full self-stretch">
      <form
        className="flex w-full flex-wrap items-start justify-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <Field className="min-w-48 flex-1">
          <Input
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? true : undefined}
            aria-label="Approval code"
            autoComplete="one-time-code"
            disabled={checking}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Approval code"
            ref={input}
            value={code}
          />
          <FieldError id={errorId}>{error}</FieldError>
        </Field>
        <ConfirmationAction disabled={!entry || checking} onClick={() => entry?.reject()} size="default" variant="outline">
          Reject
        </ConfirmationAction>
        <ConfirmationAction
          disabled={!transport.approveWithCode || !code.trim()}
          loading={checking}
          size="default"
          type="submit"
        >
          Approve
        </ConfirmationAction>
      </form>
    </ConfirmationActions>
  );
}

function ActionConfirmation({ turn, transport }: { turn: ActionTurn; transport: AgentTransport }) {
  const approval = toolApproval(turn);
  const state = toolState(turn);
  const entry = transport.pendingApprovals.find((p) => p.turnId === turn.id);
  const high = turn.params.risk === "high";

  return (
    <Confirmation
      approval={approval}
      className={state === "approval-requested" ? undefined : RECORD_CONFIRMATION}
      state={state}
    >
      <ConfirmationTitle>
        <ConfirmationRequest>
          {high
            ? `This is a high-risk action: ${humanise(turn.action)}. Enter your approval code to continue.`
            : `Allow the agent to ${humanise(turn.action)}?`}
        </ConfirmationRequest>
        <ConfirmationAccepted>
          <span className="inline-flex items-center gap-2">
            <Icon icon={CheckIcon} size="md" tone="success" />
            <span>Approved</span>
          </span>
        </ConfirmationAccepted>
        <ConfirmationRejected>
          <span className="inline-flex items-center gap-2">
            <Icon icon={XIcon} size="md" tone="error" />
            <span>{approval?.reason ? `Rejected: ${approval.reason}` : "Rejected"}</span>
          </span>
        </ConfirmationRejected>
      </ConfirmationTitle>
      {high ? (
        <ApprovalCode transport={transport} turn={turn} />
      ) : (
        <ConfirmationActions>
          <ConfirmationAction disabled={!entry} onClick={() => entry?.reject()} size="default" variant="outline">
            Reject
          </ConfirmationAction>
          <ConfirmationAction disabled={!entry} onClick={() => entry?.approve()} size="default">
            Approve
          </ConfirmationAction>
        </ConfirmationActions>
      )}
    </Confirmation>
  );
}

function ToolStepCard({
  turn,
  output,
  transport,
  onRetry,
}: {
  turn: ToolTurn | ActionTurn;
  output: OutputData | null;
  transport: AgentTransport;
  onRetry?: () => void;
}) {
  const state = toolState(turn);
  const [open, setOpen] = useDisclosure(state === "approval-requested" || state === "output-error" || state === "output-denied");
  const isTool = turn.kind === "tool";
  const name = isTool ? turn.name : turn.action;
  const params = turn.params;
  const drawnBelow = output !== null && output.kind !== "search" && output.kind !== "image";
  const owned = output?.kind === "stack-trace";
  const failed = state === "output-error" && !owned;
  const attempt = isTool && turn.attempt > 1 ? turn.attempt : 0;
  const rawResult = isTool && !drawnBelow ? turn.result : undefined;

  return (
    <Tool className="mb-0" onOpenChange={setOpen} open={open}>
      <ToolHeader
        state={state}
        title={attempt ? `${name} · attempt ${attempt}` : undefined}
        toolName={name}
        type="dynamic-tool"
      />
      <ToolContent>
        {Object.keys(params).length ? <ToolInput input={params} /> : null}
        {turn.kind === "action" ? <ActionConfirmation transport={transport} turn={turn} /> : null}
        <ToolResult
          errorText={failed ? turn.error : undefined}
          output={rawResult as React.ComponentProps<typeof ToolResult>["output"]}
        />
        {failed && onRetry ? (
          <Button onClick={onRetry} variant="outline">
            <Icon icon={RotateCcwIcon} size="md" tone="inherit" />
            Try again
          </Button>
        ) : null}
      </ToolContent>
    </Tool>
  );
}

export type WorkspaceReplyProps = {
  user: UserTurn;
  reply: Reply | null;
  transport: AgentTransport;
  busy: boolean;
  isLast: boolean;
  run?: Run | null;
  speak?: (text: string) => Promise<string>;
  openIn?: OpenInTarget[];
  onSend: (text: string) => void;
  composerEmpty?: boolean;
  className?: string;
};

function ReplyStatus({ children }: { children: string }) {
  return (
    <div role="status">
      <Shimmer as="span">{children}</Shimmer>
    </div>
  );
}

export function WorkspaceReply({
  user,
  reply,
  transport,
  busy,
  isLast,
  run,
  speak,
  openIn,
  onSend,
  composerEmpty = true,
  className,
}: WorkspaceReplyProps) {
  const turns = React.useMemo(() => reply?.turns ?? [], [reply]);
  const streaming = reply ? reply.streaming : busy && isLast;
  const connection = transport.runState?.connection ?? "connected";
  const reconnecting = isLast && connection !== "connected";

  const textTurns = turns.filter((t): t is TextTurn => t.kind === "text");
  const stepTurns = turns.filter((t): t is ToolTurn | ActionTurn => t.kind === "tool" || t.kind === "action");
  const errorTurns = turns.flatMap((t) => (t.kind === "error" ? [t] : []));
  // A fatal error owns the reply's one Retry.
  const fatalError = errorTurns.some((e) => e.fatal);
  const reasoningSteps = textTurns.flatMap((t) => t.reasoning?.steps ?? []);
  const reasoningMs = textTurns.reduce<number | undefined>(
    (sum, t) => (t.reasoning?.ms === undefined ? sum : (sum ?? 0) + t.reasoning.ms),
    undefined,
  );
  const sources = reply?.sources ?? [];

  const answerId = [...turns].reverse().find((t) => t.kind === "text")?.id ?? user.id;
  const retry = React.useCallback(() => {
    if (transport.regenerate && transport.capabilities.branching) void transport.regenerate(answerId);
    else onSend(user.text);
  }, [transport, answerId, user.text, onSend]);
  const canRetry = isLast && !busy;

  const outputs = stepTurns.flatMap((t) => {
    if (t.kind !== "tool") return [];
    const data = toolOutput(t);
    return data && data.kind !== "search" && data.kind !== "image" ? [{ turn: t, data }] : [];
  });
  const frames = stepTurns.flatMap((t) => {
    if (t.kind !== "tool") return [];
    const data = toolOutput(t);
    const image = (t.attachments ?? []).find((a) => a.kind === "image");
    if (data?.kind !== "image" && !image) return [];
    const stage: ImageStage =
      data?.kind === "image" ? data.stage
      : t.status === "error" ? "error"
      : t.status === "running" ? "generating"
      : "complete";
    return [{ turn: t, image, stage }];
  });
  const images = stepTurns.flatMap((t) =>
    t.kind === "tool" ? (t.attachments ?? []).filter((a) => !frames.some((f) => f.image === a)) : [],
  );

  const hasSteps = stepTurns.length > 0;
  const hasText = textTurns.some((t) => t.text.trim());
  const thinkingOnly = !hasSteps && reasoningSteps.length > 0;
  const stepCount = reasoningSteps.length + stepTurns.length;
  const needsYou = stepTurns.some((t) => t.kind === "action" && t.approval === "pending");
  const stepRunning = stepTurns.some((t) => t.status === "running");
  const working = streaming && (stepRunning || !hasText);
  const [chainChoice, setChainChoice] = React.useState<boolean | null>(null);
  const anyStepFailed = stepTurns.some((t) => toolState(t) === "output-error");
  const chainOpen = chainChoice ?? (streaming || needsYou || anyStepFailed);

  /* The question's own selector pages the edited pair; the answer shows one only with more versions. */
  const editVersions = user.versions?.length ?? 0;
  const branchTurn = [...textTurns]
    .reverse()
    .find((t) => (t.regenerations?.length ?? 0) > 1 && (t.regenerations?.length ?? 0) > editVersions);
  const canNavigate = Boolean(transport.capabilities.branching && transport.selectBranch);
  const branchVersions = canNavigate && branchTurn ? (branchTurn.regenerations ?? []) : [];
  const branchActive = branchTurn ? Math.min(branchTurn.activeVersion ?? 0, Math.max(branchVersions.length - 1, 0)) : 0;

  const finished = Boolean(reply) && !streaming && !(run && RUN_IN_FLIGHT.has(run.status));
  const copy = useCopy(reply?.text ?? "");
  const readAloud = useReadAloud(reply?.text ?? "", speak);
  const player = usePresence(Boolean(readAloud?.open));

  const lastText = textTurns.at(-1);
  const suggestions = isLast && finished && composerEmpty ? (lastText?.suggestions ?? []) : [];

  const waiting = streaming && !hasText && !hasSteps && !thinkingOnly && !errorTurns.length && !run;

  if (!reply && !waiting && !run && !reconnecting) return null;

  const showError = isLast && !errorTurns.length && transport.error && !busy;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Message className="max-w-full" from="assistant">
        <MessageBranch
          className="gap-4"
          defaultBranch={branchActive}
          key={`${branchTurn?.id ?? "single"}:${branchVersions.length}`}
          onBranchChange={(i) => branchTurn && transport.selectBranch?.(branchTurn.id, i)}
        >
          {thinkingOnly ? (
            <Reasoning
              className="mb-0"
              duration={streaming && !hasText ? undefined : reasoningMs === undefined ? undefined : Math.ceil(reasoningMs / 1000)}
              isStreaming={streaming && !hasText}
            >
              <ReasoningTrigger />
              <ReasoningContent>{reasoningSteps.join("\n\n")}</ReasoningContent>
            </Reasoning>
          ) : null}

          {hasSteps ? (
            <ChainOfThought onOpenChange={setChainChoice} open={chainOpen}>
              <ChainOfThoughtHeader>
                {working ? <Shimmer as="span">Working…</Shimmer> : `Worked through ${stepCount} ${stepCount === 1 ? "step" : "steps"}`}
              </ChainOfThoughtHeader>
              <ChainOfThoughtContent>
                {reasoningSteps.map((step, i) => (
                  <ChainOfThoughtStep key={`r${i}`} label={step} status="complete" />
                ))}
                {stepTurns.map((t) => {
                  const data = t.kind === "tool" ? toolOutput(t) : null;
                  const status = stepChainStatus(t.status === "running" ? "running" : "done");
                  if (t.kind === "tool" && data?.kind === "search" && t.status !== "error") {
                    return (
                      <ChainOfThoughtStep
                        icon={SearchIcon}
                        key={t.id}
                        label={`${t.status === "running" ? "Searching for" : "Searched for"} “${data.query}”`}
                        status={status}
                      >
                        <ChainOfThoughtSearchResults>
                          {data.results.map((r) => (
                            <ChainOfThoughtSearchResult asChild key={r.url}>
                              <a href={r.url} rel="noreferrer noopener" target="_blank" title={r.title}>
                                {r.domain}
                              </a>
                            </ChainOfThoughtSearchResult>
                          ))}
                        </ChainOfThoughtSearchResults>
                      </ChainOfThoughtStep>
                    );
                  }
                  return (
                    <ChainOfThoughtStep
                      key={t.id}
                      label={
                        <ToolStepCard
                          onRetry={canRetry && !fatalError ? retry : undefined}
                          output={data}
                          transport={transport}
                          turn={t}
                        />
                      }
                      status={status}
                    />
                  );
                })}
              </ChainOfThoughtContent>
            </ChainOfThought>
          ) : null}

          {waiting && !reconnecting ? <ReplyStatus>Thinking…</ReplyStatus> : null}

          {textTurns.map((t) => {
            if (!t.text.trim()) return null;
            if (t === branchTurn && branchVersions.length) {
              return (
                <MessageBranchContent key={t.id}>
                  {branchVersions.map((v, i) => (
                    <Response
                      key={v.id}
                      sources={sources}
                      text={i === branchActive ? t.text : v.text}
                      turn={t}
                    />
                  ))}
                </MessageBranchContent>
              );
            }
            return <Response key={t.id} sources={sources} text={t.text} turn={t} />;
          })}

          {outputs.map(({ turn, data }) => (
            <ToolOutputView
              key={turn.id}
              onRetry={canRetry ? retry : undefined}
              output={data}
              running={turn.status === "running"}
              state={toolState(turn)}
            />
          ))}

          {frames.map(({ turn, image, stage }) => (
            <GeneratedImage key={turn.id} stage={stage} onRetry={canRetry ? retry : undefined} className="max-w-sm">
              {image?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image.url} alt={image.name} />
              ) : null}
            </GeneratedImage>
          ))}

          {images.length ? <ProducedFiles attachments={images} /> : null}
          {textTurns.some((t) => t.attachments?.length) ? (
            <ProducedFiles attachments={textTurns.flatMap((t) => t.attachments ?? [])} />
          ) : null}

          {errorTurns.map((e) => (
            <Alert key={e.id} variant="destructive">
              <Icon icon={AlertCircleIcon} size="md" tone="inherit" />
              <AlertTitle>{e.fatal ? "Something went wrong" : "That step didn't finish"}</AlertTitle>
              <AlertDescription>
                <p>{e.message}</p>
                {e.fatal && canRetry ? (
                  <Button className="mt-3" onClick={retry} variant="outline">
                    <Icon icon={RotateCcwIcon} size="md" tone="inherit" />
                    Retry
                  </Button>
                ) : null}
              </AlertDescription>
            </Alert>
          ))}
          {showError ? (
            <Alert variant="destructive">
              <Icon icon={AlertCircleIcon} size="md" tone="inherit" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>
                <p>{transport.error?.message}</p>
                <Button className="mt-3" onClick={retry} variant="outline">
                  <Icon icon={RotateCcwIcon} size="md" tone="inherit" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}

          {reconnecting ? <ReplyStatus>Reconnecting…</ReplyStatus> : null}

          {run ? <RunInline run={run} transport={transport} /> : null}

          {sources.length ? (
            <Sources className="mb-0">
              <SourcesTrigger count={sources.length} />
              <SourcesContent>
                {sources.map((s) => (
                  <Source href={s.url} key={s.id} title={s.title} />
                ))}
              </SourcesContent>
            </Sources>
          ) : null}

          {finished ? (
            <MessageToolbar className={cn("mt-0", ACTION_ROW)}>
              {canNavigate && branchVersions.length > 1 ? (
                <MessageBranchSelector>
                  <MessageBranchPrevious />
                  <MessageBranchPage />
                  <MessageBranchNext />
                </MessageBranchSelector>
              ) : (
                <span />
              )}
              <MessageActions>
                <MessageAction label="Copy reply" onClick={() => void copy.copy()} tooltip="Copy">
                  <CopyGlyph copied={copy.copied} />
                </MessageAction>
                {transport.regenerate && transport.capabilities.branching ? (
                  <MessageAction
                    label="Regenerate"
                    onClick={() => void transport.regenerate?.(answerId)}
                    tooltip="Regenerate"
                  >
                    <Icon icon={RefreshCwIcon} size="sm" tone="inherit" aria-hidden />
                  </MessageAction>
                ) : null}
                {readAloud ? (
                  <MessageAction
                    label={readAloud.open ? "Stop reading aloud" : readAloud.loading ? "Preparing audio" : "Read aloud"}
                    loading={readAloud.loading}
                    onClick={readAloud.toggle}
                    tooltip={readAloud.open ? "Stop" : "Read aloud"}
                  >
                    <ReadAloudGlyph active={readAloud.open} />
                  </MessageAction>
                ) : null}
                {openIn && openIn.length > 0 ? (
                  <OpenIn query={user.text}>
                    <OpenInTrigger>
                      <MessageAction label="Open in…" tooltip="Open in…">
                        <Icon icon={ExternalLinkIcon} size="sm" tone="inherit" aria-hidden />
                      </MessageAction>
                    </OpenInTrigger>
                    <OpenInContent>
                      <OpenInLabel>Open in</OpenInLabel>
                      {openIn.map((t) => (
                        <OpenInLink key={t.id} target={t} />
                      ))}
                    </OpenInContent>
                  </OpenIn>
                ) : null}
              </MessageActions>
            </MessageToolbar>
          ) : null}

          {player.mounted && readAloud?.url ? (
            <div className={cn("rounded-lg border bg-card p-2", player.className)}>
              <AudioPlayer>
                <AudioPlayerElement autoPlay src={readAloud.url} />
                <AudioPlayerControlBar>
                  <AudioPlayerPlayButton />
                  <AudioPlayerTimeDisplay />
                  <AudioPlayerTimeRange />
                  <AudioPlayerDurationDisplay />
                  <AudioPlayerMuteButton />
                </AudioPlayerControlBar>
              </AudioPlayer>
            </div>
          ) : null}
        </MessageBranch>
      </Message>

      {suggestions.length ? (
        <Suggestions>
          {suggestions.map((s) => (
            <Suggestion key={s} onClick={onSend} suggestion={s} />
          ))}
        </Suggestions>
      ) : null}
    </div>
  );
}
