"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Icon } from "@/components/ui/icon"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/ds/logo";
import { categoryHref, DS_GROUPS, DS_ROOT, type DsCategory } from "@/lib/ds/nav";
import type { DocFamily } from "@/lib/ds/platform-contract";

const FAMILY_LABEL: Record<DocFamily, string> = {
  components: "Components",
  effects: "Effects",
  agent: "Agent",
  charts: "Charts",
};

const FAMILY_ORDER: DocFamily[] = ["components", "effects", "agent", "charts"];

function groupByFamily(
  categories: DsCategory[],
): { family: DocFamily | null; entries: DsCategory[] }[] {
  if (!categories.some((c) => c.family)) return [{ family: null, entries: categories }];

  const out: { family: DocFamily | null; entries: DsCategory[] }[] = [];
  for (const family of FAMILY_ORDER) {
    const entries = categories.filter((c) => c.family === family);
    if (entries.length) out.push({ family, entries });
  }
  const unfamilied = categories.filter((c) => !c.family);
  if (unfamilied.length) out.unshift({ family: null, entries: unfamilied });
  return out;
}

function NavTree({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Design system" className="pb-16">
      {DS_GROUPS.map((group) => {
        const isIndexActive = pathname === group.href;
        return (
          <div key={group.id} className="mb-8">
            <Link
              href={group.href}
              onClick={onNavigate}
              className={cn(
                "type-badge mb-3 block transition-colors duration-fast hover:text-muted-foreground",
                isIndexActive ? "text-action-ink" : "text-muted-foreground",
              )}
            >
              {group.title}
            </Link>

            {groupByFamily(group.categories).map(({ family, entries }) => (
              <div key={family ?? "_"} className={family ? "mb-5" : undefined}>
                {family && (
                  <p className="type-badge mb-2 pl-4 text-muted-foreground/70">
                    {FAMILY_LABEL[family]}
                  </p>
                )}
                <ul className="space-y-px border-l border-border">
                  {entries.map((category) => {
                    const href = categoryHref(group, category);
                const active = pathname === href;
                return (
                  <li key={category.slug}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "type-nav -ml-px block border-l py-2 pl-4 transition-colors duration-fast",
                        active
                          ? "border-action bg-action/12 text-foreground"
                          : "border-transparent text-muted-foreground hover:border-input hover:text-foreground",
                      )}
                    >
                      {category.title}
                    </Link>
                  </li>
                );
                  })}
                </ul>
              </div>
            ))}
          </div>
        );
      })}
    </nav>
  );
}

export function DsSidebar() {
  return (
    <aside className="sticky top-(--height-site-header) hidden h-[calc(100dvh-var(--height-site-header))] w-60 shrink-0 overflow-y-auto border-r border-border px-6 pt-10 scrollbar-thin lg:block">
      <NavTree />
    </aside>
  );
}

export function DsMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Icon icon={Menu} />
          <span className="sr-only">Open design system navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 overflow-y-auto px-6">
        <SheetHeader className="px-0">
          <SheetTitle asChild>
            <Link href={DS_ROOT}>
              <Logo />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <NavTree />
      </SheetContent>
    </Sheet>
  );
}
