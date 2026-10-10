"use client";

/**
 * The account menu, fully interactive.
 *
 * `page.tsx` must stay a plain spec module (trap 29), so the two rows of
 * state the Preview needs — the "Notify on price drops" checkbox and the
 * "Appearance" radio group inside the Preferences submenu — live here.
 * Everything else (the identity header, the Kbd-shortcut rows, the
 * destructive sign-out below its own separator) needs no state and is
 * rendered inline with it, so the Preview reads as one real menu rather than
 * a static half plus a stateful fragment bolted on.
 */

import { useState } from "react";

import { Bell, LogOut, Palette, Settings, ShieldCheck, Wallet } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Kbd } from "@/components/ui/kbd";

export function DropdownMenuShowcase() {
  const [notifyOnDrops, setNotifyOnDrops] = useState(true);
  const [appearance, setAppearance] = useState("system");

  return (
    <div className="flex w-full max-w-md items-center justify-between gap-4 rounded-lg border border-border bg-card px-3 py-2">
      <p className="type-small text-muted-foreground">Signed in</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2.5 px-2">
            <Avatar className="size-7">
              <AvatarFallback className="type-number-sm">VW</AvatarFallback>
            </Avatar>
            <span className="type-small text-foreground">voidwing</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>
            <span className="block text-foreground">voidwing</span>
            <span className="type-small mt-1 flex items-center gap-1.5 text-muted-foreground">
              <Icon icon={ShieldCheck} size="xs" tone="success" />
              Verified · Rank 24
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icon icon={Wallet} size="sm" tone="subtle" />
              Wallet
              <DropdownMenuShortcut>
                <Kbd>⌘W</Kbd>
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem disabled disabledReason="Settle your balance first.">
              Transfer funds
            </DropdownMenuItem>
            <DropdownMenuCheckboxItem
              checked={notifyOnDrops}
              onCheckedChange={setNotifyOnDrops}
            >
              <Icon icon={Bell} size="sm" tone="subtle" />
              Notify on price drops
            </DropdownMenuCheckboxItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Icon icon={Settings} size="sm" tone="subtle" />
                Preferences
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuLabel className="flex items-center gap-1.5">
                  <Icon icon={Palette} size="xs" tone="subtle" />
                  Appearance
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={appearance} onValueChange={setAppearance}>
                  <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Icon icon={LogOut} size="sm" tone="inherit" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
