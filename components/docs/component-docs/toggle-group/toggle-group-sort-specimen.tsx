"use client";

/**
 * The live Preview specimen for the `toggle-group` documentation page.
 *
 * `components/docs/component-docs/toggle-group/page.tsx` is a plain data
 * module rendered by a SERVER component — it cannot hold the `useState` a
 * real sort needs (trap 29). This companion is that scene: pick a sort key
 * and a short list of cards actually re-orders beneath it, using nothing but
 * `ToggleGroup`'s own `onValueChange` and an in-memory sort.
 */

import { useMemo, useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Card = { name: string; pulledAgo: string; pulledAt: number; price: number };

const CARDS: Card[] = [
  { name: "Voidwing Ascendant", pulledAgo: "2h ago", pulledAt: 2, price: 248 },
  { name: "Tidecaller", pulledAgo: "1d ago", pulledAt: 24, price: 12 },
  { name: "Emberlash Prime", pulledAgo: "5d ago", pulledAt: 120, price: 64 },
  { name: "Stonewarden", pulledAgo: "3w ago", pulledAt: 504, price: 4 },
];

type SortKey = "newest" | "price" | "name";

const SORTERS: Record<SortKey, (a: Card, b: Card) => number> = {
  newest: (a, b) => a.pulledAt - b.pulledAt,
  price: (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
};

export function ToggleGroupSortSpecimen() {
  const [sort, setSort] = useState<SortKey>("newest");

  const sorted = useMemo(
    () => [...CARDS].sort(SORTERS[sort]),
    [sort],
  );

  return (
    <div className="w-full max-w-sm space-y-4">
      <ToggleGroup
        type="single"
        variant="outline"
        value={sort}
        onValueChange={(v) => v && setSort(v as SortKey)}
        aria-label="Sort the Stash"
      >
        <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
        <ToggleGroupItem value="price">Price</ToggleGroupItem>
        <ToggleGroupItem value="name">Name</ToggleGroupItem>
      </ToggleGroup>

      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        {sorted.map((card) => (
          <li key={card.name} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0">
              <span className="type-small block truncate text-foreground">{card.name}</span>
              <span className="type-small text-muted-foreground">{card.pulledAgo}</span>
            </span>
            <span className="type-number-sm shrink-0 text-value-ink">
              ${card.price.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
