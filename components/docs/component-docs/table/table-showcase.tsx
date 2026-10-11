"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpDown, ArrowUpRight, FlagIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Row = {
  id: string;
  type: string;
  detail: string;
  amount: number;
  direction: "in" | "out";
  status: "Completed" | "Pending";
  flagged: boolean;
};

const INITIAL_ROWS: Row[] = [
  { id: "tx-1", type: "Pack purchase", detail: "Eclipse Vault × 3", amount: -144, direction: "out", status: "Completed", flagged: false },
  { id: "tx-2", type: "Card sale", detail: "Voidwing Ascendant", amount: 1240, direction: "in", status: "Completed", flagged: false },
  { id: "tx-3", type: "Deposit", detail: "Card ···· 4242", amount: 250, direction: "in", status: "Completed", flagged: false },
  { id: "tx-4", type: "Withdrawal", detail: "USDC · 0xA71c…4F2b", amount: -800, direction: "out", status: "Pending", flagged: false },
  { id: "tx-5", type: "Reward", detail: "Weekly leaderboard · 4th", amount: 50, direction: "in", status: "Completed", flagged: false },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", signDisplay: "always" });

export function TransactionTableShowcase() {
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const sorted = useMemo(() => {
    if (!sortDir) return rows;
    return [...rows].sort((a, b) =>
      sortDir === "asc" ? a.amount - b.amount : b.amount - a.amount,
    );
  }, [rows, sortDir]);

  const allSelected = selected.size > 0 && selected.size === rows.length;
  const someSelected = selected.size > 0 && !allSelected;

  function toggleSort() {
    setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
  }

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(rows.map((r) => r.id)) : new Set());
  }

  function flagSelected() {
    setRows((prev) => prev.map((r) => (selected.has(r.id) ? { ...r, flagged: true } : r)));
    setSelected(new Set());
  }

  return (
    <div className="w-full space-y-3">
      {selected.size > 0 && (
        <div className="anim-enter flex items-center justify-between gap-4 rounded-lg border border-action/30 bg-action/8 px-4 py-2.5">
          <span className="type-small text-foreground">
            {selected.size} selected
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
            <Button size="sm" onClick={flagSelected}>
              <Icon icon={FlagIcon} size="sm" tone="inherit" />
              Flag for review
            </Button>
          </div>
        </div>
      )}
      <Table>
        <TableCaption>Showing the 5 most recent transactions of 248.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="pr-0">
              <Checkbox
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={(v) => toggleAll(!!v)}
                aria-label="Select all rows"
              />
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Detail</TableHead>
            <TableHead
              className="text-right"
              aria-sort={sortDir === "asc" ? "ascending" : sortDir === "desc" ? "descending" : "none"}
            >
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={toggleSort}
                className="text-foreground"
              >
                Amount
                <Icon
                  icon={ArrowUpDown}
                  size="xs"
                  tone={sortDir ? "action" : "subtle"}
                />
              </Button>
            </TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((r) => (
            <TableRow key={r.id} data-state={selected.has(r.id) ? "selected" : undefined}>
              <TableCell className="pr-0">
                <Checkbox
                  checked={selected.has(r.id)}
                  onCheckedChange={(v) => toggleRow(r.id, !!v)}
                  aria-label={`Select ${r.detail}`}
                />
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-2">
                  <Icon
                    icon={r.direction === "in" ? ArrowDownLeft : ArrowUpRight}
                    size="sm"
                    tone={r.direction === "in" ? "success" : "subtle"}
                  />
                  <span className="text-foreground">{r.type}</span>
                  {r.flagged && <Badge variant="warning">Flagged</Badge>}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">{r.detail}</TableCell>
              <TableCell
                className={`type-number-base text-right ${
                  r.direction === "in" ? "text-value-ink" : "text-foreground"
                }`}
              >
                {money.format(r.amount)}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant={r.status === "Pending" ? "warning" : "success"}>
                  {r.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
