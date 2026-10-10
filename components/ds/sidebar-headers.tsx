"use client";

import { useState } from "react";
import {
  Check,
  ChevronsUpDown,
  GalleryVerticalEnd,
  Plus,
  Search,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import {
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const TEAMS = [
  { name: "Eclipse Vault", plan: "Enterprise" },
  { name: "Acme Corp.", plan: "Startup" },
  { name: "Evil Corp.", plan: "Free" },
];

const VERSIONS = ["1.4.0-beta", "1.3.2", "1.2.9"];

function Tile() {
  return (
    <span className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
      <Icon icon={GalleryVerticalEnd} />
    </span>
  );
}

export function TeamSwitcherHeader() {
  const [team, setTeam] = useState(TEAMS[0]);

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" tooltip={team.name}>
                <Tile />
                <span className="grid min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
                  <span className="type-nav truncate text-foreground">
                    {team.name}
                  </span>
                  <span className="type-small truncate text-muted-foreground">
                    {team.plan}
                  </span>
                </span>
                <Icon icon={ChevronsUpDown} className="ml-auto group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
              align="start"
              side="right"
              sideOffset={4}
            >
              <DropdownMenuLabel>Teams</DropdownMenuLabel>
              {TEAMS.map((t) => (
                <DropdownMenuItem key={t.name} onSelect={() => setTeam(t)}>
                  {t.name}
                  {t.name === team.name && (
                    <Icon
                      icon={Check}
                      size="sm"
                      tone="inherit"
                      className="ml-auto"
                    />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Icon icon={Plus} size="sm" tone="inherit" />
                Add team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

export function VersionSwitcherHeader() {
  const [version, setVersion] = useState(VERSIONS[0]);

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" tooltip={`Version ${version}`}>
                <Tile />
                <span className="grid min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
                  <span className="type-nav truncate text-foreground">
                    Documentation
                  </span>
                  <span className="type-number-sm truncate text-muted-foreground">
                    v{version}
                  </span>
                </span>
                <Icon icon={ChevronsUpDown} className="ml-auto group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-48"
              align="start"
              side="right"
              sideOffset={4}
            >
              {VERSIONS.map((v) => (
                <DropdownMenuItem key={v} onSelect={() => setVersion(v)}>
                  <span className="type-number-sm">v{v}</span>
                  {v === version && (
                    <Icon
                      icon={Check}
                      size="sm"
                      tone="inherit"
                      className="ml-auto"
                    />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

export function SearchFormHeader() {
  return (
    <SidebarHeader>
      <form onSubmit={(event) => event.preventDefault()}>
        <div className="relative">
          <Label htmlFor="ds-sidebar-search" className="sr-only">
            Search the docs
          </Label>
          <SidebarInput
            id="ds-sidebar-search"
            placeholder="Search the docs…"
            className="pl-8"
          />
          <Icon
            icon={Search}
            size="sm"
            tone="muted"
            className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 select-none"
          />
        </div>
      </form>
    </SidebarHeader>
  );
}
