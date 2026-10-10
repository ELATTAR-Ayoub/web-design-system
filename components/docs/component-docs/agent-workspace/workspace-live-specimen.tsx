"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpenIcon,
  CalendarIcon,
  FileTextIcon,
  ListChecksIcon,
  ListCollapseIcon,
  MailIcon,
  Maximize2Icon,
  MessageSquareTextIcon,
  RotateCcwIcon,
} from "lucide-react";

import { AgentWorkspace } from "@/components/agent/agent-workspace";
import type { AgentCommand, ModelOption, PromptSource } from "@/components/agent/core/types";
import { useBrowserSpeech } from "@/components/agent/voice/speech";
import type { ConversationSummary } from "@/components/agent/core/conversations";
import { CONVERSATIONS, speakMock, useMockTransport, type ConversationId } from "@/lib/agent/mock-transport";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const HINTS: Record<ConversationId, string> = {
  chat: "Press the suggestion under each answer. Edit your message or press Regenerate to flip between versions, and attach an image and a PDF at the end.",
  tools: "Press the suggestion under each answer. Watch a search, a test run, a terminal, a failing deploy that retries, a crash you Retry, then an image, a document, previews and a sandbox.",
  planning: "Press the suggested prompt, edit a step, press View as workflow, then Run plan. Verify the low-confidence step, then press Undo changes.",
  approvals: "Press the suggestion each time. Approve or Reject, enter any 6-digit code except 000000, then approve the fresh plan after it expires or goes stale.",
  "run-control": "Press the suggested prompt, then Pause and Resume. Send more messages while it runs to fill the queue, Cancel the next run mid-step, then Restore.",
  recovery: "Press the suggestion each time. Watch the connection drop and return, retry what failed, press Retry on the crash, then hand the run to a person.",
  "long-session": "Press the suggested prompt until the context ring nears its limit, then press Summarise. Try dictation, About this agent and the voice picker.",
};

const MODELS: ModelOption[] = [
  { value: "swift", label: "Swift", description: "Fast answers" },
  { value: "steady", label: "Steady", description: "Balanced" },
  { value: "deep", label: "Deep", description: "Slow, thorough reasoning" },
];

const SOURCES: PromptSource[] = [
  { id: "docs", label: "Documents", description: "Specs, notes, briefs", icon: FileTextIcon },
  { id: "mail", label: "Mail", description: "Read and draft mail", icon: MailIcon },
  { id: "calendar", label: "Calendar", description: "Events and availability", icon: CalendarIcon },
];

const COMMANDS: AgentCommand[] = [
  {
    id: "explain",
    label: "/explain",
    hint: "Ask for the last answer step by step",
    group: "command",
    icon: MessageSquareTextIcon,
    directive: "Explain your last answer step by step.",
  },
  {
    id: "plan",
    label: "Plan first",
    hint: "Make a plan and wait for a go-ahead",
    group: "skill",
    icon: ListChecksIcon,
    directive: "Make a plan first and wait for my go-ahead:",
  },
  {
    id: "research",
    label: "Research",
    hint: "Look it up and cite the sources",
    group: "skill",
    icon: BookOpenIcon,
    directive: "Research this and cite your sources:",
  },
];

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = Date.now();

const AGE_DAYS: Record<ConversationId, number> = {
  chat: 0,
  tools: 0,
  planning: 1,
  approvals: 2,
  "run-control": 4,
  recovery: 9,
  "long-session": 20,
};

export const DEMO_CONVERSATIONS: ConversationSummary[] = CONVERSATIONS.map((c, i) => ({
  id: `demo-${c.id}`,
  title: c.starter,
  preview: c.beats[0].label,
  updatedAt: new Date(NOW - AGE_DAYS[c.id] * DAY_MS - (i + 1) * 60_000).toISOString(),
}));

const conversationOfRow = (rowId: string): ConversationId | undefined =>
  CONVERSATIONS.find((c) => `demo-${c.id}` === rowId)?.id;

export function useConversationPicker() {
  const [conversation, setConversation] = React.useState<ConversationId>("chat");
  const [replayCount, setReplayCount] = React.useState(0);
  const [activeId, setActiveId] = React.useState<string | null>("demo-chat");
  const [items, setItems] = React.useState<ConversationSummary[]>(DEMO_CONVERSATIONS);

  const select = React.useCallback((id: ConversationId) => {
    setConversation(id);
    setReplayCount(0);
    setActiveId(`demo-${id}`);
  }, []);

  const replay = React.useCallback(() => setReplayCount((n) => n + 1), []);

  const openConversation = React.useCallback((id: string) => {
    const mapped = conversationOfRow(id);
    if (!mapped) return;
    setActiveId(id);
    setConversation(mapped);
    setReplayCount(0);
  }, []);

  const newConversation = React.useCallback(() => setReplayCount((n) => n + 1), []);

  const removeItem = React.useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const restoreItem = React.useCallback(
    (item: ConversationSummary) => setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item])),
    [],
  );

  return {
    conversation,
    replayCount,
    select,
    replay,
    activeId,
    items,
    openConversation,
    newConversation,
    archiveConversation: removeItem,
    deleteConversation: removeItem,
    restoreConversation: restoreItem,
  };
}

export function clampSpeed(value: number): number {
  return Math.min(8, Math.max(0.25, value));
}

export function ConversationPickerRow({
  conversation,
  onSelect,
  onReplay,
  fullScreenHref,
  className,
}: {
  conversation: ConversationId;
  onSelect: (id: ConversationId) => void;
  onReplay: () => void;
  fullScreenHref?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-2", className)}>
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <Select value={conversation} onValueChange={(value) => onSelect(value as ConversationId)}>
          <SelectTrigger aria-label="Conversation" className="min-w-0 flex-1 basis-60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONVERSATIONS.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={onReplay}>
            <Icon icon={RotateCcwIcon} size="sm" tone="inherit" aria-hidden />
            Replay
          </Button>
          {fullScreenHref ? (
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href={fullScreenHref}>
                <Icon icon={Maximize2Icon} size="sm" tone="inherit" aria-hidden />
                Open full screen
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
      <p className="type-small text-muted-foreground">{HINTS[conversation]}</p>
    </div>
  );
}

export function LiveWorkspace({
  conversation,
  speed,
  items = DEMO_CONVERSATIONS,
  activeId,
  onOpenConversation,
  onNewConversation,
  onArchiveConversation,
  onDeleteConversation,
  onRestoreConversation,
}: {
  conversation: ConversationId;
  speed: number;
  items?: ConversationSummary[];
  activeId: string | null;
  onOpenConversation: (id: string) => void;
  onNewConversation: () => void;
  onArchiveConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  onRestoreConversation?: (item: ConversationSummary) => void;
}) {
  const transport = useMockTransport({ conversation, speed });
  const starter = CONVERSATIONS.find((c) => c.id === conversation)!.starter;

  const speech = useBrowserSpeech();
  const history = {
    items,
    activeId: activeId ?? undefined,
    onOpen: onOpenConversation,
    onNew: onNewConversation,
    onArchive: onArchiveConversation,
    onDelete: onDeleteConversation,
    onRestore: onRestoreConversation,
  };

  const summarise = transport.summarise;
  const commands = React.useMemo<AgentCommand[]>(
    () =>
      summarise
        ? [
            ...COMMANDS,
            {
              id: "summarise",
              label: "/summarise",
              hint: "Condense this conversation now",
              group: "command",
              icon: ListCollapseIcon,
              run: () => void summarise(),
            },
          ]
        : COMMANDS,
    [summarise],
  );

  return (
    <AgentWorkspace
      transport={transport}
      speech={speech}
      speak={speakMock}
      models={MODELS}
      sources={SOURCES}
      commands={commands}
      suggestions={[starter]}
      conversations={history}
    />
  );
}

function LiveSpecimenInner({ fullScreenHref }: { fullScreenHref?: string }) {
  const searchParams = useSearchParams();
  const speedParam = searchParams.get("speed");
  const speed = speedParam ? clampSpeed(Number(speedParam) || 1) : 0.5;

  const picker = useConversationPicker();

  return (
    <div className="flex w-full flex-col gap-4">
      <ConversationPickerRow
        conversation={picker.conversation}
        onSelect={picker.select}
        onReplay={picker.replay}
        fullScreenHref={fullScreenHref}
      />

      <div className="h-180 w-full min-w-0 overflow-hidden rounded-xl border border-border">
        <LiveWorkspace
          key={`${picker.conversation}-${picker.replayCount}`}
          conversation={picker.conversation}
          speed={speed}
          items={picker.items}
          activeId={picker.activeId}
          onOpenConversation={picker.openConversation}
          onNewConversation={picker.newConversation}
          onArchiveConversation={picker.archiveConversation}
          onDeleteConversation={picker.deleteConversation}
          onRestoreConversation={picker.restoreConversation}
        />
      </div>
    </div>
  );
}

export function WorkspaceLiveSpecimen({ fullScreenHref }: { fullScreenHref?: string }) {
  return (
    <React.Suspense
      fallback={<div className="h-180 w-full rounded-xl border border-border bg-card" aria-hidden />}
    >
      <LiveSpecimenInner fullScreenHref={fullScreenHref} />
    </React.Suspense>
  );
}
