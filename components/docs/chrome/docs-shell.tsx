"use client";

import { usePathname } from "next/navigation";

import { DocsHeader } from "@/components/docs/chrome/docs-header";
import { DocsRail } from "@/components/docs/chrome/docs-rail";
import { SkipLink } from "@/components/docs/chrome/skip-link";
import { DsBreadcrumb } from "@/components/ds/ds-breadcrumb";
import { DS_ROOT } from "@/lib/ds/nav";

// Pages that own the whole viewport. The docs chrome is not rendered under them,
// so nothing sits hidden but focusable behind the page.
const FULL_SCREEN = new Set([`${DS_ROOT}/components/agent-workspace/live`]);

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (FULL_SCREEN.has(pathname)) return <main id="main">{children}</main>;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* First focusable element: jumps to `#main`, which takes focus via tabIndex={-1}. */}
      <SkipLink targetId="main" />
      <DocsHeader />

      <div className="flex w-full flex-1 items-start">
        <DocsRail />
        <main
          id="main"
          tabIndex={-1}
          className="min-w-0 flex-1 px-4 py-10 wrap-break-word focus:outline-none sm:px-6 lg:px-12"
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
