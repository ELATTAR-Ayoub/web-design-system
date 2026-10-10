import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note, Panel } from "@/components/ds/kit";

import { AcquiredDateFilterSpecimen } from "./calendar-filter-specimen";
import { meta } from "./meta";

const SINGLE_DATE = new Date(2026, 6, 30);
const RANGE = { from: new Date(2026, 6, 12), to: new Date(2026, 6, 20) };
const RANGE_LABEL = `${format(RANGE.from, "d MMM")} – ${format(RANGE.to, "d MMM")}`;

export const spec: ComponentDocSpec = {
  name: "calendar",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A month grid for filtering the Stash by date acquired, and transaction history in the Wallet — never for anything the user has to type. Pick a day and the list beside it actually filters down to that day's pulls.",
      label: "Filter by acquisition date",
      render: <AcquiredDateFilterSpecimen />,
      source: `"use client";

import { useMemo, useState } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const CARDS = [
  { name: "Voidwing Ascendant", acquired: DAY_1, price: 248 },
  { name: "Tidecaller", acquired: DAY_1, price: 12 },
  { name: "Emberlash Prime", acquired: DAY_2, price: 64 },
  { name: "Stonewarden", acquired: DAY_3, price: 4 },
];

export function AcquiredDateFilterSpecimen() {
  const [date, setDate] = useState<Date | undefined>(DAY_1);
  const filtered = useMemo(
    () => (date ? CARDS.filter((c) => isSameDay(c.acquired, date)) : CARDS),
    [date],
  );

  return (
    <div>
      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-lg border border-border bg-card p-3" />
      <p>{date ? \`Acquired \${format(date, "d MMM yyyy")}\` : "All acquisitions"}</p>
      <ul>
        {filtered.map((c) => (
          <li key={c.name}>{c.name} — \${c.price.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
}`,
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
        "The controlled pattern a real call site uses — Calendar needs onSelect and useState together, so this is code rather than a live specimen.",
      language: "tsx",
      code: `"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export function AcquiredDateFilter() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border border-border bg-card p-3"
    />
  );
}`,
    },
    {
      kind: "disclosure",
      id: "variants",
      title: "Variants",
      description:
        "One prop, three selection shapes. mode is required and changes the type of selected/onSelect along with it — see API Reference.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: 'mode="single"', v: "One selected Date, or undefined. Shown live in Preview." },
                { k: 'mode="range"', v: "A DateRange ({ from, to }), with every day between marked. Shown live under Date Range." },
                {
                  k: 'mode="multiple"',
                  v: "A Date[]. Not shown as a live specimen on this page — a third full grid render adds axe and render cost without demonstrating anything single and range have not already covered — but it is real and installed: pass an array to selected and Date[] to onSelect.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "date-range",
      title: "Date Range",
      description:
        "The same Calendar in range mode: a start, an end, and every day between them marked. Used for the Wallet's statement period and any \"between these dates\" filter.",
      label: "Range",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel label="Range" note={RANGE_LABEL}>
            <Calendar
              mode="range"
              selected={RANGE}
              defaultMonth={RANGE.from}
              numberOfMonths={1}
              className="rounded-lg border border-border bg-card p-3"
            />
          </Panel>
          <Note tone="action" title="This section used to be a promise, not a render">
            <Code>nav.ts</Code> listed &ldquo;Date Range&rdquo; since the tree
            was written, and the old category section above it was titled
            &ldquo;Calendar and date range&rdquo; — but no calendar in the repo
            was ever actually rendered in <Code>mode=&quot;range&quot;</Code>{" "}
            until this page. Nothing catches that automatically:{" "}
            <Code>check:refs</Code> reads CSS references, not the nav, and a{" "}
            <Code>contents</Code> entry with no section behind it is invisible
            to every guard here. Adding a string to <Code>contents</Code> is a
            commitment, not a label.
          </Note>
        </div>
      ),
      source: `<Calendar
  mode="range"
  selected={range}
  onSelect={setRange}
  numberOfMonths={1}
  className="rounded-lg border border-border bg-card p-3"
/>`,
    },
    {
      kind: "showcase",
      id: "date-picker",
      title: "Date Picker",
      description:
        "A Calendar inside a Popover, behind a trigger that shows the current value. The most common date control there is, and the one shadcn documents as a recipe rather than a file.",
      label: "Trigger and popover",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel label="Picked">
            <FieldGroup className="max-w-xs">
              <Field>
                <FieldLabel htmlFor="picker-demo">Acquired after</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="picker-demo" variant="outline" className="justify-start">
                      <Icon icon={CalendarIcon} size="sm" tone="subtle" />
                      <span className="type-number-base">
                        {format(SINGLE_DATE, "d MMM yyyy")}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" aria-label="Choose a date">
                    <Calendar mode="single" selected={SINGLE_DATE} defaultMonth={SINGLE_DATE} />
                  </PopoverContent>
                </Popover>
                <FieldDescription>
                  Selected. Dates use the shared numerical mono foundation.
                </FieldDescription>
              </Field>

              <Field data-disabled>
                <FieldLabel htmlFor="picker-disabled">Locked to the tax year</FieldLabel>
                <Button id="picker-disabled" variant="outline" className="justify-start" disabled>
                  <Icon icon={CalendarIcon} size="sm" tone="subtle" />
                  <span className="type-number-base">6 Apr 2026</span>
                </Button>
                <FieldDescription>
                  Disabled. The control is exempt from contrast, the description
                  beside it is not.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </Panel>

          <div className="space-y-4">
            <Note tone="error" title="Never format a date with toISOString()">
              <Code>toISOString()</Code> converts to UTC first. Pick the 30th
              anywhere west of Greenwich and{" "}
              <Code>date.toISOString().slice(0, 10)</Code> renders the 29th —
              the calendar shows one day selected and the trigger shows
              another. It is invisible in London, wrong in New York, and this
              page shipped it until it was caught. Use <Code>date-fns</Code>
              &rsquo;s <Code>format</Code>, which reads the local calendar
              date instead of converting through UTC.
            </Note>
            <Meta
              items={[
                {
                  k: 'format(d, "d MMM yyyy")',
                  v: "Local date, no timezone conversion. date-fns is already a dependency — react-day-picker brings it.",
                },
                {
                  k: "autoFocus",
                  v: "On the Calendar inside the popover in a real, controlled instance, so the keyboard lands on the grid rather than behind it.",
                },
                { k: "The trigger is a Button", v: "Not an Input. There is nothing to type, so nothing should look typeable." },
                { k: "Clearing", v: "A date picker with no way back to empty is a trap. Offer a clear action whenever the field is optional." },
                {
                  k: "PopoverContent naming",
                  v: 'aria-label="Choose a date" — Popover has no built-in Title here, and an unnamed dialog role is an axe failure (see the Popover source comment); a picker with a visible label could use PopoverTitle instead.',
                },
              ]}
            />
          </div>
        </div>
      ),
      source: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" className="justify-start">
      <Icon icon={CalendarIcon} size="sm" tone="subtle" />
      {picked ? format(picked, "d MMM yyyy") : "Pick a date"}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start" aria-label="Choose a date">
    <Calendar mode="single" selected={picked} onSelect={setPicked} autoFocus />
  </PopoverContent>
</Popover>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Calendar wraps react-day-picker's DayPicker with this system's button styling, plus its own Nav, Chevron and DayButton renderers.",
      blocks: [
        {
          label: "Calendar",
          body: (
            <Meta
              items={[
                { k: "mode", v: '"single" | "range" | "multiple" (required). Sets the shape of selected and onSelect together — see Variants.' },
                { k: "selected / onSelect", v: "Controlled selection, typed to match mode. onSelect is optional even when selected is set." },
                { k: "defaultMonth", v: "The month shown on first render, for an uncontrolled calendar with no month navigation state to hoist." },
                { k: "numberOfMonths", v: "How many months render side by side — 1 by default, 2 is common for a range picker." },
                { k: "showOutsideDays", v: "boolean, default true. Renders the leading/trailing days of adjacent months, muted." },
                { k: "captionLayout", v: '"label" (default) | "dropdown" | "dropdown-months" | "dropdown-years" — react-day-picker\'s month/year caption style.' },
                { k: "buttonVariant", v: 'Button variant for the previous/next month controls, default "ghost".' },
                { k: "disabled", v: "A Date, array, range, or matcher function — days that cannot be selected, shown at 50% opacity." },
                { k: "locale", v: "A date-fns Locale, changes weekday names and week start." },
              ]}
            />
          ),
        },
        {
          label: "CalendarDayButton",
          body: (
            <Meta
              items={[
                {
                  k: "Exported separately",
                  v: "So a call site can override just the day cell (components={{ DayButton: MyDayButton }}) without reimplementing the rest of the grid.",
                },
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
      description:
        "A day cell carries its state as data attributes (data-selected-single, data-range-start/middle/end, data-today, data-outside, data-disabled) rather than separate components — see the specimens above for selected, range and disabled together.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "rest / today", v: "Unselected days render plain; today gets a muted background (data-today) even when nothing is selected." },
                { k: "selected (single)", v: "data-selected-single — filled with the primary colour, rounded on all sides." },
                { k: "range start / middle / end", v: "data-range-start / data-range-middle / data-range-end — the endpoints are filled and rounded on their outer edge only; the days between are a flat muted fill with no rounding, so the range reads as one continuous band." },
                { k: "outside", v: "Leading/trailing days from adjacent months, muted text, shown when showOutsideDays is true (default)." },
                { k: "disabled", v: "50% opacity, removed from the tab sequence via the underlying Button's own disabled state." },
                { k: "focus-visible", v: "The day under keyboard focus gets a ring — see Keyboard for how focus moves through the grid." },
                { k: "pressed / loading / success / empty", v: "N/A — a day is a toggleable value, not an async action; a month with no selectable days is still a full grid, not an empty state." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "react-day-picker renders the month grid with role=\"grid\" and each day as a real Button, so the accessibility tree matches what a screen reader expects from a date picker.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Grid role", v: 'The month grid carries role="grid" and aria-multiselectable when mode is "multiple" or "range".' },
                { k: "Day cells", v: "Each day is a real Button, so it is reachable, focusable and announced as a button with its date as the accessible name — not a styled <td>." },
                {
                  k: "Month navigation landmark",
                  v: 'react-day-picker renders the previous/next stepper as <nav aria-label="Navigation bar"> by default — a landmark. Two calendars on one route would then publish two landmarks with the same name, which axe flags as landmark-unique. Calendar\'s own Nav override strips the role (role="none", no aria-label) and leaves the semantics on the two buttons, which already carry their own "Go to the Previous/Next Month" names.',
                },
                {
                  k: "Popover naming (Date Picker)",
                  v: "PopoverContent gets role=\"dialog\" from Radix with no built-in name — see the Popover source comment. The Date Picker specimen supplies aria-label=\"Choose a date\" directly since it renders no PopoverTitle.",
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
        "Verified from react-day-picker's own keyboard handler rather than assumed — the grid supports full arrow, page and jump navigation, not just left/right.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "ArrowLeft / ArrowRight", v: "Moves the focused day one day back / forward (flips under RTL)." },
                { k: "ArrowUp / ArrowDown", v: "Moves one week back / forward. With Shift held, moves one year back / forward instead." },
                { k: "PageUp / PageDown", v: "Moves one month back / forward. With Shift held, moves one year back / forward." },
                { k: "Home / End", v: "Jumps to the start / end of the current week." },
                { k: "Enter / Space", v: "Selects the focused day (native Button activation)." },
                { k: "Tab", v: "Enters the grid at the focused day (roving tabindex) rather than tabbing through every cell; Tab again leaves the grid entirely." },
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
        "A month grid is a fixed table of day cells, not a fluid layout — what actually adapts across widths is whether multiple months sit side by side or stack, and how the RTL chevrons point.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Multiple months",
                  v: "relative flex flex-col gap-4 md:flex-row — with numberOfMonths greater than 1 (a range picker showing two months, for instance), the calendar stacks its months vertically below the md breakpoint (768px) and lays them side by side from md up, so a two-month range picker never forces horizontal scrolling on a phone-width viewport.",
                },
                {
                  k: "RTL",
                  v: "The previous/next chevrons are explicitly rotated 180deg under an rtl ancestor (rtl:**:[.rdp-button_next>svg]:rotate-180 and the matching _previous rule), so \"next month\" still points toward reading-forward rather than staying visually pinned to the right — this is a rule the calendar has to state itself, since a plain icon does not flip on its own under RTL.",
                },
                {
                  k: "Day cell size",
                  v: "Each day is a fixed-size Button (CalendarDayButton) inside a fixed-width grid — the grid does not reflow into fewer or more columns at any width; a narrow viewport gets a smaller calendar, not a differently-shaped one.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920px, no overflow under 200% text zoom, and no overflow under RTL — consistent with the explicit RTL chevron handling above.",
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
