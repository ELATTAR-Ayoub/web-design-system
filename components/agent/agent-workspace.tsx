"use client";

/**
 * AgentWorkspace — the full agent surface, composed from Vercel AI Elements.
 *
 * Four places, one fact each, the way Claude lays its own app out:
 *
 *   - History is a shadcn Sidebar on the left (`WorkspaceHistory`): New chat,
 *     conversations grouped by age, Archive / Delete with Undo. Its trigger
 *     sits first in the header; on a phone it is the sidebar's own Sheet.
 *   - The header is thin (`WorkspaceHeader`): trigger, mark, name and title,
 *     the voice orb only while voice is active, the settings gear.
 *   - The thread (`WorkspaceThread`) is the whole response flow. Status lives
 *     in the reply that has it — Thinking, Reasoning, the chain of tool steps,
 *     approvals inside their tool, the run's Plan / Task / Undo inline in the
 *     reply that started it. There is no run bar, activity column or live
 *     status row any more.
 *   - The composer (`WorkspaceComposer`) is PromptInput, with the run's Queue
 *     (`RunQueue`) docked above it while messages wait behind a busy agent.
 *
 * Every control stays gated twice — on `transport.capabilities` and on the
 * transport method existing — which each part enforces on its own props.
 * Settings (autonomy, temperature, length) are lifted here because they ride
 * every send as `SendOptions.settings`, and only when the transport advertises
 * `capabilities.settings`.
 */

import * as React from "react";
import { toast } from "sonner";

import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { resolveState } from "@/components/agent/core/resolve-state";
import { isBusy, type ToolStateMap } from "@/components/agent/core/states";
import type { RunStatus } from "@/components/agent/core/run";
import { DEFAULT_EFFORTS, type AgentCommand, type AgentTransport, type ModelOption, type PromptSource, type SendOptions } from "@/components/agent/core/types";
import type { ConversationSummary } from "@/components/agent/core/conversations";
import type { SpeechAdapter } from "@/components/agent/voice/speech";
import type { AvatarRenderer } from "@/components/agent/avatar/types";

import type { OpenInTarget } from "@/components/ai-elements/open-in-chat";

import { WorkspaceHeader } from "./workspace/workspace-header";
import { WorkspaceThread } from "./workspace/workspace-thread";
import { WorkspaceHistory } from "./workspace/workspace-history";
import { WorkspaceComposer, type VoiceState } from "./workspace/workspace-composer";
import { RunQueue } from "./workspace/run-inline";
import { RUN_IN_FLIGHT } from "./workspace/reply-model";
import {
  DEFAULT_RESPONSE_LENGTH,
  DEFAULT_TEMPERATURE,
  type AutonomyMode,
} from "./workspace/workspace-settings";

/** `EffortSlider` takes a mutable array; one stable copy so the default never changes identity. */
const DEFAULT_EFFORT_LIST: string[] = [...DEFAULT_EFFORTS];

export type AgentWorkspaceProps = {
  transport: AgentTransport;
  /** The agent's face in the header, animated per state. Defaults to the built-in CubeAvatar. */
  avatar?: AvatarRenderer;
  /** Browser speech: the read-aloud voices offered in settings. */
  speech?: SpeechAdapter;
  /** Read aloud: resolves to a playable audio url for a reply's text. Absent renders no Read aloud action. */
  speak?: (text: string, voiceId?: string | null) => Promise<string>;
  /** Chat services each reply's "Open in…" menu offers, opened with the user message as the query. Absent or empty renders no menu. */
  openIn?: OpenInTarget[];
  toolStates?: ToolStateMap;
  /** The agent's display name in the header. Defaults to "Agent". */
  name?: string;
  /** The conversation's own title. Absent renders nothing — no placeholder. */
  title?: string;
  conversations?: {
    items: ConversationSummary[];
    /** The conversation currently open — highlighted in the history. */
    activeId?: string;
    onOpen: (id: string) => void;
    /** Starts a fresh conversation. Absent renders no "New chat" control. */
    onNew?: () => void;
    onArchive?: (id: string) => void;
    onDelete?: (id: string) => void;
    /** Undo for Delete's toast — puts the row back. */
    onRestore?: (item: ConversationSummary) => void;
  };
  models?: ModelOption[];
  /** What `@` offers in the composer. Shown only when `transport.capabilities.sources` is true. */
  sources?: PromptSource[];
  /** What `/` offers in the composer; `skill` commands are also in its + menu. */
  commands?: AgentCommand[];
  /**
   * Effort levels, low to high, for the composer's Effort control. The chosen
   * level rides `SendOptions.settings.effort`, so it shows only when the
   * transport advertises `capabilities.settings`. Defaults to `DEFAULT_EFFORTS`; pass `[]` for no Effort control.
   */
  efforts?: string[];
  /** Starter prompts for an empty conversation. */
  suggestions?: string[];
  /** Controlled open state for the settings sheet; uncontrolled when omitted. */
  settingsOpen?: boolean;
  onSettingsOpenChange?: (open: boolean) => void;
  /** Controlled open state for the history sidebar (desktop); uncontrolled, open by default, when omitted. */
  historyOpen?: boolean;
  onHistoryOpenChange?: (open: boolean) => void;
  className?: string;
};

export function AgentWorkspace({
  transport,
  avatar,
  speech,
  speak,
  openIn,
  toolStates,
  name,
  title,
  conversations,
  models,
  sources,
  commands,
  efforts = DEFAULT_EFFORT_LIST,
  suggestions,
  settingsOpen: settingsOpenProp,
  onSettingsOpenChange,
  historyOpen,
  onHistoryOpenChange,
  className,
}: AgentWorkspaceProps) {
  const [composerValue, setComposerValue] = React.useState("");
  const [webSearch, setWebSearch] = React.useState(false);
  const [modelId, setModelId] = React.useState<string | null>(null);
  const [voiceState, setVoiceState] = React.useState<VoiceState>("idle");
  const [awaitingFirstEvent, setAwaitingFirstEvent] = React.useState(false);
  const [turnsAtSend, setTurnsAtSend] = React.useState(0);

  /* Settings sheet — controlled or not. */
  const [internalSettingsOpen, setInternalSettingsOpen] = React.useState(false);
  const settingsOpen = settingsOpenProp ?? internalSettingsOpen;
  const setSettingsOpen = React.useCallback(
    (open: boolean) => {
      setInternalSettingsOpen(open);
      onSettingsOpenChange?.(open);
    },
    [onSettingsOpenChange],
  );

  /* Settings forwarded on every send when the transport can receive them. */
  const [autonomy, setAutonomy] = React.useState<AutonomyMode>("ask");
  const [length, setLength] = React.useState(DEFAULT_RESPONSE_LENGTH);
  const [temperature, setTemperature] = React.useState(DEFAULT_TEMPERATURE);
  // The middle level until the reader picks.
  const [effort, setEffort] = React.useState(() => efforts[Math.floor((efforts.length - 1) / 2)] ?? "");
  const resetSettings = React.useCallback(() => {
    setAutonomy("ask");
    setLength(DEFAULT_RESPONSE_LENGTH);
    setTemperature(DEFAULT_TEMPERATURE);
  }, []);

  const run = transport.runState?.run ?? null;
  const connection = transport.runState?.connection ?? "connected";

  /* "Submitted" only until the first sign of a reply — the next turn, or the
     run moving. Adjusted during render so this frame already shows it. */
  if (awaitingFirstEvent && transport.turns.length > turnsAtSend + 1) setAwaitingFirstEvent(false);

  const state = resolveState({
    turns: transport.turns,
    signals: { isLoading: transport.isLoading, awaitingFirstEvent },
    toolStates,
    run,
    connection,
  });
  const busy = isBusy(state);
  const runInFlight = run !== null && RUN_IN_FLIGHT.has(run.status);
  const status: "ready" | "submitted" | "streaming" | "error" = awaitingFirstEvent
    ? "submitted"
    : busy
      ? "streaming"
      : transport.error
        ? "error"
        : "ready";

  /* One toast per real transition, never on mount. The reply already says
     everything else; these two happen while the reader may be looking away. */
  const prevRunStatus = React.useRef<RunStatus | undefined>(undefined);
  const prevConnection = React.useRef<typeof connection | undefined>(undefined);
  React.useEffect(() => {
    const previous = prevRunStatus.current;
    if (run?.status && previous && run.status !== previous && run.status === "completed") {
      toast.success("Run completed");
    }
    prevRunStatus.current = run?.status;
  }, [run?.status]);
  React.useEffect(() => {
    const previous = prevConnection.current;
    if (previous && previous !== "connected" && connection === "connected") toast.success("Connection restored");
    prevConnection.current = connection;
  }, [connection]);

  const gatedModels = React.useMemo(
    () => (transport.capabilities.models ? models?.map((m) => ({ id: m.value, name: m.label })) : undefined),
    [transport.capabilities.models, models],
  );

  /* The model the picker shows is the model a send asks for — the first one until the reader picks. */
  const activeModel = modelId ?? gatedModels?.[0]?.id ?? null;

  const withSettings = React.useCallback(
    (options: SendOptions): SendOptions => ({
      ...options,
      ...(webSearch ? { webSearch: true } : {}),
      ...(transport.capabilities.settings
        ? { settings: { autonomy, temperature, length, ...(effort ? { effort } : {}), ...(options.settings?.effort ? { effort: options.settings.effort } : {}) } }
        : {}),
    }),
    [webSearch, transport.capabilities.settings, autonomy, temperature, length, effort],
  );

  const send = React.useCallback(
    (text: string, options: SendOptions = {}) => {
      const opts = withSettings({ ...(activeModel ? { model: activeModel } : {}), ...options });
      /* While the agent works — or a run is merely paused or waiting on the
         reader — a queue-capable transport holds the message rather than
         starting something new in the middle of the run. */
      if ((busy || runInFlight) && transport.capabilities.queue && transport.enqueue) {
        transport.enqueue(text, opts);
        return;
      }
      setTurnsAtSend(transport.turns.length);
      setAwaitingFirstEvent(true);
      void transport.send(text, opts).finally(() => setAwaitingFirstEvent(false));
    },
    [withSettings, activeModel, busy, runInFlight, transport],
  );

  const voiceId = speech?.voiceId ?? null;
  const speakWithVoice = React.useMemo(
    () => (speak ? (text: string) => speak(text, voiceId) : undefined),
    [speak, voiceId],
  );

  const shownVoiceState: VoiceState = voiceState === "idle" && speech?.isSpeaking ? "speaking" : voiceState;

  const settings = {
    autonomy,
    onAutonomyChange: setAutonomy,
    length,
    onLengthChange: setLength,
    temperature,
    onTemperatureChange: setTemperature,
    voice: voiceId,
    onVoiceChange: speech?.setVoiceId,
    voices: speech?.isSupported ? speech.voices : undefined,
    agent: transport.agent,
    onReset: resetSettings,
    disabled: !transport.isReady,
  };

  const hasHistory = Boolean(conversations);

  const frame = cn(
    "relative h-full min-h-0 overflow-hidden rounded-lg border border-border bg-background",
    className,
  );

  const body = (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <WorkspaceHeader
        avatar={avatar}
        state={state}
        name={name}
        title={title}
        leading={
          hasHistory ? (
            /* Icon-only and alone at the header edge: the full target, not the toolbar size. */
            <SidebarTrigger className="min-h-(--size-target-min) min-w-(--size-target-min)" />
          ) : undefined
        }
        voiceState={shownVoiceState}
        settings={settings}
        showSettings={Boolean(transport.capabilities.settings)}
        settingsOpen={settingsOpen}
        onSettingsOpenChange={setSettingsOpen}
      />

      <WorkspaceThread
        transport={transport}
        busy={busy}
        starters={suggestions}
        onSend={send}
        speak={speakWithVoice}
        openIn={openIn}
        composerEmpty={!composerValue.trim()}
        className="min-h-0 flex-1"
      />

      <div className="px-4 pb-4">
        <WorkspaceComposer
          className="mx-auto w-full max-w-(--width-prose)"
          transport={transport}
          value={composerValue}
          onValueChange={setComposerValue}
          onSubmit={send}
          onStop={transport.abort}
          status={status}
          models={gatedModels}
          model={activeModel ?? undefined}
          onModelChange={setModelId}
          webSearch={webSearch}
          onWebSearchChange={setWebSearch}
          sources={sources}
          commands={commands}
          efforts={transport.capabilities.settings ? efforts : undefined}
          effort={effort}
          onEffortChange={setEffort}
          dock={run ? <RunQueue transport={transport} run={run} /> : undefined}
          onVoiceStateChange={setVoiceState}
          disabled={!transport.isReady}
          disabledReason={!transport.isReady ? "Waiting for the assistant to connect." : undefined}
        />
      </div>
    </div>
  );

  /* No history, no sidebar machinery: the provider (its keyboard shortcut, its
     cookie, its context) mounts only when there is a list to open. */
  if (!conversations) {
    return (
      <div className={cn("flex w-full", frame)} data-slot="agent-workspace">
        {body}
      </div>
    );
  }

  return (
    <SidebarProvider
      open={historyOpen}
      onOpenChange={onHistoryOpenChange}
      className={frame}
      data-slot="agent-workspace"
    >
      {/* The Sidebar is page-fixed by default; inside an embedded workspace it
          is pinned to the workspace instead (`absolute h-full` win over
          `fixed h-svh` through tailwind-merge). */}
      <Sidebar className="absolute h-full" aria-label="Conversations">
        <WorkspaceHistory {...conversations} />
      </Sidebar>
      {body}
    </SidebarProvider>
  );
}
