"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Sale = {
  id: string;
  card: string;
  set: string;
  grade: "Grade 10" | "Grade 9" | "Raw";
  price: number;
};

const SALES: Sale[] = [
  { id: "1", card: "Eclipse Vault", set: "Origin", grade: "Grade 10", price: 4820 },
  { id: "2", card: "Golden Rift", set: "Origin", grade: "Grade 9", price: 1240 },
  { id: "3", card: "Mystic Surge", set: "Celestial", grade: "Raw", price: 320 },
  { id: "4", card: "Shadow Core", set: "Celestial", grade: "Grade 10", price: 7600 },
  { id: "5", card: "Origin Pulse", set: "Origin", grade: "Grade 9", price: 180 },
  { id: "6", card: "Celestial Strike", set: "Celestial", grade: "Grade 10", price: 21000 },
  { id: "7", card: "Ember Wake", set: "Ember", grade: "Raw", price: 95 },
  { id: "8", card: "Frost Herald", set: "Ember", grade: "Grade 9", price: 640 },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const SKELETON_ROWS = ["a", "b", "c", "d"];

const columns: ColumnDef<Sale>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all rows on this page"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label={`Select ${row.original.card}`}
      />
    ),
    enableSorting: false,
  },
  { accessorKey: "card", header: "Card" },
  { accessorKey: "set", header: "Set" },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => (
      <Badge variant={row.original.grade === "Grade 10" ? "premium" : "outline"}>
        {row.original.grade}
      </Badge>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span className="type-number-sm block text-right text-foreground">
        {money.format(row.original.price)}
      </span>
    ),
  },
];

export function DataTableDemo({ loading = false }: { loading?: boolean }) {
  // Opts out of the React Compiler: table methods read mutable state.
  "use no memo";

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: SALES,
    columns,
    // Stable row ids keep selection on the right rows after sorting.
    getRowId: (row) => row.id,
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 4 } },
  });

  const rows = table.getRowModel().rows;
  const query = (table.getColumn("card")?.getFilterValue() as string) ?? "";
  const selected = Object.keys(rowSelection).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Input
            value={query}
            onChange={(e) =>
              table.getColumn("card")?.setFilterValue(e.target.value)
            }
            placeholder="Filter by card"
            aria-label="Filter by card"
            className="pl-10"
            disabled={loading}
          />
          <Icon
            icon={Search}
            size="sm"
            tone="muted"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
          />
        </div>
        {selected > 0 && (
          <span className="type-small text-muted-foreground">
            {selected} selected
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : undefined
                      }
                    >
                      {header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          disabled={loading}
                          className="press -mx-2 flex items-center gap-1.5 rounded-sm px-2 py-1 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          <Icon
                            icon={
                              sorted === "asc"
                                ? ArrowUp
                                : sorted === "desc"
                                  ? ArrowDown
                                  : ArrowUpDown
                            }
                            size="sm"
                            tone={sorted ? "action" : "muted"}
                          />
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              SKELETON_ROWS.map((key) => (
                <TableRow key={key}>
                  {columns.map((c, i) => (
                    <TableCell key={c.id ?? `col-${i}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48">
                  <Empty>
                    <EmptyTitle>No cards match &ldquo;{query}&rdquo;</EmptyTitle>
                    <EmptyDescription>
                      Try a shorter search, or clear the filter to see all eight.
                    </EmptyDescription>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => table.getColumn("card")?.setFilterValue("")}
                    >
                      Clear filter
                    </Button>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="anim-enter"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="type-small text-muted-foreground">
          {loading
            ? "Loading…"
            : `Page ${table.getState().pagination.pageIndex + 1} of ${Math.max(
                table.getPageCount(),
                1,
              )} · ${table.getFilteredRowModel().rows.length} of ${SALES.length} cards`}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={loading || !table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={loading || !table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
