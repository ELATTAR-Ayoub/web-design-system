import * as React from "react";
import Link from "next/link";

import { PageContainer } from "@/components/docs/layout/page-container";
import { cn } from "@/lib/utils";
import type { SiteNavGroup, SiteNavItem } from "@/lib/docs/nav";

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
