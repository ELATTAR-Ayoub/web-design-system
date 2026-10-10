import { CodeBlock } from "@/components/ds/code-block";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note, Panel } from "@/components/ds/kit";

import { TransactionTableShowcase } from "./table-showcase";

import { meta } from "./meta";

const DATA_TABLE_SOURCE = `"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
        aria-label={\`Select \${row.original.card}\`}
      />
    ),
    enableSorting: false,
  },
  { accessorKey: "card", header: "Card" },
  {
    accessorKey: "price",
    header: "Price",
    // Money is mono, tabular and right-aligned.
    cell: ({ row }) => (
      <span className="type-number-sm block text-right text-foreground">
        {money.format(row.original.price)}
      </span>
    ),
  },
];

export function DataTableDemo({ loading = false }: { loading?: boolean }) {
  // TanStack's own opt-out from the React Compiler: useReactTable() hands
  // back methods that read mutable state held on the table instance rather
  // than derived from props, which the compiler cannot see.
  "use no memo";

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data: SALES,
    columns,
    getRowId: (row) => row.id, // stable id — without it, selection is
                                // keyed by array index and breaks on sort
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

  // aria-sort lives on TableHead, not on the trigger inside it — the trigger
  // is a real <button>, so sorting is reachable by keyboard.
  return (
    <TableHead
      aria-sort={
        sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined
      }
    >
      <button type="button" onClick={header.column.getToggleSortingHandler()}>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </button>
    </TableHead>
  );
}`;

export const spec: ComponentDocSpec = {
  name: "table",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Transaction history, sortable and selectable. Click \"Amount\" to sort by it, check a row (or \"select all\") and a bulk-action bar appears above the table — every figure stays right-aligned and tabular so the decimal points form a column the eye can scan.",
      render: (
        <Panel label="Transaction history" flush bodyClassName="p-4">
          <TransactionTableShowcase />
        </Panel>
      ),
      source: `const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
const [selected, setSelected] = useState<Set<string>>(new Set());

{selected.size > 0 && (
  <div className="flex items-center justify-between gap-4 rounded-lg border border-action/30 bg-action/8 px-4 py-2.5">
    <span>{selected.size} selected</span>
    <Button size="sm" onClick={flagSelected}>Flag for review</Button>
  </div>
)}

<Table>
  <TableCaption>Showing the 5 most recent transactions of 248.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="pr-0">
        <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all rows" />
      </TableHead>
      <TableHead>Type</TableHead>
      <TableHead>Detail</TableHead>
      <TableHead className="text-right" aria-sort={sortDir === "asc" ? "ascending" : sortDir === "desc" ? "descending" : "none"}>
        <button type="button" onClick={toggleSort}>Amount</button>
      </TableHead>
      <TableHead className="text-right">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow data-state={selected.has(row.id) ? "selected" : undefined}>
      <TableCell className="pr-0">
        <Checkbox checked={selected.has(row.id)} onCheckedChange={(v) => toggleRow(row.id, !!v)} aria-label={\`Select \${row.detail}\`} />
      </TableCell>
      <TableCell>Deposit</TableCell>
      <TableCell className="text-muted-foreground">Card ···· 4242</TableCell>
      <TableCell className="type-number-base text-right text-value-ink">+$250.00</TableCell>
      <TableCell className="text-right">
        <Badge variant="success">Completed</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>`,
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
        "A single transaction row: the shape the Preview specimen is built from.",
      language: "tsx",
      code: `import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

<Table>
  <TableCaption>Showing 5 of 248 transactions.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Type</TableHead>
      <TableHead className="text-right">Amount</TableHead>
      <TableHead className="text-right">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Deposit</TableCell>
      <TableCell className="type-number-base text-right text-value-ink">
        +$250.00
      </TableCell>
      <TableCell className="text-right">
        <Badge variant="success">Completed</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Direction is carried three ways at once: the sign on the number, the arrow glyph, and colour. Incoming takes the value ramp — money arriving is worth — and outgoing stays plain text. Never red for outgoing, because a purchase is not an error, and never success either, so a completed sale does not look like a valuable one in the same row.",
      label: "Money direction",
      render: (
        <Note tone="action" title="Money in versus money out">
          <Code>text-value-ink</Code> for incoming, plain <Code>text-foreground</Code>{" "}
          for outgoing — see the Preview specimen above, which is the worked
          example.
        </Note>
      ),
      source: `<Note tone="action" title="Money in versus money out">
  <Code>text-value-ink</Code> for incoming, plain <Code>text-foreground</Code>{" "}
  for outgoing — see the Preview specimen above, which is the worked example.
</Note>`,
    },
    {
      kind: "disclosure",
      id: "data-table",
      title: "Data Table",
      description:
        "Sorting, filtering, selection and pagination composed over Table. shadcn ships this as a recipe rather than a file, because the interesting part is always the column definitions — and those belong to whatever is being listed. The full pattern lives at components/ds/data-table-demo.tsx and is reproduced here rather than mounted live: it carries its own React state (sorting, filters, row selection), and a documentation spec is plain data rendered by a server component, so this page shows its source and its API instead of a second, stateful copy.",
      blocks: [
        {
          label: "The pattern",
          body: (
            <CodeBlock
              code={DATA_TABLE_SOURCE}
              language="tsx"
              className="rounded-lg border border-border"
            />
          ),
        },
        {
          body: (
            <Note title="TanStack Table is pinned to v8, on purpose">
              Data Table is the one shadcn entry that is not a file you own —
              it is a recipe driving <Code>@tanstack/react-table</Code>, a
              separate library on its own release schedule. That library has a
              v9 which is a full API rewrite, and under it not one line of
              shadcn&rsquo;s published example compiles. So the dependency is
              pinned to v8: the version their docs are written against, which
              means the code on their site pastes in here and works. Treat the
              pin as load-bearing.
            </Note>
          ),
        },
        {
          body: (
            <Note title="The two states a table demo always skips">
              Filter <Code>DataTableDemo</Code> down to nothing and it renders
              an <Code>Empty</Code> with a way back out, not a blank
              rectangle. Passing <Code>loading</Code> renders skeleton rows
              carrying the same cell count, padding and height as real ones,
              so nothing moves when the data lands. A generic grey block would
              be a layout jump, which is worse than the spinner it was meant
              to avoid.
            </Note>
          ),
        },
        {
          label: "API",
          body: (
            <Meta
              items={[
                {
                  k: "useReactTable",
                  v: "The hook. Feed it data, columns and one get*RowModel per feature you want — core, sorted, filtered, paginated.",
                },
                {
                  k: "flexRender",
                  v: "Renders a header or cell definition, whether it is a string, a component or a function.",
                },
                {
                  k: "getRowId",
                  v: "Give it a stable id from your data. Without it selection is keyed by array index, and breaks the moment anything sorts.",
                },
                {
                  k: "state + on…Change",
                  v: "Always a pair. A controlled slice handed in without its writer is read once and then ignored — the filter box types fine and never filters.",
                },
                {
                  k: "aria-sort",
                  v: "On the TableHead, not on the button. The trigger inside it is a real <button> so sorting is reachable by keyboard.",
                },
                {
                  k: '"use no memo"',
                  v: "TanStack's own opt-out from the React Compiler — useReactTable() returns methods that read mutable state on the table instance rather than derive from props, which the compiler cannot see and would otherwise memoise into staleness.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Every piece forwards its remaining props to the native element it renders. None carry a variant or size axis — Table is plain semantic HTML with fixed styling, and any visual differentiation (right-aligned numeric columns, row selection) is expressed through className or data-state on the call site.",
      blocks: [
        {
          label: "Table",
          body: (
            <Meta
              items={[
                {
                  k: "(root)",
                  v: "Renders a <table> inside a relative, full-width, horizontally scrolling <div data-slot=\"table-container\">. ...props forwards to the <table> element.",
                },
              ]}
            />
          ),
        },
        {
          label: "TableHeader / TableBody / TableFooter",
          body: (
            <Meta
              items={[
                { k: "TableHeader", v: "<thead>. Its rows keep a bottom border via [&_tr]:border-b." },
                { k: "TableBody", v: "<tbody>. Its last row drops its border via [&_tr:last-child]:border-0." },
                {
                  k: "TableFooter",
                  v: "<tfoot>, exported but not used by the Preview or Data Table specimens above — border-t bg-muted/50 font-medium, for a totals row.",
                },
              ]}
            />
          ),
        },
        {
          label: "TableRow",
          body: (
            <Meta
              items={[
                {
                  k: "(styling)",
                  v: "<tr> with a bottom border, hover:bg-muted/50, has-aria-expanded:bg-muted/50 (an expandable row), and data-[state=selected]:bg-muted for a row a caller has marked selected.",
                },
              ]}
            />
          ),
        },
        {
          label: "TableHead / TableCell",
          body: (
            <Meta
              items={[
                {
                  k: "TableHead",
                  v: "<th>, left-aligned and font-medium by default. Pass className=\"text-right\" on numeric columns, paired with type-number-base on the cell.",
                },
                {
                  k: "TableCell",
                  v: "<td>, vertically centred with whitespace-nowrap. Both TableHead and TableCell collapse their own padding when they contain a checkbox ([&:has([role=checkbox])]:pr-0).",
                },
              ]}
            />
          ),
        },
        {
          label: "TableCaption",
          body: (
            <p className="type-small text-muted-foreground">
              <Code>{"<caption>"}</Code>, muted and set below the table. Say
              what the table is showing and out of how many — the Preview
              specimen&rsquo;s &ldquo;Showing the 5 most recent transactions
              of 248&rdquo; is the pattern.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "Table renders real HTML table elements, so most semantics come from the browser rather than from added ARIA.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Structure",
                  v: "A native <table>/<thead>/<tbody>/<tr>/<th>/<td>, so row and column relationships, and header association, are exposed by the accessibility tree without any role attributes added by this component.",
                },
                {
                  k: "Caption",
                  v: "TableCaption renders a real <caption>, announced as the table's accessible description — say what it shows and out of how many, as text, not only visually.",
                },
                {
                  k: "aria-sort",
                  v: "Not set by Table itself. When a column is sortable (the Data Table pattern), aria-sort belongs on the TableHead, and the sort trigger inside it is a real <button> rather than a click handler on the <th>, so it is reachable and announced as a control.",
                },
                {
                  k: "data-state=\"selected\"",
                  v: "Visual only. It changes the row's background but sets no aria-selected — a caller that needs the selection announced must add aria-selected itself (the Data Table pattern's checkbox column is what actually carries the selection state to assistive tech).",
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
        "Table itself places no element in the tab sequence. Keyboard behaviour comes entirely from whatever interactive elements a caller puts inside a cell or header.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Table alone", v: "No keyboard interaction — there is nothing focusable in the Preview specimen above." },
                {
                  k: "Data Table pattern",
                  v: "Tab reaches the filter input, each column's sort button, the row checkboxes and the Previous/Next buttons in document order. Space/Enter on a sort button toggles that column's sort direction; Space toggles a checkbox.",
                },
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
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              Table wraps itself in <Code>{"<div data-slot=\"table-container\" className=\"relative w-full overflow-x-auto\">"}</Code>{" "}
              — every table scrolls horizontally on its own rather than
              overflowing the page, with no extra wrapper required at the call
              site.
            </p>
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
