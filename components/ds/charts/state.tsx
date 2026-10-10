"use client";

import { useState } from "react";
import { ChartLineIcon, TriangleAlertIcon } from "lucide-react";

import { Panel } from "@/components/ds/kit";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

import { PLOT } from "./data";
import { ChartSkeleton, type ChartSkeletonKind } from "./skeletons";

/**
 * One chart, its three states, and the control that moves between them.
 *
 * ```tsx
 * <ChartStates title="Stacked" note="chart-area-stacked" skeleton="area">
 *   <AreaStacked />
 * </ChartStates>
 * ```
 *
 * ### It renders its own `Panel` — do not wrap it in one
 *
 * Six family files build against this, so the choice has to be stated rather
 * than inferred. `ChartStates` **is** the specimen frame: it renders
 * `Panel` from `components/ds/kit.tsx` with `title` in the label slot and
 * `note` in the meta slot, and the chart, the buttons and the empty state all
 * live inside that one body. A family section is therefore a grid of
 * `ChartStates`, never a grid of `Panel`s containing them — nesting one inside
 * the other gives you two borders, two headers and 24px of padding twice.
 *
 * If a specimen needs a frame this does not offer, pass `className`; it lands
 * on the `Panel`.
 *
 * ### The buttons are a `ToggleGroup`, and that is a rule not a preference
 *
 * §4: a group with an active option owns **one pill that travels** to the new
 * selection — options never light up their own background. `ToggleGroup`
 * already implements that through `useActiveIndicator`, so three separate
 * `Button`s with `aria-pressed` would be the same control with the travel
 * thrown away. Three options is also the floor §4 sets for a segmented control;
 * with two it says use `IconSwap` instead.
 *
 * ### The swap is one event
 *
 * §5: `anim-enter` on the **arriving** content, and nothing on the leaving
 * content. Fading the skeleton out and then fading the chart in animates one
 * thing twice and reads as a glitch.
 *
 * What makes it replay is `key={state}` on the wrapper, and that is
 * load-bearing. `chart-demos.tsx` got away without a key because its three
 * branches rendered three different element types, so React could not reconcile
 * one into the next and unmounted the subtree — a freshly mounted element runs
 * its CSS animation from the start. Here all three branches sit inside **one**
 * `div` with one className, which React would happily reuse; a changed `key` is
 * what forces the unmount, and it is also what remounts the chart so recharts
 * replays its own entrance at the same moment.
 *
 * ### Empty offers a way forward
 *
 * §5's table: `Empty` is for "nothing is there yet", **and it always offers a
 * way forward**. The button loads the series and returns to `ready`, which is
 * the same journey a real retry would make.
 *
 * ### `controls` — the slot for a specimen's OWN control strip
 *
 * Four of the seventy variants (`chart-area-interactive`, `chart-bar-
 * interactive`, `chart-line-interactive`, `chart-pie-interactive`) ship a
 * control of their own — a range `Select`, a pair of clickable totals. That
 * control is the point of the variant, so it cannot be dropped; but rendered
 * inside `children` it exists only in `ready`, and the box then GROWS by the
 * strip's height the moment you leave `loading` or `empty`. Measured before
 * this prop existed: `AreaInteractive` 393.39 → **453.39**, `BarInteractive`
 * 393.39 → **487.78**. That is §5's "a layout jump is worse than the spinner
 * it avoided", and it is the one thing the three-state swap must never do.
 *
 * So the strip is hoisted OUT of the swapped slot and into the panel's
 * furniture, where it renders in all three states and the slot stays exactly
 * `PLOT` underneath it:
 *
 * ```tsx
 * <ChartStates
 *   title="Interactive"
 *   note="chart-area-interactive"
 *   skeleton="area"
 *   controls={AreaInteractiveControls}
 * >
 *   <AreaInteractive />
 * </ChartStates>
 * ```
 *
 * **It is a component TYPE that wraps the slot, not a `ReactNode`,** and that
 * is the whole design. A control strip owns state (`range`, `activeChart`)
 * which the chart underneath has to read. A `ReactNode` sibling could not
 * share it — the state would have to be lifted into the page, and seventy
 * specimens would stop being uniform one-liners. A wrapper sits ABOVE the
 * keyed slot, so it survives every swap with its state intact, and it hands
 * the value down through a context of its own:
 *
 * ```tsx
 * export function AreaInteractiveControls({ children }: { children: React.ReactNode }) {
 *   const [range, setRange] = useState<AreaInteractiveRange>("90d");
 *   return (
 *     <RangeContext.Provider value={range}>
 *       <div className="mb-5 …">…the Select…</div>
 *       {children}
 *     </RangeContext.Provider>
 *   );
 * }
 * ```
 *
 * Two obligations on anything passed here, and they are what keeps the
 * guarantee true for all seventy rather than for two:
 *
 * 1. **Render `children` exactly once, and render the strip unconditionally.**
 *    A strip that appears only in `ready` reintroduces the jump this prop
 *    exists to remove.
 * 2. **The strip's height must not depend on the state.** It never sees the
 *    state, which is the structural way of guaranteeing that rather than the
 *    numeric way — nothing here reserves a measured height, so nothing can
 *    drift out of sync with it.
 *
 * The chart's own context must carry a sensible default, so the plot still
 * renders if it is ever mounted without its strip.
 */

export type ChartState = "empty" | "error" | "loading" | "ready";

const STATES: { value: ChartState; label: string }[] = [
  { value: "empty", label: "Empty" },
  { value: "loading", label: "Loading" },
  { value: "error", label: "Error" },
  { value: "ready", label: "Ready" },
];

export function ChartStates({
  title,
  note,
  skeleton,
  controls: Controls,
  children,
  className,
}: {
  /** The variant's name. Renders in the panel's label slot. */
  title: string;
  /** Optional second line — the registry name reads well here. */
  note?: string;
  /** Which family's shape the loading placeholder draws. */
  skeleton: ChartSkeletonKind;
  /**
   * The specimen's own control strip, as a wrapper around the state slot.
   *
   * A component type, not a node: it owns the state the chart below reads, so
   * it has to sit ABOVE the keyed slot to survive the swap. It must render its
   * strip unconditionally and `children` exactly once — see the header.
   */
  controls?: React.ComponentType<{ children: React.ReactNode }>;
  /** The chart itself. It carries `PLOT` on its own `ChartContainer`. */
  children: React.ReactNode;
  /** Lands on the `Panel`. */
  className?: string;
}) {
  /**
   * A `useState` here is not the pattern `react-hooks/set-state-in-effect`
   * rejects. That rule is about state written from an effect to mirror
   * something outside React — a mount flag, a media query — which is what
   * `useSyncExternalStore` is for, and what `chart-motion.ts` and
   * `use-mobile.ts` do. This value has no source outside the component: the
   * user pressed a button.
   */
  const [state, setState] = useState<ChartState>("ready");

  /**
   * `key={state}` still lives on this element and is still load-bearing (see
   * the header). It stays on the slot rather than moving up to `Controls`,
   * because remounting the strip on every swap would throw the very state the
   * strip exists to hold.
   */
  const slot = (
    /* `data-slot`, so the audit's e2e can address the swapped box directly and
       measure that choosing a state never moves it. Without an address the
       only handle was "the first div after the toggle group", which is a
       structural guess that breaks the first time the frame changes. */
    <div key={state} data-slot="chart-state-slot" className="anim-enter">
      {state === "loading" ? (
        <ChartSkeleton kind={skeleton} />
      ) : state === "error" ? (
        /*
         * The failure state, and it is a REAL one rather than a drawn replica.
         *
         * `state-inventory.md` asks for an injectable seam: the specimen must
         * reach the failure the same way production does, not paint a picture
         * of it. `ChartStates` owns the state machine every chart on this page
         * runs on, so putting the seam HERE means all seventy variants gain a
         * truthful error state at once — and the retry really returns to
         * `ready`, which is the journey a real refetch makes.
         *
         * `Alert` rather than `Empty`: §5 reserves `Empty` for "nothing is
         * there yet", and a series that failed to load is not the same claim as
         * a series with no rows in it. The two sit side by side in the toggle
         * so the difference is visible rather than argued.
         *
         * The footprint is `PLOT`, like every other branch, so choosing a state
         * never moves the box.
         */
        <div className={cn(PLOT, "grid place-items-center")}>
          <Alert variant="destructive" className="max-w-100">
            <Icon icon={TriangleAlertIcon} tone="inherit" />
            <AlertTitle>This series did not load</AlertTitle>
            <AlertDescription>
              {/* The retry is its own block. Read as a direct child of
                  AlertDescription it flows INLINE after the full stop — caught
                  by opening the screenshot, not by any assertion: the words
                  read "...no partial reading is shown. [Try again]" on one
                  line, which makes the button look like part of the sentence. */}
              <p>
                The request for this range failed. Nothing was drawn, and no
                partial reading is shown.
              </p>
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setState("ready")}
                >
                  Try again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      ) : state === "empty" ? (
        <Empty className={cn(PLOT, "border border-dashed")}>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icon icon={ChartLineIcon} size="md" tone="inherit" />
            </EmptyMedia>
            <EmptyTitle>No data in this range</EmptyTitle>
            <EmptyDescription>
              Nothing came back for the period selected. Load the sample series
              to see the shape this chart draws.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm" onClick={() => setState("ready")}>
              Load sample data
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        children
      )}
    </div>
  );

  return (
    <Panel label={title} note={note} className={className}>
      <ToggleGroup
        type="single"
        size="sm"
        value={state}
        onValueChange={(next) => {
          // Radix clears the value when the active item is pressed again. A
          // chart has to be in one of the three, so an empty string is ignored.
          if (next) setState(next as ChartState);
        }}
        aria-label={`${title} — chart state`}
      >
        {STATES.map((s) => (
          <ToggleGroupItem key={s.value} value={s.value}>
            {s.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* The 20px below the toggle group belongs to the panel, not to the
          slot, so a control strip lands in it and the slot keeps its own
          footprint clean. Without `controls` this is the identical box the
          slot used to carry `mt-5` for. */}
      <div className="mt-5">{Controls ? <Controls>{slot}</Controls> : slot}</div>
    </Panel>
  );
}
