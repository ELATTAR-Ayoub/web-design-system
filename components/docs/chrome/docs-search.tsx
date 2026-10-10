"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Icon } from "@/components/ui/icon";
import { Kbd } from "@/components/ui/kbd";
import { catalogEntries, docRoute } from "@/lib/ds/docs/catalog";
import { plainDescription } from "@/lib/ds/docs/description";
import { DOC_SECTIONS } from "@/lib/ds/nav";
import { FAMILY_LABEL } from "@/lib/ds/families";
import { cn } from "@/lib/utils";

type Result = {
  id: string;
  title: string;
  href: string;
  group: string;
  keywords: string;
};

const RESULTS: Result[] = [
  ...DOC_SECTIONS.map((section) => ({
    id: `section:${section.href}`,
    title: section.title,
    href: section.href,
    group: "Sections",
    keywords: section.blurb,
  })),
  ...catalogEntries().map(({ meta, contract }) => ({
    id: `item:${meta.name}`,
    title: contract.title,
    href: docRoute(meta.name),
    group: FAMILY_LABEL[contract.family],
    keywords: `${meta.name} ${plainDescription(meta.description)}`,
  })),
];

const GROUP_ORDER = ["Sections", "Components", "Effects", "Agent", "Charts"];

export function DocsSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "k" || !(event.metaKey || event.ctrlKey)) return;
      const el = document.activeElement;
      const editing =
        el instanceof HTMLElement &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable);
      if (editing && !open) return;
      event.preventDefault();
      setOpen((previous) => !previous);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn("gap-2 px-2.5 sm:px-3", className)}
      >
        <Icon icon={SearchIcon} size="sm" tone="inherit" />
        <span className="type-nav hidden sm:inline">Search</span>
        {/* Decorative: the button is already named "Search", and a screen
            reader reading "Search Control K" as one name is worse than not
            knowing the shortcut. */}
        <Kbd className="ms-2 hidden md:inline-flex" aria-hidden>
          ⌘K
        </Kbd>
        {/* Carries the name at every width, because the visible word is gone
            below `sm` and a button with only a glyph in it has none. */}
        <span className="sr-only sm:hidden">Search</span>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search the documentation"
        description="Find a component, an effect, a chart or a documentation section"
      >
        <CommandInput placeholder="Search components, effects, charts…" />
        <CommandList>
          <CommandEmpty>Nothing matches that.</CommandEmpty>
          {GROUP_ORDER.map((group) => {
            const entries = RESULTS.filter((result) => result.group === group);
            if (!entries.length) return null;
            return (
              <CommandGroup key={group} heading={group}>
                {entries.map((result) => (
                  <CommandItem
                    key={result.id}
                    value={`${result.title} ${result.keywords}`}
                    onSelect={() => go(result.href)}
                  >
                    {result.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
