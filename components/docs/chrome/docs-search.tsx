/**
 * The documentation search, over the one catalog.
 *
 * **There is no search index.** The list it searches is `catalogEntries()` plus
 * the authored section routes from `lib/ds/nav.ts` — the same two lists the
 * rail renders. A second, hand-maintained index is the exact failure this
 * repository keeps removing: a name that exists in search and not in the rail,
 * or a result that 404s because the route was renamed and the index was not.
 *
 * Built on `Command`, which is already in the system and already does the hard
 * parts — filtering, roving highlight, Enter to choose. `CommandDialog` gives
 * it the modal, the focus trap and Escape.
 *
 * **⌘K / Ctrl+K, and a visible trigger.** The shortcut alone is invisible
 * affordance; the trigger alone makes a reader reach for the mouse on every
 * lookup. The trigger prints the shortcut so one teaches the other, and `Kbd`
 * renders it rather than a styled `<span>`.
 *
 * The key handler is on `window` rather than on a wrapper, because the point of
 * the shortcut is that it works wherever focus happens to be. It ignores the
 * event while focus is inside a text field, so typing a literal "k" into the
 * composer on the agent page does not open a palette over it.
 *
 * State model:
 * rest · hover · focus-visible — the trigger is a `Button`, so all three are
 * the system's. pressed — `press`, from `Button`. loading · success ·
 * error — N/A: the list is in memory, there is no request. disabled — N/A.
 * empty — a query matching nothing renders `CommandEmpty`, which says so in
 * words rather than leaving the reader looking at a blank panel.
 */

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
  /** Fed to `CommandItem`'s value so a search matches the blurb too. */
  keywords: string;
};

/**
 * Everything a reader can reach, grouped the way the rail groups it.
 *
 * Computed once at module scope: the catalog is a static import, so this cannot
 * change between renders and recomputing it per keystroke would be work for
 * nothing.
 */
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
    // The item's own name as well as its title, so searching the kebab-case
    // registry name — which is what a reader copying an install command has in
    // hand — finds the page.
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
      // Not while the reader is typing into something. The agent composer and
      // every input on a form page would otherwise lose a keystroke to this.
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
        // Icon-only below `sm`. Measured at 375: the header's right cluster —
        // trigger, logo, search, appearance — ran to 397px and the whole
        // document scrolled sideways. The word and the shortcut are the two
        // pieces a phone can afford to lose; the glyph and the accessible name
        // are not.
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
