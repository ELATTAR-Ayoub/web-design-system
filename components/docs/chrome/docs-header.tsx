"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/ds/logo";
import { ThemeToggle } from "@/components/ds/theme-toggle";
import { DS_ROOT } from "@/lib/ds/nav";
import { cn } from "@/lib/utils";

import { DocsRailTree } from "./docs-rail";
import { DocsSearch } from "./docs-search";

const DESTINATIONS = [
  { title: "Documentation", href: `${DS_ROOT}/docs/introduction` },
  { title: "Components", href: `${DS_ROOT}/components` },
  { title: "Charts", href: `${DS_ROOT}/components/charts` },
  { title: "Agent", href: `${DS_ROOT}/components/agent` },
] as const;

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

export function DocsHeader() {
  const isActive = useIsActive();

  return (
    <header className="sticky top-0 z-40 flex h-(--height-site-header) shrink-0 items-center gap-4 border-b border-border bg-background/85 px-6 backdrop-blur-xl">
      <Sheet>
        <SheetTrigger asChild>
          {/* `lg:hidden`, the same breakpoint the rail appears at. The two used
              to disagree in this shell's predecessor, leaving a band of widths
              with no navigation at all — no rail, no trigger. */}
          <Button variant="outline" size="icon" className="lg:hidden">
            <Icon icon={MenuIcon} tone="inherit" />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-(--width-sidebar-mobile) overflow-y-auto px-6">
          <SheetHeader className="px-0">
            <SheetTitle asChild>
              <Link href={DS_ROOT}>
                <Logo />
              </Link>
            </SheetTitle>
          </SheetHeader>
          <nav aria-label="Primary" className="mb-8 grid gap-1">
            {DESTINATIONS.map((destination) => (
              <Link
                key={destination.href}
                href={destination.href}
                aria-current={isActive(destination.href) ? "page" : undefined}
                className={cn(
                  "type-nav rounded-md px-3 py-3 transition-colors duration-fast",
                  isActive(destination.href)
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {destination.title}
              </Link>
            ))}
          </nav>
          {/* The whole rail, not a summary of it. See this file's header. */}
          <DocsRailTree />
        </SheetContent>
      </Sheet>

      <Link href={DS_ROOT} className="press shrink-0">
        <Logo />
      </Link>

      <nav aria-label="Primary" className="hidden min-w-0 items-center gap-1 lg:flex">
        {DESTINATIONS.map((destination) => (
          <Link
            key={destination.href}
            href={destination.href}
            aria-current={isActive(destination.href) ? "page" : undefined}
            className={cn(
              "type-nav rounded-md px-3 py-1.5 transition-colors duration-fast",
              isActive(destination.href)
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {destination.title}
          </Link>
        ))}
      </nav>

      <div className="ms-auto flex items-center gap-2">
        <DocsSearch />
        <ThemeToggle />
      </div>
    </header>
  );
}
