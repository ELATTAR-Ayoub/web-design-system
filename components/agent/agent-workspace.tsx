"use client";

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

const DEFAULT_EFFORT_LIST: string[] = [...DEFAULT_EFFORTS];

export type AgentWorkspaceProps = {
  transport: AgentTransport;
  avatar?: AvatarRenderer;
  speech?: SpeechAdapter;
  speak?: (text: string, voiceId?: string | null) => Promise<string>;
  openIn?: OpenInTarget[];
  toolStates?: ToolStateMap;
  name?: string;
  title?: string;
  conversations?: {
    items: ConversationSummary[];
    activeId?: string;
    onOpen: (id: string) => void;
    onNew?: () => void;
    onArchive?: (id: string) => void;
    onDelete?: (id: string) => void;
    onRestore?: (item: ConversationSummary) => void;
  };
  models?: ModelOption[];
  sources?: PromptSource[];
  commands?: AgentCommand[];
  efforts?: string[];
  suggestions?: string[];
  settingsOpen?: boolean;
  onSettingsOpenChange?: (open: boolean) => void;
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

  const [internalSettingsOpen, setInternalSettingsOpen] = React.useState(false);
  const settingsOpen = settingsOpenProp ?? internalSettingsOpen;
  const setSettingsOpen = React.useCallback(
    (open: boolean) => {
      setInternalSettingsOpen(open);
      onSettingsOpenChange?.(open);
    },
    [onSettingsOpenChange],
  );

  const [autonomy, setAutonomy] = React.useState<AutonomyMode>("ask");
  const [length, setLength] = React.useState(DEFAULT_RESPONSE_LENGTH);
  const [temperature, setTemperature] = React.useState(DEFAULT_TEMPERATURE);
  const [effort, setEffort] = React.useState(() => efforts[Math.floor((efforts.length - 1) / 2)] ?? "");
  const resetSettings = React.useCallback(() => {
    setAutonomy("ask");
    setLength(DEFAULT_RESPONSE_LENGTH);
    setTemperature(DEFAULT_TEMPERATURE);
  }, []);

  const run = transport.runState?.run ?? null;
  const connection = transport.runState?.connection ?? "connected";

  /* Adjusted during render so the first frame already shows "submitted". */
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

  /* One toast per real transition, never on mount. */
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
      {/* absolute h-full overrides the Sidebar's fixed h-svh when embedded. */}
      <Sidebar className="absolute h-full" aria-label="Conversations">
        <WorkspaceHistory {...conversations} />
      </Sidebar>
      {body}
    </SidebarProvider>
  );
}
