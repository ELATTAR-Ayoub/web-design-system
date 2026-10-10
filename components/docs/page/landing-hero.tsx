import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The top of a landing page. The marketing hero `PageHero` deliberately is not.
 *
 * `PageHero` opens an FAQ, a policy, a help article — furniture the reader
 * should recognise as the same on every page, which is why it is barred from
 * `.type-display` by construction. This one is the opposite job: it is the
 * screen that gets the display class, the brand's one chromatic moment, and the
 * staged entrance. Two components rather than a `variant` prop, because the
 * rules they follow are not the same rules.
 *
 * **The two columns are bottom-aligned, not top-aligned.** At `lg` the headline
 * sits left and the description plus actions sit right, and they meet at
 * `items-end` — so the last line of the headline and the bottom of the button
 * row share an edge. Top-aligning them instead leaves the right column floating
 * beside a headline of unpredictable height, which is the arrangement that
 * makes a hero look assembled by accident. It costs nothing and it is the
 * single most load-bearing line in the file.
 *
 * **The headline is split per word so it can stagger, and that has an
 * accessibility cost this pays rather than accepts.** A heading made of eleven
 * `<span>`s is announced as eleven fragments by some screen readers. So the
 * split copy is `aria-hidden` and a visually hidden copy carries the real
 * string — the same contract `SplitText` and `BlurText` already use here, and
 * the reason `accent` is a separate prop rather than markup the caller passes:
 * a `ReactNode` cannot be reassembled into the flat string that copy needs.
 *
 * **Stages, not milliseconds.** Every element's entrance offset is a count of
 * `--duration-tick`s handed to `anim-intro-rise`. The ladder is written once,
 * below, so the sequence can be read in one place instead of inferred from four
 * scattered delays.
 *
 * **No `will-change` on the text, deliberately.** It was on every word span
 * first, copied from the reference this layout was modelled on. `will-change`
 * is a promise the browser keeps until you take it back, so a hero headline
 * ends up holding a compositing layer per word for the entire life of the page
 * — measured here as 23 permanent layers for an animation that is over in 1.6
 * seconds. Dropping it costs at most one frame of hitch on elements this small,
 * and the blur already promotes them for the duration. `HeroShowcase` keeps the
 * hint on its two large layers, where a hitch would actually be visible.
 *
 * State model: presentational, runs once on mount.
 * rest — the settled hero, which is also exactly what a reader with motion
 * reduced sees, because `globals.css` drops the animation and the delay
 * together rather than only shortening the duration. hover · focus-visible ·
 * pressed — N/A here; `actions` holds real controls carrying their own.
 * loading · success · error · disabled — N/A, nothing here is asynchronous.
 * empty — N/A, `headline` is required; `description`, `actions` and `showcase`
 * are each optional and simply do not render.
 */

/**
 * The entrance ladder, in ticks (`--duration-tick`, 80ms).
 *
 * Half-tick steps on the words: at a full tick a long headline is still
 * assembling after the buttons have arrived, which inverts the reading order
 * the sequence exists to create.
 */
const INTRO = {
  /** First word of the headline. */
  headline: 5,
  /** Added per word after the first. */
  headlineStep: 0.5,
  /** Description — lands as the headline's last words settle. */
  description: 8,
  /** Actions and the showcase arrive together, last. */
  actions: 10,
} as const;

function LandingHero({
  headline,
  accent,
  description,
  actions,
  showcase,
  headingLevel = 1,
  className,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & {
  /** The headline, as a plain string — it is split per word to stagger. */
  headline: string;
  /**
   * A single closing word set in the other foundation face. Optional, and
   * genuinely so: the substitution is a once-per-site move, not a default.
   */
  accent?: string;
  description?: React.ReactNode;
  /** Buttons. Two at most — a hero with three has no primary action. */
  actions?: React.ReactNode;
  /** What the product looks like. Pass a `HeroShowcase`. */
  showcase?: React.ReactNode;
  /**
   * Semantic tag only — `1` renders `<h1>`, `2` renders `<h2>`. Default `1`,
   * correct for every real landing route. Exists so a documentation page
   * showing more than one `LandingHero` on the same route can keep one true
   * `<h1>`; the display size never moves with it.
   */
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h1";
  const words = headline.split(" ");
  // The full sentence for assistive tech, including the accent word, which is
  // part of the heading and not decoration.
  const spoken = accent ? `${headline} ${accent}` : headline;

  return (
    <section data-slot="landing-hero" className={className} {...props}>
      <div
        className={cn(
          "flex flex-col items-start justify-between gap-6",
          // `gap-0` at lg is not a mistake and not a leftover. `justify-between`
          // already pushes the columns to the gutters, and both carry a
          // max-width, so a gap only ever applies in the one case where they
          // would otherwise touch — at which point a gap silently shrinks the
          // headline instead of letting it wrap, which is worse.
          "lg:flex-row lg:items-end lg:gap-0",
        )}
      >
        <Heading className="type-display text-foreground max-w-sm text-balance md:max-w-md lg:max-w-xl">
          <span className="sr-only">{spoken}</span>
          <span aria-hidden>
            {words.map((word, i) => (
              <span
                key={i}
                className="anim-intro-rise inline-block whitespace-pre"
                style={
                  {
                    "--intro-stage": INTRO.headline + i * INTRO.headlineStep,
                  } as React.CSSProperties
                }
              >
                {word}
                {i < words.length - 1 || accent ? " " : ""}
              </span>
            ))}
            {accent && (
              <span
                className="type-display anim-intro-rise inline-block whitespace-pre"
                style={
                  {
                    "--intro-stage":
                      INTRO.headline + words.length * INTRO.headlineStep,
                  } as React.CSSProperties
                }
              >
                {accent}
              </span>
            )}
          </span>
        </Heading>

        {(description || actions) && (
          <div className="flex flex-col items-start gap-4 lg:items-end">
            {description && (
              <p
                className="type-lead anim-intro-rise max-w-lg text-balance lg:text-right text-muted-foreground"
                style={
                  { "--intro-stage": INTRO.description } as React.CSSProperties
                }
              >
                {description}
              </p>
            )}
            {actions && (
              <div
                className="anim-intro-rise flex flex-wrap items-center gap-3"
                style={
                  { "--intro-stage": INTRO.actions } as React.CSSProperties
                }
              >
                {actions}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wider apart on a phone than on a desktop, which looks inverted written
          down and is right on screen: stacked, the showcase is the next thing
          you scroll to and needs to read as a new subject; side by side, the
          hero row is already wide and a tall gap under it leaves the panel
          stranded. 64 → 48. */}
      {showcase && <div className="mt-16 lg:mt-12">{showcase}</div>}
    </section>
  );
}

export { LandingHero, INTRO as LANDING_INTRO_STAGES };
