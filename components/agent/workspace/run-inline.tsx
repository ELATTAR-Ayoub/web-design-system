"use client";

/**
 * Run control and planning, inline in the reply that started the run.
 *
 * `RunInline` tells the run's whole story by `run.status`: the proposed Plan
 * (edit a step, View as workflow, Run plan), then the Task with its steps and
 * Pause / Resume / Cancel, a low-confidence step asking through a
 * Confirmation, "Undo changes" once there is something reversible, and the
 * handoff form when a person has to take over. `RunQueue` is the Queue docked
 * above the composer.
 */

import { useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
  FileTextIcon,
  ListChecksIcon,
  MinusIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  RotateCcwIcon,
  SendHorizontalIcon,
  Trash2Icon,
  Undo2Icon,
  WorkflowIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { compensationOrder, RUN_STATUS_LABEL } from "@/components/agent/core/run";
import type { ActivityEntry, Effect, PlanStep, Run, RunStatus } from "@/components/agent/core/run";
import type { AgentTransport } from "@/components/agent/core/types";
import { queueMessages } from "@/components/agent/workspace/reply-model";
import { formatDuration, RECORD_CONFIRMATION, StepStatusMark } from "@/components/agent/workspace/step-status";
import { WorkflowDialog } from "@/components/agent/workspace/workflow-dialog";
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
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "@/components/ai-elements/plan";
import {
  Queue,
  QueueItem,
  QueueItemAction,
  QueueItemActions,
  QueueItemAttachment,
  QueueItemContent,
  QueueItemFile,
  QueueItemImage,
  QueueItemIndicator,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from "@/components/ai-elements/queue";
import {
  Question,
  QuestionActions,
  QuestionDescription,
  QuestionInput,
  QuestionOption,
  QuestionOptions,
  QuestionPrompt,
  QuestionSubmit,
} from "@/components/ai-elements/question";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Task, TaskContent, TaskItem, TaskTrigger } from "@/components/ai-elements/task";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type RunInlineProps = {
  transport: AgentTransport;
  run: Run;
  className?: string;
};

const HANDOFF_OWNERS = ["Me", "Support team", "On-call engineer"] as const;
const CANCELLABLE: ReadonlySet<RunStatus> = new Set(["running", "paused", "waiting_for_approval", "queued"]);
const ERROR_STATUSES: ReadonlySet<RunStatus> = new Set(["partially_failed", "handoff_required", "cancelled"]);

/* ── Plan approval notices (conversation 4) ─────────────────────────────── */

/**
 * Why the plan on offer was not simply approved: an approval that expired, or
 * one for an older version that the newer plan replaced. Read from the
 * structured `reason` on the latest approval entry of the run's timeline; a
 * later "Plan edited" entry carries none and clears it.
 */
export function planNotice(timeline: ActivityEntry[] | undefined): { kind: "expired" | "stale"; text: string } | null {
  const last = [...(timeline ?? [])].reverse().find((e) => e.kind === "approval");
  if (last?.reason === "approval_expired") return { kind: "expired", text: last.text };
  if (last?.reason === "approval_stale") return { kind: "stale", text: last.text };
  return null;
}

/* ── Plan ───────────────────────────────────────────────────────────────── */

function ProposedPlan({ transport, run, className }: RunInlineProps) {
  // Local until the plan runs; reset by keying this component on the version.
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [workflowOpen, setWorkflowOpen] = useState(false);

  const plan: PlanStep[] = run.plan.map((s) => (edits[s.id] ? { ...s, title: edits[s.id] } : s));
  const edited = plan.some((s, i) => s.title !== run.plan[i].title);
  const streaming = run.plan.length === 0;
  const notice = planNotice(transport.runState?.timeline);
  const canApprove = Boolean(transport.approvePlan);

  const setTitle = (id: string, title: string) => {
    setEdits((prev) => ({ ...prev, [id]: title }));
    toast.success("Step updated. Run the plan to use it.");
  };
  const save = (id: string) => {
    const title = draft.trim();
    if (title && title !== run.plan.find((s) => s.id === id)?.title) setTitle(id, title);
    setEditing(null);
  };

  return (
    <Plan className={className} defaultOpen isStreaming={streaming}>
      <PlanHeader>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <Icon icon={FileTextIcon} size="md" tone="muted" />
            <PlanTitle>{run.goal}</PlanTitle>
          </div>
          <PlanDescription>
            {streaming
              ? "Drafting the plan…"
              : `${plan.length} ${plan.length === 1 ? "step" : "steps"}${run.version > 1 ? ` · Plan v${run.version}` : ""}`}
          </PlanDescription>
        </div>
        <PlanAction className="flex items-center gap-1">
          <Button
            aria-label="View as workflow"
            disabled={plan.length === 0}
            onClick={() => setWorkflowOpen(true)}
            size="icon"
            variant="ghost"
          >
            <Icon icon={WorkflowIcon} size="sm" tone="inherit" />
          </Button>
          <PlanTrigger />
        </PlanAction>
      </PlanHeader>
      <PlanContent>
        <div className="flex flex-col gap-3">
          {notice && (
            <Confirmation
              approval={{ id: `plan-${run.version}`, approved: false, reason: notice.text }}
              className={RECORD_CONFIRMATION}
              state="output-denied"
            >
              <ConfirmationTitle>
                <ConfirmationRejected>
                  <span className="inline-flex items-center gap-2">
                    <Icon icon={XIcon} size="sm" tone="error" />
                    <span>{notice.text}</span>
                  </span>
                </ConfirmationRejected>
              </ConfirmationTitle>
            </Confirmation>
          )}
          <ol className="flex flex-col gap-2">
            {plan.map((step, i) => (
              <li className="flex items-start gap-3" key={step.id}>
                <span className="mt-1 w-5 shrink-0 text-right type-number-sm text-muted-foreground">{i + 1}</span>
                {editing === step.id ? (
                  <form
                    className="flex min-w-0 flex-1 items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      save(step.id);
                    }}
                  >
                    <Input
                      aria-label={`Title of step ${i + 1}`}
                      autoFocus
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Escape" && setEditing(null)}
                      value={draft}
                    />
                    <Button size="sm" type="submit">
                      Save
                    </Button>
                    <Button onClick={() => setEditing(null)} size="sm" type="button" variant="ghost">
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <>
                    <div className="min-w-0 flex-1 py-1">
                      <p className="type-small">{step.title}</p>
                      {step.detail && <p className="type-small text-muted-foreground">{step.detail}</p>}
                    </div>
                    <Button
                      aria-label={`Edit step ${i + 1}`}
                      className="-my-1.5 shrink-0"
                      onClick={() => {
                        setDraft(step.title);
                        setEditing(step.id);
                      }}
                      size="icon"
                      variant="ghost"
                    >
                      <Icon icon={PencilIcon} size="sm" tone="inherit" />
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ol>
          {!streaming && canApprove && (
            <Confirmation approval={{ id: `plan-${run.version}` }} state="approval-requested">
              <ConfirmationTitle>
                <ConfirmationRequest>{`Approve plan v${run.version} to start the run.`}</ConfirmationRequest>
              </ConfirmationTitle>
              <ConfirmationActions>
                <ConfirmationAction
                  onClick={() => {
                    transport.approvePlan?.(run.version, edited ? plan : undefined);
                    toast.success(`Running plan v${run.version}`);
                  }}
                >
                  <Icon icon={PlayIcon} size="sm" tone="inherit" />
                  Run plan
                </ConfirmationAction>
              </ConfirmationActions>
            </Confirmation>
          )}
        </div>
      </PlanContent>
      <WorkflowDialog
        onEditStep={setTitle}
        onOpenChange={setWorkflowOpen}
        open={workflowOpen}
        run={{ ...run, plan }}
      />
    </Plan>
  );
}

/* ── Task ───────────────────────────────────────────────────────────────── */

type Answer = "verified" | "skipped";

function StepRow({
  transport,
  run,
  step,
  effects,
  answer,
  onAnswer,
  askFirst,
}: {
  transport: AgentTransport;
  run: Run;
  step: PlanStep;
  effects: Effect[];
  answer?: Answer;
  onAnswer: (id: string, answer: Answer) => void;
  /** True only for the first unsettled low-confidence step: one question at a time. */
  askFirst: boolean;
}) {
  const unsettled = step.status === "running" || step.status === "pending";
  const asks = askFirst && step.confidence === "low" && unsettled && (step.status === "running" || run.status === "waiting_for_approval");
  const canVerify = Boolean(transport.verifyStep);
  const canSkip = Boolean(transport.skipStep);
  const failedEffects = effects.filter((e) => e.status === "failed");

  return (
    <TaskItem className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <StepStatusMark status={step.status} />
        {step.status === "running" ? (
          <Shimmer as="span" className="type-small">{step.title}</Shimmer>
        ) : (
          <span className={cn("type-small", step.status === "pending" || step.status === "skipped" ? "text-muted-foreground" : "text-foreground")}>
            {step.title}
          </span>
        )}
        {step.ms !== undefined && <span className="ml-auto type-small text-muted-foreground">{formatDuration(step.ms)}</span>}
        {step.status === "failed" && transport.retryStep && (
          <Button
            className={step.ms === undefined ? "ml-auto" : undefined}
            onClick={() => {
              transport.retryStep?.(step.id);
              toast.success(`Retrying "${step.title}"`);
            }}
            size="sm"
            variant="outline"
          >
            <Icon icon={RotateCcwIcon} size="sm" tone="inherit" />
            Retry
          </Button>
        )}
      </div>
      {(asks || answer) && (canVerify || canSkip || answer) && (
        <Confirmation
          approval={
            answer
              ? { id: step.id, approved: answer === "verified" }
              : { id: step.id }
          }
          className={answer ? RECORD_CONFIRMATION : undefined}
          state={answer ? "approval-responded" : "approval-requested"}
        >
          <ConfirmationTitle>
            <ConfirmationRequest>This step is low confidence. Verify it before it goes ahead, or skip it.</ConfirmationRequest>
            <ConfirmationAccepted>
              <span className="inline-flex items-center gap-2">
                <Icon icon={CheckIcon} size="sm" tone="success" />
                <span>Verified</span>
              </span>
            </ConfirmationAccepted>
            <ConfirmationRejected>
              <span className="inline-flex items-center gap-2">
                <Icon icon={MinusIcon} size="sm" tone="muted" />
                <span>Skipped</span>
              </span>
            </ConfirmationRejected>
          </ConfirmationTitle>
          <ConfirmationActions>
            {canSkip && (
              <ConfirmationAction
                onClick={() => {
                  transport.skipStep?.(step.id);
                  onAnswer(step.id, "skipped");
                  toast.success(`Skipped "${step.title}"`);
                }}
                variant="outline"
              >
                Skip
              </ConfirmationAction>
            )}
            {canVerify && (
              <ConfirmationAction
                onClick={() => {
                  transport.verifyStep?.(step.id);
                  onAnswer(step.id, "verified");
                  toast.success(`Verified "${step.title}"`);
                }}
              >
                Verify
              </ConfirmationAction>
            )}
          </ConfirmationActions>
        </Confirmation>
      )}
      {failedEffects.map((effect) => (
        <div className="flex items-center gap-2 pl-6" key={effect.id}>
          <span className="min-w-0 flex-1 type-small text-destructive-ink">
            {effect.description}
            {effect.error ? `: ${effect.error}` : ""}
          </span>
          {transport.retryEffect && (
            <Button
              aria-label={`Retry: ${effect.description}`}
              onClick={() => {
                transport.retryEffect?.(effect.id);
                toast.success(`Retrying "${effect.description}"`);
              }}
              size="sm"
              variant="outline"
            >
              <Icon icon={RotateCcwIcon} size="sm" tone="inherit" />
              Retry
            </Button>
          )}
        </div>
      ))}
    </TaskItem>
  );
}

function RunTask({ transport, run, className }: RunInlineProps) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const caps = transport.capabilities;
  const done = run.plan.filter((s) => s.status === "done").length;
  const canPause = Boolean(caps.pause && transport.pause) && run.status === "running";
  const canResume = Boolean(caps.pause && transport.resume) && run.status === "paused";
  const canCancel = Boolean(transport.cancel) && CANCELLABLE.has(run.status);
  const { reverse, irreversible } = compensationOrder(run);
  const askingId = run.plan.find((s) => s.confidence === "low" && (s.status === "running" || s.status === "pending"))?.id;
  const canUndo = run.status === "completed" && reverse.length > 0 && Boolean(caps.compensation && transport.compensate);

  return (
    <Task className={cn("flex flex-col gap-3", className)} defaultOpen>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Task's default glyph is a magnifier (research steps); a run's steps are a checklist. */}
        <TaskTrigger className="min-w-0 flex-1" title={`${run.goal} · ${done} of ${run.plan.length}`}>
          <button
            type="button"
            className="relative after:absolute after:inset-x-0 after:-inset-y-3 flex w-full cursor-pointer items-center gap-2 text-left type-small text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon icon={ListChecksIcon} size="sm" tone="inherit" />
            <span className="min-w-0 truncate">{`${run.goal} · ${done} of ${run.plan.length}`}</span>
            <Icon className="transition-transform group-data-[state=open]:rotate-180" icon={ChevronDownIcon} size="sm" tone="inherit" />
          </button>
        </TaskTrigger>
        <div className="flex items-center gap-2">
          {canPause && (
            <Button
              onClick={() => {
                transport.pause?.();
                toast.success("Pausing after this step");
              }}
              size="sm"
              variant="outline"
            >
              <Icon icon={PauseIcon} size="sm" tone="inherit" />
              Pause
            </Button>
          )}
          {canResume && (
            <Button
              onClick={() => {
                void transport.resume?.();
                toast.success("Resuming");
              }}
              size="sm"
            >
              <Icon icon={PlayIcon} size="sm" tone="inherit" />
              Resume
            </Button>
          )}
          {canCancel && (
            <Button
              onClick={() => {
                transport.cancel?.();
                toast.success("Cancelling the run");
              }}
              size="sm"
              variant="ghost"
            >
              <Icon icon={XIcon} size="sm" tone="inherit" />
              Cancel
            </Button>
          )}
        </div>
      </div>
      <p aria-live="polite" className="type-small text-muted-foreground" role="status">
        {RUN_STATUS_LABEL[run.status]}
      </p>
      <TaskContent>
        {run.plan.map((step) => (
          <StepRow
            answer={answers[step.id]}
            askFirst={step.id === askingId}
            effects={run.effects.filter((e) => e.stepId === step.id)}
            key={step.id}
            onAnswer={(id, a) => setAnswers((prev) => ({ ...prev, [id]: a }))}
            run={run}
            step={step}
            transport={transport}
          />
        ))}
      </TaskContent>
      {(canUndo || (run.status === "completed" && irreversible.length > 0)) && (
        <div className="flex flex-col gap-2">
          {canUndo && (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  transport.compensate?.();
                  toast.success("Undoing changes");
                }}
                variant="outline"
              >
                <Icon icon={Undo2Icon} size="sm" tone="inherit" />
                Undo changes
              </Button>
              <span className="type-small text-muted-foreground">
                {`${reverse.length} ${reverse.length === 1 ? "change" : "changes"} can be undone`}
              </span>
            </div>
          )}
          {irreversible.length > 0 && (
            <p className="type-small text-muted-foreground">
              {`Can't be undone: ${irreversible.map((e) => e.description).join(", ")}`}
            </p>
          )}
        </div>
      )}
    </Task>
  );
}

/* ── Handoff and error ──────────────────────────────────────────────────── */

function HandoffForm({ transport, run }: { transport: AgentTransport; run: Run }) {
  const [sent, setSent] = useState(false);
  const handed = run.handoff?.owner || run.handoff?.note || sent;
  const canHandoff = Boolean(transport.capabilities.handoff && transport.handoff);

  const showForm = !handed && canHandoff;
  if (!showForm && !run.handoff) return null;

  return (
    <div className="flex flex-col gap-3">
      {showForm && (
        <Question
          onSubmit={({ selectedValues, text }) => {
            transport.handoff?.(text?.trim() || undefined, selectedValues[0]);
            setSent(true);
            toast.success(selectedValues[0] ? `Handed off to ${selectedValues[0]}` : "Handed off");
          }}
          selectionMode="single"
        >
          <div className="space-y-1">
            <QuestionPrompt>Who should take this over?</QuestionPrompt>
            <QuestionDescription>Choose an owner and leave a note for them.</QuestionDescription>
          </div>
          <QuestionOptions aria-label="Owner">
            {HANDOFF_OWNERS.map((owner) => (
              <QuestionOption key={owner} value={owner}>
                {owner}
              </QuestionOption>
            ))}
          </QuestionOptions>
          <QuestionInput aria-label="Note for the owner" placeholder="What should they know?" />
          <QuestionActions>
            <QuestionSubmit>Hand off</QuestionSubmit>
          </QuestionActions>
        </Question>
      )}
      {run.handoff && <HandoffSummary handoff={run.handoff} />}
    </div>
  );
}

function HandoffSummary({ handoff }: { handoff: NonNullable<Run["handoff"]> }) {
  const lists: [string, string[]][] = [
    ["Done", handoff.done],
    ["Failed", handoff.failed],
    ["Unknown", handoff.unknown],
  ];
  return (
    <section aria-label="Handoff summary" className="flex flex-col gap-2 rounded-lg border p-4">
      <p className="type-small text-foreground">{handoff.goal}</p>
      {lists
        .filter(([, items]) => items.length > 0)
        .map(([label, items]) => (
          <p className="type-small text-muted-foreground" key={label}>
            <span className="text-foreground">{label}:</span> {items.join(", ")}
          </p>
        ))}
      {handoff.owner && (
        <p className="type-small text-muted-foreground">
          <span className="text-foreground">Owner:</span> {handoff.owner}
        </p>
      )}
      {handoff.note && (
        <p className="type-small text-muted-foreground">
          <span className="text-foreground">Note:</span> {handoff.note}
        </p>
      )}
    </section>
  );
}

function RunErrorNotice({ error }: { error: NonNullable<Run["error"]> }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{error.what}</AlertTitle>
      <AlertDescription>
        <p>{error.why}</p>
        <p>{error.next}</p>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Everything the run shows inside its owning reply, in order: the proposed
 * Plan while `proposed`; the Task once approved; the handoff when a person
 * has to take over; the error in plain words.
 */
export function RunInline({ transport, run, className }: RunInlineProps) {
  const proposed = run.status === "proposed";
  const needsHandoff = run.status === "handoff_required" || Boolean(run.error?.fatal && run.handoff === undefined && transport.handoff);

  return (
    <div className={cn("flex flex-col gap-3", className)} data-run-status={run.status}>
      {proposed ? (
        <ProposedPlan key={run.version} run={run} transport={transport} />
      ) : (
        <>
          <Confirmation
            approval={{ id: `plan-${run.version}`, approved: true }}
            className={RECORD_CONFIRMATION}
            state="approval-responded"
          >
            <ConfirmationTitle>
              <ConfirmationAccepted>
                <span className="inline-flex items-center gap-2">
                  <Icon icon={CheckIcon} size="sm" tone="success" />
                  <span>{`Plan v${run.version} approved`}</span>
                </span>
              </ConfirmationAccepted>
            </ConfirmationTitle>
          </Confirmation>
          <RunTask run={run} transport={transport} />
        </>
      )}
      {/* The reducer keeps the last error after a recovery; show it only while it still describes the run. */}
      {run.error && ERROR_STATUSES.has(run.status) && <RunErrorNotice error={run.error} />}
      {(needsHandoff || run.handoff) && <HandoffForm run={run} transport={transport} />}
    </div>
  );
}

/* ── Queue ──────────────────────────────────────────────────────────────── */

/**
 * Messages held while the agent works — the Queue attached above the composer
 * (reorder, remove, send now). Renders nothing when the queue is empty. The
 * plan is not repeated here: it already lives in the reply that owns the run.
 */
export function RunQueue({ transport, run, className }: RunInlineProps) {
  const queued = transport.capabilities.queue ? queueMessages(run.queue) : [];
  if (queued.length === 0) return null;

  const ids = queued.map((m) => m.id);
  const move = (index: number, by: -1 | 1) => {
    const next = [...ids];
    [next[index], next[index + by]] = [next[index + by], next[index]];
    transport.reorderQueue?.(next);
  };
  const revealOnTouch = "focus-visible:opacity-100 pointer-coarse:opacity-100";

  return (
    <Queue className={cn("max-h-40 w-full overflow-y-auto border-input", className)}>
      {queued.length > 0 && (
        <QueueSection>
          <QueueSectionTrigger>
            <QueueSectionLabel count={queued.length} label="Queued" />
          </QueueSectionTrigger>
          <QueueSectionContent>
            <ul>
              {queued.map((message, i) => {
                const text = message.parts.find((p) => p.type === "text")?.text ?? "";
                const files = message.parts.filter((p) => p.type === "file");
                return (
                  <QueueItem key={message.id}>
                    <div className="flex items-center gap-2">
                      <QueueItemIndicator />
                      <QueueItemContent>{text}</QueueItemContent>
                      <QueueItemActions>
                        {transport.reorderQueue && (
                          <>
                            <QueueItemAction
                              aria-label="Move up"
                              className={revealOnTouch}
                              disabled={i === 0}
                              onClick={() => move(i, -1)}
                            >
                              <Icon icon={ArrowUpIcon} size="xs" tone="inherit" />
                            </QueueItemAction>
                            <QueueItemAction
                              aria-label="Move down"
                              className={revealOnTouch}
                              disabled={i === queued.length - 1}
                              onClick={() => move(i, 1)}
                            >
                              <Icon icon={ArrowDownIcon} size="xs" tone="inherit" />
                            </QueueItemAction>
                          </>
                        )}
                        {transport.sendQueuedNow && (
                          <QueueItemAction
                            aria-label="Send now"
                            className={revealOnTouch}
                            onClick={() => {
                              transport.sendQueuedNow?.(message.id);
                              toast.success("Sent now");
                            }}
                          >
                            <Icon icon={SendHorizontalIcon} size="xs" tone="inherit" />
                          </QueueItemAction>
                        )}
                        {transport.dequeue && (
                          <QueueItemAction
                            aria-label="Remove from queue"
                            className={revealOnTouch}
                            onClick={() => {
                              transport.dequeue?.(message.id);
                              toast.success("Removed from the queue");
                            }}
                          >
                            <Icon icon={Trash2Icon} size="xs" tone="inherit" />
                          </QueueItemAction>
                        )}
                      </QueueItemActions>
                    </div>
                    {files.length > 0 && (
                      <QueueItemAttachment>
                        {files.map((f, n) =>
                          f.mediaType?.startsWith("image/") && f.url ? (
                            <QueueItemImage alt={f.filename ?? "Attached image"} key={n} src={f.url} />
                          ) : (
                            <QueueItemFile key={n}>{f.filename ?? "Attachment"}</QueueItemFile>
                          ),
                        )}
                      </QueueItemAttachment>
                    )}
                  </QueueItem>
                );
              })}
            </ul>
          </QueueSectionContent>
        </QueueSection>
      )}
    </Queue>
  );
}
