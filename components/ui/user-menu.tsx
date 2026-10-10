"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export type UserMenuItem = {
  label: string
  // An element, not a component: functions can't cross the server/client boundary.
  icon: React.ReactNode
  onSelect?: () => void
  destructive?: boolean
}

const NARROW_QUERY = "(max-width: 1023px)"

function useIsNarrow() {
  return React.useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(NARROW_QUERY)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    () => window.matchMedia(NARROW_QUERY).matches,
    () => false,
  )
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function Identity({
  user,
  collapsible = false,
}: {
  user: { name: string; email: string; avatar?: string }
  collapsible?: boolean
}) {
  return (
    <>
      <Avatar className="size-8 shrink-0">
        {user.avatar && <AvatarImage src={user.avatar} alt="" />}
        <AvatarFallback className="type-number-sm">
          {initials(user.name)}
        </AvatarFallback>
      </Avatar>
      <span
        className={
          collapsible
            ? "grid min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden"
            : "grid min-w-0 flex-1 text-left"
        }
      >
        <span className="type-nav truncate text-foreground">{user.name}</span>
        <span className="type-small truncate text-muted-foreground">
          {user.email}
        </span>
      </span>
    </>
  )
}

export function UserMenu({
  user,
  items,
}: {
  user: { name: string; email: string; avatar?: string }
  items: UserMenuItem[]
}) {
  const { isMobile } = useSidebar()
  const narrow = useIsNarrow()
  const normal = items.filter((item) => !item.destructive)
  const destructive = items.filter((item) => item.destructive)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" tooltip={user.name}>
              <Identity user={user} collapsible />
          <Icon icon={ChevronsUpDown} className="ml-auto group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 max-w-72"
            side={isMobile || narrow ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            collisionPadding={16}
          >
            <DropdownMenuLabel>
              <span className="flex items-center gap-2">
                <Identity user={user} />
              </span>
            </DropdownMenuLabel>

            {normal.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {normal.map((item) => (
                    <DropdownMenuItem key={item.label} onSelect={item.onSelect}>
                      {item.icon}
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </>
            )}

            {destructive.length > 0 && (
              <>
                <DropdownMenuSeparator />
                {destructive.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    variant="destructive"
                    onSelect={item.onSelect}
                  >
                    {item.icon}
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
