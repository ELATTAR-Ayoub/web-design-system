/**
 * The Preview/Code control, and the one stage both views share.
 *
 * Every live specimen in the documentation renders through this. Flutter's
 * documentation shell puts a two-option toggle above a single stage and swaps
 * what is inside it; the web used to stack a `Panel` and then a `CodeBlock`
 * under it, so a component page was twice as long as it needed to be and the
 * reader scrolled past the source of specimen one to reach specimen two.
 *
 * **One stage, two views — not two stacked boxes.** The code replaces the
 * preview in the same bordered frame, at the same width, so switching does not
 * move the page under the reader's cursor.
 *
 * **Each showcase owns its own selection.** The state lives here, in the
 * instance, and nothing lifts it. A page with nine specimens has nine
 * independent toggles; flipping one to Code must not flip the other eight,
 * because a reader comparing a variant against its source is looking at one of
 * them. A shared context would be fewer lines and the wrong behaviour.
 *
 * **`ToggleGroup type="single"` with no empty state.** `ToggleGroup` allows
 * deselection by default, which would leave the stage showing neither view.
 * The change handler ignores an empty value rather than the component allowing
 * it — the deselect gesture becomes a no-op, and the control can never reach a
 * state with nothing selected.
 *
 * **The accessible name is per-showcase.** Nine controls all called "View"
 * makes a screen-reader's rotor useless; each one names its own specimen.
 *
 * **Code is capped and scrolls.** A page is a reference, not a source dump: an
 * eighty-line specimen would otherwise push every following section below the
 * fold. The cap is a token-backed max-height on the scroll container, so the
 * stage keeps its shape whichever view is selected.
 *
 * State model:
 * rest · hover · focus-visible — `ToggleGroup`'s own, untouched. pressed — the
 * toggle carries `press` through `ToggleGroupItem`. loading · success ·
 * error — N/A, the swap is synchronous and local. disabled — N/A: both views
 * always exist, and a showcase with no source renders the stage alone rather
 * than a dead toggle. empty — prevented by construction, see above.
 */

"use client";

import { useId, useState } from "react";

import { CodeBlock } from "@/components/ds/code-block";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type View = "preview" | "code";

export function PreviewCode({
  /** Names this specimen in the toggle's accessible name. */
  label,
  /** Shown in the stage header, e.g. the class an effect is applied as. */
  note,
  children,
  source,
  language = "tsx",
  /** Remove stage padding, for specimens that should reach the frame edge. */
  flush = false,
  className,
  stageClassName,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
  source?: string;
  language?: string;
  flush?: boolean;
  className?: string;
  stageClassName?: string;
}) {
  const [view, setView] = useState<View>("preview");
  const headingId = useId();

  // No source means no choice to offer. A toggle with one reachable option is
  // a control that lies about what it does.
  const hasCode = Boolean(source);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted px-5 py-3">
        <span id={headingId} className="type-badge text-muted-foreground">
          {label}
        </span>

        <div className="flex items-center gap-4">
          {note && <span className="type-number-sm text-muted-foreground">{note}</span>}
          {hasCode && (
            <ToggleGroup
              data-slot="preview-code-toggle"
              type="single"
              size="sm"
              value={view}
              // An empty `next` is the deselect gesture. Ignoring it is what
              // makes this single-selection with no empty state, rather than
              // a toggle that can leave the stage blank.
              onValueChange={(next) => {
                if (next === "preview" || next === "code") setView(next);
              }}
              aria-label={`${label} — preview or code`}
            >
              <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
              <ToggleGroupItem value="code">Code</ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>
      </div>

      {/* One stage. `hidden` rather than a conditional render, so a specimen
          that holds state — an open disclosure, a typed value, a running
          animation — is not torn down and rebuilt every time the reader looks
          at the source and comes back. `[hidden]` is display:none, so nothing
          inside is focusable while it is the unselected view. */}
      <div
        // Named so the browser pass can find every live specimen and measure
        // the first one. `e2e/ledger-evidence.spec.ts` counts these against the
        // toggles beside them: a stage with no toggle is a specimen whose code
        // is missing, which is a documentation gap a green build cannot see.
        data-slot="preview-stage"
        hidden={view !== "preview"}
        className={cn("bg-background", flush ? "" : "p-6", stageClassName)}
      >
        {children}
      </div>

      {hasCode && (
        <div hidden={view !== "code"} className="bg-background">
          <CodeBlock
            code={source!}
            language={language}
            className="max-h-(--height-doc-code) overflow-auto rounded-none border-0 scrollbar-thin"
          />
        </div>
      )}
    </div>
  );
}
