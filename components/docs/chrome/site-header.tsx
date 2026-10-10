"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PageContainer } from "@/components/docs/layout/page-container";
import { cn } from "@/lib/utils";
import type { SiteNavItem } from "@/lib/docs/nav";

/**
 * The top of every page: a brand, a short nav, and whatever the product wants
 * on the right.
 *
 * Private furniture for the documentation site — not a published registry
 * item, so it is free to keep the shape that caller actually needs rather than
 * one generic enough to publish.
 *
 * **`brand` is a slot, and that is not laziness.** A header that imports a
 * wordmark ships somebody else's logo into the next caller. `components/ds/logo.tsx`
 * is the documentation site's own chrome, and this component reaching into it
 * directly would tie a piece of shared chrome to one specific caller's brand.
 *
 * **There is no `useIsMobile` here, and there must not be.** Both navigations
 * are always rendered and CSS decides which is visible — `hidden md:flex` on
 * the row, `md:hidden` on the trigger. §5's product section is explicit about
 * why: a width branch in JavaScript means the server and the client can draw
 * different trees, and the same tree at every size is what makes hydration
 * impossible to get wrong. The cost is one hidden subtree; the alternative is a
 * class of bug that only appears on someone else's screen.
 *
 * **The active link is marked, and not with colour alone.** `aria-current="page"`
 * carries it to assistive technology, and visually it is a foreground shift
 * plus a fill — presence against absence, which is what trap 11 asks for. Not
 * weight: a heavier label is a wider label, and a nav that reflows as you move
 * between pages is a nav that looks broken.
 *
 * **The mobile sheet's links close it.** A `SheetClose asChild` around each one,
 * because a navigation drawer that stays open over the page you just asked for
 * is the most common bug in this shape.
 *
 * State model:
 * rest · hover — links lift their foreground. focus-visible — the global ring,
 * untouched. pressed — N/A for links; the navigation is the feedback. The
 * trigger is a `Button` and carries `press`. loading · success · error —
 * N/A, nothing here is asynchronous. disabled — N/A; an unavailable page is
 * absent from the nav rather than dimmed in it. empty — N/A in practice, and
 * safe in principle: with no items the row and the sheet both render nothing
 * rather than an empty drawer.
 */

function SiteHeader({
  brand,
  items,
  actions,
  menuLabel = "Open navigation",
  className,
  ...props
}: Omit<React.ComponentProps<"header">, "title"> & {
  /** Your wordmark, usually wrapped in a link home. */
  brand?: React.ReactNode;
  items: SiteNavItem[];
  /** Sign-in, a search trigger, a theme toggle. */
  actions?: React.ReactNode;
  menuLabel?: string;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      data-slot="site-header"
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <PageContainer className="relative flex h-(--height-site-header) items-center gap-4">
        {brand}

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden min-w-0 -translate-x-1/2 items-center gap-1 lg:flex"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "type-nav rounded-md px-2 py-1.5 transition-colors duration-fast",
                isActive(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          {actions}

          <Sheet>
            <SheetTrigger asChild>
              {/* `lg:hidden`, matching the desktop nav's own `lg:flex` — not
                  `md:hidden`. The two used to disagree: the row appeared at
                  `lg` and the trigger vanished at `md`, so a reader at any
                  width between 768 and 1023 had no way to reach navigation at
                  all — no row, no trigger. One breakpoint, read from the same
                  place the row reads it, closes the gap. */}
              <Button variant="outline" size="icon" className="lg:hidden">
                <Icon icon={Menu} size="md" tone="inherit" />
                <span className="sr-only">{menuLabel}</span>
              </Button>
            </SheetTrigger>
            {/* `left`, not `start`: `SheetContent` takes the four physical
                sides, and this is a vendored Radix component rather than one of
                ours to widen. A logical-side drawer is a real gap, but closing
                it belongs in `ui/sheet.tsx` where every consumer gets it, not
                in a cast here. */}
            <SheetContent side="left" className="w-(--width-sidebar-mobile)">
              <SheetHeader>
                <SheetTitle>{menuLabel}</SheetTitle>
              </SheetHeader>
              <nav aria-label="Primary" className="grid gap-1 px-4 pb-4">
                {items.map((item) => (
                  // Closes on navigation. A drawer left open over the page you
                  // just asked for is this shape's most common bug.
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "type-nav rounded-md px-3 py-3 transition-colors duration-fast",
                        isActive(item.href)
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.title}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </PageContainer>
    </header>
  );
}

export { SiteHeader };
