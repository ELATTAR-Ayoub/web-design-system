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
      // J, because the docs search already owns K.
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
