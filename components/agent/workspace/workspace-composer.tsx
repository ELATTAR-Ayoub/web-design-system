"use client";

/**
 * WorkspaceComposer — the AgentWorkspace's input, built from AI Elements'
 * `PromptInput` the way `chatbot.tsx` / `queue-prompt-input.tsx` build it:
 *
 *   dock (the Queue, glued to the top edge)
 *   PromptInput
 *     PromptInputHeader   attachments (inline chips, hover preview) + the live transcript
 *     PromptInputBody     PromptInputTextarea
 *     PromptInputFooter
 *       PromptInputTools  + menu (files · sources · skills) · Search · ModelSelector · Effort
 *       trailing          Summarise (≥ 90 % full) · Context · SpeechInput + MicSelector · PromptInputSubmit
 *   palette (a Popover anchored on the composer: `@` sources or `/` commands)
 *
 *   Narrow (a phone, or a composer under COMPACT_BELOW wide) keeps only what a
 *   message needs inside the box — +, the mic, Send — and moves Search, the
 *   model, Effort, Summarise and the context meter to a row under it.
 *
 * What the component owns and what it does not:
 *  - The text, web-search flag and model are CONTROLLED by the caller — the
 *    controller also builds `SendOptions.settings` (autonomy, length,
 *    temperature) from the settings sheet, so this file never sees them.
 *  - Attachments are PromptInput's own (`FileUIPart`s); on submit they are read
 *    back into our `Attachment` through `readAttachment` and folded into the
 *    message with `serialiseAttachments`, so
 *    `SendOptions.attachments` / `wireText` keep their meaning.
 *  - Dictation has two paths. With `transport.transcribe` the composer records
 *    from the input device chosen in `MicSelector` (SpeechInput's MediaRecorder
 *    path) and sends the audio to the transport; without it the browser's own
 *    recogniser is used, which cannot pick a device, so `MicSelector` is hidden.
 *    Either way `SpeechInput.onListeningChange` is lifted as a `VoiceState` for
 *    the header's voice orb: "listening" while recording, "thinking" only once a
 *    dictated message has been sent and until `status` returns to "ready".
 *  - `@` and `/` are palettes: typing either at the start of a
 *    word opens a `PromptInputCommand` list above the composer and takes the
 *    trigger character back out of the text. The + menu is one
 *    panel: files, then the sources (checkable), then the skills. Picked
 *    sources ride the send as `SendOptions.sources` (ids) and show as chips;
 *    a command either runs in the browser or writes its directive into the text.
 *  - Effort is a chip that opens a slider (`EffortSlider`); at the last level,
 *    while the message is focused, the box runs the shared `SparkField`.
 */

import * as React from "react";
import { GaugeIcon, GlobeIcon, ListCollapseIcon, SquareSlashIcon } from "lucide-react";
import { toast } from "sonner";

import {
  AttachmentHoverCard,
  AttachmentHoverCardContent,
  AttachmentHoverCardTrigger,
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  getAttachmentLabel,
  getMediaCategory,
} from "@/components/ai-elements/attachments";
import {
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
} from "@/components/ai-elements/context";
import {
  MicSelector,
  MicSelectorContent,
  MicSelectorEmpty,
  MicSelectorInput,
  MicSelectorItem,
  MicSelectorLabel,
  MicSelectorList,
  MicSelectorTrigger,
} from "@/components/ai-elements/mic-selector";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputCommand,
  PromptInputCommandEmpty,
  PromptInputCommandGroup,
  PromptInputCommandInput,
  PromptInputCommandItem,
  PromptInputCommandList,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { SpeechInput } from "@/components/ai-elements/speech-input";
import { Transcription, TranscriptionSegment } from "@/components/ai-elements/transcription";
import { Icon } from "@/components/ui/icon";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MAX_FILE_BYTES, readAttachment, serialiseAttachments } from "@/components/agent/core/attachments";
import type { AgentCommand, Attachment as AgentAttachment, AgentTransport, PromptSource, SendOptions } from "@/components/agent/core/types";
import { EffortSlider, isMaxEffort } from "@/components/agent/parts/effort-slider";
import { SparkField, type SparkFieldHandle } from "@/components/agent/parts/spark-field";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

import { contextProps } from "./reply-model";

export type VoiceState = "idle" | "listening" | "thinking" | "speaking";

export type WorkspaceComposerProps = {
  transport: AgentTransport;
  value: string;
  onValueChange: (value: string) => void;
  /** Send (the controller queues it instead while busy with a queue-capable transport). */
  onSubmit: (text: string, options: SendOptions) => void;
  onStop: () => void;
  /** AI SDK ChatStatus for PromptInputSubmit. */
  status: "ready" | "submitted" | "streaming" | "error";
  models?: { id: string; name: string; provider?: string }[];
  model?: string;
  onModelChange?: (id: string) => void;
  webSearch: boolean;
  onWebSearchChange: (on: boolean) => void;
  /** What `@` offers. Shown only when `transport.capabilities.sources` is true. */
  sources?: PromptSource[];
  /** What `/` offers; the `skill` ones are also in the + menu. */
  commands?: AgentCommand[];
  /** Effort levels, low to high. Empty or absent renders no Effort control. */
  efforts?: string[];
  effort?: string;
  onEffortChange?: (effort: string) => void;
  /** Rendered attached above the input (the Queue — RunQueue). */
  dock?: React.ReactNode;
  /** Dictation state, lifted so the header's voice orb can show it. */
  onVoiceStateChange?: (state: VoiceState) => void;
  disabled?: boolean;
  disabledReason?: string;
  className?: string;
};

/**
 * Below this width the composer is "compact": only +, the mic and Send stay in
 * the box. 448px is Tailwind's `@md` container step, so the composer turns
 * compact at the same width its `@md/composer` styles would.
 */
const COMPACT_BELOW = 448;

/** The meter offers Summarise from here up — the same point the Context hover card turns urgent. */
const SUMMARISE_AT = 0.9;

const subscribeNever = () => () => {};
const canRecognise = () =>
  typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
const canRecord = () => typeof window !== "undefined" && "MediaRecorder" in window && "mediaDevices" in navigator;

const isBusy = (status: WorkspaceComposerProps["status"]) => status === "submitted" || status === "streaming";

/** A `FileUIPart` (data: or blob: url) back to the `File` it came from, then to our `Attachment`. */
async function toAttachment(part: PromptInputMessage["files"][number]): Promise<AgentAttachment> {
  const name = part.filename ?? "attachment";
  const type = part.mediaType ?? "";
  let file: File;
  try {
    const blob = await (await fetch(part.url)).blob();
    file = new File([blob], name, { type: type || blob.type });
  } catch {
    // The bytes could not be read back — still send what the user picked, by name.
    file = new File([], name, { type });
  }
  return readAttachment(file);
}

/** One chip in the header: preview swaps for remove on hover, a hover card shows the full image. */
function ComposerAttachment({
  attachment,
  onRemove,
}: {
  attachment: ReturnType<typeof usePromptInputAttachments>["files"][number];
  onRemove: (id: string) => void;
}) {
  const handleRemove = React.useCallback(() => onRemove(attachment.id), [onRemove, attachment.id]);
  const category = getMediaCategory(attachment);
  const label = getAttachmentLabel(attachment);

  return (
    <AttachmentHoverCard>
      <AttachmentHoverCardTrigger asChild>
        <Attachment data={attachment} onRemove={handleRemove}>
          <div className="relative size-5 shrink-0">
            <div className="absolute inset-0 transition-opacity group-hover:opacity-0">
              <AttachmentPreview />
            </div>
            <AttachmentRemove className="absolute inset-0" />
          </div>
          <AttachmentInfo />
        </Attachment>
      </AttachmentHoverCardTrigger>
      <AttachmentHoverCardContent>
        <div className="space-y-3">
          {category === "image" && attachment.type === "file" && attachment.url ? (
            <div className="flex max-h-96 w-80 items-center justify-center overflow-hidden rounded-md border">
              {/* A local object/data url — not an optimisable remote asset. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={label}
                className="max-h-full max-w-full object-contain"
                height={384}
                src={attachment.url}
                width={320}
              />
            </div>
          ) : null}
          <div className="space-y-1 px-0.5">
            <p className="type-nav">{label}</p>
            {attachment.mediaType ? (
              <p className="type-identifier text-muted-foreground">{attachment.mediaType}</p>
            ) : null}
          </div>
        </div>
      </AttachmentHoverCardContent>
    </AttachmentHoverCard>
  );
}

function ComposerAttachments() {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) return null;
  return (
    <Attachments variant="inline">
      {attachments.files.map((file) => (
        <ComposerAttachment key={file.id} attachment={file} onRemove={attachments.remove} />
      ))}
    </Attachments>
  );
}

/** A picked source as the `Attachment` chip AI Elements draws for a source document. */
const sourceChip = (s: PromptSource) => ({
  type: "source-document" as const,
  id: s.id,
  sourceId: s.id,
  title: s.label,
  filename: s.description,
  mediaType: "text/plain",
});

/** `@` or `/` typed at the start of a word — the character a palette opens on, or null. */
function paletteTrigger(previous: string, next: string, caret: number): "@" | "/" | null {
  if (next.length !== previous.length + 1 || caret < 1) return null;
  const typed = next[caret - 1];
  if (typed !== "@" && typed !== "/") return null;
  return caret === 1 || /\s/.test(next[caret - 2]) ? typed : null;
}

/** Submit: Stop while a reply is on its way, otherwise disabled until there is something to send. */
function ComposerSubmit({
  status,
  onStop,
  hasText,
  disabled,
}: {
  status: WorkspaceComposerProps["status"];
  onStop: () => void;
  hasText: boolean;
  disabled?: boolean;
}) {
  const attachments = usePromptInputAttachments();
  const busy = isBusy(status);
  const empty = !hasText && attachments.files.length === 0;
  return <PromptInputSubmit disabled={busy ? false : disabled || empty} onStop={onStop} status={status} />;
}

export function WorkspaceComposer({
  transport,
  value,
  onValueChange,
  onSubmit,
  onStop,
  status,
  models,
  model,
  onModelChange,
  webSearch,
  onWebSearchChange,
  sources,
  commands,
  efforts,
  effort,
  onEffortChange,
  dock,
  onVoiceStateChange,
  disabled,
  disabledReason,
  className,
}: WorkspaceComposerProps) {
  const { capabilities, usage, summarise } = transport;
  const showModels = Boolean(models?.length && capabilities.models);
  const selectedModel = models?.find((m) => m.id === model) ?? models?.[0];
  const [modelOpen, setModelOpen] = React.useState(false);
  const [micId, setMicId] = React.useState<string | undefined>();
  const [summarising, setSummarising] = React.useState(false);

  /* ── Dictation ───────────────────────────────────────────────────────── */

  // With `transcribe` we record and send the audio; otherwise the browser recognises.
  const recording = Boolean(transport.transcribe);
  const dictation = React.useSyncExternalStore(subscribeNever, recording ? canRecord : canRecognise, () => false);
  const valueRef = React.useRef(value);
  const [listening, setListening] = React.useState(false);
  const [dictated, setDictated] = React.useState(false);
  const [thinking, setThinking] = React.useState(false);
  const [transcribing, setTranscribing] = React.useState(false);
  const [segments, setSegments] = React.useState<{ text: string; startSecond: number; endSecond: number }[]>([]);

  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleListeningChange = React.useCallback((next: boolean) => {
    setListening(next);
    if (next) setSegments([]);
  }, []);

  // Dictated text that is emptied again was never going to be sent.
  if (dictated && !value.trim()) setDictated(false);

  // Thinking lasts until the send that followed it settles (busy → ready). Adjusting
  // state while rendering is the supported way to react to a prop change.
  const [prevStatus, setPrevStatus] = React.useState(status);
  if (prevStatus !== status) {
    setPrevStatus(status);
    if (isBusy(prevStatus) && status === "ready" && thinking) setThinking(false);
  }

  // Transcribing a recording is the agent working on what was said — the orb thinks.
  const voiceState: VoiceState = listening ? "listening" : thinking || transcribing ? "thinking" : "idle";
  const reported = React.useRef<VoiceState>("idle");
  const onVoiceStateChangeRef = React.useRef(onVoiceStateChange);
  React.useEffect(() => {
    onVoiceStateChangeRef.current = onVoiceStateChange;
  });
  React.useEffect(() => {
    if (reported.current === voiceState) return;
    reported.current = voiceState;
    onVoiceStateChangeRef.current?.(voiceState);
  }, [voiceState]);
  // Leaving while the voice is active must not strand the header's voice orb.
  React.useEffect(
    () => () => {
      if (reported.current !== "idle") {
        reported.current = "idle";
        onVoiceStateChangeRef.current?.("idle");
      }
    },
    [],
  );

  const handleTranscription = React.useCallback(
    (text: string) => {
      const chunk = text.trim();
      if (!chunk) return;
      const current = valueRef.current;
      const next = current && !/\s$/.test(current) ? `${current} ${chunk}` : `${current}${chunk}`;
      valueRef.current = next;
      onValueChange(next);
      setDictated(true);
      setSegments((prev) => [...prev, { text: chunk, startSecond: prev.length, endSecond: prev.length + 1 }]);
    },
    [onValueChange],
  );

  /** SpeechInput's recorder path: audio in, text out. Failure is a toast, never silence. */
  const transcribe = transport.transcribe;
  const handleAudio = React.useCallback(
    async (audio: Blob) => {
      if (!transcribe) return "";
      setTranscribing(true);
      try {
        return await transcribe(audio);
      } catch {
        toast.error("Could not transcribe that recording. Try again.");
        return "";
      } finally {
        setTranscribing(false);
      }
    },
    [transcribe],
  );

  /* ── @ sources and / commands ────────────────────────────────────────── */

  const showSources = Boolean(capabilities.sources && sources?.length);
  const [chosen, setChosen] = React.useState<PromptSource[]>([]);
  const [palette, setPalette] = React.useState<"@" | "/" | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  // Where the trigger was typed, so a command's directive goes back in that spot.
  const insertAt = React.useRef<number | null>(null);
  const skills = (commands ?? []).filter((c) => c.group === "skill");

  const closePalette = () => setPalette(null);

  const addSource = (source: PromptSource) => {
    setChosen((prev) => (prev.some((s) => s.id === source.id) ? prev : [...prev, source]));
    closePalette();
  };
  const removeSource = (id: string) => setChosen((prev) => prev.filter((s) => s.id !== id));
  const toggleSource = (source: PromptSource, on: boolean) =>
    setChosen((prev) => (on ? (prev.some((s) => s.id === source.id) ? prev : [...prev, source]) : prev.filter((s) => s.id !== source.id)));

  const runCommand = React.useCallback((command: AgentCommand) => {
    setPalette(null);
    if (command.run) {
      command.run();
      return;
    }
    const insert = command.directive ?? `/${command.id}`;
    const current = valueRef.current;
    const at = Math.min(insertAt.current ?? current.length, current.length);
    const head = current.slice(0, at);
    const tail = current.slice(at);
    const next = `${head}${head && !/\s$/.test(head) ? " " : ""}${insert} ${tail.replace(/^\s+/, "")}`;
    valueRef.current = next;
    onValueChange(next);
  }, [onValueChange]);

  const handleTextChange = React.useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.currentTarget.value;
    const caret = event.currentTarget.selectionStart ?? next.length;
    const trigger = paletteTrigger(valueRef.current, next, caret);
    if ((trigger === "@" && showSources) || (trigger === "/" && commands?.length)) {
      // The palette takes the keystroke: the trigger does not stay in the message.
      const without = next.slice(0, caret - 1) + next.slice(caret);
      valueRef.current = without;
      onValueChange(without);
      insertAt.current = caret - 1;
      setPalette(trigger);
      return;
    }
    valueRef.current = next;
    onValueChange(next);
    sparks.current?.bump();
  }, [showSources, commands?.length, onValueChange]);

  const showEffort = Boolean(efforts?.length && onEffortChange);
  const [effortOpen, setEffortOpen] = React.useState(false);
  const maxed = showEffort && isMaxEffort(efforts ?? [], effort);
  const reduce = usePrefersReducedMotion();
  const [focused, setFocused] = React.useState(false);
  const sparks = React.useRef<SparkFieldHandle>(null);
  const sparking = maxed && focused && !reduce;

  /* Compact is measured, not a media query: the composer is embedded at any
     width. A layout effect so the first painted frame already has it right. */
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [compact, setCompact] = React.useState(false);
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return undefined;
    const measure = () => {
      const width = root.getBoundingClientRect().width;
      setCompact(width > 0 && width < COMPACT_BELOW);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  /* ── Send ────────────────────────────────────────────────────────────── */

  const handleSubmit = async (message: PromptInputMessage) => {
    const text = message.text.trim();
    if (!text && message.files.length === 0) return;
    const read = message.files.length ? await Promise.all(message.files.map(toAttachment)) : [];
    const payload = read.length ? serialiseAttachments(text, read) : { text, attachments: [] as AgentAttachment[] };
    const options: SendOptions = {
      ...(payload.attachments.length ? { attachments: payload.attachments } : {}),
      ...(payload.text !== text ? { wireText: payload.text } : {}),
      ...(showModels && selectedModel ? { model: selectedModel.id } : {}),
      ...(webSearch ? { webSearch: true } : {}),
      ...(showSources && chosen.length ? { sources: chosen.map((s) => s.id) } : {}),
    };
    valueRef.current = "";
    setChosen([]);
    if (dictated) {
      setDictated(false);
      setThinking(true);
    }
    onValueChange("");
    onSubmit(text, options);
  };

  const handleSummarise = async () => {
    if (!summarise || summarising) return;
    setSummarising(true);
    try {
      await summarise();
      toast.success("Conversation summarised");
    } catch {
      toast.error("Could not summarise the conversation. Try again.");
    } finally {
      setSummarising(false);
    }
  };

  const usedFraction = usage && usage.maxTokens > 0 ? usage.usedTokens / usage.maxTokens : 0;
  const offerSummarise = Boolean(summarise) && usedFraction >= SUMMARISE_AT;

  /* + — one panel: files, then sources (checkable), then skills. */
  const showFiles = capabilities.attachments !== "none";
  const plusMenu =
    showFiles || showSources || skills.length ? (
      <PromptInputActionMenu>
        <PromptInputActionMenuTrigger aria-label="Add files, sources or skills" disabled={disabled} />
        <PromptInputActionMenuContent className="w-64">
          {showFiles ? <PromptInputActionAddAttachments /> : null}
          {showSources ? (
            <>
              {showFiles ? <DropdownMenuSeparator /> : null}
              <DropdownMenuLabel>Sources</DropdownMenuLabel>
              {sources?.map((source) => (
                <DropdownMenuCheckboxItem
                  checked={chosen.some((c) => c.id === source.id)}
                  key={source.id}
                  onCheckedChange={(on) => toggleSource(source, on === true)}
                  // Several sources are picked in one visit: the panel stays open.
                  onSelect={(event) => event.preventDefault()}
                >
                  {source.icon ? <Icon icon={source.icon} size="md" tone="inherit" /> : null}
                  {source.label}
                </DropdownMenuCheckboxItem>
              ))}
            </>
          ) : null}
          {skills.length ? (
            <>
              {showFiles || showSources ? <DropdownMenuSeparator /> : null}
              <DropdownMenuLabel>Skills</DropdownMenuLabel>
              {skills.map((skill) => (
                <PromptInputActionMenuItem key={skill.id} onSelect={() => runCommand(skill)}>
                  <Icon icon={skill.icon ?? SquareSlashIcon} size="md" tone="inherit" />
                  {skill.label}
                </PromptInputActionMenuItem>
              ))}
            </>
          ) : null}
        </PromptInputActionMenuContent>
      </PromptInputActionMenu>
    ) : null;

  /* Dictation and its microphone choice are one split control, beside Send. */
  const dictationControl = dictation ? (
    <div className="flex shrink-0 items-center" data-slot="composer-dictation">
      <SpeechInput
        className="shrink-0"
        deviceId={recording ? micId : undefined}
        disabled={disabled}
        onAudioRecorded={recording ? handleAudio : undefined}
        onListeningChange={handleListeningChange}
        onTranscriptionChange={handleTranscription}
        preferMediaRecorder={recording}
        size="icon-sm"
        // Inside the form, a bare button would submit the message.
        type="button"
        variant="ghost"
      />
      {recording ? (
        <MicSelector onValueChange={setMicId} value={micId}>
          <MicSelectorTrigger aria-label="Choose microphone" className="-ml-1 px-1" size="sm" type="button" variant="ghost" />
          <MicSelectorContent popoverOptions={{ align: "end", side: "top" }}>
            <MicSelectorInput />
            <MicSelectorEmpty />
            <MicSelectorList>
              {(devices) =>
                devices.map((device) => (
                  <MicSelectorItem key={device.deviceId} value={device.deviceId}>
                    <MicSelectorLabel device={device} />
                  </MicSelectorItem>
                ))
              }
            </MicSelectorList>
          </MicSelectorContent>
        </MicSelector>
      ) : null}
    </div>
  ) : null;

  /* Search · model · Effort — in the box when there is room, under it when compact. */
  const secondary = (
    <div className="flex min-w-0 items-center gap-1" data-slot="composer-options">
      <PromptInputButton
        aria-label="Search the web"
        aria-pressed={webSearch}
        onClick={() => onWebSearchChange(!webSearch)}
        tooltip="Search the web for this message"
        type="button"
        variant={webSearch ? "default" : "ghost"}
      >
        <Icon icon={GlobeIcon} size="md" />
        <span className="hidden @sm/composer:inline">Search</span>
      </PromptInputButton>

      {showModels && selectedModel ? (
        <ModelSelector onOpenChange={setModelOpen} open={modelOpen}>
          <ModelSelectorTrigger asChild>
            <PromptInputButton type="button">
              {selectedModel.provider ? <ModelSelectorLogo provider={selectedModel.provider} /> : null}
              <ModelSelectorName className="max-w-20 truncate @sm/composer:max-w-40">{selectedModel.name}</ModelSelectorName>
            </PromptInputButton>
          </ModelSelectorTrigger>
          <ModelSelectorContent title="Choose a model">
            <ModelSelectorInput placeholder="Search models..." />
            <ModelSelectorList>
              <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
              {Array.from(new Set(models?.map((m) => m.provider ?? "Models"))).map((provider) => (
                <ModelSelectorGroup heading={provider} key={provider}>
                  {models
                    ?.filter((m) => (m.provider ?? "Models") === provider)
                    .map((m) => (
                      <ModelSelectorItem
                        key={m.id}
                        onSelect={() => {
                          onModelChange?.(m.id);
                          setModelOpen(false);
                        }}
                        value={`${m.name} ${m.id}`}
                      >
                        {m.provider ? <ModelSelectorLogo provider={m.provider} /> : null}
                        <ModelSelectorName>{m.name}</ModelSelectorName>
                      </ModelSelectorItem>
                    ))}
                </ModelSelectorGroup>
              ))}
            </ModelSelectorList>
          </ModelSelectorContent>
        </ModelSelector>
      ) : null}

      {showEffort && effort ? (
        <Popover onOpenChange={setEffortOpen} open={effortOpen}>
          <PopoverTrigger asChild>
            <PromptInputButton
              aria-label={`Choose effort, ${effort}`}
              className={cn(maxed && "text-agent hover:text-agent")}
              disabled={disabled}
              type="button"
            >
              <Icon icon={GaugeIcon} size="md" tone="inherit" />
              <span className="hidden @sm/composer:inline">{effort}</span>
            </PromptInputButton>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            aria-label="Effort"
            className="w-64 p-3.5"
            onCloseAutoFocus={(event) => {
              // Back to the message, so the sparks it just armed are seen.
              event.preventDefault();
              textareaRef.current?.focus();
            }}
            side="top"
          >
            <EffortSlider
              efforts={efforts ?? []}
              onEscape={() => setEffortOpen(false)}
              onValueChange={(level) => onEffortChange?.(level)}
              value={effort}
            />
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  );

  /* Summarise · the context meter. */
  const meters =
    offerSummarise || usage ? (
      <div className="flex shrink-0 items-center gap-1" data-slot="composer-meters">
        {offerSummarise ? (
          <PromptInputButton
            aria-label="Summarise"
            // Not while a reply is being written: the summary would land inside it.
            disabled={summarising || status !== "ready"}
            onClick={handleSummarise}
            tooltip="Condense this conversation to free up context"
            type="button"
          >
            {summarising ? <Spinner /> : <Icon icon={ListCollapseIcon} size="md" />}
            <span className="hidden @sm/composer:inline">Summarise</span>
          </PromptInputButton>
        ) : null}
        {usage ? (
          <Context {...contextProps(usage)}>
            <ContextTrigger className="[&>span]:hidden @sm/composer:[&>span]:inline" size="sm" />
            <ContextContent>
              <ContextContentHeader />
              <ContextContentBody className="space-y-1.5">
                <ContextInputUsage />
                <ContextOutputUsage />
                <ContextReasoningUsage />
                <ContextCacheUsage />
              </ContextContentBody>
              <ContextContentFooter />
            </ContextContent>
          </Context>
        ) : null}
      </div>
    ) : null;

  return (
    <TooltipProvider>
      <div
        data-slot="workspace-composer"
        data-compact={compact ? "" : undefined}
        ref={rootRef}
        className={cn("@container/composer flex w-full flex-col", className)}
      >
        {dock ? (
          <div
            data-slot="workspace-composer-dock"
            className="mx-auto w-[95%] *:rounded-b-none *:border-b-0"
          >
            {dock}
          </div>
        ) : null}

        {/* `@` and `/` open their palette above the whole composer. */}
        <Popover onOpenChange={(open) => (open ? undefined : closePalette())} open={palette !== null}>
          <PopoverAnchor asChild>
            <div>
        {/* A tall composer as a pill clips its own placeholder on a phone; Claude's is a rounded rectangle. */}
        <PromptInput
          className="[&_[data-slot=input-group]]:isolate [&_[data-slot=input-group]]:rounded-3xl"
          globalDrop
          multiple
          maxFileSize={MAX_FILE_BYTES}
          onError={(error) => toast.error(error.message)}
          onSubmit={handleSubmit}
        >
          <SparkField active={sparking} ref={sparks} />
          <PromptInputHeader>
            <ComposerAttachments />
            {showSources && chosen.length > 0 ? (
              <Attachments aria-label="Sources" variant="inline">
                {chosen.map((source) => (
                  <Attachment data={sourceChip(source)} key={source.id} onRemove={() => removeSource(source.id)}>
                    <AttachmentPreview />
                    <AttachmentInfo />
                    <AttachmentRemove label={`Remove ${source.label}`} />
                  </Attachment>
                ))}
              </Attachments>
            ) : null}
            {listening && segments.length > 0 ? (
              <Transcription
                aria-live="polite"
                className="w-full"
                currentTime={segments.length - 0.5}
                segments={segments}
              >
                {(segment, index) => (
                  <TranscriptionSegment
                    key={`${segment.startSecond}-${segment.endSecond}`}
                    index={index}
                    segment={segment}
                  />
                )}
              </Transcription>
            ) : null}
            {transcribing ? (
              <Shimmer as="p" className="type-small text-muted-foreground">
                Transcribing…
              </Shimmer>
            ) : null}
          </PromptInputHeader>

          <PromptInputBody>
            <PromptInputTextarea
              aria-label="Message"
              disabled={disabled}
              onBlur={() => setFocused(false)}
              onChange={handleTextChange}
              onFocus={() => setFocused(true)}
              ref={textareaRef}
              placeholder={disabled && disabledReason ? disabledReason : "Message the agent…"}
              value={value}
            />
          </PromptInputBody>

          <PromptInputFooter>
            <PromptInputTools className="min-w-0 flex-1 flex-wrap gap-y-1">
              {plusMenu}
              {compact ? null : secondary}
            </PromptInputTools>

            <div className="ml-auto flex shrink-0 items-center gap-1">
              {compact ? null : meters}
              {dictationControl}
              <ComposerSubmit disabled={disabled} hasText={value.trim().length > 0} onStop={onStop} status={status} />
            </div>
          </PromptInputFooter>
        </PromptInput>
            </div>
          </PopoverAnchor>
          <PopoverContent
            align="start"
            aria-label={palette === "@" ? "Sources" : "Commands"}
            className="p-0"
            onCloseAutoFocus={(event) => {
              // Back to the message, not to whatever opened the palette.
              event.preventDefault();
              textareaRef.current?.focus();
            }}
            side="top"
          >
            <PromptInputCommand>
              <PromptInputCommandInput
                aria-label={palette === "@" ? "Search sources" : "Search commands"}
                placeholder={palette === "@" ? "Add a source…" : "Run a command…"}
              />
              <PromptInputCommandList>
                <PromptInputCommandEmpty>{palette === "@" ? "No sources found." : "No commands found."}</PromptInputCommandEmpty>
                {palette === "@" ? (
                  <PromptInputCommandGroup heading="Sources">
                    {sources
                      ?.filter((s) => !chosen.some((c) => c.id === s.id))
                      .map((source) => (
                        <PromptInputCommandItem
                          key={source.id}
                          onSelect={() => addSource(source)}
                          value={`${source.label} ${source.description ?? ""}`}
                        >
                          {source.icon ? <Icon icon={source.icon} size="md" tone="inherit" /> : null}
                          <span className="flex min-w-0 flex-col">
                            <span className="type-nav truncate">{source.label}</span>
                            {source.description ? (
                              <span className="type-small truncate text-muted-foreground">{source.description}</span>
                            ) : null}
                          </span>
                        </PromptInputCommandItem>
                      ))}
                  </PromptInputCommandGroup>
                ) : (
                  <PromptInputCommandGroup heading="Commands">
                    {commands?.map((command) => (
                      <PromptInputCommandItem
                        key={command.id}
                        onSelect={() => runCommand(command)}
                        value={`${command.label} ${command.hint ?? ""}`}
                      >
                        <Icon icon={command.icon ?? SquareSlashIcon} size="md" tone="inherit" />
                        <span className="flex min-w-0 flex-col">
                          <span className="type-nav truncate">
                            {/* A command is typed as /name; a skill keeps its own name. */}
                          {command.group === "skill" || command.label.startsWith("/") ? command.label : `/${command.label}`}
                          </span>
                          {command.hint ? (
                            <span className="type-small truncate text-muted-foreground">{command.hint}</span>
                          ) : null}
                        </span>
                      </PromptInputCommandItem>
                    ))}
                  </PromptInputCommandGroup>
                )}
              </PromptInputCommandList>
            </PromptInputCommand>
          </PopoverContent>
        </Popover>

        {compact ? (
          <div className="mt-2 flex items-center gap-1 px-1" data-slot="composer-below">
            {secondary}
            <div className="ml-auto">{meters}</div>
          </div>
        ) : null}
      </div>
    </TooltipProvider>
  );
}
