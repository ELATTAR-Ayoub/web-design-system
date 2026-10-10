"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { docRoute, railEntriesIn } from "@/lib/ds/docs/catalog";
import { FAMILY_LABEL, FAMILY_LANDING, FAMILY_ORDER } from "@/lib/ds/families";
import { DOC_SECTIONS, DS_ROOT } from "@/lib/ds/nav";
import { cn } from "@/lib/utils";

type RailEntry = { title: string; href: string };
type RailGroup = { label: string; entries: RailEntry[] };

const RAIL_GROUPS: RailGroup[] = (() => {
  const groups: RailGroup[] = [{
    label: "Sections",
    entries: DOC_SECTIONS.map(({ title, href }) => ({ title, href })),
  }];

  for (const family of FAMILY_ORDER) {
    const landing = FAMILY_LANDING[family];
    const entries: RailEntry[] = [
      ...(landing
        ? [{ title: landing.title, href: `${DS_ROOT}/components/${landing.slug}` }]
        : []),
      ...railEntriesIn(family).map(({ meta, contract }) => ({
        title: contract.title,
        href: docRoute(meta.name),
      })),
    ];
    if (!entries.length) continue;
    groups.push({ label: FAMILY_LABEL[family], entries });
  }

  return groups;
})();

export function DocsRailTree({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const railRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const selected = rail.querySelector<HTMLElement>('[aria-current="page"]');
    if (!selected) return;

    const railBox = rail.getBoundingClientRect();
    const rowBox = selected.getBoundingClientRect();
    if (rowBox.top >= railBox.top && rowBox.bottom <= railBox.bottom) return;

    // `nearest`: `center` would also scroll the article.
    selected.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  return (
    <nav ref={railRef} aria-label="Documentation" className="pb-16">
      {RAIL_GROUPS.map((group) => (
        <div key={group.label} className="mb-8">
          <p className="type-badge mb-3 text-muted-foreground">{group.label}</p>
          <ul className="space-y-px border-l border-border">
            {group.entries.map((entry) => {
              const active = pathname === entry.href;
              return (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "type-nav -ml-px block border-l py-2 pl-4 transition-colors duration-fast",
                      active
                        ? "border-action bg-action/12 text-foreground"
                        : "border-transparent text-muted-foreground hover:border-input hover:text-foreground",
                    )}
                  >
                    {entry.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsRail() {
  return (
    <aside
      className="sticky top-(--height-site-header) hidden h-(--height-doc-rail) w-(--width-rail) shrink-0 self-start overflow-y-auto border-r border-border px-6 pt-10 scrollbar-thin lg:block"
    >
      <DocsRailTree />
    </aside>
  );
}
