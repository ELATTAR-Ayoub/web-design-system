import {
  DsPageHeader,
  DsSection,
  Meta,
  PageFootNav,
} from "@/components/ds/kit";
import { findCategory } from "@/lib/ds/nav";

const { group, category } = findCategory("docs", "introduction");

export default function IntroductionPage() {
  return (
    <>
      <DsPageHeader
        eyebrow={group.title}
        title={category.title}
        blurb={category.blurb}
        contents={category.contents}
      />

      <DsSection id="what-it-is" title="What it is">
        <p className="type-body text-muted-foreground">
          A token-driven design system for the web: React 19, Next.js, Tailwind
          v4 and Radix, shipped as a shadcn-compatible registry so a consumer
          installs exactly the files it needs with the standard shadcn CLI —
          no second CLI, no copy-paste. Colour, typography, spacing, radius and
          motion all come from tokens defined in four files under{" "}
          <code className="type-code">styles/</code>; nothing else in the
          system is allowed a literal.
        </p>
      </DsSection>

      <DsSection id="three-ideas" title="The three ideas">
        <Meta
          items={[
            {
              k: "Roles, not hues",
              v: "The two brand ramps are --color-action-* and --color-value-*, named for what they do rather than what colour they are. Rebranding is an edit to a handful of lines, not a sweep through every component.",
            },
            {
              k: "Ink, not ends",
              v: "A ramp's text-safe shade differs per theme. A component never picks an end of a ramp for text — it writes text-action-ink, and the theme block answers.",
            },
            {
              k: "Measured, not asserted",
              v: "Contrast, sizes and spacing shown in this documentation are read from the live stylesheet and computed at runtime, not typed by hand — so they cannot drift from the source that defines them.",
            },
          ]}
        />
      </DsSection>

      <DsSection id="where-things-live" title="Where things live">
        <Meta
          items={[
            { k: "styles/tokens.css", v: "Colour, spacing, radius, shadow tokens (Tailwind v4 @theme)." },
            { k: "styles/typeset.css", v: "The 17 public typography roles." },
            { k: "styles/motion.css", v: "Durations, easing and named animations." },
            { k: "styles/utilities.css", v: "Sanctioned utility classes built on the tokens above." },
            { k: "app/globals.css", v: "The entry point that imports the four files above, in order, and holds nothing else." },
            { k: "components/ui/*", v: "The base family: shadcn on Radix, restyled through tokens only." },
            { k: "components/agent/*", v: "A complete, product-agnostic AI console." },
            { k: "components/docs/*", v: "Private furniture for this documentation site — not a published registry family." },
          ]}
        />
      </DsSection>

      <PageFootNav groupId="docs" slug="introduction" />
    </>
  );
}
