"use client";

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
  name?: string;
  title?: string;
  avatar?: AvatarRenderer;
  state?: AgentState;
  leading?: React.ReactNode;
  voiceState: VoiceState;
  settings: WorkspaceSettingsProps;
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
