"use client";

import { ExpandAllToggle } from "./doc-section";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { anchorsFor, tocFor, type ComponentDocSpec, type TocEntry } from "./types";

function useActiveAnchor(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  const key = ids.join(",");

  useEffect(() => {
    const anchors = key ? key.split(",") : [];
    if (anchors.length === 0) return;
    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((record) => record.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    for (const id of anchors) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [key]);

  return active;
}

function AnchorLink({
  entry,
  active,
  nested = false,
}: {
  entry: TocEntry;
  active: boolean;
  nested?: boolean;
}) {
  return (
    <a
      href={`#${entry.id}`}
      aria-current={active ? "location" : undefined}
      className={cn(
        "type-nav -ml-px block border-l py-1 transition-colors duration-fast ease-standard",
        nested ? "pl-8" : "pl-4",
        active
          ? "border-action text-action-ink"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {entry.title}
    </a>
  );
}

export function TableOfContents({ spec }: { spec: ComponentDocSpec }) {
  const entries = tocFor(spec);
  const active = useActiveAnchor(anchorsFor(spec));

  if (entries.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-(--height-site-header) hidden h-(--height-doc-rail) overflow-y-auto pt-10 scrollbar-thin xl:block"
    >
      <p className="type-badge mb-3 text-muted-foreground">On this page</p>
      <ul className="space-y-1 border-l border-border">
        {entries.map((entry) => (
          <li key={entry.id}>
            <AnchorLink entry={entry} active={entry.id === active} />
            {entry.children && (
              <ul className="space-y-1">
                {entry.children.map((child) => (
                  <li key={child.id}>
                    <AnchorLink entry={child} active={child.id === active} nested />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AnchorStrip({
  spec,
  persistent = false,
}: {
  spec: ComponentDocSpec;
  persistent?: boolean;
}) {
  const entries = tocFor(spec);
  const active = useActiveAnchor(anchorsFor(spec));

  if (entries.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className={cn(
        "-mx-6 mb-10 overflow-x-auto border-b border-border px-6 pb-3 scrollbar-thin",
        !persistent && "xl:hidden",
      )}
    >
      <ul className="flex w-max items-center gap-2">
        <li>
          <ExpandAllToggle />
        </li>
        {entries.map((entry) => {
          const current = entry.id === active;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "type-nav block rounded-pill border px-3 py-1.5 whitespace-nowrap transition-colors duration-fast ease-standard",
                  current
                    ? "border-action bg-action/12 text-foreground"
                    : "border-border text-muted-foreground hover:border-input hover:text-foreground",
                )}
              >
                {entry.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
