/**
 * The page outline, in the two shapes the shell has room for.
 *
 * There is no way to pass either of them a list. Both take the spec and call
 * `tocFor`, so the outline and the page are the same declaration read twice —
 * a section cannot exist without a link, and a link cannot point at nothing.
 * The failure this replaces is a hand-typed `contents` array that drifted: the
 * colours page listed three sections it did not have and missed one it did, and
 * nothing failed.
 *
 * **Three widths, two shapes.** Below `xl` there is no room for a second rail
 * beside the article and the left one, so the outline becomes a horizontal
 * strip above the article — `AnchorStrip`. At `xl` and up the strip gives way
 * to the sticky `ON THIS PAGE` rail on the right. Both are always rendered and
 * CSS decides which is visible, because a width branch in JavaScript means the
 * server and the client can draw different trees.
 *
 * **Anchors are not routes.** Every entry is a same-page `<a href="#id">`. It
 * updates the highlighted entry and scrolls the article; it does not navigate.
 * A bare anchor handed to a router falls through to a not-found page, which is
 * what happens when an outline and a navigation list share one callback.
 *
 * **One nested level, and no more.** A disclosure block that declares an
 * `anchor` becomes a second-level entry under its section — an API Reference
 * documenting four exports is four destinations. Nesting deeper would make the
 * outline a second copy of the page.
 *
 * **The scroll-spy observes both levels.** `anchorsFor` flattens the tree, so a
 * nested API entry highlights when the reader reaches it rather than leaving
 * the parent section lit for the whole scroll.
 *
 * State model:
 * rest · hover — foreground lift. focus-visible — the global ring. pressed —
 * N/A for links. loading · success · error · disabled — N/A. empty — a spec
 * with no sections renders nothing at all rather than an empty rail; the strip
 * does the same.
 */

"use client";

import { ExpandAllToggle } from "./doc-section";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { anchorsFor, tocFor, type ComponentDocSpec, type TocEntry } from "./types";

/**
 * Which anchor the reader is looking at.
 *
 * `rootMargin` pulls the detection line down under the sticky header and up off
 * the fold, so the highlighted entry is the section in view rather than
 * whichever one happens to touch the viewport edge.
 */
function useActiveAnchor(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  // A stable primitive, so the effect below does not re-subscribe on every
  // render just because `ids` is a fresh array each time.
  const key = ids.join(",");

  useEffect(() => {
    const anchors = key ? key.split(",") : [];
    if (anchors.length === 0) return;
    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((record) => record.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    for (const id of anchors) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [key]);

  return active;
}

function AnchorLink({
  entry,
  active,
  nested = false,
}: {
  entry: TocEntry;
  active: boolean;
  nested?: boolean;
}) {
  return (
    <a
      href={`#${entry.id}`}
      aria-current={active ? "location" : undefined}
      className={cn(
        "type-nav -ml-px block border-l py-1 transition-colors duration-fast ease-standard",
        nested ? "pl-8" : "pl-4",
        active
          ? "border-action text-action-ink"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {entry.title}
    </a>
  );
}

/** The sticky right rail. Extra-wide only. */
export function TableOfContents({ spec }: { spec: ComponentDocSpec }) {
  const entries = tocFor(spec);
  const active = useActiveAnchor(anchorsFor(spec));

  if (entries.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      // Its own scroll container, bounded the same way the left rail is: a
      // component page's outline runs past twenty entries, and a rail that
      // reaches the bottom edge of the window has no way to show the rest.
      className="sticky top-(--height-site-header) hidden h-(--height-doc-rail) overflow-y-auto pt-10 scrollbar-thin xl:block"
    >
      <p className="type-badge mb-3 text-muted-foreground">On this page</p>
      <ul className="space-y-1 border-l border-border">
        {entries.map((entry) => (
          <li key={entry.id}>
            <AnchorLink entry={entry} active={entry.id === active} />
            {entry.children && (
              <ul className="space-y-1">
                {entry.children.map((child) => (
                  <li key={child.id}>
                    <AnchorLink entry={child} active={child.id === active} nested />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * The horizontal outline, for every width that cannot hold a second rail.
 *
 * Flat: the nested level is dropped here rather than indented, because a strip
 * has one line and no way to show depth. The entries it drops are reachable by
 * scrolling the section they belong to, which is what the reader is doing
 * anyway at this width.
 *
 * It scrolls inside itself. A component page with twenty-four sections is wider
 * than any phone, and the alternative to `overflow-x-auto` here is the whole
 * page scrolling sideways — the exact WCAG 1.4.10 failure the ledger's browser
 * pass asserts against.
 */
export function AnchorStrip({
  spec,
  persistent = false,
}: {
  spec: ComponentDocSpec;
  /** Stay visible on extra-wide screens too — for a `wide` page, which has no rail. */
  persistent?: boolean;
}) {
  const entries = tocFor(spec);
  const active = useActiveAnchor(anchorsFor(spec));

  if (entries.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className={cn(
        "-mx-6 mb-10 overflow-x-auto border-b border-border px-6 pb-3 scrollbar-thin",
        !persistent && "xl:hidden",
      )}
    >
      <ul className="flex w-max items-center gap-2">
        <li>
          <ExpandAllToggle />
        </li>
        {entries.map((entry) => {
          const current = entry.id === active;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "type-nav block rounded-pill border px-3 py-1.5 whitespace-nowrap transition-colors duration-fast ease-standard",
                  current
                    ? "border-action bg-action/12 text-foreground"
                    : "border-border text-muted-foreground hover:border-input hover:text-foreground",
                )}
              >
                {entry.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
