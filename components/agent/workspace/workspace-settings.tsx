"use client";

/**
 * WorkspaceSettings — the settings `Sheet` content for `AgentWorkspace`.
 *
 *   Autonomy      ask / plan first / act — chosen here now (it used to sit in the
 *                 prompt bar's toolbar; the composer is an AI Elements
 *                 `PromptInput` and carries no mode control)
 *   Response      length and temperature
 *   Voice         the read-aloud voice, chosen in AI Elements' `VoiceSelector`
 *   About         the connected agent in AI Elements' `Agent` — only when the
 *                 transport describes one (`transport.agent`)
 *
 * Every setting is an explicit value / onChange pair, lifted into
 * `AgentWorkspace` so it can also build `SendOptions.settings` from them
 * (`{ autonomy, temperature, length }`, sent only when
 * `transport.capabilities.settings` is true). The voice is not part of
 * `SendOptions` — it is how replies are READ, not how they are written — and
 * `voices` is whatever the speech adapter reports (`useBrowserSpeech().voices`),
 * so the picker lists the real voices of this machine, never an invented
 * catalogue (and so has no preview audio: the browser gives none).
 *
 * The two sliders: "Response length" is `settings.length` (0-100, a verbosity
 * dial); "Temperature" is `settings.temperature` (0-2, step 0.1, default 0.7).
 */

import * as React from "react";
import { ListChecksIcon, MessageCircleIcon, ZapIcon } from "lucide-react";
import type { Tool } from "ai";

import {
  Agent,
  AgentContent,
  AgentHeader,
  AgentInstructions,
  AgentOutput,
  AgentTool,
  AgentTools,
} from "@/components/ai-elements/agent";
import {
  VoiceSelector,
  VoiceSelectorContent,
  VoiceSelectorDescription,
  VoiceSelectorEmpty,
  VoiceSelectorInput,
  VoiceSelectorItem,
  VoiceSelectorList,
  VoiceSelectorName,
  VoiceSelectorTrigger,
} from "@/components/ai-elements/voice-selector";
import type { AgentProfile } from "@/components/agent/core/types";
import type { SpeechVoice } from "@/components/agent/voice/speech";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { Slider } from "@/components/ui/slider";
import {
  SheetBody,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type AutonomyMode = "ask" | "plan" | "act";

const AUTONOMY_LABEL: Record<AutonomyMode, string> = {
  ask: "Ask",
  plan: "Plan first",
  act: "Act",
};

const AUTONOMY_DETAIL: Record<AutonomyMode, { description: string; icon: typeof ZapIcon }> = {
  ask: { description: "Answers, never acts", icon: MessageCircleIcon },
  plan: { description: "Proposes a plan to approve", icon: ListChecksIcon },
  act: { description: "Acts, asking only when it must", icon: ZapIcon },
};

const AUTONOMY_MODES: AutonomyMode[] = ["ask", "plan", "act"];

/** The defaults `AgentWorkspace` itself initialises these to — "Reset to defaults" restores exactly these. */
export const DEFAULT_RESPONSE_LENGTH = 50;
export const DEFAULT_TEMPERATURE = 0.7;

/**
 * Both sliders read as a raw number beside a word — a bare 0-100 or 0-2 figure
 * means nothing to someone who has never seen the scale. Three bands each.
 */
function lengthLabel(value: number): string {
  if (value <= 33) return "Short";
  if (value <= 66) return "Medium";
  return "Long";
}

function temperatureLabel(value: number): string {
  if (value <= 0.66) return "Precise";
  if (value <= 1.33) return "Balanced";
  return "Creative";
}

export type WorkspaceSettingsProps = {
  /** Forwarded as `SendOptions.settings.autonomy`. */
  autonomy: AutonomyMode;
  onAutonomyChange: (autonomy: AutonomyMode) => void;
  /** 0-100 — forwarded as `SendOptions.settings.length`. */
  length: number;
  onLengthChange: (length: number) => void;
  /** 0-2, step 0.1 — forwarded as `SendOptions.settings.temperature`. */
  temperature: number;
  onTemperatureChange: (temperature: number) => void;
  /** The read-aloud voice's id, or null for the system default. */
  voice?: string | null;
  onVoiceChange?: (id: string) => void;
  /** The voices the speech adapter offers. The Voice section renders only when there are some. */
  voices?: SpeechVoice[];
  /** What the connected agent is — the "About this agent" section renders only when present. */
  agent?: AgentProfile;
  /** Restores autonomy, length and temperature to their defaults. */
  onReset?: () => void;
  /** True while the transport is not ready to receive a message yet. */
  disabled?: boolean;
  className?: string;
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="space-y-3">
      <h3 id={id} className="type-h4 text-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

function AutonomySection({
  autonomy,
  onAutonomyChange,
  disabled,
}: Pick<WorkspaceSettingsProps, "autonomy" | "onAutonomyChange" | "disabled">) {
  return (
    <Section id="workspace-autonomy-title" title="Autonomy">
      <RadioGroup
        aria-labelledby="workspace-autonomy-title"
        value={autonomy}
        onValueChange={(value) => onAutonomyChange(value as AutonomyMode)}
        disabled={disabled}
        className="gap-1"
      >
        {AUTONOMY_MODES.map((mode) => {
          const detail = AUTONOMY_DETAIL[mode];
          return (
            <label
              key={mode}
              htmlFor={`workspace-autonomy-${mode}`}
              className="flex min-h-(--size-target-min) cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-secondary has-disabled:cursor-not-allowed"
            >
              <RadioGroupItem id={`workspace-autonomy-${mode}`} value={mode} />
              <Icon icon={detail.icon} size="md" tone="muted" aria-hidden />
              <span className="flex min-w-0 flex-col">
                <span className="type-small text-foreground">{AUTONOMY_LABEL[mode]}</span>
                <span className="type-small text-muted-foreground">{detail.description}</span>
              </span>
            </label>
          );
        })}
      </RadioGroup>
    </Section>
  );
}

function VoiceSection({
  voice,
  voices,
  onVoiceChange,
  disabled,
}: {
  voice?: string | null;
  voices: SpeechVoice[];
  onVoiceChange?: (id: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = voices.find((v) => v.id === voice);
  return (
    <Section id="workspace-voice-title" title="Voice">
      <p className="type-small text-muted-foreground">The voice that reads answers aloud.</p>
      <VoiceSelector open={open} onOpenChange={setOpen} value={voice ?? undefined}>
        <VoiceSelectorTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            disabled={disabled}
            aria-label={`Read-aloud voice: ${selected?.label ?? "System default"}`}
          >
            <span className="min-w-0 flex-1 truncate text-left">{selected?.label ?? "System default"}</span>
          </Button>
        </VoiceSelectorTrigger>
        <VoiceSelectorContent title="Read-aloud voice">
          <VoiceSelectorInput placeholder="Search voices..." />
          <VoiceSelectorList>
            <VoiceSelectorEmpty>No voices found.</VoiceSelectorEmpty>
            {voices.map((v) => (
              <VoiceSelectorItem
                key={v.id}
                value={`${v.label} ${v.lang} ${v.id}`}
                onSelect={() => {
                  onVoiceChange?.(v.id);
                  setOpen(false);
                }}
              >
                <VoiceSelectorName>{v.label}</VoiceSelectorName>
                <VoiceSelectorDescription>
                  {v.lang} · {v.local ? "On this device" : "Online"}
                </VoiceSelectorDescription>
              </VoiceSelectorItem>
            ))}
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    </Section>
  );
}

function AboutSection({ agent }: { agent: AgentProfile }) {
  return (
    <Section id="workspace-about-title" title="About this agent">
      <Agent>
        <AgentHeader name={agent.name} model={agent.model} />
        {agent.instructions || agent.tools?.length || agent.outputSchema ? (
          <AgentContent>
            {agent.instructions ? <AgentInstructions>{agent.instructions}</AgentInstructions> : null}
            {agent.tools?.length ? (
              <AgentTools type="multiple">
                {agent.tools.map((tool) => (
                  <AgentTool
                    key={tool.name}
                    value={tool.name}
                    tool={{ description: tool.description, inputSchema: tool.schema ?? {} } as unknown as Tool}
                  />
                ))}
              </AgentTools>
            ) : null}
            {agent.outputSchema ? <AgentOutput schema={agent.outputSchema} /> : null}
          </AgentContent>
        ) : null}
      </Agent>
    </Section>
  );
}

export function WorkspaceSettings({
  autonomy,
  onAutonomyChange,
  length,
  onLengthChange,
  temperature,
  onTemperatureChange,
  voice,
  onVoiceChange,
  voices,
  agent,
  onReset,
  disabled,
  className,
}: WorkspaceSettingsProps) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <SheetHeader>
        <SheetTitle>Workspace settings</SheetTitle>
        <SheetDescription>Autonomy, length and temperature are sent with every message.</SheetDescription>
      </SheetHeader>

      <SheetBody className="space-y-8">
        <AutonomySection autonomy={autonomy} onAutonomyChange={onAutonomyChange} disabled={disabled} />

        <Section id="workspace-response-title" title="Response">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="workspace-length" className="type-small text-foreground">
                Response length
              </label>
              <span className="anim-change type-small text-foreground" key={lengthLabel(length)}>
                {lengthLabel(length)}
              </span>
            </div>
            <Slider
              id="workspace-length"
              value={[length]}
              onValueChange={(value) => onLengthChange(value[0])}
              min={0}
              max={100}
              step={50}
              disabled={disabled}
              thumbLabels={["Response length"]}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="workspace-temperature" className="type-small text-foreground">
                Temperature
              </label>
              <span className="flex items-baseline gap-1.5">
                <span className="anim-change type-small text-foreground" key={temperatureLabel(temperature)}>
                  {temperatureLabel(temperature)}
                </span>
                <span className="type-number-sm text-muted-foreground">{temperature.toFixed(1)}</span>
              </span>
            </div>
            <Slider
              id="workspace-temperature"
              value={[temperature]}
              onValueChange={(value) => onTemperatureChange(value[0])}
              min={0}
              max={2}
              step={0.1}
              disabled={disabled}
              thumbLabels={["Temperature"]}
            />
          </div>
        </Section>

        {voices?.length ? (
          <VoiceSection voice={voice} voices={voices} onVoiceChange={onVoiceChange} disabled={disabled} />
        ) : null}

        {agent ? <AboutSection agent={agent} /> : null}
      </SheetBody>

      <SheetFooter className="flex-row justify-between">
        {onReset ? (
          <Button type="button" variant="ghost" onClick={onReset}>
            Reset to defaults
          </Button>
        ) : null}
        <SheetClose asChild>
          <Button type="button" variant="outline">
            Close
          </Button>
        </SheetClose>
      </SheetFooter>
    </div>
  );
}
