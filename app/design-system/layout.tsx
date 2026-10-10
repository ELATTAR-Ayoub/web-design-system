import { DocsHeader } from "@/components/docs/chrome/docs-header";
import { DocsRail } from "@/components/docs/chrome/docs-rail";
import { SkipLink } from "@/components/docs/chrome/skip-link";
import { DsBreadcrumb } from "@/components/ds/ds-breadcrumb";

/**
 * The documentation shell. One composition, three shapes.
 *
 * * Below `lg`: the article alone, full width. The rail and every primary
 *   destination move into the header's sheet; the page outline becomes the
 *   horizontal `AnchorStrip` above the article.
 * * `lg` to `xl`: the left rail joins the article. The strip keeps standing in
 *   for the outline — there is no room yet for a second rail.
 * * `xl` and up: both rails flank the article, and the strip gives way to the
 *   sticky `ON THIS PAGE` rail on the right.
 *
 * The right rail belongs to `ComponentDocPage` rather than to this file,
 * because it is derived from the page's own section declarations and the layout
 * never sees them. The left rail is here because it is identical on every
 * route — that is the requirement, not an optimisation: a rail that regroups
 * itself as you move through a system makes a reader re-learn the navigation on
 * every click.
 *
 * **The shell is full-width and only the article is capped.** The rails sit
 * against the screen edges, so the reading measure is whatever the two rails
 * leave behind rather than a second cap fighting the first. The previous shell
 * capped the whole row at `--width-shell`, which on an ultrawide left the rail
 * floating in the middle of the screen with a gutter on its outside.
 */
export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* The shell has its own header and rail — the same "tab through all of
          it on every page" cost `SkipLink`'s own doc calls out. First focusable
          element in the document, jumping to `#main` below, which carries
          `tabIndex={-1}` so focus actually moves there. */}
      <SkipLink targetId="main" />
      <DocsHeader />

      <div className="flex w-full flex-1 items-start">
        <DocsRail />
        <main
          id="main"
          tabIndex={-1}
          className="min-w-0 flex-1 px-6 py-10 focus:outline-none lg:px-12"
        >
          <div className="mx-auto max-w-(--width-content)">
            <DsBreadcrumb />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
