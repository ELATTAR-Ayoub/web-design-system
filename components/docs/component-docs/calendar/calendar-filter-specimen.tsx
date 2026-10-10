"use client";

import { useMemo, useState } from "react";
import { format, isSameDay } from "date-fns";

import { Calendar } from "@/components/ui/calendar";

type Card = { name: string; acquired: Date; price: number };

const TODAY = new Date(2026, 6, 30);
const DAY_1 = new Date(2026, 6, 30);
const DAY_2 = new Date(2026, 6, 28);
const DAY_3 = new Date(2026, 6, 24);

const CARDS: Card[] = [
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
    <div className="grid w-full max-w-lg gap-4 sm:grid-cols-2">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={TODAY}
        className="rounded-lg border border-border bg-card p-3"
      />
      <div>
        <p className="type-small mb-3 text-muted-foreground">
          {date ? `Acquired ${format(date, "d MMM yyyy")}` : "All acquisitions"}
        </p>
        {filtered.length > 0 ? (
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {filtered.map((c) => (
              <li key={c.name} className="flex items-center justify-between gap-3 px-3 py-2.5">
                <span className="type-small truncate text-foreground">{c.name}</span>
                <span className="type-number-sm shrink-0 text-value-ink">
                  ${c.price.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="type-small rounded-lg border border-dashed border-border p-4 text-muted-foreground">
            Nothing acquired that day.
          </p>
        )}
      </div>
    </div>
  );
}
