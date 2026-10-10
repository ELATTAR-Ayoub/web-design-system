/**
 * The modal command palette, opened by a button rather than on mount.
 *
 * `CommandDialog` has no trigger of its own — it is `Command` inside a
 * `Dialog`, and the caller owns the open state. The specimen this replaces
 * reached for `defaultOpen` to get something visible on the page, and the cost
 * was the whole page: a modal that opens on load puts `pointer-events: none` on
 * the body, so the article could not be scrolled and no section below Examples
 * was reachable. `e2e/ledger-evidence.spec.ts` now fails any route that loads
 * that way, and this page is the one it caught.
 *
 * So the palette gets the one thing it was missing: a button. That is also
 * closer to a real call site, where the opener is a toolbar button or a
 * keyboard shortcut and never a mounted-open dialog.
 *
 * It lives beside `page.tsx` because a spec module must stay plain data —
 * `scripts/validate-docs.mjs` fails any `component-docs/<name>/page.tsx`
 * carrying a `"use client"` directive, since the route imports the spec on the
 * server.
 *
 * State model:
 * rest — closed, with the trigger showing its shortcut. hover · focus-visible ·
 * pressed — `Button`'s own. open — the real `CommandDialog`, with Radix's focus
 * trap and Escape. loading · success · error — N/A, the list is in memory.
 * disabled — N/A. empty — a query matching nothing renders `CommandEmpty`.
 */

"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";

export function CommandPaletteSpecimen() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // `⌘J` rather than `⌘K`: the documentation shell's own search already
      // owns `⌘K`, and a specimen that steals a working shortcut to
      // demonstrate shortcuts is a specimen that breaks the page it is on.
      if (event.key !== "j" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setOpen((previous) => !previous);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
        Open the palette
        <Kbd aria-hidden>⌘J</Kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command Palette"
        description="Search packs, cards and actions"
      >
        <CommandInput placeholder="Search packs, cards and actions…" />
        <CommandList>
          <CommandEmpty>Nothing matches that.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem>
              Open Wallet
              <CommandShortcut>⌘W</CommandShortcut>
            </CommandItem>
            <CommandItem>
              Go to Stash
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
