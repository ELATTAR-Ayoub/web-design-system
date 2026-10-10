"use client";

/**
 * WorkspaceHeader — thin, Claude-style: leading slot · agent avatar · name / title ·
 * voice orb (only while voice is active) · settings gear. No activity toggle, no
 * New-chat icon, no status text — those live where they belong (the history
 * sidebar, the run inline in the thread).
 *
 * The face is the agent's own avatar (`CubeAvatar` by default — the set of
 * twenty-six animated scenes, one per agent state), drawn for the agent's
 * current `state`, so the header shows at a glance that it is thinking,
 * running a tool or waiting. A caller that brings its own face passes
 * `avatar` (an `AvatarRenderer`).
 *
 * `VoiceOrb` is the voice-mode face. It mounts through `usePresence` when
 * `voiceState` leaves "idle" and plays its exit before it unmounts, keeping the
 * last active state on screen while it leaves rather than flickering to
 * "idle". `VoiceState` is the composer's: listening / thinking / speaking are
 * the orb's own states, unchanged.
 *
 * The gear opens the settings `Sheet` only when `showSettings` is true, i.e. when
 * the transport advertises `capabilities.settings`.
 */

import * as React from "react";
import { SettingsIcon } from "lucide-react";

import { CubeAvatar } from "@/components/agent/avatar/cube-avatar";
import { usePresence } from "@/components/agent/core/use-presence";
import { VoiceOrb, type VoiceOrbState } from "@/components/agent/parts/voice-orb";
import type { AvatarRenderer } from "@/components/agent/avatar/types";
import type { AgentState } from "@/components/agent/core/states";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { VoiceState } from "./workspace-composer";
import { WorkspaceSettings, type WorkspaceSettingsProps } from "./workspace-settings";

export type WorkspaceHeaderProps = {
  /** The agent's display name, beside the logo. Default "Agent". */
  name?: string;
  /** The conversation's own title. Absent renders nothing — no placeholder. */
  title?: string;
  /** The agent's face, drawn for `state`. Defaults to `CubeAvatar`. */
  avatar?: AvatarRenderer;
  /** The agent's state, for `avatar`. */
  state?: AgentState;
  /** Leading slot — the controller puts the history SidebarTrigger here. */
  leading?: React.ReactNode;
  /** The voice orb shows only while voice is active (state !== "idle"); the avatar stays the face. */
  voiceState: VoiceState;
  settings: WorkspaceSettingsProps;
  /** Whether `transport.capabilities.settings` is true — gates the gear and its sheet. */
  showSettings?: boolean;
  settingsOpen?: boolean;
  onSettingsOpenChange?: (open: boolean) => void;
  className?: string;
};

export function WorkspaceHeader({
  name = "Agent",
  title,
  avatar: Avatar = CubeAvatar,
  state = "idle",
  leading,
  voiceState,
  settings,
  showSettings = true,
  settingsOpen,
  onSettingsOpenChange,
  className,
}: WorkspaceHeaderProps) {
  const active = voiceState !== "idle";
  const presence = usePresence(active);

  // Keep showing the last active state while the orb plays its exit.
  const [shown, setShown] = React.useState<VoiceOrbState>("listening");
  if (voiceState !== "idle" && shown !== voiceState) setShown(voiceState);

  return (
    <header
      data-slot="workspace-header"
      className={cn("flex items-center gap-3 border-b border-border px-4 py-3", className)}
    >
      {leading}

      <div data-slot="workspace-header-avatar" className="shrink-0">
        <Avatar state={state} size="sm" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="type-small truncate text-foreground">{name}</p>
        {title ? <p className="type-small truncate text-muted-foreground">{title}</p> : null}
      </div>

      {presence.mounted ? (
        <div data-slot="workspace-header-voice" className={cn("size-8 shrink-0", presence.className)}>
          <VoiceOrb state={shown} />
        </div>
      ) : null}

      {showSettings ? (
        <Sheet open={settingsOpen} onOpenChange={onSettingsOpenChange}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="min-h-(--size-target-min) min-w-(--size-target-min)"
                    aria-label="Open workspace settings"
                  >
                    <Icon icon={SettingsIcon} size="sm" tone="inherit" aria-hidden />
                  </Button>
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <SheetContent side="right">
            <WorkspaceSettings {...settings} />
          </SheetContent>
        </Sheet>
      ) : null}
    </header>
  );
}
