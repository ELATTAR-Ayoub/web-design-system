import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";

import { Icon } from "@/components/ui/icon";
import { CodeBlock, type CopyFn } from "@/components/ds/code-block";

import { cn } from "@/lib/utils";
import { siblings, type DsGroup } from "@/lib/ds/nav";

/* ── Page header ──────────────────────────────────────────────────────────── */

export function DsPageHeader({
  eyebrow,
  title,
  blurb,
  contents,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
  contents?: string[];
}) {
  return (
    <header className="mb-14 border-b border-border pb-10">
      <p className="type-badge text-action-ink">{eyebrow}</p>
      <h1 className="type-h1 mt-4 text-foreground">{title}</h1>
      <p className="type-lead mt-4 max-w-2xl text-muted-foreground">{blurb}</p>
      {contents && contents.length > 0 && (
        <ul className="mt-7 flex flex-wrap gap-2">
          {contents.map((c) => (
            <li
              key={c}
              className="type-badge rounded-pill border border-border bg-card px-3 py-1.5 text-muted-foreground"
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

/* ── Section ──────────────────────────────────────────────────────────────── */

export function DsSection({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    /* No `scroll-mt-*`. `html` carries `scroll-padding-block-start:
       var(--scroll-offset)`, which is derived from the header height rather
       than guessing at it — this used to hand-set `scroll-mt-24` and happened
       to agree. */
    <section id={id} className={cn("mb-20", className)}>
      <div className="mb-6">
        <h2 className="type-h3 text-foreground">{title}</h2>
        {description && (
          <p className="type-small mt-2 max-w-2xl text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

/* ── Panel — the framed stage every specimen sits on ─────────────────────── */

export function Panel({
  label,
  note,
  children,
  className,
  bodyClassName,
  flush = false,
}: {
  label?: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Remove body padding, for specimens that should reach the panel edge. */
  flush?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      {(label || note) && (
        <div className="flex items-baseline justify-between gap-4 border-b border-border bg-muted px-5 py-3">
          {label && <span className="type-badge text-muted-foreground">{label}</span>}
          {note && (
            <span className="type-number-sm text-muted-foreground">{note}</span>
          )}
        </div>
      )}
      <div className={cn("bg-background", flush ? "" : "p-6", bodyClassName)}>
        {children}
      </div>
    </div>
  );
}

/** Horizontal cluster of specimens. */
export function Row({
  children,
  className,
  align = "center",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "center" | "start" | "end" | "baseline";
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-4",
        {
          center: "items-center",
          start: "items-start",
          end: "items-end",
          baseline: "items-baseline",
        }[align],
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── State matrices ───────────────────────────────────────────────────────── */

export function StateGrid({
  children,
  cols = 4,
  className,
}: {
  children: React.ReactNode;
  cols?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-px overflow-hidden rounded-lg border border-border bg-border",
        {
          2: "grid-cols-1 sm:grid-cols-2",
          3: "grid-cols-2 sm:grid-cols-3",
          4: "grid-cols-2 sm:grid-cols-4",
          5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
          6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
        }[cols],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StateCell({
  label,
  note,
  children,
  className,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-background p-5", className)}>
      <div className="mb-4 flex min-h-14 items-center justify-center">
        {children}
      </div>
      <p className="type-badge text-center text-muted-foreground">{label}</p>
      {note && (
        <p className="type-small mt-1.5 text-center text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}

/* ── Reference blocks ─────────────────────────────────────────────────────── */

/** Token / prop reference list. */
export function Meta({
  items,
  className,
}: {
  /**
   * `v` is a ReactNode rather than a string so a row can print a token's LIVE
   * value — `<TokenValue token="--width-page" />` — instead of a number typed
   * beside the token's name. The spacing page claimed 1320px for
   * `--width-page` for as long as that section existed, while the token said
   * 1200; a row that reads the stylesheet cannot make that mistake.
   */
  items: { k: string; v: React.ReactNode }[];
  className?: string;
}) {
  return (
    <dl
      // `@container/meta`, and the rows below split on `@sm` rather than `sm`.
      //
      // A VIEWPORT breakpoint here was wrong, and the sidebar page is where it
      // showed: that specimen puts a `Meta` inside a 20rem column, and because
      // the viewport was 1440 the `sm:` rule fired anyway — a 13rem label
      // column against a 320px container left 56px for the description, which
      // wrapped to one word per line. Nothing catches this: the classes are
      // tokens, the markup is right, and the page does not overflow. A
      // component that can be placed in a narrow column has to ask how wide IT
      // is, not how wide the window is.
      className={cn(
        "@container/meta divide-y divide-border overflow-hidden rounded-lg border border-border bg-card",
        className,
      )}
    >
      {items.map(({ k, v }) => (
        <div
          key={k}
          className="grid gap-1 px-4 py-3 @sm/meta:grid-cols-[minmax(0,13rem)_1fr] @sm/meta:gap-4"
        >
          <dt className="type-number-sm text-action-ink">{k}</dt>
          <dd className="type-small text-muted-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    /* `wrap-anywhere` is load-bearing at 375px, and it was missing.
       An inline code chip is usually a short identifier, but the chat
       specimen names a real path — a 41-character file path
       in mono with no break opportunity in it — which measured
       393px inside a 375px screen and pushed the document to 438px.
       It was invisible to the page-overflow test for a second reason worth
       recording: mobile Chrome GROWS `window.innerWidth` to fit an overflowing
       document, so `scrollWidth === innerWidth` stayed true at 438 and the
       assertion passed. `document.documentElement.clientWidth` is the layout
       viewport and does not move; the helper reads that now. */
    <code className="type-code rounded-sm border border-border bg-card px-1.5 py-0.5 wrap-anywhere text-muted-foreground">
      {children}
    </code>
  );
}

/** The rule pair. Every page that has a trap states it here. */
export function DoDont({
  dos,
  donts,
}: {
  dos: string[];
  donts: string[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-value/25 bg-value/[0.06] p-5">
        <p className="type-badge mb-3 text-value-ink">Do</p>
        <ul className="space-y-2.5">
          {dos.map((d) => (
            <li key={d} className="flex gap-2.5">
              <Icon icon={Check} size="sm" tone="value" className="mt-0.5" />
              <span className="type-small text-muted-foreground">{d}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-destructive/25 bg-destructive/[0.06] p-5">
        <p className="type-badge mb-3 text-destructive-ink">Don&rsquo;t</p>
        <ul className="space-y-2.5">
          {donts.map((d) => (
            <li key={d} className="flex gap-2.5">
              <Icon icon={X} size="sm" tone="error" className="mt-0.5" />
              <span className="type-small text-muted-foreground">{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Callout for a rule or trap worth interrupting the reader for. */
export function Note({
  tone = "action",
  title,
  children,
  className,
}: {
  tone?: "action" | "value" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    action: "border-action/30 bg-action/[0.08] text-action-ink",
    value: "border-value/30 bg-value/[0.08] text-value-ink",
    error: "border-destructive/30 bg-destructive/[0.08] text-destructive-ink",
  } as const;
  return (
    <div className={cn("rounded-lg border p-5", tones[tone], className)}>
      {title && <p className="type-badge mb-2 text-muted-foreground">{title}</p>}
      <div className="type-small text-muted-foreground">{children}</div>
    </div>
  );
}

/* ── Index cards, used by the three group index pages ─────────────────────── */

export function IndexGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
  );
}

export function IndexCard({
  href,
  title,
  blurb,
  contents,
}: {
  href: string;
  title: string;
  blurb: string;
  /**
   * Section chips under the blurb. Optional, and increasingly unused.
   *
   * A card listing a page's sections is a third copy of an outline the page
   * already derives and the rail already renders, and it is the copy nothing
   * checks — the `data` card advertised a "Chart" chip for months with no
   * section behind it. The family landings pass nothing.
   */
  contents?: string[];
}) {
  return (
    <Link
      href={href}
      className="press group flex flex-col rounded-xl border border-border bg-card p-5 hover:border-action/45"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="type-h4 text-foreground">{title}</h3>
        <Icon
          icon={ArrowRight}
          size="md"
          tone="muted"
          className="mt-0.5 transition-[transform,color] duration-fast group-hover:translate-x-0.5 group-hover:text-action-ink"
        />
      </div>
      <p className="type-small mt-2 grow text-muted-foreground">{blurb}</p>
      {/* Omitted entirely when there are none. An empty `<ul>` here still
          paints its top border and its padding, so a card with no chips grew a
          rule under its blurb with nothing beneath it. */}
      {contents && contents.length > 0 && (
      <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-4">
        {contents.map((c) => (
          <li
            key={c}
            className="type-small rounded-sm bg-muted px-2 py-1 text-muted-foreground"
          >
            {c}
          </li>
        ))}
      </ul>
      )}
    </Link>
  );
}

/* ── Prev / next ─────────────────────────────────────────────────────────── */

export function PageFootNav({
  groupId,
  slug,
}: {
  groupId: DsGroup["id"];
  slug: string;
}) {
  const { prev, next } = siblings(groupId, slug);
  if (!prev && !next) return null;
  return (
    <nav className="mt-8 flex items-stretch gap-4 border-t border-border pt-8">
      {prev ? (
        <Link
          href={prev.href}
          className="press flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-border bg-card px-5 py-4 hover:border-input"
        >
          <Icon icon={ArrowLeft} size="md" tone="muted" />
          <span className="min-w-0">
            <span className="type-small block text-muted-foreground">Previous</span>
            <span className="type-small mt-1 block truncate text-foreground">
              {prev.title}
            </span>
          </span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="press flex min-w-0 flex-1 items-center justify-end gap-3 rounded-lg border border-border bg-card px-5 py-4 text-right hover:border-input"
        >
          <span className="min-w-0">
            <span className="type-small block text-muted-foreground">Next</span>
            <span className="type-small mt-1 block truncate text-foreground">
              {next.title}
            </span>
          </span>
          <Icon icon={ArrowRight} size="md" tone="muted" />
        </Link>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
}

/* ── Command block — docs code furniture ──────────────────────────────────
 *
 * The install commands documentation shows have to be copyable with the same
 * two-signal feedback (RULES §5: every action needs two signals) that the
 * agent transcript's fenced code already carries. Rather than a second
 * clipboard implementation, this composes `CodeBlock` from
 * `components/ds/code-block.tsx` — the base owner of copyable code —
 * with an injectable `copy` seam so a specimen can force the failure path.
 */
export function CommandBlock({
  command,
  className,
  copy,
}: {
  command: string;
  className?: string;
  /** Overrides the clipboard write. Exposed so a specimen can force the failure path. */
  copy?: CopyFn;
}) {
  return (
    <CodeBlock
      code={command}
      language="bash"
      copy={copy}
      className={cn("rounded-lg border border-border", className)}
    />
  );
}
