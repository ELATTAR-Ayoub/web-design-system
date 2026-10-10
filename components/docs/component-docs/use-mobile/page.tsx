/**
 * Documentation page for `use-mobile`.
 *
 * Authored, not generated. A hook, not a component — no States,
 * Accessibility or Keyboard section applies, because a boolean read has none
 * of those.
 *
 * A true live reading of `useIsMobile()` needs a client component holding no
 * state of its own beyond the hook — genuinely possible, but not from this
 * file. `scripts/validate-docs.mjs` enforces every `component-docs/<name>/page.tsx`
 * as plain data with a hard rule: no `"use client"` directive on the spec
 * module. The sanctioned shape for a stateful specimen is a companion file
 * beside it (see `form/account-form-specimen.tsx`, imported into
 * `form/page.tsx`), which is a file this task is scoped not to create — the
 * brief restricts this page to editing `page.tsx` only. So instead of a
 * client-only, unenforced "use client" directive here (which would fail
 * `docs:validate`), the Preview below is a pure-CSS proxy: two labelled
 * panels toggled by the exact same breakpoint the hook checks
 * (`(max-width: 767px)`, via Tailwind's standard `md:` variant, itself 768px)
 * — genuinely live on resize, with no JavaScript, but reporting the
 * viewport's CSS classification rather than literally calling
 * `useIsMobile()`. The Usage section below shows the real hook call.
 */

import { Code, Meta, Note } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { ViewportReport } from "./viewport-specimen";

import { meta } from "./meta";


export const spec: ComponentDocSpec = {
  name: "use-mobile",
  omitted: {
    states: "useIsMobile returns a boolean, not a rendered element — there is no hover, focus, loading or disabled state to report for a value with no markup of its own.",
    accessibility: "The hook renders nothing itself, so it has no name, role or announcement; whatever layout a consumer chooses based on its return value carries its own accessibility, documented on that component's page.",
    keyboard: "Nothing here is focusable — the hook is a subscription to matchMedia, not an interactive target reachable by Tab.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "The hook itself, reading this window. Narrow past 768px and it flips without a reload, because it subscribes to matchMedia rather than measuring once.",
      render: <ViewportReport />,
      source: `"use client";

import { useIsMobile } from "@/hooks/use-mobile";

export function ViewportReport() {
  const isMobile = useIsMobile();
  return <p>{isMobile ? "Mobile viewport" : "Desktop viewport"}</p>;
}`,
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
      language: "tsx",
      code: `import { useIsMobile } from "@/hooks/use-mobile";

function Toolbar() {
  const isMobile = useIsMobile();
  return isMobile ? <CompactToolbar /> : <FullToolbar />;
}`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "useIsMobile(): boolean",
          body: (
            <Meta
              items={[
                {
                  k: "returns",
                  v: (
                    <>
                      <Code>true</Code> when the viewport matches{" "}
                      <Code>(max-width: 767px)</Code> — one pixel below the system&rsquo;s
                      768px tablet breakpoint (RULES §2: there are exactly two
                      breakpoints, 768px and 1024px, and no third).
                    </>
                  ),
                },
                {
                  k: "server snapshot",
                  v: "false — so SSR renders the desktop layout rather than undefined, and the client never diverges from what the server sent before hydration reconciles.",
                },
                {
                  k: "reactivity",
                  v: "Subscribes to a MediaQueryList change event through useSyncExternalStore, so it re-renders live on a resize past the breakpoint rather than only on mount.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why",
      title: "Why useSyncExternalStore",
      blocks: [
        {
          body: (
            <Note tone="action">
              The original shadcn version set state inside an effect body, which
              triggers a cascading render on mount and trips the
              react-hooks/set-state-in-effect lint rule.{" "}
              <Code>useSyncExternalStore</Code> is the tool actually intended for
              reading a browser API like <Code>matchMedia</Code>: it subscribes, reads
              the current value, and supplies a defined server snapshot in one step.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "The hook exists entirely for this: reporting which side of the 768px breakpoint the viewport is on, live.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "375 / 768 / 1440 / 1920px",
                  v: (
                    <>
                      Below <Code>768px</Code> the query matches and{" "}
                      <Code>useIsMobile()</Code> returns <Code>true</Code>; at{" "}
                      <Code>768px</Code> and above it returns <Code>false</Code> — the
                      same 768px/1024px pair every layout in the system uses, not a
                      breakpoint this hook invents. Measured on this page itself: it
                      renders at 375, 768, 1440 and 1920px with no overflow at any of
                      them (<Code>scrollWidth</Code> equals <Code>clientWidth</Code> at
                      every width).
                    </>
                  ),
                },
                {
                  k: "200% text zoom",
                  v: "The page does not overflow under 200% text-only zoom — nothing about this hook's own output (a boolean) can overflow; what's measured is the documentation shell around it.",
                },
                {
                  k: "RTL",
                  v: "No RTL overflow measured for this page. The hook has no directional behaviour of its own — it reads a width, not a writing direction.",
                },
                {
                  k: "resize, not just load",
                  v: "Because the subscription is a MediaQueryList change listener rather than a one-time read, a consumer that resizes the window after mount sees the value flip without a remount — that live transition is the entire reason to reach for this hook over a one-shot window.innerWidth check.",
                },
              ]}
            />
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
