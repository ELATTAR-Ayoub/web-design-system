/**
 * Authored documentation page for `command`.
 *
 * Replaces the generated baseline. Migrated from the old `base/selects`
 * category page. "Command Palette" is not a separate registry item — it is
 * `CommandDialog`, the same `Command` primitive wrapped in a `Dialog` — so it
 * is documented here, in the Examples section, rather than getting its own
 * route. Every specimen renders the real `Command` / `CommandDialog` from
 * `components/ui/command.tsx`, which wraps cmdk.
 */

import { Search } from "lucide-react";

import { Icon } from "@/components/ui/icon";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { CommandPaletteSpecimen } from "./palette-specimen";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "command",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A searchable, keyboard-driven list of actions, usable inline on a page as shown here, or opened as a modal palette through CommandDialog (see Examples).",
      render: (
        <Command className="max-w-sm rounded-lg border border-border bg-card">
          <CommandInput placeholder="Search packs, cards and actions…" />
          <CommandList>
            <CommandEmpty>Nothing matches that.</CommandEmpty>
            <CommandGroup heading="Packs">
              <CommandItem>
                <Icon icon={Search} size="sm" tone="subtle" />
                Eclipse Vault
                <CommandShortcut>$48.00</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Icon icon={Search} size="sm" tone="subtle" />
                Golden Rift
                <CommandShortcut>$120.00</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      ),
      source: `<Command className="rounded-lg border border-border bg-card">
  <CommandInput placeholder="Search packs, cards and actions…" />
  <CommandList>
    <CommandEmpty>Nothing matches that.</CommandEmpty>
    <CommandGroup heading="Packs">
      <CommandItem>
        Eclipse Vault
        <CommandShortcut>$48.00</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "The Ctrl+K wiring for a global palette needs a keydown listener and open/close state — that is a client component's job, not a doc spec's, so it is shown here as code rather than as a live specimen.",
      language: "tsx",
      code: `"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function GlobalPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search packs, cards and actions…" />
      <CommandList>
        <CommandEmpty>Nothing matches that.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => setOpen(false)}>Open Wallet</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Grouped actions with a separator and right-aligned shortcuts, and the modal palette — CommandDialog is the same list inside a Dialog. It has no trigger of its own, so the caller owns the open state; press the button or ⌘J.",
      label: "Grouped actions",
      render: (
        <div className="space-y-6">
          <Panel label="Command" note="Ctrl + K, in real use">
            <Command className="rounded-lg border border-border bg-card">
              <CommandInput placeholder="Search packs, cards and actions…" />
              <CommandList>
                <CommandEmpty>Nothing matches that.</CommandEmpty>
                <CommandGroup heading="Packs">
                  <CommandItem>
                    <Icon icon={Search} size="sm" tone="subtle" />
                    Eclipse Vault
                    <CommandShortcut>$48.00</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <Icon icon={Search} size="sm" tone="subtle" />
                    Golden Rift
                    <CommandShortcut>$120.00</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
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
            </Command>
          </Panel>

          <Panel label="CommandDialog" note="⌘J, or the button">
            {/* Opened by a button, NOT by `defaultOpen`. A modal that opens on
                mount puts `pointer-events: none` on the body and takes the
                whole article with it — measured, and now failed by
                `e2e/ledger-evidence.spec.ts`. The trigger lives in a companion
                client file because a spec module must stay plain data. */}
            <CommandPaletteSpecimen />
          </Panel>
        </div>
      ),
      source: `<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Search packs, cards and actions…" />
  <CommandList>
    <CommandEmpty>Nothing matches that.</CommandEmpty>
    <CommandGroup heading="Actions">
      <CommandItem>Open Wallet<CommandShortcut>⌘W</CommandShortcut></CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Command wraps cmdk's <Command>; CommandDialog composes it with this system's own Dialog.",
      blocks: [
        {
          label: "Command",
          body: (
            <Meta
              items={[
                { k: "...props", v: "Every prop cmdk's <Command> accepts — value, onValueChange, filter, shouldFilter, loop, vimBindings, etc. — forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "CommandDialog",
          body: (
            <Meta
              items={[
                { k: "title", v: 'string, default "Command Palette". Rendered sr-only via DialogTitle — required for the modal to have an accessible name.' },
                { k: "description", v: 'string, default "Search for a command to run...". Rendered sr-only via DialogDescription.' },
                { k: "showCloseButton", v: "boolean, default false — the palette closes on Escape or outside click, not a visible ✕." },
                { k: "open / onOpenChange / defaultOpen", v: "Forwarded to the underlying Dialog. Use open/onOpenChange for the Ctrl+K pattern in Usage." },
              ]}
            />
          ),
        },
        {
          label: "CommandInput, CommandList, CommandGroup, CommandItem",
          body: (
            <Meta
              items={[
                { k: "CommandInput", v: "Wraps cmdk's Input in this system's InputGroup, with a leading search icon." },
                { k: "CommandList", v: "max-h-72, scrolling; forwards cmdk's own filtering and keyboard navigation." },
                { k: "CommandGroup", v: "heading (string) captions a set of items." },
                { k: "CommandItem", v: "onSelect, value, disabled, forwarded from cmdk, plus disabledReason. Shows a check mark automatically when data-checked is set and there is no CommandShortcut. disabledReason explains a disabled row via components/ui/disabled.tsx: an always-on aria-describedby plus a click/tap-reachable popover, without disturbing the row's own keyboard semantics." },
                { k: "CommandShortcut", v: "Right-aligned metadata — a price, a key combo — inside a CommandItem." },
                { k: "CommandSeparator / CommandEmpty", v: "A 1px rule between groups; the no-results message, shown automatically when the filtered list is empty." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      blocks: [
        {
          body: (
            <StateGrid cols={3}>
              <StateCell label="rest">
                <Command className="w-56 rounded-lg border border-border bg-card">
                  <CommandInput placeholder="Search…" aria-label="Rest" />
                  <CommandList>
                    <CommandGroup heading="Packs">
                      <CommandItem>Eclipse Vault</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </StateCell>
              <StateCell label="disabled item">
                <Command className="w-56 rounded-lg border border-border bg-card">
                  <CommandInput placeholder="Search…" aria-label="Disabled item" />
                  <CommandList>
                    <CommandGroup heading="Packs">
                      <CommandItem disabled>Sold out set</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </StateCell>
              <StateCell label="disabled reason" note="Row explains itself">
                <Command className="w-56 rounded-lg border border-border bg-card">
                  <CommandInput placeholder="Search…" aria-label="Disabled reason" />
                  <CommandList>
                    <CommandGroup heading="Packs">
                      <CommandItem
                        disabled
                        disabledReason="Sold out — restocks next rotation."
                      >
                        Sold out set
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </StateCell>
              <StateCell label="empty" note="No results in the list">
                <Command className="w-56 rounded-lg border border-border bg-card">
                  <CommandInput placeholder="Search…" aria-label="Empty" />
                  <CommandList>
                    <CommandEmpty>Nothing matches that.</CommandEmpty>
                  </CommandList>
                </Command>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A rows">
              <p>
                <strong>pressed</strong> is N/A: cmdk highlights the active item
                via keyboard or hover (data-selected), which is a different signal
                from a press — there is no separate held-down look to draw.
              </p>
              <p className="mt-2">
                <strong>loading</strong> and <strong>success</strong> are N/A on
                Command itself: filtering is synchronous, client-side text
                matching. A palette backed by an async search is a product
                composition with its own loading state, not something Command
                draws.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "cmdk implements the ARIA combobox pattern: the input carries role=\"combobox\" and aria-expanded/aria-controls/aria-activedescendant, the list carries role=\"listbox\", and each item is role=\"option\".",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "CommandInput accessible name", v: "Give it an aria-label describing what it searches, or wrap it with a visually hidden label — it renders no visible label of its own." },
                { k: "CommandDialog name", v: "title and description are rendered sr-only via DialogTitle/DialogDescription, so the modal always announces a name even though nothing is visible in the header." },
                { k: "Empty announcement", v: "CommandEmpty is a real element the screen reader reaches inside the listbox, so a no-results search is not silent." },
                { k: "Target size", v: "CommandItem rows carry min-h-(--size-target-min) (44px) — the owner's cross-cutting call on the parked interactive-row hit-target question, recorded in docs/audits/web-component-audit.md. The label stays centred at the same font size; only the row grows." },
                { k: "Disabled reason", v: "A disabled CommandItem takes disabledReason and surfaces it through components/ui/disabled.tsx: the reason is always attached to the row via aria-describedby (read on focus, whether or not the popover opens) and reachable by click or tap through a small info affordance beside the row." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      description:
        "Verified from cmdk's own source rather than assumed — vim-style bindings only fire with vimBindings enabled and a held Ctrl.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "ArrowDown / ArrowUp", v: "Moves the highlighted item." },
                { k: "Ctrl+N / Ctrl+J, Ctrl+P / Ctrl+K", v: "Same as ArrowDown / ArrowUp, when vimBindings is enabled — off by default." },
                { k: "Home / End", v: "Jumps to the first / last item." },
                { k: "Enter", v: "Runs the highlighted item's onSelect." },
                { k: "Typing", v: "Filters the list; the input never loses focus to the list." },
                { k: "Escape (CommandDialog only)", v: "Closes the palette — handled by the underlying Dialog, not by Command itself; an inline Command has no Escape behaviour of its own." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "Command's own reflow is entirely internal scrolling; CommandDialog's is inherited from Dialog, which has its own measured responsive behaviour on its own page.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Inline Command",
                  v: "CommandList caps at max-h-72 and scrolls with overflow-y-auto — a long filtered list (packs, actions, both grouped in the Examples above) scrolls inside that fixed height rather than growing the page at any width, measured with no document overflow at 375, 768, 1440 and 1920.",
                },
                {
                  k: "CommandDialog",
                  v: "Positioned top-1/3 rather than dead-centre, so the input sits close to where a keyboard user's attention already is when they press ⌘K; width and edge behaviour below that come from the underlying Dialog (rounded-xl!, full-bleed on narrow viewports) — see the Dialog page for the measured widths.",
                },
                {
                  k: "No horizontal scroll",
                  v: "CommandList sets overflow-x-hidden explicitly — a long CommandShortcut value truncates the row's available space rather than forcing the list to scroll sideways.",
                },
                {
                  k: "RTL",
                  v: "CommandShortcut is ml-auto, which resolves to the trailing edge under an RTL DirectionProvider along with the rest of the row — nothing in command.tsx hard-codes a physical left/right.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        { body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> },
      ],
    },
  ],
};
