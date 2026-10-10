import { DocsHeader } from "@/components/docs/chrome/docs-header";
import { DocsRail } from "@/components/docs/chrome/docs-rail";
import { SkipLink } from "@/components/docs/chrome/skip-link";
import { DsBreadcrumb } from "@/components/ds/ds-breadcrumb";

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
