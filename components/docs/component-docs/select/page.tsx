import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "select",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A fixed set of options with one selected. The trigger shows the current value, never a placeholder pretending to be a label.",
      render: (
        <div className="flex w-full max-w-md items-center justify-between gap-4">
          <p className="type-small text-muted-foreground">184 packs</p>
          <Select defaultValue="popular">
            <SelectTrigger aria-label="Sort by" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="volatility">Volatility</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
      source: `<Select defaultValue="popular">
  <SelectTrigger aria-label="Sort by">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="popular">Most popular</SelectItem>
    <SelectItem value="newest">Newest</SelectItem>
  </SelectContent>
</Select>`,
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
        "The minimal import and call — a labelled field, grouped only once the list is long enough to need it.",
      language: "tsx",
      code: `import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortSelect() {
  return (
    <Field>
      <FieldLabel htmlFor="sort">Sort by</FieldLabel>
      <Select defaultValue="popular">
        <SelectTrigger id="sort">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="popular">Most popular</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}`,
    },
    {
      kind: "showcase",
      id: "sizes",
      title: "Sizes",
      description:
        "SelectTrigger takes size=\"sm\" | \"default\" — the same two-rung ladder as Input and NativeSelect, so a select sits level with whatever field is beside it.",
      label: "Trigger sizes",
      render: (
        <div className="flex flex-wrap items-center gap-4">
          <Select defaultValue="a">
            <SelectTrigger size="sm" className="w-36" aria-label="Small">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Small (32px)</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="a">
            <SelectTrigger className="w-36" aria-label="Default">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Default (40px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
      source: `<SelectTrigger size="sm">…</SelectTrigger>
<SelectTrigger>…</SelectTrigger> {/* size="default" */}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Composed with Field for real forms: grouped with labels and a separator once the list has categories, and an ungrouped list when it does not.",
      label: "Common compositions",
      render: (
        <Panel label="Sort and filter selects">
          <FieldGroup className="max-w-sm">
            <Field>
              <FieldLabel htmlFor="ex-sort">Sort by</FieldLabel>
              <Select defaultValue="popular">
                <SelectTrigger id="ex-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Activity</SelectLabel>
                    <SelectItem value="popular">Most popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="volatility">Volatility</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Price</SelectLabel>
                    <SelectItem value="low">Price: low to high</SelectItem>
                    <SelectItem value="high">Price: high to low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                Grouped with labels so a long option list stays scannable.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="ex-rarity">Minimum rarity</FieldLabel>
              <Select>
                <SelectTrigger id="ex-rarity">
                  <SelectValue placeholder="Any rarity" />
                </SelectTrigger>
                <SelectContent>
                  {["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"].map(
                    (r) => (
                      <SelectItem key={r} value={r.toLowerCase()}>
                        {r}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </Panel>
      ),
      source: `<FieldGroup>
  <Field>
    <FieldLabel htmlFor="sort">Sort by</FieldLabel>
    <Select defaultValue="popular">
      <SelectTrigger id="sort"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Activity</SelectLabel>
          <SelectItem value="popular">Most popular</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Price</SelectLabel>
          <SelectItem value="low">Price: low to high</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </Field>
</FieldGroup>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Select forwards every prop to Radix's Select.Root beyond the className merges on the styled parts below.",
      blocks: [
        {
          label: "Select",
          body: (
            <Meta
              items={[
                { k: "value / defaultValue", v: "string. Controlled / uncontrolled selected value, native Radix props." },
                { k: "onValueChange", v: "(value: string) => void." },
                { k: "open / defaultOpen / onOpenChange", v: "Controls the content's open state." },
                { k: "disabled", v: "boolean, native Radix prop." },
                { k: "name / required", v: "For a bubbled native <select> inside a <form>." },
              ]}
            />
          ),
        },
        {
          label: "SelectTrigger",
          body: (
            <Meta
              items={[
                { k: "size", v: '"sm" | "default" (default). Sets the min-height rung — see Sizes.' },
                { k: "disabledReason", v: "Why the select as a whole is disabled, shown via components/ui/disabled.tsx (native mode — Radix's Select.Trigger is a real <button disabled>). Pass `disabled` on the trigger alongside it: Radix's root-level `disabled` reaches the button through context, which the wrapper cannot see, so a reason on a trigger disabled only from the root renders nothing. Falls back to nothing, matching Flutter's Select.disabledReason falling back to the enclosing FieldScope's." },
                { k: "...props", v: "Every other attribute Radix's Select.Trigger accepts, forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "SelectValue",
          body: (
            <Meta
              items={[
                { k: "placeholder", v: "ReactNode shown when nothing is selected yet. Styled via the trigger's data-placeholder selector." },
              ]}
            />
          ),
        },
        {
          label: "SelectContent",
          body: (
            <Meta
              items={[
                {
                  k: "position",
                  v: '"item-aligned" (default) | "popper". item-aligned overlays the selected item on the trigger, matching the native <select> menu; popper always renders below/above like a normal popover.',
                },
                { k: "align", v: '"start" | "center" (default) | "end", forwarded to Radix when position="popper".' },
              ]}
            />
          ),
        },
        {
          label: "SelectItem, SelectGroup, SelectLabel, SelectSeparator",
          body: (
            <Meta
              items={[
                { k: "SelectItem", v: "value (required), disabled, disabledReason — one option. Renders a check mark via SelectPrimitive.ItemIndicator when selected. disabledReason surfaces via components/ui/disabled.tsx (aria mode — the row is a Radix role=\"option\" div, not a native-disableable element): an always-on aria-describedby plus a click/tap-reachable popover beside the row." },
                { k: "SelectGroup / SelectLabel", v: "Wrap related items and caption them, as in the grouped Sort by example above." },
                { k: "SelectSeparator", v: "A 1px rule between groups." },
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
              <StateCell label="rest / placeholder">
                <Select>
                  <SelectTrigger className="w-40" aria-label="Rest">
                    <SelectValue placeholder="Any rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Common</SelectItem>
                  </SelectContent>
                </Select>
              </StateCell>
              <StateCell label="selected">
                <Select defaultValue="a">
                  <SelectTrigger className="w-40" aria-label="Selected">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </StateCell>
              <StateCell label="focus-visible" note="Tab to it">
                <Select defaultValue="a">
                  <SelectTrigger
                    className="w-40 border-ring ring-3 ring-ring/50"
                    aria-label="Focus"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </StateCell>
              <StateCell label="error" note="aria-invalid">
                <Select defaultValue="a">
                  <SelectTrigger className="w-40" aria-invalid aria-label="Error">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </StateCell>
              <StateCell label="disabled">
                <Select disabled>
                  <SelectTrigger className="w-40" aria-label="Disabled">
                    <SelectValue placeholder="Unavailable" />
                  </SelectTrigger>
                  <SelectContent />
                </Select>
              </StateCell>
              <StateCell label="disabled reason" note="Focus it — the reason is announced">
                {/* `disabled` on the TRIGGER, not only on the root. Radix
                    disables the button through context, which the reason
                    wrapper around the trigger cannot see — with the flag only
                    on `<Select>`, the button went inert but the wrapper
                    rendered as enabled and the reason affordance stayed
                    hidden. Measured; the API note says so. */}
                <Select disabled>
                  <SelectTrigger
                    className="w-40"
                    aria-label="Disabled with reason"
                    disabled
                    disabledReason="Add a payment method to enable this."
                  >
                    <SelectValue placeholder="Unavailable" />
                  </SelectTrigger>
                  <SelectContent />
                </Select>
              </StateCell>
              <StateCell label="empty" note="Placeholder only">
                <Select>
                  <SelectTrigger className="w-40" aria-label="Empty">
                    <SelectValue placeholder="Nothing selected" />
                  </SelectTrigger>
                  <SelectContent />
                </Select>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A rows">
              <p>
                <strong>pressed</strong> is N/A: opening the menu is the
                trigger&rsquo;s only gesture, and that transition is already the
                open/closed distinction — there is no separate held-down look.
              </p>
              <p className="mt-2">
                <strong>loading</strong> and <strong>success</strong> are N/A:
                choosing an option is synchronous. An async consequence of the
                choice (saving a filter, submitting a form) is owned by whatever
                the change caused, not by the control.
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
        "Select is Radix's Select.Root, which follows the ARIA listbox pattern rather than reimplementing it.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Trigger role", v: 'combobox, with aria-expanded and aria-controls pointing at the content.' },
                { k: "Content role", v: "listbox, with each SelectItem exposed as role option and aria-selected on the current value." },
                { k: "Groups", v: "SelectGroup renders role group, labelled by its SelectLabel via aria-labelledby." },
                {
                  k: "Accessible name",
                  v: "None by default — pair the trigger with FieldLabel via htmlFor (see Usage), or supply aria-label for a bare control, as the Preview above does.",
                },
                {
                  k: "State announcements",
                  v: "aria-invalid is exposed for validation. Pair it with a written FieldError, not the red ring alone (RULES §7: two signals).",
                },
                {
                  k: "Target size",
                  v: 'Default trigger is min-h-10 (40px). The sm rung is min-h-8 (32px), under --size-target-min (44px) — the same ladder Input documents, extended to Select: text-entry and short-value controls sit level with each other rather than each hitting 44px independently.',
                },
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
        "Radix Select implements the ARIA listbox pattern, including typeahead.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Enter / Space / ArrowDown", v: "Opens the trigger's menu." },
                { k: "ArrowUp / ArrowDown", v: "Moves the highlighted item once open." },
                { k: "Typing a letter", v: "Typeahead — jumps to the next item whose label starts with what was typed." },
                { k: "Enter / Space", v: "Commits the highlighted item and closes the menu." },
                { k: "Escape", v: "Closes the menu without changing the value." },
                { k: "Tab", v: "Closes the menu and moves focus to the next element in document order." },
                { k: "During disabled", v: "Removed from the tab sequence entirely." },
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
        "The trigger sizes to its own value; the panel sizes to the viewport that hosts it — two different owners, each measured.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "The trigger",
                  v: "SelectTrigger is w-fit whitespace-nowrap with the selected value line-clamp-1'd inside SelectValue's own span — it never wraps to a second line or grows the row's height, so it holds a consistent height in a form grid regardless of how long the chosen label is; a caller who needs the trigger itself to shrink on narrow layouts adds their own width class, since the component sets none.",
                },
                {
                  k: "The panel",
                  v: "SelectContent caps its own height at max-h-(--radix-select-content-available-height) — a Radix-computed CSS variable tracking the real space left in the viewport below or above the trigger — so a long option list scrolls inside its own frame rather than running off-screen on a short viewport; SelectScrollUpButton/DownButton appear only once that clipping is real.",
                },
                {
                  k: "position: item-aligned vs popper",
                  v: "The default item-aligned mode overlays the open item on the trigger like a native <select>, sized by its content down to min-w-36. position=\"popper\" instead docks below/above the trigger and match its width via min-w-(--radix-select-trigger-width) — the mode to reach for when the trigger's own width should cap the panel on a narrow screen.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920, none at 200% text zoom, and none under RTL — align, side and the scroll buttons all come from Radix's own placement logic rather than a hardcoded left/right.",
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
