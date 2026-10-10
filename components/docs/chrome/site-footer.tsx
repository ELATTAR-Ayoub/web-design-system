import * as React from "react";
import Link from "next/link";

import { PageContainer } from "@/components/docs/layout/page-container";
import { cn } from "@/lib/utils";
import type { SiteNavGroup, SiteNavItem } from "@/lib/docs/nav";

/**
 * The foot of every page: grouped links, then the legal row.
 *
 * **Each column is its own `<nav>` with its own accessible name**, taken from
 * the column heading via `aria-labelledby`. A single `<nav>` wrapping four
 * columns announces as one undifferentiated list of twenty links; four named
 * ones let a screen-reader user skip straight to "Company". The heading is a
 * real `<h2>` for the same reason — it is how the landmark gets its name and
 * how heading navigation finds it.
 *
 * **The legal row is separate from the columns, structurally and not just
 * visually.** A reader looking for a privacy policy is not browsing; they are
 * looking for one specific thing, in the one place every site puts it. Folding
 * it into a "Company" column makes it something you have to hunt for.
 *
 * **`legalNote` takes a node, not a year.** A component that computes
 * `new Date().getFullYear()` renders a different string on the server and on
 * the client either side of midnight on 31 December, and prerendered output
 * would be stale from the first of January regardless. That is trap 16's
 * family — locale-and-time-sensitive markup that passes every source guard and
 * fails where two runtimes meet. The caller owns the string.
 *
 * State model:
 * rest · hover — links lift their foreground. focus-visible — the global ring,
 * untouched. pressed — N/A; navigation is the feedback. loading · success ·
 * error · disabled — N/A. empty — handled by omission at every level: no
 * groups renders no columns, no legal links renders no legal row, and an
 * absent `legalNote` renders nothing rather than an empty line.
 */

function FooterLink({ item }: { item: SiteNavItem }) {
  return (
    <li>
      <Link
        href={item.href}
        className="type-small block py-1 text-muted-foreground transition-colors duration-fast hover:text-foreground"
      >
        {item.title}
      </Link>
    </li>
  );
}

function SiteFooter({
  brand,
  groups = [],
  legal = [],
  legalNote,
  className,
  ...props
}: React.ComponentProps<"footer"> & {
  brand?: React.ReactNode;
  groups?: SiteNavGroup[];
  legal?: SiteNavItem[];
  /** A copyright line or registration detail. A node, never a computed year. */
  legalNote?: React.ReactNode;
}) {
  return (
    <footer
      data-slot="site-footer"
      className={cn("mt-auto border-t border-border bg-background", className)}
      {...props}
    >
      <PageContainer className="py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          {brand && <div className="min-w-0">{brand}</div>}

          {groups.length > 0 && (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-none lg:auto-cols-max lg:grid-flow-col lg:gap-16">
              {groups.map((group) => {
                const headingId = `site-footer-${group.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;
                return (
                  <nav
                    key={group.title}
                    aria-labelledby={headingId}
                    className="min-w-0"
                  >
                    <h2 id={headingId} className="type-badge text-muted-foreground">
                      {group.title}
                    </h2>
                    <ul className="mt-3 space-y-1">
                      {group.items.map((item) => (
                        <FooterLink key={item.href} item={item} />
                      ))}
                    </ul>
                  </nav>
                );
              })}
            </div>
          )}
        </div>

        {(legal.length > 0 || legalNote) && (
          <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            {legalNote && <p className="type-small">{legalNote}</p>}
            {legal.length > 0 && (
              <nav aria-label="Legal">
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {legal.map((item) => (
                    <FooterLink key={item.href} item={item} />
                  ))}
                </ul>
              </nav>
            )}
          </div>
        )}
      </PageContainer>
    </footer>
  );
}

export { SiteFooter };
