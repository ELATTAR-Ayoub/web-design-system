import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/icon"

import {
  DsPageHeader,
  DsSection,
  IndexCard,
  IndexGrid,
  Note,
} from "@/components/ds/kit";
import { categoryHref, DS_GROUPS } from "@/lib/ds/nav";

const foundations = DS_GROUPS.find((g) => g.id === "foundations")!;
const componentGroups = DS_GROUPS.filter((g) => g.id !== "foundations");

export default function DesignSystemHome() {
  return (
    <>
      <DsPageHeader
        eyebrow="Elattar's Design System"
        title="Design System"
        blurb="The operating manual. Two brand roles named for what they mean rather than what they look like, two complete themes, and every value measured out of the live stylesheet rather than claimed. Everything here is a live component, not a picture of one."
      />

      <DsSection
        id="foundations"
        title="Foundations"
        description="The decisions everything else inherits. Change something here and it propagates through every base component and the entire agent workspace."
      >
        <IndexGrid>
          {foundations.categories.map((c) => (
            <IndexCard
              key={c.slug}
              href={categoryHref(foundations, c)}
              title={c.title}
              blurb={c.blurb}
              contents={c.contents}
            />
          ))}
        </IndexGrid>
      </DsSection>

      <DsSection
        id="components"
        title="Components"
        description="Three families, deliberately separated. Base is the generic chassis any product could use. Agent is a complete AI console, written from scratch and pointed at a transport you supply. Site pages own no visual values of their own — only the composition rules that assemble the other two into a page."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {componentGroups.map((group) => (
            <Link
              key={group.id}
              href={group.href}
              className="press group flex flex-col rounded-xl border border-border bg-card p-7 hover:border-action/45"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="type-small text-action-ink">
                    {group.categories.length} sets
                  </p>
                  <h3 className="type-h3 mt-3 text-foreground">{group.title}</h3>
                </div>
                <Icon icon={ArrowRight}
                  className="mt-1 size-5 shrink-0 text-muted-foreground transition-[transform,color] duration-fast group-hover:translate-x-0.5 group-hover:text-action-ink"
                  aria-hidden
                />
              </div>
              <p className="type-small mt-3 grow text-muted-foreground">{group.blurb}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-border pt-5">
                {group.categories.map((c) => (
                  <li
                    key={c.slug}
                    className="type-small rounded-sm bg-muted px-2 py-1 text-muted-foreground"
                  >
                    {c.title}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </DsSection>

      <DsSection
        id="rules"
        title="The rules that outrank taste"
        description="Six non-negotiables. If a screen breaks one of these, the screen is wrong — not the rule."
      >
        <ol className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {[
            [
              "Two complete themes.",
              "Dark is the default, and light is equally supported. Roughly 70% of any screen is neutral surface from the five-step ladder, 20% blue, 10% lime.",
            ],
            [
              "Blue acts, lime values.",
              "Blue is interaction: primary buttons, selection, active nav, focus. Lime is worth: balances, rewards, rankings, premium actions. Never swap them.",
            ],
            [
              "Glow is rationed.",
              "Only selected packs, rare cards, primary CTAs, opening moments and reward moments may glow. Ordinary surfaces stay flat and readable.",
            ],
            [
              "Two faces only.",
              "Inter for words. Geist Mono, tabular, for figures, identifiers and code — through the nineteen named type roles.",
            ],
            [
              "Rarity is never color alone.",
              "Every rarity indicator carries its label and tier pips as well as its hue, so it survives grayscale and color blindness.",
            ],
            [
              "Nothing unskippable.",
              "The pack-opening sequence may be long, but skip and turbo are always reachable, and reduced-motion preferences are honoured.",
            ],
          ].map(([rule, detail], i) => (
            <li key={rule} className="flex gap-5 px-6 py-5">
              <span className="type-number-sm shrink-0 text-action-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="type-small text-muted-foreground">
                <strong className="text-foreground">{rule}</strong>{" "}
                {detail}
              </p>
            </li>
          ))}
        </ol>
      </DsSection>

      <Note tone="value" title="Scope of this phase">
        This is the design system and component library. The ten product screens
        are built on top of it and are tracked separately — nothing in here
        implements a real wallet, payment, blockchain or shipping integration.
        All figures, packs, cards and users are placeholder data.
      </Note>
    </>
  );
}
