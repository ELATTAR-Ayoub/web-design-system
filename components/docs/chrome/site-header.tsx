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

function SiteHeader({
  brand,
  items,
  actions,
  menuLabel = "Open navigation",
  className,
  ...props
}: Omit<React.ComponentProps<"header">, "title"> & {
  brand?: React.ReactNode;
  items: SiteNavItem[];
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
