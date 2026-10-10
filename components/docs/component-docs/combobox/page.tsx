/**
 * Authored documentation page for `combobox`.
 *
 * Replaces the generated baseline. Migrated from the old `base/selects`
 * category page. Every specimen renders the real `Combobox` from
 * `components/ui/combobox.tsx`, a styled wrapper around Base UI's
 * `Combobox` primitive.
 *
 * `ComboboxList`'s `children` prop types as
 * `ReactNode | ((item, index) => ReactNode)` — the source page used the
 * function form. This page is a plain data module rendered by a SERVER
 * component, and passing a function into a Client Component prop crashes
 * `npm run build` ("Event handlers cannot be passed to Client Component
 * props"). Every specimen below maps the items to elements up front instead,
 * which is ordinary ReactNode children and crosses the server/client
 * boundary the same way any other JSX does.
 */

import { Code } from "@/components/ds/kit";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

const SETS = [
  "Eclipse Vault",
  "Golden Rift",
  "Mystic Surge",
  "Shadow Core",
  "Celestial Strike",
  "Origin Pulse",
];

export const spec: ComponentDocSpec = {
  name: "combobox",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A select the user can type into. Typing narrows the list; the empty state says what happened rather than showing a blank panel.",
      render: (
        <div className="max-w-xs">
          <Combobox items={SETS}>
            <ComboboxInput placeholder="Search card sets" />
            <ComboboxContent>
              <ComboboxEmpty>No matching set.</ComboboxEmpty>
              <ComboboxList>
                {SETS.map((item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      ),
      source: `<Combobox items={SETS}>
  <ComboboxInput placeholder="Search card sets" />
  <ComboboxContent>
    <ComboboxEmpty>No matching set.</ComboboxEmpty>
    <ComboboxList>
      {SETS.map((item) => (
        <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
      ))}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`,
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
        "The minimal import and call. ComboboxList also accepts a render function — (item, index) => ReactNode — for large or virtualized lists in an ordinary client component; a spec page cannot use that form (see the note above), so this snippet shows the form a real call site would actually reach for.",
      language: "tsx",
      code: `"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const SETS = ["Eclipse Vault", "Golden Rift", "Mystic Surge"];

export function SetField() {
  return (
    <Field>
      <FieldLabel htmlFor="set">Card set</FieldLabel>
      <Combobox items={SETS}>
        <ComboboxInput id="set" placeholder="Search card sets" />
        <ComboboxContent>
          <ComboboxEmpty>No matching set.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Composed with Field for a real form, plus the multi-select chips pattern — shown as a usage pattern rather than a live specimen, since it needs a ref from useComboboxAnchor and hooks are not permitted in a spec module.",
      label: "Filter by card set",
      render: (
        <div className="space-y-6">
          <Panel>
            <FieldGroup className="max-w-sm">
              <Field>
                <FieldLabel htmlFor="ex-set">Card set</FieldLabel>
                <Combobox items={SETS}>
                  <ComboboxInput id="ex-set" placeholder="Search card sets" />
                  <ComboboxContent>
                    <ComboboxEmpty>No matching set.</ComboboxEmpty>
                    <ComboboxList>
                      {SETS.map((item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldDescription>
                  Used for card sets, pack names and any list long enough that
                  scrolling is worse than typing.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </Panel>

          <Panel label="Multi-select chips" note="Usage pattern, not live">
            <pre className="overflow-x-auto">
              <Code>
{`const anchorRef = useComboboxAnchor();

<Combobox items={SETS} multiple>
  <ComboboxChips ref={anchorRef}>
    {selected.map((s) => (
      <ComboboxChip key={s}>{s}</ComboboxChip>
    ))}
    <ComboboxChipsInput placeholder="Add a set…" />
  </ComboboxChips>
  <ComboboxContent anchor={anchorRef}>
    <ComboboxList>
      {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`}
              </Code>
            </pre>
          </Panel>
        </div>
      ),
      source: `<div className="space-y-6">
  <Panel>
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="ex-set">Card set</FieldLabel>
        <Combobox items={SETS}>
          <ComboboxInput id="ex-set" placeholder="Search card sets" />
          <ComboboxContent>
            <ComboboxEmpty>No matching set.</ComboboxEmpty>
            <ComboboxList>
              {SETS.map((item) => (
                <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <FieldDescription>
          Used for card sets, pack names and any list long enough that
          scrolling is worse than typing.
        </FieldDescription>
      </Field>
    </FieldGroup>
  </Panel>

  <Panel label="Multi-select chips" note="Usage pattern, not live">
    <pre className="overflow-x-auto">
      <Code>
        {\`const anchorRef = useComboboxAnchor();

<Combobox items={SETS} multiple>
  <ComboboxChips ref={anchorRef}>
    {selected.map((s) => (
      <ComboboxChip key={s}>{s}</ComboboxChip>
    ))}
    <ComboboxChipsInput placeholder="Add a set…" />
  </ComboboxChips>
  <ComboboxContent anchor={anchorRef}>
    <ComboboxList>
      {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
    </ComboboxList>
  </ComboboxContent>
</Combobox>\`}
      </Code>
    </pre>
  </Panel>
</div>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Combobox is Base UI's Combobox.Root; every prop below is forwarded straight through beyond the styled parts' className merges.",
      blocks: [
        {
          label: "Combobox",
          body: (
            <Meta
              items={[
                { k: "items", v: "readonly any[] — flat items, or groups. Drives both the list and the default filter." },
                { k: "multiple", v: "boolean, default false. Enables the chips pattern above and switches value/defaultValue to an array." },
                { k: "value / defaultValue / onValueChange", v: "Controlled / uncontrolled selection." },
                { k: "inputValue / defaultInputValue / onInputValueChange", v: "Controlled / uncontrolled query text." },
                { k: "disabled / required / readOnly", v: "Native-shaped booleans, forwarded to the hidden form input." },
                { k: "autoHighlight", v: "false (default) | true | \"always\" — whether the first match is pre-highlighted." },
                { k: "filter", v: "Custom (itemValue, query) => boolean matcher, in place of the default." },
              ]}
            />
          ),
        },
        {
          label: "ComboboxInput",
          body: (
            <Meta
              items={[
                { k: "showTrigger", v: "boolean, default true. Renders the chevron button that opens the list without typing." },
                { k: "showClear", v: "boolean, default false. Renders a clear (×) button once a value is set; hides the trigger while shown." },
              ]}
            />
          ),
        },
        {
          label: "ComboboxTrigger",
          body: (
            <Meta
              items={[
                {
                  k: 'aria-label',
                  v: 'Defaults to "Show options" — its only child is a decorative chevron, so without a name it fails axe\'s button-name rule. Override it for a more specific label where one is available.',
                },
              ]}
            />
          ),
        },
        {
          label: "ComboboxContent",
          body: (
            <Meta
              items={[
                { k: "side / align / sideOffset / alignOffset", v: "Positioning relative to the input or, in chips mode, to anchor." },
                { k: "anchor", v: "A ref from useComboboxAnchor(), pointed at ComboboxChips — required for the chips composition so the popup positions against the whole chip row, not the trailing input." },
              ]}
            />
          ),
        },
        {
          label: "ComboboxItem, ComboboxGroup, ComboboxLabel, ComboboxSeparator, ComboboxEmpty",
          body: (
            <Meta
              items={[
                { k: "ComboboxItem", v: "value (required), disabled, disabledReason — one option. Renders a check mark when selected. disabledReason explains a disabled row via components/ui/disabled.tsx: an always-on aria-describedby plus a click/tap-reachable popover, without disturbing the row's own roving-focus semantics." },
                { k: "ComboboxGroup / ComboboxLabel", v: "Wrap and caption related items, same pattern as Select." },
                { k: "ComboboxEmpty", v: "Shown automatically when the filtered list has zero items — no manual empty check needed." },
                { k: "ComboboxSeparator", v: "A 1px rule between groups." },
              ]}
            />
          ),
        },
        {
          label: "ComboboxChips, ComboboxChip, ComboboxChipsInput, ComboboxClear",
          body: (
            <Meta
              items={[
                { k: "ComboboxChips", v: "The chip-row container, used with the multiple prop in place of a single ComboboxInput." },
                { k: "ComboboxChip", v: "showRemove (default true) — one selected value as a removable pill." },
                { k: "ComboboxChipsInput", v: "The trailing text input inside the chip row." },
                { k: "ComboboxClear", v: "Defaults aria-label to \"Clear selection\"." },
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
            <StateGrid cols={4}>
              <StateCell label="rest">
                <Combobox items={SETS}>
                  <ComboboxInput placeholder="Search card sets" aria-label="Rest" />
                  <ComboboxContent>
                    <ComboboxList>
                      {SETS.map((s) => (
                        <ComboboxItem key={s} value={s}>
                          {s}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </StateCell>
              <StateCell label="filled">
                <Combobox items={SETS} defaultValue="Eclipse Vault">
                  <ComboboxInput aria-label="Filled" />
                  <ComboboxContent>
                    <ComboboxList>
                      {SETS.map((s) => (
                        <ComboboxItem key={s} value={s}>
                          {s}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </StateCell>
              <StateCell label="focus-visible" note="Click or tab into it">
                <Combobox items={SETS}>
                  <ComboboxInput placeholder="Search card sets" aria-label="Focus" />
                  <ComboboxContent>
                    <ComboboxList>
                      {SETS.map((s) => (
                        <ComboboxItem key={s} value={s}>
                          {s}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </StateCell>
              <StateCell label="disabled">
                <Combobox items={SETS} disabled>
                  <ComboboxInput placeholder="Unavailable" aria-label="Disabled" />
                  <ComboboxContent>
                    <ComboboxList>
                      {SETS.map((s) => (
                        <ComboboxItem key={s} value={s}>
                          {s}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </StateCell>
              <StateCell label="disabled item" note="Open the list — the row explains itself">
                <Combobox items={SETS}>
                  <ComboboxInput placeholder="Search card sets" aria-label="Disabled item" />
                  <ComboboxContent>
                    <ComboboxList>
                      {SETS.map((s) => (
                        <ComboboxItem
                          key={s}
                          value={s}
                          disabled={s === "Eclipse Vault"}
                          disabledReason={
                            s === "Eclipse Vault"
                              ? "Retired — not printed since the last rotation."
                              : undefined
                          }
                        >
                          {s}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </StateCell>
              <StateCell label="empty" note="No match">
                <Combobox items={SETS} defaultInputValue="zzz">
                  <ComboboxInput aria-label="No results" />
                  <ComboboxContent>
                    <ComboboxEmpty>No matching set.</ComboboxEmpty>
                    <ComboboxList>
                      {SETS.map((s) => (
                        <ComboboxItem key={s} value={s}>
                          {s}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A rows">
              <p>
                <strong>pressed</strong>, <strong>loading</strong> and{" "}
                <strong>success</strong> are N/A for the same reasons as Select:
                opening the list has no separate held-down look, and choosing an
                item is synchronous.
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
        "Combobox is Base UI's Combobox.Root, which follows the WAI-ARIA combobox pattern: an editable textbox owning a popup listbox.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Accessible name", v: "Comes from an associated <label htmlFor> (via FieldLabel) or an explicit aria-label on ComboboxInput." },
                { k: "Icon-only trigger", v: 'ComboboxTrigger and ComboboxClear both default aria-label ("Show options" / "Clear selection") so an icon-only control is never shipped silent.' },
                { k: "Empty state", v: "ComboboxEmpty is present in the DOM and announced, so a no-results search is not silent to a screen reader." },
                { k: "Target size", v: "ComboboxItem rows carry min-h-(--size-target-min) (44px) — the owner's call on the parked interactive-row question, recorded in docs/audits/web-component-audit.md; the label stays centred, only the row grows. The trigger and the clear button are nested controls inside a 40px field that must sit level with Input, so they keep their 24px box and reclaim 44 × 44 through ::after (RULES §7) — measured with elementFromPoint, not the box." },
                { k: "Disabled reason", v: "A disabled ComboboxItem takes disabledReason and surfaces it through components/ui/disabled.tsx: the reason is always attached to the row via aria-describedby (read on focus, whether or not the popover opens) and reachable by click or tap through a small info affordance beside the row — the row itself keeps its own keyboard/roving semantics." },
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
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Typing", v: "Filters the list using the default (or supplied) filter function." },
                { k: "ArrowDown / ArrowUp", v: "Moves the highlighted item through ComboboxList; from the input, wraps to the first/last item and back per loopFocus (default on)." },
                { k: "Enter", v: "Commits the highlighted item and closes the popup." },
                { k: "Escape", v: "Closes the popup." },
                { k: "Backspace (chips mode)", v: "Removes the last chip when the trailing input is empty." },
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
        "ComboboxContent is sized off its own anchor and the space around it, not off the viewport — the popup follows the input everywhere it can appear.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Width",
                  v: "w-(--anchor-width) with max-w-(--available-width) — the popup matches the input's (or, in chips mode, the whole chip row's) width, and cannot exceed whatever room is actually left beside it near a screen edge.",
                },
                {
                  k: "Internal scroll",
                  v: "ComboboxList caps at min(18rem, available-height minus the input row) and scrolls with overflow-y-auto — a long filtered list (Card sets, in the Preview above) scrolls inside the popup rather than pushing the page taller, measured with no document overflow at any width.",
                },
                {
                  k: "Side flip",
                  v: "The data-[side=*] slide-in classes cover all four sides — Base UI repositions the popup to whichever side of the input has room, which matters most near the top or bottom edge of a short viewport.",
                },
                {
                  k: "Chips wrap",
                  v: "ComboboxChips is flex flex-wrap, so a multi-select's chip row (see Examples) grows downward as chips accumulate on a narrow screen rather than scrolling horizontally or clipping.",
                },
                {
                  k: "RTL",
                  v: "side/align are resolved relative to reading direction, and the chip row's gap-1 flex layout mirrors with it — nothing in combobox.tsx hard-codes a physical left/right offset.",
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
