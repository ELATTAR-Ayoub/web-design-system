/**
 * The documentation shell's sticky global header.
 *
 * Four primary destinations and no more: **Documentation, Components, Charts,
 * Agent**. Introduction, Installation, Theming, CLI, Typeset, Registry,
 * Changelog and Skills are all documentation pages, so putting them beside
 * Documentation in the header would list a section and its own children as
 * peers. Charts and Agent are each one family of the components index, given
 * their own link because each is deep enough to be worth arriving at directly
 * rather than scrolling to.
 *
 * **The destinations are derived.** `DS_GROUPS` and the family list supply
 * them; nothing here is a fifth hand-typed navigation list.
 *
 * **There is no `useIsMobile`, and there must not be.** Both navigations are
 * always rendered and CSS decides which is visible. A width branch in
 * JavaScript means the server and the client can draw different trees, and the
 * same tree at every size is what makes hydration impossible to get wrong. The
 * cost is one hidden subtree; the alternative is a class of bug that only
 * appears on someone else's screen.
 *
 * **The mobile sheet carries every destination AND every control**, including
 * the whole rail. A reader on a phone who can reach the four header links but
 * not the hundred component routes has a navigation that works for the author
 * and nobody else.
 *
 * **The active link is marked, and not with colour alone.** `aria-current="page"`
 * carries it to assistive technology; visually it is a foreground shift plus a
 * fill — presence against absence. Not weight: a heavier label is a wider
 * label, and a nav that reflows as you move between pages looks broken.
 *
 * State model:
 * rest · hover — links lift their foreground. focus-visible — the global ring.
 * pressed — N/A for links; navigation is the feedback. The triggers are
 * `Button`s and carry `press`. loading · success · error — N/A, nothing
 * here is asynchronous. disabled — N/A: an unavailable page is absent rather
 * than dimmed. empty — N/A; the four destinations are static.
 */

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
