"use client";

import { useMemo, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TOTAL_PACKS = 184;
const PAGE_SIZE = 8;
const TOTAL_PAGES = Math.ceil(TOTAL_PACKS / PAGE_SIZE);

const SET_NAMES = [
  "Eclipse Vault",
  "Golden Rift",
  "Mystic Surge",
  "Shadow Core",
  "Celestial Strike",
  "Origin Pulse",
  "Nightfall",
  "Draft Bundle",
];

function packName(index: number) {
  return `${SET_NAMES[index % SET_NAMES.length]} #${index + 1}`;
}

function pageWindow(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "ellipsis", total];
  if (current >= total - 2) return [1, "ellipsis", total - 2, total - 1, total];
  return [1, "ellipsis", current, "ellipsis", total];
}

export function PaginationShowcase() {
  const [page, setPage] = useState(2);

  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return Array.from({ length: PAGE_SIZE }, (_, i) => packName(start + i));
  }, [page]);

  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, TOTAL_PACKS);

  return (
    <div className="w-full max-w-md">
      <ul className="grid grid-cols-2 gap-2">
        {rows.map((name) => (
          <li
            key={name}
            className="type-small truncate rounded-md border border-border bg-card px-3 py-2 text-foreground"
          >
            {name}
          </li>
        ))}
      </ul>

      <Pagination className="mt-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#preview"
              disabled={page === 1}
              onClick={(event) => {
                event.preventDefault();
                setPage((p) => Math.max(1, p - 1));
              }}
            />
          </PaginationItem>
          {pageWindow(page, TOTAL_PAGES).map((entry, i) =>
            entry === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={entry}>
                <PaginationLink
                  href="#preview"
                  isActive={entry === page}
                  onClick={(event) => {
                    event.preventDefault();
                    setPage(entry);
                  }}
                >
                  {entry}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              href="#preview"
              disabled={page === TOTAL_PAGES}
              onClick={(event) => {
                event.preventDefault();
                setPage((p) => Math.min(TOTAL_PAGES, p + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="type-small mt-3 text-center text-muted-foreground">
        Showing {start}–{end} of {TOTAL_PACKS} packs
      </p>
    </div>
  );
}
