/**
 * The left documentation rail. One shape, every route.
 *
 * It does not change by page, and that is the requirement rather than a
 * simplification: a rail that regroups itself as you move through a system
 * makes a reader re-learn the navigation on every click. The groups are
 * **Sections**, then the four catalog families — Components, Effects, Agent,
 * Charts. The six foundation pages sit in Sections; their older short URLs
 * remain valid, while the duplicate Theming and Typeset primers redirect to
 * the complete foundation pages.
 *
 * **Every row comes from the catalog or from `lib/ds/nav.ts`.** Nothing here
 * is authored. A component appearing in the rail and not at a route, or the
 * other way round, is impossible by construction rather than by discipline.
 *
 * **Independent scroll, and the selected row is revealed.** The rail is its own
 * scroll container with a bounded height, so scrolling the article never moves
 * it and scrolling the rail never moves the article. On a deep route — `Tooltip`
 * sits far down the Components group — the selected row starts off-screen
 * inside that container, so an effect scrolls it into view WITHIN the rail.
 * `block: "nearest"` is what keeps that from scrolling the article too: the
 * article is an ancestor scroll container, and `"center"` or `"start"` would
 * walk up and move it as well, jumping the reader past the page heading they
 * just navigated to.
 *
 * State model:
 * rest · hover — foreground lift plus a border. focus-visible — the global
 * ring. pressed — N/A for links; navigation is the feedback. loading · success
 * · error · disabled — N/A. empty — impossible: a family with no entries is not
 * rendered at all rather than left as a bare heading.
 */

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { docRoute, railEntriesIn } from "@/lib/ds/docs/catalog";
import { FAMILY_LABEL, FAMILY_LANDING, FAMILY_ORDER } from "@/lib/ds/families";
import { DOC_SECTIONS, DS_ROOT } from "@/lib/ds/nav";
import { cn } from "@/lib/utils";

type RailEntry = { title: string; href: string };
type RailGroup = { label: string; entries: RailEntry[] };

/**
 * The rail's groups, computed once.
 *
 * Module scope rather than per render: every input is a static import, so the
 * answer cannot change and rebuilding a hundred-odd rows on each navigation is
 * work for nothing.
 */
const RAIL_GROUPS: RailGroup[] = (() => {
  const groups: RailGroup[] = [{
    label: "Sections",
    entries: DOC_SECTIONS.map(({ title, href }) => ({ title, href })),
  }];

  for (const family of FAMILY_ORDER) {
    const landing = FAMILY_LANDING[family];
    const entries: RailEntry[] = [
      // A family's landing sits above its components rather than among them:
      // it is the family, not a member of it.
      ...(landing
        ? [{ title: landing.title, href: `${DS_ROOT}/components/${landing.slug}` }]
        : []),
      ...railEntriesIn(family).map(({ meta, contract }) => ({
        title: contract.title,
        href: docRoute(meta.name),
      })),
    ];
    if (!entries.length) continue;
    groups.push({ label: FAMILY_LABEL[family], entries });
  }

  return groups;
})();

export function DocsRailTree({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const railRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const selected = rail.querySelector<HTMLElement>('[aria-current="page"]');
    if (!selected) return;

    // Only if it is actually out of view. Calling `scrollIntoView`
    // unconditionally moves the rail on every navigation, including the common
    // case where the next row is the one directly below the last.
    const railBox = rail.getBoundingClientRect();
    const rowBox = selected.getBoundingClientRect();
    if (rowBox.top >= railBox.top && rowBox.bottom <= railBox.bottom) return;

    // `nearest`, not `center`: see this file's header. The article is an
    // ancestor scroll container and `center` would move it too.
    selected.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  return (
    <nav ref={railRef} aria-label="Documentation" className="pb-16">
      {RAIL_GROUPS.map((group) => (
        <div key={group.label} className="mb-8">
          <p className="type-badge mb-3 text-muted-foreground">{group.label}</p>
          <ul className="space-y-px border-l border-border">
            {group.entries.map((entry) => {
              const active = pathname === entry.href;
              return (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      // The selected state is a fill plus a border, not weight:
                      // a heavier label is a wider label, and a rail that
                      // reflows as you move through it looks broken.
                      "type-nav -ml-px block border-l py-2 pl-4 transition-colors duration-fast",
                      active
                        ? "border-action bg-action/12 text-foreground"
                        : "border-transparent text-muted-foreground hover:border-input hover:text-foreground",
                    )}
                  >
                    {entry.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsRail() {
  return (
    <aside
      // Sticky below the header and bounded, so the rail reads as a panel with
      // room around it rather than a column poured into the window.
      // `--height-doc-rail` carries the bound AND the short-viewport `min()`,
      // so this is one class rather than an inline style doing arithmetic.
      className="sticky top-(--height-site-header) hidden h-(--height-doc-rail) w-(--width-rail) shrink-0 self-start overflow-y-auto border-r border-border px-6 pt-10 scrollbar-thin lg:block"
    >
      <DocsRailTree />
    </aside>
  );
}
