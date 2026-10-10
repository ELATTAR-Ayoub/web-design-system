import * as React from "react";

import { cn } from "@/lib/utils";

const INTRO = {
  headline: 5,
  headlineStep: 0.5,
  description: 8,
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
  headline: string;
  accent?: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  showcase?: React.ReactNode;
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h1";
  const words = headline.split(" ");
  const spoken = accent ? `${headline} ${accent}` : headline;

  return (
    <section data-slot="landing-hero" className={className} {...props}>
      <div
        className={cn(
          "flex flex-col items-start justify-between gap-6",
          // gap-0 at lg is deliberate: justify-between already spaces the columns.
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
